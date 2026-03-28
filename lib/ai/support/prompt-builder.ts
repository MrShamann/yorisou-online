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
  const turnCount = input.history.filter((entry) => entry.role === "user").length + 1;
  const tinyEnglishGreeting = /^(hi|hello|hey|good (morning|afternoon|evening))\b/i.test(input.userMessage.trim());
  const lastAssistantMessage = [...input.history].reverse().find((entry) => entry.role === "assistant")?.content || "なし";
  const lastUserMessage = [...input.history].reverse().find((entry) => entry.role === "user")?.content || "なし";

  return input.locale === "ja"
    ? `以下は Yorisou の相談対話の入力です。返答本文だけを自然な日本語で作成してください。

相談者区分: ${input.scenario.labels.persona}
相談テーマ: ${input.scenario.labels.scenario}
リスクの見立て: ${input.scenario.labels.risk}
トーン: ${input.scenario.toneMode}

返答ポリシー:
- 出だし: ${input.policy.opening}
- 優先事項: ${input.policy.responsePriorities.join(" / ")}
- 長さ: ${input.policy.responseLength}
- 質問の仕方: ${input.policy.followUpStyle}
- 不確実な場合: ${input.policy.uncertaintyHandling}
- 製品や支え方: ${input.policy.productStatusGuidance}
- 続け方: ${input.policy.continuationGuidance}
- 行動提案: ${input.policy.actionOfferingGuidance}
- 避ける表現: ${input.policy.forbiddenStyles.join(" / ")}

次の案内候補: ${input.actions.map((action) => action.title).join(" / ") || "なし"}
確認質問候補: ${input.policy.followUpQuestion}

会話履歴:
${input.history.map((entry) => `${entry.role === "assistant" ? "ひなた" : "利用者"}: ${entry.content}`).join("\n") || "なし"}

継続メモ:
- 関係段階: ${input.memory?.profile?.relationshipStage || "new"}
- いまの関心: ${input.memory?.profile?.concernSummary || "なし"}
- 直近の要約: ${input.memory?.profile?.latestSummary || "なし"}
- 現在の話題: ${input.memory?.thread?.currentTopic || input.scenario.labels.scenario}
- 開いている問い: ${input.memory?.thread?.openQuestion || "なし"}
- 次に案内した内容: ${input.memory?.thread?.latestNextStep || "なし"}
- 重要タグ: ${input.memory?.profile?.importantTags.join(" / ") || "なし"}

直前のやりとり:
- ひなたの直前の返答: ${lastAssistantMessage}
- 利用者の直前の発話: ${lastUserMessage}

OpenClaw capability plan:
- 主軸: ${input.capabilityPlan?.primary || "support_reasoning"}
- 補助: ${input.capabilityPlan?.secondary.join(" / ") || "なし"}
- メモ: ${input.capabilityPlan?.notes.join(" / ") || "なし"}

使える知識:
${input.knowledge?.snippets.map((snippet) => `- ${snippet.title}: ${snippet.summary} / ${snippet.whyItMatters}`).join("\n") || "なし"}

今回の入力:
${input.userMessage || "未入力"}

返答ルール:
0. 利用者の最新発話が英語など別言語で明確な場合は、その言語で自然に返してよい
1. まず不安や状況をやさしく受け止める
2. 会話履歴がある場合は、最新の利用者発話にだけ自然に続ける
3. 前のひなたの返答と同じ要点や同じ確認質問を繰り返さない
4. 初手が "hi" "hello" のような短い挨拶だけなら、定型的な相談案内にせず、短い挨拶と「どうお手伝いできますか」に近い自然な返しにする
5. 直前のひなたの質問に利用者が答えている場合は、その答えを受け取って先へ進み、同じ種類の質問を言い換えて聞き直さない
6. turn 2 から turn 5 は、相談窓口の定型文や受付文ではなく、会話の続きとして返す
7. 次に一歩だけ整理する
8. 質問は必要な場合だけ1つ
9. 明確に求められない限り、最初の数往復では次の案内や行動候補を前に出しすぎない
10. 本文だけを返す`
    : `Create only the assistant reply body for Yorisou.

Persona: ${input.scenario.labels.persona}
Scenario: ${input.scenario.labels.scenario}
Risk: ${input.scenario.labels.risk}
Tone: ${input.scenario.toneMode}
Priorities: ${input.policy.responsePriorities.join(" / ")}
Length: ${input.policy.responseLength}
Follow-up style: ${input.policy.followUpStyle}
Uncertainty: ${input.policy.uncertaintyHandling}
Product guidance: ${input.policy.productStatusGuidance}
Continuation: ${input.policy.continuationGuidance}
Action guidance: ${input.policy.actionOfferingGuidance}
Avoid: ${input.policy.forbiddenStyles.join(" / ")}
Next actions: ${input.actions.map((action) => action.title).join(" / ") || "none"}
Follow-up question: ${input.policy.followUpQuestion}

History:
${input.history.map((entry) => `${entry.role}: ${entry.content}`).join("\n") || "none"}

Memory:
- relationship stage: ${input.memory?.profile?.relationshipStage || "new"}
- concern summary: ${input.memory?.profile?.concernSummary || "none"}
- latest summary: ${input.memory?.profile?.latestSummary || "none"}
- current topic: ${input.memory?.thread?.currentTopic || input.scenario.labels.scenario}
- open question: ${input.memory?.thread?.openQuestion || "none"}
- latest next step: ${input.memory?.thread?.latestNextStep || "none"}

Latest exchange:
- previous assistant reply: ${lastAssistantMessage}
- previous user message: ${lastUserMessage}

OpenClaw capabilities:
- primary: ${input.capabilityPlan?.primary || "support_reasoning"}
- secondary: ${input.capabilityPlan?.secondary.join(" / ") || "none"}
- notes: ${input.capabilityPlan?.notes.join(" / ") || "none"}

Knowledge:
${input.knowledge?.snippets.map((snippet) => `- ${snippet.title}: ${snippet.summary} / ${snippet.whyItMatters}`).join("\n") || "none"}

User message:
${input.userMessage || "No message"}

Reply in 2-4 short sentences, with at most one natural follow-up question.
Follow the user's current language when it is clear from the latest message.
If the latest user message is only a tiny greeting like "hi" or "hello", respond naturally first and do not jump into a consultation script or action menu.
If history exists, continue from the latest user message and do not repeat the same assistant summary or question from the previous turn.
If the user is answering the previous question, acknowledge the answer and move forward instead of asking the same kind of question again.
For turns 2 through 5, keep the reply conversational and avoid slipping into a support-intake or operator tone.
Unless the user explicitly asks for next-step guidance, avoid surfacing actions too early in the first few turns.
Current turn count: ${turnCount}
Tiny English greeting detected: ${tinyEnglishGreeting ? "yes" : "no"}.`;
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
  if (input.locale === "en") {
    const continued = input.history.filter((entry) => entry.role === "assistant").length > 0;
    const tinyGreeting = /^(hi|hello|hey|good (morning|afternoon|evening))\b/i.test(input.userMessage.trim());
    if (tinyGreeting && !continued) {
      return {
        message: "Hello. I'm Hinata. How can I help today?",
      };
    }
    return {
      message: `${
        continued ? "Thank you for adding that." : "Thank you for sharing that."
      } ${
        "Yorisou can help organize this calmly and keep the next step simple."
      } ${
        input.memory?.thread?.openQuestion === input.policy.followUpQuestion
          ? "Could you tell me a little more about what feels most important right now?"
          : input.policy.followUpQuestion
      } ${
        input.actions.length > 0 && input.history.length < 3 ? `If helpful, we can later guide you toward ${input.actions[0].title.toLowerCase()}.` : ""
      }`.trim(),
    };
  }

  const turnCount = input.history.filter((entry) => entry.role === "user").length + 1;
  const continued = input.history.filter((entry) => entry.role === "assistant").length > 0;
  const hasOpenQuestion = Boolean(input.memory?.thread?.openQuestion);
  const latestFocus = input.userMessage.replace(/\s+/g, " ").trim();
  const focusText = latestFocus.length > 28 ? `${latestFocus.slice(0, 28)}…` : latestFocus;
  const tinyEnglishGreeting = /^(hi|hello|hey|good (morning|afternoon|evening))\b/i.test(latestFocus);
  const hasEnglishOnly = /[A-Za-z]/.test(latestFocus) && !/[\u3040-\u30ff\u3400-\u9fff]/.test(latestFocus);

  if (!continued && tinyEnglishGreeting && hasEnglishOnly) {
    return {
      message: "Hello. I'm Hinata. How can I help today?",
    };
  }

  const opening =
    continued && input.scenario.scenario === "family_mobility_support"
      ? `ありがとうございます。今お話しいただいた「${focusText}」の点も大切ですね。`
      : continued
        ? `ありがとうございます。今お話しいただいた「${focusText}」を踏まえて、もう一歩だけ整理します。`
        : input.scenario.scenario === "family_mobility_support"
          ? "ご家族として気にかけていらっしゃるのですね。"
          : input.scenario.scenario === "institutional_inquiry"
            ? "ご相談ありがとうございます。"
            : input.scenario.scenario === "product_guidance"
              ? "製品選びに迷われるのは自然なことです。"
              : input.scenario.scenario === "consultation_booking"
                ? "ご相談の進め方を一緒に整理しましょう。"
                : "お聞かせいただきありがとうございます。";

  const summary =
    input.scenario.scenario === "elder_mobility_anxiety"
      ? turnCount >= 2
        ? "不安が強くなる場面をひとつずつ分けてみると、無理のない支え方が見えやすくなります。"
        : "まずは、外出のどの場面に不安があるのかを落ち着いて整理すると進めやすくなります。"
      : input.scenario.scenario === "family_mobility_support"
        ? turnCount >= 2
          ? "ご本人の気持ちとご家族の負担の両方を見ながら、受け入れやすい支え方を探していけます。"
          : "ご本人のご様子とご家族の気がかりを一緒に整理しながら、無理のない支え方を考えられます。"
      : input.scenario.scenario === "product_guidance"
        ? turnCount >= 2
          ? "使う場面を少し絞るだけでも、比べる視点がかなりわかりやすくなります。"
          : "いきなり決めるのではなく、使う場面に合わせて見方を整理すると選びやすくなります。"
      : input.scenario.scenario === "consultation_booking"
        ? turnCount >= 2
          ? "必要な準備を増やしすぎず、相談につながる形を整えられます。"
          : "内容を確認しながら、相談予約や導入相談につながる形でご案内できます。"
        : turnCount >= 2
          ? "現場の条件や目的を一つずつ見れば、導入や連携の相談も進めやすくなります。"
          : "導入や協業のご相談として、目的に合わせて要点を整理しながらご案内できます。";

  const question =
    input.scenario.shouldAskClarifyingQuestion
      ? hasOpenQuestion && turnCount <= 2
        ? input.scenario.scenario === "family_mobility_support"
          ? "ご本人が受け入れやすそうな移動手段や条件があれば、思いつく範囲で教えてください。"
          : input.scenario.scenario === "product_guidance"
            ? "距離・段差・収納のうち、まず気になるものはどれに近いでしょうか。"
            : input.scenario.scenario === "consultation_booking"
              ? "進め方のご希望があれば、ひとつだけ教えてください。"
              : "その場面で特に負担が大きいところを、ひとつだけ教えてください。"
        : turnCount >= 3
          ? ""
          : input.policy.followUpQuestion
      : "";
  const actionLead = input.actions[0]
    ? turnCount >= 3
      ? ""
      : `必要に応じて、${input.actions[0].title}にもゆっくりおつなぎできます。`
    : "必要に応じて、次の支え方も一緒に考えられます。";
  const honestyNote =
    input.scenario.scenario === "product_guidance"
      ? "まだ迷っていても大丈夫です。暮らしに合うかどうかを見ながら考えていけます。"
      : input.scenario.scenario === "institutional_inquiry"
        ? "内容が固まっていない段階でも、確認しながら整理していけます。"
        : "";

  return {
    message: [opening, summary, honestyNote, question, actionLead].filter(Boolean).join("\n\n"),
  };
}
