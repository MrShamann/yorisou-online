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
// WHAT AN AUDIT REJECTED, AND WHAT REPLACED IT.
//
// The first version of this module accepted an ordinary JSON file carrying `reviewedBy: "founder"`
// and `authorityBasis: FOUNDER_REVIEWED_INCIDENT_OVERRIDE`. An independent audit pointed out the
// obvious: an execution agent with filesystem access can write that file. Schema validation on a
// self-asserted document validates nothing about who asserted it.
//
// Authority now requires a CRYPTOGRAPHIC SIGNATURE over a canonical serialisation of the payload,
// verified against a public key pinned in `POR1_FOUNDER_AUTHORITY_KEY_ROSTER`. The corresponding
// private key is a Secure Enclave P-256 key that requires a fingerprint to use (see
// `tools/por1-founder-signer`). No agent can produce that signature, because no agent can read the
// key or press the sensor.
//
// THE ROSTER IS CURRENTLY EMPTY, AND THAT IS THE SHIPPED STATE.
// Enrolling the key is blocked on this host — persisting a Secure Enclave key needs a
// `keychain-access-groups` entitlement, which is only honoured under a real Team ID, and no
// code-signing identity exists here (measurements in the helper's README). With an empty roster no
// signature can verify and `evaluateFounderAuthority` refuses everything by name. Unblocking is a
// Founder action: enroll on their own machine, then pin the public key in a reviewed change.
//
// NO IDENTITY LIVES HERE. Candidates are named by opaque full sha256 authority fingerprints — never
// by account id, job id or address.

/** Bumped whenever the artifact's shape or binding rules change. */
export const POR1_INCIDENT_AUTHORITY_VERSION = "por1-incident-authority-v2";

/**
 * An interactive authorization may not outlive the review that produced it.
 *
 * Fifteen minutes is short enough that the Production state a Founder read on screen is still the
 * Production state at execution, and long enough to read a candidate list carefully.
 */
export const POR1_AUTHORITY_MAX_TTL_MS = 15 * 60 * 1000;

/** A Founder verification key, pinned in reviewed source. Public halves only, obviously. */
export type PinnedFounderKey = {
  /** Names the enrolled Secure Enclave key this public half belongs to. */
  keyId: string;
  /** Base64 X9.63 uncompressed P-256 point (0x04 || X || Y), as the helper prints it. */
  publicKeyX963Base64: string;
};

/**
 * The pinned Founder verification keys.
 *
 * EMPTY BY DESIGN AND BY CIRCUMSTANCE. Empty means no signature can verify, which means destructive
 * authority is NONE — the correct and intended state until a Founder enrolls a Secure Enclave key on
 * a host that can persist one and pins its public half here in a reviewed change.
 *
 * A software-generated key must never be added. The whole boundary rests on the private half being
 * unreachable to any process, and a software key is a file.
 */
export const POR1_FOUNDER_AUTHORITY_KEY_ROSTER: readonly PinnedFounderKey[] = [];

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

  /** Which pinned key signed this. */
  signingKeyId: string;
  /** Base64 DER ECDSA-P256-SHA256 over `canonicalAuthorityPayload(artifact)`. */
  signature: string;

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
  /** The pinned Founder verification keys. Injectable so tests can pin a test key. */
  founderKeyRoster: readonly PinnedFounderKey[];
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
        | "reviewer_unattributed"
        | "no_founder_key_enrolled"
        | "signature_absent"
        | "signing_key_unknown"
        | "signature_invalid"
        | "authority_fingerprint_not_full_sha256"
        | "authority_ttl_above_maximum";
    };

import { createPublicKey, verify as verifySignature } from "node:crypto";

const ZONED = /(?:Z|[+-]\d{2}:?\d{2})$/;
const FULL_SHA = /^[0-9a-f]{40}$/;
/** Candidate identity in a SIGNED payload is a full sha256 — 48 display bits is not an identity. */
const AUTHORITY_FINGERPRINT = /^[0-9a-f]{64}$/;

