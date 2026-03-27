import type { SupportConversationPolicy } from "@/lib/ai/support/conversation-policy";
import type {
  SupportAssistantLocale,
  SupportConversationMessage,
  SupportScenarioResult,
} from "@/lib/ai/support/scenario-engine";
import type { SupportRecommendedAction } from "@/lib/ai/support/action-router";

export function buildSupportAssistantPrompt(input: {
  locale: SupportAssistantLocale;
  userMessage: string;
  history: SupportConversationMessage[];
  scenario: SupportScenarioResult;
  policy: SupportConversationPolicy;
  actions: SupportRecommendedAction[];
}) {
  return input.locale === "ja"
    ? `あなたは Yorisou の相談案内担当です。やさしく、誠実に。高齢者とご家族に寄り添う短い日本語で返答してください。

判断はすでに終わっています。あなたの役割は自然な表現だけです。

相談者区分: ${input.scenario.labels.persona}
相談テーマ: ${input.scenario.labels.scenario}
ご案内トーン: ${input.scenario.toneMode}
優先事項: ${input.policy.responsePriorities.join(" / ")}
避ける表現: ${input.policy.forbiddenStyles.join(" / ")}
確認質問: ${input.policy.followUpQuestion}
次の案内候補: ${input.actions.map((action) => action.title).join(" / ")}

会話履歴: ${JSON.stringify(input.history)}
今回の入力: ${input.userMessage || "未入力"}

以下の形で 2〜4 文で返答してください。
1. まず気持ちや状況を受け止める
2. 次に短く整理する
3. 必要なら質問を1つだけ入れる
4. 最後に次の案内へやわらかくつなぐ`
    : `You are Yorisou's support guide. Write a calm, warm, short reply for older adults and families in Japan. Decision-making is already done. You only handle expression.

Persona: ${input.scenario.labels.persona}
Scenario: ${input.scenario.labels.scenario}
Tone: ${input.scenario.toneMode}
Priorities: ${input.policy.responsePriorities.join(" / ")}
Avoid: ${input.policy.forbiddenStyles.join(" / ")}
Question: ${input.policy.followUpQuestion}
Next actions: ${input.actions.map((action) => action.title).join(" / ")}

Conversation history: ${JSON.stringify(input.history)}
User message: ${input.userMessage || "No message"}

Reply in 2-4 short sentences.`;
}

export function buildDeterministicSupportReply(input: {
  locale: SupportAssistantLocale;
  userMessage: string;
  scenario: SupportScenarioResult;
  policy: SupportConversationPolicy;
  actions: SupportRecommendedAction[];
}) {
  if (input.locale === "en") {
    return {
      message: `Thank you for sharing that. Yorisou can help organize this calmly and point you to a useful next step. ${input.policy.followUpQuestion} ${input.actions.length > 0 ? `We can also guide you toward ${input.actions[0].title.toLowerCase()}.` : ""}`.trim(),
    };
  }

  const opening =
    input.scenario.scenario === "family_mobility_support"
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
      ? "まずは、外出のどの場面に不安があるのかを落ち着いて整理すると進めやすくなります。"
      : input.scenario.scenario === "family_mobility_support"
        ? "ご本人のご様子とご家族の気がかりを一緒に整理しながら、無理のない支え方を考えられます。"
        : input.scenario.scenario === "product_guidance"
          ? "いきなり決めるのではなく、使う場面に合わせて見方を整理すると選びやすくなります。"
          : input.scenario.scenario === "consultation_booking"
            ? "内容を確認しながら、相談予約や導入相談につながる形でご案内できます。"
            : "導入や協業のご相談として、目的に合わせて要点を整理しながらご案内できます。";

  const question = input.scenario.shouldAskClarifyingQuestion ? input.policy.followUpQuestion : "";
  const actionLead = input.actions[0]
    ? `必要に応じて、${input.actions[0].title}にもおつなぎできます。`
    : "必要に応じて、次のご案内をご提案します。";

  return {
    message: [opening, summary, question, actionLead].filter(Boolean).join("\n\n"),
  };
}
