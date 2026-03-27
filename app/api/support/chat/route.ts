import { NextResponse } from "next/server";

import { routeSupportActions } from "@/lib/ai/support/action-router";
import { getConversationPolicy } from "@/lib/ai/support/conversation-policy";
import { generateSupportAssistantText } from "@/lib/ai/support/model-gateway";
import { buildDeterministicSupportReply, buildSupportAssistantPrompt } from "@/lib/ai/support/prompt-builder";
import {
  classifySupportScenario,
  type SupportAssistantLocale,
  type SupportConversationMessage,
  type SupportIdentity,
  type SupportIssueType,
} from "@/lib/ai/support/scenario-engine";

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

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as SupportChatRequest;
    const locale = payload.locale === "en" ? "en" : "ja";

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

    const scenarioResult = classifySupportScenario({
      locale,
      identity: payload.identity,
      issueType: payload.issueType,
      message: userMessage,
      messages,
    });
    const policy = getConversationPolicy(scenarioResult, locale);
    const recommendedActions = routeSupportActions(scenarioResult, locale);
    const prompt = buildSupportAssistantPrompt({
      locale,
      userMessage,
      history: messages,
      scenario: scenarioResult,
      policy,
      actions: recommendedActions,
    });

    const gatewayResult = await generateSupportAssistantText({
      locale,
      userMessage,
      history: messages,
      scenario: scenarioResult,
      policy,
      actions: recommendedActions,
      prompt,
    });
    const deterministic = buildDeterministicSupportReply({
      locale,
      userMessage,
      scenario: scenarioResult,
      policy,
      actions: recommendedActions,
    });

    return NextResponse.json({
      success: true,
      assistantMessage: gatewayResult?.text || deterministic.message,
      scenarioResult,
      recommendedActions,
      modelUsage: gatewayResult?.usage || {
        provider: "deterministic",
        model: "deterministic",
        promptChars: prompt.length,
        outputChars: deterministic.message.length,
        fallbackUsed: Boolean(gatewayResult) === false,
      },
    });
  } catch (error) {
    console.error("support chat route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
