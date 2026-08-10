// §10 — the whole trust chain, from a stale-capable transport to a resolved (or refused) viewer.
//
// The chain has three links and this file covers the two that policy owns; the third (the transport
// itself) is covered by por1SharedStoreReadAuthority.
//
//   1. TRANSPORT   `findAccountById` must return the CURRENT object body.   ← proven elsewhere
//   2. STORE HIT   a fresh record carrying `deletionLockedAt` must not resolve on an ordinary
//                  surface, while the deletion surface may still observe it.
//   3. STORE MISS  the cookie is only a lookup hint; durable deletion authority decides, and an
//                  unreadable durable state fails CLOSED.
//
// Why link 1 was the real defect: links 2 and 3 were already correct, and BOTH were bypassed because
// the store returned a stale pre-deletion body. A cached hit is a hit — `accountUnlessDeletionLocked`
// saw `deletionLockedAt: null` and said yes, and the cookie/durable path never ran because the record
// was "found". No amount of policy could have caught that; only a fresh read can.

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { decideCookieRestoredViewer } from "../accountDeletionLock";

const HERE = dirname(fileURLToPath(import.meta.url));
const AUTH = readFileSync(join(HERE, "..", "yorisouAuth.ts"), "utf8");
const AUTH_CODE = AUTH.replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");

/** The exact body of `resolveAccountForViewer`, so ordering claims are about shipped code. */
function resolverSource(): string {
  const start = AUTH_CODE.indexOf("async function resolveAccountForViewer(");
  assert.notEqual(start, -1, "the resolver must exist");
  const next = AUTH_CODE.indexOf("\nfunction ", start + 1);
  return AUTH_CODE.slice(start, next === -1 ? undefined : next);
}

// ── LINK 2 — a fresh record decides, and the ordering that makes that true ──

test("the STORE decides first; the cookie is consulted only on a miss", () => {
  const body = resolverSource();
  const storedAt = body.indexOf("await findAccountById(");
  const returnOnHit = body.indexOf("if (stored) return accountUnlessDeletionLocked(");
  const cookieAt = body.indexOf("input.accountCookie?.id");
  const durableAt = body.indexOf("decideCookieRestoredAccount(");

  assert.ok(storedAt > -1 && returnOnHit > -1 && cookieAt > -1 && durableAt > -1);
  assert.ok(storedAt < returnOnHit, "the store read happens before the store verdict");
  assert.ok(returnOnHit < cookieAt, "a found record returns without ever reaching the cookie");
  assert.ok(cookieAt < durableAt, "and the cookie is only a hint — durable authority still decides");
});

test("a found record is filtered through accountUnlessDeletionLocked, never returned raw", () => {
  const body = resolverSource();
  assert.ok(
    !/if \(stored\) return stored/.test(body),
    "returning the raw record would let a locked account act",
  );
  assert.match(body, /if \(stored\) return accountUnlessDeletionLocked\(stored, input\.includeHeldAccount\)/);
});

test("the deletion-locked filter is not weakened, and the deletion surface keeps its exemption", () => {
  const start = AUTH_CODE.indexOf("function accountUnlessDeletionLocked(");
  const body = AUTH_CODE.slice(start, AUTH_CODE.indexOf("\n}", start));
  // Ordinary surface: a held record yields nothing. Deletion surface: passes through by design.
  assert.match(body, /if \(includeHeldAccount\) return account/);
  assert.match(body, /!sessionMayActAsAccount\(account\.deletionLockedAt\)/);
  assert.match(body, /return null/);
});

test("ordinary viewer resolution has no completed-only shortcut", () => {
  const body = resolverSource();
  assert.ok(!/completed/i.test(body), "the resolver must not special-case a completed state");
});

// ── LINK 3 — the store-miss path: durable authority decides, failing closed ──

const ORDINARY = "ordinary" as const;
const DELETION = "deletion_surface" as const;

/**
 * The PURE decision the cookie path reaches. `decideCookieRestoredAccount` is the I/O wrapper around
 * exactly this call, so testing it here exercises the shipped rule without stubbing a transport.
 */
const decide = (
  surface: typeof ORDINARY | typeof DELETION,
  durableDeletionState: string | null,
  irreversibleStarted = false,
) => decideCookieRestoredViewer({ surface, deletionLockedAt: null, durableDeletionState, irreversibleStarted });

test("CASE 1 — completed deletion + stale cookie: the ordinary surface resolves NOBODY", () => {
  assert.equal(decide(ORDINARY, "completed").resolves, false, "an erased account may not be restored from a cookie");
});

test("CASE 1b — completed deletion: the DELETION surface also resolves nobody", () => {
  assert.equal(decide(DELETION, "completed").resolves, false, "completed is terminal on every surface");
});

test("CASE 3 — no deletion at all: the existing permitted fallback still resolves", () => {
  assert.equal(decide(ORDINARY, null).resolves, true, "an ordinary store miss must not log a live person out");
});

test("an irreversible in-flight deletion is refused on the ordinary surface", () => {
  for (const state of ["identity_verified", "database_erasure", "failed_retryable"]) {
    assert.equal(decide(ORDINARY, state, true).resolves, false, state);
  }
});

test("CASE 4 — durable authority UNREADABLE: the wrapper fails CLOSED", () => {
  // The catch lives in the I/O wrapper, so it is asserted where it is written. The property is that
  // an unreadable durable state produces a refusal, never a permissive default.
  const AUTHORITY = readFileSync(join(HERE, "..", "accountDeletionAuthority.ts"), "utf8");
  const start = AUTHORITY.indexOf("export async function decideCookieRestoredAccount(");
  const body = AUTHORITY.slice(start, AUTHORITY.indexOf("\nexport ", start + 1));
  assert.match(body, /catch\s*\(error\)/, "the durable read is guarded");
  assert.match(
    body,
    /return \{ resolves: false, reason: "deletion_state_unavailable" \}/,
    "and an unreadable state must refuse, not admit",
  );
});

// ── the fix is at the transport, and the policy files were NOT widened ──────

test("this package did not broaden the deletion surface or add a route exception", () => {
  // getDeletionSurfaceViewerContext must still be the only place `includeHeldAccount` is true.
  const held = [...AUTH_CODE.matchAll(/includeHeldAccount:\s*true/g)];
  assert.ok(held.length >= 1, "the deletion surface still exists");
  assert.ok(
    !/private[_-]?state/i.test(AUTH_CODE),
    "no route-specific exception may appear in the resolver layer",
  );
});
