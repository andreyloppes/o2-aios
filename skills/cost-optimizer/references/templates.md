# Cost Report Templates

Ready-to-fill templates for daily, weekly, and monthly cost reports.

---

## Daily Cost Report

```markdown
# Daily Cost Report — [PROJECT NAME]

**Date:** [YYYY-MM-DD]
**Prepared by:** Cost Optimizer

---

## Summary

| Metric | Value |
|--------|-------|
| Total Spend | $X.XX |
| Total Tokens | X.XM (input: X.XM, output: X.XM) |
| Sessions | X |
| Average Cost/Session | $X.XX |
| Cache Hit Rate | XX% |
| Cost Saved via Cache | $X.XX |

## Spend by Model

| Model | Sessions | Input Tokens | Output Tokens | Cost | % Total |
|-------|----------|-------------|---------------|------|---------|
| Opus 4 | X | X.XM | X.XM | $X.XX | XX% |
| Sonnet 4.5 | X | X.XM | X.XM | $X.XX | XX% |
| Haiku 4.5 | X | X.XM | X.XM | $X.XX | XX% |
| **Total** | **X** | **X.XM** | **X.XM** | **$X.XX** | **100%** |

## Top 5 Sessions by Cost

| # | Description | Model | Tokens | Cost |
|---|-------------|-------|--------|------|
| 1 | [Task description] | [Model] | X.XK | $X.XX |
| 2 | [Task description] | [Model] | X.XK | $X.XX |
| 3 | [Task description] | [Model] | X.XK | $X.XX |
| 4 | [Task description] | [Model] | X.XK | $X.XX |
| 5 | [Task description] | [Model] | X.XK | $X.XX |

## Routing Analysis

| Routing Decision | Count | Assessment |
|-----------------|-------|-----------|
| Correct (right model for task) | X | OK |
| Over-routed (expensive model, simple task) | X | Optimize |
| Under-routed (cheap model, complex task) | X | Monitor |

## Optimization Notes

- [Note 1: specific observation about today's usage]
- [Note 2: recommendation for tomorrow]
```

---

## Weekly Cost Report

```markdown
# Weekly Cost Report — [PROJECT NAME]

**Week:** [Week #] ([START DATE] to [END DATE])
**Prepared by:** Cost Optimizer

---

## Executive Summary

Total spend this week: **$XX.XX** ([+/-XX%] vs last week).
[1-2 sentences about key trends or notable changes.]

## Daily Breakdown

| Day | Sessions | Tokens | Cost | Cache Rate |
|-----|----------|--------|------|-----------|
| Monday | X | X.XM | $X.XX | XX% |
| Tuesday | X | X.XM | $X.XX | XX% |
| Wednesday | X | X.XM | $X.XX | XX% |
| Thursday | X | X.XM | $X.XX | XX% |
| Friday | X | X.XM | $X.XX | XX% |
| Saturday | X | X.XM | $X.XX | XX% |
| Sunday | X | X.XM | $X.XX | XX% |
| **Total** | **X** | **X.XM** | **$XX.XX** | **XX%** |

## Model Distribution

| Model | This Week | Last Week | Change |
|-------|-----------|-----------|--------|
| Opus 4 | XX% ($X.XX) | XX% ($X.XX) | [+/-]X% |
| Sonnet 4.5 | XX% ($X.XX) | XX% ($X.XX) | [+/-]X% |
| Haiku 4.5 | XX% ($X.XX) | XX% ($X.XX) | [+/-]X% |

## Cost by Workflow Type

| Workflow | Executions | Avg Cost | Total Cost |
|----------|-----------|----------|-----------|
| Story Cycle | X | $X.XX | $X.XX |
| QA Loop | X | $X.XX | $X.XX |
| Greenfield | X | $X.XX | $X.XX |
| Ad-hoc | X | $X.XX | $X.XX |

## Efficiency Metrics

| Metric | This Week | Last Week | Trend |
|--------|-----------|-----------|-------|
| Cost per Story | $X.XX | $X.XX | [arrow] |
| Cost per Feature | $X.XX | $X.XX | [arrow] |
| Cache Hit Rate | XX% | XX% | [arrow] |
| Opus Usage Rate | XX% | XX% | [arrow] |

## Optimization Actions

### Taken This Week
- [Action 1 and result]
- [Action 2 and result]

### Recommended for Next Week
1. [Recommendation with expected savings]
2. [Recommendation with expected savings]
```

---

## Monthly Cost Report

```markdown
# Monthly Cost Report — [PROJECT NAME]

**Month:** [MONTH YEAR]
**Prepared by:** Cost Optimizer

---

## Executive Summary

Monthly spend: **$XXX.XX** ([+/-XX%] vs previous month).
[2-3 sentences covering key trends, achievements, and concerns.]

## Monthly Overview

| Metric | This Month | Last Month | Change |
|--------|-----------|-----------|--------|
| Total Spend | $XXX.XX | $XXX.XX | [+/-]XX% |
| Total Sessions | XXX | XXX | [+/-]XX% |
| Total Tokens | XX.XM | XX.XM | [+/-]XX% |
| Avg Daily Spend | $X.XX | $X.XX | [+/-]XX% |
| Cache Hit Rate | XX% | XX% | [+/-]Xpp |
| Cost Saved (Cache) | $XX.XX | $XX.XX | [+/-]XX% |

## Weekly Trend

| Week | Spend | Sessions | Tokens | Cache Rate |
|------|-------|----------|--------|-----------|
| Week 1 | $XX.XX | XX | X.XM | XX% |
| Week 2 | $XX.XX | XX | X.XM | XX% |
| Week 3 | $XX.XX | XX | X.XM | XX% |
| Week 4 | $XX.XX | XX | X.XM | XX% |

## Cost by Model (Monthly)

| Model | Tokens (M) | Cost | % of Total | Trend |
|-------|-----------|------|-----------|-------|
| Opus 4 | X.X | $XX.XX | XX% | [vs last month] |
| Sonnet 4.5 | X.X | $XX.XX | XX% | [vs last month] |
| Haiku 4.5 | X.X | $XX.XX | XX% | [vs last month] |

## Cost per Deliverable

| Deliverable | Stories | Sessions | Cost | Cost/Story |
|------------|---------|----------|------|-----------|
| [Feature A] | X | X | $X.XX | $X.XX |
| [Feature B] | X | X | $X.XX | $X.XX |
| [Bug fixes] | X | X | $X.XX | $X.XX |
| [Maintenance] | X | X | $X.XX | $X.XX |

## Budget Status

| Category | Budget | Spent | Remaining | % Used |
|----------|--------|-------|-----------|--------|
| API Costs | $XXX | $XXX.XX | $XX.XX | XX% |
| Projected EOQ | — | $XXX.XX | — | — |

## Month-over-Month Optimization

| Strategy | Implemented | Estimated Savings | Actual Savings |
|----------|-----------|-------------------|----------------|
| Model routing | [Yes/No] | $XX.XX | $XX.XX |
| Cache optimization | [Yes/No] | $XX.XX | $XX.XX |
| Context pruning | [Yes/No] | $XX.XX | $XX.XX |

## Recommendations

1. **[Priority 1]:** [Specific recommendation with projected savings]
2. **[Priority 2]:** [Specific recommendation with projected savings]
3. **[Priority 3]:** [Specific recommendation with projected savings]

---

*Next report: [NEXT MONTH first business day]*
```
