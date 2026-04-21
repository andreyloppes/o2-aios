---
name: client-report
description: "Generate polished, professional reports from agent outputs for client delivery. Status updates, sprint reviews, cost breakdowns, and executive summaries."
---

# Client Report

Ship professional reports. Data in, polished deliverable out.

## Scope

**Use for:** Generating client-facing reports from development data. Status updates, sprint reviews, weekly summaries, deliverables documentation, and cost breakdowns.

**Not for:** Internal agent logs, debug output, or raw metric dumps. This skill transforms raw data into reports that a client, stakeholder, or executive can read without technical translation.

---

# The Problem

Multi-agent systems produce excellent technical output but terrible client communication. An agent can build a feature in minutes and explain it in a commit message that only developers understand. The gap between "work done" and "client informed" is where projects lose trust.

Clients do not care about token counts, model routing, or QA iteration cycles. They care about three things:
1. **What was accomplished** — in terms they understand
2. **What is next** — so they can plan around it
3. **Are we on track** — budget, timeline, and scope

A professional report answers all three in under two minutes of reading time. It uses their language, shows their metrics, and respects their time. No jargon, no filler, no walls of text.

The discipline of regular reporting also forces clarity internally. If you cannot summarize what was done this week in three bullet points, the work was not well-defined.

---

# Report Types

Five report types, each for a specific purpose and audience.

## 1. Status Report

**Purpose:** Quick update on current state of work.
**Frequency:** On-demand or after significant milestones.
**Length:** 1 page.
**Audience:** Project stakeholder who needs a snapshot.

**Sections:**
- Project header (name, date, author)
- Status indicator (On Track / At Risk / Blocked)
- Executive summary (2-3 sentences)
- Completed items (bullet list)
- In progress items (bullet list with % complete)
- Blockers or risks (if any)
- Next actions

## 2. Weekly Report

**Purpose:** Regular cadence update covering the full week.
**Frequency:** Weekly, delivered on Friday or Monday.
**Length:** 1-2 pages.
**Audience:** Client project manager or product owner.

**Sections:**
- Project header with week number and date range
- Executive summary (3-4 sentences covering the week)
- Accomplishments (grouped by feature or epic)
- Metrics table (velocity, quality, cost)
- Challenges and how they were resolved
- Plan for next week
- Budget status (if applicable)

## 3. Sprint Report

**Purpose:** Comprehensive sprint review with metrics and analysis.
**Frequency:** End of each sprint (1-2 weeks).
**Length:** 2-3 pages.
**Audience:** Product owner, technical lead, stakeholders.

**Sections:**
- Sprint header (number, dates, goals)
- Executive summary
- Sprint goals assessment (met / partially met / missed)
- Delivered features with descriptions
- Sprint metrics (velocity, burndown, quality)
- Retrospective highlights (what worked, what to improve)
- Carry-over items (unfinished work with reason)
- Next sprint preview

## 4. Client Deliverable

**Purpose:** Document a completed deliverable for handoff.
**Frequency:** Per deliverable or milestone.
**Length:** 2-4 pages.
**Audience:** Client technical team or decision makers.

**Sections:**
- Deliverable header (name, version, date)
- Executive summary
- What was built (feature list with descriptions)
- Technical overview (architecture, stack, key decisions)
- How to use / access the deliverable
- Known limitations or future work
- Acceptance criteria checklist (pass/fail)
- Sign-off section

## 5. Cost Report

**Purpose:** Transparent breakdown of development costs.
**Frequency:** Monthly or per milestone.
**Length:** 1-2 pages.
**Audience:** Client finance contact or project sponsor.

**Sections:**
- Cost header (period, project)
- Executive summary
- Cost summary table (total, by category)
- Cost by feature or epic
- Budget vs actual comparison
- Cost trend chart data
- Optimization actions taken
- Projected remaining cost

---

# Template System

Every report follows a consistent structure. This builds recognition and trust — the client knows where to find what they need.

## Universal Structure

```markdown
# [Report Type] — [Project Name]

**Date:** [YYYY-MM-DD]
**Period:** [Start] to [End]  (if applicable)
**Prepared by:** [Team/Agent name]
**Status:** [On Track | At Risk | Blocked]  (if applicable)

---

## Executive Summary

[2-4 sentences. What happened, what it means, what is next.
This is the most important section. Many readers will only read this.]

---

## [Main Content Sections]

[Varies by report type. See individual templates.]

---

## Next Steps

1. [Action item with owner and target date]
2. [Action item with owner and target date]
3. [Action item with owner and target date]

---

*[Company Name] — Confidential*
*Generated [date]*
```

