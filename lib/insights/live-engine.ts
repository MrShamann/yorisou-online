import { fetchConfiguredSources } from "@/lib/insights/fetchers";
import { normalizeFetchedItem, normalizeSourceUrl } from "@/lib/insights/normalize";
import { buildMobilityKnowledgePresentation } from "@/lib/insights/presentation";
import { scoreFreshness, scoreUrgency, inferMobilitySignalType } from "@/lib/insights/freshness";
import { readInsightKnowledgeRecords, upsertInsightKnowledgeRecords } from "@/lib/insights/knowledge-storage";
import { upsertInsightDrafts } from "@/lib/insights/storage";
import type {
  InsightContent,
  InsightDraft,
  MobilityKnowledgeCountry,
  MobilityKnowledgeLanguage,
  MobilityKnowledgeObject,
  MobilityKnowledgeProductCategory,
  MobilityKnowledgeSignalType,
} from "@/lib/insights/types";

export type MobilityKnowledgeRawItem = Awaited<ReturnType<typeof fetchConfiguredSources>>["items"][number];

export type MobilityKnowledgeIngestionResult = {
  startedAt: string;
  finishedAt: string;
  rawCount: number;
  storedCount: number;
  publicCandidateCount: number;
  internalOnlyCount: number;
  discardedCount: number;
  records: InsightDraft[];
};

const countryLabels: Record<MobilityKnowledgeCountry, { ja: string; en: string }> = {
  china: { ja: "中国", en: "China" },
  japan: { ja: "日本", en: "Japan" },
  germany: { ja: "ドイツ", en: "Germany" },
  united_states: { ja: "米国", en: "United States" },
  sweden: { ja: "スウェーデン", en: "Sweden" },
  taiwan: { ja: "台湾", en: "Taiwan" },
  netherlands: { ja: "オランダ", en: "Netherlands" },
  denmark: { ja: "デンマーク", en: "Denmark" },
  south_korea: { ja: "韓国", en: "South Korea" },
  france: { ja: "フランス", en: "France" },
  italy: { ja: "イタリア", en: "Italy" },
  united_kingdom: { ja: "英国", en: "United Kingdom" },
};

const productCategoryLabels: Record<MobilityKnowledgeProductCategory, { ja: string; en: string }> = {
  walking_support: { ja: "歩行支援", en: "Walking support" },
  short_distance_mobility: { ja: "短距離移動", en: "Short-distance mobility" },
  portable_mobility: { ja: "携帯・折りたたみ", en: "Portable mobility" },
  transfer_support: { ja: "移乗・立ち上がり", en: "Transfer support" },
  vehicle_entry_support: { ja: "車への乗り降り", en: "Vehicle-entry support" },
  mobility_service: { ja: "移動サービス", en: "Mobility service" },
  mobility_policy: { ja: "制度・方針", en: "Mobility policy" },
  mobility_infrastructure: { ja: "交通インフラ", en: "Mobility infrastructure" },
};

function nowIso() {
  return new Date().toISOString();
}

function normalizeText(value: string | null | undefined) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function compactText(value: string | null | undefined, limit = 180) {
  const normalized = normalizeText(value);
  return normalized.length > limit ? `${normalized.slice(0, limit - 3)}...` : normalized;
}

function normalizeOptionalUrl(value: string | null | undefined, baseUrl?: string) {
  const trimmed = normalizeText(value);
  if (!trimmed) {
    return null;
  }

  if (!baseUrl) {
    return trimmed;
  }

  try {
    return new URL(trimmed, baseUrl).toString();
  } catch {
    return trimmed;
  }
}

