// §14 E — operator recovery SELECTION. The rule is a conjunction, and every clause is load-bearing:
// a recovery tool that guesses is a deletion tool with extra steps.
//
// The conjunction now has two independent halves and they answer different questions. MEMBERSHIP
// (`por1SyntheticMembershipEvidence`, pinned in its own file) asks whether an account belonged to
// the historical release-check execution, using only what the database wrote at the time.
// CONCORDANCE asks whether the records in front of us describe the same account. Neither substitutes
// for the other, and the tests below exist mostly to prove that: a candidate with flawless identity
// agreement and no membership evidence is refused, and so is the reverse.
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  classifyIncidentCandidate,
  isUnroutableReservedAddress,
  selectIncidentCandidates,
  type IncidentCandidateRow,
} from "../por1ProductionIncidentRecovery";
import type { SyntheticMembershipEvidence } from "../por1SyntheticMembershipEvidence";

const provenMembership = (
  over: Partial<SyntheticMembershipEvidence> = {},
): SyntheticMembershipEvidence => ({
  registrationLeaseAt: "2026-08-10T03:48:53.990Z",
  deletionRequestedAt: "2026-08-10T03:49:19.271Z",
  manifestPresent: true,
  manifestDomainArtifactCount: 0,
  manifestCanonicalIdentityLinkCount: 1,
  liveDomainArtifactCount: 0,
  releaseWindow: { startedAt: "2026-08-10T03:32:53Z", endedAt: "2026-08-10T04:20:39Z" },
  ...over,
});

const incident = (over: Partial<IncidentCandidateRow> = {}): IncidentCandidateRow => ({
  jobFingerprint: "5990ad0e0715",
  state: "failed_retryable",
  executionCursor: "database_erasure",
  irreversible: true,
  manifestPresent: true,
  ownerNamed: true,
  executorLeaseLive: false,
  membership: provenMembership(),
  authoritativeAccountPresent: true,
  accountIdMatchesOwner: true,
  emailDigestConcordant: true,
  ownerFingerprintConcordant: true,
  ownerAddressUnroutable: true,
  ...over,
});

test("only a FAILED_RETRYABLE post-irreversible incident job is resumable", () => {
  assert.deepEqual(classifyIncidentCandidate(incident()), {
    action: "resume",
    family: "failed_retryable_post_irreversible",
  });
});

test("a pre-irreversible job is refused — resuming it would cross the boundary for someone", () => {
  assert.deepEqual(classifyIncidentCandidate(incident({ irreversible: false })), {
    action: "refuse",
    reason: "not_irreversible",
  });
});

test("a job with no manifest is refused", () => {
  assert.deepEqual(classifyIncidentCandidate(incident({ manifestPresent: false })), {
    action: "refuse",
    reason: "manifest_missing",
  });
});

test("a job with a live executor claim is revisit, never raced", () => {
  assert.deepEqual(classifyIncidentCandidate(incident({ executorLeaseLive: true })), {
    action: "revisit",
    reason: "executor_lease_live",
  });
});

test("a conflicting live lease outranks even a fully proven candidate", () => {
  const row = incident({ executorLeaseLive: true });
  assert.equal(classifyIncidentCandidate(row).action, "revisit");
  assert.equal(selectIncidentCandidates([row], { maxCandidates: 0 }).resumable.length, 0);
});

test("a job parked at another cursor is refused", () => {
  assert.deepEqual(classifyIncidentCandidate(incident({ executionCursor: "storage_erasure" })), {
    action: "refuse",
    reason: "cursor_not_database_erasure",
  });
});

test("a job in any other state is refused", () => {
  for (const state of ["completed", "cancelled", "failed_terminal", "legal_hold", "requested", null]) {
    assert.equal(classifyIncidentCandidate(incident({ state })).action, "refuse", String(state));
  }
});

test("an owner-free (already de-identified) job is refused", () => {
  assert.deepEqual(classifyIncidentCandidate(incident({ ownerNamed: false })), {
    action: "refuse",
    reason: "owner_not_named",
  });
});

