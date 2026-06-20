import type {
  InsightCrawlMode,
  InsightSourceClass,
  InsightSourceConfig,
  InsightSourceRegistryEntry,
  MobilityKnowledgeCountry,
} from "@/lib/insights/types";

const nowIso = new Date().toISOString();

function makeEntry(
  input: Omit<InsightSourceRegistryEntry, "approval_status" | "last_checked_at"> &
    Partial<Pick<InsightSourceRegistryEntry, "approval_status" | "last_checked_at">>,
): InsightSourceRegistryEntry {
  return {
    id: input.id,
    name: input.name,
    type: input.type,
    url: input.url,
    country: input.country,
    language: input.language,
    region: input.region,
    categoryHints: input.categoryHints,
    tagHints: input.tagHints,
    includeKeywords: input.includeKeywords,
    excludeKeywords: input.excludeKeywords,
    linkIncludePatterns: input.linkIncludePatterns,
    linkExcludePatterns: input.linkExcludePatterns,
    itemLimit: input.itemLimit,
    note: input.note,
    source_name: input.source_name,
    source_url: input.source_url,
    source_type: input.source_type,
    source_class: input.source_class,
    trust_score: input.trust_score,
    crawl_mode: input.crawl_mode,
    active: input.active,
    approval_status: input.approval_status || (input.active ? "approved" : "candidate"),
    last_checked_at: input.last_checked_at ?? null,
  };
}

function scoreSource(sourceClass: InsightSourceClass, country: MobilityKnowledgeCountry, crawlMode: InsightCrawlMode, active: boolean) {
  let score = 20;

  switch (sourceClass) {
    case "official_public":
      score += 45;
      break;
    case "association":
      score += 38;
      break;
    case "manufacturer":
      score += 34;
      break;
    case "product_page":
      score += 30;
      break;
    case "specialist_media":
      score += 32;
      break;
    case "regional":
      score += 28;
      break;
    case "innovation_expo":
      score += 24;
      break;
  }

  if (country === "japan" || country === "germany" || country === "united_states" || country === "china") {
    score += 10;
  }
  if (crawlMode === "html_article") score += 6;
  if (crawlMode === "html_index") score += 4;
  if (crawlMode === "rss" || crawlMode === "atom") score += 8;
  if (active) score += 6;
  return Math.max(0, Math.min(100, score));
}

