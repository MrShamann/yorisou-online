import "server-only";

// POR-1 — the account-deletion orchestrator.
//
// The database saga owns the durable state machine; this drives it and performs the steps the
// database cannot: object-store erasure and identity removal. The division matters — a job that
// crashes after the database step must be resumable, and it can only be resumed if the state lives
// in the database rather than in a request that has already ended.
//
// WHAT CHANGED, AND WHY IT HAD TO.
//
// The previous version was a chain of `if (state === X)` blocks. It read the coarse state, and on a
// retry from `failed_retryable` it re-entered at `locked` — which meant a run that failed at
// VERIFICATION went back through session revocation and the account hold, re-writing the identity it
// had just erased. It also had no notion of a single writer, so two confirm requests drove the same
// saga side by side.
//
// This version is a LOOP OVER A CURSOR, under a CLAIM:
//
//   • The claim makes the executor single-writer. Every step presents the token, the generation and
//     the stage it expects to be on; the database validates all of it in one statement under a row
//     lock and refuses the second run rather than letting it proceed.
//   • The cursor is the next stage that must execute. A retryable failure preserves it, so a retry
//     resumes exactly where it stopped and never replays a stage that writes identity.
//   • The manifest is frozen before the crossing, so every stage after erasure works from a durable
//     record rather than from an account that no longer exists.
//
// The originating session is deliberately NOT kept alive to finish the work. Sessions are revoked
// early, on purpose: a person who asked to be deleted should not remain logged in while it happens,
// and the job must complete regardless of what their browser does next.

import {
  buildDeletionManifest,
  deleteAccountIndexes,
  deleteAccountLinkedObjects,
  deletePrimaryIdentity,
  revokeAccountSessions,
  verifyIdentityErasure,
} from "./accountIdentityDeletion";
import { createHash } from "node:crypto";

import { rpc } from "./assessmentAttemptStore";
import { purgeProvisioningForOwner } from "./identityProvisioning";
import {
  isIdentityProvisioningSchemaReady,
  resolveProvisioningMode,
} from "./identityProvisioningRollout";
import { pruneRecentLineWebhookSubjects, setAccountDeletionLock } from "./yorisouData";
import { finalizeAccountMutationGate, withAccountDeletionContext } from "./accountMutationLease";
import {
  claimDeletionExecutor,
  completeDeletionStep,
  drainMutationGate,
  finalizeDeletionStep,
  isAtOrPastIrreversible,
  nextStage,
  putDeletionManifest,
  readDeletionManifest,
  readResumeState,
  recordRetryableError,
  releaseDeletionExecutor,
  renewDeletionExecutor,
  type DeletionStage,
  type DeletionTargetManifest,
  type ExecutorClaim,
} from "./accountDeletionExecutor";
import {
  decideAccountAuthentication,
  type AccountAuthenticationDecision,
} from "./accountDeletionLock";

export type DeletionState =
  | "requested"
  | "identity_verified"
  | "locked"
  | "database_erasure"
  | "storage_erasure"
  | "identity_erasure"
  | "verifying"
  | "completed"
  | "failed_retryable"
  | "failed_terminal"
  | "cancelled"
  | "legal_hold";

export type DeletionStatus = {
  state: DeletionState;
  /** True once cancellation is no longer possible — the irreversible boundary. */
  irreversible: boolean;
  errorCode: string | null;
};

/** States from which nothing destructive has yet happened, so cancelling is still honest. */
const CANCELLABLE: DeletionState[] = ["requested", "identity_verified"];

export function isCancellable(state: DeletionState) {
  return CANCELLABLE.includes(state);
}

async function advance(accountId: string, to: DeletionState, errorCode?: string) {
  return rpc<string>("yorisou_account_deletion_advance", {
    p_owner_account_id: accountId,
    p_to: to,
    p_error_code: errorCode ?? null,
  });
}

export async function openDeletionJob(accountId: string): Promise<string> {
  // Idempotent in the database: an existing active job is returned rather than duplicated.
  return rpc<string>("yorisou_account_deletion_open", { p_owner_account_id: accountId });
}

/** Record that reauthentication succeeded. The saga rejects this from an illegal prior state. */
export async function advanceToIdentityVerified(accountId: string): Promise<void> {
  await advance(accountId, "identity_verified");
}

