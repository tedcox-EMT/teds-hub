-- BCMS budget schema. Neon Postgres and local PostgreSQL 16 both run this as-is.

CREATE TABLE IF NOT EXISTS snapshots (
  id SERIAL PRIMARY KEY,
  department TEXT NOT NULL DEFAULT 'Bedford County EMS',
  fiscal_year TEXT NOT NULL,
  fiscal_year_start DATE NOT NULL,
  fiscal_year_end DATE NOT NULL,
  fiscal_month INTEGER NOT NULL CHECK (fiscal_month BETWEEN 1 AND 12),
  fiscal_months INTEGER NOT NULL DEFAULT 12,
  report_date DATE NOT NULL,
  pulled_at TEXT,
  pulled_by TEXT,
  primary_source TEXT NOT NULL,
  secondary_source TEXT,
  official_budgeted NUMERIC(14,2) NOT NULL,
  official_spent NUMERIC(14,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (fiscal_year, fiscal_month, report_date)
);

CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  snapshot_id INTEGER NOT NULL REFERENCES snapshots(id) ON DELETE CASCADE,
  acct TEXT NOT NULL,
  name TEXT NOT NULL,
  budgeted NUMERIC(14,2) NOT NULL,
  spent NUMERIC(14,2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('personnel', 'operating', 'capital', 'passthrough')),
  cents BOOLEAN NOT NULL DEFAULT false,
  note TEXT,
  UNIQUE (snapshot_id, acct)
);

CREATE TABLE IF NOT EXISTS flags (
  id SERIAL PRIMARY KEY,
  snapshot_id INTEGER NOT NULL REFERENCES snapshots(id) ON DELETE CASCADE,
  acct TEXT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quality_notes (
  id SERIAL PRIMARY KEY,
  snapshot_id INTEGER NOT NULL REFERENCES snapshots(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL,
  note TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS accounts_snapshot_idx ON accounts (snapshot_id);
CREATE INDEX IF NOT EXISTS flags_snapshot_idx ON flags (snapshot_id);
