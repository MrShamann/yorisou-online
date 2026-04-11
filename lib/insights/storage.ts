import { promises as fs } from "fs";
import path from "path";
import { GetObjectCommand, PutObjectCommand, S3Client, NoSuchKey } from "@aws-sdk/client-s3";

import { normalizeSourceUrl } from "@/lib/insights/normalize";
import type { InsightDraft, InsightIngestionRun, InsightPublicStage, ReviewStatus } from "@/lib/insights/types";

const DEFAULT_SHARED_REGION = "us-east-2";
const SHARED_PREFIX = "phase1/insights";
const dataDir = process.env.YORISOU_INSIGHTS_DATA_DIR || (process.env.NODE_ENV === "production" ? path.join("/tmp", "yorisou-phase1") : path.join(process.cwd(), "data"));
const draftsPath = path.join(dataDir, "insight-drafts.json");
const runStatusPath = path.join(dataDir, "insight-ingestion-status.json");
const runHistoryPath = path.join(dataDir, "insight-ingestion-runs.json");
const sharedStoreBucket = process.env.YORISOU_SHARED_STORE_BUCKET?.trim() || "";
const sharedStoreRegion = process.env.YORISOU_SHARED_STORE_REGION || DEFAULT_SHARED_REGION;
const shouldUseSharedStore = Boolean(sharedStoreBucket);

let sharedStoreClient: S3Client | null = null;

function getSharedStoreClient() {
  if (!shouldUseSharedStore) {
    return null;
  }

  if (!sharedStoreClient) {
    sharedStoreClient = new S3Client({ region: sharedStoreRegion });
  }

  return sharedStoreClient;
}

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

function sanitizeDraft(item: InsightDraft): InsightDraft {
  return {
    ...item,
    slug: item.slug || deriveDraftSlug(item),
    sourceUrl: normalizeSourceUrl(item.sourceUrl),
    analysisVersion: item.analysisVersion || "v1",
    featured: item.featured || false,
    homepageFeatured: item.homepageFeatured || false,
  };
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

function insightKey(name: string) {
  return `${SHARED_PREFIX}/${name}.json`;
}

function isMissingObjectError(error: unknown) {
  return (
    error instanceof NoSuchKey ||
    (typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error.name === "NoSuchKey" || error.name === "NotFound" || error.name === "NoSuchBucket"))
  );
}

function isCredentialOrConfigError(error: unknown) {
  const name =
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof (error as { name?: unknown }).name === "string"
      ? (error as { name: string }).name
      : "";

  return (
    name.length > 0 &&
    ["CredentialsProviderError", "ConfigError", "Missing credentials in config", "MissingRegionError"].some((needle) =>
      name.includes(needle),
    )
  );
}

async function readSharedJson<T>(name: string, fallback: T) {
  const client = getSharedStoreClient();
  if (!client || !sharedStoreBucket) {
    return fallback;
  }

  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: sharedStoreBucket,
        Key: insightKey(name),
      }),
    );
    const content = await response.Body?.transformToString();
    return content ? (JSON.parse(content) as T) : fallback;
  } catch (error) {
    if (isMissingObjectError(error)) {
      return fallback;
    }
    if (isCredentialOrConfigError(error)) {
      return fallback;
    }
    throw error;
  }
}

async function writeSharedJson<T>(name: string, value: T) {
  const client = getSharedStoreClient();
  if (!client || !sharedStoreBucket) {
    throw new Error("shared_store_not_configured");
  }

  await client.send(
    new PutObjectCommand({
      Bucket: sharedStoreBucket,
      Key: insightKey(name),
      Body: JSON.stringify(value, null, 2) + "\n",
      ContentType: "application/json",
    }),
  );
}

export async function readInsightDrafts() {
  if (shouldUseSharedStore) {
    const parsed = await readSharedJson<InsightDraft[]>("insight-drafts", []);
    return Array.isArray(parsed) ? parsed.map(sanitizeDraft) : [];
  }

  await ensureDraftStorage();
  const content = await fs.readFile(draftsPath, "utf8");

  try {
    const parsed = JSON.parse(content) as InsightDraft[];
    return Array.isArray(parsed) ? parsed.map(sanitizeDraft) : [];
  } catch {
    return [];
  }
}