export async function readDeletionStatus(accountId: string): Promise<DeletionStatus | null> {
  const rows = await rpc<{ state: DeletionState; error_code: string | null }[]>(
    "yorisou_account_deletion_status",
    { p_owner_account_id: accountId },
  );
  const row = Array.isArray(rows) ? rows[0] : (rows as unknown as { state: DeletionState; error_code: string | null });
  if (!row) return null;

  // The RPC answers "no job" with a SENTINEL, `{"state":"none"}`, not with an empty result. Passing
  // that through as if it were a saga state is what a null-check alone misses: `none` is truthy, so
  // the confirm route would skip opening a job and skip the opening transition, and executeDeletion
  // would fall through every branch and report `unexpected_state:none`. Deletion would never run.
  // The sentinel is normalised HERE, once, so no caller has to know about it.
  if ((row.state as string) === "none") return null;
  return {
    state: row.state,
    irreversible: !isCancellable(row.state),
    errorCode: row.error_code ?? null,
  };
}

/**
 * POR-1 WS5 — the authentication gate.
 *
 * Called at every point where credentials would mint a new session. The durable job is consulted
 * ONLY when the account record is missing, because that is the one case the record-borne marker
 * cannot answer: the record that would have carried it has already been erased.
 *
 * That path fails CLOSED. A store miss is already abnormal; refusing a login there costs a person
 * one retry, while allowing it would let an erased account be resurrected from a stale cookie.
 */
export async function evaluateAuthenticationLock(input: {
  accountId: string;
  storeRecordFound: boolean;
  deletionLockedAt: string | null | undefined;
}): Promise<AccountAuthenticationDecision> {
  if (input.deletionLockedAt) {
    return decideAccountAuthentication({ ...input, durableDeletionState: undefined });
  }
  if (input.storeRecordFound) {
    return { allowed: true };
  }

  let durableDeletionState: string | null;
  try {
    durableDeletionState = (await readDeletionStatus(input.accountId))?.state ?? null;
  } catch (error) {
    console.error("deletion lock lookup failed; refusing cookie-restored login");
    void error;
    return { allowed: false, reason: "account_deleted" };
  }

  return decideAccountAuthentication({ ...input, durableDeletionState });
}

export type DeletionOutcome =
  | { outcome: "completed" }
  | { outcome: "retryable"; errorCode: string }
  | { outcome: "terminal"; errorCode: string }
  | { outcome: "in_progress"; errorCode: string };

/** A stage failed in a way that another attempt could survive. */
class RetryableStageError extends Error {}

/**
 * Drive the saga to completion, resuming from wherever the cursor says it is.
 *
 * Safe to call repeatedly. A second concurrent call does not run: it is refused the claim and
 * reports `in_progress`, which is the honest answer to a double-clicked confirm button.
 */
export async function executeDeletion(accountId: string): Promise<DeletionOutcome> {
  const resume = await readResumeState(accountId);
  if (!resume) return { outcome: "terminal", errorCode: "account_deletion_job_not_found" };
  if (resume.state === "completed") return { outcome: "completed" };
  if (resume.state === "cancelled" || resume.state === "legal_hold" || resume.state === "failed_terminal") {
    return { outcome: "terminal", errorCode: `account_deletion_${resume.state}` };
  }

  const claimResult = await claimDeletionExecutor(accountId);
  if (!claimResult.claimed) {
    // Another executor holds this job. Reporting a failure here would invite the person to retry into
    // the same refusal; reporting progress is both true and actionable.
    return { outcome: "in_progress", errorCode: claimResult.reason };
  }

  const claim = claimResult.claim;
  try {
    return await runStages(claim);
  } catch (error) {
    const code = error instanceof Error ? error.message : "unknown";

    // A contract violation can never succeed on retry; anything else is worth another attempt.
    // NOTE the deliberate absence of `illegal_transition` handling for cursor errors: a cursor
    // mismatch means another executor moved the job, which is a reason to stop, not to burn the job.
    const terminal =
      code.includes("account_deletion_job_not_found") ||
      code.includes("account_deletion_cancelled") ||
      code.includes("account_deletion_manifest_missing");

    if (terminal) {
      await advance(accountId, "failed_terminal", code).catch(() => undefined);
      return { outcome: "terminal", errorCode: code };
    }

    if (code.includes("cursor_mismatch") || code.includes("executor_")) {
      // Someone else is driving, or this claim lapsed mid-run. Either way this run must stop without
      // recording a failure against a job that may be progressing perfectly well in another worker.
      return { outcome: "in_progress", errorCode: code };
    }

    await recordRetryableError(claim, code);
    return { outcome: "retryable", errorCode: code };
  } finally {
    await releaseDeletionExecutor(claim);
  }
}

