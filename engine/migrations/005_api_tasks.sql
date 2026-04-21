-- ============================================================
-- O2-AIOS — Task orchestration (replaces Supabase in /api/tasks)
-- ============================================================

CREATE TABLE IF NOT EXISTS tasks (
  id            TEXT PRIMARY KEY,
  demand        TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending',
  squads        TEXT NOT NULL DEFAULT '[]',
  workflow      TEXT,
  outputs       TEXT NOT NULL DEFAULT '[]',
  options       TEXT,
  error         TEXT,
  total_tokens  INTEGER,
  total_duration INTEGER,
  step_count    INTEGER,
  completed_steps INTEGER,
  started_at    TEXT,
  completed_at  TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created ON tasks(created_at DESC);
