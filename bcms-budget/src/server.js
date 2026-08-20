import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { ROOT, closePool, isNeon, databaseUrl } from "./db.js";
import { latestSnapshot } from "./snapshot.js";

const PORT = Number(process.env.PORT || 8787);
const staticRoot = path.join(ROOT, "../bcems-budget");

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

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname === "/api/health") {
      return send(res, 200, JSON.stringify({
        ok: true,
        neon: isNeon(),
        host: new URL(databaseUrl()).host
      }), { "content-type": "application/json; charset=utf-8" });
    }
    if (url.pathname === "/api/snapshot") {
      const payload = await latestSnapshot();
      if (!payload) return send(res, 404, JSON.stringify({ error: "No snapshot" }), { "content-type": "application/json; charset=utf-8" });
      return send(res, 200, JSON.stringify(payload), {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
      });
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
    send(res, 500, JSON.stringify({ error: err.message }), { "content-type": "application/json; charset=utf-8" });
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
