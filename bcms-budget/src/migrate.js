import fs from "node:fs";
import path from "node:path";
import { ROOT, query, closePool } from "./db.js";

const sql = fs.readFileSync(path.join(ROOT, "sql/001_schema.sql"), "utf8");

await query(sql);
console.log("schema applied");
await closePool();
