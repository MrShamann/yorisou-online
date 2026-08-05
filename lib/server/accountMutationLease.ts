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
//
// This module is also the ONLY place that mints an account-write context. That is what turns the
// fence from a discipline into a mechanism: the low-level writers require a context, contexts exist
// only for the duration of a lease, and nothing else can make one.

import { rpc } from "./assessmentAttemptStore";
import { isPor1CapabilityEnabled } from "./por1RuntimeControls";
import { resolveFenceMode } from "./accountMutationFenceRollout";
import {
  mintAccountWriteContext,
  revokeAccountWriteContext,
  type AccountDeletionContext,
  type AccountMutationContext,
  type AccountMutationOperation,
  type AccountProvisioningContext,
  type AccountWriteContext,
} from "./accountWriteContext";

export type { AccountMutationOperation } from "./accountWriteContext";
export type {
  AccountWriteContext,
  AccountMutationContext,
  AccountProvisioningContext,
  AccountDeletionContext,
} from "./accountWriteContext";

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

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA READINESS IS NOT ACTIVATION.
//
// The fence RPCs live in a Preview-only migration. The current Production-lineage CI databases do
// not have them, so requiring a lease unconditionally broke authenticated login there — YV-1 and
// DCI-1 went red, and downstream 422s became 401s. That is a rollout-ordering problem, not a reason
// to soften the fence.
//
// So readiness (does the schema exist?) and activation (may deletion run?) are separate facts:
//
//   ready=false, executor=off → exact legacy behaviour, no RPC call at all
//   ready=false, executor=on  → FAIL CLOSED before any identity mutation
//   ready=true                → leases mandatory; every failure is a denial
//
// Turning the deletion executor OFF must never turn the fence off once the schema is deployed:
// an emergency kill switch that reopened ordinary writes against an in-flight deletion would
// reintroduce the exact resurrection this exists to stop.
//
// This is infrastructure readiness, deliberately NOT a fifth user-facing capability — it must not
// appear in the four POR-1 controls or in the flag-off baseline equivalence gate.
const SCHEMA_READY_ENV = "YORISOU_POR1_ACCOUNT_MUTATION_FENCE_SCHEMA_READY";

