import { NextResponse } from "next/server";

import { timelineService } from "@/lib/server/foundation/timelineService";
import { getViewerContext, resolveSupportWorkspaceViewerLookup } from "@/lib/server/yorisouAuth";

export async function GET() {
  try {
    const viewer = await getViewerContext();
    const viewerLookup = resolveSupportWorkspaceViewerLookup(viewer);
    const canonicalSupportHistory = await timelineService.getSupportWorkspaceHistory({
      sessionId: viewer.session?.id || null,
      userProfileId: viewerLookup.supportReadTargetUserProfileId,
      limit: 12,
    });

    return NextResponse.json({
      success: true,
      history: {
        source: canonicalSupportHistory.source,
        conversationId: canonicalSupportHistory.conversation?.conversationId || null,
        supportCaseId: canonicalSupportHistory.supportCase?.supportCaseId || null,
        supportCaseTitle: canonicalSupportHistory.supportCase?.title || null,
        latestActivityAt:
          canonicalSupportHistory.supportCase?.latestActivityAt ||
          canonicalSupportHistory.conversation?.latestActivityAt ||
          null,
        messages: canonicalSupportHistory.events
          .filter((entry) => entry.eventType === "message" && typeof entry.contentText === "string" && entry.contentText.trim().length > 0)
          .map((entry) => ({
            id: entry.messageEventId,
            role: entry.direction === "outbound" ? ("assistant" as const) : ("user" as const),
            content: entry.contentText || "",
            apiContent: entry.contentText || "",
            createdAt: entry.recordedAt,
          })),
      },
    });
  } catch (error) {
    console.error("support history route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
