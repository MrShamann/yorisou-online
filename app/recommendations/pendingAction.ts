"use client";

// UX-2R / CPC-1 — recoverable recommendation actions.
//
// The first version generated `crypto.randomUUID()` on every click. That prevents a double tap
// while a request is in flight, and the server honours a replayed nonce — but the browser never
// replayed one. If the database committed the action and the HTTP reply was lost, the next click
// carried a NEW nonce and the server correctly treated it as a new action. So the one failure the
// nonce existed to prevent was the one it did not cover.
//
// The nonce is now created once per (result, item, action) and held until the server acknowledges,
// exactly as the pending interpretation intent is. Ambiguous failure keeps it, so a retry — by the
// user or after a reload — is a replay rather than a second write.

const KEY = "yorisou.recommendation.pending-actions.v1";
const TTL_MS = 10 * 60 * 1000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Store = Record<string, { nonce: string; createdAt: number }>;

function slot(resultRowId: string, itemId: string, action: string) {
  return `${resultRowId}:${itemId}:${action}`;
}

function read(): Store {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Store;
    // Drop expired slots on every read so a stale nonce cannot be replayed indefinitely.
    const now = Date.now();
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([, v]) =>
          v && typeof v.nonce === "string" && UUID_RE.test(v.nonce) &&
          typeof v.createdAt === "number" && now - v.createdAt <= TTL_MS,
      ),
    );
  } catch {
    return {};
  }
}

function write(store: Store) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // Storage unavailable (private mode, quota). The action still works; only cross-reload
    // recovery is lost, and the server-side unique index still prevents same-nonce duplicates.
  }
}

/**
 * Return the nonce for this action, creating one only if none is pending.
 *
 * A retry therefore reuses the SAME nonce, which is what makes it a replay on the server.
 */
export function acquireActionNonce(resultRowId: string, itemId: string, action: string): string {
  const store = read();
  const key = slot(resultRowId, itemId, action);
  const existing = store[key];
  if (existing) return existing.nonce;

  const nonce = crypto.randomUUID();
  store[key] = { nonce, createdAt: Date.now() };
  write(store);
  return nonce;
}

/** Release after the server confirms (created OR replayed), or on a terminal failure. */
export function releaseActionNonce(resultRowId: string, itemId: string, action: string) {
  const store = read();
  delete store[slot(resultRowId, itemId, action)];
  write(store);
}

/** True when an unacknowledged action is still pending — a reload can safely retry it. */
export function hasPendingActionNonce(resultRowId: string, itemId: string, action: string) {
  return Boolean(read()[slot(resultRowId, itemId, action)]);
}
