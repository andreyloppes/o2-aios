import { Hono } from 'hono';
import { ulid } from 'ulid';
import { existsSync, statSync } from 'fs';
import { resolve, basename } from 'path';
import { homedir } from 'os';
import { getDb } from '../lib/db';
import { log } from '../lib/logger';

// ============================================================
// /api/projects — project root tracking for O2-AIOS
// ============================================================
// A "project" is any folder the user has opened in the dashboard.
// We persist recents so the UI can show a picker and the CLI can
// register paths registered via `o2-aios open <path>`.

export const projects = new Hono();

interface ProjectRow {
  id: string;
  path: string;
  label: string;
  has_aios_core: number;
  last_opened_at: string;
  created_at: string;
  metadata: string | null;
}

function expandHome(p: string): string {
  if (p.startsWith('~/') || p === '~') {
    return resolve(homedir(), p.slice(p === '~' ? 1 : 2));
  }
  return p;
}

function normalizePath(raw: string): string {
  return resolve(expandHome(raw));
}

function hasAiosCore(path: string): boolean {
  return existsSync(resolve(path, '.aios-core'));
}

function toDto(row: ProjectRow) {
  return {
    id: row.id,
    path: row.path,
    label: row.label,
    hasAiosCore: row.has_aios_core === 1,
    lastOpenedAt: row.last_opened_at,
    createdAt: row.created_at,
  };
}

// GET /api/projects — list projects ordered by last_opened desc
projects.get('/', (c) => {
  const db = getDb();
  const rows = db
    .query<ProjectRow, []>(
      `SELECT * FROM projects ORDER BY last_opened_at DESC LIMIT 50`
    )
    .all();
  return c.json({ projects: rows.map(toDto) });
});

// POST /api/projects — register a path (or touch existing)
projects.post('/', async (c) => {
  const body = await c.req.json<{ path?: string; label?: string }>().catch(() => ({}));
  if (!body.path || typeof body.path !== 'string') {
    return c.json({ error: 'path is required' }, 400);
  }

  const absPath = normalizePath(body.path);
  if (!existsSync(absPath)) {
    return c.json({ error: `Path does not exist: ${absPath}` }, 400);
  }
  const stat = statSync(absPath);
  if (!stat.isDirectory()) {
    return c.json({ error: `Path is not a directory: ${absPath}` }, 400);
  }

  const db = getDb();
  const existing = db
    .query<ProjectRow, [string]>(`SELECT * FROM projects WHERE path = ?`)
    .get(absPath);

  const hasCore = hasAiosCore(absPath) ? 1 : 0;
  const label = body.label?.trim() || basename(absPath);

  if (existing) {
    db.run(
      `UPDATE projects
         SET last_opened_at = datetime('now'),
             has_aios_core = ?,
             label = COALESCE(NULLIF(?, ''), label)
       WHERE id = ?`,
      [hasCore, body.label?.trim() ?? '', existing.id]
    );
    const updated = db
      .query<ProjectRow, [string]>(`SELECT * FROM projects WHERE id = ?`)
      .get(existing.id)!;
    log.info('Project touched', { path: absPath, id: existing.id });
    return c.json({ project: toDto(updated) });
  }

  const id = ulid();
  db.run(
    `INSERT INTO projects (id, path, label, has_aios_core)
     VALUES (?, ?, ?, ?)`,
    [id, absPath, label, hasCore]
  );
  const created = db
    .query<ProjectRow, [string]>(`SELECT * FROM projects WHERE id = ?`)
    .get(id)!;
  log.info('Project registered', { path: absPath, id });
  return c.json({ project: toDto(created) }, 201);
});

// GET /api/projects/current — resolves from ?path= or engine env
projects.get('/current', (c) => {
  const queryPath = c.req.query('path');
  const resolved = queryPath ? normalizePath(queryPath) : process.env.AIOS_PROJECT_ROOT;
  if (!resolved || !existsSync(resolved)) {
    return c.json({ project: null });
  }
  const db = getDb();
  const row = db
    .query<ProjectRow, [string]>(`SELECT * FROM projects WHERE path = ?`)
    .get(resolved);
  if (row) return c.json({ project: toDto(row) });
  return c.json({
    project: {
      id: null,
      path: resolved,
      label: basename(resolved),
      hasAiosCore: hasAiosCore(resolved),
      lastOpenedAt: null,
      createdAt: null,
    },
  });
});

// POST /api/projects/:id/touch — bump last_opened_at
projects.post('/:id/touch', (c) => {
  const id = c.req.param('id');
  const db = getDb();
  const row = db
    .query<ProjectRow, [string]>(`SELECT * FROM projects WHERE id = ?`)
    .get(id);
  if (!row) return c.json({ error: 'not found' }, 404);
  db.run(`UPDATE projects SET last_opened_at = datetime('now') WHERE id = ?`, [id]);
  const updated = db
    .query<ProjectRow, [string]>(`SELECT * FROM projects WHERE id = ?`)
    .get(id)!;
  return c.json({ project: toDto(updated) });
});

// DELETE /api/projects/:id — remove from recents
projects.delete('/:id', (c) => {
  const id = c.req.param('id');
  const db = getDb();
  const row = db
    .query<ProjectRow, [string]>(`SELECT * FROM projects WHERE id = ?`)
    .get(id);
  if (!row) return c.json({ error: 'not found' }, 404);
  db.run(`DELETE FROM projects WHERE id = ?`, [id]);
  return c.json({ ok: true });
});
