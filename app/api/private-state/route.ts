import { NextResponse } from "next/server";
import { addMemory, createCheckIn, listPrivateState, updateRecommendation, withdrawReflection } from "@/lib/server/privateAi";
import { getViewerContext } from "@/lib/server/yorisouAuth";

async function owner() { const viewer = await getViewerContext(); return viewer.account?.id || viewer.legacyAccount?.id || null; }

export async function GET(request: Request) {
  const accountId = await owner(); if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const resultId = new URL(request.url).searchParams.get("resultId") || undefined;
  try { return NextResponse.json({ state: await listPrivateState(accountId, resultId) }); } catch { return NextResponse.json({ error: "private_state_unavailable" }, { status: 503 }); }
}

export async function POST(request: Request) {
  const accountId = await owner(); if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const body = await request.json().catch(() => null) as { action?: string; resultId?: string; reflectionId?: string; content?: string; memoryType?: "user_note" | "selected_reflection" | "user_correction"; recommendationId?: string; status?: string; when?: "tomorrow" | "three_days" | "week" | "none" } | null;
  try {
    if (body?.action === "memory" && body.content && body.memoryType) await addMemory(accountId, { resultId: body.resultId, reflectionId: body.reflectionId, content: body.content, memoryType: body.memoryType });
    else if (body?.action === "recommendation" && body.recommendationId && body.status) await updateRecommendation(accountId, body.recommendationId, body.status);
    else if (body?.action === "check_in" && body.when) await createCheckIn(accountId, { resultId: body.resultId, when: body.when });
    else if (body?.action === "withdraw" && body.reflectionId) await withdrawReflection(accountId, body.reflectionId);
    else return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    return NextResponse.json({ state: await listPrivateState(accountId, body?.resultId) });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "private_state_failed" }, { status: 400 }); }
}
