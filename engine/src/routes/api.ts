import { Hono } from 'hono';
import { ulid } from 'ulid';
import { existsSync, readFileSync, readdirSync, writeFileSync, unlinkSync } from 'fs';
import { resolve, basename, extname } from 'path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { execute } from './execute';
import { stream } from './stream';
import { registry } from './registry';
import { projects } from './projects';
import { getDb } from '../lib/db';
import { aiosCorePath, getProjectPaths, squadsPath } from '../lib/config';
import { getAvailableWorkflows, startWorkflow, getWorkflowState, listWorkflows } from '../core/workflow-engine';
import * as queue from '../core/job-queue';
import { log } from '../lib/logger';
import type { WorkflowStatus } from '../types';

// ============================================================
// /api/* — Dashboard-facing adapter
// Re-exposes engine routes under the `/api` prefix the frontend expects,
// and adds analytics, tasks orchestration, and workflow CRUD.
// ============================================================

const api = new Hono();

// ── /api/health ────────────────────────────────────────────
api.get('/health', (c) => c.json({ ok: true, service: 'o2-aios-engine' }));

// ── /api/execute/* overrides (shape adapter) ───────────────
// Override endpoints the dashboard expects in a specific shape
// before mounting the raw engine /execute router below.

api.get('/execute/llm/health', (c) => {
  return c.json({
    claude: { available: true },
    openai: { available: false, error: 'OpenAI not configured (claude-cli only)' },
  });
});

api.get('/execute/llm/usage', (c) => {
  const db = getDb();
  const row = db.query<{ total: number; duration: number }, []>(`
    SELECT COUNT(*) as total,
      AVG(CASE WHEN started_at IS NOT NULL AND completed_at IS NOT NULL
        THEN (julianday(completed_at)-julianday(started_at))*86400000 ELSE NULL END) as duration
    FROM jobs
  `).get() || { total: 0, duration: 0 };

  return c.json({
    claude: { input: 0, output: 0, requests: row.total ?? 0 },
    openai: { input: 0, output: 0, requests: 0 },
    total: { input: 0, output: 0, requests: row.total ?? 0 },
  });
});

api.get('/execute/llm/models', (c) => {
  return c.json({
    claude: ['claude-opus-4-7', 'claude-sonnet-4-6', 'claude-haiku-4-5'],
    openai: [],
    default: {
      fast: 'claude-haiku-4-5',
      default: 'claude-sonnet-4-6',
      powerful: 'claude-opus-4-7',
    },
  });
});

api.get('/execute/stats', (c) => {
  const db = getDb();
  const since = c.req.query('since') || new Date(Date.now() - 7 * 86400_000).toISOString();

  const total = (db.query<{ c: number }, [string]>(
    `SELECT COUNT(*) as c FROM jobs WHERE created_at >= ?`
  ).get(since) || { c: 0 }).c;

  const byStatusRows = db.query<{ status: string; c: number }, [string]>(
    `SELECT status, COUNT(*) as c FROM jobs WHERE created_at >= ? GROUP BY status`
  ).all(since) as Array<{ status: string; c: number }>;
  const byStatus: Record<string, number> = {};
  for (const r of byStatusRows) {
    const mapped = r.status === 'done' ? 'completed'
      : r.status === 'failed' || r.status === 'timeout' ? 'failed'
      : r.status;
    byStatus[mapped] = (byStatus[mapped] || 0) + r.c;
  }

  const bySquadRows = db.query<{ squad_id: string; c: number }, [string]>(
    `SELECT squad_id, COUNT(*) as c FROM jobs WHERE created_at >= ? GROUP BY squad_id`
  ).all(since) as Array<{ squad_id: string; c: number }>;
  const bySquad: Record<string, number> = {};
  for (const r of bySquadRows) bySquad[r.squad_id] = r.c;

  const byAgentRows = db.query<{ agent_id: string; c: number }, [string]>(
    `SELECT agent_id, COUNT(*) as c FROM jobs WHERE created_at >= ? GROUP BY agent_id`
  ).all(since) as Array<{ agent_id: string; c: number }>;
  const byAgent: Record<string, number> = {};
  for (const r of byAgentRows) byAgent[r.agent_id] = r.c;

  return c.json({ total, byStatus, bySquad, byAgent });
});

