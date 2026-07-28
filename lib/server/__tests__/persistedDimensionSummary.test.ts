// CPC-1 Wave A — REAL contract chain test.
// Drives the ACTUAL governed runtime (scoreCurrentStateCheck over the real 120Q bank) through the
// persistence projection, so the test fails if the production completion schema and the projection
// ever drift apart. A synthetic {anshin:10} fixture would not have caught the defect this replaces.
import assert from "node:assert/strict";
import { currentStateQuestions, scoreCurrentStateCheck } from "@/app/check-in/currentStateCheckV1";
import {
  buildPersistedDimensionSummary, readPersistedDimensionSummary,
  containsForbiddenKey, PERSISTED_DIMENSION_SUMMARY_VERSION,
} from "@/lib/server/persistedDimensionSummary";

let n = 0; const ok = (name: string, fn: () => void) => { fn(); n++; console.log("  ok -", name); };

// A REAL complete answer set from the governed bank.
const answers: Record<string, string> = {};
for (const q of currentStateQuestions) answers[q.id] = q.options[0].id;
const scored = scoreCurrentStateCheck(answers as never);

ok("real governed scoring produces the documented raw shape", () => {
  const grouped = scored.scoringOutput?.groupedBySubdimension as Record<string, unknown>;
  assert.ok(grouped && typeof grouped === "object");
  const firstNonEmpty = Object.values(grouped).find((v) => Array.isArray(v) && v.length > 0) as unknown[];
  assert.ok(Array.isArray(firstNonEmpty), "expected OptionScore[] buckets");
  assert.ok("questionId" in (firstNonEmpty[0] as object), "raw rows DO carry questionId");
});

ok("raw scoring output would leak reconstructable answer data (regression guard)", () => {
  // This is precisely why the raw payload must never be persisted.
  assert.equal(containsForbiddenKey(scored.scoringOutput), "questionId");
});

const summary = buildPersistedDimensionSummary(scored.scoringOutput);

ok("bounded summary accepts the REAL completion shape", () => {
  assert.equal(summary.v, PERSISTED_DIMENSION_SUMMARY_VERSION);
  assert.equal(summary.answeredRows, currentStateQuestions.length);
  assert.ok(Object.keys(summary.dimensionCounts).length > 0, "real dimension codes counted");
});

ok("bounded summary contains NO forbidden reconstructable field", () => {
  assert.equal(containsForbiddenKey(summary), null);
});

ok("summary survives JSON serialization unchanged (what the DB stores)", () => {
  const round = JSON.parse(JSON.stringify(summary));
  assert.equal(containsForbiddenKey(round), null);
  assert.deepEqual(readPersistedDimensionSummary(round), summary);
});

ok("unknown schema version is rejected, never guessed", () => {
  assert.equal(readPersistedDimensionSummary({ ...summary, v: "pds-v99" }), null);
});

ok("legacy raw payload is rejected rather than reinterpreted", () => {
  assert.equal(readPersistedDimensionSummary(scored.scoringOutput as unknown), null);
  assert.equal(readPersistedDimensionSummary({ groupedBySubdimension: {} }), null);
});

ok("malformed payloads are safely absent", () => {
  for (const bad of [null, undefined, [], "x", 3, {}]) {
    assert.equal(readPersistedDimensionSummary(bad as unknown), null);
  }
});

ok("empty/garbage scoring output yields a valid empty summary, not a crash", () => {
  const s = buildPersistedDimensionSummary({});
  assert.equal(s.answeredRows, 0);
  assert.equal(containsForbiddenKey(s), null);
});

console.log(`\npersistedDimensionSummary: ${n} checks passed (real governed runtime)`);
