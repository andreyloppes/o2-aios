---
name: cost-optimizer
description: "Track and optimize Claude API token usage across multi-agent sessions. Cost calculation, model routing, cache strategy, and spend reporting."
---

# Cost Optimizer

Control what you spend. Know where every token goes.

## Scope

**Use for:** Tracking token usage, calculating costs, optimizing model routing, maximizing cache hits, reducing spend across multi-agent workflows.

**Not for:** General API debugging, rate limit troubleshooting, or billing account management. This skill is about the tokens themselves — counting them, routing them, and spending fewer of them.

---

# The Problem

Multi-agent systems burn tokens fast. A single orchestration session with 5 agents can consume millions of tokens in under an hour. Without tracking, costs spiral silently. Without routing, expensive models handle cheap tasks. Without caching, identical prompts get reprocessed at full price.

The math is unforgiving. A complex Opus 4 session that runs 500K input tokens and 100K output tokens costs roughly $15. Run that five times a day across a team and you are spending $375/day — $8,000/month — before anyone notices.

The fix is not "use a cheaper model." The fix is knowing exactly where tokens go and making deliberate choices about which model handles which task. A well-routed system can cut costs by 60-80% without sacrificing output quality.

---

# Pricing Reference

All prices per million tokens. These are the numbers you calculate against.

## Claude Opus 4

The reasoning powerhouse. Use it when the problem requires it.

| Token Type   | Price per 1M |
|-------------|-------------|
| Input        | $15.00      |
| Output       | $75.00      |
| Cache Write  | $18.75      |
| Cache Read   | $3.75       |

## Claude Sonnet 4.5

The workhorse. Handles 70-80% of real coding tasks well.

| Token Type   | Price per 1M |
|-------------|-------------|
| Input        | $3.00       |
| Output       | $15.00      |
| Cache Write  | $3.75       |
| Cache Read   | $0.30       |

## Claude Haiku 4.5

The sprinter. Fast, cheap, surprisingly capable for simple tasks.

| Token Type   | Price per 1M |
|-------------|-------------|
| Input        | $0.80       |
| Output       | $4.00       |
| Cache Write  | $1.00       |
| Cache Read   | $0.08       |

**Key ratio:** Opus output is **18.75x** more expensive than Haiku output. Every task you move from Opus to Haiku saves that multiplier. Even moving from Opus to Sonnet saves **5x** on output.

---

# Model Routing Strategy

The single highest-impact optimization. Not every task needs the most powerful model.

## Haiku 4.5 — The Fast Lane

Route these tasks to Haiku. They do not benefit from deeper reasoning.

- **File reads and navigation** — reading files, listing directories, checking structure
- **Status checks** — git status, test results, build status
- **Simple formatting** — converting between formats, adding boilerplate
- **Grep and search** — finding patterns, locating definitions
- **Template generation** — standard CRUD, boilerplate components
- **Simple refactoring** — rename variables, extract constants, move imports

**Cost profile:** A typical Haiku task uses ~5K input + ~2K output = $0.012 per task.

## Sonnet 4.5 — The Workhorse

The default for most development work. Strong enough for real coding, cheap enough for volume.

- **Standard coding** — implement features from clear specs
- **Code review** — identify bugs, suggest improvements
- **Refactoring** — restructure code while preserving behavior
- **Test writing** — unit tests, integration tests from existing code
- **Bug fixing** — diagnose and fix issues with clear reproduction
- **Documentation** — write docs from existing code

**Cost profile:** A typical Sonnet task uses ~30K input + ~10K output = $0.24 per task.

## Opus 4 — The Architect

Reserve for tasks that genuinely require deep reasoning. Using Opus for simple tasks is like hiring a senior architect to paint walls.

- **Complex architecture** — system design with multiple interacting components
- **Multi-step reasoning** — problems requiring chained logic across files
- **Novel problems** — no clear pattern to follow, requires creative solutions
- **Planning and orchestration** — multi-agent coordination, workflow design
- **Ambiguous specs** — when the requirements need interpretation
- **Cross-cutting refactors** — changes that touch many files with subtle dependencies

