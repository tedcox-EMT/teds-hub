const PROFILE_KEY = "county-grants-profile";
const APPS_KEY = "county-grants-apps";

const STATUS_LABEL = { open: "Open now", prepare: "Get ready", watch: "Watch", awarded: "Awarded" };
const LEVEL_LABEL = { federal: "Federal", state: "State", local: "Local", private: "Private" };

const DEFAULT_PROFILE = {
  legalName: "Bedford County Government",
  department: "",
  city: "Shelbyville",
  state: "TN",
  zip: "37160",
  phone: "",
  contact: "",
  title: "",
  email: "",
  uei: "",
  ein: "",
  sam: ""
};

const QUESTIONS = {
  project: { label: "Project", prompt: "What project should this application describe?", type: "text", placeholder: "Name the work in a few words" },
  cost: { label: "Project cost", prompt: "What is the total project cost in dollars? Use a real quote or budget figure. Leave blank if you do not have one yet.", type: "number", placeholder: "250000" },
  "contact-name": { label: "Contact", prompt: "Who should the funder call?", type: "text", placeholder: "Name" },
  "contact-email": { label: "Email", prompt: "What email should go on the application?", type: "text", placeholder: "name@bedfordcountytn.gov" },
  "match-known": {
    label: "Match",
    prompt: "Do you have the match or loan terms from the current notice?",
    type: "choice",
    options: [["yes", "Yes. I can enter them with the budget."], ["no", "Not yet."]]
  },
  sam: {
    label: "SAM.gov",
    prompt: "Is Bedford County's SAM.gov registration active?",
    type: "choice",
    options: [["yes", "Yes, it is active."], ["no", "No, or I do not know."]]
  },
  uei: { label: "UEI", prompt: "What is the county Unique Entity ID from SAM.gov?", type: "text", placeholder: "12-character UEI" },
  "srf-type": {
    label: "Water project",
    prompt: "Which infrastructure type is this?",
    type: "choice",
    options: [
      ["wastewater", "Wastewater"],
      ["stormwater", "Stormwater"],
      ["drinking", "Drinking water"]
    ]
  },
  "cdbg-project": { label: "CDBG project", prompt: "Which eligible category is this project?", type: "text", placeholder: "Water system, sewer, or public health and safety" },
  lmi: { label: "Low and moderate income", prompt: "What percent of the people served have low or moderate income? Enter the HUD or survey figure only.", type: "number", placeholder: "51" },
  atp: { label: "Ability to pay", prompt: "What is Bedford County's ability-to-pay match rate from TNECD? Enter the percent. Leave blank if you do not have the table yet.", type: "number", placeholder: "15" },
  "cdbg-open": {
    label: "Open CDBG grant",
    prompt: "Does Bedford County already have an open regular-round CDBG grant?",
    type: "choice",
    options: [["no", "No."], ["yes", "Yes. We cannot file another regular-round application."]],
    stop: ["yes"]
  },
  resolution: {
    label: "County resolution",
    prompt: "Will the county commission adopt the application resolution before you submit?",
    type: "choice",
    options: [["yes", "Yes."], ["no", "Not yet."]]
  },
  "bric-plan": {
    label: "Mitigation plan",
    prompt: "Does Bedford County have a current FEMA-approved hazard mitigation plan?",
    type: "choice",
    options: [["yes", "Yes."], ["no", "No, or I have not confirmed it."]]
  },
  "bric-nfip": {
    label: "Flood insurance",
    prompt: "Is the county in good standing with the National Flood Insurance Program?",
    type: "choice",
    options: [["yes", "Yes."], ["no", "No, or I have not confirmed it."]]
  },
  "hmgp-open": {
    label: "Open disaster round",
    prompt: "Has TEMA posted an open Hazard Mitigation Grant round for a current disaster?",
    type: "choice",
    options: [["yes", "Yes. A round is open."], ["no", "No round is open."]],
    stop: ["no"]
  },
  "usda-place": { label: "Place served", prompt: "What town or unincorporated area will this facility serve? Do not enter Shelbyville or the whole county.", type: "text", placeholder: "Town or area" },
  "usda-pop": {
    label: "Population served",
    prompt: "How many people does that place have in the latest Census count?",
    type: "choice",
    options: [
      ["5000", "5,000 or fewer"],
      ["12000", "12,000 or fewer"],
      ["20000", "20,000 or fewer"],
      ["over", "More than 20,000"]
    ],
    stop: ["over"]
  },
  "cops-primary": {
    label: "Primary agency",
    prompt: "Is the Bedford County Sheriff's Office the primary law enforcement agency for the area this grant would serve?",
    type: "choice",
    options: [["yes", "Yes."], ["no", "No."]],
    stop: ["no"]
  },
  "cops-count": { label: "Officers", prompt: "How many full-time sworn officers would this request add or rehire?", type: "number", placeholder: "2" },
  "eda-distress": {
    label: "Distress test",
    prompt: "Has EDA or the South Central Tennessee Development District confirmed that this project area meets the current distress test?",
    type: "choice",
    options: [["yes", "Yes."], ["no", "Not yet."]]
  },
  "outdoor-type": {
    label: "Park program",
    prompt: "Which outdoor program fits this project?",
    type: "choice",
    options: [
      ["lprf", "Local Parks and Recreation Fund, 50 percent match"],
      ["lwcf", "Land and Water Conservation Fund, 50 percent match"],
      ["rtp", "Recreational Trails Program, 20 percent match"],
      ["trip", "TRIP, only if the county has no parks department"]
    ]
  },
  "trip-dept": {
    label: "Parks department",
    prompt: "Does the county already have a parks and recreation department?",
    type: "choice",
    options: [["no", "No."], ["yes", "Yes."]]
  },
  "thso-stats": {
    label: "Crash numbers",
    prompt: "Will you pull Bedford County crash counts from the THSO dashboard before you send this?",
    type: "choice",
    options: [["yes", "Yes."], ["no", "Not yet."]]
  },
  "tema-hazard": { label: "Hazard", prompt: "Which hazard does this prepare the county to handle?", type: "text", placeholder: "A specific hazard, not daily replacement" },
  "ema-name": { label: "EMA contact", prompt: "Who at Bedford County EMA should receive this request?", type: "text", placeholder: "Name and title" },
  "ema-email": { label: "EMA email", prompt: "What email should receive the request?", type: "text", placeholder: "name@bedfordcountytn.gov" },
  "fh-item": { label: "Equipment", prompt: "What lifesaving item should the foundation buy? Do not request a banned item.", type: "text", placeholder: "One item and the quantity" },
  "fh-quote": {
    label: "Vendor quote",
    prompt: "Do you have one official vendor quote for the full amount?",
    type: "choice",
    options: [["yes", "Yes."], ["no", "Not yet."]]
  },
  "fh-financials": {
    label: "Financials",
    prompt: "Do you have a current county budget, balance sheet, or audit that shows the county or the department?",
    type: "choice",
    options: [["yes", "Yes."], ["no", "Not yet."]]
  },
  "fh-prior": {
    label: "Prior award",
    prompt: "Has this department received a Firehouse Subs award in the last 4 years?",
    type: "choice",
    options: [["no", "No."], ["yes", "Yes. We have to wait."]],
    stop: ["yes"]
  }
};

