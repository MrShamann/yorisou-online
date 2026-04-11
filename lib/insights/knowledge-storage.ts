import { promises as fs } from "fs";
import path from "path";
import { GetObjectCommand, PutObjectCommand, S3Client, NoSuchKey } from "@aws-sdk/client-s3";

import { normalizeSourceUrl } from "@/lib/insights/normalize";
import type { InsightDraft, MobilityKnowledgeObject } from "@/lib/insights/types";

const DEFAULT_SHARED_REGION = "us-east-2";
const SHARED_PREFIX = "phase1/insights";
const dataDir = process.env.YORISOU_INSIGHTS_DATA_DIR || (process.env.NODE_ENV === "production" ? path.join("/tmp", "yorisou-phase1") : path.join(process.cwd(), "data"));
const knowledgePath = path.join(dataDir, "insight-knowledge-records.json");
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

async function ensureStorage() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(knowledgePath);
  } catch {
    await fs.writeFile(knowledgePath, "[]\n", "utf8");
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

function sanitizeKnowledge(record: InsightDraft): InsightDraft {
  const knowledge = record.mobilityKnowledge;
  if (!knowledge) {
    return record;
  }

  const now = new Date().toISOString();
  const languageOriginal = knowledge.language_original || knowledge.language || "en";
  const languageAvailable = Array.from(
    new Set(
      [
        ...(knowledge.language_available || []),
        languageOriginal,
        "ja",
        "en",
      ].filter(Boolean),
    ),
  ) as MobilityKnowledgeObject["language_available"];

  return {
    ...record,
    mobilityKnowledge: {
      ...knowledge,
      source_type: knowledge.source_type || "manual",
      language: knowledge.language || languageOriginal,
      language_original: languageOriginal,
      language_available: languageAvailable,
      freshness_score: Number.isFinite(knowledge.freshness_score) ? knowledge.freshness_score : 0,
      urgency_score: Number.isFinite(knowledge.urgency_score) ? knowledge.urgency_score : 0,
      signal_type: knowledge.signal_type || "market_signal",
      translated_summary_ja: knowledge.translated_summary_ja || knowledge.summary_for_internal_use || "",
      translated_summary_en: knowledge.translated_summary_en || knowledge.summary_for_internal_use || "",
      last_checked_at: knowledge.last_checked_at || now,
      created_at: knowledge.created_at || now,
      updated_at: knowledge.updated_at || now,
      decision_reason: knowledge.decision_reason || record.ingestionNotes || "",
      reference_links: Array.isArray(knowledge.reference_links) ? knowledge.reference_links : [],
      risk_flags: Array.isArray(knowledge.risk_flags) ? knowledge.risk_flags : [],
      fit_people: Array.isArray(knowledge.fit_people) ? knowledge.fit_people : [],
      fit_scene: Array.isArray(knowledge.fit_scene) ? knowledge.fit_scene : [],
      key_specs: Array.isArray(knowledge.key_specs) ? knowledge.key_specs : [],
      summary_for_public_use: knowledge.summary_for_public_use || null,
    },
    sourceUrl: normalizeSourceUrl(record.sourceUrl),
  };
}

export async function readInsightKnowledgeRecords() {
  if (shouldUseSharedStore) {
    const parsed = await readSharedJson<InsightDraft[]>("insight-knowledge-records", []);
    return Array.isArray(parsed) ? parsed.map((item) => sanitizeKnowledge(item)) : [];
  }

  await ensureStorage();
  const content = await fs.readFile(knowledgePath, "utf8");

  try {
    const parsed = JSON.parse(content) as InsightDraft[];
    return Array.isArray(parsed) ? parsed.map((item) => sanitizeKnowledge(item)) : [];
  } catch {
    return [];
  }
}

export async function writeInsightKnowledgeRecords(records: InsightDraft[]) {
  if (shouldUseSharedStore) {
    await writeSharedJson("insight-knowledge-records", records.map((item) => sanitizeKnowledge(item)));
    return;
  }

  await ensureStorage();
  await fs.writeFile(knowledgePath, JSON.stringify(records, null, 2) + "\n", "utf8");
}

export async function upsertInsightKnowledgeRecords(incoming: InsightDraft[]) {
  const existing = await readInsightKnowledgeRecords();
  const map = new Map<string, InsightDraft>(existing.map((item) => [`${normalizeSourceUrl(item.sourceUrl)}::${item.slug}`, item]));

  for (const item of incoming) {
    const normalized = sanitizeKnowledge(item);
    map.set(`${normalizeSourceUrl(normalized.sourceUrl)}::${normalized.slug}`, normalized);
  }

  const merged = [...map.values()].sort((a, b) => {
    const aTime = a.mobilityKnowledge?.updated_at || a.mobilityKnowledge?.created_at || "";
    const bTime = b.mobilityKnowledge?.updated_at || b.mobilityKnowledge?.created_at || "";
    return aTime < bTime ? 1 : -1;
  });
  await writeInsightKnowledgeRecords(merged);
  return merged;
}

export function getInsightKnowledgeStoragePath() {
  return knowledgePath;
}
