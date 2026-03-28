import type { SupportAssistantLocale, SupportConversationMessage } from "@/lib/ai/support/scenario-engine";

const englishGreetingPattern = /^(hi|hello|hey|good (morning|afternoon|evening)|how are you)\b/i;
const englishSignalPattern = /[A-Za-z]/;
const japaneseSignalPattern = /[\u3040-\u30ff\u3400-\u9fff]/;
const earlyActionKeywordsJa = ["予約", "相談したい", "詳しく話したい", "製品", "比較", "導入", "連携"];
const earlyActionKeywordsEn = ["book", "consult", "consultation", "product", "products", "compare", "implementation"];

export function detectConversationLocale(
  message: string,
  history: SupportConversationMessage[],
  fallback: SupportAssistantLocale,
) {
  const recentUserText = [message, ...history.filter((entry) => entry.role === "user").slice(-2).map((entry) => entry.content)]
    .join("\n")
    .trim();

  if (!recentUserText) {
    return fallback;
  }

  const hasJapanese = japaneseSignalPattern.test(recentUserText);
  const hasEnglish = englishSignalPattern.test(recentUserText);

  if (hasEnglish && !hasJapanese) {
    return "en" as const;
  }

  if (hasJapanese) {
    return "ja" as const;
  }

  return fallback;
}

export function shouldOfferActions(input: {
  locale: SupportAssistantLocale;
  userMessage: string;
  history: SupportConversationMessage[];
  relationshipStage?: "new" | "understanding" | "continuing" | "follow_up_ready" | null;
  openQuestion?: string | null;
}) {
  const trimmed = input.userMessage.trim();
  const lower = trimmed.toLowerCase();
  const userTurnCount = input.history.filter((entry) => entry.role === "user").length + 1;
  const lastAssistantMessage = [...input.history].reverse().find((entry) => entry.role === "assistant")?.content.trim() || "";
  const isTinyGreeting =
    trimmed.length <= 12 &&
    (englishGreetingPattern.test(trimmed) ||
      /^(こんにちは|こんばんは|もしもし|やあ|おはよう|hi|hello|hey)$/i.test(trimmed));

  if (isTinyGreeting) {
    return false;
  }

  const explicitActionIntent =
    input.locale === "en"
      ? earlyActionKeywordsEn.some((keyword) => lower.includes(keyword))
      : earlyActionKeywordsJa.some((keyword) => trimmed.includes(keyword));

  if (userTurnCount <= 2 && !explicitActionIntent) {
    return false;
  }

  if (userTurnCount <= 4 && input.relationshipStage !== "follow_up_ready" && !explicitActionIntent) {
    return false;
  }

  const previousTurnWasQuestion = lastAssistantMessage.endsWith("？") || lastAssistantMessage.endsWith("?");
  if (previousTurnWasQuestion && trimmed.length <= 140 && !explicitActionIntent) {
    return false;
  }

  if (input.openQuestion && trimmed.length <= 140 && !explicitActionIntent) {
    return false;
  }

  return true;
}
