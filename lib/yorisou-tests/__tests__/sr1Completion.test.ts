// SR-1 — Stranger-Ready End-to-End Service completion contracts (source + runtime).
// Verifies the anonymous-first service spine: deterministic router, complete
// support plan per family, coverage / no dead-ends, guest-continuity truth,
// public-safe model, recovery states, and the truthfulness fixes.
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { routeService, SERVICE_NEEDS } from "@/lib/sr1/serviceRouter";
import { buildSupportPlan, SUPPORT_PLAN_FAMILIES, type SupportPlanFamily } from "@/lib/sr1/supportPlan";
import { SR1_SERVICE_CATALOGUE, getServiceItem } from "@/app/data/sr1/serviceCatalogue";
import { emptyGuestJourney, parseGuestJourney } from "@/lib/sr1/guestJourney";

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");
const has = (p: string) => existsSync(join(root, p));

// ── §8 Service router — deterministic + every need routes to a real destination ──
assert.equal(SERVICE_NEEDS.length, 7, "seven ordinary-language needs");
for (const need of SERVICE_NEEDS) {
  const a = routeService({ need: need.id });
  const b = routeService({ need: need.id });
  assert.deepEqual(a, b, `routeService deterministic for ${need.id}`);
  assert.ok(a.primary && a.primary.href.startsWith("/"), `${need.id}: primary destination is a real route`);
  assert.ok(a.primary.why && a.primary.receive && a.primary.estimatedTime, `${need.id}: primary explains why/receive/time`);
  assert.ok(typeof a.primary.dataStaysOnDevice === "boolean" && typeof a.primary.loginOptional === "boolean", `${need.id}: privacy + login flags present`);
  assert.ok(a.primary.loginOptional, `${need.id}: primary path does not require login (anonymous value)`);
  assert.ok(a.alternatives.length >= 1, `${need.id}: has at least one alternative`);
  assert.ok(a.note, `${need.id}: has an honest route note`);
}
// pace changes routing for the ambiguous "organize-self" need
assert.notEqual(
  routeService({ need: "organize-self", pace: "quick" }).primary.id,
  routeService({ need: "organize-self", pace: "deep" }).primary.id,
  "pace influences the organize-self route",
);
// returning visitor with a result routes find-fit straight to recommendations
assert.equal(routeService({ need: "find-fit", hasResult: true }).primary.id, "recommendations", "find-fit + result → recommendations");
assert.equal(routeService({ need: "continue-previous" }).primary.href, "/my-yorisou", "continue-previous → personal hub");

// ── §11/§12 Support plan — every retained family yields a COMPLETE, non-empty plan ──
assert.equal(SUPPORT_PLAN_FAMILIES.length, 9, "nine retained result families covered");
for (const family of SUPPORT_PLAN_FAMILIES) {
  const plan = buildSupportPlan({ family: family as SupportPlanFamily, resultLabel: "テスト", confidence: "low" });
  const p2 = buildSupportPlan({ family: family as SupportPlanFamily, resultLabel: "テスト", confidence: "low" });
  assert.deepEqual(plan, p2, `${family}: support plan deterministic`);
  assert.ok(plan.whatWeUnderstood.line, `${family}: has an understanding line`);
  assert.ok(plan.whatWeUnderstood.boundary.includes("診断ではなく"), `${family}: carries the not-a-diagnosis boundary`);
  // primary "what may help now"
  assert.ok(plan.whatMayHelpNow && plan.whatMayHelpNow.href.startsWith("/"), `${family}: one real primary next step`);
  assert.ok(plan.whatMayHelpNow.why, `${family}: primary explains why`);
  // prioritized next set includes at least one action/reading, and a save/return action
  assert.ok(plan.whatMayHelpNext.length >= 1, `${family}: has prioritized next items`);
  const allItems = [plan.whatMayHelpNow, ...plan.whatMayHelpNext];
  assert.ok(allItems.some((i) => i.itemId === "save-and-return"), `${family}: has a save/return action (no dead-end)`);
  assert.ok(allItems.some((i) => i.type === "guided_experience" || i.type === "small_action" || i.type === "report"), `${family}: has an actionable/readable step`);
  // every item resolves to a real catalogue route + feedback controls exist
  for (const item of allItems) {
    assert.ok(item.href.startsWith("/"), `${family}: item ${item.itemId} is a real route`);
  }
  assert.ok(plan.controls.length >= 5, `${family}: offers user controls (save/try/useful/not-now/hide)`);
}
// imairo: a real report href flows through to the primary when provided
const withReport = buildSupportPlan({ family: "imairo", resultLabel: "灯起こし", reportHref: "/reports/self-understanding/EM-AK" });
assert.equal(withReport.whatMayHelpNow.href, "/reports/self-understanding/EM-AK", "imairo primary uses the provided report href");
const noReport = buildSupportPlan({ family: "imairo", resultLabel: "灯起こし" });
assert.notEqual(noReport.whatMayHelpNow.itemId, "self-understanding-report", "imairo falls back off the report when none exists (no fake deliverable)");

