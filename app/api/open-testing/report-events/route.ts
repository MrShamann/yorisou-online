import { NextResponse } from "next/server";

import { OPEN_TESTING_SESSION_COOKIE, recordReportEvent } from "@/lib/server/relationship-intelligence/service";
import type { ReportEventType } from "@/lib/server/relationship-intelligence/types";

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const eventType = asString(body.eventType) as ReportEventType | null;
    const reportType = asString(body.reportType);

    if (!eventType || !reportType) {
      return NextResponse.json({ ok: false, error: "missing_report_event_fields" }, { status: 400 });
    }

    const result = await recordReportEvent({
      eventType,
      reportType,
      route: asString(body.route),
      source: asString(body.source),
      entrySource: asString(body.entrySource),
      resultId: asString(body.resultId),
      overlayId: asString(body.overlayId),
      confidence: asString(body.confidence),
    });

    const response = NextResponse.json({ ok: true, reportEventId: result.record.id });
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
