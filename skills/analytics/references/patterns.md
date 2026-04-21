# Pattern Recognition Rules

Rules for identifying patterns in project data, with thresholds and recommended responses.

---

## Quality Patterns

### Pattern: Recurring QA Category Failures

**Detection:** 3+ QA failures in the same category within a sprint.
**Categories:**
- Missing edge cases (null, empty, boundary values)
- State management errors (race conditions, stale state)
- Styling inconsistencies (spacing, alignment, responsive)
- Missing error handling (no try/catch, unhandled promises)
- Accessibility violations (missing labels, keyboard nav)

**Root cause by category:**
| Category | Likely Root Cause | Fix |
|----------|------------------|-----|
| Edge cases | Specs lack edge case criteria | Add edge case section to story template |
| State management | Architecture gaps | Review state management patterns |
| Styling | No design system or inconsistent use | Establish or enforce design tokens |
| Error handling | Not in definition of done | Add to QA checklist |
| Accessibility | Not in requirements | Add a11y to acceptance criteria |

**Example:**
```
Sprint 5 QA failures:
- Story #12: Missing null check on user.email (edge case)
- Story #14: Empty array not handled in dashboard (edge case)
- Story #16: No validation on empty form submit (edge case)

Pattern detected: 3 edge case failures.
Root cause: Stories lack edge case acceptance criteria.
Action: Update story template with edge case section.
```

---

### Pattern: Rising Rework Rate

**Detection:** Rework rate increases by 10+ percentage points over 2 sprints.

**Common progressions:**
1. Sprint N: 15% rework (normal)
2. Sprint N+1: 22% rework (warning)
3. Sprint N+2: 30% rework (action required)

**Root causes:**
- Requirements changing after implementation starts
- Technical debt making changes unpredictable
- Spec quality declining (rushed planning)

**Response:**
1. Analyze which stories required rework
2. Categorize reasons (spec change, bug, misunderstanding, tech debt)
3. Address the dominant category

---

## Velocity Patterns

### Pattern: Velocity Plateau

**Detection:** Throughput flat for 3+ sprints despite stable team size.

**Common causes:**
- Technical debt slowing all changes
- Context switching overhead increasing
- Dependencies blocking parallel work
- Scope creep inflating story size

**Diagnostic steps:**
1. Check average story size — is it growing?
2. Check phase durations — which phase is slowest?
3. Check blocking time — how much idle time between phases?
4. Check code change difficulty — are simple changes touching many files?

---

### Pattern: Velocity Spike and Crash

**Detection:** Throughput jumps 50%+ then drops 30%+ in consecutive periods.

**Interpretation:** Likely "borrowing from the future" — shipping fast by cutting corners, then paying the cost in the next period as bugs and rework accumulate.

**Response:**
1. Check quality metrics for the spike period
2. Look for rising bug count in the crash period
3. If confirmed, stabilize quality standards before optimizing velocity

---

## Cost Patterns

### Pattern: Cost Anomaly Spike

**Detection:** Daily cost exceeds 2x the 7-day moving average.

**Common causes:**
| Symptom | Diagnosis | Fix |
|---------|-----------|-----|
| Single expensive session | Agent retry loop | Set retry limits |
| Many Opus sessions | Routing misconfiguration | Review routing rules |
| High input tokens | Context window bloat | Prune conversation history |
| Low cache rate | System prompt changed | Stabilize prompt prefix |

**Example:**
```
7-day average: $12.40/day
Today: $31.20 (2.5x average)

Analysis:
- 3 Opus sessions costing $8.50 each (normally <$2)
- Root cause: QA agent escalated simple style issues to Opus
- Fix: Route style reviews to Sonnet
```

---

### Pattern: Rising Cost Per Story

**Detection:** Cost per story increases 30%+ over 3 sprints without corresponding complexity increase.

**Common causes:**
- Conversation context growing (more tokens per exchange)
- More QA iterations per story
- Model routing drift (tasks creeping to more expensive models)
- Stories touching more files (architecture degradation)

**Response:**
1. Compare token usage per story across sprints
2. Identify which phase costs more
3. Apply targeted optimization from cost-optimizer strategies

---

## Architecture Patterns

### Pattern: File Hotspot

**Detection:** A file appears in 30%+ of commits over a 2-week period.

**Interpretation:** This file is either:
- A God object that handles too many concerns
- A configuration file that changes with every feature
- A shared utility that is poorly abstracted

**Response:**
1. Analyze the types of changes (feature, bugfix, refactor)
2. If diverse change types: the file needs decomposition
3. If same change type: the related concern needs better architecture

---

### Pattern: Circular Dependencies

**Detection:** Stories repeatedly require changes in the same set of 3+ files together.

**Interpretation:** These files are tightly coupled. Changing one reliably requires changing the others.

**Response:**
1. Map the dependency graph
2. Identify which coupling is accidental vs essential
3. Refactor to reduce coupling (extract interfaces, dependency injection)

---

## Process Patterns

### Pattern: Bottleneck Agent

**Detection:** One workflow phase consistently has 2x+ the duration of others.

**Common bottlenecks:**
| Bottleneck Phase | Cause | Solution |
|-----------------|-------|---------|
| Planning | Unclear requirements | Better story templates, PM involvement |
| Development | Complex architecture | Architecture review, better abstractions |
| QA Review | Single reviewer | Parallelize reviews, automated checks |
| Revision | Deep issues found late | Earlier quality gates, shift-left testing |
| Deployment | Manual steps | Automate CI/CD pipeline |

---

### Pattern: Monday Spike

**Detection:** Consistently higher costs on Mondays than other days.

**Interpretation:** Sessions starting fresh on Monday lose cached context from Friday. Agents re-establish context at full input cost.

**Response:**
1. Use `/workflows:progress` to save session state on Friday
2. Resume sessions Monday to leverage cache
3. Front-load planning (cheaper) on Monday, save coding for after context is cached

---

## Alert Thresholds Summary

| Pattern | Threshold | Severity |
|---------|-----------|----------|
| QA category failures | 3+ same category/sprint | Warning |
| Rework rate increase | +10pp over 2 sprints | Warning |
| Velocity plateau | 3+ flat sprints | Info |
| Velocity spike/crash | +50% then -30% | Warning |
| Cost anomaly | 2x 7-day average | Alert |
| Cost per story rising | +30% over 3 sprints | Warning |
| File hotspot | 30%+ of commits | Info |
| Bottleneck agent | 2x other phases | Warning |
