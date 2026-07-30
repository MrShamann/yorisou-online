import "server-only";

// POR-1 — the NARROW identity-store deletion adapter.
//
// The database saga erases account-owned rows. It cannot touch the object store, where the
// identity itself lives: the account record, the email index that makes login possible, every
// session, the LINE lookup, password-reset material, and the foundation profile and identities that
// mirror all of it. Deleting the rows while leaving those behind would produce an account that owns
// nothing but can still be logged into — the worst of both outcomes.
//
// EVERY key here is DERIVED from trusted server-side account data or from the frozen manifest.
// Nothing is accepted from a request. There is deliberately no "delete this key" primitive, no
// listing endpoint and no bucket-administration surface: a generic deletion capability reachable
// from the web is a far larger risk than the problem it would solve.
//
// THE MANIFEST IS WHY THE LATE STAGES WORK.
//
// Erasure destroys the account record, and the account record is what names everything else. A stage
// that ran after that and tried to re-enumerate would find nothing and report "nothing to erase" —
// which is indistinguishable from success, and is the most dangerous possible failure mode for a
// deletion. So enumeration happens ONCE, before the crossing, and every later stage reads the frozen
// manifest instead of the deleted account.

import { createHash } from "node:crypto";

import {
  findAccountById,
  listSessions,
  listConsultations,
  listPasswordResetTokens,
  listLineWebhookEvents,
  listRecentLineWebhookSubjects,
  deleteSharedIdentityObject,
  sharedIdentityObjectExists,
  normalizeAccountEmail,
} from "./yorisouData";
import type {
  ConsultationRecord,
  LineWebhookEventRecord,
  PasswordResetTokenRecord,
  RecentLineWebhookSubjectRecord,
  SessionRecord,
} from "./yorisouData";
import { SHARED_STORE_PREFIX } from "./identityKeyScope";
import {
  foundationUserProfileRepository,
  foundationAuthIdentityRepository,
  foundationConversationRepository,
} from "./foundation/repositories";
import { deleteFoundationRecord } from "./foundation/store";
import type { DeletionTargetManifest } from "./accountDeletionExecutor";
import { assertAccountWriteContext, type AccountDeletionContext } from "./accountWriteContext";

const SHARED_PREFIX = SHARED_STORE_PREFIX;

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

function consultationRecordKey(id: string) {
  return `${SHARED_PREFIX}/consultations/${id}.json`;
}

function passwordResetTokenKey(tokenHash: string) {
  return `${SHARED_PREFIX}/password-resets/${tokenHash}.json`;
}

