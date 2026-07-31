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
 * The two surfaces that resolve a viewer from a cookie, and the reason they cannot share one rule.
 *
 * An ordinary surface must refuse a held or erased account outright. The deletion surface must still
 * show a person the deletion they asked for while it is genuinely running — including after
 * `identity_erasure`, when the account record it would otherwise resolve through is already gone.
 * Blinding someone to their own in-flight deletion is not a safety property; answering them after it
 * has completed is not a courtesy.
 */
export type ViewerSurface = "ordinary" | "deletion_surface";

export type CookieRestoreDecision =
  | { resolves: true }
  | {
      resolves: false;
      reason: "account_deleted" | "account_deletion_in_progress" | "deletion_state_unavailable";
    };

/** Live-job states in which the deletion surface must still be able to answer the person. */
const IN_FLIGHT = new Set([
  "requested",
  "identity_verified",
  "locked",
  "database_erasure",
  "storage_erasure",
  "identity_erasure",
  "verifying",
  "failed_retryable",
]);

/**
 * POR-1 — decide whether an account resolved ONLY from the browser's own cookie may be treated as a
 * live account.
 *
 * This is the rule that was missing. An encrypted cookie proves exactly one thing: this server
 * issued it, once. It does not prove the account still exists, that it is still authorized, or that
 * the deletion is still in progress. The durable job proves all three, and it outlives the account
 * record precisely so it can.
 *
 * Pure, and deliberately so: the permanent tests exercise this directly rather than a
 * re-implementation of it. The reads that feed it live in `accountDeletionAuthority`.
 */
export function decideCookieRestoredViewer(input: {
  surface: ViewerSurface;
  /** The marker carried in the cookie — which is to say, the marker as of when it was minted. */
  deletionLockedAt: string | null | undefined;
  /** `null` means no job bears on this account at all. */
  durableDeletionState: string | null;
  /** `irreversible_started_at is not null` — the recorded FACT, not a guess from the state string. */
  irreversibleStarted: boolean;
}): CookieRestoreDecision {
  // COMPLETED IS ABSOLUTE, on every surface. The identity is gone; there is nothing left that any
  // caller is entitled to be told about it, and the person's own browser is the least authoritative
  // thing in the exchange. Reachable only because the status read falls back to `owner_fingerprint`
  // once finalization drops the account id.
  if (input.durableDeletionState === "completed") {
    return { resolves: false, reason: "account_deleted" };
  }

  if (input.surface === "deletion_surface") {
    // Requirement A. The record may already be erased — this IS the `identity_erasure`/`verifying`
    // window — and the job is the only thing left that can speak for the person.
    if (input.durableDeletionState && IN_FLIGHT.has(input.durableDeletionState)) {
      return { resolves: true };
    }
  } else if (input.durableDeletionState && input.irreversibleStarted) {
    // Past the crossing the record's absence IS the erasure, not a blip — and the cookie's marker
    // cannot say so, because it was minted before the marker existed. This also covers the case the
    // state string alone gets wrong: a job that failed TERMINALLY half-way through erasure is
    // neither `ERASED_OR_ERASING` nor `HELD`, so without the recorded fact it read as "allow".
    return { resolves: false, reason: "account_deleted" };
  }

  // Everything else — no job at all, a cancelled one, a job that failed before anything irreversible
  // ran — keeps the fallback's original purpose: surviving a transient store miss. That rule is
  // `decideAccountAuthentication`, reused rather than restated.
  const decision = decideAccountAuthentication({
    storeRecordFound: false,
    // The hold is the ordinary surface's refusal, and the deletion surface's whole reason to exist.
    deletionLockedAt: input.surface === "deletion_surface" ? null : input.deletionLockedAt,
    durableDeletionState: input.durableDeletionState,
  });

  return decision.allowed ? { resolves: true } : { resolves: false, reason: decision.reason };
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
