import { insightSeeds } from "@/lib/insights/content";
import { readInsightDrafts } from "@/lib/insights/storage";
import type { InsightCategory, InsightDraft, InsightEntry, InsightRegion, InsightSeed, Locale } from "@/lib/insights/types";

const categoryLabels: Record<Locale, Record<InsightCategory, string>> = {
  ja: {
    "aging-society": "高齢社会",
    "community-transport": "地域交通",
    "senior-mobility": "シニアモビリティ",
    "welfare-mobility": "福祉移動",
    "local-transport": "地域の交通課題",
    "micro-mobility": "マイクロモビリティ",
  },
  en: {
    "aging-society": "Aging Society",
    "community-transport": "Community Transport",
    "senior-mobility": "Senior Mobility",
    "welfare-mobility": "Welfare Mobility",
    "local-transport": "Local Transport",
    "micro-mobility": "Micro Mobility",
  },
};

const regionLabels: Record<Locale, Record<InsightRegion, string>> = {
  ja: {
    japan: "日本",
    kyushu: "九州",
    "local-community": "地域コミュニティ",
  },
  en: {
    japan: "Japan",
    kyushu: "Kyushu",
    "local-community": "Local Community",
  },
};

function toEntry(seed: InsightSeed, locale: Locale): InsightEntry {
  const localized = seed.content[locale];

  return {
    slug: seed.slug,
    sourceName: seed.sourceName,
    sourceUrl: seed.sourceUrl,
    publishedAt: seed.publishedAt,
    category: seed.category,
    categoryLabel: categoryLabels[locale][seed.category],
    region: seed.region,
    regionLabel: regionLabels[locale][seed.region],
    tags: seed.tags,
    title: localized.title,
    summary: localized.summary,
    whyItMatters: localized.whyItMatters,
    yorisouView: localized.yorisouView,
    practicalTakeaways: localized.practicalTakeaways,
    whatThisMeans: localized.whatThisMeans,
    sourceType: "seed",
    reviewStatus: "approved",
    featured: seed.featured || false,
    featuredRank: seed.featuredRank,
    homepageFeatured: seed.homepageFeatured || false,
  };
}

function draftToEntry(draft: InsightDraft, locale: Locale): InsightEntry {
  const localized = draft.content[locale];

  return {
    slug: draft.slug,
    sourceName: draft.sourceName,
    sourceUrl: draft.sourceUrl,
    publishedAt: draft.publishedAt,
    category: draft.category,
    categoryLabel: categoryLabels[locale][draft.category],
    region: draft.region,
    regionLabel: regionLabels[locale][draft.region],
    tags: draft.tags,
    title: localized.title,
    summary: localized.summary,
    whyItMatters: localized.whyItMatters,
    yorisouView: localized.yorisouView,
    practicalTakeaways: localized.practicalTakeaways,
    whatThisMeans: localized.whatThisMeans,
    sourceType: draft.createdFrom,
    reviewStatus: "approved",
    featured: draft.featured || false,
    featuredRank: draft.featuredRank,
    homepageFeatured: draft.homepageFeatured || false,
  };
}

function compareInsights(a: InsightEntry, b: InsightEntry) {
  const priorityA = a.homepageFeatured ? 0 : a.featured ? 1 : 2;
  const priorityB = b.homepageFeatured ? 0 : b.featured ? 1 : 2;

  if (priorityA !== priorityB) {
    return priorityA - priorityB;
  }

  const rankA = a.featuredRank ?? Number.MAX_SAFE_INTEGER;
  const rankB = b.featuredRank ?? Number.MAX_SAFE_INTEGER;
  if (rankA !== rankB) {
    return rankA - rankB;
  }

  return a.publishedAt < b.publishedAt ? 1 : -1;
}

export function getAllInsights(locale: Locale): InsightEntry[] {
  return insightSeeds
    .map((seed) => toEntry(seed, locale))
    .sort(compareInsights);
}

export async function getPublicInsights(locale: Locale): Promise<InsightEntry[]> {
  const publishedDrafts = (await readInsightDrafts())
    .filter((item) => item.reviewStatus === "approved" && item.approvedForPublic)
    .map((item) => draftToEntry(item, locale));

  return [...getAllInsights(locale), ...publishedDrafts].sort(compareInsights);
}

export function getInsightBySlug(slug: string, locale: Locale): InsightEntry | null {
  const seed = insightSeeds.find((item) => item.slug === slug);
  return seed ? toEntry(seed, locale) : null;
}

export async function getPublicInsightBySlug(slug: string, locale: Locale) {
  const seeded = getInsightBySlug(slug, locale);

  if (seeded) {
    return seeded;
  }

  const draft = (await readInsightDrafts()).find((item) => item.slug === slug && item.reviewStatus === "approved" && item.approvedForPublic);
  return draft ? draftToEntry(draft, locale) : null;
}

export function getLatestInsights(locale: Locale, limit = 3) {
  return getAllInsights(locale).slice(0, limit);
}

export async function getLatestPublicInsights(locale: Locale, limit = 3) {
  return (await getPublicInsights(locale)).slice(0, limit);
}

export async function getFeaturedPublicInsights(locale: Locale, limit = 3) {
  return (await getPublicInsights(locale))
    .filter((item) => item.featured)
    .slice(0, limit);
}

export async function getLatestPublicNonFeaturedInsights(locale: Locale, limit = 3) {
  return (await getPublicInsights(locale))
    .filter((item) => !item.featured)
    .slice(0, limit);
}

export async function getHomepagePriorityInsights(locale: Locale, heroLimit = 1, secondaryLimit = 3) {
  const all = await getPublicInsights(locale);
  const heroCandidates = all.filter((item) => item.homepageFeatured || item.featured);
  const hero = heroCandidates.slice(0, heroLimit);
  const heroSlugs = new Set(hero.map((item) => item.slug));
  const secondary = all.filter((item) => !heroSlugs.has(item.slug)).slice(0, secondaryLimit);

  return {
    hero,
    secondary,
  };
}

export function getInsightCategoriesFromEntries(all: InsightEntry[]) {
  return [...new Map(all.map((item) => [item.category, item.categoryLabel])).entries()].map(([value, label]) => ({
    value,
    label,
  }));
}

export function getInsightCategories(locale: Locale) {
  return getInsightCategoriesFromEntries(getAllInsights(locale));
}

export function getInsightTagsFromEntries(all: InsightEntry[]) {
  const tags = new Map<string, string>();
  all.forEach((item) => {
    item.tags.forEach((tag) => {
      tags.set(tag, tag);
    });
  });

  return [...tags.entries()].map(([value, label]) => ({ value, label }));
}

export function getInsightTags(locale: Locale) {
  return getInsightTagsFromEntries(getAllInsights(locale));
}

export function filterInsights(
  insights: InsightEntry[],
  filters: {
    category?: string;
    tag?: string;
  }
) {
  return insights.filter((item) => {
    const categoryMatch = !filters.category || item.category === filters.category;
    const tagMatch = !filters.tag || item.tags.includes(filters.tag);
    return categoryMatch && tagMatch;
  });
}
