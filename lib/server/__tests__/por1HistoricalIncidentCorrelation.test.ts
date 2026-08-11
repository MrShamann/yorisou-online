// POR-1 — historical incident CORRELATION, qualified or refused.
//
// The rule this file pins has been refused three times, and each refusal is encoded here as a test.
//
// The first matched an address pattern whose only surviving copy was a fixture in this very
// directory. The second bounded membership with a window the OPERATOR typed. The third pinned that
// window to immutable GitHub and Vercel records — and still called the result PROOF that an account
// was synthetic. An independent re-audit refused the claim while accepting the engineering, because
// the pinned window contains forty-eight minutes of live Production and nothing Production kept says
// which run created an account.
//
// So the verdict is now QUALIFIED, meaning "eligible for human review", and the decisive test is no
// longer the look-alike three weeks away — that one is trivial. It is
// `por1FounderIncidentAuthority.test.ts`'s SAME-WINDOW adversary, which this module qualifies and
// which is still refused erasure, because qualification is not authority.

import assert from "node:assert/strict";
import test from "node:test";

import {
  incidentExecutionWindow,
  POR1_INCIDENT_EVIDENCE_VERSION,
  POR1_PRODUCTION_DELETION_INCIDENT,
} from "../por1HistoricalIncidentEvidence";
import {
  classifyHistoricalIncidentCorrelation,
  countManifestDomainArtifacts,
  INCIDENT_ANOMALY_MAX_ACCOUNT_LIFETIME_MS,
  readManifestCanonicalIdentityLinkCount,
  type IncidentCorrelationEvidence,
} from "../por1HistoricalIncidentCorrelation";

/**
 * The historical incident, stated as evidence rather than as identity.
 *
 * These instants are what Production actually recorded for the first stranded owner — the
 * provisioning saga, the registration lease, the deletion job. No address, no digest, no fingerprint
 * appears anywhere in this fixture, which is the entire point.
 */
