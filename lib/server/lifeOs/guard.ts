import "server-only";

// OSF-1 — the one place every /api/life/* route resolves who is asking and whether it may
// proceed. Nine routes sharing this is what stops the nine from drifting into nine different answers.

import { NextResponse } from "next/server";
import { LIFE_OS_SCHEMA_READY_ENV } from "@/lib/life-os/access";
import { resolveLifeOsRouteAccess } from "@/lib/server/lifeOs/routeAccess";

export type LifeApiViewer = { accountId: string };

/**
 * Resolve the caller, or return the response that refuses them.
 *
 * ORDER MATTERS, and it is enforced by resolveLifeOsRouteAccess rather than restated here. The
 * activation state is read BEFORE any session lookup, so a closed deployment answers identically for
 * a signed-in and a signed-out caller and reveals nothing about who is asking. The schema-ready
 * declaration is checked before the body is read, so a write that cannot succeed is refused before
 * the person's text is accepted and then dropped.
 *
 * The account id comes from the resolved viewer and from nowhere else. No route reads an owner from
 * the request: there is no parameter a caller could set to act as someone else.
 *
 * INTERNAL is reachable through this path in true production — for an authenticated Founder/Admin
 * only, decided server-side. That is the §15 internal-beta door, and it is the same door the pages
 * and the navigation use.
 */
export async function requireLifeViewer(
  options: { mutation: boolean },
): Promise<{ viewer: LifeApiViewer } | { refusal: NextResponse }> {
  const route = await resolveLifeOsRouteAccess();
  if (!route.allowed) {
    // Route-concealing. Every denial reason collapses to the same 404 — "off", "you are not an
    // admin" and "you are not signed in" must be indistinguishable from outside, or the response
    // itself becomes an oracle for who is on the internal allowlist.
    return { refusal: NextResponse.json({ error: "not_found" }, { status: 404 }) };
  }
  if (options.mutation) {
    const declared = (process.env[LIFE_OS_SCHEMA_READY_ENV] ?? "").trim().toLowerCase();
    if (declared !== "true") {
      return {
        refusal: NextResponse.json(
          { error: "life_os_not_accepting_entries:denied_schema_not_ready" },
          { status: 503 },
        ),
      };
    }
  }
  if (!route.accountId) {
    return { refusal: NextResponse.json({ error: "authentication_required" }, { status: 401 }) };
  }
  return { viewer: { accountId: route.accountId } };
}

/**
 * Map a store/RPC error onto a status without leaking content.
 *
 * `osf1_*` names are the RPCs' own bounded exception vocabulary, safe to return: they name a rule
 * that was broken, never the content that broke it. Anything else collapses to a generic 500 with no
 * detail, because an unrecognised error is exactly the case where the message might quote a row.
 */
export function lifeApiError(error: unknown): NextResponse {
  const message = error instanceof Error ? error.message : "life_os_failed";
  if (message === "osf1_memory_confirmation_mismatch" || message === "osf1_memory_requires_confirmation") {
    return NextResponse.json({ error: message }, { status: 409 });
  }
  if (message.startsWith("osf1_")) return NextResponse.json({ error: message }, { status: 422 });
  return NextResponse.json({ error: "life_os_failed" }, { status: 500 });
}
