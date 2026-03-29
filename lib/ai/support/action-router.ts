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
        href: "/en/contact",
        label: "Contact Yorisou",
      };
    }
    if (action === "suggest_products") {
      return {
        id: action,
        title: "Product guidance",
        description: "Review product options that may fit daily mobility needs.",
        href: "/en/products",
        label: "View products",
      };
    }
    if (action === "family_support_info") {
      return {
        id: action,
        title: "Family support",
        description: "Continue with guidance that can be shared with family.",
        href: "/en/support#family-share",
        label: "View family support",
      };
    }
    return {
      id: action,
      title: "Implementation inquiry",
      description: "Talk about collaboration, pilots, or implementation support.",
      href: "/en/contact",
      label: "Contact for collaboration",
    };
  }

  if (action === "offer_consultation") {
    return {
      id: action,
      title: "もう少し詳しく話す",
      description: "ひなたとの内容をふまえて、次の支え方を落ち着いて一緒に考えられます。",
      href: "/contact",
      label: "次の相談につなぐ",
    };
  }
  if (action === "suggest_products") {
    return {
      id: action,
      title: "支え方や製品を見る",
      description: "移動や暮らしのご様子に合わせて、合いそうな支え方を静かに見比べられます。",
      href: "/products",
      label: "支え方を見る",
    };
  }
  if (action === "family_support_info") {
    return {
      id: action,
      title: "ご家族と一緒に見る",
      description: "ご家族とも共有しながら、無理のない進め方を見ていけます。",
      href: "/support#scenario-assistant",
      label: "ご家族向けの見方へ",
    };
  }
  return {
    id: action,
    title: "導入や連携を考える",
    description: "自治体や介護関係者の方とも、現場に合う進め方を落ち着いて整理できます。",
    href: "/contact",
    label: "導入・連携の相談へ",
  };
}

export function routeSupportActions(
  result: SupportScenarioResult,
  locale: SupportAssistantLocale,
): SupportRecommendedAction[] {
  return result.nextActions.map((action) => actionCopy(locale, action));
}
