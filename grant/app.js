const PROFILE_KEY = "bcems-grants-profile";
const APPS_KEY = "bcems-grants-apps";
const HIDE_KEY = "bcems-grant-notices-hidden";
const LIVE_URL = "https://bedford-grants.tedcox-travel.workers.dev/grant";

const STATUS_LABEL = { open: "Open now", prepare: "Get ready", watch: "Watch", awarded: "Awarded" };
const LEVEL_LABEL = { federal: "Federal", state: "State", local: "Local", private: "Private" };

const SERVICE_FACTS = [
  ["Legal applicant", "Bedford County Government"],
  ["Department", "Bedford County Emergency Medical Services"],
  ["Station", "119 Frank Martin Road, Shelbyville, TN 37160"],
  ["Non-emergency phone", "(931) 684-4403"],
  ["County population", "55,273. U.S. Census Bureau estimate for July 1, 2025."],
  ["Shelbyville population", "26,146. The station sits inside city limits, so USDA Community Facilities is not a fit."],
  ["Rural status", "Shelbyville, TN Micropolitan Statistical Area. Classified as nonmetropolitan by OMB, BLS, and TNECD. Meets SAMHSA R-EMS rural eligibility."],
  ["FEMA applicant type", "Nonaffiliated EMS organization. County ambulance transport service, not fire-based and not hospital-based."],
  ["Licensed fleet", "10 ambulances. Stated to the Financial Management Committee on October 27, 2026."],
  ["Crash rank", "Rank 23 of 95 counties for 2021 through 2025. TDOSHS rankings revised February 12, 2026."],
  ["Region and CDBG", "South Central Tennessee Development District. Not a HUD entitlement county. Not an ARC county."]
];

const DEFAULT_PROFILE = {
  legalName: "Bedford County Government",
  department: "Bedford County Emergency Medical Services",
  address: "119 Frank Martin Road",
  city: "Shelbyville",
  state: "TN",
  zip: "37160",
  phone: "(931) 684-4403",
  director: "Ted Cox",
  title: "Director",
  email: "",
  population: "55273",
  ambulances: "10",
  uei: "",
  ein: "",
  sam: "",
  calls: "",
  fullTime: "",
  partTime: ""
};

const QUESTIONS = {
  "eligibility-ems": {
    label: "FEMA eligibility",
    prompt: "Does Bedford County EMS provide the ambulance transport, with no hospital in charge, in an area where the fire department does not already provide that service?",
    type: "choice",
    options: [
      ["yes", "Yes. That describes this service."],
      ["no", "No. Stop this application."]
    ]
  },
  sam: {
    label: "SAM.gov",
    prompt: "Is Bedford County's SAM.gov registration active?",
    type: "choice",
    options: [["yes", "Yes, it is active."], ["no", "No, or I do not know."]]
  },
  uei: { label: "UEI", prompt: "What is the county Unique Entity ID from SAM.gov?", type: "text", placeholder: "12-character UEI" },
  "unit-year": { label: "Unit year", prompt: "What model year is the ambulance you want to replace?", type: "number", placeholder: "2014" },
  "unit-label": { label: "Unit ID", prompt: "What is the unit number or the last six characters of the VIN?", type: "text", placeholder: "Medic 4 or VIN ending" },
  mileage: { label: "Mileage", prompt: "How many miles are on that ambulance?", type: "number", placeholder: "180000" },
  "unit-condition": {
    label: "Condition",
    prompt: "What is wrong with that ambulance?",
    type: "choice",
    options: [
      ["outages", "It has been out of service on calls."],
      ["worn", "It still runs, and the box, drivetrain, or electrical system is worn out."],
      ["unsafe", "It is unsafe and should leave emergency service if we replace it."]
    ]
  },
  outages: { label: "Out of service", prompt: "How many times in the last 12 months was that unit out of service?", type: "number", placeholder: "6" },
  "project-cost": { label: "Project cost", prompt: "What is the total project cost in dollars, before the match split?", type: "number", placeholder: "325000" },
  "match-cash": {
    label: "Cash match",
    prompt: "Can the county pay the cash match from the budget? FEMA does not accept an in-kind match.",
    type: "choice",
    options: [["yes", "Yes. The county can pay the cash match."], ["no", "No. We cannot commit the cash."]]
  },
  calls: { label: "Calls", prompt: "How many calls did the service answer in the last full year?", type: "number", placeholder: "9000" },
  "full-time": { label: "Full-time staff", prompt: "How many full-time employees does the service have?", type: "number", placeholder: "30" },
  "ops-item": {
    label: "AFG project",
    prompt: "What should this Operations and Safety request buy?",
    type: "choice",
    options: [
      ["monitors", "Cardiac monitors and defibrillators"],
      ["radios", "P25 portable radios"],
      ["ppe", "EMS protective equipment"],
      ["training", "EMT, AEMT, or paramedic training"]
    ]
  },
  "item-age": { label: "Age of current items", prompt: "How old is the equipment or training gap you would replace?", type: "text", placeholder: "Monitors are 9 years old" },
  quantity: { label: "Quantity", prompt: "How many items, seats, or people does this request cover?", type: "number", placeholder: "4" },
  "fh-item": {
    label: "Equipment",
    prompt: "What lifesaving item should Firehouse Subs buy?",
    type: "choice",
    options: [
      ["monitor", "Cardiac monitor and defibrillator"],
      ["aed", "AED"],
      ["extrication", "Extrication tool"],
      ["other", "Another allowed lifesaving item"],
      ["banned", "A power-load stretcher, naloxone, or a drone"]
    ]
  },
  "fh-amount": { label: "Quote total", prompt: "What is the full vendor quote in dollars? The foundation will not fund part of a quote, and it rejects requests over $40,000.", type: "number", placeholder: "22000" },
  "fh-quote": {
    label: "Vendor quote",
    prompt: "Do you have an official vendor quote you can upload on opening day?",
    type: "choice",
    options: [["yes", "Yes. The quote is ready."], ["no", "Not yet."]]
  },
  "fh-financials": {
    label: "Financials",
    prompt: "Do you have a current county budget, balance sheet, or audit that shows Bedford County or the EMS department?",
    type: "choice",
    options: [["yes", "Yes."], ["no", "Not yet."]]
  },
  "fh-prior": {
    label: "Prior award",
    prompt: "Has this organization received a Firehouse Subs award in the last 4 years?",
    type: "choice",
    options: [["no", "No."], ["yes", "Yes. We have to wait."]]
  },
  "fh-need": { label: "Need", prompt: "In a sentence, what call or failure makes this equipment necessary?", type: "text", placeholder: "Two monitors fail their daily check" },
  "wm-facility": {
    label: "Walmart facility",
    prompt: "Which Shelbyville Walmart facility should receive this request?",
    type: "choice",
    options: [
      ["store", "Walmart Supercenter #656 (1880 N. Main St.)"],
      ["dc", "Walmart Distribution Center #6062 (285 Frank Martin Rd.)"],
      ["both", "Both facilities (two separate applications)"]
    ]
  },
  "wm-project": { label: "Project or item", prompt: "What community safety equipment, supplies, or training will this grant pay for?", type: "text", placeholder: "Pediatric airway kits and community CPR supplies" },
  "wm-amount": { label: "Request amount", prompt: "How much will you request per facility in dollars? Local grants range from $250 to $5,000.", type: "number", placeholder: "3500" },
  "wm-deed": {
    label: "Spark Good and Deed",
    prompt: "Is Bedford County's Walmart Spark Good account set up and verified through Deed?",
    type: "choice",
    options: [["yes", "Yes. Verified and ready."], ["no", "Not yet."]]
  },
  "wm-impact": { label: "Local impact", prompt: "In one sentence, how will this protect residents in Bedford County?", type: "text", placeholder: "Equips ambulances with pediatric emergency supplies for 911 calls across Bedford County" },
  "gs-type": {
    label: "Request type",
    prompt: "What type of cost does this Gary Sinise Foundation request cover?",
    type: "choice",
    options: [
      ["equipment", "EMS equipment"],
      ["training", "EMS training"],
      ["ineligible", "Building, construction, utilities, land, or operating costs"]
    ]
  },
  "gs-item": { label: "Equipment or training", prompt: "What specific equipment or training are you requesting?", type: "text", placeholder: "Two portable suction units and trauma bags" },
  "gs-amount": { label: "Estimated cost", prompt: "What is the vendor quote or estimated cost in dollars?", type: "number", placeholder: "8500" },
  "gs-year": {
    label: "Calendar year limit",
    prompt: "Has Bedford County EMS already submitted a Gary Sinise Foundation request this calendar year?",
    type: "choice",
    options: [["no", "No."], ["yes", "Yes. We must wait until next calendar year."]]
  },
  "gs-need": { label: "Operational need", prompt: "In a sentence, what gap does this fill for Bedford County EMS?", type: "text", placeholder: "Replaces worn field trauma gear used on countywide 911 calls" },
  "rems-focus": {
    label: "R-EMS focus",
    prompt: "What will this SAMHSA Rural EMS Training request fund?",
    type: "choice",
    options: [
      ["training", "EMT, AEMT, and paramedic training and certification"],
      ["equipment", "EMS equipment, OSHA PPE, and overdose reversal supplies"],
      ["behavioral", "Mental health, substance use, and overdose response training"],
      ["combined", "Combined rural EMS training, recruitment, and equipment"]
    ]
  },
  "rems-years": {
    label: "Project length",
    prompt: "How many years will the project run? SAMHSA allows up to 2 years.",
    type: "choice",
    options: [["1", "1 year"], ["2", "2 years"]]
  },
  "rems-annual": { label: "Annual budget", prompt: "What is the annual budget request in dollars? SAMHSA caps annual budgets at $300,000 per year.", type: "number", placeholder: "200000" },
  "rems-phsis": {
    label: "PHSIS notice",
    prompt: "Will you send the Public Health System Impact Statement (PHSIS) to state and local health agencies by the deadline?",
    type: "choice",
    options: [["yes", "Yes."], ["no", "Not yet."]]
  },
  "thso-project": {
    label: "THSO project",
    prompt: "What should the highway safety grant fund?",
    type: "choice",
    options: [
      ["extrication", "Extrication equipment for crash scenes"],
      ["training", "Training for care in the first hour after a crash"]
    ]
  },
  "thso-amount": { label: "THSO amount", prompt: "What dollar amount will you request? Peer EMS awards have been about $12,500.", type: "number", placeholder: "12500" },
  "thso-stats": {
    label: "Crash numbers",
    prompt: "Will you pull three years of Bedford County crash counts from the THSO dashboard before you send this?",
    type: "choice",
    options: [["yes", "Yes. I will paste those counts into the packet."], ["no", "Not yet."]]
  },
  "thso-rural": {
    label: "Rural check",
    prompt: "The state treated Bedford County as eligible for the rural ambulance allocation. Will you confirm the rural box on the THSO application before you send it?",
    type: "choice",
    options: [["yes", "Yes."], ["no", "No."]]
  },
  "cdbg-project": {
    label: "CDBG project",
    prompt: "What public health and safety project should the county submit?",
    type: "choice",
    options: [
      ["ambulance", "One ambulance"],
      ["communications", "Emergency communications equipment"]
    ]
  },
  "cdbg-cost": { label: "CDBG project cost", prompt: "What is the total project cost in dollars? Equipment projects cap at $420,000.", type: "number", placeholder: "325000" },
  lmi: { label: "Low and moderate income", prompt: "What HUD low and moderate income percentage will you use for the people this project serves? Enter the number only.", type: "number", placeholder: "51" },
  "lmi-alt": {
    label: "TNECD confirmation",
    prompt: "If that percentage is under 51, has TNECD confirmed another way to meet the rule?",
    type: "choice",
    options: [["yes", "Yes. TNECD confirmed it."], ["no", "No."], ["na", "The percentage is 51 or higher."]]
  },
  atp: {
    label: "Ability to pay",
    prompt: "What is Bedford County's ability-to-pay match rate from the TNECD table? Enter the percent, from 5 to 25. Leave blank if you do not have the table yet.",
    type: "number",
    placeholder: "15",
    optional: true
  },
  "cdbg-open": {
    label: "Open CDBG grant",
    prompt: "Does Bedford County already have an open regular-round CDBG grant?",
    type: "choice",
    options: [["no", "No."], ["yes", "Yes. We cannot file another one."]]
  },
  resolution: {
    label: "County resolution",
    prompt: "Will the county commission adopt the application resolution before you submit?",
    type: "choice",
    options: [["yes", "Yes."], ["no", "Not yet."]]
  },
  "oac-path": {
    label: "Opioid funding path",
    prompt: "Which opioid abatement funding track are you preparing?",
    type: "choice",
    options: [
      ["community", "State OAC Community Grant (Cycle 4, planned October 2027)"],
      ["county", "Bedford County annual Quarter 1 Opioid Abatement funds (County Commission)"]
    ]
  },
  "oac-strategy": {
    label: "EMS opioid strategy",
    prompt: "Which approved EMS abatement strategy fits this request?",
    type: "choice",
    options: [
      ["cc9", "Strategy CC9: Post-overdose care connections and peer support"],
      ["training", "Strategies BB11 and KK1: Responder opioid response training"],
      ["data", "Strategy FF6: Overdose and naloxone deployment data systems"]
    ]
  },
  "oac-amount": { label: "Annual request", prompt: "What annual dollar amount are you planning? Single-applicant Community Grants cap at $1,000,000 per year.", type: "number", placeholder: "75000" },
  "oac-prev": {
    label: "Prior OAC award",
    prompt: "Did Bedford County EMS win an OAC Community Grant in Cycle 3? Winners cannot apply in two consecutive cycles.",
    type: "choice",
    options: [["no", "No."], ["yes", "Yes. We must skip Cycle 4."]]
  },
  "oac-need": { label: "Local opioid need", prompt: "In a sentence, what overdose response gap will this program address?", type: "text", placeholder: "Connects overdose patients to treatment follow-up after 911 response" },
  "tdh-item": {
    label: "Equipment item",
    prompt: "What essential ambulance equipment should be queued if the state funds another EMS equipment round?",
    type: "choice",
    options: [
      ["monitors", "Cardiac monitor and defibrillator"],
      ["stretcher", "Power stretcher or patient movement equipment"],
      ["pediatric", "Pediatric transport restraint and airway gear"],
      ["other", "Other essential ambulance equipment"]
    ]
  },
  "tdh-cost": { label: "Estimated cost", prompt: "What is the estimated equipment cost in dollars? The 2025 state round averaged about $23,000 per licensed service.", type: "number", placeholder: "23000" },
  "tdh-quote": {
    label: "Vendor quote",
    prompt: "Do you have a current vendor quote ready so you can file quickly when a window opens?",
    type: "choice",
    options: [["yes", "Yes."], ["no", "Not yet."]]
  },
  "tdh-need": { label: "Equipment need", prompt: "In a sentence, why does the licensed fleet need this equipment?", type: "text", placeholder: "Replaces aging front-line unit equipment on 10 licensed ambulances" },
  "tema-project": {
    label: "Preparedness project",
    prompt: "What should the EMA carry for EMS?",
    type: "choice",
    options: [
      ["radios", "Interoperable radios"],
      ["mci", "Mass-casualty equipment"],
      ["training", "Preparedness training"],
      ["exercise", "A county exercise"]
    ]
  },
  "tema-cost": { label: "EMA request", prompt: "What dollar amount should the EMA request?", type: "number", placeholder: "25000" },
  "tema-hazard": { label: "Hazard", prompt: "Which hazard does this prepare the county to handle? Daily ambulance replacement is not eligible.", type: "text", placeholder: "A mass-casualty crash on the interstate" },
  "ema-name": { label: "EMA contact", prompt: "Who at Bedford County EMA should receive this request?", type: "text", placeholder: "Name and title" },
  "ema-email": { label: "EMA email", prompt: "What email should receive the request?", type: "text", placeholder: "name@bedfordcountytn.gov" },
  "rhtp-idea": { label: "Next project", prompt: "What Rural Health Transformation project are you preparing? Note whether this is for Round 2 ambulance tracking or a competitive Last Mile Teams or workforce project.", type: "text", placeholder: "Round 2 county ambulance packet or paramedic workforce training" },
  "rhtp-cost": {
    label: "Planning amount",
    prompt: "What planning amount should the concept use? Leave blank or enter 0 if the next notice will set the amount.",
    type: "number",
    placeholder: "0",
    optional: true
  },
  email: { label: "Director email", prompt: "What email should appear on the application?", type: "text", placeholder: "director@bedfordcountytn.gov" }
};