// ── membership must be PROVEN from persisted execution truth ────────────────

test("missing independent synthetic evidence is refused, whatever the identity records say", () => {
  const row = incident({ membership: provenMembership({ registrationLeaseAt: null }) });
  assert.deepEqual(classifyIncidentCandidate(row), {
    action: "refuse",
    reason: "synthetic_membership_unproven:registration_lease_absent",
  });
});

test("an account that lived a real life is refused even with perfect concordance", () => {
  const row = incident({
    membership: provenMembership({
      registrationLeaseAt: "2026-07-01T09:00:00Z",
      deletionRequestedAt: "2026-08-10T03:49:19.271Z",
    }),
  });
  assert.equal(classifyIncidentCandidate(row).action, "refuse");
  assert.match(
    String((classifyIncidentCandidate(row) as { reason: string }).reason),
    /^synthetic_membership_unproven:/,
  );
});

test("a candidate with product activity is refused", () => {
  const row = incident({ membership: provenMembership({ liveDomainArtifactCount: 4 }) });
  assert.deepEqual(classifyIncidentCandidate(row), {
    action: "refuse",
    reason: "synthetic_membership_unproven:live_domain_artifacts_present",
  });
});

test("the reserved .invalid TLD ALONE does not make a candidate resumable", () => {
  // Everything an address can tell us is true here, and membership is absent. The old rule would
  // have resumed this. That is the whole reason the rule was rewritten.
  const row = incident({
    ownerAddressUnroutable: true,
    membership: provenMembership({ registrationLeaseAt: null, liveDomainArtifactCount: null }),
  });
  assert.equal(classifyIncidentCandidate(row).action, "refuse");
});

test("the reviewed ceiling ALONE does not make a candidate resumable", () => {
  // The population is exactly the reviewed number, and the rule still refuses. The ceiling is a
  // safety guard; it was never identity proof and cannot promote anything.
  const rows = [
    incident({ jobFingerprint: "a", membership: provenMembership({ manifestDomainArtifactCount: 2 }) }),
    incident({ jobFingerprint: "b", membership: provenMembership({ manifestDomainArtifactCount: 2 }) }),
  ];
  const selection = selectIncidentCandidates(rows, { maxCandidates: 2 });
  assert.equal(selection.resumable.length, 0);
  assert.equal(selection.safeToExecute, false);
  assert.equal(selection.blockReason, "unknown_or_non_synthetic_candidate_present");
});

// ── concordance must hold too — membership is not permission ────────────────

test("a missing authoritative account is refused", () => {
  assert.deepEqual(classifyIncidentCandidate(incident({ authoritativeAccountPresent: false })), {
    action: "refuse",
    reason: "authoritative_account_absent",
  });
});

test("an authoritative account that is not this job's owner is refused", () => {
  assert.deepEqual(classifyIncidentCandidate(incident({ accountIdMatchesOwner: false })), {
    action: "refuse",
    reason: "authoritative_account_owner_mismatch",
  });
});

test("a wrong email digest is refused", () => {
  assert.deepEqual(classifyIncidentCandidate(incident({ emailDigestConcordant: false })), {
    action: "refuse",
    reason: "email_digest_discordant",
  });
});

test("a wrong owner fingerprint is refused", () => {
  assert.deepEqual(classifyIncidentCandidate(incident({ ownerFingerprintConcordant: false })), {
    action: "refuse",
    reason: "owner_fingerprint_discordant",
  });
});

test("a routable or unknown address is refused — the narrowing clause only ever subtracts", () => {
  for (const value of [false, null]) {
    assert.deepEqual(classifyIncidentCandidate(incident({ ownerAddressUnroutable: value })), {
      action: "refuse",
      reason: "owner_address_routable_or_unknown",
    });
  }
});

