import { NextResponse } from "next/server";

import { requireAdminRequestViewer } from "@/lib/server/foundation/access";
import { timelineService } from "@/lib/server/foundation/timelineService";

export async function GET(request: Request) {
  const viewer = await requireAdminRequestViewer();

  if (!viewer) {
    return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const userProfileId = url.searchParams.get("userProfileId");
  const authIdentityId = url.searchParams.get("authIdentityId");

  if (!userProfileId && !authIdentityId) {
    return NextResponse.json({ success: false, error: "missing_query" }, { status: 400 });
  }

  const events = userProfileId
    ? await timelineService.listTimelineByUserProfileId(userProfileId)
    : await timelineService.listTimelineByAuthIdentityId(authIdentityId!);

  return NextResponse.json({
    success: true,
    events,
  });
}
