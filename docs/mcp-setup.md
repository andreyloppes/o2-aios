# O2-AIOS — MCP Setup

Onde vivem os MCPs da plataforma e como o time ativa cada um.

## 1. Arquivo `.mcp.json` (raiz do repo)

- **Propósito**: MCPs gerenciados pelo projeto (não-OAuth) + presets de carga por squad.
- **Servers locais**: `context7`, `desktop-commander`, `playwright`, `exa`.
- **Presets**:

| Preset            | Descrição                                 | Tokens ~ | Servers                                                 |
|-------------------|-------------------------------------------|----------|---------------------------------------------------------|
| `o2-dev`          | Coding + docs + file ops + browser        | 30k      | context7, desktop-commander, playwright                 |
| `o2-research`     | Pesquisa: web + docs + browser            | 45k      | context7, exa, playwright                               |
| `o2-consulting`   | Mesa Redonda: Notion, Gmail, Cal, Drive…  | 55k      | notion, gmail, google-calendar, google-drive, canva, context7 |
| `o2-broker`       | Broker: Sheets, Gmail, Notion, file ops   | 35k      | google-sheets, gmail, notion, desktop-commander         |
| `o2-full`         | Tudo (pesado, só em contexto folgado)     | 80k      | todos acima + figma                                     |

## 2. MCPs autenticados via Claude.ai (OAuth)

Os MCPs abaixo vivem em `~/.claude.json` do usuário. Já estão autenticados via login na conta Claude.ai:

- **Canva** — design ops + export
- **Figma** — design-to-code
- **Gmail** — leitura/rascunho/labels
- **Google Calendar** — agenda Mesa Redonda, broker-leads
- **Google Drive** — repositório documental O2
- **Google Sheets** (via o preset broker)
- **Notion** — playbook de consulting, brief de cliente
- **Task Manager (aikanban)** — boards internos
- **Webflow** — site O2 + growth

Não precisa declarar em `.mcp.json` — são carregados automaticamente.

## 3. Como ativar um preset

```bash
# No Claude Code, dentro do repo:
/mcp o2-broker        # carrega só o que squad broker precisa
/mcp o2-consulting    # Mesa Redonda
/mcp o2-dev           # dev diário
```

## 4. Variáveis de ambiente necessárias

```bash
# para o preset com exa
export EXA_API_KEY="seu-key-do-exa"
```

## 5. Squads ↔ Preset sugerido

| Squad             | Preset recomendado |
|-------------------|--------------------|
| broker-leads      | `o2-broker`        |
| oxybroker         | `o2-dev`           |
| mesa-redonda      | `o2-consulting`    |
| marketing-agency  | `o2-consulting`    |
| legal-analyst-br  | `o2-research`      |
| deep-research     | `o2-research`      |
| kaizen / kaizen-v2| `o2-dev`           |
| apex              | `o2-dev`           |
| ecommerce         | `o2-dev`           |
| healthcare        | `o2-consulting`    |
| freelancer        | `o2-consulting`    |