api.get('/execute/history', (c) => {
  const limit = Number(c.req.query('limit') || '20');
  const status = c.req.query('status');
  const agentId = c.req.query('agentId');
  const squadId = c.req.query('squadId');
  const db = getDb();

  const where: string[] = [];
  const params: Array<string | number> = [];
  if (status) {
    const mapped = status === 'completed' ? 'done' : status;
    where.push('status = ?'); params.push(mapped);
  }
  if (agentId) { where.push('agent_id = ?'); params.push(agentId); }
  if (squadId) { where.push('squad_id = ?'); params.push(squadId); }

  const sql = `SELECT id, squad_id, agent_id, status, started_at, created_at, completed_at
    FROM jobs ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY created_at DESC LIMIT ?`;
  params.push(limit);

  const rows = db.query(sql).all(...params) as Array<{
    id: string; squad_id: string; agent_id: string; status: string;
    started_at: string | null; created_at: string; completed_at: string | null;
  }>;

  const executions = rows.map((r) => {
    const duration = r.started_at && r.completed_at
      ? new Date(r.completed_at).getTime() - new Date(r.started_at).getTime()
      : undefined;
    return {
      id: r.id,
      squadId: r.squad_id,
      agentId: r.agent_id,
      status: r.status === 'done' ? 'completed'
        : r.status === 'failed' || r.status === 'timeout' ? 'failed'
        : r.status,
      createdAt: r.created_at,
      completedAt: r.completed_at ?? undefined,
      duration,
    };
  });

  return c.json({ executions, total: executions.length });
});

api.get('/execute/db/health', (c) => {
  try { getDb().query('SELECT 1').get(); return c.json({ connected: true }); }
  catch (e) { return c.json({ connected: false, error: e instanceof Error ? e.message : String(e) }); }
});

// ── Mount existing engine routers ──────────────────────────
api.route('/execute', execute);
api.route('/registry', registry);
api.route('/projects', projects);

// Alias /api/execute/agent/stream → /stream/agent
api.route('/execute/agent/stream', new Hono().post('/', (c) => stream.fetch(
  new Request(new URL('/agent', c.req.url), { method: 'POST', body: c.req.raw.body, headers: c.req.raw.headers })
)));

// ── /api/agents ────────────────────────────────────────────
api.get('/agents', async (c) => {
  const squad = c.req.query('squad');
  const limit = c.req.query('limit');
  const url = new URL('/agents' + (squad ? `?squad=${squad}` : ''), 'http://internal');
  const res = await registry.fetch(new Request(url.toString()));
  const data = await res.json() as { agents: Array<Record<string, unknown>> };
  let agents = (data.agents || []).map((a) => ({
    id: a.id,
    name: a.name,
    squad: a.squadId,
    tier: 2,
    title: a.role,
    description: a.description,
  }));
  if (limit) agents = agents.slice(0, Number(limit));
  return c.json({ agents, total: agents.length });
});

api.get('/agents/search', async (c) => {
  const q = (c.req.query('q') || '').toLowerCase();
  const limit = Number(c.req.query('limit') || '50');
  const res = await registry.fetch(new Request('http://internal/agents'));
  const data = await res.json() as { agents: Array<Record<string, unknown>> };
  const results = (data.agents || [])
    .map((a) => ({
      id: a.id,
      name: a.name,
      squad: a.squadId,
      tier: 2,
      title: a.role,
      description: a.description,
    }))
    .filter((a) =>
      String(a.name).toLowerCase().includes(q) ||
      String(a.squad).toLowerCase().includes(q) ||
      String(a.description || '').toLowerCase().includes(q)
    )
    .slice(0, limit);
  return c.json({ results, query: q, total: results.length });
});

api.get('/agents/squad/:squadId', async (c) => {
  const squadId = c.req.param('squadId');
  const res = await registry.fetch(new Request(`http://internal/agents?squad=${squadId}`));
  const data = await res.json() as { agents: Array<Record<string, unknown>> };
  const agents = (data.agents || []).map((a) => ({
    id: a.id,
    name: a.name,
    squad: a.squadId,
    tier: 2,
    title: a.role,
    description: a.description,
  }));
  return c.json({ squad: squadId, agents, total: agents.length });
});

