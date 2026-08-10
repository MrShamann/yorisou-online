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
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
  /** Measured transport health. Defaults to ready so existing cases keep their meaning. */
  transportReady?: boolean;
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

    probeTransport: (async () => {
      record("probeTransport");
      return (options.transportReady ?? true)
        ? { ready: true as const }
        : { ready: false as const, reason: "erasure_rpc_unavailable" as const };
    }) as DeletionExecutionDependencies["probeTransport"],

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

// ═════════════════════════════════════════════════════════════════════════════
// §14 C — the cases added after the 2026-08-10 Production incident.
//
// Two of these describe behaviour that did not exist before: `executor_disabled` was not handled at
// all, so a pre-irreversible job FELL THROUGH the decision and claimed anyway; and there was no
// measurement of whether the erasure RPC could actually be invoked.
// ═════════════════════════════════════════════════════════════════════════════

test("case 6: new job + transport UNREADY after winning the claim → retryable, claim released, nothing run", async () => {
  // The probe is taken by the CLAIM WINNER, so the claim happens first by design. What must not
  // happen is any stage, any lifecycle movement, or a retained lease.
  const h = harness({
    executorEnabled: true,
    schemaReady: true,
    transportReady: false,
    irreversible: false,
    cursor: "mutation_draining",
  });

  const outcome = await executeDeletion("acct-A", h.dependencies);

  assert.equal(outcome.outcome, "retryable", "recoverable: the deployment can be fixed and retried");
  assert.equal(
    (outcome as { errorCode?: string }).errorCode,
    "erasure_rpc_unavailable",
    "the bounded transport reason, not a generic failure",
  );
  assert.equal(h.count("probeTransport"), 1, "the winner measures exactly once");
  assert.equal(h.count("runStages"), 0, "no stage may run on an unreachable transport");
  assert.equal(h.count("releaseDeletionExecutor"), 1, "the claim is handed back so a retry is not blocked");
});

test("case 7: new job + EXECUTOR DISABLED → refused before the claim, zero claim calls", async () => {
  // This is the behaviour whose ABSENCE stranded two Production accounts: the kill switch was off,
  // the decision said `executor_disabled`, nothing handled that mode, and the job was claimed anyway.
  const h = harness({
    executorEnabled: false,
    schemaReady: true,
    irreversible: false,
    cursor: "mutation_draining",
  });

  const outcome = await executeDeletion("acct-A", h.dependencies);

  assert.deepEqual(outcome, {
    outcome: "retryable",
    errorCode: "account_deletion_executor_disabled",
  });
  assert.equal(h.count("claimDeletionExecutor"), 0, "nothing may be opened while the switch is off");
  assert.equal(h.count("runStages"), 0, "and nothing destructive may run");
  assert.equal(h.count("releaseDeletionExecutor"), 0);
});

test("case 8: ALREADY IRREVERSIBLE + executor disabled → governed strong resume still proceeds", async () => {
  // The recovery path for the incident. The account is already locked out and half-deleted; refusing
  // here strands it forever. Resuming is not a bypass — the same job, token and generation are
  // presented and the SQL revalidates all of it.
  const h = harness({
    executorEnabled: false,
    schemaReady: true,
    irreversible: true,
    cursor: "database_erasure",
    state: "failed_retryable",
  });

  const outcome = await executeDeletion("acct-A", h.dependencies);

  assert.equal(h.count("claimDeletionExecutor"), 1, "a stranded job must be resumable with the switch off");
  assert.equal(h.count("runStages"), 1, "and its remaining stages must run");
  assert.equal(outcome.outcome, "completed");
});

test("case 9: already irreversible + transport unready is NOT abandoned by the preflight", async () => {
  const h = harness({
    executorEnabled: true,
    schemaReady: true,
    transportReady: false,
    irreversible: true,
    cursor: "database_erasure",
    state: "failed_retryable",
  });

  await executeDeletion("acct-A", h.dependencies);

  assert.equal(h.count("claimDeletionExecutor"), 1, "the gate must never strand a half-erased account");
  assert.equal(h.count("probeTransport"), 0, "and the probe is skipped where it could not change the answer");
  assert.equal(h.count("runStages"), 1, "the governed strong resume proceeds");
});

test("case 10: the transport is measured exactly once, by the claim WINNER, before any stage", async () => {
  const h = harness({ executorEnabled: true, schemaReady: true, irreversible: false });

  await executeDeletion("acct-A", h.dependencies);

  assert.equal(h.count("probeTransport"), 1, "exactly one live measurement per erasure");
  const claimAt = h.calls.findIndex((c) => c.name === "claimDeletionExecutor");
  const probeAt = h.calls.findIndex((c) => c.name === "probeTransport");
  const stageAt = h.calls.findIndex((c) => c.name === "runStages");
  assert.ok(claimAt > -1 && probeAt > -1 && stageAt > -1);
  assert.ok(claimAt < probeAt, "only the executor that won the claim pays for the probe");
  assert.ok(probeAt < stageAt, "and it is still measured before anything is destroyed");
});

