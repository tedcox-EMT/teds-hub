# BCEMS Budget Tracker

Private FY2026-27 expenditure snapshot for Bedford County EMS.

This lives in Ted's Hub because GitHub has no `scorpionclaw/bcems-budget` repo yet, and `tedcox-EMT/teds-hub` is the connected workspace.

## What it shows

- County department totals: $5,479,719 budgeted, $633,309 spent (11.6%) as of the July 2026 statement
- Month 2 straight-line pace vs actual
- Personnel / operating / capital split
- Account table with search, type filters, and sort
- Ahead-of-pace flags (more than 20 points above the 16.7% line)
- Data-quality catches from the Month 2 export

County finance is official. The assistant director `.xlsm` tracker is read-only detail only.

## Open it

From Ted's Hub, use the Work sidebar **Budget** tile, or open `bcems-budget/index.html`.

Serve the repo locally if the browser blocks `file://` scripts:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/bcems-budget/`.

The Postgres/Neon app lives in `../bcms-budget`. After `npm start` there, the same dashboard at http://127.0.0.1:8787/ loads the snapshot from the database.

## Update a month

1. Edit `bcems-budget/data.js`.
2. Keep `meta.officialBudgeted` and `meta.officialSpent` as the county statement department totals.
3. Keep personnel cents from the payroll detail table when you have them.
4. Refresh the Flags and Catches lists to match the new month.

## Source

Notion: FY2026-27 Month 2 budget export (report date 2026-08-11, pulled by Lori at 9:39 AM).
Primary document: Bedford County Finance Statement of Expenditures and Encumbrances, July 2026.
