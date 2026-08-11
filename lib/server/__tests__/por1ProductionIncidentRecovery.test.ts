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
import {
  POR1_INCIDENT_EVIDENCE_VERSION,
  POR1_PRODUCTION_DELETION_INCIDENT,
} from "../por1HistoricalIncidentEvidence";
import type { SyntheticMembershipEvidence } from "../por1SyntheticMembershipEvidence";

const provenMembership = (
  over: Partial<SyntheticMembershipEvidence> = {},
): SyntheticMembershipEvidence => ({
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

const incident = (over: Partial<IncidentCandidateRow> = {}): IncidentCandidateRow => ({
  jobFingerprint: "5990ad0e0715",
  state: "failed_retryable",
  executionCursor: "database_erasure",
  irreversible: true,
  manifestPresent: true,
  ownerNamed: true,
  executorLeaseLive: false,
  membership: provenMembership(),
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
      provisioningSagaRequestedAt: "2026-07-01T09:00:00.000Z",
      registrationLeaseAt: "2026-07-01T09:00:00.000Z",
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

test("a LOOK-ALIKE candidate outside the pinned incident is refused and blocks the run", () => {
  // Structurally identical to the historical incident in every respect the old rule could see:
  // failed_retryable past the boundary, unroutable address, one identity, flawless concordance,
  // zero artifacts, a short life. It simply did not happen during the pinned incident.
  const threeWeeks = 21 * 24 * 60 * 60 * 1000;
  const shift = (at: string) => new Date(Date.parse(at) + threeWeeks).toISOString();
  const lookalike = incident({
    jobFingerprint: "lookalike",
    membership: provenMembership({
      provisioningSagaRequestedAt: shift("2026-08-10T03:48:53.261Z"),
      registrationLeaseAt: shift("2026-08-10T03:48:53.990Z"),
      deletionRequestedAt: shift("2026-08-10T03:49:19.271Z"),
    }),
  });

  assert.deepEqual(classifyIncidentCandidate(lookalike), {
    action: "refuse",
    reason: "synthetic_membership_unproven:provisioning_outside_incident_window",
  });

  // And it is an UNRECOGNISED refusal, so it stops the whole reviewed run rather than being skipped.
  const selection = selectIncidentCandidates([incident(), lookalike], { maxCandidates: 2 });
  assert.equal(selection.safeToExecute, false);
  assert.equal(selection.blockReason, "unknown_or_non_synthetic_candidate_present");
});

// ── ambiguous canonical identity must fail closed ───────────────────────────

test("TWO active email links for one owner is a REFUSAL, never a first-row choice", () => {
  // The schema constrains link_id and the digest shape. Nothing constrains
  // (owner_account_id, link_kind), so this state is legal and must be refused rather than resolved.
  assert.deepEqual(classifyIncidentCandidate(incident({ activeEmailLinkCount: 2, activeIdentityLinkCount: 2 })), {
    action: "refuse",
    reason: "canonical_email_link_ambiguous",
  });
});

test("no active email link, or an uncountable inventory, is refused", () => {
  assert.deepEqual(classifyIncidentCandidate(incident({ activeEmailLinkCount: 0 })), {
    action: "refuse",
    reason: "canonical_email_link_absent",
  });
  assert.deepEqual(classifyIncidentCandidate(incident({ activeEmailLinkCount: null })), {
    action: "refuse",
    reason: "canonical_email_link_absent",
  });
  assert.deepEqual(classifyIncidentCandidate(incident({ activeIdentityLinkCount: null })), {
    action: "refuse",
    reason: "identity_link_inventory_unknown",
  });
});

test("a live identity inventory that disagrees with the frozen manifest is refused", () => {
  // One email link, so the ambiguity guard passes — but the account has since acquired a second
  // identity of another kind, and the manifest that would drive erasure predates it.
  assert.deepEqual(classifyIncidentCandidate(incident({ activeEmailLinkCount: 1, activeIdentityLinkCount: 2 })), {
    action: "refuse",
    reason: "identity_link_inventory_conflicts_manifest",
  });
});

test("ambiguity is decided BEFORE concordance, so a matching first row cannot rescue it", () => {
  // Every concordance flag is true, exactly as it would be if the first of two links happened to
  // agree. The verdict must still be the ambiguity, not a pass.
  const row = incident({
    activeEmailLinkCount: 2,
    activeIdentityLinkCount: 2,
    authoritativeAccountPresent: true,
    accountIdMatchesOwner: true,
    emailDigestConcordant: true,
    ownerFingerprintConcordant: true,
    ownerAddressUnroutable: true,
  });
  assert.deepEqual(classifyIncidentCandidate(row), {
    action: "refuse",
    reason: "canonical_email_link_ambiguous",
  });
  assert.equal(
    selectIncidentCandidates([row], { maxCandidates: 0 }).blockReason,
    "unknown_or_non_synthetic_candidate_present",
  );
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

// ── the incident's size is pinned, not retyped ──────────────────────────────

test("a THIRD qualifying candidate refuses the run instead of enlarging it", () => {
  // The window bounds forty-eight minutes of live Production. If anything else in there ever
  // qualifies, this is what stops it: the population no longer equals the pinned incident, so
  // nothing executes — including the two accounts that WERE part of it.
  const three = ["a", "b", "c"].map((jobFingerprint) => incident({ jobFingerprint }));
  const selection = selectIncidentCandidates(three, { maxCandidates: 3 });
  assert.equal(selection.resumable.length, 3);
  assert.equal(selection.safeToExecute, false);
  assert.equal(selection.blockReason, "candidate_population_differs_from_pinned_incident");
});

test("an operator cannot retype a ceiling that disagrees with the pinned incident", () => {
  const one = [incident({ jobFingerprint: "a" })];
  const selection = selectIncidentCandidates(one, { maxCandidates: 1 });
  assert.equal(selection.safeToExecute, false);
  assert.equal(selection.blockReason, "candidate_population_differs_from_pinned_incident");
});

test("the pinned incident size is what the historical incident actually left behind", () => {
  assert.equal(POR1_PRODUCTION_DELETION_INCIDENT.expectedStrandedJobCount, 2);
});

// ── registration-lease ambiguity ────────────────────────────────────────────

test("TWO account_registration leases for one owner is a REFUSAL", () => {
  // Nothing constrains (owner_account_id, operation_code), so this state is legal, and choosing the
  // earliest would be choosing which provisioning story to believe.
  assert.deepEqual(classifyIncidentCandidate(incident({ registrationLeaseCount: 2 })), {
    action: "refuse",
    reason: "registration_lease_ambiguous",
  });
});

test("no registration lease, or an uncountable one, is refused", () => {
  assert.deepEqual(classifyIncidentCandidate(incident({ registrationLeaseCount: 0 })), {
    action: "refuse",
    reason: "registration_lease_absent",
  });
  assert.deepEqual(classifyIncidentCandidate(incident({ registrationLeaseCount: null })), {
    action: "refuse",
    reason: "registration_lease_absent",
  });
});

// ── the account's own beginning ─────────────────────────────────────────────

test("an account whose OWN createdAt is outside the window is refused", () => {
  for (const value of [false, null]) {
    assert.deepEqual(classifyIncidentCandidate(incident({ accountCreatedWithinIncidentWindow: value })), {
      action: "refuse",
      reason: "account_created_outside_incident_window",
    });
  }
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

test("a live executor claim with no readable expiry is treated as LIVE, not as free", () => {
  // Asserted at the row level: whatever the script computes, a row that says the lease is live must
  // never be resumed.
  assert.deepEqual(classifyIncidentCandidate(incident({ executorLeaseLive: true })), {
    action: "revisit",
    reason: "executor_lease_live",
  });
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
  const selection = selectIncidentCandidates(rows, { maxCandidates: 2 });
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
    { registrationLeaseCount: 2 },
    { accountCreatedWithinIncidentWindow: false },
  ] as Array<Partial<IncidentCandidateRow>>) {
    const selection = selectIncidentCandidates([incident(over)], { maxCandidates: 0 });
    assert.equal(selection.blockReason, "unknown_or_non_synthetic_candidate_present", JSON.stringify(over));
  }
});

test("a structurally out-of-scope row is refused but does NOT block a clean run", () => {
  // "This was never in scope" and "I cannot account for this" are different findings. Only the
  // second one should stop a reviewed recovery.
  const rows = [
    incident({ jobFingerprint: "a" }),
    incident({ jobFingerprint: "b" }),
    incident({ jobFingerprint: "z", state: "completed" }),
  ];
  const selection = selectIncidentCandidates(rows, { maxCandidates: 2 });
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
  assert.match(SCRIPT_CODE, /link_kind === "email"/, "the email link is still the one resolved");
  assert.match(
    SCRIPT_CODE,
    /select=link_kind,link_digest,owner_fingerprint/,
    "it selects columns that exist",
  );
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

test("the execution window is DERIVED from the pinned contract, never supplied", () => {
  assert.match(SCRIPT_CODE, /incidentExecutionWindow\(POR1_PRODUCTION_DELETION_INCIDENT\)/);
  assert.match(SCRIPT_CODE, /validateIncidentEvidence\(POR1_PRODUCTION_DELETION_INCIDENT\)/);
  // The flags may confirm the contract and must be refused when they disagree.
  assert.match(SCRIPT_CODE, /declaredWindowMatchesContract\(/);
  assert.match(SCRIPT_CODE, /may not redefine it|not redefine it/);
  // readCandidates receives the DERIVED window and nothing else. The assertion that matters is not
  // its arity but that every window value traces back to the pinned contract: the only producer is
  // incidentWindow(), and the only thing the flags can do there is fail the equality check.
  assert.match(SCRIPT_CODE, /const window = incidentWindow\(\)/);
  // Call sites only — the declaration's parameter list is not a call, and matching it would make
  // this assertion trip on its own signature.
  const calls = [...SCRIPT_CODE.matchAll(/(?<!function\s)readCandidates\(([^)]*)\)/g)].map((m) =>
    m[1].trim(),
  );
  assert.deepEqual(calls, ["window"], "readCandidates is only ever handed the derived window");

  // The flags are read in exactly one function, and that function returns the pinned window.
  const windowFn = SCRIPT_CODE.slice(
    SCRIPT_CODE.indexOf("function incidentWindow()"),
    SCRIPT_CODE.indexOf("function assertProductionOnly()"),
  );
  assert.ok(windowFn.length > 0, "incidentWindow must exist and precede assertProductionOnly");
  assert.match(windowFn, /return incidentExecutionWindow\(POR1_PRODUCTION_DELETION_INCIDENT\)/);
  const flagReads = (SCRIPT_CODE.match(/flagValue\("--release-window-(?:start|end)"\)/g) ?? []).length;
  const flagReadsInsideWindowFn =
    (windowFn.match(/flagValue\("--release-window-(?:start|end)"\)/g) ?? []).length;
  assert.equal(
    flagReads,
    flagReadsInsideWindowFn,
    "the window flags must not be read anywhere except where they are checked against the contract",
  );
  assert.equal(flagReadsInsideWindowFn, 2, "both flags are read, and only there");
});

test("the identity read counts links instead of taking the first one", () => {
  assert.ok(!SCRIPT_CODE.includes("firstRow(links)"), "an ambiguous set must never be resolved by order");
  assert.match(SCRIPT_CODE, /link_state=eq\.active&select=link_kind,link_digest,owner_fingerprint/);
  assert.match(SCRIPT_CODE, /activeIdentityLinkCount = await exactCount\(/);
  assert.match(SCRIPT_CODE, /emailLinks\.length === 1 \? emailLinks\[0\] : null/);
  // No limit on the link read: a limit would hide the very ambiguity being detected.
  assert.ok(
    !/link_state=eq\.active[^`]*limit=/.test(SCRIPT_CODE),
    "the identity-link read must not be limited",
  );
});

test("counts are asked of the database, not taken from a served page", () => {
  assert.match(SCRIPT_CODE, /Prefer: "count=exact"/);
  assert.match(SCRIPT_CODE, /content-range/);
  assert.match(SCRIPT_CODE, /activeEmailLinkCount = await exactCount\(/);
  assert.match(SCRIPT_CODE, /registrationLeaseCount = await exactCount\(/);
});

test("a held executor claim with an unreadable expiry counts as LIVE", () => {
  assert.match(SCRIPT_CODE, /executor_token_hash/);
  assert.match(SCRIPT_CODE, /claimHeld && \(!Number\.isFinite\(expires\) \|\| expires > Date\.now\(\)\)/);
});

test("the Production guard comes from the pinned contract, not a second copy of the ref", () => {
  assert.match(SCRIPT_CODE, /POR1_PRODUCTION_DELETION_INCIDENT\.productionProjectRef/);
});

test("the provisioning saga is read as a third independent witness", () => {
  assert.match(SCRIPT_CODE, /yorisou_identity_provisioning_sagas\?account_id=eq\./);
  assert.match(SCRIPT_CODE, /provisioningSagaRequestedAt/);
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
  // The ref is no longer restated in the script — a second copy is a second thing to get wrong. It
  // comes from the pinned contract, and the contract is what this asserts against.
  assert.match(
    SCRIPT_CODE,
    /POR1_PRODUCTION_DELETION_INCIDENT\.productionProjectRef/,
    "the governed Production ref comes from the pinned contract",
  );
  assert.equal(
    POR1_PRODUCTION_DELETION_INCIDENT.productionProjectRef,
    "krxizslnksorwhepyijs",
    "and that ref is the governed Production project",
  );
  assert.ok(
    !/krxizslnksorwhepyijs/.test(SCRIPT_CODE),
    "the script must not carry its own second copy of the ref",
  );
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
