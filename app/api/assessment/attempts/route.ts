import { NextResponse } from "next/server";
// UX-2 / ICP-1 — start a public assessment attempt. Anonymous is fully supported: the user
// receives real value before being asked to register (package Priority 4).

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { createClaimToken, startAttempt, getAttemptForToken, getAttemptForOwner } from "@/lib/server/assessmentAttemptStore";
import { readAttemptCookie, setAttemptCookie } from "@/lib/server/assessmentAttemptCookie";
import { CURRENT_STATE_METHOD_ID, CURRENT_STATE_METHOD_VERSION, CURRENT_STATE_REQUIRED_ANSWERS } from "@/lib/server/assessmentMethodContract";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function owner() {
  const viewer = await getViewerContext();
  return viewer.account?.id || viewer.legacyAccount?.id || null;
}

// Resume: returns the caller's own in-progress attempt, if any.
export async function GET() {
  try {
    const cookie = await readAttemptCookie();
    const ownerId = await owner();
    let attempt = null;
    if (cookie) {
      const { hashClaimToken } = await import("@/lib/server/assessmentAttemptStore");
      attempt = await getAttemptForToken(cookie.attemptId, hashClaimToken(cookie.token));
      if (!attempt && ownerId) attempt = await getAttemptForOwner(cookie.attemptId, ownerId);
    }
    if (!attempt) return NextResponse.json({ attempt: null });
    return NextResponse.json({
      attempt: {
        id: attempt.id,
        status: attempt.status,
        answers: attempt.answers,
        answeredCount: attempt.answered_count,
        requiredCount: attempt.required_count,
        claimed: Boolean(attempt.owner_account_id),
      },
    });
  } catch (error) {
    console.error("assessment attempt resume failed", { code: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "attempt_read_failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { entrySource?: string };
    const { token, hash } = createClaimToken();
    const attemptId = await startAttempt({
      methodId: CURRENT_STATE_METHOD_ID,
      methodVersion: CURRENT_STATE_METHOD_VERSION,
      requiredCount: CURRENT_STATE_REQUIRED_ANSWERS,
      claimTokenHash: hash,
      entrySource: typeof body.entrySource === "string" ? body.entrySource.slice(0, 64) : null,
    });
    const response = NextResponse.json({ attemptId, requiredCount: CURRENT_STATE_REQUIRED_ANSWERS }, { status: 201 });
    setAttemptCookie(response, { attemptId, token });
    return response;
  } catch (error) {
    const code = error instanceof Error ? error.message : "unknown";
    console.error("assessment attempt start failed", { code });
    return NextResponse.json({ error: "attempt_start_failed" }, { status: 500 });
  }
}
