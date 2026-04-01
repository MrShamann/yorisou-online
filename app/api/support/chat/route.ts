import { NextResponse } from "next/server";

import { routeSupportActions } from "@/lib/ai/support/action-router";
import { getConversationPolicy } from "@/lib/ai/support/conversation-policy";
import { generateSupportAssistantText } from "@/lib/ai/support/model-gateway";
import { buildDeterministicSupportReply, buildSupportAssistantPrompt } from "@/lib/ai/support/prompt-builder";
import { detectConversationLocale, shouldOfferActions } from "@/lib/ai/support/runtime-helpers";
import {
  classifySupportScenario,
  type SupportAssistantLocale,
  type SupportConversationMessage,
  type SupportIdentity,
  type SupportIssueType,
} from "@/lib/ai/support/scenario-engine";
import { identityFoundationService } from "@/lib/server/foundation/identityService";
import { timelineService } from "@/lib/server/foundation/timelineService";
import { getHinataMemorySnapshot, upsertHinataMemory } from "@/lib/server/hinataMemory";
import { buildOpenClawCapabilityPlan } from "@/lib/server/openclawCapabilities";
import { buildOpenClawFoundationLearningFeed, forwardLearningFeedToOpenClaw } from "@/lib/server/openclawLearningFeedBridge";
import { getHinataKnowledgePacket } from "@/lib/server/hinataKnowledge";
import { recordOpenClawReflection } from "@/lib/server/openclawReflection";
import { ensureViewerSession, getViewerContext, setViewerSessionCookie, type ViewerContext } from "@/lib/server/yorisouAuth";

type SupportChatRequest = {
  locale?: SupportAssistantLocale;
  identity?: SupportIdentity;
  issueType?: SupportIssueType;
  message?: string;
  messages?: SupportConversationMessage[];
};

function isValidIdentity(value: string | undefined): value is SupportIdentity {
  return value === "self" || value === "family" || value === "institution";
}

function isValidIssueType(value: string | undefined): value is SupportIssueType {
  return (
    value === "mobility_anxiety" ||
    value === "family_mobility_support" ||
    value === "product_guidance" ||
    value === "consultation_booking" ||
    value === "institutional_inquiry"
  );
}

function getLegacyViewerAccount(viewer: ViewerContext) {
  return viewer.legacyAccount || viewer.account;
}

