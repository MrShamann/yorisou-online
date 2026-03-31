import { NextResponse } from "next/server";

import { timelineService } from "@/lib/server/foundation/timelineService";
import { getViewerContext, resolveSupportWorkspaceViewerLookup } from "@/lib/server/yorisouAuth";

export async function GET() {
  try {
    const viewer = await getViewerContext();
    let canonicalSupportHistory:
      | Awaited<ReturnType<typeof timelineService.getSupportWorkspaceHistory>>
      | null = null;

    if (viewer.session?.id) {
      try {
        canonicalSupportHistory = await timelineService.getSupportWorkspaceHistory({
          sessionId: viewer.session.id,
          limit: 12,
        });
      } catch (error) {
        console.error("support history session lookup error:", error);
      }
    }

    if (!canonicalSupportHistory || canonicalSupportHistory.source !== "canonical") {
      const viewerLookup = resolveSupportWorkspaceViewerLookup(viewer);

      if (viewerLookup.supportReadTargetUserProfileId) {
        try {
          canonicalSupportHistory = await timelineService.getSupportWorkspaceHistory({
            userProfileId: viewerLookup.supportReadTargetUserProfileId,
            limit: 12,
          });
        } catch (error) {
          console.error("support history user lookup error:", error);
        }
      }
    }

    const resolvedHistory = canonicalSupportHistory || {
      source: "none" as const,
      conversation: null,
      supportCase: null,
      events: [],
    };

    return NextResponse.json({
      success: true,
      history: {
        source: resolvedHistory.source,
        conversationId: resolvedHistory.conversation?.conversationId || null,
        supportCaseId: resolvedHistory.supportCase?.supportCaseId || null,
        supportCaseTitle: resolvedHistory.supportCase?.title || null,
        latestActivityAt:
          resolvedHistory.supportCase?.latestActivityAt ||
          resolvedHistory.conversation?.latestActivityAt ||
          null,
        messages: resolvedHistory.events
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
