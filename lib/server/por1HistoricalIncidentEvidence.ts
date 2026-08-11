// POR-1 — the historical Production deletion incident, pinned to immutable third-party records.
//
// WHY THIS FILE EXISTS, AND WHAT IT REPLACES.
//
// The first membership rule proved "synthetic" from an address pattern that survived only in a unit
// fixture. The second replaced it with persisted execution evidence, but let the OPERATOR declare the
// release-check window at the command line. An independent audit refused that, correctly: a window
// somebody types is not provenance. It narrows nothing an operator cannot widen, and combined with a
// behavioural "no real person deletes an account within five minutes" it let a look-alike account
// satisfy a rule that was supposed to identify ONE historical execution.
//
// So the window is no longer declared. It is DERIVED from records that already existed before this
// question was asked, that this repository cannot edit, and that a third party can check:
//
//   • GitHub — pull request 126, its merge commit, and the instant it merged.
//   • Vercel — the Production deployment that ACTIVATED the deletion capability, and the very next
//     Production deployment, each by its immutable deployment id and creation instant. Both carry the
//     same commit sha as the merge above, which is what ties the deployments to the promotion rather
//     than to each other.
//
// The execution window is the half-open-free interval between those two deployments. An operator can
// re-read every value here against GitHub and Vercel; an operator cannot choose them.
//
// WHAT THIS IS NOT. It is not a claim that anything inside the window is synthetic — it bounds the
// only interval in which the historical release check could have run, and membership still requires
// every other clause in `por1SyntheticMembershipEvidence`. It is a NECESSARY condition contributed by
// immutable provenance, not a sufficient one.
//
// NO IDENTITY LIVES HERE. No account id, no job id, no address, no digest, no fingerprint. Everything
// below is public release metadata.

/** Bumped whenever any pinned value changes. Candidates are matched against a stated version. */
export const POR1_INCIDENT_EVIDENCE_VERSION = "por1-incident-evidence-v1";

export type HistoricalIncidentEvidence = {
  /** Must equal `POR1_INCIDENT_EVIDENCE_VERSION`; a candidate states which contract it was judged by. */
  version: string;

  /** GitHub — the promotion that put the deletion capability into Production. */
  promotionPullRequest: number;
  promotionMergeCommitSha: string;
  promotionMergedAt: string;

  /** The commit both pinned deployments served. Ties the deployments to the promotion. */
  deployedCommitSha: string;

  /** Vercel — the Production deployment that activated the capability. Window opens here. */
  activationDeploymentId: string;
  activationDeploymentAt: string;

  /** Vercel — the next Production deployment. Window closes here. */
  nextDeploymentId: string;
  nextDeploymentAt: string;

  /** The governed Production database this incident belongs to. */
  productionProjectRef: string;

  /**
   * How many stranded jobs this incident actually left behind.
   *
   * PINNED, not counted at runtime and not retyped by an operator. The window bounds forty-eight
   * minutes of LIVE Production, so "inside the window" is necessary but not sufficient: if anything
   * else in there ever qualifies, the population stops being this number and the whole run refuses
   * rather than quietly growing by one.
   */
  expectedStrandedJobCount: number;
};

/**
 * The 2026-08-10 Production deletion incident.
 *
 * Every value is transcribed from a record neither this repository nor its operator can rewrite:
 *
 *   gh pr view 126 --json mergedAt,mergeCommit
 *     -> mergedAt 2026-08-10T03:16:35Z, mergeCommit ece887a4…
 *   GET /v6/deployments?target=production
 *     -> dpl_X6cEvoWZUkXTdhcgKPqspCVuaqcT  2026-08-10T03:32:53.983Z  sha ece887a4…  (capability activation)
 *     -> dpl_86EeJHhnDmiUMk16xAvwtBJgYAaG  2026-08-10T04:20:39.905Z  sha ece887a4…  (next Production deploy)
 *
 * The deployment at 03:16:41.959Z is the same merge shipped with the capability still OFF, which is
 * why the window opens at the ACTIVATION deployment and not at the merge: before 03:32:53.983Z the
 * product could not open a deletion job at all.
 */
export const POR1_PRODUCTION_DELETION_INCIDENT: HistoricalIncidentEvidence = {
  version: POR1_INCIDENT_EVIDENCE_VERSION,
  promotionPullRequest: 126,
  promotionMergeCommitSha: "ece887a448e56b5b9b145a179de8eb5b5260cfef",
  promotionMergedAt: "2026-08-10T03:16:35.000Z",
  deployedCommitSha: "ece887a448e56b5b9b145a179de8eb5b5260cfef",
  activationDeploymentId: "dpl_X6cEvoWZUkXTdhcgKPqspCVuaqcT",
  activationDeploymentAt: "2026-08-10T03:32:53.983Z",
  nextDeploymentId: "dpl_86EeJHhnDmiUMk16xAvwtBJgYAaG",
  nextDeploymentAt: "2026-08-10T04:20:39.905Z",
  productionProjectRef: "krxizslnksorwhepyijs",
  expectedStrandedJobCount: 2,
};

/**
 * The widest interval any pinned contract may describe.
 *
 * This bounds the CONTRACT, not an operator input — nobody can pass a window any more. It exists so
 * that a future edit to the pinned values cannot quietly widen the incident into a general amnesty
 * without tripping a test.
 */
