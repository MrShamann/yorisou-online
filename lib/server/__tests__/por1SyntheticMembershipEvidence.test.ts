// POR-1 — historical synthetic MEMBERSHIP, proven or refused.
//
// The rule this file pins exists because the previous one could not be defended: it proved
// "synthetic" by matching a plaintext address against a pattern whose only surviving copy was a
// fixture in this very directory. Evidence that lives in the test that asserts it is not evidence.
//
// So every clause below is anchored to something Production wrote on its own — a mutation lease, a
// job timestamp, a contract-versioned manifest, a live re-inventory — and every absence is a
// REFUSAL. There is no clause whose default is "probably fine".
import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyHistoricalSyntheticMembership,
  countManifestDomainArtifacts,
  readManifestCanonicalIdentityLinkCount,
  RELEASE_CHECK_MAX_ACCOUNT_LIFETIME_MS,
  RELEASE_CHECK_MAX_WINDOW_MS,
  type SyntheticMembershipEvidence,
} from "../por1SyntheticMembershipEvidence";

/**
 * The shape of the historical incident, stated as evidence rather than as identity.
 *
 * These instants are the SHAPE of what the database recorded — an account registered and asked to be
 * destroyed within the same scripted minute, inside a bounded release window. No address, no digest,
 * no fingerprint appears anywhere in this fixture, which is the entire point of the redesign.
 */
const evidence = (over: Partial<SyntheticMembershipEvidence> = {}): SyntheticMembershipEvidence => ({
  registrationLeaseAt: "2026-08-10T03:48:53.990Z",
  deletionRequestedAt: "2026-08-10T03:49:19.271Z",
  manifestPresent: true,
  manifestDomainArtifactCount: 0,
  manifestCanonicalIdentityLinkCount: 1,
  liveDomainArtifactCount: 0,
  releaseWindow: { startedAt: "2026-08-10T03:32:53Z", endedAt: "2026-08-10T04:20:39Z" },
  ...over,
});

test("the historical incident shape is PROVEN membership", () => {
  assert.deepEqual(classifyHistoricalSyntheticMembership(evidence()), { proven: true });
});

// ── every input is required; absence is refusal, never assumption ───────────

test("no registration lease means unproven — there is nothing to date the account from", () => {
  assert.deepEqual(classifyHistoricalSyntheticMembership(evidence({ registrationLeaseAt: null })), {
    proven: false,
    reason: "registration_lease_absent",
  });
});

test("no deletion request instant means unproven", () => {
  assert.deepEqual(classifyHistoricalSyntheticMembership(evidence({ deletionRequestedAt: null })), {
    proven: false,
    reason: "deletion_request_absent",
  });
});

test("unparseable instants are refused rather than coerced", () => {
  for (const bad of ["not-a-date", "2026-13-45T99:99:99Z", "  "]) {
    assert.equal(
      classifyHistoricalSyntheticMembership(evidence({ registrationLeaseAt: bad })).proven,
      false,
      bad,
    );
  }
});

test("a deletion that precedes registration is incoherent and refused", () => {
  assert.deepEqual(
    classifyHistoricalSyntheticMembership(
      evidence({ deletionRequestedAt: "2026-08-10T03:40:00Z" }),
    ),
    { proven: false, reason: "deletion_precedes_registration" },
  );
});

// ── the lifetime bound is the load-bearing behavioural clause ───────────────

test("an account that lived longer than the release-check bound is refused", () => {
  const registeredAt = Date.parse("2026-08-10T03:35:00Z");
  const justOver = new Date(registeredAt + RELEASE_CHECK_MAX_ACCOUNT_LIFETIME_MS + 1).toISOString();
  assert.deepEqual(
    classifyHistoricalSyntheticMembership(
      evidence({
        registrationLeaseAt: new Date(registeredAt).toISOString(),
        deletionRequestedAt: justOver,
      }),
    ),
    { proven: false, reason: "account_lifetime_above_release_check_bound" },
  );
});

test("the bound is inclusive at its edge, so it is a bound and not an off-by-one", () => {
  const registeredAt = Date.parse("2026-08-10T03:35:00Z");
  const exactly = new Date(registeredAt + RELEASE_CHECK_MAX_ACCOUNT_LIFETIME_MS).toISOString();
  assert.deepEqual(
    classifyHistoricalSyntheticMembership(
      evidence({
        registrationLeaseAt: new Date(registeredAt).toISOString(),
        deletionRequestedAt: exactly,
      }),
    ),
    { proven: true },
  );
});

