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
  const sessionId = url.searchParams.get("sessionId");
  const lineUserId = url.searchParams.get("lineUserId");

  if (!userProfileId && !authIdentityId && !sessionId && !lineUserId) {
    return NextResponse.json({ success: false, error: "missing_query" }, { status: 400 });
  }

  const timelineBundle = userProfileId
    ? await timelineService.getUnifiedTimelineByUserProfileId(userProfileId)
    : authIdentityId
      ? await timelineService.getUnifiedTimelineByAuthIdentityId(authIdentityId)
      : sessionId
        ? await timelineService.getUnifiedSupportWorkspaceTimelineBySessionId(sessionId)
        : await timelineService.getUnifiedTimelineByLineSubject(lineUserId!);

  return NextResponse.json({
    success: true,
    subject: timelineBundle.subject,
    source: timelineBundle.source,
    conversations: timelineBundle.conversations,
    events: timelineBundle.events,
    supportCases: timelineBundle.supportCases,
  });
}