export async function writeInsightDrafts(drafts: InsightDraft[]) {
  if (shouldUseSharedStore) {
    await writeSharedJson("insight-drafts", drafts.map(sanitizeDraft));
    return;
  }

  await ensureDraftStorage();
  await fs.writeFile(draftsPath, JSON.stringify(drafts.map(sanitizeDraft), null, 2) + "\n", "utf8");
}

export async function upsertInsightDrafts(incoming: InsightDraft[]) {
  const existing = await readInsightDrafts();
  const map = new Map<string, InsightDraft>(existing.map((item) => [`${normalizeSourceUrl(item.sourceUrl)}::${item.slug}`, item]));

  incoming.forEach((item) => {
    const normalized = sanitizeDraft(item);
    const key = `${normalized.sourceUrl}::${normalized.slug}`;
    map.set(key, normalized);
  });

  const merged = [...map.values()].sort((a, b) => {
    const aTime = a.fetchedAt || a.publishedAt || "";
    const bTime = b.fetchedAt || b.publishedAt || "";
    return aTime < bTime ? 1 : -1;
  });
  await writeInsightDrafts(merged);
  return merged;
}

export async function updateInsightDraftReviewState(
  id: string,
  update: {
    reviewStatus?: ReviewStatus;
    approvedForPublic?: boolean;
    reviewedBy?: string;
    reviewNote?: string;
    featured?: boolean;
    featuredRank?: number;
    homepageFeatured?: boolean;
    publicStage?: InsightPublicStage;
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
    const publicStage = update.publicStage || item.publicStage;
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
      reviewedAt:
        update.reviewStatus ||
        typeof update.approvedForPublic === "boolean" ||
        typeof update.reviewNote === "string" ||
        typeof update.publicStage === "string" ||
        typeof update.featured === "boolean" ||
        typeof update.homepageFeatured === "boolean"
          ? now
          : item.reviewedAt,
      publicAt: approvedForPublic ? now : typeof update.approvedForPublic === "boolean" ? undefined : item.publicAt,
      reviewedBy:
        update.reviewStatus ||
        typeof update.approvedForPublic === "boolean" ||
        typeof update.reviewNote === "string" ||
        typeof update.publicStage === "string" ||
        typeof update.featured === "boolean" ||
        typeof update.homepageFeatured === "boolean"
          ? update.reviewedBy || "local-editor"
          : item.reviewedBy,
      reviewNote: typeof update.reviewNote === "string" ? update.reviewNote : item.reviewNote,
      featured,
      homepageFeatured: featured ? homepageFeatured : false,
      featuredRank,
      publicStage: canBeFeatured ? publicStage : item.publicStage,
    };
  });

  await writeInsightDrafts(next);
  return next;
}

export function getInsightDraftStoragePath() {
  return draftsPath;
}

export async function readInsightIngestionStatus() {
  if (shouldUseSharedStore) {
    return readSharedJson<InsightIngestionRun | Record<string, never>>("insight-ingestion-status", {});
  }

  await ensureDraftStorage();
  const content = await fs.readFile(runStatusPath, "utf8");

  try {
    return JSON.parse(content) as InsightIngestionRun | Record<string, never>;
  } catch {
    return {};
  }
}

export async function readInsightIngestionRuns() {
  if (shouldUseSharedStore) {
    const parsed = await readSharedJson<InsightIngestionRun[]>("insight-ingestion-runs", []);
    return Array.isArray(parsed) ? parsed : [];
  }

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
  if (shouldUseSharedStore) {
    const history = await readInsightIngestionRuns();
    const nextHistory = [run, ...history].slice(0, 30);
    await writeSharedJson("insight-ingestion-status", run);
    await writeSharedJson("insight-ingestion-runs", nextHistory);
    return;
  }

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