test("the unroutable check reads the domain only, and is supporting evidence at that", () => {
  assert.equal(isUnroutableReservedAddress("anything@some-host.invalid"), true);
  assert.equal(isUnroutableReservedAddress("por1-x-y@sub.domain.invalid"), true);
  assert.equal(isUnroutableReservedAddress("someone@real-person.example"), false);
  assert.equal(isUnroutableReservedAddress("someone@invalid.com"), false);
  assert.equal(isUnroutableReservedAddress("no-at-sign.invalid"), false);
  assert.equal(isUnroutableReservedAddress("trailing@"), false);
  assert.equal(isUnroutableReservedAddress(null), false);
});

// ── population-level fail-closed ────────────────────────────────────────────

test("the reviewed set and the executed set must be the same set", () => {
  const two = [incident({ jobFingerprint: "a" }), incident({ jobFingerprint: "b" })];
  assert.equal(selectIncidentCandidates(two, { maxCandidates: 2 }).safeToExecute, true);
});

test("a population above the reviewed ceiling refuses to execute", () => {
  const three = [incident({ jobFingerprint: "a" }), incident({ jobFingerprint: "b" }), incident({ jobFingerprint: "c" })];
  const selection = selectIncidentCandidates(three, { maxCandidates: 2 });
  assert.equal(selection.safeToExecute, false);
  assert.equal(selection.blockReason, "candidate_population_above_ceiling");
});

test("a population BELOW the reviewed ceiling also refuses — the set changed since review", () => {
  const one = [incident()];
  const selection = selectIncidentCandidates(one, { maxCandidates: 2 });
  assert.equal(selection.safeToExecute, false);
  assert.equal(selection.blockReason, "candidate_population_below_ceiling");
});

test("an unexpected extra eligible candidate blocks the whole run", () => {
  const rows = [incident({ jobFingerprint: "a" }), incident({ jobFingerprint: "b" })];
  const selection = selectIncidentCandidates(rows, { maxCandidates: 1 });
  assert.equal(selection.safeToExecute, false);
  assert.equal(selection.blockReason, "candidate_population_above_ceiling");
});

test("one unrecognised candidate blocks the whole run, and it is reported not touched", () => {
  const rows = [
    incident(),
    incident({ jobFingerprint: "x", membership: provenMembership({ liveDomainArtifactCount: 9 }) }),
  ];
  const selection = selectIncidentCandidates(rows, { maxCandidates: 1 });
  assert.equal(selection.safeToExecute, false);
  assert.equal(selection.blockReason, "unknown_or_non_synthetic_candidate_present");
  assert.equal(selection.refused.length, 1);
  assert.equal(selection.refused[0].row.jobFingerprint, "x");
});

test("every concordance failure counts as unrecognised and blocks the run", () => {
  for (const over of [
    { authoritativeAccountPresent: false },
    { accountIdMatchesOwner: false },
    { emailDigestConcordant: false },
    { ownerFingerprintConcordant: false },
    { ownerAddressUnroutable: null },
  ] as Array<Partial<IncidentCandidateRow>>) {
    const selection = selectIncidentCandidates([incident(over)], { maxCandidates: 0 });
    assert.equal(selection.blockReason, "unknown_or_non_synthetic_candidate_present", JSON.stringify(over));
  }
});

test("a structurally out-of-scope row is refused but does NOT block a clean run", () => {
  // "This was never in scope" and "I cannot account for this" are different findings. Only the
  // second one should stop a reviewed recovery.
  const rows = [incident({ jobFingerprint: "a" }), incident({ jobFingerprint: "z", state: "completed" })];
  const selection = selectIncidentCandidates(rows, { maxCandidates: 1 });
  assert.equal(selection.blockReason, null);
  assert.equal(selection.safeToExecute, true);
  assert.equal(selection.refused.length, 1);
});

test("a missing ceiling refuses", () => {
  assert.equal(selectIncidentCandidates([incident()], { maxCandidates: -1 }).safeToExecute, false);
});

// ── the script's own guarantees, asserted against its source ────────────────

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = readFileSync(
  join(HERE, "..", "..", "..", "scripts", "por1-production-deletion-recovery.ts"),
  "utf8",
);
/** Comments explain the old defect at length; the guards below must judge the CODE. */
const SCRIPT_CODE = SCRIPT.replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");

