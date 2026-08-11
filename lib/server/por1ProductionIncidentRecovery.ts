// POR-1 — candidate selection for the Production deletion-incident recovery, as a pure function.
//
// The 2026-08-10 Production promotion left two release-check accounts stranded: their deletions
// crossed the irreversible boundary, revoked their sessions, closed their mutation gate — and then
// failed at `database_erasure`, leaving them locked out with their data intact and no product path
// to finish. This module decides, and ONLY decides, which jobs the operator recovery tool may hand
// to `executeDeletion()`.
//
// It is pure so the rule can be enumerated by tests rather than discovered in Production. The script
// that uses it owns the guards and the I/O; this owns the judgement.
//
// THE RULE IS A CONJUNCTION, NOT A HEURISTIC. Every condition must hold. Anything that fails even
// one is reported and left strictly alone — a recovery tool that guesses is a deletion tool with
// extra steps.
//
// WHAT CHANGED, AND WHY IT MATTERS.
// The first version proved "synthetic" by matching the owner's plaintext email against an address
// pattern. Two things were wrong with that. The column it read (`link_subject`) does not exist on
// `yorisou_canonical_identity_links` — the executable path could never have run. And the pattern it
// matched was never independently preserved: its only surviving occurrence is a unit fixture from
// the same commit that introduced the rule, so the rule's evidence was its own test data.
//
// Membership now comes from `por1SyntheticMembershipEvidence`, derived from what the database
// actually wrote while the release check ran and bounded by provenance pinned in
// `por1HistoricalIncidentEvidence`. Identity agreement is still required — but it has been demoted to
// what it always was. Concordance proves these records describe the SAME account. It cannot prove
// that account was never a person. Those are separate questions and they now have separate answers.
//
// AND CONCORDANCE MUST NOT BE ASKED AN AMBIGUOUS QUESTION.
// An independent audit found the executable path taking the FIRST active email link it happened to
// read. The schema does not stop an owner having more than one: `yorisou_canonical_identity_links`
// constrains `link_id` and the digest SHAPE, and nothing constrains
// `(owner_account_id, link_kind)`. So a second, conflicting active identity could be silently
// ignored while the first one agreed and the candidate passed. Ambiguity is now a refusal in its own
// right, checked BEFORE any link-derived comparison is trusted.

import {
  POR1_PRODUCTION_DELETION_INCIDENT,
  type HistoricalIncidentEvidence,
} from "./por1HistoricalIncidentEvidence";
import {
  classifyHistoricalSyntheticMembership,
  type SyntheticMembershipEvidence,
} from "./por1SyntheticMembershipEvidence";

/**
 * The reserved incident domain. `.invalid` can never be routed, so it can never reach a person.
 *
 * SUPPORTING EVIDENCE ONLY. This narrows the rule and can never widen it, but it is not the
 * membership proof and must never be asked to be — a `.invalid` address is trivially creatable and
 * says nothing about which execution an account belonged to. The address-pattern marker that used to
 * sit beside it has been deleted rather than repaired: it was fitted to a fixture, not to any
 * preserved record of Production truth, and a conjunct nobody can verify is a conjunct that will
 * refuse the real thing.
 */
const RESERVED_UNROUTABLE_DOMAIN_SUFFIX = ".invalid";

export type IncidentCandidateRow = {
  /** Opaque to this module; used only for reporting. */
  jobFingerprint: string;
  state: string | null;
  executionCursor: string | null;
  irreversible: boolean;
  manifestPresent: boolean;
  ownerNamed: boolean;
  /** A live executor lease means another writer holds it; we must not race. */
  executorLeaseLive: boolean;

  /** Class B — persisted release-check provenance, independent of any identity value. */
  membership: SyntheticMembershipEvidence;

  /**
   * How many ACTIVE canonical email links this owner has. Exactly one is the only answer that lets
   * concordance mean anything; null is "the inventory could not be taken", which is also a refusal.
   */
  activeEmailLinkCount: number | null;
  /**
   * How many ACTIVE canonical identity links of ANY kind this owner has, counted live. Compared with
   * the manifest's own count so a second identity acquired since the boundary cannot pass unseen.
   */
  activeIdentityLinkCount: number | null;
  /**
   * How many `account_registration` mutation leases this owner has. Nothing in the schema constrains
   * `(owner_account_id, operation_code)`, so more than one is legal — and picking the earliest would
   * be choosing which provisioning story to believe.
   */
  registrationLeaseCount: number | null;

  /**
   * Did the authoritative account object's OWN `createdAt` fall inside the pinned incident window?
   *
   * The three membership witnesses are auxiliary rows. This is the account saying when it began, and
   * it closes the gap where those rows could describe a moment the person does not share. Null means
   * it could not be determined, which is refused like any other unproven input.
   */
  accountCreatedWithinIncidentWindow: boolean | null;

  /** Class C — the authoritative account object was read and it is this job's owner. */
  authoritativeAccountPresent: boolean;
  accountIdMatchesOwner: boolean;

  /** Class D — `emailIdentityDigest(normalizeEmail(account.email))` equals the link's `link_digest`. */
  emailDigestConcordant: boolean;

  /** Class E — `identityOwnerFingerprint(owner_account_id)` equals the link's `owner_fingerprint`. */
  ownerFingerprintConcordant: boolean;

  /**
   * Supporting only: the authoritative account's address sits on the reserved unroutable TLD.
   * Null means it could not be determined, which is refused like any other unproven input.
   */
  ownerAddressUnroutable: boolean | null;
};

