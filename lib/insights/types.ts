export type Locale = "ja" | "en";

export type InsightCategory =
  | "aging-society"
  | "community-transport"
  | "senior-mobility"
  | "welfare-mobility"
  | "local-transport"
  | "micro-mobility";

export type InsightRegion = "japan" | "kyushu" | "local-community";

export type InsightAudienceBlock = {
  seniors: string;
  families: string;
  localCommunities: string;
  operators: string;
};

export type InsightContent = {
  title: string;
  summary: string;
  whyItMatters: string;
  yorisouView: string[];
  practicalTakeaways: string[];
  whatThisMeans: InsightAudienceBlock;
};

export type InsightSeed = {
  slug: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  category: InsightCategory;
  region: InsightRegion;
  tags: string[];
  featured?: boolean;
  featuredRank?: number;
  homepageFeatured?: boolean;
  content: Record<Locale, InsightContent>;
};

export type InsightOrigin = "seed" | "rss" | "fetch" | "manual";

export type ReviewStatus = "draft" | "approved" | "rejected";

export type InsightDraft = {
  id: string;
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
  content: Record<Locale, InsightContent>;
  reviewStatus: ReviewStatus;
  approvedForPublic: boolean;
  createdFrom: InsightOrigin;
  ingestionNotes?: string;
  reviewedAt?: string;
  publicAt?: string;
  reviewedBy?: string;
  analysisVersion: string;
  featured?: boolean;
  featuredRank?: number;
  homepageFeatured?: boolean;
};

export type InsightEntry = {
  slug: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  category: InsightCategory;
  categoryLabel: string;
  region: InsightRegion;
  regionLabel: string;
  tags: string[];
  title: string;
  summary: string;
  whyItMatters: string;
  yorisouView: string[];
  practicalTakeaways: string[];
  whatThisMeans: InsightAudienceBlock;
  sourceType: InsightOrigin;
  reviewStatus: "approved";
  featured: boolean;
  featuredRank?: number;
  homepageFeatured: boolean;
};

export type InsightSourceConfig = {
  id: string;
  name: string;
  type: "rss" | "atom";
  url: string;
  region: InsightRegion;
  categoryHints: InsightCategory[];
  tagHints: string[];
  includeKeywords: string[];
  excludeKeywords?: string[];
  note?: string;
};

export type FetchedInsightItem = {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  excerpt: string;
  publishedAt: string;
};

export type IngestionResult = {
  startedAt: string;
  finishedAt: string;
  fetched: number;
  relevant: number;
  created: number;
  skippedDuplicate: number;
  skippedIrrelevant: number;
  errors: number;
  sourcesChecked: string[];
  drafts: InsightDraft[];
};

export type InsightSourceRun = {
  sourceId: string;
  sourceName: string;
  fetched: number;
  error?: string;
};

export type InsightIngestionRun = {
  id: string;
  startedAt: string;
  finishedAt: string;
  fetched: number;
  relevant: number;
  created: number;
  skippedDuplicate: number;
  skippedIrrelevant: number;
  errors: number;
  draftCountAfterRun: number;
  sources: InsightSourceRun[];
};
