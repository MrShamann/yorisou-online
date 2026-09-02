// POR-1 — the boundary between what the data can show and who may decide.
//
// Three authority models were rejected before this one: unsigned JSON asserting `reviewedBy`, then
// the same document with a signature but `spentNonces: new Set()` as its replay boundary — a
// process-local empty set that forgets everything at startup. v3 binds authority to ONE EXECUTION via
// a challenge that execution generates in memory.
//
// The centrepiece remains THE SAME-WINDOW ADVERSARY: a candidate the machine layer legitimately
// qualifies, which still cannot be erased. The architecture is only honest if it says so out loud.
import assert from "node:assert/strict";
import test from "node:test";
import { createHash, generateKeyPairSync, randomBytes, sign as signPayload } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  canonicalAuthorityPayload,
  evaluateFounderAuthority,
  FOUNDER_REVIEWED_INCIDENT_OVERRIDE,
  parseFounderAuthority,
  POR1_AUTHORITY_MAX_TTL_MS,
  POR1_FOUNDER_AUTHORITY_KEY_ROSTER,
  POR1_INCIDENT_AUTHORITY_VERSION,
  revalidateSignedContext,
  verifyFounderSignature,
  type AuthorityEvaluationContext,
  type FounderAuthorityPayload,
  type FounderIncidentAuthority,
  type PinnedFounderKey,
} from "../por1FounderIncidentAuthority";
import {
  POR1_INCIDENT_EVIDENCE_VERSION,
  POR1_PRODUCTION_DELETION_INCIDENT,
} from "../por1HistoricalIncidentEvidence";
import { classifyHistoricalIncidentCorrelation } from "../por1HistoricalIncidentCorrelation";
import {
  classifyIncidentCandidate,
  resolveDestructiveAuthority,
  selectIncidentCandidates,
  type IncidentCandidateRow,
} from "../por1ProductionIncidentRecovery";

/**
 * A TEST signing key. Software-generated on purpose: these tests exercise the VERIFIER, and a test
 * needing a Secure Enclave key and a fingerprint could not run. The Production path is protected by
 * something this fixture cannot reach — the shipped roster is empty, asserted below.
 */
const testKeyPair = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
const TEST_ROSTER: readonly PinnedFounderKey[] = [{
  keyId: "test-key",
  publicKeyX963Base64: testKeyPair.publicKey.export({ format: "der", type: "spki" }).subarray(26).toString("base64"),
}];

const fp = (v: string) => createHash("sha256").update(v).digest("hex");
const FP_A = fp("job-a"), FP_B = fp("job-b"), FP_C = fp("job-c");
const SOURCE_SHA = "a".repeat(40);
const PROD_SHA = "b".repeat(40);
const CHALLENGE = randomBytes(32).toString("hex");
const ISSUED = "2026-08-12T00:00:00.000Z";
const EXPIRES = "2026-08-12T00:15:00.000Z";
const NOW = Date.parse("2026-08-12T00:05:00.000Z");

const payload = (over: Partial<FounderAuthorityPayload> = {}): FounderAuthorityPayload => ({
  authorityVersion: POR1_INCIDENT_AUTHORITY_VERSION,
  authorityBasis: FOUNDER_REVIEWED_INCIDENT_OVERRIDE,
  incidentEvidenceVersion: POR1_INCIDENT_EVIDENCE_VERSION,
  productionProjectRef: POR1_PRODUCTION_DELETION_INCIDENT.productionProjectRef,
  recoveryToolSourceCommitSha: SOURCE_SHA,
  productionDeploymentCommitSha: PROD_SHA,
  productionEnvironment: "production",
  productionAccountDeletionExecutor: false,
  productionErasureAuthoritySchemaReady: true,
  populationSafetyCeiling: POR1_PRODUCTION_DELETION_INCIDENT.populationSafetyCeiling,
  qualifiedCandidateCount: 2,
  qualifiedCandidateAuthorityFingerprints: [FP_A, FP_B],
  issuedAt: ISSUED,
  expiresAt: EXPIRES,
  executionChallengeNonce: CHALLENGE,
  reviewedBy: "founder",
  ...over,
});

