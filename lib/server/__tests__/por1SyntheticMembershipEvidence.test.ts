// POR-1 — historical synthetic MEMBERSHIP, proven or refused.
//
// The rule this file pins has been refused twice, and each refusal is encoded here as a test.
//
// The first version matched an address pattern whose only surviving copy was a fixture in this very
// directory. Evidence that lives in the test asserting it is not evidence.
//
// The second derived membership from persisted execution truth — right — but bounded it with a window
// the OPERATOR typed, and leaned on "no real person deletes an account within five minutes". An
// independent audit refused that: a supplied window is not provenance, and a behavioural bound cannot
// be the fact that identifies ONE historical execution. The decisive test below is
// `THE CRITICAL ADVERSARIAL PROPERTY` — a look-alike account satisfying every other clause must still
// be refused.
import assert from "node:assert/strict";
import test from "node:test";

import {
  incidentExecutionWindow,
  POR1_INCIDENT_EVIDENCE_VERSION,
  POR1_PRODUCTION_DELETION_INCIDENT,
} from "../por1HistoricalIncidentEvidence";
import {
  classifyHistoricalSyntheticMembership,
  countManifestDomainArtifacts,
  INCIDENT_ANOMALY_MAX_ACCOUNT_LIFETIME_MS,
  readManifestCanonicalIdentityLinkCount,
  type SyntheticMembershipEvidence,
} from "../por1SyntheticMembershipEvidence";

/**
 * The historical incident, stated as evidence rather than as identity.
 *
 * These instants are what Production actually recorded for the first stranded owner — the
 * provisioning saga, the registration lease, the deletion job. No address, no digest, no fingerprint
 * appears anywhere in this fixture, which is the entire point.
 */
