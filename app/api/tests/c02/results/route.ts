import { NextResponse } from "next/server";

import { createC02SavedResult } from "@/lib/server/c02Results";
import { getViewerContext } from "@/lib/server/yorisouAuth";
import { resolveValidatedC02Result, validateC02Answers } from "@/lib/yorisou-tests/c02";

export async function POST(request: Request) {
  try {
    const viewer = await getViewerContext();
    const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id || null;
    if (!ownerAccountId) {
      return NextResponse.json({ error: "authentication_required" }, { status: 401 });
    }

    const body = (await request.json()) as { answers?: unknown };
    const validation = validateC02Answers(body.answers);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.code, message: validation.message }, { status: 400 });
    }

    const result = resolveValidatedC02Result(validation.answers);
    const saved = await createC02SavedResult({ ownerAccountId, answers: validation.answers, result });
    return NextResponse.json({ saved }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "c02_save_failed";
    console.error("c02 result save failed", { message });
    return NextResponse.json({ error: "c02_save_failed" }, { status: 500 });
  }
}
