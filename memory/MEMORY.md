# Agent System Memory

## Project Root
- Path: `~/AIOS-MASTER/` (was ~/claude-master/, renamed 2026-02-18)
- Public repo: github.com/andreyloppes/aios-master (Core, MIT)
- Private repo: github.com/andreyloppes/aios-master-pro (PRO, licensed)

## Multi-Agent System (Built 2026-02-15)
12 specialized agents available via `/agents:*` slash commands.
Based on Synkra AIOS architecture, adapted for native Claude Code operation.

### Available Agents
| Command | Agent | Name | Role |
|---------|-------|------|------|
| `/agents:dev` | dev | Dex | Full Stack Developer |
| `/agents:qa` | qa | Quinn | Quality & Review |
| `/agents:architect` | architect | Aria | System Architect |
| `/agents:pm` | pm | Morgan | Product Manager |
| `/agents:sm` | sm | River | Scrum Master |
| `/agents:analyst` | analyst | Atlas | Business Analyst |
| `/agents:devops` | devops | Gage | DevOps Engineer |
| `/agents:po` | po | Pax | Product Owner |
| `/agents:data-engineer` | data-eng | Dara | Database Architect |
| `/agents:ux` | ux | Uma | UX/UI Designer |
| `/agents:master` | master | Orion | Orchestrator |
| `/agents:squad` | squad | Craft | Squad Creator |

### Workflows (8 Core + 6 PRO)
| Command | Purpose |
|---------|---------|
| `/workflows:greenfield` | Full-stack project from concept to code |
| `/workflows:brownfield` | Enhance existing project (assess → plan → implement) |
| `/workflows:story-cycle` | SM → Dev → QA → DevOps loop |
| `/workflows:qa-loop` | Automated review cycle until PASS (max 5 iterations) |
| `/workflows:spec-pipeline` | Gather → Assess → Research → Write → Critique → Plan |
| `/workflows:progress` | Session continuity - save/load progress between sessions |
| `/workflows:auto` | Autonomous development - execute stories with minimal intervention |
| `/workflows:team-status` | Project and agent status report |
| `/workflows:client-onboarding` | PRO: 5-phase client pipeline |
| `/workflows:sprint-retro` | PRO: Automated retrospective |
| `/workflows:cost-report` | PRO: Weekly cost analysis |
| `/workflows:deploy-pipeline` | PRO: 5-phase CI/CD |
| `/workflows:parallel-build` | PRO: Multi-agent parallel build (tmux) |
| `/workflows:parallel-review` | PRO: Multi-perspective parallel review (tmux) |

### Team Commands
| Command | Purpose |
|---------|---------|
| `/team:delegate` | Smart routing to the right agent |
| `/team:plan` | Multi-agent execution plan |

### Agent Authority Rules
- Only `/agents:devops` can push, create PRs, deploy
- `/agents:pm` plans, never implements
- `/agents:sm` creates stories, never codes
- `/agents:qa` reviews, never implements features
- `/agents:master` orchestrates, never emulates other agents

### Architecture Inspiration
- Source: github.com/SynkraAI/aios-core (MIT license)
- Patterns: OpenClaw (persistent identity), Auto-Claude (parallel terminals)
- See: [agents-architecture.md](agents-architecture.md) for detailed design

## Design System Reference: shadcn/ui
- Path: `~/AIOS-MASTER/references/shadcn-ui/`
- Version: v4 (latest, cloned 2026-02-16)
- Key paths:
  - Components: `apps/v4/registry/new-york-v4/ui/`
  - Blocks: `apps/v4/registry/new-york-v4/blocks/`
  - Charts: `apps/v4/registry/new-york-v4/charts/`
  - Examples: `apps/v4/registry/new-york-v4/examples/`
  - Templates: `templates/`

## CSS Framework Reference: Tailwind CSS v4
- Path: `~/AIOS-MASTER/references/tailwindcss/`
- Version: v4 (latest, cloned 2026-02-16) — reescrito em Rust (Oxide engine)
- Key source files:
  - `packages/tailwindcss/theme.css` — design tokens
  - `packages/tailwindcss/preflight.css` — CSS reset
  - `packages/tailwindcss/src/design-system.ts` — engine

