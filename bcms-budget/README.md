# BCMS budget

Bedford County EMS FY2026-27 expenditure tracker. Postgres-backed. Neon-ready.

This folder is the BCMS budget app. GitHub's token on this machine cannot create `tedcox-EMT/bcms-budget`, so the code lives in `teds-hub` until that private repo exists. Create it empty and this tree can be pushed as-is.

## Database

Local PostgreSQL 16 is already created on this workspace:

```
postgres://bcms:bcms_local_dev@127.0.0.1:5432/bcms_budget
```

That is the same SQL Neon will run. Copy `.env.example` to `.env`, then:

```bash
cd bcms-budget
npm install
npm run setup
npm start
```

The dashboard is in `public/`. After `npm start`, open http://127.0.0.1:8787/

Seed data is `data.js` (FY2026-27 Month 2). County finance is official. The AD `.xlsm` tracker is read-only detail only.

### Neon cloud

1. Create a personal API key at https://console.neon.tech/app/settings/api-keys
2. `export NEON_API_KEY=...`
3. `npm run neon:setup`
4. `npm run setup`

`neon:setup` creates a Neon project named **BCMS budget**, database `bcms_budget`, and writes the pooled `DATABASE_URL` into `.env`. Do not commit `.env`.

## API

- `GET /api/health` backend host and whether the URL is Neon
- `GET /api/snapshot` latest fiscal snapshot in the dashboard payload shape

County finance is official. The AD `.xlsm` tracker is read-only detail only.
