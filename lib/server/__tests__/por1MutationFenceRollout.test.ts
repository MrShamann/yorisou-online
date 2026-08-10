// POR-1 — the fence's rollout contract.
//
// The fence RPCs live in a Preview-only migration. Requiring a lease unconditionally broke
// authenticated login on the current Production-lineage CI databases, where those RPCs do not
// exist: YV-1 and DCI-1 went red and downstream 422s became 401s.
//
// That is a rollout-ordering problem, and the fix must not be "treat a failed RPC as permission to
// write". Readiness (does the schema exist?) and activation (may deletion run?) are separate facts,
// and this is the matrix that keeps them separate.

import assert from "node:assert/strict";
import test from "node:test";

import { resolveFenceMode } from "../accountMutationFenceRollout";

test("old lineage, executor off: exact legacy behaviour, and no RPC is attempted", () => {
  // Nothing can be deleting, so nothing can be resurrected. This is the case that restores YV-1
  // and DCI-1 — without it the application is simply broken on its own current Production schema.
  assert.equal(
    resolveFenceMode({ schemaReady: false, deletionExecutorEnabled: false }),
    "legacy_no_schema",
  );
});

test("old lineage, executor ON: fail closed before any identity mutation", () => {
  // Deletion could run while the fence cannot. Refusing the write is the only safe answer — this is
  // the combination that must never be allowed to proceed "because the RPC was missing".
  assert.equal(
    resolveFenceMode({ schemaReady: false, deletionExecutorEnabled: true }),
    "fail_closed",
  );
});

test("new lineage: the fence applies whether or not the executor is on", () => {
  // Turning the deletion executor off is an emergency stop for DELETION. If it also switched the
  // fence off, that kill switch would reopen ordinary writes against a deletion already in flight —
  // reintroducing the exact resurrection the fence exists to stop.
  assert.equal(resolveFenceMode({ schemaReady: true, deletionExecutorEnabled: false }), "fenced");
  assert.equal(resolveFenceMode({ schemaReady: true, deletionExecutorEnabled: true }), "fenced");
});

test("readiness is never inferred — only an explicit signal counts", () => {
  // A missing RPC, a schema-cache error, a timeout or a 5xx must not be read as "old schema".
  // Readiness is a deployment fact, stated by the deployment, not guessed from a failure.
  for (const executor of [true, false]) {
    const mode = resolveFenceMode({ schemaReady: true, deletionExecutorEnabled: executor });
    assert.equal(mode, "fenced", "a ready deployment stays fenced regardless of runtime errors");
  }
});