export const insightSourceRegistry: InsightSourceRegistryEntry[] = [
  makeEntry({
    id: "jp-mlit-press",
    name: "国土交通省 報道発表",
    type: "rss",
    url: "https://www.mlit.go.jp/pressrelease.rdf",
    country: "japan",
    language: "ja",
    region: "japan",
    categoryHints: ["community-transport", "local-transport", "welfare-mobility", "micro-mobility"],
    tagHints: ["国交省", "地域交通"],
    includeKeywords: ["交通", "移動", "地域", "高齢", "バリアフリー", "自動運転", "モビリティ", "EV", "道路", "鉄道", "バス", "自動車", "物流", "ETC"],
    excludeKeywords: ["港湾", "航空", "船舶", "観光庁のみ", "河川", "下水道"],
    note: "Mobility-relevant items are filtered from the broader MLIT press feed.",
    source_name: "国土交通省 報道発表",
    source_url: "https://www.mlit.go.jp/pressrelease.rdf",
    source_type: "rss",
    source_class: "official_public",
    trust_score: 88,
    crawl_mode: "rss",
    active: true,
    last_checked_at: nowIso,
  }),
  makeEntry({
    id: "jp-action-japan-walker",
    name: "アクションジャパン 歩行補助",
    type: "html_article",
    url: "https://www.actionjapan.co.jp/english/products06/walker1.html",
    country: "japan",
    language: "en",
    region: "local-community",
    categoryHints: ["senior-mobility", "welfare-mobility"],
    tagHints: ["日本", "歩行支援", "製品"],
    includeKeywords: ["walker", "walking aid", "foldable", "lightweight", "elderly", "Japan"],
    excludeKeywords: ["cookie", "privacy"],
    note: "Japanese manufacturer product page for foldable walker intelligence.",
    source_name: "アクションジャパン 歩行補助",
    source_url: "https://www.actionjapan.co.jp/english/products06/walker1.html",
    source_type: "html_article",
    source_class: "manufacturer",
    trust_score: 79,
    crawl_mode: "html_article",
    active: true,
    last_checked_at: nowIso,
  }),
  makeEntry({
    id: "jp-matsunaga-walker",
    name: "松永製作所 Walker",
    type: "html_index",
    url: "https://www.matsunaga-w.co.jp/global/product/",
    country: "japan",
    language: "en",
    region: "local-community",
    categoryHints: ["senior-mobility", "welfare-mobility"],
    tagHints: ["日本", "歩行器", "製品"],
    includeKeywords: ["walker", "walkers", "folded", "medical", "welfare"],
    excludeKeywords: ["privacy", "cookie"],
    note: "Japanese manufacturer page with walker catalog detail.",
    source_name: "松永製作所 Walker",
    source_url: "https://www.matsunaga-w.co.jp/global/product/",
    source_type: "html_index",
    source_class: "manufacturer",
    trust_score: 77,
    crawl_mode: "html_index",
    active: true,
    last_checked_at: nowIso,
  }),
  makeEntry({
    id: "cn-gov-news-index",
    name: "中国 国務院新闻",
    type: "html_index",
    url: "https://english.www.gov.cn/news/",
    country: "china",
    language: "en",
    region: "local-community",
    categoryHints: ["community-transport", "local-transport", "micro-mobility"],
    tagHints: ["中国", "政策", "交通"],
    includeKeywords: ["transport", "mobility", "road", "safety", "walking", "older adults", "elderly", "accessibility", "subsidy", "public transport"],
    excludeKeywords: ["foreign affairs", "finance", "economy", "technology diplomacy"],
    linkIncludePatterns: ["/news/\\d{6}/content_.*\\.html", "/m/chinavoices/\\d{4}-\\d{2}/\\d{2}/content_.*\\.html"],
    itemLimit: 8,
    note: "Crawls the State Council news index and follows transport-relevant article links.",
    source_name: "中国 国务院新闻",
    source_url: "https://english.www.gov.cn/news/",
    source_type: "html_index",
    source_class: "official_public",
    trust_score: 82,
    crawl_mode: "html_index",
    active: true,
    last_checked_at: nowIso,
  }),
  makeEntry({
    id: "cn-yuteng-walker",
    name: "Yuteng Walker Rollators",
    type: "html_article",
    url: "https://www.yutengmed.com/walker-rollators",
    country: "china",
    language: "en",
    region: "local-community",
    categoryHints: ["senior-mobility", "welfare-mobility"],
    tagHints: ["中国", "歩行器", "製品"],
    includeKeywords: ["walker", "rollator", "elderly", "mobility", "manufacturer", "folding", "walking aid"],
    excludeKeywords: ["cookie", "privacy"],
    note: "Chinese manufacturer page for walker product intelligence.",
    source_name: "Yuteng Walker Rollators",
    source_url: "https://www.yutengmed.com/walker-rollators",
    source_type: "html_article",
    source_class: "manufacturer",
    trust_score: 74,
    crawl_mode: "html_article",
    active: true,
    last_checked_at: nowIso,
  }),
  makeEntry({
    id: "cn-reizberg-rollator",
    name: "Reizberg Rollator and Mobility Scooter",
    type: "html_article",
    url: "https://www.reizbergmed.com/",
    country: "china",
    language: "en",
    region: "local-community",
    categoryHints: ["senior-mobility", "welfare-mobility"],
    tagHints: ["中国", "折りたたみ", "ロールator"],
    includeKeywords: ["rollator", "mobility scooter", "walker", "carbon fiber", "lightweight", "manufacturer"],
    excludeKeywords: ["cookie", "privacy"],
    note: "Chinese manufacturer page for lightweight product intelligence.",
    source_name: "Reizberg Mobility",
    source_url: "https://www.reizbergmed.com/",
    source_type: "html_article",
    source_class: "manufacturer",
    trust_score: 71,
    crawl_mode: "html_article",
    active: true,
    last_checked_at: nowIso,
  }),
  makeEntry({
    id: "cn-ageally-manufacturer",
    name: "Ageally Mobility Aids",
    type: "html_article",
    url: "https://www.ageally.com/",
    country: "china",
    language: "en",
    region: "local-community",
    categoryHints: ["senior-mobility", "welfare-mobility"],
    tagHints: ["中国", "歩行支援", "メーカー"],
    includeKeywords: ["mobility aids", "rollator", "walking frames", "transfer chairs", "manufacturer"],
    excludeKeywords: ["cookie", "privacy"],
    note: "Chinese manufacturer page; candidate pool if product relevance stays strong.",
    source_name: "Ageally Mobility Aids",
    source_url: "https://www.ageally.com/",
    source_type: "html_article",
    source_class: "manufacturer",
    trust_score: 69,
    crawl_mode: "html_article",
    active: false,
    approval_status: "candidate",
    last_checked_at: null,
  }),
  makeEntry({
    id: "de-bmbfsfj-older-people",
    name: "ドイツ 連邦家庭・高齢者・女性・青少年省",
    type: "html_article",
    url: "https://www.bmbfsfj.bund.de/bmbfsfj/themen/aeltere-menschen",
    country: "germany",
    language: "de",
    region: "local-community",
    categoryHints: ["welfare-mobility", "senior-mobility", "community-transport"],
    tagHints: ["ドイツ", "高齢者", "移動"],
    includeKeywords: ["Mobilität", "mobilität", "Verkehr", "senior", "ältere", "barrierefrei", "Teilhabe", "Fuß", "Rollator", "Mobilitäts"],
    excludeKeywords: ["Pressekontakt", "Impressum", "Cookie", "Datenschutz"],
    note: "Tracks a federal senior-policy page with mobility-related framing.",
    source_name: "ドイツ 連邦家庭・高齢者・女性・青少年省",
    source_url: "https://www.bmbfsfj.bund.de/bmbfsfj/themen/aeltere-menschen",
    source_type: "html_article",
    source_class: "official_public",
    trust_score: 82,
    crawl_mode: "html_article",
    active: true,
    last_checked_at: nowIso,
  }),
  makeEntry({
    id: "de-bmbfsfj-mobility-publication",
    name: "ドイツ 高齢期の移動と参加",
    type: "html_article",
    url: "https://www.bmbfsfj.bund.de/bmbfsfj/service/publikationen/sr-band-230-mobilitaet-und-gesellschaftliche-partizipation-im-alter-96284",
    country: "germany",
    language: "de",
    region: "local-community",
    categoryHints: ["senior-mobility", "welfare-mobility"],
    tagHints: ["ドイツ", "高齢期", "移動"],
    includeKeywords: ["Mobilität", "Partizipation", "Alter", "older", "mobility", "participation"],
    excludeKeywords: ["Cookie", "Datenschutz", "Pressekontakt"],
    note: "A mobility-in-aging publication that keeps the Germany lane grounded.",
    source_name: "ドイツ 高齢期の移動と参加",
    source_url: "https://www.bmbfsfj.bund.de/bmbfsfj/service/publikationen/sr-band-230-mobilitaet-und-gesellschaftliche-partizipation-im-alter-96284",
    source_type: "html_article",
    source_class: "official_public",
    trust_score: 78,
    crawl_mode: "html_article",
    active: true,
    last_checked_at: nowIso,
  }),
  makeEntry({
    id: "us-cdc-mymobility",
    name: "CDC MyMobility Plan",
    type: "html_article",
    url: "https://www.cdc.gov/older-adult-drivers/mymobility/index.html",
    country: "united_states",
    language: "en",
    region: "local-community",
    categoryHints: ["senior-mobility", "welfare-mobility"],
    tagHints: ["CDC", "mobility", "older adults"],
    includeKeywords: ["mobility", "older adult", "older adults", "safe", "independent", "walk", "walkers", "transport", "driving"],
    excludeKeywords: ["cookies", "privacy", "share this page"],
    note: "A current CDC mobility planning page for older adults.",
    source_name: "CDC MyMobility Plan",
    source_url: "https://www.cdc.gov/older-adult-drivers/mymobility/index.html",
    source_type: "html_article",
    source_class: "official_public",
    trust_score: 80,
    crawl_mode: "html_article",
    active: true,
    last_checked_at: nowIso,
  }),
  makeEntry({
    id: "us-cdc-moving-matters",
    name: "CDC Moving Matters for Older Adults",
    type: "html_article",
    url: "https://www.cdc.gov/moving-matters/older-adults/index.html",
    country: "united_states",
    language: "en",
    region: "local-community",
    categoryHints: ["senior-mobility", "welfare-mobility"],
    tagHints: ["CDC", "walking", "older adults"],
    includeKeywords: ["older adults", "physical activity", "mobility", "walking", "independent", "safe"],
    excludeKeywords: ["cookies", "privacy", "share this page"],
    note: "An older-adult movement and mobility page from CDC.",
    source_name: "CDC Moving Matters for Older Adults",
    source_url: "https://www.cdc.gov/moving-matters/older-adults/index.html",
    source_type: "html_article",
    source_class: "official_public",
    trust_score: 79,
    crawl_mode: "html_article",
    active: true,
    last_checked_at: nowIso,
  }),
  makeEntry({
    id: "us-trionic-walker",
    name: "Trionic Walkers & Rollators",
    type: "html_article",
    url: "https://www.trionic.com/",
    country: "united_states",
    language: "en",
    region: "local-community",
    categoryHints: ["senior-mobility", "welfare-mobility"],
    tagHints: ["USA", "歩行器", "メーカー"],
    includeKeywords: ["walker", "rollator", "mobility aids", "outdoor", "walkers", "all-terrain"],
    excludeKeywords: ["cookies", "privacy"],
    note: "High-value specialist product page for outdoor mobility aids.",
    source_name: "Trionic Walkers & Rollators",
    source_url: "https://www.trionic.com/",
    source_type: "html_article",
    source_class: "manufacturer",
    trust_score: 76,
    crawl_mode: "html_article",
    active: true,
    last_checked_at: nowIso,
  }),
  makeEntry({
    id: "us-zler-walker",
    name: "Zler Upright Walker",
    type: "html_article",
    url: "https://thezler.com/",
    country: "united_states",
    language: "en",
    region: "local-community",
    categoryHints: ["senior-mobility", "welfare-mobility"],
    tagHints: ["USA", "歩行器", "メーカー"],
    includeKeywords: ["walker", "upright walker", "mobility aid", "manufacturer", "narrow folding walker"],
    excludeKeywords: ["cookies", "privacy"],
    note: "U.S. manufacturer page for upright and folding walker intelligence.",
    source_name: "Zler Upright Walker",
    source_url: "https://thezler.com/",
    source_type: "html_article",
    source_class: "manufacturer",
    trust_score: 72,
    crawl_mode: "html_article",
    active: true,
    last_checked_at: nowIso,
  }),
  makeEntry({
    id: "us-fhwa-newsrss",
    name: "FHWA News Releases",
    type: "rss",
    url: "https://www.fhwa.dot.gov/publicaffairs/newsrss/",
    country: "united_states",
    language: "en",
    region: "local-community",
    categoryHints: ["local-transport", "community-transport"],
    tagHints: ["FHWA", "交通安全"],
    includeKeywords: ["road", "bridge", "safety", "transportation", "mobility", "transit", "commuter", "travel", "access"],
    excludeKeywords: ["general news", "archive"],
    note: "A live federal highway RSS feed for mobility and safety signals.",
    source_name: "FHWA News Releases",
    source_url: "https://www.fhwa.dot.gov/publicaffairs/newsrss/",
    source_type: "rss",
    source_class: "official_public",
    trust_score: 83,
    crawl_mode: "rss",
    active: true,
    last_checked_at: nowIso,
  }),
  makeEntry({
    id: "tw-aelite-walker",
    name: "Aelite Walker",
    type: "html_article",
    url: "https://www.aelite.com.tw/",
    country: "taiwan",
    language: "en",
    region: "local-community",
    categoryHints: ["senior-mobility", "welfare-mobility"],
    tagHints: ["台湾", "歩行器", "メーカー"],
    includeKeywords: ["walker", "rollator", "assistive", "mobility", "crutches"],
    excludeKeywords: ["cookie", "privacy"],
    note: "Inactive candidate source for future country expansion.",
    source_name: "Aelite Walker",
    source_url: "https://www.aelite.com.tw/",
    source_type: "html_article",
    source_class: "manufacturer",
    trust_score: 67,
    crawl_mode: "html_article",
    active: false,
    approval_status: "candidate",
    last_checked_at: null,
  }),
];

