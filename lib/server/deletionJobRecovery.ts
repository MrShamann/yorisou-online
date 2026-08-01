// POR-1 WS-G8 — recovering a deletion whose ACCOUNT is already gone.
//
// THE DEFECT THIS CLOSES.
//
// The cleanup tool derived every candidate from surviving accounts. That is sound right up to the
// moment `identity_erasure` removes the account object — after which a job that then fails leaves
// satellites behind and NOTHING can enumerate them, because the thing that named them is gone. The
// tool reported "nothing to clean" while the store still held an ACTIVE identity link, three
// owner-linked sessions, two LINE lookups, a UserProfile and two AuthIdentities, and the database
// held 12 `failed_retryable` jobs and 13 jobs still naming an owner.
//
// "The second run removed nothing" was true, and it meant nothing.
//
// THE AUTHORITY WAS ALWAYS THERE. The durable job outlives the account by design, and the manifest
// is FROZEN before the crossing precisely so the late stages have something to work from once there
// is nothing left to enumerate. `executeDeletion` already resumes from the cursor against that
// manifest and never re-derives it from surviving objects. So recovery needs no new machinery — it
// needs the job to be a CANDIDATE SOURCE in its own right, not a detail of an account that no
// longer exists.
//
// Pure and dependency-free: the permanent tests exercise this decision rather than a restatement.

/** Stages at or past which the account object may legitimately already be gone. */
const POST_ACCOUNT_ERASURE_STAGES = new Set(["identity_erasure", "verifying", "finalizing", "completed"]);

export type DeletionJobFacts = {
  /** Null once finalization de-identifies the job — which is the SUCCESS shape, not a fault. */
  ownerAccountId: string | null;
  state: string;
  cursor: string | null;
  /** `irreversible_started_at is not null` — the recorded fact, never inferred from the state. */
  irreversible: boolean;
  hasManifest: boolean;
  /** A live executor claim held by someone else right now. */
  executorHeld: boolean;
};

export type DeletionJobClass =
  | "COMPLETED_DEIDENTIFIED"
  | "COMPLETED_BUT_NOT_DEIDENTIFIED"
  | "IN_PROGRESS_VALID_CLAIM"
  | "FAILED_RETRYABLE_PRE_IRREVERSIBLE"
  | "FAILED_RETRYABLE_POST_IRREVERSIBLE"
  | "FAILED_TERMINAL"
  | "CANCELLED_PRE_IRREVERSIBLE"
  | "CANCELLED_INVALID_AFTER_IRREVERSIBLE"
  | "OWNER_NAMED_WITH_FROZEN_MANIFEST"
  | "OWNER_NAMED_WITHOUT_FROZEN_MANIFEST"
  | "UNCLASSIFIED_CORRUPT";

export type DeletionJobDisposition = {
  classification: DeletionJobClass;
  /** May cleanup drive this job through the governed saga? */
  resumable: boolean;
  /** Does this job still need work before the Preview is clean? */
  residue: boolean;
  /** Refuse automation and surface it — never silently skipped. */
  needsHuman: boolean;
  /**
   * Someone else's work, in flight, right now.
   *
   * A fourth outcome that is genuinely none of clean / resumable / escalated: contending with a live
   * claim is the second-executor defect this package already fixed, and escalating it to a human
   * would be noise for a job that is progressing perfectly well. It is unfinished, so it still counts
   * as residue — cleanup revisits it after a bounded interval instead of touching it.
   */
  revisit: boolean;
};

/**
 * Classify one durable deletion job.
 *
 * The ordering is the argument. Terminal and corrupt states are decided BEFORE anything that could
 * make them look resumable, because the failure that matters here is a cleanup tool talking itself
 * into re-running a destruction that already failed for a reason.
 */
