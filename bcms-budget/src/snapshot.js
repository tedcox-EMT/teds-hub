import { query } from "./db.js";

function num(v) {
  return typeof v === "string" ? Number(v) : Number(v);
}

export async function latestSnapshot() {
  const snap = await query(
    `SELECT * FROM snapshots ORDER BY report_date DESC, fiscal_month DESC, id DESC LIMIT 1`
  );
  if (!snap.rowCount) return null;
  const s = snap.rows[0];
  const accounts = await query(
    `SELECT acct, name, budgeted, spent, category, cents, note
     FROM accounts WHERE snapshot_id = $1 ORDER BY acct`,
    [s.id]
  );
  const flags = await query(
    `SELECT acct, title, detail FROM flags WHERE snapshot_id = $1 ORDER BY id`,
    [s.id]
  );
  const quality = await query(
    `SELECT note FROM quality_notes WHERE snapshot_id = $1 ORDER BY sort_order`,
    [s.id]
  );
  return {
    meta: {
      department: s.department,
      shortName: "BCEMS",
      fiscalYear: s.fiscal_year,
      fiscalYearStart: s.fiscal_year_start.toISOString().slice(0, 10),
      fiscalYearEnd: s.fiscal_year_end.toISOString().slice(0, 10),
      fiscalMonth: s.fiscal_month,
      fiscalMonths: s.fiscal_months,
      reportDate: s.report_date.toISOString().slice(0, 10),
      pulledAt: s.pulled_at,
      pulledBy: s.pulled_by,
      primarySource: s.primary_source,
      secondarySource: s.secondary_source,
      officialBudgeted: num(s.official_budgeted),
      officialSpent: num(s.official_spent),
      paceLabel: `Straight-line month ${s.fiscal_month}`,
      source: "postgres"
    },
    accounts: accounts.rows.map((a) => ({
      acct: a.acct,
      name: a.name,
      budgeted: num(a.budgeted),
      spent: num(a.spent),
      category: a.category,
      cents: a.cents,
      ...(a.note ? { note: a.note } : {})
    })),
    flags: flags.rows,
    quality: quality.rows.map((r) => r.note)
  };
}
