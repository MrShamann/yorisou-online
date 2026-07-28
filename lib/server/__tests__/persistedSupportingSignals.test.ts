// CPC-1 Wave A — contract tests for the persisted supporting-signals projection.
import assert from "node:assert/strict";
import { buildSupportingSignals } from "@/lib/server/persistedSupportingSignals";

let passed = 0;
function check(name: string, fn: () => void) { fn(); passed++; console.log("  ok -", name); }

check("null payload yields null (caller omits the section)", () => {
  assert.equal(buildSupportingSignals(null), null);
});
check("missing groupedBySubdimension yields null", () => {
  assert.equal(buildSupportingSignals({ formulaStatus: "complete" }), null);
});
check("array groupedBySubdimension is rejected", () => {
  assert.equal(buildSupportingSignals({ groupedBySubdimension: [] as unknown }), null);
});
check("unknown keys are dropped, never rendered raw", () => {
  const r = buildSupportingSignals({ groupedBySubdimension: { __internal_secret: 9 } });
  assert.equal(r, null);
});
check("governed keys project to labelled, relative weights", () => {
  const r = buildSupportingSignals({ groupedBySubdimension: { anshin: 10, pace: 5 }, formulaStatus: "complete" });
  assert.ok(r);
  assert.equal(r!.signals.length, 2);
  assert.equal(r!.signals[0].label, "見通しの安心");
  assert.equal(r!.signals[0].weight, 1);      // normalised to the max
  assert.equal(r!.signals[1].weight, 0.5);
});
check("object counts are accepted", () => {
  const r = buildSupportingSignals({ groupedBySubdimension: { anshin: { count: 4 }, jikkan: { count: 2 } } });
  assert.ok(r);
  assert.equal(r!.signals[0].label, "見通しの安心");
});
check("negative and non-finite values are ignored", () => {
  assert.equal(buildSupportingSignals({ groupedBySubdimension: { anshin: -3 } }), null);
  assert.equal(buildSupportingSignals({ groupedBySubdimension: { anshin: Number.NaN } }), null);
});
check("all-zero weights yield null rather than a meaningless bar chart", () => {
  assert.equal(buildSupportingSignals({ groupedBySubdimension: { anshin: 0, pace: 0 } }), null);
});
check("at most five signals are returned", () => {
  const r = buildSupportingSignals({ groupedBySubdimension: {
    anshin: 7, pace: 6, tsunagari: 5, seicho: 4, yakuwari: 3, totonoi: 2, jikkan: 1 } });
  assert.ok(r);
  assert.equal(r!.signals.length, 5);
});
check("no raw internal numerics leak: weights are 0..1 relative", () => {
  const r = buildSupportingSignals({ groupedBySubdimension: { anshin: 137, pace: 68 } });
  assert.ok(r);
  for (const s of r!.signals) { assert.ok(s.weight > 0 && s.weight <= 1); }
});
console.log(`\npersistedSupportingSignals: ${passed} checks passed`);
