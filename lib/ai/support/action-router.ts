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
    if (action === "offer_consultation") {
      return {
        id: action,
        title: "Consultation",
        description: "Move into a calmer direct consultation.",
        href: "/contact",
        label: "Contact Yorisou",
      };
    }
    if (action === "suggest_products") {
      return {
        id: action,
        title: "Product guidance",
        description: "Review product options that may fit daily mobility needs.",
        href: "/products",
        label: "View products",
      };
    }
    if (action === "family_support_info") {
      return {
        id: action,
        title: "Family support",
        description: "Continue with guidance that can be shared with family.",
        href: "/support#family-share",
        label: "View family support",
      };
    }
    return {
      id: action,
      title: "Implementation inquiry",
      description: "Talk about collaboration, pilots, or implementation support.",
      href: "/contact",
      label: "Contact for collaboration",
    };
  }

  if (action === "offer_consultation") {
    return {
      id: action,
      title: "相談予約",
      description: "まずはお気軽にご相談ください。内容を確認しながらご案内します。",
      href: "/contact",
      label: "相談予約へ進む",
    };
  }
  if (action === "suggest_products") {
    return {
      id: action,
      title: "製品案内",
      description: "移動のご様子に合わせて、製品の見方を一緒に整理できます。",
      href: "/products",
      label: "製品を見てみる",
    };
  }
  if (action === "family_support_info") {
    return {
      id: action,
      title: "ご家族向けサポート入口",
      description: "ご家族とも共有しながら、落ち着いて進められます。",
      href: "/support#scenario-assistant",
      label: "ご家族向けの案内を見る",
    };
  }
  return {
    id: action,
    title: "導入 / 協業相談",
    description: "自治体や介護関係者のご相談も、内容を確認しながらご案内します。",
    href: "/contact",
    label: "導入・協業相談へ進む",
  };
}

export function routeSupportActions(
  result: SupportScenarioResult,
  locale: SupportAssistantLocale,
): SupportRecommendedAction[] {
  return result.nextActions.map((action) => actionCopy(locale, action));
}
