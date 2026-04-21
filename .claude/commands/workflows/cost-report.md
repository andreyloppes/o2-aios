---
name: workflows:cost-report
description: "Weekly cost and ROI analysis with optimization recommendations"
---

You are now executing the **Cost Report Workflow** — a structured process to analyze Claude API spending and generate optimization recommendations.

## Workflow Overview

```
Phase 1: Data Gathering     → Automated (claude.json, sessions.jsonl)
Phase 2: Cost Calculation   → Cost Optimizer skill
Phase 3: Analysis           → /agents:analyst (Atlas)
Phase 4: Recommendations    → Cost Optimizer skill
Phase 5: Report             → /pro:report cost
```

## Your Role
You are the cost analyst coordinator. You will:
1. Gather all cost data from available sources
2. Calculate comprehensive cost breakdowns
3. Identify optimization opportunities
4. Generate a professional cost report

## Phase 1: Data Gathering
**Goal:** Collect all cost-relevant data

### Step 1.1: Current Session Data
**Actions (automated):**
1. Read `~/.claude.json` and extract for the current project:
   - `lastCost`
   - `lastTotalInputTokens`, `lastTotalOutputTokens`
   - `lastTotalCacheCreationInputTokens`, `lastTotalCacheReadInputTokens`
   - `numStartups` (total session count)
2. Extract `lastModelUsage` for model breakdown

### Step 1.2: Historical Session Data
**Actions (automated):**
1. Read `~/.claude-master-pro/data/sessions.jsonl`
2. Filter by requested period (daily/weekly/monthly)
3. Aggregate: total cost, token counts, session counts per period

### Step 1.3: Cost History
**Actions (automated):**
1. Read `~/.claude-master-pro/data/cost-history.json` if exists
2. Compare current period with previous periods

## Phase 2: Cost Calculation
**Goal:** Calculate detailed cost breakdown

**Use skill:** `cost-optimizer`

Calculate:
```
Cost Breakdown:
  By Model:
    Opus:    [tokens] → $[cost] ([%] of total)
    Sonnet:  [tokens] → $[cost] ([%] of total)
    Haiku:   [tokens] → $[cost] ([%] of total)

  By Token Type:
    Input:         [count] → $[cost]
    Output:        [count] → $[cost]
    Cache Created: [count] → $[cost]
    Cache Read:    [count] → $[cost] (savings!)

  By Period:
    Today:     $[cost]
    This Week: $[cost] (avg $[daily avg]/day)
    This Month:$[cost] (projected: $[projection])

  Efficiency:
    Cache Hit Rate:    [%]
    Potential Savings:  $[estimate] with better caching
    Model Routing Savings: $[estimate] routing simple tasks to Haiku
```

## Phase 3: Analysis
**Goal:** Identify patterns and anomalies

**Agent:** `/agents:analyst` (Atlas)
**Input:** Cost calculations from Phase 2
**Actions:**
1. Identify cost trends (increasing, decreasing, stable)
2. Flag anomalies (sessions 3x+ above average)
3. Compare with previous periods
4. Calculate ROI if time savings data is available:
   - Estimated developer hours saved
   - Hourly rate equivalent
   - Net ROI = (hours saved × rate) - AI costs

## Phase 4: Recommendations
**Goal:** Generate actionable cost optimizations

**Use skill:** `cost-optimizer`

Generate recommendations based on data:
1. **Model routing** — If Opus used for simple tasks, suggest Haiku/Sonnet
2. **Cache optimization** — If cache hit rate < 50%, suggest prompt restructuring
3. **Session management** — If many short sessions, suggest consolidating
4. **Agent efficiency** — If some agents cost 5x others, investigate why
5. **Workflow optimization** — If certain workflows are disproportionately expensive

## Phase 5: Report Generation
**Goal:** Produce professional cost report

**Command:** `/pro:report cost`
**Input:** All data from Phases 1-4
**Output:** `docs/cost-report-[date].md`

Format:
```markdown
# Cost Report — [Project Name]
**Period:** [date range]
**Total Cost:** $[total]

## Executive Summary
[2-3 sentences about cost trends and key findings]

## Cost Breakdown
[Tables from Phase 2]

## Trends
[Charts/data from Phase 3]

## Optimization Recommendations
[Prioritized list from Phase 4]

## Projected Savings
[Estimated monthly savings if recommendations implemented]
```

## Activation
1. Ask the user for the report period (default: last 7 days)
2. Start Phase 1 data collection automatically
3. Progress through all phases
4. Present the final report