export function classifyRecoverableDeletionJob(job: DeletionJobFacts): DeletionJobDisposition {
  const { ownerAccountId, state, irreversible, hasManifest, executorHeld } = job;

  // A completed job that still names someone has not finished: de-identification is the last act of
  // the saga, and skipping it would leave the person named in an audit record forever.
  if (state === "completed") {
    return ownerAccountId
      ? { classification: "COMPLETED_BUT_NOT_DEIDENTIFIED", resumable: true, residue: true, needsHuman: false, revisit: false }
      : { classification: "COMPLETED_DEIDENTIFIED", resumable: false, residue: false, needsHuman: false, revisit: false };
  }

  // NOT COMPLETED AND NOT ADDRESSABLE. Every governed entry point — `executeDeletion`,
  // `readResumeState`, `readDeletionManifest` — is keyed by the owner account id. A job that is not
  // completed and no longer names one cannot be resumed by anything, whatever its state says, so it
  // is surfaced rather than left to look resumable.
  if (!ownerAccountId) {
    return { classification: "UNCLASSIFIED_CORRUPT", resumable: false, residue: true, needsHuman: true, revisit: false };
  }

  // Terminal by decision, not by accident. Never auto-converted into success.
  if (state === "failed_terminal") {
    return { classification: "FAILED_TERMINAL", resumable: false, residue: true, needsHuman: true, revisit: false };
  }

  // A cancellation after the crossing is a contradiction: something was already destroyed, so the
  // record claims an outcome that cannot be true.
  if (state === "cancelled") {
    return irreversible
      ? { classification: "CANCELLED_INVALID_AFTER_IRREVERSIBLE", resumable: false, residue: true, needsHuman: true, revisit: false }
      : { classification: "CANCELLED_PRE_IRREVERSIBLE", resumable: false, residue: false, needsHuman: false, revisit: false };
  }

  // Someone else is driving. Contending would be the second-executor bug this package already fixed.
  if (executorHeld) {
    return { classification: "IN_PROGRESS_VALID_CLAIM", resumable: false, residue: true, needsHuman: false, revisit: true };
  }

  // PAST THE CROSSING WITHOUT A MANIFEST is the one shape automation must not touch. The manifest is
  // the only record of what was owned, it is frozen before anything is destroyed, and its absence
  // afterwards means the evidence of what to finish erasing does not exist.
  if (irreversible && !hasManifest) {
    return { classification: "OWNER_NAMED_WITHOUT_FROZEN_MANIFEST", resumable: false, residue: true, needsHuman: true, revisit: false };
  }

  if (state === "failed_retryable") {
    return irreversible
      ? { classification: "FAILED_RETRYABLE_POST_IRREVERSIBLE", resumable: true, residue: true, needsHuman: false, revisit: false }
      : { classification: "FAILED_RETRYABLE_PRE_IRREVERSIBLE", resumable: true, residue: true, needsHuman: false, revisit: false };
  }

  // Any other live state that still names an owner is unfinished work the saga can carry forward,
  // provided the manifest it will need is there.
  if (ownerAccountId) {
    return hasManifest || !irreversible
      ? { classification: "OWNER_NAMED_WITH_FROZEN_MANIFEST", resumable: true, residue: true, needsHuman: false, revisit: false }
      : { classification: "OWNER_NAMED_WITHOUT_FROZEN_MANIFEST", resumable: false, residue: true, needsHuman: true, revisit: false };
  }

  // Unreachable in practice — every shape above is decided — but a classifier that falls through to
  // "resumable" would be the dangerous default, so the fallthrough escalates instead.
  return { classification: "UNCLASSIFIED_CORRUPT", resumable: false, residue: true, needsHuman: true, revisit: false };
}

/**
 * Does this stage imply the account object may already be gone?
 *
 * Used to explain, in cleanup output, why a resumable job has no account — so an operator reading
 * "resuming a deletion for an account that does not exist" sees that it is the expected shape rather
 * than a contradiction.
 */
export function accountAbsenceIsExpected(cursor: string | null): boolean {
  return cursor !== null && POST_ACCOUNT_ERASURE_STAGES.has(cursor);
}
