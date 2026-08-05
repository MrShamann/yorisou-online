// POR-1 — RUN the deletion path, do not read it.
//
// WHY THIS EXISTS, SEPARATELY FROM THE STRUCTURAL GUARD.
//
// `por1ErasureAuthorityRuntimePath.test.ts` reads the shipped source and asserts the policy is wired
// where it belongs. That is a useful regression guard and it stays — but it is not proof of
// behaviour, and this package exists because a version of this code once had a correct decision
// function and a runtime that contradicted it. A decision-table test passed the whole time.
//
// So this file invokes the real exported `executeDeletion` and asserts on what it DID: which
// collaborators were called, how many times, and with what arguments. The body under test is the
// body production runs; only the collaborators are substituted, through the dependency parameter
// whose default is the production set.

import assert from "node:assert/strict";
import test from "node:test";

import { executeDeletion, type DeletionExecutionDependencies } from "../accountDeletionOrchestrator";
import type { DeletionStage, ExecutorClaim } from "../accountDeletionExecutor";

type Call = { name: string; args: unknown[] };

/** A recording stand-in for every collaborator, with the state the case needs. */
function harness(options: {
  executorEnabled?: boolean;
  schemaReady?: boolean;
  cursor?: DeletionStage;
  irreversible?: boolean;
  state?: string;
  claimed?: boolean;
  runStages?: (claim: ExecutorClaim) => Promise<{ outcome: string; errorCode?: string }>;
}) {
  const calls: Call[] = [];
  const record = (name: string, ...args: unknown[]) => calls.push({ name, args });

  const claim: ExecutorClaim = {
    accountId: "acct-A",
    jobId: "job-1",
    tokenHash: "t".repeat(64),
    generation: 7,
    cursor: options.cursor ?? "mutation_draining",
    irreversible: options.irreversible ?? false,
  };

  const dependencies: DeletionExecutionDependencies = {
    readResumeState: (async (accountId: string) => {
      record("readResumeState", accountId);
      return {
        state: options.state ?? "identity_verified",
        cursor: options.cursor ?? "mutation_draining",
        irreversible: options.irreversible ?? false,
      };
    }) as DeletionExecutionDependencies["readResumeState"],

    checkDeletionBackendReadiness: (async () => {
      record("checkDeletionBackendReadiness");
      return { ready: true } as Awaited<ReturnType<DeletionExecutionDependencies["checkDeletionBackendReadiness"]>>;
    }) as DeletionExecutionDependencies["checkDeletionBackendReadiness"],

    claimDeletionExecutor: (async (accountId: string) => {
      record("claimDeletionExecutor", accountId);
      return options.claimed === false
        ? { claimed: false as const, reason: "executor_already_claimed", cursor: null }
        : { claimed: true as const, claim };
    }) as DeletionExecutionDependencies["claimDeletionExecutor"],

    releaseDeletionExecutor: (async (c: ExecutorClaim) => {
      record("releaseDeletionExecutor", c.jobId);
    }) as DeletionExecutionDependencies["releaseDeletionExecutor"],

    recordRetryableError: (async (c: ExecutorClaim, code: string) => {
      record("recordRetryableError", c.jobId, code);
    }) as DeletionExecutionDependencies["recordRetryableError"],

    isPor1CapabilityEnabled: ((capability: string) => {
      record("isPor1CapabilityEnabled", capability);
      return options.executorEnabled ?? true;
    }) as DeletionExecutionDependencies["isPor1CapabilityEnabled"],

    accountErasureAuthoritySchemaReady: (() => {
      record("accountErasureAuthoritySchemaReady");
      return options.schemaReady ?? true;
    }) as DeletionExecutionDependencies["accountErasureAuthoritySchemaReady"],

    runStages: (async (c: ExecutorClaim) => {
      record("runStages", c.jobId, c.cursor, c.generation, c.tokenHash);
      const result = await (options.runStages?.(c) ?? Promise.resolve({ outcome: "completed" as const }));
      return result as Awaited<ReturnType<DeletionExecutionDependencies["runStages"]>>;
    }) as DeletionExecutionDependencies["runStages"],
  };

  const count = (name: string) => calls.filter((c) => c.name === name).length;
  return { dependencies, calls, count, claim };
}

// ── Case 1 — a NEW job while the authority schema is unready ────────────────

test("case 1: new job + schema unready → refused before the claim, no RPC issued", async () => {
  const h = harness({ executorEnabled: true, schemaReady: false, irreversible: false, cursor: "mutation_draining" });

  const outcome = await executeDeletion("acct-A", h.dependencies);

  assert.deepEqual(outcome, {
    outcome: "retryable",
    errorCode: "account_erasure_authority_schema_unready",
  });
  assert.equal(h.count("claimDeletionExecutor"), 0, "no claim RPC may be issued");
  assert.equal(h.count("runStages"), 0, "no stage — and therefore no erasure — may run");
  assert.equal(h.count("releaseDeletionExecutor"), 0, "nothing was claimed, so nothing is released");
});

