import "server-only";

// POR-1 — THE SINGLE-WRITER DELETION EXECUTOR, application side.
//
// The saga was durable and resumable long before this file existed, and it was still not safe,
// because nothing made it SINGLE-WRITER. Two confirm/retry requests arriving together each read the
// state, each concluded it was the only run, and each drove the same job. The state machine rejects
// an ILLEGAL transition; it has no objection to the same LEGAL one happening twice.
//
// So driving a deletion now requires a CLAIM: a bounded lease on the job itself, identified by a
// token whose hash is stored and whose raw value never leaves this process. Every step presents the
// token, the generation, and the cursor value it EXPECTS to be executing. The database validates all
// of that in one statement under a row lock, so the second run is refused rather than proceeding
// alongside the first.
//
// The cursor has exactly one meaning here and everywhere:
//
//     execution_cursor = THE NEXT STAGE THAT MUST EXECUTE
//
// A retryable failure preserves it. A retry executes it directly. Nothing infers a resume point from
// `failed_retryable`, which is what previously sent a run that failed at verification back through
// session revocation and the account hold.

import { createHash, randomBytes } from "node:crypto";

import { accountErasureAuthoritySchemaReady } from "./accountErasureAuthorityRollout";
import { rpc } from "./assessmentAttemptStore";

/** The nine stages, in the only order they may occur. */
export const DELETION_STAGES = [
  "mutation_draining",
  "lock_marker",
  "session_revocation",
  "database_erasure",
  "storage_erasure",
  "identity_erasure",
  "verifying",
  "finalizing",
  "completed",
] as const;

export type DeletionStage = (typeof DELETION_STAGES)[number];

/** The stage at which the account stops being writable and starts being destroyed. */
export const IRREVERSIBLE_STAGE: DeletionStage = "lock_marker";

export function nextStage(stage: DeletionStage): DeletionStage | null {
  const index = DELETION_STAGES.indexOf(stage);
  if (index < 0 || index >= DELETION_STAGES.length - 1) return null;
  return DELETION_STAGES[index + 1];
}

export function isAtOrPastIrreversible(stage: DeletionStage | null): boolean {
  if (!stage) return false;
  return DELETION_STAGES.indexOf(stage) >= DELETION_STAGES.indexOf(IRREVERSIBLE_STAGE);
}

/**
 * A claim on one deletion job.
 *
 * The raw token stays in memory for the life of the request; only its hash is stored. A leaked row
 * therefore cannot be replayed as a claim, which matters because the claim is the only thing
 * standing between one executor and two.
 */
export type ExecutorClaim = {
  readonly accountId: string;
  /**
   * The EXACT job this executor claimed.
   *
   * Erasure is bound to this id, not re-derived from the owner. Rediscovering "the job for this
   * account" at erasure time would let a different job — a later one, a cancelled one, one whose
   * claim has lapsed — be the thing that actually runs, which is authority by coincidence.
   */
  readonly jobId: string;
  readonly tokenHash: string;
  readonly generation: number;
  cursor: DeletionStage;
  readonly irreversible: boolean;
};

export type ClaimResult =
  | { claimed: true; claim: ExecutorClaim }
  | { claimed: false; reason: string; cursor: DeletionStage | null };

function hashToken(raw: string): string {
  return createHash("sha256").update(`por1-deletion-executor:${raw}`).digest("hex");
}

function unwrap<T>(result: T | T[]): T | undefined {
  return Array.isArray(result) ? result[0] : result;
}

/**
 * Take the claim, or be told who has it.
 *
 * A refusal is a normal outcome, not an error: it means another worker is already driving this
 * deletion, which is exactly what should happen when a person double-clicks confirm. The caller
 * reports "in progress" rather than starting a second run.
 */
