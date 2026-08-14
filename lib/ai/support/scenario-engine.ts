export type SupportAssistantLocale = "ja" | "en";

// Legacy-compatible request hints. Accepted at the API boundary only; they do not
// define Hinata's active product ontology.
export type SupportIdentity = "self" | "family" | "institution";
export type SupportIssueType =
  | "mobility_anxiety"
  | "family_mobility_support"
  | "product_guidance"
  | "consultation_booking"
  | "institutional_inquiry";

export type SupportRiskLevel = "low" | "medium" | "high";
export type SupportToneMode = "quiet_companion" | "gentle_reflective" | "steady_grounding";

export type SupportNextActionType =
  | "continue_on_line"
  | "save_with_consent"
  | "revisit_later"
  | "reflect_now"
  | "no_action";

export type ActiveSupportScenario =
  | "be_heard"
  | "understand_my_state"
  | "reflect_on_relationship"
  | "reflect_on_work"
  | "reflect_on_daily_life"
  | "revisit_previous_state"
  | "decide_next_small_step"
  | "remember_something"
  | "continue_previous_conversation";

// Deprecated literals remain readable so historical memory/reflection records and
// compatibility branches can compile. classifySupportScenario never emits them.
export type LegacySupportScenario =
  | "elder_mobility_anxiety"
  | "family_mobility_support"
  | "product_guidance"
  | "consultation_booking"
  | "institutional_inquiry";

export type SupportScenario = ActiveSupportScenario | LegacySupportScenario;

export type SupportEmotionalState = "calm" | "uncertain" | "overwhelmed" | "lonely" | "conflicted" | "tired" | "unclear";
export type SupportDomainContext = "self" | "relationship" | "work" | "family" | "daily_life" | "health_context_nonclinical" | "other";

export type SupportConversationMessage = { role: "user" | "assistant"; content: string };
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
  emotionalState: SupportEmotionalState;
  domainContext: SupportDomainContext;
  riskLevel: SupportRiskLevel;
  toneMode: SupportToneMode;
  nextActions: SupportNextActionType[];
  serviceTrigger: SupportNextActionType;
  shouldAskClarifyingQuestion: boolean;
  labels: { persona: string; scenario: string; risk: string };
};

const relationshipHints = ["友達", "友人", "恋人", "彼氏", "彼女", "夫", "妻", "パートナー", "関係", "距離", "返信", "既読", "friend", "partner", "relationship", "reply", "message"];
const workHints = ["仕事", "会社", "職場", "上司", "同僚", "学校", "勉強", "進路", "work", "job", "boss", "coworker", "school", "study"];
const familyHints = ["家族", "親", "母", "父", "兄", "姉", "弟", "妹", "family", "parent", "mother", "father", "sister", "brother"];
const dailyLifeHints = ["生活", "寝", "眠", "朝", "夜", "食事", "習慣", "毎日", "日々", "生活リズム", "routine", "sleep", "daily", "day", "night"];
const healthContextHints = ["体調", "疲れ", "しんどい", "頭痛", "お腹", "眠れ", "health", "tired", "exhausted", "pain", "sleep"];
const lonelyHints = ["寂しい", "孤独", "ひとり", "誰も", "lonely", "alone"];
const overwhelmedHints = ["無理", "限界", "しんどい", "疲れた", "疲れ切", "抱えきれ", "overwhelmed", "too much", "exhausted"];
const conflictHints = ["迷う", "どうしたら", "わからない", "決められ", "モヤモヤ", "conflict", "torn", "not sure", "don't know"];
const uncertainHints = ["不安", "心配", "なんとなく", "uncertain", "worried", "uneasy"];
const calmHints = ["落ち着", "大丈夫", "平気", "calm", "okay", "fine"];
const rememberHints = ["覚えて", "残して", "記録して", "remember", "save this", "keep this"];
const revisitHints = ["前に", "前回", "この前", "さっき", "また見", "比べ", "previous", "last time", "earlier", "compare"];
const nextStepHints = ["どうしたら", "次に", "何すれば", "一歩", "決めたい", "what should i do", "next step", "what now"];
const listenHints = ["聞いて", "話したい", "誰かに話", "ただ聞", "listen", "need to talk", "talk to someone"];

function includesAny(text: string, hints: string[]) {
  const lower = text.toLowerCase();
  return hints.some((hint) => lower.includes(hint.toLowerCase()));
}

function inferDomain(text: string): SupportDomainContext {
  if (includesAny(text, relationshipHints)) return "relationship";
  if (includesAny(text, workHints)) return "work";
  if (includesAny(text, familyHints)) return "family";
  if (includesAny(text, dailyLifeHints)) return "daily_life";
  if (includesAny(text, healthContextHints)) return "health_context_nonclinical";
  return text.trim() ? "self" : "other";
}