## Native Agent Teams + tmux (PRO)
- Feature: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` em `~/.claude/settings.json`
- tmux config: `~/AIOS-MASTER/pro/tmux/aios-master.conf`
- Setup: `~/AIOS-MASTER/pro/tmux/setup.sh`
- Workflows paralelos: parallel-build, parallel-review
- `/pro:tmux` — comando para checar/configurar tmux mode

## Obsidian CLI Integration
- Version: v1.12.4 (built into Obsidian Desktop)
- Binary: `/Applications/Obsidian.app/Contents/MacOS/Obsidian`
- PATH: added to `~/.zshrc`
- Vault: `Documents` (iCloud: `~/Library/Mobile Documents/iCloud~md~obsidian/Documents`)
- Structure: PARA (INBOX, PROJECTS, AREAS, RESOURCES, ARCHIVES) + JOURNAL, DASHBOARDS, TEMPLATES
- Skill: `~/AIOS-MASTER/skills/obsidian/SKILL.md`
- Command: `~/AIOS-MASTER/commands/obsidian.md`
- Requires: Obsidian app running for CLI to work

## MCP Servers Configurados
- **Figma (oficial)**: Remote MCP via `https://mcp.figma.com/mcp` (HTTP transport, OAuth)
- **Figma-Context-MCP (Framelink)**: `~/AIOS-MASTER/references/figma-mcp-server/`

## PRO Module (Built 2026-02-17)
- Path: `~/AIOS-MASTER/pro/` — open-core premium layer
- Install: `./pro/setup.sh` (creates symlinks for PRO commands/workflows/skills)
- Data dir: `~/.claude-master-pro/data/` (sessions.jsonl, costs, backups)

### PRO Commands (6)
| Command | Purpose |
|---------|---------|
| `/pro:status` | System health and component status |
| `/pro:metrics` | Session analytics and performance metrics |
| `/pro:squad` | Activate industry squad overlay |
| `/pro:cost` | Token cost tracking and optimization |
| `/pro:report` | Generate professional reports (5 types) |
| `/pro:tmux` | Configure tmux + Agent Teams |

### PRO Skills (3)
cost-optimizer, analytics, client-report

### Industry Squads (5)
healthcare, marketing-agency, saas-startup, ecommerce, freelancer

### MCP Connectors (5)
google-sheets, notion, slack-discord, stripe, database

### Dashboard
- Path: `~/AIOS-MASTER/pro/dashboard/`
- Stack: Next.js 15 + shadcn/ui v4 + Tailwind v4 + Recharts
- Deployed: https://dashboard-five-kappa-84.vercel.app

### Open-Core Licensing
- Path: `~/AIOS-MASTER/open-core-pro-mvp/`
- Model: Core (MIT, free) + PRO (premium, licensed)

## Directory Structure
```
~/AIOS-MASTER/
├── commands/           # 12 agents, 8 workflows, team, design system
├── skills/             # interface-design, google-auth skills
├── memory/             # MEMORY.md, architecture, patterns
├── pro/                # PRO module (private repo)
│   ├── commands/       # 6 PRO commands
│   ├── workflows/      # 6 PRO workflows
│   ├── skills/         # 3 PRO skills
│   ├── squads/         # 5 industry squads
│   ├── connectors/     # 5 MCP connectors
│   ├── scripts/        # production scripts
│   ├── tmux/           # tmux config + setup
│   ├── dashboard/      # Next.js monitoring app
│   └── license-service/
├── references/         # design system & framework refs (gitignored)
│   ├── shadcn-ui/
│   ├── tailwindcss/
│   └── figma-mcp-server/
├── docs/               # personal setup notes (gitignored)
├── config/             # personal config (gitignored)
├── open-core-pro-mvp/  # licensing MVP (gitignored)
├── setup.sh            # Core installer
├── bootstrap.sh        # One-command installer
├── LICENSE             # MIT
└── README.md
```

