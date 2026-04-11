import { promises as fs } from "fs";
import path from "path";
import { GetObjectCommand, NoSuchKey, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import type { PublicValidationRecord } from "@/lib/insights/types";

const DEFAULT_SHARED_REGION = "us-east-2";
const SHARED_PREFIX = "phase1/insights";
const dataDir =
  process.env.YORISOU_INSIGHTS_DATA_DIR ||
  process.env.YORISOU_DATA_DIR ||
  (process.env.NODE_ENV === "production" ? path.join("/tmp", "yorisou-phase1") : path.join(process.cwd(), "data"));
const storagePath = path.join(dataDir, "public-validation-records.json");
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

function isMissingObjectError(error: unknown) {
  return (
    error instanceof NoSuchKey ||
    (typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error.name === "NoSuchKey" || error.name === "NotFound" || error.name === "NoSuchBucket"))
  );
}

async function ensureStorage() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(storagePath);
  } catch {
    await fs.writeFile(storagePath, "[]\n", "utf8");
  }
}

function sharedKey(name: string) {
  return `${SHARED_PREFIX}/${name}.json`;
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
        Key: sharedKey(name),
      }),
    );
    const content = await response.Body?.transformToString();
    return content ? (JSON.parse(content) as T) : fallback;
  } catch (error) {
    if (isMissingObjectError(error)) {
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
      Key: sharedKey(name),
      Body: JSON.stringify(value, null, 2) + "\n",
      ContentType: "application/json",
    }),
  );
}

async function readJsonArray<T>(name: string, fallback: T[]) {
  if (shouldUseSharedStore) {
    const parsed = await readSharedJson<T[]>(name, []);
    return Array.isArray(parsed) ? parsed : fallback;
  }

  await ensureStorage();
  const content = await fs.readFile(storagePath, "utf8");
  try {
    const parsed = JSON.parse(content) as T[];
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

async function writeJsonArray<T>(name: string, value: T[]) {
  if (shouldUseSharedStore) {
    await writeSharedJson(name, value);
    return;
  }

  await ensureStorage();
  await fs.writeFile(storagePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function normalizeRecord(record: PublicValidationRecord): PublicValidationRecord {
  const now = new Date().toISOString();
  return {
    ...record,
    validation_id: record.validation_id || `pval_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    locale: record.locale === "en" ? "en" : "ja",
    event_type: record.event_type,
    user_type: record.user_type || "unknown",
    problem_slug: record.problem_slug?.trim() || null,
    problem_category: record.problem_category?.trim() || null,
    product_category: record.product_category?.trim() || null,
    contact_intent: record.contact_intent || null,
    wants_hinata_first: Boolean(record.wants_hinata_first),
    wants_follow_up: Boolean(record.wants_follow_up),
    source_name: record.source_name?.trim() || null,
    source_url: record.source_url?.trim() || null,
    card_id: record.card_id?.trim() || null,
    card_title: record.card_title?.trim() || null,
    page_path: record.page_path?.trim() || null,
    note: record.note?.trim() || null,
    created_at: record.created_at || now,
    updated_at: record.updated_at || now,
  };
}

export async function readPublicValidationRecords() {
  const records = await readJsonArray<PublicValidationRecord>("public-validation-records", []);
  return records.map((record) => normalizeRecord(record));
}

export async function appendPublicValidationRecords(records: PublicValidationRecord[]) {
  const existing = await readPublicValidationRecords();
  const merged = [...records.map((record) => normalizeRecord(record)), ...existing].sort((a, b) => b.created_at.localeCompare(a.created_at));
  await writeJsonArray("public-validation-records", merged.slice(0, 250));
  return merged;
}

export function getPublicValidationStoragePath() {
  return storagePath;
}
