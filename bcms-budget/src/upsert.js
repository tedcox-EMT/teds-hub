import { getPool } from "./db.js";
import { validatePayload } from "./validate.js";

export async function upsertSnapshot(raw) {
  const data = validatePayload(raw);
  const m = data.meta;
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const existing = await client.query(
      `SELECT id FROM snapshots WHERE fiscal_year = $1 AND fiscal_month = $2 AND report_date = $3`,
      [m.fiscalYear, m.fiscalMonth, m.reportDate]
    );
    let snapshotId;
    if (existing.rowCount) {
      snapshotId = existing.rows[0].id;
      await client.query(`DELETE FROM accounts WHERE snapshot_id = $1`, [snapshotId]);
      await client.query(`DELETE FROM flags WHERE snapshot_id = $1`, [snapshotId]);
      await client.query(`DELETE FROM quality_notes WHERE snapshot_id = $1`, [snapshotId]);
      await client.query(
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
          m.department,
          m.fiscalYearStart,
          m.fiscalYearEnd,
          m.fiscalMonths,
          m.pulledAt,
          m.pulledBy,
          m.primarySource,
          m.secondarySource,
          m.officialBudgeted,
          m.officialSpent,
          snapshotId
        ]
      );
    } else {
      const inserted = await client.query(
        `INSERT INTO snapshots (
          department, fiscal_year, fiscal_year_start, fiscal_year_end,
          fiscal_month, fiscal_months, report_date, pulled_at, pulled_by,
          primary_source, secondary_source, official_budgeted, official_spent
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        RETURNING id`,
        [
          m.department,
          m.fiscalYear,
          m.fiscalYearStart,
          m.fiscalYearEnd,
          m.fiscalMonth,
          m.fiscalMonths,
          m.reportDate,
          m.pulledAt,
          m.pulledBy,
          m.primarySource,
          m.secondarySource,
          m.officialBudgeted,
          m.officialSpent
        ]
      );
      snapshotId = inserted.rows[0].id;
    }

    for (const a of data.accounts) {
      await client.query(
        `INSERT INTO accounts (snapshot_id, acct, name, budgeted, spent, category, cents, note)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [snapshotId, a.acct, a.name, a.budgeted, a.spent, a.category, a.cents, a.note]
      );
    }
    for (const f of data.flags) {
      await client.query(
        `INSERT INTO flags (snapshot_id, acct, title, detail) VALUES ($1,$2,$3,$4)`,
        [snapshotId, f.acct, f.title, f.detail]
      );
    }
    for (let i = 0; i < data.quality.length; i += 1) {
      await client.query(
        `INSERT INTO quality_notes (snapshot_id, sort_order, note) VALUES ($1,$2,$3)`,
        [snapshotId, i, data.quality[i]]
      );
    }
    await client.query("COMMIT");
    return { id: snapshotId, created: !existing.rowCount, meta: m };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteSnapshot({ id, fy, month, reportDate } = {}) {
  const client = await getPool().connect();
  try {
    if (id) {
      const r = await client.query(`DELETE FROM snapshots WHERE id = $1 RETURNING id`, [id]);
      return r.rowCount;
    }
    if (!fy || month == null || !reportDate) {
      throw new Error("Delete needs id, or fiscal year plus month plus report date.");
    }
    const r = await client.query(
      `DELETE FROM snapshots WHERE fiscal_year = $1 AND fiscal_month = $2 AND report_date = $3 RETURNING id`,
      [fy, Number(month), reportDate]
    );
    return r.rowCount;
  } finally {
    client.release();
  }
}
