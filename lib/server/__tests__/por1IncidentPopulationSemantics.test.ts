// POR-1 — what a population count can and cannot mean.
//
// An earlier revision pinned `expectedStrandedJobCount: 2` and leaned on it as though a matching
// count helped establish WHICH accounts were the historical ones. An independent re-audit rejected
// that, correctly:
//
//     historical residue A  +  historical residue B    -> 2
//     historical residue A  +  unrelated candidate C   -> 2
//
// Both populations satisfy the ceiling. A count is a blast-radius control; it cannot name a member.
//
// The field is now `populationSafetyCeiling`, and this file exists so that meaning cannot quietly
// drift back into an identity claim during a later refactor.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  POR1_INCIDENT_EVIDENCE_VERSION,
  POR1_PRODUCTION_DELETION_INCIDENT,
} from "../por1HistoricalIncidentEvidence";
import {
  resolveDestructiveAuthority,
  selectIncidentCandidates,
  type IncidentCandidateRow,
} from "../por1ProductionIncidentRecovery";

const candidate = (jobFingerprint: string, at: string): IncidentCandidateRow => ({
  jobFingerprint,
  authorityFingerprint: createHash("sha256").update(jobFingerprint).digest("hex"),
  state: "failed_retryable",
  executionCursor: "database_erasure",
  irreversible: true,
  manifestPresent: true,
  ownerNamed: true,
  executorLeaseLive: false,
  correlation: {
    incidentEvidenceVersion: POR1_INCIDENT_EVIDENCE_VERSION,
    provisioningSagaRequestedAt: at,
    registrationLeaseAt: at,
    deletionRequestedAt: at,
    manifestPresent: true,
    manifestDomainArtifactCount: 0,
    manifestCanonicalIdentityLinkCount: 1,
    liveDomainArtifactCount: 0,
  },
  activeEmailLinkCount: 1,
  activeIdentityLinkCount: 1,
  registrationLeaseCount: 1,
  accountCreatedWithinIncidentWindow: true,
  authoritativeAccountPresent: true,
  accountIdMatchesOwner: true,
  emailDigestConcordant: true,
  ownerFingerprintConcordant: true,
  ownerAddressUnroutable: true,
});

/** The two historical owners, at the instants Production actually recorded. */
const historicalA = candidate("aaaaaaaaaaaa", "2026-08-10T03:48:53.990Z");
const historicalB = candidate("bbbbbbbbbbbb", "2026-08-10T03:49:04.170Z");
/** An unrelated account that merely happened to exist inside the same pinned window. */
const unrelatedC = candidate("cccccccccccc", "2026-08-10T04:05:00.000Z");

test("the ceiling cannot distinguish {A,B} from {A,C} — both are a population of two", () => {
  const historical = selectIncidentCandidates([historicalA, historicalB], { maxCandidates: 2 });
  const contaminated = selectIncidentCandidates([historicalA, unrelatedC], { maxCandidates: 2 });

  assert.equal(historical.qualified.length, 2);
  assert.equal(contaminated.qualified.length, 2);
  // Identical on every count-derived signal. This is the whole point.
  assert.equal(historical.reviewReady, contaminated.reviewReady);
  assert.equal(historical.blockReason, contaminated.blockReason);
  assert.equal(historical.reviewReady, true);
});

test("so neither population may be destroyed on the strength of the count", () => {
  const context = {
    currentSourceCommitSha: "e".repeat(40),
    currentIncidentEvidenceVersion: POR1_INCIDENT_EVIDENCE_VERSION,
    populationSafetyCeiling: POR1_PRODUCTION_DELETION_INCIDENT.populationSafetyCeiling,
    currentExecutorState: "off" as const,
    spentNonces: new Set<string>(),
    founderKeyRoster: [],
    now: Date.parse("2026-08-12T00:00:00.000Z"),
  };
  for (const rows of [[historicalA, historicalB], [historicalA, unrelatedC]]) {
    const selection = selectIncidentCandidates(rows, { maxCandidates: 2 });
    assert.deepEqual(resolveDestructiveAuthority(selection, null, context), {
      permitted: false,
      reason: "no_authority_artifact_supplied",
    });
  }
});

test("the ceiling still does its actual job — bounding blast radius", () => {
  const three = selectIncidentCandidates([historicalA, historicalB, unrelatedC], {
    maxCandidates: 3,
  });
  assert.equal(three.reviewReady, false);
  assert.equal(three.blockReason, "candidate_population_differs_from_safety_ceiling");
});

// ── the name and the documented meaning are load-bearing ────────────────────

const HERE = dirname(fileURLToPath(import.meta.url));
const CONTRACT = readFileSync(join(HERE, "..", "por1HistoricalIncidentEvidence.ts"), "utf8");
const SELECTION = readFileSync(join(HERE, "..", "por1ProductionIncidentRecovery.ts"), "utf8");

test("the field is named as a safety control, not as an expectation about identity", () => {
  assert.ok("populationSafetyCeiling" in POR1_PRODUCTION_DELETION_INCIDENT);
  assert.ok(
    !("expectedStrandedJobCount" in POR1_PRODUCTION_DELETION_INCIDENT),
    "the old name invited the reading the re-audit refused",
  );
  assert.equal(POR1_PRODUCTION_DELETION_INCIDENT.populationSafetyCeiling, 2);
});

test("the contract documents what the count cannot do", () => {
  assert.match(CONTRACT, /Not identity, and not provenance/);
  assert.match(CONTRACT, /unrelated candidate C/);
  assert.match(CONTRACT, /cannot re-derive it/);
});

test("no code path treats the count as evidence about which objects qualified", () => {
  const code = SELECTION.replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");
  // The ceiling may only ever produce a block reason; it must never appear in a branch that decides
  // an individual candidate's verdict.
  const classifyBody = code.slice(
    code.indexOf("export function classifyIncidentCandidate"),
    code.indexOf("export type IncidentSelection"),
  );
  assert.ok(classifyBody.length > 0);
  assert.ok(
    !classifyBody.includes("populationSafetyCeiling"),
    "per-candidate classification must not consult a population count",
  );
});
