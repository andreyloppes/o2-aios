# Report Templates

Complete fill-in-the-blank templates for all 5 report types. Copy, replace bracketed values, remove unused sections.

---

## Template 1: Status Report

```markdown
# Status Report — [PROJECT NAME]

**Date:** [YYYY-MM-DD]
**Prepared by:** [NAME/TEAM]
**Status:** [On Track | At Risk | Blocked]

---

## Executive Summary

[2-3 sentences. Current project state, key accomplishment since last update, immediate next step.]

---

## Completed Since Last Update

- [Accomplishment 1 — describe in client terms, not technical terms]
- [Accomplishment 2]
- [Accomplishment 3]

## Currently In Progress

| Item | Progress | Expected Completion |
|------|----------|-------------------|
| [Work item 1] | [XX%] | [Date] |
| [Work item 2] | [XX%] | [Date] |
| [Work item 3] | [XX%] | [Date] |

## Blockers / Risks

| Issue | Impact | Mitigation |
|-------|--------|-----------|
| [Blocker description] | [What it affects] | [What we are doing about it] |

*Remove this section entirely if no blockers exist. Do not write "None."*

## Next Steps

1. [Action — owner — target date]
2. [Action — owner — target date]
3. [Action — owner — target date]

---

*[COMPANY NAME] — Confidential*
```

---

## Template 2: Weekly Report

```markdown
# Weekly Report — [PROJECT NAME]

**Week:** [YYYY-WXX] ([START DATE] to [END DATE])
**Prepared by:** [NAME/TEAM]

---

## Executive Summary

[3-4 sentences. What the team accomplished this week, the most significant outcome, any risks, and the focus for next week.]

---

## This Week's Accomplishments

### [Epic/Feature Group 1]
- [Accomplishment with impact described]
- [Accomplishment with impact described]

### [Epic/Feature Group 2]
- [Accomplishment with impact described]

## Key Metrics

| Metric | This Week | Last Week | Trend |
|--------|-----------|-----------|-------|
| Features Delivered | [X] | [X] | [+/-X%] |
| Tasks Completed | [X] | [X] | [+/-X%] |
| Quality Score | [X%] | [X%] | [+/-Xpp] |

## Challenges & Resolutions

| Challenge | Resolution | Status |
|-----------|-----------|--------|
| [Issue faced] | [How it was resolved] | [Resolved / In Progress] |

*Remove if no challenges this week.*

## Next Week Plan

1. [Priority 1 — what will be delivered]
2. [Priority 2 — what will be delivered]
3. [Priority 3 — what will be delivered]

## Budget Status (if applicable)

| Budget | Spent to Date | Remaining | % Used |
|--------|--------------|-----------|--------|
| $[TOTAL] | $[SPENT] | $[REMAINING] | [XX%] |

---

*[COMPANY NAME] — Confidential*
```

---

## Template 3: Sprint Report

```markdown
# Sprint [NUMBER] Report — [PROJECT NAME]

**Sprint Period:** [START DATE] to [END DATE]
**Sprint Goal:** [One-sentence goal]
**Prepared by:** [NAME/TEAM]

---

## Executive Summary

[3-4 sentences covering: goal met or not, highlights, key metrics, outlook for next sprint.]

---

## Sprint Goal Assessment

**Goal:** [Restate the sprint goal]
**Result:** [Met | Partially Met | Not Met]
**Explanation:** [1-2 sentences if partially met or not met]

## Delivered Features

| # | Feature | Description | Stories |
|---|---------|-------------|---------|
| 1 | [Feature name] | [Client-facing description] | [X] |
| 2 | [Feature name] | [Client-facing description] | [X] |
| 3 | [Feature name] | [Client-facing description] | [X] |

## Sprint Metrics

| Metric | Sprint [N] | Sprint [N-1] | Delta |
|--------|-----------|-------------|-------|
| Planned Stories | [X] | [X] | |
| Completed Stories | [X] | [X] | [+/-X] |
| Velocity (points) | [X] | [X] | [+/-X%] |
| QA Pass Rate | [X%] | [X%] | [+/-Xpp] |
| Avg Cycle Time | [X days] | [X days] | [+/-X%] |

## Carry-Over Items

| Item | Reason | Plan |
|------|--------|------|
| [Incomplete item] | [Why not finished] | [When it will complete] |

*Remove if all items completed.*

## Retrospective Highlights

**What worked well:**
- [Positive observation]
- [Positive observation]

**What to improve:**
- [Improvement area — specific action planned]

## Next Sprint Preview

**Sprint [N+1] Goal:** [One sentence]
**Planned deliverables:**
1. [Feature/item]
2. [Feature/item]
3. [Feature/item]

---

*[COMPANY NAME] — Confidential*
```

