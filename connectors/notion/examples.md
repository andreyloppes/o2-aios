# Notion Connector — Example Prompts

Practical prompts combining Notion MCP with Claude Master agents.

---

## 1. Sprint Planning with Product Manager

```
/agents:pm Search my Notion workspace for the "Product Roadmap" database.
List all items with status "Planned" for Q1 2026. Prioritize them
by business impact and create a recommended sprint plan.
```

## 2. Technical Documentation with Architect

```
/agents:architect Read the "Architecture Decisions" page in Notion.
Analyze the current ADRs (Architecture Decision Records) and identify
any gaps. Create a new ADR page for the microservices migration
we discussed, following the existing template format.
```

## 3. Meeting Notes Summarization

```
/agents:pm Read the last 5 pages from my Notion "Meeting Notes" database.
Summarize key decisions, action items, and blockers across all meetings.
Create a new page called "Weekly Summary - Week 8" with the compiled data.
```

## 4. User Story Creation with Scrum Master

```
/agents:sm Query the "Feature Requests" database in Notion filtered by
votes > 10. For each request, create a user story in the "Sprint Backlog"
database with proper acceptance criteria and story point estimates.
```

## 5. QA Test Plan from Requirements

```
/agents:qa Read the "PRD: Payment System v2" page from Notion.
Extract all testable requirements and create test cases in the
"QA Test Plans" database. Include: test name, preconditions,
steps, expected result, and priority.
```

## 6. Onboarding Checklist with DevOps

```
/agents:devops Read the "Developer Onboarding" page in Notion.
Check which setup steps are automated and which are manual.
Suggest improvements and update the page with automation scripts
for each manual step.
```

## 7. Competitive Analysis with Analyst

```
/agents:analyst Search Notion for the "Competitive Analysis" database.
Read all competitor entries and their feature comparisons.
Identify gaps where we are behind and opportunities where we lead.
Create a summary page with a feature matrix.
```

## 8. Release Notes Generation

```
/agents:pm Query the "Changelog" database in Notion for all items
with release "v2.5.0". Generate formatted release notes organized
by: New Features, Improvements, Bug Fixes, Breaking Changes.
Create a new page "Release Notes v2.5.0" with the content.
```

## 9. Knowledge Base Audit with QA

```
/agents:qa Search all pages in the "Engineering Wiki" section of Notion.
Identify pages that have not been updated in the last 6 months.
Create a "Stale Documentation Report" page listing each outdated page
with its last edit date and suggested owner.
```

## 10. Project Status Dashboard

```
/agents:analyst Read all entries from the "Active Projects" database in Notion.
For each project, calculate: days since last update, budget utilization,
milestone completion rate. Update each entry's "Health Score" property
with a calculated value (Green/Yellow/Red).
```
