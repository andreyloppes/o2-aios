# O2-AIOS Constitution

## Identity

Plataforma O2 de orquestração de agentes — une conteúdo proprietário (Broker de Leads, OxyBroker, skills de consulting) com framework SynkraAI v4.0 e dashboard visual. Opera local no M2 Pro, expõe API REST+WebSocket, dashboard brutalist pro time.

## North Star

1. **Mesa Redonda IA O2** — CFOs/FP&A veem agentes rodando ao vivo, recebem `client-report` proprietário
2. **Broker de Leads O2** — fiscal-analyst + lead-scorer + pricing-strategist com cérebro tributário
3. **OxyBroker** — squad saas orquestrando a plataforma em produção

## Princípios

- **pt-BR first** — persona, copy, saída padrão. Inglês só em identificadores técnicos.
- **Ground truth em arquivo** — agentes referenciam `data/` no squad, nunca inventam.
- **Fiscal é inegociável** — antes de recomendação comercial, checar impacto tributário (broker-leads/data/cerebro-tributario.md).
- **REUSE > ADAPT > CREATE** — via entity registry (Synkra IDS); evita duplicação.
- **Squad isolado** — cada squad é auto-contido: agents, tasks, data dentro de `squads/{id}/`.
- **Core é cross-cutting** — só orchestrator, políticas globais e agent-teams vivem em `.aios-core/development/`.
- **MCPs conforme preset** — não carregar tudo sempre; usar preset o2-dev/consulting/broker/research conforme a demanda.

## Stack

- **Engine**: Bun 1.3+ + Hono 4 + SQLite + WebSocket (porta 4002)
- **Dashboard**: Vite 7 + React 19 + TypeScript + Tailwind + Zustand (porta 5173)
- **CLI**: `claude` via process-pool (até 5 concurrent)
- **Persistência**: SQLite local (sem Supabase por padrão — opt-in depois)
- **MCPs**: Docker MCP Toolkit + Google Workspace + Figma/Canva + Webflow/Notion

## Workflows críticos (por prioridade)

1. `leads-pipeline` — broker de leads end-to-end
2. `client-onboarding` — onboarding de cliente Mesa Redonda
3. `sprint-retro` — retrospectiva automatizada
4. `cost-report` — relatório de custos Claude API + operação
5. `story-development-cycle` — SDC Synkra 4-fases (sm→po→dev→qa)

## Fora de escopo (fase 1)

- Voice, Terminal, Knowledge base (stubs na UI)
- License-service revenda Stripe (fase 2)
- Deploy cloud (local only por enquanto)
- Supabase (pode ser ligado depois via `VITE_SUPABASE_*`)
