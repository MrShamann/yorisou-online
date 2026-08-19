// POR-1 — THE GOVERNED ACCOUNT-WRITE CONTEXT.
//
// WHY A TYPE IS NOT ENOUGH.
//
// The obvious way to make low-level identity writes unreachable is to give them a branded parameter:
//
//     type AccountMutationContext = { __brand: "account-mutation" }
//
// That is a compile-time fiction. `{} as AccountMutationContext` satisfies it, `JSON.parse` produces
// one, and a caller in a hurry writes exactly that. A brand documents an intention; it does not
// enforce one, and the thing being enforced here is that a stale writer cannot resurrect a deleted
// person.
//
// So a context is unforgeable at RUNTIME. It is an opaque object whose identity is recorded in a
// module-private WeakSet at the moment it is minted, and every low-level writer checks membership
// rather than shape. A literal cast to the type is not in the set. A structural clone is not in the
// set. Only `mint` puts anything in it, and `mint` is reachable from exactly one module — enforced
// separately, and permanently, by the raw-write source guard.
//
// Contexts are also REVOKED when their window closes. That matters as much as minting: a context
// captured in a closure and used after the lease was released would authorise a write at precisely
// the moment the fence had stopped protecting it — the stale-write bug, wearing the fence's own
// badge. A revoked context fails the same check a forged one does.
//
// THREE KINDS, because three different things authorise them:
//
//   mutation     — an ordinary write to an EXISTING account. Authorised by a mutation lease.
//   provisioning — the creation of a NEW account. Also leased (a brand-new id has an open gate), but
//                  kept distinct: "may I create this?" and "may I still change this?" are different
//                  questions and should not share an answer.
//   deletion     — the deletion executor's own writes. Authorised by the EXECUTOR CLAIM, never by a
//                  lease: by then the gate is deliberately closed, and a deletion that had to take a
//                  lease against its own closed gate could never run at all.

// Deliberately free of `server-only`, matching por1RuntimeControls and accountMutationFenceRollout:
// the permanent tests must exercise the REAL guard rather than a restatement of it, and a guard that
// is only ever tested through a paraphrase is a guard nobody has actually tested.
//
// Importing it in a browser bundle would gain an attacker nothing anyway. It holds no secret and
// reads no environment; it is a WeakSet. The authority it represents lives on the server, in the
// writers that demand it — a client-side context would authorise nothing, because there is nothing
// client-side that it could be presented to.

export type AccountWriteContextKind = "mutation" | "provisioning" | "deletion";

/**
 * The closed operation set, mirrored from the migration's check constraint.
 *
 * A write with no code cannot take a lease, and a write that cannot take a lease is a hole in the
 * fence exactly its own width. Adding a member here is a deliberate act that must also be added to
 * the constraint — the two are verified against each other by the fence integration suite.
 */
export type AccountMutationOperation =
  | "support_profile_update"
  | "password_update"
  | "line_binding"
  | "account_profile_update"
  | "identity_mirror_sync"
  | "session_identity_upgrade"
  | "account_recovery"
  | "account_registration"
  | "line_primary_provisioning"
  | "password_reset_issue"
  | "session_account_binding"
  | "foundation_profile_update"
  | "foundation_identity_binding"
  // CPR-1 — the two assessment mutations that can CREATE or REASSIGN an owned assessment source.
  // They were outside the fence, which meant a claim issued during an account deletion could leave
  // the deleted account owning a live attempt and result. Account erasure enumerates owned sources
  // and must be able to trust that set stops growing once its gate is closed.
  | "assessment_attempt_claim"
  | "assessment_attempt_complete";

export const ACCOUNT_MUTATION_OPERATIONS: readonly AccountMutationOperation[] = [
  "support_profile_update",
  "password_update",
  "line_binding",
  "account_profile_update",
  "identity_mirror_sync",
  "session_identity_upgrade",
  "account_recovery",
  "account_registration",
  "line_primary_provisioning",
  "password_reset_issue",
  "session_account_binding",
  "foundation_profile_update",
  "foundation_identity_binding",
  "assessment_attempt_claim",
  "assessment_attempt_complete",
];

type ContextBody = {
  readonly kind: AccountWriteContextKind;
  readonly accountId: string;
  readonly operation: AccountMutationOperation;
  /** Null only for a deletion context, which is authorised by the executor claim instead. */
  readonly leaseId: string | null;
  readonly generation: number;
};

/** Opaque on purpose: callers pass it along and never construct or inspect one. */
export interface AccountWriteContext extends ContextBody {
  readonly [CONTEXT_TAG]: true;
}

const CONTEXT_TAG: unique symbol = Symbol("por1.accountWriteContext");

// The whole guarantee. Module-private, never exported, never serialised. Membership — not shape —
// is what `assert` tests, so no value that did not pass through `mint` can satisfy it.
const LIVE_CONTEXTS = new WeakSet<object>();

export type AccountMutationContext = AccountWriteContext & { readonly kind: "mutation" };
export type AccountProvisioningContext = AccountWriteContext & { readonly kind: "provisioning" };
export type AccountDeletionContext = AccountWriteContext & { readonly kind: "deletion" };

export class AccountWriteContextViolation extends Error {
  readonly reason: "context_required" | "context_revoked" | "context_account_mismatch";
  constructor(reason: "context_required" | "context_revoked" | "context_account_mismatch") {
    super(reason);
    this.name = "AccountWriteContextViolation";
    this.reason = reason;
  }
}

/**
 * Mint a live context.
 *
 * INTERNAL. Only `accountMutationLease.ts` may import this, and that restriction is enforced by the
 * raw-write source guard rather than by convention — a convention that is only written down is a
 * convention that is only followed until someone is in a hurry.
 */
export function mintAccountWriteContext(body: ContextBody): AccountWriteContext {
  const context = Object.freeze({ ...body, [CONTEXT_TAG]: true as const });
  LIVE_CONTEXTS.add(context);
  return context;
}

/**
 * Close the window.
 *
 * Called when the lease is released or the executor step ends. After this the context is inert, so a
 * reference captured in a closure and reused later cannot authorise anything — which is the stale
 * write this package exists to stop, and it must not become reachable simply because the stale
 * writer happens to be holding a context object.
 */
export function revokeAccountWriteContext(context: AccountWriteContext): void {
  LIVE_CONTEXTS.delete(context);
}

/**
 * The check every low-level account-linked write makes before touching anything.
 *
 * Throws rather than returning a boolean: a caller that forgets to check a returned flag is exactly
 * the caller this exists to catch, and an unguarded write must not be one ignored return value away.
 */
export function assertAccountWriteContext(
  context: AccountWriteContext | null | undefined,
  accountId?: string,
): asserts context is AccountWriteContext {
  if (!context || typeof context !== "object") {
    throw new AccountWriteContextViolation("context_required");
  }
  if (!LIVE_CONTEXTS.has(context)) {
    // Covers BOTH failures, and deliberately does not distinguish them to the caller: a forged
    // context and an expired one are the same answer — this write is not authorised.
    throw new AccountWriteContextViolation("context_revoked");
  }
  // A live context for account X must never be used to write account Y. Without this, one legitimate
  // write window would be a general-purpose licence for the duration of the request.
  if (accountId && context.accountId !== accountId) {
    throw new AccountWriteContextViolation("context_account_mismatch");
  }
}

/** True only for a context that is live right now. Used by diagnostics and by the fence tests. */
export function isLiveAccountWriteContext(value: unknown): value is AccountWriteContext {
  return typeof value === "object" && value !== null && LIVE_CONTEXTS.has(value);
}
