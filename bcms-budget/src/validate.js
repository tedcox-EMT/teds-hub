const CATEGORIES = new Set(["personnel", "operating", "capital", "passthrough"]);

export function num(v) {
  if (v == null || v === "") return 0;
  const n = typeof v === "number" ? v : Number(String(v).replace(/[$,]/g, ""));
  if (!Number.isFinite(n)) throw new Error(`Not a number: ${v}`);
  return n;
}

export function isoDate(v) {
  if (!v) return null;
  if (typeof v === "string") return v.slice(0, 10);
  return v.toISOString().slice(0, 10);
}

export function fiscalMonthName(fyStart, month) {
  const start = isoDate(fyStart) || "2026-07-01";
  const d = new Date(`${start}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + (Number(month) - 1));
  return d.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
}

export function validatePayload(data) {
  if (!data || typeof data !== "object") throw new Error("Snapshot JSON is required.");
  if (!data.meta || typeof data.meta !== "object") throw new Error("meta is required.");
  const m = data.meta;
  const required = [
    "fiscalYear",
    "fiscalYearStart",
    "fiscalYearEnd",
    "fiscalMonth",
    "reportDate",
    "officialBudgeted",
    "officialSpent",
    "primarySource"
  ];
  for (const key of required) {
    if (m[key] == null || m[key] === "") throw new Error(`meta.${key} is required.`);
  }
  const fiscalMonth = Number(m.fiscalMonth);
  if (!Number.isInteger(fiscalMonth) || fiscalMonth < 1 || fiscalMonth > 12) {
    throw new Error("meta.fiscalMonth must be an integer from 1 to 12.");
  }
  if (!Array.isArray(data.accounts) || data.accounts.length < 1) {
    throw new Error("accounts must be a non-empty array.");
  }
  for (const a of data.accounts) {
    if (!a || !a.acct || !a.name) throw new Error("Each account needs acct and name.");
    if (!CATEGORIES.has(a.category)) {
      throw new Error(`Account ${a.acct} has a bad category. Use personnel, operating, capital, or passthrough.`);
    }
    num(a.budgeted);
    num(a.spent);
  }
  return {
    meta: {
      department: m.department || "Bedford County EMS",
      shortName: m.shortName || "BCEMS",
      fiscalYear: String(m.fiscalYear),
      fiscalYearStart: isoDate(m.fiscalYearStart),
      fiscalYearEnd: isoDate(m.fiscalYearEnd),
      fiscalMonth,
      fiscalMonths: Number(m.fiscalMonths) || 12,
      reportDate: isoDate(m.reportDate),
      pulledAt: m.pulledAt || null,
      pulledBy: m.pulledBy || null,
      primarySource: String(m.primarySource),
      secondarySource: m.secondarySource || null,
      officialBudgeted: num(m.officialBudgeted),
      officialSpent: num(m.officialSpent),
      paceLabel: m.paceLabel || `Straight-line month ${fiscalMonth}`
    },
    accounts: data.accounts.map((a) => ({
      acct: String(a.acct),
      name: String(a.name),
      budgeted: num(a.budgeted),
      spent: num(a.spent),
      category: a.category,
      cents: Boolean(a.cents),
      note: a.note || null,
      turnStatus: a.turnStatus === "T" || a.turnStatus === "clear" ? a.turnStatus : null
    })),
    flags: Array.isArray(data.flags)
      ? data.flags.map((f) => ({
          acct: String(f.acct || ""),
          title: String(f.title || ""),
          detail: String(f.detail || "")
        }))
      : [],
    quality: Array.isArray(data.quality) ? data.quality.map((n) => String(n)) : []
  };
}
