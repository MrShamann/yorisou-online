import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import {
  lifeOsAccess,
  lifeOsActivationState,
  lifeOsInternalAccess,
  LIFE_OS_PREVIEW_FLAG,
  LIFE_OS_SCHEMA_READY_ENV,
} from "@/lib/life-os/access";
import { LIFE_OS_AUDIT_ACTIONS, actorFingerprint } from "@/lib/server/lifeOs/audit";
import { REFLECTION_FIELDS, REFLECTION_QUESTIONS } from "@/lib/life-os/contract";

// OSF-1 ACTIVATION PACKAGE — the properties this package must hold, pinned.

const API_DIR = "app/api/life";
const routeFiles = readdirSync(API_DIR).map((d) => join(API_DIR, d, "route.ts")).filter((f) => statSync(f).isFile());

// ── Feature flag: four states, default OFF ───────────────────────────────────

test("the default is OFF in production and in an unknown context", () => {
  assert.equal(lifeOsActivationState({ VERCEL_ENV: "production" }), "OFF");
  assert.equal(lifeOsActivationState({}), "OFF");
  assert.deepEqual(lifeOsAccess({ VERCEL_ENV: "production" }), { allowed: false, reason: "denied_production" });
});

test("PREVIEW requires the exact dev flag; INTERNAL requires the production pilot token", () => {
  assert.equal(lifeOsActivationState({ VERCEL_ENV: "preview" }), "OFF");
  assert.equal(lifeOsActivationState({ VERCEL_ENV: "preview", YORISOU_CPV1_DEV_FLAGS: LIFE_OS_PREVIEW_FLAG }), "PREVIEW");
  assert.equal(
    lifeOsActivationState({ VERCEL_ENV: "production", YORISOU_PRIVATE_PILOT_FLAGS: "osf1_life_os_internal" }),
    "INTERNAL",
  );
});

test("INTERNAL is production-only AND Founder/Admin-only — never one without the other", () => {
  const prod = { VERCEL_ENV: "production", YORISOU_PRIVATE_PILOT_FLAGS: "osf1_life_os_internal" };
  assert.deepEqual(lifeOsInternalAccess({ authenticated: true, isFounderAdmin: true }, prod), {
    allowed: true, reason: "internal_founder_admin",
  });
  assert.equal(lifeOsInternalAccess({ authenticated: true, isFounderAdmin: false }, prod).reason, "not_founder_admin");
  assert.equal(lifeOsInternalAccess({ authenticated: false, isFounderAdmin: true }, prod).reason, "not_authenticated");
  // The pilot token cannot open anything outside true production.
  assert.equal(
    lifeOsInternalAccess({ authenticated: true, isFounderAdmin: true }, { VERCEL_ENV: "preview", YORISOU_PRIVATE_PILOT_FLAGS: "osf1_life_os_internal" }).reason,
    "not_production",
  );
});

test("PUBLIC is unreachable from any environment — it is a Gate 5 act, not a variable", () => {
  for (const env of [
    { VERCEL_ENV: "production" },
    { VERCEL_ENV: "production", YORISOU_PRIVATE_PILOT_FLAGS: "osf1_life_os_internal" },
    { VERCEL_ENV: "preview", YORISOU_CPV1_DEV_FLAGS: LIFE_OS_PREVIEW_FLAG },
    { VERCEL_ENV: "production", YORISOU_CPV1_DEV_FLAGS: LIFE_OS_PREVIEW_FLAG, YORISOU_PRIVATE_PILOT_FLAGS: "osf1_life_os_internal", [LIFE_OS_SCHEMA_READY_ENV]: "true" },
  ]) {
    assert.notEqual(lifeOsActivationState(env), "PUBLIC");
  }
});

// ── API: every route gated, none trusting the client ─────────────────────────

test("all six domain routes exist, plus timeline and assistant", () => {
  const names = readdirSync(API_DIR).sort();
  assert.deepEqual(names, ["assistant", "context", "experiences", "goals", "memories", "reflections", "state", "timeline"]);
});

