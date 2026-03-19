import { buildInsightContent } from "@/lib/insights/analyze";
import { fetchConfiguredSources } from "@/lib/insights/fetchers";
import {
  filterInsights,
  getLatestPublicInsights,
  getPublicInsightBySlug,
  getPublicInsights,
} from "@/lib/insights/index";
import { dedupeCandidates, existingDraftKeySet, normalizeFetchedItem } from "@/lib/insights/normalize";
import { readInsightDrafts, upsertInsightDrafts } from "@/lib/insights/storage";
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
  const fetchedItems = await fetchConfiguredSources();
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
    });
  }

  await upsertInsightDrafts(drafts);

  return {
    fetched: fetchedItems.length,
    relevant: normalized.length,
    created: drafts.length,
    skippedDuplicate: normalized.length - freshCandidates.length,
    skippedIrrelevant: fetchedItems.length - normalized.length,
    drafts,
  };
}
