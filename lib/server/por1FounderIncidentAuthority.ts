// POR-1 — the authority to destroy, as a separate thing from the evidence.
//
// WHY THIS EXISTS.
//
// Machine evidence (`por1HistoricalIncidentCorrelation`, `por1ProductionIncidentRecovery`) can only
// ever reach QUALIFIED: "a human should look at this". It cannot establish that an account was
// synthetic, because nothing Production kept records which run created an account. This module is
// the other half — a human decision, authenticated well enough that no process can forge it.
//
// THREE MODELS WERE REJECTED BEFORE THIS ONE.
//
//   v1  ordinary JSON carrying `reviewedBy: "founder"`. An execution agent with filesystem access
//       writes that file. An assertion, not authority.
//   v2  the same document with a signature requirement bolted on, but replay-protected by
//       `singleUseNonce` checked against `spentNonces: new Set()` — a process-local empty set, which
//       forgets everything the moment the process starts. Not replay protection at all.
//   v3  this one. Authority is bound to ONE EXECUTION, by a challenge that execution generates.
//
// HOW v3 BINDS.
//
// When a destructive run begins it generates a fresh 256-bit `executionChallengeNonce` in memory. The
// canonical payload includes it, so the Founder's signature covers it, so the signature is meaningful
// only inside the process that produced it. A second invocation generates a different challenge and
// therefore needs a new signature. There is no store to consult and nothing to replay: the challenge
// cannot arrive from a CLI flag, an environment variable, a file, or a previous run, and no code path
// accepts one from outside.
//
// The payload also binds the world the Founder reviewed — the tool's git HEAD, the Production
// deployment's own account of itself, the capability states, the exact candidate set. Every one of
// those is re-read after the signature and before the first destructive call; any difference is
// `FOUNDER_AUTHORITY_CONTEXT_CHANGED` and nothing runs.
//
// WHAT SIGNS. A Secure Enclave P-256 key enrolled with `.biometryCurrentSet` (see
// `tools/por1-founder-signer`). The private half is generated in the SEP, never exportable, and
// requires a fingerprint at the moment of signing. This module only ever VERIFIES: it imports no
// signing primitive, holds no key material and reads no environment.
//
// THE ROSTER IS EMPTY, BY DESIGN. Enrolling is a Founder action taken after review, not part of
// building this. With an empty roster nothing verifies and destructive authority is NONE.

import { createPublicKey, verify as verifySignature } from "node:crypto";

export const POR1_INCIDENT_AUTHORITY_VERSION = "por1-incident-authority-v3";

/**
 * An interactive authorization may not outlive the review that produced it.
 *
 * Short enough that the Production state a Founder read on screen is still the Production state at
 * execution; long enough to read a candidate list properly.
 */
export const POR1_AUTHORITY_MAX_TTL_MS = 15 * 60 * 1000;

/** The ONLY basis a valid artifact may declare — never a claim about history. */
export const FOUNDER_REVIEWED_INCIDENT_OVERRIDE = "FOUNDER_REVIEWED_INCIDENT_OVERRIDE" as const;

export type PinnedFounderKey = { keyId: string; publicKeyX963Base64: string };

/**
 * The pinned Founder verification keys.
 *
 * EMPTY BY DESIGN. A software-generated key must never be added: the boundary rests on the private
 * half being unreachable to any process, and a software key is a file. Only a public key printed by
 * `por1-founder-signer enroll` belongs here, pinned in a reviewed change after a Founder decision.
 */
export const POR1_FOUNDER_AUTHORITY_KEY_ROSTER: readonly PinnedFounderKey[] = [];

/** Exactly the bytes a Founder signs. No field here may be absent at signing time. */
export type FounderAuthorityPayload = {
  authorityVersion: string;
  authorityBasis: typeof FOUNDER_REVIEWED_INCIDENT_OVERRIDE;
  incidentEvidenceVersion: string;
  productionProjectRef: string;
  recoveryToolSourceCommitSha: string;
  productionDeploymentCommitSha: string;
  productionEnvironment: string;
  productionAccountDeletionExecutor: boolean;
  productionErasureAuthoritySchemaReady: boolean;
  populationSafetyCeiling: number;
  qualifiedCandidateCount: number;
  /** Full lowercase sha256 of each job id. Sorted, unique. */
  qualifiedCandidateAuthorityFingerprints: readonly string[];
  issuedAt: string;
  expiresAt: string;
  /** Generated inside the executing process. Never supplied from outside. */
  executionChallengeNonce: string;
  reviewedBy: string;
};

export type FounderIncidentAuthority = {
  payload: FounderAuthorityPayload;
  signingKeyId: string;
  /** Base64 DER ECDSA-P256-SHA256 over `canonicalAuthorityPayload(payload)`. */
  signature: string;
};

