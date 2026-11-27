#!/usr/bin/env node
/**
 * Daily automated updater for Bedford County Legislation Tracker.
 * Reads official public feeds with zero API keys required:
 *   1. Tennessee General Assembly 115th GA (wapp.capitol.tn.gov)
 *   2. U.S. GovInfo Bills & Public Laws RSS + Congress.gov RSS
 *   3. Federal Register JSON API (CMS, FEMA, DOT, USDA)
 *   4. UT CTAS County Government Alerts (ctas.tennessee.edu/news)
 *   5. Bedford County Official News (bedfordcountytn.gov/newslist.php)
 *
 * Writes legislation/live-updates.json with:
 *   - statusPatches for curated items in legislation.json
 *   - discoveredItems (new submitted/enacted TN & Federal bills auto-categorized by county section)
 *   - federalNotices (newest Federal Register rules/notices)
 *   - countyAlerts (newest CTAS & Bedford County official postings)
 *   - scanState (highest TN HB/SB bill numbers checked so daily scans pick up where they left off)
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const SECTION_RULES = [
  {
    id: "ems",
    label: "Public Safety & EMS",
    offices: ["Bedford County EMS", "Sheriff's Office", "Fire Departments", "Emergency Management (EMA)"],
    re: /\b(ambulance|ems|emergency medical|paramedic|emt|first responder|firefighter|fire department|fire investigator|fema|tema|disaster|emergency management|tornado|siren|911|sheriff|jail|inmate|detainee|law enforcement|police|constable|coroner|medical examiner|rescue squad|bail)\b/i
  },
  {
    id: "budget",
    label: "Budget & Taxes",
    offices: ["Finance Department", "Property Assessor", "Trustee Office", "County Commission"],
    re: /\b(property tax|sales tax|grocery tax|tax relief|tax freeze|reappraisal|property assessment|local option|county budget|municipal bond|wheel tax|hotel motel|occupancy tax|litigation tax|privilege tax|comptroller|county trustee|revenue sharing)\b/i
  },
  {
    id: "zoning",
    label: "Zoning & Land",
    offices: ["Codes & Planning", "Utility District", "County Commission"],
    re: /\b(zoning|subdivision|building code|land use|planning commission|data center|extraterritorial|annexation|sewer|wastewater|drinking water|water safety|watershed|duck river|utility district|solid waste|landfill|septage|septic|stormwater|housing development)\b/i
  },
  {
    id: "roads",
    label: "Roads & Rural",
    offices: ["Highway Department", "County Mayor", "Economic Development"],
    re: /\b(highway|bridge|rural road|county road|surface transportation|farm bill|usda rural|community facilities|broadband|bead program|rural development|public transit|motor fuel|gas tax|electric vehicle fee)\b/i
  },
  {
    id: "schools",
    label: "Schools & Health",
    offices: ["Bedford County Schools", "County Health Partners", "Finance Department"],
    re: /\b(school board|public school|local education agency|lea\b|tisa|k-12|childcare|rural health|tenncare|medicaid|medicare|rural hospital|mental health|opioid abatement|behavioral health|community health)\b/i
  },
  {
    id: "governance",
    label: "Governance",
    offices: ["County Commission", "County Clerk", "Election Commission", "Human Resources"],
    re: /\b(county commission|county legislative body|county mayor|county clerk|register of deeds|circuit court clerk|election commission|open meetings|public comment|public records|e-verify|local government|counties|county government|procurement|competitive bidding|dual office|vessel|abandoned vessel|sunshine law)\b/i
  }
];

const COUNTY_RELEVANCE_RE = /\b(count(?:y|ies)|local government|municipal|ambulance|ems|emergency medical|paramedic|firefighter|first responder|sheriff|jail|fema|tema|disaster|emergency management|property tax|sales tax|grocery tax|zoning|planning commission|subdivision|highway|bridge|rural road|rural health|tenncare|medicaid|school board|public school|broadband|water safety|wastewater|sewer|utility district|data center|e-verify|open meetings|public records|farm bill|community facilities|siren|tornado|opioid)\b/i;

const EXCLUDE_RE = /\b(naming a post office|post office building|coin act|commemorative coin|medal of honor|congressional gold medal|rename the facility|designate the facility|national park in (?:alaska|california|oregon|utah|nevada|montana)|resolution recognizing|condemning|honoring the life|congratulating|birthday)\b/i;

function cleanText(str) {
  return String(str || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;|&rsquo;|&lsquo;/gi, "'")
    .replace(/&ndash;|&mdash;|\u2014/g, "-")
    .replace(/;/g, ",")
    .replace(/\s+/g, " ")
    .trim();
}

function classify(text) {
  for (const rule of SECTION_RULES) {
    if (rule.re.test(text)) return rule;
  }
  return null;
}

function parseUsDate(str) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(str || "").trim());
  if (!m) return null;
  return `${m[3]}-${String(m[1]).padStart(2, "0")}-${String(m[2]).padStart(2, "0")}`;
}

async function fetchText(url, timeoutMs = 15000) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,application/xml,application/json;q=0.9,*/*;q=0.8" },
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function fetchTnBill(billCode, ga = 115) {
  const url = `https://wapp.capitol.tn.gov/apps/BillInfo/Default.aspx?BillNumber=${encodeURIComponent(billCode)}&GA=${ga}`;
  const html = await fetchText(url);
  if (/cannot find|does not exist|no bill found/i.test(html) || !/abstract-container/i.test(html)) {
    return null;
  }

  const abstractMatch = /class="[^"]*abstract-container[^"]*"[^>]*>([\s\S]*?)<\/div>/i.exec(html);
  const captionMatch = /id="divCaptionText"[^>]*>([\s\S]*?)<\/div>/i.exec(html);
  const sponsorMatch = /LegislatorInfo\/Member[^']*'[^>]*>([\s\S]*?)<\/a>/i.exec(html);
  const historyMatch = /id="gvBillActionHistory"[\s\S]*?<\/table>/i.exec(html);

  const abstract = cleanText(abstractMatch ? abstractMatch[1] : "");
  const caption = cleanText(captionMatch ? captionMatch[1] : "");
  const sponsor = cleanText(sponsorMatch ? sponsorMatch[1].replace(/^\*/, "") : "");

  const actions = [];
  if (historyMatch) {
    for (const row of historyMatch[0].matchAll(/<tr[^>]*>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/gi)) {
      const action = cleanText(row[1]);
      const dateStr = cleanText(row[2]);
      if (action) actions.push({ action, date: parseUsDate(dateStr) || dateStr });
    }
  }
  const latest = actions[actions.length - 1] || null;
  const fullActionsText = actions.map((a) => a.action).join(" | ");

  let status = "pending";
  let stageLabel = "Submitted / Pre-Filed (Not Signed)";
  if (/signed by governor|pub\.?\s*ch\.?|public chapter|became law/i.test(fullActionsText)) {
    status = "enacted";
    stageLabel = "Enacted Law";
  } else if (/passed senate|passed house/i.test(fullActionsText)) {
    status = "pending";
    stageLabel = "Passed One Chamber (Not Signed)";
  } else if (/assigned to|referred to|placed on.*calendar/i.test(fullActionsText)) {
    status = "pending";
    stageLabel = "In Committee (Not Signed)";
  } else if (latest && latest.action) {
    stageLabel = `${latest.action.slice(0, 38)} (Not Signed)`;
  }

  const prettyCode = billCode.replace(/^([A-Z]+)(\d+)$/, "$1 $2");
  const firstClause = abstract.split(" - Amends TCA")[0] || abstract || caption;
  const shortTitle = firstClause.length > 125 ? `${firstClause.slice(0, 122)}...` : firstClause;

  return {
    billCode,
    prettyCode,
    ga,
    url,
    sponsor,
    abstract,
    caption,
    shortTitle,
    latestAction: latest ? latest.action : "Filed for introduction",
    latestDate: latest ? latest.date : null,
    status,
    stageLabel
  };
}

async function scanTennessee(curatedItems, prevScanState) {
  const ga = 115;
  const statusPatches = {};
  const discovered = [];
  const curatedCodes = new Set();

  // 1. Re-check every curated 115th GA TN bill for status changes
  for (const item of curatedItems) {
    if (item.level !== "state") continue;
    const matches = [...String(item.citation || "").matchAll(/\b(HB|SB)\s*0*(\d{1,4})\b/gi)];
    if (!matches.length || !/115th/i.test(item.citation || "")) continue;
    for (const m of matches) {
      const code = `${m[1].toUpperCase()}${String(m[2]).padStart(4, "0")}`;
      curatedCodes.add(code);
    }
    const primary = `${matches[0][1].toUpperCase()}${String(matches[0][2]).padStart(4, "0")}`;
    try {
      const liveBill = await fetchTnBill(primary, ga);
      if (liveBill) {
        statusPatches[item.id] = {
          status: liveBill.status,
          stageLabel: liveBill.stageLabel,
          lastVerifiedAction: `${liveBill.latestAction}${liveBill.latestDate ? ` (${liveBill.latestDate})` : ""}`
        };
      }
    } catch {
      // Keep curated data if TN Capitol hiccups
    }
  }

  // 2. Incrementally probe new 115th GA HB & SB numbers to auto-repopulate newly filed bills
  const scanState = {
    tn115MaxHB: Number(prevScanState?.tn115MaxHB || 18),
    tn115MaxSB: Number(prevScanState?.tn115MaxSB || 7)
  };

  for (const prefix of ["HB", "SB"]) {
    const key = prefix === "HB" ? "tn115MaxHB" : "tn115MaxSB";
    const startNum = Math.max(1, scanState[key] - 5);
    const maxProbes = 45;
    let consecutiveMisses = 0;

    for (let offset = 0; offset < maxProbes; offset++) {
      const num = startNum + offset;
      const code = `${prefix}${String(num).padStart(4, "0")}`;
      try {
        const bill = await fetchTnBill(code, ga);
        if (!bill) {
          consecutiveMisses += 1;
          if (consecutiveMisses >= 4) break;
          continue;
        }
        consecutiveMisses = 0;
        if (num > scanState[key]) scanState[key] = num;
        if (curatedCodes.has(code)) continue;

        const text = `${bill.abstract} ${bill.caption}`;
        if (EXCLUDE_RE.test(text) || !COUNTY_RELEVANCE_RE.test(text)) continue;

        const section = classify(text);
        if (!section) continue;

        discovered.push({
          id: `auto-tn115-${code.toLowerCase()}`,
          citation: `${bill.prettyCode} (115th General Assembly${bill.latestDate ? `, ${bill.latestDate}` : ""})`,
          title: bill.shortTitle || `${bill.prettyCode} (Tennessee 115th General Assembly)`,
          level: "state",
          status: bill.status,
          stageLabel: bill.stageLabel,
          topic: section.id,
          topicLabel: section.label,
          body: `Tennessee 115th General Assembly${bill.sponsor ? ` (${bill.sponsor})` : ""}`,
          keyDate: "2027-01-12",
          keyDateLabel: "115th Session convenes",
          effectiveDate: null,
          affectedOffices: section.offices,
          summary: bill.abstract || bill.caption,
          bedfordImpact: `Auto-detected from the official Tennessee General Assembly 115th Session feed. Latest official action: ${bill.latestAction}${bill.latestDate ? ` on ${bill.latestDate}` : ""}. Review the bill text on capitol.tn.gov to evaluate direct impact on Bedford County.`,
          actionSteps: [
            `Read the full bill text and fiscal note for ${bill.prettyCode} on capitol.tn.gov.`,
            "Track committee assignment after the 115th General Assembly opens January 12, 2027."
          ],
          statute: bill.caption || `${bill.prettyCode} (115th General Assembly)`,
          autoDiscovered: true,
          sources: [
            { label: `Tennessee General Assembly: ${bill.prettyCode} (115th GA)`, url: bill.url }
          ]
        });
      } catch {
        consecutiveMisses += 1;
        if (consecutiveMisses >= 4) break;
      }
    }
  }

  return { statusPatches, discovered, scanState };
}

function parseRssItems(xml) {
  const out = [];
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)) {
    const block = m[1];
    const title = cleanText(/<title>([\s\S]*?)<\/title>/i.exec(block)?.[1] || "");
    const link = cleanText(/<link>([\s\S]*?)<\/link>/i.exec(block)?.[1] || "");
    const pubDate = cleanText(/<pubDate>([\s\S]*?)<\/pubDate>/i.exec(block)?.[1] || "");
    const desc = cleanText(/<description>([\s\S]*?)<\/description>/i.exec(block)?.[1] || "");
    if (title && link) out.push({ title, link, pubDate, desc });
  }
  return out;
}