const evidence = (over: Partial<SyntheticMembershipEvidence> = {}): SyntheticMembershipEvidence => ({
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

/** Shift a whole candidate in time, preserving its shape exactly. */
function shiftedBy(ms: number, over: Partial<SyntheticMembershipEvidence> = {}) {
  const base = evidence();
  const move = (at: string | null) =>
    at === null ? null : new Date(Date.parse(at) + ms).toISOString();
  return {
    ...base,
    provisioningSagaRequestedAt: move(base.provisioningSagaRequestedAt),
    registrationLeaseAt: move(base.registrationLeaseAt),
    deletionRequestedAt: move(base.deletionRequestedAt),
    ...over,
  };
}

test("the historical incident shape is PROVEN membership", () => {
  assert.deepEqual(classifyHistoricalSyntheticMembership(evidence()), { proven: true });
});

test("the second historical owner is PROVEN too", () => {
  assert.deepEqual(
    classifyHistoricalSyntheticMembership(
      evidence({
        provisioningSagaRequestedAt: "2026-08-10T03:49:03.547Z",
        registrationLeaseAt: "2026-08-10T03:49:04.170Z",
        deletionRequestedAt: "2026-08-10T03:49:42.277Z",
      }),
    ),
    { proven: true },
  );
});

// ══ THE CRITICAL ADVERSARIAL PROPERTY ═══════════════════════════════════════
//
// This is the test the audit asked for, and the reason the operator-declared window had to go.

test("a LOOK-ALIKE account satisfying every other clause is REFUSED on provenance alone", () => {
  // Registered and deleted inside five minutes. Zero domain artifacts in both inventories. Exactly
  // one canonical identity. It would carry a `.invalid` address and would sit inside whatever
  // candidate ceiling an operator reviewed. Every clause the previous rule had, it satisfies.
  //
  // It differs in one respect: it did not happen during the pinned incident. That must be enough.
  const threeWeeksLater = 21 * 24 * 60 * 60 * 1000;
  const lookalike = shiftedBy(threeWeeksLater);

  assert.deepEqual(classifyHistoricalSyntheticMembership(lookalike), {
    proven: false,
    reason: "provisioning_outside_incident_window",
  });

  // And the same account before the incident, so this is not an artefact of pointing at the future.
  assert.equal(
    classifyHistoricalSyntheticMembership(shiftedBy(-threeWeeksLater)).proven,
    false,
  );
  // And one second past the window's close.
  const justAfter =
    Date.parse(POR1_PRODUCTION_DELETION_INCIDENT.nextDeploymentAt) -
    Date.parse(evidence().provisioningSagaRequestedAt as string) +
    1000;
  assert.equal(classifyHistoricalSyntheticMembership(shiftedBy(justAfter)).proven, false);
});

test("the five-minute lifetime CANNOT qualify a candidate — provenance is checked first", () => {
  // A zero-lifetime account, the most "synthetic-looking" possible, still refused when it is outside
  // the pinned window. If the lifetime bound were load-bearing this would pass.
  const instantaneous = shiftedBy(60 * 24 * 60 * 60 * 1000, {
    registrationLeaseAt: "2026-10-09T03:48:53.990Z",
    deletionRequestedAt: "2026-10-09T03:48:53.990Z",
  });
  const verdict = classifyHistoricalSyntheticMembership(instantaneous);
  assert.equal(verdict.proven, false);
  assert.match(String((verdict as { reason: string }).reason), /outside_incident_window$/);
});

test("the five-minute lifetime CAN still subtract, inside the window", () => {
  const window = incidentExecutionWindow();
  const registeredAt = window.startedAt;
  const tooLate = new Date(
    Date.parse(registeredAt) + INCIDENT_ANOMALY_MAX_ACCOUNT_LIFETIME_MS + 1,
  ).toISOString();
  assert.ok(
    Date.parse(tooLate) <= Date.parse(window.endedAt),
    "the fixture must stay inside the window, or it would prove the wrong clause",
  );
  assert.deepEqual(
    classifyHistoricalSyntheticMembership(
      evidence({
        provisioningSagaRequestedAt: registeredAt,
        registrationLeaseAt: registeredAt,
        deletionRequestedAt: tooLate,
      }),
    ),
    { proven: false, reason: "account_lifetime_above_anomaly_guard" },
  );
});

// ══ the pinned contract governs ═════════════════════════════════════════════

test("a candidate gathered under a different contract version is refused", () => {
  assert.deepEqual(
    classifyHistoricalSyntheticMembership(evidence({ incidentEvidenceVersion: "por1-incident-evidence-v0" })),
    { proven: false, reason: "incident_evidence_version_mismatch" },
  );
  assert.deepEqual(classifyHistoricalSyntheticMembership(evidence({ incidentEvidenceVersion: null })), {
    proven: false,
    reason: "incident_evidence_version_mismatch",
  });
});

test("an invalid contract refuses everything, before any candidate is considered", () => {
  const broken = { ...POR1_PRODUCTION_DELETION_INCIDENT, deployedCommitSha: "0".repeat(40) };
  assert.deepEqual(classifyHistoricalSyntheticMembership(evidence(), broken), {
    proven: false,
    reason: "incident_evidence_contract_invalid",
  });
});

test("membership takes NO window input — it can only be derived", () => {
  const inputs = Object.keys(evidence());
  for (const forbidden of ["window", "startedat", "endedat", "releasewindow"]) {
    assert.ok(
      !inputs.some((key) => key.toLowerCase().includes(forbidden)),
      `membership must not accept ${forbidden}; the window is derived from the pinned contract`,
    );
  }
});

// ══ every witness is required, and each must sit inside the window ══════════

test("each of the three witnesses is required", () => {
  assert.deepEqual(classifyHistoricalSyntheticMembership(evidence({ provisioningSagaRequestedAt: null })), {
    proven: false,
    reason: "provisioning_saga_absent",
  });
  assert.deepEqual(classifyHistoricalSyntheticMembership(evidence({ registrationLeaseAt: null })), {
    proven: false,
    reason: "registration_lease_absent",
  });
  assert.deepEqual(classifyHistoricalSyntheticMembership(evidence({ deletionRequestedAt: null })), {
    proven: false,
    reason: "deletion_request_absent",
  });
});

test("each witness is independently checked against the window", () => {
  const outside = "2026-09-01T00:00:00.000Z";
  assert.equal(
    (classifyHistoricalSyntheticMembership(evidence({ provisioningSagaRequestedAt: outside })) as { reason: string }).reason,
    "provisioning_outside_incident_window",
  );
  assert.equal(
    (classifyHistoricalSyntheticMembership(evidence({ registrationLeaseAt: outside, deletionRequestedAt: outside })) as { reason: string }).reason,
    "registration_outside_incident_window",
  );
  assert.equal(
    (classifyHistoricalSyntheticMembership(evidence({ deletionRequestedAt: outside })) as { reason: string }).reason,
    "deletion_request_outside_incident_window",
  );
});

test("unparseable instants are refused rather than coerced", () => {
  for (const bad of ["not-a-date", "2026-13-45T99:99:99Z", "  "]) {
    assert.equal(classifyHistoricalSyntheticMembership(evidence({ registrationLeaseAt: bad })).proven, false, bad);
  }
});

test("a timestamp with NO zone is refused, not read as the operator's local time", () => {
  // Date.parse treats a naive timestamp as local time. On a JST machine, an evening user would slide
  // into the window and the genuine incident would slide out of it — a movable boundary by accident.
  // The naive form of an instant that IS inside the window must still be refused.
  for (const naive of [
    "2026-08-10T03:48:53.990",
    "2026-08-10 03:48:53.990",
    "2026-08-10T03:48:53",
  ]) {
    assert.equal(
      classifyHistoricalSyntheticMembership(evidence({ registrationLeaseAt: naive })).proven,
      false,
      naive,
    );
  }
  // The same instant WITH a zone is accepted, so the clause is about the zone and nothing else.
  assert.equal(
    classifyHistoricalSyntheticMembership(evidence({ registrationLeaseAt: "2026-08-10T03:48:53.990+00:00" })).proven,
    true,
  );
  assert.equal(
    classifyHistoricalSyntheticMembership(evidence({ registrationLeaseAt: "2026-08-10T12:48:53.990+09:00" })).proven,
    true,
  );
});

test("a deletion that precedes registration is incoherent and refused", () => {
  assert.deepEqual(
    classifyHistoricalSyntheticMembership(evidence({ deletionRequestedAt: "2026-08-10T03:40:00.000Z" })),
    { proven: false, reason: "deletion_precedes_registration" },
  );
});

// ══ product engagement disproves membership, from BOTH inventories ══════════

test("a manifest that records any domain artifact is refused", () => {
  assert.deepEqual(classifyHistoricalSyntheticMembership(evidence({ manifestDomainArtifactCount: 1 })), {
    proven: false,
    reason: "manifest_records_domain_artifacts",
  });
});

test("an unreadable manifest inventory is unproven, not zero", () => {
  assert.deepEqual(classifyHistoricalSyntheticMembership(evidence({ manifestDomainArtifactCount: null })), {
    proven: false,
    reason: "manifest_domain_artifacts_unknown",
  });
});

test("a missing manifest is refused", () => {
  assert.deepEqual(classifyHistoricalSyntheticMembership(evidence({ manifestPresent: false })), {
    proven: false,
    reason: "manifest_absent",
  });
});

test("a canonical link count other than exactly one is refused", () => {
  for (const count of [0, 2, 3, null]) {
    assert.equal(
      classifyHistoricalSyntheticMembership(evidence({ manifestCanonicalIdentityLinkCount: count })).proven,
      false,
      String(count),
    );
  }
});

test("the LIVE inventory is asked independently — a clean manifest cannot carry it alone", () => {
  assert.deepEqual(classifyHistoricalSyntheticMembership(evidence({ liveDomainArtifactCount: 3 })), {
    proven: false,
    reason: "live_domain_artifacts_present",
  });
  assert.deepEqual(classifyHistoricalSyntheticMembership(evidence({ liveDomainArtifactCount: null })), {
    proven: false,
    reason: "live_domain_artifacts_unknown",
  });
});

// ══ the manifest counter fails closed on shapes it does not know ════════════

test("the counter sums exactly the domain families and ignores the account's own keys", () => {
  const payload = {
    sessionIds: ["sess_1", "sess_2"],
    lineEventIds: [],
    lineLookupKey: null,
    emailLookupKey: "phase1/accounts/by-email/aa.json",
    consultationIds: [],
    primaryAccountKey: "phase1/accounts/by-id/acct_x.json",
    identityLookupKeys: ["phase1/accounts/by-email/aa.json"],
    passwordResetHashes: [],
    supportConversationIds: [],
    foundationUserProfileId: "acct_x",
    foundationAuthIdentityIds: ["authid_email_password_aa"],
    recentSubjectFingerprints: [],
    canonicalIdentityLinkCount: 1,
  };
  assert.equal(countManifestDomainArtifacts(payload), 0);
  assert.equal(countManifestDomainArtifacts({ ...payload, consultationIds: ["c1", "c2"] }), 2);
  assert.equal(
    countManifestDomainArtifacts({ ...payload, lineEventIds: ["e1"], recentSubjectFingerprints: ["f1"] }),
    2,
  );
});

test("an unrecognised key of ANY type is UNPROVEN, not only an array", () => {
  const known = {
    sessionIds: [],
    lineEventIds: [],
    consultationIds: [],
    passwordResetHashes: [],
    supportConversationIds: [],
    recentSubjectFingerprints: [],
    canonicalIdentityLinkCount: 1,
  };
  assert.equal(countManifestDomainArtifacts(known), 0, "the known shape still counts");
  // A future family recorded as a COUNT, an ID, or an OBJECT would have totalled zero under an
  // array-only check. Each must be UNPROVEN instead.
  assert.equal(countManifestDomainArtifacts({ ...known, journalEntryCount: 4 }), null);
  assert.equal(countManifestDomainArtifacts({ ...known, latestJournalId: "j1" }), null);
  assert.equal(countManifestDomainArtifacts({ ...known, journalSummary: { total: 3 } }), null);
  assert.equal(countManifestDomainArtifacts({ ...known, journalPresent: true }), null);
});

test("an unrecognised array-valued family is UNPROVEN — a silent zero would be a lie", () => {
  assert.equal(
    countManifestDomainArtifacts({
      sessionIds: [],
      lineEventIds: [],
      consultationIds: [],
      passwordResetHashes: [],
      supportConversationIds: [],
      recentSubjectFingerprints: [],
      canonicalIdentityLinkCount: 1,
      journalEntryIds: ["j1"],
    }),
    null,
  );
});

test("a missing or non-array family is UNPROVEN rather than treated as empty", () => {
  assert.equal(countManifestDomainArtifacts({ sessionIds: [] }), null);
  assert.equal(
    countManifestDomainArtifacts({
      consultationIds: "none",
      lineEventIds: [],
      supportConversationIds: [],
      passwordResetHashes: [],
      recentSubjectFingerprints: [],
    }),
    null,
  );
  assert.equal(countManifestDomainArtifacts(null), null);
  assert.equal(countManifestDomainArtifacts("{}"), null);
  assert.equal(countManifestDomainArtifacts([]), null);
});

test("the canonical link count is read strictly, and a null registry reading stays null", () => {
  assert.equal(readManifestCanonicalIdentityLinkCount({ canonicalIdentityLinkCount: 1 }), 1);
  assert.equal(readManifestCanonicalIdentityLinkCount({ canonicalIdentityLinkCount: 0 }), 0);
  // "the registry was not deployed yet" is a different fact from "the account had no links"
  assert.equal(readManifestCanonicalIdentityLinkCount({ canonicalIdentityLinkCount: null }), null);
  assert.equal(readManifestCanonicalIdentityLinkCount({ canonicalIdentityLinkCount: 1.5 }), null);
  assert.equal(readManifestCanonicalIdentityLinkCount({}), null);
  assert.equal(readManifestCanonicalIdentityLinkCount(null), null);
});

// ══ the rule must not be satisfiable by identity agreement ══════════════════

test("no clause reads an address, a digest or a fingerprint", () => {
  const inputs = Object.keys(evidence());
  for (const forbidden of ["email", "digest", "fingerprint", "address", "subject"]) {
    assert.ok(
      !inputs.some((key) => key.toLowerCase().includes(forbidden)),
      `membership must not take ${forbidden} as an input — that is concordance, not membership`,
    );
  }
});
