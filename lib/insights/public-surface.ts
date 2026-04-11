import { readInsightKnowledgeRecords } from "@/lib/insights/knowledge-storage";
import type {
  Locale,
  MobilityKnowledgeObject,
  InsightPublicStage,
  MobilityKnowledgeProductCategory,
  MobilityKnowledgeSignalType,
} from "@/lib/insights/types";

export type LivePublicInsightCard = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  whyItMatters: string;
  publicFormat: "product_intelligence" | "signal_read" | "background_read";
  sourceName: string;
  sourceUrl: string;
  country: string;
  productCategory: string;
  updatedAt: string;
  imageUrl: string | null;
  keySpecs: string[];
  specSummary: string | null;
  fitPeople: string[];
  fitScene: string[];
  priceBand: string | null;
  japanFitNote: string | null;
  referenceDocUrl: string | null;
  sourceLink: string | null;
};

export type LivePublicInsightsSurface = {
  locale: Locale;
  latestRefreshAt: string | null;
  latestFinishedAt: string | null;
  cards: LivePublicInsightCard[];
};

function stageRank(stage: InsightPublicStage) {
  switch (stage) {
    case "public_featured":
      return 0;
    case "public_fresh":
      return 1;
    case "public_background":
    default:
      return 2;
  }
}

function compact(value: string, limit = 180) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > limit ? `${normalized.slice(0, limit - 3)}...` : normalized;
}

function sanitizePublicText(value: string) {
  return compact(
    value
      .replace(/Freshness\s*\d+\/100[, ]*urgency\s*\d+\/100\.?/gi, "")
      .replace(/\bFreshness\b/gi, "")
      .replace(/\burgency\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim(),
    260,
  );
}

function localizedSummary(knowledge: MobilityKnowledgeObject, locale: Locale) {
  if (locale === "en") {
    return sanitizePublicText(knowledge.translated_summary_en || knowledge.summary_for_public_use || knowledge.summary_for_internal_use);
  }
  return sanitizePublicText(knowledge.translated_summary_ja || knowledge.summary_for_public_use || knowledge.summary_for_internal_use);
}

function localizedWhyItMatters(knowledge: MobilityKnowledgeObject, locale: Locale) {
  const scene = knowledge.fit_scene[0] || (locale === "en" ? "daily mobility" : "日常の移動場面");
  const people = knowledge.fit_people[0] || (locale === "en" ? "older adults" : "ご本人やご家族");
  const publicSummary = locale === "en"
    ? sanitizePublicText(knowledge.summary_for_public_use || knowledge.translated_summary_en || knowledge.summary_for_internal_use)
    : sanitizePublicText(knowledge.summary_for_public_use || knowledge.translated_summary_ja || knowledge.summary_for_internal_use);

  if (locale === "en") {
    const base = `${knowledge.source_title} may be helpful if you are comparing ${scene} options for ${people}.`;
    return sanitizePublicText(publicSummary ? `${base} ${publicSummary}` : base);
  }

  const base = `${scene}での選び方を考えるときに、${people}向けかどうかを見ておきたい項目です。`;
  return sanitizePublicText(publicSummary ? `${base} ${publicSummary}` : base);
}

function localizedProblemFocus(knowledge: MobilityKnowledgeObject, locale: Locale) {
  const scene = knowledge.fit_scene[0] || (locale === "en" ? "daily mobility" : "日常の移動場面");
  const people = knowledge.fit_people[0] || (locale === "en" ? "older adults" : "ご本人やご家族");

  if (locale === "en") {
    return sanitizePublicText(`${knowledge.source_title} may be useful when comparing ${scene} choices for ${people}.`);
  }

  return sanitizePublicText(`${scene}での選び方を考えるときに、${people}向けかどうかを見ておきたい項目です。`);
}

function publicFormatFor(knowledge: MobilityKnowledgeObject, publicStage: InsightPublicStage) {
  if (
    knowledge.signal_type === "product_intelligence" ||
    ["walking_support", "short_distance_mobility", "portable_mobility", "transfer_support", "vehicle_entry_support"].includes(knowledge.product_category)
  ) {
    return "product_intelligence" as const;
  }

  if (publicStage === "public_featured" || knowledge.signal_type === "innovation_signal" || knowledge.signal_type === "market_signal") {
    return "signal_read" as const;
  }

  return "background_read" as const;
}

function signalLabel(locale: Locale, signalType: MobilityKnowledgeSignalType) {
  const labels: Record<Locale, Record<MobilityKnowledgeSignalType, string>> = {
    ja: {
      product_intelligence: "製品",
      service_signal: "サービス",
      policy_signal: "制度",
      incident_signal: "安全",
      innovation_signal: "実証",
      social_signal: "生活実感",
      market_signal: "市場",
    },
    en: {
      product_intelligence: "Product",
      service_signal: "Service",
      policy_signal: "Policy",
      incident_signal: "Safety",
      innovation_signal: "Pilot",
      social_signal: "Social",
      market_signal: "Market",
    },
  };

  return labels[locale][signalType];
}

function audienceLabel(locale: Locale, knowledge: MobilityKnowledgeObject) {
  const isOperator = knowledge.signal_type === "policy_signal" || knowledge.signal_type === "market_signal";
  const isFamily =
    knowledge.fit_people.includes("family caregivers") ||
    knowledge.product_category === "portable_mobility" ||
    knowledge.product_category === "mobility_service";

  if (locale === "ja") {
    if (isOperator) return "現場・事業者向け";
    if (isFamily) return "ご家族向け";
    return "ご本人向け";
  }

  if (isOperator) return "For operators";
  if (isFamily) return "For families";
  return "For seniors";
}

function audienceLabelFromFields(locale: Locale, productCategory: MobilityKnowledgeProductCategory, signalType: MobilityKnowledgeSignalType) {
  const isOperator = signalType === "policy_signal" || signalType === "market_signal";
  const isFamily = productCategory === "portable_mobility" || productCategory === "mobility_service";

  if (locale === "ja") {
    if (isOperator) return "現場・事業者向け";
    if (isFamily) return "ご家族向け";
    return "ご本人向け";
  }

  if (isOperator) return "For operators";
  if (isFamily) return "For families";
  return "For seniors";
}

export async function fetchLivePublicInsightsSurface(locale: Locale, limit = 3): Promise<LivePublicInsightsSurface> {
  const records = await readInsightKnowledgeRecords();
  const publicCandidates = records
    .filter((record) => record.mobilityKnowledge?.visibility_decision === "public_candidate" && record.mobilityKnowledge)
    .map((record) => {
      const knowledge = record.mobilityKnowledge as MobilityKnowledgeObject;
      const publicStage = knowledge.publicStage || "public_background";
      return {
        sortRank: stageRank(publicStage),
        freshnessScore: knowledge.freshness_score,
        urgencyScore: knowledge.urgency_score,
        updatedAt: knowledge.updated_at,
          card: {
            id: knowledge.source_id,
            slug: record.slug,
            title: knowledge.source_title,
            summary: sanitizePublicText(localizedSummary(knowledge, locale)),
            whyItMatters: sanitizePublicText(localizedWhyItMatters(knowledge, locale)),
            publicFormat: publicFormatFor(knowledge, publicStage),
            sourceName: record.sourceName,
            sourceUrl: knowledge.source_url,
            country: knowledge.country,
            productCategory: knowledge.product_category,
            updatedAt: knowledge.updated_at,
            imageUrl: knowledge.image_url || null,
            keySpecs: knowledge.key_specs || [],
            specSummary: knowledge.spec_summary || null,
            fitPeople: knowledge.fit_people || [],
            fitScene: knowledge.fit_scene || [],
            priceBand: knowledge.price_band || null,
            japanFitNote: knowledge.japan_fit_note || null,
          referenceDocUrl: knowledge.reference_doc_url || null,
          sourceLink: knowledge.source_link || null,
        } satisfies LivePublicInsightCard,
      };
    })
    .sort((a, b) => {
      if (a.sortRank !== b.sortRank) {
        return a.sortRank - b.sortRank;
      }
      if (a.freshnessScore !== b.freshnessScore) {
        return b.freshnessScore - a.freshnessScore;
      }
      if (a.urgencyScore !== b.urgencyScore) {
        return b.urgencyScore - a.urgencyScore;
      }
      return b.updatedAt.localeCompare(a.updatedAt);
    })
    .slice(0, limit)
    .map((item) => item.card);

  const latestRecordTimestamp =
    records
      .map((record) => record.mobilityKnowledge?.updated_at || record.mobilityKnowledge?.last_checked_at || record.fetchedAt || record.publishedAt || null)
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] || null;

  const latestRefreshAt = latestRecordTimestamp;
  const latestFinishedAt = latestRecordTimestamp;
  return {
    locale,
    latestRefreshAt,
    latestFinishedAt,
    cards: publicCandidates,
  };
}

