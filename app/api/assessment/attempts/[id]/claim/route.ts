import { NextResponse } from "next/server";
// UX-2 / ICP-1 Priority 4 — claim an anonymous attempt + its result after authentication.
// Single-use, expiring, and unable to re-target an attempt that already has a different owner.

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { hashClaimToken } from "@/lib/server/assessmentAttemptStore";
// CPR-1 — see lib/server/assessment/fencedAttemptMutations.ts.
import { claimAttemptFenced } from "@/lib/server/assessment/fencedAttemptMutations";
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

  const cookie = await readAttemptCookie();
  if (!cookie || cookie.attemptId !== id) {
    return NextResponse.json({ error: "claim_token_missing" }, { status: 400 });
  }

  try {
    const resultRowId = await claimAttemptFenced({
      attemptId: id, claimTokenHash: hashClaimToken(cookie.token), ownerAccountId: ownerId,
    });
    const response = NextResponse.json({ claimed: true, resultRowId });
    clearAttemptCookie(response); // the token is spent
    return response;
  } catch (error) {
    const code = error instanceof Error ? error.message : "unknown";
    if (code === "attempt_already_claimed_by_another_owner") return NextResponse.json({ error: code }, { status: 409 });
    if (code === "claim_token_invalid" || code === "claim_token_expired") return NextResponse.json({ error: code }, { status: 403 });
    if (code === "attempt_not_found") return NextResponse.json({ error: code }, { status: 404 });
    console.error("assessment claim failed", { code });
    return NextResponse.json({ error: "claim_failed" }, { status: 500 });
  }
}