const state = {
  catalog: null,
  error: "",
  filter: "all",
  statusFilter: "all",
  profile: loadProfile(),
  apps: loadApps()
};

function loadProfile() {
  try {
    return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}") };
  } catch (error) {
    return { ...DEFAULT_PROFILE };
  }
}

function loadApps() {
  try {
    const parsed = JSON.parse(localStorage.getItem(APPS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveProfile() {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(state.profile));
}

function saveApps() {
  localStorage.setItem(APPS_KEY, JSON.stringify(state.apps));
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function money(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "";
  return number.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function numberText(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "";
  return number.toLocaleString("en-US");
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function grantById(id) {
  return state.catalog.grants.find((grant) => grant.id === id);
}

function appById(id) {
  return state.apps.find((item) => item.id === id);
}

function checkedLabel() {
  if (!state.catalog?.checkedAt) return "The official pages have not been checked yet.";
  const date = new Date(state.catalog.checkedAt);
  return `Official pages last read ${date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago"
  })} Central time.`;
}

function clockMarkup(grant) {
  const clock = grant.clock;
  if (!clock || !clock.kind) {
    if (grant.status === "open") {
      return `<div class="timer timer-open"><p class="timer-kicker">Open now</p><p class="timer-count">Rolling</p><p class="timer-note">Open year-round. No fixed close date is posted.</p></div>`;
    }
    return `<div class="timer timer-none"><p class="timer-note">No due date posted.</p></div>`;
  }
  const on = clock.on ? ` data-on="${esc(clock.on)}"` : "";
  const at = clock.at ? ` data-at="${esc(clock.at)}"` : "";
  const planned = clock.planned ? ` data-planned="yes"` : "";
  return `<div class="timer" data-kind="${esc(clock.kind)}"${on}${at}${planned}><p class="timer-kicker"></p><p class="timer-count"></p><p class="timer-note"></p></div>`;
}

function chicagoDay(now) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);
  const pick = (type) => parts.find((part) => part.type === type).value;
  return `${pick("year")}-${pick("month")}-${pick("day")}`;
}

function spokenDay(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });
}

function dayGap(on, now) {
  const today = chicagoDay(now);
  const start = Date.parse(`${today}T00:00:00Z`);
  const end = Date.parse(`${on}T00:00:00Z`);
  return Math.round((end - start) / 86400000);
}

function paintClock(node, now) {
  const kind = node.dataset.kind;
  const kicker = node.querySelector(".timer-kicker");
  const count = node.querySelector(".timer-count");
  const note = node.querySelector(".timer-note");
  const planned = node.dataset.planned === "yes";
  const words = { due: "Due in", opens: "Opens in", closes: "Closes in" };
  if (node.dataset.at) {
    const left = Date.parse(node.dataset.at) - now.getTime();
    if (!Number.isFinite(left) || left <= 0) {
      node.classList.add("timer-past");
      kicker.textContent = "";
      count.textContent = "Opened";
      note.textContent = "The posted opening time has passed. It stops after 600 applications.";
      return;
    }
    const total = Math.floor(left / 1000);
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    kicker.textContent = words[kind] || "Opens in";
    if (days >= 2) {
      count.textContent = `${days} days`;
    } else {
      const dayText = days === 1 ? "1 day " : "";
      count.textContent = `${dayText}${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
    }
    const when = new Date(node.dataset.at).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/New_York",
      timeZoneName: "short"
    });
    note.textContent = `${when}. No closing time is posted. It stops after 600 applications.`;
    node.classList.toggle("timer-soon", days < 14);
    return;
  }
  const gap = dayGap(node.dataset.on, now);
  if (!Number.isFinite(gap)) {
    note.textContent = "No due date posted.";
    return;
  }
  if (gap < 0) {
    node.classList.add("timer-past");
    kicker.textContent = "";
    count.textContent = "Date passed";
    note.textContent = `${spokenDay(node.dataset.on)} has passed.`;
    return;
  }
  kicker.textContent = planned ? "Planned close in" : (words[kind] || "Due in");
  if (gap === 0) count.textContent = "Today";
  else if (gap === 1) count.textContent = "1 day";
  else count.textContent = `${gap} days`;
  const confirm = planned ? " Confirm this date on the funder page." : " No hour was posted.";
  note.textContent = `${spokenDay(node.dataset.on)}.${confirm}`;
  node.classList.toggle("timer-soon", gap < 14);
}

function paintClocks() {
  const now = new Date();
  document.querySelectorAll(".timer[data-kind]").forEach((node) => paintClock(node, now));
}

function questionIds(grant, answers) {
  return grant.questions.filter((id) => {
    if (grant.id === "cdbg" && (id === "unit-year" || id === "mileage")) {
      return answers["cdbg-project"] === "ambulance";
    }
    if (grant.id === "oac" && id === "oac-prev") {
      return answers["oac-path"] !== "county";
    }
    return true;
  });
}

function hardStop(id, value) {
  if (id === "eligibility-ems" && value === "no") {
    return "Do not file this FEMA application. The program is for a public ambulance service that is not run by a hospital and is not already provided by the fire department.";
  }
  if (id === "fh-item" && value === "banned") {
    return "Do not file this item with Firehouse Subs. The foundation will not buy a power-load stretcher, naloxone, or a drone.";
  }
  if (id === "fh-prior" && value === "yes") {
    return "Do not file. The foundation asks an organization to wait 4 years after an award.";
  }
  if (id === "gs-type" && value === "ineligible") {
    return "Do not file this cost with the Gary Sinise Foundation. Grants are limited to equipment and training, not building, construction, utility, land, or operating costs.";
  }
  if (id === "gs-year" && value === "yes") {
    return "Do not file again this year. The Gary Sinise Foundation limits departments to one application per calendar year.";
  }
  if (id === "oac-prev" && value === "yes") {
    return "Do not file a Cycle 4 OAC Community Grant. Approved grantees cannot apply in two consecutive cycles. Switch to the Bedford County annual Quarter 1 opioid abatement track instead.";
  }
  if (id === "cdbg-open" && value === "yes") {
    return "Do not file a new regular-round CDBG application while another regular-round grant is still open.";
  }
  return "";
}

function hasNumber(value) {
  return String(value ?? "").trim() !== "" && Number.isFinite(Number(value));
}

function packetBlockers(grant, answers) {
  const blockers = [];
  questionIds(grant, answers).forEach((id) => {
    if (QUESTIONS[id]?.optional) return;
    if (!String(answers[id] ?? "").trim()) blockers.push(`Finish this answer: ${QUESTIONS[id].label}.`);
  });
  const stop = questionIds(grant, answers).map((id) => hardStop(id, answers[id])).find(Boolean);
  if (stop) blockers.push(stop);
  if (grant.level === "federal" && answers.sam === "no") {
    blockers.push("Activate SAM.gov before anyone certifies this federal application.");
  }
  if (!state.profile.uei && grant.level === "federal" && !answers.uei) {
    blockers.push("Add the Unique Entity ID before you send this.");
  }
  if (answers["match-cash"] === "no") blockers.push("The county has to commit the cash match before you send this.");
  if (grant.id === "walmart") {
    const amount = Number(answers["wm-amount"]);
    if (hasNumber(answers["wm-amount"]) && (amount < 250 || amount > 5000)) {
      blockers.push("Keep each Walmart request between $250 and $5,000 per facility.");
    }
    if (answers["wm-deed"] === "no") {
      blockers.push("Complete Walmart Spark Good setup and Deed verification before submitting.");
    }
  }
  if (grant.id === "firehouse") {
    const amount = Number(answers["fh-amount"]);
    if (hasNumber(answers["fh-amount"]) && amount > 40000) blockers.push("Lower the request to $40,000 or less. The foundation rejects anything higher.");
    if (answers["fh-quote"] === "no") blockers.push("Get the official vendor quote before opening day.");
    if (answers["fh-financials"] === "no") blockers.push("Attach a current budget, balance sheet, or audit before you send this.");
  }
  if (grant.id === "samhsa-rems") {
    const annual = Number(answers["rems-annual"]);
    if (hasNumber(answers["rems-annual"]) && annual > 300000) {
      blockers.push("Lower the annual budget to $300,000 or less per year. SAMHSA caps total annual costs at $300,000.");
    }
    if (answers["rems-phsis"] === "no") {
      blockers.push("Send the Public Health System Impact Statement (PHSIS) to state and local health agencies by the deadline.");
    }
  }
  if (grant.id === "thso" && answers["thso-stats"] === "no") {
    blockers.push("Pull three years of Bedford County crash counts from the THSO dashboard before you send this.");
  }
  if (grant.id === "thso" && answers["thso-rural"] === "no") {
    blockers.push("Confirm the rural box with THSO before you send this.");
  }
  if (grant.id === "cdbg") {
    if (hasNumber(answers.lmi) && Number(answers.lmi) < 51 && answers["lmi-alt"] !== "yes") {
      blockers.push("Do not file a countywide project under 51 percent low and moderate income unless TNECD has confirmed another method.");
    }
    if (!hasNumber(answers.atp)) blockers.push("Get Bedford County's ability-to-pay match rate from TNECD before you send this.");
    const cost = Number(answers["cdbg-cost"]);
    if (answers["cdbg-project"] === "ambulance" && hasNumber(answers["cdbg-cost"]) && cost > 420000) {
      blockers.push("An equipment ambulance project caps at $420,000. Lower the request or talk to TNECD before you file.");
    }
    if (answers.resolution === "no") blockers.push("The commission has to adopt the resolution before you submit.");
  }
  if (grant.id === "oac" && answers["oac-path"] !== "county") {
    const annual = Number(answers["oac-amount"]);
    if (hasNumber(answers["oac-amount"]) && annual > 1000000) {
      blockers.push("Single-applicant OAC Community Grants cap at $1,000,000 per year and cannot exceed the agency's annual operating budget.");
    }
  }
  if (grant.id === "tdh-equip" && answers["tdh-quote"] === "no") {
    blockers.push("Get a current vendor quote so you can file as soon as TDH opens an ambulance equipment round.");
  }
  return blockers;
}

function agencyLines() {
  const profile = state.profile;
  return [
    `${profile.department} is the county ambulance service for Bedford County, Tennessee.`,
    `The station is at ${profile.address}, ${profile.city}, ${profile.state} ${profile.zip}.`,
    `The non-emergency phone is ${profile.phone}.`,
    profile.director ? `${profile.director}, ${profile.title}, is the department contact.` : "",
    profile.email ? `The application email is ${profile.email}.` : "",
    `The Census Bureau estimates the county population at ${numberText(profile.population)} as of July 1, 2025.`,
    `The state licenses the service for ${numberText(profile.ambulances)} ambulances. The director stated that limit to the Bedford County Financial Management Committee on October 27, 2026.`
  ].filter(Boolean).join(" ");
}

function callLine(answers) {
  if (!answers.calls) return "";
  return `The service answered ${numberText(answers.calls)} calls in the last full year.`;
}

function staffLine(answers) {
  if (!answers["full-time"]) return "";
  const part = state.profile.partTime ? ` It also has ${numberText(state.profile.partTime)} part-time employees.` : "";
  return `The service has ${numberText(answers["full-time"])} full-time employees.${part}`;
}

function afgMoney(total) {
  const federal = total / 1.1;
  const local = total - federal;
  return { federal, local };
}

function conditionLine(answers) {
  const year = answers["unit-year"];
  const label = answers["unit-label"] || "the unit";
  const miles = answers.mileage ? `${numberText(answers.mileage)} miles` : "mileage to be confirmed from the shop record";
  const condition = {
    outages: `It has been out of service ${numberText(answers.outages || "0")} times in the last 12 months.`,
    worn: "It still answers calls, and the box, drivetrain, or electrical system is worn out.",
    unsafe: "The service will remove it from emergency response if FEMA funds the replacement. It will not be sold to another emergency service."
  }[answers["unit-condition"]] || "";
  return `The request replaces ${label}, a ${year} ambulance with ${miles}. ${condition}`.trim();
}

function buildPacket(grant, answers) {
  const blockers = packetBlockers(grant, answers);
  const sections = [];
  const push = (title, text) => sections.push({ title, text });

  if (grant.id === "walmart") {
    const facility = {
      store: "Walmart Supercenter #656 (1880 N. Main St., Shelbyville, TN 37160)",
      dc: "Walmart Distribution Center #6062 (285 Frank Martin Rd., Shelbyville, TN 37160)",
      both: "Walmart Supercenter #656 (1880 N. Main St.) and Walmart Distribution Center #6062 (285 Frank Martin Rd.) as two separate applications"
    }[answers["wm-facility"]] || "a Shelbyville Walmart facility";
    push("Request", `${state.profile.department} requests ${money(answers["wm-amount"])} from ${facility} through Walmart Spark Good Local Grants for ${answers["wm-project"] || "[project or equipment]"}.`);
    push("Community impact", `${agencyLines()} ${answers["wm-impact"] || ""} Bedford County EMS serves the same Shelbyville and Bedford County service area where Walmart operates and employs local residents.`);
    push("Portal details", [
      `Entity type: Government entity (non-501(c)(3)), County political subdivision`,
      `Applicant: ${state.profile.legalName} / ${state.profile.department}`,
      `Target facility: ${facility}`,
      `Amount per facility: ${money(answers["wm-amount"])}`,
      `Spark Good and Deed verified: ${answers["wm-deed"] === "yes" ? "Yes" : "No, complete first"}`,
      `Contact: ${state.profile.director}, ${state.profile.title}, ${state.profile.phone}`
    ].join("\n"));
    push("Next steps", "Confirm Deed verification using your county email, submit in the Spark Good portal before the cycle deadline, and speak with the local facility manager. If approved, provide county banking details within 21 days for JP Morgan electronic payment.");
  }

  if (grant.id === "gary-sinise") {
    const kind = answers["gs-type"] === "training" ? "training" : "equipment";
    push("Request", `${state.profile.department} asks the Gary Sinise Foundation First Responders Outreach program for ${money(answers["gs-amount"])} to fund ${kind}: ${answers["gs-item"] || "[item or training]"}. This request covers ${kind} only and includes no building, utility, land, or operating costs.`);
    push("Need", `${agencyLines()} ${answers["gs-need"] || ""} This is Bedford County EMS's only Gary Sinise Foundation request for this calendar year.`);
    push("Submission notes", [
      `Department: ${state.profile.department}`,
      `Address: ${state.profile.address}, ${state.profile.city}, ${state.profile.state} ${state.profile.zip}`,
      `Contact: ${state.profile.director}, ${state.profile.title}, ${state.profile.phone}`,
      `Category: ${kind}`,
      `Estimated cost: ${money(answers["gs-amount"])}`,
      `Foundation email: firstresponder@garysinisefoundation.org`
    ].join("\n"));
    push("Review window", "Applications stay open for review for 6 months. The foundation reaches out if approved, if it needs more details, or when the 6-month window closes.");
  }

  if (grant.id === "afg-vehicle") {
    const total = Number(answers["project-cost"] || 0);
    const split = afgMoney(total);
    push("Applicant", `${agencyLines()} ${callLine(answers)} ${staffLine(answers)} The applicant is ${state.profile.legalName}. The Unique Entity ID is ${answers.uei || "[add UEI]"}.`);
    push("Request", `Bedford County requests a Vehicle Acquisition award for one ambulance. ${conditionLine(answers)} This request does not replace the Rural Health Transformation ambulance the county was awarded in 2026. That unit stays in the front-line fleet.`);
    push("Need", `${callLine(answers) || "Add the last full year of call volume before you send this."} The licensed fleet is ${numberText(state.profile.ambulances)} ambulances. When the oldest unit fails, the remaining fleet covers the same county. Response to the next call waits on a unit that is already committed or out of service. A new ambulance that meets NFPA 1900, or GSA KKK-A-1822F, puts a reliable transport unit back on the first-out schedule.`);
    push("Budget", `The total project cost is ${money(total)}. FEMA computes the federal share by dividing the total by 1.10. The federal share is ${money(split.federal)}. The county cash match is ${money(split.local)}. The match is cash. An in-kind match is not allowed.`);
    push("Operations you will keep", "If FEMA funds this ambulance, the county will keep spending on allowable EMS equipment, training, and vehicle costs at 80 percent or more of the average of the two county fiscal years before the award. Pull the real budget totals for those years and enter them in FEMA GO. Do not estimate them here.");
    push("Paste into FEMA GO", [
      "Organization: Bedford County Emergency Medical Services",
      "Applicant type: Nonaffiliated EMS organization",
      "Activity: Vehicle Acquisition",
      "Vehicle: Ambulance",
      `Vehicle replaced: ${answers["unit-label"] || "[unit]"}, year ${answers["unit-year"] || "[year]"}`,
      `Mileage: ${answers.mileage || "[mileage]"}`,
      `Total project cost: ${money(total)}`,
      `Federal share: ${money(split.federal)}`,
      `Local cash share: ${money(split.local)}`,
      "Standards: NFPA 1900 or GSA KKK-A-1822F",
      "Driver training: DOT emergency vehicle operator course, or an equal course, completed before delivery"
    ].join("\n"));
    push("Attachments to gather", "SAM.gov proof. County budget pages for the match and for the two prior years. Shop record for the unit you will replace. VIN. Quote from the ambulance builder. A statement that drivers will complete emergency vehicle operator training before delivery.");
  }

  if (grant.id === "afg-ops") {
    const total = Number(answers["project-cost"] || 0);
    const split = afgMoney(total);
    const item = {
      monitors: "cardiac monitors and defibrillators",
      radios: "P25 portable radios",
      ppe: "EMS protective equipment",
      training: "EMT, AEMT, or paramedic training"
    }[answers["ops-item"]] || "equipment";
    push("Applicant", `${agencyLines()} ${callLine(answers)} ${staffLine(answers)} The Unique Entity ID is ${answers.uei || "[add UEI]"}.`);
    push("Request", `Bedford County requests an Operations and Safety award for ${answers.quantity || "[quantity]"} ${item}. The current items are described as follows. ${answers["item-age"] || "[describe the age of the items]"}`);
    push("Need", `Crews use this equipment on countywide 911 calls. ${callLine(answers)} Worn or missing equipment slows care and puts the crew at risk. The request replaces that gap. It does not ask for structural firefighting gear, and it does not duplicate a vehicle application.`);
    push("Budget", `The total project cost is ${money(total)}. The federal share is ${money(split.federal)}. The county cash match is ${money(split.local)}.`);
    push("Paste into FEMA GO", [
      "Activity: Operations and Safety",
      `Item: ${item}`,
      `Quantity: ${answers.quantity || "[quantity]"}`,
      `Age or gap: ${answers["item-age"] || "[age]"}`,
      `Total project cost: ${money(total)}`,
      `Federal share: ${money(split.federal)}`,
      `Local cash share: ${money(split.local)}`
    ].join("\n"));
    push("Attachments to gather", "SAM.gov proof. Inventory showing the age of the items you will replace. Vendor quote. Training plan if the request is tuition. County budget pages for the cash match.");
  }

  if (grant.id === "samhsa-rems") {
    const focus = {
      training: "EMT, AEMT, and paramedic licensing and certification training",
      equipment: "EMS equipment, OSHA-required PPE, and FDA-approved overdose reversal supplies",
      behavioral: "mental health, substance use, and overdose emergency response training",
      combined: "rural EMS recruitment, licensing training, behavioral health training, and EMS equipment"
    }[answers["rems-focus"]] || "rural EMS training and equipment";
    const years = Number(answers["rems-years"] || 1);
    const annual = Number(answers["rems-annual"] || 0);
    push("Applicant and rural eligibility", `${agencyLines()} ${callLine(answers)} ${staffLine(answers)} Under 42 U.S.C. § 290ee-10, Bedford County EMS qualifies as a local government EMS agency serving a nonmetropolitan statistical area (Shelbyville, TN Micropolitan Statistical Area). The Unique Entity ID is ${answers.uei || "[add UEI]"}.`);
    push("Project", `Bedford County EMS requests SAMHSA Rural Emergency Medical Services Training (R-EMS) funding for ${focus}. Project length: ${years} ${years === 1 ? "year" : "years"}.`);
    push("Budget", `Annual request: ${money(annual)} per year (${money(annual * years)} total across ${years} ${years === 1 ? "year" : "years"}). No local match is required. Total direct and indirect costs stay at or below the $300,000 annual cap.`);
    push("Required filings", [
      `SAM.gov active: ${answers.sam === "yes" ? "Yes" : "Confirm before submitting"}`,
      `UEI: ${answers.uei || "[add UEI]"}`,
      `Public Health System Impact Statement (PHSIS): ${answers["rems-phsis"] === "yes" ? "Planned for state and local health agencies by deadline" : "Required by deadline"}`,
      "Statutory assurance: Include the Assurance of Improved Emergency Medical Services in Rural Areas"
    ].join("\n"));
  }

  if (grant.id === "firehouse") {
    const item = {
      monitor: "a cardiac monitor and defibrillator",
      aed: "an AED",
      extrication: "an extrication tool",
      other: "lifesaving equipment described in the quote"
    }[answers["fh-item"]] || "lifesaving equipment";
    push("Request", `${state.profile.department} asks the Firehouse Subs Public Safety Foundation to purchase ${item}. The full quote is ${money(answers["fh-amount"])}. The foundation should fund the whole quote. The county is not asking for a partial award, and it is not asking to be reimbursed for a purchase it already made.`);
    push("Need", `${agencyLines()} ${answers["fh-need"] || ""} This equipment is for emergency medical response in Bedford County. It is not a power-load stretcher, naloxone, a drone, a body camera, or exercise equipment.`);
    push("Organization answers", [
      `Organization: ${state.profile.department}`,
      `City and county: Shelbyville, Bedford County, Tennessee`,
      `Address: ${state.profile.address}, ${state.profile.city}, ${state.profile.state} ${state.profile.zip}`,
      `Contact: ${state.profile.director}, ${state.profile.title}, ${state.profile.phone}`,
      `Prior Firehouse award in the last 4 years: ${answers["fh-prior"] === "yes" ? "Yes" : "No"}`,
      `Official quote attached: ${answers["fh-quote"] === "yes" ? "Yes" : "No"}`,
      `Current budget or audit attached: ${answers["fh-financials"] === "yes" ? "Yes" : "No"}`
    ].join("\n"));
    push("Opening day", "File on the day the portal opens, after 2:00 p.m. ET. The foundation accepts 600 applications and then closes. Have the quote and the financial document on the computer before that hour.");
  }

  if (grant.id === "thso") {
    const project = answers["thso-project"] === "training"
      ? "training for care in the first hour after a serious crash"
      : "extrication equipment for crash scenes";
    push("Problem", `Bedford County ranked 23rd of 95 Tennessee counties for overall crash rate in the 2021 through 2025 rankings published by the Tennessee Department of Safety in February 2026. ${state.profile.department} answers the medical calls that follow those crashes. The state also treated the county as eligible for the rural ambulance allocation in 2026. Confirm that THSO still lists the county as rural before you submit.`);
    push("Crash counts you must paste", "Paste three years of Bedford County crash counts from the THSO dashboard in this spot before you send the application.\n\nYear 1:\nYear 2:\nYear 3:\n\nAdd one comparison county or the statewide rate that shows Bedford's problem is above average.");
    push("Project", `The service requests ${money(answers["thso-amount"])} for ${project}. The work improves survival during the first hour after injury. It does not request an ambulance.`);
    push("Applicant", agencyLines());
  }

  if (grant.id === "cdbg") {
    const cost = Number(answers["cdbg-cost"] || 0);
    const hasRate = hasNumber(answers.atp);
    const rate = hasRate ? Number(answers.atp) : null;
    const match = hasRate ? cost * (rate / 100) : 0;
    const grantFunds = cost - match;
    const project = answers["cdbg-project"] === "communications" ? "emergency communications equipment" : "one ambulance";
    push("Project", `${state.profile.legalName} requests Community Development Block Grant funds for ${project}. ${answers["cdbg-project"] === "ambulance" ? conditionLine(answers) : "The equipment improves emergency communications for the county ambulance service."} The project serves people who live in Bedford County.`);
    push("Benefit", `The low and moderate income figure entered for this draft is ${answers.lmi || "[percent]"} percent. A regular-round project has to benefit low and moderate income people at 51 percent or more, unless TNECD accepts a survey or another method. ${answers["lmi-alt"] === "yes" ? "TNECD has confirmed another method." : "Do not submit if this test is not met."}`);
    push("Budget", `The total project cost is ${money(cost)}. ${hasRate ? `Using an ability-to-pay rate of ${rate} percent, the county match is ${money(match)} and the CDBG request is ${money(grantFunds)}.` : "Add Bedford County's ability-to-pay rate from the TNECD table before you rely on this budget."} Keep administration at or below 6.5 percent of the grant. Do not count on TNECD to cover a cost overrun.`);
    push("Resolution", `A resolution of the Bedford County Board of Commissioners should state that the county applies for Tennessee CDBG public health and safety funds for ${project}, that the county will provide the required match, and that the county mayor or the county executive is authorized to sign the application and the grant contract.`);
    push("Public meeting", "Advertise one public meeting in the local newspaper at least 14 full days before the meeting. Place the notice in the public notice or legal section. Include a nondiscrimination statement and the name of a contact for a disability accommodation. Also post the notice at the library, the courthouse, and the EMS station. Keep the sign-in sheet, including self-reported race, and a summary of how you invited minority participation. At the meeting, explain the CDBG national objectives, the eligible categories, the funding caps, the match, and this project. Leave time for other project ideas.");
    push("Environmental step", answers["cdbg-project"] === "ambulance"
      ? "An ambulance purchase with no installation work can use the signed Certification of Exemption for HUD funded projects."
      : "Ask TNECD whether this communications project is exempt before you file the environmental certification.");
  }

  if (grant.id === "oac") {
    const strategy = {
      cc9: "Remediation Strategy CC9 (supporting Emergency Medical Systems and peer support specialists to connect overdose patients to treatment)",
      training: "Remediation Strategies BB11 and KK1 (training government EMS responders on opioid response and reducing stigma)",
      data: "Remediation Strategy FF6 (overdose and naloxone deployment data reporting)"
    }[answers["oac-strategy"]] || "an approved EMS opioid abatement strategy";
    const isCountyTrack = answers["oac-path"] === "county";
    push("Track and eligibility", isCountyTrack
      ? `${state.profile.department} requests local allocation from Bedford County's annual Quarter 1 Tennessee Opioid Abatement Trust Fund payment under T.C.A. § 33-11-103. The Bedford County Board of Commissioners controls those local abatement funds.`
      : `${state.profile.department} prepares a Tennessee Opioid Abatement Council Community Grant proposal for Cycle 4 (planned October 2027). Bedford County Government is an established Tennessee governmental agency operating for more than 24 months.`);
    push("Program", `Strategy: ${strategy}. Planned annual amount: ${money(answers["oac-amount"])}. ${answers["oac-need"] || ""} Funds will serve Bedford County residents as payor of last resort and will not cover past expenses.`);
    push("Rules check", isCountyTrack
      ? "Present the budget and approved remediation strategy code to the Bedford County Commission or finance committee for local opioid abatement allocation."
      : "Reimbursement-based grant. Invoice quarterly to monthly on actual expenses. Indirect costs cap at 15 percent. Budget cannot exceed the department's annual operating budget. Submit in the State of Tennessee Sub-Recipient Grant Management Enterprise Solution portal when Cycle 4 opens.");
    push("Applicant", agencyLines());
  }

  if (grant.id === "tdh-equip") {
    const item = {
      monitors: "cardiac monitors and defibrillators",
      stretcher: "power stretchers or patient movement equipment",
      pediatric: "pediatric transport restraints and airway gear",
      other: "essential ambulance equipment"
    }[answers["tdh-item"]] || "essential ambulance equipment";
    push("Queued request", `${state.profile.department} is preparing an equipment request for ${item} with an estimated cost of ${money(answers["tdh-cost"])}. ${answers["tdh-need"] || ""}`);
    push("Readiness checklist", [
      `Licensed service: ${state.profile.department} (${numberText(state.profile.ambulances)} licensed ambulances)`,
      `Vendor quote ready: ${answers["tdh-quote"] === "yes" ? "Yes" : "Get quote now"}`,
      "State funding note: The General Assembly appropriated $5 million in 2025 (about $23,000 per licensed service). Watch the 2027 legislative session and TDH Office of EMS notices."
    ].join("\n"));
    push("Applicant", agencyLines());
  }

  if (grant.id === "tema") {
    const project = {
      radios: "interoperable radios",
      mci: "mass-casualty equipment",
      training: "preparedness training",
      exercise: "a county exercise"
    }[answers["tema-project"]] || "a preparedness project";
    push("Request to EMA", [
      `To: ${answers["ema-name"] || "[EMA contact]"}`,
      `Email: ${answers["ema-email"] || "[EMA email]"}`,
      "",
      `${state.profile.director} asks Bedford County Emergency Management to carry one Homeland Security Grant request for ${state.profile.department}.`,
      `Project: ${project}.`,
      `Amount: ${money(answers["tema-cost"])}.`,
      `Hazard: ${answers["tema-hazard"] || "[hazard]"}.`,
      "This is not a request for a routine ambulance.",
      "EMS will inventory and tag any equipment the grant buys, and any radio will meet the state interoperability rules.",
      "Please submit the request in the TEMA EM Grants Portal if the project fits the open guidance."
    ].join("\n"));
    push("Why EMA has to send it", "TEMA tells departments to work through the local emergency management agency. Bedford County EMS should not file this grant on its own.");
  }

  if (grant.id === "rhtp") {
    const amount = hasNumber(answers["rhtp-cost"]) ? Number(answers["rhtp-cost"]) : 0;
    push("Concept", `${state.profile.department} received the Round 1 Rural Health Transformation county ambulance allocation ($305,461). This concept does not duplicate the Round 1 unit. Next focus: ${answers["rhtp-idea"] || "[project]"}. ${amount > 0 ? `The planning amount is ${money(amount)}.` : "The official notice or Round 2 packet will set the amount."}`);
    push("Email to the state", [
      "To: RuralHealth@tn.gov",
      "Subject: Bedford County EMS, Rural Health Transformation update and next project",
      "",
      "Bedford County Emergency Medical Services is the county ambulance service in Shelbyville.",
      "The county received the Round 1 rural ambulance allocation.",
      `We are tracking Round 2 county ambulance guidance and preparing for the next competitive EMS or Last Mile Teams notice. Focus: ${answers["rhtp-idea"] || "[project]"}.`,
      `Contact: ${state.profile.director}, ${state.profile.phone}, ${answers.email || state.profile.email || "[email]"}.`,
      "Please notify us when Round 2 ambulance packets or competitive EMS notices post."
    ].join("\n"));
    push("Do not send this as a grant yet", "Send the email only as a watch notice. File an application when TDH releases the official Round 2 packet or opens a competitive EMS notice.");
  }

  push("What you still do", "Read every number. Fix anything that is wrong. Then send the application on the official site, or send the email shown above. This assistant cannot certify a federal or state application for the county. The authorized official has to do that.");

  return {
    blockers,
    sections,
    ready: blockers.length === 0 && grant.status !== "watch"
  };
}

function rich(text) {
  return esc(text).split(/\n\n/).map((part) => `<p>${part.replace(/\n/g, "<br>")}</p>`).join("");
}

function shell(main) {
  const tabs = [
    ["#/", "Grants"],
    ["#/apply", "Apply"],
    ["#/packets", "Packets"],
    ["#/agency", "Agency"]
  ];
  const current = location.hash || "#/";
  const tab = (href, label, className) => {
    const active = current === href || (href === "#/apply" && current.startsWith("#/apply")) || (href === "#/packets" && current.startsWith("#/packet"));
    return `<button class="${className}${active ? " active" : ""}" data-go="${href}">${label}</button>`;
  };
  return `
    <header class="app-header">
      <div class="brand">
        <img src="logo.png?v=2" alt="Bedford County EMS">
        <div>
          <p class="eyebrow">Bedford County · Shelbyville</p>
          <h1>BCEMS Grants</h1>
          <p>Local, state, federal, and private awards this service can pursue.</p>
        </div>
      </div>
    </header>
    <nav class="side">
      <div class="side-logo"><img src="logo.png?v=2" alt="Bedford County EMS"></div>
      <strong>BCEMS Grants</strong>
      <span>Bedford County EMS</span>
      ${tabs.map(([href, label]) => tab(href, label, "")).join("")}
    </nav>
    <main class="layout">${main}</main>
    <nav class="tabbar">
      ${tabs.map(([href, label]) => tab(href, label, "")).join("")}
    </nav>
  `;
}

function hiddenNoticeIds() {
  try {
    const saved = JSON.parse(localStorage.getItem(HIDE_KEY) || "[]");
    return new Set(Array.isArray(saved) ? saved : []);
  } catch (error) {
    return new Set();
  }
}

function hideNotice(id) {
  const hidden = hiddenNoticeIds();
  hidden.add(id);
  localStorage.setItem(HIDE_KEY, JSON.stringify([...hidden]));
  render();
}

function showHiddenNotices() {
  localStorage.removeItem(HIDE_KEY);
  render();
}

function applyLive(overlay) {
  if (!overlay || !overlay.checkedAt || !state.catalog) return;
  state.catalog.checkedAt = overlay.checkedAt;
  if (Array.isArray(overlay.notices)) state.catalog.notices = overlay.notices;
  const patches = overlay.patches || {};
  for (const grant of state.catalog.grants) {
    const patch = patches[grant.id];
    if (!patch) continue;
    grant.status = patch.status;
    grant.deadlineLabel = patch.deadlineLabel;
    if ("actionDate" in patch) grant.actionDate = patch.actionDate;
    if ("clock" in patch) grant.clock = patch.clock;
    if ("watcherNote" in patch) grant.watcherNote = patch.watcherNote;
  }
  const active = document.activeElement;
  if (active && /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)) return;
  render();
}

function renderNotices(emptyLine) {
  if (!Array.isArray(state.catalog.notices)) return "";
  const hidden = hiddenNoticeIds();
  const valid = state.catalog.notices.filter((notice) => notice && notice.id);
  const notices = valid.filter((notice) => !hidden.has(notice.id));
  const hiddenCount = valid.length - notices.length;
  const restoreBtn = hiddenCount
    ? `<div class="actions"><button class="btn-ghost" type="button" data-show-hidden-notices>Show hidden (${hiddenCount})</button></div>`
    : "";
  if (!notices.length) {
    const line = hiddenCount
      ? `You hid ${hiddenCount} ${hiddenCount === 1 ? "notice" : "notices"} from the last check.`
      : emptyLine;
    return `<section class="panel"><p class="kicker">New on official pages</p><h2>No new notice</h2><p>${esc(line)}</p>${restoreBtn}</section>`;
  }
  const cards = notices.map((notice) => `
    <article class="card notice">
      <p class="kicker">New notice · ${esc(notice.funder || "Grants.gov")}</p>
      <h2>${esc(notice.name)}</h2>
      <div class="meta"><span class="badge ${esc(notice.status || "watch")}">${esc(STATUS_LABEL[notice.status] || "New")}</span></div>
      <p class="small"><strong>Timing.</strong> ${esc(notice.deadlineLabel || "No close date posted.")}</p>
      ${clockMarkup(notice)}
      ${notice.amountLabel ? `<p class="small"><strong>Amount.</strong> ${esc(notice.amountLabel)}</p>` : ""}
      <p class="small">${esc(notice.note || "")}</p>
      <div class="actions">
        <a class="btn-gold" href="${esc(notice.url)}" target="_blank" rel="noreferrer noopener">Read the notice</a>
        <button class="btn-ghost" type="button" data-hide-notice="${esc(notice.id)}">Hide</button>
      </div>
    </article>
  `).join("");
  return `
    <section class="panel">
      <p class="kicker">New on official pages</p>
      <h2>Look at these before they are added</h2>
      <p>These are postings from Grants.gov. The check does not turn them into an application. Read the notice. Hide it if it is not for Bedford County.</p>
      ${restoreBtn}
    </section>
    ${cards}`;
}

function renderHome() {
  const grants = state.catalog.grants.filter((grant) => {
    const levelMatch = state.filter === "all" || grant.level === state.filter;
    const statusMatch = state.statusFilter === "all" || grant.status === state.statusFilter;
    return levelMatch && statusMatch;
  });
  const counts = { open: 0, prepare: 0, watch: 0 };
  state.catalog.grants.forEach((grant) => { counts[grant.status] = (counts[grant.status] || 0) + 1; });
  const cards = grants.map((grant) => `
    <article class="card card-${esc(grant.status)}">
      <p class="kicker">${esc(LEVEL_LABEL[grant.level])} · ${esc(grant.funder)}</p>
      <h2>${esc(grant.name)}</h2>
      <div class="meta">
        <span class="badge ${esc(grant.status)}">${esc(STATUS_LABEL[grant.status] || grant.status)}</span>
      </div>
      <p>${esc(grant.summary)}</p>
      <p class="small"><strong>Why it fits.</strong> ${esc(grant.why)}</p>
      <p class="small"><strong>Timing.</strong> ${esc(grant.deadlineLabel)}</p>
      ${clockMarkup(grant)}
      <p class="small"><strong>Amount.</strong> ${esc(grant.amountLabel)}</p>
      ${grant.watcherNote ? `<p class="small muted">${esc(grant.watcherNote)}</p>` : ""}
      <div class="actions">
        <button class="btn-gold" data-go="#/apply/${esc(grant.id)}">Have the assistant apply</button>
        <button class="btn-ghost" data-go="#/grant/${esc(grant.id)}">Rules</button>
      </div>
    </article>
  `).join("");
  const skipped = state.catalog.notAFit.map((item) => `<li><strong>${esc(item.name)}.</strong> ${esc(item.reason)}</li>`).join("");
  const statTile = (key, label) => `
    <button type="button" class="stat ${state.statusFilter === key ? "active" : ""}" data-status-filter="${key}" aria-pressed="${state.statusFilter === key}">
      <b>${counts[key] || 0}</b>
      <span>${label}</span>
    </button>
  `;
  const activeStatusNote = state.statusFilter !== "all"
    ? `<div class="actions"><button class="btn-ghost" type="button" data-status-filter="all">Showing ${esc(STATUS_LABEL[state.statusFilter])} · Show all (${state.catalog.grants.length})</button></div>`
    : "";
  return `
    <section class="home-grid">
      <div class="list">
        <section class="panel panel-hero">
          <div class="section-bar">Bedford County Emergency Medical Services</div>
          <h2>Grant list (${state.catalog.grants.length} programs)</h2>
          <p>The assistant writes the application from the funder's rules and the facts you confirm. You review it. You send it on the official site. The county's authorized official still has to certify a federal or state application.</p>
          <div class="actions"><button class="btn" data-share="list">Email or share</button></div>
          <div class="stats">
            ${statTile("open", "Open now")}
            ${statTile("prepare", "Get ready")}
            ${statTile("watch", "Watch")}
          </div>
          ${activeStatusNote}
          <p class="small muted">${esc(checkedLabel())} The check runs every morning. This computer does not have to be on. Tap a status box above to filter.</p>
          <div class="filters">
            ${["all", "federal", "state", "local", "private"].map((level) => `<button class="chip ${state.filter === level ? "active" : ""}" data-filter="${level}">${level === "all" ? "All" : LEVEL_LABEL[level]}</button>`).join("")}
          </div>
        </section>
        ${renderNotices("The last check did not find a new EMS posting on Grants.gov. Programs already on this list stay in the cards below.")}
        ${cards || `<section class="panel"><p>No grants match this filter.</p><button class="btn-ghost" type="button" data-reset-filters>Show all grants</button></section>`}
      </div>
      <aside class="list">
        <section class="panel">
          <div class="section-bar">Checked and set aside</div>
          <h2>Not a fit</h2>
          <ul class="clean">${skipped}</ul>
        </section>
        <section class="panel install">
          <p class="kicker">Use it like an app</p>
          <h2>Add it to this phone or computer</h2>
          <p>On an iPhone, tap Share, then Add to Home Screen. On Android, use the browser menu and choose Install app or Add to Home screen. On a Mac, open this page in Safari and choose File, then Add to Dock. It then opens full screen, with no browser bar.</p>
        </section>
      </aside>
    </section>
  `;
}

function renderGrant(id) {
  const grant = grantById(id);
  if (!grant) return `<section class="panel"><p>That grant is not on the list.</p></section>`;
  return `
    <section class="card card-${esc(grant.status)}">
      <p class="kicker">${esc(LEVEL_LABEL[grant.level])} · ${esc(grant.funder)}</p>
      <h2>${esc(grant.name)}</h2>
      <div class="meta"><span class="badge ${esc(grant.status)}">${esc(STATUS_LABEL[grant.status])}</span></div>
      <p>${esc(grant.summary)}</p>
      <div class="note"><strong>Why this service can apply.</strong> ${esc(grant.why)}</div>
      <p><strong>Timing.</strong> ${esc(grant.deadlineLabel)}</p>
      ${clockMarkup(grant)}
      <p><strong>Amount.</strong> ${esc(grant.amountLabel)}</p>
      <p><strong>Match.</strong> ${esc(grant.matchLabel)}</p>
      <h3>Rules that change the application</h3>
      <ul class="clean">${grant.rules.map((rule) => `<li>${esc(rule)}</li>`).join("")}</ul>
      <div class="actions noprint">
        <button class="btn-gold" data-go="#/apply/${esc(grant.id)}">Have the assistant apply</button>
        <button class="btn" data-share="grant" data-grant="${esc(grant.id)}">Email or share</button>
        <a class="btn" href="${esc(grant.portalUrl)}" target="_blank" rel="noreferrer noopener">Official page</a>
      </div>
      <div class="sources small">
        <p class="kicker">Sources</p>
        <ul class="clean">${grant.sources.map((source) => `<li>${esc(source)}</li>`).join("")}</ul>
      </div>
    </section>
  `;
}

function prefill(grant) {
  const answers = {};
  if (state.profile.uei) answers.uei = state.profile.uei;
  if (state.profile.sam) answers.sam = state.profile.sam;
  if (state.profile.calls) answers.calls = state.profile.calls;
  if (state.profile.fullTime) answers["full-time"] = state.profile.fullTime;
  if (state.profile.email) answers.email = state.profile.email;
  return answers;
}

function startApplication(grantId) {
  const grant = grantById(grantId);
  if (!grant) {
    location.hash = "#/";
    return;
  }
  const existing = state.apps.find((item) => item.grantId === grantId && item.status !== "sent");
  if (existing) {
    location.hash = `#/apply/${grantId}/${existing.id}`;
    return;
  }
  const item = {
    id: uid(),
    grantId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rulesVersion: grant.rulesVersion,
    answers: prefill(grant),
    step: 0,
    sections: [],
    blockers: [],
    status: "draft",
    stop: ""
  };
  state.apps.unshift(item);
  saveApps();
  location.hash = `#/apply/${grantId}/${item.id}`;
}

function renderApplyPicker() {
  const buttons = state.catalog.grants.map((grant) => `
    <button class="btn full picker-btn" data-start="${esc(grant.id)}">
      <span>${esc(grant.name)}</span>
      <span class="badge ${esc(grant.status)}">${esc(STATUS_LABEL[grant.status])}</span>
    </button>
  `).join("");
  return `<section class="panel"><div class="section-bar">Assistant</div><h2>Which application should I write?</h2><div class="choice">${buttons}</div></section>`;
}

function renderWizard(grantId, appId) {
  const grant = grantById(grantId);
  const item = appById(appId);
  if (!grant || !item) return `<section class="panel"><p>That draft is gone.</p></section>`;
  if (item.sections?.length && item.step === "packet") {
    location.hash = `#/packet/${item.id}`;
    return "";
  }
  const ids = questionIds(grant, item.answers);
  const index = Math.min(item.step || 0, ids.length);
  if (item.stop) {
    return `
      <section class="panel">
        <p class="kicker">${esc(grant.name)}</p>
        <h2>Stop here</h2>
        <div class="stop">${esc(item.stop)}</div>
        <div class="actions">
          <button class="btn-gold" data-clear-stop="${esc(item.id)}">Change my answer</button>
          <button class="btn" data-go="#/">Back to grants</button>
          <button class="btn-ghost" data-delete-app="${esc(item.id)}">Delete this draft</button>
        </div>
      </section>
    `;
  }
  if (index >= ids.length) return renderReview(grant, item);
  const question = QUESTIONS[ids[index]];
  const width = Math.round((index / ids.length) * 100);
  const requiredAttr = question.optional ? "" : " required";
  const field = question.type === "choice"
    ? `<div class="choice">${question.options.map(([value, label]) => `<button class="btn" data-answer="${esc(value)}" data-app="${esc(item.id)}" data-qid="${esc(ids[index])}">${esc(label)}</button>`).join("")}</div>`
    : `<form data-text-form="${esc(item.id)}" data-qid="${esc(ids[index])}">
        <input name="value" type="${question.type === "number" ? "number" : "text"}" inputmode="${question.type === "number" ? "decimal" : "text"}" placeholder="${esc(question.placeholder || "")}" value="${esc(item.answers[ids[index]] || "")}"${requiredAttr}>
        <div class="actions">
          <button class="btn-gold" type="submit">${question.optional ? "Continue" : "Use this answer"}</button>
          ${question.optional ? `<button class="btn-ghost" type="button" data-answer="" data-app="${esc(item.id)}" data-qid="${esc(ids[index])}">Leave blank for now</button>` : ""}
        </div>
      </form>`;
  return `
    <section class="question">
      <p class="kicker">Assistant · ${esc(grant.name)}</p>
      <div class="progress" aria-hidden="true"><span style="width:${width}%"></span></div>
      <p class="small muted">Question ${index + 1} of ${ids.length}</p>
      <div class="bubble assistant"><p>I will write only what you confirm. I will not invent call volume, a match rate, or a budget number.</p></div>
      <h2>${esc(question.prompt)}</h2>
      ${field}
      <div class="actions noprint">
        ${index > 0 ? `<button class="btn-ghost" data-back="${esc(item.id)}">Previous</button>` : ""}
        <button class="btn-ghost" data-go="#/grant/${esc(grant.id)}">Read the rules</button>
      </div>
    </section>
  `;
}

function renderReview(grant, item) {
  const ids = questionIds(grant, item.answers);
  const rows = ids.map((id) => `<li><strong>${esc(QUESTIONS[id].label)}.</strong> ${esc(item.answers[id] || (QUESTIONS[id].optional ? "Left blank for now" : "Missing"))}</li>`).join("");
  return `
    <section class="panel">
      <p class="kicker">${esc(grant.name)}</p>
      <h2>I have what I need</h2>
      <p>I will now write the narrative, the budget, and the answers that go on the official form.</p>
      <ul class="clean">${rows}</ul>
      <div class="actions">
        <button class="btn-gold" data-write="${esc(item.id)}">Write the application</button>
        <button class="btn-ghost" data-back="${esc(item.id)}">Change the last answer</button>
      </div>
    </section>
  `;
}

function renderPacket(appId) {
  const item = appById(appId);
  if (!item) return `<section class="panel"><p>That packet is gone.</p></section>`;
  const grant = grantById(item.grantId);
  if (!grant) return `<section class="panel"><p>That grant left the catalog.</p></section>`;
  const stale = item.rulesVersion && item.rulesVersion !== grant.rulesVersion;
  const blocks = (item.blockers || []).map((line) => `<div class="stop">${esc(line)}</div>`).join("");
  const sections = (item.sections || []).map((section, index) => `
    <div class="section-block">
      <h3>${esc(section.title)}</h3>
      ${rich(section.text)}
      <button class="btn-ghost noprint" data-copy="${index}" data-app="${esc(item.id)}">Copy this section</button>
    </div>
  `).join("");
  const ready = (item.blockers || []).length === 0;
  return `
    <article class="packet" id="packet">
      <div class="section-bar">${esc(grant.funder)}</div>
      <h2>${esc(grant.name)}</h2>
      <p class="small">Prepared for ${esc(state.profile.department)}. ${esc(grant.deadlineLabel)}</p>
      ${stale ? `<div class="callout">The funder's page changed after this draft was written. Read the rules again before you send it.</div>` : ""}
      ${ready ? `<div class="note">The draft has the facts you entered. Read it once more, then send it on the official site.</div>` : `<div class="callout">This packet is not ready to send. Fix the items below first.</div>`}
      ${blocks}
      ${sections}
      <div class="actions noprint">
        <button class="btn-gold" data-share="packet" data-app="${esc(item.id)}">Email or share</button>
        <button class="btn" data-copy-all="${esc(item.id)}">Copy the whole packet</button>
        <a class="btn" href="${esc(grant.portalUrl)}" target="_blank" rel="noreferrer noopener">Open the official site</a>
        <button class="btn" data-print>Print or save PDF</button>
        ${ready ? `<button class="btn" data-sent="${esc(item.id)}">I sent this on the official site</button>` : ""}
        <button class="btn-ghost" data-edit="${esc(item.id)}">${ready ? "Edit answers" : "Fix the answers"}</button>
      </div>
    </article>
  `;
}

function renderPackets() {
  if (!state.apps.length) {
    return `<section class="panel"><div class="section-bar">Packets</div><h2>No packets yet</h2><p>Choose a grant and the assistant will write the first one.</p><button class="btn-gold" data-go="#/apply">Start</button></section>`;
  }
  const cards = state.apps.map((item) => {
    const grant = grantById(item.grantId);
    const label = item.status === "sent" ? "Sent" : (item.stop ? "Stopped" : (item.blockers?.length ? "Needs facts" : "Ready to review"));
    return `
      <article class="card">
        <p class="kicker">${esc(label)}</p>
        <h2>${esc(grant ? grant.name : "Grant")}</h2>
        <p class="small muted">${item.sentAt ? `Sent ${esc(item.sentAt.slice(0, 10))}` : "Saved on this browser only."}</p>
        <div class="actions">
          <button class="btn-gold" data-go="${item.sections?.length ? `#/packet/${esc(item.id)}` : `#/apply/${esc(item.grantId)}/${esc(item.id)}`}">Open</button>
          <button class="btn-ghost" data-delete-app="${esc(item.id)}">Delete</button>
        </div>
      </article>
    `;
  }).join("");
  return `<section class="list">${cards}<section class="panel noprint"><p>Packets stay on this phone or computer. Use Agency if you want a file you can move to another device. Nothing is stored on a server.</p></section></section>`;
}

function field(name, label, value, type = "text") {
  return `<label class="field" for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" value="${esc(value)}">`;
}

function renderAgency() {
  const profile = state.profile;
  const facts = SERVICE_FACTS.map(([label, value]) => `<li><strong>${esc(label)}.</strong> ${esc(value)}</li>`).join("");
  return `
    <section class="list">
      <section class="panel">
        <div class="section-bar">Checked November 26, 2026</div>
        <h2>Service facts</h2>
        <p>These verified facts stay the same for everyone who opens this page.</p>
        <ul class="clean facts-list">${facts}</ul>
      </section>
      <section class="panel">
        <div class="section-bar">Local agency file</div>
        <h2>Facts saved on this device</h2>
        <p>These details stay in this browser. The assistant uses them in every application. Leave a box blank if you do not have the number yet. It will ask later instead of guessing.</p>
        <form id="profile-form">
          ${field("director", "Director", profile.director)}
          ${field("title", "Title", profile.title)}
          ${field("email", "Email", profile.email, "email")}
          ${field("phone", "Phone", profile.phone)}
          ${field("uei", "Unique Entity ID", profile.uei)}
          ${field("ein", "Employer identification number", profile.ein)}
          ${field("calls", "Calls in the last full year", profile.calls, "number")}
          ${field("fullTime", "Full-time employees", profile.fullTime, "number")}
          ${field("partTime", "Part-time employees", profile.partTime, "number")}
          <label class="field" for="sam">SAM.gov</label>
          <select id="sam" name="sam">
            <option value="" ${profile.sam === "" ? "selected" : ""}>Not confirmed</option>
            <option value="yes" ${profile.sam === "yes" ? "selected" : ""}>Active</option>
            <option value="no" ${profile.sam === "no" ? "selected" : ""}>Not active</option>
          </select>
          <div class="actions"><button class="btn-gold" type="submit">Save agency facts</button></div>
        </form>
      </section>
      <section class="panel">
        <p class="kicker">Move drafts between devices</p>
        <h2>Backup file</h2>
        <p>Save your profile and packets to a file, or load a backup file on another phone or computer.</p>
        <div class="actions">
          <button class="btn" data-export>Save my file</button>
          <label class="btn">Open my file<input id="import-file" type="file" accept="application/json" hidden></label>
        </div>
      </section>
    </section>
  `;
}

function render() {
  const root = document.getElementById("app");
  if (state.error) {
    root.innerHTML = shell(`<section class="panel"><h2>The grant list did not load</h2><p>${esc(state.error)}</p></section>`);
    return;
  }
  if (!state.catalog) {
    root.innerHTML = shell(`<section class="panel"><p>Loading the grant list.</p></section>`);
    return;
  }
  const hash = location.hash || "#/";
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  let body = "";
  if (!parts[0]) body = renderHome();
  else if (parts[0] === "grant") body = renderGrant(parts[1]);
  else if (parts[0] === "apply" && !parts[1]) body = renderApplyPicker();
  else if (parts[0] === "apply" && parts[1] && !parts[2]) {
    startApplication(parts[1]);
    return;
  } else if (parts[0] === "apply") body = renderWizard(parts[1], parts[2]);
  else if (parts[0] === "packet") body = renderPacket(parts[1]);
  else if (parts[0] === "packets") body = renderPackets();
  else if (parts[0] === "agency") body = renderAgency();
  else body = renderHome();
  root.innerHTML = shell(body);
  paintClocks();
}

function saveAnswer(item, qid, value) {
  item.answers[qid] = String(value ?? "").trim();
  item.updatedAt = new Date().toISOString();
  item.stop = hardStop(qid, item.answers[qid]);
  if (qid === "uei") state.profile.uei = item.answers.uei;
  if (qid === "sam") state.profile.sam = item.answers.sam;
  if (qid === "calls") state.profile.calls = item.answers.calls;
  if (qid === "full-time") state.profile.fullTime = item.answers["full-time"];
  if (qid === "email") state.profile.email = item.answers.email;
  saveProfile();
  if (!item.stop) item.step = (item.step || 0) + 1;
  saveApps();
  render();
}

function writePacket(item) {
  const grant = grantById(item.grantId);
  const packet = buildPacket(grant, item.answers);
  item.sections = packet.sections;
  item.blockers = packet.blockers;
  item.status = packet.ready ? "ready" : "draft";
  item.step = "packet";
  item.rulesVersion = grant.rulesVersion;
  item.updatedAt = new Date().toISOString();
  saveApps();
  location.hash = `#/packet/${item.id}`;
}

function packetText(item) {
  const grant = grantById(item.grantId);
  const head = `${grant.name}\n${state.profile.department}\n\n`;
  return head + item.sections.map((section) => `${section.title}\n${section.text}`).join("\n\n");
}

function listText() {
  const lines = state.catalog.grants.map((grant) => {
    return `${grant.name}\n${LEVEL_LABEL[grant.level]}. ${STATUS_LABEL[grant.status]}.\n${grant.deadlineLabel}\n${grant.summary}`;
  });
  return `Bedford County Emergency Medical Services\nGrant list\n\n${lines.join("\n\n")}`;
}

function grantText(grant) {
  return [
    grant.name,
    grant.funder,
    `${LEVEL_LABEL[grant.level]}. ${STATUS_LABEL[grant.status]}.`,
    grant.deadlineLabel,
    grant.summary,
    grant.why,
    `Amount. ${grant.amountLabel}`,
    `Match. ${grant.matchLabel}`,
    grant.portalUrl
  ].join("\n");
}

async function shareContent(title, text, button) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      button.textContent = "Shared";
      return;
    } catch (error) {
      if (error && error.name === "AbortError") return;
    }
  }
  const long = text.length > 1500;
  const body = long
    ? `The full writeup is copied. Paste it into this email.\n\n${text.slice(0, 700)}`
    : text;
  button.textContent = "Opening email";
  if (long) copyText(text);
  const link = document.createElement("a");
  link.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
  link.rel = "noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function copyText(text) {
  const fallback = () => {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  };
  try {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      fallback();
      return Promise.resolve();
    }
    return Promise.race([
      navigator.clipboard.writeText(text).catch(fallback),
      new Promise((resolve) => window.setTimeout(resolve, 400))
    ]);
  } catch (error) {
    fallback();
    return Promise.resolve();
  }
}

