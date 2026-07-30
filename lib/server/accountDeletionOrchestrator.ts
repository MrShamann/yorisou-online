import "server-only";

// POR-1 — the account-deletion orchestrator.
//
// The database saga owns the durable state machine; this drives it and performs the two steps the
// database cannot: object-store erasure and identity removal. The division matters — a job that
// crashes after the database step must be resumable, and it can only be resumed if the state lives
// in the database rather than in a request that has already ended.
//
// The originating session is deliberately NOT kept alive to finish the work. Sessions are revoked
// early, on purpose: a person who asked to be deleted should not remain logged in while it
// happens, and the job must complete regardless of what their browser does next.

import {
  enumerateDeletionTargets,
  revokeAccountSessions,
  deleteAccountIndexes,
  deletePrimaryIdentity,
  verifyIdentityErasure,
  type IdentityDeletionTargets,
} from "./accountIdentityDeletion";
import { rpc } from "./assessmentAttemptStore";
import { setAccountDeletionLock } from "./yorisouData";
import {
  closeAccountMutationGate,
  finalizeAccountMutationGate,
  markDeletionCursor,
} from "./accountMutationLease";
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
// Mirrors the applied migration exactly: `advance(...,'cancelled')` is legal only from `requested`
// and `identity_verified`. `locked` is NOT cancellable — by then sessions have been revoked and the
// run is committed to finishing. Listing `locked` here would have offered the person a cancel
// button whose database call always throws, and would have released the hold on an account whose
// job was still live.
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
  | { outcome: "terminal"; errorCode: string };

/**
 * Drive the saga to completion, resuming from wherever it currently is.
 *
 * Safe to call repeatedly: every step is either idempotent or guarded by the database state
 * machine, which rejects illegal transitions. That is what makes a crashed job recoverable rather
 * than a permanently half-deleted account.
 */
