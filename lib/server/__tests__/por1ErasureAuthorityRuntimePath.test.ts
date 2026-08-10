// POR-1 — STRUCTURAL GUARD: the readiness policy must stay wired where it belongs.
//
// THIS FILE DOES NOT EXECUTE THE RUNTIME. It reads the shipped source and asserts the wiring. The
// executed proof lives in por1ErasureAuthorityRuntimeExecution.test.ts, which invokes the real
// executeDeletion and asserts on call counts and arguments. Both are kept: this one catches a
// re-introduction at the source level with a precise message, the other proves behaviour.
//
// WHY THIS EXISTS.
//
// The first attempt shipped a correct decision function and a runtime that contradicted it.
// `decideErasureAuthority` understood that an already-irreversible job must still resume, while
// `claimDeletionExecutor` refused EVERY claim whenever the schema flag was unset — which would have
// stranded a half-erased account over a deployment fact. A pure decision-table test passed
// throughout, because it never touched the code that actually runs.
//
// So these tests assert against the shipped module graph rather than a paraphrase of it: the source
// of `executeDeletion` must consult the shared policy, and the claim layer must NOT carry a
// contradictory one. A structural test is the honest instrument here — the alternative is a
// dependency-injection seam invented for the test, which proves the seam rather than the product.

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { decideErasureAuthority } from "../accountErasureAuthorityRollout";

const HERE = dirname(fileURLToPath(import.meta.url));
const ORCHESTRATOR = readFileSync(join(HERE, "..", "accountDeletionOrchestrator.ts"), "utf8");
const EXECUTOR = readFileSync(join(HERE, "..", "accountDeletionExecutor.ts"), "utf8");

/** The body of `executeDeletion`, which is the function the routes actually call. */
function executeDeletionSource(): string {
  const start = ORCHESTRATOR.indexOf("export async function executeDeletion(");
  assert.notEqual(start, -1, "executeDeletion must exist");
  const next = ORCHESTRATOR.indexOf("\nexport ", start + 1);
  return ORCHESTRATOR.slice(start, next === -1 ? undefined : next);
}

// ── the policy is consulted by the real path ────────────────────────────────