/** The fixed SPKI prefix for an uncompressed P-256 point, so node can import the helper's X9.63. */
const P256_SPKI_PREFIX = Buffer.from(
  "3059301306072a8648ce3d020106082a8648ce3d030107034200",
  "hex",
);

/**
 * Serialise the payload deterministically.
 *
 * Field order is fixed here rather than taken from object iteration, and the candidate set is sorted
 * and deduplicated, so the same decision always produces the same bytes and any byte-significant
 * change produces a different signature. `signature` and `signingKeyId` are excluded — they wrap the
 * payload rather than belonging to it.
 */
export function canonicalAuthorityPayload(artifact: FounderIncidentAuthority): string {
  return JSON.stringify([
    artifact.version,
    artifact.authorityBasis,
    artifact.incidentEvidenceVersion,
    artifact.sourceCommitSha,
    [...new Set(artifact.reviewedCandidateFingerprints)].sort(),
    artifact.reviewedCandidateCount,
    artifact.reviewedBy,
    artifact.issuedAt,
    artifact.expiresAt,
    artifact.singleUseNonce,
    artifact.observedExecutorState,
  ]);
}

/**
 * Verify the artifact's signature against a pinned key.
 *
 * Returns false for every failure — unknown key id, malformed key material, malformed signature,
 * wrong signer. There is no path that treats a verification error as success.
 */
export function verifyFounderSignature(
  artifact: FounderIncidentAuthority,
  roster: readonly PinnedFounderKey[] = POR1_FOUNDER_AUTHORITY_KEY_ROSTER,
): boolean {
  const pinned = roster.find((key) => key.keyId === artifact.signingKeyId);
  if (!pinned) return false;
  try {
    const point = Buffer.from(pinned.publicKeyX963Base64, "base64");
    // 0x04 || X(32) || Y(32). Anything else is not a P-256 public point.
    if (point.length !== 65 || point[0] !== 0x04) return false;
    const publicKey = createPublicKey({
      key: Buffer.concat([P256_SPKI_PREFIX, point]),
      format: "der",
      type: "spki",
    });
    return verifySignature(
      "sha256",
      Buffer.from(canonicalAuthorityPayload(artifact), "utf8"),
      publicKey,
      Buffer.from(artifact.signature, "base64"),
    );
  } catch {
    return false;
  }
}

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

  // ── AUTHENTICATION, before anything else is even read as meaningful. ──────
  //
  // An unsigned document is not a weak authorization; it is not an authorization. Checking this
  // first means a forged artifact is refused as unauthenticated rather than for whichever incidental
  // field happened to disagree.
  if (context.founderKeyRoster.length === 0) {
    return { permitted: false, reason: "no_founder_key_enrolled" };
  }
  if (typeof artifact.signature !== "string" || artifact.signature.trim() === "") {
    return { permitted: false, reason: "signature_absent" };
  }
  if (!context.founderKeyRoster.some((key) => key.keyId === artifact.signingKeyId)) {
    return { permitted: false, reason: "signing_key_unknown" };
  }
  if (!verifyFounderSignature(artifact, context.founderKeyRoster)) {
    return { permitted: false, reason: "signature_invalid" };
  }

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
  // Full sha256 only. A 48-bit display prefix is for humans reading logs; it is far too short to
  // name what may be destroyed.
  if (
    artifact.reviewedCandidateFingerprints.length === 0 ||
    !artifact.reviewedCandidateFingerprints.every((value) => AUTHORITY_FINGERPRINT.test(value))
  ) {
    return { permitted: false, reason: "authority_fingerprint_not_full_sha256" };
  }
  if (!context.qualifiedCandidateFingerprints.every((value) => AUTHORITY_FINGERPRINT.test(value))) {
    return { permitted: false, reason: "authority_fingerprint_not_full_sha256" };
  }
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
  if (expiresAt - issuedAt > POR1_AUTHORITY_MAX_TTL_MS) {
    return { permitted: false, reason: "authority_ttl_above_maximum" };
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
    "signingKeyId",
    "signature",
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
    signingKeyId: text("signingKeyId") as string,
    signature: text("signature") as string,
  };
}