## Formatting Rules

- **Headers:** Use H1 for the report title only. H2 for major sections. H3 for subsections.
- **Tables:** Use for any data with 3+ rows. Align numbers right.
- **Lists:** Use bullet points for accomplishments. Use numbered lists for action items and sequences.
- **Bold:** Use for key terms, metrics, and status indicators. Do not overuse.
- **Length:** Executive summary never exceeds 4 sentences. Individual bullet points never exceed 2 lines.
- **Dates:** Always YYYY-MM-DD format for consistency.

## Metrics Display

When including metrics, always show:
1. The metric name
2. The current value
3. The comparison (previous period, target, or benchmark)
4. The trend direction (up/down/stable)

```markdown
| Metric | Current | Previous | Trend |
|--------|---------|----------|-------|
| Features Delivered | 8 | 6 | +33% |
| QA Pass Rate | 78% | 65% | +13pp |
| Sprint Velocity | 24 pts | 20 pts | +20% |
```

---

# Data Collection Strategy

Reports are only valuable if the data is accurate. Automate collection wherever possible.

## From Git Log

```bash
# Commits in period
git log --after="YYYY-MM-DD" --before="YYYY-MM-DD" --oneline | wc -l

# Features delivered (by conventional commit or PR merge)
git log --after="YYYY-MM-DD" --merges --oneline

# Contributors
git log --after="YYYY-MM-DD" --format='%an' | sort -u
```

**Map to report:** Commit count becomes "development activity." Merge count becomes "features delivered." Contributor list becomes "team members active."

## From Stories Folder

If using a stories/ tracking system:

- Count files by status (todo, in-progress, done, archived)
- Extract completion dates from file metadata or content
- Calculate velocity from done-count per period

**Map to report:** Done stories become "Accomplishments." In-progress stories become "Current Work." Todo stories become "Upcoming."

## From Session Data

Token and cost data from Claude sessions:

- Total tokens consumed in period
- Cost breakdown by model
- Session count and average duration

**Map to report:** Total cost becomes "Development Investment." Token distribution becomes efficiency metrics. Session count indicates development intensity.

## From Documentation

- New or updated docs indicate maturity progress
- Architecture decision records show technical evolution
- README/changelog updates indicate release readiness

**Map to report:** Documentation state becomes "Project Health" indicators.

---

# Branding Customization

Reports should feel like they come from a professional organization, not a template.

## Company Identity

At minimum, customize:

1. **Company name** — appears in header and footer
2. **Project name** — appears in every report title
3. **Prepared by** — team name or individual name
4. **Confidentiality notice** — footer text

## Advanced Customization

If the client provides brand guidelines:

- **Primary color** — use for headers and emphasis (note: markdown does not support colors, but HTML reports can)
- **Logo reference** — include path or URL in header
- **Font preference** — note in template for rendered output
- **Terminology** — use client's preferred terms (e.g., "iteration" vs "sprint," "deliverable" vs "milestone")

## Client-Specific Terminology

Map internal terms to client-facing language:

| Internal | Client-Facing |
|----------|--------------|
| Story | Task / Work Item |
| Sprint | Iteration / Cycle |
| Agent | Team Member / Specialist |
| Token cost | Development cost |
| QA loop | Quality review |
| Deployment | Release / Go-live |
| Technical debt | Maintenance items |
| Cache optimization | Efficiency improvement |

Never use internal jargon in a client report. If a term would require explanation, replace it.

---

# Tone Guide

Professional reports follow strict tone rules.

## Do

- **Be direct.** "We delivered 8 features this sprint" not "We are pleased to report that the team successfully completed the delivery of eight feature implementations."
- **Be specific.** "Authentication module is 80% complete, targeting Wednesday" not "Auth is almost done."
- **Be honest.** If something is late, say so and explain why. Clients respect transparency.
- **Lead with impact.** "Users can now export reports as PDF" not "Implemented PDF export functionality in the reports module."
- **Use active voice.** "We completed" not "It was completed by the team."
- **Quantify everything.** Numbers build confidence. "3 of 5 milestones complete" not "most milestones done."

## Do Not