export type IncidentCandidateVerdict =
  | { action: "resume"; family: "failed_retryable_post_irreversible" }
  | { action: "revisit"; reason: "executor_lease_live" }
  | {
      action: "refuse";
      reason:
        | "not_failed_retryable"
        | "not_irreversible"
        | "cursor_not_database_erasure"
        | "manifest_missing"
        | "owner_not_named"
        | `synthetic_membership_unproven:${string}`
        | "canonical_email_link_absent"
        | "canonical_email_link_ambiguous"
        | "registration_lease_absent"
        | "registration_lease_ambiguous"
        | "identity_link_inventory_unknown"
        | "identity_link_inventory_conflicts_manifest"
        | "authoritative_account_absent"
        | "authoritative_account_owner_mismatch"
        | "email_digest_discordant"
        | "owner_fingerprint_discordant"
        | "account_created_outside_incident_window"
        | "owner_address_routable_or_unknown";
    };

/** Does this address sit on the reserved unroutable TLD? Supporting evidence, never the proof. */
export function isUnroutableReservedAddress(email: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const at = normalized.lastIndexOf("@");
  if (at <= 0 || at === normalized.length - 1) return false;
  return normalized.slice(at + 1).endsWith(RESERVED_UNROUTABLE_DOMAIN_SUFFIX);
}

/**
 * Classify one candidate.
 *
 * Order is deliberate. Structural facts first, so an unrelated real job is refused on its own shape
 * and no identity of any kind is consulted. Then the lease, so we never race a live executor. Then
 * membership — the question concordance cannot answer — and only then the concordance classes that
 * bind the evidence to the account the recovery would actually act on.
 */
export function classifyIncidentCandidate(row: IncidentCandidateRow): IncidentCandidateVerdict {
  if (row.state !== "failed_retryable") return { action: "refuse", reason: "not_failed_retryable" };
  if (!row.irreversible) return { action: "refuse", reason: "not_irreversible" };
  if (row.executionCursor !== "database_erasure") {
    return { action: "refuse", reason: "cursor_not_database_erasure" };
  }
  if (!row.manifestPresent) return { action: "refuse", reason: "manifest_missing" };
  if (!row.ownerNamed) return { action: "refuse", reason: "owner_not_named" };

  // A live lease means some other executor is driving this job right now. Not a refusal forever —
  // come back when it lapses — but absolutely not something to race.
  if (row.executorLeaseLive) return { action: "revisit", reason: "executor_lease_live" };

  // Class B. Proven from persisted execution truth, or not proven at all.
  const membership = classifyHistoricalSyntheticMembership(row.membership);
  if (!membership.proven) {
    return { action: "refuse", reason: `synthetic_membership_unproven:${membership.reason}` };
  }

  // Identity must be UNAMBIGUOUS before any comparison against it is worth making. Taking the first
  // of several active email links would let a conflicting identity be ignored precisely when it
  // matters most, so more than one is refused as firmly as none.
  if (row.activeEmailLinkCount === null || row.activeEmailLinkCount === 0) {
    return { action: "refuse", reason: "canonical_email_link_absent" };
  }
  if (row.activeEmailLinkCount > 1) {
    return { action: "refuse", reason: "canonical_email_link_ambiguous" };
  }
  // Same reasoning, applied to the lease that dates the account's provisioning.
  if (row.registrationLeaseCount === null || row.registrationLeaseCount === 0) {
    return { action: "refuse", reason: "registration_lease_absent" };
  }
  if (row.registrationLeaseCount > 1) {
    return { action: "refuse", reason: "registration_lease_ambiguous" };
  }
  if (row.activeIdentityLinkCount === null) {
    return { action: "refuse", reason: "identity_link_inventory_unknown" };
  }
  // The frozen manifest counted the identities this account had at the boundary. If the live registry
  // now holds a different number, something changed about who this account is, and a recovery must
  // not proceed on a stale picture of that.
  if (row.activeIdentityLinkCount !== row.membership.manifestCanonicalIdentityLinkCount) {
    return { action: "refuse", reason: "identity_link_inventory_conflicts_manifest" };
  }

  // Classes C, D, E. Membership says an account of this shape belonged to the release check;
  // concordance says THIS is that account and every identity record agrees.
  if (!row.authoritativeAccountPresent) {
    return { action: "refuse", reason: "authoritative_account_absent" };
  }
  if (!row.accountIdMatchesOwner) {
    return { action: "refuse", reason: "authoritative_account_owner_mismatch" };
  }
  if (!row.emailDigestConcordant) return { action: "refuse", reason: "email_digest_discordant" };
  if (!row.ownerFingerprintConcordant) {
    return { action: "refuse", reason: "owner_fingerprint_discordant" };
  }
  // The account's own beginning, checked against the same pinned window the membership witnesses
  // were checked against.
  if (row.accountCreatedWithinIncidentWindow !== true) {
    return { action: "refuse", reason: "account_created_outside_incident_window" };
  }

  // Supporting narrowing, applied last so it can only ever subtract.
  if (row.ownerAddressUnroutable !== true) {
    return { action: "refuse", reason: "owner_address_routable_or_unknown" };
  }

  return { action: "resume", family: "failed_retryable_post_irreversible" };
}