export async function claimDeletionExecutor(
  accountId: string,
  ttlSeconds = 90,
): Promise<ClaimResult> {
  // FAIL CLOSED BEFORE THE CLAIM, not at the erasure call.
  //
  // The 108c939 hosted acceptance discovered a database without the four-argument erasure entry
  // point by CALLING it, mid-deletion, and answering 500. By then the job had already crossed into
  // irreversible work. Refusing here — before a new job is claimed — is the difference between a
  // truthful "this deployment cannot erase yet" and a half-executed deletion.
  //
  // There is deliberately no fallback to the owner-only RPC: it erases from an owner id alone,
  // without the exact job, executor token and generation that make erasure authorized, so falling
  // back would trade an honest refusal for an authority bypass.
  if (!accountErasureAuthoritySchemaReady()) {
    return {
      claimed: false,
      reason: "account_erasure_authority_schema_unready",
      cursor: null,
    };
  }

  const tokenHash = hashToken(randomBytes(32).toString("hex"));
  const row = unwrap(
    await rpc<{
      claimed: boolean;
      reason?: string;
      job_id?: string;
      generation: number;
      cursor: DeletionStage | null;
      irreversible: boolean;
    }>("yorisou_account_deletion_executor_claim", {
      p_owner_account_id: accountId,
      p_token_hash: tokenHash,
      p_ttl_seconds: ttlSeconds,
    }),
  );

  if (!row?.claimed) {
    return {
      claimed: false,
      reason: row?.reason ?? "executor_already_claimed",
      cursor: row?.cursor ?? null,
    };
  }
  if (!row.job_id) {
    // The claim is the only place the executor learns which job it is driving. Without it there is
    // nothing to bind erasure to, and falling back to the owner would reintroduce the rediscovery
    // this contract exists to remove — so this is a contract violation, not a default.
    throw new Error("account_deletion_claim_without_job_id");
  }
  if (!row.cursor) {
    // A claimed job with no cursor cannot happen — the claim initialises it — so treat it as a
    // contract violation rather than defaulting to a stage and guessing.
    throw new Error("account_deletion_claim_without_cursor");
  }

  return {
    claimed: true,
    claim: {
      accountId,
      jobId: row.job_id,
      tokenHash,
      generation: row.generation,
      cursor: row.cursor,
      irreversible: row.irreversible === true,
    },
  };
}

export async function renewDeletionExecutor(claim: ExecutorClaim, ttlSeconds = 90): Promise<boolean> {
  const row = await rpc<boolean>("yorisou_account_deletion_executor_renew", {
    p_owner_account_id: claim.accountId,
    p_token_hash: claim.tokenHash,
    p_generation: claim.generation,
    p_ttl_seconds: ttlSeconds,
  });
  return unwrap(row) === true;
}

/**
 * Give the job back.
 *
 * Called on every exit path, including failure. Without it a person who retries would have to wait
 * out the TTL of a claim held by a request that has already returned — a self-inflicted outage on
 * the one path where waiting is hardest to bear.
 */
export async function releaseDeletionExecutor(claim: ExecutorClaim): Promise<void> {
  try {
    await rpc<boolean>("yorisou_account_deletion_executor_release", {
      p_owner_account_id: claim.accountId,
      p_token_hash: claim.tokenHash,
      p_generation: claim.generation,
    });
  } catch {
    // The claim expires on its own. Turning a failed release into a failed deletion would be strictly
    // worse than waiting out the TTL.
  }
}

/**
 * Drain and close the mutation gate, under the claim.
 *
 * Returns `drained: true` only when the gate is closed AND no lease remains. Nothing may be erased
 * until that is true: an in-flight writer has to finish before its target is destroyed, not after.
 */
