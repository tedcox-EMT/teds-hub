import path from "node:path";
import { ROOT, closePool } from "./db.js";
import { loadSnapshotFile } from "./load-file.js";
import { upsertSnapshot } from "./upsert.js";

const file = process.argv[2] || path.join(ROOT, "data.js");
const data = loadSnapshotFile(file);
const result = await upsertSnapshot(data);
console.log(
  `${result.created ? "inserted" : "updated"} snapshot ${result.id} ${result.meta.fiscalYear} month ${result.meta.fiscalMonth} (${result.meta.reportDate})`
);
await closePool();
