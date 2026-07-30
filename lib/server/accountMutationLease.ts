import "server-only";

// POR-1 — the account mutation fence, application side.
//
// Ordinary account writes and account deletion are two systems racing over one record: the identity
// lives in an object store, the decision to delete lives in the database. A hosted bisection showed
// what that costs — serially a deletion completes; with two concurrent workers the primary account
// record comes back after erasure, because a request had read it before the deletion started and
// wrote its stale copy afterwards.
//
// A check before the write does not fix that. It only moves the race:
//
//     read state → (deletion happens) → write stale account
//
// So every ordinary write now holds a LEASE across its whole read-transform-write window, and
// deletion closes the gate and DRAINS outstanding leases before it erases anything. The database
// decides the ordering, under row locks; this module is the boundary that makes it unavoidable.
//
// The lease must be taken BEFORE the read. Taking it just before the write leaves exactly the
// window this exists to close.

import { rpc } from "./assessmentAttemptStore";

export type AccountMutationOperation =
  | "support_profile_update"
  | "password_update"
  | "line_binding"
  | "account_profile_update"
  | "identity_mirror_sync"
  | "session_identity_upgrade"
  | "account_recovery";

/** Bounded refusal reasons. None of them names a person, a key or a store. */
export type AccountMutationDenial =
  | "account_mutation_denied_deleted"
  | "account_mutation_denied_erasing"
  | "account_mutation_denied_gate"
  | "account_mutation_unavailable";

export class AccountMutationDenied extends Error {
  readonly reason: AccountMutationDenial;
  constructor(reason: AccountMutationDenial) {
    super(reason);
    this.name = "AccountMutationDenied";
    this.reason = reason;
  }
}

function classify(error: unknown): AccountMutationDenial {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("account_mutation_denied_deleted")) return "account_mutation_denied_deleted";
  if (message.includes("account_mutation_denied_erasing")) return "account_mutation_denied_erasing";
  if (message.includes("account_mutation_denied_gate")) return "account_mutation_denied_gate";
  // Fail CLOSED. If the fence cannot be consulted we do not know whether a deletion is running, and
  // "we could not check" must never read as "go ahead".
  return "account_mutation_unavailable";
}

type LeaseHandle = { leaseId: string; generation: number };

async function begin(
  accountId: string,
  operation: AccountMutationOperation,
  ttlSeconds: number,
): Promise<LeaseHandle> {
  try {
    const result = await rpc<{ leaseId: string; generation: number }>("yorisou_account_mutation_begin", {
      p_owner_account_id: accountId,
      p_operation_code: operation,
      p_ttl_seconds: ttlSeconds,
    });
    const row = Array.isArray(result) ? result[0] : result;
    if (!row?.leaseId) throw new Error("account_mutation_unavailable");
    return row;
  } catch (error) {
    throw new AccountMutationDenied(classify(error));
  }
}

async function release(leaseId: string): Promise<void> {
  // A failed release is not fatal: the lease expires, and deletion drains it after the execution
  // grace. Throwing here would turn a successful write into a reported failure.
  try {
    await rpc<boolean>("yorisou_account_mutation_release", { p_lease_id: leaseId });
  } catch {
    /* expiry + drain is the backstop */
  }
}

/**
 * Run an account mutation under a lease.
 *
 * `execute` must contain the ENTIRE stale-data window — the read, the transform and every write it
 * implies (account record, email index, LINE index, identity mirror). If any part of that happens
 * outside, the fence has a hole exactly the width of the part left outside.
 *
 * Throws `AccountMutationDenied` when the account is closed to ordinary writes. Callers should
 * surface a bounded refusal; they must never retry past it or fall back to an unguarded write.
 */
export async function withAccountMutationLease<T>(input: {
  accountId: string;
  operation: AccountMutationOperation;
  /** Bound to the platform request ceiling; a longer lease would outlive the process holding it. */
  ttlSeconds?: number;
  execute: () => Promise<T>;
}): Promise<T> {
  const lease = await begin(input.accountId, input.operation, input.ttlSeconds ?? 30);
  try {
    return await input.execute();
  } finally {
    await release(lease.leaseId);
  }
}

export type MutationGateStatus = {
  gateState: "open" | "draining" | "closed" | "completed";
  generation: number;
  activeLeases: number;
  drained: boolean;
};

/**
 * Deletion side: stop new writers, then wait for the ones already inside.
 *
 * Returns `drained: true` only when the gate is closed AND no lease remains. The caller must not
 * erase anything until that is true — an in-flight writer has to finish before its target is
 * destroyed, not after.
 */
export async function closeAccountMutationGate(accountId: string): Promise<MutationGateStatus> {
  const result = await rpc<MutationGateStatus>("yorisou_account_deletion_close_mutation_gate", {
    p_owner_account_id: accountId,
  });
  const row = Array.isArray(result) ? result[0] : result;
  return {
    gateState: row?.gateState ?? "open",
    generation: row?.generation ?? 1,
    activeLeases: row?.activeLeases ?? 0,
    drained: row?.drained === true,
  };
}

export async function readMutationGateStatus(accountId: string): Promise<MutationGateStatus> {
  const result = await rpc<MutationGateStatus>("yorisou_account_deletion_mutation_gate_status", {
    p_owner_account_id: accountId,
  });
  const row = Array.isArray(result) ? result[0] : result;
  return {
    gateState: row?.gateState ?? "open",
    generation: row?.generation ?? 1,
    activeLeases: row?.activeLeases ?? 0,
    drained: (row?.activeLeases ?? 0) === 0 && row?.gateState === "closed",
  };
}

/** Record the last completed stage, and the irreversible crossing as a durable fact. */
export async function markDeletionCursor(
  accountId: string,
  cursor: "identity_verified" | "mutation_draining" | "locked" | "database_erasure" | "storage_erasure" | "identity_erasure" | "verifying",
  irreversible = false,
): Promise<void> {
  await rpc<string>("yorisou_account_deletion_mark_cursor", {
    p_owner_account_id: accountId,
    p_cursor: cursor,
    p_irreversible: irreversible,
  });
}

/** At completion the gate stops naming a person, exactly as the deletion job does. */
export async function finalizeAccountMutationGate(accountId: string): Promise<void> {
  await rpc<boolean>("yorisou_account_mutation_gate_finalize", { p_owner_account_id: accountId });
}
