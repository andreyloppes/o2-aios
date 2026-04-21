# Cost Reduction Strategies

Specific, actionable strategies with before/after scenarios. Ordered by expected impact.

---

## Strategy 1: Model Routing by Task Type

**Impact: 60-80% cost reduction**

Route tasks to the cheapest model that can handle them.

**Before:** All tasks sent to Opus 4.
```
10 file reads/day     @ Opus = 10 * $0.45  = $4.50
15 coding tasks/day   @ Opus = 15 * $1.88  = $28.20
5 reviews/day         @ Opus = 5 * $1.50   = $7.50
Daily total = $40.20
```

**After:** Route by complexity.
```
10 file reads/day     @ Haiku  = 10 * $0.01  = $0.10
15 coding tasks/day   @ Sonnet = 15 * $0.24  = $3.60
3 complex tasks/day   @ Opus   = 3 * $1.88   = $5.64
2 simple reviews/day  @ Sonnet = 2 * $0.24   = $0.48
3 complex reviews/day @ Sonnet = 3 * $0.24   = $0.72
Daily total = $10.54
```

**Savings: $29.66/day = $593/month (74% reduction)**

---

## Strategy 2: Cache-Friendly Prompt Design

**Impact: 20-40% cost reduction on input tokens**

Structure prompts so the stable prefix is long and the variable suffix is short.

**Before:** System prompt changes every request (timestamp injected).
```
System: "You are a dev assistant. Current time: 2026-02-17T14:23:01Z..."
Result: 0% cache hit rate. Every request pays full input price.
50 requests * 30K input tokens * $3.00/M = $4.50/day (Sonnet)
```

**After:** Stable system prompt, variable content at the end.
```
System: "You are a dev assistant." (stable — cached after first request)
User: "[timestamp and context here]" (variable — only this is fresh)
Result: 80% cache hit rate on system + history prefix.
50 requests * 6K fresh input * $3.00/M + 24K cached * $0.30/M = $1.26/day
```

**Savings: $3.24/day = $65/month (72% reduction on input cost)**

---

## Strategy 3: Context Window Pruning

**Impact: 30-50% cost reduction per session**

Aggressively trim conversation history. Summarize completed work instead of carrying full output.

**Before:** Full conversation history retained. After 20 exchanges, context is 200K tokens.
```
Exchange 20: 200K input tokens @ Sonnet = $0.60 per exchange
Last 10 exchanges: ~$4.50
```

**After:** Summarize after each major task. Context stays under 50K.
```
Exchange 20: 50K input tokens @ Sonnet = $0.15 per exchange
Last 10 exchanges: ~$1.13
```

**Savings: $3.37 per session. At 3 sessions/day = $10.11/day = $202/month**

---

## Strategy 4: Parallel Over Sequential Execution

**Impact: 20-30% cost reduction through reduced orchestrator overhead**

Run independent tasks in parallel. The orchestrator pays fewer tokens coordinating.

**Before:** Sequential — orchestrator manages 5 tasks one at a time.
```
Orchestrator context grows with each task result.
Task 5 orchestrator context: 80K tokens.
Total orchestrator cost: ~$3.60 (input accumulation)
```

**After:** Parallel — orchestrator dispatches 5 tasks simultaneously.
```
Orchestrator sends all tasks at once, receives all results once.
Single orchestrator context: 30K tokens.
Total orchestrator cost: ~$0.90
```

**Savings: $2.70 per workflow = $54/day at 20 workflows**

---

## Strategy 5: Haiku for File Operations

**Impact: 95% reduction on file-related costs**

Every `read_file`, `list_directory`, and `grep` call can use Haiku.

**Before:** Sonnet handles all file operations during development.
```
Average dev session: 30 file reads @ 5K input each
30 * 5,000 * $3.00/M = $0.45 per session on file reads alone
```

**After:** Haiku handles file operations.
```
30 * 5,000 * $0.80/M = $0.12 per session
```

**Savings: $0.33/session. At 10 sessions/day = $3.30/day = $66/month**

---

## Strategy 6: Session Resume Over New Sessions

**Impact: 15-25% reduction through cache reuse**

Resume existing sessions when context is relevant instead of starting fresh.

