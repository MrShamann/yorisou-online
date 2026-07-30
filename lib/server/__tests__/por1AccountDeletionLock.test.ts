// POR-1 WS5/WS7 — account lock and session semantics.
//
// These assert the two properties that make a deletion honest rather than cosmetic:
//   • a held account cannot act, and cannot be logged back in;
//   • an erased account cannot be resurrected from a cookie the browser still holds.
//
// They exercise the real decision functions, not a restatement of them.

import assert from "node:assert/strict";
import test from "node:test";

import {
  decideAccountAuthentication,
  sessionMayActAsAccount,
} from "../accountDeletionLock";

const LOCKED_AT = "2026-07-30T00:00:00.000Z";

test("an ordinary account authenticates", () => {
  const decision = decideAccountAuthentication({
    storeRecordFound: true,
    deletionLockedAt: null,
  });
  assert.deepEqual(decision, { allowed: true });
});

test("a held account cannot authenticate, whatever the durable state says", () => {
  for (const durableDeletionState of [null, "locked", "requested", "completed", undefined]) {
    const decision = decideAccountAuthentication({
      storeRecordFound: true,
      deletionLockedAt: LOCKED_AT,
      durableDeletionState,
    });
    assert.deepEqual(decision, { allowed: false, reason: "account_deletion_in_progress" });
  }
});

test("a held account may not act through an existing session either", () => {
  // The session cookie is self-contained: deleting stored session objects does not end a session.
  // This is the check that actually stops one.
  assert.equal(sessionMayActAsAccount(LOCKED_AT), false);
  assert.equal(sessionMayActAsAccount(null), true);
  assert.equal(sessionMayActAsAccount(undefined), true);
});

test("an ERASED account is not resurrected by the account-cookie fallback", () => {
  // The record is gone, so no marker can exist. Only the durable job can tell this apart from a
  // transient store miss — and it says the account was erased.
  for (const state of ["database_erasure", "storage_erasure", "identity_erasure", "verifying", "completed"]) {
    const decision = decideAccountAuthentication({
      storeRecordFound: false,
      deletionLockedAt: null,
      durableDeletionState: state,
    });
    assert.deepEqual(decision, { allowed: false, reason: "account_deleted" }, state);
  }
});

test("a held-but-not-yet-erased account reports the in-progress reason, not 'deleted'", () => {
  const decision = decideAccountAuthentication({
    storeRecordFound: false,
    deletionLockedAt: null,
    durableDeletionState: "locked",
  });
  assert.deepEqual(decision, { allowed: false, reason: "account_deletion_in_progress" });
});

test("a store miss with no deletion job keeps the cookie fallback working", () => {
  // The fallback exists so a store blip does not lock people out. Deletion must not take that away
  // from everyone who never asked to be deleted.
  assert.deepEqual(
    decideAccountAuthentication({ storeRecordFound: false, deletionLockedAt: null, durableDeletionState: null }),
    { allowed: true },
  );
});

test("a cancelled or pre-erasure job does not block a cookie-restored login", () => {
  for (const state of ["cancelled", "requested", "identity_verified", "failed_terminal"]) {
    assert.deepEqual(
      decideAccountAuthentication({ storeRecordFound: false, deletionLockedAt: null, durableDeletionState: state }),
      { allowed: true },
      state,
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Session ownership is not `userId` alone.
//
// CPV1 moved session identity into the principal-landing contract, and
// `switchSessionToPrincipalLandingTruth` leaves `userId` null while the contract still names the
// account. A revocation matching only `userId` left a live session object naming a deleted person.
// The rule below mirrors `sessionBelongsToAccount` in accountIdentityDeletion; it is asserted here
// because that module imports `server-only`, and it is asserted END-TO-END by the hosted
// isolated-store probe, which is what found the miss in the first place.
// ─────────────────────────────────────────────────────────────────────────────

type LandingLike = { principalId: string; userProfileId: string; legacyAccountId: string | null };

function belongs(session: { userId: string | null; principalLanding?: LandingLike | null }, id: string) {
  if (session.userId === id) return true;
  const l = session.principalLanding;
  return Boolean(l && (l.principalId === id || l.userProfileId === id || l.legacyAccountId === id));
}

const ACCOUNT = "acct_1785402518337_47ed7b2fa8e6";

test("a session is owned when userId names the account", () => {
  assert.equal(belongs({ userId: ACCOUNT }, ACCOUNT), true);
});

test("a session with userId NULL is still owned when the landing contract names the account", () => {
  // The exact residue the probe found in the isolated bucket after a completed deletion.
  for (const field of ["principalId", "userProfileId", "legacyAccountId"] as const) {
    const landing: LandingLike = { principalId: "x", userProfileId: "y", legacyAccountId: null };
    landing[field] = ACCOUNT as never;
    assert.equal(belongs({ userId: null, principalLanding: landing }, ACCOUNT), true, field);
  }
});

test("an unrelated session is left alone — deletion must not revoke other people", () => {
  assert.equal(
    belongs({ userId: null, principalLanding: { principalId: "a", userProfileId: "b", legacyAccountId: "c" } }, ACCOUNT),
    false,
  );
  assert.equal(belongs({ userId: null, principalLanding: null }, ACCOUNT), false);
  assert.equal(belongs({ userId: null }, ACCOUNT), false);
});