function slugify(value: string) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function countryFitsJapanUseCase(country: MobilityKnowledgeCountry, productCategory: MobilityKnowledgeProductCategory, fitScene: string[]) {
  let score = 0;
  if (country === "japan") score += 24;
  if (productCategory === "walking_support" || productCategory === "short_distance_mobility" || productCategory === "portable_mobility") {
    score += 24;
  }
  if (productCategory === "transfer_support" || productCategory === "vehicle_entry_support") {
    score += 16;
  }
  if (productCategory === "mobility_service") {
    score += 12;
  }
  if (fitScene.some((scene) => /supermarket|nearby|errand|short trip|short distance|近所|買い物|通院|elevator|apartment|walking/i.test(scene))) {
    score += 20;
  }
  if (fitScene.some((scene) => /family|caregiver|家族/i.test(scene))) {
    score += 8;
  }
  return Math.max(0, Math.min(100, score));
}

function detectProductCategory(text: string): MobilityKnowledgeProductCategory {
  if (/(walker|rollator|walking aid|歩行器|歩行支援|歩行)/i.test(text)) {
    return "walking_support";
  }
  if (/(short trip|short distance|nearby errands|supermarket|近所|買い物|通院|近距離|community transport)/i.test(text)) {
    return "short_distance_mobility";
  }
  if (/(foldable|portable|lightweight|compact|折りたたみ|軽量|収納)/i.test(text)) {
    return "portable_mobility";
  }
  if (/(transfer|getting up|stand up|bed|chair|立ち上がり|移乗)/i.test(text)) {
    return "transfer_support";
  }
  if (/(vehicle|car|taxi|boarding|乗り降り|車載|乗車)/i.test(text)) {
    return "vehicle_entry_support";
  }
  if (/(trial|demo|consultation|explanation|service|pilot|導入|相談|試乗|説明|plan|program)/i.test(text)) {
    return "mobility_service";
  }
  if (/(policy|guideline|subsidy|plan|project|program|strategy|方針|計画|補助|プロジェクト|regulation)/i.test(text)) {
    return "mobility_policy";
  }
  return "mobility_infrastructure";
}

function detectFitPeople(category: MobilityKnowledgeProductCategory, text: string) {
  const people = new Set<string>();
  if (/(older adult|elderly|高齢|シニア|senior)/i.test(text) || category === "walking_support" || category === "short_distance_mobility") {
    people.add("older adults");
  }
  if (/(family|家族|caregiver|付き添い)/i.test(text) || category === "portable_mobility" || category === "mobility_service") {
    people.add("family caregivers");
  }
  if (/(operator|事業者|local government|自治体|policy|project|service)/i.test(text) || category === "mobility_policy") {
    people.add("operators and partners");
  }
  if (!people.size) {
    people.add("mobility stakeholders");
  }
  return [...people];
}

function detectFitScene(category: MobilityKnowledgeProductCategory, text: string) {
  const scenes = new Set<string>();
  if (/(supermarket|買い物|shopping|errand)/i.test(text)) scenes.add("nearby errands");
  if (/(clinic|hospital|通院)/i.test(text)) scenes.add("clinic visits");
  if (/(elevator|apartment|集合住宅|マンション)/i.test(text)) scenes.add("elevator apartment");
  if (/(foldable|compact|portable|折りたたみ|収納)/i.test(text)) scenes.add("storage-constrained home");
  if (/(vehicle|car|taxi|乗り降り|boarding)/i.test(text)) scenes.add("vehicle entry and exit");
  if (/(policy|project|program|pilot|trial)/i.test(text) || category === "mobility_policy" || category === "mobility_service") scenes.add("pilot and rollout planning");
  if (!scenes.size) scenes.add("mobility planning");
  return [...scenes];
}

function detectKeySpecs(category: MobilityKnowledgeProductCategory, text: string) {
  const specs = new Set<string>();
  if (/(lightweight|軽量)/i.test(text)) specs.add("lightweight");
  if (/(foldable|折りたたみ)/i.test(text)) specs.add("foldable");
  if (/(compact|コンパクト)/i.test(text)) specs.add("compact");
  if (/(smart|smart-green|DX|デジタル|mobility update portal)/i.test(text)) specs.add("operational / platform support");
  if (/(trial|demo|pilot|実証|試乗)/i.test(text)) specs.add("trial-ready");
  if (category === "walking_support") specs.add("walking aid support");
  if (category === "vehicle_entry_support") specs.add("vehicle entry support");
  if (!specs.size) specs.add("no detailed specs provided");
  return [...specs];
}

