import { NextResponse } from "next/server";
// UX-2 / ICP-1 — persist in-progress answers so a refresh does not destroy the journey.

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { saveAttemptProgress, hashClaimToken } from "@/lib/server/assessmentAttemptStore";
import { readAttemptCookie } from "@/lib/server/assessmentAttemptCookie";
import { normalizeAnswerMap } from "@/lib/server/assessmentMethodContract";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PATCH(request: Request, context: Context) {
  const { id } = await context.params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });

  const raw = await request.text().catch(() => "");
  if (raw.length > 64 * 1024) return NextResponse.json({ error: "request_too_large" }, { status: 413 });
  let body: { answers?: unknown };
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: "invalid_request" }, { status: 400 }); }

  const answers = normalizeAnswerMap(body.answers);
  if (!answers) return NextResponse.json({ error: "invalid_answers" }, { status: 400 });

  const cookie = await readAttemptCookie();
  const viewer = await getViewerContext();
  const ownerId = viewer.account?.id || viewer.legacyAccount?.id || null;
  const tokenHash = cookie && cookie.attemptId === id ? hashClaimToken(cookie.token) : null;
  if (!tokenHash && !ownerId) return NextResponse.json({ error: "attempt_not_writable" }, { status: 403 });

  try {
    const count = await saveAttemptProgress({
      attemptId: id, claimTokenHash: tokenHash, ownerAccountId: ownerId,
      answers, answeredCount: Object.keys(answers).length,
    });
    return NextResponse.json({ saved: true, answeredCount: count });
  } catch (error) {
    const code = error instanceof Error ? error.message : "unknown";
    if (code === "attempt_not_found_or_not_writable") return NextResponse.json({ error: code }, { status: 404 });
    console.error("assessment progress save failed", { code });
    return NextResponse.json({ error: "attempt_save_failed" }, { status: 500 });
  }
}