function onClick(event) {
  const hide = event.target.closest("[data-hide-notice]");
  if (hide) {
    hideNotice(hide.getAttribute("data-hide-notice"));
    return;
  }
  if (event.target.closest("[data-show-hidden-notices]")) {
    showHiddenNotices();
    return;
  }
  if (event.target.closest("[data-reset-filters]")) {
    state.filter = "all";
    state.statusFilter = "all";
    render();
    return;
  }
  const statusFilter = event.target.closest("[data-status-filter]");
  if (statusFilter) {
    const next = statusFilter.getAttribute("data-status-filter");
    state.statusFilter = state.statusFilter === next ? "all" : next;
    render();
    return;
  }
  const go = event.target.closest("[data-go]");
  if (go) {
    location.hash = go.getAttribute("data-go");
    return;
  }
  const filter = event.target.closest("[data-filter]");
  if (filter) {
    state.filter = filter.getAttribute("data-filter");
    render();
    return;
  }
  const start = event.target.closest("[data-start]");
  if (start) {
    startApplication(start.getAttribute("data-start"));
    return;
  }
  const answer = event.target.closest("[data-answer]");
  if (answer) {
    saveAnswer(appById(answer.getAttribute("data-app")), answer.getAttribute("data-qid"), answer.getAttribute("data-answer"));
    return;
  }
  const clearStop = event.target.closest("[data-clear-stop]");
  if (clearStop) {
    const item = appById(clearStop.getAttribute("data-clear-stop"));
    if (item) {
      item.stop = "";
      saveApps();
      render();
    }
    return;
  }
  const edit = event.target.closest("[data-edit]");
  if (edit) {
    const item = appById(edit.getAttribute("data-edit"));
    if (item) {
      item.step = 0;
      item.sections = [];
      item.stop = "";
      item.updatedAt = new Date().toISOString();
      saveApps();
      location.hash = `#/apply/${item.grantId}/${item.id}`;
    }
    return;
  }
  const del = event.target.closest("[data-delete-app]");
  if (del) {
    const id = del.getAttribute("data-delete-app");
    if (!window.confirm("Delete this draft from this browser?")) return;
    state.apps = state.apps.filter((item) => item.id !== id);
    saveApps();
    if (location.hash.includes(id)) location.hash = "#/packets";
    else render();
    return;
  }
  const back = event.target.closest("[data-back]");
  if (back) {
    const item = appById(back.getAttribute("data-back"));
    item.step = Math.max(0, (item.step === "packet" ? questionIds(grantById(item.grantId), item.answers).length : item.step) - 1);
    item.sections = [];
    item.stop = "";
    saveApps();
    render();
    return;
  }
  const write = event.target.closest("[data-write]");
  if (write) {
    writePacket(appById(write.getAttribute("data-write")));
    return;
  }
  const copy = event.target.closest("[data-copy]");
  if (copy) {
    const item = appById(copy.getAttribute("data-app"));
    copyText(item.sections[Number(copy.getAttribute("data-copy"))].text);
    copy.textContent = "Copied";
    return;
  }
  const copyAll = event.target.closest("[data-copy-all]");
  if (copyAll) {
    copyText(packetText(appById(copyAll.getAttribute("data-copy-all"))));
    copyAll.textContent = "Copied";
    return;
  }
  const share = event.target.closest("[data-share]");
  if (share) {
    const kind = share.getAttribute("data-share");
    if (kind === "list") shareContent("Bedford County EMS grant list", listText(), share);
    if (kind === "grant") {
      const grant = grantById(share.getAttribute("data-grant"));
      shareContent(grant.name, grantText(grant), share);
    }
    if (kind === "packet") {
      const item = appById(share.getAttribute("data-app"));
      const grant = grantById(item.grantId);
      shareContent(`${grant.name} application`, packetText(item), share);
    }
    return;
  }
  if (event.target.closest("[data-print]")) {
    window.print();
    return;
  }
  const sent = event.target.closest("[data-sent]");
  if (sent) {
    const item = appById(sent.getAttribute("data-sent"));
    item.status = "sent";
    item.sentAt = new Date().toISOString();
    saveApps();
    location.hash = "#/packets";
  }
}

