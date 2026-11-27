(() => {
  const DATA_URL = "legislation.json";
  const LIVE_UPDATES_URL = "live-updates.json";
  const FR_API_URL =
    "https://www.federalregister.gov/api/v1/documents.json?per_page=8&order=newest" +
    "&conditions%5Bpublication_date%5D%5Bgte%5D=2026-01-01" +
    "&conditions%5Bagencies%5D%5B%5D=federal-emergency-management-agency" +
    "&conditions%5Bagencies%5D%5B%5D=centers-for-medicare-medicaid-services" +
    "&conditions%5Bagencies%5D%5B%5D=transportation-department" +
    "&conditions%5Bterm%5D=ambulance+OR+disaster+OR+rural+OR+county+OR+bridge";

  const STORE_KEY = "bc_legislation_state_v1";
  const LIVE_CACHE_KEY = "bc_legislation_live_v2";
  const LIVE_CACHE_MS = 6 * 60 * 60 * 1000;

  const STATUS_META = {
    action: {
      label: "Action Needed",
      sectionTitle: "Action Needed Now",
      sectionDesc: "Upcoming county votes, state compliance deadlines, and rules taking effect soon.",
      cardClass: "card-action",
      badgeClass: "action"
    },
    pending: {
      label: "Submitted / Not Signed",
      sectionTitle: "Submitted & Pending Bills (Not Signed Yet)",
      sectionDesc: "Pre-filed 2027 Tennessee bills, pending Congressional bills, and county items awaiting a vote so you know what is coming.",
      cardClass: "card-pending",
      badgeClass: "pending"
    },
    enacted: {
      label: "Enacted Law",
      sectionTitle: "Enacted Laws & County Resolutions",
      sectionDesc: "Signed state acts, federal laws, constitutional amendments, and adopted Bedford County resolutions.",
      cardClass: "card-enacted",
      badgeClass: "enacted"
    }
  };

  const LEVEL_META = {
    local: { label: "Local", badgeClass: "level-local" },
    state: { label: "State", badgeClass: "level-state" },
    federal: { label: "Federal", badgeClass: "level-federal" }
  };

  const FALLBACK_SECTIONS = [
    { id: "budget", label: "Budget, Taxes & Finance", short: "Budget & Taxes", description: "Property taxes, sales tax bills, and county budgets." },
    { id: "zoning", label: "Zoning, Land & Utilities", short: "Zoning & Land", description: "Zoning, data centers, development timelines, and water or sewer rules." },
    { id: "roads", label: "Roads, Bridges & Rural Infrastructure", short: "Roads & Rural", description: "Highways, bridges, Farm Bill rural facilities, and utilities." },
    { id: "ems", label: "EMS, Fire, Law Enforcement & EMA", short: "Public Safety & EMS", description: "EMS, Sheriff, Jail, emergency sirens, and FEMA." },
    { id: "schools", label: "Schools, Health & Human Services", short: "Schools & Health", description: "Schools, childcare, TennCare, and rural health." },
    { id: "governance", label: "County Governance, Purchasing & Elections", short: "Governance", description: "Commission rules, public comment, E-Verify, and procurement." }
  ];

  const QUICK_SEARCHES = [
    "EMS bills",
    "Pending bills",
    "Property & sales taxes",
    "Data centers & zoning",
    "Roads & bridges",
    "Jail & sheriff",
    "Schools & health"
  ];

  const STOP_WORDS = new Set([
    "a", "an", "and", "are", "all", "about", "affect", "affects", "affecting", "any",
    "at", "be", "bedford", "bill", "bills", "by", "can", "county", "do", "does",
    "find", "for", "from", "get", "have", "here", "how", "i", "impact", "impacts",
    "in", "is", "it", "law", "laws", "legislation", "list", "me", "measure", "measures",
    "my", "of", "on", "or", "our", "pull", "related", "see", "show", "statute",
    "statutes", "tennessee", "that", "the", "this", "tn", "to", "up", "us", "we",
    "what", "which", "with"
  ]);

  const SYNONYMS = {
    ems: ["ems", "ambulance", "paramedic", "emt", "emergency medical", "bcems", "first responder", "community paramedicine", "treatment-in-place", "treatment in place", "medicare rural ambulance", "tenncare ground ambulance"],
    ambulance: ["ambulance", "ems", "paramedic", "emergency medical", "bcems", "treatment-in-place", "ruca"],
    paramedic: ["paramedic", "ems", "ambulance", "pronouncement", "community paramedicine"],
    fire: ["fire", "firefighter", "first responder", "fema", "siren", "emergency management"],
    responder: ["first responder", "ems", "paramedic", "firefighter", "law enforcement", "sheriff", "deputy"],
    police: ["police", "law enforcement", "sheriff", "deputy", "officer", "jail", "first responder"],
    sheriff: ["sheriff", "jail", "law enforcement", "deputy", "officer", "arrestee", "bail", "pretrial"],
    jail: ["jail", "detainee", "arrestee", "inmate", "pretrial", "bail", "sheriff", "medicaid"],
    inmate: ["inmate", "detainee", "arrestee", "jail", "pretrial", "medicaid"],
    tax: ["tax", "taxes", "property tax", "sales tax", "grocery", "freeze", "reappraisal", "assessment", "trustee", "revenue"],
    taxes: ["tax", "taxes", "property tax", "sales tax", "grocery", "freeze", "reappraisal", "assessment", "trustee", "revenue"],
    property: ["property", "reappraisal", "tax freeze", "assessment", "assessor", "zoning", "school grounds"],
    grocery: ["grocery", "food", "produce", "sales tax"],
    budget: ["budget", "finance", "tax rate", "amendment", "spending", "appropriation"],
    road: ["road", "roads", "highway", "bridge", "transportation", "iija", "build america", "hwy 231"],
    roads: ["road", "roads", "highway", "bridge", "transportation", "iija", "build america", "hwy 231"],
    highway: ["highway", "road", "bridge", "transportation", "build america", "hwy 231"],
    bridge: ["bridge", "bridges", "highway", "road", "transportation", "build america"],
    bridges: ["bridge", "bridges", "highway", "road", "transportation", "build america"],
    zoning: ["zoning", "codes", "planning", "development", "data center", "moratorium", "extraterritorial", "subdivision", "permit"],
    data: ["data center", "data centers", "hyperscale", "moratorium", "utility"],
    center: ["data center", "data centers", "hyperscale", "moratorium"],
    centers: ["data center", "data centers", "hyperscale", "moratorium"],
    water: ["water", "wastewater", "sewer", "duck river", "utility district", "pharmaceutical", "hwy 231"],
    sewer: ["sewer", "wastewater", "water", "hwy 231", "utility"],
    school: ["school", "schools", "education", "student", "childcare", "board", "off-duty"],
    schools: ["school", "schools", "education", "student", "childcare", "board", "off-duty"],
    health: ["health", "rural health", "medicare", "medicaid", "tenncare", "mental health", "ambulance", "ems", "wastewater"],
    medicare: ["medicare", "ambulance", "ruca", "treatment-in-place", "care act", "rocs"],
    medicaid: ["medicaid", "tenncare", "pretrial", "jail", "ambulance"],
    tenncare: ["tenncare", "medicaid", "ambulance", "temporary"],
    fema: ["fema", "disaster", "tema", "ema", "emergency management", "siren", "tornado"],
    disaster: ["disaster", "fema", "tema", "ema", "tornado", "siren", "flood", "warning"],
    tornado: ["tornado", "siren", "warning", "disaster", "ema", "fema"],
    siren: ["siren", "warning", "tornado", "bead", "ema"],
    sirens: ["siren", "warning", "tornado", "bead", "ema"],
    farm: ["farm", "usda", "rural", "agriculture", "community facilities", "broadband"],
    rural: ["rural", "usda", "farm", "ambulance", "broadband", "childcare", "partnership", "health"],
    broadband: ["broadband", "bead", "siren", "farm bill", "rural"],
    everify: ["e-verify", "everify", "verify", "procurement", "human resources"],
    commission: ["commission", "commissioners", "local rules", "public comment", "dual office", "zoning", "budget"]
  };

  const STAGE_KEYWORDS = {
    pending: ["pending", "submitted", "prefiled", "pre-filed", "upcoming", "coming", "unsigned", "proposed", "introduced"],
    enacted: ["enacted", "signed", "passed", "effective"],
    action: ["urgent", "deadline", "deadlines", "vote", "action"]
  };

  const POSITIONS = [
    { id: "", label: "No position set" },
    { id: "action", label: "Action Needed" },
    { id: "support", label: "Support" },
    { id: "monitor", label: "Monitor" },
    { id: "concern", label: "Concern / Oppose" }
  ];

  let catalog = null;
  let updates = null;
  let userState = loadUserState();
  let ui = {
    level: "all",
    topic: "all",
    status: "all",
    groupBy: "section",
    query: "",
    watchFilter: "all",
    copiedId: "",
    copiedBrief: false
  };
  let live = loadLiveCache();

  function loadUserState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return { saved: {}, positions: {}, notes: {} };
      const parsed = JSON.parse(raw);
      return {
        saved: parsed.saved || {},
        positions: parsed.positions || {},
        notes: parsed.notes || {}
      };
    } catch {
      return { saved: {}, positions: {}, notes: {} };
    }
  }

  function saveUserState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(userState));
    } catch {}
  }

  function loadLiveCache() {
    try {
      const raw = localStorage.getItem(LIVE_CACHE_KEY);
      if (!raw) return { checkedAt: 0, notices: [], loading: false, error: "" };
      const parsed = JSON.parse(raw);
      return {
        checkedAt: parsed.checkedAt || 0,
        notices: Array.isArray(parsed.notices) ? parsed.notices : [],
        loading: false,
        error: ""
      };
    } catch {
      return { checkedAt: 0, notices: [], loading: false, error: "" };
    }
  }

  function saveLiveCache() {
    try {
      localStorage.setItem(LIVE_CACHE_KEY, JSON.stringify({
        checkedAt: live.checkedAt,
        notices: live.notices
      }));
    } catch {}
  }

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function safeUrl(url) {
    try {
      const u = new URL(String(url || ""));
      if (u.protocol === "https:" || u.protocol === "http:") return u.href;
      return "#";
    } catch {
      return "#";
    }
  }

  function parseIsoDate(iso) {
    if (!iso || typeof iso !== "string") return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
    if (!m) return null;
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0);
  }

  function formatDate(iso) {
    const d = parseIsoDate(iso);
    if (!d) return iso || "";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function formatStamp(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  }

  function daysUntil(iso) {
    const target = parseIsoDate(iso);
    if (!target) return null;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
    return Math.round((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  }

  function getSections() {
    return (catalog && Array.isArray(catalog.sections) && catalog.sections.length)
      ? catalog.sections
      : FALLBACK_SECTIONS;
  }

  function renderCountdown(item, compact) {
    if (!item.keyDate) {
      if (compact) return "";
      return `
        <div class="timer timer-past">
          <p class="timer-kicker">${esc(item.keyDateLabel || "Current status")}</p>
          <p class="timer-note">No pending countdown date posted. Check official source links below.</p>
        </div>
      `;
    }
    const diff = daysUntil(item.keyDate);
    if (diff === null) return "";
    let cls = "timer";
    let headline = "";
    if (diff < 0) {
      cls += " timer-past";
      headline = `${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"} ago`;
    } else if (diff === 0) {
      cls += " timer-urgent";
      headline = "Today";
    } else if (diff <= 14) {
      cls += " timer-urgent";
      headline = `${diff} day${diff === 1 ? "" : "s"} left`;
    } else if (diff <= 45) {
      cls += " timer-soon";
      headline = `${diff} days left`;
    } else {
      cls += " timer-open";
      headline = `${diff} days away`;
    }
    return `
      <div class="${cls}">
        <p class="timer-kicker">${esc(item.keyDateLabel || "Key date")}</p>
        <p class="timer-count">${esc(headline)}</p>
        <p class="timer-note">${esc(formatDate(item.keyDate))}</p>
      </div>
    `;
  }

  function getRoute() {
    const hash = window.location.hash || "#/";
    if (hash.startsWith("#/item/")) {
      return { tab: "bills", view: "detail", id: decodeURIComponent(hash.slice(7)) };
    }
    if (hash === "#/deadlines") return { tab: "deadlines", view: "deadlines" };
    if (hash === "#/watchlist") return { tab: "watchlist", view: "watchlist" };
    if (hash === "#/lawmakers") return { tab: "lawmakers", view: "lawmakers" };
    return { tab: "bills", view: "bills" };
  }

  function go(hash) {
    if (window.location.hash === hash) {
      render();
    } else {
      window.location.hash = hash;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function isTracked(id) {
    return Boolean(userState.saved[id] || userState.positions[id] || (userState.notes[id] || "").trim());
  }

  function getAllItems() {
    const base = catalog && Array.isArray(catalog.items) ? catalog.items : [];
    const patches = (updates && updates.statusPatches) || {};
    const merged = base.map((item) => {
      const p = patches[item.id];
      return p ? { ...item, ...p } : { ...item };
    });

    const seen = new Set(merged.map((x) => x.id));
    const discovered = (updates && Array.isArray(updates.discoveredItems)) ? updates.discoveredItems : [];
    for (const d of discovered) {
      if (!d || !d.id || seen.has(d.id)) continue;
      seen.add(d.id);
      merged.push({ ...d });
    }
    return merged;
  }

  function sortItems(items) {
    const statusOrder = { action: 0, pending: 1, enacted: 2 };
    return items.slice().sort((a, b) => {
      const sa = statusOrder[a.status] ?? 9;
      const sb = statusOrder[b.status] ?? 9;
      if (sa !== sb) return sa - sb;
      const da = a.keyDate ? daysUntil(a.keyDate) : 99999;
      const db = b.keyDate ? daysUntil(b.keyDate) : 99999;
      const ua = da !== null && da >= 0 ? da : 99999;
      const ub = db !== null && db >= 0 ? db : 99999;
      if (ua !== ub) return ua - ub;
      return String(a.title).localeCompare(String(b.title));
    });
  }

  function parsePlainQuery(rawQuery) {
    const normalized = String(rawQuery || "").toLowerCase().replace(/&/g, " ").replace(/[^\w.\-\s]/g, " ").replace(/\s+/g, " ").trim();
    if (!normalized) return { active: false, terms: [], stageHints: [], levelHints: [], exactBill: null };

    const exactBillMatch = /\b(hb|sb|hr|h\.r\.|s\.|pc|p\.l\.)\s*0*(\d+)\b/i.exec(normalized);
    const exactBill = exactBillMatch ? { prefix: exactBillMatch[1].replace(/\./g, ""), num: exactBillMatch[2] } : null;

    const stageHints = [];
    if (/\bnot\s+signed\b|\bnot\s+yet\s+signed\b/.test(normalized)) {
      stageHints.push("pending");
    }
    const levelHints = [];
    if (/\bfederal\s+only\b|\bcongress\s+only\b/.test(normalized)) levelHints.push("federal");
    if (/\bstate\s+only\b/.test(normalized)) levelHints.push("state");
    if (/\blocal\s+only\b/.test(normalized)) levelHints.push("local");

    const rawTokens = normalized
      .replace(/\bnot\s+(?:yet\s+)?signed\b/g, " ")
      .replace(/\b(?:federal|state|local|congress)\s+only\b/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    const terms = [];
    for (const tok of rawTokens) {
      if (STOP_WORDS.has(tok)) continue;
      let matchedStage = false;
      for (const [stKey, words] of Object.entries(STAGE_KEYWORDS)) {
        if (words.includes(tok)) {
          if (!stageHints.includes(stKey)) stageHints.push(stKey);
          matchedStage = true;
        }
      }
      if (matchedStage) continue;
      if (tok === "federal" || tok === "congress") {
        if (!levelHints.includes("federal")) levelHints.push("federal");
        continue;
      }
      if (tok === "local" || tok === "shelbyville") {
        if (!levelHints.includes("local")) levelHints.push("local");
        continue;
      }
      if (tok === "state") {
        if (!levelHints.includes("state")) levelHints.push("state");
        continue;
      }
      terms.push(tok);
    }

    return { active: true, normalized, terms, stageHints, levelHints, exactBill };
  }

  function scoreItemForQuery(item, parsed) {
    if (!parsed.active) return 1;

    if (parsed.stageHints.length && !parsed.stageHints.includes(item.status)) {
      return 0;
    }
    if (parsed.levelHints.length && !parsed.levelHints.includes(item.level)) {
      return 0;
    }

    const titleLow = String(item.title || "").toLowerCase();
    const citeLow = String(item.citation || "").toLowerCase();
    const officesLow = (item.affectedOffices || []).join(" ").toLowerCase();
    const fullHay = [
      titleLow,
      citeLow,
      String(item.statute || "").toLowerCase(),
      String(item.stageLabel || "").toLowerCase(),
      String(item.summary || "").toLowerCase(),
      String(item.bedfordImpact || "").toLowerCase(),
      String(item.body || "").toLowerCase(),
      String(item.topicLabel || "").toLowerCase(),
      officesLow
    ].join(" ");

    if (parsed.exactBill) {
      const compactCite = `${citeLow} ${String(item.statute || "").toLowerCase()}`.replace(/[\s.]/g, "");
      const needle1 = `${parsed.exactBill.prefix}${parsed.exactBill.num}`;
      const needle2 = `${parsed.exactBill.prefix}${String(parsed.exactBill.num).padStart(4, "0")}`;
      if (compactCite.includes(needle1) || compactCite.includes(needle2)) {
        return 100;
      }
    }

    if (!parsed.terms.length) {
      return parsed.stageHints.length || parsed.levelHints.length ? 10 : 1;
    }

    let totalScore = 0;
    let matchedTerms = 0;

    for (const term of parsed.terms) {
      const variants = SYNONYMS[term] || [term];
      let bestTermScore = 0;

      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        const isPrimary = i === 0;
        if (titleLow.includes(v)) {
          bestTermScore = Math.max(bestTermScore, isPrimary ? 24 : 14);
        } else if (officesLow.includes(v) || citeLow.includes(v)) {
          bestTermScore = Math.max(bestTermScore, isPrimary ? 18 : 11);
        } else if (fullHay.includes(v)) {
          bestTermScore = Math.max(bestTermScore, isPrimary ? 12 : 7);
        }
      }

      if (bestTermScore > 0) {
        matchedTerms += 1;
        totalScore += bestTermScore;
      }
    }

    // For 1-2 term queries require every meaningful term to match (or 1+ if multi-topic like "property & sales taxes" / "jail & sheriff")
    if (parsed.terms.length === 1) return matchedTerms === 1 ? totalScore : 0;
    if (parsed.terms.length === 2) {
      if (matchedTerms === 2) return totalScore + 15;
      // If user typed two related nouns like "data centers" or "jail sheriff", allow 1 match only if query contains & or "or" or both are in SYNONYMS
      if (matchedTerms >= 1 && (/[&/]|\bor\b/i.test(ui.query) || (SYNONYMS[parsed.terms[0]] && SYNONYMS[parsed.terms[1]]))) {
        return totalScore;
      }
      return 0;
    }
    const minRequired = Math.ceil(parsed.terms.length * 0.6);
    return matchedTerms >= minRequired ? totalScore + matchedTerms * 5 : 0;
  }

  function filterItems(items) {
    const parsed = parsePlainQuery(ui.query);
    const out = [];
    for (const item of items) {
      if (ui.level !== "all" && item.level !== ui.level) continue;
      if (ui.topic !== "all" && item.topic !== ui.topic) continue;
      if (ui.status !== "all" && item.status !== ui.status) continue;
      const score = scoreItemForQuery(item, parsed);
      if (score <= 0) continue;
      out.push({ item, score });
    }
    if (parsed.active) {
      out.sort((a, b) => b.score - a.score);
    }
    return out.map((x) => x.item);
  }

  async function refreshLiveFeeds(force) {
    const fresh = !force && live.checkedAt && (Date.now() - live.checkedAt < LIVE_CACHE_MS) && live.notices.length > 0;
    if (fresh) return;
    live.loading = true;
    live.error = "";
    render();

    const frPromise = fetch(FR_API_URL, { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Federal Register unavailable"))))
      .then((data) => {
        const rows = Array.isArray(data.results) ? data.results : [];
        return rows.map((doc) => ({
          id: doc.document_number || doc.html_url,
          date: doc.publication_date || "",
          type: doc.type || "Notice",
          agency: (doc.agencies && doc.agencies[0] && doc.agencies[0].name) ? doc.agencies[0].name : "Federal Agency",
          title: doc.title || "Untitled notice",
          url: doc.html_url || "https://www.federalregister.gov/"
        }));
      });

    const updatesPromise = fetch(`${LIVE_UPDATES_URL}?t=${Date.now()}`, { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);

    try {
      const [noticesRes, updRes] = await Promise.allSettled([frPromise, updatesPromise]);
      if (updRes.status === "fulfilled" && updRes.value && typeof updRes.value === "object") {
        updates = updRes.value;
      }
      if (noticesRes.status === "fulfilled") {
        live.notices = noticesRes.value;
        live.checkedAt = Date.now();
      } else if (updates && Array.isArray(updates.federalNotices) && updates.federalNotices.length) {
        live.notices = updates.federalNotices;
        live.checkedAt = Date.now();
      } else {
        live.error = "Could not reach Federal Register right now. Curated bills are still loaded.";
      }
      saveLiveCache();
    } finally {
      live.loading = false;
      render();
    }
  }

  function buildSingleBrief(item) {
    const pos = POSITIONS.find((p) => p.id === (userState.positions[item.id] || ""));
    const note = (userState.notes[item.id] || "").trim();
    const lines = [
      `BEDFORD COUNTY LEGISLATIVE BRIEF`,
      `${item.title}`,
      `Citation: ${item.citation}`,
      `Level: ${(LEVEL_META[item.level] || {}).label || item.level} | Stage: ${item.stageLabel || (STATUS_META[item.status] || {}).label || item.status}`,
      item.keyDate ? `${item.keyDateLabel || "Key date"}: ${formatDate(item.keyDate)}` : `Status note: ${item.keyDateLabel || "Active"}`,
      pos && pos.id ? `County position: ${pos.label}` : "",
      "",
      `Summary: ${item.summary}`,
      "",
      `Bedford County impact: ${item.bedfordImpact}`,
      "",
      `Affected offices: ${(item.affectedOffices || []).join(", ")}`,
      note ? `\nInternal notes: ${note}` : "",
      item.sources && item.sources[0] ? `\nSource: ${item.sources[0].url}` : ""
    ].filter((l, idx, arr) => l !== "" || (idx > 0 && arr[idx - 1] !== ""));
    return lines.join("\n").trim();
  }

  function buildWatchlistBrief(items) {
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const header = [
      `BEDFORD COUNTY LEGISLATIVE STATUS BRIEF`,
      `Prepared: ${today}`,
      `Tracked measures: ${items.length}`,
      ""
    ];
    const blocks = items.map((item, idx) => {
      const pos = POSITIONS.find((p) => p.id === (userState.positions[item.id] || ""));
      const note = (userState.notes[item.id] || "").trim();
      return [
        `${idx + 1}. ${item.title} (${item.citation})`,
        `   Level: ${(LEVEL_META[item.level] || {}).label || item.level} | Stage: ${item.stageLabel || (STATUS_META[item.status] || {}).label || item.status}${pos && pos.id ? ` | Position: ${pos.label}` : ""}`,
        item.keyDate ? `   ${item.keyDateLabel || "Key date"}: ${formatDate(item.keyDate)}` : "",
        `   Impact: ${item.bedfordImpact}`,
        note ? `   Notes: ${note}` : ""
      ].filter(Boolean).join("\n");
    });
    return header.concat(blocks.join("\n\n")).join("\n").trim();
  }

  async function copyText(text, onDone) {
    try {
      await navigator.clipboard.writeText(text);
      onDone();
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(ta);
      onDone();
    }
  }

  function renderNav(route) {
    const watchedCount = getAllItems().filter((x) => isTracked(x.id)).length;
    const navItems = [
      { id: "bills", label: "Bills", hash: "#/" },
      { id: "deadlines", label: "Deadlines", hash: "#/deadlines" },
      { id: "watchlist", label: watchedCount ? `Watchlist (${watchedCount})` : "Watchlist", hash: "#/watchlist" },
      { id: "lawmakers", label: "Lawmakers", hash: "#/lawmakers" }
    ];

    const header = `
      <header class="app-header">
        <div class="brand">
          <img src="logo.png?v=2" alt="Bedford County">
          <div>
            <p class="eyebrow">Bedford County, Tennessee</p>
            <h1>Bedford County Legislation</h1>
            <p>Local resolutions, submitted state and federal bills, and enacted laws affecting our county.</p>
          </div>
        </div>
      </header>
    `;

    const side = `
      <aside class="side noprint" aria-label="Primary navigation">
        <img src="logo.png?v=2" alt="Bedford County">
        <strong>Bedford County Legislation</strong>
        <span>Local, state, and federal tracking</span>
        ${navItems.map((n) => `
          <button type="button" class="${route.tab === n.id ? "active" : ""}" data-nav="${n.hash}">${esc(n.label)}</button>
        `).join("")}
      </aside>
    `;

    const tabbar = `
      <nav class="tabbar noprint" aria-label="Mobile navigation">
        ${navItems.map((n) => `
          <button type="button" class="${route.tab === n.id ? "active" : ""}" data-nav="${n.hash}">${esc(n.id === "watchlist" && watchedCount ? `Saved (${watchedCount})` : n.label)}</button>
        `).join("")}
      </nav>
    `;

    return { header, side, tabbar };
  }

  function renderLivePanel() {
    const autoUpdated = updates && updates.updatedAt ? formatStamp(updates.updatedAt) : null;
    const checkedLabel = live.checkedAt
      ? `Live feed checked ${new Date(live.checkedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`
      : "Checking live federal register";
    const notices = live.notices.length ? live.notices : ((updates && updates.federalNotices) || []);
    const countyAlerts = (updates && Array.isArray(updates.countyAlerts)) ? updates.countyAlerts : [];

    return `
      <section class="panel">
        <p class="section-bar">Auto-Updated Feeds</p>
        <h2>Daily State, County &amp; Federal Checks</h2>
        <p class="small muted">Runs automatically every morning to check Tennessee 115th GA bills, Congressional bills, CTAS alerts, Bedford County notices, and Federal Register rules.</p>
        ${autoUpdated ? `<p class="small muted"><strong>Last daily bill scan:</strong> ${esc(autoUpdated)}</p>` : ""}
        <p class="small muted"><strong>Browser feed:</strong> ${live.loading ? "Checking now..." : esc(checkedLabel)}</p>
        <div class="actions">
          <button type="button" class="btn full" data-action="refresh-live" ${live.loading ? "disabled" : ""}>
            ${live.loading ? "Checking live feed..." : "Check live feeds now"}
          </button>
        </div>
        ${live.error ? `<div class="note small">${esc(live.error)}</div>` : ""}

        ${countyAlerts.length ? `
          <h3 style="margin-top: 16px;">Latest CTAS &amp; Bedford County Notices</h3>
          <div class="list" style="margin-top: 8px;">
            ${countyAlerts.slice(0, 5).map((a) => `
              <article class="live-item">
                <p class="kicker">${esc(a.source)}</p>
                <p style="margin: 2px 0 0;"><a href="${esc(safeUrl(a.url))}" target="_blank" rel="noopener noreferrer">${esc(a.title)}</a></p>
              </article>
            `).join("")}
          </div>
        ` : ""}

        <h3 style="margin-top: 16px;">Newest CMS, FEMA &amp; DOT Rules</h3>
        <div class="list" style="margin-top: 8px;">
          ${notices.length ? notices.slice(0, 5).map((n) => `
            <article class="live-item">
              <p class="kicker">${esc(formatDate(n.date))} &middot; ${esc(n.type)}</p>
              <p style="margin: 2px 0 4px;"><a href="${esc(safeUrl(n.url))}" target="_blank" rel="noopener noreferrer">${esc(n.title)}</a></p>
              <p class="small muted" style="margin: 0;">${esc(n.agency)}</p>
            </article>
          `).join("") : `<p class="small muted">No live federal notices loaded yet.</p>`}
        </div>
      </section>
    `;
  }

  function renderBillCard(item) {
    const st = STATUS_META[item.status] || STATUS_META.pending;
    const lv = LEVEL_META[item.level] || LEVEL_META.state;
    const saved = isTracked(item.id);
    const pos = POSITIONS.find((p) => p.id === (userState.positions[item.id] || ""));

    return `
      <article class="card ${st.cardClass}">
        <div class="meta">
          <span class="badge ${lv.badgeClass}">${esc(lv.label)}</span>
          <span class="badge ${st.badgeClass}">${esc(item.stageLabel || st.label)}</span>
          <span class="badge">${esc(item.topicLabel)}</span>
          ${item.autoDiscovered ? `<span class="badge saved">Auto-Found</span>` : ""}
          ${saved ? `<span class="badge saved">${pos && pos.id ? esc(pos.label) : "Saved"}</span>` : ""}
        </div>
        <p class="kicker">${esc(item.citation)}</p>
        <h2>${esc(item.title)}</h2>
        <p>${esc(item.summary)}</p>
        ${item.lastVerifiedAction ? `<p class="small muted"><strong>Latest official action:</strong> ${esc(item.lastVerifiedAction)}</p>` : ""}
        ${renderCountdown(item, true)}
        <p class="small muted"><strong>Offices:</strong> ${esc((item.affectedOffices || []).join(", "))}</p>
        <div class="actions">
          <button type="button" class="btn-gold" data-open-item="${esc(item.id)}">Read impact &amp; details</button>
          <button type="button" class="btn-ghost" data-toggle-save="${esc(item.id)}">${userState.saved[item.id] ? "Saved on device" : "Save to watchlist"}</button>
        </div>
      </article>
    `;
  }

  function renderGroupedList(visible) {
    if (!visible.length) {
      return `
        <section class="panel">
          <h2>No matching bills</h2>
          <p class="muted">Try a simpler phrase like "EMS bills", "property tax", "data center", or "jail", or clear your filters.</p>
          <div class="actions">
            <button type="button" class="btn-gold" data-action="clear-filters">Show all bills</button>
          </div>
        </section>
      `;
    }

    if (ui.query.trim()) {
      return `
        <div class="list">
          <div class="group-head">
            <h2>Search Results for "${esc(ui.query.trim())}"</h2>
            <span class="group-count">${visible.length} match${visible.length === 1 ? "" : "es"}</span>
            <p>Ranked by relevance across local, Tennessee state, and federal legislation affecting Bedford County.</p>
          </div>
          ${visible.map(renderBillCard).join("")}
        </div>
      `;
    }

    if (ui.groupBy === "stage") {
      const order = ["action", "pending", "enacted"];
      return order.map((key) => {
        const list = visible.filter((x) => x.status === key);
        if (!list.length) return "";
        const meta = STATUS_META[key];
        return `
          <div class="list">
            <div class="group-head">
              <h2>${esc(meta.sectionTitle)}</h2>
              <span class="group-count">${list.length} measure${list.length === 1 ? "" : "s"}</span>
              <p>${esc(meta.sectionDesc)}</p>
            </div>
            ${list.map(renderBillCard).join("")}
          </div>
        `;
      }).join("");
    }

    const sections = getSections();
    return sections.map((sec) => {
      const list = visible.filter((x) => x.topic === sec.id);
      if (!list.length) return "";
      const pendingInSec = list.filter((x) => x.status === "pending").length;
      return `
        <div class="list" id="sec-${esc(sec.id)}">
          <div class="group-head">
            <h2>${esc(sec.label)}</h2>
            <span class="group-count">${list.length} total${pendingInSec ? ` &middot; ${pendingInSec} submitted` : ""}</span>
            <p>${esc(sec.description)}</p>
          </div>
          ${list.map(renderBillCard).join("")}
        </div>
      `;
    }).join("");
  }

  function renderBillsView() {
    const all = sortItems(getAllItems());
    const actionCount = all.filter((x) => x.status === "action").length;
    const pendingCount = all.filter((x) => x.status === "pending").length;
    const enactedCount = all.filter((x) => x.status === "enacted").length;
    const visible = filterItems(all);
    const sections = getSections();
    const autoUpdated = updates && updates.updatedAt ? formatStamp(updates.updatedAt) : formatDate(catalog.checkedAt);

    const statusStat = (key, count, label) => {
      const isAct = ui.status === key;
      return `
        <button type="button" class="stat ${isAct ? "active" : ""}" data-status-filter="${key}">
          <b>${count}</b>
          <span>${esc(label)}</span>
        </button>
      `;
    };

    const upcoming = all
      .filter((x) => x.keyDate && daysUntil(x.keyDate) !== null && daysUntil(x.keyDate) >= 0)
      .sort((a, b) => daysUntil(a.keyDate) - daysUntil(b.keyDate))
      .slice(0, 4);

    return `
      <section class="panel panel-hero">
        <p class="section-bar">Bedford County Legislative Tracker</p>
        <h2>Local, State &amp; Federal Legislation Affecting Bedford County</h2>
        <p class="small muted">Auto-updated daily (${esc(autoUpdated)}). Search in plain English, like "EMS bills", "property tax", or "pending bills". Notes stay on your device.</p>

        <div class="stats" role="group" aria-label="Filter by bill stage">
          ${statusStat("action", actionCount, "Action Needed")}
          ${statusStat("pending", pendingCount, "Submitted / Pending")}
          ${statusStat("enacted", enactedCount, "Enacted Law")}
        </div>

        <div class="search-wrap">
          <input type="search" id="bill-search" placeholder="Search in plain English (example: EMS bills, property tax, data centers, jail)..." value="${esc(ui.query)}" aria-label="Search legislation in plain English">
        </div>

        <div class="filters" role="group" aria-label="Quick plain-language searches">
          ${QUICK_SEARCHES.map((q) => `
            <button type="button" class="chip quick-chip ${ui.query.trim().toLowerCase() === q.toLowerCase() ? "active" : ""}" data-quick-search="${esc(q)}">${esc(q)}</button>
          `).join("")}
        </div>

        <div class="filters" role="group" aria-label="Filter by government level">
          ${["all", "local", "state", "federal"].map((lvl) => `
            <button type="button" class="chip ${ui.level === lvl ? "active" : ""}" data-level-filter="${lvl}">
              ${lvl === "all" ? `All levels (${all.length})` : `${esc(LEVEL_META[lvl].label)} (${all.filter((x) => x.level === lvl).length})`}
            </button>
          `).join("")}
        </div>

        <div class="filters" role="group" aria-label="Filter by county section">
          <button type="button" class="chip ${ui.topic === "all" ? "active" : ""}" data-topic-filter="all">All sections</button>
          ${sections.map((s) => {
            const cnt = all.filter((x) => x.topic === s.id).length;
            return `<button type="button" class="chip ${ui.topic === s.id ? "active" : ""}" data-topic-filter="${esc(s.id)}">${esc(s.short)} (${cnt})</button>`;
          }).join("")}
        </div>

        <div class="row" style="align-items: center; justify-content: space-between; margin-top: 6px;">
          <div class="view-toggle" role="group" aria-label="Group bills by">
            <button type="button" class="${ui.groupBy === "section" ? "active" : ""}" data-group-by="section">Group by County Section</button>
            <button type="button" class="${ui.groupBy === "stage" ? "active" : ""}" data-group-by="stage">Group by Bill Stage</button>
          </div>
          ${(ui.level !== "all" || ui.topic !== "all" || ui.status !== "all" || ui.query.trim()) ? `
            <button type="button" class="btn-ghost" data-action="clear-filters">Clear filters (${visible.length} of ${all.length})</button>
          ` : `<span class="small muted">Showing all ${visible.length} measures</span>`}
        </div>
      </section>

      <div class="home-grid">
        <div class="list">
          ${renderGroupedList(visible)}
        </div>

        <div class="list">
          <section class="panel">
            <p class="section-bar">Next Up</p>
            <h2>Closest Deadlines &amp; Votes</h2>
            <div class="list" style="margin-top: 10px;">
              ${upcoming.map((item) => `
                <article class="live-item">
                  <p class="kicker">${esc(formatDate(item.keyDate))} &middot; ${esc(daysUntil(item.keyDate) === 0 ? "Today" : `${daysUntil(item.keyDate)} days`)}</p>
                  <p style="margin: 2px 0 6px;"><strong>${esc(item.title)}</strong></p>
                  <button type="button" class="btn-ghost" data-open-item="${esc(item.id)}">Open details</button>
                </article>
              `).join("")}
            </div>
            <div class="actions">
              <button type="button" class="btn full" data-nav="#/deadlines">View full calendar</button>
            </div>
          </section>

          ${renderLivePanel()}
        </div>
      </div>
    `;
  }

  function renderDetailView(id) {
    const item = getAllItems().find((x) => x.id === id);
    if (!item) {
      return `
        <section class="panel">
          <h2>Measure not found</h2>
          <p class="muted">That bill or resolution could not be found.</p>
          <div class="actions">
            <button type="button" class="btn-gold" data-nav="#/">Back to all bills</button>
          </div>
        </section>
      `;
    }

    const st = STATUS_META[item.status] || STATUS_META.pending;
    const lv = LEVEL_META[item.level] || LEVEL_META.state;
    const curPos = userState.positions[item.id] || "";
    const curNote = userState.notes[item.id] || "";

    return `
      <div class="actions noprint" style="margin-top: 0;">
        <button type="button" class="btn-ghost" data-nav="#/">&larr; Back to all bills</button>
        <button type="button" class="btn-ghost" data-toggle-save="${esc(item.id)}">${userState.saved[item.id] ? "Saved in Watchlist" : "Save to Watchlist"}</button>
        <button type="button" class="btn" data-copy-item="${esc(item.id)}">${ui.copiedId === item.id ? "Brief copied" : "Copy brief"}</button>
        <button type="button" class="btn-ghost" data-action="print">Print / PDF</button>
      </div>

      <article class="packet">
        <div class="meta">
          <span class="badge ${lv.badgeClass}">${esc(lv.label)}</span>
          <span class="badge ${st.badgeClass}">${esc(item.stageLabel || st.label)}</span>
          <span class="badge">${esc(item.topicLabel)}</span>
          ${item.autoDiscovered ? `<span class="badge saved">Auto-Found</span>` : ""}
        </div>
        <p class="kicker">${esc(item.citation)} &middot; ${esc(item.body)}</p>
        <h2>${esc(item.title)}</h2>
        <p>${esc(item.summary)}</p>
        ${item.lastVerifiedAction ? `<p class="small muted"><strong>Latest official action:</strong> ${esc(item.lastVerifiedAction)}</p>` : ""}

        ${renderCountdown(item, false)}

        <div class="callout">
          <strong>How this affects Bedford County</strong>
          <p style="margin: 6px 0 0;">${esc(item.bedfordImpact)}</p>
        </div>

        <div class="section-block">
          <h3>Affected County Offices</h3>
          <div class="chips">
            ${(item.affectedOffices || []).map((o) => `<span class="badge">${esc(o)}</span>`).join("")}
          </div>
        </div>

        <div class="section-block">
          <h3>Action Checklist for Bedford County</h3>
          <ul class="clean">
            ${(item.actionSteps || []).map((step) => `<li>${esc(step)}</li>`).join("")}
          </ul>
        </div>

        <div class="section-block">
          <h3>Legal Reference</h3>
          <p class="small"><strong>Statute or citation:</strong> ${esc(item.statute || item.citation)}</p>
          ${item.effectiveDate ? `<p class="small"><strong>Effective date:</strong> ${esc(formatDate(item.effectiveDate))}</p>` : ""}
        </div>

        <div class="sources">
          <h3>Official Sources</h3>
          <ul class="clean">
            ${(item.sources || []).map((src) => `
              <li><a href="${esc(safeUrl(src.url))}" target="_blank" rel="noopener noreferrer">${esc(src.label)}</a></li>
            `).join("")}
          </ul>
        </div>
      </article>

      <section class="panel noprint">
        <p class="section-bar">County Notes &amp; Position</p>
        <h2>Track Internal Position on This Device</h2>
        <p class="small muted">Saved only in your browser on this phone or computer. Nothing is uploaded.</p>

        <label class="field" for="pos-select">Bedford County Position</label>
        <select id="pos-select" data-pos-id="${esc(item.id)}">
          ${POSITIONS.map((p) => `<option value="${esc(p.id)}" ${curPos === p.id ? "selected" : ""}>${esc(p.label)}</option>`).join("")}
        </select>

        <label class="field" for="note-input">Department Notes or Talking Points</label>
        <textarea id="note-input" data-note-id="${esc(item.id)}" placeholder="Add cost estimates, commissioner talking points, or staff follow-up notes...">${esc(curNote)}</textarea>
      </section>
    `;
  }

  function renderDeadlinesView() {
    const dated = getAllItems()
      .filter((x) => x.keyDate && daysUntil(x.keyDate) !== null)
      .sort((a, b) => daysUntil(a.keyDate) - daysUntil(b.keyDate));

    const soon = dated.filter((x) => daysUntil(x.keyDate) >= 0 && daysUntil(x.keyDate) <= 30);
    const quarter = dated.filter((x) => daysUntil(x.keyDate) > 30 && daysUntil(x.keyDate) <= 90);
    const later = dated.filter((x) => daysUntil(x.keyDate) > 90);
    const past = dated.filter((x) => daysUntil(x.keyDate) < 0);

    const groupBlock = (title, kicker, list) => {
      if (!list.length) return "";
      return `
        <section class="panel">
          <p class="section-bar">${esc(kicker)}</p>
          <h2>${esc(title)}</h2>
          <div class="list" style="margin-top: 12px;">
            ${list.map(renderBillCard).join("")}
          </div>
        </section>
      `;
    };

    return `
      <section class="panel panel-hero">
        <p class="section-bar">Legislative Calendar</p>
        <h2>Upcoming Votes, Compliance Deadlines &amp; Session Dates</h2>
        <p class="small muted">Sorted chronologically from today. Tap any measure to view action checklists and official links.</p>
      </section>
      ${groupBlock("Next 30 Days", "Immediate", soon)}
      ${groupBlock("31 to 90 Days Out (Includes Jan 1 Laws & Jan 12 Session Start)", "Coming Up", quarter)}
      ${groupBlock("Later in 2027", "Horizon", later)}
      ${groupBlock("Recent Past Dates", "Completed", past)}
    `;
  }

  function renderWatchlistView() {
    const tracked = sortItems(getAllItems().filter((x) => isTracked(x.id)));
    const filtered = tracked.filter((x) => {
      if (ui.watchFilter === "all") return true;
      return (userState.positions[x.id] || "") === ui.watchFilter;
    });

    return `
      <section class="panel panel-hero">
        <p class="section-bar">Saved Watchlist</p>
        <h2>Bedford County Watchlist &amp; Briefing Export</h2>
        <p class="small muted">Saved items, positions, and notes stay private in your browser on this device. Export a plain-English briefing anytime for commissioners or lawmakers.</p>

        <div class="filters noprint">
          <button type="button" class="chip ${ui.watchFilter === "all" ? "active" : ""}" data-watch-filter="all">All saved (${tracked.length})</button>
          ${POSITIONS.filter((p) => p.id).map((p) => {
            const cnt = tracked.filter((x) => userState.positions[x.id] === p.id).length;
            return `<button type="button" class="chip ${ui.watchFilter === p.id ? "active" : ""}" data-watch-filter="${esc(p.id)}">${esc(p.label)} (${cnt})</button>`;
          }).join("")}
        </div>

        ${filtered.length ? `
          <div class="actions noprint">
            <button type="button" class="btn-gold" data-action="copy-brief">${ui.copiedBrief ? "Full brief copied" : "Copy full legislative brief"}</button>
            <button type="button" class="btn-ghost" data-action="print">Print / Save PDF</button>
          </div>
        ` : ""}
      </section>

      ${filtered.length ? `
        <div class="list">
          ${filtered.map((item) => {
            const note = (userState.notes[item.id] || "").trim();
            return `
              <div>
                ${renderBillCard(item)}
                ${note ? `<div class="note small" style="margin-top: 6px;"><strong>Your note:</strong> ${esc(note)}</div>` : ""}
              </div>
            `;
          }).join("")}
        </div>
      ` : `
        <section class="panel">
          <h2>Your watchlist is empty</h2>
          <p class="muted">Tap "Save to watchlist" or set a county position on any bill to build a custom briefing list.</p>
          <div class="actions">
            <button type="button" class="btn-gold" data-nav="#/">Browse legislation</button>
          </div>
        </section>
      `}
    `;
  }

  function renderLawmakersView() {
    const reps = catalog.representatives || [];
    const byLevel = (lvl) => reps.filter((r) => r.level === lvl);

    const repGroup = (title, kicker, list) => `
      <section class="panel">
        <p class="section-bar">${esc(kicker)}</p>
        <h2>${esc(title)}</h2>
        <div class="list" style="margin-top: 10px;">
          ${list.map((r) => `
            <article class="rep-card">
              <p class="kicker">${esc(r.office)}</p>
              <h3>${esc(r.name)}</h3>
              <p class="small">${esc(r.jurisdiction)}</p>
              <p class="small muted">${esc(r.termNote)}</p>
              <p class="small"><strong>Contact / Note:</strong> ${esc(r.contact)}</p>
              <div class="actions">
                <a class="btn-ghost" href="${esc(safeUrl(r.url))}" target="_blank" rel="noopener noreferrer">Official page</a>
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    `;

    return `
      <section class="panel panel-hero">
        <p class="section-bar">Bedford County Delegation</p>
        <h2>Local, State &amp; Federal Lawmakers</h2>
        <p class="small muted">Updated after the November 3, 2026 general election and 2026 Tennessee congressional redistricting, which placed Bedford County in U.S. House District 9.</p>
      </section>

      ${repGroup("Local Government", "Bedford County", byLevel("local"))}
      ${repGroup("Tennessee General Assembly & Governor", "State of Tennessee", byLevel("state"))}
      ${repGroup("U.S. Congress", "Federal Delegation", byLevel("federal"))}

      <section class="panel">
        <p class="section-bar">Primary Sources</p>
        <h2>Official Bill &amp; Agenda Trackers</h2>
        <ul class="clean">
          ${(catalog.officialTrackers || []).map((t) => `
            <li><a href="${esc(safeUrl(t.url))}" target="_blank" rel="noopener noreferrer">${esc(t.label)}</a></li>
          `).join("")}
        </ul>
      </section>

      <section class="panel install noprint">
        <p class="section-bar">Phone Tip</p>
        <h2>Keep This Private Link on Your Home Screen</h2>
        <p class="small">This page is hidden from search engines and is not linked from any other website. On iPhone Safari, tap Share and choose Add to Home Screen so you can open it with one tap.</p>
      </section>
    `;
  }

  function render() {
    const root = document.getElementById("app");
    if (!root) return;
    if (!catalog) {
      root.innerHTML = `<main class="layout"><section class="panel"><h2>Loading Bedford County legislation...</h2></section></main>`;
      return;
    }

    const route = getRoute();
    const { header, side, tabbar } = renderNav(route);
    let main = "";
    if (route.view === "detail") main = renderDetailView(route.id);
    else if (route.view === "deadlines") main = renderDeadlinesView();
    else if (route.view === "watchlist") main = renderWatchlistView();
    else if (route.view === "lawmakers") main = renderLawmakersView();
    else main = renderBillsView();

    const activeEl = document.activeElement;
    const keepFocusId = activeEl && (activeEl.id === "bill-search" || activeEl.id === "note-input") ? activeEl.id : null;
    const selStart = keepFocusId && typeof activeEl.selectionStart === "number" ? activeEl.selectionStart : null;
    const selEnd = keepFocusId && typeof activeEl.selectionEnd === "number" ? activeEl.selectionEnd : null;

    root.innerHTML = `${header}${side}<main class="layout">${main}</main>${tabbar}`;

    if (keepFocusId) {
      const el = document.getElementById(keepFocusId);
      if (el) {
        el.focus();
        if (selStart !== null && selEnd !== null && typeof el.setSelectionRange === "function") {
          el.setSelectionRange(selStart, selEnd);
        }
      }
    }
  }

  function bindEvents() {
    document.addEventListener("click", (e) => {
      const navBtn = e.target.closest("[data-nav]");
      if (navBtn) {
        go(navBtn.getAttribute("data-nav"));
        return;
      }

      const openBtn = e.target.closest("[data-open-item]");
      if (openBtn) {
        go(`#/item/${encodeURIComponent(openBtn.getAttribute("data-open-item"))}`);
        return;
      }

      const saveBtn = e.target.closest("[data-toggle-save]");
      if (saveBtn) {
        const id = saveBtn.getAttribute("data-toggle-save");
        if (userState.saved[id]) delete userState.saved[id];
        else userState.saved[id] = true;
        saveUserState();
        render();
        return;
      }

      const quickBtn = e.target.closest("[data-quick-search]");
      if (quickBtn) {
        const q = quickBtn.getAttribute("data-quick-search");
        ui.query = ui.query.trim().toLowerCase() === q.toLowerCase() ? "" : q;
        ui.level = "all";
        ui.topic = "all";
        ui.status = "all";
        render();
        return;
      }

      const lvlBtn = e.target.closest("[data-level-filter]");
      if (lvlBtn) {
        ui.level = lvlBtn.getAttribute("data-level-filter");
        render();
        return;
      }

      const topicBtn = e.target.closest("[data-topic-filter]");
      if (topicBtn) {
        ui.topic = topicBtn.getAttribute("data-topic-filter");
        render();
        return;
      }

      const grpBtn = e.target.closest("[data-group-by]");
      if (grpBtn) {
        ui.groupBy = grpBtn.getAttribute("data-group-by");
        render();
        return;
      }

      const statBtn = e.target.closest("[data-status-filter]");
      if (statBtn) {
        const val = statBtn.getAttribute("data-status-filter");
        ui.status = ui.status === val ? "all" : val;
        render();
        return;
      }

      const watchBtn = e.target.closest("[data-watch-filter]");
      if (watchBtn) {
        ui.watchFilter = watchBtn.getAttribute("data-watch-filter");
        render();
        return;
      }

      const copyItemBtn = e.target.closest("[data-copy-item]");
      if (copyItemBtn) {
        const id = copyItemBtn.getAttribute("data-copy-item");
        const item = getAllItems().find((x) => x.id === id);
        if (item) {
          copyText(buildSingleBrief(item), () => {
            ui.copiedId = id;
            render();
            setTimeout(() => { ui.copiedId = ""; render(); }, 2500);
          });
        }
        return;
      }

      const actBtn = e.target.closest("[data-action]");
      if (actBtn) {
        const action = actBtn.getAttribute("data-action");
        if (action === "clear-filters") {
          ui.level = "all";
          ui.topic = "all";
          ui.status = "all";
          ui.query = "";
          render();
        } else if (action === "refresh-live") {
          refreshLiveFeeds(true);
        } else if (action === "print") {
          window.print();
        } else if (action === "copy-brief") {
          const tracked = sortItems(getAllItems().filter((x) => isTracked(x.id))).filter((x) => {
            if (ui.watchFilter === "all") return true;
            return (userState.positions[x.id] || "") === ui.watchFilter;
          });
          copyText(buildWatchlistBrief(tracked), () => {
            ui.copiedBrief = true;
            render();
            setTimeout(() => { ui.copiedBrief = false; render(); }, 2500);
          });
        }
      }
    });

    document.addEventListener("input", (e) => {
      if (e.target && e.target.id === "bill-search") {
        ui.query = e.target.value;
        render();
        return;
      }
      if (e.target && e.target.matches("[data-note-id]")) {
        const id = e.target.getAttribute("data-note-id");
        userState.notes[id] = e.target.value;
        if (e.target.value.trim()) userState.saved[id] = true;
        saveUserState();
      }
    });

    document.addEventListener("change", (e) => {
      if (e.target && e.target.matches("[data-pos-id]")) {
        const id = e.target.getAttribute("data-pos-id");
        const val = e.target.value;
        if (val) {
          userState.positions[id] = val;
          userState.saved[id] = true;
        } else {
          delete userState.positions[id];
        }
        saveUserState();
        render();
      }
    });

    window.addEventListener("hashchange", render);
  }

  async function init() {
    bindEvents();
    render();
    try {
      const [catRes, updRes] = await Promise.all([
        fetch(DATA_URL, { cache: "no-cache" }),
        fetch(LIVE_UPDATES_URL, { cache: "no-cache" }).catch(() => null)
      ]);
      if (!catRes.ok) throw new Error(`HTTP ${catRes.status}`);
      catalog = await catRes.json();
      if (updRes && updRes.ok) {
        try { updates = await updRes.json(); } catch {}
      }
      render();
      refreshLiveFeeds(false);
    } catch (err) {
      const root = document.getElementById("app");
      if (root) {
        root.innerHTML = `<main class="layout"><section class="panel stop"><h2>Could not load legislation data</h2><p>${esc(err.message)}</p></section></main>`;
      }
    }
  }

  init();
})();
