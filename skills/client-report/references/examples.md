# Example Reports

Two complete example reports demonstrating the templates in action with realistic data.

---

## Example 1: Status Report

```markdown
# Status Report — TaskFlow Pro

**Date:** 2026-02-14
**Prepared by:** Engineering Team
**Status:** On Track

---

## Executive Summary

The authentication module is complete and deployed to staging. Dashboard analytics
are 65% complete with chart rendering and data aggregation working. We are on track
for the February 21 milestone.

---

## Completed Since Last Update

- User authentication with OAuth2 (Google, GitHub) is live on staging
- Password reset flow with email verification is functional
- Session management with secure token rotation is implemented
- Role-based access control for Admin, Editor, and Viewer roles is active

## Currently In Progress

| Item | Progress | Expected Completion |
|------|----------|-------------------|
| Dashboard analytics — chart components | 80% | Feb 17 |
| Dashboard analytics — data aggregation API | 60% | Feb 18 |
| Dashboard analytics — real-time updates | 30% | Feb 20 |
| Export module — PDF generation | 10% | Feb 24 |

## Next Steps

1. Complete dashboard chart components — Engineering — Feb 17
2. Finalize data aggregation API with caching — Engineering — Feb 18
3. Begin user acceptance testing on auth module — QA — Feb 17
4. Start export module PDF generation — Engineering — Feb 21

---

*Acme Software — Confidential*
```

---

## Example 2: Sprint Report

```markdown
# Sprint 4 Report — TaskFlow Pro

**Sprint Period:** 2026-02-03 to 2026-02-14
**Sprint Goal:** Deliver complete authentication system and begin dashboard analytics
**Prepared by:** Engineering Team

---

## Executive Summary

Sprint 4 met its primary goal. The full authentication system — including OAuth2,
password reset, session management, and role-based access — is deployed to staging
and passing all acceptance tests. Dashboard analytics development started on schedule
and is 35% complete. Sprint velocity increased 22% over Sprint 3. We are positioned
well for the February 28 beta release target.

---

## Sprint Goal Assessment

**Goal:** Deliver complete authentication system and begin dashboard analytics.
**Result:** Met
**Explanation:** All 8 auth stories completed and deployed. 3 of 10 dashboard stories complete.

## Delivered Features

| # | Feature | Description | Stories |
|---|---------|-------------|---------|
| 1 | OAuth2 Authentication | Users can sign in with Google or GitHub accounts. Seamless redirect flow with account linking for existing users. | 3 |
| 2 | Password Management | Secure password reset via email with time-limited tokens. Password strength enforcement with real-time feedback. | 2 |
| 3 | Session Security | Automatic token rotation every 24 hours. Concurrent session detection with forced logout option. | 2 |
| 4 | Access Control | Three-tier permission system (Admin, Editor, Viewer). Admins manage team access from the settings panel. | 1 |
| 5 | Dashboard Charts | Bar, line, and area chart components with responsive layout. Data loading states and error handling. | 3 |

## Sprint Metrics

| Metric | Sprint 4 | Sprint 3 | Delta |
|--------|----------|----------|-------|
| Planned Stories | 14 | 10 | +4 |
| Completed Stories | 11 | 9 | +2 |
| Velocity (points) | 34 | 28 | +22% |
| QA First-Pass Rate | 82% | 67% | +15pp |
| Avg Cycle Time | 1.4 days | 2.1 days | -33% |
| Development Cost | $42.80 | $38.50 | +11% |
| Cost Per Story | $3.89 | $4.28 | -9% |

## Carry-Over Items

| Item | Reason | Plan |
|------|--------|------|
| Dashboard real-time updates | Dependency on WebSocket infrastructure not yet deployed | Priority item in Sprint 5, WebSocket server deploying Feb 17 |
| Dashboard filter panel | Deferred to focus on core chart rendering | Scheduled for Sprint 5, week 2 |
| Export module kickoff | Lower priority than dashboard foundation | Moved to Sprint 5 |

## Retrospective Highlights

**What worked well:**
- Breaking auth stories into small, independently deployable units reduced cycle time by 33%
- Running QA reviews in parallel with development of the next story increased throughput
- Adding acceptance criteria checklists to every story improved first-pass QA rate from 67% to 82%

**What to improve:**
- WebSocket dependency should have been identified during planning, not mid-sprint
- Action: Add a dependency check step to sprint planning for Sprint 5

## Next Sprint Preview

**Sprint 5 Goal:** Complete dashboard analytics and deliver export module MVP.

**Planned deliverables:**
1. Dashboard real-time data updates via WebSocket
2. Dashboard filter and date range panel
3. Dashboard data export (CSV)
4. PDF export module with branded templates
5. User notification system (in-app)

## Budget Status

| Category | Budget | Spent to Date | Remaining | % Used |
|----------|--------|--------------|-----------|--------|
| Development | $500.00 | $198.30 | $301.70 | 40% |
| Infrastructure | $100.00 | $34.50 | $65.50 | 35% |
| **Total** | **$600.00** | **$232.80** | **$367.20** | **39%** |

**Projection:** At current burn rate ($42.80/sprint), development budget will support
approximately 7 more sprints. The planned 4 remaining sprints are well within budget.

---

*Acme Software — Confidential*
*Generated 2026-02-14*
```

---

## Notes on These Examples

### What makes them effective

1. **Executive summary is standalone.** A reader who reads only the summary understands the project state.

2. **Numbers have context.** Every metric shows a comparison (previous sprint, delta, percentage change).

3. **Client language throughout.** No mention of "agents," "tokens," "Sonnet," or "cache." The client sees "Engineering Team," "development cost," and "stories."

4. **Action items are specific.** Each next step has an owner, a deliverable, and a date.

5. **Honest about shortcomings.** Carry-over items include clear reasons and plans, not excuses.

6. **Appropriate length.** Status report is half a page. Sprint report is two pages. Neither wastes the reader's time.

### Common mistakes these examples avoid

- No filler sentences ("We are pleased to report...")
- No technical jargon ("Opus 4 session," "cache hit rate")
- No vague timelines ("soon," "next week")
- No unexplained metrics (every number has a comparison)
- No passive voice ("features were delivered" -> "we delivered features")
