import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// LCO-1 / Gate 5 — the Life OS opens to ordinary authenticated accounts.
//
// The property under test is not "the flag works" but "who gets in, and over whose data". Every
// case below is one of the authority rules the activation mandate specified, and the ones that
// matter most are the denials.

import {
  LIFE_OS_AUTHENTICATED_ENV,
  lifeOsActivationState,
  lifeOsAuthenticatedAccess,
  lifeOsAuthenticatedEnabled,
  lifeOsInternalAccess,
} from "@/lib/life-os/access";
import {
  LIFE_OS_CONSENT_LINES,
  LIFE_OS_CONSENT_VERSION,
  consentIsCurrent,
} from "@/lib/life-os/consent";

const PROD = { VERCEL_ENV: "production" } as Record<string, string | undefined>;
const ON = { ...PROD, [LIFE_OS_AUTHENTICATED_ENV]: "true" };

// ─── the state machine ──────────────────────────────────────────────────────

test("A. AUTHENTICATED is its own state and is NOT PUBLIC", () => {
  assert.equal(lifeOsActivationState(ON), "AUTHENTICATED");
  // PUBLIC means anonymous visitors too. Nothing may return it — opening the Life OS to signed-in
  // accounts was authorised; opening it to everyone was explicitly not.
  for (const env of [ON, PROD, {}, { VERCEL_ENV: "preview" }, { ...PROD, YORISOU_PRIVATE_PILOT_FLAGS: "osf1_life_os_internal" }]) {
    assert.notEqual(lifeOsActivationState(env), "PUBLIC", "a state function returned PUBLIC");
  }
  const source = readFileSync("lib/life-os/access.ts", "utf8");
  assert.ok(!/return "PUBLIC"/.test(source), "some code path returns PUBLIC");
});

test("A. the flag is an EXACT string, and production only", () => {
  assert.equal(lifeOsAuthenticatedEnabled(ON), true);
  for (const nearly of ["TRUE", "True", "1", "yes", " true ", "", "false", "true;"]) {
    assert.equal(
      lifeOsAuthenticatedEnabled({ ...PROD, [LIFE_OS_AUTHENTICATED_ENV]: nearly }),
      nearly === " true " ? true : false,
      `"${nearly}" must not open a personal-data surface`,
    );
  }
  // Non-production cannot be opened by it — those contexts have their own gates.
  for (const ctx of [{ VERCEL_ENV: "preview" }, {}, { VERCEL_ENV: "something-new" }]) {
    assert.equal(lifeOsAuthenticatedEnabled({ ...ctx, [LIFE_OS_AUTHENTICATED_ENV]: "true" }), false);
  }
});

test("A. THE KILL SWITCH: removing the declaration closes it immediately", () => {
  assert.equal(lifeOsActivationState(ON), "AUTHENTICATED");
  assert.equal(lifeOsAuthenticatedAccess({ authenticated: true }, ON).allowed, true);
  // Same environment, declaration removed. No deploy, no migration, no data change.
  const killed: Record<string, string | undefined> = { ...ON };
  killed[LIFE_OS_AUTHENTICATED_ENV] = undefined;
  assert.equal(lifeOsActivationState(killed), "OFF");
  assert.equal(lifeOsAuthenticatedAccess({ authenticated: true }, killed).allowed, false);
  assert.equal(lifeOsAuthenticatedAccess({ authenticated: true }, killed).reason, "flag_off");
});

// ─── who gets in ────────────────────────────────────────────────────────────

test("B. an ANONYMOUS caller is denied even with the flag on", () => {
  const decision = lifeOsAuthenticatedAccess({ authenticated: false }, ON);
  assert.equal(decision.allowed, false);
  assert.equal(decision.reason, "not_authenticated");
});

test("B. an authenticated caller is allowed, and Founder/Admin authority stays separate", () => {
  assert.equal(lifeOsAuthenticatedAccess({ authenticated: true }, ON).allowed, true);
  // INTERNAL is a different question with a different answer: it still needs the pilot token AND
  // Founder/Admin. Opening the Life OS to accounts must not have widened internal capability.
  assert.equal(lifeOsInternalAccess({ authenticated: true, isFounderAdmin: true }, ON).allowed, false);
  assert.equal(lifeOsInternalAccess({ authenticated: true, isFounderAdmin: true }, ON).reason, "flag_off");
  const withPilot = { ...ON, YORISOU_PRIVATE_PILOT_FLAGS: "osf1_life_os_internal" };
  assert.equal(lifeOsInternalAccess({ authenticated: true, isFounderAdmin: false }, withPilot).allowed, false);
  assert.equal(lifeOsInternalAccess({ authenticated: true, isFounderAdmin: true }, withPilot).allowed, true);
});

