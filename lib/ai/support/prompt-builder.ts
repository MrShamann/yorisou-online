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

OpenClaw capability plan:
- 主軸: ${input.capabilityPlan?.primary || "support_reasoning"}
- 補助: ${input.capabilityPlan?.secondary.join(" / ") || "なし"}
- メモ: ${input.capabilityPlan?.notes.join(" / ") || "なし"}

使える知識:
${input.knowledge?.snippets.map((snippet) => `- ${snippet.title}: ${snippet.summary} / ${snippet.whyItMatters}`).join("\n") || "なし"}

今回の入力:
${input.userMessage || "未入力"}

返答ルール:
1. まず不安や状況をやさしく受け止める
2. 会話履歴がある場合は、最新の利用者発話にだけ自然に続ける
3. 前のひなたの返答と同じ要点や同じ確認質問を繰り返さない
4. 次に一歩だけ整理する
5. 質問は必要な場合だけ1つ
6. 最後に必要なら次の案内をやわらかく添える
5. 本文だけを返す`
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

OpenClaw capabilities:
- primary: ${input.capabilityPlan?.primary || "support_reasoning"}
- secondary: ${input.capabilityPlan?.secondary.join(" / ") || "none"}
- notes: ${input.capabilityPlan?.notes.join(" / ") || "none"}

Knowledge:
${input.knowledge?.snippets.map((snippet) => `- ${snippet.title}: ${snippet.summary} / ${snippet.whyItMatters}`).join("\n") || "none"}

User message:
${input.userMessage || "No message"}

Reply in 2-4 short sentences, with at most one natural follow-up question.
If history exists, continue from the latest user message and do not repeat the same assistant summary or question from the previous turn.`;
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
    return {
      message: `${
        continued ? "Thank you for adding that." : "Thank you for sharing that."
      } Yorisou can help organize this calmly and keep the next step simple. ${
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
  const latestFocus = input.userMessage.replace(/\s+/g, " ").trim();
  const focusText = latestFocus.length > 28 ? `${latestFocus.slice(0, 28)}…` : latestFocus;

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
      ? input.memory?.thread?.openQuestion === input.policy.followUpQuestion
        ? input.scenario.scenario === "family_mobility_support"
          ? "ご本人が受け入れやすそうな移動手段や条件があれば、思いつく範囲で教えてください。"
          : input.scenario.scenario === "product_guidance"
            ? "距離・段差・収納のうち、まず気になるものはどれに近いでしょうか。"
            : input.scenario.scenario === "consultation_booking"
              ? "進め方のご希望があれば、ひとつだけ教えてください。"
              : "その場面で特に負担が大きいところを、ひとつだけ教えてください。"
        : input.policy.followUpQuestion
      : "";
  const actionLead = input.actions[0]
    ? turnCount >= 2
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
