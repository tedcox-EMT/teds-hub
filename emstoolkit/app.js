(function () {
  var app = document.getElementById("app");
  if (!app) return;

  var RULES = window.RULES || [];
  var SCENARIOS = window.SCENARIOS || [];
  var FORMS = window.FORMS || [];
  var REGIONS = window.REGIONS || [];
  var CHAPTERS = window.CHAPTERS || [];
  var OFFICE = window.OFFICE || {};
  var DIRECTOR = window.DIRECTOR || {};
  var BOARD_MEMBERS = window.BOARD_MEMBERS || [];
  var BOARD_CALENDAR = window.BOARD_CALENDAR || "";
  var BOARD_NOTE = window.BOARD_NOTE || "";
  var PROTOCOLS = window.PROTOCOLS || [];
  var LINKS = window.LINKS || [];
  var getRule = window.getRule || function () { return null; };
  var searchRules = window.searchRules || function () { return RULES; };
  var matchesHay = window.matchesHay || function () { return false; };

  function esc(s) {
    var t = String(s == null ? "" : s);
    t = t.split("&").join(String.fromCharCode(38) + "amp;");
    t = t.split("<").join(String.fromCharCode(38) + "lt;");
    t = t.split(">").join(String.fromCharCode(38) + "gt;");
    t = t.split('"').join(String.fromCharCode(38) + "quot;");
    return t;
  }

  function route() {
    var raw = (location.hash || "#/").replace(/^#/, "");
    var bits = raw.split("?");
    var parts = bits[0].split("/").filter(Boolean);
    var params = new URLSearchParams(bits[1] || "");
    return { parts: parts, q: params.get("q") || "" };
  }

  function setNav(name) {
    var links = document.querySelectorAll("nav a");
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute("data-nav") === name) links[i].classList.add("on");
      else links[i].classList.remove("on");
    }
  }

  function searchPage(q) {
    setNav("search");
    var rules = q ? searchRules(q) : RULES.slice(0, 8);
    var forms = q ? FORMS.filter(function (f) { return matchesHay(f.name + " " + f.number + " " + f.group, q); }) : [];
    var lookups = q
      ? SCENARIOS.filter(function (s) { return matchesHay([s.title, s.question, s.short, s.phrases].concat(s.steps).join(" "), q); })
      : SCENARIOS.slice(0, 4);
    var regions = q ? REGIONS.filter(function (r) { return matchesHay(r.name + " " + r.consultant + " " + r.email, q); }) : [];
    var html = "<main><h1>Search</h1><form class=\"searchbox\" id=\"go\"><input type=\"search\" id=\"q\" value=\"" + esc(q) + "\" placeholder=\"Staffing, spare truck, destination...\" autocomplete=\"off\"><button type=\"submit\">Search</button></form>";
    if (lookups.length) {
      html += "<h2>Lookups</h2><div class=\"list\">";
      lookups.forEach(function (s) {
        html += "<a class=\"tile\" href=\"#/lookups/" + esc(s.id) + "\"><strong>" + esc(s.title) + "</strong><div class=\"muted\">" + esc(s.short) + "</div></a>";
      });
      html += "</div>";
    }
    if (forms.length) {
      html += "<h2>Forms</h2><div class=\"list\">";
      forms.forEach(function (f) {
        html += "<a class=\"row\" href=\"" + esc(f.href) + "\" target=\"_blank\" rel=\"noreferrer\"><span>" + esc(f.name) + "</span><small>" + esc(f.number) + "</small></a>";
      });
      html += "</div>";
    }
    if (regions.length) {
      html += "<h2>Office</h2><div class=\"list\">";
      regions.forEach(function (r) {
        html += "<div class=\"tile\"><strong>" + esc(r.name) + "</strong><div>" + esc(r.consultant) + "</div><div class=\"muted\">" + esc(r.phone) + "</div></div>";
      });
      html += "</div>";
    }
    html += "<h2>Rules" + (q ? " · " + rules.length : "") + "</h2><div class=\"list\">";
    if (!rules.length) html += "<p class=\"muted\">No matching sections.</p>";
    rules.forEach(function (r) {
      html += "<a class=\"tile\" href=\"#/rules/" + esc(r.id) + "\"><div class=\"cite\">" + esc(r.citation) + "</div><strong>" + esc(r.title) + "</strong><div class=\"muted\">" + esc(r.summary) + "</div></a>";
    });
    html += "</div></main>";
    return html;
  }

  function rulesPage() {
    setNav("rules");
    var html = "<main><h1>Rules</h1><p class=\"muted\">All " + RULES.length + " sections. Open the official chapter PDF to cite.</p>";
    CHAPTERS.forEach(function (ch) {
      var items = RULES.filter(function (r) { return r.chapter === ch.id; });
      html += "<h2>" + esc(ch.id) + " · " + esc(ch.title) + "</h2>";
      html += "<p class=\"muted\"><a href=\"" + esc(ch.officialPdf) + "\" target=\"_blank\" rel=\"noreferrer\">Official PDF</a> · updated " + esc(ch.updated) + "</p><div class=\"list\">";
      items.forEach(function (r) {
        html += "<a class=\"tile\" href=\"#/rules/" + esc(r.id) + "\"><div class=\"cite\">" + esc(r.citation) + "</div><strong>" + esc(r.title) + "</strong><div class=\"muted\">" + esc(r.summary) + "</div></a>";
      });
      html += "</div>";
    });
    return html + "</main>";
  }

  function rulePage(id) {
    setNav("rules");
    var r = getRule(id);
    if (!r) return "<main><h1>Not found</h1></main>";
    var html = "<main><p class=\"cite\">" + esc(r.citation) + "</p><h1>" + esc(r.title) + "</h1><p class=\"muted\">" + esc(r.chapter) + " · " + esc(r.chapterTitle) + "</p><p>" + esc(r.summary) + "</p><ul class=\"steps\">";
    (r.digest || []).forEach(function (d) { html += "<li>" + esc(d) + "</li>"; });
    html += "</ul>";
    if (r.watchFor && r.watchFor.length) {
      html += "<h2>Watch for</h2><ul class=\"steps\">";
      r.watchFor.forEach(function (d) { html += "<li>" + esc(d) + "</li>"; });
      html += "</ul>";
    }
    html += "<p><a class=\"btn\" href=\"" + esc(r.sourceUrl) + "\" target=\"_blank\" rel=\"noreferrer\">Official PDF</a></p></main>";
    return html;
  }

  function formsPage(q) {
    setNav("forms");
    var list = q ? FORMS.filter(function (f) { return matchesHay(f.name + " " + f.number + " " + f.group, q); }) : FORMS;
    var groups = [];
    list.forEach(function (f) { if (groups.indexOf(f.group) === -1) groups.push(f.group); });
    var html = "<main><h1>Forms</h1><p class=\"muted\">State EMS applications, fleet notices, inspections, and personnel affidavits.</p>";
    html += "<form class=\"searchbox\" id=\"go\"><input type=\"search\" id=\"q\" value=\"" + esc(q) + "\" placeholder=\"Fleet, renewal, inspection...\"></form>";
    groups.forEach(function (g) {
      html += "<h2>" + esc(g) + "</h2><div class=\"list\">";
      list.forEach(function (f) {
        if (f.group !== g) return;
        html += "<a class=\"row\" href=\"" + esc(f.href) + "\" target=\"_blank\" rel=\"noreferrer\"><span>" + esc(f.name) + "</span><small>" + esc(f.number) + "</small></a>";
      });
      html += "</div>";
    });
    return html + "</main>";
  }

  function officePage() {
    setNav("office");
    var html = "<main><h1>Office</h1><p class=\"muted\">" + esc(BOARD_NOTE) + "</p>";
    html += "<div class=\"tile\"><strong>" + esc(OFFICE.name) + "</strong><div>" + esc(OFFICE.address) + "</div><div>" + esc(OFFICE.phone) + " · toll-free " + esc(OFFICE.tollFree) + "</div>";
    html += "<div><a href=\"mailto:" + esc(OFFICE.email) + "\">" + esc(OFFICE.email) + "</a></div>";
    html += "<div>Director: " + esc(DIRECTOR.name) + " · " + esc(DIRECTOR.phone) + "</div>";
    html += "<div>Medical director: " + esc(OFFICE.medicalDirector) + "</div></div>";
    html += "<h2>Consultants</h2><div class=\"list\">";
    REGIONS.forEach(function (r) {
      html += "<div class=\"tile\"><strong>" + esc(r.name) + "</strong><div>" + esc(r.consultant) + "</div><div class=\"muted\">" + esc(r.phone) + " · <a href=\"mailto:" + esc(r.email) + "\">" + esc(r.email) + "</a></div><div class=\"muted\">" + esc(r.address) + "</div></div>";
    });
    html += "</div><h2>Board</h2><div class=\"list\">";
    BOARD_MEMBERS.forEach(function (m) {
      html += "<div class=\"tile\"><strong>" + esc(m.name) + "</strong><div class=\"muted\">" + esc(m.role) + " · " + esc(m.seat) + " · " + esc(m.term) + "</div></div>";
    });
    html += "</div><p><a href=\"" + esc(BOARD_CALENDAR) + "\" target=\"_blank\" rel=\"noreferrer\">Board calendar</a></p>";
    html += "<h2>Protocols</h2><div class=\"list\">";
    PROTOCOLS.forEach(function (p) {
      html += "<a class=\"row\" href=\"" + esc(p.href) + "\" target=\"_blank\" rel=\"noreferrer\">" + esc(p.label) + "</a>";
    });
    html += "</div><h2>Links</h2><div class=\"list\">";
    LINKS.forEach(function (p) {
      html += "<a class=\"row\" href=\"" + esc(p.href) + "\" target=\"_blank\" rel=\"noreferrer\">" + esc(p.label) + "</a>";
    });
    html += "</div></main>";
    return html;
  }

  function lookupPage(id) {
    setNav("search");
    var s = null;
    for (var i = 0; i < SCENARIOS.length; i++) if (SCENARIOS[i].id === id) s = SCENARIOS[i];
    if (!s) return "<main><h1>Not found</h1></main>";
    var html = "<main><h1>" + esc(s.title) + "</h1><p>" + esc(s.short) + "</p><ol class=\"steps\">";
    s.steps.forEach(function (d) { html += "<li>" + esc(d) + "</li>"; });
    html += "</ol><p class=\"cite\">" + s.citations.map(esc).join(" · ") + "</p></main>";
    return html;
  }

  function bindSearch() {
    var form = document.getElementById("go");
    var input = document.getElementById("q");
    if (!form || !input) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var next = input.value.trim();
      location.hash = next ? "#/search?q=" + encodeURIComponent(next) : "#/search";
    });
  }

  function render() {
    try {
      var info = route();
      var page = info.parts[0] || "";
      if (page === "search") app.innerHTML = searchPage(info.q);
      else if (page === "rules" && info.parts[1]) app.innerHTML = rulePage(info.parts[1]);
      else if (page === "rules") app.innerHTML = rulesPage();
      else if (page === "forms") app.innerHTML = formsPage(info.q);
      else if (page === "office") app.innerHTML = officePage();
      else if (page === "lookups") app.innerHTML = lookupPage(info.parts[1]);
      bindSearch();
    } catch (err) {
      console.error(err);
    }
  }

  window.addEventListener("hashchange", render);
  render();
})();
