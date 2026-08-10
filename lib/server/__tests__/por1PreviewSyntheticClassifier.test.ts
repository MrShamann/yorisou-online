// POR-1 WS-G — the classifier that decides what a cleanup tool may destroy.
//
// THE DEFECT THIS EXISTS TO PREVENT.
//
// The cleanup tool matched one suffix, `@synthetic-preview.invalid`. This package's acceptance and
// contention work also created 109 accounts on `@example.com`, so a run would have reported success
// while leaving all of them behind — and "the second run removed nothing" would have been true for
// entirely the wrong reason.
//
// THE OBVIOUS FIX IS THE DANGEROUS ONE, and that is what most of this file is about. Two unrelated
// operator scripts in this repository create `shadow-*@example.com` and `switch-*@example.com`. A
// domain-only rule would sweep those up as collateral, and a deletion tool must never sit one
// careless predicate away from destroying something nobody pointed it at.

import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyPreviewSyntheticIdentity,
  partitionPreviewIdentities,
} from "../previewSyntheticClassifier";

// ── THE NEGATIVE CONTROL ─────────────────────────────────────────────────────

test("NEGATIVE CONTROL — the naive domain rule selects accounts this classifier refuses", () => {
  // These are real shapes produced by scripts/verify-session-auth-*.ts, which have nothing to do
  // with POR-1 acceptance. `endsWith("@example.com")` would delete every one of them.
  const collateral = [
    "shadow-email@example.com",
    "shadow-register@example.com",
    "shadow-bind@example.com",
    "shadow-conflict-a@example.com",
    "switch-email@example.com",
    "switch-register@example.com",
  ];

  for (const email of collateral) {
    assert.equal(
      email.endsWith("@example.com"),
      true,
      `${email}: the naive rule would select this — that is the whole point`,
    );
    assert.deepEqual(
      classifyPreviewSyntheticIdentity(email),
      { synthetic: false, reason: "local_part_not_fixture_generated" },
      `${email}: the governed classifier must refuse it`,
    );
  }
});

// ── WHAT IT MUST ACCEPT ──────────────────────────────────────────────────────

test("the CPC-1 acceptance fixture family is recognised", () => {
  // Real shapes, taken from the Preview inventory: `cpc1-<label>-<runId>`.
  for (const email of [
    "cpc1-por1-conc-a-ms9h2q3f4a5b@synthetic-preview.invalid",
    "cpc1-journey-ms8w1a2b3c4d@synthetic-preview.invalid",
    "cpc1-matrix-b-ms7q9q1a2b3c@synthetic-preview.invalid",
    "cpc1-del-b-ms7rjon9a8b7c@synthetic-preview.invalid",
  ]) {
    assert.deepEqual(classifyPreviewSyntheticIdentity(email), {
      synthetic: true,
      family: "cpc1_acceptance_fixture",
    }, email);
  }
});

test("the POR-1 probe and registration family is recognised", () => {
  // Real shapes from the probe harnesses and reg20: always the literal `por1`, then entropy.
  for (const email of [
    "por1f4a1b2c3d4e5f6a7b8@example.com",
    "por1pair3a91827364@example.com",
    "por1v7b28391047a@example.com",
    "por1wsf24a19283746@example.com",
    "por1probe1785499859@example.com",
  ]) {
    assert.deepEqual(classifyPreviewSyntheticIdentity(email), {
      synthetic: true,
      family: "por1_probe_and_registration",
    }, email);
  }
});

// ── WHAT IT MUST REFUSE ──────────────────────────────────────────────────────

test("a real-looking or unknown identity is never synthetic", () => {
  for (const email of [
    "someone@gmail.com",
    "founder@yorisou.co.jp",
    "operator@yorisou.com",
    "test@test.com",
    "admin@example.org",
    "por1@example.org", // right prefix, wrong domain
    "user@sub.example.com", // not the reserved domain itself
  ]) {
    const verdict = classifyPreviewSyntheticIdentity(email);
    assert.equal(verdict.synthetic, false, `${email} must not be classified synthetic`);
  }
});

test("the right domain with a hand-typed local part is refused", () => {
  // Prefix-only matching would accept these. Both patterns are anchored and demand real entropy,
  // because a human typing `por1test@example.com` must not be able to enrol themselves for deletion.
  for (const email of [
    "por1@example.com",
    "por1test@example.com",
    "por1-manual@example.com",
    "cpc1@synthetic-preview.invalid",
    "cpc1-manual@synthetic-preview.invalid",
    "cpc1-a-b@synthetic-preview.invalid",
  ]) {
    assert.deepEqual(
      classifyPreviewSyntheticIdentity(email),
      { synthetic: false, reason: "local_part_not_fixture_generated" },
      email,
    );
  }
});

test("the two families may not borrow each other's domain", () => {
  // A cpc1 local part on example.com, and a por1 local part on the invalid domain. Neither is a
  // shape any fixture produces, so neither may be deleted.
  assert.equal(
    classifyPreviewSyntheticIdentity("cpc1-journey-ms8w1a2b3c4d@example.com").synthetic,
    false,
  );
  assert.equal(
    classifyPreviewSyntheticIdentity("por1f4a1b2c3d4e5f6a7b8@synthetic-preview.invalid").synthetic,
    false,
  );
});

test("malformed input is refused rather than throwing", () => {
  for (const email of ["", "   ", "no-at-sign", "@example.com", "a@", "a@@example.com"]) {
    const verdict = classifyPreviewSyntheticIdentity(email);
    assert.equal(verdict.synthetic, false, JSON.stringify(email));
  }
});

test("classification is case- and whitespace-insensitive", () => {
  assert.equal(
    classifyPreviewSyntheticIdentity("  POR1F4A1B2C3D4E5F6A7B8@EXAMPLE.COM  ").synthetic,
    true,
  );
});

// ── THE PARTITION KEEPS UNKNOWNS, AND KEEPS THEM QUIET ───────────────────────

test("unknown accounts are preserved and reported without their email", () => {
  const { synthetic, unknown } = partitionPreviewIdentities([
    { id: "acct_1111111111_aaaaaaaa", email: "por1f4a1b2c3d4e5f6a7b8@example.com" },
    { id: "acct_2222222222_bbbbbbbb", email: "shadow-email@example.com" },
    { id: "acct_3333333333_cccccccc", email: "someone@gmail.com" },
  ]);

  assert.equal(synthetic.length, 1);
  assert.equal(synthetic[0]?.family, "por1_probe_and_registration");
  assert.equal(unknown.length, 2, "both non-fixture accounts must survive classification");

  // The email is the only personal field these records carry. It must not appear in cleanup output.
  const serialized = JSON.stringify(unknown);
  for (const leak of ["shadow-email", "someone", "gmail.com", "@example.com"]) {
    assert.equal(serialized.includes(leak), false, `unknown report must not carry "${leak}"`);
  }
});

test("an empty population partitions cleanly", () => {
  const { synthetic, unknown } = partitionPreviewIdentities([]);
  assert.deepEqual(synthetic, []);
  assert.deepEqual(unknown, []);
});