export async function drainMutationGate(claim: ExecutorClaim): Promise<{
  gateState: "open" | "draining" | "closed" | "completed";
  activeLeases: number;
  drained: boolean;
}> {
  const row = unwrap(
    await rpc<{ gateState: "open" | "draining" | "closed" | "completed"; activeLeases: number; drained: boolean }>(
      "yorisou_account_deletion_drain_gate",
      {
        p_owner_account_id: claim.accountId,
        p_token_hash: claim.tokenHash,
        p_generation: claim.generation,
      },
    ),
  );
  return {
    gateState: row?.gateState ?? "open",
    activeLeases: row?.activeLeases ?? 0,
    drained: row?.drained === true,
  };
}

/** The bounded, immutable record of what this account owns. Frozen before the crossing. */
export type DeletionTargetManifest = {
  primaryAccountKey: string;
  /**
   * The lookup keys the ACCOUNT RECORD showed at freeze time.
   *
   * Kept with their original meaning because a manifest frozen before the canonical identity-link
   * registry existed must stay readable by the executor that resumes it. They are no longer the
   * authority on which lookups exist — `identityLookupKeys` is.
   */
  emailLookupKey: string | null;
  lineLookupKey: string | null;
  /**
   * Every lookup key this account can be reached by: the UNION of what the account record showed and
   * what the strongly consistent identity-link registry holds.
   *
   * The union direction is the safety property. The record is an object read, and that read can be
   * served stale for tens of seconds; a union can therefore only ever WIDEN the destructive scope.
   * Deleting an already-absent key is success, so a manifest that is too wide costs a request, while
   * one that is too narrow is a live login route to an erased person — which is precisely what a
   * narrowed manifest left behind on 2026-07-31.
   *
   * Optional because a manifest frozen before this field existed has none; readers fall back to the
   * two singular keys above.
   */
  identityLookupKeys?: string[];
  /**
   * How many active identity links the registry held at freeze time, or null when the registry was
   * not deployed.
   *
   * `0` and `null` are different facts — "this account owned no identities" versus "nobody asked" —
   * and an operator reading a frozen manifest has to be able to tell them apart.
   */
  canonicalIdentityLinkCount?: number | null;
  sessionIds: string[];
  passwordResetHashes: string[];
  consultationIds: string[];
  lineEventIds: string[];
  recentSubjectFingerprints: string[];
  /**
   * The canonical LINE subject inventory, frozen before the crossing: digest, subject state, owner
   * fingerprint and the active/erased event counts at that moment. Bounded and content-free — no
   * raw LINE id, no message body.
   *
   * Optional because a manifest frozen before `202607310002`, or on a deployment whose schema
   * predates it, legitimately has none. Absent means "not recorded", which is why verification does
   * not read this field as evidence: it re-asks the database. It exists so an operator can see what
   * the deletion believed it was erasing.
   */
  lineSubjectInventory?: {
    subjectHash: string;
    subjectState: "active" | "erased" | "unknown";
    ownerFingerprint: string | null;
    activeEvents: number;
    erasedEvents: number;
  }[];
  foundationUserProfileId: string | null;
  foundationAuthIdentityIds: string[];
  supportConversationIds: string[];
};

/**
 * Freeze the manifest.
 *
 * Erasure destroys the record that names everything the account owns, so the identifiers needed
 * afterwards are written down BEFORE the crossing. A later stage that tried to re-enumerate would
 * find nothing and report "nothing to erase" — indistinguishable from success, and the most
 * dangerous possible failure mode for a deletion.
 *
 * Immutable in the database: a second write is a no-op, never an overwrite, so the manifest cannot
 * be redirected at another account mid-run.
 */
export async function putDeletionManifest(
  claim: ExecutorClaim,
  manifest: DeletionTargetManifest,
): Promise<void> {
  await rpc<boolean>("yorisou_account_deletion_manifest_put", {
    p_owner_account_id: claim.accountId,
    p_token_hash: claim.tokenHash,
    p_generation: claim.generation,
    p_payload: manifest,
  });
}

/** Read the manifest by owner id or, once that is gone, by fingerprint. */
export async function readDeletionManifest(accountId: string): Promise<DeletionTargetManifest | null> {
  const row = unwrap(
    await rpc<DeletionTargetManifest | null>("yorisou_account_deletion_manifest_for_owner", {
      p_owner_account_id: accountId,
    }),
  );
  return row ?? null;
}

