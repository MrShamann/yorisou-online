import { NextResponse } from "next/server";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { actionRecommendation, getRecommendationSet, reportRecommendation } from "@/lib/server/recommendationGraph";
import {
  recordRecommendationAction,
  type RecommendationAction,
  type RecommendationSurface,
} from "@/lib/server/recommendationStore";

// UX-2R / CPC-1 — canonical recommendation mutations.
//
// `resultRowId` selects the canonical path. Eligibility is re-checked inside the RPC on EVERY
// action, so a person who rejects or defers their interpretation after receiving recommendations
// immediately stops being able to add new signals — permission is present tense, not a token
// issued once at page load.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ACTIONS: RecommendationAction[] = [
  "saved", "try_intent", "tried", "helpful", "not_helpful", "not_relevant", "hidden", "reported", "resource_opened",
];
const SURFACES: RecommendationSurface[] = ["result", "recommendations", "graph", "private_state", "line"];

async function owner() {
  const viewer = await getViewerContext();
  return viewer.account?.id || viewer.legacyAccount?.id || null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const account = await owner();
  if (!account) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  try {
    return NextResponse.json(await getRecommendationSet(account, (await params).id));
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const account = await owner();
  if (!account) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const id = (await params).id;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (typeof body.resultRowId === "string") {
    if (!UUID_RE.test(id)) return NextResponse.json({ error: "not_found" }, { status: 404 });
    const action = body.action as RecommendationAction;
    if (!ACTIONS.includes(action)) return NextResponse.json({ error: "invalid_action" }, { status: 400 });

    const nonce = typeof body.idempotencyKey === "string" && UUID_RE.test(body.idempotencyKey)
      ? body.idempotencyKey
      : null;
    const surface = SURFACES.includes(body.source as RecommendationSurface)
      ? (body.source as RecommendationSurface)
      : "graph";

    const result = await recordRecommendationAction({
      itemId: id,
      ownerAccountId: account,
      action,
      surface,
      intentNonce: nonce,
    });
    if (result.outcome === "withheld") {
      return NextResponse.json({ error: "recommendation_not_permitted" }, { status: 403 });
    }
    if (result.outcome !== "ok") return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ actionId: result.actionId }, { status: 201 });
  }

  // LEGACY MODE — isolated.
  try {
    if (body.action === "report") {
      return NextResponse.json(await reportRecommendation(account, id, String(body.reason)));
    }
    return NextResponse.json(
      await actionRecommendation(
        account,
        id,
        String(body.action),
        typeof body.idempotencyKey === "string" ? body.idempotencyKey : crypto.randomUUID(),
        typeof body.note === "string" ? body.note : undefined,
      ),
    );
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "action_failed" }, { status: 422 });
  }
}
