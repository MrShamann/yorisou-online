import { promises as fs } from "fs";
import path from "path";
import { GetObjectCommand, ListObjectsV2Command, NoSuchKey, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";

import resultPayloadContractJson from "@/docs/yorisou_result_payload_contract_2026-04-13/yorisou_result_payload_contract_v1.json";
import type { BranchCrossBranchAccessPolicy, BranchId, BranchVisibilityPolicy } from "@/lib/server/branchRegistry";

type Locale = "ja" | "en";

const DEFAULT_SHARED_REGION = "us-east-2";
const SHARED_PREFIX = "phase1";
const dataDir =
  process.env.YORISOU_DATA_DIR ||
  (process.env.NODE_ENV === "production" ? path.join("/tmp", "yorisou-phase1") : path.join(process.cwd(), "data"));
const sharedStoreBucket = process.env.YORISOU_SHARED_STORE_BUCKET?.trim() || "";
const sharedStoreRegion = process.env.YORISOU_SHARED_STORE_REGION || DEFAULT_SHARED_REGION;
const sharedStoreAccessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim() || "";
const sharedStoreSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim() || "";
const shouldUseSharedStore = Boolean(sharedStoreBucket) && Boolean(sharedStoreAccessKeyId) && Boolean(sharedStoreSecretAccessKey);

let sharedStoreClient: S3Client | null = null;

export type DynamicTestCompletionRecord = {
  id: string;
  sessionId: string;
  userId: string | null;
  branchId: BranchId;
  sourceBranchId: BranchId | null;
  visibilityPolicy: BranchVisibilityPolicy;
  crossBranchAccessPolicy: BranchCrossBranchAccessPolicy;
  locale: Locale;
  personaId: string;
  totalQuestions: number;
  answeredQuestions: number;
  sourceSurface: string;
  entrySource: string;
  neighboringPersonaIds: string[];
  currentModeKey: string;
  currentModeLabelJa: string;
  currentModeLabelEn: string;
  driftRisk: boolean;
  resultVersion: string;
  scoringVersion: string;
  status: "completed";
  completedAt: string;
  updatedAt: string;
};

export type DynamicTestCompletionRecordInput = {
  sessionId: string;
  userId: string | null;
  branchId?: BranchId | null;
  sourceBranchId?: BranchId | null;
  visibilityPolicy?: BranchVisibilityPolicy | null;
  crossBranchAccessPolicy?: BranchCrossBranchAccessPolicy | null;
  locale: Locale;
  personaId: string;
  totalQuestions: number;
  answeredQuestions: number;
  sourceSurface: string;
  entrySource: string;
  neighboringPersonaIds?: string[] | null;
  currentModeKey?: string | null;
  currentModeLabelJa?: string | null;
  currentModeLabelEn?: string | null;
  driftRisk?: boolean | null;
};

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

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${randomBytes(6).toString("hex")}`;
}

function getCompletionKey(id: string) {
  return `${SHARED_PREFIX}/dynamic-test-completions/${id}.json`;
}

function getLocalCompletionPath(id: string) {
  return path.join(dataDir, "dynamic-test-completions", `${id}.json`);
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

export async function recordDynamicTestCompletion(input: DynamicTestCompletionRecordInput) {
  const id = createId("dte_result");
  const timestamp = new Date().toISOString();
  const record: DynamicTestCompletionRecord = {
    id,
    sessionId: input.sessionId,
    userId: input.userId,
    branchId: input.branchId || "yorisou_dte",
    sourceBranchId: input.sourceBranchId || input.branchId || "yorisou_dte",
    visibilityPolicy: input.visibilityPolicy || "public",
    crossBranchAccessPolicy: input.crossBranchAccessPolicy || "explicit_bridge",
    locale: input.locale,
    personaId: input.personaId,
    totalQuestions: input.totalQuestions,
    answeredQuestions: input.answeredQuestions,
    sourceSurface: input.sourceSurface,
    entrySource: input.entrySource,
    neighboringPersonaIds: input.neighboringPersonaIds || [],
    currentModeKey: input.currentModeKey || "steady",
    currentModeLabelJa: input.currentModeLabelJa || "ふだん寄り",
    currentModeLabelEn: input.currentModeLabelEn || "Steady",
    driftRisk: Boolean(input.driftRisk),
    resultVersion: String(resultPayloadContractJson.result_object.result_version || "v1"),
    scoringVersion: String(resultPayloadContractJson.result_object.scoring_version || "v1"),
    status: "completed",
    completedAt: timestamp,
    updatedAt: timestamp,
  };

  if (shouldUseSharedStore) {
    await sharedWriteJson(getCompletionKey(id), record);
    return record;
  }

  await writeLocalJson(getLocalCompletionPath(id), record);
  return record;
}

export async function getDynamicTestCompletionRecord(id: string): Promise<DynamicTestCompletionRecord | null> {
  if (!id) {
    return null;
  }

  if (shouldUseSharedStore) {
    return (await sharedReadJson<DynamicTestCompletionRecord>(getCompletionKey(id))) || null;
  }

  return readLocalJson<DynamicTestCompletionRecord | null>(getLocalCompletionPath(id), null);
}

export async function listDynamicTestCompletionRecords(branchId?: BranchId | null) {
  const records: DynamicTestCompletionRecord[] = [];

  if (shouldUseSharedStore) {
    const client = getSharedStoreClient();
    if (!client || !sharedStoreBucket) {
      return records;
    }

    const prefix = `${SHARED_PREFIX}/dynamic-test-completions/`;
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
      const record = await sharedReadJson<DynamicTestCompletionRecord>(entry.Key);
      if (record && (!branchId || record.branchId === branchId)) {
        records.push(record);
      }
    }
    return records.sort((left, right) => right.completedAt.localeCompare(left.completedAt));
  }

  try {
    const entries = await fs.readdir(path.join(dataDir, "dynamic-test-completions"));
    for (const name of entries) {
      if (!name.endsWith(".json")) {
        continue;
      }
      const record = await readLocalJson<DynamicTestCompletionRecord | null>(getLocalCompletionPath(name.replace(/\.json$/, "")), null);
      if (record && (!branchId || record.branchId === branchId)) {
        records.push(record);
      }
    }
  } catch {
    return records;
  }

  return records.sort((left, right) => right.completedAt.localeCompare(left.completedAt));
}
