import { NextResponse } from "next/server";
// UX-2 / ICP-1 Priority 5 — CONFIRMED / CORRECTED / REJECTED / DEFERRED as genuinely distinct
// persisted events. A correction never rewrites the original machine result; a rejection
// withdraws downstream recommendation + continuity permission by default; "defer" is never
// treated as confirmation, and inactivity is never treated as anything at all.

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { recordInterpretationResponse, getResultById, listResponsesForResult, deriveCurrentUnderstanding } from "@/lib/server/assessmentAttemptStore";
import { findPublicArchetypeByCode } from "@/lib/yorisou/public-result";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TYPES = new Set(["confirmed", "corrected", "rejected", "deferred"]);
const REASONS = new Set(["not_me_now", "partly_true", "changed_recently", "wrong_emphasis", "other_bounded"]);
const ALLOWED_KEYS = ["responseType", "correctedResultId", "reasonCode"];

export async function POST(request: Request, context: Context) {
  const { id } = await context.params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });

  const viewer = await getViewerContext();
  const ownerId = viewer.account?.id || viewer.legacyAccount?.id;
  // Persisting a response is exactly the boundary where authentication is required.
  if (!ownerId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const raw = await request.text().catch(() => "");
  if (raw.length > 8 * 1024) return NextResponse.json({ error: "request_too_large" }, { status: 413 });
  let body: Record<string, unknown>;
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: "invalid_request" }, { status: 400 }); }

  const unknownKey = Object.keys(body).find((k) => !ALLOWED_KEYS.includes(k));
  if (unknownKey) return NextResponse.json({ error: "unexpected_field", field: unknownKey }, { status: 400 });

  const responseType = body.responseType;
  if (typeof responseType !== "string" || !TYPES.has(responseType)) {
    return NextResponse.json({ error: "invalid_response_type" }, { status: 400 });
  }
  const correctedResultId = body.correctedResultId;
  const reasonCode = body.reasonCode;

  if (responseType === "corrected") {
    // Bounded correction only: it must be a governed result identifier, never free personal text.
    if (typeof correctedResultId !== "string" || !findPublicArchetypeByCode(correctedResultId)) {
      return NextResponse.json({ error: "invalid_corrected_result" }, { status: 422 });
    }
  } else if (correctedResultId !== undefined) {
    return NextResponse.json({ error: "correction_not_applicable" }, { status: 400 });
  }
  if (reasonCode !== undefined && (typeof reasonCode !== "string" || !REASONS.has(reasonCode))) {
    return NextResponse.json({ error: "invalid_reason_code" }, { status: 400 });
  }

  try {
    const responseId = await recordInterpretationResponse({
      resultRowId: id,
      ownerAccountId: ownerId,
      responseType: responseType as "confirmed" | "corrected" | "rejected" | "deferred",
      correctedResultId: responseType === "corrected" ? (correctedResultId as string) : null,
      reasonCode: (reasonCode as string) ?? null,
    });
    const result = await getResultById(id);
    const responses = await listResponsesForResult(id, ownerId);
    return NextResponse.json(
      { responseId, understanding: result ? deriveCurrentUnderstanding(result, responses) : null },
      { status: 201 },
    );
  } catch (error) {
    const code = error instanceof Error ? error.message : "unknown";
    if (code === "result_not_found" || code === "result_not_owned") {
      return NextResponse.json({ error: "result_not_found" }, { status: 404 });
    }
    console.error("interpretation response failed", { code });
    return NextResponse.json({ error: "response_failed" }, { status: 500 });
  }
}
