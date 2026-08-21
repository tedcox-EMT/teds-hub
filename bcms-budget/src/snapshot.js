import { query } from "./db.js";
import { fiscalMonthName, isoDate, num } from "./validate.js";

function mapAccounts(rows, priorByAcct) {
  return rows.map((a) => {
    const prior = priorByAcct.get(a.acct);
    const spent = num(a.spent);
    const budgeted = num(a.budgeted);
    const out = {
      acct: a.acct,
      name: a.name,
      budgeted,
      spent,
      category: a.category,
      cents: a.cents
    };
    if (a.note) out.note = a.note;
    if (prior) {
      out.priorSpent = prior.spent;
      out.priorBudgeted = prior.budgeted;
      out.spentDelta = spent - prior.spent;
    }
    return out;
  });
}

async function formatSnapshot(s) {
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
  const priorRes = await query(
    `SELECT * FROM snapshots
     WHERE fiscal_year = $1 AND id <> $2
       AND (
         fiscal_month < $3
         OR (fiscal_month = $3 AND report_date < $4)
         OR (fiscal_month = $3 AND report_date = $4 AND id < $2)
       )
     ORDER BY fiscal_month DESC, report_date DESC, id DESC
     LIMIT 1`,
    [s.fiscal_year, s.id, s.fiscal_month, s.report_date]
  );

  let prior = null;
  const priorByAcct = new Map();
  if (priorRes.rowCount) {
    const p = priorRes.rows[0];
    const pa = await query(
      `SELECT acct, spent, budgeted FROM accounts WHERE snapshot_id = $1`,
      [p.id]
    );
    for (const row of pa.rows) {
      priorByAcct.set(row.acct, { spent: num(row.spent), budgeted: num(row.budgeted) });
    }
    prior = {
      id: p.id,
      fiscalMonth: p.fiscal_month,
      monthName: fiscalMonthName(p.fiscal_year_start, p.fiscal_month),
      reportDate: isoDate(p.report_date),
      officialBudgeted: num(p.official_budgeted),
      officialSpent: num(p.official_spent),
      spentDelta: num(s.official_spent) - num(p.official_spent),
      budgetedDelta: num(s.official_budgeted) - num(p.official_budgeted)
    };
  }

  const fyStart = isoDate(s.fiscal_year_start);
  return {
    meta: {
      id: s.id,
      department: s.department,
      shortName: "BCEMS",
      fiscalYear: s.fiscal_year,
      fiscalYearStart: fyStart,
      fiscalYearEnd: isoDate(s.fiscal_year_end),
      fiscalMonth: s.fiscal_month,
      fiscalMonths: s.fiscal_months,
      monthName: fiscalMonthName(fyStart, s.fiscal_month),
      reportDate: isoDate(s.report_date),
      pulledAt: s.pulled_at,
      pulledBy: s.pulled_by,
      primarySource: s.primary_source,
      secondarySource: s.secondary_source,
      officialBudgeted: num(s.official_budgeted),
      officialSpent: num(s.official_spent),
      paceLabel: `Straight-line month ${s.fiscal_month}`,
      source: "postgres"
    },
    accounts: mapAccounts(accounts.rows, priorByAcct),
    flags: flags.rows,
    quality: quality.rows.map((r) => r.note),
    prior
  };
}

export async function listSnapshots() {
  const r = await query(
    `SELECT id, department, fiscal_year, fiscal_year_start, fiscal_month, fiscal_months,
            report_date, official_budgeted, official_spent, pulled_at, pulled_by, primary_source
     FROM snapshots
     ORDER BY fiscal_year DESC, fiscal_month DESC, report_date DESC, id DESC`
  );
  return r.rows.map((row) => ({
    id: row.id,
    department: row.department,
    fiscalYear: row.fiscal_year,
    fiscalMonth: row.fiscal_month,
    fiscalMonths: row.fiscal_months,
    monthName: fiscalMonthName(row.fiscal_year_start, row.fiscal_month),
    reportDate: isoDate(row.report_date),
    officialBudgeted: num(row.official_budgeted),
    officialSpent: num(row.official_spent),
    pulledAt: row.pulled_at,
    pulledBy: row.pulled_by,
    primarySource: row.primary_source
  }));
}

export async function loadSnapshot({ id, fy, month, reportDate } = {}) {
  let snap;
  if (id) {
    snap = await query(`SELECT * FROM snapshots WHERE id = $1`, [id]);
  } else if (fy && month != null && month !== "") {
    const params = [fy, Number(month)];
    let sql = `SELECT * FROM snapshots WHERE fiscal_year = $1 AND fiscal_month = $2`;
    if (reportDate) {
      sql += ` AND report_date = $3`;
      params.push(reportDate);
    }
    sql += ` ORDER BY report_date DESC, id DESC LIMIT 1`;
    snap = await query(sql, params);
  } else {
    snap = await query(
      `SELECT * FROM snapshots ORDER BY report_date DESC, fiscal_month DESC, id DESC LIMIT 1`
    );
  }
  if (!snap.rowCount) return null;
  return formatSnapshot(snap.rows[0]);
}

export async function latestSnapshot() {
  return loadSnapshot();
}
