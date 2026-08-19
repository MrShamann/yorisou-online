import { NextResponse } from "next/server";
// UX-2 / ICP-1 — read a PERSISTED result by its stable id. This is what allows /result to render
// from persisted identity instead of a URL query string.

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { getResultById, listResponsesForResult, deriveCurrentUnderstanding, eraseAssessmentResult, hashClaimToken, getAttemptForToken } from "@/lib/server/assessmentAttemptStore";
import { readAttemptCookie } from "@/lib/server/assessmentAttemptCookie";
import { sharingSchemaReady } from "@/lib/yorisou/sharing/access";
import { revokeSharesBySource } from "@/lib/server/platform/sharingCore/service";
import { sharingRepository } from "@/lib/server/sharing/store";
import { IMAIRO_SHARE_SOURCE_FAMILY } from "@/packs/yorisou/imairo/share";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });

  try {
    const result = await getResultById(id);
    if (!result) return NextResponse.json({ error: "result_not_found" }, { status: 404 });

    const viewer = await getViewerContext();
    const ownerId = viewer.account?.id || viewer.legacyAccount?.id || null;

    // Authorization: the owner, OR the anonymous holder of the attempt's claim token.
    let authorized = Boolean(ownerId && result.owner_account_id === ownerId);
    if (!authorized && !result.owner_account_id) {
      const cookie = await readAttemptCookie();
      if (cookie && cookie.attemptId === result.attempt_id) {
        authorized = Boolean(await getAttemptForToken(result.attempt_id, hashClaimToken(cookie.token)));
      }
    }
    if (!authorized) return NextResponse.json({ error: "result_not_found" }, { status: 404 });

    const responses = ownerId ? await listResponsesForResult(id, ownerId) : [];
    return NextResponse.json({
      result: {
        id: result.id,
        methodId: result.method_id,
        methodVersion: result.method_version,
        scoringVersion: result.scoring_version,
        resultId: result.result_id,
        overlayId: result.overlay_id,
        originalResultId: result.original_result_id,
        dimensionOutput: result.dimension_output,
        producedAt: result.produced_at,
        claimed: Boolean(result.owner_account_id),
      },
      understanding: deriveCurrentUnderstanding(result, responses),
      responses: responses.map((r) => ({
        id: r.id, type: r.response_type, correctedResultId: r.corrected_result_id,
        reasonCode: r.reason_code, createdAt: r.created_at,
        recommendationUsePermitted: r.recommendation_use_permitted,
      })),
    });
  } catch (error) {
    console.error("assessment result read failed", { code: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "result_read_failed" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const { id } = await context.params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  const viewer = await getViewerContext();
  const ownerId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  try {
    // SHR-1 — source-erasure propagation, REVOKE FIRST. A public derivative must not outlive its
    // source, and revoking before erasing makes that unconditionally true: if revocation fails the
    // erasure does not run (no dangling public card is possible); if erasure then fails, the
    // person's shares are dark but the source survives, and they can simply share again. Guarded
    // by schema readiness: a deployment where the SHR-1 migration was never declared applied has
    // no share store to revoke against — and could never have published, either.
    if (sharingSchemaReady()) {
      await revokeSharesBySource(IMAIRO_SHARE_SOURCE_FAMILY, id, sharingRepository);
    }
    const erased = await eraseAssessmentResult(id, ownerId);
    if (!erased) return NextResponse.json({ error: "result_not_found" }, { status: 404 });
    // Truthful: the answers, the interpretation responses and the result content are gone —
    // only a content-free tombstone remains.
    return NextResponse.json({ erased: true, answersErased: true, responsesErased: true });
  } catch (error) {
    console.error("assessment result erase failed", { code: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "result_erase_failed" }, { status: 500 });
  }
}