**Cost profile:** A typical Opus task uses ~50K input + ~15K output = $1.875 per task.

## The Routing Decision Tree

```
Is this a simple read/search/format task?
  YES -> Haiku ($0.01)
  NO  -> Does it require multi-step reasoning or novel problem-solving?
    YES -> Opus ($1.88)
    NO  -> Sonnet ($0.24)
```

**The 80/20 rule:** In a well-routed system, roughly 40% of tasks go to Haiku, 45% to Sonnet, and 15% to Opus. If more than 30% of your tasks hit Opus, you are over-routing.

---

# Cache Optimization

Caching is the second highest-impact optimization. When the API caches your prompt prefix, subsequent calls with the same prefix pay the cache read rate instead of the full input rate.

## How Caching Works

The API caches the longest prefix of your prompt that matches a previous request. This means:

1. **System prompts** are cached if identical between calls
2. **Conversation history** is cached up to the point where it diverges
3. **Tool definitions** are cached when they appear in the same order

## Maximizing Cache Hits

**Keep system prompts stable.** Do not inject timestamps, random IDs, or per-request variables into your system prompt. Every character change invalidates the cache from that point forward.

**Front-load shared context.** Place the content most likely to be shared across requests at the beginning of the prompt. System instructions first, then stable context, then variable content last.

**Batch similar operations.** If you have 10 files to review, send them in a consistent order. The shared prompt prefix (system + instructions + tool definitions) caches once and applies to all 10.

**Reuse conversation threads.** Extending an existing conversation reuses the cached prefix. Starting a new conversation forces a full cache write.

## Cache Economics

The savings are significant:

| Model | Full Input | Cache Read | Savings |
|-------|-----------|------------|---------|
| Opus 4 | $15.00/M | $3.75/M | **75%** |
| Sonnet 4.5 | $3.00/M | $0.30/M | **90%** |
| Haiku 4.5 | $0.80/M | $0.08/M | **90%** |

A Sonnet session with 100K cached input tokens saves $0.27 per request. Over 50 requests in a session, that is $13.50 saved from cache alone.

## Cache Write Cost

Cache writes cost more than regular input. The first request pays the cache write rate, and subsequent requests pay the cheaper cache read rate. This means caching only saves money when you reuse the cached content at least 2-3 times.

**Break-even calculation:**
- Cache write cost = 1.25x input cost (for Opus)
- Cache read cost = 0.25x input cost (for Opus)
- Break-even = ceil(0.25 / (1.0 - 0.25)) = 1 additional read

After one cache read, you are already saving money. After 5 reads, the savings are substantial.

---

# Agent Session Strategy

How you manage agent sessions directly impacts token consumption.

## Resume vs New Sessions

**Resume when:** The agent needs context from previous work. The cost of re-establishing context through new prompts exceeds the cost of the cached conversation history.

**New session when:** The task is unrelated to previous work. A fresh session avoids loading irrelevant context that bloats input tokens.

**Rule of thumb:** If more than 50% of the previous conversation is relevant, resume. Otherwise, start fresh.

## Context Window Management

Every token in the context window is an input token you pay for on every subsequent message. Bloated context compounds costs exponentially.

**Trim aggressively.** After an agent completes a sub-task, summarize the result and discard the detailed work. A 200-token summary is cheaper than carrying 5,000 tokens of intermediate reasoning.

**Use progressive disclosure.** Do not dump entire codebases into context. Load files as needed, read specific sections, and release them when done.

**Separate concerns.** Two focused sessions of 50K tokens each are cheaper than one bloated session of 150K tokens, because the 150K session pays for all that context on every exchange.

## Multi-Agent Token Flow

In a multi-agent system, the orchestrator pays the highest token cost because it maintains context about all agents. Minimize orchestrator turns by:

1. Giving agents clear, complete instructions upfront
2. Having agents report concise summaries, not full outputs
3. Avoiding back-and-forth clarification loops
4. Using parallel execution where agents do not depend on each other

---

# Measurement

You cannot optimize what you do not measure.

## Reading Session Data

Claude Code tracks token usage in session data. After each session:

1. Check total input tokens, output tokens, and cache stats
2. Note which model was used for each interaction
3. Calculate the cost using the formulas below