/**
 * The stage loop.
 *
 * Each iteration executes exactly the stage the cursor names, then moves the cursor exactly one
 * step. Nothing here decides where to resume — the cursor already did, durably, before this request
 * existed.
 */
async function runStages(claim: ExecutorClaim): Promise<DeletionOutcome> {
  const accountId = claim.accountId;
  // Enumerated once per run and reused across stages. Read from the durable manifest rather than
  // re-derived, because after `identity_erasure` there is nothing left to derive it from.
  let manifest: DeletionTargetManifest | null = null;

  const requireManifest = async (): Promise<DeletionTargetManifest> => {
    manifest = manifest ?? (await readDeletionManifest(accountId));
    if (!manifest) throw new Error("account_deletion_manifest_missing");
    return manifest;
  };

  for (;;) {
    const stage: DeletionStage = claim.cursor;
    if (stage === "completed") return { outcome: "completed" };

    // The claim is bounded, and a full erasure can outlive its TTL. Renewing between stages keeps a
    // slow-but-healthy run from losing the job to itself.
    await renewDeletionExecutor(claim);

    try {
      switch (stage) {
        case "mutation_draining": {
          // ── CLOSE THE GATE, THEN DRAIN. This is the fence. ────────────────────
          //
          // Ordinary writes and this erasure race over one record across two systems. Closing stops
          // new writers; draining waits for the ones already inside. Only when both are true may
          // anything be destroyed — an in-flight writer must finish BEFORE its target is erased, not
          // after, because "after" is how a stale copy resurrects a deleted account.
          const gate = await drainMutationGate(claim);
          if (!gate.drained) {
            // Not a failure. Writers are still finishing, and the cursor still says `mutation_draining`,
            // so the retry resumes here and erasure is still known never to have begun.
            await recordRetryableError(claim, `mutation_draining:${gate.activeLeases}`);
            return { outcome: "retryable", errorCode: `mutation_gate_${gate.gateState}` };
          }

          // FREEZE THE MANIFEST while the account still exists. After the crossing there is nothing
          // left to enumerate from, and a later stage that found nothing would report success.
          const built = await buildDeletionManifest(accountId);
          if (built) {
            await putDeletionManifest(claim, built);
            manifest = built;
          } else if (!(await readDeletionManifest(accountId))) {
            // No account AND no manifest: there is nothing this run can prove it erased, and the one
            // thing it must not do is call that success.
            throw new Error("account_deletion_manifest_missing");
          }
          break;
        }

        case "lock_marker": {
          // Hold the account. Placed ONCE, here, and never on a retry — the cursor is what guarantees
          // that. This is a read-modify-upsert of the primary identity, so replaying it after erasure
          // is precisely how a deleted account came back.
          await withAccountDeletionContext({
            accountId,
            operation: "account_profile_update",
            execute: (context) => setAccountDeletionLock(context, accountId, true),
          });
          break;
        }

        case "session_revocation": {
          // Revoked BEFORE erasure: no live session may observe a partially deleted account.
          const targets = await requireManifest();
          await withAccountDeletionContext({
            accountId,
            operation: "session_account_binding",
            execute: (context) => revokeAccountSessions(context, targets),
          });
          break;
        }

        case "database_erasure": {
          await rpc("yorisou_account_deletion_erase_database", { p_owner_account_id: accountId });
          // Partial provisioning state is account-linked and lives outside the declarative plan,
          // which is fixed in an applied migration. Removing it also RELEASES THE EMAIL: the saga is
          // keyed by a digest of the address, so one left behind would make that address permanently
          // unregisterable by the person who just asked to be forgotten.
          if (resolveProvisioningMode({ schemaReady: isIdentityProvisioningSchemaReady() }) === "durable_saga") {
            await purgeProvisioningForOwner({
              accountId,
              ownerFingerprint: createHash("sha256").update(accountId).digest("hex"),
            });
          }
          break;
        }

        case "storage_erasure": {
          const targets = await requireManifest();
          await withAccountDeletionContext({
            accountId,
            operation: "identity_mirror_sync",
            execute: async (context) => {
              // Indexes first: an orphaned index pointing at a missing account is a broken login,
              // while an orphaned account with no index is merely unreachable and still deletable.
              await deleteAccountIndexes(context, targets);
              await deleteAccountLinkedObjects(context, targets);
              await pruneRecentLineWebhookSubjects(context, targets.recentSubjectFingerprints);
            },
          });
          break;
        }

        case "identity_erasure": {
          const targets = await requireManifest();
          await withAccountDeletionContext({
            accountId,
            operation: "account_profile_update",
            execute: (context) => deletePrimaryIdentity(context, targets),
          });
          break;
        }

        case "verifying": {
          const targets = await requireManifest();
          // THE STORE IS NOT READ-AFTER-DELETE CONSISTENT.
          //
          // The isolated Preview transport returned the account record as still present for a short
          // window after a successful delete, so verification found "residue" that was already gone
          // and the saga refused to finalize — correctly, on the evidence it had. A hand-run probe
          // with seconds between the steps never saw it; the saga runs them back to back.
          //
          // Retrying does NOT weaken the guarantee: a real residue survives every attempt and is
          // still refused. It only stops a consistency lag from being mistaken for a failed erasure.
          let verification = await verifyIdentityErasure(accountId, targets);
          for (let attempt = 0; attempt < 5 && !verification.clean; attempt += 1) {
            await new Promise((resolve) => setTimeout(resolve, 800));
            verification = await verifyIdentityErasure(accountId, targets);
          }
          if (!verification.clean) {
            // Record WHICH families blocked it. Family names only — never a key, which would embed
            // an email hash or a live session identifier.
            throw new RetryableStageError(`identity_residue:${verification.residue.join(",")}`);
          }
          break;
        }

        case "finalizing": {
          // Verify the database, complete, and stop naming the person — one atomic act, because
          // finalization drops the id that every other operation looks the job up by.
          const result = await finalizeDeletionStep(claim);
          if (!result.completed) {
            return { outcome: "retryable", errorCode: "verification_residue" };
          }
          // The gate stops naming a person at the same moment the job does.
          await finalizeAccountMutationGate(accountId);
          return { outcome: "completed" };
        }
      }
    } catch (error) {
      if (error instanceof RetryableStageError) {
        await recordRetryableError(claim, error.message);
        return { outcome: "retryable", errorCode: error.message };
      }
      throw error;
    }

    const next = nextStage(stage);
    if (!next) throw new Error(`account_deletion_no_successor_${stage}`);
    // The cursor moves ONLY after the stage's external effect has actually happened. A crash between
    // the two leaves the cursor where it was, and the retry re-runs a stage that is idempotent —
    // which is the correct trade, because the alternative is marking work done that never ran.
    await completeDeletionStep(claim, stage, next);
  }
}

export async function cancelDeletion(accountId: string): Promise<boolean> {
  const resume = await readResumeState(accountId);
  if (!resume) return false;
  // Refuse rather than pretend. Once erasure has begun there is nothing left to cancel, and reporting
  // success would tell the person their data still exists when it does not. `irreversible` is the
  // RECORDED FACT, not a guess from the state string — a job sitting in `failed_retryable` half-way
  // through erasure is not cancellable, and only the fact can say so.
  if (resume.irreversible || isAtOrPastIrreversible(resume.cursor)) return false;
  if (!isCancellable(resume.state as DeletionState)) return false;

  await advance(accountId, "cancelled");
  // The durable transition is the cancellation; the marker is only its enforcement shadow. At a legal
  // cancel point no hold has been placed yet, so this is a defensive no-op rather than the thing that
  // frees the account.
  await withAccountDeletionContext({
    accountId,
    operation: "account_profile_update",
    execute: (context) => setAccountDeletionLock(context, accountId, false),
  });
  return true;
}
