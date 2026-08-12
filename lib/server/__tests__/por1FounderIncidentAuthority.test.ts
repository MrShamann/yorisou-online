// POR-1 — the boundary between what the data can show and who may decide.
//
// The centrepiece of this file is `THE SAME-WINDOW ADVERSARY`. Three revisions of the recovery rule
// claimed to prove which accounts were synthetic; the third pinned its window to immutable GitHub and
// Vercel records and was still refused, because the pinned window contains forty-eight minutes of
// live Production and nothing Production kept records which run created an account.
//
// An earlier test claimed to cover this and did not: it moved a look-alike three weeks into the
// future and watched the window clause reject it. That is the easy half. The adversary below sits
// INSIDE the window and satisfies every machine condition — and the architecture is only honest if
// it says so out loud and still refuses to erase anything.
import assert from "node:assert/strict";
import test from "node:test";
import { createHash, generateKeyPairSync, sign as signPayload } from "node:crypto";
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
  verifyFounderSignature,
  type AuthorityEvaluationContext,
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

const SOURCE_SHA = "ecc10fbe13e5cb3306376beec6b328c80edb8701";

/**
 * A TEST signing key.
 *
 * Software-generated on purpose: these tests verify the VERIFIER, and a test that needed a Secure
 * Enclave key and a fingerprint could not run. The Production path is protected by something this
 * fixture cannot reach — `POR1_FOUNDER_AUTHORITY_KEY_ROSTER` is empty, and a test at the bottom of
 * this file asserts that no key of any kind is pinned there.
 */
const testKeyPair = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
/** X9.63 uncompressed point, exactly as the Secure Enclave helper prints it. */
const TEST_PUBLIC_X963 = testKeyPair.publicKey
  .export({ format: "der", type: "spki" })
  .subarray(26)
  .toString("base64");
const TEST_ROSTER: readonly PinnedFounderKey[] = [
  { keyId: "test-key", publicKeyX963Base64: TEST_PUBLIC_X963 },
];

/** Full sha256 authority fingerprints, as the signed payload requires. */
const fp = (value: string) => createHash("sha256").update(value).digest("hex");
const FP_A = fp("job-a");
const FP_B = fp("job-b");
const FP_C = fp("job-c");

/** Sign an artifact the way the Secure Enclave helper would: DER ECDSA-P256 over the canonical bytes. */
function signed(artifact: FounderIncidentAuthority): FounderIncidentAuthority {
  const signature = signPayload(
    "sha256",
    Buffer.from(canonicalAuthorityPayload(artifact), "utf8"),
    testKeyPair.privateKey,
  ).toString("base64");
  return { ...artifact, signature };
}

const correlation = (over = {}) => ({
  incidentEvidenceVersion: POR1_INCIDENT_EVIDENCE_VERSION,
  provisioningSagaRequestedAt: "2026-08-10T03:48:53.261Z",
  registrationLeaseAt: "2026-08-10T03:48:53.990Z",
  deletionRequestedAt: "2026-08-10T03:49:19.271Z",
  manifestPresent: true,
  manifestDomainArtifactCount: 0,
  manifestCanonicalIdentityLinkCount: 1,
  liveDomainArtifactCount: 0,
  ...over,
});

const candidate = (over: Partial<IncidentCandidateRow> = {}): IncidentCandidateRow => ({
  jobFingerprint: "5990ad0e0715",
  authorityFingerprint: FP_A,
  state: "failed_retryable",
  executionCursor: "database_erasure",
  irreversible: true,
  manifestPresent: true,
  ownerNamed: true,
  executorLeaseLive: false,
  correlation: correlation(),
  activeEmailLinkCount: 1,
  activeIdentityLinkCount: 1,
  registrationLeaseCount: 1,
  accountCreatedWithinIncidentWindow: true,
  authoritativeAccountPresent: true,
  accountIdMatchesOwner: true,
  emailDigestConcordant: true,
  ownerFingerprintConcordant: true,
  ownerAddressUnroutable: true,
  ...over,
});

