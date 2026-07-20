// CPV1 — foundation completion contract (WS-B/C/D/E/F + rights gate).

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  CPV1_METHOD_UNIVERSE,
  getMethod,
  methodActivationState,
  methodMaturity,
  methodPrimaryBlocker,
  methodPublicallyActivatable,
  publicMethods,
  productionRouteVerifiedMethods,
  rightsBlockedMethods,
  blockedAdapter,
  type MethodRegistryEntry,
} from "@/lib/cpv1/methods";
import {
  rightsClears,
  rightsResolutionReport,
  rightsReviewRequired,
  yorisouOriginal,
  ROUTE_RULES,
  type RightsRecord,
  type RightsRoute,
} from "@/lib/cpv1/rights";
import {
  canUseDownstream,
  synthesizeThemes,
  effectiveRelation,
  NO_UNIVERSAL_SCORE,
  type Observation,
  type ThemeRelation,
} from "@/lib/cpv1/understanding";
import {
  defaultConsent,
  canPersist,
  canShareToCommunity,
  consentAllows,
  grantPurpose,
  revokePurpose,
} from "@/lib/cpv1/consent";
import {
  appendEvent,
  recordResultChange,
  recordConfirmation,
  recordDataRightsEvent,
  makeTombstone,
  tombstoneCarriesNoPersonalContent,
  dataRightsEventCarriesNoFreeText,
  stableIdentity,
  buildChangeView,
  DATA_RIGHTS_MESSAGES,
  ALLOWED_DATA_RIGHTS_DETAILS,
  type HistoryEvent,
} from "@/lib/cpv1/history";
import { COMPLETION_COPY } from "@/app/result/reveal/revealContent";
import { PRODUCT_CARDS } from "@/app/data/productCards";
import { lineRecoveryMessage, evaluateLineCallback } from "@/lib/app2/lineCallbackContract";
import { deploymentContext, cpv1PreviewAccess } from "@/lib/cpv1/deploymentContext";

const root = process.cwd();
const has = (p: string) => existsSync(join(root, p));
const read = (p: string) => readFileSync(join(root, p), "utf8");

let passed = 0;
function check(name: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`  ✓ ${name}`);
}

console.log("CPV1 — rights registry + gate (WS-B2/B3)");
check("RIGHTS_REVIEW_REQUIRED never clears", () => {
  assert.equal(rightsClears(rightsReviewRequired("x", "src")), false);
});
check("unactivated YORISOU-original does not clear; activated does", () => {
  assert.equal(rightsClears(yorisouOriginal("x", { activated: false })), false);
  assert.equal(rightsClears(yorisouOriginal("x", { activated: true })), true);
});

console.log("CPV1 — method registry + activation (WS-B1/C)");
check("method universe has original + external families", () => {
  assert.ok(CPV1_METHOD_UNIVERSE.length >= 20, "substantial universe");
  const fams = new Set(CPV1_METHOD_UNIVERSE.map((m) => m.family));
  for (const f of ["yorisou_original_assessment", "chinese_traditional", "western_symbolic", "psychology_preference"]) {
    assert.ok(fams.has(f as never), `family ${f} present`);
  }
});
check("R1.1 §4 shipped originals are implemented_route_verified — NOT public_active (no evidenced Founder activation)", () => {
  for (const id of ["imairo-120q", "relationship-fatigue-24q", "f01-work-fit", "love-distance", "name-impression"]) {
    const m = getMethod(id);
    assert.ok(m, `${id} present`);
    const mt = methodMaturity(m!);
    // Route existence, environment, and Founder activation are SEPARATE, never equated.
    assert.equal(mt.implementation, "complete", `${id} implemented`);
    assert.equal(mt.tests, "passing", `${id} tests pass`);
    assert.equal(mt.route, "production_main_present", `${id} route present on production main`);
    assert.equal(mt.founderActivation, "unverified", `${id} Founder public-activation NOT evidenced (never inferred from a constructor)`);
    assert.equal(mt.publicRoute, "unavailable", `${id} public availability requires evidenced Founder activation`);
    assert.equal(methodActivationState(m!), "implemented_route_verified", `${id} route-verified, not public_active`);
  }
});
check("R1.1 §4 NOTHING is public_active without an evidenced Founder activation; 9 are route-verified", () => {
  assert.equal(publicMethods().length, 0, "no method has an evidenced CPV1 Founder public-activation");
  assert.equal(productionRouteVerifiedMethods().length, 9, "exactly 9 production-route-verified methods");
});

