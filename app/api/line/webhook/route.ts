import { NextResponse } from "next/server";

import type { LineWebhookEventRecord } from "@/lib/server/yorisouData";
import { createLineWebhookEvent, findAccountByLineUserId, findLineWebhookEventById } from "@/lib/server/yorisouData";
import { identityFoundationService } from "@/lib/server/foundation/identityService";
import { timelineService } from "@/lib/server/foundation/timelineService";
import {
  getLineMessagingConfigStatus,
  isLineMessagingConfigured,
  sendLineReplyMessage,
  verifyLineWebhookSignature,
} from "@/lib/server/yorisouLine";

export const runtime = "nodejs";

type LineWebhookEvent = {
  type?: string;
  mode?: string;
  timestamp?: number;
  webhookEventId?: string;
  replyToken?: string;
  postback?: {
    data?: string;
  };
  message?: {
    type?: string;
    text?: string;
  };
  source?: {
    type?: string;
    userId?: string;
  };
  deliveryContext?: {
    isRedelivery?: boolean;
  };
};

type LineWebhookPayload = {
  destination?: string;
  events?: LineWebhookEvent[];
};

function isSupportedEventType(eventType: string | undefined) {
  return eventType === "follow" || eventType === "unfollow" || eventType === "message" || eventType === "postback";
}

function eventTimestampToIso(timestamp: number | undefined) {
  if (!timestamp || Number.isNaN(timestamp)) {
    return null;
  }

  return new Date(timestamp).toISOString();
}

const PUBLIC_CHECK_IN_URL = "https://yorisou.online/check-in";
const PUBLIC_LINE_MINI_APP_URL = "https://yorisou.online/line/mini-app";

function buildReplyText(input: { eventType: string; accountMatched: boolean }) {
  if (input.eventType === "follow") {
    return input.accountMatched
      ? `おかえりなさい。\nクイックチェックの続きはここから始められます。\n\nチェックを始める：\n${PUBLIC_CHECK_IN_URL}\n\nLINEミニアプリ入口：\n${PUBLIC_LINE_MINI_APP_URL}`
      : `Yorisouへようこそ。\n今の自分の状態を軽く整理するクイックチェックを始められます。\n診断や固定的なラベルづけではなく、今の状態を理解するための入口です。\n\nチェックを始める：\n${PUBLIC_CHECK_IN_URL}\n\nLINEミニアプリ入口：\n${PUBLIC_LINE_MINI_APP_URL}`;
  }

  return `YorisouのLINEミニアプリから、クイックチェックをすぐ始められます。\n${PUBLIC_LINE_MINI_APP_URL}`;
}

async function syncLineWebhookEventToCanonical(record: LineWebhookEventRecord) {
  const lineUserId = record.lineUserId;

  if (!lineUserId) {
    return { ok: true as const, skipped: "missing_line_user_id" as const };
  }

  const matchedAccount = await findAccountByLineUserId(lineUserId);

  if (matchedAccount) {
    await identityFoundationService.ensureCanonicalUserForAccount(matchedAccount, "line_webhook");
  }

  const ensuredIdentity =
    (await identityFoundationService.getAuthIdentityByLineUserId(lineUserId)) ||
    (await identityFoundationService.ensureUnboundLineIdentity({
      lineUserId,
      source: "line_webhook",
    }));

  await timelineService.recordLineWebhookEvent({
    event: record,
    authIdentityId: ensuredIdentity.authIdentityId,
    userProfileId: ensuredIdentity.userProfileId,
  });

  return {
    ok: true as const,
    skipped: null,
    authIdentityId: ensuredIdentity.authIdentityId,
    userProfileId: ensuredIdentity.userProfileId,
  };
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    webhookEndpoint: "/api/line/webhook",
    ...getLineMessagingConfigStatus(),
  });
}

export async function POST(request: Request) {
  if (!isLineMessagingConfigured()) {
    return NextResponse.json({ ok: false, error: "line_messaging_not_configured" }, { status: 503 });
  }

  const signature = request.headers.get("x-line-signature");
  const body = await request.text();

  if (!verifyLineWebhookSignature({ body, signature })) {
    return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 401 });
  }

  let payload: LineWebhookPayload;

  try {
    payload = JSON.parse(body) as LineWebhookPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const events = payload.events || [];

  for (const event of events) {
    const eventType = event.type || "unknown";

    if (!isSupportedEventType(eventType)) {
      continue;
    }

    if (event.webhookEventId) {
      const existing = await findLineWebhookEventById(event.webhookEventId);

      if (existing) {
        try {
          await syncLineWebhookEventToCanonical(existing);
        } catch (error) {
          const message = error instanceof Error ? error.message : "line_webhook_canonical_sync_failed";
          return NextResponse.json({ ok: false, error: message }, { status: 500 });
        }
        continue;
      }
    }

    const lineUserId = event.source?.userId || null;
    const account = lineUserId ? await findAccountByLineUserId(lineUserId) : null;
    const accountMatched = Boolean(account);
    const accountId = account?.id || null;
    const shouldReply = Boolean(event.replyToken && (eventType === "message" || eventType === "follow" || eventType === "postback"));
    let replyStatus: "not_attempted" | "sent" | "failed" = "not_attempted";
    let replyError: string | null = null;

    if (shouldReply && event.replyToken) {
      const reply = await sendLineReplyMessage({
        replyToken: event.replyToken,
        text: buildReplyText({
          eventType,
          accountMatched,
        }),
      });

      if (reply.ok) {
        replyStatus = "sent";
      } else {
        replyStatus = "failed";
        replyError = reply.reason === "reply_failed" ? `status=${reply.status}` : reply.reason;
      }
    }

    const createdRecord = await createLineWebhookEvent({
      id: event.webhookEventId || undefined,
      accountId,
      lineUserId,
      sourceType: event.source?.type || null,
      eventType,
      messageType: event.message?.type || null,
      messageText: event.message?.text || null,
      postbackData: event.postback?.data || null,
      replyTokenPresent: Boolean(event.replyToken),
      replyStatus,
      replyError,
      webhookEventId: event.webhookEventId || null,
      deliveryMode: event.mode || null,
      isRedelivery: Boolean(event.deliveryContext?.isRedelivery),
      eventTimestamp: eventTimestampToIso(event.timestamp),
    });

    try {
      await syncLineWebhookEventToCanonical(createdRecord);
    } catch (error) {
      const message = error instanceof Error ? error.message : "line_webhook_canonical_sync_failed";
      return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, eventCount: events.length });
}
