// POR-1 — historical synthetic MEMBERSHIP, proven from persisted truth.
//
// WHY THIS MODULE EXISTS.
// The first recovery classifier asked one question — "does the owner's email look like one of ours?"
// — and answered it from a plaintext address. That was wrong twice over. The column it read
// (`link_subject`) does not exist, and the address pattern it matched was never independently
// preserved: the only surviving copy of that namespace is a unit fixture written by the same commit
// that introduced the classifier. A rule whose evidence is its own test fixture proves nothing.
//
// So membership is no longer asserted from an address. It is DERIVED from what Production actually
// persisted while the release check was running, none of which was authored by the classifier or by
// the operator:
//
//   • `yorisou_account_mutation_leases` — the account's own operation trail, written by the database
//     as each governed mutation was taken. Its `account_registration` row IS the provisioning
//     instant.
//   • `yorisou_account_deletion_jobs.requested_at` — when deletion was asked for.
//   • `yorisou_account_deletion_manifests.payload` — the contract-versioned inventory captured at the
//     pre-irreversible boundary, which enumerates every domain artifact the account owned.
//   • a live count of owner-attributable domain rows, taken independently of that manifest.
//   • the release-check window, declared by the operator and corroborated by the deployment record.
//
// NON-CIRCULARITY IS THE POINT. Nothing here reads the account object, the email, the digest or the
// fingerprint. Those still matter — they are how the recovery proves it is holding the SAME account
// this evidence describes — but they are concordance, not membership, and concordance cannot
// establish that an account was synthetic. Identity agreement only ever says "these records belong
// together". This module is what says "and that account was never a person".
//
// THE RULE IS A CONJUNCTION. Every clause must hold. A missing input is UNPROVEN, never "probably
// fine" — the fail-closed default is refusal.

/**
 * The longest an account may have existed, from provisioning to deletion request, and still be
 * treated as release-check residue.
 *
 * Deliberately NOT fitted to the observed incident. A release check registers an account and deletes
 * it within the same scripted run; a person does not create an account and irreversibly destroy it
 * before the account is five minutes old — the product's own deletion flow requires an explicit
 * confirmation step in between. Five minutes is the round bound that expresses "this account never
 * lived a user's life", and it sits an order of magnitude above any scripted run while staying far
 * below any plausible human interval.
 */
export const RELEASE_CHECK_MAX_ACCOUNT_LIFETIME_MS = 5 * 60 * 1000;

/**
 * The widest release-check window the operator may declare.
 *
 * A window is a narrowing device, never a selection device. Bounding its span stops "the release
 * window" from being quietly widened until it contains someone real.
 */
export const RELEASE_CHECK_MAX_WINDOW_MS = 6 * 60 * 60 * 1000;

/** A half-open-free, inclusive instant range. Both bounds are required. */
export type ReleaseCheckWindow = {
  startedAt: string;
  endedAt: string;
};

/**
 * Everything the membership rule is allowed to look at.
 *
 * Every field is either a database-written timestamp, a database-written inventory, a live row
 * count, or the operator's declared window. No account object, no address, no digest.
 */
export type SyntheticMembershipEvidence = {
  /** `issued_at` of this owner's `account_registration` mutation lease. Null when absent. */
  registrationLeaseAt: string | null;
  /** `requested_at` of the deletion job. Null when absent. */
  deletionRequestedAt: string | null;
  /** True only when a `por1-manifest-v1` manifest row exists for the job. */
  manifestPresent: boolean;
  /**
   * The manifest's own count of domain artifacts the account owned at the boundary — consultations,
   * LINE events, support conversations, password resets, recent subjects. Null when unreadable.
   */
  manifestDomainArtifactCount: number | null;
  /** The manifest's canonical identity link count. A release-check account carries exactly one. */
  manifestCanonicalIdentityLinkCount: number | null;
  /**
   * Owner-attributable rows counted live across the canonical domain tables, independently of the
   * manifest. Null when the count could not be taken.
   */
  liveDomainArtifactCount: number | null;
  /** The operator's declared release-check window. Null when not declared. */
  releaseWindow: ReleaseCheckWindow | null;
};

export type SyntheticMembershipVerdict =
  | { proven: true }
  | {
      proven: false;
      reason:
        | "registration_lease_absent"
        | "deletion_request_absent"
        | "timestamps_unparseable"
        | "deletion_precedes_registration"
        | "account_lifetime_above_release_check_bound"
        | "manifest_absent"
        | "manifest_domain_artifacts_unknown"
        | "manifest_records_domain_artifacts"
        | "manifest_identity_link_count_unexpected"
        | "live_domain_artifacts_unknown"
        | "live_domain_artifacts_present"
        | "release_window_undeclared"
        | "release_window_unparseable"
        | "release_window_inverted"
        | "release_window_too_wide"
        | "registration_outside_release_window"
        | "deletion_request_outside_release_window";
    };

/** Parse an instant strictly. Anything unparseable is UNPROVEN, never coerced to a number. */
function instant(value: string | null): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Decide whether this candidate belonged to the historical release-check execution.
 *
 * Clause order is chosen so the cheapest, most specific absence is reported first — an operator
 * reading a refusal should learn which persisted fact was missing, not just that something was.
 */