function onSubmit(event) {
  const form = event.target.closest("[data-text-form]");
  if (form) {
    event.preventDefault();
    const data = new FormData(form);
    saveAnswer(appById(form.getAttribute("data-text-form")), form.getAttribute("data-qid"), data.get("value"));
    return;
  }
  if (event.target.id === "profile-form") {
    event.preventDefault();
    const data = new FormData(event.target);
    ["director", "title", "email", "phone", "uei", "ein", "calls", "fullTime", "partTime", "sam"].forEach((key) => {
      state.profile[key] = String(data.get(key) || "").trim();
    });
    saveProfile();
    event.target.querySelector("button").textContent = "Saved";
  }
}

function onChange(event) {
  if (event.target.closest("#profile-form")) {
    const submitBtn = event.target.closest("#profile-form").querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = "Save agency facts";
    return;
  }
  if (event.target.id !== "import-file") return;
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      if (!data || typeof data !== "object") throw new Error("Invalid backup");
      if (data.profile) state.profile = { ...DEFAULT_PROFILE, ...data.profile };
      if (Array.isArray(data.apps)) state.apps = data.apps;
      saveProfile();
      saveApps();
      render();
    } catch (error) {
      window.alert("That file is not a valid grant backup.");
    }
  };
  reader.readAsText(file);
}

document.getElementById("app").addEventListener("click", (event) => {
  if (event.target.closest("[data-export]")) {
    const blob = new Blob([JSON.stringify({ profile: state.profile, apps: state.apps }, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bcems-grants.json";
    link.click();
    URL.revokeObjectURL(link.href);
    return;
  }
  onClick(event);
});
document.getElementById("app").addEventListener("submit", onSubmit);
document.getElementById("app").addEventListener("change", onChange);
window.addEventListener("hashchange", render);
setInterval(paintClocks, 1000);

fetch("grants.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error("Grant list unavailable");
    return response.json();
  })
  .then((catalog) => {
    state.catalog = catalog;
    render();
    fetch(LIVE_URL, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((overlay) => {
        if (overlay) applyLive(overlay);
      })
      .catch(() => {});
  })
  .catch((error) => {
    state.error = error.message;
    render();
  });
