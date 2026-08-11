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
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  evaluateFounderAuthority,
  FOUNDER_REVIEWED_INCIDENT_OVERRIDE,
  parseFounderAuthority,
  POR1_INCIDENT_AUTHORITY_VERSION,
  type AuthorityEvaluationContext,
  type FounderIncidentAuthority,
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
  now: Date.parse("2026-08-12T00:00:00.000Z"),
  ...over,
});

const authority = (over: Partial<FounderIncidentAuthority> = {}): FounderIncidentAuthority => ({
  version: POR1_INCIDENT_AUTHORITY_VERSION,
  authorityBasis: FOUNDER_REVIEWED_INCIDENT_OVERRIDE,
  incidentEvidenceVersion: POR1_INCIDENT_EVIDENCE_VERSION,
  sourceCommitSha: SOURCE_SHA,
  reviewedCandidateFingerprints: ["aaaaaaaaaaaa", "bbbbbbbbbbbb"],
  reviewedCandidateCount: 2,
  reviewedBy: "founder",
  issuedAt: "2026-08-11T23:00:00.000Z",
  expiresAt: "2026-08-12T23:00:00.000Z",
  singleUseNonce: "nonce-1",
  observedExecutorState: "off",
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
    correlation: correlation({
      provisioningSagaRequestedAt: "2026-08-10T04:05:00.000Z",
      registrationLeaseAt: "2026-08-10T04:05:00.500Z",
      deletionRequestedAt: "2026-08-10T04:06:10.000Z",
    }),
  });
  const historical = candidate({ jobFingerprint: "aaaaaaaaaaaa" });

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
    [candidate({ jobFingerprint: "aaaaaaaaaaaa" }), candidate({ jobFingerprint: "bbbbbbbbbbbb" })],
    { maxCandidates: 2 },
  );
  assert.equal(selection.reviewReady, true);
  assert.equal(resolveDestructiveAuthority(selection, null, context()).permitted, false);
});

test("a review-ready population is a PRECONDITION, never a permission", () => {
  // Not review-ready => refused before the artifact is even consulted.
  const one = selectIncidentCandidates([candidate()], { maxCandidates: 1 });
  assert.equal(one.reviewReady, false);
  assert.equal(resolveDestructiveAuthority(one, authority(), context()).permitted, false);
});

// ══ the artifact binds to a SET, not a size ═════════════════════════════════

test("an authority reviewed for one candidate set cannot be spent on another of equal size", () => {
  const selection = selectIncidentCandidates(
    [candidate({ jobFingerprint: "aaaaaaaaaaaa" }), candidate({ jobFingerprint: "cccccccccccc" })],
    { maxCandidates: 2 },
  );
  // Same count, one different member.
  assert.deepEqual(resolveDestructiveAuthority(selection, authority(), context()), {
    permitted: false,
    reason: "candidate_set_differs_from_reviewed",
  });
});

test("the exact reviewed set is permitted, in any order", () => {
  const selection = selectIncidentCandidates(
    [candidate({ jobFingerprint: "bbbbbbbbbbbb" }), candidate({ jobFingerprint: "aaaaaaaaaaaa" })],
    { maxCandidates: 2 },
  );
  assert.deepEqual(resolveDestructiveAuthority(selection, authority(), context()), {
    permitted: true,
    nonce: "nonce-1",
  });
});

// ══ every binding rule ══════════════════════════════════════════════════════

const qualifiedTwo = ["aaaaaaaaaaaa", "bbbbbbbbbbbb"];
const evaluate = (
  artifactOver: Partial<FounderIncidentAuthority> = {},
  contextOver: Partial<Omit<AuthorityEvaluationContext, "qualifiedCandidateFingerprints">> = {},
) =>
  evaluateFounderAuthority(authority(artifactOver), {
    ...context(contextOver),
    qualifiedCandidateFingerprints: qualifiedTwo,
  });

test("no artifact is refused BY NAME, so absence never reads as a passing check", () => {
  assert.deepEqual(
    evaluateFounderAuthority(null, { ...context(), qualifiedCandidateFingerprints: qualifiedTwo }),
    { permitted: false, reason: "no_authority_artifact_supplied" },
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
  assert.deepEqual(evaluate({}, { now: Date.parse("2026-08-13T00:00:01.000Z") }), {
    permitted: false,
    reason: "authority_expired",
  });
  assert.deepEqual(evaluate({}, { now: Date.parse("2026-08-11T22:00:00.000Z") }), {
    permitted: false,
    reason: "authority_not_yet_valid",
  });
  assert.equal(evaluate({ expiresAt: "2026-08-11T22:00:00.000Z" }).permitted, false);
  // A naive timestamp has no single meaning, so it cannot bound an authority.
  assert.equal(evaluate({ expiresAt: "2026-08-12T23:00:00" }).permitted, false);
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
  const three = ["aaaaaaaaaaaa", "bbbbbbbbbbbb", "cccccccccccc"];
  const decision = evaluateFounderAuthority(
    authority({ reviewedCandidateFingerprints: three, reviewedCandidateCount: 3 }),
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

test("no artifact ships with this repository, and nothing here can mint one", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const text = readFileSync(join(here, "..", "por1FounderIncidentAuthority.ts"), "utf8");
  const code = text.replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");
  for (const forbidden of ["function issueFounderAuthority", "sign(", "privateKey", "randomUUID"]) {
    assert.ok(!code.includes(forbidden), `must not be able to mint authority: ${forbidden}`);
  }
});
