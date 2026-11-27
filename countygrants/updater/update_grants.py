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
        headers={"User-Agent": "CountyGrantCheck/1.0 (Bedford County grant status check)"},
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


def check_srf(grant: dict, text: str) -> bool:
    window = re.search(
        r"from\s+([A-Z][a-z]+ \d{1,2}, 20\d{2})\s+through\s+([A-Z][a-z]+ \d{1,2}, 20\d{2})",
        text,
    )
    if not window:
        grant["watcherNote"] = "The TDEC page does not show a current through date."
        return False
    end = parse_dates(window.group(2) + " ")
    if not end:
        return False
    if end[0] >= TODAY:
        return apply_change(
            grant,
            "open",
            f"Applications are open from {window.group(1)} through {window.group(2)}.",
            end[0],
            "TDEC page shows an open water infrastructure window.",
        )
    return apply_change(
        grant,
        "prepare",
        f"The posted window ended {window.group(2)}. The next window is not on the page yet.",
        None,
        "TDEC page shows a closed water infrastructure window.",
    )


def check_bric(grant: dict, text: str) -> bool:
    if re.search(r"application period is closed|no longer accepting", text, re.I):
        grant["watcherNote"] = "FEMA still shows the BRIC application period closed."
        if grant.get("status") == "open":
            return apply_change(
                grant,
                "prepare",
                "The FEMA page says the application period is closed. The next window is not posted yet.",
                None,
                grant["watcherNote"],
            )
        return False
    if re.search(r"currently accepting|application period is open", text, re.I):
        upcoming = next_date(parse_dates(text))
        label = "The FEMA page says BRIC applications are open."
        if upcoming:
            label = f"The FEMA page lists a BRIC date of {pretty(upcoming)}."
        return apply_change(grant, "open", label, upcoming or TODAY, "FEMA page shows an open BRIC period.")
    return False


def check_tema(grant: dict, text: str) -> bool:
    if re.search(r"deadline", text, re.I):
        upcoming = next_date(parse_dates(text))
        if upcoming:
            return apply_change(
                grant,
                "prepare",
                f"TEMA page mentions {pretty(upcoming)}. Confirm the portal date before you file.",
                upcoming,
                "TEMA page lists a future date near a deadline.",
            )
    grant["watcherNote"] = "TEMA page has no posted deadline."
    return False


def check_outdoor(grant: dict, text: str) -> bool:
    if re.search(r"anticipates opening its next grant application cycle in 2028", text, re.I):
        grant["watcherNote"] = "TDEC still says the next outdoor recreation cycle is anticipated in 2028."
        return False
    upcoming = next_date(parse_dates(text))
    if upcoming and re.search(r"application", text, re.I):
        state = "open" if upcoming <= TODAY else "prepare"
        return apply_change(
            grant,
            state,
            f"TDEC posted an outdoor recreation date of {pretty(upcoming)}.",
            upcoming,
            "Outdoor recreation page lists an application date.",
        )
    return False


def check_thso(grant: dict, text: str) -> bool:
    if not re.search(r"March 1", text) or not re.search(r"March 31", text):
        grant["watcherNote"] = "The THSO page no longer shows the March 1 to March 31 window. Check the page before you file."
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


def check_abc(grant: dict, text: str) -> bool:
    upcoming = next_date(parse_dates(text))
    if upcoming and re.search(r"deadline", text, re.I):
        state = "open" if upcoming <= TODAY else "prepare"
        return apply_change(
            grant,
            state,
            f"The arts district page lists a deadline of {pretty(upcoming)}.",
            upcoming,
            "Arts Build Communities page lists a future deadline.",
        )
    grant["watcherNote"] = "The arts page has no future deadline yet."
    return False


def check_cops(grant: dict, text: str) -> bool:
    if re.search(r"\bopen\b", text, re.I) and not re.search(r"closed", text, re.I):
        upcoming = next_date(parse_dates(text))
        return apply_change(
            grant,
            "open",
            "The COPS grants page shows an open program. Read the notice before you file.",
            upcoming or TODAY,
            "COPS page shows an open program.",
        )
    grant["watcherNote"] = "The COPS grants page does not show a new open hiring program."
    return False


def check_firehouse(grant: dict, text: str) -> bool:
    dates = parse_dates(text)
    upcoming = next_date(dates)
    closed = re.search(r"portal is currently closed|closed after reaching", text, re.I) is not None
    clock = re.search(r"(\d{1,2}(?::\d{2})?\s*p\.?m\.)\s*ET", text, re.I)
    hour = clock.group(1) if clock else "2:00 p.m."
    if closed and upcoming:
        label = f"Portal opens {pretty(upcoming)} at {hour} ET. It stops after 600 applications."
        return apply_change(grant, "prepare", label, upcoming, "Foundation page lists the next portal opening.")
    if not closed and upcoming == TODAY:
        return apply_change(
            grant,
            "open",
            "The foundation portal is open today. Submit before the 600-application cap.",
            TODAY,
            "Foundation page no longer says the portal is closed.",
        )
    return False


def check_usda(grant: dict, text: str) -> bool:
    if re.search(r"20,000", text):
        grant["watcherNote"] = "USDA still limits Community Facilities to a rural area of 20,000 or fewer."
    return False


def check_eda(grant: dict, text: str) -> bool:
    grant["watcherNote"] = "EDA page checked. Distress still has to be confirmed before a Bedford County project is filed."
    return False


CHECKS = {
    "cdbg": check_cdbg,
    "srf": check_srf,
    "bric": check_bric,
    "tema": check_tema,
    "outdoor": check_outdoor,
    "thso": check_thso,
    "abc": check_abc,
    "cops": check_cops,
    "firehouse": check_firehouse,
    "usda": check_usda,
    "eda": check_eda,
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
