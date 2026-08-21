#!/usr/bin/env bash
# Run this on Ted's Mac. Cloud agents cannot complete Neon or GitHub login.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "Node is missing. On the Mac: brew install node"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is missing. On the Mac: brew install node"
  exit 1
fi

npm install

if ! npx --yes neonctl@latest me >/dev/null 2>&1; then
  echo "Safari or Chrome will open for Neon. Click Authorize. You have about a minute."
  npx --yes neonctl@latest auth
fi

npm run neon:setup
npm run setup

PORT="${PORT:-8787}"
URL="http://127.0.0.1:${PORT}/"
echo "Starting BCMS budget at $URL"
npm start &
PID=$!
trap 'kill "$PID" 2>/dev/null || true' EXIT
sleep 1
if command -v open >/dev/null 2>&1; then
  open "$URL"
fi
wait "$PID"