const state = {
  catalog: null,
  filter: "all",
  profile: loadProfile(),
  apps: loadApps(),
  error: ""
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

function uid() {
  return Math.random().toString(36).slice(2, 10);
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
  const number = Number(String(value).replace(/[^0-9.]/g, ""));
  if (!number) return "";
  return number.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function grantById(id) {
  return state.catalog.grants.find((grant) => grant.id === id);
}

function appById(id) {
  return state.apps.find((item) => item.id === id);
}

function questionIds(grant) {
  return grant.questions || [];
}

function answerLabel(question, value) {
  if (!question || question.type !== "choice") return value;
  const match = question.options.find((option) => option[0] === value);
  return match ? match[1] : value;
}

function checkedLabel() {
  const raw = state.catalog?.checkedAt;
  if (!raw) return "The list has not been checked.";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "The list has not been checked.";
  return `Checked ${date.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" })}.`;
}

function shell(main) {
  const tabs = [
    ["#/", "Grants"],
    ["#/apply", "Apply"],
    ["#/packets", "Packets"],
    ["#/agency", "County"]
  ];
  const current = location.hash || "#/";
  const tab = (href, label) => {
    const active = current === href || (href === "#/apply" && current.startsWith("#/apply")) || (href === "#/packets" && current.startsWith("#/packet"));
    return `<button class="${active ? "active" : ""}" data-go="${href}">${label}</button>`;
  };
  return `
    <header class="app-header">
      <div class="brand">
        <img src="logo.png?v=2" alt="Bedford County seal">
        <div>
          <p class="eyebrow">Bedford County</p>
          <h1>County Grants</h1>
          <p>Local, state, federal, and private awards the county can pursue.</p>
        </div>
      </div>
    </header>
    <nav class="side">
      <img src="logo.png?v=2" alt="">
      <strong>County Grants</strong>
      <span>Bedford County</span>
      ${tabs.map(([href, label]) => tab(href, label)).join("")}
    </nav>
    <main class="layout">${main}</main>
    <nav class="tabbar">
      ${tabs.map(([href, label]) => tab(href, label)).join("")}
    </nav>
  `;
}

function renderHome() {
  const grants = state.catalog.grants.filter((grant) => state.filter === "all" || grant.level === state.filter);
  const counts = { open: 0, prepare: 0, watch: 0 };
  state.catalog.grants.forEach((grant) => { counts[grant.status] = (counts[grant.status] || 0) + 1; });
  const cards = grants.map((grant) => `
    <article class="card">
      <p class="kicker">${esc(LEVEL_LABEL[grant.level])} · ${esc(grant.funder)}</p>
      <h2>${esc(grant.name)}</h2>
      <div class="meta"><span class="badge ${esc(grant.status)}">${esc(STATUS_LABEL[grant.status] || grant.status)}</span></div>
      <p>${esc(grant.summary)}</p>
      <p class="small"><strong>Why it fits.</strong> ${esc(grant.why)}</p>
      <p class="small"><strong>Timing.</strong> ${esc(grant.deadlineLabel)}</p>
      <p class="small"><strong>Amount.</strong> ${esc(grant.amountLabel)}</p>
      ${grant.watcherNote ? `<p class="small muted">${esc(grant.watcherNote)}</p>` : ""}
      <div class="actions">
        <button class="btn-gold" data-go="#/apply/${esc(grant.id)}">Apply</button>
        <button class="btn-ghost" data-go="#/grant/${esc(grant.id)}">Rules</button>
      </div>
    </article>
  `).join("");
  const skipped = state.catalog.notAFit.map((item) => `<li><strong>${esc(item.name)}.</strong> ${esc(item.reason)}</li>`).join("");
  return `
    <section class="home-grid">
      <div class="list">
        <section class="panel">
          <p class="kicker">Bedford County Government</p>
          <h2>Grant list</h2>
          <p>The assistant writes a draft from the funder's rules and the facts you confirm. You review it. You send it on the official site. The county's authorized official still has to certify a federal or state application.</p>
          <div class="actions"><button class="btn" data-share="list">Email or share</button></div>
          <div class="stats">
            <div class="stat"><b>${counts.open || 0}</b><span>Open now</span></div>
            <div class="stat"><b>${counts.prepare || 0}</b><span>Get ready</span></div>
            <div class="stat"><b>${counts.watch || 0}</b><span>Watch</span></div>
          </div>
          <p class="small muted">${esc(checkedLabel())} A daily check reads the TDEC, TNECD, FEMA, TEMA, USDA, COPS, THSO, arts district, and Firehouse Subs pages. It changes a date only when that page states a new one.</p>
          <div class="filters">
            ${["all", "federal", "state", "local", "private"].map((level) => `<button class="chip ${state.filter === level ? "active" : ""}" data-filter="${level}">${level === "all" ? "All" : LEVEL_LABEL[level]}</button>`).join("")}
          </div>
        </section>
        ${cards || `<section class="panel"><p>No grants in this group.</p></section>`}
        <section class="panel">
          <p class="kicker">Checked and set aside</p>
          <h2>Not a fit</h2>
          <ul class="clean">${skipped}</ul>
        </section>
      </div>
      <aside class="list">
        <section class="panel install">
          <p class="kicker">Use it like an app</p>
          <h2>Add it to this phone or computer</h2>
          <p>On an iPhone, tap Share, then Add to Home Screen. The icon is the county seal with Grants at the bottom. On Android, use the browser menu and choose Install app or Add to Home screen. On a Mac, open this page in Safari and choose File, then Add to Dock. It then opens full screen, with no browser bar.</p>
        </section>
      </aside>
    </section>
  `;
}

function renderGrant(id) {
  const grant = grantById(id);
  if (!grant) return `<section class="panel"><p>That grant is not on the list.</p></section>`;
  return `
    <section class="card">
      <p class="kicker">${esc(LEVEL_LABEL[grant.level])} · ${esc(grant.funder)}</p>
      <h2>${esc(grant.name)}</h2>
      <div class="meta"><span class="badge ${esc(grant.status)}">${esc(STATUS_LABEL[grant.status])}</span></div>
      <p>${esc(grant.summary)}</p>
      <div class="note"><strong>Why the county can apply.</strong> ${esc(grant.why)}</div>
      <p><strong>Timing.</strong> ${esc(grant.deadlineLabel)}</p>
      <p><strong>Amount.</strong> ${esc(grant.amountLabel)}</p>
      <p><strong>Match.</strong> ${esc(grant.matchLabel)}</p>
      <h3>Rules that change the application</h3>
      <ul class="clean">${grant.rules.map((rule) => `<li>${esc(rule)}</li>`).join("")}</ul>
      <div class="actions noprint">
        <button class="btn-gold" data-go="#/apply/${esc(grant.id)}">Apply</button>
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

function startApplication(grantId) {
  const grant = grantById(grantId);
  const existing = state.apps.find((item) => item.grantId === grantId && item.status !== "sent");
  if (existing) {
    location.hash = `#/apply/${grantId}/${existing.id}`;
    return;
  }
  const answers = {};
  if (state.profile.uei) answers.uei = state.profile.uei;
  if (state.profile.email) answers["contact-email"] = state.profile.email;
  if (state.profile.contact) answers["contact-name"] = state.profile.contact;
  const item = {
    id: uid(),
    grantId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rulesVersion: grant.rulesVersion,
    answers,
    step: 0,
    sections: [],
    blockers: [],
    status: "draft"
  };
  state.apps.unshift(item);
  saveApps();
  location.hash = `#/apply/${grantId}/${item.id}`;
}

function renderApplyPicker() {
  const buttons = state.catalog.grants.map((grant) => `
    <button class="btn full" data-start="${esc(grant.id)}">${esc(grant.name)}</button>
  `).join("");
  return `<section class="panel"><p class="kicker">Assistant</p><h2>Which application should I write?</h2><div class="choice">${buttons}</div></section>`;
}

function renderWizard(grantId, appId) {
  const grant = grantById(grantId);
  const item = appById(appId);
  if (!grant || !item) return `<section class="panel"><p>That draft is gone.</p></section>`;
  if (item.sections?.length && item.step === "packet") {
    location.hash = `#/packet/${item.id}`;
    return "";
  }
  const ids = questionIds(grant);
  const index = Math.min(item.step || 0, ids.length);
  if (index >= ids.length) {
    return `
      <section class="panel">
        <p class="kicker">${esc(grant.name)}</p>
        <h2>Ready to write the draft</h2>
        <p>I will use only the answers you just gave and the rules already on this grant. I will not invent a dollar amount, a match, or a deadline.</p>
        <div class="actions">
          <button class="btn-gold" data-write="${esc(item.id)}">Write the draft</button>
          <button class="btn" data-back="${esc(item.id)}">Back</button>
        </div>
      </section>
    `;
  }
  const qid = ids[index];
  const question = QUESTIONS[qid];
  const progress = Math.round((index / ids.length) * 100);
  let field = "";
  if (question.type === "choice") {
    field = `<div class="choice">${question.options.map((option) => `<button class="btn" data-answer="${esc(option[0])}" data-qid="${esc(qid)}" data-app="${esc(item.id)}">${esc(option[1])}</button>`).join("")}</div>`;
  } else {
    field = `
      <form data-text-form="${esc(item.id)}" data-qid="${esc(qid)}">
        <input name="value" type="${question.type === "number" ? "number" : "text"}" inputmode="${question.type === "number" ? "decimal" : "text"}" placeholder="${esc(question.placeholder || "")}" value="${esc(item.answers[qid] || "")}">
        <div class="actions"><button class="btn-gold" type="submit">Continue</button></div>
      </form>
    `;
  }
  return `
    <section class="question">
      <p class="kicker">Question ${index + 1} of ${ids.length}</p>
      <h2>${esc(question.prompt)}</h2>
      <div class="progress" aria-hidden="true"><span style="width:${progress}%"></span></div>
      ${field}
      ${index > 0 ? `<div class="actions"><button class="btn" data-back="${esc(item.id)}">Back</button></div>` : ""}
    </section>
  `;
}

function blockersFor(grant, answers) {
  const blockers = [];
  if (grant.status === "watch") blockers.push("This program is not open. Keep the draft. Do not send it until the funder posts a date.");
  questionIds(grant).forEach((qid) => {
    const question = QUESTIONS[qid];
    const value = String(answers[qid] || "").trim();
    if (!value) blockers.push(`${question.label} is still blank.`);
    if (question.stop && question.stop.includes(value)) blockers.push(answerLabel(question, value));
  });
  if (answers.lmi && Number(answers.lmi) < 51 && answers["lmi-alt"] !== "yes") {
    blockers.push("The low and moderate income figure is under 51 percent. Do not file a countywide project until TNECD accepts another method.");
  }
  if (answers.resolution === "no") blockers.push("The commission still has to adopt the resolution.");
  if (answers["match-known"] === "no") blockers.push("The match or loan terms are not confirmed.");
  if (answers["bric-plan"] === "no") blockers.push("Confirm the FEMA-approved hazard mitigation plan before you file.");
  if (answers["bric-nfip"] === "no") blockers.push("Confirm National Flood Insurance Program standing before you file.");
  if (answers.sam === "no") blockers.push("SAM.gov is not confirmed as active.");
  if (questionIds(grant).includes("uei") && !String(answers.uei || "").trim()) blockers.push("The Unique Entity ID is blank.");
  if (answers["fh-quote"] === "no" || answers["fh-financials"] === "no") blockers.push("The quote or the financial statement is not ready.");
  if (answers["thso-stats"] === "no") blockers.push("The THSO crash counts are not pulled yet.");
  if (answers["eda-distress"] === "no") blockers.push("The EDA distress test is not confirmed.");
  if (answers["outdoor-type"] === "trip" && answers["trip-dept"] === "yes") blockers.push("TRIP is only for a county with no parks and recreation department.");
  if (answers.cost && grant.id === "abc" && Number(answers.cost) > 5000) blockers.push("Arts Build Communities caps the request at $5,000.");
  if (answers.cost && grant.id === "firehouse" && Number(answers.cost) > 40000) blockers.push("Firehouse Subs rejects a request over $40,000.");
  if (answers.cost && grant.id === "cdbg" && Number(answers.cost) > 1000000) blockers.push("The CDBG construction cap is $1,000,000.");
  return blockers;
}

function writePacket(item) {
  const grant = grantById(item.grantId);
  const answers = item.answers;
  const blockers = blockersFor(grant, answers);
  const lines = questionIds(grant).map((qid) => {
    const question = QUESTIONS[qid];
    const value = answers[qid];
    const shown = question.type === "number" && qid !== "lmi" && qid !== "atp" && qid !== "cops-count" ? (money(value) || "[not entered]") : (answerLabel(question, value) || "[not entered]");
    return `${question.label}: ${shown}`;
  });
  const costLine = answers.cost ? `The figure entered for this draft is ${money(answers.cost)}.` : "No project cost was entered.";
  item.blockers = blockers;
  item.sections = [
    {
      title: "Applicant",
      text: [
        state.profile.legalName,
        state.profile.department,
        [state.profile.city, state.profile.state, state.profile.zip].filter(Boolean).join(" "),
        answers["contact-name"] || state.profile.contact || "[contact]",
        answers["contact-email"] || state.profile.email || "[email]",
        state.profile.phone || ""
      ].filter(Boolean).join("\n")
    },
    {
      title: "Project",
      text: [
        grant.name,
        grant.funder,
        answers.project || answers["cdbg-project"] || answers["fh-item"] || answers["usda-place"] || "[project]",
        costLine,
        `Timing on the funder page: ${grant.deadlineLabel}`,
        `Match rule: ${grant.matchLabel}`
      ].join("\n")
    },
    {
      title: "Facts you confirmed",
      text: lines.join("\n")
    },
    {
      title: "Rules to follow",
      text: grant.rules.join("\n")
    },
    {
      title: "What you still do",
      text: blockers.length
        ? `Fix these items before anyone sends this.\n${blockers.join("\n")}`
        : "Read every number. Fix anything that is wrong. Then send the application on the official site. This assistant cannot certify a federal or state application for the county. The authorized official has to do that."
    }
  ];
  item.step = "packet";
  item.updatedAt = new Date().toISOString();
  item.status = blockers.length ? "draft" : "ready";
  saveApps();
  location.hash = `#/packet/${item.id}`;
}

function renderPacket(id) {
  const item = appById(id);
  if (!item) return `<section class="panel"><p>That draft is gone.</p></section>`;
  const grant = grantById(item.grantId);
  const blocks = item.sections.map((section, index) => `
    <div class="section-block">
      <h3>${esc(section.title)}</h3>
      <p>${esc(section.text)}</p>
      <button class="btn noprint" data-copy="${index}" data-app="${esc(item.id)}">Copy this part</button>
    </div>
  `).join("");
  const warning = item.blockers?.length ? `<div class="stop"><strong>Do not send this yet.</strong> ${item.blockers.map(esc).join(" ")}</div>` : `<div class="note">The draft has the facts you entered. A person still has to check it and file it.</div>`;
  return `
    <article class="packet">
      <p class="kicker">${esc(grant?.name || "Draft")}</p>
      <h2>Application draft</h2>
      ${warning}
      ${blocks}
      <div class="actions noprint">
        <button class="btn-gold" data-copy-all="${esc(item.id)}">Copy all</button>
        <button class="btn" data-share="packet" data-app="${esc(item.id)}">Email or share</button>
        <button class="btn" data-print>Print</button>
        <a class="btn" href="${esc(grant?.portalUrl || "#")}" target="_blank" rel="noreferrer noopener">Official page</a>
        <button class="btn" data-sent="${esc(item.id)}">Mark as sent</button>
      </div>
    </article>
  `;
}

function renderPackets() {
  if (!state.apps.length) return `<section class="panel"><h2>No drafts yet</h2><p>Use Apply on a grant to start one.</p></section>`;
  const cards = state.apps.map((item) => {
    const grant = grantById(item.grantId);
    return `
      <article class="card">
        <h2>${esc(grant?.name || "Draft")}</h2>
        <p class="small">${esc(item.status)} · ${esc(new Date(item.updatedAt).toLocaleDateString())}</p>
        <div class="actions"><button class="btn" data-go="#/packet/${esc(item.id)}">Open draft</button></div>
      </article>
    `;
  }).join("");
  return `<section class="list">${cards}</section>`;
}

function field(name, label, value, type = "text") {
  return `<label class="field">${esc(label)}<input name="${esc(name)}" type="${type}" value="${esc(value || "")}"></label>`;
}

function renderAgency() {
  const profile = state.profile;
  return `
    <section class="panel">
      <p class="kicker">County file</p>
      <h2>Facts used on every draft</h2>
      <p>These stay in this browser. They are not sent anywhere until you copy or share a draft.</p>
      <form id="profile-form">
        ${field("department", "Office or department", profile.department)}
        ${field("contact", "Contact name", profile.contact)}
        ${field("title", "Title", profile.title)}
        ${field("email", "Email", profile.email, "email")}
        ${field("phone", "Phone", profile.phone)}
        ${field("uei", "Unique Entity ID", profile.uei)}
        ${field("ein", "EIN", profile.ein)}
        ${field("sam", "SAM.gov status", profile.sam)}
        <div class="actions"><button class="btn-gold" type="submit">Save</button></div>
      </form>
    </section>
    <section class="panel">
      <h2>Move the drafts</h2>
      <p>Export keeps a copy of this browser's drafts. Import brings that file back.</p>
      <div class="actions">
        <button class="btn" data-export>Export JSON</button>
        <label class="btn">Import JSON<input id="import-file" type="file" accept="application/json" hidden></label>
      </div>
    </section>
  `;
}

function listText() {
  const lines = state.catalog.grants.map((grant) => `${grant.name}\n${LEVEL_LABEL[grant.level]} · ${grant.funder}\n${grant.deadlineLabel}\n${grant.summary}`);
  return `Bedford County\nCounty grant list\n\n${lines.join("\n\n")}`;
}

function grantText(grant) {
  return `${grant.name}\n${grant.funder}\n\n${grant.summary}\n\nTiming: ${grant.deadlineLabel}\nAmount: ${grant.amountLabel}\nMatch: ${grant.matchLabel}\n\n${grant.rules.join("\n")}`;
}

function packetText(item) {
  const grant = grantById(item.grantId);
  const head = `${grant?.name || "Draft"}\nBedford County Government\n`;
  return head + item.sections.map((section) => `${section.title}\n${section.text}`).join("\n\n");
}

async function shareContent(title, text, button) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }
  const link = document.createElement("a");
  link.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}`;
  link.click();
  if (button) button.textContent = "Email opened";
}

function copyText(text) {
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text);
}

function saveAnswer(item, qid, value) {
  item.answers[qid] = String(value || "").trim();
  item.step = (item.step || 0) + 1;
  item.sections = [];
  item.updatedAt = new Date().toISOString();
  saveApps();
  render();
}

function render() {
  const root = document.getElementById("app");
  if (!state.catalog) {
    root.innerHTML = shell(`<section class="panel"><p>${esc(state.error || "Loading the grant list.")}</p></section>`);
    return;
  }
  const hash = location.hash || "#/";
  const parts = hash.split("/").filter(Boolean);
  let main = "";
  if (parts[0] === "grant" && parts[1]) main = renderGrant(parts[1]);
  else if (parts[0] === "apply" && parts[1] && parts[2]) main = renderWizard(parts[1], parts[2]);
  else if (parts[0] === "apply" && parts[1]) {
    startApplication(parts[1]);
    return;
  } else if (parts[0] === "apply") main = renderApplyPicker();
  else if (parts[0] === "packet" && parts[1]) main = renderPacket(parts[1]);
  else if (parts[0] === "packets") main = renderPackets();
  else if (parts[0] === "agency") main = renderAgency();
  else main = renderHome();
  root.innerHTML = shell(main);
}

function onClick(event) {
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
  const back = event.target.closest("[data-back]");
  if (back) {
    const item = appById(back.getAttribute("data-back"));
    item.step = Math.max(0, (item.step === "packet" ? questionIds(grantById(item.grantId)).length : item.step) - 1);
    item.sections = [];
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
    if (kind === "list") shareContent("Bedford County grant list", listText(), share);
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

document.getElementById("app").addEventListener("click", (event) => {
  if (event.target.closest("[data-export]")) {
    const blob = new Blob([JSON.stringify({ profile: state.profile, apps: state.apps }, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "county-grants.json";
    link.click();
    URL.revokeObjectURL(link.href);
    return;
  }
  onClick(event);
});

document.getElementById("app").addEventListener("submit", (event) => {
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
    ["department", "contact", "title", "email", "phone", "uei", "ein", "sam"].forEach((key) => {
      state.profile[key] = String(data.get(key) || "").trim();
    });
    saveProfile();
    event.target.querySelector("button").textContent = "Saved";
  }
});

document.getElementById("app").addEventListener("change", (event) => {
  if (event.target.id !== "import-file") return;
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const data = JSON.parse(String(reader.result));
    if (data.profile) state.profile = { ...DEFAULT_PROFILE, ...data.profile };
    if (Array.isArray(data.apps)) state.apps = data.apps;
    saveProfile();
    saveApps();
    render();
  };
  reader.readAsText(file);
});

window.addEventListener("hashchange", render);

fetch("grants.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error("Grant list unavailable");
    return response.json();
  })
  .then((catalog) => {
    state.catalog = catalog;
    render();
  })
  .catch((error) => {
    state.error = error.message;
    render();
  });
