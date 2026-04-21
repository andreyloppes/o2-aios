---
name: analytics
description: "AI-driven project analytics and insights. Velocity tracking, quality patterns, predictive analysis, and performance benchmarks for multi-agent development."
---

# Analytics

Measure what matters. See patterns before they become problems.

## Scope

**Use for:** Project metrics, team velocity analysis, quality pattern recognition, cost efficiency tracking, predictive insights, and performance benchmarking.

**Not for:** Real-time monitoring, infrastructure metrics, or application performance. This skill analyzes development process data — how the team works, not how the software runs.

---

# The Problem

Multi-agent development generates enormous amounts of data. Every session, commit, review, and deployment leaves a trace. But data without analysis is noise. Most teams operate blind — they know something feels slow, but they cannot point to where time is lost. They know costs are high, but they cannot say which workflow is expensive.

The gap between "we shipped features" and "we shipped features efficiently" is the gap analytics closes.

Without measurement, you cannot answer basic questions:
- How many story points did we complete this sprint?
- What is our average cycle time from story to deployment?
- Which workflow phase takes the longest?
- Are QA failures increasing or decreasing?
- Is our cost per feature going up or down?

These questions have answers. The data already exists. This skill teaches you how to find it, calculate it, and act on it.

---

# Metrics Framework

Metrics fall into four categories. Track all four — optimizing one at the expense of others creates blind spots.

## Velocity Metrics

How fast work moves through the system.

### Stories Per Session
**Definition:** Number of user stories completed in a single development session.
**Formula:** `stories_completed / sessions_count`
**Target:** 1-3 stories per focused session, depending on complexity.
**Why it matters:** Low velocity indicates either over-scoped stories or inefficient workflows.

### Features Per Sprint
**Definition:** Number of features shipped in a sprint cycle (typically 1-2 weeks).
**Formula:** `features_shipped / sprint_count`
**Trend matters more than absolute number.** A team shipping 5 features/sprint is healthy if that is stable. A team dropping from 5 to 2 has a problem.

### Lines Changed Per Hour
**Definition:** Net lines added/modified/removed per hour of active development.
**Formula:** `(lines_added + lines_modified + lines_deleted) / active_hours`
**Caution:** This is a signal, not a goal. Optimizing for lines of code produces bloat. Use it to detect anomalies — a session with zero lines changed suggests blocked work, not lazy developers.

### Cycle Time
**Definition:** Time from story creation to deployment.
**Formula:** `deploy_timestamp - story_created_timestamp`
**Breakdown:** Track each phase separately:
- Backlog wait time (created -> started)
- Development time (started -> PR)
- Review time (PR -> approved)
- Deploy time (approved -> production)

The longest phase is your bottleneck.

### Throughput
**Definition:** Number of work items completed per time period.
**Formula:** `items_completed / time_period`
**Track weekly.** Throughput is the most honest velocity metric because it counts finished work, not started work.

## Quality Metrics

How good the output is.

### QA First-Pass Rate
**Definition:** Percentage of stories that pass QA review on the first attempt.
**Formula:** `stories_passed_first_review / total_stories_reviewed * 100`
**Target:** 70%+ is healthy. Below 50% indicates specification or implementation problems.

### Defect Density
**Definition:** Number of bugs found per unit of new code.
**Formula:** `bugs_found / (lines_added / 1000)`
**Express as:** bugs per KLOC (thousand lines of code).
**Industry average:** 1-25 bugs per KLOC depending on maturity.

### Review Iterations
**Definition:** Average number of review cycles before a story passes QA.
**Formula:** `total_review_rounds / stories_reviewed`
**Target:** 1.5 or less. Above 2.0 means specs are unclear or implementation quality is low.

### Rework Rate
**Definition:** Percentage of completed work that requires changes after initial completion.
**Formula:** `stories_requiring_rework / total_stories_completed * 100`
**Signal:** Rising rework rate indicates rushing, unclear requirements, or technical debt accumulation.

### Test Coverage Delta
**Definition:** Change in test coverage per sprint.
**Formula:** `coverage_end - coverage_start`
**Target:** Non-negative. Coverage should at minimum hold steady, ideally increase.

## Efficiency Metrics

How well resources are used.