/**
 * Move the cursor forward exactly one stage.
 *
 * `expected` is the whole safety story: the database refuses when the job is not on the stage the
 * caller believes it just executed, so a second run cannot repeat a stage the first has already
 * completed. The claim mutates in place on success, so the caller's loop always holds the truth.
 */
export async function completeDeletionStep(
  claim: ExecutorClaim,
  expected: DeletionStage,
  next: DeletionStage,
  detail: Record<string, unknown> = {},
): Promise<void> {
  const row = unwrap(
    await rpc<{ cursor: DeletionStage; state: string; irreversible: boolean }>(
      "yorisou_account_deletion_complete_step",
      {
        p_owner_account_id: claim.accountId,
        p_token_hash: claim.tokenHash,
        p_generation: claim.generation,
        p_expected_cursor: expected,
        p_next_cursor: next,
        p_detail: detail,
      },
    ),
  );
  if (!row?.cursor) throw new Error("account_deletion_step_no_cursor");
  claim.cursor = row.cursor;
}

/**
 * Record a retryable failure WITHOUT moving the cursor.
 *
 * This is the correction the whole engine exists for. The old path advanced the STATE to
 * `failed_retryable`, and the retry then inferred a resume point from that state — which is how a run
 * that failed at verification restarted from the account hold. Here the cursor is deliberately
 * untouched: the next attempt executes exactly the stage that failed.
 */
export async function recordRetryableError(claim: ExecutorClaim, errorCode: string): Promise<void> {
  try {
    await rpc<unknown>("yorisou_account_deletion_record_retryable_error", {
      p_owner_account_id: claim.accountId,
      p_token_hash: claim.tokenHash,
      p_generation: claim.generation,
      p_error_code: errorCode.slice(0, 80),
    });
  } catch {
    // Best effort. If even this cannot be recorded the claim still expires and the cursor still
    // stands, so the next attempt resumes correctly from durable state rather than from this note.
  }
}

/**
 * Verify, complete, and stop naming the person — as one atomic act.
 *
 * These cannot be separate calls. Finalization nulls `owner_account_id`, which is the key every
 * other operation looks the job up by, so a follow-up "now move the cursor" would not find the row it
 * had just finished.
 */
export async function finalizeDeletionStep(
  claim: ExecutorClaim,
): Promise<{ completed: boolean; residue?: Record<string, unknown> }> {
  const row = unwrap(
    await rpc<{ completed: boolean; residue?: Record<string, unknown> }>(
      "yorisou_account_deletion_finalize_step",
      {
        p_owner_account_id: claim.accountId,
        p_token_hash: claim.tokenHash,
        p_generation: claim.generation,
      },
    ),
  );
  return { completed: row?.completed === true, residue: row?.residue };
}

export type ResumeState = {
  state: string;
  cursor: DeletionStage | null;
  irreversible: boolean;
  attemptCount: number;
  lastErrorCode: string | null;
  executorHeld: boolean;
  executorGeneration: number;
  hasManifest: boolean;
};

/** Everything a retry needs, in one read. */
export async function readResumeState(accountId: string): Promise<ResumeState | null> {
  const row = unwrap(await rpc<ResumeState & { state: string }>("yorisou_account_deletion_resume_state", {
    p_owner_account_id: accountId,
  }));
  if (!row || row.state === "none") return null;
  return {
    state: row.state,
    cursor: row.cursor ?? null,
    irreversible: row.irreversible === true,
    attemptCount: row.attemptCount ?? 0,
    lastErrorCode: row.lastErrorCode ?? null,
    executorHeld: row.executorHeld === true,
    executorGeneration: row.executorGeneration ?? 0,
    hasManifest: row.hasManifest === true,
  };
}