export type IncidentSelection = {
  resumable: IncidentCandidateRow[];
  revisit: Array<{ row: IncidentCandidateRow; reason: string }>;
  refused: Array<{ row: IncidentCandidateRow; reason: string }>;
  /** True only when the population is exactly the reviewed set and nothing unknown appeared. */
  safeToExecute: boolean;
  blockReason: string | null;
};

/**
 * A refusal that means "I do not recognise this candidate", as opposed to "this row was never in
 * scope". The first kind must stop the whole run: something matched the incident shape that the
 * rule cannot account for, and that is exactly when a recovery tool should stop touching anything.
 */
function isUnrecognisedCandidateReason(reason: string): boolean {
  return (
    reason.startsWith("synthetic_membership_unproven:") ||
    reason === "canonical_email_link_absent" ||
    reason === "canonical_email_link_ambiguous" ||
    reason === "registration_lease_absent" ||
    reason === "registration_lease_ambiguous" ||
    reason === "account_created_outside_incident_window" ||
    reason === "identity_link_inventory_unknown" ||
    reason === "identity_link_inventory_conflicts_manifest" ||
    reason === "authoritative_account_absent" ||
    reason === "authoritative_account_owner_mismatch" ||
    reason === "email_digest_discordant" ||
    reason === "owner_fingerprint_discordant" ||
    reason === "owner_address_routable_or_unknown"
  );
}

/**
 * Select across the whole candidate population.
 *
 * FAIL CLOSED ON POPULATION DRIFT. The operator states a ceiling from a dry run they have just read.
 * If the resumable population is not exactly that number, or ANY candidate was refused for a reason
 * that means "I do not recognise this", nothing executes. The reviewed set and the executed set must
 * be the same set — otherwise the review meant nothing.
 *
 * The ceiling is a safety guard, never identity proof. It cannot promote a candidate that the rule
 * refused; it can only stop candidates the rule accepted.
 */
export function selectIncidentCandidates(
  rows: IncidentCandidateRow[],
  options: { maxCandidates: number },
  contract: HistoricalIncidentEvidence = POR1_PRODUCTION_DELETION_INCIDENT,
): IncidentSelection {
  const resumable: IncidentCandidateRow[] = [];
  const revisit: Array<{ row: IncidentCandidateRow; reason: string }> = [];
  const refused: Array<{ row: IncidentCandidateRow; reason: string }> = [];

  for (const row of rows) {
    const verdict = classifyIncidentCandidate(row);
    if (verdict.action === "resume") resumable.push(row);
    else if (verdict.action === "revisit") revisit.push({ row, reason: verdict.reason });
    else refused.push({ row, reason: verdict.reason });
  }

  const unknown = refused.filter((r) => isUnrecognisedCandidateReason(r.reason));

  let blockReason: string | null = null;
  if (unknown.length > 0) blockReason = "unknown_or_non_synthetic_candidate_present";
  else if (!Number.isInteger(options.maxCandidates) || options.maxCandidates < 0) {
    blockReason = "candidate_ceiling_required";
  } else if (resumable.length > options.maxCandidates) blockReason = "candidate_population_above_ceiling";
  else if (resumable.length !== options.maxCandidates) blockReason = "candidate_population_below_ceiling";
  // The ceiling is a number a human retypes from a dry run, so on its own it can only confirm what
  // the run just told them. The incident's real size is PINNED, and both the population and the
  // retyped ceiling must equal it — so a third qualifying account refuses the run instead of
  // enlarging it.
  else if (resumable.length !== contract.expectedStrandedJobCount) {
    blockReason = "candidate_population_differs_from_pinned_incident";
  } else if (options.maxCandidates !== contract.expectedStrandedJobCount) {
    blockReason = "candidate_ceiling_differs_from_pinned_incident";
  }

  return { resumable, revisit, refused, safeToExecute: blockReason === null, blockReason };
}
