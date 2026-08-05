// POR-1 M1-B — the promotion plan: which promoted object belongs to which Production migration.
//
// This is the one hand-authored input to the compiler, and it is deliberately small: a grouping and
// a set of reviewed decisions. Everything else — DDL, signatures, grants, ordering within a group —
// is derived from the live catalogue so it cannot drift from what was actually proven.
//
// The grouping is by DOMAIN, and the domain order is by DEPENDENCY. Deletion comes last because it
// reaches into every other family; the contract assertion comes after that because it checks them
// all. The compiler verifies this claim against the real reference graph and refuses to emit if a
// migration would reference something a later migration creates.

/** Domain groups, in the order they must be applied. */
export const GROUPS = [
  {
    id: "P1",
    slug: "por1_canonical_assessment_and_interpretation",
    title: "Canonical assessment attempts, results and interpretation responses",
    tables: ["yorisou_assessment_attempts", "yorisou_assessment_results", "yorisou_interpretation_responses"],
    functionPrefixes: [
      "yorisou_attempt_",
      "yorisou_assessment_result_",
      "yorisou_interpretation_",
      "yorisou_jsonb_object_length",
    ],
  },
  {
    id: "P2",
    slug: "por1_canonical_recommendations",
    title: "Canonical recommendation sets, items and actions",
    tables: [
      "yorisou_canonical_recommendation_sets",
      "yorisou_canonical_recommendation_items",
      "yorisou_canonical_recommendation_actions",
    ],
    functionPrefixes: ["yorisou_canonical_recommendation_"],
  },
  {
    id: "P3",
    slug: "por1_canonical_identity_and_provisioning",
    title: "Canonical identity links and the identity provisioning saga",
    tables: ["yorisou_canonical_identity_links", "yorisou_identity_provisioning_sagas"],
    functionPrefixes: ["yorisou_identity_link_", "yorisou_identity_links_", "yorisou_provisioning_"],
  },
  {
    id: "P4",
    slug: "por1_canonical_line_activity",
    title: "Canonical LINE subjects, events and the erasure barrier",
    tables: ["yorisou_canonical_line_subjects", "yorisou_canonical_line_events"],
    functionPrefixes: [
      "yorisou_line_activity_",
      "yorisou_line_event_",
      "yorisou_line_events_",
      "yorisou_line_recent_",
      "yorisou_line_subject_",
    ],
  },
  {
    id: "P5",
    slug: "por1_account_mutation_fence",
    title: "Account mutation gates and leases",
    tables: ["yorisou_account_mutation_gates", "yorisou_account_mutation_leases"],
    functionPrefixes: ["yorisou_account_mutation_"],
  },
  {
    id: "P6",
    slug: "por1_account_deletion_lifecycle",
    title: "Account deletion jobs, frozen manifests, audit and the Production family erasure plan",
    tables: [
      "yorisou_account_deletion_jobs",
      "yorisou_account_deletion_manifests",
      "yorisou_account_deletion_audit",
    ],
    functionPrefixes: ["yorisou_account_deletion_"],
  },
  {
    // Populated by the compiler, not by hand. Some domains genuinely call into each other —
    // account_mutation_begin consults the deletion jobs table, assessment_result_erase clears
    // canonical recommendations — and PostgreSQL resolves relation names when a plpgsql body is
    // COMPILED, not when it runs. So a function whose domain comes before the domain it reads
    // cannot be created in its own migration. Those functions land here, after every table exists.
    id: "P7",
    slug: "por1_cross_domain_functions",
    title: "Cross-domain functions — created after every promoted table exists",
    tables: [],
    functionPrefixes: [],
  },
  {
    id: "P8",
    slug: "por1_promotion_contract_assertion",
    title: "Whole-contract assertion — refuses the release rather than discovering a gap later",
    tables: [],
    functionPrefixes: [],
  },
];

/**
 * Which group owns each promoted sequence.
 *
 * Stated rather than derived: `yorisou_recommendation_actions_seq` feeds
 * `yorisou_canonical_recommendation_actions`, and no naming rule connects those two. A heuristic
 * that guessed right for one and wrong for the next would be worse than a two-line table.
 */
export const SEQUENCE_GROUP = {
  yorisou_interpretation_responses_seq: "P1",
  yorisou_recommendation_actions_seq: "P2",
};

/**
 * The one function that must NOT be granted to service_role.
 *
 * 202607310002 states the reason: it takes a row lock and returns a locked row, so it is a building
 * block for the erasure barrier, not an entry point. Recorded here so the compiler emits the
 * exception deliberately rather than a blanket grant quietly undoing it.
 */
export const NO_SERVICE_ROLE_EXECUTE = new Set(["yorisou_line_subject_lock"]);

/**
 * Production families named by the deletion plan that do not exist in Preview.
 *
 * These are why the promotion set cannot be a mechanical copy of the Preview catalogue. Each is
 * guarded by `to_regclass` in the deletion functions, so on Preview the guard skips them and no
 * green Preview run has ever exercised them. The compiler asserts each is still referenced by the
 * emitted deletion bodies; M4 has to prove they are actually erased.
 */
export const PRODUCTION_ONLY_DELETION_FAMILIES = [
  "yorisou_private_recommendations",
  "yorisou_private_memory_items",
  "yorisou_private_check_in_plans",
  "yorisou_ai_reflections",
  "yorisou_ai_runs",
  "yorisou_test_results",
];

/** Roles that must never hold EXECUTE on a promoted function. */
export const FORBIDDEN_EXECUTE_ROLES = ["anon", "authenticated"];

export function groupForTable(name) {
  return GROUPS.find((g) => g.tables.includes(name));
}

export function groupForFunction(name) {
  // Longest matching prefix wins, so `yorisou_identity_links_` cannot be shadowed by
  // `yorisou_identity_link_`.
  let best = null;
  let bestLength = -1;
  for (const group of GROUPS) {
    for (const prefix of group.functionPrefixes) {
      if (name.startsWith(prefix) && prefix.length > bestLength) {
        best = group;
        bestLength = prefix.length;
      }
    }
  }
  return best;
}
