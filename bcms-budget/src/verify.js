import { query, closePool, isNeon, databaseUrl } from "./db.js";

const errors = [];
const snap = await query(`SELECT * FROM snapshots ORDER BY id DESC LIMIT 1`);
if (!snap.rowCount) errors.push("no snapshot");
else {
  const s = snap.rows[0];
  if (Number(s.official_budgeted) !== 5479719) errors.push(`official_budgeted ${s.official_budgeted}`);
  if (Number(s.official_spent) !== 633309) errors.push(`official_spent ${s.official_spent}`);
  const n = await query(`SELECT count(*)::int AS n FROM accounts WHERE snapshot_id = $1`, [s.id]);
  if (n.rows[0].n !== 30) errors.push(`account count ${n.rows[0].n}`);
  const vehicle = await query(
    `SELECT spent / budgeted AS pct FROM accounts WHERE snapshot_id = $1 AND acct = '718'`,
    [s.id]
  );
  if (!vehicle.rowCount || Number(vehicle.rows[0].pct) < 0.9) errors.push("718 not ~95% spent");
  const pers = await query(
    `SELECT sum(budgeted)::numeric AS b FROM accounts WHERE snapshot_id = $1 AND category = 'personnel'`,
    [s.id]
  );
  const share = Number(pers.rows[0].b) / Number(s.official_budgeted);
  if (share < 0.8 || share > 0.84) errors.push(`personnel share ${share}`);
}

if (errors.length) {
  console.log("FAIL");
  for (const e of errors) console.log(" -", e);
  await closePool();
  process.exit(1);
}

const host = new URL(databaseUrl()).host;
console.log("OK");
console.log(` backend=${isNeon() ? "neon" : "postgres"} host=${host}`);
console.log(" snapshot=FY2026-2027 month 2");
console.log(" official=5479719 spent=633309 accounts=30");
await closePool();
