import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./db.js";

const apiKey = process.env.NEON_API_KEY;
const name = process.env.NEON_PROJECT_NAME || "BCMS budget";
const region = process.env.NEON_REGION || "aws-us-east-1";

function extractJson(text) {
  const raw = (text || "").trim();
  const brace = raw.search(/[{[]/);
  if (brace < 0) return null;
  return JSON.parse(raw.slice(brace));
}

function neon(args) {
  const extra = apiKey ? ["--api-key", apiKey] : [];
  const result = spawnSync(
    "npx",
    ["--yes", "neonctl@latest", ...args, ...extra, "-o", "json"],
    { encoding: "utf8" }
  );
  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || "").trim();
    if (/auth|unauthor|sign in|login/i.test(err) && !apiKey) {
      console.error("Neon CLI is not signed in.");
      console.error("On the Mac, run: npx neonctl auth");
      console.error("Safari opens. Click Authorize. Then run: npm run neon:setup");
    } else {
      console.error(err || "neonctl failed");
    }
    process.exit(result.status || 1);
  }
  try {
    return extractJson(result.stdout);
  } catch {
    console.error("Could not parse neonctl JSON.");
    console.error(result.stdout);
    process.exit(1);
  }
}

const listed = neon(["projects", "list"]) || {};
const list = Array.isArray(listed) ? listed : listed.projects || listed.items || [];
let project = list.find((p) => (p.name || p.project?.name) === name);

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

const wrapped = project.project || project;
const projectId = wrapped.id || wrapped.project_id;
if (!projectId) {
  console.error("Could not read project id from neonctl output.");
  console.error(JSON.stringify(project, null, 2));
  process.exit(1);
}

const conn = neon(["connection-string", "--project-id", projectId, "--pooled"]);
const url = typeof conn === "string"
  ? conn
  : conn?.connection_uri || conn?.uri || conn?.connectionString || conn?.connection_string;
if (!url) {
  console.error("Could not read connection string.");
  console.error(JSON.stringify(conn, null, 2));
  process.exit(1);
}

const envPath = path.join(ROOT, ".env");
let env = fs.existsSync(envPath)
  ? fs.readFileSync(envPath, "utf8")
  : fs.readFileSync(path.join(ROOT, ".env.example"), "utf8");
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
