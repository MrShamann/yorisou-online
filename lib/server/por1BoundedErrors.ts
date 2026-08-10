// POR-1 — the ONE place that turns a PostgREST failure into a bounded Yorisou error code.
//
// WHY THIS EXISTS, WRITTEN DOWN SO IT IS NOT UNDONE.
//
// The Production deletion incident of 2026-08-10 stored `assessment_persistence_failed:400` for two
// stranded jobs, and that code was a LIE OF OMISSION: the database had raised a real, bounded token
// and the caller threw it away. The recogniser was an inline regex whose deletion family was written
// `\bdeletion_[a-z_]+`. JavaScript's `\b` sits between a word character and a non-word character —
// and `_` IS a word character. So inside `account_deletion_erase_not_authorized` there is no
// boundary before `deletion_`, the alternative could never match, and the real reason degraded to a
// generic fallback naming the wrong subsystem entirely.
//
// The cost was not cosmetic. It cost the incident its root cause: by the time anyone looked, the
// only surviving evidence said "assessment persistence" about an account-deletion erasure.
//
// So: no `\b` anywhere in this module. Boundaries are stated explicitly as "start of string, or a
// character that cannot be part of a token".
//
// WHAT MAY LEAVE THIS MODULE. Only two things:
//   1. a token that begins with one of the governed prefixes below, or
//   2. a bounded infrastructure code from the fixed union.
// Never raw database text, never a PostgREST body, never `detail`/`hint`, never an identifier,
// never SQL, never anything that could carry a secret. That is a property of construction, not of
// care: the return value is either a matched governed token or a constant.
//
// Deliberately free of `server-only` so the node suite exercises the REAL resolver rather than a
// restatement of it — the same repo pattern as por1RuntimeControls and sharedStoreBoundary.

/**
 * Governed error namespaces, longest-first.
 *
 * Order matters. `account_deletion_` must be tried before any shorter prefix that could match a
 * suffix of it, so the token is never truncated to a shorter, wrong family.
 */
export const GOVERNED_ERROR_PREFIXES = [
  "account_deletion_",
  "account_erasure_",
  "account_mutation_",
  "interpretation_",
  "recommendation_",
  "line_activity_",
  "line_subject_",
  "line_event_",
  "identity_link",
  "assessment_",
  "attempt_",
  "result_",
  "claim_",
] as const;

/** Bounded infrastructure classifications. A closed union: nothing else may be produced. */
export type BoundedInfrastructureCode =
  | "postgrest_rpc_unavailable"
  | "postgrest_unauthorized"
  | "postgrest_forbidden"
  | "postgrest_unreachable"
  | "postgrest_unexpected";

/** A token cannot be longer than this. A governed code is short; anything longer is not one. */
const MAX_TOKEN_LENGTH = 96;

/** Characters that may appear INSIDE a token. Anything else terminates it. */
const TOKEN_BODY = /[a-z0-9_]/;

function isTokenChar(ch: string | undefined): boolean {
  return ch !== undefined && TOKEN_BODY.test(ch);
}

/**
 * Extract a single governed error token, or null.
 *
 * Scans for each governed prefix at a real token START — that is, at index 0 or immediately after a
 * character that cannot be part of a token. This is the explicit replacement for `\b`, which cannot
 * express "preceded by an underscore counts as being inside a token".
 */
export function extractBoundedErrorToken(text: string): string | null {
  if (typeof text !== "string" || text.length === 0) return null;
  const haystack = text.toLowerCase();

  let best: { index: number; token: string } | null = null;

  for (const prefix of GOVERNED_ERROR_PREFIXES) {
    let from = 0;
    for (;;) {
      const at = haystack.indexOf(prefix, from);
      if (at === -1) break;
      from = at + 1;

      // Explicit left boundary: start of string, or a non-token character before it.
      if (at > 0 && isTokenChar(haystack[at - 1])) continue;

      // Explicit right boundary: consume token characters to the end of the token.
      let end = at + prefix.length;
      while (end < haystack.length && isTokenChar(haystack[end])) end += 1;

      const token = haystack.slice(at, end);
      if (token.length > MAX_TOKEN_LENGTH) continue;
      // A bare prefix with nothing after it is a namespace, not a code. `identity_link` is the one
      // governed family whose name IS the prefix, so it is allowed to stand alone.
      if (token === prefix && prefix.endsWith("_")) continue;

      // Earliest match in the message wins; the database puts the code first.
      if (!best || at < best.index) best = { index: at, token };
      break;
    }
  }

  return best ? best.token : null;
}

/**
 * Map a provider-level failure to a bounded infrastructure code, or null when the provider did not
 * fail structurally (i.e. PostgreSQL ran and raised, and the token carries the meaning).
 *
 * `PGRST202` is PostgREST's "no function matches" — the schema cache does not know the signature, or
 * it genuinely is not there. Either way the RPC is unavailable, which is a DIFFERENT fact from a
 * database refusal and must never be collapsed into one.
 */
export function classifyProviderFailure(
  status: number,
  providerCode: string | null | undefined,
): BoundedInfrastructureCode | null {
  if (providerCode === "PGRST202" || status === 404) return "postgrest_rpc_unavailable";
  if (status === 401) return "postgrest_unauthorized";
  if (status === 403) return "postgrest_forbidden";
  return null;
}

/** Parse a PostgREST error body and return ONLY its `message`, never `detail`/`hint`/`code` text. */
export function providerMessageOf(bodyText: string): { message: string; code: string | null } {
  try {
    const parsed = JSON.parse(bodyText) as Record<string, unknown>;
    return {
      message: typeof parsed.message === "string" ? parsed.message : "",
      code: typeof parsed.code === "string" ? parsed.code : null,
    };
  } catch {
    // Not JSON. The raw text is still scanned for a token, but it is never returned.
    return { message: bodyText, code: null };
  }
}

/**
 * The bounded code for a failed RPC response.
 *
 * Precedence is deliberate: a governed token beats an infrastructure guess, because a database that
 * answered with a real reason has told us more than the transport can.
 */
export function boundedRpcErrorCode(input: { status: number; bodyText: string }): string {
  const { message, code } = providerMessageOf(input.bodyText);

  const token = extractBoundedErrorToken(message) ?? extractBoundedErrorToken(input.bodyText);
  if (token) return token;

  const infrastructure = classifyProviderFailure(input.status, code);
  if (infrastructure) return infrastructure;

  // Honest and bounded: the transport answered, the database did not give us a governed reason, and
  // we refuse to invent one. Naming a subsystem we did not touch is exactly the defect above.
  return `postgrest_unexpected:${Number.isFinite(input.status) ? input.status : 0}`;
}

/** True when a bounded code represents "the RPC could not be reached/resolved", not a refusal. */
export function isInfrastructureCode(code: string): boolean {
  return (
    code === "postgrest_rpc_unavailable" ||
    code === "postgrest_unauthorized" ||
    code === "postgrest_forbidden" ||
    code === "postgrest_unreachable" ||
    code.startsWith("postgrest_unexpected")
  );
}
