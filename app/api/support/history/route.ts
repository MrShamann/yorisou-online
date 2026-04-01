import { NextResponse } from "next/server";

import { timelineService } from "@/lib/server/foundation/timelineService";
import { getViewerContext, inspectEncodedSessionCookieForAudit, resolveSupportWorkspaceViewerLookup, SESSION_COOKIE } from "@/lib/server/yorisouAuth";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const includeDebug = url.searchParams.get("debug") === "1";
    const viewer = await getViewerContext();
    const viewerLookup = resolveSupportWorkspaceViewerLookup(viewer);
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
    const rawSessionCookie =
      request.headers
        .get("cookie")
        ?.split(";")
        .map((entry) => entry.trim())
        .find((entry) => entry.startsWith(`${SESSION_COOKIE}=`))
        ?.split("=")
        .slice(1)
        .join("=") || undefined;
    const debugSession = includeDebug
      ? await inspectEncodedSessionCookieForAudit({
          encodedSessionCookie: rawSessionCookie,
        })
      : null;

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
      ...(includeDebug
        ? {
            debug: {
              viewerSessionId: viewer.session?.id || null,
              viewerUserId: viewer.session?.userId || null,
              rawSessionCookiePresent: Boolean(rawSessionCookie),
              cookieDecoded: debugSession?.cookieDecoded || false,
              cookieSessionId: debugSession?.sessionPayload?.id || null,
              viewerLookup,
              resolvedHistorySource: resolvedHistory.source,
            },
          }
        : {}),
    });
  } catch (error) {
    console.error("support history route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
