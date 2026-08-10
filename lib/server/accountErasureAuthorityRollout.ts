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

export type ErasureAuthorityUnreadyReason =
  /** The operator has not attested that the post-P111 contract is deployed. */
  | "account_erasure_authority_schema_unready"
  /**
   * The operator HAS attested it, but the deployment cannot actually invoke the strong entry point
   * right now. A flag is a belief; this is a measurement. See por1ErasureTransportReadiness.
   */
  | "account_erasure_transport_unready";

export type ErasureAuthorityDecision =
  /**
   * The executor capability is off AND the job has not crossed the irreversible boundary. Refuse
   * BEFORE claiming: opening a job nothing will advance is how an account gets locked out with its
   * data intact, which is exactly what the 2026-08-10 incident did to two people.
   */
  | { mode: "executor_disabled" }
  /**
   * The executor is on but the deployment cannot satisfy the only authorized erasure interface.
   * Refuse BEFORE beginning a new irreversible deletion, and say why in bounded terms.
   */
  | { mode: "refuse_infrastructure_unready"; reason: ErasureAuthorityUnreadyReason }
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
  /**
   * The measured transport answer. `undefined` means "not probed" — the caller may legitimately skip
   * the probe for a job that has already crossed, where the answer could not change the decision.
   * Only an explicit `false` refuses.
   */
  transportReady?: boolean;
}): ErasureAuthorityDecision {
  // ── ALREADY IRREVERSIBLE COMES FIRST, AND OUTRANKS EVERYTHING ───────────────
  //
  // A job past the point of no return has had its sessions revoked and its mutation gate closed. Its
  // owner is already locked out. Refusing it does not protect anyone — it strands them, with their
  // data still present and no way to finish. That is precisely the state the 2026-08-10 incident
  // left two accounts in.
  //
  // So resume outranks BOTH the capability switch and every readiness fact. This is what lets the
  // operator recovery tool finish those jobs while public deletion intake stays disabled, and it is
  // stated here rather than emerging from a fall-through — the previous version returned
  // `executor_disabled` for this case and `executeDeletion` did not handle that mode at all, so an
  // executor-off resume fell through and claimed anyway. Nothing about that was written down.
  //
  // It is not a bypass: the resume still presents the exact job, token and generation, and the SQL
  // revalidates all of it. An unready deployment simply fails that job's step as retryable and
  // leaves the cursor, manifest and `irreversible_started_at` intact.
  if (input.alreadyIrreversible) return { mode: "strong_erasure" };

  // ── EVERYTHING BELOW IS A JOB THAT HAS NOT CROSSED ─────────────────────────
  if (!input.executorEnabled) return { mode: "executor_disabled" };

  if (!input.schemaReady) {
    return { mode: "refuse_infrastructure_unready", reason: "account_erasure_authority_schema_unready" };
  }

  // The flag says the contract is deployed; the probe says whether we can reach it. Only an explicit
  // negative refuses, so a caller that did not probe is not punished for it.
  if (input.transportReady === false) {
    return { mode: "refuse_infrastructure_unready", reason: "account_erasure_transport_unready" };
  }

  return { mode: "strong_erasure" };
}