function detectPriceBand(text: string) {
  if (/(free|無料|0円)/i.test(text)) return "free";
  if (/(premium|高額|expensive|高価格|low-cost|budget|低価格)/i.test(text)) return "unknown";
  return "unknown";
}

function detectRiskFlags(category: MobilityKnowledgeProductCategory, text: string, country: MobilityKnowledgeCountry) {
  const flags = new Set<string>();
  if (country !== "japan") {
    flags.add("non_japan_market_intel");
  }
  if (category === "mobility_policy") {
    flags.add("policy_heavy");
  }
  if (/(aviation|airline|airport|航空)/i.test(text)) {
    flags.add("off_scope");
  }
  if (/(freight|shipping|logistics|物流)/i.test(text) && !/(mobility|移動|交通|short trip|walker|elder|高齢)/i.test(text)) {
    flags.add("broad_transport_only");
  }
  if (!/(walker|rollator|walking aid|short trip|short distance|nearby|foldable|portable|lightweight|elevator|supermarket|買い物|通院|移動支援|mobility|transport)/i.test(text)) {
    flags.add("low_public_clarity");
  }
  return [...flags];
}

function summarizeInternalUse(input: {
  sourceTitle: string;
  category: MobilityKnowledgeProductCategory;
  fitPeople: string[];
  fitScene: string[];
  keySpecs: string[];
  decisionReason: string;
  freshnessScore: number;
  urgencyScore: number;
  signalType: MobilityKnowledgeSignalType;
}) {
  return [
    input.sourceTitle,
    `Category: ${productCategoryLabels[input.category].ja}`,
    `Signal: ${input.signalType}`,
    `Freshness: ${input.freshnessScore}`,
    `Urgency: ${input.urgencyScore}`,
    `People: ${input.fitPeople.join(", ")}`,
    `Scene: ${input.fitScene.join(", ")}`,
    `Specs: ${input.keySpecs.join(", ")}`,
    input.decisionReason,
  ].join(" / ");
}

function summarizePublicUse(input: {
  sourceTitle: string;
  category: MobilityKnowledgeProductCategory;
  fitScene: string[];
  keySpecs: string[];
}) {
  return `${input.sourceTitle}は、${productCategoryLabels[input.category].ja}に関する実用的な示唆を含む項目です。${input.fitScene[0] || "日常の移動場面"}と${input.keySpecs[0] || "基本仕様"}を短く確認するのが良さそうです。`;
}

function summarizePublicUseEn(input: {
  sourceTitle: string;
  category: MobilityKnowledgeProductCategory;
  fitScene: string[];
  keySpecs: string[];
}) {
  return `${input.sourceTitle} is a practical item for ${productCategoryLabels[input.category].en.toLowerCase()}. Check ${input.fitScene[0] || "the daily use scene"} and ${input.keySpecs[0] || "the main spec"} first.`;
}