const context = (
  over: Partial<Omit<AuthorityEvaluationContext, "qualifiedCandidateFingerprints">> = {},
) => ({
  currentSourceCommitSha: SOURCE_SHA,
  currentIncidentEvidenceVersion: POR1_INCIDENT_EVIDENCE_VERSION,
  populationSafetyCeiling: POR1_PRODUCTION_DELETION_INCIDENT.populationSafetyCeiling,
  currentExecutorState: "off" as const,
  spentNonces: new Set<string>(),
  founderKeyRoster: TEST_ROSTER,
  now: Date.parse("2026-08-12T00:05:00.000Z"),
  ...over,
});

const authority = (over: Partial<FounderIncidentAuthority> = {}): FounderIncidentAuthority => ({
  version: POR1_INCIDENT_AUTHORITY_VERSION,
  authorityBasis: FOUNDER_REVIEWED_INCIDENT_OVERRIDE,
  incidentEvidenceVersion: POR1_INCIDENT_EVIDENCE_VERSION,
  sourceCommitSha: SOURCE_SHA,
  reviewedCandidateFingerprints: [FP_A, FP_B],
  reviewedCandidateCount: 2,
  reviewedBy: "founder",
  issuedAt: "2026-08-12T00:00:00.000Z",
  expiresAt: "2026-08-12T00:15:00.000Z",
  singleUseNonce: "nonce-1",
  observedExecutorState: "off",
  signingKeyId: "test-key",
  signature: "",
  ...over,
});

// ══════════════════════════════════════════════════════════════════════════════
// THE SAME-WINDOW ADVERSARY
// ══════════════════════════════════════════════════════════════════════════════

test("a REAL-USER LOOKALIKE inside the pinned window satisfies every machine condition", () => {
  // Candidate C. Registered, did nothing, asked to be deleted a minute later — inside the same
  // forty-eight minutes as the historical incident. Provisioning saga, registration lease and
  // deletion request all present and all in-window. Zero domain artifacts in BOTH inventories.
  // Exactly one canonical identity. Authoritative account matches, digest matches, fingerprint
  // matches, address on the reserved TLD, no live executor claim.
  //
  // There is no field in the surviving data that separates this from release-check residue, and this
  // test asserts that honestly rather than inventing a discriminator to make it fail.
  const adversary = candidate({
    jobFingerprint: "cccccccccccc",
    authorityFingerprint: FP_C,
    correlation: correlation({
      provisioningSagaRequestedAt: "2026-08-10T04:05:00.000Z",
      registrationLeaseAt: "2026-08-10T04:05:00.500Z",
      deletionRequestedAt: "2026-08-10T04:06:10.000Z",
    }),
  });

  assert.deepEqual(classifyHistoricalIncidentCorrelation(adversary.correlation), { qualified: true });
  assert.deepEqual(classifyIncidentCandidate(adversary), {
    action: "qualify",
    family: "failed_retryable_post_irreversible",
  });
});

test("...and it is STILL refused erasure, because qualification is not authority", () => {
  const adversary = candidate({
    jobFingerprint: "cccccccccccc",
    authorityFingerprint: FP_C,
    correlation: correlation({
      provisioningSagaRequestedAt: "2026-08-10T04:05:00.000Z",
      registrationLeaseAt: "2026-08-10T04:05:00.500Z",
      deletionRequestedAt: "2026-08-10T04:06:10.000Z",
    }),
  });
  const historical = candidate({ jobFingerprint: "aaaaaaaaaaaa", authorityFingerprint: FP_A });

  // The population is coherent and exactly at the safety ceiling. Under the previous architecture
  // this was the state that permitted execution.
  const selection = selectIncidentCandidates([historical, adversary], { maxCandidates: 2 });
  assert.equal(selection.qualified.length, 2);
  assert.equal(selection.reviewReady, true, "the machine layer is content — that is the point");

  // And nothing may be destroyed, because no human has decided anything.
  const decision = resolveDestructiveAuthority(selection, null, context());
  assert.deepEqual(decision, { permitted: false, reason: "no_authority_artifact_supplied" });
});