## Core Skills (2)
- **interface-design**: UI craft system for dashboards/apps
- **google-auth**: Google OAuth via Supabase (login UI, callback, middleware, trigger, setup script)

## Active Projects
- **o2-kanban**: `~/Desktop/o2-kanban/` — Next.js 16 + Supabase kanban board
  - Supabase ref: `ttiwegjjdvfdvwtxzatx`
  - Auth: email/password + Google/GitHub OAuth (code ready, needs GCP + Supabase config)
  - Deploy: Vercel

## Autonomous Mode (Global)
- Config: `~/.claude/settings.json` (aplica a TODOS os projetos)
- `defaultMode: "bypassPermissions"` — executa sem pedir aprovacao
- All tools allowlisted: `Bash(*)`, `Read(*)`, `Edit(*)`, `Write(*)`, `Glob(*)`, `Grep(*)`, `WebFetch(*)`, `WebSearch(*)`, `Task(*)`, `NotebookEdit(*)`
- Deny rules: `rm -rf /`, `rm -rf /*`, `sudo rm -rf *` (seguranca basica)
- Flag CLI alternativa: `claude --dangerously-skip-permissions` (bypassa tudo, ideal para containers)
- Referencia: [Anthropic docs](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

## User Preferences
- Language: Portuguese (pt-BR) for communication
- Approach: Practical, hands-on, wants things working
- Interest: Automation, multi-agent systems, full-stack development
- Autonomous: Prefere execucao continua sem interrupcoes de permissao

## Manutencao de Disco — Regras Permanentes

### PROBLEMA CONHECIDO: Runaway background tasks
- Processos iniciados como background task pelo Claude (dev servers, watchers, etc.) escrevem stdout/stderr em `/private/tmp/claude-501/*/tasks/*.output`
- Esses arquivos NUNCA sao limpos automaticamente e podem crescer para dezenas de GB
- Caso real: Next.js do o2-kanban acumulou **25GB** em `/private/tmp/claude-501/-Users-andreylopes-Desktop-o2-kanban/tasks/b2474b9.output`

### REGRA: Sempre matar processos background ao fim de sessoes
Antes de encerrar qualquer sessao com dev servers em background, executar:
```bash
# Checar processos escrevendo em /tmp do Claude
lsof /private/tmp/claude-501/ 2>/dev/null | grep -v "^COMMAND"
# Matar pelo PID listado
kill <PID>
```

### REGRA: Monitorar tamanho de /private/tmp periodicamente
```bash
du -sh /private/tmp/claude-501/ 2>/dev/null
```
Se passar de 500MB, investigar e limpar.

### Script de limpeza rapida (rodar quando disco estiver cheio)
```bash
# 1. Matar processos runaway
lsof /private/tmp/claude-501/ 2>/dev/null | awk 'NR>1{print $2}' | sort -u | xargs kill 2>/dev/null
# 2. Deletar output files grandes (>100MB)
find /private/tmp/claude-501 -size +100M -not -type l -delete 2>/dev/null
# 3. Limpar caches de usuario
rm -rf ~/Library/Caches/Comet ~/Library/Caches/CloudKit
npm cache clean --force 2>/dev/null
brew cleanup --prune=all 2>/dev/null
```

### Mapa de espaco em disco (macOS — andreylopes)
| Pasta | Tipo | Seguro limpar? |
|-------|------|----------------|
| `/private/tmp/claude-501/*/tasks/*.output` | Logs de subagents | Sim, sempre |
| `~/Library/Caches/*` | Caches de apps | Sim (regenerado automaticamente) |
| `~/Library/Application Support/Comet` | Cache Perplexity | Sim |
| `~/.npm` | Cache npm | Sim (`npm cache clean --force`) |
| `node_modules/` em projetos inativos | Deps | Sim (`npm install` restaura) |
| `/usr/local/var/homebrew/tmp/` | Bottles antigos | Sim (`brew cleanup`) |