function buildContent(record: MobilityKnowledgeObject): Record<"ja" | "en", InsightContent> {
  const categoryLabelJa = productCategoryLabels[record.product_category].ja;
  const categoryLabelEn = productCategoryLabels[record.product_category].en;
  const publicSummaryJa = record.translated_summary_ja || record.summary_for_public_use || record.summary_for_internal_use;
  const publicSummaryEn = record.translated_summary_en || summarizePublicUseEn({
    sourceTitle: record.source_title,
    category: record.product_category,
    fitScene: record.fit_scene,
    keySpecs: record.key_specs,
  });

  return {
    ja: {
      title: record.source_title,
      summary: publicSummaryJa,
      whyItMatters: `${countryLabels[record.country].ja}の${categoryLabelJa}に関する動きとして、${record.decision_reason}`,
      yorisouView: [
        `ひなたでは、この項目を${categoryLabelJa}の実務情報として見ます。`,
        `ご本人やご家族が見るときは、${record.fit_scene.join(" / ")}のどこで効くかを先に確認します。`,
        `必要なら、あとで相談につながる内部メモとして残せます。`,
      ],
      practicalTakeaways: [
        `使う場面を ${record.fit_scene.join(" / ")} に絞る。`,
        `本当に必要な条件を ${record.key_specs.join(" / ")} から確認する。`,
        `公開前なら内部メモとして扱い、公開候補ならレビューに回す。`,
      ],
      whatThisMeans: {
        seniors: `ご本人にとっては、${record.fit_scene[0] || "日常の移動場面"}での負担がどう下がるかが判断軸になります。`,
        families: `ご家族にとっては、持ち運びや説明のしやすさを同時に見ておくと選びやすくなります。`,
        localCommunities: `地域側では、実用場面と説明のしやすさを分けて整理すると導入判断に使えます。`,
        operators: `運営者は、場面適合と継続運用の両方を確認してから次の段階に進めるのが安全です。`,
      },
    },
    en: {
      title: record.source_title,
      summary: publicSummaryEn,
      whyItMatters: `This item matters for ${categoryLabelEn.toLowerCase()} in ${countryLabels[record.country].en}. ${record.decision_reason}`,
      yorisouView: [
        `Hinata treats this as practical ${categoryLabelEn.toLowerCase()} intelligence.`,
        `Check where it helps first: ${record.fit_scene.join(" / ")}.`,
        `Keep it as internal memory unless it is clearly public-ready.`,
      ],
      practicalTakeaways: [
        `Anchor the item to ${record.fit_scene.join(" / ")}.`,
        `Confirm the key specs: ${record.key_specs.join(" / ")}.`,
        `Promote only public-ready items after review.`,
      ],
      whatThisMeans: {
        seniors: `For seniors, the question is whether it reduces burden in ${record.fit_scene[0] || "daily mobility"}.`,
        families: "Families should also look at handling, storage, and explanation burden.",
        localCommunities: "Local stakeholders can use it as a lightweight market signal.",
        operators: "Operators should read it through fit, support, and rollout practicality.",
      },
    },
  };
}

function mapCategoryToInsightCategory(category: MobilityKnowledgeProductCategory) {
  switch (category) {
    case "walking_support":
    case "short_distance_mobility":
    case "portable_mobility":
      return "senior-mobility" as const;
    case "transfer_support":
    case "vehicle_entry_support":
      return "welfare-mobility" as const;
    case "mobility_service":
      return "community-transport" as const;
    case "mobility_policy":
    case "mobility_infrastructure":
    default:
      return "local-transport" as const;
  }
}

function mapCountryToRegion(country: MobilityKnowledgeCountry) {
  return country === "japan" ? ("japan" as const) : ("local-community" as const);
}

function normalizeLanguageAvailable(language: MobilityKnowledgeLanguage) {
  return Array.from(new Set([language, "ja", "en"])) as MobilityKnowledgeLanguage[];
}