test("B. the resolver returns the account that passed the gate, never one supplied by a caller", () => {
  const source = readFileSync("lib/server/lifeOs/routeAccess.ts", "utf8");
  const start = source.indexOf('if (state === "AUTHENTICATED")');
  assert.ok(start > 0, "the AUTHENTICATED branch is missing");
  const branch = source.slice(start, source.indexOf("if (state !== \"INTERNAL\")", start));
  // The identity comes from the resolved viewer. A branch that read an id from a request, a header
  // or a parameter would let a caller name whose Life OS to open.
  assert.match(branch, /const viewer = await getViewerContext\(\)/);
  assert.match(branch, /viewer\.account\?\.id \|\| viewer\.legacyAccount\?\.id/);
  for (const forbidden of [/request\./, /searchParams/, /headers\(/, /params\./]) {
    assert.ok(!forbidden.test(branch), `the gate reads an identity from the caller (${forbidden})`);
  }
});

test("B. the environment is consulted before the session, so a closed deployment reveals nothing", () => {
  const source = readFileSync("lib/server/lifeOs/routeAccess.ts", "utf8");
  const prodStart = source.indexOf('if (deploymentContext() === "production")');
  const authStart = source.indexOf('if (state === "AUTHENTICATED")');
  const firstViewer = source.indexOf("await getViewerContext()", prodStart);
  assert.ok(prodStart < authStart && authStart < firstViewer,
    "a viewer is resolved before the state is known — a closed deployment would answer differently for a signed-in caller");
});

// ─── consent ────────────────────────────────────────────────────────────────

test("C. the Founder-approved wording is present verbatim, all four lines", () => {
  assert.deepEqual([...LIFE_OS_CONSENT_LINES], [
    "YORISOUは、あなたが自分で残した結果・状態・振り返り・確認した情報を、あとから見返せるようにつなげます。",
    "AIの推測を、あなたが確認した事実として保存することはありません。",
    "保存された内容は、あとから確認・修正・削除できます。",
    "あなたの情報が、他のユーザーに自動で公開されることはありません。",
  ]);
});

test("C. acceptance is versioned — old wording does not carry over", () => {
  assert.equal(consentIsCurrent(null), false);
  assert.equal(consentIsCurrent({ consent_version: LIFE_OS_CONSENT_VERSION, revoked_at: null }), true);
  // A person who agreed to different words has not agreed to these.
  assert.equal(consentIsCurrent({ consent_version: "2020-01-01.v0", revoked_at: null }), false);
  // And a withdrawal counts, whatever the version said.
  assert.equal(consentIsCurrent({ consent_version: LIFE_OS_CONSENT_VERSION, revoked_at: "2026-08-21T00:00:00Z" }), false);
});

test("C. a durable write is refused until consent exists, and a failed read refuses too", () => {
  const guard = readFileSync("lib/server/lifeOs/guard.ts", "utf8");
  assert.match(guard, /options\.mutation && options\.consent !== "granting" && !\(await lifeOsConsentSatisfied\(route\.accountId\)\)/);
  assert.match(guard, /life_os_consent_required/);
  const resolver = readFileSync("lib/server/lifeOs/routeAccess.ts", "utf8");
  // An outage must not become implied agreement.
  assert.match(resolver, /catch \{\s*return \{ allowed: false, reason: "consent_required" \};/);
  assert.match(resolver, /catch \{\s*return false;\s*\}/);
});

test("C. the consent route cannot require consent in order to grant it", () => {
  const route = readFileSync("app/api/life/consent/route.ts", "utf8");
  // ONE guard, with the exception named in it. Route access, schema readiness and authentication
  // all still apply; only the consent condition is lifted, and only for the route that grants it.
  assert.match(route, /requireLifeViewer\(\{ mutation: true, consent: "granting" \}\)/);
  const guard = readFileSync("lib/server/lifeOs/guard.ts", "utf8");
  assert.match(guard, /options\.consent !== "granting"/);
  // The version is the server's, not the caller's: a client that names the version could record
  // agreement to wording it never displayed.
  assert.ok(!/consent_version.*body|body.*consent_version/.test(route));
});

test("C. declining records nothing", () => {
  const ui = readFileSync("app/life/LifeOsConsent.tsx", "utf8");
  const declineIdx = ui.lastIndexOf("LIFE_OS_CONSENT_DECLINE");
  const anchor = ui.lastIndexOf("<a", declineIdx);
  const declineEl = ui.slice(anchor, declineIdx + 200);
  assert.match(declineEl, /href="\/me"/, "declining must simply leave");
  assert.ok(!/fetch\(/.test(declineEl), "declining sends something to the server");
  // No dark pattern: the decline is a real control, not a disabled or hidden one.
  assert.ok(!/disabled/.test(declineEl));
});

test("C. consent storage collects nothing beyond the decision", () => {
  const whole = readFileSync("supabase/migrations/202608220001_lco1_life_os_consent.sql", "utf8");
  // Scoped to the TABLE DEFINITION. The file also re-emits the account-erasure plan, which
  // legitimately mentions other tables' columns (owner_fingerprint among them); scanning the whole
  // file would fail on those and say nothing about what consent stores.
  const sql = whole.slice(
    whole.indexOf("create table if not exists public.yorisou_life_os_consents"),
    whole.indexOf("-- RECORD."),
  );
  for (const forbidden of [/ip_address/i, /user_agent/i, /\bfingerprint\b/i, /\bemail\b/i, /\bnote\b/i, /device/i]) {
    assert.ok(!forbidden.test(sql), `the consent record collects ${forbidden} — recording consent must not become collection`);
  }
  // Exactly the decision, and nothing else.
  assert.match(sql, /owner_account_id text primary key/);
  assert.match(sql, /consent_version text not null/);
  // Owner-linked, so it dies with the account — checked against the whole file, where the plan is.
  assert.match(whole, /\['yorisou_life_os_consents', 'owner_account_id'\]/);
});