test("the executable path does not depend on the nonexistent link_subject column", () => {
  assert.ok(
    !SCRIPT_CODE.includes("link_subject"),
    "yorisou_canonical_identity_links has no link_subject; selecting it made the tool inert",
  );
  assert.match(SCRIPT_CODE, /link_kind=eq\.email/, "the email link is still the one resolved");
  assert.match(SCRIPT_CODE, /select=link_digest,owner_fingerprint/, "it selects columns that exist");
});

test("membership is derived, and the address is never asked to prove it", () => {
  assert.match(SCRIPT_CODE, /operation_code=eq\.\$\{REGISTRATION_OPERATION_CODE\}/);
  assert.match(SCRIPT_CODE, /buildDeletionManifest\(/, "the live re-inventory is taken");
  assert.match(SCRIPT_CODE, /countManifestDomainArtifacts\(/);
  assert.ok(!SCRIPT_CODE.includes("isIncidentSyntheticEmail"), "the address rule is gone");
});

test("concordance uses the canonical helpers and the authoritative read path", () => {
  assert.match(SCRIPT_CODE, /findAccountById\(/);
  assert.match(SCRIPT_CODE, /emailIdentityDigest\(normalizeEmail\(/);
  assert.match(SCRIPT_CODE, /identityOwnerFingerprint\(/);
});

test("the release window is required in dry run as well as execute", () => {
  assert.match(SCRIPT_CODE, /--release-window-start/);
  assert.match(SCRIPT_CODE, /--release-window-end/);
  // It is read before the ceiling and before any candidate is scanned, so a dry run cannot review a
  // different rule than the one --execute would apply.
  const windowAt = SCRIPT_CODE.indexOf("const window = releaseWindow()");
  const scanAt = SCRIPT_CODE.indexOf("await readCandidates(");
  assert.ok(windowAt > 0 && scanAt > windowAt, "the window is resolved before candidates are read");
});

test("execution delegates to executeDeletion and to no direct erasure adapter", () => {
  assert.match(SCRIPT, /executeDeletion\(/, "the governed saga is the only engine");
  for (const forbidden of [
    "erase_database",
    "deleteAccountLinkedObjects",
    "deletePrimaryIdentity",
    "deleteAccountIndexes",
    "method: \"DELETE\"",
  ]) {
    assert.ok(!SCRIPT.includes(forbidden), `must not call ${forbidden} directly`);
  }
});

test("the tool never opens a deletion job", () => {
  assert.ok(!SCRIPT.includes("openDeletionJob"), "resuming is not the same as opening");
  assert.ok(!SCRIPT.includes("deletion-request"));
});

test("it is Production-guarded and refuses Preview and unknown projects", () => {
  assert.match(SCRIPT, /krxizslnksorwhepyijs/, "the governed Production ref is named");
  assert.match(SCRIPT, /nbltsbonsnbpfptihomc/, "Preview is named so the refusal can be explicit");
  assert.match(SCRIPT, /this tool is Production-only/);
  assert.match(SCRIPT, /is not the governed Production project/);
});

test("it takes no raw table, object key, email, account id or job id from the CLI", () => {
  assert.match(SCRIPT, /FORBIDDEN_FLAGS/);
  for (const flag of ["--table", "--object-key", "--email", "--account-id", "--job-id"]) {
    assert.ok(SCRIPT.includes(flag), `${flag} must be explicitly rejected`);
  }
});

test("it is dry-run by default and needs an explicit ceiling to destroy anything", () => {
  assert.match(SCRIPT, /const EXECUTE = argv\.includes\("--execute"\)/);
  assert.match(SCRIPT, /--execute requires an explicit --max-candidates/);
});

test("it has no schedule, cron, endpoint or autonomous trigger", () => {
  for (const forbidden of ["cron", "schedule", "setInterval", "NextResponse", "export async function GET", "export async function POST"]) {
    assert.ok(!SCRIPT_CODE.includes(forbidden), `must not contain ${forbidden}`);
  }
});