api.get('/agents/:squadId/:agentId', async (c) => {
  const { squadId, agentId } = c.req.param();
  const res = await registry.fetch(new Request(`http://internal/agents/${squadId}/${agentId}`));
  if (!res.ok) return c.json({ error: 'Agent not found' }, 404);
  const data = await res.json() as Record<string, unknown>;
  return c.json({
    agent: {
      id: data.id,
      name: data.name,
      squad: data.squadId,
      tier: 2,
      title: data.role,
      description: data.description,
      content: data.content,
    },
  });
});

api.get('/agents/:squadId/:agentId/commands', async (c) => {
  const { squadId, agentId } = c.req.param();
  const res = await registry.fetch(new Request(`http://internal/agents/${squadId}/${agentId}`));
  if (!res.ok) return c.json({ agentId, commands: [] });
  const data = await res.json() as { content?: string };
  const commands: Array<{ name: string; description?: string }> = [];
  const content = data.content || '';
  const lines = content.split('\n');
  for (const line of lines) {
    const m = line.match(/^\s*-\s*\*?\*?\/([\w-]+)\*?\*?\s*[:\-—]?\s*(.*)$/);
    if (m) commands.push({ name: m[1], description: m[2]?.trim() || undefined });
  }
  return c.json({ agentId, commands });
});

// ── /api/squads ────────────────────────────────────────────
api.get('/squads', async (c) => {
  const res = await registry.fetch(new Request('http://internal/squads'));
  const data = await res.json() as { squads: Array<Record<string, unknown>> };
  return c.json({ squads: data.squads || [], total: (data.squads || []).length });
});

api.get('/squads/:squadId', async (c) => {
  const squadId = c.req.param('squadId');
  const res = await registry.fetch(new Request('http://internal/squads'));
  const data = await res.json() as { squads: Array<Record<string, unknown>> };
  const squad = (data.squads || []).find((s) => s.id === squadId);
  if (!squad) return c.json({ error: 'Squad not found' }, 404);
  return c.json({ squad });
});

// ── /api/workflows ─────────────────────────────────────────
api.get('/workflows', (c) => {
  const workflows = getAvailableWorkflows();
  return c.json({ workflows, total: workflows.length });
});

api.get('/workflows/available', (c) => {
  return c.json({ workflows: getAvailableWorkflows() });
});

api.get('/workflows/active', (c) => {
  const running = listWorkflows('running' as WorkflowStatus, 100);
  const paused = listWorkflows('paused' as WorkflowStatus, 100);
  return c.json({
    workflows: [...running, ...paused].map((w) => ({
      id: w.id,
      workflowId: w.workflow_id,
      definitionId: w.definition_id,
      currentPhase: w.current_phase,
      status: w.status,
      iterationCount: w.iteration_count,
      createdAt: w.created_at,
      updatedAt: w.updated_at,
    })),
  });
});

api.get('/workflows/:id', (c) => {
  const id = c.req.param('id');
  const dir = aiosCorePath('development', 'workflows');
  for (const ext of ['.yaml', '.yml']) {
    const p = resolve(dir, `${id}${ext}`);
    if (existsSync(p)) {
      const raw = readFileSync(p, 'utf-8');
      const parsed = parseYaml(raw) as Record<string, unknown>;
      return c.json({ workflow: { id, file: `${id}${ext}`, ...parsed } });
    }
  }
  const state = getWorkflowState(id);
  if (state) {
    return c.json({
      workflow: {
        id: state.id,
        workflowId: state.workflow_id,
        definitionId: state.definition_id,
        currentPhase: state.current_phase,
        status: state.status,
        phaseHistory: JSON.parse(state.phase_history),
        iterationCount: state.iteration_count,
      },
    });
  }
  return c.json({ error: 'Workflow not found' }, 404);
});

api.post('/workflows/:id/execute', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  try {
    const state = startWorkflow(id, body.input ?? {}, body.parentJobId);
    return c.json({
      workflowId: state.workflow_id,
      definitionId: state.definition_id,
      status: state.status,
      currentPhase: state.current_phase,
    }, 201);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return c.json({ error: msg }, 400);
  }
});