test("the shipped state is: correlation can qualify, destructive authority is NONE", () => {
  const selection = selectIncidentCandidates(
    [
      candidate({ jobFingerprint: "aaaaaaaaaaaa", authorityFingerprint: FP_A }),
      candidate({ jobFingerprint: "bbbbbbbbbbbb", authorityFingerprint: FP_B }),
    ],
    { maxCandidates: 2 },
  );
  assert.equal(selection.reviewReady, true);
  assert.equal(resolveDestructiveAuthority(selection, null, context()).permitted, false);
});

test("a review-ready population is a PRECONDITION, never a permission", () => {
  // Not review-ready => refused before the artifact is even consulted.
  const one = selectIncidentCandidates([candidate()], { maxCandidates: 1 });
  assert.equal(one.reviewReady, false);
  assert.equal(resolveDestructiveAuthority(one, signed(authority()), context()).permitted, false);
});

// ══ the artifact binds to a SET, not a size ═════════════════════════════════

test("an authority reviewed for one candidate set cannot be spent on another of equal size", () => {
  const selection = selectIncidentCandidates(
    [
      candidate({ jobFingerprint: "aaaaaaaaaaaa", authorityFingerprint: FP_A }),
      candidate({ jobFingerprint: "cccccccccccc", authorityFingerprint: FP_C }),
    ],
    { maxCandidates: 2 },
  );
  // Same count, one different member.
  assert.deepEqual(resolveDestructiveAuthority(selection, signed(authority()), context()), {
    permitted: false,
    reason: "candidate_set_differs_from_reviewed",
  });
});

test("the exact reviewed set is permitted, in any order", () => {
  const selection = selectIncidentCandidates(
    [
      candidate({ jobFingerprint: "bbbbbbbbbbbb", authorityFingerprint: FP_B }),
      candidate({ jobFingerprint: "aaaaaaaaaaaa", authorityFingerprint: FP_A }),
    ],
    { maxCandidates: 2 },
  );
  assert.deepEqual(resolveDestructiveAuthority(selection, signed(authority()), context()), {
    permitted: true,
    nonce: "nonce-1",
  });
});

// ══ every binding rule ══════════════════════════════════════════════════════

const qualifiedTwo = [FP_A, FP_B];
/** Signs LAST, so a field override is always covered by the signature it is tested against. */
const evaluate = (
  artifactOver: Partial<FounderIncidentAuthority> = {},
  contextOver: Partial<Omit<AuthorityEvaluationContext, "qualifiedCandidateFingerprints">> = {},
) =>
  evaluateFounderAuthority(signed(authority(artifactOver)), {
    ...context(contextOver),
    qualifiedCandidateFingerprints: qualifiedTwo,
  });

test("no artifact is refused BY NAME, so absence never reads as a passing check", () => {
  assert.deepEqual(
    evaluateFounderAuthority(null, { ...context(), qualifiedCandidateFingerprints: qualifiedTwo }),
    { permitted: false, reason: "no_authority_artifact_supplied" },
  );
});

// ══ AN UNSIGNED DOCUMENT IS NOT A WEAK AUTHORIZATION — IT IS NOT ONE ════════

test("an UNSIGNED artifact cannot authorize, however perfect its contents", () => {
  // Exactly the document the previous model accepted: correct basis, correct bindings, and
  // `reviewedBy: "founder"` — which is a string an execution agent can type.
  const unsigned = authority({ signature: "" });
  assert.deepEqual(
    evaluateFounderAuthority(unsigned, {
      ...context(),
      qualifiedCandidateFingerprints: qualifiedTwo,
    }),
    { permitted: false, reason: "signature_absent" },
  );
});

test('reviewedBy "founder" carries no weight without a signature', () => {
  for (const claimed of ["founder", "Founder", "FOUNDER", "edward", "controller"]) {
    const decision = evaluateFounderAuthority(authority({ reviewedBy: claimed, signature: "" }), {
      ...context(),
      qualifiedCandidateFingerprints: qualifiedTwo,
    });
    assert.equal(decision.permitted, false, claimed);
  }
});

