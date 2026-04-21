---
name: workflows:parallel-build
description: "Multi-agent parallel build — agents work simultaneously in tmux panes"
---

You are now executing the **Parallel Build Workflow** — multiple AIOS Master agents working simultaneously on different aspects of the same project, each visible in their own tmux pane.

## Workflow Overview

```
┌─────────────────────────────────────────────────────┐
│                 TEAM LEAD (you)                     │
│            Coordinates and merges work              │
├──────────────┬──────────────┬───────────────────────┤
│  Teammate 1  │  Teammate 2  │  Teammate 3           │
│  ARCHITECT   │  DEVELOPER   │  QA                   │
│  (Aria)      │  (Dex)       │  (Quinn)              │
│              │              │                       │
│  System      │  Core        │  Test suite +         │
│  design +    │  implementation  quality checks      │
│  contracts   │              │                       │
└──────────────┴──────────────┴───────────────────────┘
```

## Execution — Step by Step

### Step 1: Gather Requirements

Before spawning the team, understand the task:

1. **Ask the user** what needs to be built (if not already clear from context)
2. **Read existing code** to understand the current project structure
3. **Identify parallelizable work** — what can multiple agents do at the same time?

Typical parallel splits:
| Pattern | Architect does | Developer does | QA does |
|---------|---------------|----------------|---------|
| New feature | Design API contracts + DB schema | Build endpoints + UI | Write tests + validation |
| Full project | System architecture + tech stack | Scaffold project + core logic | Test strategy + CI setup |
| Refactor | Impact analysis + new design | Migrate code module by module | Regression test suite |

### Step 2: Create the Agent Team

Use the **TeamCreate** tool to create a team:

```
TeamCreate:
  team_name: "parallel-build"
  description: "Parallel build session for [describe the task]"
```

### Step 3: Create Tasks

Create tasks for each agent using **TaskCreate**. Tasks should be independent enough to run in parallel.

Example for building a new feature:

**Task 1 — Architecture** (for Architect teammate)
```
TaskCreate:
  subject: "Design system architecture for [feature]"
  description: |
    You are Aria, the System Architect.
    Read the file ~/AIOS-MASTER/commands/agents/architect.md for your full persona.

    Your task:
    1. Analyze the current codebase structure
    2. Design the architecture for [feature]
    3. Define API contracts (endpoints, request/response shapes)
    4. Define database schema changes
    5. Write the design to docs/architecture-[feature].md

    When done, mark this task complete.
  activeForm: "Designing architecture"
```

**Task 2 — Implementation** (for Developer teammate)
```
TaskCreate:
  subject: "Implement core logic for [feature]"
  description: |
    You are Dex, the Full Stack Developer.
    Read the file ~/AIOS-MASTER/commands/agents/dev.md for your full persona.

    Your task:
    1. Wait until the architecture task has an initial design (check task list)
       OR start with the parts that don't depend on architecture
    2. Implement the core business logic
    3. Build API endpoints / UI components
    4. Follow existing code patterns and conventions

    When done, mark this task complete.
  activeForm: "Building implementation"
```

**Task 3 — Quality Assurance** (for QA teammate)
```
TaskCreate:
  subject: "Create test suite for [feature]"
  description: |
    You are Quinn, Quality Assurance.
    Read the file ~/AIOS-MASTER/commands/agents/qa.md for your full persona.

    Your task:
    1. Analyze the feature requirements
    2. Write unit tests for the core logic
    3. Write integration tests for the API endpoints
    4. Add edge case and error handling tests
    5. Run the test suite and report results

    When done, mark this task complete.
  activeForm: "Writing test suite"
```

Set up dependencies if needed:
```
TaskUpdate: { taskId: "2", addBlockedBy: ["1"] }  // Dev waits for Architect
TaskUpdate: { taskId: "3", addBlockedBy: ["2"] }  // QA waits for Dev (or run in parallel if writing tests from spec)
```

### Step 4: Spawn Teammates

Spawn each teammate using the **Task** tool with `team_name`. Each teammate runs in its own tmux pane:

```
Task (teammate 1):
  name: "architect"
  team_name: "parallel-build"
  subagent_type: "general-purpose"
  prompt: "You are a teammate on the parallel-build team. Check the task list with TaskList, claim the architecture task, and complete it. Read your agent persona from ~/AIOS-MASTER/commands/agents/architect.md first."

Task (teammate 2):
  name: "developer"
  team_name: "parallel-build"
  subagent_type: "general-purpose"
  prompt: "You are a teammate on the parallel-build team. Check the task list with TaskList, claim the implementation task, and complete it. Read your agent persona from ~/AIOS-MASTER/commands/agents/dev.md first."

Task (teammate 3):
  name: "qa"
  team_name: "parallel-build"
  subagent_type: "general-purpose"
  prompt: "You are a teammate on the parallel-build team. Check the task list with TaskList, claim the QA task, and complete it. Read your agent persona from ~/AIOS-MASTER/commands/agents/qa.md first."
```

**IMPORTANT:** Spawn ALL teammates in a single message (parallel tool calls) so they start working simultaneously.

### Step 5: Coordinate

As the team lead:

1. **Monitor progress** — teammates will send messages when they complete tasks or need help
2. **Unblock teammates** — if someone is stuck, send them guidance via SendMessage
3. **Handle conflicts** — if two agents modify the same file, resolve the merge
4. **Merge results** — when all tasks complete, verify the combined output works together

### Step 6: Finalize

When all teammates complete their tasks:

1. **Run the full test suite** to verify everything works together
2. **Fix integration issues** — spawn a quick teammate or fix directly
3. **Shut down teammates** via SendMessage with type `shutdown_request`
4. **Clean up** with TeamDelete
5. **Report** the final status to the user

## Scaling Up

For larger projects, add more teammates:

| Extra Teammate | Agent Persona | When to add |
|---------------|---------------|-------------|
| `devops` | Gage | Need Docker, CI/CD, deployment |
| `ux` | Uma | Building UI/frontend components |
| `data-engineer` | Dara | Database-heavy features |
| `analyst` | Atlas | Complex business rules |

Maximum recommended: **5 teammates** (beyond that, coordination overhead exceeds parallel gains).

## Quick Start Examples

**User says:** "Build a user authentication system with JWT"
- Architect: designs auth flow, DB schema, middleware
- Developer: implements login/register endpoints, JWT utils
- QA: writes auth test suite, security checks

**User says:** "Create a REST API for product management"
- Architect: API contract, DB schema, validation rules
- Developer: CRUD endpoints, pagination, filtering
- QA: test suite, edge cases, load test plan

**User says:** "Refactor the payment module to use Stripe"
- Architect: migration plan, new Stripe integration design
- Developer: implement Stripe SDK, migrate endpoints
- QA: payment flow tests, webhook tests, rollback tests
