// POR-1 — the mutation fence's ROLLOUT RULE, as a pure function.
//
// The fence RPCs live in a Preview-only migration. Requiring a lease unconditionally broke
// authenticated login on the current Production-lineage CI databases, where those RPCs do not
// exist: YV-1 and DCI-1 went red, and downstream 422s became 401s.
//
// That is a rollout-ordering problem, and the fix must not be "treat a failed RPC as permission to
// write". Readiness (does the schema exist?) and activation (may deletion run?) are separate facts.
//
// No `server-only`: the rule is pure, and the permanent tests exercise this module rather than a
// paraphrase of it.

export type FenceMode = "legacy_no_schema" | "fenced" | "fail_closed";

/**
 * `legacy_no_schema` — the deployment predates the fence migration AND nothing can be deleting, so
 *   ordinary writes keep their exact previous behaviour and make no RPC call. A call that cannot
 *   succeed must not be attempted just to be caught.
 * `fail_closed`      — deletion can run but the fence cannot. Refusing the write is the only safe
 *   answer; this is the combination that must never proceed "because the RPC was missing".
 * `fenced`           — the schema is deployed, so leases are mandatory and every failure is a
 *   denial. Note this holds even with the deletion executor OFF: that switch is an emergency stop
 *   for DELETION, and if it also disabled the fence it would reopen ordinary writes against a
 *   deletion already in flight.
 *
 * Readiness is a deployment FACT stated by the deployment. It is never inferred from a runtime
 * error — a missing RPC, a schema-cache miss, a timeout or a 5xx are not evidence of an old schema.
 */
export function resolveFenceMode(input: {
  schemaReady: boolean;
  deletionExecutorEnabled: boolean;
}): FenceMode {
  if (input.schemaReady) return "fenced";
  return input.deletionExecutorEnabled ? "fail_closed" : "legacy_no_schema";
}