// ── R1.1A §7 — negative contract tests for the deployment + activation model ──
// Base = a route-verified original (impl complete, rights cleared, content authored,
// privacy reviewed, tests passing, route on production main; deployment + Founder both
// unverified with NO refs). We mutate ONE axis at a time.
const rvBase = getMethod("imairo-120q")!;
const withM = (over: Partial<MethodRegistryEntry>): MethodRegistryEntry => ({ ...rvBase, ...over });
const DEPLOY_REF = "deploy://prod/run-abc123";
const FOUNDER_REF = "founder://decision-2026-07-20";
check("R1.1A §7.1 route present + Founder open + deployment UNVERIFIED ⇒ NOT public", () => {
  const mt = methodMaturity(withM({ founderActivation: "open", founderDecisionRef: FOUNDER_REF, deploymentStatus: "unverified", deploymentEvidenceRef: null }));
  assert.equal(mt.publicRoute, "unavailable");
  assert.notEqual(methodActivationState(withM({ founderActivation: "open", founderDecisionRef: FOUNDER_REF })), "public_active");
});
check("R1.1A §7.2 deployment VERIFIED + Founder unverified ⇒ NOT public", () => {
  const mt = methodMaturity(withM({ deploymentStatus: "production_verified", deploymentEvidenceRef: DEPLOY_REF, founderActivation: "unverified", founderDecisionRef: null }));
  assert.equal(mt.deployment, "production_verified", "deployment trusted (ref present)");
  assert.equal(mt.publicRoute, "unavailable", "still not public without Founder activation");
});
check("R1.1A §7.3 deployment VERIFIED + Founder CLOSED ⇒ NOT public", () => {
  assert.equal(methodMaturity(withM({ deploymentStatus: "production_verified", deploymentEvidenceRef: DEPLOY_REF, founderActivation: "closed" })).publicRoute, "unavailable");
});
check("R1.1A §7.4 route present + rights blocked ⇒ NOT route-verified", () => {
  const blockedRights = getMethod("tarot")!.rights; // review_required
  assert.notEqual(methodActivationState(withM({ rights: blockedRights })), "implemented_route_verified");
});
check("R1.1A §7.5 route present + content incomplete ⇒ NOT route-verified", () => {
  assert.notEqual(methodActivationState(withM({ content: "not_authored" })), "implemented_route_verified");
});
check("R1.1A §7.6 route present + privacy not reviewed ⇒ NOT route-verified", () => {
  assert.notEqual(methodActivationState(withM({ privacy: "not_reviewed" })), "implemented_route_verified");
  // route absent also fails route-verified
  assert.notEqual(methodActivationState(withM({ routeEvidence: "none" })), "implemented_route_verified");
  // tests not passing also fails route-verified
  assert.notEqual(methodActivationState(withM({ tests: "not_run" })), "implemented_route_verified");
});
check("R1.1A §7.7 ALL dimensions + production deployment + Founder open (with refs) ⇒ public_active", () => {
  const full = withM({ deploymentStatus: "production_verified", deploymentEvidenceRef: DEPLOY_REF, founderActivation: "open", founderDecisionRef: FOUNDER_REF });
  assert.equal(methodMaturity(full).publicRoute, "available");
  assert.equal(methodActivationState(full), "public_active");
});
check("R1.1A §7.8 NO constructor infers Founder activation or deployment evidence; enum-without-ref not trusted", () => {
  for (const m of CPV1_METHOD_UNIVERSE) {
    assert.equal(m.deploymentStatus, "unverified", `${m.methodId} deployment not asserted by any constructor`);
    assert.equal(m.deploymentEvidenceRef, null, `${m.methodId} no deployment evidence ref from a constructor`);
    assert.equal(m.founderDecisionRef, null, `${m.methodId} no Founder decision ref from a constructor`);
    assert.notEqual(m.founderActivation, "open", `${m.methodId} Founder activation not asserted 'open' by any constructor`);
  }
  // An enum value WITHOUT its evidence ref is downgraded (not trusted as verified).
  assert.equal(methodMaturity(withM({ founderActivation: "open", founderDecisionRef: null })).founderActivation, "unverified", "open without ref ⇒ unverified");
  assert.equal(methodMaturity(withM({ deploymentStatus: "production_verified", deploymentEvidenceRef: null })).deployment, "unverified", "verified without ref ⇒ unverified");
});
check("§4 EVERY external method exposes SEPARATE unmet dimensions (never collapsed)", () => {
  const external = CPV1_METHOD_UNIVERSE.filter((m) => m.family === "chinese_traditional" || m.family === "western_symbolic");
  assert.ok(external.length >= 10, "many external methods registered");
  for (const m of external) {
    const mt = methodMaturity(m);
    // Each blocking dimension is recorded on its own — implementation, rights,
    // content, privacy, tests are ALL independently unmet (not one rights_blocked).
    assert.equal(mt.implementation, "not_started", `${m.methodId} implementation not_started`);
    assert.equal(mt.rights, "review_required", `${m.methodId} rights review_required`);
    assert.equal(mt.content, "not_authored", `${m.methodId} content not_authored`);
    assert.equal(mt.privacy, "not_reviewed", `${m.methodId} privacy not_reviewed`);
    assert.equal(mt.tests, "not_run", `${m.methodId} tests not_run`);
    assert.equal(mt.founderActivation, "closed", `${m.methodId} founder gate closed`);
    assert.equal(mt.route, "none", `${m.methodId} no route (§4 route dimension)`);
    assert.equal(mt.deployment, "unverified", `${m.methodId} deployment unverified (R1.1A §2)`);
    assert.equal(mt.publicRoute, "unavailable", `${m.methodId} public route unavailable`);
    assert.equal(m.devFlagged, true, `${m.methodId} dev-flagged`);
    assert.equal(methodPublicallyActivatable(m), false, `${m.methodId} not publicly activatable`);
    assert.equal(methodActivationState(m), "gated", `${m.methodId} gated (not collapsed to rights_blocked)`);
  }
});
check("§4 primary blocker is honest (implementation before rights, etc.)", () => {
  // With implementation not_started, the primary blocker is implementation — NOT
  // rights collapsed over everything.
  assert.equal(methodPrimaryBlocker(getMethod("tarot")!), "implementation");
  // A method that is implemented + content-authored but rights-pending blocks on rights.
  const hypo = { ...getMethod("tarot")!, implementation: "complete" as const, content: "authored" as const, privacy: "reviewed" as const, tests: "passing" as const };
  assert.equal(methodPrimaryBlocker(hypo), "rights");
});
check("MBTI is import/handoff only (never embedded)", () => {
  const m = getMethod("mbti-import-handoff")!;
  assert.ok(/import|handoff|licen/i.test(m.model), "import/handoff model");
  assert.equal(methodPublicallyActivatable(m), false);
});
check("Big Five requires source validation (rights review_required)", () => {
  const m = getMethod("big-five-ipip")!;
  assert.equal(methodMaturity(m).rights, "review_required");
  assert.equal(methodPublicallyActivatable(m), false);
});
check("publicMethods excludes all rights-blocked methods", () => {
  const pub = new Set(publicMethods().map((m) => m.methodId));
  for (const m of rightsBlockedMethods()) assert.ok(!pub.has(m.methodId), `${m.methodId} not public`);
  // Astrology/Tarot/BaZi must never be public.
  for (const id of ["astrology-natal", "tarot", "bazi-four-pillars", "ziwei-dou-shu", "i-ching"]) {
    assert.ok(!pub.has(id), `${id} not public`);
  }
});
check("blockedAdapter never computes content", () => {
  const a = blockedAdapter("tarot", "rights review required");
  assert.equal(a.compute, undefined);
  assert.ok(a.gatedReason);
});
check("no fabricated calc/interpretation content in external registry entries", () => {
  const src = read("lib/cpv1/methods.ts");
  // external entries describe the model as gated/unimplemented, not real content
  assert.ok(/rights-gated|not implemented|pending-rights|unimplemented/i.test(src));
});

