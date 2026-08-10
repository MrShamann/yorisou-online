// POR-1 — candidate selection for the Production deletion-incident recovery, as a pure function.
//
// The 2026-08-10 Production promotion left two synthetic `.invalid` accounts stranded: their
// deletions crossed the irreversible boundary, revoked their sessions, closed their mutation gate —
// and then failed at `database_erasure`, leaving them locked out with their data intact and no
// product path to finish. This module decides, and ONLY decides, which jobs the operator recovery
// tool may hand to `executeDeletion()`.
//
// It is pure so the rule can be enumerated by tests rather than discovered in Production. The script
// that uses it owns the guards and the I/O; this owns the judgement.
//
// THE RULE IS A CONJUNCTION, NOT A HEURISTIC. Every condition must hold. Anything that fails even
// one is reported and left strictly alone — a recovery tool that guesses is a deletion tool with
// extra steps.

/** The reserved incident domain. `.invalid` can never be routed, so it can never be a real person. */
const INCIDENT_EMAIL_DOMAIN_SUFFIX = ".invalid";

/** The package marker in the LOCAL PART, so an unrelated `.invalid` address is not swept up. */
const INCIDENT_LOCAL_PART_MARKER = /^por1-[a-z0-9]+-[a-z0-9-]+$/;

export type IncidentCandidateRow = {
  /** Opaque to this module; used only for reporting. */
  jobFingerprint: string;
  state: string | null;
  executionCursor: string | null;
  irreversible: boolean;
  manifestPresent: boolean;
  ownerNamed: boolean;
  /** A live executor lease means another writer holds it; we must not race. */
  executorLeaseLive: boolean;
  /** The owner's email, if the operator could resolve it. Null means unproven, never "assume yes". */
  ownerEmail: string | null;
};

export type IncidentCandidateVerdict =
  | { action: "resume"; family: "failed_retryable_post_irreversible" }
  | { action: "revisit"; reason: "executor_lease_live" }
  | {
      action: "refuse";
      reason:
        | "not_failed_retryable"
        | "not_irreversible"
        | "cursor_not_database_erasure"
        | "manifest_missing"
        | "owner_not_named"
        | "synthetic_classification_unproven";
    };

/** Is this address one of the bounded incident fixtures? Conjunction: domain AND local-part shape. */
export function isIncidentSyntheticEmail(email: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const at = normalized.lastIndexOf("@");
  if (at <= 0) return false;
  const localPart = normalized.slice(0, at);
  const domain = normalized.slice(at + 1);
  if (!domain.endsWith(INCIDENT_EMAIL_DOMAIN_SUFFIX)) return false;
  return INCIDENT_LOCAL_PART_MARKER.test(localPart);
}

/**
 * Classify one candidate.
 *
 * Order is deliberate. The structural facts are checked before the synthetic classification, so an
 * unrelated real job is refused on its own shape and its address is never even consulted.
 */
export function classifyIncidentCandidate(row: IncidentCandidateRow): IncidentCandidateVerdict {
  if (row.state !== "failed_retryable") return { action: "refuse", reason: "not_failed_retryable" };
  if (!row.irreversible) return { action: "refuse", reason: "not_irreversible" };
  if (row.executionCursor !== "database_erasure") {
    return { action: "refuse", reason: "cursor_not_database_erasure" };
  }
  if (!row.manifestPresent) return { action: "refuse", reason: "manifest_missing" };
  if (!row.ownerNamed) return { action: "refuse", reason: "owner_not_named" };

  // A live lease means some other executor is driving this job right now. Not a refusal forever —
  // come back when it lapses — but absolutely not something to race.
  if (row.executorLeaseLive) return { action: "revisit", reason: "executor_lease_live" };

  // Proven, not assumed. An unresolvable address is UNPROVEN and therefore refused.
  if (!isIncidentSyntheticEmail(row.ownerEmail)) {
    return { action: "refuse", reason: "synthetic_classification_unproven" };
  }

  return { action: "resume", family: "failed_retryable_post_irreversible" };
}

export type IncidentSelection = {
  resumable: IncidentCandidateRow[];
  revisit: Array<{ row: IncidentCandidateRow; reason: string }>;
  refused: Array<{ row: IncidentCandidateRow; reason: string }>;
  /** True only when the population is exactly the reviewed set and nothing unknown appeared. */
  safeToExecute: boolean;
  blockReason: string | null;
};

/**
 * Select across the whole candidate population.
 *
 * FAIL CLOSED ON POPULATION DRIFT. The operator states a ceiling from a dry run they have just read.
 * If the resumable population is not exactly that number, or ANY candidate was refused for a reason
 * that means "I do not recognise this", nothing executes. The reviewed set and the executed set must
 * be the same set — otherwise the review meant nothing.
 */
export function selectIncidentCandidates(
  rows: IncidentCandidateRow[],
  options: { maxCandidates: number },
): IncidentSelection {
  const resumable: IncidentCandidateRow[] = [];
  const revisit: Array<{ row: IncidentCandidateRow; reason: string }> = [];
  const refused: Array<{ row: IncidentCandidateRow; reason: string }> = [];

  for (const row of rows) {
    const verdict = classifyIncidentCandidate(row);
    if (verdict.action === "resume") resumable.push(row);
    else if (verdict.action === "revisit") revisit.push({ row, reason: verdict.reason });
    else refused.push({ row, reason: verdict.reason });
  }

  const unknown = refused.filter((r) => r.reason === "synthetic_classification_unproven");

  let blockReason: string | null = null;
  if (unknown.length > 0) blockReason = "unknown_or_non_synthetic_candidate_present";
  else if (!Number.isInteger(options.maxCandidates) || options.maxCandidates < 0) {
    blockReason = "candidate_ceiling_required";
  } else if (resumable.length > options.maxCandidates) blockReason = "candidate_population_above_ceiling";
  else if (resumable.length !== options.maxCandidates) blockReason = "candidate_population_below_ceiling";

  return { resumable, revisit, refused, safeToExecute: blockReason === null, blockReason };
}
