import { NextResponse } from "next/server";

import { OPEN_TESTING_SESSION_COOKIE, storeFeedbackSubmission } from "@/lib/server/relationship-intelligence/service";

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asMetadata(value: unknown) {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const normalized: Record<string, string | number | boolean | null> = {};

  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean" || raw === null) {
      normalized[key] = raw;
    }
  }

  return normalized;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const topic = asString(body.topic);
    const message = asString(body.message);

    if (!topic || !message) {
      return NextResponse.json({ ok: false, error: "missing_feedback_fields" }, { status: 400 });
    }

    const result = await storeFeedbackSubmission({
      topic,
      routeContext: asString(body.routeContext),
      resultId: asString(body.resultId),
      overlayId: asString(body.overlayId),
      confidence: asString(body.confidence),
      message,
      contactEmail: asString(body.contactEmail),
      lineUserId: asString(body.lineUserId),
      source: asString(body.source),
      entrySource: asString(body.entrySource),
      metadata: asMetadata(body.metadata),
    });

    const response = NextResponse.json({
      ok: true,
      feedbackId: result.record.id,
      status: result.record.status,
      emailDeliveryStatus: result.record.emailDeliveryStatus,
    });
    response.cookies.set(OPEN_TESTING_SESSION_COOKIE, result.session.record.anonymousSessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "unexpected_error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
