import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { ROOT, query, closePool } from "./db.js";

function loadSnapshot() {
  const js = fs.readFileSync(path.join(ROOT, "../bcems-budget/data.js"), "utf8");
  const context = { window: {} };
  vm.runInNewContext(js, context);
  return context.window.BUDGET;
}

const data = loadSnapshot();
const meta = data.meta;

const existing = await query(
  `SELECT id FROM snapshots WHERE fiscal_year = $1 AND fiscal_month = $2 AND report_date = $3`,
  [meta.fiscalYear, meta.fiscalMonth, meta.reportDate]
);

let snapshotId;
if (existing.rowCount) {
  snapshotId = existing.rows[0].id;
  await query(`DELETE FROM accounts WHERE snapshot_id = $1`, [snapshotId]);
  await query(`DELETE FROM flags WHERE snapshot_id = $1`, [snapshotId]);
  await query(`DELETE FROM quality_notes WHERE snapshot_id = $1`, [snapshotId]);
  await query(
    `UPDATE snapshots SET
      department = $1,
      fiscal_year_start = $2,
      fiscal_year_end = $3,
      fiscal_months = $4,
      pulled_at = $5,
      pulled_by = $6,
      primary_source = $7,
      secondary_source = $8,
      official_budgeted = $9,
      official_spent = $10
     WHERE id = $11`,
    [
      meta.department,
      meta.fiscalYearStart,
      meta.fiscalYearEnd,
      meta.fiscalMonths,
      meta.pulledAt,
      meta.pulledBy,
      meta.primarySource,
      meta.secondarySource,
      meta.officialBudgeted,
      meta.officialSpent,
      snapshotId
    ]
  );
} else {
  const inserted = await query(
    `INSERT INTO snapshots (
      department, fiscal_year, fiscal_year_start, fiscal_year_end,
      fiscal_month, fiscal_months, report_date, pulled_at, pulled_by,
      primary_source, secondary_source, official_budgeted, official_spent
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING id`,
    [
      meta.department,
      meta.fiscalYear,
      meta.fiscalYearStart,
      meta.fiscalYearEnd,
      meta.fiscalMonth,
      meta.fiscalMonths,
      meta.reportDate,
      meta.pulledAt,
      meta.pulledBy,
      meta.primarySource,
      meta.secondarySource,
      meta.officialBudgeted,
      meta.officialSpent
    ]
  );
  snapshotId = inserted.rows[0].id;
}

for (const a of data.accounts) {
  await query(
    `INSERT INTO accounts (snapshot_id, acct, name, budgeted, spent, category, cents, note)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [snapshotId, a.acct, a.name, a.budgeted, a.spent, a.category, Boolean(a.cents), a.note || null]
  );
}

for (const f of data.flags) {
  await query(
    `INSERT INTO flags (snapshot_id, acct, title, detail) VALUES ($1,$2,$3,$4)`,
    [snapshotId, f.acct, f.title, f.detail]
  );
}

for (let i = 0; i < data.quality.length; i += 1) {
  await query(
    `INSERT INTO quality_notes (snapshot_id, sort_order, note) VALUES ($1,$2,$3)`,
    [snapshotId, i, data.quality[i]]
  );
}

const counts = await query(
  `SELECT
     (SELECT count(*) FROM accounts WHERE snapshot_id = $1) AS accounts,
     (SELECT count(*) FROM flags WHERE snapshot_id = $1) AS flags,
     (SELECT count(*) FROM quality_notes WHERE snapshot_id = $1) AS notes`,
  [snapshotId]
);
console.log(`seeded snapshot ${snapshotId}`, counts.rows[0]);
await closePool();
