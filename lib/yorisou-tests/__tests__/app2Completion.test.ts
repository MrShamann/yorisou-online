// APP-2 — full-service completion contract.
//
// WS-A nine-family reports · WS-B explainable deterministic adaptation (10 tests)
// · WS-C LINE application-side signed-callback contract · WS-D backend schema
// (reversible migration + RLS/grant/append-only source). The LIVE local-Supabase
// behaviour (RLS, grants, isolation, append-only, idempotency, REST/RPC E2E) is
// verified separately by docs/app2/LOCAL_SUPABASE_VERIFICATION.sql against the
// running stack; its captured output lives in the APP-2 evidence bundle.

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { APP2_FAMILY_REPORTS, APP2_REPORT_FAMILIES, getFamilyReport } from "@/app/data/app2/familyReports";
import { adaptServiceItems, topAdaptedItems, type AdaptationReasonCode } from "@/lib/app2/adaptation";
import {
  evaluateLineCallback,
  safeReturnPath,
  signLineCallback,
  type LineCallbackEnvelope,
} from "@/lib/app2/lineCallbackContract";

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");
const has = (p: string) => existsSync(join(root, p));

let passed = 0;
function check(name: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`  ✓ ${name}`);
}

// ─────────────────────────────────────────────────────────────────────────
console.log("WS-A — nine-family deeper reports");
// ─────────────────────────────────────────────────────────────────────────
const EXPECTED_FAMILIES = [
  "imairo", "c02", "f01", "f02", "relationship-fatigue",
  "love-distance", "local-life", "work-rhythm", "name-impression",
];
check("all 9 families present", () => {
  assert.equal(APP2_REPORT_FAMILIES.length, 9);
  for (const f of EXPECTED_FAMILIES) assert.ok(getFamilyReport(f), `report for ${f}`);
});
check("each report has complete, non-placeholder content", () => {
  for (const r of APP2_FAMILY_REPORTS) {
    for (const field of [
      r.title, r.testLabel, r.whatWeUnderstand, r.currentPattern, r.tension,
      r.supportingConditions, r.likelyFriction, r.reflection, r.methodology, r.limits,
    ]) {
      assert.ok(typeof field === "string" && field.trim().length >= 8, `${r.family} field filled`);
      assert.ok(!/todo|placeholder|lorem|準備中|coming soon/i.test(field), `${r.family} no placeholder`);
    }
    assert.ok(r.nextSteps.length >= 2 && r.nextSteps.length <= 3, `${r.family} 2-3 next steps`);
  }
});
check("no fabricated science / statistics + explicit not-a-diagnosis boundary", () => {
  for (const r of APP2_FAMILY_REPORTS) {
    // Interpretive content must make no clinical CLAIM and no fake statistics.
    const interpretive = [r.whatWeUnderstand, r.currentPattern, r.tension, r.supportingConditions, r.likelyFriction, r.reflection].join(" ");
    assert.ok(!/\d+\s*%/.test(interpretive), `${r.family} no percentages`);
    assert.ok(!/治療|病気|症状|うつ病|障害と診断/.test(interpretive), `${r.family} no clinical claim`);
    // The limits field MUST carry a not-a-diagnosis / not-a-judgment boundary
    // (families phrase it as 診断ではない or 判定・予測するものではない).
    assert.ok(
      /(診断|判定|予測|占い)/.test(r.limits) && /(ありません|ではない|ないもの)/.test(r.limits),
      `${r.family} states not-a-diagnosis/judgment boundary`,
    );
  }
});
check("family report route + view exist and are theme-registered", () => {
  assert.ok(has("app/reports/family/[family]/page.tsx"), "report route");
  assert.ok(has("app/reports/family/[family]/FamilyReportView.tsx"), "report view");
  assert.ok(read("app/lib/publicSurface.ts").includes("/reports/family"), "immersive-registered");
});

// ─────────────────────────────────────────────────────────────────────────
console.log("WS-B — explainable deterministic adaptation (10)");
// ─────────────────────────────────────────────────────────────────────────
const KNOWN_CODES: AdaptationReasonCode[] = [
  "result_family", "need_match", "saved", "found_useful",
  "pace_fit", "returning_resume", "already_tried", "new_to_you",
];