test("a signature from the WRONG key is refused", () => {
  const impostor = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  const artifact = authority();
  const forged = {
    ...artifact,
    signature: signPayload(
      "sha256",
      Buffer.from(canonicalAuthorityPayload(artifact), "utf8"),
      impostor.privateKey,
    ).toString("base64"),
  };
  assert.deepEqual(
    evaluateFounderAuthority(forged, { ...context(), qualifiedCandidateFingerprints: qualifiedTwo }),
    { permitted: false, reason: "signature_invalid" },
  );
});

test("a signature naming an unpinned key id is refused before verification", () => {
  assert.deepEqual(evaluate({ signingKeyId: "some-other-key" }), {
    permitted: false,
    reason: "signing_key_unknown",
  });
});

test("with NO key enrolled, nothing can authorize — the shipped state", () => {
  assert.deepEqual(
    evaluateFounderAuthority(signed(authority()), {
      ...context({ founderKeyRoster: [] }),
      qualifiedCandidateFingerprints: qualifiedTwo,
    }),
    { permitted: false, reason: "no_founder_key_enrolled" },
  );
});

test("tampering with ANY signed field invalidates the signature", () => {
  const genuine = signed(authority());
  const mutations: Array<Partial<FounderIncidentAuthority>> = [
    { reviewedBy: "someone-else" },
    { singleUseNonce: "nonce-2" },
    { sourceCommitSha: "f".repeat(40) },
    { incidentEvidenceVersion: "por1-incident-evidence-v9" },
    { reviewedCandidateCount: 1 },
    { reviewedCandidateFingerprints: [FP_A, FP_C] },
    { observedExecutorState: "on" },
    { expiresAt: "2026-08-12T23:00:01.000Z" },
    { authorityBasis: "SOMETHING_ELSE" as never },
  ];
  for (const mutation of mutations) {
    const tampered = { ...genuine, ...mutation };
    const decision = evaluateFounderAuthority(tampered, {
      ...context(),
      qualifiedCandidateFingerprints: qualifiedTwo,
    });
    assert.equal(decision.permitted, false, JSON.stringify(mutation));
    // The signature must be what catches it, not a later field comparison.
    assert.equal(
      (decision as { reason: string }).reason,
      "signature_invalid",
      `tampering ${JSON.stringify(mutation)} must break the signature`,
    );
  }
});

test("the canonical payload is order- and duplicate-stable", () => {
  const a = authority({ reviewedCandidateFingerprints: [FP_A, FP_B] });
  const b = authority({ reviewedCandidateFingerprints: [FP_B, FP_A, FP_A] });
  assert.equal(canonicalAuthorityPayload(a), canonicalAuthorityPayload(b));
  // ...and genuinely sensitive to a real change.
  assert.notEqual(
    canonicalAuthorityPayload(a),
    canonicalAuthorityPayload(authority({ reviewedCandidateFingerprints: [FP_A, FP_C] })),
  );
});

test("the verifier rejects malformed key material and malformed signatures", () => {
  const artifact = signed(authority());
  assert.equal(verifyFounderSignature(artifact, [{ keyId: "test-key", publicKeyX963Base64: "" }]), false);
  // Built at runtime rather than embedded. The literal base64 of "not-a-key" is twelve distinct
  // characters next to the word `Key`, which is exactly the shape gitleaks' generic-api-key rule
  // looks for — a false positive on obviously-fake material is still a red hard gate.
  const notAKey = Buffer.from("not-a-key", "utf8").toString("base64");
  assert.equal(
    verifyFounderSignature(artifact, [{ keyId: "test-key", publicKeyX963Base64: notAKey }]),
    false,
  );
  assert.equal(verifyFounderSignature({ ...artifact, signature: "!!!" }, TEST_ROSTER), false);
  assert.equal(verifyFounderSignature(artifact, []), false);
});

// ══ candidate identity must be a full digest ════════════════════════════════

test("a 48-bit DISPLAY fingerprint cannot serve as authority identity", () => {
  const short = ["5990ad0e0715", "aa11bb22cc33"];
  const decision = evaluateFounderAuthority(
    signed(authority({ reviewedCandidateFingerprints: short, reviewedCandidateCount: 2 })),
    { ...context(), qualifiedCandidateFingerprints: short },
  );
  assert.deepEqual(decision, {
    permitted: false,
    reason: "authority_fingerprint_not_full_sha256",
  });
});