function parseGovInfoStage(rawTitle) {
  const m = /\(([A-Z]{2,4})\)/.exec(rawTitle);
  const code = m ? m[1] : "";
  const map = {
    IH: "Submitted / Introduced in House (Not Signed)",
    IS: "Submitted / Introduced in Senate (Not Signed)",
    RH: "Reported by House Committee (Not Signed)",
    RS: "Reported by Senate Committee (Not Signed)",
    EH: "Passed House (Not Signed)",
    ES: "Passed Senate (Not Signed)",
    ENR: "Passed Congress / Enrolled (Awaiting Signature)",
    PCS: "Placed on Senate Calendar (Not Signed)"
  };
  return map[code] || "Submitted / Active in Congress (Not Signed)";
}

async function scanFederal(curatedItems) {
  const statusPatches = {};
  const discovered = [];
  const curatedBillKeys = new Set();

  for (const item of curatedItems) {
    if (item.level !== "federal") continue;
    for (const m of String(item.citation || "").matchAll(/\b(H\.R\.|S\.)\s*(\d+)\b/gi)) {
      curatedBillKeys.add(`${m[1].toUpperCase()}${m[2]}`);
    }
  }

  try {
    const [billsXml, plawXml, presXml] = await Promise.all([
      fetchText("https://www.govinfo.gov/rss/bills.xml").catch(() => ""),
      fetchText("https://www.govinfo.gov/rss/plaw.xml").catch(() => ""),
      fetchText("https://www.congress.gov/rss/presented-to-president.xml").catch(() => "")
    ]);

    const plawItems = parseRssItems(plawXml);
    const presItems = parseRssItems(presXml);
    const billItems = parseRssItems(billsXml);

    // Check if any curated pending federal bill became Public Law or reached the President
    for (const item of curatedItems) {
      if (item.level !== "federal" || item.status === "enacted") continue;
      const nums = [...String(item.citation || "").matchAll(/\b(H\.R\.|S\.)\s*(\d+)\b/gi)].map((m) => `${m[1].toUpperCase()} ${m[2]}`);
      if (!nums.length) continue;

      const hitPlaw = plawItems.find((p) => nums.some((n) => p.title.toUpperCase().includes(n) || p.desc.toUpperCase().includes(n)));
      if (hitPlaw) {
        statusPatches[item.id] = {
          status: "enacted",
          stageLabel: "Enacted Law",
          lastVerifiedAction: `Signed into Public Law (${hitPlaw.title})`
        };
        continue;
      }

      const hitPres = presItems.find((p) => nums.some((n) => p.title.toUpperCase().includes(n)));
      if (hitPres) {
        statusPatches[item.id] = {
          status: "action",
          stageLabel: "Presented to President",
          lastVerifiedAction: `Presented to the President (${hitPres.pubDate || "recent"})`
        };
      }
    }

    // Auto-discover newly introduced or advancing federal bills affecting counties & EMS
    const seen = new Set();
    for (const b of billItems) {
      const text = `${b.title} ${b.desc}`;
      if (EXCLUDE_RE.test(text) || !COUNTY_RELEVANCE_RE.test(text)) continue;
      const codeMatch = /\b(H\.R\.|S\.)\s*(\d+)\b/i.exec(b.title);
      if (!codeMatch) continue;
      const normKey = `${codeMatch[1].toUpperCase()}${codeMatch[2]}`;
      if (curatedBillKeys.has(normKey) || seen.has(normKey)) continue;
      seen.add(normKey);

      const section = classify(text);
      if (!section) continue;

      const cleanBillTitle = b.title.replace(/^(H\.R\.|S\.)\s*\d+\s*(\([A-Z]+\))?\s*-\s*/i, "").trim();
      const pubIso = b.pubDate ? new Date(b.pubDate).toISOString().slice(0, 10) : null;

      discovered.push({
        id: `auto-fed-${normKey.replace(/[^a-z0-9]/gi, "").toLowerCase()}`,
        citation: `${codeMatch[1].toUpperCase()} ${codeMatch[2]} (U.S. Congress${pubIso ? `, ${pubIso}` : ""})`,
        title: cleanBillTitle || b.title,
        level: "federal",
        status: "pending",
        stageLabel: parseGovInfoStage(b.title),
        topic: section.id,
        topicLabel: section.label,
        body: "U.S. Congress (GovInfo Live Feed)",
        keyDate: null,
        keyDateLabel: pubIso ? `Updated ${pubIso} in Congress` : "Active in Congress",
        effectiveDate: null,
        affectedOffices: section.offices,
        summary: `Newly posted Congressional bill matching Bedford County interests (${section.label}): ${cleanBillTitle || b.title}.`,
        bedfordImpact: `Auto-discovered from the official U.S. GovInfo Congressional Bills feed. Stage: ${parseGovInfoStage(b.title)}. Open the official GovInfo bill link to inspect full text and sponsors.`,
        actionSteps: [
          `Review bill text and committee status for ${codeMatch[1].toUpperCase()} ${codeMatch[2]} on GovInfo.`
        ],
        statute: `${codeMatch[1].toUpperCase()} ${codeMatch[2]} (Pending Federal Bill)`,
        autoDiscovered: true,
        sources: [
          { label: `GovInfo Official Bill: ${codeMatch[1].toUpperCase()} ${codeMatch[2]}`, url: b.link }
        ]
      });
      if (discovered.length >= 12) break;
    }
  } catch {
    // Keep existing data on network error
  }

  return { statusPatches, discovered };
}