test("every /api/life route goes through the shared guard and never reads an owner from the body", () => {
  for (const file of routeFiles) {
    const source = readFileSync(file, "utf8");
    assert.match(source, /requireLifeViewer\(\{ mutation: (true|false) \}\)/, `${file} does not use the shared guard`);
    assert.match(source, /if \("refusal" in gate\) return gate\.refusal;/, `${file} does not honour a refusal`);
    // The owner may only come from the guard.
    assert.ok(!/body\.(owner|ownerAccountId|user_id|userId|accountId)/.test(source), `${file} reads an owner from the request body`);
    assert.ok(!/getViewerContext/.test(source), `${file} resolves the viewer itself instead of via the guard`);
  }
});

test("the guard checks the feature gate BEFORE the session, and the mutation gate before the body", () => {
  const guard = readFileSync("lib/server/lifeOs/guard.ts", "utf8");
  const gateAt = guard.indexOf("lifeOsAccess()");
  const mutationAt = guard.indexOf("lifeOsMutationAccess()");
  const sessionAt = guard.indexOf("getViewerContext()");
  assert.ok(gateAt >= 0 && mutationAt >= 0 && sessionAt >= 0);
  assert.ok(gateAt < sessionAt, "a closed route must answer identically for signed-in and signed-out callers");
  assert.ok(mutationAt < sessionAt, "a write that cannot succeed must be refused before anything is accepted");
});

test("the old action-switch route is gone — one write path only", () => {
  let existed = true;
  try { statSync("app/api/life-os/route.ts"); } catch { existed = false; }
  assert.equal(existed, false, "two write paths onto the same tables is how audit coverage diverges");
});

// ── Audit ────────────────────────────────────────────────────────────────────