test("full 64-hex sha256 authority fingerprints are required on both sides", () => {
  assert.match(FP_A, /^[0-9a-f]{64}$/);
  const decision = evaluateFounderAuthority(signed(authority()), {
    ...context(),
    qualifiedCandidateFingerprints: ["5990ad0e0715", "aa11bb22cc33"],
  });
  assert.equal((decision as { reason: string }).reason, "authority_fingerprint_not_full_sha256");
});

// ══ TTL ═════════════════════════════════════════════════════════════════════

test("an authority valid for longer than fifteen minutes is refused", () => {
  const issuedAt = "2026-08-12T00:00:00.000Z";
  const tooLong = new Date(Date.parse(issuedAt) + POR1_AUTHORITY_MAX_TTL_MS + 1).toISOString();
  assert.deepEqual(
    evaluate({ issuedAt, expiresAt: tooLong }, { now: Date.parse(issuedAt) + 1000 }),
    { permitted: false, reason: "authority_ttl_above_maximum" },
  );
});

test("a fifteen-minute authority is accepted at its edge", () => {
  const issuedAt = "2026-08-12T00:00:00.000Z";
  const exactly = new Date(Date.parse(issuedAt) + POR1_AUTHORITY_MAX_TTL_MS).toISOString();
  assert.equal(
    evaluate({ issuedAt, expiresAt: exactly }, { now: Date.parse(issuedAt) + 1000 }).permitted,
    true,
  );
});

test("a human decision may not be relabelled as a historical finding", () => {
  assert.deepEqual(
    evaluate({ authorityBasis: "HISTORICAL_SYNTHETIC_MEMBERSHIP_PROVEN" as never }),
    { permitted: false, reason: "authority_basis_invalid" },
  );
});

test("it is bound to the exact source revision", () => {
  assert.equal(evaluate({ sourceCommitSha: "a".repeat(40) }).permitted, false);
  assert.equal(evaluate({}, { currentSourceCommitSha: "b".repeat(40) }).permitted, false);
  assert.equal(evaluate({ sourceCommitSha: "not-a-sha" }).permitted, false);
});

test("it is bound to the incident contract version", () => {
  assert.deepEqual(evaluate({ incidentEvidenceVersion: "por1-incident-evidence-v0" }), {
    permitted: false,
    reason: "incident_evidence_version_mismatch",
  });
});

test("it is bound to the artifact schema version", () => {
  assert.deepEqual(evaluate({ version: "por1-incident-authority-v0" }), {
    permitted: false,
    reason: "authority_version_mismatch",
  });
});

test("an executor capability that changed since review invalidates it", () => {
  assert.deepEqual(evaluate({ observedExecutorState: "on" }), {
    permitted: false,
    reason: "executor_state_changed_since_review",
  });
});

test("it is single use — a replayed nonce is not a second decision", () => {
  assert.deepEqual(evaluate({}, { spentNonces: new Set(["nonce-1"]) }), {
    permitted: false,
    reason: "authority_already_spent",
  });
  assert.equal(evaluate({ singleUseNonce: "" }).permitted, false);
});

test("it expires, and is not valid before it was issued", () => {
  assert.deepEqual(evaluate({}, { now: Date.parse("2026-08-12T00:15:00.001Z") }), {
    permitted: false,
    reason: "authority_expired",
  });
  assert.deepEqual(evaluate({}, { now: Date.parse("2026-08-11T23:59:59.000Z") }), {
    permitted: false,
    reason: "authority_not_yet_valid",
  });
  assert.equal(evaluate({ expiresAt: "2026-08-11T22:00:00.000Z" }).permitted, false);
  // A naive timestamp has no single meaning, so it cannot bound an authority.
  assert.equal(evaluate({ expiresAt: "2026-08-12T00:15:00" }).permitted, false);
});

test("an unattributed review is refused", () => {
  assert.deepEqual(evaluate({ reviewedBy: "   " }), {
    permitted: false,
    reason: "reviewer_unattributed",
  });
});

