import { query, closePool, isNeon, databaseUrl } from "./db.js";
import { loadSnapshot, listSnapshots } from "./snapshot.js";
import { upsertSnapshot, deleteSnapshot } from "./upsert.js";
import { fiscalMonthName } from "./validate.js";

const errors = [];
function check(cond, msg) {
  if (!cond) errors.push(msg);
}

const month2 = await loadSnapshot({ fy: "FY2026-2027", month: 2, reportDate: "2026-08-11" });
check(month2, "month 2 snapshot missing");
if (month2) {
  check(month2.meta.officialBudgeted === 5479719, `official_budgeted ${month2.meta.officialBudgeted}`);
  check(month2.meta.officialSpent === 633309, `official_spent ${month2.meta.officialSpent}`);
  check(month2.accounts.length === 30, `account count ${month2.accounts.length}`);
  check(month2.meta.monthName === "August", `month name ${month2.meta.monthName}`);
  const vehicle = month2.accounts.find((a) => a.acct === "718");
  check(vehicle && vehicle.spent / vehicle.budgeted >= 0.9, "718 not ~95% spent");
  const personnel = month2.accounts.filter((a) => a.category === "personnel").reduce((s, a) => s + a.budgeted, 0);
  const share = personnel / month2.meta.officialBudgeted;
  check(share >= 0.8 && share <= 0.84, `personnel share ${share}`);
  check(month2.prior == null, "month 2 should have no prior month yet");
}

check(fiscalMonthName("2026-07-01", 1) === "July", "month 1 name");
check(fiscalMonthName("2026-07-01", 2) === "August", "month 2 name");

const verifyMeta = {
  department: "Bedford County EMS",
  fiscalYear: "FY-VERIFY",
  fiscalYearStart: "2026-07-01",
  fiscalYearEnd: "2027-06-30",
  fiscalMonths: 12,
  pulledAt: "verify",
  pulledBy: "verify",
  primarySource: "verify"
};

try {
  await deleteSnapshot({ fy: "FY-VERIFY", month: 1, reportDate: "2026-08-01" });
  await deleteSnapshot({ fy: "FY-VERIFY", month: 2, reportDate: "2026-09-01" });

  const first = await upsertSnapshot({
    meta: { ...verifyMeta, fiscalMonth: 1, reportDate: "2026-08-01", officialBudgeted: 1000, officialSpent: 100 },
    accounts: [
      { acct: "100", name: "Test A", budgeted: 600, spent: 50, category: "personnel" },
      { acct: "200", name: "Test B", budgeted: 400, spent: 50, category: "operating" }
    ],
    flags: [],
    quality: ["verify month 1"]
  });
  const second = await upsertSnapshot({
    meta: { ...verifyMeta, fiscalMonth: 2, reportDate: "2026-09-01", officialBudgeted: 1000, officialSpent: 250 },
    accounts: [
      { acct: "100", name: "Test A", budgeted: 600, spent: 120, category: "personnel" },
      { acct: "200", name: "Test B", budgeted: 400, spent: 130, category: "operating" }
    ],
    flags: [{ acct: "200", title: "Test B", detail: "ahead" }],
    quality: ["verify month 2"]
  });
  const again = await upsertSnapshot({
    meta: { ...verifyMeta, fiscalMonth: 2, reportDate: "2026-09-01", officialBudgeted: 1000, officialSpent: 250 },
    accounts: [
      { acct: "100", name: "Test A", budgeted: 600, spent: 120, category: "personnel" },
      { acct: "200", name: "Test B", budgeted: 400, spent: 130, category: "operating" }
    ],
    flags: [{ acct: "200", title: "Test B", detail: "ahead" }],
    quality: ["verify month 2 updated"]
  });
  check(first.created, "verify month 1 should insert");
  check(second.created, "verify month 2 should insert");
  check(!again.created && again.id === second.id, "second month should upsert in place");

  const loaded = await loadSnapshot({ fy: "FY-VERIFY", month: 2 });
  check(loaded?.prior?.fiscalMonth === 1, "prior month not linked");
  check(loaded?.prior?.spentDelta === 150, `spentDelta ${loaded?.prior?.spentDelta}`);
  check(loaded?.accounts.find((a) => a.acct === "100")?.spentDelta === 70, "account spentDelta");
  check(loaded?.quality[0] === "verify month 2 updated", "quality note not updated");

  const listed = await listSnapshots();
  check(listed.some((s) => s.fiscalYear === "FY-VERIFY" && s.fiscalMonth === 2), "list missing verify month");

  const live = await loadSnapshot({ fy: "FY2026-2027", month: 2 });
  check(live?.meta.officialSpent === 633309, "live month 2 changed during verify");
} finally {
  await deleteSnapshot({ fy: "FY-VERIFY", month: 1, reportDate: "2026-08-01" });
  await deleteSnapshot({ fy: "FY-VERIFY", month: 2, reportDate: "2026-09-01" });
}

const leftover = await query(`SELECT count(*)::int AS n FROM snapshots WHERE fiscal_year = 'FY-VERIFY'`);
check(leftover.rows[0].n === 0, "verify snapshots not cleaned up");

if (errors.length) {
  console.log("FAIL");
  for (const e of errors) console.log(" -", e);
  await closePool();
  process.exit(1);
}

const host = new URL(databaseUrl()).host;
const snaps = await listSnapshots();
console.log("OK");
console.log(` backend=${isNeon() ? "neon" : "postgres"} host=${host}`);
console.log(" snapshot=FY2026-2027 month 2");
console.log(" official=5479719 spent=633309 accounts=30");
console.log(` months=${snaps.length} upsert=ok prior=ok`);
await closePool();