/** Sign like the Secure Enclave helper would: DER ECDSA-P256 over the canonical bytes. */
const signed = (p: FounderAuthorityPayload): FounderIncidentAuthority => ({
  payload: p,
  signingKeyId: "test-key",
  signature: signPayload("sha256", Buffer.from(canonicalAuthorityPayload(p), "utf8"), testKeyPair.privateKey).toString("base64"),
});

const context = (over: Partial<AuthorityEvaluationContext> = {}): AuthorityEvaluationContext => ({
  incidentEvidenceVersion: POR1_INCIDENT_EVIDENCE_VERSION,
  productionProjectRef: POR1_PRODUCTION_DELETION_INCIDENT.productionProjectRef,
  recoveryToolSourceCommitSha: SOURCE_SHA,
  productionDeploymentCommitSha: PROD_SHA,
  productionEnvironment: "production",
  productionAccountDeletionExecutor: false,
  productionErasureAuthoritySchemaReady: true,
  populationSafetyCeiling: POR1_PRODUCTION_DELETION_INCIDENT.populationSafetyCeiling,
  qualifiedCandidateAuthorityFingerprints: [FP_A, FP_B],
  executionChallengeNonce: CHALLENGE,
  founderKeyRoster: TEST_ROSTER,
  now: NOW,
  ...over,
});

const evaluate = (po: Partial<FounderAuthorityPayload> = {}, co: Partial<AuthorityEvaluationContext> = {}) =>
  evaluateFounderAuthority(signed(payload(po)), context(co));
const refusal = (d: ReturnType<typeof evaluate>) => (d as { reason: string }).reason;

test("a fully bound, signed authority for THIS execution is permitted", () => {
  assert.deepEqual(evaluate(), { permitted: true });
});

// ══ the shipped state ═══════════════════════════════════════════════════════

test("the shipped roster is empty, so destructive authority is NONE as delivered", () => {
  assert.equal(POR1_FOUNDER_AUTHORITY_KEY_ROSTER.length, 0);
  assert.deepEqual(
    evaluateFounderAuthority(signed(payload()), context({ founderKeyRoster: POR1_FOUNDER_AUTHORITY_KEY_ROSTER })),
    { permitted: false, reason: "no_founder_key_enrolled" },
  );
});

test("no artifact is refused by name, so absence never reads as a passing check", () => {
  assert.deepEqual(evaluateFounderAuthority(null, context()), {
    permitted: false, reason: "no_authority_artifact_supplied",
  });
});

// ══ authentication ══════════════════════════════════════════════════════════

test("an unsigned artifact cannot authorize, however perfect its contents", () => {
  assert.equal(refusal(evaluateFounderAuthority({ ...signed(payload()), signature: "" }, context())), "signature_absent");
});

test('reviewedBy "founder" carries no weight without a signature', () => {
  for (const who of ["founder", "Founder", "edward", "controller"]) {
    const a = { ...signed(payload({ reviewedBy: who })), signature: "" };
    assert.equal(evaluateFounderAuthority(a, context()).permitted, false, who);
  }
});

test("a signature from the wrong key is refused", () => {
  const impostor = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  const p = payload();
  const forged: FounderIncidentAuthority = {
    payload: p, signingKeyId: "test-key",
    signature: signPayload("sha256", Buffer.from(canonicalAuthorityPayload(p), "utf8"), impostor.privateKey).toString("base64"),
  };
  assert.equal(refusal(evaluateFounderAuthority(forged, context())), "signature_invalid");
});

test("an unpinned signing key id is refused before verification", () => {
  const a = { ...signed(payload()), signingKeyId: "other" };
  assert.equal(refusal(evaluateFounderAuthority(a, context())), "signing_key_unknown");
});

