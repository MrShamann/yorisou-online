import { promises as fs } from "fs";
import path from "path";

import { normalizeSourceUrl } from "@/lib/insights/normalize";
import type { InsightDraft, InsightIngestionRun, ReviewStatus } from "@/lib/insights/types";

const dataDir = path.join(process.cwd(), "data");
const draftsPath = path.join(dataDir, "insight-drafts.json");
const runStatusPath = path.join(dataDir, "insight-ingestion-status.json");
const runHistoryPath = path.join(dataDir, "insight-ingestion-runs.json");

function deriveDraftSlug(item: InsightDraft) {
  const fromTitle = `${item.sourceName}-${item.rawTitle}`
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

  if (fromTitle) {
    return fromTitle;
  }

  const fromUrl = item.sourceUrl
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-48);

  return `insight-${fromUrl || item.id}`;
}

async function ensureDraftStorage() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(draftsPath);
  } catch {
    await fs.writeFile(draftsPath, "[]\n", "utf8");
  }

  try {
    await fs.access(runStatusPath);
  } catch {
    await fs.writeFile(runStatusPath, "{}\n", "utf8");
  }

  try {
    await fs.access(runHistoryPath);
  } catch {
    await fs.writeFile(runHistoryPath, "[]\n", "utf8");
  }
}

export async function readInsightDrafts() {
  await ensureDraftStorage();
  const content = await fs.readFile(draftsPath, "utf8");

  try {
    const parsed = JSON.parse(content) as InsightDraft[];
    return Array.isArray(parsed)
      ? parsed.map((item) => ({
          ...item,
          slug: item.slug || deriveDraftSlug(item),
          analysisVersion: item.analysisVersion || "v1",
          featured: item.featured || false,
          homepageFeatured: item.homepageFeatured || false,
        }))
      : [];
  } catch {
    return [];
  }
}

export async function writeInsightDrafts(drafts: InsightDraft[]) {
  await ensureDraftStorage();
  await fs.writeFile(draftsPath, JSON.stringify(drafts, null, 2) + "\n", "utf8");
}

export async function upsertInsightDrafts(incoming: InsightDraft[]) {
  const existing = await readInsightDrafts();
  const map = new Map<string, InsightDraft>(existing.map((item) => [`${normalizeSourceUrl(item.sourceUrl)}::${item.slug}`, item]));

  incoming.forEach((item) => {
    const key = `${normalizeSourceUrl(item.sourceUrl)}::${item.slug}`;
    if (!map.has(key)) {
      map.set(key, {
        ...item,
        sourceUrl: normalizeSourceUrl(item.sourceUrl),
      });
    }
  });

  const merged = [...map.values()].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  await writeInsightDrafts(merged);
  return merged;
}

export async function updateInsightDraftReviewState(
  id: string,
  update: {
    reviewStatus?: ReviewStatus;
    approvedForPublic?: boolean;
    reviewedBy?: string;
    featured?: boolean;
    featuredRank?: number;
    homepageFeatured?: boolean;
  }
) {
  const drafts = await readInsightDrafts();
  const now = new Date().toISOString();
  const nextFeaturedRank =
    Math.max(
      0,
      ...drafts
        .map((item) => item.featuredRank || 0)
        .filter((value) => Number.isFinite(value))
    ) + 1;
  const next = drafts.map((item) => {
    if (item.id !== id) {
      return item;
    }

    const reviewStatus = update.reviewStatus ?? item.reviewStatus;
    const approvedForPublic =
      typeof update.approvedForPublic === "boolean"
        ? update.approvedForPublic
        : reviewStatus === "approved"
          ? item.approvedForPublic
          : false;
    const canBeFeatured = reviewStatus === "approved" && approvedForPublic;
    const featured =
      canBeFeatured && typeof update.featured === "boolean"
        ? update.featured
        : canBeFeatured
          ? item.featured || false
          : false;
    const homepageFeatured =
      canBeFeatured && typeof update.homepageFeatured === "boolean"
        ? update.homepageFeatured
        : canBeFeatured
          ? item.homepageFeatured || false
          : false;
    const featuredRank =
      featured
        ? typeof update.featuredRank === "number"
          ? update.featuredRank
          : item.featuredRank || nextFeaturedRank
        : undefined;

    return {
      ...item,
      reviewStatus,
      approvedForPublic,
      reviewedAt: update.reviewStatus ? now : item.reviewedAt,
      publicAt: approvedForPublic ? now : typeof update.approvedForPublic === "boolean" ? undefined : item.publicAt,
      reviewedBy: update.reviewStatus || typeof update.approvedForPublic === "boolean" ? update.reviewedBy || "local-editor" : item.reviewedBy,
      featured,
      homepageFeatured: featured ? homepageFeatured : false,
      featuredRank,
    };
  });

  await writeInsightDrafts(next);
  return next;
}

export function getInsightDraftStoragePath() {
  return draftsPath;
}

export async function readInsightIngestionStatus() {
  await ensureDraftStorage();
  const content = await fs.readFile(runStatusPath, "utf8");

  try {
    return JSON.parse(content) as InsightIngestionRun | Record<string, never>;
  } catch {
    return {};
  }
}

export async function readInsightIngestionRuns() {
  await ensureDraftStorage();
  const content = await fs.readFile(runHistoryPath, "utf8");

  try {
    const parsed = JSON.parse(content) as InsightIngestionRun[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function recordInsightIngestionRun(run: InsightIngestionRun) {
  const history = await readInsightIngestionRuns();
  const nextHistory = [run, ...history].slice(0, 30);
  await fs.writeFile(runStatusPath, JSON.stringify(run, null, 2) + "\n", "utf8");
  await fs.writeFile(runHistoryPath, JSON.stringify(nextHistory, null, 2) + "\n", "utf8");
}

export function getInsightRunStatusPath() {
  return runStatusPath;
}

export function getInsightRunHistoryPath() {
  return runHistoryPath;
}
