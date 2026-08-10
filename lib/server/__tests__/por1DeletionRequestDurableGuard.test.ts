// §8 B — POST /api/account/deletion-request must refuse an account whose deletion has COMPLETED,
// even when the ordinary viewer resolver hands back a live-looking record.
//
// THE DEFECT. `getViewerContext` looks an account up in the shared store and, only on a MISS, falls
// back to the cookie behind a durable, fail-closed consult. A STALE HIT is not a miss: when the store
// returns a cached copy of an already-erased account, the record path succeeds and that consult never
// runs. The hosted concurrency acceptance caught it exactly — replaying an erased account's surviving
// cookie, `deletion-status` and `deletion-cancel` answered 401 while this route answered 200 and
// opened a fresh deletion job for someone who no longer exists.
//
// WHAT THESE TESTS ACTUALLY PROVE, STATED HONESTLY. Two things, by two different means:
//
//   1. ORDERING AND SHAPE, asserted against the shipped route source with comments stripped — the
//      guard is present, it runs before `openDeletionJob`, it refuses with the same bounded code as
//      an unauthenticated caller, it keys on the resolved account id, and the route has not been
//      widened onto the permissive deletion surface.
//   2. THE RULE ITSELF, by calling the shipped `deletionHasCompleted` with its durable read injected
//      — completed / in-flight / absent / unreadable. That is the real function, not a paraphrase.
//
// What they do NOT do is execute the Next.js route handler end to end; that needs a running request
// context. The end-to-end proof is the hosted `por1DeletionConcurrency` acceptance, which replays an
// erased account's real surviving cookies against the deployed route in all three combinations and
// requires 401 from every one. These deterministic tests exist so a regression is caught in CI first,
// not so the hosted proof can be skipped.

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROUTE_SOURCE = readFileSync(
  join(HERE, "..", "..", "..", "app", "api", "account", "deletion-request", "route.ts"),
  "utf8",
);
/** Comments explain the fix at length and name the things it deliberately does NOT do, so the
 *  structural guards below must read the CODE, not the prose. */
const ROUTE = ROUTE_SOURCE.replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");

// ── ordering, asserted against the shipped route source ─────────────────────

test("the durable completed-deletion guard runs BEFORE openDeletionJob", () => {
  const guardAt = ROUTE.indexOf("await deletionHasCompleted(");
  const openAt = ROUTE.indexOf("await openDeletionJob(");
  const statusAt = ROUTE.indexOf("readDeletionStatus(");
  assert.ok(guardAt > -1, "the route must consult the durable completed-deletion fact");
  assert.ok(openAt > -1);
  assert.ok(guardAt < openAt, "nothing may be opened before the guard has answered");
  assert.ok(guardAt < statusAt, "and nothing may be read back before it either");
});

test("the guard refuses with the SAME bounded code as an unauthenticated caller", () => {
  // No oracle: nonexistent account, erased account, stale cookie and lookup failure must be
  // indistinguishable from outside.
  const guardAt = ROUTE.indexOf("await deletionHasCompleted(");
  const window = ROUTE.slice(guardAt, guardAt + 200);
  assert.match(window, /authentication_required/, "same bounded refusal");
  assert.match(window, /status:\s*401/, "same status");
  for (const leak of ["deleted", "erased", "stale", "completed_deletion", "already_deleted"]) {
    assert.ok(!window.includes(`error: "${leak}`), `must not disclose ${leak}`);
  }
});

test("the route keeps ORDINARY viewer resolution — it must not widen to the deletion surface", () => {
  // getDeletionSurfaceViewerContext deliberately admits held and in-flight identities so a deletion
  // can be observed while it runs. Adopting it on an INTAKE endpoint would broaden authority, which
  // is the opposite of the fix.
  assert.match(ROUTE, /getViewerContext\(\)/);
  assert.ok(
    !ROUTE.includes("getDeletionSurfaceViewerContext"),
    "intake must not adopt the permissive deletion surface",
  );
});

// ── the runtime rule itself ─────────────────────────────────────────────────
//
// `deletionHasCompleted` is the shared helper both other surfaces already use. Its fail-closed
// behaviour is the part that matters here, so it is exercised directly against a stubbed transport.

test("deletionHasCompleted: a completed durable deletion answers TRUE", async () => {
  const { deletionHasCompleted } = await import("../accountDeletionAuthority");
  assert.equal(await deletionHasCompleted("acct-erased", async () => "completed"), true);
});

test("deletionHasCompleted: a live in-flight deletion answers FALSE, so intake still works", async () => {
  const { deletionHasCompleted } = await import("../accountDeletionAuthority");
  for (const state of ["requested", "identity_verified", "database_erasure", "failed_retryable"]) {
    assert.equal(await deletionHasCompleted("acct-live", async () => state), false, state);
  }
});

test("deletionHasCompleted: no job (null) answers FALSE — absence must not refuse intake", async () => {
  const { deletionHasCompleted } = await import("../accountDeletionAuthority");
  assert.equal(await deletionHasCompleted("acct-normal", async () => null), false);
});

test("deletionHasCompleted: a durable lookup FAILURE fails closed (true), so the route refuses", async () => {
  const { deletionHasCompleted } = await import("../accountDeletionAuthority");
  assert.equal(
    await deletionHasCompleted("acct-unknown", async () => {
      throw new Error("postgrest_rpc_unavailable");
    }),
    true,
    "unknown is not 'no' — an unreadable durable state must refuse, never admit",
  );
});

test("the guard is cookie-agnostic: it keys on the RESOLVED account id, not on which cookie resolved it", () => {
  // The hosted acceptance replays the account cookie alone, the session cookie alone, and both. All
  // three converge on one resolved accountId, so one guard covers every combination — there is no
  // per-cookie branch that could be missed.
  const guardAt = ROUTE.indexOf("await deletionHasCompleted(");
  const window = ROUTE.slice(guardAt, guardAt + 80);
  assert.match(window, /deletionHasCompleted\(accountId\)/, "keyed on the resolved id");
  assert.ok(!ROUTE.includes("yorisou_account\""), "no cookie-name branching in this route");
  assert.ok(!ROUTE.includes("yorisou_session\""), "no cookie-name branching in this route");
});
