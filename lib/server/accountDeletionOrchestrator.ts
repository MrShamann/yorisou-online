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

    if (state === "identity_verified" || state === "failed_retryable") {
      state = (await advance(accountId, "locked")) as DeletionState;
      // Hold the account BEFORE anything irreversible runs. A failure here must abort the run:
      // erasing while the account can still authenticate is the one ordering we cannot allow.
      await setAccountDeletionLock(accountId, true);
    }

    if (state === "locked") {
      // Revoked BEFORE erasure: no live session may observe a partially deleted account.
      await revokeAccountSessions(accountId);
      state = (await advance(accountId, "database_erasure")) as DeletionState;
    }

    if (state === "database_erasure") {
      await rpc("yorisou_account_deletion_erase_database", { p_owner_account_id: accountId });
      state = (await advance(accountId, "storage_erasure")) as DeletionState;
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
    }

    if (state === "identity_erasure") {
      targets = targets ?? (await enumerateDeletionTargets(accountId));
      if (targets) await deletePrimaryIdentity(targets);
      state = (await advance(accountId, "verifying")) as DeletionState;
    }

    if (state === "verifying") {
      // Verify the object store here; the database verifies its own residue inside finalize().
      const identityTargets = targets ?? (await enumerateDeletionTargets(accountId));
      if (identityTargets) {
        const verification = await verifyIdentityErasure(accountId, identityTargets);
        if (!verification.clean) {
          await advance(accountId, "failed_retryable", "identity_residue");
          return { outcome: "retryable", errorCode: `identity_residue:${verification.residue.join(",")}` };
        }
      }

      // finalize() re-verifies the database and refuses if anything remains, then replaces the
      // raw account id with a one-way fingerprint. Completion is earned, not asserted.
      await rpc<boolean>("yorisou_account_deletion_finalize", { p_owner_account_id: accountId });
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