test("executeDeletion consults the shared decision, not a local re-implementation", () => {
  const body = executeDeletionSource();
  assert.match(body, /decideErasureAuthority\(/, "the real path must call the shared policy");
  // The collaborators are destructured from the dependency parameter (default: the production set),
  // so the guard tracks the destructuring rather than the bare identifiers.
  assert.match(
    body,
    /accountErasureAuthoritySchemaReady:\s*erasureSchemaReady/,
    "readiness must come from the deployment fact, never inferred from an RPC error",
  );
  assert.match(body, /schemaReady:\s*erasureSchemaReady\(\)/, "and it must feed the decision");
  assert.match(
    body,
    /executorEnabled:\s*capabilityEnabled\(\s*"ACCOUNT_DELETION_EXECUTOR"\s*\)/,
    "the executor capability must come from the existing POR-1 runtime control",
  );
});

test("the decision is computed from the resume state, including the irreversible cursor", () => {
  const body = executeDeletionSource();
  // The expression is now bound to a name because the transport probe is skipped for the same
  // condition, and one source of truth beats two copies. So the guard checks BOTH halves: that the
  // value is derived from exactly `resume.irreversible || isAtOrPastIrreversible(resume.cursor)`,
  // and that this exact value is what reaches the policy. That is strictly more than the previous
  // single check — a refactor cannot satisfy one half and quietly drop the other.
  assert.match(
    body,
    /const\s+alreadyIrreversible\s*=\s*resume\.irreversible\s*\|\|\s*isAtOrPastIrreversible\(resume\.cursor\)/,
    "a job past the boundary by cursor is irreversible even if the flag has not been written yet",
  );
  assert.match(
    body,
    /decideErasureAuthority\(\{[\s\S]*?\balreadyIrreversible\b[\s\S]*?\}\)/,
    "and that exact derived value must be the one the policy sees",
  );
});

test("the refusal happens BEFORE the claim, so no RPC is issued for an unready new job", () => {
  const body = executeDeletionSource();
  const decisionAt = body.indexOf("decideErasureAuthority(");
  const refusalAt = body.indexOf('refuse_infrastructure_unready');
  const claimAt = body.indexOf("await claimExecutor(");
  assert.ok(decisionAt > -1 && refusalAt > -1 && claimAt > -1);
  assert.ok(decisionAt < claimAt, "the decision must be taken before the claim");
  assert.ok(refusalAt < claimAt, "and the refusal must return before the claim RPC is reached");
});

test("the refusal is bounded and retryable, not a generic failure", () => {
  const body = executeDeletionSource();
  const idx = body.indexOf("refuse_infrastructure_unready");
  const window = body.slice(idx, idx + 400);
  assert.match(window, /outcome:\s*"retryable"/, "the deployment can be fixed and the job resumed");
  assert.match(window, /errorCode:\s*erasureAuthority\.reason/, "and the reason must be the bounded one");
});

// ── the claim layer must NOT carry a contradictory policy ───────────────────

test("claimDeletionExecutor contains no unconditional schema-readiness refusal", () => {
  const start = EXECUTOR.indexOf("export async function claimDeletionExecutor(");
  assert.notEqual(start, -1);
  const next = EXECUTOR.indexOf("\nexport ", start + 1);
  const body = EXECUTOR.slice(start, next === -1 ? undefined : next);

  assert.doesNotMatch(
    body,
    /if\s*\(\s*!\s*accountErasureAuthoritySchemaReady\(\)\s*\)/,
    "this layer does not know the resume state, so a refusal here also refuses an " +
      "already-irreversible resume and strands a half-erased account",
  );
  assert.doesNotMatch(
    body,
    /account_erasure_authority_schema_unready/,
    "the bounded reason belongs to the layer that owns the policy",
  );
});

// ── and the weak path stays unreachable ─────────────────────────────────────

test("no caller anywhere invokes the owner-only erasure RPC", () => {
  for (const [name, source] of [
    ["orchestrator", ORCHESTRATOR],
    ["executor", EXECUTOR],
  ] as const) {
    const calls = [...source.matchAll(/yorisou_account_deletion_erase_database[a-z_]*/g)].map((m) => m[0]);
    for (const call of calls) {
      assert.ok(
        call === "yorisou_account_deletion_erase_database",
        `${name} names ${call}; only the strong entry point may be called`,
      );
    }
  }
  // And the one call site passes the full authority rather than an owner alone.
  const idx = ORCHESTRATOR.indexOf('rpc("yorisou_account_deletion_erase_database"');
  assert.notEqual(idx, -1, "the strong entry point must be the call site");
  const args = ORCHESTRATOR.slice(idx, idx + 400);
  for (const arg of ["p_job_id", "p_owner_account_id", "p_executor_token_hash", "p_executor_generation"]) {
    assert.match(args, new RegExp(arg), `the erasure call must pass ${arg}`);
  }
});

// ── the decision table the runtime now depends on ──────────────────────────

test("an already-irreversible job resumes even while the schema flag is unset", () => {
  assert.deepEqual(
    decideErasureAuthority({ executorEnabled: true, schemaReady: false, alreadyIrreversible: true }),
    { mode: "strong_erasure" },
    "refusing here would abandon a partially executed deletion",
  );
});

test("a new job with the flag unset is refused, and the executor-disabled case is unchanged", () => {
  assert.equal(
    decideErasureAuthority({ executorEnabled: true, schemaReady: false, alreadyIrreversible: false }).mode,
    "refuse_infrastructure_unready",
  );
  assert.equal(
    decideErasureAuthority({ executorEnabled: false, schemaReady: false }).mode,
    "executor_disabled",
  );
});
