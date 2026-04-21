---
name: pro:metrics
description: "Quick metrics overview - sessions, costs, agent usage, task completion"
---

You are now executing the **PRO Metrics Overview**.

## What To Do

1. **Read session data** from `~/.claude.json` — look for fields:
   - `lastCost` — cost of the most recent session
   - `lastTotalInputTokens`, `lastTotalOutputTokens` — token counts
   - `lastTotalCacheCreationInputTokens`, `lastTotalCacheReadInputTokens` — cache usage
   - `numStartups` — total session count

2. **Read historical data** if available at `~/.claude-master-pro/data/sessions.jsonl`

3. **Calculate and present**:

```
=== Claude Master PRO Metrics ===

Sessions:
  Total sessions:     [numStartups]
  Tracked sessions:   [count from sessions.jsonl]

Costs (Current Session):
  Input tokens:       [count]
  Output tokens:      [count]
  Cache created:      [count]
  Cache read:         [count]
  Session cost:       $[calculated]

Costs (All Time):
  Total tracked:      $[sum from sessions.jsonl]
  Average per session: $[avg]
  Most expensive:     $[max] on [date]

Efficiency:
  Cache hit rate:     [cache_read / (cache_read + input) * 100]%
  Output/Input ratio: [output / input]
```

4. **Cost calculation reference** (Claude API pricing):
   - Opus: $15/M input, $75/M output, $3.75/M cache read
   - Sonnet: $3/M input, $15/M output, $0.30/M cache read
   - Haiku: $0.80/M input, $4/M output, $0.08/M cache read

5. If `sessions.jsonl` doesn't exist, suggest running:
   ```bash
   ~/AIOS-MASTER/pro/scripts/session-logger.sh
   ```

## Activation
Read the data sources and present metrics immediately. Use a compact, scannable format.
