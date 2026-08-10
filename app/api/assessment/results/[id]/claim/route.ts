import { NextResponse } from "next/server";
// UX-2 / ICP-1 — claim BY PERSISTED RESULT IDENTITY.
//
// The user-facing flow never handles attempt identity or claim-token material: the server reads the
// httpOnly attempt credential, verifies that this very attempt produced the requested result, and
// only then claims both for the authenticated account.

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { claimAttempt, getResultById, hashClaimToken } from "@/lib/server/assessmentAttemptStore";
import { readAttemptCookie, clearAttemptCookie } from "@/lib/server/assessmentAttemptCookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(_request: Request, context: Context) {
  const { id } = await context.params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });

  const viewer = await getViewerContext();
  const ownerId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  // getResultById already excludes erased rows (deleted_at is null).
  const result = await getResultById(id);
  if (!result) return NextResponse.json({ error: "result_not_found" }, { status: 404 });

  const cookie = await readAttemptCookie();

  // Idempotent for the same owner; never re-targets someone else's result.
  if (result.owner_account_id) {
    if (result.owner_account_id === ownerId) {
      const response = NextResponse.json({ claimed: true, resultRowId: id });
      // A lost first response can leave a spent credential in the browser. Clear it — but ONLY
      // when it belongs to this result's attempt, so an unrelated active attempt survives.
      if (cookie && cookie.attemptId === result.attempt_id) clearAttemptCookie(response);
      return response;
    }
    return NextResponse.json({ error: "result_not_found" }, { status: 404 });
  }

  // The credential must belong to THIS result's attempt.
  if (!cookie || cookie.attemptId !== result.attempt_id) {
    return NextResponse.json({ error: "claim_credential_missing" }, { status: 403 });
  }

  try {
    await claimAttempt({
      attemptId: result.attempt_id,
      claimTokenHash: hashClaimToken(cookie.token),
      ownerAccountId: ownerId,
    });
    const response = NextResponse.json({ claimed: true, resultRowId: id });
    clearAttemptCookie(response); // spent only after success
    return response;
  } catch (error) {
    const code = error instanceof Error ? error.message : "unknown";
    if (code === "attempt_already_claimed_by_another_owner") return NextResponse.json({ error: "result_not_found" }, { status: 404 });
    if (code === "claim_token_invalid" || code === "claim_token_expired") return NextResponse.json({ error: code }, { status: 403 });
    console.error("result claim failed", { code });
    return NextResponse.json({ error: "claim_failed" }, { status: 500 });
  }
}