export function toInsightSourceConfig(source: InsightSourceRegistryEntry): InsightSourceConfig {
  return {
    id: source.id,
    name: source.name,
    type: source.type,
    url: source.url,
    country: source.country,
    language: source.language,
    region: source.region,
    categoryHints: source.categoryHints,
    tagHints: source.tagHints,
    includeKeywords: source.includeKeywords,
    excludeKeywords: source.excludeKeywords,
    linkIncludePatterns: source.linkIncludePatterns,
    linkExcludePatterns: source.linkExcludePatterns,
    itemLimit: source.itemLimit,
    note: source.note,
  };
}

export function getInsightSourceById(sourceId: string) {
  return insightSourceRegistry.find((item) => item.id === sourceId) || null;
}

export function evaluateSourceTrust(source: InsightSourceRegistryEntry) {
  return scoreSource(source.source_class, source.country, source.crawl_mode, source.active);
}

export function getApprovedInsightSourceRegistry() {
  return insightSourceRegistry
    .map((source) => ({
      ...source,
      trust_score: evaluateSourceTrust(source),
    }))
    .filter((source) => source.active && source.trust_score >= 60 && source.approval_status === "approved");
}

export function getApprovedInsightSourceConfigs() {
  return getApprovedInsightSourceRegistry().map(toInsightSourceConfig);
}

