# Complete Pricing Reference

All Claude API pricing as of February 2026. Prices per million tokens.

---

## Model Comparison Table

| Model | Input | Output | Cache Write | Cache Read |
|-------|-------|--------|-------------|------------|
| Claude Opus 4 | $15.00 | $75.00 | $18.75 | $3.75 |
| Claude Sonnet 4.5 | $3.00 | $15.00 | $3.75 | $0.30 |
| Claude Haiku 4.5 | $0.80 | $4.00 | $1.00 | $0.08 |

## Cost Multipliers

Relative cost compared to Haiku (cheapest model):

| Model | Input Multiplier | Output Multiplier |
|-------|-----------------|-------------------|
| Opus 4 | 18.75x | 18.75x |
| Sonnet 4.5 | 3.75x | 3.75x |
| Haiku 4.5 | 1.00x | 1.00x |

Every task moved from Opus to Haiku saves 18.75x. From Opus to Sonnet saves 5x.

---

## Cache Economics

### Write vs Read Ratio

| Model | Write/Input Ratio | Read/Input Ratio | Break-Even Reads |
|-------|-------------------|-------------------|-----------------|
| Opus 4 | 1.25x | 0.25x | 1 |
| Sonnet 4.5 | 1.25x | 0.10x | 1 |
| Haiku 4.5 | 1.25x | 0.10x | 1 |

After just 1 cache read, the initial write cost is recovered.

### Savings Per 100K Cached Tokens

| Model | Full Input Cost | Cache Read Cost | Savings |
|-------|----------------|-----------------|---------|
| Opus 4 | $1.50 | $0.375 | $1.125 |
| Sonnet 4.5 | $0.30 | $0.03 | $0.27 |
| Haiku 4.5 | $0.08 | $0.008 | $0.072 |

---

## Worked Examples

### Example 1: Simple Haiku Task

File read + format check:
- Input: 3,000 tokens
- Output: 500 tokens

```
Cost = (3,000 * $0.80 / 1,000,000) + (500 * $4.00 / 1,000,000)
     = $0.0024 + $0.002
     = $0.0044
```

### Example 2: Sonnet Coding Session

Feature implementation with 20 exchanges:
- Total input: 200,000 tokens (120K cached reads, 80K fresh)
- Total output: 60,000 tokens
- Cache write: 80,000 tokens (first exchange)

```
Fresh input  = 80,000 * $3.00 / 1,000,000  = $0.24
Cache write  = 80,000 * $3.75 / 1,000,000  = $0.30
Cache reads  = 120,000 * $0.30 / 1,000,000 = $0.036
Output       = 60,000 * $15.00 / 1,000,000 = $0.90
Total        = $1.476
```

Without caching (all input as fresh):
```
Input  = 200,000 * $3.00 / 1,000,000 = $0.60
Output = 60,000 * $15.00 / 1,000,000 = $0.90
Total  = $1.50
```

Cache savings: $0.024 (marginal for this session, but scales with more exchanges).

### Example 3: Opus Architecture Session

Complex multi-file planning:
- Input: 100,000 tokens (60K cached reads, 40K fresh)
- Output: 30,000 tokens
- Cache write: 40,000 tokens

```
Fresh input  = 40,000 * $15.00 / 1,000,000 = $0.60
Cache write  = 40,000 * $18.75 / 1,000,000 = $0.75
Cache reads  = 60,000 * $3.75 / 1,000,000  = $0.225
Output       = 30,000 * $75.00 / 1,000,000 = $2.25
Total        = $3.825
```

### Example 4: Full Multi-Agent Workflow

5-agent story cycle (SM + Dev + QA + revision + DevOps):

| Agent | Model | Input | Output | Cost |
|-------|-------|-------|--------|------|
| SM (story) | Sonnet | 20K | 5K | $0.135 |
| Dev (implement) | Sonnet | 150K | 50K | $1.20 |
| QA (review) | Sonnet | 80K | 15K | $0.465 |
| Dev (revision) | Sonnet | 100K | 30K | $0.75 |
| DevOps (deploy) | Haiku | 10K | 3K | $0.02 |
| **Total** | | **360K** | **103K** | **$2.57** |

### Example 5: Same Workflow with Poor Routing

All agents using Opus:

| Agent | Model | Input | Output | Cost |
|-------|-------|-------|--------|------|
| SM (story) | Opus | 20K | 5K | $0.675 |
| Dev (implement) | Opus | 150K | 50K | $6.00 |
| QA (review) | Opus | 80K | 15K | $2.325 |
| Dev (revision) | Opus | 100K | 30K | $3.75 |
| DevOps (deploy) | Opus | 10K | 3K | $0.375 |
| **Total** | | **360K** | **103K** | **$13.125** |

**Savings from routing: $10.555 per story cycle (80% reduction).**

---

## Monthly Budget Planning

Estimated monthly costs for different usage levels:

| Usage Level | Stories/Day | Est. Daily Cost | Est. Monthly Cost |
|-------------|------------|-----------------|-------------------|
| Light | 2-3 | $5-8 | $100-160 |
| Moderate | 5-8 | $12-20 | $250-400 |
| Heavy | 10-15 | $25-45 | $500-900 |
| Intensive | 20+ | $50-100 | $1,000-2,000 |

Assumes proper model routing. Without routing, multiply by 3-5x.