function deriveDecision(input: {
  category: MobilityKnowledgeProductCategory;
  fitPeople: string[];
  fitScene: string[];
  keySpecs: string[];
  riskFlags: string[];
  japanFitScore: number;
  freshnessScore: number;
  urgencyScore: number;
  signalType: MobilityKnowledgeSignalType;
}) {
  const clarityScore = Math.min(100, (input.keySpecs.length * 16) + (input.fitPeople.length * 10) + (input.fitScene.length * 12));
  const publicEligibleSignal =
    input.signalType === "product_intelligence" ||
    input.signalType === "service_signal" ||
    input.signalType === "innovation_signal" ||
    input.signalType === "social_signal" ||
    input.signalType === "market_signal";
  const publicFriendly =
    input.japanFitScore >= 24 &&
    clarityScore >= 24 &&
    input.freshnessScore >= 18 &&
    !input.riskFlags.includes("off_scope");
  const clearlyRelevant =
    input.japanFitScore >= 35 ||
    input.urgencyScore >= 55 ||
    input.signalType === "policy_signal" ||
    input.signalType === "incident_signal" ||
    input.signalType === "market_signal";

  if (input.riskFlags.includes("off_scope") || (!clearlyRelevant && input.freshnessScore < 25)) {
    return {
      visibilityDecision: "discard" as const,
      decisionReason: "Off-scope or too low-signal for either public reading or internal market intelligence.",
      confidenceLevel: "medium" as const,
    };
  }

  if (
    publicFriendly &&
    (
      publicEligibleSignal ||
      (input.signalType === "market_signal" && input.japanFitScore >= 20 && clarityScore >= 20 && input.freshnessScore >= 18) ||
      (input.signalType === "policy_signal" && input.freshnessScore >= 50 && input.urgencyScore >= 45) ||
      (input.signalType === "incident_signal" && input.freshnessScore >= 60 && input.urgencyScore >= 55)
    )
  ) {
    return {
      visibilityDecision: "public_candidate" as const,
      decisionReason:
        input.signalType === "policy_signal"
          ? "Timely mobility policy signal with a usable Japan fit for a public draft."
          : input.signalType === "incident_signal"
            ? "Fresh safety-related mobility signal suitable for a cautious public draft."
            : "Clear, mobility-first item with a practical Japanese fit and enough detail for a draft public reading.",
      confidenceLevel: clarityScore >= 60 ? ("high" as const) : ("medium" as const),
    };
  }

  if (publicFriendly && input.signalType === "policy_signal" && input.freshnessScore >= 35) {
    return {
      visibilityDecision: "public_candidate" as const,
      decisionReason: "Policy signal is practical enough for a public draft, but still deserves a cautious read.",
      confidenceLevel: "medium" as const,
    };
  }

  return {
    visibilityDecision: "internal_only" as const,
    decisionReason: input.riskFlags.includes("policy_heavy")
      ? "Useful as mobility market intelligence, but too policy-heavy for public-facing reading."
      : "Relevant mobility signal for Hinata/internal review, but not yet strong or clear enough for public publication.",
    confidenceLevel: clarityScore >= 70 ? ("high" as const) : ("medium" as const),
  };
}

