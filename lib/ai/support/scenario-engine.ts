export type SupportAssistantLocale = "ja" | "en";

export type SupportIdentity = "self" | "family" | "institution";

export type SupportIssueType =
  | "mobility_anxiety"
  | "family_mobility_support"
  | "product_guidance"
  | "consultation_booking"
  | "institutional_inquiry";

export type SupportRiskLevel = "low" | "medium" | "high";

export type SupportToneMode = "gentle_reassuring" | "family_supportive" | "concise_partnership";

export type SupportNextActionType =
  | "continue_on_line"
  | "offer_consultation"
  | "suggest_products"
  | "family_support_info"
  | "institutional_contact";

export type SupportScenario =
  | "elder_mobility_anxiety"
  | "family_mobility_support"
  | "product_guidance"
  | "consultation_booking"
  | "institutional_inquiry";

export type SupportConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

export type SupportScenarioInput = {
  locale: SupportAssistantLocale;
  identity: SupportIdentity;
  issueType: SupportIssueType;
  message: string;
  messages: SupportConversationMessage[];
};

export type SupportScenarioResult = {
  persona: SupportIdentity;
  scenario: SupportScenario;
  riskLevel: SupportRiskLevel;
  toneMode: SupportToneMode;
  nextActions: SupportNextActionType[];
  serviceTrigger: SupportNextActionType;
  shouldAskClarifyingQuestion: boolean;
  labels: {
    persona: string;
    scenario: string;
    risk: string;
  };
};

const highRiskKeywords = ["転倒", "倒れ", "歩けない", "一人で難しい", "通院できない", "急ぎ", "至急"];
const mediumRiskKeywords = ["不安", "心配", "迷う", "困る", "外出が減った", "出たがらない", "わからない"];
const institutionKeywords = ["自治体", "介護", "施設", "事業者", "協業", "導入", "連携", "地域"];
const productKeywords = ["製品", "車いす", "電動", "カート", "何を選べば", "比較"];
const familyKeywords = ["親", "母", "父", "祖母", "祖父", "家族", "夫", "妻", "付き添い"];
const bookingKeywords = ["相談したい", "予約", "面談", "話を聞いてほしい", "詳しく話したい"];

function inferScenario(identity: SupportIdentity, issueType: SupportIssueType, text: string): SupportScenario {
  if (identity === "institution" || issueType === "institutional_inquiry") {
    return "institutional_inquiry";
  }

  if (issueType === "consultation_booking") {
    return "consultation_booking";
  }

  if (bookingKeywords.some((keyword) => text.includes(keyword))) {
    return "consultation_booking";
  }

  if (issueType === "product_guidance" || productKeywords.some((keyword) => text.includes(keyword))) {
    return "product_guidance";
  }

  if (identity === "family" || issueType === "family_mobility_support" || familyKeywords.some((keyword) => text.includes(keyword))) {
    return "family_mobility_support";
  }

  return "elder_mobility_anxiety";
}

function inferRiskLevel(text: string, scenario: SupportScenario): SupportRiskLevel {
  if (highRiskKeywords.some((keyword) => text.includes(keyword))) {
    return "high";
  }

  if (scenario === "institutional_inquiry") {
    return "low";
  }

  if (mediumRiskKeywords.some((keyword) => text.includes(keyword))) {
    return "medium";
  }

  return scenario === "consultation_booking" ? "low" : "medium";
}

function inferToneMode(scenario: SupportScenario): SupportToneMode {
  if (scenario === "institutional_inquiry") {
    return "concise_partnership";
  }

  if (scenario === "family_mobility_support") {
    return "family_supportive";
  }

  return "gentle_reassuring";
}

function inferActions(scenario: SupportScenario): SupportNextActionType[] {
  if (scenario === "elder_mobility_anxiety") {
    return ["offer_consultation", "suggest_products"];
  }

  if (scenario === "family_mobility_support") {
    return ["family_support_info", "offer_consultation"];
  }

  if (scenario === "product_guidance") {
    return ["suggest_products", "offer_consultation"];
  }

  if (scenario === "consultation_booking") {
    return ["offer_consultation", "family_support_info"];
  }

  return ["institutional_contact", "offer_consultation"];
}

function getLabels(locale: SupportAssistantLocale, identity: SupportIdentity, scenario: SupportScenario, risk: SupportRiskLevel) {
  if (locale === "en") {
    return {
      persona: identity === "self" ? "Self" : identity === "family" ? "Family member" : "Organization",
      scenario:
        scenario === "elder_mobility_anxiety"
          ? "Mobility concern"
          : scenario === "family_mobility_support"
            ? "Family mobility support"
            : scenario === "product_guidance"
              ? "Product guidance"
              : scenario === "consultation_booking"
                ? "Consultation booking"
                : "Implementation inquiry",
      risk: risk,
    };
  }

  return {
    persona: identity === "self" ? "ご本人" : identity === "family" ? "ご家族" : "自治体・介護関係者",
    scenario:
      scenario === "elder_mobility_anxiety"
        ? "移動への不安"
        : scenario === "family_mobility_support"
          ? "ご家族の移動相談"
          : scenario === "product_guidance"
            ? "製品のご相談"
            : scenario === "consultation_booking"
              ? "相談予約・導入相談"
              : "協業・導入のご相談",
    risk: risk === "high" ? "早めの確認が必要" : risk === "medium" ? "内容を見ながらご案内" : "落ち着いてご案内",
  };
}

export function classifySupportScenario(input: SupportScenarioInput): SupportScenarioResult {
  const text = [
    input.message.trim(),
    ...input.messages.filter((entry) => entry.role === "user").map((entry) => entry.content.trim()),
  ]
    .filter(Boolean)
    .join("\n");

  const identity =
    institutionKeywords.some((keyword) => text.includes(keyword)) && input.identity !== "institution"
      ? "institution"
      : input.identity;
  const scenario = inferScenario(identity, input.issueType, text);
  const riskLevel = inferRiskLevel(text, scenario);
  const toneMode = inferToneMode(scenario);
  const nextActions = inferActions(scenario);

  return {
    persona: identity,
    scenario,
    riskLevel,
    toneMode,
    nextActions,
    serviceTrigger: nextActions[0],
    shouldAskClarifyingQuestion: scenario !== "institutional_inquiry",
    labels: getLabels(input.locale, identity, scenario, riskLevel),
  };
}
