import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

export function loadSnapshotFile(filePath) {
  const abs = path.resolve(filePath);
  const text = fs.readFileSync(abs, "utf8");
  if (abs.endsWith(".json")) return JSON.parse(text);
  const context = { window: {} };
  vm.runInNewContext(text, context);
  if (!context.window.BUDGET) throw new Error(`${abs} did not set window.BUDGET`);
  return context.window.BUDGET;
}
