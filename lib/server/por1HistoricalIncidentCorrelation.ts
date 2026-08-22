// POR-1 — historical incident CORRELATION. Not membership, and deliberately not called proof.
//
// WHAT THIS MODULE IS ALLOWED TO CONCLUDE, AND WHY THE NAME CHANGED.
//
// Three revisions of this rule were refused, and the third was refused for the most important
// reason. The first matched an email pattern that survived only in a unit fixture. The second let an
// operator type the window at the command line. The third pinned that window to immutable GitHub and
// Vercel records — a real improvement — and then still claimed it had PROVEN which accounts were
// synthetic. An independent re-audit rejected the claim, not the engineering, and it was right:
//
//     The pinned window bounds forty-eight minutes of LIVE Production. A real person who registered
//     inside it, did nothing, and asked to be deleted a minute later satisfies every clause here.
//     Nothing in the surviving data records "this account was created by release-check run X".
//
// No further clause fixes that. More timestamps, shorter lifetimes, more zero-artifact checks and
// bigger counts move the probability toward certainty without ever turning correlation into
// provenance, and a deletion tool that mistakes one for the other is the exact failure this whole
// effort exists to prevent.
//
// So this module now answers a smaller, honest question:
//
//     QUALIFIED  — every fail-closed condition the surviving evidence can express holds, so this
//                  candidate is eligible for human incident review.
//     not qualified — some condition does not hold, and it is refused outright.
//
// It NEVER concludes that an account was synthetic, and nothing downstream may treat a qualified
// verdict as authority to destroy anything. Execution requires a separate, single-use,
// Founder-reviewed authority artifact (`por1FounderIncidentAuthority`), whose stated basis is a human
// decision and not a historical fact.
//
// WHAT THE EVIDENCE STILL BUYS. Every clause below is fail-closed and every one narrows the
// population a reviewer must consider — from "any account" down to "accounts the database recorded
// as provisioned, registered and deleted inside a pinned forty-eight-minute deployment interval,
// carrying no product artifact in either of two separately-taken inventories, holding exactly one
// canonical identity". That is a genuinely small, genuinely reviewable set. It is not an identity.
//
// NON-CIRCULARITY. Nothing here reads the account object, the email, the digest or the fingerprint.
// Those are concordance, checked elsewhere; concordance shows records describe the same account and
// says nothing about which execution created it.
//
// THE RULE IS A CONJUNCTION. A missing input is UNQUALIFIED, never "probably fine".

import {
  incidentExecutionWindow,
  POR1_INCIDENT_EVIDENCE_VERSION,
  POR1_PRODUCTION_DELETION_INCIDENT,
  validateIncidentEvidence,
  type HistoricalIncidentEvidence,
} from "./por1HistoricalIncidentEvidence";

/**
 * An ANOMALY GUARD, not a provenance fact.
 *
 * A release check registers an account and deletes it inside one scripted run, so an account that
 * lived materially longer than that is not the thing being recovered even if every other clause
 * holds. It narrows; it never qualifies. On its own it says nothing at all about which execution an
 * account belonged to — which is precisely why the audit refused it as the load-bearing clause and
 * why `classifyHistoricalIncidentCorrelation` applies it after provenance has already been proven.
 */
export const INCIDENT_ANOMALY_MAX_ACCOUNT_LIFETIME_MS = 5 * 60 * 1000;

/**
 * Everything the membership rule is allowed to look at.
 *
 * Every field is a database-written timestamp, a database-written inventory, a live row count, or the
 * VERSION of the pinned contract the candidate was gathered under. There is deliberately no window
 * field: a window cannot be passed in, only derived.
 */
export type IncidentCorrelationEvidence = {
  /** Which pinned contract this candidate was gathered under. Must match the compiled-in version. */
  incidentEvidenceVersion: string | null;

  /** `requested_at` of this owner's identity-provisioning saga. Null when absent. */
  provisioningSagaRequestedAt: string | null;
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
   * Owner-attributable domain artifacts counted live, independently of the manifest. Null when the
   * count could not be taken.
   */
  liveDomainArtifactCount: number | null;
};

export type IncidentCorrelationVerdict =
  | { qualified: true }
  | {
      qualified: false;
      reason:
        | "incident_evidence_contract_invalid"
        | "incident_evidence_version_mismatch"
        | "provisioning_saga_absent"
        | "registration_lease_absent"
        | "deletion_request_absent"
        | "timestamps_unparseable"
        | "deletion_precedes_registration"
        | "provisioning_outside_incident_window"
        | "registration_outside_incident_window"
        | "deletion_request_outside_incident_window"
        | "manifest_absent"
        | "manifest_domain_artifacts_unknown"
        | "manifest_records_domain_artifacts"
        | "manifest_identity_link_count_unexpected"
        | "live_domain_artifacts_unknown"
        | "live_domain_artifacts_present"
        | "account_lifetime_above_anomaly_guard";
    };

/**
 * Parse an instant strictly. Anything unparseable is UNPROVEN, never coerced to a number.
 *
 * An explicit zone is REQUIRED. `Date.parse` treats a timestamp without one as local time, so a naive
 * value read from a column would mean a different moment on a machine in Tokyo than on one in UTC —
 * which could shift a real evening user into the incident window and the genuine incident out of it.
 * Every column this rule reads is `timestamptz` and arrives with an offset; anything else is a
 * surprise, and surprises are refused.
 */
const ZONED = /(?:Z|[+-]\d{2}:?\d{2})$/;

