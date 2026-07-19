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
  rightsBlockedMethods,
  blockedAdapter,
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
  recordDataRightsEvent,
  makeTombstone,
  tombstoneCarriesNoPersonalContent,
  buildChangeView,
  type HistoryEvent,
} from "@/lib/cpv1/history";
import { COMPLETION_COPY } from "@/app/result/reveal/revealContent";
import { PRODUCT_CARDS } from "@/app/data/productCards";
import { lineRecoveryMessage, evaluateLineCallback } from "@/lib/app2/lineCallbackContract";

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
check("shipped originals are public-active", () => {
  for (const id of ["imairo-120q", "relationship-fatigue-24q", "f01-work-fit", "love-distance", "name-impression"]) {
    const m = getMethod(id);
    assert.ok(m, `${id} present`);
    assert.equal(methodActivationState(m!), "public_active", `${id} public_active`);
  }
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
// The 9 PROVEN public methods each mount a REAL flow at a real (non-redirect)
// route — not a registry declaration alone. yorisou-values is DOWNGRADED.
const PROVEN_PUBLIC: Array<[string, string]> = [
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
check("§5 exactly 9 public-active methods, each with a real route + flow (not a declaration)", () => {
  const pub = publicMethods().map((m) => m.methodId);
  assert.equal(pub.length, 9, "exactly 9 public-active (corrected from an over-claimed 10)");
  for (const [id, route] of PROVEN_PUBLIC) {
    assert.ok(pub.includes(id), `${id} is public-active`);
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
check("§7 two methods on the same theme do NOT auto-conflict; multiple supports ⇒ recurring", () => {
  const themes = synthesizeThemes([
    rel({ id: "1", methodId: "imairo-120q", themeKey: "resilience", relation: "supports" }),
    rel({ id: "2", methodId: "work-rhythm", themeKey: "resilience", relation: "supports" }),
  ]);
  const t = themes.find((x) => x.theme === "resilience")!;
  assert.equal(t.agreement, "recurring", "same-theme different-methods is not contradiction");
  assert.equal(t.supportingMethodIds.length, 2);
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
check("history is append-only; result change preserves prior version + uses userConfirmed", () => {
  let h: HistoryEvent[] = [];
  h = appendEvent(h, { id: "1", type: "method_completed", methodId: "imairo-120q", methodVersion: "v0.1", objectKind: "result", objectRef: "r1", at: "2026-07-19T00:00:00Z", safeDetail: null, supersedesVersion: null, priorVersionConfirmed: false });
  const change = recordResultChange({ id: "2", methodId: "imairo-120q", resultId: "r1", fromVersion: "v0.1", toVersion: "v0.2", userConfirmed: true, at: "2026-07-19T01:00:00Z" });
  h = appendEvent(h, change);
  assert.equal(h.length, 2, "appended, not overwritten");
  assert.equal(change.supersedesVersion, "v0.1", "prior version preserved");
  assert.equal(change.priorVersionConfirmed, true, "userConfirmed is USED, not ignored");
  assert.ok(/v0.1 → v0.2/.test(buildChangeView(h)[0].what), "change surfaced");
});
check("§8 confirmation targets the EXACT object — not other results/versions of the same method", () => {
  const h: HistoryEvent[] = [
    { id: "e1", type: "result_created", methodId: "m1", methodVersion: "v1", objectKind: "result", objectRef: "resultA", at: "t1", safeDetail: "A", supersedesVersion: null, priorVersionConfirmed: false },
    { id: "e2", type: "result_created", methodId: "m1", methodVersion: "v2", objectKind: "result", objectRef: "resultB", at: "t2", safeDetail: "B", supersedesVersion: null, priorVersionConfirmed: false },
    { id: "e3", type: "user_confirmed", methodId: "m1", methodVersion: "v1", objectKind: "result", objectRef: "resultA", at: "t3", safeDetail: null, supersedesVersion: null, priorVersionConfirmed: false },
  ];
  const view = buildChangeView(h);
  assert.equal(view.find((v) => v.objectRef === "resultA")!.userConfirmed, true, "A confirmed");
  assert.equal(view.find((v) => v.objectRef === "resultB")!.userConfirmed, false, "B NOT confirmed by A's confirmation");
});
check("§8 confirmation cannot be inferred from a null/empty object ref", () => {
  const h: HistoryEvent[] = [
    { id: "e1", type: "result_created", methodId: "m1", methodVersion: "v1", objectKind: "result", objectRef: "resultA", at: "t1", safeDetail: "A", supersedesVersion: null, priorVersionConfirmed: false },
    { id: "e2", type: "user_confirmed", methodId: "m1", methodVersion: "v1", objectKind: null, objectRef: null, at: "t2", safeDetail: null, supersedesVersion: null, priorVersionConfirmed: false },
  ];
  assert.equal(buildChangeView(h).find((v) => v.objectRef === "resultA")!.userConfirmed, false, "null-ref confirmation confirms nothing");
});
check("§8 data-rights events exist for every audited right", () => {
  const types = ["user_forgot", "user_exported", "downstream_revoked", "method_consent_changed", "companion_permission_changed", "recommendation_permission_changed", "community_permission_changed", "archive_permission_changed", "legacy_designation_changed"] as const;
  for (const t of types) {
    const e = recordDataRightsEvent({ id: "x", type: t, objectKind: "permission", objectRef: "obj-1", at: "t" });
    assert.equal(e.type, t);
    assert.equal(e.objectRef, "obj-1", "targets an exact object");
  }
});
check("§8 deletion tombstone carries NO personal content", () => {
  const tomb = makeTombstone({ id: "d1", objectKind: "observation", objectRef: "obs-1", at: "t" });
  assert.equal(tomb.type, "user_deleted");
  assert.ok(tombstoneCarriesNoPersonalContent(tomb), "no personal content in tombstone");
  assert.ok(!/answer|birth|name:|私の/.test(String(tomb.safeDetail)), "safeDetail is a fixed non-personal marker");
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

console.log("CPV1 — program docs present");
check("architecture + flags present", () => {
  assert.ok(has("docs/cpv1/00_CPV1_PROGRAM_ARCHITECTURE.md"));
  assert.ok(has("lib/cpv1/flags.ts") && has("lib/cpv1/rights.ts") && has("lib/cpv1/methods.ts"));
  assert.ok(has("lib/cpv1/understanding.ts") && has("lib/cpv1/consent.ts") && has("lib/cpv1/history.ts"));
});

console.log(`\nCPV1 foundation contract: ${passed} checks passed.`);