// ── product engagement disproves membership, from BOTH inventories ──────────

test("a manifest that records any domain artifact is refused", () => {
  assert.deepEqual(
    classifyHistoricalSyntheticMembership(evidence({ manifestDomainArtifactCount: 1 })),
    { proven: false, reason: "manifest_records_domain_artifacts" },
  );
});

test("an unreadable manifest inventory is unproven, not zero", () => {
  assert.deepEqual(
    classifyHistoricalSyntheticMembership(evidence({ manifestDomainArtifactCount: null })),
    { proven: false, reason: "manifest_domain_artifacts_unknown" },
  );
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
      classifyHistoricalSyntheticMembership(
        evidence({ manifestCanonicalIdentityLinkCount: count }),
      ).proven,
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
  assert.deepEqual(
    classifyHistoricalSyntheticMembership(evidence({ liveDomainArtifactCount: null })),
    { proven: false, reason: "live_domain_artifacts_unknown" },
  );
});

// ── the release window narrows; it can never select ─────────────────────────

test("an undeclared release window is refused", () => {
  assert.deepEqual(classifyHistoricalSyntheticMembership(evidence({ releaseWindow: null })), {
    proven: false,
    reason: "release_window_undeclared",
  });
});

test("an inverted or unparseable window is refused", () => {
  assert.equal(
    classifyHistoricalSyntheticMembership(
      evidence({ releaseWindow: { startedAt: "2026-08-10T05:00:00Z", endedAt: "2026-08-10T04:00:00Z" } }),
    ).proven,
    false,
  );
  assert.equal(
    classifyHistoricalSyntheticMembership(
      evidence({ releaseWindow: { startedAt: "nope", endedAt: "2026-08-10T04:00:00Z" } }),
    ).proven,
    false,
  );
});

test("a window wide enough to swallow real users is refused", () => {
  const startedAt = "2026-08-10T00:00:00Z";
  const endedAt = new Date(Date.parse(startedAt) + RELEASE_CHECK_MAX_WINDOW_MS + 1).toISOString();
  assert.deepEqual(
    classifyHistoricalSyntheticMembership(evidence({ releaseWindow: { startedAt, endedAt } })),
    { proven: false, reason: "release_window_too_wide" },
  );
});

test("an account registered outside the declared window is refused", () => {
  assert.deepEqual(
    classifyHistoricalSyntheticMembership(
      evidence({
        registrationLeaseAt: "2026-08-10T02:00:00.000Z",
        deletionRequestedAt: "2026-08-10T02:00:20.000Z",
      }),
    ),
    { proven: false, reason: "registration_outside_release_window" },
  );
});

test("a deletion requested after the window closes is refused even if registration was inside", () => {
  assert.deepEqual(
    classifyHistoricalSyntheticMembership(
      evidence({
        releaseWindow: { startedAt: "2026-08-10T03:32:53Z", endedAt: "2026-08-10T03:49:00Z" },
      }),
    ),
    { proven: false, reason: "deletion_request_outside_release_window" },
  );
});

// ── the manifest counter fails closed on shapes it does not know ────────────

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

test("an unrecognised array-valued family is UNPROVEN — a silent zero would be a lie", () => {
  const payload = {
    sessionIds: [],
    lineEventIds: [],
    consultationIds: [],
    passwordResetHashes: [],
    supportConversationIds: [],
    recentSubjectFingerprints: [],
    canonicalIdentityLinkCount: 1,
    // a family added by some future migration that this rule has never seen
    journalEntryIds: ["j1"],
  };
  assert.equal(countManifestDomainArtifacts(payload), null);
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

// ── the rule must not be satisfiable by identity agreement ──────────────────

test("no clause reads an address, a digest or a fingerprint", () => {
  const inputs = Object.keys(evidence());
  for (const forbidden of ["email", "digest", "fingerprint", "address", "subject"]) {
    assert.ok(
      !inputs.some((key) => key.toLowerCase().includes(forbidden)),
      `membership must not take ${forbidden} as an input — that is concordance, not membership`,
    );
  }
});
