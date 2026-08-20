#!/usr/bin/env python3
"""Check BCEMS budget snapshot invariants against the Month 2 export."""
from pathlib import Path
import json
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parent


def load_budget():
    node = subprocess.run(
        [
            "node",
            "-e",
            "global.window={}; require('fs').readFileSync; eval(require('fs').readFileSync('data.js','utf8')); process.stdout.write(JSON.stringify(window.BUDGET))",
        ],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    if node.returncode == 0 and node.stdout:
        return json.loads(node.stdout)
    src = (ROOT / "data.js").read_text()
    src = re.sub(r"/\*.*?\*/", "", src, flags=re.S)
    src = re.sub(r"window\.BUDGET\s*=\s*", "", src)
    src = re.sub(r"\s*;\s*$", "", src.strip())
    src = re.sub(r"([,{]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:", r'\1"\2":', src)
    src = re.sub(r"\btrue\b", "true", src)
    return json.loads(src)

data = load_budget()

errors = []
official_b = data["meta"]["officialBudgeted"]
official_s = data["meta"]["officialSpent"]
if official_b != 5479719:
    errors.append(f"officialBudgeted {official_b} != 5479719")
if official_s != 633309:
    errors.append(f"officialSpent {official_s} != 633309")

accounts = data["accounts"]
if len(accounts) != 30:
    errors.append(f"expected 30 accounts, got {len(accounts)}")

accts = [a["acct"] for a in accounts]
if len(accts) != len(set(accts)):
    errors.append("duplicate account numbers")

listed_b = sum(a["budgeted"] for a in accounts)
listed_s = sum(a["spent"] for a in accounts)
gap = official_b - listed_b
if abs(listed_s - official_s) > 1.5:
    errors.append(f"listed spent {listed_s} drifts from official {official_s}")
if not (50000 <= gap <= 80000):
    errors.append(f"listed vs official budget gap {gap} is outside the known ~$62,910 hole")

personnel = [a for a in accounts if a["category"] == "personnel"]
if len(personnel) != 7:
    errors.append(f"expected 7 personnel accounts, got {len(personnel)}")
pers_share = sum(a["budgeted"] for a in personnel) / official_b
if not (0.80 <= pers_share <= 0.84):
    errors.append(f"personnel share {pers_share:.3f} not ~82%")

refunds = next(a for a in accounts if a["acct"] == "509")
if refunds["budgeted"] != 0 or refunds["spent"] <= 0:
    errors.append("509 Refunds should be pass-through spend on a $0 budget")

vehicle = next(a for a in accounts if a["acct"] == "718")
if vehicle["spent"] / vehicle["budgeted"] < 0.9:
    errors.append("718 Motor Vehicle should be ~95% spent")

pace = data["meta"]["fiscalMonth"] / data["meta"]["fiscalMonths"]
if abs(pace - (2 / 12)) > 1e-9:
    errors.append("pace is not month 2 of 12")
if len(data["flags"]) != 4:
    errors.append("expected 4 ahead-of-pace flags")

required = {"105", "109", "131", "142", "162", "169", "187", "413", "425", "718"}
missing = required - set(accts)
if missing:
    errors.append(f"missing core accounts {sorted(missing)}")

if errors:
    print("FAIL")
    for e in errors:
        print(" -", e)
    sys.exit(1)

print("OK")
print(f" accounts={len(accounts)}")
print(f" official={official_b} spent={official_s} pct={official_s/official_b:.4f}")
print(f" listed_budgeted={listed_b} gap={gap}")
print(f" personnel_share={pers_share:.4f}")
print(f" pace={pace:.4f}")
