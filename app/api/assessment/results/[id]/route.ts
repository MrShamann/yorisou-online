import { NextResponse } from "next/server";
// UX-2 / ICP-1 — read a PERSISTED result by its stable id. This is what allows /result to render
// from persisted identity instead of a URL query string.

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { getResultById, listResponsesForResult, deriveCurrentUnderstanding, eraseAssessmentResult, hashClaimToken, getAttemptForToken } from "@/lib/server/assessmentAttemptStore";
import { readAttemptCookie } from "@/lib/server/assessmentAttemptCookie";
import { sharingSchemaReady } from "@/lib/yorisou/sharing/access";
import { eraseAssessmentResultWithShares } from "@/lib/server/sharing/store";
import { connectionDerivativeSchemaReady } from "@/lib/yorisou/connection/access";
import { eraseAssessmentResultWithDerivatives } from "@/lib/server/connection/store";

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
    // SHR-1 — SOURCE ERASURE IS ONE TRANSACTION, NOT A SEQUENCE.
    //
    // The first version called revokeBySource and then eraseAssessmentResult as two separate
    // database transactions. Controller review found two real defects in that: the revoke ran
    // before ownership had been authoritatively established (and its RPC had no owner predicate at
    // all, so another person's link could be darkened by guessing their result id), and a publish
    // committing between the two transactions left an active link attached to an erased source.
    // Ordering statements in one process is not a concurrency guarantee.
    //
    // The atomic seam does all of it inside one transaction holding the source lock: verify live
    // AND owned first, revoke only this owner's derivatives, tombstone the source so no later
    // publish can resurrect a link, then run the canonical erasure — rolling back entirely if that
    // erasure does not succeed. A caller who does not own the result changes nothing anywhere.
    //
    // CPR-1 — A SECOND DERIVATIVE FAMILY, SO THE SEAM MOVED OUT ONE LAYER.
    //
    // A pair comparison is also derived from this result, and it must not survive its source any
    // more than a public link may. The P5 seam cancels invitations, dissolves pairs and empties
    // the derived comparison codes, then delegates to the ARCH-P4 share seam, which delegates to
    // the canonical erasure — one transaction, one rollback, nothing reimplemented.
    //
    // Schema-readiness picks the layer, and it is deliberately layered rather than replaced:
    // a deployment without the CPR-1 tables has no pair to dissolve, and one without SHR-1 has no
    // link to revoke, so each falls back to exactly the erasure its data model needs. Note the P5
    // check is the DERIVATIVE-schema question, not the feature gate: a deployment that ran the
    // migration and then switched the pair feature off still has pairs, and they still must go.
    const erased = connectionDerivativeSchemaReady()
      ? await eraseAssessmentResultWithDerivatives(id, ownerId)
      : sharingSchemaReady()
        ? await eraseAssessmentResultWithShares(id, ownerId)
        : await eraseAssessmentResult(id, ownerId);
    if (!erased) return NextResponse.json({ error: "result_not_found" }, { status: 404 });
    // Truthful: the answers, the interpretation responses and the result content are gone —
    // only a content-free tombstone remains.
    return NextResponse.json({ erased: true, answersErased: true, responsesErased: true });
  } catch (error) {
    console.error("assessment result erase failed", { code: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "result_erase_failed" }, { status: 500 });
  }
}
