# Complete Metric Definitions

Every metric tracked by the analytics skill, with formulas, units, and calculation examples.

---

## Velocity Metrics

### Stories Per Session
- **Formula:** `completed_stories / session_count`
- **Unit:** stories/session
- **Example:** 12 stories completed across 5 sessions = 2.4 stories/session
- **Data source:** stories/ folder (count files with status "done" per session)
- **Healthy range:** 1-3 (depends on story size)

### Features Per Sprint
- **Formula:** `features_shipped / sprint_count`
- **Unit:** features/sprint
- **Example:** 8 features in a 2-week sprint = 8 features/sprint
- **Data source:** git merge commits tagged as features, or stories with type "feature"
- **Healthy range:** 3-12 depending on team size and complexity

### Lines Changed Per Hour
- **Formula:** `(additions + modifications + deletions) / active_hours`
- **Unit:** lines/hour
- **Example:** 2,400 lines changed over 8 active hours = 300 lines/hour
- **Data source:** `git diff --stat` with timestamp analysis
- **Warning:** Do NOT optimize for this metric. Use only for anomaly detection.

### Cycle Time
- **Formula:** `completion_timestamp - creation_timestamp`
- **Unit:** hours or days
- **Breakdown:**
  - Backlog wait = start_time - created_time
  - Dev time = pr_time - start_time
  - Review time = approved_time - pr_time
  - Deploy time = deploy_time - approved_time
- **Example:** Created Monday 9am, deployed Wednesday 2pm = 53 hours cycle time
- **Healthy range:** 4-48 hours for story-level items

### Throughput
- **Formula:** `items_completed / time_period`
- **Unit:** items/week
- **Example:** 15 items completed in 5 business days = 15 items/week
- **Data source:** stories/ folder, git merge history
- **Healthy range:** 5-20 items/week per team

---

## Quality Metrics

### QA First-Pass Rate
- **Formula:** `passed_first / total_reviewed * 100`
- **Unit:** percentage
- **Example:** 18 of 25 stories passed first review = 72%
- **Data source:** QA review records, PR review history
- **Healthy range:** 65-85%

### Defect Density
- **Formula:** `bugs_found / (new_lines / 1000)`
- **Unit:** bugs per KLOC
- **Example:** 8 bugs found in 4,000 new lines = 2.0 bugs/KLOC
- **Data source:** bug reports + git diff --stat for new lines
- **Industry ranges:**
  - Excellent: <1 bug/KLOC
  - Good: 1-5 bugs/KLOC
  - Average: 5-15 bugs/KLOC
  - Concerning: >15 bugs/KLOC

### Review Iterations
- **Formula:** `total_review_rounds / items_reviewed`
- **Unit:** rounds/item
- **Example:** 38 total rounds across 25 reviews = 1.52 rounds/item
- **Data source:** PR review history, QA cycle tracking
- **Healthy range:** 1.0-2.0

### Rework Rate
- **Formula:** `items_reworked / items_completed * 100`
- **Unit:** percentage
- **Example:** 6 items reworked out of 20 completed = 30%
- **Data source:** stories re-opened after completion, fix commits after merge
- **Healthy range:** 5-20%

### Test Coverage Delta
- **Formula:** `coverage_end - coverage_start`
- **Unit:** percentage points
- **Example:** Coverage went from 72% to 75% = +3pp
- **Data source:** test runner coverage reports
- **Target:** >= 0 (never decrease)

---

## Efficiency Metrics

### Phase Duration
- **Formula:** `sum(phase_time) / phase_occurrences`
- **Unit:** minutes or hours
- **Phases:** Planning, Development, Review, Revision, Deployment
- **Example:** 10 development phases totaling 40 hours = 4 hours average
- **Use:** Identify the longest phase as the bottleneck

### Agent Utilization
- **Formula:** `active_time / total_time * 100`
- **Unit:** percentage
- **Example:** 45 minutes active in a 60-minute session = 75%
- **Healthy range:** 60-85% (some idle time is normal for dependencies)

### Parallel Ratio
- **Formula:** `parallel_tasks / total_tasks * 100`
- **Unit:** percentage
- **Example:** 8 of 20 tasks ran in parallel = 40%
- **Target:** 40-60% (not all tasks can be parallelized)

### Context Switch Cost
- **Formula:** `switch_overhead_tokens / total_tokens * 100`
- **Unit:** percentage
- **Estimate switch overhead** as tokens used in the first exchange after a topic change
- **Healthy range:** <15%

---

## Cost Metrics

### Cost Per Story
- **Formula:** `total_api_cost / stories_completed`
- **Unit:** dollars
- **Example:** $25.50 spent, 10 stories completed = $2.55/story
- **Benchmark:** $1-5 for small stories, $5-15 for complex ones

### Cost Per Feature
- **Formula:** `sum(story_costs_in_feature)`
- **Unit:** dollars
- **Example:** Feature with 3 stories costing $2, $5, $8 = $15/feature
- **Benchmark:** $10-50 depending on feature scope

### Cost Per Bug Fix
- **Formula:** `total_bugfix_spend / bugs_fixed`
- **Unit:** dollars
- **Example:** $12 spent fixing 4 bugs = $3.00/bug
- **Benchmark:** $1-5 for simple bugs, $5-20 for complex bugs

### ROI
- **Formula:** `(manual_cost_equivalent - ai_cost) / ai_cost * 100`
- **Unit:** percentage
- **Example:** Manual equivalent $500, AI cost $50 = 900% ROI
- **Manual cost estimate:** developer_hours * hourly_rate
- **Typical range:** 300-1000% for well-optimized workflows

---

## Derived Metrics

### Efficiency Score
- **Formula:** `(velocity_score * 0.3) + (quality_score * 0.3) + (cost_score * 0.4)`
- **Where:**
  - velocity_score = normalize(throughput vs benchmark)
  - quality_score = normalize(first_pass_rate vs benchmark)
  - cost_score = normalize(inverse cost_per_story vs benchmark)
- **Range:** 0-100
- **Use:** Single number to track overall team efficiency trend

### Health Index
- **Formula:** Binary check of 5 indicators
- **Healthy (1):** velocity stable or rising, quality above threshold, costs below budget, no blockers, documentation current
- **Range:** 0-5
- **Use:** Quick project health snapshot
