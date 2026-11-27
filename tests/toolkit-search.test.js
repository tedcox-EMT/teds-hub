global.window = global;

var assert = require("assert");
var path = require("path");
require(path.join(__dirname, "../emstoolkit/data.js"));

function hasId(list, id) {
  return list.some(function (x) { return x.id === id; });
}

function hasName(list, name) {
  return list.some(function (x) { return x.name === name || x.consultant === name; });
}

assert.ok(hasName(window.searchRegions("Bedford"), "Chad Brown"), "Bedford should find South Central / Chad Brown");
assert.ok(hasName(window.searchRegions("Chad Brown"), "Chad Brown"), "Chad Brown should find South Central");
assert.ok(hasName(window.searchRegions("Hansel"), "Hansel Cook"), "Hansel should find Mid-Cumberland");
assert.ok(!hasName(window.searchRegions("Bedford"), "Hansel Cook"), "Bedford should not return Mid-Cumberland");

assert.ok(hasName(window.searchPeople("Britnei"), "Britnei Outland"), "Data manager should be searchable");
assert.ok(hasName(window.searchPeople("TNPAP"), "Tennessee Professional Assistance Program"), "TNPAP should be searchable");
assert.ok(hasName(window.searchPeople("Vince"), "Vince Cuevas"), "Radio analyst should be searchable");

var inventory = window.searchRules("inventory");
assert.ok(hasId(inventory, "01-15"), "inventory should hit 1200-12-01-.15");

var lookups = window.SCENARIOS.filter(function (s) {
  return window.matchesHay([s.title, s.question, s.short, s.phrases].concat(s.steps).join(" "), "second county license");
});
assert.ok(hasId(lookups, "county-base"), "second county license should hit the posting lookup");

var renew = window.SCENARIOS.filter(function (s) {
  return window.matchesHay([s.title, s.question, s.short, s.phrases].concat(s.steps).join(" "), "july renewal");
});
assert.ok(hasId(renew, "renewal"), "july renewal should hit the renewal lookup");

var related = window.formsForIds(["ph4318", "ph3987"]);
assert.strictEqual(related.length, 2);
assert.ok(hasId(related, "ph4318"));
assert.ok(hasId(related, "ph3987"));

var sc = window.REGIONS.filter(function (r) { return r.id === "sc"; })[0];
assert.strictEqual(sc.consultant, "Chad Brown");
assert.ok(sc.counties.indexOf("Bedford") !== -1);

var mid = window.REGIONS.filter(function (r) { return r.id === "mid"; })[0];
assert.strictEqual(mid.consultant, "Hansel Cook");

console.log("toolkit-search.test.js passed");