console.log("CPV1-R1 §5 — runtime-truth reconciliation");
// The 9 ROUTE_VERIFIED methods each mount a REAL flow at a real (non-redirect) route
// present on production main — NOT publicly activated, NOT deployment-verified here.
// yorisou-values is DOWNGRADED.
const ROUTE_VERIFIED_METHODS: Array<[string, string]> = [
  ["imairo-120q", "app/check-in/page.tsx"],
  ["c02-current-state", "app/tests/c02/page.tsx"],
  ["relationship-fatigue-24q", "app/tests/relationship-fatigue/page.tsx"],
  ["f01-work-fit", "app/tests/f01/page.tsx"],
  ["f02-workplace-fit", "app/tests/f02/page.tsx"],
  ["love-distance", "app/tests/love-distance/page.tsx"],
  ["work-rhythm", "app/tests/work-rhythm/page.tsx"],
  ["local-life", "app/tests/local-life/page.tsx"],
  ["name-impression", "app/tests/name-impression/page.tsx"],
];
check("§5/R1.1 §4 exactly 9 production-route-verified methods, each with a real route + flow (not public_active)", () => {
  const rv = productionRouteVerifiedMethods().map((m) => m.methodId);
  assert.equal(rv.length, 9, "exactly 9 production-route-verified (corrected from an over-claimed 10, and from a mis-stated 'public_active')");
  for (const [id, route] of ROUTE_VERIFIED_METHODS) {
    assert.ok(rv.includes(id), `${id} is production-route-verified`);
    assert.ok(has(route), `${id} route ${route} exists`);
    const src = read(route);
    assert.ok(!/redirect\(/.test(src), `${id} route is not a redirect`);
    assert.ok(/Flow/.test(src), `${id} route mounts a real flow component`);
  }
});
check("§5 yorisou-values downgraded — registered but NOT built; never public", () => {
  const m = getMethod("yorisou-values")!;
  const mt = methodMaturity(m);
  assert.equal(mt.implementation, "not_started", "not built");
  assert.equal(mt.content, "not_authored", "content not authored");
  assert.equal(mt.publicRoute, "unavailable", "not public");
  assert.equal(methodPublicallyActivatable(m), false);
  assert.ok(!has("app/tests/values/page.tsx"), "no values route exists in the app");
});
check("§5 redirect-only inherited routes are not registered as active methods", () => {
  for (const r of ["r01", "r04", "s01"]) {
    assert.ok(/redirect\(/.test(read(`app/tests/${r}/page.tsx`)), `${r} is redirect-only`);
    assert.equal(getMethod(r), undefined, `${r} is not a registered method`);
  }
});

console.log("CPV1-R1 §3 — route-specific rights gate");
function fullyResolved(route: RightsRoute): RightsRecord {
  return {
    methodId: "t", rightsRoute: route, source: "test provenance",
    copyrightStatus: "clear", trademarkStatus: "clear", softwareLicense: "MIT",
    commercialUsePermission: "clear", translationRights: "clear", modificationRights: "clear",
    attribution: "attribution present", dataOrEphemerisSource: "licensed ephemeris", artworkRights: "clear",
    reviewer: "reviewer", evidence: "evidence ref", reviewDate: "2026-07-19", activationGate: "open",
    requiresEphemeris: false, requiresArtwork: false,
  };
}
const CLEARABLE: RightsRoute[] = [
  "YORISOU_ORIGINAL", "VERIFIED_PUBLIC_DOMAIN_REIMPLEMENTATION", "OPEN_LICENSE_COMMERCIAL_USE",
  "FORMALLY_LICENSED_INTEGRATION", "OFFICIAL_EXTERNAL_HANDOFF", "USER_RESULT_IMPORT",
];
check("each clearable route clears only when fully resolved", () => {
  for (const r of CLEARABLE) {
    assert.ok(ROUTE_RULES[r].clearable, `${r} clearable`);
    assert.ok(rightsClears(fullyResolved(r)), `${r} clears when fully resolved`);
  }
});
check("RIGHTS_REVIEW_REQUIRED never clears even with all fields resolved", () => {
  assert.equal(ROUTE_RULES.RIGHTS_REVIEW_REQUIRED.clearable, false);
  assert.equal(rightsClears(fullyResolved("RIGHTS_REVIEW_REQUIRED")), false);
});
check("ANY pending applicable status field blocks clearance (every route)", () => {
  for (const r of CLEARABLE) {
    for (const f of ["copyrightStatus", "trademarkStatus", "commercialUsePermission", "translationRights", "modificationRights", "artworkRights"] as const) {
      const rec: RightsRecord = { ...fullyResolved(r), [f]: "pending" };
      assert.equal(rightsClears(rec), false, `${r} blocked by pending ${f}`);
    }
  }
});
check("missing reviewer / evidence / date / closed gate each block", () => {
  const b = fullyResolved("YORISOU_ORIGINAL");
  assert.equal(rightsClears({ ...b, reviewer: null }), false, "reviewer");
  assert.equal(rightsClears({ ...b, evidence: null }), false, "evidence");
  assert.equal(rightsClears({ ...b, reviewDate: null }), false, "reviewDate");
  assert.equal(rightsClears({ ...b, activationGate: "closed" }), false, "gate");
});
check("OPEN_LICENSE requires resolved licence + attribution", () => {
  const b = fullyResolved("OPEN_LICENSE_COMMERCIAL_USE");
  assert.equal(rightsClears({ ...b, softwareLicense: "review_required" }), false, "licence terms required");
  assert.equal(rightsClears({ ...b, attribution: null }), false, "attribution required");
});
check("FORMALLY_LICENSED requires resolved licence", () => {
  assert.equal(rightsClears({ ...fullyResolved("FORMALLY_LICENSED_INTEGRATION"), softwareLicense: "review_required" }), false);
});
check("astrology ephemeris + Tarot artwork applicability enforced", () => {
  const eph: RightsRecord = { ...fullyResolved("VERIFIED_PUBLIC_DOMAIN_REIMPLEMENTATION"), requiresEphemeris: true, dataOrEphemerisSource: null };
  assert.equal(rightsClears(eph), false, "missing proven ephemeris blocks");
  const art: RightsRecord = { ...fullyResolved("FORMALLY_LICENSED_INTEGRATION"), requiresArtwork: true, artworkRights: "pending" };
  assert.equal(rightsClears(art), false, "pending artwork blocks");
});
check("resolution report enumerates each specific unresolved reason", () => {
  const rec: RightsRecord = { ...fullyResolved("OPEN_LICENSE_COMMERCIAL_USE"), attribution: null, trademarkStatus: "pending" };
  const rep = rightsResolutionReport(rec);
  assert.equal(rep.cleared, false);
  assert.ok(rep.unresolved.some((u) => u.includes("attribution")), "attribution reason listed");
  assert.ok(rep.unresolved.some((u) => u.includes("trademark")), "trademark reason listed");
});

console.log("CPV1 — source-separated understanding (WS-D) + §7 relations + §9 permissions");
check("no universal score constant is set", () => assert.equal(NO_UNIVERSAL_SCORE, true));
const baseObs = (over: Partial<Observation>): Observation => ({
  id: "o", sourceClass: "yorisou_original_result", methodId: "imairo-120q", methodVersion: "v0.1", resultId: "r-o",
  createdAt: "2026-07-19T00:00:00Z", rawInputRef: null, derived: "theme-a", themeKey: "theme-a", relation: "supports",
  correctedRelation: null, evidenceClass: "method_derived", confirmation: "unreviewed", userCorrection: null,
  visibility: "private", permittedDownstream: [], freshnessAt: "2026-07-19T00:00:00Z", deleted: false, ...over,
});
// §9 — independent permissions (never ordered / inferred).
check("§9 rejected/deleted observations are never used downstream", () => {
  assert.equal(canUseDownstream(baseObs({ confirmation: "rejected", permittedDownstream: ["report"] }), "report"), false);
  assert.equal(canUseDownstream(baseObs({ deleted: true, permittedDownstream: ["report"] }), "report"), false);
});
check("§9 recommendation grant does NOT grant companion (and vice-versa); report grants neither", () => {
  const rec = baseObs({ permittedDownstream: ["recommendation"] });
  assert.equal(canUseDownstream(rec, "recommendation"), true);
  assert.equal(canUseDownstream(rec, "companion"), false, "recommendation ⇏ companion");
  const comp = baseObs({ permittedDownstream: ["companion"] });
  assert.equal(canUseDownstream(comp, "recommendation"), false, "companion ⇏ recommendation");
  const rep = baseObs({ permittedDownstream: ["report"] });
  assert.equal(canUseDownstream(rep, "companion"), false, "report ⇏ companion");
  assert.equal(canUseDownstream(rep, "recommendation"), false, "report ⇏ recommendation");
});
check("§9 community/public require public_safe visibility + explicit grant; archive ⇏ legacy", () => {
  assert.equal(canUseDownstream(baseObs({ visibility: "private", permittedDownstream: ["community"] }), "community"), false);
  assert.equal(canUseDownstream(baseObs({ visibility: "public_safe", permittedDownstream: ["community"] }), "community"), true);
  assert.equal(canUseDownstream(baseObs({ visibility: "public_safe", permittedDownstream: ["community"] }), "public"), false, "community ⇏ public");
  assert.equal(canUseDownstream(baseObs({ permittedDownstream: ["archive"] }), "legacy"), false, "archive ⇏ legacy");
});
check("§9 default permissions are restrictive; changing one leaves others unchanged", () => {
  const none = baseObs({});
  for (const p of ["report", "companion", "recommendation", "community", "public", "archive", "legacy"] as const) {
    assert.equal(canUseDownstream(none, p), false, `default denies ${p}`);
  }
  const granted = baseObs({ permittedDownstream: ["recommendation", "report"] });
  assert.equal(canUseDownstream(granted, "recommendation"), true);
  assert.equal(canUseDownstream(granted, "companion"), false, "granting recommendation+report did not grant companion");
});
// §7 — genuine relation-based contradiction detection.
const rel = (over: Partial<Observation> & { relation: ThemeRelation; themeKey: string }): Observation => baseObs(over);
check("§7/11A.6 two DISTINCT methods on a theme ⇒ cross_method_recurring (not contradiction)", () => {
  const themes = synthesizeThemes([
    rel({ id: "1", methodId: "imairo-120q", themeKey: "resilience", relation: "supports" }),
    rel({ id: "2", methodId: "work-rhythm", themeKey: "resilience", relation: "supports" }),
  ]);
  const t = themes.find((x) => x.theme === "resilience")!;
  assert.equal(t.agreement, "cross_method_recurring", "≥2 distinct methods is cross-method recurrence");
  assert.equal(t.supportingMethodIds.length, 2);
});
check("11A.6 repeated support from ONE method ⇒ within_method_recurring (never cross-method)", () => {
  // Two supporting observations, same method id — longitudinal, not cross-method.
  const sameMethod = synthesizeThemes([
    rel({ id: "1", methodId: "imairo-120q", themeKey: "steadiness", relation: "supports" }),
    rel({ id: "2", methodId: "imairo-120q", themeKey: "steadiness", relation: "supports" }),
  ]).find((t) => t.theme === "steadiness")!;
  assert.equal(sameMethod.agreement, "within_method_recurring", "same-method repetition is within-method");
  assert.equal(sameMethod.supportingMethodIds.length, 1, "one distinct method");
  // Method-less user restatements are also within-method (no cross-method breadth).
  const userRestated = synthesizeThemes([
    rel({ id: "3", methodId: null, themeKey: "worry", relation: "supports" }),
    rel({ id: "4", methodId: null, themeKey: "worry", relation: "supports" }),
  ]).find((t) => t.theme === "worry")!;
  assert.equal(userRestated.agreement, "within_method_recurring", "method-less repetition is not cross-method");
  assert.equal(userRestated.supportingMethodIds.length, 0);
});
check("§7 an explicit support/opposition pair ⇒ contradictory", () => {
  const themes = synthesizeThemes([
    rel({ id: "1", methodId: "imairo-120q", themeKey: "outgoing", relation: "supports" }),
    rel({ id: "2", methodId: "c02-current-state", themeKey: "outgoing", relation: "opposes" }),
  ]);
  assert.equal(themes.find((x) => x.theme === "outgoing")!.agreement, "contradictory");
});
check("§7 unrelated not mixed; uncertain ≠ contradiction; rejected/deleted excluded", () => {
  const themes = synthesizeThemes([
    rel({ id: "1", themeKey: "focus", relation: "unrelated" }), // excluded from grouping
    rel({ id: "2", themeKey: "calm", relation: "uncertain" }),
    rel({ id: "3", themeKey: "calm", relation: "uncertain" }),
    rel({ id: "4", themeKey: "drive", relation: "opposes", confirmation: "rejected" }), // excluded
    rel({ id: "5", themeKey: "drive", relation: "supports", deleted: true }), // excluded
  ]);
  assert.ok(!themes.some((t) => t.theme === "focus"), "unrelated not surfaced as a theme");
  const calm = themes.find((t) => t.theme === "calm")!;
  assert.equal(calm.agreement, "uncertain", "uncertain is not contradiction");
  assert.ok(!themes.some((t) => t.theme === "drive"), "rejected+deleted excluded");
});
check("§7 user correction changes the effective relation (support→oppose ⇒ contradictory)", () => {
  const a = rel({ id: "1", methodId: "m1", themeKey: "steady", relation: "supports" });
  const b = rel({ id: "2", methodId: "m2", themeKey: "steady", relation: "supports", correctedRelation: "opposes" });
  assert.equal(effectiveRelation(b), "opposes", "corrected relation wins");
  assert.equal(synthesizeThemes([a, b]).find((t) => t.theme === "steady")!.agreement, "contradictory");
});
check("§7 deterministic + no universal score", () => {
  const obs = [rel({ id: "1", methodId: "m1", themeKey: "z", relation: "supports" }), rel({ id: "2", methodId: "m2", themeKey: "a", relation: "supports" }), rel({ id: "3", methodId: "m3", themeKey: "a", relation: "supports" })];
  const one = JSON.stringify(synthesizeThemes(obs));
  const two = JSON.stringify(synthesizeThemes(obs));
  assert.equal(one, two, "deterministic");
  assert.ok(!/score|overall|average/i.test(one), "no universal score in output");
});

console.log("CPV1 — consent (WS-E) + §9 independent permissions");
check("sensitive (birth-data) methods default to session-only + private + no purposes", () => {
  const c = defaultConsent("bazi-four-pillars", "chinese_traditional");
  assert.equal(c.retention, "session_only");
  assert.equal(c.visibility, "private");
  assert.equal(canPersist(c), false);
  assert.equal(canShareToCommunity(c), false);
  for (const p of ["report", "companion", "recommendation", "community", "public", "archive", "legacy"] as const) {
    assert.equal(consentAllows(c, p), false, `default denies ${p}`);
  }
});
check("§9 consent purposes are independent; community needs public_safe + save; legacy needs recipient", () => {
  let c = defaultConsent("imairo-120q", "yorisou_original_assessment");
  c = grantPurpose(c, "recommendation");
  assert.equal(consentAllows(c, "recommendation"), true);
  assert.equal(consentAllows(c, "companion"), false, "recommendation grant did not grant companion");
  c = grantPurpose(c, "community");
  assert.equal(consentAllows(c, "community"), false, "community needs public_safe + save");
  c = { ...c, visibility: "public_safe", saveAcknowledged: true };
  assert.equal(consentAllows(c, "community"), true);
  // legacy requires an explicit recipient (recipient-specific)
  c = grantPurpose(c, "legacy");
  assert.equal(consentAllows(c, "legacy"), false, "legacy needs a recipient");
  assert.equal(consentAllows({ ...c, legacyRecipients: ["recipient-1"] }, "legacy"), true);
});
check("§9 revoking one purpose leaves the others unchanged (applies on next read)", () => {
  let c = grantPurpose(grantPurpose(defaultConsent("m", "yorisou_state"), "recommendation"), "report");
  c = revokePurpose(c, "recommendation");
  assert.equal(consentAllows(c, "recommendation"), false, "revoked");
  assert.equal(consentAllows(c, "report"), true, "report untouched by the revocation");
});

console.log("CPV1 — history (WS-F) + §8 identity + data-rights + deletion");
// A fully-typed base event (all fields incl. R1 11A.1/11A.2 reasonCode).
const ev = (over: Partial<HistoryEvent> & { id: string; type: HistoryEvent["type"] }): HistoryEvent => ({
  methodId: null, methodVersion: null, objectKind: null, objectRef: null, at: "t",
  safeDetail: null, reasonCode: null, supersedesVersion: null, priorVersionConfirmed: false, ...over,
});
check("history is append-only; result change preserves prior version + uses userConfirmed", () => {
  let h: HistoryEvent[] = [];
  h = appendEvent(h, ev({ id: "1", type: "method_completed", methodId: "imairo-120q", methodVersion: "v0.1", objectKind: "result", objectRef: "r1", at: "2026-07-19T00:00:00Z" }));
  const change = recordResultChange({ id: "2", methodId: "imairo-120q", resultId: "r1", fromVersion: "v0.1", toVersion: "v0.2", userConfirmed: true, at: "2026-07-19T01:00:00Z" });
  h = appendEvent(h, change);
  assert.equal(h.length, 2, "appended, not overwritten");
  assert.equal(change.supersedesVersion, "v0.1", "prior version preserved");
  assert.equal(change.priorVersionConfirmed, true, "userConfirmed is USED, not ignored");
  assert.ok(/v0.1 → v0.2/.test(buildChangeView(h)[0].what), "change surfaced");
});
check("§8 confirmation targets the EXACT object — not other results/versions of the same method", () => {
  const h: HistoryEvent[] = [
    ev({ id: "e1", type: "result_created", methodId: "m1", methodVersion: "v1", objectKind: "result", objectRef: "resultA", at: "t1", safeDetail: "A" }),
    ev({ id: "e2", type: "result_created", methodId: "m1", methodVersion: "v2", objectKind: "result", objectRef: "resultB", at: "t2", safeDetail: "B" }),
    recordConfirmation({ id: "e3", methodId: "m1", methodVersion: "v1", objectKind: "result", objectRef: "resultA", at: "t3" }),
  ];
  const view = buildChangeView(h);
  assert.equal(view.find((v) => v.objectRef === "resultA")!.userConfirmed, true, "A confirmed");
  assert.equal(view.find((v) => v.objectRef === "resultB")!.userConfirmed, false, "B NOT confirmed by A's confirmation");
});
check("§8 confirmation cannot be inferred from a null/empty object ref", () => {
  const h: HistoryEvent[] = [
    ev({ id: "e1", type: "result_created", methodId: "m1", methodVersion: "v1", objectKind: "result", objectRef: "resultA", at: "t1", safeDetail: "A" }),
    ev({ id: "e2", type: "user_confirmed", methodId: "m1", methodVersion: "v1", objectKind: null, objectRef: null, at: "t2" }),
  ];
  assert.equal(buildChangeView(h).find((v) => v.objectRef === "resultA")!.userConfirmed, false, "null-ref confirmation confirms nothing");
});

// ── 11A.1 — enforced COMPOSITE identity (kind + ref + methodId + methodVersion) ──
check("11A.1 same result id + DIFFERENT method version do NOT share confirmation", () => {
  const h: HistoryEvent[] = [
    ev({ id: "a", type: "result_created", methodId: "m1", methodVersion: "v1", objectKind: "result", objectRef: "R", at: "t1", safeDetail: "v1" }),
    ev({ id: "b", type: "result_created", methodId: "m1", methodVersion: "v2", objectKind: "result", objectRef: "R", at: "t2", safeDetail: "v2" }),
    recordConfirmation({ id: "c", methodId: "m1", methodVersion: "v1", objectKind: "result", objectRef: "R", at: "t3" }),
  ];
  const v = buildChangeView(h);
  assert.equal(v.find((x) => x.methodVersion === "v1")!.userConfirmed, true, "v1 confirmed");
  assert.equal(v.find((x) => x.methodVersion === "v2")!.userConfirmed, false, "v2 NOT confirmed by v1's confirmation");
});
check("11A.1 same object id under DIFFERENT methods do NOT share confirmation", () => {
  assert.notEqual(
    stableIdentity({ objectKind: "result", methodId: "m1", methodVersion: "v1", objectRef: "R" }),
    stableIdentity({ objectKind: "result", methodId: "m2", methodVersion: "v1", objectRef: "R" }),
    "different method ids yield different identity",
  );
});
check("11A.1 observation vs result with the SAME textual id do NOT share confirmation", () => {
  assert.notEqual(
    stableIdentity({ objectKind: "result", methodId: "m1", methodVersion: "v1", objectRef: "X" }),
    stableIdentity({ objectKind: "observation", methodId: "m1", methodVersion: "v1", objectRef: "X" }),
    "different kinds yield different identity",
  );
});
check("11A.1 null method/version fail SAFE where identity requires them (no confirmation)", () => {
  // A result/observation with a null method or version cannot form an identity.
  assert.equal(stableIdentity({ objectKind: "result", methodId: null, methodVersion: "v1", objectRef: "R" }), null);
  assert.equal(stableIdentity({ objectKind: "result", methodId: "m1", methodVersion: null, objectRef: "R" }), null);
  assert.equal(stableIdentity({ objectKind: null, methodId: "m1", methodVersion: "v1", objectRef: "R" }), null);
  assert.equal(stableIdentity({ objectKind: "result", methodId: "m1", methodVersion: "v1", objectRef: "" }), null);
  // A confirmation event lacking full identity confirms nothing.
  const h: HistoryEvent[] = [
    ev({ id: "a", type: "result_created", methodId: "m1", methodVersion: "v1", objectKind: "result", objectRef: "R", at: "t1", safeDetail: "x" }),
    ev({ id: "b", type: "user_confirmed", methodId: null, methodVersion: null, objectKind: "result", objectRef: "R", at: "t2" }),
  ];
  assert.equal(buildChangeView(h)[0].userConfirmed, false, "identity-incomplete confirmation confirms nothing");
});
check("11A.1 previous versions remain SEPARATELY visible", () => {
  const h: HistoryEvent[] = [
    ev({ id: "a", type: "result_created", methodId: "m1", methodVersion: "v1", objectKind: "result", objectRef: "R", at: "t1", safeDetail: "v1" }),
    recordResultChange({ id: "b", methodId: "m1", resultId: "R", fromVersion: "v1", toVersion: "v2", userConfirmed: false, at: "t2" }),
  ];
  const versions = buildChangeView(h).map((x) => x.methodVersion).sort();
  assert.deepEqual(versions, ["v1", "v2"], "both prior and new version visible");
});

// ── 11A.2 — data-rights audit rejects personal free text ──────────────────────
check("11A.2 data-rights events exist for every audited right + carry a reason code (no free text)", () => {
  const types = ["user_forgot", "user_exported", "downstream_revoked", "method_consent_changed", "companion_permission_changed", "recommendation_permission_changed", "community_permission_changed", "archive_permission_changed", "legacy_designation_changed"] as const;
  for (const t of types) {
    const e = recordDataRightsEvent({ id: "x", type: t, objectKind: "permission", objectRef: "obj-1", at: "t", reason: "user_requested" });
    assert.equal(e.type, t);
    assert.equal(e.objectRef, "obj-1", "targets an exact object");
    assert.equal(e.reasonCode, "user_requested", "carries an enumerated reason code");
    assert.equal(e.safeDetail, DATA_RIGHTS_MESSAGES.user_requested, "detail is the internally-generated fixed message");
    assert.ok(dataRightsEventCarriesNoFreeText(e), "no free text possible");
  }
});
check("11A.2 the API has NO caller free-text path; detail is always a fixed enumerated message", () => {
  // Every reason maps to a fixed non-personal message and passes the no-free-text guard.
  for (const reason of ["user_requested", "consent_withdrawn", "retention_expired", "policy_enforced", "export_fulfilled", "downstream_revoked"] as const) {
    const e = recordDataRightsEvent({ id: "y", type: "downstream_revoked", objectKind: "observation", objectRef: "o1", at: "t", reason });
    assert.equal(e.safeDetail, DATA_RIGHTS_MESSAGES[reason]);
    assert.ok(ALLOWED_DATA_RIGHTS_DETAILS.includes(String(e.safeDetail)), "detail is in the fixed allowed set");
  }
  // A hand-forged data-rights event carrying personal free text is REJECTED by the guard.
  const forged: HistoryEvent = ev({ id: "f", type: "user_forgot", objectKind: "observation", objectRef: "o1", safeDetail: "私の生年月日は…", reasonCode: null });
  assert.equal(dataRightsEventCarriesNoFreeText(forged), false, "personal free text / missing reason code is rejected");
});
check("§8 deletion tombstone carries NO personal content", () => {
  const tomb = makeTombstone({ id: "d1", objectKind: "observation", objectRef: "obs-1", at: "t" });
  assert.equal(tomb.type, "user_deleted");
  assert.ok(tombstoneCarriesNoPersonalContent(tomb), "no personal content in tombstone");
  assert.ok(!/answer|birth|name:|私の/.test(String(tomb.safeDetail)), "safeDetail is a fixed non-personal marker");
  assert.ok(dataRightsEventCarriesNoFreeText(tomb), "tombstone passes the no-free-text guard");
});

console.log("CPV1 — WS-A P0 corrections");
check("A1: 120Q result no longer exposes confidence bands or 'too few answers'", () => {
  // The actually-displayed copy must state completion + withhold the band, and
  // must NOT claim too-few-answers.
  const displayed = JSON.stringify(COMPLETION_COPY);
  assert.ok(!displayed.includes("回答数がまだ少ない"), "displayed copy makes no too-few-answers claim");
  assert.ok(/回答完了|回答をもとにしています/.test(displayed), "completion status present");
  assert.ok(/信頼度バンド|確からしさの数値評価/.test(displayed), "confidence band explicitly withheld");
  const shown = read("app/result/reveal/RevealSections.tsx");
  assert.ok(!shown.includes("CONFIDENCE_COPY["), "LimitsPanel no longer reads a confidence band");
  assert.ok(shown.includes("COMPLETION_COPY"), "LimitsPanel shows completion + method instead");
  assert.ok(!read("app/result/page.tsx").includes('LimitsPanel key="limits" band'), "no band passed to LimitsPanel");
});
check("A1: deprecated confidence copy retained only as internal evidence", () => {
  const reveal = read("app/result/reveal/revealContent.ts");
  assert.ok(reveal.includes("CONFIDENCE_COPY_DEPRECATED_DO_NOT_DISPLAY"), "defect retained as internal evidence");
  assert.ok(/DEFECT \+ CORRECTION|WS-A1/.test(reveal), "correction documented in code");
});
check("A2: /check-in (120Q) card badged 120問, relationship-fatigue stays 24問", () => {
  const core = PRODUCT_CARDS.find((c) => c.id === "core-life-state")!;
  assert.equal(core.route_placeholder, "/check-in", "core card is the 120Q route");
  assert.ok(core.badges.includes("120問"), "120Q card badged 120問");
  assert.ok(!core.badges.includes("24問"), "120Q card not mislabeled 24問");
  const relFatigue = PRODUCT_CARDS.find((c) => c.id === "relationship-fatigue")!;
  assert.ok(relFatigue.badges.includes("24問"), "relationship-fatigue keeps 24問");
});
check("A3: nine-family deeper reports reachable from the Deepen journey", () => {
  const idx = read("app/reports/page.tsx");
  assert.ok(idx.includes("APP2_FAMILY_REPORTS") && idx.includes("/reports/family/"), "reports index links family reports");
});
check("A5: LINE surfaces never claim a live/completed provider connection (runtime + framing)", () => {
  // CPV1-R1 §6 — replaced an always-pass (`|| true`) assertion. This exercises
  // RUNTIME behavior (recovery-message output per outcome code) AND the framing.
  for (const code of ["cancelled", "invalid_signature", "expired", "replay", "missing_consent", "malformed"]) {
    const msg = lineRecoveryMessage(code);
    assert.ok(msg.length > 0, `recovery message exists for ${code}`);
    assert.ok(!/連携済み|接続済み|接続しました|連携が完了しました/.test(msg), `${code} message makes no false connection claim`);
  }
  // The app-side contract documents that the real provider handshake stays external.
  assert.ok(/stays external/.test(read("lib/app2/lineCallbackContract.ts")), "handshake documented as external, not live");
  // A malformed callback is handled application-side (no live provider call) and never "ok".
  assert.notEqual(
    evaluateLineCallback({
      secret: "s",
      envelope: { state: "", nonce: "", code: "", intent: "login", returnTo: "/", issuedAt: 0, consent: false, idempotencyKey: "" },
      signature: "x",
      expectation: { state: "s", nonce: "n", ttlMs: 1000 },
      context: { now: 0, consumedStates: [], consumedIdempotencyKeys: [] },
    }).outcome,
    "ok",
  );
});

console.log("CPV1-R1 §10 + 11A.3/11A.4 — fail-closed deployment context + exact-flag preview access");
check("§10/11A.3 deployment context is trusted + FAILS CLOSED to unknown", () => {
  assert.equal(deploymentContext({ VERCEL_ENV: "production" }), "production");
  assert.equal(deploymentContext({ VERCEL_ENV: "preview", NODE_ENV: "production" }), "vercel_preview");
  assert.equal(deploymentContext({ NODE_ENV: "test" }), "test");
  // Trusted local markers only.
  assert.equal(deploymentContext({ NODE_ENV: "development" }), "local");
  assert.equal(deploymentContext({ VERCEL_ENV: "development" }), "local");
  assert.equal(deploymentContext({ YORISOU_LOCAL_DEV: "1" }), "local");
  // 11A.3 — bare `next start` (NODE_ENV=production, no marker), empty, and unknown
  // hosted envs are UNKNOWN (fail closed) — NOT local.
  assert.equal(deploymentContext({ NODE_ENV: "production" }), "unknown");
  assert.equal(deploymentContext({}), "unknown");
  assert.equal(deploymentContext({ SOME_OTHER_HOST: "1" }), "unknown");
});
const REQ = "cpv1_method_universe_preview" as const; // the flag the representative surface requires
const localFlagOn = { NODE_ENV: "development", YORISOU_CPV1_DEV_FLAGS: REQ };
const localFlagOff = { NODE_ENV: "development" };
const localWrongFlag = { NODE_ENV: "development", YORISOU_CPV1_DEV_FLAGS: "cpv1_companion_preview" }; // a DIFFERENT cpv1 flag
const localBogusFlag = { NODE_ENV: "development", YORISOU_CPV1_DEV_FLAGS: "false" }; // 11A.4 non-flag value
const previewFlagOn = { VERCEL_ENV: "preview", NODE_ENV: "production", YORISOU_CPV1_DEV_FLAGS: REQ };
const previewFlagOff = { VERCEL_ENV: "preview", NODE_ENV: "production" };
const prodFlagOn = { VERCEL_ENV: "production", NODE_ENV: "production", YORISOU_CPV1_DEV_FLAGS: REQ };
const prodFlagOff = { VERCEL_ENV: "production", NODE_ENV: "production" };
const unknownFlagOn = { NODE_ENV: "production", YORISOU_CPV1_DEV_FLAGS: REQ }; // no trusted marker → unknown
const access = (env: Record<string, string | undefined>, authenticated: boolean, isFounderAdmin: boolean, routeAuthorized = true) =>
  cpv1PreviewAccess({ authenticated, isFounderAdmin, routeAuthorized, requiredFlag: REQ, env });
check("§10 + 11A.3/11A.4 preview-access matrix (unknown fail-closed + exact flag)", () => {
  // local flag absent → denied
  assert.equal(access(localFlagOff, true, true).allowed, false);
  // local flag present, unauthorized identity → denied
  assert.equal(access(localFlagOn, true, false).allowed, false);
  // local flag present, authorized dev identity → allowed
  assert.equal(access(localFlagOn, true, true).allowed, true);
  // 11A.4 — a DIFFERENT cpv1 flag does NOT authorize the required surface
  assert.equal(access(localWrongFlag, true, true).reason, "denied_flag_off");
  // 11A.4 — a non-flag value ("false") does NOT authorize
  assert.equal(access(localBogusFlag, true, true).reason, "denied_flag_off");
  // preview flag absent → denied
  assert.equal(access(previewFlagOff, true, true).allowed, false);
  // preview unauthenticated → denied
  assert.equal(access(previewFlagOn, false, false).allowed, false);
  // preview ordinary authenticated user → denied
  assert.equal(access(previewFlagOn, true, false).allowed, false);
  // preview Founder/Admin with the EXACT flag → allowed
  assert.equal(access(previewFlagOn, true, true).allowed, true);
  // production flag absent → denied_production
  assert.equal(access(prodFlagOff, true, true).reason, "denied_production");
  // production flag present → STILL denied_production
  assert.equal(access(prodFlagOn, true, true).reason, "denied_production");
  // 11A.3 — unknown context (no trusted marker) → denied_unknown_context, even with flag+auth+admin
  assert.equal(access(unknownFlagOn, true, true).reason, "denied_unknown_context");
  assert.equal(access(unknownFlagOn, true, true).allowed, false);
  // direct URL access without route authorization → denied
  assert.equal(access(previewFlagOn, true, true, false).reason, "denied_route_unauthorized");
});
check("11A.4 flags.ts and deploymentContext.ts share ONE flag interpretation", () => {
  // flags.ts must delegate — it must not re-implement its own env parsing.
  const flagsSrc = read("lib/cpv1/flags.ts");
  assert.ok(/from "\.\/deploymentContext"/.test(flagsSrc), "flags.ts imports the single source");
  assert.ok(!/process\.env\.YORISOU_CPV1_DEV_FLAGS/.test(flagsSrc), "flags.ts does not read the flag env directly");
  assert.ok(!/\.split\(/.test(flagsSrc), "flags.ts does not parse the flag env itself");
});
check("§10 no Founder/Admin identifiers embedded in the decision module", () => {
  const src = read("lib/cpv1/deploymentContext.ts");
  // The decision takes isFounderAdmin as a param; it must not hard-code admin emails/ids.
  assert.ok(!/@[a-z0-9.]+\.(com|jp|test)|admin_email|founderId/i.test(src), "no hard-coded admin identifiers");
});

console.log("CPV1 — program docs present");
check("architecture + flags present", () => {
  assert.ok(has("docs/cpv1/00_CPV1_PROGRAM_ARCHITECTURE.md"));
  assert.ok(has("lib/cpv1/flags.ts") && has("lib/cpv1/rights.ts") && has("lib/cpv1/methods.ts"));
  assert.ok(has("lib/cpv1/understanding.ts") && has("lib/cpv1/consent.ts") && has("lib/cpv1/history.ts"));
});

console.log(`\nCPV1 foundation contract: ${passed} checks passed.`);
