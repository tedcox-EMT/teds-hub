(function () {
  function esc(s) {
    var t = String(s == null ? "" : s);
    t = t.split("&").join(String.fromCharCode(38) + "amp;");
    t = t.split("<").join(String.fromCharCode(38) + "lt;");
    t = t.split(">").join(String.fromCharCode(38) + "gt;");
    t = t.split('"').join(String.fromCharCode(38) + "quot;");
    return t;
  }

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

  var file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var params = new URLSearchParams(location.search);
  var q = (params.get("q") || "").trim();
  var box = document.getElementById("results");
  var qInput = document.getElementById("q");
  if (qInput && q) qInput.value = q;

  function ruleCard(r) {
    return '<a class="tile" href="rule.html?id=' + esc(r.id) + '"><div class="cite">' + esc(r.citation) + "</div><strong>" + esc(r.title) + '</strong><div class="muted">' + esc(r.summary) + "</div></a>";
  }

  if (file === "search.html" && box) {
    if (!q) {
      box.innerHTML = '<h2>Lookups</h2><div class="list">' + SCENARIOS.map(function (s) {
        return '<a class="tile" href="lookups.html?id=' + esc(s.id) + '"><strong>' + esc(s.title) + '</strong><div class="muted">' + esc(s.short) + "</div></a>";
      }).join("") + "</div><h2>Rules</h2><div class=\"list\">" + RULES.slice(0, 8).map(ruleCard).join("") + "</div>";
    } else {
      var rules = searchRules(q);
      var forms = FORMS.filter(function (f) { return matchesHay(f.name + " " + f.number + " " + f.group, q); });
      var lookups = SCENARIOS.filter(function (s) { return matchesHay([s.title, s.question, s.short, s.phrases].concat(s.steps).join(" "), q); });
      var html = "";
      if (lookups.length) {
        html += "<h2>Lookups</h2><div class=\"list\">" + lookups.map(function (s) {
          return '<a class="tile" href="lookups.html?id=' + esc(s.id) + '"><strong>' + esc(s.title) + '</strong><div class="muted">' + esc(s.short) + "</div></a>";
        }).join("") + "</div>";
      }
      if (forms.length) {
        html += "<h2>Forms</h2><div class=\"list\">" + forms.map(function (f) {
          return '<a class="row" href="' + esc(f.href) + '" target="_blank" rel="noreferrer"><span>' + esc(f.name) + "</span><small>" + esc(f.number) + "</small></a>";
        }).join("") + "</div>";
      }
      html += "<h2>Rules · " + rules.length + "</h2><div class=\"list\">";
      html += rules.length ? rules.map(ruleCard).join("") : '<p class="muted">No matching sections.</p>';
      html += "</div>";
      box.innerHTML = html;
    }
  }

  if (file === "rules.html" && box) {
    var html = "";
    CHAPTERS.forEach(function (ch) {
      var items = RULES.filter(function (r) { return r.chapter === ch.id; });
      html += "<h2>" + esc(ch.id) + " · " + esc(ch.title) + "</h2>";
      html += '<p class="muted"><a href="' + esc(ch.officialPdf) + '" target="_blank" rel="noreferrer">Official PDF</a> · updated ' + esc(ch.updated) + '</p><div class="list">';
      html += items.map(ruleCard).join("") + "</div>";
    });
    box.innerHTML = html;
  }

  if (file === "rule.html" && box) {
    var r = getRule(params.get("id") || "");
    if (!r) {
      box.innerHTML = "<h1>Not found</h1><p><a href=\"rules.html\">Back to rules</a></p>";
    } else {
      var html = '<p class="cite">' + esc(r.citation) + "</p><h1>" + esc(r.title) + '</h1><p class="muted">' + esc(r.chapter) + " · " + esc(r.chapterTitle) + "</p><p>" + esc(r.summary) + '</p><ul class="steps">';
      (r.digest || []).forEach(function (d) { html += "<li>" + esc(d) + "</li>"; });
      html += "</ul>";
      if (r.watchFor && r.watchFor.length) {
        html += "<h2>Watch for</h2><ul class=\"steps\">";
        r.watchFor.forEach(function (d) { html += "<li>" + esc(d) + "</li>"; });
        html += "</ul>";
      }
      html += '<p><a class="btn" href="' + esc(r.sourceUrl) + '" target="_blank" rel="noreferrer">Official PDF</a></p>';
      box.innerHTML = html;
    }
  }

  if (file === "forms.html" && box) {
    var list = q ? FORMS.filter(function (f) { return matchesHay(f.name + " " + f.number + " " + f.group, q); }) : FORMS;
    var groups = [];
    list.forEach(function (f) { if (groups.indexOf(f.group) === -1) groups.push(f.group); });
    var html = "";
    groups.forEach(function (g) {
      html += "<h2>" + esc(g) + '</h2><div class="list">';
      list.forEach(function (f) {
        if (f.group !== g) return;
        html += '<a class="row" href="' + esc(f.href) + '" target="_blank" rel="noreferrer"><span>' + esc(f.name) + "</span><small>" + esc(f.number) + "</small></a>";
      });
      html += "</div>";
    });
    box.innerHTML = html;
  }

  if (file === "office.html" && box) {
    var html = '<p class="muted">' + esc(BOARD_NOTE) + "</p>";
    html += '<div class="tile"><strong>' + esc(OFFICE.name) + "</strong><div>" + esc(OFFICE.address) + "</div><div>" + esc(OFFICE.phone) + " · toll-free " + esc(OFFICE.tollFree) + "</div>";
    html += '<div><a href="mailto:' + esc(OFFICE.email) + '">' + esc(OFFICE.email) + "</a></div>";
    html += "<div>Director: " + esc(DIRECTOR.name) + " · " + esc(DIRECTOR.phone) + "</div>";
    html += "<div>Medical director: " + esc(OFFICE.medicalDirector) + "</div></div>";
    html += '<h2>Consultants</h2><div class="list">';
    REGIONS.forEach(function (r) {
      html += '<div class="tile"><strong>' + esc(r.name) + "</strong><div>" + esc(r.consultant) + '</div><div class="muted">' + esc(r.phone) + ' · <a href="mailto:' + esc(r.email) + '">' + esc(r.email) + '</a></div><div class="muted">' + esc(r.address) + "</div></div>";
    });
    html += '</div><h2>Board</h2><div class="list">';
    BOARD_MEMBERS.forEach(function (m) {
      html += '<div class="tile"><strong>' + esc(m.name) + '</strong><div class="muted">' + esc(m.role) + " · " + esc(m.seat) + " · " + esc(m.term) + "</div></div>";
    });
    html += '</div><p><a href="' + esc(BOARD_CALENDAR) + '" target="_blank" rel="noreferrer">Board calendar</a></p>';
    html += '<h2>Protocols</h2><div class="list">';
    PROTOCOLS.forEach(function (p) {
      html += '<a class="row" href="' + esc(p.href) + '" target="_blank" rel="noreferrer">' + esc(p.label) + "</a>";
    });
    html += '</div><h2>Links</h2><div class="list">';
    LINKS.forEach(function (p) {
      html += '<a class="row" href="' + esc(p.href) + '" target="_blank" rel="noreferrer">' + esc(p.label) + "</a>";
    });
    html += "</div>";
    box.innerHTML = html;
  }

  if (file === "lookups.html" && box) {
    var id = params.get("id") || "";
    var s = null;
    for (var i = 0; i < SCENARIOS.length; i++) if (SCENARIOS[i].id === id) s = SCENARIOS[i];
    if (!s) {
      box.innerHTML = "<h2>Lookups</h2><div class=\"list\">" + SCENARIOS.map(function (x) {
        return '<a class="tile" href="lookups.html?id=' + esc(x.id) + '"><strong>' + esc(x.title) + '</strong><div class="muted">' + esc(x.short) + "</div></a>";
      }).join("") + "</div>";
    } else {
      var html = "<h1>" + esc(s.title) + "</h1><p>" + esc(s.short) + '</p><ol class="steps">';
      s.steps.forEach(function (d) { html += "<li>" + esc(d) + "</li>"; });
      html += '</ol><p class="cite">' + s.citations.map(esc).join(" · ") + "</p>";
      box.innerHTML = html;
    }
  }
})();
