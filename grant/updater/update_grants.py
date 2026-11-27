#!/usr/bin/env python3
"""Recheck official grant pages and update status lines only.

The script never invents a grant, a dollar amount, or a deadline.
If a page does not contain a clear signal, the saved status stays as it is.
"""

from __future__ import annotations

import json
import re
import sys
import urllib.request
from datetime import date, datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "grants.json"
TODAY = date.today()
MONTHS = {
    "january": 1,
    "february": 2,
    "march": 3,
    "april": 4,
    "may": 5,
    "june": 6,
    "july": 7,
    "august": 8,
    "september": 9,
    "october": 10,
    "november": 11,
    "december": 12,
}
DATE_RE = re.compile(
    r"\b(January|February|March|April|May|June|July|August|September|October|November|December)"
    r"\s+(\d{1,2}),\s+(20\d{2})\b",
    re.I,
)


def fetch(url: str) -> str:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "BCEMSGrantCheck/1.0 (Bedford County EMS grant status check)"
        },
    )
    with urllib.request.urlopen(request, timeout=45) as response:
        raw = response.read()
    return raw.decode("utf-8", errors="replace")


def parse_dates(text: str) -> list[date]:
    found = []
    for month, day, year in DATE_RE.findall(text):
        try:
            found.append(date(int(year), MONTHS[month.lower()], int(day)))
        except ValueError:
            continue
    return found


def next_date(dates: list[date]) -> date | None:
    upcoming = sorted(item for item in dates if item >= TODAY)
    return upcoming[0] if upcoming else None


def pretty(value: date | None) -> str:
    if value is None:
        return ""
    return f"{value.strftime('%B')} {value.day}, {value.year}"


def apply_change(grant: dict, status: str, deadline: str, action: date | None, note: str) -> bool:
    action_text = action.isoformat() if action else None
    changed = (
        grant.get("status") != status
        or grant.get("deadlineLabel") != deadline
        or grant.get("actionDate") != action_text
        or grant.get("watcherNote") != note
    )
    if not changed:
        grant["watcherNote"] = note
        return False
    grant["status"] = status
    grant["deadlineLabel"] = deadline
    grant["actionDate"] = action_text
    grant["watcherNote"] = note
    grant["rulesVersion"] = TODAY.isoformat()
    return True


def check_fema(grant: dict, text: str) -> bool:
    closed = re.search(r"application period:\s*closed", text, re.I) is not None
    opened = re.search(r"application period:\s*open\b", text, re.I) is not None
    start = re.search(
        r"(?:from|opens)\s+([A-Z][a-z]+ \d{1,2}, 20\d{2}).{0,60}?(?:to|through)\s+([A-Z][a-z]+ \d{1,2}, 20\d{2})",
        text,
    )
    if opened and not closed:
        deadline = "The FEMA page says the application period is open. File in FEMA GO."
        if start:
            deadline = f"The FEMA page lists {start.group(1)} through {start.group(2)}."
        return apply_change(grant, "open", deadline, TODAY, "FEMA page shows an open application period.")
    if closed:
        grant["watcherNote"] = "FEMA page still shows the application period closed."
        if grant.get("status") == "open":
            return apply_change(
                grant,
                "prepare",
                "The FEMA page says the application period is closed. The next window is not posted yet.",
                None,
                grant["watcherNote"],
            )
    return False


def check_firehouse(grant: dict, text: str) -> bool:
    dates = parse_dates(text)
    upcoming = next_date(dates)
    closed = re.search(r"portal is currently closed|closed after reaching", text, re.I) is not None
    clock = re.search(r"(\d{1,2}(?::\d{2})?\s*p\.?m\.)\s*ET", text, re.I)
    hour = clock.group(1) if clock else "2:00 p.m."
    if closed and upcoming:
        label = (
            f"Portal opens {pretty(upcoming)} at {hour} ET. "
            "It stops after 600 applications."
        )
        return apply_change(
            grant,
            "prepare",
            label,
            upcoming,
            "Foundation page lists the next portal opening.",
        )
    if not closed and upcoming == TODAY:
        return apply_change(
            grant,
            "open",
            "The foundation portal is open today. Submit before the 600-application cap.",
            TODAY,
            "Foundation page no longer says the portal is closed.",
        )
    if not closed and "application" in text.lower() and "submit" in text.lower():
        return apply_change(
            grant,
            "open",
            "The foundation page is accepting applications. Submit before the 600-application cap.",
            TODAY,
            "Foundation page appears open.",
        )
    return False


def check_thso(grant: dict, text: str) -> bool:
    if not re.search(r"March 1", text) or not re.search(r"March 31", text):
        grant["watcherNote"] = (
            "The THSO page no longer shows the March 1 to March 31 window. "
            "Check the page before you file."
        )
        return False
    year = TODAY.year if (TODAY.month, TODAY.day) <= (3, 31) else TODAY.year + 1
    opens = date(year, 3, 1)
    if TODAY.month == 3 and TODAY.day <= 31:
        return apply_change(
            grant,
            "open",
            "THSO applications are open through March 31. File at THSOGrants.org.",
            TODAY,
            "THSO page still uses the March 1 to March 31 window, and today is inside it.",
        )
    return apply_change(
        grant,
        "prepare",
        f"Applications open March 1 and close March 31. Next window starts {pretty(opens)}. Confirm the date on the THSO page.",
        opens,
        "THSO page still uses the March 1 to March 31 window.",
    )