### Time Per Workflow Phase
**Definition:** Average time spent in each workflow phase.
**Phases:** Planning, Development, QA Review, Revision, Deployment.
**Formula:** `sum(phase_duration) / phase_count`
**Use to find bottlenecks.** If QA review averages 2 hours but revision averages 4 hours, the problem is not review speed — it is implementation quality.

### Agent Utilization Rate
**Definition:** Percentage of time an agent is actively working versus waiting.
**Formula:** `active_time / total_session_time * 100`
**Low utilization signals:** Blocked dependencies, unclear instructions, or over-provisioned agents.

### Parallel vs Sequential Ratio
**Definition:** Proportion of tasks executed in parallel versus sequentially.
**Formula:** `parallel_tasks / total_tasks * 100`
**Higher is better.** Sequential execution is the enemy of throughput. If tasks have no dependencies, they should run in parallel.

### Context Switch Cost
**Definition:** Token overhead when an agent switches between unrelated tasks.
**Formula:** `tokens_used_switching / total_tokens * 100`
**Keep below 15%.** Context switches in multi-agent systems mean loading new files, new prompts, and new instructions — all of which cost tokens.

## Cost Metrics

What the work costs in dollars and tokens.

### Cost Per Story
**Definition:** Total API cost to complete one user story end-to-end.
**Formula:** `total_story_cost / stories_completed`
**Includes:** All agent sessions, reviews, revisions, and deployment.

### Cost Per Feature
**Definition:** Total cost to deliver a feature (may include multiple stories).
**Formula:** `sum(story_costs_in_feature)`
**Track trends.** If cost per feature is rising without corresponding complexity increase, efficiency is degrading.

### Cost Per Bug Fix
**Definition:** Average cost to identify and fix a bug.
**Formula:** `total_bugfix_cost / bugs_fixed`
**Compare to prevention.** If bug fixes cost $5 each but better specs cost $2 more per story, specs are the better investment.

### ROI Calculation
**Definition:** Return on investment for AI-assisted development.
**Formula:** `(value_delivered - total_cost) / total_cost * 100`
**Value delivered** is estimated by: manual developer hours saved * hourly rate.

---

# Data Sources

Analytics are only as good as the data they draw from.

## Git Log Analysis

The richest data source. Every commit tells a story.

**What to extract:**
- Commit frequency per day/week — velocity signal
- Commit size distribution — large commits suggest batched work, small commits suggest flow
- Co-authorship patterns — which agents collaborate most
- File change frequency — hotspots indicate complexity or instability
- Time between commits — long gaps suggest blocks or context switches

**Commands:**
```bash
# Commits per day
git log --format='%ad' --date=short | sort | uniq -c

# Average files per commit
git log --stat --oneline | grep 'files changed'

# Most changed files (hotspots)
git log --name-only --format='' | sort | uniq -c | sort -rn | head -20
```

## Session Data

Claude Code session data tracks token usage per interaction.

**What to extract:**
- Token counts per session (input, output, cache)
- Model used per interaction
- Session duration
- Cost per session

## Stories Folder

If using a stories/ folder for tracking work items:

**What to extract:**
- Story count by status (todo, in-progress, done)
- Story completion dates
- Story complexity (estimated vs actual)
- QA pass/fail history

## Documentation State

The docs/ folder reveals project maturity:

**What to extract:**
- Documentation coverage (which modules have docs)
- Doc freshness (last modified dates)
- Architecture decision records (ADR count and recency)

---

# Pattern Recognition

Raw metrics are inputs. Patterns are insights.

## Recurring QA Failures

When the same category of issue fails QA repeatedly, the root cause is upstream.

**Pattern:** 3+ QA failures in the same category within a sprint.
**Categories:** Missing edge cases, incorrect state management, styling inconsistencies, missing error handling, accessibility violations.
**Action:** Address the category at the specification or architecture level, not one bug at a time.

## Bottleneck Agents

When one agent type consistently has the longest phase duration, it creates a system-wide bottleneck.

**Pattern:** One workflow phase consistently takes 2x+ longer than others.
**Common bottlenecks:**
- QA agent overwhelmed with reviews (solution: parallelize reviews)
- Dev agent blocked on unclear specs (solution: better story definitions)
- DevOps agent manual steps (solution: automate deployment pipeline)

