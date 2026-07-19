// CPV1 — foundation completion contract (WS-B/C/D/E/F + rights gate).

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  CPV1_METHOD_UNIVERSE,
  getMethod,
  methodActivationState,
  methodPublicallyActivatable,
  publicMethods,
  rightsBlockedMethods,
  blockedAdapter,
} from "@/lib/cpv1/methods";
import { rightsClears, rightsReviewRequired, yorisouOriginal } from "@/lib/cpv1/rights";
import {
  canUseDownstream,
  synthesizeThemes,
  NO_UNIVERSAL_SCORE,
  type Observation,
} from "@/lib/cpv1/understanding";
import { defaultConsent, canPersist, canShareToCommunity } from "@/lib/cpv1/consent";
import { appendEvent, recordResultChange, buildChangeView, type HistoryEvent } from "@/lib/cpv1/history";

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
check("EVERY external/traditional method is rights_blocked + dev-flagged + no compute", () => {
  const external = CPV1_METHOD_UNIVERSE.filter((m) => m.family === "chinese_traditional" || m.family === "western_symbolic");
  assert.ok(external.length >= 10, "many external methods registered");
  for (const m of external) {
    assert.equal(methodActivationState(m), "rights_blocked", `${m.methodId} rights_blocked`);
    assert.equal(m.devFlagged, true, `${m.methodId} dev-flagged`);
    assert.equal(m.logicComplete, false, `${m.methodId} not implemented`);
    assert.equal(m.founderActivated, false, `${m.methodId} not activated`);
    assert.equal(methodPublicallyActivatable(m), false, `${m.methodId} not publicly activatable`);
    assert.equal(rightsClears(m.rights), false, `${m.methodId} rights blocked`);
  }
});
check("MBTI is import/handoff only (never embedded)", () => {
  const m = getMethod("mbti-import-handoff")!;
  assert.ok(/import|handoff|licen/i.test(m.model), "import/handoff model");
  assert.equal(methodPublicallyActivatable(m), false);
});
check("Big Five requires source validation (blocked)", () => {
  const m = getMethod("big-five-ipip")!;
  assert.equal(methodActivationState(m), "rights_blocked");
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

console.log("CPV1 — source-separated understanding (WS-D)");
check("no universal score constant is set", () => assert.equal(NO_UNIVERSAL_SCORE, true));
const baseObs = (over: Partial<Observation>): Observation => ({
  id: "o", sourceClass: "yorisou_original_result", methodId: "imairo-120q", methodVersion: "v0.1",
  createdAt: "2026-07-19T00:00:00Z", rawInputRef: null, derived: "theme-a", evidenceClass: "method_derived",
  confirmation: "unreviewed", userCorrection: null, privacy: "account_private", freshnessAt: "2026-07-19T00:00:00Z",
  permittedDownstream: [], deleted: false, ...over,
});
check("rejected/deleted observations are never used downstream", () => {
  assert.equal(canUseDownstream(baseObs({ confirmation: "rejected", permittedDownstream: ["report"], privacy: "account_private" }), "report"), false);
  assert.equal(canUseDownstream(baseObs({ deleted: true, permittedDownstream: ["report"], privacy: "account_private" }), "report"), false);
});
check("community use requires public_safe + permission", () => {
  assert.equal(canUseDownstream(baseObs({ privacy: "account_private", permittedDownstream: ["community"] }), "community"), false);
  assert.equal(canUseDownstream(baseObs({ privacy: "public_safe", permittedDownstream: ["community"] }), "community"), true);
});
check("companion use requires companion permission scope", () => {
  assert.equal(canUseDownstream(baseObs({ privacy: "account_private", permittedDownstream: ["companion"] }), "companion"), false);
  assert.equal(canUseDownstream(baseObs({ privacy: "companion_permitted", permittedDownstream: ["companion"] }), "companion"), true);
});
check("synthesis reports agreement, not an average; multi-method ⇒ recurring", () => {
  const obs: Observation[] = [
    baseObs({ id: "1", methodId: "imairo-120q", derived: "resilience" }),
    baseObs({ id: "2", methodId: "work-rhythm", derived: "resilience" }),
    baseObs({ id: "3", methodId: "love-distance", derived: "distance" }),
    baseObs({ id: "4", methodId: "imairo-120q", derived: "rejected-theme", confirmation: "rejected" }),
  ];
  const themes = synthesizeThemes(obs, (o) => o.derived);
  const resilience = themes.find((t) => t.theme === "resilience")!;
  assert.equal(resilience.agreement, "recurring");
  assert.equal(resilience.supportingMethodIds.length, 2);
  assert.ok(!themes.some((t) => t.theme === "rejected-theme"), "rejected excluded");
  // deterministic: most-supported first
  assert.equal(themes[0].theme, "resilience");
});

console.log("CPV1 — consent (WS-E)");
check("sensitive (birth-data) methods default to session-only, no persist w/o save", () => {
  const c = defaultConsent("bazi-four-pillars", "chinese_traditional");
  assert.equal(c.retention, "session_only");
  assert.equal(canPersist(c), false);
  assert.equal(canShareToCommunity(c), false);
});
check("community share requires explicit enable + save", () => {
  const c = defaultConsent("imairo-120q", "yorisou_original_assessment");
  assert.equal(canShareToCommunity(c), false);
  assert.equal(canShareToCommunity({ ...c, communityUse: true, saveAcknowledged: true }), true);
});

console.log("CPV1 — history (WS-F)");
check("history is append-only; result change preserves prior version", () => {
  let h: HistoryEvent[] = [];
  h = appendEvent(h, { id: "1", type: "method_completed", methodId: "imairo-120q", methodVersion: "v0.1", objectRef: "r1", at: "2026-07-19T00:00:00Z", safeDetail: null, supersedesVersion: null });
  const change = recordResultChange({ id: "2", methodId: "imairo-120q", fromVersion: "v0.1", toVersion: "v0.2", userConfirmed: false, at: "2026-07-19T01:00:00Z" });
  h = appendEvent(h, change);
  assert.equal(h.length, 2, "appended, not overwritten");
  assert.equal(change.supersedesVersion, "v0.1", "prior version preserved");
  const view = buildChangeView(h);
  assert.ok(view.some((v) => /v0.1 → v0.2/.test(v.what)), "change surfaced");
});

console.log("CPV1 — program docs present");
check("architecture + flags present", () => {
  assert.ok(has("docs/cpv1/00_CPV1_PROGRAM_ARCHITECTURE.md"));
  assert.ok(has("lib/cpv1/flags.ts") && has("lib/cpv1/rights.ts") && has("lib/cpv1/methods.ts"));
  assert.ok(has("lib/cpv1/understanding.ts") && has("lib/cpv1/consent.ts") && has("lib/cpv1/history.ts"));
});

console.log(`\nCPV1 foundation contract: ${passed} checks passed.`);