**Before:** New session for every task. Full prompt re-sent each time.
```
5 related tasks, each starting fresh.
5 * 30K input (full system + context) = 150K fresh input
150K * $3.00/M = $0.45
```

**After:** Single session, tasks build on cached context.
```
1 session, 5 tasks within it.
30K fresh + 120K cached = same 150K total
30K * $3.00/M + 120K * $0.30/M = $0.126
```

**Savings: $0.324 per task group = $6.48/day at 20 groups**

---

## Strategy 7: Concise Agent Responses

**Impact: 10-20% reduction on output tokens**

Configure agents to return structured data, not narrative explanations.

**Before:** Agent returns full explanation with reasoning.
```
"I analyzed the codebase and found that the authentication module has
three potential issues. First, the token validation... [500 tokens of explanation]"
```

**After:** Agent returns structured summary.
```
"Auth issues: 3 found. 1) Token validation missing expiry check (auth.ts:42).
2) No refresh logic (auth.ts:78). 3) Missing CSRF protection (middleware.ts:15)."
[80 tokens]
```

**Savings:** 420 output tokens per response. At Sonnet: $0.0063/response.
At 100 responses/day = $0.63/day = $12.60/month.

Small individually, but compounds across high-volume systems.

---

## Strategy 8: Batch Similar Operations

**Impact: 15-25% reduction through amortized cache costs**

Group similar tasks together to maximize cache prefix reuse.

**Before:** Interleave different task types.
```
Review file A -> Implement feature B -> Review file C -> Implement feature D
Each switch invalidates relevant cache. 4 separate contexts.
```

**After:** Batch by type.
```
Review files A, C (shared review context cached)
Implement features B, D (shared dev context cached)
2 contexts instead of 4. Higher cache hit rate.
```

**Savings:** Varies by batch size. Typically 15-25% on input costs for batched work.

---

## Strategy 9: Progressive Context Loading

**Impact: 10-15% reduction on input tokens**

Load only the files and context needed for the current step, not everything upfront.

**Before:** Load entire module (10 files) before working on one function.
```
10 files * avg 200 lines * ~4 tokens/line = 8,000 tokens loaded unnecessarily
```

**After:** Load only the target file and its direct dependencies.
```
2 files * avg 200 lines * ~4 tokens/line = 1,600 tokens
```

**Savings:** 6,400 tokens per task. At Sonnet: $0.019/task. Scales with codebase size.

---

## Strategy 10: Intelligent Retry Limits

**Impact: Variable — prevents cost spirals**

Set maximum retry counts to prevent agents from burning tokens on unsolvable problems.

**Before:** Agent retries failing approach indefinitely.
```
QA agent finds bug -> Dev retries same approach 8 times -> finally escalates
8 retries * $0.24/attempt = $1.92 wasted
```

**After:** Max 3 retries before escalation or approach change.
```
QA agent finds bug -> Dev tries 3 times -> escalates to Opus for analysis
3 retries * $0.24 + 1 Opus analysis * $1.88 = $2.60 total, but with a solution
```

**Savings:** Prevents unbounded cost spirals. Typical savings: $1-5 per stuck task.

---

## Strategy 11: Deduplicate Agent Instructions

**Impact: 5-10% reduction on input tokens**

When multiple agents share similar base instructions, factor out common parts.

**Before:** Each agent gets full instructions including shared context.
```
5 agents * 2K shared instruction tokens = 10K redundant tokens per workflow
```

**After:** Shared base loaded once, agent-specific additions per agent.
```
2K shared + 5 * 500 agent-specific = 4.5K total
```

**Savings:** 5,500 tokens per workflow execution.

---

## Quick Reference: Strategy Priority

| Strategy | Effort | Impact | Priority |
|----------|--------|--------|----------|
| Model routing | Low | Very High | 1 |
| Cache-friendly prompts | Low | High | 2 |
| Context pruning | Medium | High | 3 |
| Parallel execution | Medium | Medium | 4 |
| Haiku for file ops | Low | Medium | 5 |
| Session resume | Low | Medium | 6 |
| Concise responses | Low | Low-Medium | 7 |
| Batch operations | Medium | Medium | 8 |
| Progressive loading | Medium | Low-Medium | 9 |
| Retry limits | Low | Variable | 10 |
| Deduplicate instructions | Low | Low | 11 |
