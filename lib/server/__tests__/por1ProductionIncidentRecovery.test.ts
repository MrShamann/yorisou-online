// §14 E — operator recovery SELECTION. The rule is a conjunction, and every clause is load-bearing:
// a recovery tool that guesses is a deletion tool with extra steps.
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  classifyIncidentCandidate,
  isIncidentSyntheticEmail,
  selectIncidentCandidates,
  type IncidentCandidateRow,
} from "../por1ProductionIncidentRecovery";

const incident = (over: Partial<IncidentCandidateRow> = {}): IncidentCandidateRow => ({
  jobFingerprint: "5990ad0e0715",
  state: "failed_retryable",
  executionCursor: "database_erasure",
  irreversible: true,
  manifestPresent: true,
  ownerNamed: true,
  executorLeaseLive: false,
  ownerEmail: "por1-20260810t0330-a@yorisou-release-check.invalid",
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

// ── the synthetic classification must be PROVEN ─────────────────────────────

test("an unknown or non-synthetic owner is refused, never assumed", () => {
  for (const email of [
    null,
    "someone@real-person.example",
    "someone@gmail.com",
    "admin@yorisou.online",
    // right domain, wrong local part — the conjunction is what stops collateral damage
    "shadow-1234@yorisou-release-check.invalid",
    "switch-1@something.invalid",
  ]) {
    assert.deepEqual(
      classifyIncidentCandidate(incident({ ownerEmail: email })),
      { action: "refuse", reason: "synthetic_classification_unproven" },
      String(email),
    );
  }
});

test("the synthetic rule needs BOTH the reserved .invalid domain and the por1 local-part shape", () => {
  assert.equal(isIncidentSyntheticEmail("por1-20260810t0330-a@yorisou-release-check.invalid"), true);
  assert.equal(isIncidentSyntheticEmail("por1-20260810t0330-a@yorisou-release-check.com"), false);
  assert.equal(isIncidentSyntheticEmail("nope@yorisou-release-check.invalid"), false);
  assert.equal(isIncidentSyntheticEmail(null), false);
  assert.equal(isIncidentSyntheticEmail("por1-x-y@sub.domain.invalid"), true);
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

test("one unknown candidate blocks the whole run, and it is reported not touched", () => {
  const rows = [incident(), incident({ jobFingerprint: "x", ownerEmail: "real@person.example" })];
  const selection = selectIncidentCandidates(rows, { maxCandidates: 1 });
  assert.equal(selection.safeToExecute, false);
  assert.equal(selection.blockReason, "unknown_or_non_synthetic_candidate_present");
  assert.equal(selection.refused.length, 1);
  assert.equal(selection.refused[0].row.jobFingerprint, "x");
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
  // Scan the CODE, not the prose. The header explains at length that this tool has no cron, no
  // schedule and no endpoint, and a naive substring search would fail on that promise while a file
  // that actually scheduled something inside a comment-free line would pass. Comments and string
  // literals in the guard list below are what matter, so comments are stripped first.
  const code = SCRIPT.replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");
  for (const forbidden of ["cron", "schedule", "setInterval", "NextResponse", "export async function GET", "export async function POST"]) {
    assert.ok(!code.includes(forbidden), `must not contain ${forbidden}`);
  }
});