function lineWebhookEventKey(id: string) {
  return `${SHARED_PREFIX}/line-events/${id}.json`;
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
 * Build the manifest. Runs ONCE, before the crossing, while the account still exists.
 *
 * Hashes and stable ids only. A raw password, cookie, email address or LINE id is not needed to
 * delete by, so none is kept: the email and the LINE id appear only inside the hashed lookup keys
 * that the store itself uses.
 *
 * Returns null when the account is already absent — a legitimate resumption state, not a failure.
 */
export async function buildDeletionManifest(accountId: string): Promise<DeletionTargetManifest | null> {
  const account = await findAccountById(accountId);
  if (!account) return null;

  const [sessions, consultations, resetTokens, lineEvents, recentSubjects] = await Promise.all([
    listSessions(),
    listConsultations(),
    listPasswordResetTokens(),
    listLineWebhookEvents(),
    listRecentLineWebhookSubjects(Number.MAX_SAFE_INTEGER),
  ]);

  const profile = await foundationUserProfileRepository.getByLegacyAccountId(accountId);
  const identities = profile
    ? await foundationAuthIdentityRepository.listByUserProfileId(profile.userProfileId)
    : [];
  const conversations = profile
    ? await foundationConversationRepository.listByUserProfileId(profile.userProfileId)
    : [];

  // The recent-subject index is a shared array, not a per-account object, so the entries this
  // account contributed are identified by a FINGERPRINT of the LINE subject rather than by the
  // subject itself — the index must be rewritten without them, and the rewrite must not need the
  // raw id to do it.
  const lineSubjectFingerprints = account.lineUserId
    ? recentSubjects
        .filter((entry: RecentLineWebhookSubjectRecord) => entry.lineUserId === account.lineUserId)
        .map((entry: RecentLineWebhookSubjectRecord) => createHash("sha256").update(entry.lineUserId).digest("hex"))
    : [];

  return {
    primaryAccountKey: accountRecordKey(account.id),
    emailLookupKey: account.email ? accountEmailLookupKey(account.email) : null,
    lineLookupKey: account.lineUserId ? lineUserLookupKey(account.lineUserId) : null,
    sessionIds: sessions.filter((s: SessionRecord) => sessionBelongsToAccount(s, accountId)).map((s: SessionRecord) => s.id),
    passwordResetHashes: resetTokens
      .filter((token: PasswordResetTokenRecord) => token.accountId === accountId)
      .map((token: PasswordResetTokenRecord) => token.tokenHash),
    consultationIds: consultations
      .filter((c: ConsultationRecord) => c.userId === accountId)
      .map((c: ConsultationRecord) => c.id),
    lineEventIds: account.lineUserId
      ? lineEvents
          .filter((e: LineWebhookEventRecord) => e.lineUserId === account.lineUserId)
          .map((e: LineWebhookEventRecord) => e.id)
      : [],
    recentSubjectFingerprints: [...new Set<string>(lineSubjectFingerprints)],
    foundationUserProfileId: profile?.userProfileId ?? null,
    foundationAuthIdentityIds: identities.map((identity) => identity.authIdentityId),
    supportConversationIds: conversations.map((conversation) => conversation.conversationId),
  };
}

/**
 * Enumerate what this account owns, from the stored record only.
 *
 * Kept for the pre-crossing path and for the verification probe. After the crossing the manifest is
 * the only honest source, because the record this reads is gone.
 */
export async function enumerateDeletionTargets(
  accountId: string,
): Promise<IdentityDeletionTargets | null> {
  const manifest = await buildDeletionManifest(accountId);
  if (!manifest) return null;
  return targetsFromManifest(manifest);
}

export function targetsFromManifest(manifest: DeletionTargetManifest): IdentityDeletionTargets {
  return {
    accountRecordKey: manifest.primaryAccountKey,
    emailLookupKey: manifest.emailLookupKey,
    lineLookupKey: manifest.lineLookupKey,
    sessionIds: manifest.sessionIds,
  };
}

/**
 * Revoke every session for the account.
 *
 * Driven by the MANIFEST, not by a fresh listing: a listing taken after the account record is gone
 * cannot resolve ownership through the principal-landing contract, so it would silently revoke
 * nothing. Deleting an already-absent session is success, so this is idempotent by construction.
 *
 * Requires a deletion context. Session objects are account-linked state, and every account-linked
 * write in this product now names the authority under which it happens.
 */
export async function revokeAccountSessions(
  context: AccountDeletionContext,
  manifest: DeletionTargetManifest,
): Promise<number> {
  assertAccountWriteContext(context);
  for (const sessionId of manifest.sessionIds) {
    await deleteSharedIdentityObject(sessionRecordKey(sessionId));
  }
  return manifest.sessionIds.length;
}

/**
 * Delete the login indexes before the primary record.
 *
 * Order matters: if the process dies between steps, an orphaned index that resolves to a missing
 * account is a broken login, whereas an orphaned account with no index is simply unreachable and
 * still deletable on resume.
 */
export async function deleteAccountIndexes(
  context: AccountDeletionContext,
  manifest: DeletionTargetManifest,
): Promise<void> {
  assertAccountWriteContext(context);
  if (manifest.emailLookupKey) await deleteSharedIdentityObject(manifest.emailLookupKey);
  if (manifest.lineLookupKey) await deleteSharedIdentityObject(manifest.lineLookupKey);
}

/**
 * Everything account-linked that is NOT the primary record or its indexes.
 *
 * Password-reset material first: a live reset token is a credential, and leaving one behind would be
 * a way back into an account that no longer exists.
 */
export async function deleteAccountLinkedObjects(
  context: AccountDeletionContext,
  manifest: DeletionTargetManifest,
): Promise<void> {
  assertAccountWriteContext(context);

  for (const tokenHash of manifest.passwordResetHashes) {
    await deleteSharedIdentityObject(passwordResetTokenKey(tokenHash));
  }
  for (const consultationId of manifest.consultationIds) {
    await deleteSharedIdentityObject(consultationRecordKey(consultationId));
  }
  for (const eventId of manifest.lineEventIds) {
    await deleteSharedIdentityObject(lineWebhookEventKey(eventId));
  }

  // The foundation mirror. Its AuthIdentities are the LINE and email login routes in the canonical
  // identity model, so leaving them would leave exactly the login the object-store deletion just
  // closed.
  for (const authIdentityId of manifest.foundationAuthIdentityIds) {
    await deleteFoundationRecord("auth-identities", authIdentityId);
  }
  for (const conversationId of manifest.supportConversationIds) {
    await deleteFoundationRecord("conversations", conversationId);
  }
  if (manifest.foundationUserProfileId) {
    await deleteFoundationRecord("user-profiles", manifest.foundationUserProfileId);
  }
}

export type IdentityErasureVerification = {
  clean: boolean;
  /** Key FAMILIES that still exist — never the key values, which embed identity. */
  residue: string[];
};

/**
 * Prove the erasure. Finalization must not happen on the strength of "we called delete".
 *
 * A PURE READ. It does not repair what it finds, and it must not: a verification that fixed its own
 * failures is a verification that can never fail, which is the same as not having one.
 *
 * Residue is reported as family names ("account_record", "email_lookup") rather than keys: an
 * email-lookup key is a hash of the address, and a session key is a live credential identifier.
 * Neither belongs in a verification result that may be logged.
 */
export async function verifyIdentityErasure(
  accountId: string,
  manifest: DeletionTargetManifest,
): Promise<IdentityErasureVerification> {
  const residue: string[] = [];

  if (await sharedIdentityObjectExists(manifest.primaryAccountKey)) residue.push("account_record");
  if (manifest.emailLookupKey && (await sharedIdentityObjectExists(manifest.emailLookupKey))) {
    residue.push("email_lookup");
  }
  if (manifest.lineLookupKey && (await sharedIdentityObjectExists(manifest.lineLookupKey))) {
    residue.push("line_lookup");
  }

  // Sessions are confirmed by KEY, from the manifest.
  //
  // The object-store list is not immediately consistent: on the isolated Preview transport a list
  // issued milliseconds after a delete still returned the deleted session, and the saga refused to
  // finalize over a phantom. The manifest names exactly what was owned at the moment the gate closed,
  // and nothing could have been added since — the gate was shut.
  for (const sessionId of manifest.sessionIds) {
    if (await sharedIdentityObjectExists(sessionRecordKey(sessionId))) {
      residue.push("sessions");
      break;
    }
  }

  for (const tokenHash of manifest.passwordResetHashes) {
    if (await sharedIdentityObjectExists(passwordResetTokenKey(tokenHash))) {
      residue.push("password_reset");
      break;
    }
  }
  for (const consultationId of manifest.consultationIds) {
    if (await sharedIdentityObjectExists(consultationRecordKey(consultationId))) {
      residue.push("consultations");
      break;
    }
  }
  for (const eventId of manifest.lineEventIds) {
    if (await sharedIdentityObjectExists(lineWebhookEventKey(eventId))) {
      residue.push("line_events");
      break;
    }
  }

  // The foundation mirror, checked through its own repositories rather than by key: the store keeps
  // a legacy prefix as well as the primary one, and a key-level probe of the primary prefix alone
  // would call a record erased while the legacy copy still resolved.
  for (const authIdentityId of manifest.foundationAuthIdentityIds) {
    if (await foundationAuthIdentityRepository.getById(authIdentityId)) {
      residue.push("foundation_auth_identity");
      break;
    }
  }
  if (manifest.foundationUserProfileId) {
    if (await foundationUserProfileRepository.getById(manifest.foundationUserProfileId)) {
      residue.push("foundation_user_profile");
    }
  }

  // The account must be unreachable by its own id — the check a login would make.
  if (await findAccountById(accountId)) residue.push("account_resolvable");

  return { clean: residue.length === 0, residue };
}

export async function deletePrimaryIdentity(
  context: AccountDeletionContext,
  manifest: DeletionTargetManifest,
): Promise<void> {
  assertAccountWriteContext(context);
  await deleteSharedIdentityObject(manifest.primaryAccountKey);
}