test("every mutating route emits an audit event", () => {
  for (const file of routeFiles) {
    const source = readFileSync(file, "utf8");
    if (!/mutation: true/.test(source)) continue;
    if (file.includes("/timeline/")) continue; // read-only
    assert.match(source, /auditLifeOs\(/, `${file} mutates without an audit event`);
  }
});

test("audit actions are in the life namespace, never the canonical yorisou.exp dictionary", () => {
  for (const action of LIFE_OS_AUDIT_ACTIONS) {
    assert.match(action, /^yorisou\.life\.[a-z_]+\.[a-z_]+$/);
    assert.ok(!action.startsWith("yorisou.exp."), "the canonical dictionary is change-managed and must not be extended here");
  }
});

test("the audit table stores a fingerprint, never an account id", () => {
  const migration = readFileSync("supabase/migrations/202608150001_osf1_life_os_audit_events.sql", "utf8");
  assert.match(migration, /actor_fingerprint text not null/);
  // No COLUMN named owner_account_id. The RPC parameter p_owner_account_id is expected — the raw id
  // is taken as an argument and fingerprinted before insert; that is the whole mechanism.
  const table = /create table if not exists public\.yorisou_life_os_audit_events \(([\s\S]*?)\n\);/.exec(migration);
  assert.ok(table, "the audit table is not where expected");
  assert.ok(!/owner_account_id/.test(table[1]), "an account id column here would need erasure registration and defeat the design");
  // The RPC fingerprints server-side so no caller can store a raw id by mistake.
  assert.match(migration, /encode\(sha256\(convert_to\(p_owner_account_id, 'utf8'\)\), 'hex'\)/);
  // Append-only, enforced by trigger.
  assert.match(migration, /before update or delete on public\.yorisou_life_os_audit_events/);
  // And no retention decision is made here — that is Edward's alone. Checked against CODE, not the
  // prose: the header explains WHY there is no purge function, so the word appears in a comment.
  const sqlOnly = migration.split("\n").filter((line) => !line.trim().startsWith("--")).join("\n");
  assert.ok(
    !/retention_expires_at|create or replace function[^(]*purge/i.test(sqlOnly),
    "retention is a Founder decision, not a migration detail",
  );
});

test("the TypeScript fingerprint matches what the database computes", () => {
  // sha256 of the same bytes; the migration uses sha256(convert_to(id,'utf8')).
  assert.equal(actorFingerprint("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.match(actorFingerprint("owner-1"), /^[0-9a-f]{64}$/);
});

// ── Reflection: five questions ───────────────────────────────────────────────

test("the reflection asks the package's five questions, in order", () => {
  assert.equal(REFLECTION_QUESTIONS.length, 5);
  assert.deepEqual(REFLECTION_FIELDS.map((f) => f.field), ["what_happened", "felt", "tried", "what_followed", "next_time"]);
  assert.deepEqual(REFLECTION_QUESTIONS.map((q) => q.prompt), [
    "何がありましたか。",
    "その時、どう感じましたか。",
    "何を試しましたか。",
    "そのあと、何が起きましたか。",
    "次に活かせそうなことはありますか。",
  ]);
  assert.equal(REFLECTION_QUESTIONS.filter((q) => q.required).length, 1);
});

test("the two new answer columns exist in the migration and in the RPC", () => {
  const migration = readFileSync("supabase/migrations/202608150002_osf1_reflection_five_question_flow.sql", "utf8");
  assert.match(migration, /add column if not exists felt text/);
  assert.match(migration, /add column if not exists tried text/);
  assert.match(migration, /p_felt text/);
  assert.match(migration, /p_tried text/);
  // Additive: the retained columns are not dropped.
  assert.ok(!/drop column/.test(migration.split("ROLLBACK:")[0]), "the retained columns must not be dropped");
});

// ── Timeline: a view, not a graph ────────────────────────────────────────────

test("the timeline stores nothing and asserts no relationship", () => {
  const timeline = readFileSync("lib/server/lifeOs/timeline.ts", "utf8");
  assert.ok(!/insert|rpc\/|POST/.test(timeline.replace(/\/\/.*$/gm, "")), "a timeline that writes is asserting relationships");
  // And it must not reach the assessment side.
  for (const forbidden of ["yorisou_assessment_results", "yorisou_test_results", "canonicalPrivateState", "assessmentAttemptStore"]) {
    assert.ok(!timeline.includes(forbidden), `the timeline must not include ${forbidden} — that is the methodology boundary`);
  }
  // Every read is bounded.
  assert.match(timeline, /const DEFAULT_LIMIT = \d+;/);
});

test("this package created no life-relationships table", () => {
  // Scoped to THIS package's migrations. 202607160002 has a pre-existing candidate-intake table
  // whose name contains "relationship"; it predates the Life OS and is not a Life Graph edge store.
  for (const file of readdirSync("supabase/migrations").filter((f) => f.startsWith("2026081"))) {
    const sql = readFileSync(join("supabase/migrations", file), "utf8");
    const created = [...sql.matchAll(/create table (?:if not exists )?public\.([a-z0-9_]+)/gi)].map((m) => m[1]);
    for (const name of created) {
      assert.ok(
        !/relationship|edge|graph|link/i.test(name),
        `${file} creates ${name} — an edge store is the Life Graph, which this phase does not build`,
      );
    }
  }
});

// ── Return loop: no engagement mechanics ─────────────────────────────────────

test("the return surface contains no streak, counter, or absence measure", () => {
  const source = readFileSync("app/life/ReturnSection.tsx", "utf8");
  const code = source.split("\n").filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join("\n");
  for (const forbidden of ["streak", "日ぶり", "連続", "達成率", "ランキング", "setInterval", "Notification"]) {
    assert.ok(!code.includes(forbidden), `the return surface must not use ${forbidden}`);
  }
  // It renders nothing when there is nothing — no invented encouragement.
  assert.match(source, /if \(!hasAnything\) return null;/);
});

// ── Assistant: bounded ───────────────────────────────────────────────────────

test("the assistant reads no stored record and persists nothing", () => {
  const source = readFileSync("lib/server/lifeOs/reflectionAssistant.ts", "utf8");
  const code = source.split("\n").filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join("\n");
  for (const forbidden of ["listMemories", "listReflections", "listGoals", "getUserContext", "confirmMemory", "createReflection"]) {
    assert.ok(!code.includes(forbidden), `the assistant must not touch ${forbidden}: there is no permission service to gate a memory read`);
  }
  // It routes through the shared provider resolver, not a direct provider call.
  assert.match(source, /resolvePrivateReflectionProviders/);
  // And every output passes the boundary before it can reach a surface.
  assert.match(source, /inspectAiOutput\(combined\)/);
  assert.match(source, /assertAiOutputWithinBoundary\(combined\)/);
});

test("the assistant's prompt forbids the four prohibited outputs by name", () => {
  const source = readFileSync("lib/server/lifeOs/reflectionAssistant.ts", "utf8");
  for (const forbidden of ["診断", "性格を判断", "断定", "心理的な結論"]) {
    assert.ok(source.includes(forbidden), `the prompt must name ${forbidden} as prohibited`);
  }
});