async function buildKnowledgeObject(input: {
  raw: MobilityKnowledgeRawItem;
  presentation: Awaited<ReturnType<typeof buildMobilityKnowledgePresentation>>;
}): Promise<MobilityKnowledgeObject> {
  const normalizedText = normalizeText([input.raw.title, input.raw.excerpt].join(" "));
  const productCategory = detectProductCategory(normalizedText);
  const fitPeople = detectFitPeople(productCategory, normalizedText);
  const fitScene = detectFitScene(productCategory, normalizedText);
  const keySpecs = detectKeySpecs(productCategory, normalizedText);
  const priceBand = detectPriceBand(normalizedText);
  const riskFlags = detectRiskFlags(productCategory, normalizedText, input.raw.country);
  const japanFitScore = countryFitsJapanUseCase(input.raw.country, productCategory, fitScene);
  const freshnessScore = scoreFreshness({
    publishedAt: input.raw.publishedAt,
    updatedAt: input.raw.publishedAt,
  });
  const signalType = inferMobilitySignalType({
    text: normalizedText,
    productCategory,
  });
  const urgencyScore = scoreUrgency({
    signalType,
    text: normalizedText,
    freshnessScore,
  });
  const decision = deriveDecision({
    category: productCategory,
    fitPeople,
    fitScene,
    keySpecs,
    riskFlags,
    japanFitScore,
    freshnessScore,
    urgencyScore,
    signalType,
  });
  const sourceUrl = normalizeSourceUrl(input.raw.sourceUrl);
  const imageUrl = normalizeOptionalUrl(input.raw.imageUrl, sourceUrl);
  const specSummary = keySpecs.length > 0 ? keySpecs.slice(0, 3).join(" / ") : compactText(input.raw.title, 120);
  const japanFitNote = compactText(
    [
      `Japan-fit ${japanFitScore}/100`,
      fitPeople[0] || "",
      fitScene[0] || "",
      priceBand || "",
      riskFlags[0] || "",
    ]
      .filter(Boolean)
      .join(" · "),
    220,
  );
  const internalSummary = summarizeInternalUse({
    sourceTitle: input.raw.title,
    category: productCategory,
    fitPeople,
    fitScene,
    keySpecs,
    decisionReason: decision.decisionReason,
    freshnessScore,
    urgencyScore,
    signalType,
  });
  const publicSummary = summarizePublicUse({
    sourceTitle: input.raw.title,
    category: productCategory,
    fitScene,
    keySpecs,
  });
  const publicStage =
    decision.visibilityDecision === "public_candidate"
      ? freshnessScore >= 85 || urgencyScore >= 70
        ? "public_featured"
        : freshnessScore >= 55 || urgencyScore >= 50
          ? "public_fresh"
          : "public_background"
      : undefined;
  const now = nowIso();

  return {
    source_id: input.raw.sourceId,
    source_url: sourceUrl,
    source_title: normalizeText(input.raw.title),
    source_type: input.raw.sourceType,
    image_url: imageUrl,
    spec_summary: specSummary,
    japan_fit_note: japanFitNote,
    reference_doc_url: sourceUrl,
    source_link: sourceUrl,
    country: input.raw.country,
    language: input.raw.language,
    language_original: input.raw.language,
    language_available: normalizeLanguageAvailable(input.raw.language),
    problem_slug: slugify(`${input.raw.country}-${input.raw.title}-${productCategory}`),
    product_category: productCategory,
    fit_people: fitPeople,
    fit_scene: fitScene,
    key_specs: keySpecs,
    price_band: priceBand,
    risk_flags: riskFlags,
    japan_fit_score: japanFitScore,
    freshness_score: freshnessScore,
    urgency_score: urgencyScore,
    signal_type: signalType,
    reference_links: [sourceUrl],
    summary_for_internal_use: internalSummary,
    summary_for_public_use: decision.visibilityDecision === "public_candidate" ? publicSummary : null,
    translated_summary_ja: input.presentation.ja.summary,
    translated_summary_en: input.presentation.en.summary,
    visibility_decision: decision.visibilityDecision,
    decision_reason: `${decision.decisionReason} Freshness ${freshnessScore}/100, urgency ${urgencyScore}/100.`,
    confidence_level: decision.confidenceLevel,
    created_at: now,
    updated_at: now,
    last_checked_at: now,
    publicStage,
  };
}

function buildDraftFromKnowledge(raw: MobilityKnowledgeRawItem, knowledge: MobilityKnowledgeObject): InsightDraft {
  const content = buildContent(knowledge);
  const now = knowledge.created_at;
  return {
    id: `insight_${now.replace(/[-:TZ.]/g, "")}_${knowledge.problem_slug.slice(0, 12)}`,
    slug: knowledge.problem_slug,
    sourceName: raw.sourceName,
    sourceUrl: knowledge.source_url,
    publishedAt: raw.publishedAt || now,
    fetchedAt: now,
    category: mapCategoryToInsightCategory(knowledge.product_category),
    region: mapCountryToRegion(raw.country),
    tags: [
      knowledge.product_category,
      knowledge.country,
      knowledge.signal_type,
      ...(knowledge.fit_scene.slice(0, 2) || []),
      ...(knowledge.fit_people.slice(0, 2) || []),
    ],
    rawTitle: raw.title,
    rawExcerpt: normalizeText(raw.excerpt),
    content,
    reviewStatus: knowledge.visibility_decision === "discard" ? "rejected" : "draft",
    approvedForPublic: false,
    createdFrom: raw.sourceType === "rss" || raw.sourceType === "atom" ? "rss" : "fetch",
    ingestionNotes: `${countryLabels[raw.country][raw.language === "en" ? "en" : "ja"]} mobility intake / ${knowledge.visibility_decision}`,
    analysisVersion: "live-dual-lane-v2",
    featured: knowledge.visibility_decision === "public_candidate" && knowledge.freshness_score >= 70,
    featuredRank: knowledge.urgency_score >= 60 ? 1 : undefined,
    homepageFeatured: knowledge.visibility_decision === "public_candidate" && knowledge.freshness_score >= 85,
    publicStage: knowledge.publicStage,
    freshnessScore: knowledge.freshness_score,
    urgencyScore: knowledge.urgency_score,
    signalType: knowledge.signal_type,
    mobilityKnowledge: knowledge,
  };
}

