(function () {
  var data = window.BYLAWS;
  var searchApi = window.BylawSearch;
  var index = searchApi.buildIndex(data);

  var input = document.getElementById("q");
  var resultsEl = document.getElementById("results");
  var statusEl = document.getElementById("status");
  var navEl = document.getElementById("nav");
  var form = document.getElementById("search-form");
  var browseFold = document.getElementById("browse-fold");

  function isNarrow() {
    return window.matchMedia("(max-width: 820px)").matches;
  }

  function syncBrowseFold() {
    if (!browseFold) return;
    browseFold.open = !isNarrow();
  }

  function scrollToResults() {
    if (!isNarrow()) return;
    var target = document.querySelector(".results-card");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  var EXAMPLES = [
    "When does the Commission meet?",
    "How do I speak at a meeting?",
    "Conflict of interest if my spouse works for the county",
    "How does an item get on the agenda?",
    "Which committee does EMS report to?",
    "What is a quorum?",
    "Snow day or holiday meeting",
    "Naming a county bridge"
  ];

  function groupByRule(sections) {
    var groups = [];
    var map = {};
    sections.forEach(function (s) {
      var key = s.rule + ":" + s.ruleTitle;
      if (!map[key]) {
        map[key] = { rule: s.rule, title: s.ruleTitle, items: [] };
        groups.push(map[key]);
      }
      map[key].items.push(s);
    });
    return groups;
  }

  function renderNav() {
    var groups = groupByRule(data.sections);
    navEl.innerHTML = groups.map(function (g) {
      return (
        '<div class="nav-group" data-rule="' + searchApi.escapeHtml(g.rule) + '">' +
          "<button type=\"button\">Rule " + searchApi.escapeHtml(g.rule) + " · " + searchApi.escapeHtml(g.title) + "</button>" +
          '<div class="nav-items">' +
            g.items.map(function (s) {
              return '<a href="#' + s.id + '">' + searchApi.escapeHtml(s.title) + "</a>";
            }).join("") +
          "</div>" +
        "</div>"
      );
    }).join("");

    var first = navEl.querySelector(".nav-group");
    if (first) first.classList.add("open");

    navEl.querySelectorAll(".nav-group > button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        btn.parentElement.classList.toggle("open");
      });
    });
    navEl.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (isNarrow() && browseFold) browseFold.open = false;
      });
    });
  }

  function renderChips() {
    var el = document.getElementById("chips");
    el.innerHTML = EXAMPLES.map(function (q) {
      return '<button class="chip" type="button" data-q="' + searchApi.escapeHtml(q) + '">' + searchApi.escapeHtml(q) + "</button>";
    }).join("");
    el.querySelectorAll(".chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        input.value = btn.getAttribute("data-q");
        runSearch(true);
        if (isNarrow()) {
          input.blur();
          scrollToResults();
        }
      });
    });
  }

  function cardHtml(section, query, openOfficial) {
    var title = query ? searchApi.highlight(section.title, query) : searchApi.escapeHtml(section.title);
    var plain = query ? searchApi.highlight(section.plainTalk, query) : searchApi.escapeHtml(section.plainTalk);
    var official = query ? searchApi.highlight(section.official, query) : searchApi.escapeHtml(section.official);
    return (
      '<article class="rule-card" id="' + section.id + '">' +
        '<div class="cite">' + searchApi.escapeHtml(section.citation) + " · " + searchApi.escapeHtml(section.ruleTitle) + "</div>" +
        "<h2>" + title + "</h2>" +
        '<div class="plain"><span class="kicker">In plain language</span>' + plain + "</div>" +
        '<details class="official-wrap"' + (openOfficial ? " open" : "") + ">" +
          "<summary>Official bylaw text</summary>" +
          '<div class="official">' + official + "</div>" +
        "</details>" +
      "</article>"
    );
  }

  function showBrowse() {
    statusEl.textContent = "Browse all " + data.sections.length + " bylaw sections. Search above in everyday language.";
    resultsEl.innerHTML = data.sections.map(function (s) {
      return cardHtml(s, "", false);
    }).join("");
    markActive(location.hash.replace("#", ""));
  }

  function runSearch(pushHash) {
    var q = input.value.trim();
    if (!q) {
      if (pushHash) history.replaceState(null, "", location.pathname);
      showBrowse();
      return;
    }
    var hits = searchApi.search(q, index);
    if (!hits.length) {
      statusEl.textContent = 'No matches for "' + q + '". Try a shorter phrase, or pick a suggestion.';
      resultsEl.innerHTML = '<div class="empty">Nothing matched. Try "public comment", "quorum", or "EMS committee".</div>';
      return;
    }
    statusEl.textContent = hits.length + (hits.length === 1 ? " match" : " matches") + ' for "' + q + '". Best match first.';
    resultsEl.innerHTML = hits.map(function (h, i) {
      return cardHtml(h.section, q, i === 0);
    }).join("");
    if (pushHash) {
      history.replaceState(null, "", "#search=" + encodeURIComponent(q));
    }
    resultsEl.querySelector(".rule-card").classList.add("selected");
    if (pushHash) scrollToResults();
  }

  function markActive(id) {
    navEl.querySelectorAll("a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + id);
    });
    if (id) {
      navEl.querySelectorAll(".nav-group").forEach(function (g) {
        if (g.querySelector('a[href="#' + id + '"]')) g.classList.add("open");
      });
    }
  }

  function applyHash() {
    var hash = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    if (hash.indexOf("search=") === 0) {
      input.value = hash.slice(7);
      runSearch(false);
      return;
    }
    if (hash) {
      var section = data.sections.filter(function (s) { return s.id === hash; })[0];
      if (section) {
        input.value = "";
        showBrowse();
        markActive(hash);
        var el = document.getElementById(hash);
        if (el) {
          el.classList.add("selected");
          el.querySelector("details").open = true;
          setTimeout(function () { el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 50);
        }
        return;
      }
    }
    showBrowse();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    input.blur();
    runSearch(true);
    scrollToResults();
  });

  input.addEventListener("input", function () {
    if (!input.value.trim()) showBrowse();
  });

  window.addEventListener("hashchange", applyHash);

  renderNav();
  renderChips();
  syncBrowseFold();
  applyHash();
})();
