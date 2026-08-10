import { NextResponse } from "next/server";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { createRecommendationSet, createReturn } from "@/lib/server/recommendationGraph";
import { loadRecommendationSet, type RecommendationSurface } from "@/lib/server/recommendationStore";

// UX-2R / CPC-1 — CANONICAL MODE IS EXCLUSIVE.
//
// The presence of `resultRowId` selects the canonical path outright. Legacy `stateTags`,
// `resultId`, `overlayId`, payload keys and anything held in localStorage cannot influence the
// result: mixing them would let a caller pair a permitted row id with unrelated legacy inputs and
// receive recommendations the person's actual answer never authorized.
//
// Nothing here evaluates permission itself. The store calls RPCs that re-check the whole chain on
// every request, so consent is read in the present tense rather than inherited from whenever the
// page was rendered.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SURFACES: RecommendationSurface[] = ["result", "recommendations", "graph", "private_state", "line"];

async function owner() {
  const viewer = await getViewerContext();
  return viewer.account?.id || viewer.legacyAccount?.id || null;
}

export async function POST(request: Request) {
  const accountId = await owner();
  if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const resultRowId = typeof body.resultRowId === "string" ? body.resultRowId : null;

  if (resultRowId) {
    if (!UUID_RE.test(resultRowId)) return NextResponse.json({ error: "invalid_result" }, { status: 400 });

    const surface = SURFACES.includes(body.source as RecommendationSurface)
      ? (body.source as RecommendationSurface)
      : "recommendations";

    const loaded = await loadRecommendationSet(resultRowId, accountId, surface);
    if (loaded.outcome === "withheld") {
      // The person owns this result; their own answer is the gate, and saying so is the point.
      return NextResponse.json({ error: "recommendation_not_permitted" }, { status: 403 });
    }
    if (loaded.outcome !== "ok") {
      // One concealed refusal for invalid, missing, erased, unauthorized and cross-owner.
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ set: loaded.set }, { status: 200 });
  }

  // LEGACY MODE — isolated, and reachable only when no canonical identity was supplied.
  try {
    if (body.action === "return") {
      return NextResponse.json(
        await createReturn(accountId, String(body.setId), body.when as "tomorrow" | "three_days" | "week" | "none"),
      );
    }
    return NextResponse.json(
      await createRecommendationSet(
        accountId,
        body,
        typeof body.idempotencyKey === "string" ? body.idempotencyKey : crypto.randomUUID(),
      ),
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "recommendation_failed" },
      { status: 422 },
    );
  }
}