/** What the runtime observes right now. Every field is compared against the signed payload. */
export type AuthorityEvaluationContext = {
  incidentEvidenceVersion: string;
  productionProjectRef: string;
  recoveryToolSourceCommitSha: string;
  productionDeploymentCommitSha: string;
  productionEnvironment: string;
  productionAccountDeletionExecutor: boolean;
  productionErasureAuthoritySchemaReady: boolean;
  populationSafetyCeiling: number;
  qualifiedCandidateAuthorityFingerprints: readonly string[];
  /** The challenge THIS process generated. */
  executionChallengeNonce: string;
  founderKeyRoster: readonly PinnedFounderKey[];
  now: number;
};

export type AuthorityDecision =
  | { permitted: true }
  | { permitted: false; reason: AuthorityRefusal };

export type AuthorityRefusal =
  | "no_authority_artifact_supplied"
  | "no_founder_key_enrolled"
  | "signature_absent"
  | "signing_key_unknown"
  | "signature_invalid"
  | "authority_version_mismatch"
  | "authority_basis_invalid"
  | "reviewer_unattributed"
  | "execution_challenge_mismatch"
  | "execution_challenge_too_weak"
  | "incident_evidence_version_mismatch"
  | "production_project_ref_mismatch"
  | "recovery_tool_source_mismatch"
  | "production_deployment_mismatch"
  | "production_environment_mismatch"
  | "production_executor_state_mismatch"
  | "production_erasure_readiness_mismatch"
  | "population_safety_ceiling_mismatch"
  | "authority_fingerprint_not_full_sha256"
  | "candidate_set_differs_from_reviewed"
  | "reviewed_count_inconsistent"
  | "reviewed_count_exceeds_population_ceiling"
  | "authority_window_unparseable"
  | "authority_ttl_above_maximum"
  | "authority_not_yet_valid"
  | "authority_expired";

const ZONED = /(?:Z|[+-]\d{2}:?\d{2})$/;
const AUTHORITY_FINGERPRINT = /^[0-9a-f]{64}$/;
/** 256 bits, hex. Anything shorter is not a challenge. */
const CHALLENGE = /^[0-9a-f]{64}$/;
const P256_SPKI_PREFIX = Buffer.from(
  "3059301306072a8648ce3d020106082a8648ce3d030107034200",
  "hex",
);

