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

export type MobilityKnowledgeCountry =
  | "china"
  | "japan"
  | "germany"
  | "united_states"
  | "sweden"
  | "taiwan"
  | "netherlands"
  | "denmark"
  | "south_korea"
  | "france"
  | "italy"
  | "united_kingdom";
export type MobilityKnowledgeLanguage = "zh" | "ja" | "de" | "en";
export type MobilityKnowledgeSignalType =
  | "product_intelligence"
  | "service_signal"
  | "policy_signal"
  | "incident_signal"
  | "innovation_signal"
  | "social_signal"
  | "market_signal";
export type MobilityKnowledgeProductCategory =
  | "walking_support"
  | "short_distance_mobility"
  | "portable_mobility"
  | "transfer_support"
  | "vehicle_entry_support"
  | "mobility_service"
  | "mobility_policy"
  | "mobility_infrastructure";
export type MobilityKnowledgeVisibilityDecision = "public_candidate" | "internal_only" | "discard";
export type MobilityKnowledgeConfidenceLevel = "low" | "medium" | "high";
export type MobilityKnowledgeObject = {
  source_id: string;
  source_url: string;
  source_title: string;
  source_type: "rss" | "atom" | "html_index" | "html_article" | "manual";
  image_url?: string | null;
  spec_summary?: string | null;
  japan_fit_note?: string | null;
  reference_doc_url?: string | null;
  source_link?: string | null;
  country: MobilityKnowledgeCountry;
  language: MobilityKnowledgeLanguage;
  language_original: MobilityKnowledgeLanguage;
  language_available: MobilityKnowledgeLanguage[];
  problem_slug: string;
  product_category: MobilityKnowledgeProductCategory;
  fit_people: string[];
  fit_scene: string[];
  key_specs: string[];
  price_band: string;
  risk_flags: string[];
  japan_fit_score: number;
  freshness_score: number;
  urgency_score: number;
  signal_type: MobilityKnowledgeSignalType;
  reference_links: string[];
  summary_for_internal_use: string;
  summary_for_public_use?: string | null;
  translated_summary_ja: string;
  translated_summary_en: string;
  visibility_decision: MobilityKnowledgeVisibilityDecision;
  decision_reason: string;
  confidence_level: MobilityKnowledgeConfidenceLevel;
  publicStage?: InsightPublicStage;
  created_at: string;
  updated_at: string;
  last_checked_at: string;
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
export type InsightPublicStage = "public_fresh" | "public_featured" | "public_background";

export type PublicValidationUserType = "elderly_user" | "family" | "partner" | "unknown";
export type PublicValidationContactIntent = "information" | "follow_up" | "trial_validation" | "hinata_guidance_first";
export type PublicValidationEventType =
  | "product_card_click"
  | "request_info_click"
  | "validation_entry_click"
  | "hinata_handoff_click"
  | "follow_up_request"
  | "problem_category_declaration"
  | "candidate_product_interest"
  | "form_submit";

export type PublicValidationRecord = {
  validation_id: string;
  locale: Locale;
  event_type: PublicValidationEventType;
  user_type: PublicValidationUserType;
  problem_slug: string | null;
  problem_category: string | null;
  product_category: string | null;
  contact_intent: PublicValidationContactIntent | null;
  wants_hinata_first: boolean;
  wants_follow_up: boolean;
  source_name: string | null;
  source_url: string | null;
  card_id: string | null;
  card_title: string | null;
  page_path: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
};

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
  reviewNote?: string;
  analysisVersion: string;
  featured?: boolean;
  featuredRank?: number;
  homepageFeatured?: boolean;
  publicStage?: InsightPublicStage;
  freshnessScore?: number;
  urgencyScore?: number;
  signalType?: MobilityKnowledgeSignalType;
  mobilityKnowledge?: MobilityKnowledgeObject;
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
  publicStage?: InsightPublicStage;
  freshnessScore?: number;
  urgencyScore?: number;
  signalType?: MobilityKnowledgeSignalType;
};

export type InsightSourceConfig = {
  id: string;
  name: string;
  type: "rss" | "atom" | "html_index" | "html_article";
  url: string;
  country: MobilityKnowledgeCountry;
  language: MobilityKnowledgeLanguage;
  region: InsightRegion;
  categoryHints: InsightCategory[];
  tagHints: string[];
  includeKeywords: string[];
  excludeKeywords?: string[];
  linkIncludePatterns?: string[];
  linkExcludePatterns?: string[];
  itemLimit?: number;
  note?: string;
};

export type InsightSourceClass =
  | "official_public"
  | "association"
  | "manufacturer"
  | "product_page"
  | "specialist_media"
  | "regional"
  | "innovation_expo";

export type InsightCrawlMode = "rss" | "atom" | "html_index" | "html_article";

export type InsightSourceRegistryEntry = InsightSourceConfig & {
  source_name: string;
  source_url: string;
  source_type: InsightCrawlMode;
  source_class: InsightSourceClass;
  trust_score: number;
  crawl_mode: InsightCrawlMode;
  active: boolean;
  approval_status: "approved" | "candidate" | "inactive";
  last_checked_at: string | null;
  country: MobilityKnowledgeCountry;
};

export type FetchedInsightItem = {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  sourceType: "rss" | "atom" | "html_index" | "html_article";
  country: MobilityKnowledgeCountry;
  language: MobilityKnowledgeLanguage;
  imageUrl?: string | null;
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
  sourceType: "rss" | "atom" | "html_index" | "html_article";
  country?: MobilityKnowledgeCountry;
  trustScore?: number;
  approvalStatus?: "approved" | "candidate" | "inactive";
  crawlMode?: InsightCrawlMode;
  sourceClass?: InsightSourceClass;
  error?: string;
};

export type InsightSignalBreakdown = Record<MobilityKnowledgeSignalType, number>;

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
