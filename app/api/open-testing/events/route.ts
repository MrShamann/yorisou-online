import { NextResponse } from "next/server";

import { OPEN_TESTING_SESSION_COOKIE, ensureOpenTestingAnonymousSession, recordOpenTestingEvent } from "@/lib/server/relationship-intelligence/service";
import { isOpenTestingEventName } from "@/lib/server/relationship-intelligence/types";

export const runtime = "nodejs";

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
    const eventName = asString(body.eventName);

    if (!eventName) {
      return NextResponse.json({ ok: false, error: "missing_event_name" }, { status: 400 });
    }
    if (!isOpenTestingEventName(eventName)) {
      return NextResponse.json({ ok: false, error: "invalid_event_name" }, { status: 400 });
    }

    const session = await ensureOpenTestingAnonymousSession({
      source: asString(body.source),
      entrySource: asString(body.entrySource),
      route: asString(body.route),
    });
    const result = await recordOpenTestingEvent({
      eventName,
      anonymousSessionId: session.record.anonymousSessionId,
      route: asString(body.route),
      source: asString(body.source),
      entrySource: asString(body.entrySource),
      resultId: asString(body.resultId),
      overlayId: asString(body.overlayId),
      confidence: asString(body.confidence),
      reportType: asString(body.reportType),
      testVersion: asString(body.testVersion),
      metadata: asMetadata(body.metadata),
    });

    const response = NextResponse.json({ ok: true, eventId: result.event.id, anonymousSessionId: result.session.record.anonymousSessionId });
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