async function resolveSupportWorkspaceFoundationIdentity(viewer: ViewerContext) {
  const legacyAccount = getLegacyViewerAccount(viewer);

  if (!legacyAccount) {
    return {
      userProfileId: null,
      authIdentityId: null,
    };
  }

  await identityFoundationService.ensureCanonicalUserForAccount(legacyAccount, "support_workspace");

  const authIdentity =
    (legacyAccount.email ? await identityFoundationService.getAuthIdentityByEmail(legacyAccount.email) : null) ||
    (legacyAccount.lineUserId ? await identityFoundationService.getAuthIdentityByLineUserId(legacyAccount.lineUserId) : null);

  return {
    userProfileId: viewer.principal?.userProfileId || legacyAccount.id,
    authIdentityId: authIdentity?.authIdentityId || null,
  };
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const includeDebug = url.searchParams.get("debug") === "1";
    const viewer = await getViewerContext();
    const session = viewer.session || (await ensureViewerSession());
    const payload = (await request.json()) as SupportChatRequest;
    const requestedLocale = payload.locale === "en" ? "en" : "ja";

    if (!isValidIdentity(payload.identity) || !isValidIssueType(payload.issueType)) {
      return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
    }

    const messages = Array.isArray(payload.messages)
      ? payload.messages.filter(
          (entry): entry is SupportConversationMessage =>
            Boolean(entry) &&
            (entry.role === "user" || entry.role === "assistant") &&
            typeof entry.content === "string",
        )
      : [];
    const userMessage = typeof payload.message === "string" ? payload.message.trim() : "";
    const locale = detectConversationLocale(userMessage, messages, requestedLocale);
    let foundationIdentity = {
      userProfileId: null as string | null,
      authIdentityId: null as string | null,
    };

    try {
      foundationIdentity = await resolveSupportWorkspaceFoundationIdentity(viewer);
    } catch (foundationError) {
      console.error("support chat canonical identity error:", foundationError);
    }

    const memory = await getHinataMemorySnapshot({
      viewer,
      session,
    });

    const scenarioResult = classifySupportScenario({
      locale,
      identity: payload.identity,
      issueType: payload.issueType,
      message: userMessage,
      messages,
    });
    let foundationContext:
      | Awaited<ReturnType<typeof timelineService.ensureSupportWorkspaceContext>>
      | null = null;
    let foundationInboundWriteOk = false;

    try {
      foundationContext = await timelineService.ensureSupportWorkspaceContext({
        sessionId: session.id,
        locale,
        userProfileId: foundationIdentity.userProfileId,
        authIdentityId: foundationIdentity.authIdentityId,
        currentTopic: memory.thread?.currentTopic || null,
        scenario: scenarioResult.scenario,
        issueType: payload.issueType,
        latestUserMessage: userMessage,
      });
      await timelineService.recordSupportWorkspaceMessage({
        context: foundationContext,
        direction: "inbound",
        contentText: userMessage,
      });
      foundationInboundWriteOk = true;
    } catch (foundationError) {
      foundationContext = null;
      console.error("support chat canonical inbound event error:", foundationError);
    }
    const policy = getConversationPolicy(scenarioResult, locale);
    const recommendedActions = shouldOfferActions({
      locale,
      userMessage,
      history: messages,
      relationshipStage: memory.profile?.relationshipStage || null,
      openQuestion: memory.thread?.openQuestion || null,
    })
      ? routeSupportActions(scenarioResult, locale)
      : [];
    const capabilityPlan = buildOpenClawCapabilityPlan({
      scenario: scenarioResult,
      policy,
      memory,
    });
    const knowledge = await getHinataKnowledgePacket({
      locale,
      scenario: scenarioResult,
      userMessage,
    });
    const prompt = buildSupportAssistantPrompt({
      locale,
      userMessage,
      history: messages,
      scenario: scenarioResult,
      policy,
      actions: recommendedActions,
      memory,
      capabilityPlan,
      knowledge,
    });

    const gatewayResult = await generateSupportAssistantText({
      locale,
      userMessage,
      history: messages,
      scenario: scenarioResult,
      policy,
      actions: recommendedActions,
      prompt,
      memory,
      capabilityPlan,
      knowledge,
    });
    const deterministic = buildDeterministicSupportReply({
      locale,
      userMessage,
      history: messages,
      scenario: scenarioResult,
      policy,
      actions: recommendedActions,
      memory,
    });
    const assistantMessage = gatewayResult?.text || deterministic.message;
    const memoryWrite = await upsertHinataMemory({
      viewer,
      session,
      locale,
      identity: scenarioResult.persona,
      scenario: scenarioResult,
      policy,
      history: messages,
      userMessage,
      assistantMessage,
      actions: recommendedActions,
    });
    try {
      const assistantContext = await timelineService.ensureSupportWorkspaceContext({
        sessionId: session.id,
        locale,
        userProfileId: foundationIdentity.userProfileId,
        authIdentityId: foundationIdentity.authIdentityId,
        currentTopic: memoryWrite.thread.currentTopic || null,
        scenario: scenarioResult.scenario,
        issueType: payload.issueType,
        latestUserMessage: userMessage,
        latestAssistantMessage: assistantMessage,
      });
      await timelineService.recordSupportWorkspaceMessage({
        context: assistantContext,
        direction: "outbound",
        contentText: assistantMessage,
        replyStatus: "sent",
      });
      if (!foundationContext) {
        foundationContext = assistantContext;
      }
    } catch (foundationError) {
      console.error("support chat canonical outbound event error:", foundationError);
    }
    const learningArtifacts = await recordOpenClawReflection({
      scenario: scenarioResult,
      userMessage,
      assistantMessage,
      usage:
        gatewayResult?.usage || {
          provider: "deterministic",
          model: "deterministic",
          promptChars: prompt.length,
          outputChars: deterministic.message.length,
          fallbackUsed: true,
        },
      history: messages,
      memory,
      capabilityPlan,
      actions: recommendedActions,
    });
    const foundationFeed = buildOpenClawFoundationLearningFeed({
      locale,
      scenario: scenarioResult.scenario,
      profile: memoryWrite.profile,
      thread: memoryWrite.thread,
      userMessage,
      assistantMessage,
      actionIds: recommendedActions.map((action) => action.id),
      eventId: `support_turn_${learningArtifacts.reflection.id}`,
    });

    await Promise.race([
      forwardLearningFeedToOpenClaw({
        reflections: [learningArtifacts.reflection],
        needsSignals: learningArtifacts.needsSignal ? [learningArtifacts.needsSignal] : [],
        foundation: foundationFeed,
      }).catch((error) => {
        console.error("support chat learning feed bridge error:", error);
        return false;
      }),
      new Promise<false>((resolve) => setTimeout(() => resolve(false), 1500)),
    ]);

    const response = NextResponse.json({
      success: true,
      assistantMessage,
      scenarioResult,
      recommendedActions,
      memory: {
        threadId: memoryWrite.thread.id,
        relationshipStage: memoryWrite.profile.relationshipStage,
        currentTopic: memoryWrite.thread.currentTopic,
      },
      modelUsage: gatewayResult?.usage || {
        provider: "deterministic",
        model: "deterministic",
        promptChars: prompt.length,
        outputChars: deterministic.message.length,
        fallbackUsed: Boolean(gatewayResult) === false,
      },
      ...(includeDebug
        ? {
            debug: {
              sessionId: session.id,
              foundationIdentity,
              foundationContext,
              foundationInboundWriteOk,
            },
          }
        : {}),
    });
    setViewerSessionCookie(response, session);
    return response;
  } catch (error) {
    console.error("support chat route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
