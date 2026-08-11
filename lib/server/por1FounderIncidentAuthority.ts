// POR-1 — the authority to destroy, as a separate thing from the evidence.
//
// WHY THIS EXISTS.
//
// Three attempts were made to prove, from what Production kept, that two particular accounts were
// created by the historical release-check run. The third came closest and was still refused, for the
// right reason: the surviving data cannot express "this account was created by run X". A pinned
// forty-eight minute deployment window, a short lifetime, no product artifacts, a reserved address
// and matching digests are extremely strong CORRELATION. They are not provenance, and no further
// clause converts one into the other.
//
// So the architecture stopped pretending. Evidence and authority are now two layers, and this is the
// second one:
//
//   LAYER A — `por1HistoricalIncidentCorrelation` + `por1ProductionIncidentRecovery`. Fail-closed
//             machine evidence. Its best possible answer is QUALIFIED: "every condition the data can
//             express holds, so a human should look at this." It can refuse. It cannot authorise.
//
//   LAYER B — this module. A single-use artifact recording that a named human reviewed a specific
//             candidate set, at a specific source revision, under a specific incident contract, and
//             decided to permit one destructive run anyway.
//
// The distinction is the whole point. Layer A states a fact about data. Layer B states a decision by
// a person, and says so in its own basis field. An artifact that claimed the first while doing the
// second would be the same error in a new costume, so `authorityBasis` is a literal that can only
// hold one value and `validateFounderAuthority` refuses anything else.
//
// WHAT THIS MODULE DELIBERATELY DOES NOT DO. It does not mint artifacts. There is no signing key, no
// generator, no `--issue` flag, and no default. It only ever evaluates one that already exists, and
// in the absence of one the answer is NONE. That absence is the current shipped state.
//
// NO IDENTITY LIVES HERE. Candidates are named by opaque fingerprints — the same short sha256
// prefixes the operator tool prints — never by account id, job id or address.

/** Bumped whenever the artifact's shape or binding rules change. */
export const POR1_INCIDENT_AUTHORITY_VERSION = "por1-incident-authority-v1";

/**
 * The ONLY basis a valid artifact may declare.
 *
 * Written as a literal so the type system refuses the sentence nobody is entitled to write —
 * that a human decision established a historical fact.
 */
export const FOUNDER_REVIEWED_INCIDENT_OVERRIDE = "FOUNDER_REVIEWED_INCIDENT_OVERRIDE" as const;

export type FounderIncidentAuthority = {
  version: string;
  /** Must be `FOUNDER_REVIEWED_INCIDENT_OVERRIDE`. Never a claim about history. */
  authorityBasis: typeof FOUNDER_REVIEWED_INCIDENT_OVERRIDE;

  /** The incident contract the review was conducted against. */
  incidentEvidenceVersion: string;
  /** The exact source revision reviewed. A different build is a different tool. */
  sourceCommitSha: string;

  /**
   * The reviewed candidate set, as opaque fingerprints. Sorted, deduplicated, and matched EXACTLY —
   * a set that gained or lost a member is not the set that was reviewed.
   */
  reviewedCandidateFingerprints: string[];
  /** Restated so a truncated or padded list cannot pass as the reviewed one. */
  reviewedCandidateCount: number;

  /** Who reviewed it, as a role rather than a person's contact details. */
  reviewedBy: string;
  issuedAt: string;
  expiresAt: string;

  /** Single-use. Replaying a spent artifact is not a second decision. */
  singleUseNonce: string;

  /** The executor state the reviewer saw. A capability that changed invalidates the review. */
  observedExecutorState: "off" | "on";
};

/** Everything the runtime must show to be allowed to spend an artifact. */
export type AuthorityEvaluationContext = {
  /** The build actually running. */
  currentSourceCommitSha: string;
  /** The contract the candidates were gathered under. */
  currentIncidentEvidenceVersion: string;
  /** Fingerprints of the candidates Layer A qualified, right now. */
  qualifiedCandidateFingerprints: string[];
  /** The pinned blast-radius control from the incident contract. */
  populationSafetyCeiling: number;
  /** The executor capability as the runtime currently sees it. */
  currentExecutorState: "off" | "on";
  /** Nonces already spent, so a replay is refused. */
  spentNonces: ReadonlySet<string>;
  /** Now, injected so expiry is testable without a clock. */
  now: number;
};

export type AuthorityDecision =
  | { permitted: true; nonce: string }
  | {
      permitted: false;
      reason:
        | "no_authority_artifact_supplied"
        | "authority_version_mismatch"
        | "authority_basis_invalid"
        | "incident_evidence_version_mismatch"
        | "source_commit_mismatch"
        | "candidate_set_differs_from_reviewed"
        | "reviewed_count_inconsistent"
        | "reviewed_count_exceeds_population_ceiling"
        | "executor_state_changed_since_review"
        | "authority_window_unparseable"
        | "authority_not_yet_valid"
        | "authority_expired"
        | "authority_already_spent"
        | "reviewer_unattributed";
    };

const ZONED = /(?:Z|[+-]\d{2}:?\d{2})$/;
const FULL_SHA = /^[0-9a-f]{40}$/;