test("tampering with ANY canonical field breaks the signature", () => {
  const genuine = signed(payload());
  const mutations: Array<Partial<FounderAuthorityPayload>> = [
    { reviewedBy: "someone-else" }, { recoveryToolSourceCommitSha: "c".repeat(40) },
    { productionDeploymentCommitSha: "d".repeat(40) }, { productionEnvironment: "preview" },
    { productionAccountDeletionExecutor: true }, { productionErasureAuthoritySchemaReady: false },
    { populationSafetyCeiling: 3 }, { qualifiedCandidateCount: 1 },
    { qualifiedCandidateAuthorityFingerprints: [FP_A, FP_C] }, { issuedAt: "2026-08-12T00:00:01.000Z" },
    { expiresAt: "2026-08-12T00:14:59.000Z" }, { executionChallengeNonce: randomBytes(32).toString("hex") },
    { incidentEvidenceVersion: "x" }, { productionProjectRef: "y" },
    { authorityVersion: "por1-incident-authority-v2" },
  ];
  for (const m of mutations) {
    const tampered = { ...genuine, payload: { ...genuine.payload, ...m } };
    assert.equal(refusal(evaluateFounderAuthority(tampered, context())), "signature_invalid", JSON.stringify(m));
  }
});

// ══ THE PROCESS BINDING — what replaced spentNonces ═════════════════════════

test("a signature naming a DIFFERENT execution is refused", () => {
  // Signed correctly, for another invocation's challenge. This is the replay case.
  assert.equal(refusal(evaluate({}, { executionChallengeNonce: randomBytes(32).toString("hex") })),
    "execution_challenge_mismatch");
});

test("each invocation needs its own signature — process A's cannot be spent in process B", () => {
  const a = signed(payload({ executionChallengeNonce: randomBytes(32).toString("hex") }));
  const b = signed(payload({ executionChallengeNonce: randomBytes(32).toString("hex") }));
  assert.notEqual(a.payload.executionChallengeNonce, b.payload.executionChallengeNonce);
  assert.equal(evaluateFounderAuthority(a, context({ executionChallengeNonce: b.payload.executionChallengeNonce })).permitted, false);
  assert.equal(evaluateFounderAuthority(b, context({ executionChallengeNonce: b.payload.executionChallengeNonce })).permitted, true);
});

test("a weak or malformed challenge is refused — 256 bits or nothing", () => {
  for (const weak of ["", "deadbeef", "z".repeat(64), randomBytes(16).toString("hex")]) {
    assert.equal(refusal(evaluate({ executionChallengeNonce: weak }, { executionChallengeNonce: weak })),
      "execution_challenge_too_weak", weak.slice(0, 12));
  }
});

test("the authority module holds no replay store to consult or forget", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const src = readFileSync(join(here, "..", "por1FounderIncidentAuthority.ts"), "utf8");
  const code = src.replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");
  assert.ok(!code.includes("spentNonces"), "the empty-set replay boundary is gone");
  assert.ok(!code.includes("singleUseNonce"), "the static artifact nonce is gone");
  for (const forbidden of ["generateKeyPairSync", "createPrivateKey", "privateKey", "process.env"]) {
    assert.ok(!code.includes(forbidden), `the verifier must never touch ${forbidden}`);
  }
});

// ══ bound world facts ═══════════════════════════════════════════════════════

test("every bound fact must match what the runtime observes", () => {
  const cases: Array<[Partial<AuthorityEvaluationContext>, string]> = [
    [{ recoveryToolSourceCommitSha: "c".repeat(40) }, "recovery_tool_source_mismatch"],
    [{ productionDeploymentCommitSha: "d".repeat(40) }, "production_deployment_mismatch"],
    [{ productionEnvironment: "preview" }, "production_environment_mismatch"],
    [{ productionAccountDeletionExecutor: true }, "production_executor_state_mismatch"],
    [{ productionErasureAuthoritySchemaReady: false }, "production_erasure_readiness_mismatch"],
    [{ populationSafetyCeiling: 3 }, "population_safety_ceiling_mismatch"],
    [{ incidentEvidenceVersion: "por1-incident-evidence-v0" }, "incident_evidence_version_mismatch"],
    [{ productionProjectRef: "elsewhere" }, "production_project_ref_mismatch"],
  ];
  for (const [over, expected] of cases) assert.equal(refusal(evaluate({}, over)), expected, expected);
});

