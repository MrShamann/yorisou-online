import { NextResponse } from "next/server";

import { requireAdminRequestViewer } from "@/lib/server/foundation/access";
import { evaluateOpenTestingFollowUps } from "@/lib/server/relationship-intelligence/service";

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function POST(request: Request) {
  const viewer = await requireAdminRequestViewer();

  if (!viewer) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const userProfileId = asString(body.userProfileId);
    const createLogs = body.createLogs === false ? false : true;
    const snapshot = await evaluateOpenTestingFollowUps({
      createLogs,
      userProfileId,
    });

    return NextResponse.json({
      ok: true,
      createLogs,
      ...snapshot,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unexpected_error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
