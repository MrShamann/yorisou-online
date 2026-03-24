import { NextResponse } from "next/server";

import { createLineWebhookEvent, findAccountByLineUserId, findLineWebhookEventById } from "@/lib/server/yorisouData";
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

function buildReplyText(input: { eventType: string; accountMatched: boolean }) {
  if (input.accountMatched) {
    return input.eventType === "follow"
      ? "YORISOUです。アカウント連携を確認しました。メッセージを受け付けています。"
      : "YORISOUです。メッセージを受け取りました。担当確認後にご連絡します。";
  }

  return input.eventType === "follow"
    ? "YORISOUです。メッセージを受け取りました。/support の LINE Connect からアカウント連携できます。"
    : "YORISOUです。メッセージを受け取りました。必要に応じて /support の LINE Connect からアカウント連携してください。";
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

    await createLineWebhookEvent({
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
  }

  return NextResponse.json({ ok: true, eventCount: events.length });
}