test("an executor that is ON is refused even when signed and observed consistently", () => {
  assert.equal(
    refusal(evaluate({ productionAccountDeletionExecutor: true }, { productionAccountDeletionExecutor: true })),
    "production_executor_state_mismatch",
  );
});

test("erasure readiness that is false is refused even when signed and observed consistently", () => {
  assert.equal(
    refusal(evaluate({ productionErasureAuthoritySchemaReady: false }, { productionErasureAuthoritySchemaReady: false })),
    "production_erasure_readiness_mismatch",
  );
});

// ══ candidate identity ══════════════════════════════════════════════════════

test("a 48-bit display fingerprint cannot serve as authority identity", () => {
  const short = ["5990ad0e0715", "aa11bb22cc33"];
  assert.equal(
    refusal(evaluate({ qualifiedCandidateAuthorityFingerprints: short }, { qualifiedCandidateAuthorityFingerprints: short })),
    "authority_fingerprint_not_full_sha256",
  );
});

test("a same-size different candidate set is refused", () => {
  assert.equal(refusal(evaluate({}, { qualifiedCandidateAuthorityFingerprints: [FP_A, FP_C] })),
    "candidate_set_differs_from_reviewed");
});

test("the exact reviewed set is permitted in any order", () => {
  assert.equal(evaluate({}, { qualifiedCandidateAuthorityFingerprints: [FP_B, FP_A] }).permitted, true);
});

test("a restated count that disagrees with the set is refused", () => {
  assert.equal(refusal(evaluate({ qualifiedCandidateCount: 3 })), "reviewed_count_inconsistent");
});

test("it can never authorise more than the population safety ceiling", () => {
  const three = [FP_A, FP_B, FP_C];
  assert.equal(
    refusal(evaluate(
      { qualifiedCandidateAuthorityFingerprints: three, qualifiedCandidateCount: 3 },
      { qualifiedCandidateAuthorityFingerprints: three },
    )),
    "reviewed_count_exceeds_population_ceiling",
  );
});

// ══ TTL ═════════════════════════════════════════════════════════════════════

test("TTL above fifteen minutes is refused; the edge is accepted", () => {
  const tooLong = new Date(Date.parse(ISSUED) + POR1_AUTHORITY_MAX_TTL_MS + 1).toISOString();
  assert.equal(refusal(evaluate({ expiresAt: tooLong })), "authority_ttl_above_maximum");
  const exact = new Date(Date.parse(ISSUED) + POR1_AUTHORITY_MAX_TTL_MS).toISOString();
  assert.equal(evaluate({ expiresAt: exact }).permitted, true);
});

test("expired and not-yet-valid are refused, and naive timestamps cannot bound authority", () => {
  assert.equal(refusal(evaluate({}, { now: Date.parse(EXPIRES) + 1 })), "authority_expired");
  assert.equal(refusal(evaluate({}, { now: Date.parse(ISSUED) - 1 })), "authority_not_yet_valid");
  assert.equal(refusal(evaluate({ expiresAt: "2026-08-12T00:15:00" })), "authority_window_unparseable");
});

// ══ post-sign TOCTOU ════════════════════════════════════════════════════════

const observed = (over: Partial<AuthorityEvaluationContext> = {}) => {
  const { founderKeyRoster: _r, now: _n, ...rest } = context(over);
  return rest;
};

test("an unchanged world revalidates", () => {
  assert.deepEqual(revalidateSignedContext(payload(), observed()), { unchanged: true });
});

