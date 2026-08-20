import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./db.js";

const apiKey = process.env.NEON_API_KEY;
const name = process.env.NEON_PROJECT_NAME || "BCMS budget";
const region = process.env.NEON_REGION || "aws-us-east-1";

if (!apiKey) {
  console.error("NEON_API_KEY is missing.");
  console.error("Create a personal API key at https://console.neon.tech/app/settings/api-keys");
  console.error("Then: export NEON_API_KEY=... && npm run neon:setup");
  process.exit(1);
}

function neon(args) {
  const result = spawnSync(
    "npx",
    ["--yes", "neonctl@latest", ...args, "--api-key", apiKey, "-o", "json"],
    { encoding: "utf8" }
  );
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    process.exit(result.status || 1);
  }
  const text = (result.stdout || "").trim();
  return text ? JSON.parse(text) : null;
}

const projects = neon(["projects", "list"]) || [];
const list = Array.isArray(projects) ? projects : projects.projects || projects.items || [];
let project = list.find((p) => p.name === name || p.project?.name === name);

if (!project) {
  console.log(`Creating Neon project "${name}" in ${region}...`);
  project = neon([
    "projects",
    "create",
    "--name",
    name,
    "--region-id",
    region,
    "--database",
    "bcms_budget",
    "--set-context"
  ]);
} else {
  console.log(`Using existing Neon project "${name}"`);
}

const projectId = project.id || project.project?.id || project.project_id;
if (!projectId) {
  console.error("Could not read project id from neonctl output.");
  console.error(JSON.stringify(project, null, 2));
  process.exit(1);
}

const conn = neon(["connection-string", "--project-id", projectId, "--pooled"]);
const url = typeof conn === "string" ? conn : conn?.connection_uri || conn?.uri || conn?.connectionString;
if (!url) {
  console.error("Could not read connection string.");
  process.exit(1);
}

const envPath = path.join(ROOT, ".env");
let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : fs.readFileSync(path.join(ROOT, ".env.example"), "utf8");
if (/^DATABASE_URL=/m.test(env)) {
  env = env.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL=${url}`);
} else {
  env += `\nDATABASE_URL=${url}\n`;
}
if (!/^NEON_PROJECT_ID=/m.test(env)) env += `NEON_PROJECT_ID=${projectId}\n`;
else env = env.replace(/^NEON_PROJECT_ID=.*$/m, `NEON_PROJECT_ID=${projectId}`);
fs.writeFileSync(envPath, env);
console.log(`Wrote DATABASE_URL to ${envPath}`);
console.log(`Neon project id: ${projectId}`);
console.log("Run: npm run setup");
