# O2-AIOS — Plataforma de Orquestração de Agentes O2

Workspace AIOS unificado da O2 — **11 squads**, **22 agentes core**, **21 workflows**, **205 tasks**, **3 skills proprietárias**, **5 connectors**, engine Bun+Hono, dashboard Vite+React brutalist.

Fusão do AIOS-MASTER (conteúdo proprietário) com o melhor da SynkraAI (framework v4.0, orquestrador, IDS, registry, Kaizen minds, Legal-Analyst BR) e dashboard visual da aiox-dashboard (fork MIT).

## Quick Start

```bash
cd ~/O2-AIOS
./scripts/bootstrap.sh   # instala deps engine + dashboard
./scripts/dev.sh         # sobe tudo (engine :4002, dashboard :5173)
```

## Arquitetura

```
workspace/       conteúdo — squads, agents, skills, tasks, workflows
engine/          Bun+Hono REST+WS+SQLite (fork aiox-dashboard/engine, MIT)
dashboard/       Vite+React 19+TS SPA (fork aiox-dashboard, MIT)
connectors/      integrações (Stripe, Google Sheets, Notion, DB, Slack/Discord)
.mcp.json        presets de MCPs (o2-dev, o2-research, o2-consulting, o2-broker)
scripts/         bootstrap, dev, demo
```

## Squads

| ID | Domínio | Origem |
|---|---|---|
| `broker-leads` | Venda de leads O2 → franqueados | custom O2 |
| `oxybroker` | SaaS multi-tenant + Stripe + growth | AIOS-MASTER |
| `marketing-agency` | Agência: content, analytics, campaigns | AIOS-MASTER |
| `ecommerce` | Checkout, catálogo, conversão | AIOS-MASTER |
| `healthcare` | HIPAA/LGPD, EHR, FHIR | AIOS-MASTER |
| `freelancer` | Proposta, billing, scope management | AIOS-MASTER |
| `kaizen` | Melhoria contínua (Goldratt, BSC, OKR, Fowler) | SynkraAI |
| `kaizen-v2` | Kaizen refinado | SynkraAI |
| `legal-analyst-br` | Análise processual pt-BR (Ministros STF, DATAJUD) | SynkraAI |
| `apex` | Quality gates frontend (154 veto conditions) | SynkraAI |
| `deep-research` | Pesquisa em profundidade | SynkraAI |

## Créditos & Licenças

Código engine + dashboard: fork MIT de [SynkraAI/aiox-dashboard](https://github.com/SynkraAI/aiox-dashboard).
Framework core: fork MIT de [SynkraAI/aiox-core](https://github.com/SynkraAI/aiox-core).
Squads comunitárias: [SynkraAI/aiox-squads](https://github.com/SynkraAI/aiox-squads) (MIT).
Conteúdo proprietário O2: `/skills/`, `/connectors/`, `/squads/broker-leads`, `/squads/oxybroker`, `/squads/mesa-redonda`.
