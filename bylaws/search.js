(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.BylawSearch = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  var STOP = {
    a: 1, an: 1, the: 1, of: 1, to: 1, for: 1, in: 1, on: 1, at: 1, by: 1,
    and: 1, or: 1, is: 1, are: 1, was: 1, be: 1, do: 1, does: 1, did: 1,
    how: 1, what: 1, when: 1, where: 1, who: 1, which: 1, can: 1, i: 1,
    we: 1, my: 1, our: 1, me: 1, you: 1, it: 1, if: 1, with: 1, from: 1,
    this: 1, that: 1, these: 1, those: 1, about: 1, into: 1, than: 1
  };

  var SYNONYMS = {
    meet: ["meeting", "session", "convene", "schedule", "second tuesday"],
    meeting: ["meet", "session", "convene", "schedule"],
    weather: ["snow", "ice", "inclement", "postpone", "cancel", "closed"],
    snow: ["weather", "inclement", "postpone"],
    holiday: ["legal holiday", "postpone"],
    quorum: ["majority present", "enough members", "how many needed"],
    speak: ["public comment", "address", "floor", "talk", "comments"],
    comment: ["public comment", "speak", "sign up", "3 minutes"],
    citizen: ["public comment", "speak"],
    agenda: ["order of business", "add item", "twelve days", "packet"],
    conflict: ["conflict of interest", "cannot vote", "spouse", "direct interest"],
    spouse: ["conflict of interest", "county employee", "pay", "benefits"],
    vote: ["roll call", "majority", "voice vote", "pass"],
    votes: ["majority of membership", "roll call"],
    reconsider: ["bring back", "prevailing side", "two thirds"],
    suspend: ["suspend the rules", "amend", "two thirds"],
    parliamentarian: ["county attorney", "robert's rules"],
    robert: ["robert's rules", "parliamentarian"],
    chair: ["chairperson", "presiding", "pro tempore"],
    chairperson: ["chair", "presiding"],
    committee: ["standing committee", "rules", "finance", "public safety", "courthouse"],
    ems: ["emergency medical services", "finance management", "ambulance"],
    ambulance: ["ems", "finance"],
    sheriff: ["public safety", "jail", "workhouse"],
    jail: ["sheriff", "public safety"],
    beer: ["beer board"],
    ethics: ["ethics committee", "code of ethics", "conflict of interest"],
    zoning: ["zoning appeals", "planning", "bza"],
    bridge: ["naming bridges", "road dedication", "highway superintendent"],
    road: ["naming", "highway superintendent", "dedication"],
    special: ["special called", "petition", "mayor"],
    pay: ["compensation", "salary", "stipend"],
    salary: ["compensation", "pay"],
    minutes: ["county clerk", "compile"],
    attorney: ["county attorney", "parliamentarian", "legal"],
    vacancy: ["death", "resignation", "replacement"],
    resign: ["vacancy", "death", "replacement"],
    nominate: ["nominations", "election", "floor"],
    broadcast: ["radio", "television", "tv", "press"],
    press: ["media", "reporters", "newspaper"],
    packet: ["ten days", "agenda mailed"],
    finance: ["budget", "ems", "solid waste", "human resources"],
    "911": ["emergency communications", "courthouse"],
    fire: ["courthouse and property", "911"],
    mayor: ["ex officio", "appointment", "confirmation"]
  };

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9+]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function stem(word) {
    if (word.length <= 3) return word;
    if (word.endsWith("ies") && word.length > 4) return word.slice(0, -3) + "y";
    if (word.endsWith("ing") && word.length > 5) return word.slice(0, -3);
    if (word.endsWith("ers") && word.length > 5) return word.slice(0, -1);
    if (word.endsWith("ed") && word.length > 4) return word.slice(0, -2);
    if (word.endsWith("es") && word.length > 4) return word.slice(0, -2);
    if (word.endsWith("s") && word.length > 3 && !word.endsWith("ss")) return word.slice(0, -1);
    return word;
  }

  function tokens(text) {
    return normalize(text)
      .split(" ")
      .filter(function (w) {
        return w && !STOP[w] && w.length > 1;
      })
      .map(stem);
  }

  var INTENTS = [
    { id: "i-a", tests: [/when (do|does).*(meet|meeting)/, /second tuesday/, /\bsnow\b/, /inclement/, /holiday meeting/, /meeting date/, /meeting day/] },
    { id: "i-b", tests: [/quorum/, /how many.*(need|present|there)/] },
    { id: "i-y", tests: [/public comment/, /speak at (a |the )?(meeting|commission)/, /how (do i|can i) speak/, /\b3 minutes\b/, /three minutes/, /sign up.*(speak|comment)/] },
    { id: "i-n", tests: [/conflict of interest/, /spouse/, /cannot vote/, /can't vote/, /county employee/] },
    { id: "i-t", tests: [/get on the agenda/, /add (an )?item/, /twelve days/, /\b12 days\b/, /two commissioners/] },
    { id: "vi-m", tests: [/\bems\b/, /ambulance/, /who reports/, /which committee.*(ems|sheriff|jail|fire|911)/, /\bjail\b/, /animal control/] },
    { id: "ix-d", tests: [/name.*(bridge|road|building)/, /naming.*(bridge|road)/, /road dedication/] },
    { id: "i-x", tests: [/special (called )?meeting/] },
    { id: "i-u", tests: [/parliamentarian/] },
    { id: "i-v", tests: [/robert'?s rules/] },
    { id: "i-o", tests: [/change (my )?vote/] },
    { id: "viii-b3", tests: [/beer board/] },
    { id: "viii-b6", tests: [/ethics committee/] },
    { id: "ii-a", tests: [/who starts/, /call to order/] },
    { id: "ii-g", tests: [/ten day/, /\b10 day/, /agenda packet/] }
  ];

  function expand(queryTokens) {
    var original = {};
    queryTokens.forEach(function (t) { original[t] = true; });
    var extra = {};
    queryTokens.forEach(function (t) {
      var extras = SYNONYMS[t] || [];
      extras.forEach(function (phrase) {
        tokens(phrase).forEach(function (w) {
          if (!original[w]) extra[w] = true;
        });
      });
    });
    return { original: original, extra: Object.keys(extra) };
  }

  function countHits(haystack, needleTokens) {
    var hits = 0;
    needleTokens.forEach(function (t) {
      if (!t) return;
      if (haystack.indexOf(" " + t + " ") !== -1) hits += 1;
    });
    return hits;
  }

  function intentIds(raw) {
    var q = raw.toLowerCase();
    var ids = {};
    INTENTS.forEach(function (intent) {
      intent.tests.forEach(function (re) {
        if (re.test(q)) ids[intent.id] = true;
      });
    });
    return ids;
  }

  function indexSection(section) {
    var blob = [
      section.citation,
      section.title,
      section.plainTalk,
      section.keywords.join(" "),
      section.official,
      section.ruleTitle,
      "rule " + section.rule,
      section.section ? "section " + section.section : ""
    ].join(" ");
    return {
      section: section,
      norm: " " + tokens(blob).join(" ") + " ",
      titleNorm: " " + tokens(section.title + " " + section.citation).join(" ") + " ",
      plainNorm: " " + tokens(section.plainTalk).join(" ") + " ",
      keywordNorm: " " + tokens(section.keywords.join(" ")).join(" ") + " "
    };
  }

  function buildIndex(data) {
    return data.sections.map(indexSection);
  }

  function search(query, index) {
    var raw = String(query || "").trim();
    if (!raw) return [];

    var qTokens = tokens(raw);
    var expanded = expand(qTokens);
    var normQuery = normalize(raw);
    var intents = intentIds(raw);
    var results = [];

    index.forEach(function (entry) {
      var score = 0;
      var titleHits = countHits(entry.titleNorm, qTokens);
      var keywordHits = countHits(entry.keywordNorm, qTokens);
      var plainHits = countHits(entry.plainNorm, qTokens);
      var bodyHits = countHits(entry.norm, qTokens);
      var extraKeywordHits = countHits(entry.keywordNorm, expanded.extra);
      var extraPlainHits = countHits(entry.plainNorm, expanded.extra);

      score += titleHits * 16;
      score += keywordHits * 14;
      score += plainHits * 10;
      score += bodyHits * 3;
      score += extraKeywordHits * 4;
      score += extraPlainHits * 2;

      if (intents[entry.section.id]) score += 80;

      if (normQuery && normalize(entry.section.title).indexOf(normQuery) !== -1) score += 25;
      if (normQuery && normalize(entry.section.keywords.join(" ")).indexOf(normQuery) !== -1) score += 30;
      if (normQuery && normalize(entry.section.plainTalk).indexOf(normQuery) !== -1) score += 14;
      if (normQuery && normalize(entry.section.official).indexOf(normQuery) !== -1) score += 8;
      if (normQuery && normalize(entry.section.citation).indexOf(normQuery) !== -1) score += 18;

      if (score > 0) {
        results.push({
          section: entry.section,
          score: score,
          titleHits: titleHits,
          keywordHits: keywordHits
        });
      }
    });

    results.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.section.citation.localeCompare(b.section.citation);
    });

    return results;
  }

  function highlight(text, query) {
    var words = tokens(query).filter(function (w) {
      return w.length > 2;
    });
    if (!words.length) return escapeHtml(text);
    var source = escapeHtml(text);
    words.sort(function (a, b) {
      return b.length - a.length;
    });
    words.forEach(function (w) {
      var re = new RegExp("(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\w*)", "gi");
      source = source.replace(re, "<mark>$1</mark>");
    });
    return source;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  return {
    tokens: tokens,
    buildIndex: buildIndex,
    search: search,
    highlight: highlight,
    escapeHtml: escapeHtml,
    normalize: normalize
  };
});