## Architecture Decision Patterns

Track which architectural decisions get revisited or reversed.

**Pattern:** The same architectural concern appears in 3+ stories.
**Signal:** The original architecture decision was wrong or incomplete.
**Action:** Schedule a focused architecture review instead of patching story by story.

## Cost Anomalies

Sudden cost spikes indicate process problems.

**Pattern:** Daily cost exceeds 2x the 7-day moving average.
**Common causes:**
- Agent caught in retry loops
- Opus used for tasks that should route to Sonnet
- Context window bloat from unmanaged conversation history
- Cache invalidation from changing system prompts

---

# Predictive Analysis

Use historical patterns to forecast future work.

## Remaining Effort Estimation

**Formula:** `remaining_stories * average_cost_per_story`

Refine by weighting story complexity:
```
estimated_effort = sum(story_complexity_weight * avg_cost_per_complexity_level)
```

Where complexity_weight is derived from historical data on similar stories.

## Project Cost Projection

**Formula:** `current_spend + (remaining_effort * (1 + risk_buffer))`

Risk buffer based on historical accuracy:
- First sprint: 50% buffer (limited data)
- Second sprint: 30% buffer
- Third sprint onward: 15% buffer

## Risk Indicators

**Red flags that predict project problems:**

| Indicator | Threshold | Risk |
|-----------|-----------|------|
| Velocity declining 3+ days | >20% drop | Scope creep or technical debt |
| QA first-pass rate below 50% | <50% | Spec or quality problem |
| Cost per story rising | >30% increase | Efficiency degradation |
| Rework rate above 30% | >30% | Requirements or architecture issue |
| Agent utilization below 40% | <40% | Blocking dependencies |

---

# Benchmarks

Compare your metrics against industry standards for AI-assisted development.

## Velocity Benchmarks

| Metric | Below Average | Average | Above Average |
|--------|--------------|---------|---------------|
| Stories/sprint | <5 | 5-12 | 12+ |
| Cycle time | >5 days | 2-5 days | <2 days |
| Throughput/week | <3 items | 3-8 items | 8+ items |

## Quality Benchmarks

| Metric | Below Average | Average | Above Average |
|--------|--------------|---------|---------------|
| QA first-pass | <50% | 50-75% | 75%+ |
| Defect density | >15/KLOC | 5-15/KLOC | <5/KLOC |
| Review iterations | >3 | 1.5-3 | <1.5 |
| Rework rate | >30% | 15-30% | <15% |

## Cost Benchmarks (AI-Assisted)

| Metric | High Cost | Moderate | Efficient |
|--------|----------|----------|-----------|
| Cost/story | >$10 | $3-10 | <$3 |
| Cost/feature | >$50 | $15-50 | <$15 |
| Cache hit rate | <30% | 30-60% | 60%+ |
| Opus usage | >40% | 15-40% | <15% |

These benchmarks assume a multi-agent system with proper model routing. Single-model systems will have different cost profiles.

---

# Generating Insights

Raw metrics become insights through comparison and context.

## Insight Template

```markdown
## [Insight Title]

**Observation:** [What the data shows]
**Comparison:** [How it compares to benchmark or trend]
**Impact:** [What this means for the project]
**Recommendation:** [Specific action to take]
```

## Example Insight

```markdown
## QA First-Pass Rate Declining

**Observation:** QA first-pass rate dropped from 72% to 48% over the last 3 sprints.
**Comparison:** Below the 50% threshold, previously above average.
**Impact:** Each failed review adds ~$2.50 in revision costs. At current volume,
           this adds ~$25/sprint in rework.
**Recommendation:** Review recent story specifications for completeness.
                    Add acceptance criteria checklist to story template.
```

---

# Commands

- `/analytics:velocity` — Calculate and display velocity metrics for current project
- `/analytics:quality` — Analyze QA patterns, defect density, and review efficiency
- `/analytics:insights` — Generate actionable insights from all available data sources

---

# Deep Dives

For more detail on specific topics:
- `references/metrics.md` — Complete metric definitions with formulas and calculation examples
- `references/patterns.md` — Pattern recognition rules, thresholds, and response playbooks
- `references/benchmarks.md` — Industry benchmarks with context and methodology
