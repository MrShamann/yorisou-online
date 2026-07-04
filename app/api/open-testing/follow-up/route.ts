import { NextResponse } from "next/server";

import { requireAdminRequestViewer } from "@/lib/server/foundation/access";
import { evaluateOpenTestingFollowUps } from "@/lib/server/relationship-intelligence/service";

export async function GET(request: Request) {
  const viewer = await requireAdminRequestViewer();

  if (!viewer) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const createLogs = url.searchParams.get("createLogs") === "1";
  const userProfileId = url.searchParams.get("userProfileId");
  const snapshot = await evaluateOpenTestingFollowUps({
    createLogs,
    userProfileId,
  });

  return NextResponse.json({ ok: true, ...snapshot });
}
