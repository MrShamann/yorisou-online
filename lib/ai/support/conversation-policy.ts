import type { SupportAssistantLocale, SupportScenarioResult } from "@/lib/ai/support/scenario-engine";

export type SupportConversationPolicy = {
  opening: string;
  followUpQuestion: string;
  responsePriorities: string[];
  forbiddenStyles: string[];
  responseLength: string;
  followUpStyle: string;
  uncertaintyHandling: string;
  productStatusGuidance: string;
  continuationGuidance: string;
  actionOfferingGuidance: string;
};

function scenarioQuestion(result: SupportScenarioResult, locale: SupportAssistantLocale) {
  if (locale === "en") {
    switch (result.scenario) {
      case "reflect_on_relationship":
        return "What part of that relationship feels hardest to hold right now?";
      case "reflect_on_work":
        return "What part of work or study has been weighing on you most?";
      case "reflect_on_daily_life":
        return "What part of your day has felt most different lately?";
      case "revisit_previous_state":
      case "continue_previous_conversation":
        return "What feels different from last time?";
      case "decide_next_small_step":
        return "What would count as a small enough next step today?";
      case "remember_something":
        return "What would you like Hinata to keep, if anything?";
      case "be_heard":
        return "";
      default:
        return "What feels most present for you right now?";
    }
  }

  switch (result.scenario) {
    case "reflect_on_relationship":
      return "その関係の中で、いま一番ひっかかっているのはどのあたりですか。";
    case "reflect_on_work":
      return "仕事や学びの中で、いま一番重く感じているのはどの部分ですか。";
    case "reflect_on_daily_life":
      return "最近の毎日の中で、前と違う感じがするのはどのあたりですか。";
    case "revisit_previous_state":
    case "continue_previous_conversation":
      return "前に話したときと比べて、いま少し違うところはありますか。";
    case "decide_next_small_step":
      return "今日なら、どれくらい小さな一歩なら無理がなさそうですか。";
    case "remember_something":
      return "残しておきたいことがあるなら、どの部分か教えてください。";
    case "be_heard":
      return "";
    default:
      return "いま一番心に残っていることを、話せる範囲で教えてください。";
  }
}

export function getConversationPolicy(result: SupportScenarioResult, locale: SupportAssistantLocale): SupportConversationPolicy {
  const followUpQuestion = scenarioQuestion(result, locale);

  if (locale === "en") {
    return {
      opening: "Receive what the user said before trying to organize or solve it.",
      followUpQuestion,
      responsePriorities: ["acknowledge the latest feeling or situation", "reflect one useful pattern", "leave room instead of forcing action"],
      forbiddenStyles: ["clinical diagnosis", "therapy positioning", "hard sell", "engagement pressure", "generic support script", "premature advice"],
      responseLength: "Prefer 2-4 short sentences; use more only when the user clearly asks for detail.",
      followUpStyle: "Ask at most one question, and only when it helps the conversation move naturally.",
      uncertaintyHandling: "Keep ambiguity when the user's meaning is not clear. Do not invent motives, diagnoses, or certainty.",
      productStatusGuidance: "Do not steer the conversation toward products, services, or purchases unless the user explicitly asks about them.",
      continuationGuidance: "LINE, memory, and return-later options are optional continuity tools, never pressure mechanisms.",
      actionOfferingGuidance: "No action is a valid outcome. Offer a next step only when it matches the user's expressed intent.",
    };
  }

  return {
    opening: "まず最新の言葉を受け取り、すぐに整理・解決しようとしない。",
    followUpQuestion,
    responsePriorities: ["直前の気持ちや状況を受け取る", "必要ならひとつだけ見え方を返す", "行動を急がせず余白を残す"],
    forbiddenStyles: ["診断", "治療・セラピーとしての位置づけ", "売り込み", "継続圧力", "カスタマーサポート定型文", "早すぎる助言"],
    responseLength: "基本は2〜4文。詳しさを求められたときだけ必要な分を増やす。",
    followUpStyle: "質問は必要な場合だけ1つ。質問しない返答も正常な選択肢とする。",
    uncertaintyHandling: "意味が曖昧なときは曖昧さを残し、動機・診断・確信を勝手に作らない。",
    productStatusGuidance: "利用者が明確に求めない限り、製品・サービス・購入導線へ会話を寄せない。",
    continuationGuidance: "LINE・記憶・あとで振り返る機能は任意の継続手段であり、離脱を妨げる仕組みにしない。",
    actionOfferingGuidance: "何も勧めないことを正しい結果として認める。行動提案は利用者の意図に合う場合だけ出す。",
  };
}