function instant(value: string): number | null {
  if (typeof value !== "string" || !ZONED.test(value.trim())) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function sameSet(a: readonly string[], b: readonly string[]): boolean {
  const left = [...new Set(a)].sort();
  const right = [...new Set(b)].sort();
  return left.length === right.length && left.every((v, i) => v === right[i]);
}

/**
 * Serialise the payload deterministically.
 *
 * Field order is fixed here rather than taken from object iteration, and the candidate set is sorted
 * and deduplicated, so the same decision always yields the same bytes and any byte-significant change
 * yields a different signature.
 */
export function canonicalAuthorityPayload(payload: FounderAuthorityPayload): string {
  return JSON.stringify([
    payload.authorityVersion,
    payload.authorityBasis,
    payload.incidentEvidenceVersion,
    payload.productionProjectRef,
    payload.recoveryToolSourceCommitSha,
    payload.productionDeploymentCommitSha,
    payload.productionEnvironment,
    payload.productionAccountDeletionExecutor,
    payload.productionErasureAuthoritySchemaReady,
    payload.populationSafetyCeiling,
    payload.qualifiedCandidateCount,
    [...new Set(payload.qualifiedCandidateAuthorityFingerprints)].sort(),
    payload.issuedAt,
    payload.expiresAt,
    payload.executionChallengeNonce,
    payload.reviewedBy,
  ]);
}

/** Verify against a pinned key. Every failure — unknown id, bad key, bad signature — returns false. */
export function verifyFounderSignature(
  artifact: FounderIncidentAuthority,
  roster: readonly PinnedFounderKey[] = POR1_FOUNDER_AUTHORITY_KEY_ROSTER,
): boolean {
  const pinned = roster.find((key) => key.keyId === artifact.signingKeyId);
  if (!pinned) return false;
  try {
    const point = Buffer.from(pinned.publicKeyX963Base64, "base64");
    if (point.length !== 65 || point[0] !== 0x04) return false;
    const publicKey = createPublicKey({
      key: Buffer.concat([P256_SPKI_PREFIX, point]),
      format: "der",
      type: "spki",
    });
    return verifySignature(
      "sha256",
      Buffer.from(canonicalAuthorityPayload(artifact.payload), "utf8"),
      publicKey,
      Buffer.from(artifact.signature, "base64"),
    );
  } catch {
    return false;
  }
}

/**
 * Decide whether a destructive run is permitted.
 *
 * Authentication first, so a forged artifact is refused as unauthenticated rather than on whichever
 * field happened to disagree. Then the challenge, because a signature that does not name THIS
 * execution is someone else's decision. Then every bound fact, compared against what the runtime
 * observes right now.
 */
export function evaluateFounderAuthority(
  artifact: FounderIncidentAuthority | null,
  context: AuthorityEvaluationContext,
): AuthorityDecision {
  if (!artifact) return { permitted: false, reason: "no_authority_artifact_supplied" };

  if (context.founderKeyRoster.length === 0) {
    return { permitted: false, reason: "no_founder_key_enrolled" };
  }
  if (typeof artifact.signature !== "string" || artifact.signature.trim() === "") {
    return { permitted: false, reason: "signature_absent" };
  }
  if (!context.founderKeyRoster.some((k) => k.keyId === artifact.signingKeyId)) {
    return { permitted: false, reason: "signing_key_unknown" };
  }
  if (!verifyFounderSignature(artifact, context.founderKeyRoster)) {
    return { permitted: false, reason: "signature_invalid" };
  }

  const p = artifact.payload;
  if (p.authorityVersion !== POR1_INCIDENT_AUTHORITY_VERSION) {
    return { permitted: false, reason: "authority_version_mismatch" };
  }
  if (p.authorityBasis !== FOUNDER_REVIEWED_INCIDENT_OVERRIDE) {
    return { permitted: false, reason: "authority_basis_invalid" };
  }
  if (typeof p.reviewedBy !== "string" || p.reviewedBy.trim() === "") {
    return { permitted: false, reason: "reviewer_unattributed" };
  }

  // ── THE PROCESS BINDING. A signature from another invocation dies here. ───
  if (!CHALLENGE.test(context.executionChallengeNonce)) {
    return { permitted: false, reason: "execution_challenge_too_weak" };
  }
  if (p.executionChallengeNonce !== context.executionChallengeNonce) {
    return { permitted: false, reason: "execution_challenge_mismatch" };
  }

  if (p.incidentEvidenceVersion !== context.incidentEvidenceVersion) {
    return { permitted: false, reason: "incident_evidence_version_mismatch" };
  }
  if (p.productionProjectRef !== context.productionProjectRef) {
    return { permitted: false, reason: "production_project_ref_mismatch" };
  }
  if (p.recoveryToolSourceCommitSha !== context.recoveryToolSourceCommitSha) {
    return { permitted: false, reason: "recovery_tool_source_mismatch" };
  }
  if (p.productionDeploymentCommitSha !== context.productionDeploymentCommitSha) {
    return { permitted: false, reason: "production_deployment_mismatch" };
  }
  if (p.productionEnvironment !== context.productionEnvironment || p.productionEnvironment !== "production") {
    return { permitted: false, reason: "production_environment_mismatch" };
  }
  // Signed as false AND observed as false. A capability that came on since review invalidates it.
  if (p.productionAccountDeletionExecutor !== context.productionAccountDeletionExecutor ||
      p.productionAccountDeletionExecutor !== false) {
    return { permitted: false, reason: "production_executor_state_mismatch" };
  }
  if (p.productionErasureAuthoritySchemaReady !== context.productionErasureAuthoritySchemaReady ||
      p.productionErasureAuthoritySchemaReady !== true) {
    return { permitted: false, reason: "production_erasure_readiness_mismatch" };
  }
  if (p.populationSafetyCeiling !== context.populationSafetyCeiling) {
    return { permitted: false, reason: "population_safety_ceiling_mismatch" };
  }

  // Full sha256 only. A 48-bit display prefix is for humans reading logs.
  const fingerprints = p.qualifiedCandidateAuthorityFingerprints;
  if (fingerprints.length === 0 || !fingerprints.every((v) => AUTHORITY_FINGERPRINT.test(v))) {
    return { permitted: false, reason: "authority_fingerprint_not_full_sha256" };
  }
  if (!context.qualifiedCandidateAuthorityFingerprints.every((v) => AUTHORITY_FINGERPRINT.test(v))) {
    return { permitted: false, reason: "authority_fingerprint_not_full_sha256" };
  }
  if (!sameSet(fingerprints, context.qualifiedCandidateAuthorityFingerprints)) {
    return { permitted: false, reason: "candidate_set_differs_from_reviewed" };
  }
  if (!Number.isInteger(p.qualifiedCandidateCount) ||
      p.qualifiedCandidateCount !== new Set(fingerprints).size) {
    return { permitted: false, reason: "reviewed_count_inconsistent" };
  }
  if (p.qualifiedCandidateCount > context.populationSafetyCeiling) {
    return { permitted: false, reason: "reviewed_count_exceeds_population_ceiling" };
  }

  const issuedAt = instant(p.issuedAt);
  const expiresAt = instant(p.expiresAt);
  if (issuedAt === null || expiresAt === null || expiresAt <= issuedAt) {
    return { permitted: false, reason: "authority_window_unparseable" };
  }
  if (expiresAt - issuedAt > POR1_AUTHORITY_MAX_TTL_MS) {
    return { permitted: false, reason: "authority_ttl_above_maximum" };
  }
  if (context.now < issuedAt) return { permitted: false, reason: "authority_not_yet_valid" };
  if (context.now > expiresAt) return { permitted: false, reason: "authority_expired" };

  return { permitted: true };
}

/**
 * The TOCTOU gate. Run after the signature verifies and before the first destructive call.
 *
 * A signature attests to a world. If that world moved while the Founder was reading, the attestation
 * describes something that no longer exists — so the comparison is over the whole bound context, not
 * a chosen subset, and any difference stops everything.
 */
export function revalidateSignedContext(
  signed: FounderAuthorityPayload,
  observed: Omit<AuthorityEvaluationContext, "founderKeyRoster" | "now">,
): { unchanged: true } | { unchanged: false; reason: "FOUNDER_AUTHORITY_CONTEXT_CHANGED"; field: string } {
  const comparisons: Array<[string, unknown, unknown]> = [
    ["incidentEvidenceVersion", signed.incidentEvidenceVersion, observed.incidentEvidenceVersion],
    ["productionProjectRef", signed.productionProjectRef, observed.productionProjectRef],
    ["recoveryToolSourceCommitSha", signed.recoveryToolSourceCommitSha, observed.recoveryToolSourceCommitSha],
    ["productionDeploymentCommitSha", signed.productionDeploymentCommitSha, observed.productionDeploymentCommitSha],
    ["productionEnvironment", signed.productionEnvironment, observed.productionEnvironment],
    ["productionAccountDeletionExecutor", signed.productionAccountDeletionExecutor, observed.productionAccountDeletionExecutor],
    ["productionErasureAuthoritySchemaReady", signed.productionErasureAuthoritySchemaReady, observed.productionErasureAuthoritySchemaReady],
    ["populationSafetyCeiling", signed.populationSafetyCeiling, observed.populationSafetyCeiling],
    ["executionChallengeNonce", signed.executionChallengeNonce, observed.executionChallengeNonce],
  ];
  for (const [field, a, b] of comparisons) {
    if (a !== b) return { unchanged: false, reason: "FOUNDER_AUTHORITY_CONTEXT_CHANGED", field };
  }
  if (!sameSet(signed.qualifiedCandidateAuthorityFingerprints, observed.qualifiedCandidateAuthorityFingerprints)) {
    return {
      unchanged: false,
      reason: "FOUNDER_AUTHORITY_CONTEXT_CHANGED",
      field: "qualifiedCandidateAuthorityFingerprints",
    };
  }
  return { unchanged: true };
}

/**
 * Parse an operator-supplied artifact. Structural only; every binding rule belongs to
 * `evaluateFounderAuthority`. Returns null on anything unexpected, and null is refused by name.
 */
export function parseFounderAuthority(raw: unknown): FounderIncidentAuthority | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;
  const payload = record.payload;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const p = payload as Record<string, unknown>;

  const fingerprints = p.qualifiedCandidateAuthorityFingerprints;
  if (!Array.isArray(fingerprints) || !fingerprints.every((v) => typeof v === "string")) return null;
  // Identity must never travel in an authority artifact.
  for (const value of fingerprints as string[]) {
    if (value.includes("@") || value.startsWith("acct_")) return null;
  }
  for (const key of [
    "authorityVersion", "authorityBasis", "incidentEvidenceVersion", "productionProjectRef",
    "recoveryToolSourceCommitSha", "productionDeploymentCommitSha", "productionEnvironment",
    "issuedAt", "expiresAt", "executionChallengeNonce", "reviewedBy",
  ]) if (typeof p[key] !== "string") return null;
  for (const key of ["productionAccountDeletionExecutor", "productionErasureAuthoritySchemaReady"]) {
    if (typeof p[key] !== "boolean") return null;
  }
  for (const key of ["populationSafetyCeiling", "qualifiedCandidateCount"]) {
    if (typeof p[key] !== "number") return null;
  }
  if (typeof record.signingKeyId !== "string" || typeof record.signature !== "string") return null;

  return {
    payload: {
      ...(p as unknown as FounderAuthorityPayload),
      qualifiedCandidateAuthorityFingerprints: fingerprints as string[],
    },
    signingKeyId: record.signingKeyId,
    signature: record.signature,
  };
}
