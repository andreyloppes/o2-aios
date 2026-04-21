-- ============================================================
-- Projects — tracks project roots opened in O2-AIOS
-- ============================================================
-- Each row represents a folder the user has opened as a project,
-- whether or not it contains .aios-core/. The dashboard anchors
-- squad/workflow/terminal execution to the active project.

CREATE TABLE IF NOT EXISTS projects (
  id               TEXT PRIMARY KEY,     -- ulid
  path             TEXT NOT NULL UNIQUE, -- absolute path
  label            TEXT NOT NULL,        -- display name (defaults to basename)
  has_aios_core    INTEGER NOT NULL DEFAULT 0,
  last_opened_at   TEXT NOT NULL DEFAULT (datetime('now')),
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  metadata         TEXT
);

CREATE INDEX IF NOT EXISTS idx_projects_last_opened ON projects(last_opened_at DESC);
