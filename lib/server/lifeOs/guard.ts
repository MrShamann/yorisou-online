import "server-only";

// OSF-1 PHASE B — the one place every /api/life/* route resolves who is asking and whether it may
// proceed. Six routes sharing this is what stops the six from drifting into six different answers.

import { NextResponse } from "next/server";
import { getViewerContext } from "@/lib/server/yorisouAuth";
import { lifeOsAccess, lifeOsMutationAccess } from "@/lib/life-os/access";

export type LifeApiViewer = { accountId: string };

/**
 * Resolve the caller, or return the response that refuses them.
 *
 * ORDER MATTERS. The feature gate is checked BEFORE the session, so a closed route answers
 * identically for a signed-in and a signed-out caller — it reveals nothing about who is asking. The
 * mutation gate is checked before the body is even read, so a write that cannot succeed is refused
 * before the person's text is accepted and then dropped.
 *
 * The account id comes from the encrypted session cookie and from nowhere else. No route reads an
 * owner from the request: there is no parameter a caller could set to act as someone else.
 */
export async function requireLifeViewer(
  options: { mutation: boolean },
): Promise<{ viewer: LifeApiViewer } | { refusal: NextResponse }> {
  if (!lifeOsAccess().allowed) {
    return { refusal: NextResponse.json({ error: "not_found" }, { status: 404 }) };
  }
  if (options.mutation) {
    const mutation = lifeOsMutationAccess();
    if (!mutation.allowed) {
      return {
        refusal: NextResponse.json(
          { error: `life_os_not_accepting_entries:${mutation.reason}` },
          { status: 503 },
        ),
      };
    }
  }
  const context = await getViewerContext();
  const accountId = context.account?.id || context.legacyAccount?.id || null;
  if (!accountId) {
    return { refusal: NextResponse.json({ error: "authentication_required" }, { status: 401 }) };
  }
  return { viewer: { accountId } };
}

/** Map a store/RPC error onto a status without leaking content. */
export function lifeApiError(error: unknown): NextResponse {
  const message = error instanceof Error ? error.message : "life_os_failed";
  if (message === "osf1_memory_confirmation_mismatch" || message === "osf1_memory_requires_confirmation") {
    return NextResponse.json({ error: message }, { status: 409 });
  }
  if (message.startsWith("osf1_")) return NextResponse.json({ error: message }, { status: 422 });
  return NextResponse.json({ error: message }, { status: 500 });
}