test("a restated count that disagrees with the reviewed set is refused", () => {
  assert.deepEqual(evaluate({ reviewedCandidateCount: 3 }), {
    permitted: false,
    reason: "reviewed_count_inconsistent",
  });
});

test("it can never authorise more than the population safety ceiling", () => {
  const three = [FP_A, FP_B, FP_C];
  const decision = evaluateFounderAuthority(
    signed(authority({ reviewedCandidateFingerprints: three, reviewedCandidateCount: 3 })),
    { ...context(), qualifiedCandidateFingerprints: three },
  );
  assert.deepEqual(decision, {
    permitted: false,
    reason: "reviewed_count_exceeds_population_ceiling",
  });
});

// ══ parsing ═════════════════════════════════════════════════════════════════

test("a malformed artifact parses to null, which is refused by name", () => {
  for (const bad of [null, "{}", [], 42, {}, { version: 1 }]) {
    assert.equal(parseFounderAuthority(bad), null, JSON.stringify(bad));
  }
});

test("an artifact carrying identity is refused outright, not trimmed", () => {
  const withEmail = { ...authority(), reviewedCandidateFingerprints: ["someone@example.invalid"] };
  assert.equal(parseFounderAuthority(withEmail), null);
  const withAccountId = { ...authority(), reviewedCandidateFingerprints: ["acct_1786333733479_x"] };
  assert.equal(parseFounderAuthority(withAccountId), null);
});

test("a well-formed artifact round-trips", () => {
  const parsed = parseFounderAuthority(JSON.parse(JSON.stringify(authority())));
  assert.deepEqual(parsed, authority());
});

test("the SHIPPED roster is empty, so destructive authority is NONE as delivered", () => {
  assert.equal(
    POR1_FOUNDER_AUTHORITY_KEY_ROSTER.length,
    0,
    "a pinned Founder key is a Founder action; enrolling one here would defeat the boundary",
  );
  // And with it empty, even a correctly-signed artifact cannot authorize.
  assert.deepEqual(
    evaluateFounderAuthority(signed(authority()), {
      ...context({ founderKeyRoster: POR1_FOUNDER_AUTHORITY_KEY_ROSTER }),
      qualifiedCandidateFingerprints: qualifiedTwo,
    }),
    { permitted: false, reason: "no_founder_key_enrolled" },
  );
});

test("no Production software-key fallback exists anywhere in the authority path", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const verifierSource = readFileSync(join(here, "..", "por1FounderIncidentAuthority.ts"), "utf8");
  const code = verifierSource.replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");
  for (const forbidden of [
    "generateKeyPairSync",
    "createPrivateKey",
    "privateKey",
    "PRIVATE KEY",
    "process.env",
  ]) {
    assert.ok(!code.includes(forbidden), `the verifier must never touch ${forbidden}`);
  }
  // It verifies and nothing else: no signing primitive is imported.
  assert.ok(!/\bsign\s*\(/.test(code), "the verifier must not be able to sign");
});

test("the Secure Enclave helper demands biometry and never exports the private key", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const swift = readFileSync(
    join(here, "..", "..", "..", "tools", "por1-founder-signer", "main.swift"),
    "utf8",
  );
  assert.match(swift, /kSecAttrTokenIDSecureEnclave/);
  assert.match(swift, /\.biometryCurrentSet/, "presence must be bound to the CURRENT fingerprints");
  assert.match(swift, /kSecAttrIsPermanent/);
  // The private half is never exported — only SecKeyCopyPublicKey is ever exported.
  assert.ok(
    !/SecKeyCopyExternalRepresentation\(\s*privateKey/.test(swift),
    "the private key must never be exported",
  );
  assert.match(swift, /refusing to sign an empty payload/);
});

test("no artifact ships with this repository, and nothing here can mint one", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const text = readFileSync(join(here, "..", "por1FounderIncidentAuthority.ts"), "utf8");
  const code = text.replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");
  for (const forbidden of ["function issueFounderAuthority", "sign(", "privateKey", "randomUUID"]) {
    assert.ok(!code.includes(forbidden), `must not be able to mint authority: ${forbidden}`);
  }
});