export function accountMutationFenceSchemaReady(): boolean {
  return process.env[SCHEMA_READY_ENV] === "on";
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
 * Run an account mutation under a lease, with a live write context.
 *
 * `execute` must contain the ENTIRE stale-data window — the read, the transform and every write it
 * implies (account record, email index, LINE index, identity mirror). If any part of that happens
 * outside, the fence has a hole exactly the width of the part left outside.
 *
 * The context handed to `execute` is revoked the moment this returns, so it cannot be stashed and
 * replayed. Every low-level writer demands one, which is what makes "the whole window" enforceable
 * rather than merely requested.
 *
 * Throws `AccountMutationDenied` when the account is closed to ordinary writes. Callers should
 * surface a bounded refusal; they must never retry past it or fall back to an unguarded write.
 */
export async function withAccountMutationLease<T>(input: {
  accountId: string;
  operation: AccountMutationOperation;
  /** Bound to the platform request ceiling; a longer lease would outlive the process holding it. */
  ttlSeconds?: number;
  execute: (context: AccountMutationContext) => Promise<T>;
}): Promise<T> {
  return runUnderLease({ ...input, kind: "mutation" }) as Promise<T>;
}

/**
 * The same window, for the creation of an account that does not exist yet.
 *
 * Kept distinct from a mutation because the questions differ: "may I create this?" is answered by an
 * open gate on a brand-new id, while "may I still change this?" is answered by a deletion that may
 * already be running. Sharing one context type would let a provisioning path be used to re-create an
 * account whose deletion had already begun.
 */
export async function withAccountProvisioningLease<T>(input: {
  accountId: string;
  operation: AccountMutationOperation;
  ttlSeconds?: number;
  execute: (context: AccountProvisioningContext) => Promise<T>;
}): Promise<T> {
  return runUnderLease({ ...input, kind: "provisioning" }) as Promise<T>;
}

async function runUnderLease<T>(input: {
  accountId: string;
  operation: AccountMutationOperation;
  ttlSeconds?: number;
  kind: "mutation" | "provisioning";
  execute: (context: never) => Promise<T>;
}): Promise<T> {
  const mode = resolveFenceMode({
    schemaReady: accountMutationFenceSchemaReady(),
    deletionExecutorEnabled: isPor1CapabilityEnabled("ACCOUNT_DELETION_EXECUTOR"),
  });

  if (mode === "fail_closed") {
    // Deletion can run but the fence cannot. Refusing the write is the only safe answer.
    throw new AccountMutationDenied("account_mutation_unavailable");
  }

  if (mode === "legacy_no_schema") {
    // Deployments that predate the fence migration keep their exact previous behaviour and make no
    // RPC call — a call that cannot succeed must not be attempted just to be caught.
    //
    // A context is still minted and still revoked. The low-level writers require one unconditionally,
    // because a guard that is only active in some deployments is a guard nobody can reason about;
    // here it carries no lease, and the fence's ORDERING guarantee is simply absent, exactly as it
    // was before the migration existed.
    const context = mintAccountWriteContext({
      kind: input.kind,
      accountId: input.accountId,
      operation: input.operation,
      leaseId: null,
      generation: 0,
    });
    try {
      return await input.execute(context as never);
    } finally {
      revokeAccountWriteContext(context);
    }
  }

  const lease = await begin(input.accountId, input.operation, input.ttlSeconds ?? 30);
  const context = mintAccountWriteContext({
    kind: input.kind,
    accountId: input.accountId,
    operation: input.operation,
    leaseId: lease.leaseId,
    generation: lease.generation,
  });
  try {
    return await input.execute(context as never);
  } finally {
    // Revoke BEFORE releasing. If the order were reversed there would be a window in which the gate
    // considers the writer gone while a captured context could still authorise a write — small, but
    // it is the same window the whole fence exists to close.
    revokeAccountWriteContext(context);
    await release(lease.leaseId);
  }
}

export type MutationGateStatus = {
  gateState: "open" | "draining" | "closed" | "completed";
  generation: number;
  activeLeases: number;
  drained: boolean;
};

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

/** At completion the gate stops naming a person, exactly as the deletion job does. */
export async function finalizeAccountMutationGate(accountId: string): Promise<void> {
  await rpc<boolean>("yorisou_account_mutation_gate_finalize", { p_owner_account_id: accountId });
}

// ─────────────────────────────────────────────────────────────────────────────
// THE DELETION EXECUTOR'S OWN CONTEXT.
//
// The executor writes too — it places the account hold and revokes sessions — and those writes must
// be governed as strictly as any other. They cannot take a mutation lease: by then the gate is
// deliberately closed, and a deletion that had to lease against its own closed gate could never run.
//
// So the authority is the EXECUTOR CLAIM instead. The context is minted per stage and revoked when
// the stage ends, so a captured reference cannot authorise a write at a later stage either.
// ─────────────────────────────────────────────────────────────────────────────
export async function withAccountDeletionContext<T>(input: {
  accountId: string;
  operation: AccountMutationOperation;
  execute: (context: AccountDeletionContext) => Promise<T>;
}): Promise<T> {
  const context = mintAccountWriteContext({
    kind: "deletion",
    accountId: input.accountId,
    operation: input.operation,
    leaseId: null,
    generation: 0,
  });
  try {
    return await input.execute(context as AccountDeletionContext);
  } finally {
    revokeAccountWriteContext(context);
  }
}

/**
 * THE ONE-TIME LEGACY BOOTSTRAP.
 *
 * Copying the pre-shared-store JSON files into the object store is a write to every account at once,
 * on a store that by definition contains none of them yet. There is no deletion to race — no account
 * exists to be deleted — and taking a lease per record would mean thousands of round-trips to defend
 * against a case that cannot occur.
 *
 * It still gets a context rather than a bypass, because the low-level writers must never have a
 * "sometimes no context" path: the guarantee that every account-linked write names its authority is
 * worth more than the one call site it costs here. Named narrowly and deliberately so that reaching
 * for it in a request path reads as obviously wrong.
 */
export async function withLegacyBootstrapContext<T>(
  accountId: string,
  execute: (context: AccountWriteContext) => Promise<T>,
): Promise<T> {
  // Minted per RECORD, with that record's real id. A single wildcard context covering the whole
  // migration would need `assertAccountWriteContext` to accept "any account", and that exemption
  // would then exist for every other caller too.
  const context = mintAccountWriteContext({
    kind: "provisioning",
    accountId,
    operation: "account_registration",
    leaseId: null,
    generation: 0,
  });
  try {
    return await execute(context);
  } finally {
    revokeAccountWriteContext(context);
  }
}

/**
 * Escape hatch for reads that must happen outside any window.
 *
 * Deliberately NOT exported as a context factory — it returns nothing. It exists so the intent of
 * "this path performs no account-linked write" can be stated where a reader would otherwise wonder
 * why there is no context.
 */
export const ACCOUNT_WRITE_CONTEXT_NOT_REQUIRED = Symbol("por1.readOnlyAccountPath");

/** Re-exported for the guard tests, which assert the runtime set matches the SQL constraint. */
export { ACCOUNT_MUTATION_OPERATIONS } from "./accountWriteContext";
export { AccountWriteContextViolation, assertAccountWriteContext } from "./accountWriteContext";