## Cost Formulas

**Per-request cost:**

```
cost = (input_tokens * input_rate / 1_000_000)
     + (output_tokens * output_rate / 1_000_000)
     + (cache_write_tokens * cache_write_rate / 1_000_000)
     + (cache_read_tokens * cache_read_rate / 1_000_000)
```

**Session cost:** Sum of all request costs in the session.

**Agent cost:** Sum of all session costs for that agent.

**Workflow cost:** Sum of all agent costs in the workflow.

## Example Calculation

A Sonnet 4.5 coding session:
- 150K input tokens (80K cached reads, 70K fresh)
- 45K output tokens
- 70K cache write tokens (first request only)

```
fresh_input  = 70,000 * $3.00 / 1,000,000  = $0.21
cache_write  = 70,000 * $3.75 / 1,000,000  = $0.26
cache_read   = 80,000 * $0.30 / 1,000,000  = $0.024
output       = 45,000 * $15.00 / 1,000,000 = $0.675
total        = $1.17
```

Without caching, the same session with 150K fresh input would cost:
```
input  = 150,000 * $3.00 / 1,000,000 = $0.45
output = 45,000 * $15.00 / 1,000,000 = $0.675
total  = $1.125
```

The cache write made this request slightly more expensive, but subsequent requests in the same session benefit from the cached prefix.

---

# Report Templates

## Daily Summary

Generate at end of day. Shows where tokens went.

```markdown
# Cost Report — [DATE]

## Summary
| Metric | Value |
|--------|-------|
| Total Spend | $X.XX |
| Total Tokens | X.XM |
| Sessions | X |
| Avg Cost/Session | $X.XX |

## By Model
| Model | Tokens | Cost | % of Total |
|-------|--------|------|-----------|
| Opus 4 | X.XM | $X.XX | XX% |
| Sonnet 4.5 | X.XM | $X.XX | XX% |
| Haiku 4.5 | X.XM | $X.XX | XX% |

## Cache Performance
| Metric | Value |
|--------|-------|
| Cache Hit Rate | XX% |
| Tokens Saved | X.XM |
| Cost Saved | $X.XX |

## Top 3 Expensive Sessions
1. [Description] — $X.XX (Model, X tokens)
2. [Description] — $X.XX (Model, X tokens)
3. [Description] — $X.XX (Model, X tokens)

## Optimization Notes
- [Observation about routing or caching opportunity]
```

## Weekly Trend

Track progress over time. Shows whether optimization is working.

```markdown
# Weekly Cost Trend — Week of [DATE]

## Week Over Week
| Day | Spend | Tokens | Cache Rate |
|-----|-------|--------|-----------|
| Mon | $X.XX | X.XM | XX% |
| Tue | $X.XX | X.XM | XX% |
| Wed | $X.XX | X.XM | XX% |
| Thu | $X.XX | X.XM | XX% |
| Fri | $X.XX | X.XM | XX% |
| **Total** | **$XX.XX** | **X.XM** | **XX%** |

## Model Distribution
[Percentage breakdown of tasks routed to each model]

## Recommendations
- [Specific action items based on the week's data]
```

---

# Optimization Checklist

Before any multi-agent workflow, run through this list:

1. **Model routing defined?** Each agent type mapped to a default model.
2. **Cache strategy set?** System prompts stable, shared context front-loaded.
3. **Context limits set?** Maximum token budget per agent session.
4. **Reporting enabled?** Token tracking active for post-session analysis.
5. **Parallel execution planned?** Independent tasks run simultaneously, not sequentially.

---

# Commands

- `/cost-optimizer:analyze` — Analyze current session or project token usage and calculate costs
- `/cost-optimizer:optimize` — Review current routing and suggest specific optimizations
- `/cost-optimizer:report` — Generate a cost report (daily, weekly, or monthly)

---

# Deep Dives

For more detail on specific topics:
- `references/pricing.md` — Complete pricing table with all models, tiers, and worked examples
- `references/strategies.md` — 10+ specific cost reduction strategies with before/after scenarios
- `references/templates.md` — Full markdown templates for cost reports
