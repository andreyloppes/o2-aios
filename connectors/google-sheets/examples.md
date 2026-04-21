# Google Sheets Connector — Example Prompts

Practical prompts combining Google Sheets MCP with Claude Master agents.

---

## 1. Sprint Tracking with Scrum Master

```
/agents:sm Read the sprint backlog from Google Sheet "Sprint 2026-Q1"
and create stories for all items in the "Ready" column.
Set priority based on the "Priority" column values.
```

## 2. Cost Analysis with Analyst

```
/agents:analyst Pull the monthly expenses from Google Sheet "2026 Budget Tracker"
tab "January". Categorize the expenses by type and provide a breakdown
with percentages. Flag any expenses over $500 that are not in the "Approved" column.
```

## 3. Client Report Data with PM

```
/agents:pm Read the project milestones from Google Sheet "Client Projects"
and generate a status report. For each project, include: completion percentage,
upcoming deadlines, and any items marked "At Risk" in red.
```

## 4. Test Results Logging with QA

```
/agents:qa After running the test suite, append the results to Google Sheet
"QA Test Log" with columns: Date, Test Suite, Passed, Failed, Skipped,
Duration, Notes. Use today's date and the test output I just showed you.
```

## 5. Database Schema Export with Data Engineer

```
/agents:data-engineer Export the database schema documentation to Google Sheet
"DB Schema Registry". Create one tab per schema (public, analytics, staging)
with columns: Table, Column, Type, Nullable, Default, Description.
```

## 6. Revenue Dashboard with Analyst

```
/agents:analyst Read the sales data from Google Sheet "Revenue 2026" tabs
"January" through "March". Calculate MRR, growth rate, and churn rate.
Write the summary metrics to a new tab called "Q1 Summary".
```

## 7. Deployment Checklist with DevOps

```
/agents:devops Read the deployment checklist from Google Sheet "Release Process"
tab "v2.5.0". Check off each item as we complete the deployment steps.
Update the "Status" column and add timestamps to the "Completed At" column.
```

## 8. Team Capacity Planning with SM

```
/agents:sm Read the team availability from Google Sheet "Team Calendar"
for next sprint (Feb 17 - Feb 28). Calculate total available story points
based on each person's availability percentage and their velocity column.
```

## 9. Bug Triage Report

```
/agents:qa Read all rows from Google Sheet "Bug Reports" where Status is "New".
For each bug, analyze the description and suggest a severity level
(Critical/High/Medium/Low). Write your recommendations to the "AI Severity" column.
```

## 10. Infrastructure Costs with DevOps

```
/agents:devops Pull AWS cost data from Google Sheet "Cloud Costs"
for the last 3 months. Identify the top 5 cost drivers, calculate
month-over-month growth, and flag any services with >20% cost increase.
Write a summary row at the bottom.
```