function inferEmotionalState(text: string): SupportEmotionalState {
  if (includesAny(text, overwhelmedHints)) return "overwhelmed";
  if (includesAny(text, lonelyHints)) return "lonely";
  if (includesAny(text, conflictHints)) return "conflicted";
  if (includesAny(text, uncertainHints)) return "uncertain";
  if (includesAny(text, ["疲れ", "眠い", "だるい", "tired", "drained"])) return "tired";
  if (includesAny(text, calmHints)) return "calm";
  return "unclear";
}

function inferScenario(text: string, history: SupportConversationMessage[], domain: SupportDomainContext): ActiveSupportScenario {
  if (includesAny(text, rememberHints)) return "remember_something";
  if (includesAny(text, revisitHints)) return history.length > 0 ? "continue_previous_conversation" : "revisit_previous_state";
  if (includesAny(text, nextStepHints)) return "decide_next_small_step";
  if (includesAny(text, listenHints)) return "be_heard";
  if (domain === "relationship" || domain === "family") return "reflect_on_relationship";
  if (domain === "work") return "reflect_on_work";
  if (domain === "daily_life" || domain === "health_context_nonclinical") return "reflect_on_daily_life";
  if (history.length > 0) return "continue_previous_conversation";
  return "understand_my_state";
}

function inferRiskLevel(text: string): SupportRiskLevel {
  // Conversational intensity only; not a diagnosis or crisis classifier.
  if (includesAny(text, ["限界", "何もできない", "動けない", "overwhelmed", "can't function"])) return "high";
  if (includesAny(text, [...uncertainHints, ...overwhelmedHints, ...lonelyHints])) return "medium";
  return "low";
}

function inferToneMode(state: SupportEmotionalState): SupportToneMode {
  if (state === "overwhelmed" || state === "lonely" || state === "tired") return "steady_grounding";
  if (state === "conflicted" || state === "uncertain") return "gentle_reflective";
  return "quiet_companion";
}

function inferActions(scenario: ActiveSupportScenario, history: SupportConversationMessage[]): SupportNextActionType[] {
  if (scenario === "remember_something") return ["save_with_consent"];
  if (scenario === "revisit_previous_state") return ["revisit_later"];
  if (scenario === "decide_next_small_step") return ["reflect_now"];
  if (history.length >= 4) return ["continue_on_line", "no_action"];
  return ["no_action"];
}

function getLabels(locale: SupportAssistantLocale, identity: SupportIdentity, scenario: ActiveSupportScenario, risk: SupportRiskLevel) {
  const jaScenario: Record<ActiveSupportScenario, string> = {
    be_heard: "まず話したい",
    understand_my_state: "いまの自分を整理したい",
    reflect_on_relationship: "人との距離や関係を見つめたい",
    reflect_on_work: "仕事や学びのことを整理したい",
    reflect_on_daily_life: "日々の調子や生活を見つめたい",
    revisit_previous_state: "前の自分を振り返りたい",
    decide_next_small_step: "次の小さな一歩を考えたい",
    remember_something: "このことを残しておきたい",
    continue_previous_conversation: "前の話の続きをしたい",
  };
  const enScenario: Record<ActiveSupportScenario, string> = {
    be_heard: "Be heard",
    understand_my_state: "Understand how I am",
    reflect_on_relationship: "Reflect on a relationship",
    reflect_on_work: "Reflect on work or study",
    reflect_on_daily_life: "Reflect on daily life",
    revisit_previous_state: "Revisit an earlier state",
    decide_next_small_step: "Find one small next step",
    remember_something: "Remember something with consent",
    continue_previous_conversation: "Continue an earlier conversation",
  };

  return locale === "en"
    ? { persona: identity === "family" ? "Family context" : identity === "institution" ? "External context" : "Self", scenario: enScenario[scenario], risk }
    : {
        persona: identity === "family" ? "家族の文脈" : identity === "institution" ? "外部の文脈" : "本人",
        scenario: jaScenario[scenario],
        risk: risk === "high" ? "負荷が強そう" : risk === "medium" ? "少し揺れている" : "落ち着いて話せる",
      };
}

export function classifySupportScenario(input: SupportScenarioInput): SupportScenarioResult {
  const text = [input.message.trim(), ...input.messages.filter((entry) => entry.role === "user").slice(-3).map((entry) => entry.content.trim())]
    .filter(Boolean)
    .join("\n");
  const domainContext = inferDomain(text);
  const emotionalState = inferEmotionalState(text);
  const scenario = inferScenario(input.message, input.messages, domainContext);
  const riskLevel = inferRiskLevel(text);
  const nextActions = inferActions(scenario, input.messages);

  return {
    persona: input.identity,
    scenario,
    emotionalState,
    domainContext,
    riskLevel,
    toneMode: inferToneMode(emotionalState),
    nextActions,
    serviceTrigger: nextActions[0] || "no_action",
    shouldAskClarifyingQuestion: scenario !== "be_heard" && scenario !== "remember_something",
    labels: getLabels(input.locale, input.identity, scenario, riskLevel),
  };
}
