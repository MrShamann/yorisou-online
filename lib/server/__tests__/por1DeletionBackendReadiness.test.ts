// POR-1 — the deletion executor must not cross the irreversible boundary over a missing dependency.
//
// WHAT M4 SHOWED.
//
// The real governed deletion ran against a stack with no shared object store. The saga froze the
// manifest, placed the lock marker, crossed the irreversible boundary, and only then reached
// `session_revocation` — which writes through that store — and failed with
// `shared_store_not_configured`.
//
// Every individual behaviour was correct: `failed_retryable`, cursor preserved, no false completion.
// The defect is the ORDER. A pre-existing, mandatory, statically-knowable requirement was discovered
// after the point of no return.
//
// THE DISTINCTION THESE TESTS EXIST TO PIN.
//
//   missing BEFORE the boundary  → refuse, do not cross, nothing destroyed
//   outage AFTER the boundary    → failed_retryable, resume from the exact cursor
//
// Those two look identical in a log and have opposite correct answers. Gating the second would
// strand a half-erased account; not gating the first is what actually happened.

import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyProbeFailure,
  shouldGateOnBackendReadiness,
  type DeletionBackendUnready,
} from "../deletionBackendReadinessDecision";
import { isAtOrPastIrreversible, type DeletionStage } from "../accountDeletionExecutor";

/** The gate exactly as the orchestrator applies it: the real predicate over the real cursor rank. */
const shouldGate = (job: { irreversible: boolean; cursor: DeletionStage | null }) =>
  shouldGateOnBackendReadiness({
    irreversible: job.irreversible,
    pastIrreversibleCursor: isAtOrPastIrreversible(job.cursor),
  });

test("a job that has NOT crossed is gated", () => {
  // The cursor stages begin at mutation_draining; a job that has not started one has a null cursor.
  // The irreversible stage is lock_marker, so mutation_draining is the last gateable point — the
  // manifest is frozen there and nothing has been destroyed yet.
  assert.equal(shouldGate({ irreversible: false, cursor: null }), true);
  assert.equal(shouldGate({ irreversible: false, cursor: "mutation_draining" }), true);
});

test("a job that HAS crossed is NOT gated — it must be allowed to resume", () => {
  // This is the half of the rule that is easy to get wrong in the safe-looking direction. Refusing
  // here would leave an account whose erasure had already begun permanently stuck.
  assert.equal(shouldGate({ irreversible: true, cursor: "session_revocation" }), false);
  assert.equal(shouldGate({ irreversible: false, cursor: "session_revocation" }), false);
  assert.equal(shouldGate({ irreversible: false, cursor: "database_erasure" }), false);
  assert.equal(shouldGate({ irreversible: true, cursor: null }), false);
});

test("the cursor alone is enough — a job past the boundary is recognised without the flag", () => {
  // Two independent witnesses to the same fact. If they ever disagree, the safe reading is that the
  // crossing happened, because the unsafe direction is gating a job that must resume.
  for (const cursor of ["session_revocation", "database_erasure", "verifying", "finalizing", "completed"] as DeletionStage[]) {
    assert.equal(shouldGate({ irreversible: false, cursor }), false, cursor);
  }
});

// ── THE REASON CODES ─────────────────────────────────────────────────────────

test("a missing store is distinguished from an unreachable one", () => {
  // Not cosmetic. "Not configured" means fix the deployment; "unreachable" is plausibly transient and
  // the same release may succeed on retry. An operator needs to know which before deciding.
  const cases: Array<[Parameters<typeof classifyProbeFailure>[0], string, DeletionBackendUnready]> = [
    ["write", "shared_store_not_configured", "shared_store_not_configured"],
    ["write", "getaddrinfo ENOTFOUND storage.internal", "shared_store_unreachable"],
    ["write", "connect ECONNREFUSED 127.0.0.1:9000", "shared_store_unreachable"],
    ["write", "fetch failed", "shared_store_unreachable"],
    ["write", "NoSuchBucket: the specified bucket does not exist", "shared_store_unreachable"],
    ["write", "AccessDenied", "shared_store_not_writable"],
    ["read", "AccessDenied", "shared_store_not_readable"],
    ["read", "probe_object_absent_after_write", "shared_store_not_readable"],
    ["delete", "AccessDenied", "shared_store_not_deletable"],
  ];
  for (const [stage, code, expected] of cases) {
    assert.equal(classifyProbeFailure(stage, code), expected, `${stage}: ${code}`);
  }
});

test("a store that cannot DELETE is not ready, even though write and read succeeded", () => {
  // Session revocation deletes. A store that accepts writes but refuses deletes would pass any
  // write-only probe and then fail at exactly the stage this gate exists to protect.
  assert.equal(classifyProbeFailure("delete", "AccessDenied"), "shared_store_not_deletable");
});

test("every reason code is a bounded token carrying no configuration detail", () => {
  // These reach a failure record and observability. An endpoint, a bucket name or a credential
  // fragment in a reason code would put deployment detail somewhere it is not governed.
  const codes: DeletionBackendUnready[] = [
    "shared_store_not_configured", "shared_store_unreachable", "shared_store_not_writable",
    "shared_store_not_readable", "shared_store_not_deletable",
  ];
  for (const code of codes) {
    assert.match(code, /^shared_store_[a-z_]+$/, `${code} must be a bounded token`);
    assert.ok(!/https?:|[A-Z]{4,}|\d{3,}/.test(code), `${code} must carry no configuration detail`);
  }

  const noisy = classifyProbeFailure("write", "connect ECONNREFUSED 10.1.2.3:9000 bucket=secret-bucket");
  assert.equal(noisy, "shared_store_unreachable", "the classifier returns a token, never the message");
});
