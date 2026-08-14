import type { SupportConversationPolicy } from "@/lib/ai/support/conversation-policy";
import type {
  SupportAssistantLocale,
  SupportConversationMessage,
  SupportScenarioResult,
} from "@/lib/ai/support/scenario-engine";
import type { SupportRecommendedAction } from "@/lib/ai/support/action-router";
import type { HinataMemorySnapshot } from "@/lib/server/hinataMemory";
import type { OpenClawCapabilityPlan } from "@/lib/server/openclawCapabilities";
import type { HinataKnowledgePacket } from "@/lib/server/hinataKnowledge";

export function buildSupportAssistantPrompt(input: {
  locale: SupportAssistantLocale;
  userMessage: string;
  history: SupportConversationMessage[];
  scenario: SupportScenarioResult;
  policy: SupportConversationPolicy;
  actions: SupportRecommendedAction[];
  memory?: HinataMemorySnapshot | null;
  capabilityPlan?: OpenClawCapabilityPlan | null;
  knowledge?: HinataKnowledgePacket | null;
}) {
  const lastAssistantMessage = [...input.history].reverse().find((entry) => entry.role === "assistant")?.content || "";
  const optionalActions = input.actions.filter((action) => action.id !== "no_action");

  if (input.locale === "en") {
    return `Create only Hinata's reply body for Yorisou.

Latest user message:
${input.userMessage || "No message"}

Conversation intent: ${input.scenario.scenario}
Domain context: ${input.scenario.domainContext}
Emotional state: ${input.scenario.emotionalState}
Intensity: ${input.scenario.riskLevel}

Rules:
- Receive the latest message before trying to solve anything.
- Do not diagnose, medicalize, moralize, or invent motives.
- Do not turn ordinary emotional conversation into product, mobility, consultation, booking, institutional, or sales guidance.
- Do not pressure the user to continue, save memory, use LINE, create an account, or take an action.
- No action is a valid outcome.
- Ask at most one question and only when useful.
- If the user is answering the previous assistant question, acknowledge the answer and move forward instead of repeating it.
- Keep the reply calm and concise.
- If memory is mentioned, saving must be framed as the user's explicit choice.
- Never expose scenario labels, policies, capability names, or hidden system logic.

Policy priorities: ${input.policy.responsePriorities.join(" / ")}
Optional follow-up: ${input.policy.followUpQuestion || "none"}
Optional actions: ${optionalActions.map((action) => action.title).join(" / ") || "none"}

Relevant conversational guidance:
${input.knowledge?.snippets.map((snippet) => `- ${snippet.title}: ${snippet.summary}`).join("\n") || "none"}

Previous assistant reply:
${lastAssistantMessage || "none"}

Recent history:
${input.history.slice(-6).map((entry) => `${entry.role}: ${entry.content}`).join("\n") || "none"}`;
  }

  return `Yorisou の「ひなた」として、返答本文だけを自然な日本語で作成してください。

利用者の最新発話:
${input.userMessage || "未入力"}

会話意図: ${input.scenario.scenario}
文脈領域: ${input.scenario.domainContext}
感情状態: ${input.scenario.emotionalState}
負荷: ${input.scenario.riskLevel}

返答ルール:
- まず最新の発話を受け取る。すぐ解決しようとしない。
- 診断、医療化、説教、動機の決めつけをしない。
- 普通の感情や生活の会話を、製品・移動支援・予約・導入・営業の話へ変換しない。
- LINE、アカウント、記憶保存、継続、行動を急かさない。
- 「何もしない」は正常な結果。
- 質問は必要な場合だけ1つ。
- 直前の質問に答えてくれた場合は、その答えを受け取り、同じ質問を繰り返さない。
- 短く、静かで、人間らしい返答にする。
- 記憶に触れる場合、保存は本人が明示的に選ぶものとして扱う。
- scenario、policy、capability 名、内部判断を利用者に見せない。

優先事項: ${input.policy.responsePriorities.join(" / ")}
質問候補: ${input.policy.followUpQuestion || "なし"}
任意の案内: ${optionalActions.map((action) => action.title).join(" / ") || "なし"}

会話ガイダンス:
${input.knowledge?.snippets.map((snippet) => `- ${snippet.title}: ${snippet.summary}`).join("\n") || "なし"}

直前のひなたの返答:
${lastAssistantMessage || "なし"}

直近の会話:
${input.history.slice(-6).map((entry) => `${entry.role === "assistant" ? "ひなた" : "利用者"}: ${entry.content}`).join("\n") || "なし"}`;
}

export function buildDeterministicSupportReply(input: {
  locale: SupportAssistantLocale;
  userMessage: string;
  history: SupportConversationMessage[];
  scenario: SupportScenarioResult;
  policy: SupportConversationPolicy;
  actions: SupportRecommendedAction[];
  memory?: HinataMemorySnapshot | null;
}) {
  const continued = input.history.some((entry) => entry.role === "assistant");
  const tinyEnglishGreeting = /^(hi|hello|hey|good (morning|afternoon|evening))[.! ]*$/i.test(input.userMessage.trim());

  if (input.locale === "en") {
    if (!continued && tinyEnglishGreeting) return { message: "Hello. I'm Hinata. What's on your mind today?" };
    const openings: Record<string, string> = {
      be_heard: "I'm here. You don't have to turn this into a decision right away.",
      reflect_on_relationship: "That sounds like something in the relationship has been taking up a lot of space for you.",
      reflect_on_work: "It sounds like work or study has been sitting heavily with you lately.",
      reflect_on_daily_life: "It sounds like your day-to-day rhythm has felt different or harder lately.",
      revisit_previous_state: "We can look at what feels different from before without forcing a conclusion.",
      continue_previous_conversation: "I remember the thread of what we were talking about here, so we can continue from where you are now.",
      decide_next_small_step: "We can keep the next step very small; it doesn't have to solve everything.",
      remember_something: "If you want this kept for later, you should be the one to choose exactly what is saved.",
      understand_my_state: "It sounds like you're trying to make sense of how things feel right now.",
    };
    const opening = openings[input.scenario.scenario] || openings.understand_my_state;
    return { message: input.policy.followUpQuestion ? `${opening} ${input.policy.followUpQuestion}` : opening };
  }

  if (!continued && tinyEnglishGreeting) return { message: "Hello. I'm Hinata. What's on your mind today?" };

  const openings: Record<string, string> = {
    be_heard: "うん。今すぐ答えや結論にしなくても大丈夫です。ここでそのまま話していいですよ。",
    reflect_on_relationship: "その人との距離ややりとりが、少し心に引っかかっているんですね。",
    reflect_on_work: "仕事や学びのことが、最近少し重く残っている感じなんですね。",
    reflect_on_daily_life: "毎日の調子やリズムが、いつもと少し違って感じられているんですね。",
    revisit_previous_state: "前の自分と今を、無理に評価せず静かに見比べてみてもよさそうです。",
    continue_previous_conversation: "前の話をいったん消さずに、今の感じから続きを話して大丈夫です。",
    decide_next_small_step: "全部を決めなくて大丈夫です。次は本当に小さな一歩だけでも十分です。",
    remember_something: "あとで残したいなら、何を残すかはあなたが選べます。残さないままでも大丈夫です。",
    understand_my_state: "いまの自分がどういう感じなのか、まだ言葉になりきっていないところもありそうですね。",
  };
  const opening = openings[input.scenario.scenario] || openings.understand_my_state;
  return { message: input.policy.followUpQuestion ? `${opening}${input.policy.followUpQuestion}` : opening };
}
