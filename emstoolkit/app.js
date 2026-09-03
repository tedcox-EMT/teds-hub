(function () {
  const app = document.getElementById("app");

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, """);
  }

  function route() {
    const raw = (location.hash || "#/").replace(/^#/, "");
    const [path, query] = raw.split("?");
    const parts = path.split("/").filter(Boolean);
    const params = new URLSearchParams(query || "");
    return { parts, q: params.get("q") || "" };
  }

  function setNav(name) {
    document.querySelectorAll("nav a").forEach((a) => {
      a.classList.toggle("on", a.dataset.nav === name);
    });
  }

  function home() {
    setNav("");
    return `<main>
      <section class="hero">
        <div class="bar"></div>
        <div class="pad">
          <h1>Tennessee EMS rules and forms</h1>
          <p class="muted">A working copy of 1200-12, state forms, and regional contacts for service directors.</p>
          <form class="searchbox" id="go">
            <input type="search" id="q" placeholder="Board meetings, required reports…" autocomplete="off">
            <button type="submit">Search</button>
          </form>
        </div>
      </section>
      <div class="grid">
        <a class="tile" href="#/search"><strong>Search</strong><div class="muted">Type a topic. Matching sections and lookups show up immediately.</div></a>
        <a class="tile" href="#/rules"><strong>Rules</strong><div class="muted">All ${RULES.length} sections of 1200-12, with the official chapter PDFs.</div></a>
        <a class="tile" href="#/forms"><strong>Forms</strong><div class="muted">PH-3939, inspections, renewals, and the other state applications.</div></a>
        <a class="tile" href="#/office"><strong>Office</strong><div class="muted">Consultants, Board roster, protocols, and the Nashville numbers.</div></a>
      </div>
      <h2>Lookups</h2>
      <div class="list">
        ${SCENARIOS.map((s) => `<a class="tile" href="#/lookups/${esc(s.id)}"><strong>${esc(s.title)}</strong><div class="muted">${esc(s.short)}</div></a>`).join("")}
      </div>
    </main>`;
  }

  function searchPage(q) {
    setNav("search");
    const rules = q ? searchRules(q) : RULES.slice(0, 8);
    const forms = q
      ? FORMS.filter((f) => matchesHay(`${f.name} ${f.number} ${f.group}`, q))
      : [];
    const lookups = q
      ? SCENARIOS.filter((s) => matchesHay(`${s.title} ${s.question} ${s.short} ${s.phrases} ${s.steps.join(" ")}`, q))
      : SCENARIOS.slice(0, 4);
    const regions = q
      ? REGIONS.filter((r) => matchesHay(`${r.name} ${r.consultant} ${r.email} ${r.address}`, q))
      : [];
    return `<main>
      <h1>Search</h1>
      <form class="searchbox" id="go">
        <input type="search" id="q" value="${esc(q)}" placeholder="Staffing, spare truck, destination…" autocomplete="off">
        <button type="submit">Search</button>
      </form>
      ${lookups.length ? `<h2>Lookups</h2><div class="list">${lookups.map((s) => `<a class="tile" href="#/lookups/${esc(s.id)}"><strong>${esc(s.title)}</strong><div class="muted">${esc(s.short)}</div></a>`).join("")}</div>` : ""}
      ${forms.length ? `<h2>Forms</h2><div class="list">${forms.map((f) => `<a class="row" href="${esc(f.href)}" target="_blank" rel="noreferrer"><span>${esc(f.name)}</span><small>${esc(f.number)}</small></a>`).join("")}</div>` : ""}
      ${regions.length ? `<h2>Office</h2><div class="list">${regions.map((r) => `<div class="tile"><strong>${esc(r.name)}</strong><div>${esc(r.consultant)}</div><div class="muted">${esc(r.phone)} · ${esc(r.email)}</div></div>`).join("")}</div>` : ""}
      <h2>Rules${q ? ` · ${rules.length}` : ""}</h2>
      <div class="list">
        ${rules.map((r) => `<a class="tile" href="#/rules/${esc(r.id)}"><div class="cite">${esc(r.citation)}</div><strong>${esc(r.title)}</strong><div class="muted">${esc(r.summary)}</div></a>`).join("") || `<p class="muted">No matching sections.</p>`}
      </div>
    </main>`;
  }

  function rulesPage() {
    setNav("rules");
    return `<main>
      <h1>Rules</h1>
      <p class="muted">All ${RULES.length} sections. Open the official chapter PDF to cite.</p>
      ${CHAPTERS.map((ch) => {
        const items = RULES.filter((r) => r.chapter === ch.id);
        return `<h2>${esc(ch.id)} · ${esc(ch.title)}</h2>
          <p class="muted"><a href="${esc(ch.officialPdf)}" target="_blank" rel="noreferrer">Official PDF</a> · updated ${esc(ch.updated)}</p>
          <div class="list">${items.map((r) => `<a class="tile" href="#/rules/${esc(r.id)}"><div class="cite">${esc(r.citation)}</div><strong>${esc(r.title)}</strong><div class="muted">${esc(r.summary)}</div></a>`).join("")}</div>`;
      }).join("")}
    </main>`;
  }

  function rulePage(id) {
    setNav("rules");
    const r = getRule(id);
    if (!r) return `<main><h1>Not found</h1></main>`;
    return `<main>
      <p class="cite">${esc(r.citation)}</p>
      <h1>${esc(r.title)}</h1>
      <p class="muted">${esc(r.chapter)} · ${esc(r.chapterTitle)}</p>
      <p>${esc(r.summary)}</p>
      <ul class="steps">${r.digest.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
      ${r.watchFor.length ? `<h2>Watch for</h2><ul class="steps">${r.watchFor.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>` : ""}
      <p><a class="btn" href="${esc(r.sourceUrl)}" target="_blank" rel="noreferrer">Official PDF</a></p>
    </main>`;
  }

  function formsPage(q) {
    setNav("forms");
    const list = q ? FORMS.filter((f) => matchesHay(`${f.name} ${f.number} ${f.group}`, q)) : FORMS;
    const groups = [...new Set(list.map((f) => f.group))];
    return `<main>
      <h1>Forms</h1>
      <p class="muted">State EMS applications, fleet notices, inspections, and personnel affidavits.</p>
      <form class="searchbox" id="go">
        <input type="search" id="q" value="${esc(q)}" placeholder="Fleet, renewal, inspection…">
      </form>
      ${groups.map((g) => `<h2>${esc(g)}</h2><div class="list">${list.filter((f) => f.group === g).map((f) => `<a class="row" href="${esc(f.href)}" target="_blank" rel="noreferrer"><span>${esc(f.name)}</span><small>${esc(f.number)}</small></a>`).join("")}</div>`).join("")}
    </main>`;
  }

  function officePage() {
    setNav("office");
    return `<main>
      <h1>Office</h1>
      <p class="muted">${esc(BOARD_NOTE)}</p>
      <div class="tile">
        <strong>${esc(OFFICE.name)}</strong>
        <div>${esc(OFFICE.address)}</div>
        <div>${esc(OFFICE.phone)} · toll-free ${esc(OFFICE.tollFree)}</div>
        <div><a href="mailto:${esc(OFFICE.email)}">${esc(OFFICE.email)}</a></div>
        <div>Director: ${esc(DIRECTOR.name)} · ${esc(DIRECTOR.phone)}</div>
        <div>Medical director: ${esc(OFFICE.medicalDirector)}</div>
      </div>
      <h2>Consultants</h2>
      <div class="list">${REGIONS.map((r) => `<div class="tile"><strong>${esc(r.name)}</strong><div>${esc(r.consultant)}</div><div class="muted">${esc(r.phone)} · <a href="mailto:${esc(r.email)}">${esc(r.email)}</a></div><div class="muted">${esc(r.address)}</div></div>`).join("")}</div>
      <h2>Board</h2>
      <div class="list">${BOARD_MEMBERS.map((m) => `<div class="tile"><strong>${esc(m.name)}</strong><div class="muted">${esc(m.role)} · ${esc(m.seat)} · ${esc(m.term)}</div></div>`).join("")}</div>
      <p><a href="${esc(BOARD_CALENDAR)}" target="_blank" rel="noreferrer">Board calendar</a></p>
      <h2>Protocols</h2>
      <div class="list">${PROTOCOLS.map((p) => `<a class="row" href="${esc(p.href)}" target="_blank" rel="noreferrer">${esc(p.label)}</a>`).join("")}</div>
      <h2>Links</h2>
      <div class="list">${LINKS.map((p) => `<a class="row" href="${esc(p.href)}" target="_blank" rel="noreferrer">${esc(p.label)}</a>`).join("")}</div>
    </main>`;
  }

  function lookupPage(id) {
    setNav("search");
    const s = SCENARIOS.find((x) => x.id === id);
    if (!s) return `<main><h1>Not found</h1></main>`;
    return `<main>
      <h1>${esc(s.title)}</h1>
      <p>${esc(s.short)}</p>
      <ol class="steps">${s.steps.map((d) => `<li>${d.replace(/</g, "<")}</li>`).join("")}</ol>
      <p class="cite">${s.citations.map(esc).join(" · ")}</p>
    </main>`;
  }

  function render() {
    const { parts, q } = route();
    const page = parts[0] || "";
    if (!page) app.innerHTML = home();
    else if (page === "search") app.innerHTML = searchPage(q);
    else if (page === "rules" && parts[1]) app.innerHTML = rulePage(parts[1]);
    else if (page === "rules") app.innerHTML = rulesPage();
    else if (page === "forms") app.innerHTML = formsPage(q);
    else if (page === "office") app.innerHTML = officePage();
    else if (page === "lookups") app.innerHTML = lookupPage(parts[1]);
    else app.innerHTML = home();

    const form = document.getElementById("go");
    const input = document.getElementById("q");
    if (form && input) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const next = input.value.trim();
        location.hash = next ? `#/search?q=${encodeURIComponent(next)}` : "#/search";
      });
      input.addEventListener("input", () => {
        const next = input.value.trim();
        const dest = parts[0] === "forms" ? "forms" : "search";
        history.replaceState(null, "", next ? `#/${dest}?q=${encodeURIComponent(next)}` : `#/${dest}`);
        if (dest === "search") app.innerHTML = searchPage(next);
        else app.innerHTML = formsPage(next);
        const again = document.getElementById("q");
        if (again) {
          again.focus();
          again.setSelectionRange(again.value.length, again.value.length);
          again.addEventListener("input", input.oninput);
          document.getElementById("go")?.addEventListener("submit", form.onsubmit);
        }
      });
    }
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", render);
  render();
})();
