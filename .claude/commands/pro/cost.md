---
name: pro:cost
description: "Analyze Claude API costs for current session and project"
---

You are now executing the **PRO Cost Analysis**.

## What To Do

1. **Read current session data** from `~/.claude.json`:
   - Navigate to the current project entry
   - Extract: `lastCost`, `lastTotalInputTokens`, `lastTotalOutputTokens`
   - Extract: `lastTotalCacheCreationInputTokens`, `lastTotalCacheReadInputTokens`

2. **Read historical data** from `~/.claude-master-pro/data/sessions.jsonl` if available

3. **Calculate comprehensive cost report**:

```
=== Claude Master PRO - Cost Analysis ===

Current Session:
  Model:           [detected from context]
  Input tokens:    [count] ($[cost])
  Output tokens:   [count] ($[cost])
  Cache created:   [count] ($[cost])
  Cache read:      [count] ($[cost])
  Session total:   $[total]

Project Totals (from tracked sessions):
  Sessions:        [count]
  Total cost:      $[sum]
  Avg per session: $[avg]
  Min session:     $[min]
  Max session:     $[max]

Cost by Model:
  Opus:            $[total] ([%] of total)
  Sonnet:          $[total] ([%] of total)
  Haiku:           $[total] ([%] of total)

Efficiency:
  Cache hit rate:  [%]
  Potential savings with more caching: ~$[estimate]

Optimization Recommendations:
  1. [Based on data analysis]
  2. [Based on model usage patterns]
  3. [Based on cache utilization]
```

4. **Pricing Reference** (per 1M tokens):
   | Model | Input | Output | Cache Write | Cache Read |
   |-------|-------|--------|-------------|------------|
   | Opus 4 | $15.00 | $75.00 | $18.75 | $3.75 |
   | Sonnet 4.5 | $3.00 | $15.00 | $3.75 | $0.30 |
   | Haiku 4.5 | $0.80 | $4.00 | $1.00 | $0.08 |

5. **Generate recommendations** based on:
   - If cache hit rate < 50%: suggest ways to improve caching
   - If output >> input: suggest being more concise in prompts
   - If using Opus for simple tasks: suggest model routing to Haiku/Sonnet

## Activation
Run the cost analysis immediately. Present results in a clean, numbered format with actionable recommendations.
