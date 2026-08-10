// POR-1 WS-G8 — the cleanup model was blind to the deletions it had already half-finished.
//
// THE DEFECT THIS EXISTS TO PREVENT RETURNING.
//
// Cleanup derived every candidate from surviving ACCOUNTS. That holds until `identity_erasure`
// removes the account object — after which a job that fails leaves satellites with nothing left to
// enumerate them. The tool then reported "nothing to clean" while the Preview still held:
//
//     1 ACTIVE identity link · 12 failed_retryable jobs · 13 jobs still naming an owner
//     3 owner-linked sessions · 2 LINE lookups · 1 UserProfile · 2 AuthIdentities
//
// The second run removing nothing was TRUE and MEANINGLESS. That is the specific way this gate can
// be passed for the wrong reason, so the decisive test here is the negative control at the bottom.

import assert from "node:assert/strict";
import test from "node:test";

import {
  accountAbsenceIsExpected,
  canTerminallyDeidentifyFailedDeletion,
  classifyRecoverableDeletionJob,
  type DeletionJobFacts,
} from "../deletionJobRecovery";

const base: DeletionJobFacts = {
  ownerAccountId: "acct_1",
  state: "failed_retryable",
  cursor: "verifying",
  irreversible: true,
  hasManifest: true,
  executorHeld: false,
};

const job = (over: Partial<DeletionJobFacts> = {}): DeletionJobFacts => ({ ...base, ...over });

// ── THE NEGATIVE CONTROL ─────────────────────────────────────────────────────

test("NEGATIVE CONTROL — account enumeration finds nothing while job enumeration finds the residue", () => {
  // The exact hosted shape: accounts erased, jobs left behind mid-saga.
  const survivingAccounts: Array<{ id: string }> = [];
  const durableJobs = [
    job({ ownerAccountId: "acct_a", state: "failed_retryable", cursor: "verifying" }),
    job({ ownerAccountId: "acct_b", state: "failed_retryable", cursor: "identity_erasure" }),
    job({ ownerAccountId: "acct_c", state: "completed", cursor: "completed" }),
  ];

  assert.equal(survivingAccounts.length, 0, "the old model's entire candidate source is empty");

  const recoverable = durableJobs.filter((j) => classifyRecoverableDeletionJob(j).resumable);
  assert.equal(
    recoverable.length,
    3,
    "the job-derived model must find all three — including the completed one that still names its owner",
  );
});

// ── COMPLETION IS ONLY COMPLETE WHEN THE PERSON IS NO LONGER NAMED ───────────

test("a completed job that still names an owner is unfinished, not done", () => {
  // De-identification is the last act of the saga. Treating this as finished would leave someone
  // named in an audit record forever, which is the opposite of what the deletion promised.
  const d = classifyRecoverableDeletionJob(job({ state: "completed", cursor: "completed" }));
  assert.equal(d.classification, "COMPLETED_BUT_NOT_DEIDENTIFIED");
  assert.deepEqual([d.resumable, d.residue, d.needsHuman], [true, true, false]);
});

test("a completed, de-identified job is the SUCCESS shape and must be left alone", () => {
  const d = classifyRecoverableDeletionJob(job({ ownerAccountId: null, state: "completed", cursor: "completed" }));
  assert.equal(d.classification, "COMPLETED_DEIDENTIFIED");
  assert.deepEqual([d.resumable, d.residue, d.needsHuman], [false, false, false]);
});

// ── RESUMABLE WORK ───────────────────────────────────────────────────────────

test("a failed_retryable job resumes on both sides of the crossing", () => {
  const post = classifyRecoverableDeletionJob(job({ irreversible: true }));
  assert.equal(post.classification, "FAILED_RETRYABLE_POST_IRREVERSIBLE");
  assert.equal(post.resumable, true);

  const pre = classifyRecoverableDeletionJob(job({ irreversible: false, cursor: "lock_marker" }));
  assert.equal(pre.classification, "FAILED_RETRYABLE_PRE_IRREVERSIBLE");
  assert.equal(pre.resumable, true);
});

test("a live mid-saga job that still names an owner is resumable", () => {
  const d = classifyRecoverableDeletionJob(job({ state: "storage_erasure", cursor: "storage_erasure" }));
  assert.equal(d.classification, "OWNER_NAMED_WITH_FROZEN_MANIFEST");
  assert.equal(d.resumable, true);
});

test("the account being absent is EXPECTED once erasure has passed identity_erasure", () => {
  // So an operator reading "resuming a deletion for an account that does not exist" sees the
  // expected shape rather than a contradiction.
  for (const cursor of ["identity_erasure", "verifying", "finalizing", "completed"]) {
    assert.equal(accountAbsenceIsExpected(cursor), true, cursor);
  }
  for (const cursor of ["mutation_draining", "lock_marker", "session_revocation", "database_erasure", null]) {
    assert.equal(accountAbsenceIsExpected(cursor), false, String(cursor));
  }
});

// ── WHAT AUTOMATION MUST REFUSE ──────────────────────────────────────────────

test("past the crossing with NO frozen manifest is never automated", () => {
  // The manifest is the only record of what was owned, frozen before anything is destroyed. Absent
  // afterwards, the evidence of what remains to erase does not exist — and guessing from surviving
  // objects is precisely the mistake that produced these orphans.
  const d = classifyRecoverableDeletionJob(job({ hasManifest: false, irreversible: true }));
  assert.equal(d.classification, "OWNER_NAMED_WITHOUT_FROZEN_MANIFEST");
  assert.deepEqual([d.resumable, d.residue, d.needsHuman], [false, true, true]);
});