- **Do not use filler.** Remove "In order to," "It should be noted that," "As previously mentioned."
- **Do not hedge excessively.** One qualifier per statement maximum. "This may impact timeline" not "This could potentially have some impact on the overall timeline."
- **Do not use technical jargon.** No model names, token counts, or agent IDs in client reports.
- **Do not pad length.** A half-page report with real content beats a two-page report with filler.
- **Do not use passive voice.** "We identified a risk" not "A risk was identified."
- **Do not include raw data.** Process it into insights first.
- **Do not apologize.** State facts and next steps, not regrets.

## Confidence Scale

Match your language to your certainty:

| Certainty | Language |
|-----------|---------|
| Confirmed | "We completed X." "X is live." |
| High confidence | "We expect X by Friday." "X is on track." |
| Moderate | "We are targeting X. Timeline depends on Y." |
| Low | "X is at risk. We are evaluating alternatives." |
| Blocked | "X is blocked by Y. We need Z to proceed." |

---

# Data-Driven Sections

Every claim in a report should be backed by data. Here is how to structure data-heavy sections.

## Progress Tables

Show work item status clearly:

```markdown
| Feature | Status | Progress | Target |
|---------|--------|----------|--------|
| User Authentication | Complete | 100% | Feb 10 |
| Dashboard Analytics | In Progress | 65% | Feb 17 |
| Export Module | In Progress | 30% | Feb 21 |
| Admin Panel | Not Started | 0% | Feb 28 |
```

## Metric Comparisons

Always show context — a number alone is meaningless:

```markdown
## Sprint Metrics

| Metric | Sprint 3 | Sprint 2 | Delta |
|--------|----------|----------|-------|
| Velocity (story points) | 28 | 22 | +27% |
| Features Delivered | 6 | 4 | +50% |
| QA First-Pass Rate | 75% | 62% | +13pp |
| Avg Cycle Time | 1.8 days | 2.4 days | -25% |
```

## Budget Tracking

Show budget consumption transparently:

```markdown
## Budget Status

| Category | Budget | Spent | Remaining | % Used |
|----------|--------|-------|-----------|--------|
| Development | $5,000 | $3,200 | $1,800 | 64% |
| Infrastructure | $500 | $180 | $320 | 36% |
| **Total** | **$5,500** | **$3,380** | **$2,120** | **61%** |

**Projection:** At current burn rate, budget will be fully consumed by March 8.
This is 3 days before the planned completion date of March 11.
```

---

# Quality Checklist

Before delivering any report, verify:

1. **Executive summary stands alone.** Can someone read only the summary and understand the project state? If not, rewrite it.
2. **No jargon.** Read every sentence as if you are not a developer. Flag any term that needs explanation.
3. **All numbers have context.** Every metric shows a comparison — previous period, target, or benchmark.
4. **Action items are specific.** Each next step has an owner, a deliverable, and a date.
5. **Consistent formatting.** Same date format, table alignment, heading levels throughout.
6. **Appropriate length.** Status reports: 1 page. Weekly: 1-2 pages. Sprint: 2-3 pages. Cut anything that does not serve the reader.
7. **Tone check.** Read it aloud. Does it sound confident and professional? Or hedging and bureaucratic?
8. **Data accuracy.** Every number traces back to a source. No estimated metrics presented as facts.

---

# Workflow

## Generating a Report

1. **Identify report type** based on purpose and audience.
2. **Collect data** from git, sessions, stories, and docs.
3. **Process data into metrics** using formulas from the analytics skill.
4. **Draft using template** for the chosen report type.
5. **Write executive summary last** — it summarizes the content you already wrote.
6. **Apply tone rules** — remove jargon, filler, and passive voice.
7. **Run quality checklist** before delivery.

## Frequency Recommendations

| Report Type | Cadence | Best Day |
|------------|---------|----------|
| Status | On-demand | Any |
| Weekly | Weekly | Friday PM or Monday AM |
| Sprint | Per sprint | Last day of sprint |
| Deliverable | Per milestone | Day of completion |
| Cost | Monthly | First business day |

---

# Commands

- `/client-report:generate` — Generate a report from current project data (specify type: status, weekly, sprint, deliverable, cost)
- `/client-report:template` — Show the template for a specific report type

---

# Deep Dives

For more detail on specific topics:
- `references/templates.md` — Complete templates for all 5 report types, ready to fill
- `references/branding.md` — Detailed customization guide for company branding
- `references/examples.md` — 2 complete example reports showing the templates in action
