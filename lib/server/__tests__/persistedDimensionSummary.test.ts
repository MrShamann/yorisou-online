// CPC-1 Wave A — persisted envelope contract, driven by the REAL governed runtime.
// The point of using the real runtime is that this test FAILS if completion output and the
// persistence contract ever drift apart — the earlier synthetic test structurally could not.
import assert from "node:assert/strict";
import { currentStateQuestions, scoreCurrentStateCheck } from "@/app/tests/ima-iro/currentStateCheckV1";
import {
  buildPersistedResultEnvelope, readPersistedResultEnvelope,
  containsForbiddenKey, PERSISTED_RESULT_ENVELOPE_VERSION,
} from "@/lib/server/persistedDimensionSummary";

let n = 0; const ok = (name: string, fn: () => void) => { fn(); n++; console.log("  ok -", name); };

const answers: Record<string, string> = {};
for (const q of currentStateQuestions) answers[q.id] = q.options[0].id;
const scored = scoreCurrentStateCheck(answers as never);

ok("REGRESSION GUARD: raw governed output does carry reconstructable answer data", () => {
  // This is exactly why the raw payload must never be persisted live.
  assert.equal(containsForbiddenKey(scored.scoringOutput), "questionId");
});

ok("the canonical envelope is a version marker only", () => {
  const e = buildPersistedResultEnvelope();
  assert.deepEqual(e, { v: PERSISTED_RESULT_ENVELOPE_VERSION });
  assert.equal(Object.keys(e).length, 1);
});

ok("envelope carries nothing derived from the user's answers", () => {
  assert.equal(containsForbiddenKey(buildPersistedResultEnvelope()), null);
  assert.equal(JSON.stringify(buildPersistedResultEnvelope()), '{"v":"pds-v1"}');
});

ok("strict reader accepts exactly the canonical envelope", () => {
  assert.deepEqual(readPersistedResultEnvelope({ v: "pds-v1" }), { v: "pds-v1" });
  assert.deepEqual(readPersistedResultEnvelope(JSON.parse(JSON.stringify(buildPersistedResultEnvelope()))), { v: "pds-v1" });
});

ok("unknown version rejected, never guessed", () => {
  assert.equal(readPersistedResultEnvelope({ v: "pds-v2" }), null);
  assert.equal(readPersistedResultEnvelope({ v: 1 }), null);
});

ok("extra fields are REJECTED, not silently stripped", () => {
  assert.equal(readPersistedResultEnvelope({ v: "pds-v1", answeredRows: 120 }), null);
  assert.equal(readPersistedResultEnvelope({ v: "pds-v1", questionId: "Q001" }), null);
});

ok("legacy raw payload can never be partially honoured", () => {
  assert.equal(readPersistedResultEnvelope(scored.scoringOutput as unknown), null);
  assert.equal(readPersistedResultEnvelope({ groupedBySubdimension: {}, formulaStatus: "complete" }), null);
  assert.equal(readPersistedResultEnvelope({ answeredRows: 120, dimensionCounts: {} }), null);
});

ok("arrays, primitives and empties are rejected", () => {
  for (const bad of [null, undefined, [], [{ v: "pds-v1" }], "pds-v1", 1, {}]) {
    assert.equal(readPersistedResultEnvelope(bad as unknown), null);
  }
});

ok("forbidden-key walker catches nesting", () => {
  assert.equal(containsForbiddenKey({ a: { b: [{ optionId: "x" }] } }), "optionId");
  assert.equal(containsForbiddenKey({ a: { b: [{ safe: 1 }] } }), null);
});

console.log(`\npersistedResultEnvelope: ${n} checks passed (real governed runtime)`);
