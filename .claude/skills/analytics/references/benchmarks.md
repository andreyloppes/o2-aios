# Industry Benchmarks

Reference benchmarks for AI-assisted software development. Use these to contextualize your project's metrics.

---

## Methodology

These benchmarks are derived from:
- DORA (DevOps Research and Assessment) metrics for deployment frequency and lead time
- Industry reports on software defect density
- Empirical data from multi-agent development systems
- Traditional agile metrics adapted for AI-assisted workflows

**Important:** Benchmarks are ranges, not targets. Your project's context (team size, complexity, domain) determines where you should fall within the range.

---

## Velocity Benchmarks

### Throughput (Items Per Week)

| Performance Level | Solo Dev + AI | Small Team + AI | Traditional Team |
|-------------------|--------------|-----------------|-----------------|
| Below Average | <5 | <10 | <3 |
| Average | 5-12 | 10-25 | 3-8 |
| Above Average | 12-20 | 25-40 | 8-15 |
| Exceptional | 20+ | 40+ | 15+ |

AI-assisted teams typically achieve 2-4x throughput of traditional teams on story-level items.

### Cycle Time (Creation to Deployment)

| Performance Level | AI-Assisted | Traditional |
|-------------------|------------|-------------|
| Elite | <4 hours | <1 day |
| High | 4-24 hours | 1-3 days |
| Medium | 1-3 days | 3-7 days |
| Low | >3 days | >7 days |

DORA metrics classify elite teams as deploying on-demand with <1 hour lead time. AI-assisted workflows push this further for story-level items.

### Sprint Velocity (Story Points)

| Team Size | Below Avg | Average | Above Avg |
|-----------|----------|---------|-----------|
| 1 dev + AI | <15 | 15-30 | 30+ |
| 2-3 dev + AI | <30 | 30-60 | 60+ |
| 5+ dev + AI | <50 | 50-100 | 100+ |

---

## Quality Benchmarks

### Defect Density (Bugs per KLOC)

| Quality Level | AI-Assisted | Traditional | Industry Standard |
|---------------|------------|-------------|-------------------|
| Excellent | <1 | <1 | NASA flight software |
| Good | 1-5 | 1-10 | High-reliability systems |
| Average | 5-15 | 10-25 | Commercial software |
| Below Average | >15 | >25 | Rapid prototyping |

AI-assisted development tends toward lower defect density due to automated review, but varies significantly with prompt quality and test coverage.

### QA First-Pass Rate

| Level | Rate | Interpretation |
|-------|------|---------------|
| Excellent | >85% | Specs are clear, implementation quality is high |
| Good | 70-85% | Normal range for well-run projects |
| Needs Improvement | 50-70% | Review spec quality and acceptance criteria |
| Poor | <50% | Fundamental process or communication issue |

### Code Review Iterations

| Level | Avg Iterations | Interpretation |
|-------|---------------|---------------|
| Efficient | 1.0-1.3 | Code is clean, specs are clear |
| Normal | 1.3-2.0 | Typical back-and-forth |
| Inefficient | 2.0-3.0 | Spec ambiguity or skill gap |
| Problematic | >3.0 | Process breakdown |

### Test Coverage

| Level | Coverage | Context |
|-------|----------|---------|
| Comprehensive | >80% | High-reliability requirements |
| Good | 60-80% | Standard commercial software |
| Minimal | 40-60% | Rapid development, startup phase |
| Insufficient | <40% | Technical debt accumulating |

---

## Cost Benchmarks (AI-Assisted Development)

### Cost Per Story

| Complexity | Below Avg | Average | Efficient |
|-----------|----------|---------|-----------|
| Simple (1-2 files) | >$5 | $2-5 | <$2 |
| Medium (3-5 files) | >$15 | $5-15 | <$5 |
| Complex (6+ files) | >$30 | $10-30 | <$10 |

### Cost Per Feature (Multiple Stories)

| Size | Below Avg | Average | Efficient |
|------|----------|---------|-----------|
| Small feature (1-3 stories) | >$20 | $8-20 | <$8 |
| Medium feature (4-8 stories) | >$60 | $20-60 | <$20 |
| Large feature (9+ stories) | >$150 | $50-150 | <$50 |

### Model Usage Distribution (Optimized)

| Model | Expected % of Tasks | Expected % of Cost |
|-------|--------------------|--------------------|
| Haiku 4.5 | 35-45% | 2-5% |
| Sonnet 4.5 | 40-50% | 40-60% |
| Opus 4 | 10-20% | 40-55% |

If Opus accounts for >30% of tasks, you are likely over-routing.
If Haiku accounts for <20% of tasks, you are under-utilizing the cheapest model.

### Cache Hit Rate

| Level | Rate | Interpretation |
|-------|------|---------------|
| Excellent | >70% | Prompts well-structured for caching |
| Good | 50-70% | Reasonable cache strategy |
| Needs Work | 30-50% | Review prompt structure |
| Poor | <30% | No cache strategy or frequent invalidation |

---

## Process Benchmarks

### Phase Duration Distribution (Healthy)

| Phase | % of Cycle Time | Absolute (Medium Story) |
|-------|----------------|------------------------|
| Planning | 10-15% | 15-30 min |
| Development | 40-50% | 1-2 hours |
| QA Review | 15-20% | 30-60 min |
| Revision | 10-15% | 20-40 min |
| Deployment | 5-10% | 10-20 min |

If any phase exceeds 2x its expected percentage, it is a bottleneck.

### Agent Utilization

| Level | Rate | Interpretation |
|-------|------|---------------|
| Overloaded | >90% | No buffer for unexpected work |
| Optimal | 70-85% | Good balance of work and availability |
| Underutilized | 50-70% | Dependencies or scheduling issues |
| Idle | <50% | Blocked or misallocated |

---

## Comparison Framework

Use this template to compare your project against benchmarks:

```markdown
## Project Benchmark Comparison — [Date]

| Metric | Our Value | Benchmark (Avg) | Assessment |
|--------|-----------|-----------------|-----------|
| Throughput | X/week | 5-12/week | [Above/At/Below] |
| Cycle Time | X hours | 4-24 hours | [Above/At/Below] |
| QA First-Pass | XX% | 70-85% | [Above/At/Below] |
| Defect Density | X/KLOC | 5-15/KLOC | [Above/At/Below] |
| Cost/Story | $X.XX | $2-15 | [Above/At/Below] |
| Cache Rate | XX% | 50-70% | [Above/At/Below] |

**Strengths:** [metrics above benchmark]
**Opportunities:** [metrics below benchmark]
**Priority action:** [one specific improvement]
```
