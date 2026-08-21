#!/usr/bin/env bash
# Run this on Ted's Mac while signed into gh as tedcox-EMT.
# Copies this folder to a standalone git repo and pushes tedcox-EMT/bcms-budget.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${BCMS_BUDGET_DIR:-$HOME/Documents/bcms-budget}"
REPO="tedcox-EMT/bcms-budget"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh is missing. On the Mac: brew install gh && gh auth login"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub CLI is not signed in. Run: gh auth login"
  exit 1
fi

mkdir -p "$DEST"
rsync -a --delete \
  --exclude node_modules \
  --exclude .env \
  --exclude .data \
  --exclude .git \
  "$ROOT/" "$DEST/"

cd "$DEST"
if [ ! -d .git ]; then
  git init -b main
fi
git add -A
if git diff --cached --quiet; then
  echo "Nothing new to commit in $DEST"
else
  git commit -m "BCMS budget tracker"
fi

if gh repo view "$REPO" >/dev/null 2>&1; then
  echo "Repo $REPO already exists. Pushing..."
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://github.com/${REPO}.git"
  git push -u origin HEAD:main
else
  gh repo create "$REPO" --private --description "Bedford County EMS budget tracker" --source=. --remote=origin --push
fi

echo "Sent: https://github.com/${REPO}"
echo "Local copy: $DEST"
