import { NextResponse } from "next/server";
// UX-2 / ICP-1 Priority 3 — SERVER-AUTHORITATIVE completion.
//
// The client no longer decides the outcome. The server validates coverage against the governed
// question bank, invokes the EXISTING governed scoring + public assignment unmodified, and
// persists an immutable result. A tampered payload cannot manufacture a false persisted result,
// because the result identifier is computed here from validated answers — never accepted from
// the request body.

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { scoreCurrentStateCheck } from "@/app/check-in/currentStateCheckV1";
import { buildPersistedResultEnvelope } from "@/lib/server/persistedDimensionSummary";
import { completeAttempt, hashClaimToken } from "@/lib/server/assessmentAttemptStore";
import { readAttemptCookie } from "@/lib/server/assessmentAttemptCookie";
import {
  normalizeAnswerMap,
  CURRENT_STATE_REQUIRED_ANSWERS,
  CURRENT_STATE_SCORING_VERSION,
  CURRENT_STATE_RESULT_SCHEMA_VERSION,
} from "@/lib/server/assessmentMethodContract";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request, context: Context) {
  const { id } = await context.params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });

  const raw = await request.text().catch(() => "");
  if (raw.length > 64 * 1024) return NextResponse.json({ error: "request_too_large" }, { status: 413 });
  let body: { answers?: unknown };
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: "invalid_request" }, { status: 400 }); }

  const answers = normalizeAnswerMap(body.answers);
  if (!answers) return NextResponse.json({ error: "invalid_answers" }, { status: 400 });
  if (Object.keys(answers).length < CURRENT_STATE_REQUIRED_ANSWERS) {
    return NextResponse.json(
      { error: "insufficient_coverage", answered: Object.keys(answers).length, required: CURRENT_STATE_REQUIRED_ANSWERS },
      { status: 422 },
    );
  }

  const cookie = await readAttemptCookie();
  const viewer = await getViewerContext();
  const ownerId = viewer.account?.id || viewer.legacyAccount?.id || null;
  const tokenHash = cookie && cookie.attemptId === id ? hashClaimToken(cookie.token) : null;
  if (!tokenHash && !ownerId) return NextResponse.json({ error: "attempt_not_writable" }, { status: 403 });

  // Governed scoring — executed on the server, unmodified.
  const scored = scoreCurrentStateCheck(answers as never);

  try {
    const resultRowId = await completeAttempt({
      attemptId: id,
      claimTokenHash: tokenHash,
      ownerAccountId: ownerId,
      answers,
      answeredCount: Object.keys(answers).length,
      resultId: scored.resultId,
      overlayId: scored.overlayId ?? null,
      // CPC-1: persist ONLY the bounded, versioned summary. The raw governed scoring output is
      // Record<SubdimensionCode, OptionScore[]> and every row carries questionId + optionId, so
      // persisting it verbatim would keep the user's answer trail reconstructable even after the
      // answers themselves are erased.
      dimensionOutput: buildPersistedResultEnvelope(),
      scoringVersion: CURRENT_STATE_SCORING_VERSION,
      resultSchemaVersion: CURRENT_STATE_RESULT_SCHEMA_VERSION,
    });
    return NextResponse.json({ resultRowId, resultId: scored.resultId }, { status: 201 });
  } catch (error) {
    const code = error instanceof Error ? error.message : "unknown";
    if (code === "attempt_not_found_or_not_writable") return NextResponse.json({ error: code }, { status: 404 });
    // Concealed 404 status (no expiry oracle at the transport level); the body names expiry for
    // the credential holder's own journey UI. See the save route for the full rationale.
    if (code === "attempt_expired") return NextResponse.json({ error: code }, { status: 404 });
    if (code === "attempt_incomplete_coverage") return NextResponse.json({ error: code }, { status: 422 });
    console.error("assessment completion failed", { code });
    return NextResponse.json({ error: "attempt_complete_failed" }, { status: 500 });
  }
}
