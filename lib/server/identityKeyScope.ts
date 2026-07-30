// POR-1 WS2 — the object-store scope of the deletion adapter, as a standalone rule.
//
// The deletion adapter needs to remove objects from the shared store. What it must NOT become is a
// generic "delete any key" primitive reachable from a request path: that is a whole-bucket erasure
// tool one careless caller away from being pointed at everyone's data.
//
// So the scope is an allowlist of the five identity families, and everything else is refused —
// including anything that tries to escape a family with traversal or an empty path segment.
//
// The `by-line-user` prefix is the REAL one. An earlier version of this list named
// `accounts/by-line/`, which no writer has ever used — so the allowlist happily authorised a key
// family that did not exist while the family that did was outside it.
//
// This lives outside `yorisouData` (and without `server-only`) so the permanent tests exercise the
// REAL rule rather than a copy of it that can drift.

/** Root of the shared object store. Owned here so the scope rule and the store cannot disagree. */
export const SHARED_STORE_PREFIX = "phase1";

export const IDENTITY_KEY_PREFIXES = [
  `${SHARED_STORE_PREFIX}/accounts/by-id/`,
  `${SHARED_STORE_PREFIX}/accounts/by-email/`,
  `${SHARED_STORE_PREFIX}/accounts/by-line-user/`,
  `${SHARED_STORE_PREFIX}/sessions/`,
  `${SHARED_STORE_PREFIX}/password-resets/`,
] as const;

export type IdentityKeyRejection = "identity_key_invalid" | "identity_key_out_of_scope";

/** Null when the key is deletable by the identity adapter; otherwise the reason it is not. */
export function classifyIdentityKey(key: string): IdentityKeyRejection | null {
  if (typeof key !== "string" || key.length === 0) return "identity_key_invalid";
  // Traversal and empty segments are rejected before the prefix test, so a key that begins with an
  // allowed prefix cannot climb back out of it.
  if (key.includes("..") || key.includes("//")) return "identity_key_invalid";
  if (!IDENTITY_KEY_PREFIXES.some((prefix) => key.startsWith(prefix))) return "identity_key_out_of_scope";
  return null;
}

export function assertIdentityKey(key: string): void {
  const rejection = classifyIdentityKey(key);
  if (rejection) throw new Error(rejection);
}
