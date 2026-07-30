// POR-1 WS5 — account lock and session semantics.
//
// The durable saga in the database is the source of truth for WHERE a deletion is. This module
// answers a narrower, hotter question: may this account authenticate, and may an existing session
// keep acting as that account?
//
// Two facts about this codebase make the question non-trivial:
//
//   • THE SESSION COOKIE IS SELF-CONTAINED. `getViewerContext` fabricates a synthetic session from
//     the encrypted cookie when the stored session object is missing. Deleting session objects
//     therefore does not, on its own, end a session. Something the cookie cannot forge has to say
//     no — and that is the account record, which the request already loads.
//
//   • THE ACCOUNT COOKIE CAN RESURRECT AN ACCOUNT. `/api/auth/login` falls back to the account
//     carried in `yorisou_account` when the store lookup misses. That fallback exists so a store
//     blip does not lock people out; after an erasure it would instead let a deleted account log
//     back in from a browser that still holds the cookie. The durable job outlives the account
//     record precisely so this case can be told apart from a blip.
//
// No `server-only`: the decision below is pure, and the permanent tests exercise it directly rather
// than a re-implementation of it.

/** Deletion states in which the account must be treated as gone rather than merely in progress. */
const ERASED_OR_ERASING = new Set([
  "database_erasure",
  "storage_erasure",
  "identity_erasure",
  "verifying",
  "completed",
]);

/** States in which the account is held but nothing irreversible has run yet. */
const HELD = new Set(["locked"]);

export type AccountAuthenticationDecision =
  | { allowed: true }
  | { allowed: false; reason: "account_deletion_in_progress" | "account_deleted" };

export type AccountAuthenticationInput = {
  /** Whether the account record was found in the durable store (false = cookie fallback only). */
  storeRecordFound: boolean;
  /** The lock marker written onto the account record at the `locked` transition. */
  deletionLockedAt: string | null | undefined;
  /**
   * The durable job state, when it was consulted. `null` means "no job"; `undefined` means "not
   * consulted" — which is NOT the same thing and must never be read as an absence of one.
   */
  durableDeletionState?: string | null;
};

/**
 * Decide whether an account may authenticate.
 *
 * Ordering matters: the lock marker is checked first because it is present on the record itself and
 * is therefore the cheapest and most direct signal. The durable state is only decisive for the case
 * the marker cannot cover — the record is already gone.
 */
export function decideAccountAuthentication(
  input: AccountAuthenticationInput,
): AccountAuthenticationDecision {
  if (input.deletionLockedAt) {
    return { allowed: false, reason: "account_deletion_in_progress" };
  }

  if (!input.storeRecordFound) {
    const state = input.durableDeletionState;
    if (state && ERASED_OR_ERASING.has(state)) {
      return { allowed: false, reason: "account_deleted" };
    }
    if (state && HELD.has(state)) {
      return { allowed: false, reason: "account_deletion_in_progress" };
    }
    // No job, or a job that was cancelled / failed before anything irreversible ran. The cookie
    // fallback keeps its original purpose: surviving a transient store miss.
    return { allowed: true };
  }

  return { allowed: true };
}

/**
 * Decide whether an ALREADY-ESTABLISHED session may continue to act as this account.
 *
 * Deliberately marker-only: this runs on every authenticated request, and a database round-trip per
 * request is not an acceptable price. The marker is written before any irreversible step, so the
 * window this cannot see is the window in which nothing has been erased yet.
 */
export function sessionMayActAsAccount(deletionLockedAt: string | null | undefined): boolean {
  return !deletionLockedAt;
}
