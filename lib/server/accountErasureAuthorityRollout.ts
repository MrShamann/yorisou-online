// POR-1 — the ACCOUNT ERASURE AUTHORITY readiness rule, as a pure function.
//
// WHY THIS EXISTS.
//
// The exact-SHA hosted acceptance at 108c939 failed one test: the deletion route answered 500 with
// `deletion_failed`. The cause was not the application. The deployed code calls the four-argument,
// job- and claim-bound erasure entry point that 202608010110/111 establish, and the governed Preview
// database had only the owner-only `erase_database(text)` — those migrations are Production lineage
// and had never been applied there.
//
// The application had no way to know that. `/api/build-identity` reports four POR-1 schema-readiness
// facts, and NONE of them covers the erasure family, so all four could read `true` while the single
// RPC the irreversible stage depends on did not exist. The deployment discovered it mid-deletion, on
// a real person's account, and reported it as a generic 500.
//
// That is the failure this module exists to make impossible. Readiness is a deployment FACT stated
// by the deployment, never inferred from a runtime error: a missing function, a schema-cache miss, a
// timeout or a 5xx are not evidence about the schema, so none of them may be read as "ready" — and,
// just as importantly, none of them may be read as permission to fall back to the weak owner-only
// RPC. There is no fallback. The weak signature is an authority bypass by construction: it erases
// from an owner id alone, without the exact job, the executor token or the generation that 110 and
// 111 exist to require.
//
// Kept separate from the four POR-1 product capability controls on purpose. A capability says a
// feature is ON; readiness says a schema EXISTS. Merging them is how an operator ends up
// kill-switching a feature and silently disabling a safety property, or reading "ready" as "active".
//
// No `server-only`: the rule is pure, and the tests exercise this module rather than a paraphrase.

const SCHEMA_READY_ENV = "YORISOU_POR1_ACCOUNT_ERASURE_AUTHORITY_SCHEMA_READY";

/**
 * Does this deployment's database carry the post-P111 erasure authority contract —
 * `yorisou_account_deletion_erase_database(uuid, text, text, integer)` and the predicates it
 * depends on?
 *
 * Absent means NOT ready. A missing flag is never "probably fine": that reading is what turns a
 * rollout-ordering mistake into a 500 in the middle of an irreversible stage.
 */
export function accountErasureAuthoritySchemaReady(): boolean {
  return process.env[SCHEMA_READY_ENV] === "on";
}

export type ErasureAuthorityDecision =
  /** The executor capability is off. Nothing changes; the legacy path stays dormant as before. */
  | { mode: "executor_disabled" }
  /**
   * The executor is on but the database cannot satisfy the only authorized erasure interface.
   * Refuse BEFORE beginning a new irreversible deletion, and say why in bounded terms.
   */
  | { mode: "refuse_infrastructure_unready"; reason: "account_erasure_authority_schema_unready" }
  /** Proceed — and only ever through the four-argument, claim-bound entry point. */
  | { mode: "strong_erasure" };

/**
 * The decision, given the two facts that matter. Deliberately total and deliberately pure, so the
 * table below is the whole rule and the tests can enumerate it.
 *
 * `alreadyIrreversible` is the one subtlety: a job that has ALREADY crossed the irreversible
 * boundary must keep its governed resume semantics. Refusing to touch it would abandon a partially
 * executed deletion, which is worse than the unreadiness it is reacting to — the resume path still
 * requires the same authority, so an unready database simply fails that job's step and leaves it
 * resumable rather than orphaning it.
 */
export function decideErasureAuthority(input: {
  executorEnabled: boolean;
  schemaReady: boolean;
  alreadyIrreversible?: boolean;
}): ErasureAuthorityDecision {
  if (!input.executorEnabled) return { mode: "executor_disabled" };
  if (!input.schemaReady && !input.alreadyIrreversible) {
    return { mode: "refuse_infrastructure_unready", reason: "account_erasure_authority_schema_unready" };
  }
  return { mode: "strong_erasure" };
}
