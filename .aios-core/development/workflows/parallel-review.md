---
name: workflows:parallel-review
description: "Multi-perspective parallel code review — architect, QA, and security review simultaneously"
---

You are now executing the **Parallel Review Workflow** — multiple AIOS Master agents reviewing the same codebase from different perspectives simultaneously, each in their own tmux pane.

## Workflow Overview

```
┌─────────────────────────────────────────────────────────┐
│                    TEAM LEAD (you)                       │
│              Collects and merges all reviews             │
├───────────────────┬──────────────────┬──────────────────┤
│  Teammate 1       │  Teammate 2      │  Teammate 3      │
│  ARCHITECT REVIEW │  CODE REVIEW     │  TEST REVIEW     │
│  (Aria)           │  (Quinn)         │  (Dex)           │
│                   │                  │                  │
│  Architecture,    │  Code quality,   │  Test coverage,  │
│  patterns,        │  bugs, security, │  missing tests,  │
│  scalability      │  best practices  │  implementation  │
└───────────────────┴──────────────────┴──────────────────┘
                            ↓
                    UNIFIED REVIEW REPORT
                    (prioritized findings)
```

## When to Use

- Before deploying a feature to production
- After a large PR or branch with many changes
- Periodic codebase health check
- When onboarding to an unfamiliar codebase

## Execution — Step by Step

### Step 1: Identify Scope

Determine what to review:

1. **Specific files/directories** — user provides paths
2. **Recent changes** — run `git diff main...HEAD` or `git log --oneline -20`
3. **Full codebase** — for health checks, scope by directory

Ask the user if scope is unclear.

### Step 2: Create the Agent Team

```
TeamCreate:
  team_name: "parallel-review"
  description: "Multi-perspective code review for [scope]"
```

### Step 3: Create Review Tasks

Create one task per review perspective:

**Task 1 — Architecture Review** (Aria)
```
TaskCreate:
  subject: "Architecture review of [scope]"
  description: |
    You are Aria, the System Architect.
    Read ~/AIOS-MASTER/commands/agents/architect.md for your full persona.

    Review the code at [paths/scope] focusing on:

    1. **Architecture patterns** — Is the structure clean? Proper separation of concerns?
    2. **Dependencies** — Are external dependencies justified? Any circular deps?
    3. **Scalability** — Will this design hold under 10x load? Bottlenecks?
    4. **API design** — Are interfaces clean, consistent, and well-documented?
    5. **Data flow** — Is data flowing logically? Any unnecessary coupling?
    6. **Tech debt** — Identify areas that will become problems if not addressed

    Write your findings to a message sent to the team lead.
    Format: severity (CRITICAL/HIGH/MEDIUM/LOW), file:line, description, suggestion.

    When done, mark this task complete.
  activeForm: "Reviewing architecture"
```

**Task 2 — Code Quality Review** (Quinn)
```
TaskCreate:
  subject: "Code quality and security review of [scope]"
  description: |
    You are Quinn, Quality Assurance.
    Read ~/AIOS-MASTER/commands/agents/qa.md for your full persona.

    Review the code at [paths/scope] focusing on:

    1. **Bugs** — Logic errors, off-by-one, null/undefined risks
    2. **Security** — Injection, XSS, auth bypass, secrets in code (OWASP Top 10)
    3. **Error handling** — Uncaught exceptions, missing error paths
    4. **Code quality** — Readability, naming, DRY violations, dead code
    5. **Type safety** — Missing types, unsafe casts, any types
    6. **Performance** — N+1 queries, unnecessary rerenders, memory leaks

    Write your findings to a message sent to the team lead.
    Format: severity (CRITICAL/HIGH/MEDIUM/LOW), file:line, description, suggestion.

    When done, mark this task complete.
  activeForm: "Reviewing code quality"
```

**Task 3 — Test & Implementation Review** (Dex)
```
TaskCreate:
  subject: "Test coverage and implementation review of [scope]"
  description: |
    You are Dex, the Full Stack Developer.
    Read ~/AIOS-MASTER/commands/agents/dev.md for your full persona.

    Review the code at [paths/scope] focusing on:

    1. **Test coverage** — Are critical paths tested? Missing test cases?
    2. **Test quality** — Are tests meaningful or just checking happy paths?
    3. **Implementation** — Could the code be simpler? Better algorithms?
    4. **Edge cases** — What happens with empty input, max values, concurrent access?
    5. **Documentation** — Are complex parts explained? README up to date?
    6. **Developer experience** — Can a new dev understand this? Setup docs?

    Write your findings to a message sent to the team lead.
    Format: severity (CRITICAL/HIGH/MEDIUM/LOW), file:line, description, suggestion.

    When done, mark this task complete.
  activeForm: "Reviewing tests and implementation"
```

### Step 4: Spawn Reviewers

Spawn ALL teammates simultaneously:

```
Task (teammate 1 — architect):
  name: "architect"
  team_name: "parallel-review"
  subagent_type: "general-purpose"
  prompt: "You are a teammate on the parallel-review team. Claim the architecture review task and complete it. Read your persona from ~/AIOS-MASTER/commands/agents/architect.md."

Task (teammate 2 — qa):
  name: "qa"
  team_name: "parallel-review"
  subagent_type: "general-purpose"
  prompt: "You are a teammate on the parallel-review team. Claim the code quality review task and complete it. Read your persona from ~/AIOS-MASTER/commands/agents/qa.md."

Task (teammate 3 — developer):
  name: "developer"
  team_name: "parallel-review"
  subagent_type: "general-purpose"
  prompt: "You are a teammate on the parallel-review team. Claim the test review task and complete it. Read your persona from ~/AIOS-MASTER/commands/agents/dev.md."
```

### Step 5: Collect and Merge Reviews

As reviews come in from each teammate:

1. **Collect** all findings from the 3 perspectives
2. **Deduplicate** — if multiple reviewers found the same issue, merge into one
3. **Prioritize** — rank by severity (CRITICAL → HIGH → MEDIUM → LOW)
4. **Create unified report** with this structure:

```markdown
# Code Review Report — [scope]
## Date: [date]
## Reviewers: Aria (Architecture), Quinn (Quality), Dex (Implementation)

### Critical Issues (must fix before deploy)
- [ ] [SECURITY] file.ts:42 — SQL injection in user query (Quinn)
- [ ] [ARCH] api/routes.ts — No rate limiting on auth endpoints (Aria)

### High Priority
- [ ] [BUG] utils.ts:15 — Race condition in cache invalidation (Quinn)
- [ ] [TEST] auth.test.ts — Missing test for expired token flow (Dex)

### Medium Priority
...

### Low Priority / Suggestions
...

### Summary
- Total findings: X
- Critical: X | High: X | Medium: X | Low: X
- Architecture score: X/10
- Code quality score: X/10
- Test coverage assessment: [good/needs work/insufficient]
```

### Step 6: Finalize

1. **Present the report** to the user
2. **Ask** if they want to auto-fix any of the findings
3. If yes, spawn a Developer teammate to implement the fixes
4. **Shut down** all teammates and clean up the team

## Scaling Options

| Add reviewer | Perspective | When |
|-------------|------------|------|
| `data-engineer` (Dara) | Database queries, schema design, migrations | DB-heavy code |
| `devops` (Gage) | Dockerfiles, CI/CD, infra-as-code, env config | DevOps code |
| `ux` (Uma) | UI components, accessibility, responsiveness | Frontend code |
| Industry squad agent | Domain-specific compliance (HIPAA, PCI-DSS) | Regulated industries |
