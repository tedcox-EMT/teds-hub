var assert = require("assert");
var path = require("path");
var data = require(path.join(__dirname, "../bylaws/data.js"));
var searchApi = require(path.join(__dirname, "../bylaws/search.js"));

var index = searchApi.buildIndex(data);

function topId(query) {
  var hits = searchApi.search(query, index);
  assert.ok(hits.length, "Expected hits for: " + query);
  return hits[0].section.id;
}

function includesId(query, id) {
  var hits = searchApi.search(query, index);
  var found = hits.some(function (h) { return h.section.id === id; });
  assert.ok(found, "Expected " + id + " in results for: " + query);
}

var cases = [
  ["when does the commission meet", "i-a"],
  ["second tuesday", "i-a"],
  ["snow day", "i-a"],
  ["inclement weather", "i-a"],
  ["what is a quorum", "i-b"],
  ["how do I speak at a meeting", "i-y"],
  ["public comment", "i-y"],
  ["3 minutes", "i-y"],
  ["conflict of interest if my spouse works for the county", "i-n"],
  ["how does an item get on the agenda", "i-t"],
  ["two commissioners twelve days", "i-t"],
  ["which committee does EMS report to", "vi-m"],
  ["ambulance committee", "vi-m"],
  ["naming a county bridge", "ix-d"],
  ["special called meeting", "i-x"],
  ["parliamentarian", "i-u"],
  ["robert's rules", "i-v"],
  ["change my vote", "i-o"],
  ["beer board", "viii-b3"],
  ["ethics committee", "viii-b6"],
  ["who starts the meeting", "ii-a"],
  ["ten day agenda packet", "ii-g"]
];

cases.forEach(function (pair) {
  assert.strictEqual(topId(pair[0]), pair[1], pair[0] + " should rank " + pair[1] + " first, got " + topId(pair[0]));
});

includesId("jail", "vi-m");
includesId("cannot vote on a contract", "i-n");
includesId("suspend the rules", "i-s");

assert.ok(data.sections.length >= 60, "Expected a full bylaw corpus");
assert.ok(searchApi.search("", index).length === 0, "Empty query returns nothing");

console.log("All " + cases.length + " ranking tests plus extras passed. Sections: " + data.sections.length);
