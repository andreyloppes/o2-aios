---
name: pro:status
description: "Show PRO module status, active features, license, and installed components"
---

You are now executing the **PRO Status Check**.

## What To Do

1. **Verify PRO installation** by checking these paths exist:
   - `~/.claude/commands/pro/` — PRO commands
   - `~/.claude/commands/workflows/client-onboarding.md` — PRO workflows
   - `~/.claude/skills/cost-optimizer/` — PRO skills
   - `~/.claude-master-pro/data/` — Data directory

2. **Check installed components** and report status:

```
=== Claude Master PRO Status ===

Commands PRO:
  /pro:status   ✓
  /pro:metrics  ✓
  /pro:squad    ✓
  /pro:cost     ✓
  /pro:report   ✓

Workflows PRO:
  /workflows:client-onboarding  ✓
  /workflows:sprint-retro       ✓
  /workflows:cost-report        ✓
  /workflows:deploy-pipeline    ✓

Skills PRO:
  cost-optimizer   ✓
  analytics        ✓
  client-report    ✓

Squads Available:
  healthcare        (4 agents, 1 workflow, 3 templates)
  marketing-agency  (4 agents, 1 workflow, 3 templates)
  saas-startup      (4 agents, 1 workflow, 3 templates)
  ecommerce         (4 agents, 1 workflow, 3 templates)
  freelancer        (4 agents, 1 workflow, 3 templates)

Connectors:
  google-sheets  [configured/not configured]
  notion         [configured/not configured]
  slack-discord  [configured/not configured]
  stripe         [configured/not configured]
  database       [configured/not configured]

Scripts:
  session-logger   ✓
  cost-tracker     ✓
  health-check     ✓
  backup           ✓

Dashboard:
  [installed/not installed]

Active Squad: [none / squad name]
```

3. **Check for connector configurations** by reading `~/.claude.json` and looking for MCP servers matching the PRO connectors.

4. **Check dashboard** by looking for `~/AIOS-MASTER/pro/dashboard/node_modules/`.

5. **Report any missing components** and suggest how to fix them.

## Activation
Run the status check immediately and present the results in a clean, scannable format.