function pairKey(raw: MobilityKnowledgeRawItem, slug: string) {
  return `${normalizeSourceUrl(raw.sourceUrl)}::${slug}`;
}

export async function loadMobilityKnowledgeRawItems() {
  const { items: fetchedItems } = await fetchConfiguredSources();
  const normalized = fetchedItems.map((item) => ({ raw: item, candidate: normalizeFetchedItem(item) })).filter((entry) => Boolean(entry.candidate));
  const seen = new Set<string>();
  const deduped: Array<{ raw: MobilityKnowledgeRawItem; candidate: NonNullable<ReturnType<typeof normalizeFetchedItem>> }> = [];

  for (const entry of normalized) {
    const candidate = entry.candidate as NonNullable<ReturnType<typeof normalizeFetchedItem>>;
    const key = pairKey(entry.raw, candidate.slug);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push({ raw: entry.raw, candidate });
  }

  return deduped;
}

export async function ingestMobilityKnowledgeDualLane() {
  const startedAt = nowIso();
  const liveItems = await loadMobilityKnowledgeRawItems();
  const built: InsightDraft[] = [];

  for (const item of liveItems) {
    const presentation = await buildMobilityKnowledgePresentation(item.candidate);
    const knowledge = await buildKnowledgeObject({
      raw: item.raw,
      presentation,
    });
    built.push(buildDraftFromKnowledge(item.raw, knowledge));
  }

  const storedKnowledgeRecords = await upsertInsightKnowledgeRecords(built);
  const publicDraftsToMirror = storedKnowledgeRecords.filter((record) => record.mobilityKnowledge?.visibility_decision === "public_candidate");

  if (publicDraftsToMirror.length > 0) {
    await upsertInsightDrafts(publicDraftsToMirror.map((record) => ({ ...record, approvedForPublic: false })));
  }

  const finishedAt = nowIso();
  const publicCandidateCount = storedKnowledgeRecords.filter((record) => record.mobilityKnowledge?.visibility_decision === "public_candidate").length;
  const internalOnlyCount = storedKnowledgeRecords.filter((record) => record.mobilityKnowledge?.visibility_decision === "internal_only").length;
  const discardedCount = storedKnowledgeRecords.filter((record) => record.mobilityKnowledge?.visibility_decision === "discard").length;

  return {
    startedAt,
    finishedAt,
    rawCount: liveItems.length,
    storedCount: storedKnowledgeRecords.length,
    publicCandidateCount,
    internalOnlyCount,
    discardedCount,
    records: storedKnowledgeRecords.filter((record) => Boolean(record.mobilityKnowledge)),
  } satisfies MobilityKnowledgeIngestionResult;
}

export async function readHinataVisibleMobilityKnowledgeRecords() {
  const records = await readInsightKnowledgeRecords();
  return records.filter((record) => {
    const decision = record.mobilityKnowledge?.visibility_decision;
    if (!decision) {
      return false;
    }
    if (decision === "discard") {
      return false;
    }
    if (decision === "internal_only") {
      return true;
    }
    return record.approvedForPublic === true;
  });
}
