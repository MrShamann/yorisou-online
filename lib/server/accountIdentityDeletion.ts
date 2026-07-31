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
  deleteSharedIdentityObject,
  sharedIdentityObjectExists,
  normalizeAccountEmail,
} from "./yorisouData";
import type {
  ConsultationRecord,
  LineWebhookEventRecord,
  PasswordResetTokenRecord,
  SessionRecord,
} from "./yorisouData";
import { SHARED_STORE_PREFIX } from "./identityKeyScope";
import { canonicalLineActivityInventory, canonicalLineActivityResidue } from "./canonicalLineActivity";
import {
  canonicalIdentityLinkResidue,
  eraseCanonicalIdentityLinks,
  readCanonicalIdentityLinks,
  resolveCanonicalIdentityOwner,
} from "./canonicalIdentityLinks";
import { identityLookupKeysFromManifest } from "./canonicalIdentityLinksRollout";
import { provisioningResidue } from "./identityProvisioning";
import {
  isIdentityProvisioningSchemaReady,
  resolveProvisioningMode,
} from "./identityProvisioningRollout";
import {
  isCanonicalLineActivitySchemaReady,
  resolveLineActivityMode,
} from "./canonicalLineActivityRollout";
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
  return lineUserLookupKeyFromDigest(digest);
}

/**
 * The same key, built from the DIGEST the canonical registry holds.
 *
 * The registry deliberately never stores a raw LINE user id, because the object key is already
 * addressed by `sha256(id)` — so the digest is everything erasure needs, and the raw identifier is
 * not kept anywhere it is not required.
 */
function lineUserLookupKeyFromDigest(digest: string) {
  return `${SHARED_PREFIX}/accounts/by-line-user/${digest}.json`;
}