// ═════════════════════════════════════════════════════════════════════════════
// §8 A — NO POSITIVE TRANSPORT CACHE, and the probe belongs to the claim winner.
//
// A 30s positive cache briefly lived in this file's production wiring. It was removed because "it
// was reachable 29 seconds ago" is not evidence that THIS deletion may proceed — reachability,
// grants and schema caches can change at any instant. The cost that motivated the cache is solved by
// placement instead: only the winner probes.
// ═════════════════════════════════════════════════════════════════════════════

test("case 11: two independent deletions each get their OWN live probe — no reuse", async () => {
  const first = harness({ executorEnabled: true, schemaReady: true, irreversible: false });
  await executeDeletion("acct-A", first.dependencies);
  assert.equal(first.count("probeTransport"), 1);

  const second = harness({ executorEnabled: true, schemaReady: true, irreversible: false });
  await executeDeletion("acct-B", second.dependencies);
  assert.equal(second.count("probeTransport"), 1, "a later deletion must be measured afresh");
});

test("case 12: a healthy answer never carries over — an unready probe still refuses next time", async () => {
  const healthy = harness({ executorEnabled: true, schemaReady: true, irreversible: false });
  await executeDeletion("acct-A", healthy.dependencies);
  assert.equal(healthy.count("runStages"), 1, "the healthy deletion proceeds");

  // The very next deletion, measured unready, must NOT inherit the previous "ready".
  const unready = harness({
    executorEnabled: true,
    schemaReady: true,
    transportReady: false,
    irreversible: false,
  });
  const outcome = await executeDeletion("acct-B", unready.dependencies);
  assert.equal(outcome.outcome, "retryable");
  assert.equal(unready.count("runStages"), 0, "a stale healthy answer must never authorise an erasure");
});

test("case 13: four concurrent confirms for ONE job → one winner, one probe, zero loser probes", async () => {
  // The load pattern that made a per-attempt probe expensive. Exactly one executor wins the claim;
  // the losers are refused by the claim and must not measure anything.
  let winnerTaken = false;
  const attempts = [0, 1, 2, 3].map(() => {
    const h = harness({ executorEnabled: true, schemaReady: true, irreversible: false });
    // Re-wrap the claim so exactly the first caller wins, as the database's row lock would do.
    const inner = h.dependencies.claimDeletionExecutor;
    h.dependencies.claimDeletionExecutor = (async (accountId: string) => {
      if (winnerTaken) {
        (h.calls as Array<{ name: string; args: unknown[] }>).push({
          name: "claimDeletionExecutor",
          args: [accountId],
        });
        return { claimed: false as const, reason: "executor_already_claimed", cursor: null };
      }
      winnerTaken = true;
      return inner(accountId);
    }) as typeof inner;
    return h;
  });

  const outcomes = await Promise.all(
    attempts.map((h) => executeDeletion("acct-A", h.dependencies)),
  );

  const probes = attempts.reduce((total, h) => total + h.count("probeTransport"), 0);
  const stages = attempts.reduce((total, h) => total + h.count("runStages"), 0);
  const winners = outcomes.filter((o) => o.outcome === "completed").length;
  const inProgress = outcomes.filter((o) => o.outcome === "in_progress").length;

  assert.equal(winners, 1, "exactly one executor may drive the job");
  assert.equal(inProgress, 3, "the losers report progress, not failure");
  assert.equal(probes, 1, "ONE live probe across four concurrent attempts");
  assert.equal(stages, 1, "and only the winner runs stages");

  for (const h of attempts) {
    if (h.count("runStages") === 0) {
      assert.equal(h.count("probeTransport"), 0, "a loser must never probe — it will erase nothing");
    }
  }
});

test("case 14: the production wiring contains NO positive readiness cache", () => {
  // A source guard, because this is a property a future refactor could silently undo. The failure
  // mode it prevents is subtle: a cached "ready" is indistinguishable from a fresh one at the call
  // site, so nothing else in the suite would notice.
  const source = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "..", "accountDeletionOrchestrator.ts"),
    "utf8",
  );
  const code = source.replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");

  for (const forbidden of ["TRANSPORT_PROBE_TTL_MS", "transportProbeCache"]) {
    assert.ok(!code.includes(forbidden), `${forbidden} must not return`);
  }
  // Catch an equivalently-shaped cache reintroduced under another name.
  assert.ok(
    !/TTL_MS\s*=/.test(code) || !/probe/i.test(code.slice(code.search(/TTL_MS\s*=/) - 200, code.search(/TTL_MS\s*=/) + 200)),
    "no probe-scoped TTL constant may be reintroduced",
  );
  assert.ok(
    !/result\.ready\s*\?\s*\{[^}]*at:/.test(code),
    "a healthy probe result must never be stored with a timestamp",
  );
});