const evidence = (over: Partial<IncidentCorrelationEvidence> = {}): IncidentCorrelationEvidence => ({
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
function shiftedBy(ms: number, over: Partial<IncidentCorrelationEvidence> = {}) {
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

test("the historical incident shape is QUALIFIED for review", () => {
  assert.deepEqual(classifyHistoricalIncidentCorrelation(evidence()), { qualified: true });
});

test("the second historical owner qualifies too", () => {
  assert.deepEqual(
    classifyHistoricalIncidentCorrelation(
      evidence({
        provisioningSagaRequestedAt: "2026-08-10T03:49:03.547Z",
        registrationLeaseAt: "2026-08-10T03:49:04.170Z",
        deletionRequestedAt: "2026-08-10T03:49:42.277Z",
      }),
    ),
    { qualified: true },
  );
});

// ══ window clause wiring ════════════════════════════════════════════════════
//
// Necessary, and knowingly not sufficient. The clause that made the operator-declared window
// unacceptable is here; the clause that admits its LIMIT lives in the authority tests.

test("a look-alike OUTSIDE the pinned window is refused — the easy half of the problem", () => {
  // Registered and deleted inside five minutes, zero domain artifacts, one canonical identity — but
  // outside the window, so refused.
  //
  // THIS TEST IS NOT THE HARD CASE, and an earlier revision wrongly presented it as one. Moving a
  // look-alike three weeks away and watching it fail proves only that the window clause is wired up.
  // The adversary that matters sits INSIDE the window and is qualified by this module; see
  // por1FounderIncidentAuthority.test.ts for what stops it.
  const threeWeeksLater = 21 * 24 * 60 * 60 * 1000;
  const lookalike = shiftedBy(threeWeeksLater);

  assert.deepEqual(classifyHistoricalIncidentCorrelation(lookalike), {
    qualified: false,
    reason: "provisioning_outside_incident_window",
  });

  // And the same account before the incident, so this is not an artefact of pointing at the future.
  assert.equal(
    classifyHistoricalIncidentCorrelation(shiftedBy(-threeWeeksLater)).qualified,
    false,
  );
  // And one second past the window's close.
  const justAfter =
    Date.parse(POR1_PRODUCTION_DELETION_INCIDENT.nextDeploymentAt) -
    Date.parse(evidence().provisioningSagaRequestedAt as string) +
    1000;
  assert.equal(classifyHistoricalIncidentCorrelation(shiftedBy(justAfter)).qualified, false);
});

test("the five-minute lifetime CANNOT qualify a candidate — the window clause is checked first", () => {
  // A zero-lifetime account, the most "synthetic-looking" possible, still refused when it is outside
  // the pinned window. If the lifetime bound were load-bearing this would pass.
  const instantaneous = shiftedBy(60 * 24 * 60 * 60 * 1000, {
    registrationLeaseAt: "2026-10-09T03:48:53.990Z",
    deletionRequestedAt: "2026-10-09T03:48:53.990Z",
  });
  const verdict = classifyHistoricalIncidentCorrelation(instantaneous);
  assert.equal(verdict.qualified, false);
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
    classifyHistoricalIncidentCorrelation(
      evidence({
        provisioningSagaRequestedAt: registeredAt,
        registrationLeaseAt: registeredAt,
        deletionRequestedAt: tooLate,
      }),
    ),
    { qualified: false, reason: "account_lifetime_above_anomaly_guard" },
  );
});

// ══ the pinned contract governs ═════════════════════════════════════════════

test("a candidate gathered under a different contract version is refused", () => {
  assert.deepEqual(
    classifyHistoricalIncidentCorrelation(evidence({ incidentEvidenceVersion: "por1-incident-evidence-v0" })),
    { qualified: false, reason: "incident_evidence_version_mismatch" },
  );
  assert.deepEqual(classifyHistoricalIncidentCorrelation(evidence({ incidentEvidenceVersion: null })), {
    qualified: false,
    reason: "incident_evidence_version_mismatch",
  });
});

test("an invalid contract refuses everything, before any candidate is considered", () => {
  const broken = { ...POR1_PRODUCTION_DELETION_INCIDENT, deployedCommitSha: "0".repeat(40) };
  assert.deepEqual(classifyHistoricalIncidentCorrelation(evidence(), broken), {
    qualified: false,
    reason: "incident_evidence_contract_invalid",
  });
});

test("correlation takes NO window input — it can only be derived", () => {
  const inputs = Object.keys(evidence());
  for (const forbidden of ["window", "startedat", "endedat", "releasewindow"]) {
    assert.ok(
      !inputs.some((key) => key.toLowerCase().includes(forbidden)),
      `correlation must not accept ${forbidden}; the window is derived from the pinned contract`,
    );
  }
});

// ══ every witness is required, and each must sit inside the window ══════════

test("each of the three witnesses is required", () => {
  assert.deepEqual(classifyHistoricalIncidentCorrelation(evidence({ provisioningSagaRequestedAt: null })), {
    qualified: false,
    reason: "provisioning_saga_absent",
  });
  assert.deepEqual(classifyHistoricalIncidentCorrelation(evidence({ registrationLeaseAt: null })), {
    qualified: false,
    reason: "registration_lease_absent",
  });
  assert.deepEqual(classifyHistoricalIncidentCorrelation(evidence({ deletionRequestedAt: null })), {
    qualified: false,
    reason: "deletion_request_absent",
  });
});

test("each witness is independently checked against the window", () => {
  const outside = "2026-09-01T00:00:00.000Z";
  assert.equal(
    (classifyHistoricalIncidentCorrelation(evidence({ provisioningSagaRequestedAt: outside })) as { reason: string }).reason,
    "provisioning_outside_incident_window",
  );
  assert.equal(
    (classifyHistoricalIncidentCorrelation(evidence({ registrationLeaseAt: outside, deletionRequestedAt: outside })) as { reason: string }).reason,
    "registration_outside_incident_window",
  );
  assert.equal(
    (classifyHistoricalIncidentCorrelation(evidence({ deletionRequestedAt: outside })) as { reason: string }).reason,
    "deletion_request_outside_incident_window",
  );
});

test("unparseable instants are refused rather than coerced", () => {
  for (const bad of ["not-a-date", "2026-13-45T99:99:99Z", "  "]) {
    assert.equal(classifyHistoricalIncidentCorrelation(evidence({ registrationLeaseAt: bad })).qualified, false, bad);
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
      classifyHistoricalIncidentCorrelation(evidence({ registrationLeaseAt: naive })).qualified,
      false,
      naive,
    );
  }
  // The same instant WITH a zone is accepted, so the clause is about the zone and nothing else.
  assert.equal(
    classifyHistoricalIncidentCorrelation(evidence({ registrationLeaseAt: "2026-08-10T03:48:53.990+00:00" })).qualified,
    true,
  );
  assert.equal(
    classifyHistoricalIncidentCorrelation(evidence({ registrationLeaseAt: "2026-08-10T12:48:53.990+09:00" })).qualified,
    true,
  );
});

test("a deletion that precedes registration is incoherent and refused", () => {
  assert.deepEqual(
    classifyHistoricalIncidentCorrelation(evidence({ deletionRequestedAt: "2026-08-10T03:40:00.000Z" })),
    { qualified: false, reason: "deletion_precedes_registration" },
  );
});

// ══ product engagement disproves membership, from BOTH inventories ══════════

test("a manifest that records any domain artifact is refused", () => {
  assert.deepEqual(classifyHistoricalIncidentCorrelation(evidence({ manifestDomainArtifactCount: 1 })), {
    qualified: false,
    reason: "manifest_records_domain_artifacts",
  });
});

test("an unreadable manifest inventory is unknown, not zero", () => {
  assert.deepEqual(classifyHistoricalIncidentCorrelation(evidence({ manifestDomainArtifactCount: null })), {
    qualified: false,
    reason: "manifest_domain_artifacts_unknown",
  });
});

test("a missing manifest is refused", () => {
  assert.deepEqual(classifyHistoricalIncidentCorrelation(evidence({ manifestPresent: false })), {
    qualified: false,
    reason: "manifest_absent",
  });
});

test("a canonical link count other than exactly one is refused", () => {
  for (const count of [0, 2, 3, null]) {
    assert.equal(
      classifyHistoricalIncidentCorrelation(evidence({ manifestCanonicalIdentityLinkCount: count })).qualified,
      false,
      String(count),
    );
  }
});

test("the LIVE inventory is asked independently — a clean manifest cannot carry it alone", () => {
  assert.deepEqual(classifyHistoricalIncidentCorrelation(evidence({ liveDomainArtifactCount: 3 })), {
    qualified: false,
    reason: "live_domain_artifacts_present",
  });
  assert.deepEqual(classifyHistoricalIncidentCorrelation(evidence({ liveDomainArtifactCount: null })), {
    qualified: false,
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
      `correlation must not take ${forbidden} as an input — that is concordance, not correlation`,
    );
  }
});
