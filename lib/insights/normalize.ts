import { getInsightSourceConfigById } from "@/lib/insights/sources";
import type { FetchedInsightItem, InsightCategory, InsightDraft, InsightRegion } from "@/lib/insights/types";

const keywordCategoryMap: Array<{ keywords: string[]; category: InsightCategory }> = [
  { keywords: ["高齢", "介護", "高齢者", "見守り"], category: "aging-society" },
  { keywords: ["地域交通", "コミュニティ", "公共交通", "交通空白"], category: "community-transport" },
  { keywords: ["シニア", "歩行", "移動支援", "福祉用具"], category: "senior-mobility" },
  { keywords: ["バリアフリー", "福祉", "病院", "通院", "介護保険", "アクセシビリティ"], category: "welfare-mobility" },
  { keywords: ["ラストマイル", "地域", "交通", "移動"], category: "local-transport" },
  { keywords: ["EV", "電動", "モビリティ", "自動運転"], category: "micro-mobility" },
];

export type NormalizedInsightCandidate = {
  slug: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  fetchedAt: string;
  category: InsightCategory;
  region: InsightRegion;
  tags: string[];
  rawTitle: string;
  rawExcerpt: string;
  createdFrom: "rss" | "fetch";
  ingestionNotes?: string;
};

function slugify(value: string) {
  const normalized = value
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

  return normalized;
}

function buildFallbackSlug(item: FetchedInsightItem) {
  const urlPart = item.sourceUrl
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-48);

  return `insight-${urlPart || item.sourceId}`;
}

function matchesKeywords(value: string, includeKeywords: string[], excludeKeywords: string[] = []) {
  const lower = value.toLowerCase();
  const included = includeKeywords.some((keyword) => lower.includes(keyword.toLowerCase()));
  const excluded = excludeKeywords.some((keyword) => lower.includes(keyword.toLowerCase()));
  return included && !excluded;
}

function matchesMobilityContext(text: string) {
  const lower = text.toLowerCase();
  const signals = [
    "交通",
    "移動",
    "移動支援",
    "モビリティ",
    "ラストマイル",
    "バリアフリー",
    "アクセシビリティ",
    "公共交通",
    "自動車",
    "EV",
    "電動",
    "walk",
    "walker",
    "rollator",
    "mobility",
    "transport",
    "transit",
    "older adult",
    "older adults",
    "elderly",
    "senior",
    "accessibility",
    "barrier-free",
    "barrierefrei",
    "mobilität",
    "verkehr",
    "bewegung",
    "出行",
    "步行",
    "移动",
    "老年",
    "高龄",
    "无障碍",
  ];

  return signals.some((keyword) => lower.includes(keyword.toLowerCase()));
}

function inferCategory(text: string, defaultCategory: InsightCategory) {
  const lower = text.toLowerCase();
  const matched = keywordCategoryMap.find((item) => item.keywords.some((keyword) => lower.includes(keyword.toLowerCase())));
  return matched?.category || defaultCategory;
}

export function normalizeFetchedItem(item: FetchedInsightItem): NormalizedInsightCandidate | null {
  const source = getInsightSourceConfigById(item.sourceId);

  if (!source) {
    return null;
  }

  const haystack = `${item.title} ${item.excerpt}`;

  if (!matchesKeywords(haystack, source.includeKeywords, source.excludeKeywords) || !matchesMobilityContext(haystack)) {
    return null;
  }

  const category = inferCategory(haystack, source.categoryHints[0]);
  const tags = Array.from(new Set([...source.tagHints, ...extractTags(haystack)]));

  return {
    slug: slugify(`${item.sourceName}-${item.title}`) || buildFallbackSlug(item),
    sourceName: item.sourceName,
    sourceUrl: item.sourceUrl,
    publishedAt: item.publishedAt,
    fetchedAt: new Date().toISOString(),
    category,
    region: source.region,
    tags,
    rawTitle: item.title,
    rawExcerpt: item.excerpt,
    createdFrom: source.type === "rss" ? "rss" : "fetch",
    ingestionNotes: source.note,
  };
}

function extractTags(text: string) {
  const tags: string[] = [];

  if (text.includes("高齢")) tags.push("高齢社会");
  if (text.includes("地域")) tags.push("地域交通");
  if (text.includes("バリアフリー")) tags.push("バリアフリー");
  if (text.includes("介護") || text.includes("福祉")) tags.push("介護・福祉");
  if (text.includes("EV") || text.includes("電動")) tags.push("EV");
  if (text.includes("通院")) tags.push("通院");
  if (text.includes("モビリティ")) tags.push("モビリティ");
  if (text.includes("ラストマイル")) tags.push("ラストマイル");
  if (/mobility/i.test(text)) tags.push("mobility");
  if (/transport/i.test(text)) tags.push("transport");
  if (/older adults?/i.test(text)) tags.push("older adults");
  if (/safety/i.test(text)) tags.push("safety");
  if (/barrierefrei|barrier-free/i.test(text)) tags.push("accessibility");

  return tags;
}

export function normalizeSourceUrl(url: string) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    const keptParams = ["id", "article", "press"];
    const nextParams = new URLSearchParams();

    [...parsed.searchParams.entries()]
      .filter(([key]) => keptParams.includes(key.toLowerCase()))
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([key, value]) => nextParams.set(key, value));

    parsed.search = nextParams.toString();
    const normalized = parsed.toString().replace(/\/$/, "");
    return normalized.toLowerCase();
  } catch {
    return url.trim().toLowerCase();
  }
}

export function dedupeCandidates<T extends { sourceUrl: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = normalizeSourceUrl(item.sourceUrl);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function existingDraftKeySet(drafts: InsightDraft[]) {
  return new Set(drafts.map((item) => normalizeSourceUrl(item.sourceUrl)));
}
