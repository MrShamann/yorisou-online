import { NextResponse } from "next/server";
// UX-2 / ICP-1 — governed attempt abandonment ("はじめからやり直す").
//
// The claim token is derived SERVER-SIDE from the httpOnly cookie; client JavaScript never knows
// or transmits claim-token material. Abandoning erases the old answers, invalidates the old
// credential and records a bounded reason, so a restart can never orphan a live in-progress
// attempt.

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { abandonAttempt, hashClaimToken } from "@/lib/server/assessmentAttemptStore";
import { readAttemptCookie, clearAttemptCookie } from "@/lib/server/assessmentAttemptCookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(_request: Request, context: Context) {
  const { id } = await context.params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });

  const cookie = await readAttemptCookie();
  const viewer = await getViewerContext();
  const ownerId = viewer.account?.id || viewer.legacyAccount?.id || null;
  const tokenHash = cookie && cookie.attemptId === id ? hashClaimToken(cookie.token) : null;
  if (!tokenHash && !ownerId) return NextResponse.json({ error: "attempt_not_writable" }, { status: 403 });

  try {
    const abandoned = await abandonAttempt({
      attemptId: id,
      claimTokenHash: tokenHash,
      ownerAccountId: ownerId,
      reason: "user_restarted",
    });
    // Already abandoned or already gone -> treat as success so a double-click is harmless.
    const response = NextResponse.json({ abandoned: true, changed: abandoned });
    if (tokenHash) clearAttemptCookie(response);
    return response;
  } catch (error) {
    console.error("attempt abandon failed", { code: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "attempt_abandon_failed" }, { status: 500 });
  }
}
