import { closePool } from "./db.js";
import { loadSnapshotFile } from "./load-file.js";
import { upsertSnapshot } from "./upsert.js";

const file = process.argv[2];
if (!file) {
  console.error("Usage: npm run import -- snapshots/fy2026-27-month-03.json");
  console.error("Accepts snapshot JSON or a data.js file that sets window.BUDGET.");
  process.exit(1);
}

const data = loadSnapshotFile(file);
const result = await upsertSnapshot(data);
console.log(
  `${result.created ? "inserted" : "updated"} snapshot ${result.id} ${result.meta.fiscalYear} month ${result.meta.fiscalMonth} report ${result.meta.reportDate}`
);
console.log(` accounts=${data.accounts.length} flags=${(data.flags || []).length}`);
await closePool();