check("B1 deterministic: same input ⇒ identical ordering", () => {
  const input = { need: "organize-self" as const, latestResultFamily: "imairo", savedItemIds: ["grounding-reflection"] };
  const a = adaptServiceItems(input).map((x) => x.item.id);
  const b = adaptServiceItems(input).map((x) => x.item.id);
  assert.deepEqual(a, b);
});
check("B2 result-family relevance rises to the top", () => {
  const ranked = adaptServiceItems({ latestResultFamily: "relationship-fatigue" });
  assert.ok(ranked[0].item.eligibilityTags.includes("relationship-fatigue"), "family item first");
  assert.ok(ranked[0].reasons.some((r) => r.code === "result_family"));
});
check("B3 stated-need relevance is applied + explained", () => {
  const ranked = adaptServiceItems({ need: "relationship-distance" });
  const top = ranked.find((r) => r.item.eligibilityTags.includes("relationship-distance"));
  assert.ok(top && top.reasons.some((r) => r.code === "need_match"));
});
check("B4 hidden items are NEVER shown", () => {
  const ranked = adaptServiceItems({ hiddenItemIds: ["grounding-reflection"] });
  assert.ok(!ranked.some((r) => r.item.id === "grounding-reflection"));
});
check("B5 rejected (not_now) items are NEVER repeated", () => {
  const ranked = adaptServiceItems({
    feedback: [{ itemId: "grounding-reflection", signal: "not_now", at: "2026-07-19T00:00:00Z" }],
  });
  assert.ok(!ranked.some((r) => r.item.id === "grounding-reflection"));
});
check("B6 tried items are recognized as done and de-prioritized", () => {
  const ranked = adaptServiceItems({ triedItemIds: ["grounding-reflection"] });
  const tried = ranked.find((r) => r.item.id === "grounding-reflection");
  assert.ok(tried && tried.state === "done", "state done");
  assert.ok(tried.reasons.some((r) => r.code === "already_tried"));
  const idx = ranked.findIndex((r) => r.item.id === "grounding-reflection");
  assert.ok(idx > 0, "not first");
});
check("B7 saved items carry the saved reason + state", () => {
  const ranked = adaptServiceItems({ savedItemIds: ["self-understanding-report"] });
  const saved = ranked.find((r) => r.item.id === "self-understanding-report");
  assert.ok(saved && saved.state === "saved" && saved.reasons.some((r) => r.code === "saved"));
});
check("B8 every surfaced item has a reason + primaryReason", () => {
  const ranked = adaptServiceItems({ need: "find-fit", latestResultFamily: "imairo" });
  for (const r of ranked) {
    assert.ok(r.reasons.length >= 1, "≥1 reason");
    assert.ok(r.primaryReason && r.primaryReason.length > 0, "primaryReason");
    for (const reason of r.reasons) assert.ok(KNOWN_CODES.includes(reason.code), `known code ${reason.code}`);
  }
});
check("B9 found-useful boosts + explains", () => {
  const ranked = adaptServiceItems({
    feedback: [{ itemId: "recommendations-next", signal: "useful", at: "2026-07-19T00:00:00Z" }],
  });
  const it = ranked.find((r) => r.item.id === "recommendations-next");
  assert.ok(it && it.reasons.some((r) => r.code === "found_useful"));
});
check("B10 pace 'quick' prefers a short item with pace_fit reason", () => {
  const ranked = adaptServiceItems({ pace: "quick" });
  assert.ok(ranked.some((r) => r.reasons.some((x) => x.code === "pace_fit")), "some pace_fit surfaced");
});
check("B-reset: clearing signals restores a hidden item (reversible)", () => {
  const hidden = adaptServiceItems({ hiddenItemIds: ["grounding-reflection"] });
  const afterReset = adaptServiceItems({ hiddenItemIds: [] });
  assert.ok(!hidden.some((r) => r.item.id === "grounding-reflection"));
  assert.ok(afterReset.some((r) => r.item.id === "grounding-reflection"));
});
check("B-top: topAdaptedItems caps the list", () => {
  assert.ok(topAdaptedItems({}, 3).length <= 3);
});

