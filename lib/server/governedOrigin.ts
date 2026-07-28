import "server-only";

// UX-2R / CPC-1 — the one place that decides which origin a channel link points at.
//
// The LINE webhook hardcoded `https://yorisou.online/...`, so every reply sent a person to
// PRODUCTION regardless of which deployment produced it. That makes Preview channel parity
// unprovable — a Preview webhook would hand out Production links — and it is the kind of constant
// that silently becomes wrong the moment a second environment exists.
//
// The origin is resolved from trusted deployment configuration only. A forwarded host header is
// attacker-controlled and is never consulted: an open-redirect in a channel reply would send
// someone holding a private result identity to a host of the attacker's choosing.

const FALLBACK_ORIGIN = "https://yorisou.online";

/**
 * Resolve the canonical application origin for outbound channel links.
 *
 * Order: explicit app URL → Vercel-provided deployment URL → the production fallback. All three
 * are deployment-controlled; none comes from the request.
 */
export function resolveGovernedOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_ORIGIN?.trim();
  if (explicit && isSafeOrigin(explicit)) return stripTrailingSlash(explicit);

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const candidate = vercel.startsWith("http") ? vercel : `https://${vercel}`;
    if (isSafeOrigin(candidate)) return stripTrailingSlash(candidate);
  }

  return FALLBACK_ORIGIN;
}

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function isSafeOrigin(value: string) {
  try {
    const url = new URL(value);
    // https only, and no credentials, path, query or fragment smuggled into an "origin".
    if (url.protocol !== "https:") return false;
    if (url.username || url.password) return false;
    if (url.pathname !== "/" && url.pathname !== "") return false;
    if (url.search || url.hash) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Build an absolute channel URL.
 *
 * `path` must be an internal absolute path. A private result identity is only ever appended by an
 * explicit caller that has already established the recipient is the owner — this helper does not
 * add one, so a broadcast or generic reply cannot accidentally carry one.
 */
export function buildGovernedChannelUrl(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("governed_channel_path_invalid");
  }
  return `${resolveGovernedOrigin()}${path}`;
}