function instant(value: string): number | null {
  if (typeof value !== "string" || !ZONED.test(value.trim())) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Order-insensitive, duplicate-insensitive set comparison over opaque fingerprints. */
function sameSet(a: readonly string[], b: readonly string[]): boolean {
  const left = [...new Set(a)].sort();
  const right = [...new Set(b)].sort();
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

/**
 * Decide whether a destructive run is permitted.
 *
 * Every branch returns `permitted: false` except one, and that one requires an artifact somebody
 * deliberately produced. `null` — the shipped state — is refused first and by name, so "there is no
 * authority" reads differently in a log from "the authority did not check out".
 */
export function evaluateFounderAuthority(
  artifact: FounderIncidentAuthority | null,
  context: AuthorityEvaluationContext,
): AuthorityDecision {
  if (!artifact) return { permitted: false, reason: "no_authority_artifact_supplied" };

  if (artifact.version !== POR1_INCIDENT_AUTHORITY_VERSION) {
    return { permitted: false, reason: "authority_version_mismatch" };
  }
  // A human decision may not be relabelled as a historical finding.
  if (artifact.authorityBasis !== FOUNDER_REVIEWED_INCIDENT_OVERRIDE) {
    return { permitted: false, reason: "authority_basis_invalid" };
  }
  if (typeof artifact.reviewedBy !== "string" || artifact.reviewedBy.trim() === "") {
    return { permitted: false, reason: "reviewer_unattributed" };
  }
  if (artifact.incidentEvidenceVersion !== context.currentIncidentEvidenceVersion) {
    return { permitted: false, reason: "incident_evidence_version_mismatch" };
  }
  if (
    !FULL_SHA.test(artifact.sourceCommitSha) ||
    artifact.sourceCommitSha !== context.currentSourceCommitSha
  ) {
    return { permitted: false, reason: "source_commit_mismatch" };
  }

  // The reviewed set and the executed set must be the SAME SET, not merely the same size. A count
  // cannot tell "the two historical objects" from "one historical object and something else".
  if (!sameSet(artifact.reviewedCandidateFingerprints, context.qualifiedCandidateFingerprints)) {
    return { permitted: false, reason: "candidate_set_differs_from_reviewed" };
  }
  if (
    !Number.isInteger(artifact.reviewedCandidateCount) ||
    artifact.reviewedCandidateCount !== new Set(artifact.reviewedCandidateFingerprints).size
  ) {
    return { permitted: false, reason: "reviewed_count_inconsistent" };
  }
  if (artifact.reviewedCandidateCount > context.populationSafetyCeiling) {
    return { permitted: false, reason: "reviewed_count_exceeds_population_ceiling" };
  }

  if (artifact.observedExecutorState !== context.currentExecutorState) {
    return { permitted: false, reason: "executor_state_changed_since_review" };
  }

  const issuedAt = instant(artifact.issuedAt);
  const expiresAt = instant(artifact.expiresAt);
  if (issuedAt === null || expiresAt === null || expiresAt <= issuedAt) {
    return { permitted: false, reason: "authority_window_unparseable" };
  }
  if (context.now < issuedAt) return { permitted: false, reason: "authority_not_yet_valid" };
  if (context.now > expiresAt) return { permitted: false, reason: "authority_expired" };

  if (
    typeof artifact.singleUseNonce !== "string" ||
    artifact.singleUseNonce.trim() === "" ||
    context.spentNonces.has(artifact.singleUseNonce)
  ) {
    return { permitted: false, reason: "authority_already_spent" };
  }

  return { permitted: true, nonce: artifact.singleUseNonce };
}

/**
 * Parse an artifact from operator-supplied JSON.
 *
 * Structural only — every binding rule is `evaluateFounderAuthority`'s job. Returns null on anything
 * unexpected, and null is refused by name, so a malformed artifact can never read as a valid one.
 */
export function parseFounderAuthority(raw: unknown): FounderIncidentAuthority | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;

  const text = (key: string) => (typeof record[key] === "string" ? (record[key] as string) : null);
  const fingerprints = record.reviewedCandidateFingerprints;
  if (!Array.isArray(fingerprints) || !fingerprints.every((value) => typeof value === "string")) {
    return null;
  }
  const executorState = record.observedExecutorState;
  if (executorState !== "off" && executorState !== "on") return null;
  if (typeof record.reviewedCandidateCount !== "number") return null;

  const required = [
    "version",
    "authorityBasis",
    "incidentEvidenceVersion",
    "sourceCommitSha",
    "reviewedBy",
    "issuedAt",
    "expiresAt",
    "singleUseNonce",
  ] as const;
  for (const key of required) if (text(key) === null) return null;

  // An artifact carrying identity would be a new place for identity to leak, so it is refused
  // outright rather than trimmed.
  for (const value of fingerprints) {
    if (value.includes("@") || value.startsWith("acct_")) return null;
  }

  return {
    version: text("version") as string,
    authorityBasis: text("authorityBasis") as typeof FOUNDER_REVIEWED_INCIDENT_OVERRIDE,
    incidentEvidenceVersion: text("incidentEvidenceVersion") as string,
    sourceCommitSha: text("sourceCommitSha") as string,
    reviewedCandidateFingerprints: fingerprints as string[],
    reviewedCandidateCount: record.reviewedCandidateCount as number,
    reviewedBy: text("reviewedBy") as string,
    issuedAt: text("issuedAt") as string,
    expiresAt: text("expiresAt") as string,
    singleUseNonce: text("singleUseNonce") as string,
    observedExecutorState: executorState,
  };
}
