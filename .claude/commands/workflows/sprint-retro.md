---
name: workflows:sprint-retro
description: "Automated sprint retrospective with agent-collected data and actionable insights"
---

You are now executing the **Sprint Retrospective Workflow** — an automated retrospective that collects real data from the project and produces actionable insights.

## Workflow Overview

```
Phase 1: Data Collection    → Automated (git, sessions, stories)
Phase 2: Analysis           → /agents:analyst (Atlas)
Phase 3: Metrics            → Cost Optimizer + Analytics skills
Phase 4: Retrospective      → /agents:sm (River)
Phase 5: Report             → /pro:report sprint
```

## Your Role
You are the retrospective facilitator. You will:
1. Collect quantitative data from the project
2. Guide agents to analyze and produce insights
3. Generate a comprehensive retrospective report
4. Produce actionable improvement items for the next sprint

## Phase 1: Data Collection
**Goal:** Gather all sprint data automatically

### Step 1.1: Git Analysis
**Actions (automated):**
1. Run `git log --since="2 weeks ago" --format="%h|%an|%s|%ai"` to get commit history
2. Count: total commits, commits per day, files changed
3. Analyze: commit message patterns (feat vs fix vs refactor ratio)
4. Calculate: code churn (lines added vs removed)

### Step 1.2: Session Metrics
**Actions (automated):**
1. Read `~/.claude-master-pro/data/sessions.jsonl` for sprint period
2. Calculate: total sessions, total cost, avg cost per session
3. Identify: most expensive sessions, model usage breakdown
4. Cache efficiency: cache hit rate across sessions

### Step 1.3: Story Completion
**Actions (automated):**
1. Read `stories/` folder for sprint stories
2. Count: stories planned vs completed vs carried over
3. Identify: stories that took longest, stories that were descoped
4. Calculate: velocity (story points completed)

## Phase 2: Analysis
**Goal:** Turn raw data into insights

### Step 2.1: What Went Well
**Agent:** `/agents:analyst` (Atlas)
**Input:** Data from Phase 1
**Output:** Positive patterns identified
**Actions:**
1. Identify high-velocity periods and their causes
2. Note stories that shipped smoothly
3. Highlight cost-efficient patterns
4. Recognize effective agent usage patterns

### Step 2.2: What Needs Improvement
**Agent:** `/agents:analyst` (Atlas)
**Input:** Data from Phase 1
**Output:** Improvement opportunities
**Actions:**
1. Identify bottlenecks (where did stories stall?)
2. Flag cost anomalies (sessions that cost 3x+ average)
3. Note repeated QA failures or rework
4. Identify unused or underutilized agents

## Phase 3: Metrics Dashboard
**Goal:** Calculate sprint metrics

**Use skills:** `cost-optimizer` + `analytics`

Present metrics in this format:

```
Sprint Metrics:
  Velocity:       [X] story points completed
  Stories:        [X] planned / [Y] completed / [Z] carried
  Completion:     [%] completion rate
  Cost:           $[total] ($[avg] per story)
  Cache Rate:     [%] cache hit rate
  Commit Rate:    [X] commits/day average
  Fix Ratio:      [%] of commits were fixes (lower = better)
  First Pass QA:  [%] stories passed QA first time
```

## Phase 4: Retrospective Items
**Goal:** Create actionable improvements

### Step 4.1: Generate Action Items
**Agent:** `/agents:sm` (River)
**Input:** Analysis from Phase 2 + Metrics from Phase 3
**Output:** Prioritized action items
**Actions:**
1. Create 3-5 specific, measurable improvement items
2. Assign each item an owner (which agent/workflow to improve)
3. Set a target metric for each item
4. Format as stories for the next sprint if applicable

## Phase 5: Report
**Goal:** Generate the retrospective report

**Command:** `/pro:report sprint`
**Input:** All collected data and analysis
**Output:** `docs/retro-sprint-[N].md`

## Activation
1. Ask the user for the sprint period (default: last 2 weeks)
2. Start Phase 1 data collection automatically
3. Present raw data and proceed to analysis
4. Generate the complete retrospective report