def check_cdbg(grant: dict, text: str) -> bool:
    hits = []
    for match in re.finditer(r"(due|deadline|last day to submit)", text, re.I):
        hits.extend(parse_dates(text[match.start(): match.start() + 140]))
    upcoming = next_date(hits)
    if upcoming:
        state = "open" if upcoming <= TODAY else "prepare"
        return apply_change(
            grant,
            state,
            f"TNECD posted an application date of {pretty(upcoming)}.",
            upcoming,
            "CDBG page contains a future application date.",
        )
    grant["watcherNote"] = "CDBG page has no future application deadline yet."
    return False


def check_tema(grant: dict, text: str) -> bool:
    if re.search(r"deadline", text, re.I):
        upcoming = next_date(parse_dates(text))
        if upcoming:
            return apply_change(
                grant,
                "prepare",
                f"TEMA page mentions {pretty(upcoming)}. Confirm the portal date with Bedford County EMA.",
                upcoming,
                "TEMA page lists a future date near a deadline.",
            )
    grant["watcherNote"] = "TEMA page has no posted deadline. Keep working through the local EMA."
    return False


def check_rhtp(grant: dict, text: str) -> bool:
    lowered = text.lower()
    if any(word in lowered for word in ("emergency medical", "ambulance", "ems workforce")) and "apply" in lowered:
        upcoming = next_date(parse_dates(text))
        if upcoming:
            return apply_change(
                grant,
                "open" if upcoming <= TODAY else "prepare",
                f"The rural health page lists an EMS-related date of {pretty(upcoming)}. Read the notice before you file.",
                upcoming,
                "Rural health page mentions EMS and an application date.",
            )
    grant["watcherNote"] = "No new EMS notice found on the rural health page."
    return False


CHECKS = {
    "fema-afg": check_fema,
    "firehouse": check_firehouse,
    "thso": check_thso,
    "cdbg": check_cdbg,
    "tema": check_tema,
    "rhtp": check_rhtp,
}


def thso_clock() -> dict:
    year = TODAY.year if (TODAY.month, TODAY.day) <= (3, 31) else TODAY.year + 1
    close = date(year, 3, 31).isoformat()
    if TODAY.month == 3 and TODAY.day <= 31:
        return {"kind": "due", "on": close}
    return {"kind": "closes", "on": close, "planned": True}


def firehouse_clock(grant: dict) -> dict | None:
    if grant.get("status") == "open":
        return None
    action = grant.get("actionDate")
    if not action:
        return None
    label = grant.get("deadlineLabel") or ""
    match = re.search(r"(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.|p\.?m\.)\s*ET", label, re.I)
    if not match:
        return {"kind": "opens", "on": action}
    hour = int(match.group(1))
    minute = int(match.group(2) or 0)
    meridiem = match.group(3).lower()
    if meridiem.startswith("p") and hour < 12:
        hour += 12
    if meridiem.startswith("a") and hour == 12:
        hour = 0
    year, month, day = (int(part) for part in action.split("-"))
    moment = datetime(year, month, day, hour, minute, tzinfo=ZoneInfo("America/New_York"))
    return {"kind": "opens", "at": moment.isoformat()}


def due_clock(grant: dict) -> dict | None:
    action = grant.get("actionDate")
    label = grant.get("deadlineLabel") or ""
    if not action or not re.search(r"due|deadline|through|application date", label, re.I):
        return None
    return {"kind": "due", "on": action}


def clock_for(grant: dict) -> dict | None:
    gid = grant.get("id")
    if gid == "thso":
        return thso_clock()
    if gid == "firehouse":
        return firehouse_clock(grant)
    if gid in {"srf", "cdbg", "cdbg-ed", "abc", "outdoor", "bric", "afg-vehicle", "afg-ops"}:
        return due_clock(grant)
    return None


def sync_clocks(data: dict) -> bool:
    changed = False
    for grant in data["grants"]:
        clock = clock_for(grant)
        if grant.get("clock") != clock:
            grant["clock"] = clock
            changed = True
    return changed


def main() -> int:
    data = json.loads(DATA_PATH.read_text())
    changed = False
    for grant in data["grants"]:
        watch = grant.get("watch") or {}
        kind = watch.get("kind")
        url = watch.get("url")
        checker = CHECKS.get(kind)
        if not checker or not url:
            continue
        try:
            text = fetch(url)
        except Exception as error:
            grant["watcherNote"] = f"The weekly check could not read the funder page. {error.__class__.__name__}."
            changed = True
            continue
        if checker(grant, text):
            changed = True
    if sync_clocks(data):
        changed = True
    data["checkedAt"] = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    DATA_PATH.write_text(json.dumps(data, indent=2) + "\n")
    print("updated" if changed else "checked")
    return 0


if __name__ == "__main__":
    sys.exit(main())