export function getDiscoverableInsightSourceRegistry() {
  return insightSourceRegistry.map((source) => ({
    ...source,
    trust_score: evaluateSourceTrust(source),
  }));
}

export function getDiscoverableInsightSourceConfigs() {
  return getDiscoverableInsightSourceRegistry().map(toInsightSourceConfig);
}

export function getApprovedInsightSourceRegistryByCountry(country: MobilityKnowledgeCountry) {
  return getApprovedInsightSourceRegistry().filter((source) => source.country === country);
}

export function getDiscoverableInsightSourceRegistryByCountry(country: MobilityKnowledgeCountry) {
  return getDiscoverableInsightSourceRegistry().filter((source) => source.country === country);
}

export function approveInsightSourceCandidate(sourceId: string) {
  const source = insightSourceRegistry.find((item) => item.id === sourceId);
  if (!source) {
    return null;
  }

  source.active = true;
  source.approval_status = "approved";
  source.last_checked_at = new Date().toISOString();
  source.trust_score = evaluateSourceTrust(source);
  return source;
}

export function registerInsightSourceCandidate(
  input: Omit<InsightSourceRegistryEntry, "approval_status" | "trust_score" | "last_checked_at"> & Partial<Pick<InsightSourceRegistryEntry, "approval_status" | "trust_score" | "last_checked_at">>,
) {
  const existing = getInsightSourceById(input.id);
  const trustScore =
    input.trust_score ??
    evaluateSourceTrust({
      ...(input as InsightSourceRegistryEntry),
      trust_score: input.trust_score ?? 0,
      approval_status: input.approval_status ?? "candidate",
      last_checked_at: input.last_checked_at ?? null,
    });
  const next: InsightSourceRegistryEntry = {
    ...input,
    trust_score: trustScore,
    approval_status: input.approval_status || "candidate",
    last_checked_at: input.last_checked_at ?? null,
  } as InsightSourceRegistryEntry;

  if (existing) {
    Object.assign(existing, next);
    return existing;
  }

  insightSourceRegistry.push(next);
  return next;
}
