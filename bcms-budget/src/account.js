import { query } from "./db.js";

export function normalizeTurnStatus(value) {
  if (value == null || value === "") return null;
  if (value === "T" || value === "clear") return value;
  throw new Error("turnStatus must be T, clear, or null.");
}

export async function updateTurnStatus({ snapshotId, acct, turnStatus } = {}) {
  const id = Number(snapshotId);
  const code = acct == null ? "" : String(acct).trim();
  if (!Number.isInteger(id) || id < 1) throw new Error("snapshotId is required.");
  if (!code) throw new Error("acct is required.");
  const status = normalizeTurnStatus(turnStatus);
  const r = await query(
    `UPDATE accounts SET turn_status = $1
     WHERE snapshot_id = $2 AND acct = $3
     RETURNING snapshot_id, acct, name, turn_status`,
    [status, id, code]
  );
  if (!r.rowCount) throw new Error("Account not found.");
  const row = r.rows[0];
  return {
    snapshotId: row.snapshot_id,
    acct: row.acct,
    name: row.name,
    turnStatus: row.turn_status
  };
}