test("a terminal failure is never auto-converted into success", () => {
  const d = classifyRecoverableDeletionJob(job({ state: "failed_terminal" }));
  assert.equal(d.classification, "FAILED_TERMINAL");
  assert.deepEqual([d.resumable, d.residue, d.needsHuman], [false, true, true]);
});

test("a cancellation recorded AFTER the crossing is a contradiction and needs a human", () => {
  const bad = classifyRecoverableDeletionJob(job({ state: "cancelled", irreversible: true }));
  assert.equal(bad.classification, "CANCELLED_INVALID_AFTER_IRREVERSIBLE");
  assert.equal(bad.needsHuman, true);

  const ok = classifyRecoverableDeletionJob(job({ state: "cancelled", irreversible: false, cursor: null }));
  assert.equal(ok.classification, "CANCELLED_PRE_IRREVERSIBLE");
  assert.deepEqual([ok.resumable, ok.residue, ok.needsHuman], [false, false, false]);
});

test("a job under a live claim is left to its owner", () => {
  // Contending here is the second-executor defect this package already repaired once.
  const d = classifyRecoverableDeletionJob(job({ executorHeld: true }));
  assert.equal(d.classification, "IN_PROGRESS_VALID_CLAIM");
  assert.equal(d.resumable, false);
  assert.equal(d.residue, true, "still unfinished — it must not be counted as clean");
  assert.equal(d.revisit, true, "revisited after a bounded interval, not contended with");
  assert.equal(d.needsHuman, false, "a healthy in-flight deletion is not an escalation");
});

test("a job with no owner and no completion is corrupt, and is surfaced rather than skipped", () => {
  const d = classifyRecoverableDeletionJob(job({ ownerAccountId: null, state: "failed_retryable" }));
  assert.equal(d.classification, "UNCLASSIFIED_CORRUPT");
  assert.deepEqual([d.resumable, d.residue, d.needsHuman], [false, true, true]);
});

// ── NOTHING SILENTLY DISAPPEARS ──────────────────────────────────────────────

test("every classification is either clean, resumable, or escalated — never silently dropped", () => {
  const shapes: DeletionJobFacts[] = [
    job({ ownerAccountId: null, state: "completed" }),
    job({ state: "completed" }),
    job({ executorHeld: true }),
    job({ state: "failed_retryable", irreversible: false }),
    job({ state: "failed_retryable", irreversible: true }),
    job({ state: "failed_terminal" }),
    job({ state: "cancelled", irreversible: false }),
    job({ state: "cancelled", irreversible: true }),
    job({ hasManifest: false, irreversible: true }),
    job({ ownerAccountId: null, state: "verifying" }),
  ];

  for (const shape of shapes) {
    const d = classifyRecoverableDeletionJob(shape);
    assert.equal(
      d.residue === false || d.resumable || d.needsHuman || d.revisit,
      true,
      `${d.classification}: residue must be clean, resumable, escalated, or explicitly revisited`,
    );
  }
});

// ── TERMINAL DE-IDENTIFICATION ELIGIBILITY ───────────────────────────────────
//
// The Founder-selected resolution: a terminal failure may stop naming the person, without ever
// claiming the deletion succeeded. This predicate selects candidates; the database re-evaluates
// every clause under a row lock, so a drift between the two cannot authorise anything.

test("the exact hosted shape is eligible", () => {
  // failed_terminal, account gone, no manifest, never crossed — the six jobs in Preview.
  assert.equal(
    canTerminallyDeidentifyFailedDeletion(
      job({ state: "failed_terminal", irreversible: false, hasManifest: false, cursor: null }),
    ),
    true,
  );
});

test("every ineligible shape is refused", () => {
  const ineligible: Array<[string, DeletionJobFacts]> = [
    ["already de-identified / no owner", job({ state: "failed_terminal", ownerAccountId: null, irreversible: false, hasManifest: false })],
    ["past the crossing", job({ state: "failed_terminal", irreversible: true, hasManifest: false, cursor: null })],
    ["resumable: manifest present", job({ state: "failed_terminal", irreversible: false, hasManifest: true, cursor: null })],
    ["not terminal", job({ state: "failed_retryable", irreversible: false, hasManifest: false, cursor: null })],
    ["completed", job({ state: "completed", irreversible: false, hasManifest: false, cursor: null })],
    ["cancelled", job({ state: "cancelled", irreversible: false, hasManifest: false, cursor: null })],
    ["claim held", job({ state: "failed_terminal", irreversible: false, hasManifest: false, cursor: null, executorHeld: true })],
    ["cursor past the crossing", job({ state: "failed_terminal", irreversible: false, hasManifest: false, cursor: "identity_erasure" })],
  ];
  for (const [why, shape] of ineligible) {
    assert.equal(canTerminallyDeidentifyFailedDeletion(shape), false, why);
  }
});

test("eligibility never overlaps with resumability", () => {
  // A job that can still be resumed must be resumed — minimising a failure that did not have to be
  // final would throw away a deletion the person actually asked for.
  const shapes = [
    job({ state: "failed_terminal", irreversible: false, hasManifest: false, cursor: null }),
    job({ state: "failed_terminal", irreversible: false, hasManifest: true, cursor: null }),
    job({ state: "failed_retryable", irreversible: true }),
    job({ state: "completed" }),
  ];
  for (const shape of shapes) {
    const d = classifyRecoverableDeletionJob(shape);
    assert.equal(
      canTerminallyDeidentifyFailedDeletion(shape) && d.resumable,
      false,
      `${d.classification}: a job may be resumable or de-identifiable, never both`,
    );
  }
});
