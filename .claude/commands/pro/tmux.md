---
name: pro:tmux
description: "Check, configure, and activate tmux mode for Agent Teams"
argument-hint: "[setup|status]"
---

You are now managing the **tmux + Agent Teams** configuration for AIOS Master PRO.

## How It Works

AIOS Master PRO uses Claude Code's native **Agent Teams** feature with **tmux display mode** to run multiple agents in parallel — each agent visible in its own terminal pane.

```
┌──────────────────────┬──────────────────────┐
│  ● Dex (Developer)   │  ● Quinn (QA)        │
│                      │                      │
│  Building REST API   │  Writing test suite   │
│  endpoints for the   │  for user auth and    │
│  user module...      │  role permissions...  │
│                      │                      │
├──────────────────────┼──────────────────────┤
│  ● Aria (Architect)  │  ● Gage (DevOps)     │
│                      │                      │
│  Reviewing database  │  Setting up Docker    │
│  schema and API      │  compose and CI/CD    │
│  contracts...        │  pipeline...          │
│                      │                      │
└──────────────────────┴──────────────────────┘
  AIOS MASTER │ parallel-build │ 14:32
```

## Usage

### `/pro:tmux` or `/pro:tmux status`
Check the current configuration:

1. **Read** `~/.claude/settings.json` and check:
   - `env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` is `"1"`
2. **Check** if tmux is installed: run `tmux -V`
3. **Check** if AIOS Master tmux theme is loaded: look for `aios-master` in `~/.tmux.conf`
4. **Report** status for each item with ✓ or ✗

Display result as:

```
AIOS Master — tmux Status

  Agent Teams:  ✓ enabled
  tmux:         ✓ v3.x installed
  Theme:        ✓ aios-master.conf loaded

  Ready for parallel workflows.
```

### `/pro:tmux setup`
Run the setup script to configure everything:

1. **Execute** `bash ~/AIOS-MASTER/pro/tmux/setup.sh`
2. This will:
   - Install tmux if missing (via Homebrew on macOS)
   - Add AIOS Master theme to `~/.tmux.conf`
   - Enable `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in Claude Code settings
3. Report results

## After Setup

Once tmux is configured, parallel workflows become available:

| Workflow | What happens |
|----------|-------------|
| `/workflows:parallel-build` | Spawns 3-4 agents building simultaneously in tmux panes |
| `/workflows:parallel-review` | Multiple reviewers analyzing code in parallel |

Or trigger Agent Teams manually:
- Say: *"Create an agent team to build the authentication module"*
- Claude Code will spawn teammates, each in their own tmux pane
- Each teammate can load an AIOS agent persona via `/agents:*` commands

## Requirements

- **tmux** installed on the system
- **Claude Code** with Agent Teams support
- **AIOS Master PRO** installed with workflows