// ── Case 2 — an ALREADY IRREVERSIBLE job while the flag is unready ──────────

test("case 2: already irreversible + schema unready → NOT refused; the claim proceeds", async () => {
  const h = harness({
    executorEnabled: true,
    schemaReady: false,
    irreversible: true,
    cursor: "database_erasure",
    state: "database_erasure",
  });

  const outcome = await executeDeletion("acct-A", h.dependencies);

  assert.equal(h.count("claimDeletionExecutor"), 1, "a half-erased account must still be resumable");
  assert.equal(h.count("runStages"), 1, "and its remaining stages must run");
  assert.notEqual(
    (outcome as { errorCode?: string }).errorCode,
    "account_erasure_authority_schema_unready",
    "refusing here would strand a partially executed deletion",
  );
});

test("case 2b: past the boundary by CURSOR alone is treated as irreversible", async () => {
  // `irreversible` false but the cursor is past `lock_marker` — the flag may not have been written
  // yet, and the cursor is the durable truth.
  const h = harness({ executorEnabled: true, schemaReady: false, irreversible: false, cursor: "storage_erasure" });
  await executeDeletion("acct-A", h.dependencies);
  assert.equal(h.count("claimDeletionExecutor"), 1, "cursor position alone must permit the resume");
});

// ── Case 3 — irreversible resume where the strong RPC is unavailable ────────

test("case 3: irreversible resume + strong RPC unavailable → retryable, claim released, state intact", async () => {
  const h = harness({
    executorEnabled: true,
    schemaReady: false,
    irreversible: true,
    cursor: "database_erasure",
    state: "database_erasure",
    runStages: async () => {
      throw new Error("account_deletion_erase_rpc_unavailable");
    },
  });

  const outcome = await executeDeletion("acct-A", h.dependencies);

  assert.equal((outcome as { outcome: string }).outcome, "retryable", "recoverable, not terminal");
  assert.equal(h.count("claimDeletionExecutor"), 1);
  assert.equal(h.count("releaseDeletionExecutor"), 1, "the claim must be given back on the failure path");
  // Nothing in this path may rewrite the durable position: the cursor the claim carried is the
  // cursor the stage was asked to execute.
  const staged = h.calls.find((c) => c.name === "runStages");
  assert.equal(staged?.args[1], "database_erasure", "the exact cursor must be preserved, not reset");
});

// ── Case 4 — the ordinary path ─────────────────────────────────────────────

test("case 4: new job + schema ready → claim taken and stages run", async () => {
  const h = harness({ executorEnabled: true, schemaReady: true, irreversible: false });
  const outcome = await executeDeletion("acct-A", h.dependencies);

  assert.equal(h.count("claimDeletionExecutor"), 1);
  assert.equal(h.count("runStages"), 1);
  assert.equal((outcome as { outcome: string }).outcome, "completed");
});

test("case 4b: executor capability disabled keeps its existing dormant behaviour", async () => {
  const h = harness({ executorEnabled: false, schemaReady: false });
  await executeDeletion("acct-A", h.dependencies);
  // The capability gate is consulted, and an unready schema does NOT manufacture a refusal when the
  // executor is off — that would be a behaviour change on a dormant path.
  assert.equal(h.count("isPor1CapabilityEnabled"), 1);
});

// ── Case 5 — the authority actually carried into the stages ────────────────

test("case 5: the claim carrying job, token and generation is what reaches the stages", async () => {
  const h = harness({ executorEnabled: true, schemaReady: true });
  await executeDeletion("acct-A", h.dependencies);

  const staged = h.calls.find((c) => c.name === "runStages");
  assert.ok(staged, "stages must run");
  const [jobId, cursor, generation, tokenHash] = staged.args as [string, string, number, string];
  assert.equal(jobId, "job-1", "the EXACT job, not one rediscovered from the owner");
  assert.equal(generation, 7);
  assert.equal(tokenHash, "t".repeat(64));
  assert.ok(cursor, "and the stage it is expected to execute");
});

test("case 5b: the readiness decision reads the deployment fact, not an RPC error", async () => {
  const h = harness({ executorEnabled: true, schemaReady: false, irreversible: false });
  await executeDeletion("acct-A", h.dependencies);
  assert.equal(
    h.count("accountErasureAuthoritySchemaReady"),
    1,
    "readiness is a stated deployment fact; inferring it from a failed call is what produced the 500",
  );
});