async function fetchFederalRegister() {
  const url =
    "https://www.federalregister.gov/api/v1/documents.json?per_page=10&order=newest" +
    "&conditions%5Bpublication_date%5D%5Bgte%5D=2026-01-01" +
    "&conditions%5Bagencies%5D%5B%5D=federal-emergency-management-agency" +
    "&conditions%5Bagencies%5D%5B%5D=centers-for-medicare-medicaid-services" +
    "&conditions%5Bagencies%5D%5B%5D=transportation-department" +
    "&conditions%5Bterm%5D=ambulance+OR+disaster+OR+rural+OR+county+OR+bridge";
  try {
    const raw = await fetchText(url);
    const data = JSON.parse(raw);
    return (data.results || []).map((doc) => ({
      id: doc.document_number || doc.html_url,
      date: doc.publication_date || "",
      type: cleanText(doc.type || "Notice"),
      agency: cleanText(doc.agencies?.[0]?.name || "Federal Agency"),
      title: cleanText(doc.title || "Untitled notice"),
      url: doc.html_url || "https://www.federalregister.gov/"
    }));
  } catch {
    return [];
  }
}

async function fetchCountyAlerts() {
  const alerts = [];
  try {
    const ctasHtml = await fetchText("https://www.ctas.tennessee.edu/news");
    const seen = new Set();
    for (const m of ctasHtml.matchAll(/<a[^>]+href="(\/news\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
      const href = `https://www.ctas.tennessee.edu${m[1]}`;
      const title = cleanText(m[2]);
      if (!title || title.length < 15 || seen.has(href)) continue;
      seen.add(href);
      alerts.push({ source: "UT CTAS County Alert", title, url: href });
      if (alerts.length >= 5) break;
    }
  } catch {}

  try {
    const bcHtml = await fetchText("https://www.bedfordcountytn.gov/newslist.php");
    const seen = new Set();
    for (const m of bcHtml.matchAll(/<a[^>]+href="(news_detail[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
      const href = `https://www.bedfordcountytn.gov/${m[1].replace(/^\//, "")}`;
      const title = cleanText(m[2]);
      if (!title || /^read more$/i.test(title) || title.length < 12 || seen.has(href)) continue;
      if (/kayak|recreation tip|festival|parade|holiday closing/i.test(title)) continue;
      seen.add(href);
      alerts.push({ source: "Bedford County Official Notice", title, url: href });
      if (alerts.filter((a) => a.source.startsWith("Bedford")).length >= 4) break;
    }
  } catch {}

  return alerts;
}

async function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const targetDir = process.argv[2] ? resolve(process.argv[2]) : resolve(here, "..", "legislation");
  const catalogPath = resolve(targetDir, "legislation.json");
  const outPath = resolve(targetDir, "live-updates.json");

  const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
  const prev = existsSync(outPath) ? JSON.parse(readFileSync(outPath, "utf8")) : {};

  const [tnRes, fedRes, frNotices, countyAlerts] = await Promise.all([
    scanTennessee(catalog.items || [], prev.scanState || {}),
    scanFederal(catalog.items || []),
    fetchFederalRegister(),
    fetchCountyAlerts()
  ]);

  // Preserve previously auto-discovered items that are still unique, newest first (cap 30)
  const byId = new Map();
  for (const item of [...tnRes.discovered, ...fedRes.discovered, ...(prev.discoveredItems || [])]) {
    if (!item || !item.id || byId.has(item.id)) continue;
    byId.set(item.id, item);
  }
  const discoveredItems = [...byId.values()].slice(0, 30);

  const output = {
    updatedAt: new Date().toISOString(),
    statusPatches: { ...tnRes.statusPatches, ...fedRes.statusPatches },
    discoveredItems,
    federalNotices: frNotices.length ? frNotices : (prev.federalNotices || []),
    countyAlerts: countyAlerts.length ? countyAlerts : (prev.countyAlerts || []),
    scanState: tnRes.scanState
  };

  writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(
    `Updated ${outPath}: ${Object.keys(output.statusPatches).length} status patches, ` +
    `${output.discoveredItems.length} auto-discovered bills, ` +
    `${output.federalNotices.length} federal notices, ` +
    `${output.countyAlerts.length} county/CTAS alerts.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
