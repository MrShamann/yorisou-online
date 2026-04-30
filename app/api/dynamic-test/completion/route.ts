import { NextResponse } from "next/server";

import { recordDynamicTestCompletion } from "@/lib/server/dynamicTestCompletionStore";

export const runtime = "nodejs";

type CompletionRequestBody = {
  sessionId?: string;
  locale?: "ja" | "en";
  personaId?: string;
  totalQuestions?: number;
  answeredQuestions?: number;
  sourceSurface?: string;
  entrySource?: string;
};

function normalizePositiveInteger(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

export async function POST(request: Request) {
  let body: CompletionRequestBody | null = null;

  try {
    body = (await request.json()) as CompletionRequestBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const sessionId = typeof body?.sessionId === "string" && body.sessionId.trim().length > 0 ? body.sessionId.trim() : `dte_session_${Date.now()}`;
  const personaId = typeof body?.personaId === "string" && body.personaId.trim().length > 0 ? body.personaId.trim() : "P01";
  const locale = body?.locale === "en" ? "en" : "ja";
  const totalQuestions = normalizePositiveInteger(body?.totalQuestions, 33);
  const answeredQuestions = normalizePositiveInteger(body?.answeredQuestions, totalQuestions);
  const sourceSurface = typeof body?.sourceSurface === "string" && body.sourceSurface.trim().length > 0 ? body.sourceSurface.trim() : "mini_app";
  const entrySource = typeof body?.entrySource === "string" && body.entrySource.trim().length > 0 ? body.entrySource.trim() : "mini_app";

  const record = await recordDynamicTestCompletion({
    sessionId,
    userId: null,
    locale,
    personaId,
    totalQuestions,
    answeredQuestions,
    sourceSurface,
    entrySource,
  });

  return NextResponse.json({
    ok: true,
    completionId: record.id,
  });
}