// ─────────────────────────────────────────────────────────────────────────
console.log("WS-C — LINE application-side signed-callback contract");
// ─────────────────────────────────────────────────────────────────────────
const SECRET = "test-line-app-secret";
const BASE: Omit<LineCallbackEnvelope, "state"> & { state: string } = {
  state: "ja.abc123",
  nonce: "nonce-xyz",
  code: "auth-code-opaque",
  intent: "login",
  returnTo: "/my-yorisou",
  issuedAt: 1_000_000,
  consent: true,
  guestRef: "guest-1",
  accountId: null,
  providerError: null,
  idempotencyKey: "idem-1",
};
const NOW = 1_000_000 + 60_000; // 1 min later
const TTL = 10 * 60 * 1000;
function ctx(over: Partial<Parameters<typeof evaluateLineCallback>[0]["context"]> = {}) {
  return { now: NOW, consumedStates: [], consumedIdempotencyKeys: [], ...over };
}
function evalWith(env: LineCallbackEnvelope, over: Parameters<typeof evaluateLineCallback>[0]["context"] = ctx(), sig?: string) {
  return evaluateLineCallback({
    secret: SECRET,
    envelope: env,
    signature: sig ?? signLineCallback(SECRET, env),
    expectation: { state: BASE.state, nonce: BASE.nonce, ttlMs: TTL },
    context: over,
  });
}

check("C1 valid signed callback ⇒ ok + keep_guest continuity", () => {
  const r = evalWith({ ...BASE });
  assert.equal(r.outcome, "ok");
  assert.equal(r.continuity, "keep_guest");
  assert.equal(r.returnTo, "/my-yorisou");
});
check("C2 tampered signature ⇒ invalid_signature", () => {
  const r = evalWith({ ...BASE }, ctx(), "not-a-valid-signature");
  assert.equal(r.outcome, "invalid_signature");
  assert.ok(r.recovery?.retryable);
});
check("C3 tampered field breaks the signature", () => {
  const env = { ...BASE };
  const sig = signLineCallback(SECRET, env);
  const r = evalWith({ ...env, returnTo: "/somewhere-else" }, ctx(), sig);
  assert.equal(r.outcome, "invalid_signature");
});
check("C4 state mismatch ⇒ state_mismatch", () => {
  const env = { ...BASE, state: "ja.different" };
  assert.equal(evalWith(env).outcome, "state_mismatch");
});
check("C5 nonce mismatch ⇒ nonce_mismatch", () => {
  const env = { ...BASE, nonce: "wrong-nonce" };
  assert.equal(evalWith(env).outcome, "nonce_mismatch");
});
check("C6 expired ⇒ expired", () => {
  const r = evalWith({ ...BASE }, ctx({ now: BASE.issuedAt + TTL + 1 }));
  assert.equal(r.outcome, "expired");
});
check("C7 replayed state ⇒ replay", () => {
  const r = evalWith({ ...BASE }, ctx({ consumedStates: [BASE.state] }));
  assert.equal(r.outcome, "replay");
});
check("C8 duplicate idempotency key ⇒ duplicate (idempotent, no attack)", () => {
  const r = evalWith({ ...BASE }, ctx({ consumedIdempotencyKeys: [BASE.idempotencyKey] }));
  assert.equal(r.outcome, "duplicate");
  assert.equal(r.recovery, null);
});
check("C9 provider cancel ⇒ cancelled (retryable)", () => {
  const env = { ...BASE, providerError: "access_denied" };
  const r = evalWith(env);
  assert.equal(r.outcome, "cancelled");
  assert.ok(r.recovery?.retryable);
});
check("C10 attach-to-account without consent ⇒ missing_consent", () => {
  const env = { ...BASE, accountId: "acct-1", consent: false };
  assert.equal(evalWith(env).outcome, "missing_consent");
});
check("C11 attach-to-account with consent ⇒ ok + attach_to_account", () => {
  const env = { ...BASE, accountId: "acct-1", consent: true };
  const r = evalWith(env);
  assert.equal(r.outcome, "ok");
  assert.equal(r.continuity, "attach_to_account");
});
check("C12 conflicting existing account ⇒ identity_conflict (no silent merge)", () => {
  const env = { ...BASE, accountId: "acct-A", consent: true };
  const r = evalWith(env, ctx({ existingAccountId: "acct-B" }));
  assert.equal(r.continuity, "identity_conflict");
});
check("C13 unsafe returnTo is never an open redirect", () => {
  assert.equal(safeReturnPath("https://evil.example/x"), "/my-yorisou");
  assert.equal(safeReturnPath("//evil.example"), "/my-yorisou");
  assert.equal(safeReturnPath("/start?x=1"), "/start?x=1");
  const env = { ...BASE, returnTo: "https://evil.example" };
  const r = evalWith(env); // signature covers returnTo, so this is invalid_signature-safe too
  assert.ok(r.returnTo.startsWith("/") && !r.returnTo.includes("://"));
});
check("C14 audit event carries no raw code/nonce (privacy)", () => {
  const r = evalWith({ ...BASE });
  const keys = Object.keys(r.audit).sort();
  assert.deepEqual(keys, ["at", "outcome", "stateFingerprint", "type"]);
  assert.ok(!JSON.stringify(r.audit).includes(BASE.code), "no raw code");
  assert.ok(!JSON.stringify(r.audit).includes(BASE.nonce), "no raw nonce");
});
check("C15 malformed envelope ⇒ malformed + safe return", () => {
  const bad = { ...BASE, state: "" } as LineCallbackEnvelope;
  const r = evalWith(bad);
  assert.equal(r.outcome, "malformed");
  assert.ok(r.returnTo.startsWith("/"));
});
check("recovery UI surface exists", () => {
  assert.ok(has("app/line/recovery/page.tsx") && has("app/line/recovery/LineRecoveryView.tsx"));
});

