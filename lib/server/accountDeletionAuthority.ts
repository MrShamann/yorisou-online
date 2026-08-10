import "server-only";

// POR-1 — may this account still be resolved, once its record is gone?
//
// THE DEFECT THIS MODULE EXISTS TO CLOSE.
//
// `getViewerContext` resolves an account in two steps: look the record up in the store, and if that
// misses, fall back to the `yorisou_account` cookie. The fallback is deliberate — the isolated
// Preview transport genuinely serves stale reads, and logging people out on a blip is its own
// defect. But the fallback returned a fully authoritative `AccountRecord` decrypted from the
// browser's own cookie, and the only check applied to it was `sessionMayActAsAccount`, which reads
// `deletionLockedAt` — a field that was `null` when the cookie was minted and that the server can
// never update in a cookie it no longer writes.
//
// So after an erasure the browser still held a perfectly valid, correctly encrypted token naming an
// account that no longer existed, and every surface behind `getViewerContext` answered it. That is
// how `GET /api/account/deletion-status` returned 200 to a person who had been deleted.
//
// An encrypted cookie proves exactly one thing: this server issued it, once. It does not prove the
// account still exists, that it is still authorized, or that the deletion is still in progress.
//
// WHY THIS IS A LOOKUP AND NOT A NEW CREDENTIAL.
//
// The durable deletion job already outlives the account record, and it was built to. It carries a
// one-way `owner_fingerprint` alongside the raw id, and `yorisou_account_deletion_status` falls back
// to that fingerprint once finalization drops the id — so the database can still answer "this
// account was erased" about an account it deliberately no longer names. `evaluateAuthenticationLock`
// has consulted that answer at the login door since WS5. The session door was simply never put
// behind it. Nothing new has to be minted, stored or invalidated; the fact was already there.
//
// WHAT THE COOKIE IS DEMOTED TO. A lookup hint. It names an account; the durable record decides
// whether that name still means anything.

import { rpc } from "./assessmentAttemptStore";
import {
  decideCookieRestoredViewer,
  type CookieRestoreDecision,
  type ViewerSurface,
} from "./accountDeletionLock";

export type { CookieRestoreDecision, ViewerSurface };

/**
 * Read the durable state bearing on this account.
 *
 * Deliberately `yorisou_account_deletion_status` and not `yorisou_account_deletion_resume_state`:
 * only the former falls back to `owner_fingerprint`, and the completed case — the one that matters
 * most here — is reachable by no other read. `resume_state` looks a job up by `owner_account_id`
 * alone and therefore reports "no job" about the exact deletions this gate has to refuse.
 */
async function readDeletionStateForAuthority(accountId: string): Promise<string | null> {
  const rows = await rpc<{ state: string }[] | { state: string }>(
    "yorisou_account_deletion_status",
    { p_owner_account_id: accountId },
  );
  const row = Array.isArray(rows) ? rows[0] : rows;
  const state = row?.state ?? null;
  // `none` is a SENTINEL, not a state. It is truthy, and reading it as one is how a "no job" answer
  // becomes an authorization decision it was never meant to make.
  return state === null || state === "none" ? null : state;
}

/**
 * Whether the erasure has crossed the point of no return — the RECORDED FACT, not a guess from the
 * state string. A job sitting in `failed_retryable` half-way through erasure has crossed; its state
 * string does not say so. Only consulted for live jobs: a completed one is already decided above,
 * and `resume_state` could not answer about it anyway.
 */
async function irreversibleStarted(accountId: string): Promise<boolean> {
  const row = await rpc<{ state?: string; irreversible?: boolean }>(
    "yorisou_account_deletion_resume_state",
    { p_owner_account_id: accountId },
  );
  const value = Array.isArray(row) ? row[0] : row;
  return value?.irreversible === true;
}

/**
 * Gather the durable facts and apply the rule.
 *
 * Called exclusively on the store-miss path, so it costs nothing on the hot path: when the record is
 * found, the record decides and this never runs. Both reads happen before the decision rather than
 * being fetched conditionally inside it — the policy lives in one pure function that can be tested
 * directly, and this function's only job is to give it complete information.
 *
 * Fails CLOSED when the durable state cannot be read. A store miss is already abnormal; refusing
 * there costs a person one retry, while allowing it hands an erased account back to whoever still
 * holds the cookie.
 */
export async function decideCookieRestoredAccount(input: {
  accountId: string;
  deletionLockedAt: string | null | undefined;
  surface: ViewerSurface;
}): Promise<CookieRestoreDecision> {
  let durableDeletionState: string | null;
  let crossed = false;
  try {
    durableDeletionState = await readDeletionStateForAuthority(input.accountId);
    // Only meaningful for a live job. A completed one is decided without it, and `resume_state`
    // could not answer about a completed job anyway — it looks jobs up by an id that is gone.
    if (durableDeletionState && durableDeletionState !== "completed") {
      crossed = await irreversibleStarted(input.accountId);
    }
  } catch (error) {
    console.error("deletion authority lookup failed; refusing cookie-restored account", {
      code: error instanceof Error ? error.message : "unknown",
    });
    return { resolves: false, reason: "deletion_state_unavailable" };
  }

  return decideCookieRestoredViewer({
    surface: input.surface,
    deletionLockedAt: input.deletionLockedAt,
    durableDeletionState,
    irreversibleStarted: crossed,
  });
}

/**
 * Whether a deletion job has completed for this account.
 *
 * Used by the status surface to refuse an erased identity even when the account record itself
 * resolved — which the stale-read transport makes possible, and which would otherwise be a 200
 * describing a person who no longer exists.
 */
export async function deletionHasCompleted(
  accountId: string,
  /**
   * The durable read. Injectable ONLY so the node suite can exercise this exact function — the
   * production default is the real one, and the same dependency-parameter pattern is used by
   * `executeDeletion`. There is no test-only environment bypass.
   */
  readDurableState: (accountId: string) => Promise<string | null> = readDeletionStateForAuthority,
): Promise<boolean> {
  try {
    return (await readDurableState(accountId)) === "completed";
  } catch {
    // Unknown is not "no". The caller treats this as a refusal.
    //
    // This is the property that makes it safe to put in front of deletion INTAKE: if the durable
    // state cannot be read we refuse to open a job, rather than opening one for an account that may
    // already be erased. A person who hits this pays one retry; the alternative resurrects an
    // erased identity for whoever still holds the cookie.
    return true;
  }
}