export const INCIDENT_WINDOW_MAX_SPAN_MS = 6 * 60 * 60 * 1000;

export type IncidentExecutionWindow = { startedAt: string; endedAt: string };

export type IncidentEvidenceDefect =
  | "version_mismatch"
  | "promotion_merge_sha_malformed"
  | "deployed_commit_sha_malformed"
  | "deployed_commit_not_promotion_merge"
  | "activation_deployment_id_malformed"
  | "next_deployment_id_malformed"
  | "deployment_ids_identical"
  | "instants_unparseable"
  | "activation_precedes_promotion_merge"
  | "next_deployment_not_after_activation"
  | "window_span_above_bound"
  | "production_project_ref_malformed"
  | "expected_stranded_job_count_implausible";

const FULL_SHA = /^[0-9a-f]{40}$/;
const DEPLOYMENT_ID = /^dpl_[A-Za-z0-9]{16,}$/;
const SUPABASE_PROJECT_REF = /^[a-z]{20}$/;

/**
 * Parse an instant, requiring an explicit zone.
 *
 * `Date.parse` reads a timestamp with no designator as LOCAL time, so the same string means different
 * moments on different machines. A window whose meaning depends on the operator's timezone is exactly
 * the kind of movable boundary this contract exists to eliminate, so a naive timestamp is refused
 * rather than interpreted.
 */
const ZONED = /(?:Z|[+-]\d{2}:?\d{2})$/;

function instant(value: string): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  if (!ZONED.test(value.trim())) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Check a pinned contract against its own invariants.
 *
 * Returns every defect rather than the first, because a contract is reviewed by a human reading this
 * list — stopping at the first problem hides the rest of them.
 */
export function validateIncidentEvidence(
  evidence: HistoricalIncidentEvidence,
): IncidentEvidenceDefect[] {
  const defects: IncidentEvidenceDefect[] = [];

  if (evidence.version !== POR1_INCIDENT_EVIDENCE_VERSION) defects.push("version_mismatch");
  if (!FULL_SHA.test(evidence.promotionMergeCommitSha)) defects.push("promotion_merge_sha_malformed");
  if (!FULL_SHA.test(evidence.deployedCommitSha)) defects.push("deployed_commit_sha_malformed");
  else if (evidence.deployedCommitSha !== evidence.promotionMergeCommitSha) {
    // Without this the two deployments could be any two deployments; this is what makes them the
    // promotion's deployments.
    defects.push("deployed_commit_not_promotion_merge");
  }
  if (!DEPLOYMENT_ID.test(evidence.activationDeploymentId)) {
    defects.push("activation_deployment_id_malformed");
  }
  if (!DEPLOYMENT_ID.test(evidence.nextDeploymentId)) defects.push("next_deployment_id_malformed");
  if (evidence.activationDeploymentId === evidence.nextDeploymentId) {
    defects.push("deployment_ids_identical");
  }
  if (!SUPABASE_PROJECT_REF.test(evidence.productionProjectRef)) {
    defects.push("production_project_ref_malformed");
  }
  // A recovery that could be pointed at an arbitrary number of accounts is not a recovery. The
  // upper bound is deliberately tight: this incident is small, and a contract edit that made it
  // large should have to justify itself against a test.
  if (
    !Number.isInteger(evidence.expectedStrandedJobCount) ||
    evidence.expectedStrandedJobCount < 1 ||
    evidence.expectedStrandedJobCount > 10
  ) {
    defects.push("expected_stranded_job_count_implausible");
  }

  const merged = instant(evidence.promotionMergedAt);
  const activation = instant(evidence.activationDeploymentAt);
  const next = instant(evidence.nextDeploymentAt);
  if (merged === null || activation === null || next === null) {
    defects.push("instants_unparseable");
    return defects;
  }
  if (activation < merged) defects.push("activation_precedes_promotion_merge");
  if (next <= activation) defects.push("next_deployment_not_after_activation");
  if (next - activation > INCIDENT_WINDOW_MAX_SPAN_MS) defects.push("window_span_above_bound");

  return defects;
}

/**
 * The interval in which the historical release check could have executed.
 *
 * DERIVED from the two pinned deployments. There is no code path that accepts a window from anywhere
 * else — that absence is the repair.
 */
export function incidentExecutionWindow(
  evidence: HistoricalIncidentEvidence = POR1_PRODUCTION_DELETION_INCIDENT,
): IncidentExecutionWindow {
  return { startedAt: evidence.activationDeploymentAt, endedAt: evidence.nextDeploymentAt };
}

/**
 * Reconcile a window an operator typed with the pinned one.
 *
 * The arguments survive only so a dry run can be read back and checked by eye. They may CONFIRM the
 * contract; they may never redefine it, so anything other than an exact instant match is a refusal.
 */
export function declaredWindowMatchesContract(
  declared: Partial<IncidentExecutionWindow> | null,
  evidence: HistoricalIncidentEvidence = POR1_PRODUCTION_DELETION_INCIDENT,
): boolean {
  if (!declared || !declared.startedAt || !declared.endedAt) return false;
  const pinned = incidentExecutionWindow(evidence);
  const a = instant(declared.startedAt);
  const b = instant(declared.endedAt);
  if (a === null || b === null) return false;
  return a === Date.parse(pinned.startedAt) && b === Date.parse(pinned.endedAt);
}
