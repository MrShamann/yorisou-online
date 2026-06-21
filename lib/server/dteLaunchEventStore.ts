import { promises as fs } from "fs";
import path from "path";
import { GetObjectCommand, ListObjectsV2Command, NoSuchKey, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";

import type { BranchCrossBranchAccessPolicy, BranchId, BranchVisibilityPolicy } from "@/lib/server/branchRegistry";

const DEFAULT_SHARED_REGION = "us-east-2";
const SHARED_PREFIX = "phase1";
const DATA_DIR =
  process.env.YORISOU_DATA_DIR ||
  (process.env.NODE_ENV === "production" ? path.join("/tmp", "yorisou-phase1") : path.join(process.cwd(), "data"));
const sharedStoreBucket = process.env.YORISOU_SHARED_STORE_BUCKET?.trim() || "";
const sharedStoreRegion = process.env.YORISOU_SHARED_STORE_REGION || DEFAULT_SHARED_REGION;
const sharedStoreAccessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim() || "";
const sharedStoreSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim() || "";
const shouldUseSharedStore = Boolean(sharedStoreBucket) && Boolean(sharedStoreAccessKeyId) && Boolean(sharedStoreSecretAccessKey);

let sharedStoreClient: S3Client | null = null;

type Locale = "ja" | "en";

export type DteLaunchEventPayload = {
  event: string;
  completionId?: string | null;
  personaId?: string | null;
  sessionId?: string | null;
  userId?: string | null;
  locale?: Locale | null;
  entrySource?: string | null;
  testVersion?: string | null;
  questionPosition?: number | null;
  questionId?: string | null;
  totalQuestionsAnswered?: number | null;
  completionTimestamp?: string | null;
  publicResultLabel?: string | null;
  resultVariantIds?: string[] | null;
  shareSurface?: string | null;
  shareCardVariant?: string | null;
  paywallVariant?: string | null;
  unlockTarget?: string | null;
  returnSurface?: string | null;
  daysSinceCompletion?: number | null;
  durationMs?: number | null;
  branchId?: BranchId | null;
  sourceBranchId?: BranchId | null;
  visibilityPolicy?: BranchVisibilityPolicy | null;
  crossBranchAccessPolicy?: BranchCrossBranchAccessPolicy | null;
  variantId?: string | null;
  variantKey?: string | null;
  triggerKey?: string | null;
  triggerContext?: Record<string, string | number | boolean | null> | null;
  resultKey?: string | null;
  source?: string | null;
  surface?: string | null;
  action?: string | null;
  questionIndex?: number | null;
  followUpIndex?: number | null;
  unitType?: string | null;
  status?: string | null;
  reason?: string | null;
  viewportClass?: string | null;
};

export type DteLaunchEventRecord = {
  id: string;
  recordedAt: string;
  updatedAt: string;
  payload: DteLaunchEventPayload;
};

export type DteLaunchStoreStatus = {
  mode: "shared_s3" | "local_file";
  sharedStoreBucketConfigured: boolean;
  dataDir: string;
  foundationPrefix: string;
};

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${randomBytes(6).toString("hex")}`;
}

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

function getRecordKey(id: string) {
  return `${SHARED_PREFIX}/dte-launch-events/${id}.json`;
}

function getLocalRecordPath(id: string) {
  return path.join(DATA_DIR, "dte-launch-events", `${id}.json`);
}

async function ensureLocalFile(filePath: string, fallback: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, `${fallback}\n`, "utf8");
  }
}

async function readLocalJson<T>(filePath: string, fallback: T) {
  await ensureLocalFile(filePath, "{}");

  try {
    const content = await fs.readFile(filePath, "utf8");
    return content.trim() ? (JSON.parse(content) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function writeLocalJson<T>(filePath: string, value: T) {
  await ensureLocalFile(filePath, "{}");
  await fs.writeFile(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

async function sharedReadJson<T>(key: string) {
  const client = getSharedStoreClient();

  if (!client || !sharedStoreBucket) {
    return null;
  }

  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: sharedStoreBucket,
        Key: key,
      }),
    );
    const content = await response.Body?.transformToString();

    if (!content) {
      return null;
    }

    return JSON.parse(content) as T;
  } catch (error) {
    if (isMissingObjectError(error)) {
      return null;
    }
    throw error;
  }
}

async function sharedWriteJson<T>(key: string, value: T) {
  const client = getSharedStoreClient();

  if (!client || !sharedStoreBucket) {
    throw new Error("shared_store_not_configured");
  }

  await client.send(
    new PutObjectCommand({
      Bucket: sharedStoreBucket,
      Key: key,
      Body: JSON.stringify(value, null, 2) + "\n",
      ContentType: "application/json",
    }),
  );
}

function normalizePayload(input: DteLaunchEventPayload): DteLaunchEventPayload {
  return {
    event: String(input.event || "unknown"),
    completionId: input.completionId ?? null,
    personaId: input.personaId ?? null,
    sessionId: input.sessionId ?? null,
    userId: input.userId ?? null,
    locale: input.locale === "en" ? "en" : input.locale === "ja" ? "ja" : null,
    entrySource: input.entrySource ?? null,
    testVersion: input.testVersion ?? null,
    questionPosition:
      typeof input.questionPosition === "number" && Number.isFinite(input.questionPosition) ? Math.floor(input.questionPosition) : null,
    questionId: input.questionId ?? null,
    totalQuestionsAnswered:
      typeof input.totalQuestionsAnswered === "number" && Number.isFinite(input.totalQuestionsAnswered)
        ? Math.floor(input.totalQuestionsAnswered)
        : null,
    completionTimestamp: input.completionTimestamp ?? null,
    publicResultLabel: input.publicResultLabel ?? null,
    resultVariantIds: Array.isArray(input.resultVariantIds) ? input.resultVariantIds.filter((entry) => typeof entry === "string") : null,
    shareSurface: input.shareSurface ?? null,
    shareCardVariant: input.shareCardVariant ?? null,
    paywallVariant: input.paywallVariant ?? null,
    unlockTarget: input.unlockTarget ?? null,
    returnSurface: input.returnSurface ?? null,
    daysSinceCompletion:
      typeof input.daysSinceCompletion === "number" && Number.isFinite(input.daysSinceCompletion) ? Math.floor(input.daysSinceCompletion) : null,
    durationMs: typeof input.durationMs === "number" && Number.isFinite(input.durationMs) ? Math.floor(input.durationMs) : null,
    branchId: input.branchId || "yorisou_dte",
    sourceBranchId: input.sourceBranchId || input.branchId || "yorisou_dte",
    visibilityPolicy: input.visibilityPolicy || "public",
    crossBranchAccessPolicy: input.crossBranchAccessPolicy || "explicit_bridge",
    variantId: input.variantId ?? null,
    variantKey: input.variantKey ?? null,
    triggerKey: input.triggerKey ?? null,
    triggerContext: input.triggerContext ?? null,
    resultKey: input.resultKey ?? null,
    source: input.source ?? null,
    surface: input.surface ?? null,
    action: input.action ?? null,
    questionIndex:
      typeof input.questionIndex === "number" && Number.isFinite(input.questionIndex) ? Math.floor(input.questionIndex) : null,
    followUpIndex:
      typeof input.followUpIndex === "number" && Number.isFinite(input.followUpIndex) ? Math.floor(input.followUpIndex) : null,
    unitType: input.unitType ?? null,
    status: input.status ?? null,
    reason: input.reason ?? null,
    viewportClass: input.viewportClass ?? null,
  };
}

export async function recordDteLaunchEvent(input: DteLaunchEventPayload) {
  const payload = normalizePayload(input);
  const timestamp = nowIso();
  const record: DteLaunchEventRecord = {
    id: createId("dte_launch_event"),
    recordedAt: timestamp,
    updatedAt: timestamp,
    payload,
  };

  if (shouldUseSharedStore) {
    await sharedWriteJson(getRecordKey(record.id), record);
    return record;
  }

  await writeLocalJson(getLocalRecordPath(record.id), record);
  return record;
}

export async function listDteLaunchEventRecords(limit = 200) {
  const records: DteLaunchEventRecord[] = [];

  if (shouldUseSharedStore) {
    const client = getSharedStoreClient();
    if (!client || !sharedStoreBucket) {
      return records;
    }

    const prefix = `${SHARED_PREFIX}/dte-launch-events/`;
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: sharedStoreBucket,
        Prefix: prefix,
      }),
    );

    for (const entry of response.Contents || []) {
      if (!entry.Key || !entry.Key.endsWith(".json")) {
        continue;
      }
      const record = await sharedReadJson<DteLaunchEventRecord>(entry.Key);
      if (record) {
        records.push(record);
      }
    }

    return records.sort((left, right) => right.recordedAt.localeCompare(left.recordedAt)).slice(0, limit);
  }

  try {
    const entries = await fs.readdir(path.join(DATA_DIR, "dte-launch-events"));
    for (const name of entries) {
      if (!name.endsWith(".json")) {
        continue;
      }
      const record = await readLocalJson<DteLaunchEventRecord | null>(getLocalRecordPath(name.replace(/\.json$/, "")), null);
      if (record) {
        records.push(record);
      }
    }
  } catch {
    return records;
  }

  return records.sort((left, right) => right.recordedAt.localeCompare(left.recordedAt)).slice(0, limit);
}

export function getDteLaunchStoreStatus(): DteLaunchStoreStatus {
  return {
    mode: shouldUseSharedStore ? "shared_s3" : "local_file",
    sharedStoreBucketConfigured: Boolean(sharedStoreBucket),
    dataDir: DATA_DIR,
    foundationPrefix: SHARED_PREFIX,
  };
}