---

## Template 4: Client Deliverable

```markdown
# Deliverable Report — [DELIVERABLE NAME]

**Version:** [X.Y]
**Date:** [YYYY-MM-DD]
**Project:** [PROJECT NAME]
**Prepared by:** [NAME/TEAM]

---

## Executive Summary

[2-3 sentences. What was built, its purpose, and readiness for use.]

---

## What Was Built

### [Feature 1]
[Description in client terms. What it does, why it matters, how to access it.]

### [Feature 2]
[Description in client terms.]

### [Feature 3]
[Description in client terms.]

## Technical Overview

| Aspect | Detail |
|--------|--------|
| Architecture | [Brief description] |
| Technology Stack | [Key technologies] |
| Key Decisions | [Notable choices and why] |

## Access & Usage

**URL / Location:** [How to access the deliverable]
**Credentials:** [If applicable, or reference to secure channel]
**Getting Started:** [First steps for the client]

## Acceptance Criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | [Acceptance criterion] | [Pass/Fail] |
| 2 | [Acceptance criterion] | [Pass/Fail] |
| 3 | [Acceptance criterion] | [Pass/Fail] |

## Known Limitations

- [Limitation 1 — what it means and workaround if any]
- [Limitation 2]

*Remove if no limitations.*

## Future Work

- [Planned enhancement 1]
- [Planned enhancement 2]

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Delivery Lead | | | |
| Client Representative | | | |

---

*[COMPANY NAME] — Confidential*
```

---

## Template 5: Cost Report

```markdown
# Cost Report — [PROJECT NAME]

**Period:** [START DATE] to [END DATE]
**Prepared by:** [NAME/TEAM]

---

## Executive Summary

[2-3 sentences. Total spend, comparison to budget, key cost drivers, outlook.]

---

## Cost Summary

| Category | Budget | Actual | Variance | % Used |
|----------|--------|--------|----------|--------|
| Development | $[X] | $[X] | $[+/-X] | [X%] |
| Infrastructure | $[X] | $[X] | $[+/-X] | [X%] |
| Other | $[X] | $[X] | $[+/-X] | [X%] |
| **Total** | **$[X]** | **$[X]** | **$[+/-X]** | **[X%]** |

## Cost by Feature

| Feature | Investment | Stories | Cost/Story |
|---------|-----------|---------|-----------|
| [Feature 1] | $[X] | [X] | $[X] |
| [Feature 2] | $[X] | [X] | $[X] |
| [Feature 3] | $[X] | [X] | $[X] |

## Trend

| Period | Spend | Cumulative | Budget Remaining |
|--------|-------|-----------|-----------------|
| [Period 1] | $[X] | $[X] | $[X] |
| [Period 2] | $[X] | $[X] | $[X] |
| [Period 3] | $[X] | $[X] | $[X] |

## Efficiency Improvements

| Action Taken | Savings |
|-------------|---------|
| [Optimization 1] | $[X]/month |
| [Optimization 2] | $[X]/month |

## Projection

**Projected total project cost:** $[X]
**Budget:** $[X]
**Projected variance:** $[+/-X] ([on track / over / under])

## Next Steps

1. [Cost-related action item]
2. [Cost-related action item]

---

*[COMPANY NAME] — Confidential*
```