test("ANY post-sign drift refuses, and names the field that moved", () => {
  const drifts: Array<[Partial<AuthorityEvaluationContext>, string]> = [
    [{ recoveryToolSourceCommitSha: "c".repeat(40) }, "recoveryToolSourceCommitSha"],
    [{ productionDeploymentCommitSha: "d".repeat(40) }, "productionDeploymentCommitSha"],
    [{ productionEnvironment: "preview" }, "productionEnvironment"],
    [{ productionAccountDeletionExecutor: true }, "productionAccountDeletionExecutor"],
    [{ productionErasureAuthoritySchemaReady: false }, "productionErasureAuthoritySchemaReady"],
    [{ populationSafetyCeiling: 3 }, "populationSafetyCeiling"],
    [{ executionChallengeNonce: randomBytes(32).toString("hex") }, "executionChallengeNonce"],
    [{ qualifiedCandidateAuthorityFingerprints: [FP_A, FP_C] }, "qualifiedCandidateAuthorityFingerprints"],
    [{ qualifiedCandidateAuthorityFingerprints: [FP_A] }, "qualifiedCandidateAuthorityFingerprints"],
    [{ qualifiedCandidateAuthorityFingerprints: [FP_A, FP_B, FP_C] }, "qualifiedCandidateAuthorityFingerprints"],
  ];
  for (const [over, field] of drifts) {
    const result = revalidateSignedContext(payload(), observed(over));
    assert.equal(result.unchanged, false, field);
    assert.equal((result as { reason: string }).reason, "FOUNDER_AUTHORITY_CONTEXT_CHANGED");
    assert.equal((result as { field: string }).field, field);
  }
});

// ══ parsing ═════════════════════════════════════════════════════════════════

test("a malformed artifact parses to null, which is refused by name", () => {
  for (const bad of [null, "{}", [], 42, {}, { payload: {} }, { payload: payload() }]) {
    assert.equal(parseFounderAuthority(bad), null, JSON.stringify(bad)?.slice(0, 30));
  }
});

test("an artifact carrying identity is refused outright", () => {
  const withEmail = { ...signed(payload({ qualifiedCandidateAuthorityFingerprints: ["a@b.invalid"] })) };
  assert.equal(parseFounderAuthority(JSON.parse(JSON.stringify(withEmail))), null);
  const withAccount = { ...signed(payload({ qualifiedCandidateAuthorityFingerprints: ["acct_1786_x"] })) };
  assert.equal(parseFounderAuthority(JSON.parse(JSON.stringify(withAccount))), null);
});

test("a well-formed artifact round-trips and still verifies", () => {
  const parsed = parseFounderAuthority(JSON.parse(JSON.stringify(signed(payload()))));
  assert.ok(parsed);
  assert.equal(verifyFounderSignature(parsed, TEST_ROSTER), true);
});

test("the verifier rejects malformed key material and malformed signatures", () => {
  const a = signed(payload());
  const notAKey = Buffer.from("not-a-key", "utf8").toString("base64");
  assert.equal(verifyFounderSignature(a, [{ keyId: "test-key", publicKeyX963Base64: "" }]), false);
  assert.equal(verifyFounderSignature(a, [{ keyId: "test-key", publicKeyX963Base64: notAKey }]), false);
  assert.equal(verifyFounderSignature({ ...a, signature: "!!!" }, TEST_ROSTER), false);
  assert.equal(verifyFounderSignature(a, []), false);
});

// ══ THE SAME-WINDOW ADVERSARY ═══════════════════════════════════════════════

const correlation = (over = {}) => ({
  incidentEvidenceVersion: POR1_INCIDENT_EVIDENCE_VERSION,
  provisioningSagaRequestedAt: "2026-08-10T03:48:53.261Z",
  registrationLeaseAt: "2026-08-10T03:48:53.990Z",
  deletionRequestedAt: "2026-08-10T03:49:19.271Z",
  manifestPresent: true, manifestDomainArtifactCount: 0,
  manifestCanonicalIdentityLinkCount: 1, liveDomainArtifactCount: 0, ...over,
});

const candidate = (over: Partial<IncidentCandidateRow> = {}): IncidentCandidateRow => ({
  jobFingerprint: "5990ad0e0715", authorityFingerprint: FP_A,
  state: "failed_retryable", executionCursor: "database_erasure", irreversible: true,
  manifestPresent: true, ownerNamed: true, executorLeaseLive: false,
  correlation: correlation(), activeEmailLinkCount: 1, activeIdentityLinkCount: 1,
  registrationLeaseCount: 1, accountCreatedWithinIncidentWindow: true,
  authoritativeAccountPresent: true, accountIdMatchesOwner: true,
  emailDigestConcordant: true, ownerFingerprintConcordant: true, ownerAddressUnroutable: true,
  ...over,
});

