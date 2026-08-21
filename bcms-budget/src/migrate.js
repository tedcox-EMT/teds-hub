import fs from "node:fs";
import path from "node:path";
import { ROOT, query, closePool } from "./db.js";

const sqlDir = path.join(ROOT, "sql");
const files = fs.readdirSync(sqlDir).filter((f) => f.endsWith(".sql")).sort();
if (!files.length) throw new Error("No SQL files in sql/");

for (const file of files) {
  const sql = fs.readFileSync(path.join(sqlDir, file), "utf8");
  await query(sql);
  console.log(`applied ${file}`);
}
await closePool();
