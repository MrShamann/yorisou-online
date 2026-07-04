import { NextResponse } from "next/server";

import { requireAdminRequestViewer } from "@/lib/server/foundation/access";
import { updateFeedbackSubmissionStatus } from "@/lib/server/relationship-intelligence/service";
import { isFeedbackSubmissionStatus } from "@/lib/server/relationship-intelligence/types";

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function POST(request: Request) {
  const viewer = await requireAdminRequestViewer();

  if (!viewer) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const feedbackId = asString(body.feedbackId);
    const status = asString(body.status);

    if (!feedbackId || !status) {
      return NextResponse.json({ ok: false, error: "missing_feedback_status_fields" }, { status: 400 });
    }
    if (!isFeedbackSubmissionStatus(status)) {
      return NextResponse.json({ ok: false, error: "invalid_feedback_status" }, { status: 400 });
    }

    const record = await updateFeedbackSubmissionStatus({
      feedbackId,
      status,
    });

    return NextResponse.json({ ok: true, feedbackId: record.id, status: record.status });
  } catch (error) {
    if (error instanceof Error && error.message === "feedback_not_found") {
      return NextResponse.json({ ok: false, error: "feedback_not_found" }, { status: 404 });
    }

    return NextResponse.json({ ok: false, error: "unexpected_error" }, { status: 500 });
  }
}
