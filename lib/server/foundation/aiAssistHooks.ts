import type { AiAssistHooks, Channel, SupportCase } from "@/lib/server/foundation/schema";

export function createEmptyAiAssistHooks(): AiAssistHooks {
  return {
    templateReplySlot: null,
    draftReplySlot: null,
    knowledgeReferenceSlot: null,
  };
}

export function getAiAssistHooksForChannel(channel: Channel): AiAssistHooks {
  if (channel === "line") {
    return {
      templateReplySlot: "line.default_followup",
      draftReplySlot: "line.operator_draft",
      knowledgeReferenceSlot: "line.mobility_support_kb",
    };
  }

  if (channel === "support_web" || channel === "support_internal") {
    return {
      templateReplySlot: "support.default_followup",
      draftReplySlot: "support.operator_draft",
      knowledgeReferenceSlot: "support.mobility_support_kb",
    };
  }

  return createEmptyAiAssistHooks();
}

export function getAiAssistSummaryForCase(supportCase: SupportCase) {
  return {
    supportCaseId: supportCase.supportCaseId,
    channel: supportCase.channel,
    templateReplySlot: supportCase.aiAssist.templateReplySlot,
    draftReplySlot: supportCase.aiAssist.draftReplySlot,
    knowledgeReferenceSlot: supportCase.aiAssist.knowledgeReferenceSlot,
  };
}
