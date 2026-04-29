import { NextResponse } from "next/server";

import type { LineWebhookEventRecord } from "@/lib/server/yorisouData";
import {
  createLineWebhookEvent,
  findAccountByLineUserId,
  findLineWebhookEventById,
  updateLineWebhookEventMessageText,
  updateLineWebhookEventReplyState,
} from "@/lib/server/yorisouData";
import { identityFoundationService } from "@/lib/server/foundation/identityService";
import { timelineService } from "@/lib/server/foundation/timelineService";
import {
  buildYorisouCompanionLineReply,
  buildYorisouCompanionVoiceFallbackReply,
} from "@/lib/server/yorisouCompanionLineReply";
import {
  downloadLineMessageContent,
  getLineMessagingConfigStatus,
  isLineMessagingConfigured,
  sendLineReplyMessage,
  verifyLineWebhookSignature,
} from "@/lib/server/yorisouLine";
import { transcribeSupportVoice } from "@/lib/server/openclawVoiceBridge";

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
    id?: string;
    contentProvider?: {
      type?: string;
    };
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

async function buildReplyText(input: { eventType: string; accountMatched: boolean }) {
  return buildYorisouCompanionLineReply({
    eventType: input.eventType as "follow" | "message" | "postback",
    accountMatched: input.accountMatched,
    locale: "ja",
  });
}

async function buildLineVoiceFallbackReply(input: { accountMatched: boolean }) {
  return buildYorisouCompanionVoiceFallbackReply({
    accountMatched: input.accountMatched,
    locale: "ja",
  });
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

function getLineWebhookDedupeId(event: LineWebhookEvent) {
  return event.webhookEventId || event.message?.id || null;
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

    const dedupeId = getLineWebhookDedupeId(event);

    if (dedupeId) {
      const existing = await findLineWebhookEventById(dedupeId);

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
    const isAudioMessage = eventType === "message" && event.message?.type === "audio";
    const eventId = dedupeId || undefined;
    let messageText = event.message?.text || null;
    let createdRecord = await createLineWebhookEvent({
      id: eventId,
      accountId,
      lineUserId,
      sourceType: event.source?.type || null,
      eventType,
      messageType: event.message?.type || null,
      messageText: isAudioMessage ? null : messageText,
      postbackData: event.postback?.data || null,
      replyTokenPresent: Boolean(event.replyToken),
      replyStatus: "not_attempted",
      replyError: null,
      webhookEventId: event.webhookEventId || null,
      deliveryMode: event.mode || null,
      isRedelivery: Boolean(event.deliveryContext?.isRedelivery),
      eventTimestamp: eventTimestampToIso(event.timestamp),
    });

    if (isAudioMessage && event.message?.id) {
      try {
        const audio = await downloadLineMessageContent({ messageId: event.message.id });
        const transcription = await transcribeSupportVoice({
          audioBase64: audio.audioBase64,
          mimeType: audio.mimeType,
          fileName: audio.fileName,
          locale: "ja",
          retryCount: 0,
          utteranceIndex: null,
        });

        if (transcription.success) {
          messageText = transcription.transcript;
          const updated = await updateLineWebhookEventMessageText({
            id: createdRecord.id,
            messageText,
          });
          if (updated) {
            createdRecord = updated;
          }
        } else {
          messageText = null;
        }
      } catch (error) {
        console.error("line webhook voice transcription failed:", error);
        messageText = null;
      }
    }

    try {
      await syncLineWebhookEventToCanonical(createdRecord);
    } catch (error) {
      const message = error instanceof Error ? error.message : "line_webhook_canonical_sync_failed";
      return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }

    if (shouldReply && event.replyToken) {
      let replyText = await buildReplyText({
        eventType,
        accountMatched,
      });

      const replySourceMessage = messageText || event.message?.text || "";
      const shouldUseTranscriptReply = eventType === "message" && replySourceMessage.trim().length > 0;

      if (shouldUseTranscriptReply) {
        try {
          replyText = await buildYorisouCompanionLineReply({
            eventType,
            accountMatched,
            locale: "ja",
          });
        } catch (error) {
          console.error("line webhook companion reply error:", error);
          if (isAudioMessage) {
            replyText = await buildLineVoiceFallbackReply({ accountMatched });
          }
        }
      } else if (isAudioMessage) {
        replyText = await buildLineVoiceFallbackReply({ accountMatched });
      }

      const reply = await sendLineReplyMessage({
        replyToken: event.replyToken,
        text: replyText,
      });

      if (reply.ok) {
        await updateLineWebhookEventReplyState({
          id: createdRecord.id,
          replyStatus: "sent",
          replyError: null,
        });
      } else {
        const replyError = reply.reason === "reply_failed" ? `status=${reply.status}` : reply.reason;
        await updateLineWebhookEventReplyState({
          id: createdRecord.id,
          replyStatus: "failed",
          replyError,
        });
      }
    }
  }

  return NextResponse.json({ ok: true, eventCount: events.length });
}