function instant(value: string | null): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  if (!ZONED.test(value.trim())) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Decide whether this candidate is CORRELATED with the historical incident well enough to be put in
 * front of a human. This is not a decision that it belonged to the release-check execution — that
 * fact is not recoverable from what Production kept.
 *
 * Clause order is deliberate and load-bearing.
 *
 * The contract is checked first, because a rule judged against a broken contract is not a rule. Then
 * the three witnesses must EXIST — a candidate the database never recorded provisioning or
 * registering cannot be placed anywhere in time. Then PROVENANCE: all three instants must fall inside
 * the interval derived from the pinned deployments. Only after that do the inventories run, and the
 * anomaly guard runs last of all, where it can subtract but never qualify.
 *
 * @param evidence  what Production persisted about this candidate
 * @param contract  the pinned incident. Injectable so tests can pin a different incident; there is no
 *                  path by which an operator supplies one at runtime.
 * @returns qualified — eligible for review. NEVER "proven synthetic", and never authority to erase.
 */
export function classifyHistoricalIncidentCorrelation(
  evidence: IncidentCorrelationEvidence,
  contract: HistoricalIncidentEvidence = POR1_PRODUCTION_DELETION_INCIDENT,
): IncidentCorrelationVerdict {
  if (validateIncidentEvidence(contract).length > 0) {
    return { qualified: false, reason: "incident_evidence_contract_invalid" };
  }
  if (evidence.incidentEvidenceVersion !== contract.version) {
    return { qualified: false, reason: "incident_evidence_version_mismatch" };
  }

  if (evidence.provisioningSagaRequestedAt === null) {
    return { qualified: false, reason: "provisioning_saga_absent" };
  }
  if (evidence.registrationLeaseAt === null) {
    return { qualified: false, reason: "registration_lease_absent" };
  }
  if (evidence.deletionRequestedAt === null) {
    return { qualified: false, reason: "deletion_request_absent" };
  }

  const provisionedAt = instant(evidence.provisioningSagaRequestedAt);
  const registeredAt = instant(evidence.registrationLeaseAt);
  const requestedAt = instant(evidence.deletionRequestedAt);
  if (provisionedAt === null || registeredAt === null || requestedAt === null) {
    return { qualified: false, reason: "timestamps_unparseable" };
  }
  if (requestedAt < registeredAt) {
    return { qualified: false, reason: "deletion_precedes_registration" };
  }

  // ── The clause an operator cannot influence. ──────────────────────────────
  //
  // Necessary, and knowingly not sufficient: the interval contains live Production traffic, so being
  // inside it does not distinguish release-check residue from a real person who happened to be there.
  //
  // Three independent database-written witnesses of this account's own existence — the provisioning
  // saga, the registration lease, the deletion job — must all fall inside the interval bounded by the
  // two pinned Vercel deployments. Outside it, the deletion capability was not live in Production, so
  // no release-check account could have been created or destroyed there.
  const window = incidentExecutionWindow(contract);
  const opensAt = Date.parse(window.startedAt);
  const closesAt = Date.parse(window.endedAt);

  if (provisionedAt < opensAt || provisionedAt > closesAt) {
    return { qualified: false, reason: "provisioning_outside_incident_window" };
  }
  if (registeredAt < opensAt || registeredAt > closesAt) {
    return { qualified: false, reason: "registration_outside_incident_window" };
  }
  if (requestedAt < opensAt || requestedAt > closesAt) {
    return { qualified: false, reason: "deletion_request_outside_incident_window" };
  }

  // ── The account did nothing, according to two separately taken inventories. ──
  if (!evidence.manifestPresent) return { qualified: false, reason: "manifest_absent" };
  if (evidence.manifestDomainArtifactCount === null) {
    return { qualified: false, reason: "manifest_domain_artifacts_unknown" };
  }
  if (evidence.manifestDomainArtifactCount !== 0) {
    return { qualified: false, reason: "manifest_records_domain_artifacts" };
  }
  // A release-check account is provisioned by email and never links a second identity.
  if (evidence.manifestCanonicalIdentityLinkCount !== 1) {
    return { qualified: false, reason: "manifest_identity_link_count_unexpected" };
  }

  // The manifest is a snapshot taken at the boundary. This is the same question asked again of the
  // live database, so a manifest that was wrong — or written before an artifact appeared — cannot
  // carry the verdict on its own.
  if (evidence.liveDomainArtifactCount === null) {
    return { qualified: false, reason: "live_domain_artifacts_unknown" };
  }
  if (evidence.liveDomainArtifactCount !== 0) {
    return { qualified: false, reason: "live_domain_artifacts_present" };
  }

  // ── ANOMALY GUARD, last, subtractive only. ────────────────────────────────
  if (requestedAt - registeredAt > INCIDENT_ANOMALY_MAX_ACCOUNT_LIFETIME_MS) {
    return { qualified: false, reason: "account_lifetime_above_anomaly_guard" };
  }

  return { qualified: true };
}

/** Re-exported so callers state the version they gathered under without importing two modules. */
export { POR1_INCIDENT_EVIDENCE_VERSION };

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

  // Fail closed on ANY key this rule has never seen, whatever its type. Restricting the check to
  // array-valued keys would let a future manifest record a family as a count, an id or an object and
  // still total zero — a silent zero is the one answer that must never be guessed.
  for (const key of Object.keys(record)) {
    if (MANIFEST_NON_ARTIFACT_KEYS.has(key)) continue;
    if ((MANIFEST_DOMAIN_ARTIFACT_FAMILIES as readonly string[]).includes(key)) continue;
    return null;
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