// ── §13 Service catalogue — real items only, public-safe ──
assert.ok(SR1_SERVICE_CATALOGUE.length >= 5, "service catalogue has real items");
for (const item of SR1_SERVICE_CATALOGUE) {
  assert.ok(item.href.startsWith("/") && !item.external, `catalogue item ${item.id} is an internal real route`);
  assert.ok(item.reviewState === "published", `catalogue item ${item.id} is published`);
  assert.ok(["device-local", "public-safe", "account"].includes(item.privacy), `catalogue item ${item.id} declares privacy scope`);
  assert.ok(item.whyMayFit, `catalogue item ${item.id} explains why it may fit`);
}
assert.ok(getServiceItem("grounding-reflection"), "the anonymous guided experience is in the catalogue");
assert.ok(getServiceItem("save-and-return"), "the save/return action is in the catalogue");

// ── §9/§26 Guest journey — public-safe by construction (no raw answers/PII) ──
const empty = emptyGuestJourney();
assert.equal(empty.version, "sr1.v1", "guest journey versioned");
assert.deepEqual(empty.savedItemIds, [], "empty journey has no saved items");
// parsing rejects/strips anything that is not a typed public-safe field
const injected = parseGuestJourney(
  JSON.stringify({
    version: "sr1.v1",
    need: "organize-self",
    routedTo: "/start",
    lastResult: { family: "imairo", resultId: "MS-KI", label: "灯起こし", resultPath: "/result?resultId=MS-KI", savedAt: "2026-07-19T00:00:00Z", rawAnswers: [1, 2, 3], payloadKey: "secret" },
    answers: ["a", "b"],
    email: "leak@example.com",
    savedItemIds: ["grounding-reflection"],
  }),
);
assert.ok(injected, "valid journey parses");
assert.ok(!("answers" in (injected as object)), "raw answers key is dropped");
assert.ok(!("email" in (injected as object)), "email key is dropped");
assert.ok(injected!.lastResult && !("rawAnswers" in injected!.lastResult), "raw answers stripped from lastResult");
assert.ok(injected!.lastResult && !("payloadKey" in injected!.lastResult), "payload key stripped from lastResult");
assert.equal(injected!.need, "organize-self", "typed fields preserved");
// a bad path is rejected
const badPath = parseGuestJourney(JSON.stringify({ version: "sr1.v1", routedTo: "https://evil.example.com" }));
assert.ok(badPath && badPath.routedTo === undefined, "non-relative routedTo rejected");

// ── SR-1 wiring — the spine is actually rendered / connected ──
assert.ok(has("app/start/page.tsx") && has("app/start/StartRouter.tsx"), "service router page exists");
assert.ok(has("app/my-yorisou/page.tsx"), "personal support home exists");
assert.ok(has("app/experiences/guided/[slug]/page.tsx"), "guided-experience runtime exists");
assert.ok(has("app/components/sr1/SupportPlanView.tsx"), "support-plan view exists");
assert.ok(has("app/components/sr1/ServiceStates.tsx"), "recovery states exist");

const home = read("app/page.tsx");
assert.ok(home.includes('href="/start"'), "homepage primary CTA routes through the service router");
const header = read("app/components/SiteHeader.tsx");
assert.ok(header.includes('"/start"'), "global header CTA routes through the service router");

const resultPage = read("app/result/page.tsx");
assert.ok(resultPage.includes("SupportPlanView") && resultPage.includes("buildSupportPlan"), "result surface renders the support plan");

const surface = read("app/lib/publicSurface.ts");
assert.ok(surface.includes('"/start"') && surface.includes('"/my-yorisou"') && surface.includes("/experiences/guided"), "SR-1 routes are registered in the surface system (coherent theme)");

// ── §30 Truthfulness — no fabricated locked content; recovery not a dead-end ──
const sample = read("app/reports/sample/page.tsx");
assert.ok(!sample.includes("残り12章") && !sample.includes("🔒"), "fabricated locked-content removed from /reports/sample");
assert.ok(sample.includes("無料で読めます") || sample.includes("自己理解レポート"), "/reports/sample points to the real free report");

const privateState = read("app/private-state/view.tsx");
assert.ok(privateState.includes("ServiceRecoveryBlock") && privateState.includes('"auth"'), "/private-state 401 renders a login recovery block, not a misleading transient error");

const recommendations = read("app/recommendations/page.tsx");
assert.ok(recommendations.includes("ServiceRecoveryBlock"), "/recommendations gives a no-result first-visit recovery");

// dead code removed
assert.ok(!has("app/data/yorisouTests.ts"), "dead yorisouTests catalog removed");
assert.ok(!has("app/result/LocalResultSave.tsx"), "unwired light device-local writer removed (replaced by SupportPlanView)");

// ── Docs (the reset is documented) ──
for (const doc of [
  "docs/sr1/STRANGER_READY_CAPABILITY_AUDIT.md",
  "docs/sr1/RESULT_TO_SERVICE_COVERAGE_MATRIX.md",
  "docs/sr1/PRIVACY_AND_CONSENT_FLOW.md",
  "docs/sr1/SERVICE_ARCHITECTURE.md",
]) {
  assert.ok(has(doc), `SR-1 doc present: ${doc}`);
}

console.log("SR-1 completion contract checks passed");
