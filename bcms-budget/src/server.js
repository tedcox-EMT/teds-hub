import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { ROOT, closePool, isNeon, databaseUrl } from "./db.js";
import { latestSnapshot, listSnapshots, loadSnapshot } from "./snapshot.js";
import { upsertSnapshot, deleteSnapshot } from "./upsert.js";

const PORT = Number(process.env.PORT || 8787);
const staticRoot = path.join(ROOT, "public");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function json(res, status, obj) {
  send(res, status, JSON.stringify(obj), {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
}

function readBody(req, limit = 1_000_000) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error("Body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname === "/api/health") {
      const snaps = await listSnapshots();
      const latest = snaps[0] || null;
      return json(res, 200, {
        ok: true,
        neon: isNeon(),
        host: new URL(databaseUrl()).host,
        snapshots: snaps.length,
        latest: latest
          ? {
              id: latest.id,
              fiscalYear: latest.fiscalYear,
              fiscalMonth: latest.fiscalMonth,
              monthName: latest.monthName,
              reportDate: latest.reportDate
            }
          : null
      });
    }
    if (url.pathname === "/api/snapshots" && req.method === "GET") {
      return json(res, 200, await listSnapshots());
    }
    if (url.pathname === "/api/snapshot" && req.method === "GET") {
      const payload = await loadSnapshot({
        id: url.searchParams.get("id"),
        fy: url.searchParams.get("fy"),
        month: url.searchParams.get("month"),
        reportDate: url.searchParams.get("date")
      });
      if (!payload) return json(res, 404, { error: "No snapshot" });
      return json(res, 200, payload);
    }
    if (url.pathname === "/api/snapshot" && req.method === "PUT") {
      const body = JSON.parse(await readBody(req) || "{}");
      const result = await upsertSnapshot(body);
      const payload = await loadSnapshot({ id: result.id });
      return json(res, result.created ? 201 : 200, { ok: true, ...result, snapshot: payload });
    }
    if (url.pathname === "/api/snapshot" && req.method === "DELETE") {
      const deleted = await deleteSnapshot({
        id: url.searchParams.get("id"),
        fy: url.searchParams.get("fy"),
        month: url.searchParams.get("month"),
        reportDate: url.searchParams.get("date")
      });
      if (!deleted) return json(res, 404, { error: "No snapshot" });
      return json(res, 200, { ok: true, deleted });
    }
    if (url.pathname === "/enter" || url.pathname === "/enter.html") {
      url.pathname = "/enter.html";
    }
    if (url.pathname === "/api/latest") {
      const payload = await latestSnapshot();
      if (!payload) return json(res, 404, { error: "No snapshot" });
      return json(res, 200, payload);
    }
    let filePath = path.join(staticRoot, url.pathname === "/" ? "index.html" : url.pathname);
    filePath = path.normalize(filePath);
    if (!filePath.startsWith(staticRoot)) return send(res, 403, "Forbidden");
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      return send(res, 404, "Not found");
    }
    const ext = path.extname(filePath);
    send(res, 200, fs.readFileSync(filePath), { "content-type": TYPES[ext] || "application/octet-stream" });
  } catch (err) {
    const status = /required|bad category|fiscalMonth|JSON/i.test(err.message) ? 400 : 500;
    json(res, status, { error: err.message });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`BCMS budget on http://127.0.0.1:${PORT} (${isNeon() ? "Neon" : "Postgres"})`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    server.close();
    await closePool();
    process.exit(0);
  });
}
