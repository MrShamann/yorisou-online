import type { SupportAssistantLocale, SupportIssueType } from "@/lib/ai/support/scenario-engine";
import type { HinataThreadState, HinataUserState } from "@/lib/server/hinataMemory";
import type { OpenClawNeedsSignalArtifact } from "@/lib/server/openclawNeedsInsight";
import type { OpenClawReflectionArtifact } from "@/lib/server/openclawReflection";

const learningBaseUrl = process.env.OPENCLAW_VOICE_BASE_URL?.trim() || "";
const learningToken = process.env.OPENCLAW_VOICE_TOKEN?.trim() || "";
const supportChatUrl = process.env.OPENCLOUD_SUPPORT_CHAT_URL?.trim() || "";
const supportChatToken = process.env.OPENCLOUD_SUPPORT_CHAT_TOKEN?.trim() || "";
const openClawOhioLearningFallbackUrl = "https://loop-some-hawk-trinity.trycloudflare.com";

export type OpenClawFoundationConversationFeedRecord = {
  conversationId: string;
  supportCaseId: string;
  ownerKey: string | null;
  locale: SupportAssistantLocale;
  subject: string;
  conversationStatus: "active";
  currentTopic: string;
  relationshipStage: string;
  latestActivityAt: string;
  createdAt: string;
  updatedAt: string;
};

export type OpenClawFoundationMessageEventFeedRecord = {
  messageEventId: string;
  conversationId: string;
  supportCaseId: string;
  locale: SupportAssistantLocale;
  eventType: "support_turn";
  messageType: "support_reply";
  userMessageSummary: string;
  assistantMessageSummary: string;
  scenario: SupportIssueType | string;
  actionIds: string[];
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type OpenClawFoundationSupportCaseFeedRecord = {
  supportCaseId: string;
  conversationId: string;
  title: string;
  summary: string;
  caseStatus: "active";
  latestActivityAt: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  followUpState: string | null;
  productInterestState: string;
  continuationPreference: string;
  familySharingPreference: string;
};

export type OpenClawFoundationLearningFeed = {
  conversations: OpenClawFoundationConversationFeedRecord[];
  messageEvents: OpenClawFoundationMessageEventFeedRecord[];
  supportCases: OpenClawFoundationSupportCaseFeedRecord[];
};

export type OpenClawLearningIngestPayload = {
  reflections?: OpenClawReflectionArtifact[];
  needsSignals?: OpenClawNeedsSignalArtifact[];
  foundation?: OpenClawFoundationLearningFeed | null;
};

function compact(text: string, limit = 180) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > limit ? `${normalized.slice(0, limit - 3)}...` : normalized;
}

function getLearningBridgeToken() {
  return learningToken || supportChatToken;
}

function getLearningBridgeBaseCandidates() {
  if (learningBaseUrl) {
    return [learningBaseUrl];
  }

  const fallbackCandidates = [openClawOhioLearningFallbackUrl].filter(Boolean);

  if (!supportChatUrl) {
    return fallbackCandidates;
  }

  try {
    const source = new URL(supportChatUrl);
    const candidates = new Set<string>();
    const normalizedPath = source.pathname.replace(/\/+$/, "");
    const pathVariants = new Set<string>([""]);

    if (normalizedPath) {
      pathVariants.add(normalizedPath);
      pathVariants.add(normalizedPath.replace(/\/support\/chat$/i, ""));
      pathVariants.add(normalizedPath.replace(/\/chat$/i, ""));

      const lastSlash = normalizedPath.lastIndexOf("/");
      if (lastSlash > 0) {
        pathVariants.add(normalizedPath.slice(0, lastSlash));
      }
    }

    for (const variant of pathVariants) {
      const path = variant.replace(/\/+$/, "");
      candidates.add(`${source.origin}${path}`);
    }

    return [...fallbackCandidates, ...Array.from(candidates).filter(Boolean)];
  } catch {
    return fallbackCandidates;
  }
}

export function buildOpenClawFoundationLearningFeed(input: {
  locale: SupportAssistantLocale;
  scenario: string;
  profile: HinataUserState;
  thread: HinataThreadState;
  userMessage: string;
  assistantMessage: string;
  actionIds: string[];
  eventId: string;
}) : OpenClawFoundationLearningFeed {
  const conversationId = input.thread.id;
  const supportCaseId = `support_case_${input.thread.id}`;
  const subject = input.thread.currentTopic || input.scenario || "support";
  const timestamp = input.thread.updatedAt;

  return {
    conversations: [
      {
        conversationId,
        supportCaseId,
        ownerKey: input.thread.ownerKey || input.profile.ownerKey || null,
        locale: input.locale,
        subject,
        conversationStatus: "active",
        currentTopic: input.thread.currentTopic,
        relationshipStage: input.profile.relationshipStage,
        latestActivityAt: timestamp,
        createdAt: input.thread.createdAt,
        updatedAt: input.thread.updatedAt,
      },
    ],
    messageEvents: [
      {
        messageEventId: input.eventId,
        conversationId,
        supportCaseId,
        locale: input.locale,
        eventType: "support_turn",
        messageType: "support_reply",
        userMessageSummary: compact(input.userMessage, 120),
        assistantMessageSummary: compact(input.assistantMessage, 180),
        scenario: input.scenario,
        actionIds: input.actionIds,
        recordedAt: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
    supportCases: [
      {
        supportCaseId,
        conversationId,
        title: subject,
        summary: compact(`${input.profile.concernSummary} ${input.profile.latestSummary}`, 180),
        caseStatus: "active",
        latestActivityAt: timestamp,
        createdAt: input.thread.createdAt,
        updatedAt: input.thread.updatedAt,
        tags: input.profile.importantTags.slice(0, 12),
        followUpState: input.thread.openQuestion || input.thread.latestNextStep || null,
        productInterestState: input.profile.productInterestState,
        continuationPreference: input.profile.channelContinuationPreference,
        familySharingPreference: input.profile.familySharingPreference,
      },
    ],
  };
}

export async function forwardLearningFeedToOpenClaw(payload: OpenClawLearningIngestPayload) {
  const candidates = getLearningBridgeBaseCandidates();
  const token = getLearningBridgeToken();

  if (candidates.length === 0) {
    return false;
  }

  const normalizedPayload: OpenClawLearningIngestPayload = {
    reflections: payload.reflections?.filter(Boolean) || [],
    needsSignals: payload.needsSignals?.filter(Boolean) || [],
    foundation: payload.foundation || null,
  };

  if (
    (normalizedPayload.reflections?.length || 0) === 0 &&
    (normalizedPayload.needsSignals?.length || 0) === 0 &&
    !normalizedPayload.foundation
  ) {
    return false;
  }

  for (const candidate of candidates) {
    try {
      const response = await fetch(`${candidate}/learning/ingest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(normalizedPayload),
        cache: "no-store",
        signal: AbortSignal.timeout(2500),
      });

      if (response.ok) {
        return true;
      }
    } catch {
      continue;
    }
  }

  return false;
}
