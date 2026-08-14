import type {
  SupportAssistantLocale,
  SupportNextActionType,
  SupportScenarioResult,
} from "@/lib/ai/support/scenario-engine";

export type SupportRecommendedAction = {
  id: SupportNextActionType;
  title: string;
  description: string;
  href: string;
  label: string;
};

function actionCopy(locale: SupportAssistantLocale, action: SupportNextActionType): SupportRecommendedAction {
  if (locale === "en") {
    switch (action) {
      case "continue_on_line":
        return {
          id: action,
          title: "Continue with LINE",
          description: "Continue this conversation with Hinata on LINE if that feels easier.",
          href: "/api/line/auth/start?locale=en&intent=support&returnTo=/en/support",
          label: "Continue on LINE",
        };
      case "save_with_consent":
        return {
          id: action,
          title: "Remember this",
          description: "Choose what, if anything, Hinata may keep for a future conversation.",
          href: "/en/support#memory-consent",
          label: "Choose what to remember",
        };
      case "revisit_later":
        return {
          id: action,
          title: "Come back to this later",
          description: "Leave this here and revisit it when you want to compare how things feel later.",
          href: "/en/support",
          label: "Revisit later",
        };
      case "reflect_now":
        return {
          id: action,
          title: "Find one small step",
          description: "Stay with the conversation and turn what you noticed into one small, optional next step.",
          href: "/en/support",
          label: "Reflect on one step",
        };
      case "no_action":
      default:
        return {
          id: "no_action",
          title: "No next step needed",
          description: "It is okay to leave the conversation here without doing anything else.",
          href: "",
          label: "No action",
        };
    }
  }

  switch (action) {
    case "continue_on_line":
      return {
        id: action,
        title: "LINEで続きを話す",
        description: "必要なら、ひなたとのこの会話をLINEで静かに続けられます。",
        href: "/api/line/auth/start?locale=ja&intent=support&returnTo=/support",
        label: "LINEで続ける",
      };
    case "save_with_consent":
      return {
        id: action,
        title: "このことを残す",
        description: "次にまた会うために、何を残すかを自分で選べます。残さない選択もできます。",
        href: "/support#memory-consent",
        label: "残す内容を選ぶ",
      };
    case "revisit_later":
      return {
        id: action,
        title: "あとでまた見てみる",
        description: "いまはここまでにして、時間を置いてから今との違いを見返せます。",
        href: "/support",
        label: "あとで振り返る",
      };
    case "reflect_now":
      return {
        id: action,
        title: "小さな一歩を考える",
        description: "今の気づきを、無理のない小さな一歩にするかどうか一緒に考えられます。",
        href: "/support",
        label: "一歩だけ考える",
      };
    case "no_action":
    default:
      return {
        id: "no_action",
        title: "今日はここまでで大丈夫",
        description: "何かを決めたり進めたりせず、ここで会話を終えても大丈夫です。",
        href: "",
        label: "何もしない",
      };
  }
}

export function routeSupportActions(
  result: SupportScenarioResult,
  locale: SupportAssistantLocale,
): SupportRecommendedAction[] {
  return result.nextActions
    .map((action) => actionCopy(locale, action))
    .filter((action, index, all) => all.findIndex((candidate) => candidate.id === action.id) === index);
}