test("a real-user lookalike INSIDE the pinned window satisfies every machine condition", () => {
  const adversary = candidate({
    jobFingerprint: "cccccccccccc", authorityFingerprint: FP_C,
    correlation: correlation({
      provisioningSagaRequestedAt: "2026-08-10T04:05:00.000Z",
      registrationLeaseAt: "2026-08-10T04:05:00.500Z",
      deletionRequestedAt: "2026-08-10T04:06:10.000Z",
    }),
  });
  assert.deepEqual(classifyHistoricalIncidentCorrelation(adversary.correlation), { qualified: true });
  assert.deepEqual(classifyIncidentCandidate(adversary), {
    action: "qualify", family: "failed_retryable_post_irreversible",
  });
});

test("...and it still cannot be erased without authentic Founder user presence", () => {
  const adversary = candidate({
    jobFingerprint: "cccccccccccc", authorityFingerprint: FP_C,
    correlation: correlation({
      provisioningSagaRequestedAt: "2026-08-10T04:05:00.000Z",
      registrationLeaseAt: "2026-08-10T04:05:00.500Z",
      deletionRequestedAt: "2026-08-10T04:06:10.000Z",
    }),
  });
  const selection = selectIncidentCandidates([candidate(), adversary], { maxCandidates: 2 });
  assert.equal(selection.qualified.length, 2);
  assert.equal(selection.reviewReady, true, "the machine layer is content — that is the point");

  const { qualifiedCandidateAuthorityFingerprints: _f, ...ctx } = context();
  assert.deepEqual(resolveDestructiveAuthority(selection, null, ctx), {
    permitted: false, reason: "no_authority_artifact_supplied",
  });
});

test("a review-ready population is a precondition, never a permission", () => {
  const one = selectIncidentCandidates([candidate()], { maxCandidates: 1 });
  assert.equal(one.reviewReady, false);
  const { qualifiedCandidateAuthorityFingerprints: _f, ...ctx } = context();
  assert.equal(resolveDestructiveAuthority(one, signed(payload()), ctx).permitted, false);
});

// ══ the signer cannot be replaced by software ═══════════════════════════════

test("the Secure Enclave helper demands biometry and never exports the private key", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const swift = readFileSync(join(here, "..", "..", "..", "tools", "por1-founder-signer", "main.swift"), "utf8");
  // Judge the CODE. The header explains at length which APIs are deliberately NOT used, and a raw
  // substring search would fail on that explanation while passing a file that actually used them.
  const swiftCode = swift.replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");
  assert.match(swift, /SecureEnclave\.P256\.Signing\.PrivateKey/);
  assert.match(swift, /\.biometryCurrentSet/, "presence bound to the CURRENT fingerprints");
  assert.match(swift, /kSecAttrAccessibleWhenUnlockedThisDeviceOnly/);
  assert.match(swift, /refusing to sign an empty payload/);
  // No keychain persistence.
  assert.ok(!swiftCode.includes("kSecAttrIsPermanent"), "no persistent keychain item");

  // A software P-256 key may appear ONLY in the negative check that proves the opaque representation
  // cannot be used as one. It must never be generated, and never signed with.
  assert.ok(
    !/P256\.Signing\.PrivateKey\(\s*\)/.test(swiftCode),
    "the signer must never generate a software key",
  );
  for (const match of swiftCode.matchAll(/P256\.Signing\.PrivateKey\(([^)]*)\)/g)) {
    const args = match[1];
    const secureEnclave = match[0].includes("SecureEnclave") ||
      swiftCode.slice(Math.max(0, match.index! - 14), match.index!).includes("SecureEnclave");
    assert.ok(
      secureEnclave || args.includes("rawRepresentation:"),
      `software P-256 construction outside the negative check: ${match[0].slice(0, 60)}`,
    );
  }
  // Every signature this tool produces comes from the Secure Enclave key it loaded.
  assert.match(swiftCode, /try key\.signature\(for: payload\)/);
  assert.ok(!/softwareKey\.signature\(/.test(swiftCode));
});
