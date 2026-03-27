import type { SupportAssistantLocale, SupportScenarioResult } from "@/lib/ai/support/scenario-engine";

export type SupportConversationPolicy = {
  opening: string;
  followUpQuestion: string;
  responsePriorities: string[];
  forbiddenStyles: string[];
};

export function getConversationPolicy(result: SupportScenarioResult, locale: SupportAssistantLocale): SupportConversationPolicy {
  if (locale === "en") {
    return {
      opening: "Start with reassurance, stay concise, and guide the user toward a concrete next step.",
      followUpQuestion:
        result.scenario === "institutional_inquiry"
          ? "What kind of support or collaboration are you considering first?"
          : "What part feels most difficult right now?",
      responsePriorities: ["acknowledge", "organize situation", "offer next step"],
      forbiddenStyles: ["hype", "hard sell", "technical jargon"],
    };
  }

  if (result.scenario === "family_mobility_support") {
    return {
      opening: "ご家族の気がかりにまず寄り添い、急がせずに整理する。",
      followUpQuestion: "差し支えなければ、いちばん気になっている場面をひとつ教えてください。",
      responsePriorities: ["お気持ちの受け止め", "状況整理", "家族向けの次の案内"],
      forbiddenStyles: ["押し売り", "技術説明中心", "断定的な判断"],
    };
  }

  if (result.scenario === "product_guidance") {
    return {
      opening: "いきなり製品を決めつけず、暮らしに合う考え方から案内する。",
      followUpQuestion: "通院・買い物・近所のお出かけのうち、どの場面を一番大切にしたいですか。",
      responsePriorities: ["安心感", "比較の考え方", "製品案内への接続"],
      forbiddenStyles: ["機能スペックの羅列", "営業色の強い表現", "専門用語の多用"],
    };
  }

  if (result.scenario === "consultation_booking") {
    return {
      opening: "予約や導入の相談に落ち着いてつなぎ、必要な準備だけを短く案内する。",
      followUpQuestion: "ご希望の内容に近いものがあれば、ひとつ教えてください。",
      responsePriorities: ["安心", "必要事項の整理", "相談予約への接続"],
      forbiddenStyles: ["事務的な手続き説明", "長い注意書き", "冷たい言い回し"],
    };
  }

  if (result.scenario === "institutional_inquiry") {
    return {
      opening: "協業や導入の相談として、簡潔に役割と次の窓口を案内する。",
      followUpQuestion: "まずは、導入相談・実証検討・情報交換のどれに近いかお聞かせください。",
      responsePriorities: ["要点整理", "活用イメージ", "導入・協業相談への接続"],
      forbiddenStyles: ["伴走口調の多用", "過度な感情表現", "技術優位の誇張"],
    };
  }

  return {
    opening: "不安にまず寄り添い、ひとつずつ整理しながら次の案内につなげる。",
    followUpQuestion: "最近の外出や移動で、いちばん気になっている場面を教えてください。",
    responsePriorities: ["安心感", "状況整理", "相談予約や製品案内への接続"],
    forbiddenStyles: ["決めつけ", "過度な売り込み", "技術的すぎる説明"],
  };
}
