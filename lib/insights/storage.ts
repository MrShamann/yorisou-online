import { promises as fs } from "fs";
import path from "path";

import type { InsightDraft, ReviewStatus } from "@/lib/insights/types";

const dataDir = path.join(process.cwd(), "data");
const draftsPath = path.join(dataDir, "insight-drafts.json");

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
  const map = new Map<string, InsightDraft>(existing.map((item) => [`${item.sourceUrl}::${item.slug}`, item]));

  incoming.forEach((item) => {
    const key = `${item.sourceUrl}::${item.slug}`;
    if (!map.has(key)) {
      map.set(key, item);
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
  }
) {
  const drafts = await readInsightDrafts();
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

    return {
      ...item,
      reviewStatus,
      approvedForPublic,
    };
  });

  await writeInsightDrafts(next);
  return next;
}

export function getInsightDraftStoragePath() {
  return draftsPath;
}
