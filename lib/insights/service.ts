import { buildInsightContent } from "@/lib/insights/analyze";
import { fetchConfiguredSources } from "@/lib/insights/fetchers";
import {
  filterInsights,
  getHomepagePriorityInsights,
  getLatestPublicInsights,
  getLatestPublicNonFeaturedInsights,
  getFeaturedPublicInsights,
  getPublicInsightBySlug,
  getPublicInsights,
} from "@/lib/insights/index";
import { dedupeCandidates, existingDraftKeySet, normalizeFetchedItem } from "@/lib/insights/normalize";
import { readInsightDrafts, recordInsightIngestionRun, upsertInsightDrafts } from "@/lib/insights/storage";
import type { IngestionResult, InsightDraft, InsightEntry, Locale } from "@/lib/insights/types";

export async function fetchNews(locale: Locale): Promise<InsightEntry[]> {
  return getPublicInsights(locale);
}

export async function summarizeNews(entry: InsightEntry): Promise<string> {
  return entry.summary;
}

export async function generateYorisouView(entry: InsightEntry): Promise<string[]> {
  return entry.yorisouView;
}

export async function fetchInsightDetail(slug: string, locale: Locale) {
  return getPublicInsightBySlug(slug, locale);
}

export async function fetchLatestInsights(locale: Locale, limit = 3) {
  return getLatestPublicInsights(locale, limit);
}

export async function fetchFeaturedInsights(locale: Locale, limit = 3) {
  return getFeaturedPublicInsights(locale, limit);
}

export async function fetchLatestNonFeaturedInsights(locale: Locale, limit = 3) {
  return getLatestPublicNonFeaturedInsights(locale, limit);
}

export async function fetchHomepageInsights(locale: Locale, heroLimit = 1, secondaryLimit = 3) {
  return getHomepagePriorityInsights(locale, heroLimit, secondaryLimit);
}

export async function filterPublicInsights(
  locale: Locale,
  filters: {
    category?: string;
    tag?: string;
  }
) {
  const all = await getPublicInsights(locale);
  return filterInsights(all, filters);
}

export async function ingestConfiguredInsightSources(): Promise<IngestionResult> {
  const startedAt = new Date().toISOString();
  const { items: fetchedItems, sourceRuns } = await fetchConfiguredSources();
  const normalized = dedupeCandidates(fetchedItems.map((item) => normalizeFetchedItem(item)).filter((item) => item !== null));
  const existing = await readInsightDrafts();
  const existingKeys = existingDraftKeySet(existing);

  const freshCandidates = normalized.filter((item) => !existingKeys.has(item.sourceUrl));
const drafts: InsightDraft[] = [];

  for (const candidate of freshCandidates) {
    const contentJa = await buildInsightContent(candidate, "ja");
    const contentEn = await buildInsightContent(candidate, "en");

    drafts.push({
      id: `insight_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      slug: candidate.slug,
      sourceName: candidate.sourceName,
      sourceUrl: candidate.sourceUrl,
      publishedAt: candidate.publishedAt,
      fetchedAt: candidate.fetchedAt,
      category: candidate.category,
      region: candidate.region,
      tags: candidate.tags,
      rawTitle: candidate.rawTitle,
      rawExcerpt: candidate.rawExcerpt,
      content: {
        ja: contentJa,
        en: contentEn,
      },
      reviewStatus: "draft",
      approvedForPublic: false,
      createdFrom: candidate.createdFrom,
      ingestionNotes: candidate.ingestionNotes,
      analysisVersion: "v2-ja-editorial",
      featured: false,
      homepageFeatured: false,
    });
  }

  const mergedDrafts = await upsertInsightDrafts(drafts);
  const finishedAt = new Date().toISOString();
  const result: IngestionResult = {
    startedAt,
    finishedAt,
    fetched: fetchedItems.length,
    relevant: normalized.length,
    created: drafts.length,
    skippedDuplicate: normalized.length - freshCandidates.length,
    skippedIrrelevant: fetchedItems.length - normalized.length,
    errors: sourceRuns.filter((run) => Boolean(run.error)).length,
    sourcesChecked: sourceRuns.map((run) => run.sourceName),
    drafts,
  };

  await recordInsightIngestionRun({
    id: `ingestion_${Date.now()}`,
    startedAt,
    finishedAt,
    fetched: result.fetched,
    relevant: result.relevant,
    created: result.created,
    skippedDuplicate: result.skippedDuplicate,
    skippedIrrelevant: result.skippedIrrelevant,
    errors: result.errors,
    draftCountAfterRun: mergedDrafts.length,
    sources: sourceRuns,
  });

  return result;
}