export async function executeDeletion(accountId: string): Promise<DeletionOutcome> {
  const status = await readDeletionStatus(accountId);
  if (!status) return { outcome: "terminal", errorCode: "account_deletion_job_not_found" };
  if (status.state === "completed") return { outcome: "completed" };
  if (status.state === "cancelled" || status.state === "legal_hold") {
    return { outcome: "terminal", errorCode: `account_deletion_${status.state}` };
  }

  try {
    let state: DeletionState = status.state;

    // THE HOLD IS PLACED ONCE, ON THE WAY IN — NEVER ON A RETRY.
    //
    // `setAccountDeletionLock` is a read-modify-UPSERT of the account record. Running it on a
    // retry, after erasure has already begun, would rewrite the primary identity (and its email
    // index) from a stale in-memory copy — resurrecting the very record the saga had just deleted,
    // then deleting it again, forever. A retry must resume from where it failed; it must not walk
    // back through a step that writes identity.
    const firstEntry = state === "identity_verified";
    if (firstEntry) {
      // ── CLOSE THE GATE, THEN DRAIN. This is the fence. ──────────────────────
      //
      // Ordinary writes and this erasure race over one record across two systems. Closing stops new
      // writers; draining waits for the ones already inside. Only when both are true may anything
      // be destroyed — an in-flight writer must finish BEFORE its target is erased, not after,
      // because "after" is how a stale copy resurrects a deleted account.
      await markDeletionCursor(accountId, "mutation_draining");
      const gate = await closeAccountMutationGate(accountId);
      if (!gate.drained) {
        // Not a failure — writers are still finishing. Retry resumes here, and the durable cursor
        // remembers that erasure never began.
        await advance(accountId, "failed_retryable", `mutation_draining:${gate.activeLeases}`);
        return { outcome: "retryable", errorCode: `mutation_gate_${gate.gateState}` };
      }

      state = (await advance(accountId, "locked")) as DeletionState;
      // Hold the account BEFORE anything irreversible runs, and only now — with the gate closed,
      // nothing else can be mid-write, so this lock upsert cannot race an ordinary mutation.
      await setAccountDeletionLock(accountId, true);
      await markDeletionCursor(accountId, "locked", true);
    } else if (state === "failed_retryable") {
      // Resume without re-locking. Past the irreversible boundary the DURABLE JOB — not a rewritten
      // object-store record — is the authority for refusing authentication.
      //
      // If the earlier run never got past draining, the gate is still the thing to finish.
      const gate = await closeAccountMutationGate(accountId);
      if (!gate.drained) {
        await advance(accountId, "failed_retryable", `mutation_draining:${gate.activeLeases}`);
        return { outcome: "retryable", errorCode: `mutation_gate_${gate.gateState}` };
      }
      state = (await advance(accountId, "locked")) as DeletionState;
      await markDeletionCursor(accountId, "locked", true);
    }

    if (state === "locked") {
      // Revoked BEFORE erasure: no live session may observe a partially deleted account.
      await revokeAccountSessions(accountId);
      state = (await advance(accountId, "database_erasure")) as DeletionState;
      await markDeletionCursor(accountId, "database_erasure", true);
    }

    if (state === "database_erasure") {
      await rpc("yorisou_account_deletion_erase_database", { p_owner_account_id: accountId });
      state = (await advance(accountId, "storage_erasure")) as DeletionState;
      await markDeletionCursor(accountId, "storage_erasure", true);
    }

    let targets: IdentityDeletionTargets | null = null;

    if (state === "storage_erasure") {
      targets = await enumerateDeletionTargets(accountId);
      if (targets) {
        // Indexes first: an orphaned index pointing at a missing account is a broken login,
        // while an orphaned account with no index is merely unreachable and still deletable.
        await deleteAccountIndexes(targets);
        await revokeAccountSessions(accountId);
      }
      state = (await advance(accountId, "identity_erasure")) as DeletionState;
      await markDeletionCursor(accountId, "identity_erasure", true);
    }

    if (state === "identity_erasure") {
      targets = targets ?? (await enumerateDeletionTargets(accountId));
      if (targets) await deletePrimaryIdentity(targets);
      state = (await advance(accountId, "verifying")) as DeletionState;
      await markDeletionCursor(accountId, "verifying", true);
    }

    if (state === "verifying") {
      // Verify the object store here; the database verifies its own residue inside finalize().
      const identityTargets = targets ?? (await enumerateDeletionTargets(accountId));
      if (identityTargets) {
        // THE STORE IS NOT READ-AFTER-DELETE CONSISTENT.
        //
        // The isolated Preview transport returned the account record as still present for a short
        // window after a successful delete, so verification found "residue" that was already gone
        // and the saga refused to finalize — correctly, on the evidence it had. A hand-run probe
        // with seconds between the steps never saw it; the saga runs them back to back.
        //
        // Retrying does NOT weaken the guarantee: a real residue survives every attempt and is
        // still refused. It only stops a consistency lag from being mistaken for a failed erasure.
        // Bounded deliberately — this runs inside a request, and an erasure that cannot be proven
        // in a few seconds deserves the retryable state it gets.
        let verification = await verifyIdentityErasure(accountId, identityTargets);
        for (let attempt = 0; attempt < 5 && !verification.clean; attempt += 1) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          verification = await verifyIdentityErasure(accountId, identityTargets);
        }
        if (!verification.clean) {
          // Record WHICH families blocked it. Family names only — never a key, which would embed
          // an email hash or a live session identifier. A durable failure that cannot say what it
          // found costs an entire deploy-and-rerun cycle to diagnose, which is what it just cost.
          await advance(accountId, "failed_retryable", `identity_residue:${verification.residue.join(",")}`);
          return { outcome: "retryable", errorCode: `identity_residue:${verification.residue.join(",")}` };
        }
      }

      // finalize() re-verifies the database and refuses if anything remains, then replaces the
      // raw account id with a one-way fingerprint. Completion is earned, not asserted.
      await rpc<boolean>("yorisou_account_deletion_finalize", { p_owner_account_id: accountId });
      // The gate stops naming a person at the same moment the job does.
      await finalizeAccountMutationGate(accountId);
      return { outcome: "completed" };
    }

    return { outcome: "retryable", errorCode: `unexpected_state:${state}` };
  } catch (error) {
    const code = error instanceof Error ? error.message : "unknown";

    // A contract violation can never succeed on retry; anything else is worth another attempt.
    const terminal =
      code.includes("illegal_transition") ||
      code.includes("account_deletion_job_not_found") ||
      code.includes("account_deletion_cancelled");

    await advance(accountId, terminal ? "failed_terminal" : "failed_retryable", code).catch(() => undefined);
    return terminal
      ? { outcome: "terminal", errorCode: code }
      : { outcome: "retryable", errorCode: code };
  }
}

export async function cancelDeletion(accountId: string): Promise<boolean> {
  const status = await readDeletionStatus(accountId);
  if (!status) return false;
  // Refuse rather than pretend: once erasure has begun there is nothing left to cancel, and
  // reporting success would tell the person their data still exists when it does not.
  if (!isCancellable(status.state)) return false;
  // The durable transition is the cancellation; the marker is only its enforcement shadow. At a
  // legal cancel point (`requested` / `identity_verified`) no hold has been placed yet, so the
  // clear below is a defensive no-op rather than the thing that frees the account.
  await advance(accountId, "cancelled");
  await setAccountDeletionLock(accountId, false);
  return true;
}