/** The email lookup key from its digest, for the same reason. */
function accountEmailLookupKeyFromDigest(digest: string) {
  return `${SHARED_PREFIX}/accounts/by-email/${digest}.json`;
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

  // POR-1 — the strongly consistent identity scope, asked of the database rather than of a mirror.
  //
  // `account` above came from an object read, and that read is not a reliable statement about what
  // is true right now: measured over 20 controlled overwrite rounds on the isolated Preview
  // transport, it returned the OLD version of a just-overwritten object for more than 25 seconds,
  // served `cf-cache-status: HIT`, while the store already held the new one. A LINE binding that
  // finished two seconds BEFORE a deletion was requested was invisible when the manifest froze
  // fourteen seconds later, and the surviving lookup object was a live login route to an erased
  // account.
  //
  // Every use below is a UNION with what the record showed. That direction is the whole design: a
  // stale read can then only ever WIDEN the destructive scope, never narrow it. Deleting a key that
  // is already absent is success, so a manifest that is too wide costs nothing; a manifest that is
  // too narrow is data that is never erased and never missed.
  const canonicalLinks = await readCanonicalIdentityLinks(accountId);
  const canonicalEmailDigests = (canonicalLinks ?? [])
    .filter((link) => link.kind === "email")
    .map((link) => link.digest);
  const canonicalLineDigests = (canonicalLinks ?? [])
    .filter((link) => link.kind === "line_subject")
    .map((link) => link.digest);

  const [sessions, consultations, resetTokens, lineEvents] = await Promise.all([
    listSessions(),
    listConsultations(),
    listPasswordResetTokens(),
    listLineWebhookEvents(),
  ]);

  const profile = await foundationUserProfileRepository.getByLegacyAccountId(accountId);
  const identities = profile
    ? await foundationAuthIdentityRepository.listByUserProfileId(profile.userProfileId)
    : [];
  const conversations = profile
    ? await foundationConversationRepository.listByUserProfileId(profile.userProfileId)
    : [];

  // LINE activity is scoped by a FINGERPRINT of the subject — sha256 of the LINE user id — so no
  // later stage needs the raw identifier to erase, verify or count, and the frozen manifest never
  // has to carry one.
  //
  // POR-1 correction: this used to be derived by LISTING the shared recent-subject index and
  // filtering it. That made the scope of an erasure depend on a read of the very object whose reads
  // are not consistent — an entry invisible at manifest time would have been left out of the
  // manifest entirely, and therefore never erased and never missed. The subject is a property of
  // the account, so it is taken from the account.
  //
  // POR-1 correction, second pass: taking it from the account is better than listing a shared index,
  // and it is still ONE read of a mirror. The registry's digests are unioned in, so a subject the
  // account record has not caught up with is still erased.
  const lineSubjectFingerprints = [
    ...new Set<string>([
      ...(account.lineUserId
        ? [createHash("sha256").update(account.lineUserId).digest("hex")]
        : []),
      ...canonicalLineDigests,
    ]),
  ];

  // Freeze what the canonical model currently holds for those subjects — the digest, the subject
  // state, the owner fingerprint and the counts. Recorded for the operator, never used as the
  // evidence of erasure: verification re-asks the database, because a frozen count cannot prove
  // anything about a table that has been written since.
  const lineSubjectInventory =
    lineSubjectFingerprints.length > 0 &&
    resolveLineActivityMode({ schemaReady: isCanonicalLineActivitySchemaReady() }) === "canonical"
      ? (await canonicalLineActivityInventory(lineSubjectFingerprints)).map((entry) => ({
          subjectHash: entry.subject_hash,
          subjectState: entry.subject_state,
          ownerFingerprint: entry.owner_fingerprint,
          activeEvents: entry.active_events,
          erasedEvents: entry.erased_events,
        }))
      : undefined;

  // Every lookup key this account can be reached by, from BOTH sources.
  //
  // `emailLookupKey` and `lineLookupKey` stay exactly as they were — a frozen manifest written
  // before this change must still be readable by the executor that resumes it, so their meaning is
  // not allowed to shift. `identityLookupKeys` is the additive union, and it is what the erasure and
  // the verification actually iterate.
  const identityLookupKeys = [
    ...new Set<string>([
      ...(account.email ? [accountEmailLookupKey(account.email)] : []),
      ...(account.lineUserId ? [lineUserLookupKey(account.lineUserId)] : []),
      ...canonicalEmailDigests.map(accountEmailLookupKeyFromDigest),
      ...canonicalLineDigests.map(lineUserLookupKeyFromDigest),
    ]),
  ];

  return {
    primaryAccountKey: accountRecordKey(account.id),
    emailLookupKey: account.email ? accountEmailLookupKey(account.email) : null,
    lineLookupKey: account.lineUserId ? lineUserLookupKey(account.lineUserId) : null,
    identityLookupKeys,
    // Recorded so an operator reading a frozen manifest can tell "the registry said this account had
    // no LINE subject" from "the registry was not deployed yet". Those are different facts and only
    // one of them is evidence.
    canonicalIdentityLinkCount: canonicalLinks ? canonicalLinks.length : null,
    sessionIds: sessions.filter((s: SessionRecord) => sessionBelongsToAccount(s, accountId)).map((s: SessionRecord) => s.id),
    passwordResetHashes: resetTokens
      .filter((token: PasswordResetTokenRecord) => token.accountId === accountId)
      .map((token: PasswordResetTokenRecord) => token.tokenHash),
    consultationIds: consultations
      .filter((c: ConsultationRecord) => c.userId === accountId)
      .map((c: ConsultationRecord) => c.id),
    // Matched by subject DIGEST, not by raw id, so an event belonging to a subject the account
    // record has not caught up with is still named.
    lineEventIds: lineSubjectFingerprints.length
      ? lineEvents
          .filter((e: LineWebhookEventRecord) =>
            Boolean(e.lineUserId) &&
            lineSubjectFingerprints.includes(
              createHash("sha256").update(e.lineUserId as string).digest("hex"),
            ),
          )
          .map((e: LineWebhookEventRecord) => e.id)
      : [],
    recentSubjectFingerprints: [...new Set<string>(lineSubjectFingerprints)],
    lineSubjectInventory,
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
  for (const key of allIdentityLookupKeys(manifest)) {
    await deleteSharedIdentityObject(key);
  }
}

/**
 * Every lookup key a manifest names. The derivation itself is pure and lives in the rollout module,
 * where the permanent tests exercise it directly rather than through a paraphrase.
 */
export function allIdentityLookupKeys(manifest: DeletionTargetManifest): string[] {
  return identityLookupKeysFromManifest(manifest);
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

  // Lookup keys, from the UNION the manifest froze rather than from its two singular fields.
  //
  // The previous shape was `if (manifest.lineLookupKey && ...)`, and that guard is exactly how a
  // surviving lookup went unnoticed: the manifest named no LINE scope, so the check was skipped
  // entirely and the family was not merely unerased but UNLOOKED-AT. A conditional whose false
  // branch is silence cannot report residue it was never pointed at.
  for (const key of allIdentityLookupKeys(manifest)) {
    if (await sharedIdentityObjectExists(key)) {
      residue.push(key.includes("/by-line-user/") ? "line_lookup" : "email_lookup");
      break;
    }
  }

  // THE MANIFEST-INDEPENDENT CHECK.
  //
  // Contract §9: a manifest omission must not make a target family invisible. Everything above is
  // still scoped by what the manifest named, so on its own it can only ever find what the manifest
  // already knew about. This asks the registry directly, by owner FINGERPRINT — which outlives the
  // account id precisely so the question can still be asked after erasure.
  //
  // It holds whatever caused an omission. If the manifest was narrowed by a stale read, by a bug in
  // a future refactor, or by a fixture that built a state the product cannot, an identity link the
  // deletion never erased is still an identity link this count finds.
  const linkResidue = await canonicalIdentityLinkResidue(accountId);
  if (linkResidue !== null && linkResidue > 0) residue.push("canonical_identity_links");

  // And the reachability question a login actually asks, for every subject the manifest froze. A
  // registry row erased while its lookup object survived would pass the count above and still leave
  // a route in; this is the check that refuses to call that clean.
  for (const digest of manifest.recentSubjectFingerprints) {
    if (await resolveCanonicalIdentityOwner("line_subject", digest)) {
      residue.push("line_identity_resolvable");
      break;
    }
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

  // Canonical LINE activity, verified by a COUNT from the same row-locked table the erasure wrote.
  //
  // This is the family that previously could not be verified at all. Its evidence was a re-read of
  // one shared array on a transport with no read-after-write consistency, where "absent" and "we
  // read a stale copy" are the same observation — so a deletion could finalize over activity that
  // was still there. A count of active rows scoped by subject digest has no such ambiguity, and an
  // undetermined result throws rather than reading as zero.
  //
  // The probe counts the SUBJECT BARRIER as well as the rows. Zero active rows is not enough: a
  // subject still in the `active` state has no rows only until LINE sends the next event, and a
  // subject with no registry row at all was never proven erased. Both count as residue, so neither
  // can let a deletion finalize over activity that is one webhook away from existing.
  if (
    resolveLineActivityMode({ schemaReady: isCanonicalLineActivitySchemaReady() }) === "canonical" &&
    manifest.recentSubjectFingerprints.length > 0 &&
    (await canonicalLineActivityResidue(manifest.recentSubjectFingerprints)) > 0
  ) {
    residue.push("canonical_line_activity");
  }

  // Partial provisioning state. A half-finished registration holds the account id and a digest of
  // the email, so leaving one behind leaves an account-linked record of a person who asked to be
  // forgotten — and keeps their email address permanently unregisterable, because the saga is keyed
  // by it. Counted, not inferred from an absent read.
  if (
    resolveProvisioningMode({ schemaReady: isIdentityProvisioningSchemaReady() }) === "durable_saga" &&
    (await provisioningResidue({
      accountId,
      ownerFingerprint: createHash("sha256").update(accountId).digest("hex"),
    })) > 0
  ) {
    residue.push("identity_provisioning");
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
  accountId?: string,
): Promise<void> {
  assertAccountWriteContext(context);
  await deleteSharedIdentityObject(manifest.primaryAccountKey);

  // The canonical links go LAST, after every object they describe.
  //
  // Order, again, for the same reason as everywhere else in this file: a link outliving its object
  // is a registry that over-reports, which a resumed erasure simply re-deletes; an object outliving
  // its link is a key nothing names, which is how the orphan happened. Erasing the link first would
  // manufacture exactly that state at every crash point between the two.
  //
  // Content-free by construction — the CHECK constraint on the table refuses a tombstone that still
  // carries an owner or a digest, so this cannot half-erase.
  if (accountId) await eraseCanonicalIdentityLinks(accountId);
}
