import { NextResponse } from "next/server";

export const runtime = "nodejs";

const allowedEvents = new Set([
  "landing_viewed",
  "quiz_started",
  "question_progressed",
  "quiz_completed",
  "result_viewed",
  "line_cta_clicked",
  "share_save_clicked",
]);

export async function POST(request: Request) {
  let payload: Record<string, unknown> | null = null;

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    payload = null;
  }

  const event = typeof payload?.event === "string" ? payload.event : "";
  if (!allowedEvents.has(event)) {
    return NextResponse.json({ ok: false, error: "invalid_event" }, { status: 400 });
  }

  const record = {
    event,
    sessionId: typeof payload?.sessionId === "string" ? payload.sessionId : null,
    questionIndex: typeof payload?.questionIndex === "number" ? payload.questionIndex : null,
    resultKey: typeof payload?.resultKey === "string" ? payload.resultKey : null,
    source: typeof payload?.source === "string" ? payload.source : null,
    timestamp: new Date().toISOString(),
    referrer: request.headers.get("referer"),
    userAgent: request.headers.get("user-agent"),
  };

  console.log("[check-in-track]", record);

  return NextResponse.json({ ok: true, event });
}
