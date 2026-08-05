// UX-2R / CPC-1 — LINE anonymous entry must read nothing private and imply nothing personal.
//
// The defect these lock down: after the canonical return mode was added, the ANONYMOUS branch was
// reported as isolated while it still mounted return-session tracking and the legacy Companion
// card (which calls /api/open-testing/recommendations) and told the visitor
// 「前回の続きから、少しだけ。」 — a claim about a history the runtime had not read and, for a
// first-time visitor, does not exist.
//
// Source-level assertions are the right instrument here: the property is "this surface does not
// reach for private state at all", which is a fact about what the module imports and renders, not
// about a runtime outcome that could be stubbed into passing.

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const SOURCE = readFileSync(join(process.cwd(), "app/line/mini-app/page.tsx"), "utf8");

/** The anonymous branch is everything after the canonical `?result=` early return. */
function anonymousBranch(): string {
  const marker = "const startHref = buildMiniAppCheckInHandoffHref";
  const at = SOURCE.indexOf(marker);
  assert.ok(at > 0, "anonymous branch marker not found — the mode split has moved");
  return SOURCE.slice(at);
}

test("anonymous entry renders no previous-history or continuation claim", () => {
  const branch = anonymousBranch();
  for (const phrase of ["前回の続き", "前回のチェック", "最近の入口", "最近の診断"]) {
    assert.ok(!branch.includes(phrase), `anonymous entry must not claim: ${phrase}`);
  }
});

test("anonymous entry emits no return-session signal", () => {
  const branch = anonymousBranch();
  assert.ok(!branch.includes("return_surface_viewed"), "no return-surface signal");
  assert.ok(!branch.includes("return_session"), "no return-session recommendation mode");
  assert.ok(!branch.includes("RecommendationSignalMountTracker"), "tracker must not be mounted");
});

test("the legacy companion and recommendation slot are not mounted anywhere on this surface", () => {
  // Both read device-local/legacy recommendation state and would compete with canonical truth.
  assert.ok(!SOURCE.includes("YorisouCompanionCard"), "companion removed");
  assert.ok(!SOURCE.includes("YorisouRecommendationSlot"), "legacy slot removed");
});

test("anonymous entry performs no canonical or private recommendation read", () => {
  const branch = anonymousBranch();
  assert.ok(!branch.includes("loadRecommendationSet"), "no canonical set load without an identity");
  assert.ok(!branch.includes("requireRecommendationContext"), "no canonical context load");
  assert.ok(!branch.includes("listRecommendationHistory"), "no history read");
  assert.ok(!branch.includes("/api/open-testing/recommendations"), "no legacy recommendation API");
});

test("canonical mode is still wired and still records actions as surface=line", () => {
  // The correction must not have weakened the accepted canonical return path.
  assert.ok(SOURCE.includes("requireRecommendationContext"), "canonical gate present");
  assert.ok(SOURCE.includes('loadRecommendationSet(loaded.context.resultRowId, ownerId, "line")'));
  assert.ok(SOURCE.includes('surface="line"'), "actions attributed to LINE");
});

test("anonymous entry still offers the one thing it can honestly offer", () => {
  const branch = anonymousBranch();
  assert.ok(branch.includes("startHref"), "check-in CTA present");
  assert.ok(branch.includes("120問から始める"));
});