// ── /api/analytics ─────────────────────────────────────────
function periodToSince(period: string): string {
  const now = Date.now();
  const ms: Record<string, number> = {
    hour: 3600_000,
    day: 86400_000,
    week: 7 * 86400_000,
    month: 30 * 86400_000,
    quarter: 90 * 86400_000,
    year: 365 * 86400_000,
  };
  return new Date(now - (ms[period] ?? ms.day)).toISOString();
}

api.get('/analytics/overview', (c) => {
  const period = c.req.query('period') || 'day';
  const since = periodToSince(period);
  const db = getDb();

  const summary = db.query<{
    total: number; done: number; failed: number; avg_duration: number;
  }, [string]>(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as done,
      SUM(CASE WHEN status IN ('failed','timeout','rejected') THEN 1 ELSE 0 END) as failed,
      AVG(CASE WHEN started_at IS NOT NULL AND completed_at IS NOT NULL
        THEN (julianday(completed_at) - julianday(started_at)) * 86400000 ELSE NULL END) as avg_duration
    FROM jobs WHERE created_at >= ?
  `).get(since) || { total: 0, done: 0, failed: 0, avg_duration: 0 };

  const topAgents = db.query<{ agent_id: string; executions: number; ok: number }, [string]>(`
    SELECT agent_id, COUNT(*) as executions,
      SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as ok
    FROM jobs WHERE created_at >= ?
    GROUP BY agent_id ORDER BY executions DESC LIMIT 5
  `).all(since) || [];

  const topSquads = db.query<{ squad_id: string; executions: number }, [string]>(`
    SELECT squad_id, COUNT(*) as executions
    FROM jobs WHERE created_at >= ?
    GROUP BY squad_id ORDER BY executions DESC LIMIT 5
  `).all(since) || [];

  const totalExec = summary.total ?? 0;
  const successful = summary.done ?? 0;
  const failedExec = summary.failed ?? 0;

  return c.json({
    period,
    periodStart: since,
    periodEnd: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    summary: {
      totalExecutions: totalExec,
      successfulExecutions: successful,
      failedExecutions: failedExec,
      successRate: totalExec ? (successful / totalExec) : 0,
      averageDuration: Math.round(summary.avg_duration ?? 0),
      totalRequests: totalExec,
      errorRate: totalExec ? (failedExec / totalExec) : 0,
      avgLatency: Math.round(summary.avg_duration ?? 0),
      p95Latency: 0,
      totalCost: 0,
      totalTokens: 0,
      avgCostPerExecution: 0,
      activeJobs: queue.getRunningCount(),
      scheduledTasks: 0,
      activeTasks: 0,
    },
    trends: {
      executions: { direction: 'stable', change: 0 },
      costs: { direction: 'stable', change: 0 },
      errors: { direction: 'stable', change: 0 },
    },
    topAgents: topAgents.map((a) => ({
      agentId: a.agent_id,
      name: a.agent_id,
      executions: a.executions,
      successRate: a.executions ? (a.ok / a.executions) : 0,
    })),
    topSquads: topSquads.map((s) => ({
      squadId: s.squad_id,
      name: s.squad_id,
      executions: s.executions,
      cost: 0,
    })),
    health: {
      status: 'healthy',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    },
  });
});

api.get('/analytics/realtime', (c) => {
  const db = getDb();
  const since = new Date(Date.now() - 60_000).toISOString();

  const row = db.query<{ total: number; failed: number }, [string]>(`
    SELECT COUNT(*) as total,
      SUM(CASE WHEN status IN ('failed','timeout') THEN 1 ELSE 0 END) as failed
    FROM jobs WHERE created_at >= ?
  `).get(since) || { total: 0, failed: 0 };

  return c.json({
    timestamp: new Date().toISOString(),
    requestsPerMinute: row.total ?? 0,
    errorsPerMinute: row.failed ?? 0,
    executionsPerMinute: row.total ?? 0,
    activeExecutions: queue.getRunningCount(),
    avgLatencyMs: 0,
  });
});

api.get('/analytics/performance/agents', (c) => {
  const period = c.req.query('period') || 'day';
  const squadId = c.req.query('squadId');
  const limit = Number(c.req.query('limit') || '20');
  const since = periodToSince(period);
  const db = getDb();

  const sql = squadId
    ? `SELECT agent_id, squad_id, COUNT(*) as total,
         SUM(CASE WHEN status='done' THEN 1 ELSE 0 END) as done,
         SUM(CASE WHEN status IN ('failed','timeout') THEN 1 ELSE 0 END) as failed,
         AVG(CASE WHEN started_at IS NOT NULL AND completed_at IS NOT NULL
           THEN (julianday(completed_at)-julianday(started_at))*86400000 ELSE NULL END) as avg_duration,
         MAX(created_at) as last_active
       FROM jobs WHERE created_at >= ? AND squad_id = ?
       GROUP BY agent_id, squad_id ORDER BY total DESC LIMIT ?`
    : `SELECT agent_id, squad_id, COUNT(*) as total,
         SUM(CASE WHEN status='done' THEN 1 ELSE 0 END) as done,
         SUM(CASE WHEN status IN ('failed','timeout') THEN 1 ELSE 0 END) as failed,
         AVG(CASE WHEN started_at IS NOT NULL AND completed_at IS NOT NULL
           THEN (julianday(completed_at)-julianday(started_at))*86400000 ELSE NULL END) as avg_duration,
         MAX(created_at) as last_active
       FROM jobs WHERE created_at >= ?
       GROUP BY agent_id, squad_id ORDER BY total DESC LIMIT ?`;

  const rows = (squadId
    ? db.query(sql).all(since, squadId, limit)
    : db.query(sql).all(since, limit)) as Array<{
      agent_id: string; squad_id: string; total: number; done: number; failed: number;
      avg_duration: number; last_active: string;
    }>;

  return c.json({
    agents: rows.map((r) => ({
      agentId: r.agent_id,
      agentName: r.agent_id,
      squad: r.squad_id,
      totalExecutions: r.total,
      successfulExecutions: r.done,
      failedExecutions: r.failed,
      successRate: r.total ? r.done / r.total : 0,
      avgDuration: Math.round(r.avg_duration ?? 0),
      avgTokens: 0,
      totalCost: 0,
      lastActive: r.last_active,
    })),
  });
});

api.get('/analytics/performance/squads', (c) => {
  const period = c.req.query('period') || 'day';
  const limit = Number(c.req.query('limit') || '20');
  const since = periodToSince(period);
  const db = getDb();

  const rows = db.query<{
    squad_id: string; total: number; done: number; avg_duration: number;
  }, [string, number]>(`
    SELECT squad_id, COUNT(*) as total,
      SUM(CASE WHEN status='done' THEN 1 ELSE 0 END) as done,
      AVG(CASE WHEN started_at IS NOT NULL AND completed_at IS NOT NULL
        THEN (julianday(completed_at)-julianday(started_at))*86400000 ELSE NULL END) as avg_duration
    FROM jobs WHERE created_at >= ?
    GROUP BY squad_id ORDER BY total DESC LIMIT ?
  `).all(since, limit) || [];

  return c.json({
    squads: rows.map((r) => ({
      squadId: r.squad_id,
      squadName: r.squad_id,
      agentCount: 0,
      totalExecutions: r.total,
      successRate: r.total ? r.done / r.total : 0,
      avgDuration: Math.round(r.avg_duration ?? 0),
      totalCost: 0,
      topAgents: [],
    })),
  });
});

api.get('/analytics/costs', (c) => {
  const period = c.req.query('period') || 'month';
  const since = periodToSince(period);
  return c.json({
    period,
    periodStart: since,
    generatedAt: new Date().toISOString(),
    summary: { totalCost: 0, totalTokens: 0, totalRecords: 0, avgCostPerRecord: 0, avgTokensPerRecord: 0 },
    byProvider: [],
    byModel: [],
    timeline: [],
  });
});

api.get('/analytics/health-dashboard', (c) => {
  const mem = process.memoryUsage();
  const db = getDb();
  const since = new Date(Date.now() - 3600_000).toISOString();
  const row = db.query<{ total: number; failed: number; done: number; avg_duration: number }, [string]>(`
    SELECT COUNT(*) as total,
      SUM(CASE WHEN status IN ('failed','timeout') THEN 1 ELSE 0 END) as failed,
      SUM(CASE WHEN status='done' THEN 1 ELSE 0 END) as done,
      AVG(CASE WHEN started_at IS NOT NULL AND completed_at IS NOT NULL
        THEN (julianday(completed_at)-julianday(started_at))*86400000 ELSE NULL END) as avg_duration
    FROM jobs WHERE created_at >= ?
  `).get(since) || { total: 0, failed: 0, done: 0, avg_duration: 0 };

  return c.json({
    timestamp: new Date().toISOString(),
    status: 'healthy',
    availability: 1,
    performance: {
      requestsLastHour: row.total,
      errorsLastHour: row.failed,
      avgLatencyMs: Math.round(row.avg_duration ?? 0),
      p95LatencyMs: 0,
      executionsLastHour: row.total,
      executionSuccessRate: row.total ? row.done / row.total : 0,
    },
    resources: {
      memoryUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
      memoryTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
      memoryPercentage: mem.heapTotal ? mem.heapUsed / mem.heapTotal : 0,
      uptimeSeconds: Math.floor(process.uptime()),
      uptimeFormatted: formatUptime(process.uptime()),
    },
    services: {
      queue: { status: 'ok', pending: queue.getQueueDepth(), processing: queue.getRunningCount() },
      scheduler: { status: 'ok', activeTasks: 0, totalTasks: 0 },
    },
  });
});

api.get('/analytics/usage/tokens', (c) => {
  const groupBy = c.req.query('groupBy') || 'provider';
  return c.json({
    total: { input: 0, output: 0 },
    byGroup: [{ name: groupBy === 'provider' ? 'claude-cli' : 'default', input: 0, output: 0 }],
  });
});

// ── /api/tools/mcp ─────────────────────────────────────────
api.get('/tools/mcp', (c) => {
  try {
    const mcpPath = resolve(process.cwd(), '..', '.mcp.json');
    const fallbackPath = resolve(process.cwd(), '.mcp.json');
    const path = existsSync(mcpPath) ? mcpPath : fallbackPath;
    if (!existsSync(path)) return c.json({ servers: [] });

    const config = JSON.parse(readFileSync(path, 'utf-8')) as {
      mcpServers?: Record<string, { description?: string }>;
      presets?: Record<string, { servers?: string[] }>;
    };

    const presetsByServer: Record<string, string[]> = {};
    for (const [presetId, preset] of Object.entries(config.presets || {})) {
      for (const srv of preset.servers || []) {
        (presetsByServer[srv] = presetsByServer[srv] || []).push(presetId);
      }
    }

    const now = new Date().toISOString();
    const servers = Object.entries(config.mcpServers || {}).map(([name, cfg]) => ({
      name,
      status: 'connected' as const,
      type: 'stdio',
      tools: [],
      toolCount: 0,
      resources: [],
      lastPing: now,
      usedBy: presetsByServer[name] || [],
      description: cfg.description,
    }));

    return c.json({ servers, total: servers.length });
  } catch (err) {
    log.warn('mcp.list.failed', { err: err instanceof Error ? err.message : String(err) });
    return c.json({ servers: [] });
  }
});

// ── /api/stories ───────────────────────────────────────────
api.get('/stories', (c) => c.json([]));

// ── /api/events/history — empty stub (fed by real jobs table later) ──
api.get('/events/history', (c) => {
  const limit = Number(c.req.query('limit') ?? 20);
  const agent = c.req.query('aios_agent');
  try {
    const db = getDb();
    const rows = db
      .query<{
        id: string;
        squad_id: string;
        agent_id: string;
        status: string;
        started_at: string | null;
        completed_at: string | null;
        error_message: string | null;
      }, []>(
        `SELECT id, squad_id, agent_id, status, started_at, completed_at, error_message
           FROM jobs
          WHERE (? IS NULL OR agent_id = ?)
          ORDER BY COALESCE(completed_at, started_at, created_at) DESC
          LIMIT ?`
      )
      .all(agent ?? null, agent ?? null, Math.min(Math.max(limit, 1), 100));

    const events = rows.map((r) => {
      const started = r.started_at ? new Date(r.started_at).getTime() : null;
      const completed = r.completed_at ? new Date(r.completed_at).getTime() : null;
      const duration = started && completed ? completed - started : 0;
      return {
        id: r.id,
        type: 'job',
        agent: r.agent_id,
        squad: r.squad_id,
        timestamp: r.completed_at || r.started_at || new Date().toISOString(),
        description: `${r.status} (${r.squad_id}/${r.agent_id})`,
        success: r.status === 'done',
        duration,
      };
    });
    return c.json({ events });
  } catch {
    return c.json({ events: [] });
  }
});

// ── /api/knowledge/* — empty stubs until a real index is wired ──
api.get('/knowledge/files/overview', (c) =>
  c.json({
    totalFiles: 0,
    totalDirectories: 0,
    totalSize: 0,
    byExtension: {},
    recentFiles: [],
  })
);
api.get('/knowledge/files', (c) => c.json({ path: c.req.query('path') ?? '', items: [] }));
api.get('/knowledge/files/content', (c) =>
  c.json({
    path: c.req.query('path') ?? '',
    name: '',
    content: '',
    size: 0,
    modified: new Date().toISOString(),
    extension: '',
  })
);

// ── /api/tasks ─────────────────────────────────────────────
interface TaskRow {
  id: string;
  demand: string;
  status: string;
  squads: string;
  workflow: string | null;
  outputs: string;
  options: string | null;
  error: string | null;
  total_tokens: number | null;
  total_duration: number | null;
  step_count: number | null;
  completed_steps: number | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

function taskRowToDto(r: TaskRow) {
  return {
    id: r.id,
    demand: r.demand,
    status: r.status,
    squads: JSON.parse(r.squads || '[]'),
    workflow: r.workflow ? JSON.parse(r.workflow) : null,
    outputs: JSON.parse(r.outputs || '[]'),
    createdAt: r.created_at,
    startedAt: r.started_at || undefined,
    completedAt: r.completed_at || undefined,
    totalTokens: r.total_tokens || undefined,
    totalDuration: r.total_duration || undefined,
    stepCount: r.step_count || undefined,
    completedSteps: r.completed_steps || undefined,
    error: r.error || undefined,
  };
}

api.post('/tasks', async (c) => {
  const body = await c.req.json<{ demand: string; options?: Record<string, unknown> }>();
  if (!body.demand) return c.json({ error: 'demand required' }, 400);

  const id = ulid();
  const db = getDb();
  db.run(
    `INSERT INTO tasks (id, demand, status, options) VALUES (?, ?, 'pending', ?)`,
    [id, body.demand, body.options ? JSON.stringify(body.options) : null]
  );

  return c.json({
    taskId: id,
    status: 'pending',
    message: 'Task created',
    dbPersistence: true,
  });
});

api.get('/tasks', (c) => {
  const status = c.req.query('status');
  const limit = Number(c.req.query('limit') || '50');
  const offset = Number(c.req.query('offset') || '0');
  const db = getDb();

  const rows = (status
    ? db.query(`SELECT * FROM tasks WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(status, limit, offset)
    : db.query(`SELECT * FROM tasks ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(limit, offset)) as TaskRow[];

  const totalRow = (status
    ? db.query<{ c: number }, [string]>(`SELECT COUNT(*) as c FROM tasks WHERE status = ?`).get(status)
    : db.query<{ c: number }, []>(`SELECT COUNT(*) as c FROM tasks`).get()) || { c: 0 };

  return c.json({
    tasks: rows.map(taskRowToDto),
    total: totalRow.c,
    limit,
    offset,
    dbPersistence: true,
  });
});

api.get('/tasks/:id', (c) => {
  const id = c.req.param('id');
  const db = getDb();
  const row = db.query(`SELECT * FROM tasks WHERE id = ?`).get(id) as TaskRow | null;
  if (!row) return c.json({ error: 'Task not found' }, 404);
  return c.json(taskRowToDto(row));
});

// ── helpers ────────────────────────────────────────────────
function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

export { api };
