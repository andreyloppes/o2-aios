# Slack & Discord Connector — Example Prompts

Practical prompts combining Slack/Discord MCP with Claude Master agents.

---

## 1. Deployment Notifications with DevOps

```
/agents:devops After the deployment completes, send a message to
#deployments on Slack with: version number, commit hash, deployment time,
and a summary of changes. Use the :rocket: emoji in the message.
```

## 2. Daily Standup Summary with SM

```
/agents:sm Read the last 24 hours of messages from #daily-standup on Slack.
Extract each person's update (what they did, what they're doing, blockers).
Compile a structured summary and post it to #team-leads.
```

## 3. Bug Report Routing with QA

```
/agents:qa Monitor the #bug-reports Slack channel. Read the last 10 messages,
categorize each bug by severity and component. Post a triage summary
to #qa-team with recommended assignees based on the component owners.
```

## 4. Sprint Review Broadcast

```
/agents:pm After the sprint review, compose a summary message with:
completed stories, demo highlights, and next sprint goals.
Post it to both #engineering and #product channels on Slack.
```

## 5. Code Review Reminders

```
/agents:dev Read the #pull-requests channel on Slack for any PRs
that have been open for more than 24 hours without review.
Send a reminder message to #code-review tagging the team
to review these pending PRs.
```

## 6. Discord Community Engagement

```
/agents:analyst Read the last 50 messages from #feature-requests
on Discord. Identify the top 5 most requested features
(by upvotes or repeated mentions). Post a summary to
#product-feedback with vote counts.
```

## 7. Incident Response with DevOps

```
/agents:devops The production alert just fired. Post an incident
notification to #incidents on Slack with severity P1,
the error details I shared, and a link to the runbook.
Tag @oncall-team in the message.
```

## 8. Client Communication with PM

```
/agents:pm Read the conversation thread in #client-acme on Slack
from the last week. Summarize all client requests and our responses.
Identify any unanswered questions and draft follow-up messages.
```

## 9. Team Health Check

```
/agents:sm Read messages from #random and #watercooler on Slack
for the past week. Gauge team sentiment (positive/neutral/negative).
Report any patterns (e.g., burnout signals, celebrations, concerns).
Do NOT post results publicly — just show me the analysis.
```

## 10. Release Changelog to Discord

```
/agents:devops We just released v2.5.0. Post the release notes
to #announcements on Discord with formatted sections:
New Features, Bug Fixes, and Breaking Changes.
Pin the message after posting.
```
