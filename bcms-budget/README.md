# BCMS budget

Bedford County EMS FY2026-27 expenditure tracker. Postgres-backed. Neon-ready.

This folder is the app. GitHub's token on this machine cannot create `tedcox-EMT/bcms-budget` (`createRepository` 403), so the code lives in `teds-hub` until that private repo exists. Neon cloud is not provisioned here. Local PostgreSQL 16 is what runs today.

Ted's Hub **Budget** tile still opens the static tracker at `bcems-budget/`. This live app is http://127.0.0.1:8787/

## Database

```
postgres://bcms:bcms_local_dev@127.0.0.1:5432/bcms_budget
```

Copy `.env.example` to `.env`, then:

```bash
cd bcms-budget
npm install
npm run setup
npm start
```

`setup` applies `sql/001_schema.sql`, seeds FY2026-27 Month 2, and runs `npm run verify`.

Seed data is `data.js` (FY2026-27 Month 2: $5,479,719 budgeted, $633,309 spent). County finance is official. The AD `.xlsm` tracker is read-only detail only.

Snapshots are unique on fiscal year + fiscal month + report date. Month 1 is July when the fiscal year starts 2026-07-01.

### Neon cloud

Not set up in this workspace. When you have a personal API key:

1. Create it at https://console.neon.tech/app/settings/api-keys
2. `export NEON_API_KEY=...`
3. `npm run neon:setup`
4. `npm run setup`

`neon:setup` creates a Neon project named **BCMS budget**, database `bcms_budget`, and writes the pooled `DATABASE_URL` into `.env`. Do not commit `.env`.

On the Mac, `npx neonctl auth` can stand in for `NEON_API_KEY`. Cloud agents cannot finish that login.

## On the Mac

Cloud agents cannot create GitHub repos or Neon projects. From this folder on the Mac:

```bash
bash scripts/mac-setup.sh
bash scripts/publish-github.sh
```

`mac-setup.sh` opens Neon login in the browser, provisions **BCMS budget**, seeds Month 2, and starts http://127.0.0.1:8787/
`publish-github.sh` copies this folder to `~/Documents/bcms-budget` and creates or updates private `tedcox-EMT/bcms-budget`.

## Add or update a month

After `npm start`:

1. Open http://127.0.0.1:8787/enter.html
2. **Copy accounts** from the previous month
3. Set the new fiscal month, report date, and official department totals
4. Update year-to-date spent on each account
5. **Build flags from pace** if you want the 20-point flags calculated
6. Save. The same year + month + report date overwrites; a new report date inserts.

Or from a JSON file with the dashboard payload shape (`meta`, `accounts`, `flags`, `quality`):

```bash
npm run import -- snapshots/fy2026-27-month-03.json
```

`data.js` also works as an import file.

## API

- `GET /api/health` backend host, Neon flag, snapshot count
- `GET /api/snapshots` every stored month
- `GET /api/snapshot` latest month
- `GET /api/snapshot?fy=FY2026-2027&month=2` one month (latest report date if several)
- `GET /api/snapshot?id=1` one snapshot
- `PUT /api/snapshot` insert or update (JSON body, local bind only)
- `DELETE /api/snapshot?id=1` remove a snapshot

The dashboard month picker and the month-over-month strip read this API. Hub static `bcems-budget/` does not; it stays on the Month 2 `data.js` copy.

## Tests

```bash
npm run verify
```

Checks Month 2 official totals, then inserts and deletes a throwaway FY-VERIFY pair to prove upsert and prior-month linking.
