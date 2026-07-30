import "server-only";

// POR-1 — the NARROW identity-store deletion adapter.
//
// The database saga erases account-owned rows. It cannot touch the object store, where the
// identity itself lives: the account record, the email index that makes login possible, every
// session, the LINE lookup, and password-reset material. Deleting the rows while leaving those
// behind would produce an account that owns nothing but can still be logged into — the worst of
// both outcomes.
//
// EVERY key here is DERIVED from trusted server-side account data. Nothing is accepted from a
// request. There is deliberately no "delete this key" primitive, no listing endpoint and no
// bucket-administration surface: a generic deletion capability reachable from the web is a far
// larger risk than the problem it would solve.

import { createHash } from "node:crypto";

import {
  findAccountById,
  listSessions,
  deleteSession,
  deleteSharedIdentityObject,
  sharedIdentityObjectExists,
  normalizeAccountEmail,
} from "./yorisouData";
import type { SessionRecord } from "./yorisouData";

const SHARED_PREFIX = "phase1";

/** The exhaustive set of object families an account owns. Adding one here is a deliberate act. */
export type IdentityDeletionTargets = {
  accountRecordKey: string;
  emailLookupKey: string | null;
  lineLookupKey: string | null;
  sessionIds: string[];
};

function accountRecordKey(id: string) {
  return `${SHARED_PREFIX}/accounts/by-id/${id}.json`;
}

function accountEmailLookupKey(email: string) {
  const digest = createHash("sha256").update(normalizeAccountEmail(email)).digest("hex");
  return `${SHARED_PREFIX}/accounts/by-email/${digest}.json`;
}

function sessionRecordKey(sessionId: string) {
  return `${SHARED_PREFIX}/sessions/${sessionId}.json`;
}

/**
 * The LINE lookup key, derived exactly as the runtime writer derives it.
 *
 * This was wrong: deletion built `accounts/by-line/<raw lineUserId>` while the store writes
 * `accounts/by-line-user/<sha256(lineUserId)>`. So deleting a LINE-bound account left the real
 * index in place — a live login route to an erased person — and the deletion adapter was putting a
 * RAW LINE user id into an object key, which the hashed form exists to avoid. No test caught it
 * because no acceptance identity had ever been LINE-bound.
 */
function lineUserLookupKey(lineUserId: string) {
  const digest = createHash("sha256").update(lineUserId).digest("hex");
  return `${SHARED_PREFIX}/accounts/by-line-user/${digest}.json`;
}

/**
 * Does this session belong to the account, by ANY of the links the product uses?
 *
 * `userId` alone is not the answer. CPV1 moved session identity into the principal-landing
 * contract, and `switchSessionToPrincipalLandingTruth` leaves `userId` null while the contract
 * carries `principalId` / `userProfileId` / `legacyAccountId`. A revocation that matched only
 * `userId` therefore left a live session object naming a deleted person — found by the POR-1
 * isolated-store probe, which listed the bucket after a completed deletion and found one still
 * there.
 *
 * Matching on every link is the point: a residue check that shares the revocation's blind spot
 * cannot see what the revocation missed.
 */
function sessionBelongsToAccount(session: SessionRecord, accountId: string): boolean {
  if (session.userId === accountId) return true;
  const landing = session.principalLanding;
  if (!landing) return false;
  return (
    landing.principalId === accountId ||
    landing.userProfileId === accountId ||
    landing.legacyAccountId === accountId
  );
}

/**
 * Enumerate what this account owns, from the stored record only.
 *
 * Returns null when the account is already absent — which is a legitimate resumption state, not a
 * failure: a job that crashed after deleting the identity must be able to finish.
 */
export async function enumerateDeletionTargets(
  accountId: string,
): Promise<IdentityDeletionTargets | null> {
  const account = await findAccountById(accountId);
  if (!account) return null;

  const sessions = await listSessions();
  return {
    accountRecordKey: accountRecordKey(account.id),
    emailLookupKey: account.email ? accountEmailLookupKey(account.email) : null,
    lineLookupKey: account.lineUserId ? lineUserLookupKey(account.lineUserId) : null,
    // Session ownership comes from the stored session records, never from a caller-supplied list —
    // and by EVERY link, not `userId` alone. This had the same blind spot as the revocation.
    sessionIds: sessions.filter((session) => sessionBelongsToAccount(session, accountId)).map((s) => s.id),
  };
}

/**
 * Revoke every session for the account.
 *
 * Idempotent by construction: deleting an already-absent session is success. This runs BEFORE the
 * destructive steps so a half-completed deletion can never be observed through a live session.
 */
export async function revokeAccountSessions(accountId: string): Promise<number> {
  const sessions = await listSessions();
  const owned = sessions.filter((session) => sessionBelongsToAccount(session, accountId));
  for (const session of owned) {
    await deleteSession(session.id);
  }
  return owned.length;
}

/**
 * Delete the login indexes before the primary record.
 *
 * Order matters: if the process dies between steps, an orphaned index that resolves to a missing
 * account is a broken login, whereas an orphaned account with no index is simply unreachable and
 * still deletable on resume.
 */
export async function deleteAccountIndexes(targets: IdentityDeletionTargets): Promise<void> {
  if (targets.emailLookupKey) await deleteSharedIdentityObject(targets.emailLookupKey);
  if (targets.lineLookupKey) await deleteSharedIdentityObject(targets.lineLookupKey);
}

export async function deletePrimaryIdentity(targets: IdentityDeletionTargets): Promise<void> {
  await deleteSharedIdentityObject(targets.accountRecordKey);
}

export type IdentityErasureVerification = {
  clean: boolean;
  /** Key FAMILIES that still exist — never the key values, which embed identity. */
  residue: string[];
};

/**
 * Prove the erasure. Finalization must not happen on the strength of "we called delete".
 *
 * Residue is reported as family names ("account_record", "email_lookup") rather than keys: an
 * email-lookup key is a hash of the address, and a session key is a live credential identifier.
 * Neither belongs in a verification result that may be logged.
 */
export async function verifyIdentityErasure(
  accountId: string,
  targets: IdentityDeletionTargets,
): Promise<IdentityErasureVerification> {
  const residue: string[] = [];

  if (await sharedIdentityObjectExists(targets.accountRecordKey)) residue.push("account_record");
  if (targets.emailLookupKey && (await sharedIdentityObjectExists(targets.emailLookupKey))) {
    residue.push("email_lookup");
  }
  if (targets.lineLookupKey && (await sharedIdentityObjectExists(targets.lineLookupKey))) {
    residue.push("line_lookup");
  }

  // Sessions are confirmed by KEY, not by trusting the listing.
  //
  // The object-store list is not immediately consistent: on the isolated Preview transport a list
  // issued milliseconds after a delete still returned the deleted session, and the saga refused to
  // finalize over a phantom. Listing is the right way to FIND candidates — a session created after
  // enumeration would otherwise be missed — but only a direct existence probe can say whether one
  // is really still there.
  const sessions = await listSessions();
  const candidates = sessions.filter((session) => sessionBelongsToAccount(session, accountId));
  for (const candidate of candidates) {
    if (await sharedIdentityObjectExists(sessionRecordKey(candidate.id))) {
      residue.push("sessions");
      break;
    }
  }

  // The account must be unreachable by its own id — the check a login would make.
  if (await findAccountById(accountId)) residue.push("account_resolvable");

  return { clean: residue.length === 0, residue };
}