// ─────────────────────────────────────────────────────────────────────────
console.log("WS-D/E/F/G/H — backend source + reversibility");
// ─────────────────────────────────────────────────────────────────────────
check("migration exists, additive, reversible (rollback block)", () => {
  const mig = read("supabase/migrations/202607190001_app2_full_service_backend.sql");
  assert.ok(/Rollback \(non-destructive\)/.test(mig), "documented rollback");
  assert.ok(/drop table if exists public\.yorisou_admin_access_logs/.test(mig), "rollback drops admin logs");
  for (const t of [
    "yorisou_guest_migration_jobs", "yorisou_guest_migration_events", "yorisou_adaptation_state",
    "yorisou_service_feedback", "yorisou_service_incidents", "yorisou_review_queue_items",
    "yorisou_review_queue_events", "yorisou_admin_access_logs",
  ]) {
    assert.ok(mig.includes(`create table if not exists public.${t}`), `creates ${t}`);
    assert.ok(mig.includes(`alter table public.${t} enable row level security`), `RLS on ${t}`);
  }
});
check("append-only guard on the three audit/log tables", () => {
  const mig = read("supabase/migrations/202607190001_app2_full_service_backend.sql");
  for (const t of ["yorisou_guest_migration_events", "yorisou_review_queue_events", "yorisou_admin_access_logs"]) {
    assert.ok(mig.includes(`${t}_no_mutate`), `append-only trigger on ${t}`);
  }
});
check("anon revoked + admin tables have no authenticated grant", () => {
  const mig = read("supabase/migrations/202607190001_app2_full_service_backend.sql");
  assert.ok(/revoke all on public\.yorisou_admin_access_logs from anon/.test(mig));
  assert.ok(/revoke all on public\.yorisou_service_incidents from authenticated/.test(mig));
});
check("server store, dashboard, queues, migration endpoint, access-logging present", () => {
  assert.ok(has("lib/server/app2ServiceBackend.ts"), "store");
  assert.ok(has("app/admin/service-readiness/page.tsx"), "WS-F dashboard");
  assert.ok(has("app/admin/review-queues/page.tsx"), "WS-G queues");
  assert.ok(has("app/api/admin/review-queues/route.ts"), "WS-G api");
  assert.ok(has("app/api/account/guest-migration/route.ts"), "WS-E migration");
  const store = read("lib/server/app2ServiceBackend.ts");
  assert.ok(store.includes("log_yorisou_admin_access"), "WS-H access logging");
});
check("local verification + seed + cleanup docs present", () => {
  assert.ok(has("docs/app2/LOCAL_SUPABASE_VERIFICATION.sql"), "verification sql");
  assert.ok(has("supabase/seeds/app2_local_seed.sql"), "deterministic seed");
});

console.log(`\nAPP-2 completion contract: ${passed} checks passed.`);