export function getPublicStageLabel(locale: Locale, stage: InsightPublicStage) {
  const labels: Record<Locale, Record<InsightPublicStage, string>> = {
    ja: {
      public_featured: "注目",
      public_fresh: "新着",
      public_background: "背景",
    },
    en: {
      public_featured: "Featured",
      public_fresh: "Fresh",
      public_background: "Background",
    },
  };

  return labels[locale][stage];
}

export function getPublicSignalLabel(locale: Locale, signalType: MobilityKnowledgeSignalType) {
  return signalLabel(locale, signalType);
}

export function getPublicAudienceLabel(locale: Locale, knowledge: MobilityKnowledgeObject) {
  return audienceLabel(locale, knowledge);
}

export function getPublicAudienceLabelFromFields(
  locale: Locale,
  productCategory: MobilityKnowledgeProductCategory,
  signalType: MobilityKnowledgeSignalType,
) {
  return audienceLabelFromFields(locale, productCategory, signalType);
}

export function getPublicFormatLabel(locale: Locale, format: LivePublicInsightCard["publicFormat"]) {
  const labels: Record<Locale, Record<LivePublicInsightCard["publicFormat"], string>> = {
    ja: {
      product_intelligence: "製品の見方",
      signal_read: "移動の読み",
      background_read: "背景",
    },
    en: {
      product_intelligence: "Product view",
      signal_read: "Mobility note",
      background_read: "Background",
    },
  };

  return labels[locale][format];
}

export function getPublicProblemFocus(knowledge: MobilityKnowledgeObject, locale: Locale) {
  return localizedProblemFocus(knowledge, locale);
}

export function formatRelativeTime(value: string | null, locale: Locale) {
  if (!value) {
    return locale === "ja" ? "更新時刻未取得" : "refresh time unavailable";
  }

  const diffMs = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(diffMs)) {
    return locale === "ja" ? "更新時刻未取得" : "refresh time unavailable";
  }

  const minutes = Math.round(diffMs / 60000);
  const hours = Math.round(diffMs / 3600000);
  const days = Math.round(diffMs / 86400000);

  if (minutes < 60) {
    return locale === "ja" ? `${Math.max(minutes, 1)}分前に更新` : `${Math.max(minutes, 1)} min ago`;
  }
  if (hours < 24) {
    return locale === "ja" ? `${hours}時間前に更新` : `${hours} h ago`;
  }
  return locale === "ja" ? `${days}日前に更新` : `${days} days ago`;
}