export function classifyHistoricalSyntheticMembership(
  evidence: SyntheticMembershipEvidence,
): SyntheticMembershipVerdict {
  const registeredAt = instant(evidence.registrationLeaseAt);
  const requestedAt = instant(evidence.deletionRequestedAt);

  if (evidence.registrationLeaseAt === null) {
    return { proven: false, reason: "registration_lease_absent" };
  }
  if (evidence.deletionRequestedAt === null) {
    return { proven: false, reason: "deletion_request_absent" };
  }
  if (registeredAt === null || requestedAt === null) {
    return { proven: false, reason: "timestamps_unparseable" };
  }
  if (requestedAt < registeredAt) {
    return { proven: false, reason: "deletion_precedes_registration" };
  }
  if (requestedAt - registeredAt > RELEASE_CHECK_MAX_ACCOUNT_LIFETIME_MS) {
    return { proven: false, reason: "account_lifetime_above_release_check_bound" };
  }

  if (!evidence.manifestPresent) return { proven: false, reason: "manifest_absent" };
  if (evidence.manifestDomainArtifactCount === null) {
    return { proven: false, reason: "manifest_domain_artifacts_unknown" };
  }
  if (evidence.manifestDomainArtifactCount !== 0) {
    return { proven: false, reason: "manifest_records_domain_artifacts" };
  }
  // A release-check account is provisioned by email and never links a second identity.
  if (evidence.manifestCanonicalIdentityLinkCount !== 1) {
    return { proven: false, reason: "manifest_identity_link_count_unexpected" };
  }

  // The manifest is a snapshot taken at the boundary. This is the same question asked again of the
  // live database, so a manifest that was wrong — or written before an artifact appeared — cannot
  // carry the verdict on its own.
  if (evidence.liveDomainArtifactCount === null) {
    return { proven: false, reason: "live_domain_artifacts_unknown" };
  }
  if (evidence.liveDomainArtifactCount !== 0) {
    return { proven: false, reason: "live_domain_artifacts_present" };
  }

  const window = evidence.releaseWindow;
  if (!window) return { proven: false, reason: "release_window_undeclared" };
  const windowStart = instant(window.startedAt);
  const windowEnd = instant(window.endedAt);
  if (windowStart === null || windowEnd === null) {
    return { proven: false, reason: "release_window_unparseable" };
  }
  if (windowEnd < windowStart) return { proven: false, reason: "release_window_inverted" };
  if (windowEnd - windowStart > RELEASE_CHECK_MAX_WINDOW_MS) {
    return { proven: false, reason: "release_window_too_wide" };
  }
  if (registeredAt < windowStart || registeredAt > windowEnd) {
    return { proven: false, reason: "registration_outside_release_window" };
  }
  if (requestedAt < windowStart || requestedAt > windowEnd) {
    return { proven: false, reason: "deletion_request_outside_release_window" };
  }

  return { proven: true };
}

/**
 * The manifest families that mean "this account did something in the product".
 *
 * Kept as data so a future manifest field cannot be silently omitted from the count: the reader
 * below fails closed on any array-valued family it does not recognise.
 */
export const MANIFEST_DOMAIN_ARTIFACT_FAMILIES = [
  "consultationIds",
  "lineEventIds",
  "supportConversationIds",
  "passwordResetHashes",
  "recentSubjectFingerprints",
] as const;

/**
 * Families a release-check account legitimately carries, which therefore do NOT count as product
 * engagement: its own account key, its own email lookup, its own sessions, its own auth identity.
 */
const MANIFEST_NON_ARTIFACT_KEYS = new Set<string>([
  "sessionIds",
  "lineLookupKey",
  "emailLookupKey",
  "primaryAccountKey",
  "identityLookupKeys",
  "foundationUserProfileId",
  "foundationAuthIdentityIds",
  "canonicalIdentityLinkCount",
  // Only ever populated when `recentSubjectFingerprints` is, which is already counted. Listing it
  // here keeps the fail-closed check on unknown array keys from double-counting the same subjects.
  "lineSubjectInventory",
]);

/**
 * Count the domain artifacts a manifest records.
 *
 * Returns null — UNPROVEN — rather than a number whenever the payload is not the shape this rule
 * was written against. An unrecognised array-valued key is exactly the case where a silent zero
 * would be a lie.
 */
export function countManifestDomainArtifacts(payload: unknown): number | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const record = payload as Record<string, unknown>;

  for (const key of Object.keys(record)) {
    if (MANIFEST_NON_ARTIFACT_KEYS.has(key)) continue;
    if ((MANIFEST_DOMAIN_ARTIFACT_FAMILIES as readonly string[]).includes(key)) continue;
    if (Array.isArray(record[key])) return null;
  }

  let total = 0;
  for (const family of MANIFEST_DOMAIN_ARTIFACT_FAMILIES) {
    const value = record[family];
    if (value === undefined) return null;
    if (!Array.isArray(value)) return null;
    total += value.length;
  }
  return total;
}

/** Read the manifest's canonical identity link count, or null when it is absent or not a count. */
export function readManifestCanonicalIdentityLinkCount(payload: unknown): number | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const value = (payload as Record<string, unknown>).canonicalIdentityLinkCount;
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : null;
}
