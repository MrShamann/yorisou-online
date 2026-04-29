import { promises as fs } from "fs";
import path from "path";
import { GetObjectCommand, ListObjectsV2Command, NoSuchKey, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const DEFAULT_SHARED_REGION = "us-east-2";
const CONTROL_PREFIX = "phase3/branch-control";
const productionDataDir = path.join("/tmp", "yorisou-branch-control");
const localDataDir = path.join(process.cwd(), "data");
const sharedStoreBucket = process.env.YORISOU_SHARED_STORE_BUCKET?.trim() || "";
const sharedStoreRegion = process.env.YORISOU_SHARED_STORE_REGION || DEFAULT_SHARED_REGION;
const shouldUseSharedStore = Boolean(sharedStoreBucket);

let sharedStoreClient: S3Client | null = null;
const branchControlSnapshotCache = new Map<string, BranchControlRecord>();

export type BranchContainmentMode = "normal" | "entry_frozen" | "write_frozen" | "redirect_frozen" | "limited_external" | "archive";

export type BranchControlRecord = {
  branchId: string;
  containmentMode: BranchContainmentMode;
  entryFrozen: boolean;
  writeFrozen: boolean;
  redirectFrozen: boolean;
  updatedAt: string;
  updatedBy: string | null;
  reason: string | null;
};

export type BranchControlUpdate = {
  branchId: string;
  containmentMode?: BranchContainmentMode;
  entryFrozen?: boolean;
  writeFrozen?: boolean;
  redirectFrozen?: boolean;
  updatedBy?: string | null;
  reason?: string | null;
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

function nowIso() {
  return new Date().toISOString();
}

function getEventDataDir() {
  return process.env.YORISOU_DATA_DIR || (process.env.NODE_ENV === "production" ? productionDataDir : localDataDir);
}

function getLocalPath(branchId: string) {
  return path.join(getEventDataDir(), "branch-control", `${branchId}.json`);
}

function getSharedKey(branchId: string) {
  return `${CONTROL_PREFIX}/${branchId}.json`;
}

function normalizeMode(mode: BranchContainmentMode | undefined | null): BranchContainmentMode {
  return mode || "normal";
}

function deriveFlags(mode: BranchContainmentMode) {
  return {
    entryFrozen: mode === "entry_frozen" || mode === "archive",
    writeFrozen: mode === "write_frozen" || mode === "archive",
    redirectFrozen: mode === "redirect_frozen" || mode === "archive",
  };
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

async function readSharedJson<T>(key: string) {
  const client = getSharedStoreClient();
  if (!client || !sharedStoreBucket) {
    return null;
  }

  try {
    const response = await client.send(new GetObjectCommand({ Bucket: sharedStoreBucket, Key: key }));
    const content = await response.Body?.transformToString();
    return content ? (JSON.parse(content) as T) : null;
  } catch (error) {
    if (isMissingObjectError(error)) {
      return null;
    }
    throw error;
  }
}

async function writeSharedJson<T>(key: string, value: T) {
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

async function listSharedKeys() {
  const client = getSharedStoreClient();
  if (!client || !sharedStoreBucket) {
    return [];
  }

  const keys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: sharedStoreBucket,
        Prefix: `${CONTROL_PREFIX}/`,
        ContinuationToken: continuationToken,
      }),
    );
    for (const entry of response.Contents || []) {
      if (entry.Key && entry.Key.endsWith(".json")) {
        keys.push(entry.Key);
      }
    }
    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  return keys;
}

function buildRecord(branchId: string, update: BranchControlUpdate, createdAt = nowIso()): BranchControlRecord {
  const containmentMode = normalizeMode(update.containmentMode);
  const flags = deriveFlags(containmentMode);
  return {
    branchId,
    containmentMode,
    entryFrozen: update.entryFrozen ?? flags.entryFrozen,
    writeFrozen: update.writeFrozen ?? flags.writeFrozen,
    redirectFrozen: update.redirectFrozen ?? flags.redirectFrozen,
    updatedAt: createdAt,
    updatedBy: update.updatedBy || null,
    reason: update.reason || null,
  };
}

function cacheBranchControlState(record: BranchControlRecord) {
  branchControlSnapshotCache.set(record.branchId, record);
  return record;
}

export function getBranchControlSnapshot(branchId: string, fallbackMode: BranchContainmentMode = "normal") {
  const cached = branchControlSnapshotCache.get(branchId);
  if (cached) {
    return cached;
  }

  return cacheBranchControlState(buildRecord(branchId, { branchId, containmentMode: fallbackMode }, nowIso()));
}

export async function getBranchControlState(branchId: string, fallbackMode: BranchContainmentMode = "normal") {
  if (!branchId) {
    return cacheBranchControlState(buildRecord("unknown", { branchId: "unknown", containmentMode: fallbackMode }, nowIso()));
  }

  if (shouldUseSharedStore) {
    const stored = await readSharedJson<BranchControlRecord>(getSharedKey(branchId));
    if (stored) {
      return cacheBranchControlState(stored);
    }
    return cacheBranchControlState(buildRecord(branchId, { branchId, containmentMode: fallbackMode }, nowIso()));
  }

  const stored = await readLocalJson<BranchControlRecord | null>(getLocalPath(branchId), null);
  if (stored) {
    return cacheBranchControlState(stored);
  }
  return cacheBranchControlState(buildRecord(branchId, { branchId, containmentMode: fallbackMode }, nowIso()));
}

export async function listBranchControlStates(fallbackModeByBranchId: Record<string, BranchContainmentMode> = {}) {
  if (shouldUseSharedStore) {
    const keys = await listSharedKeys();
    const records = await Promise.all(
      keys.map(async (key) => {
        try {
          const record = await readSharedJson<BranchControlRecord>(key);
          return record ? cacheBranchControlState(record) : null;
        } catch {
          return null;
        }
      }),
    );

    return records.filter((entry): entry is BranchControlRecord => Boolean(entry));
  }

  const dir = getEventDataDir();
  const branchDir = path.join(dir, "branch-control");
  try {
    const filenames = await fs.readdir(branchDir);
    const records = await Promise.all(
      filenames.filter((name) => name.endsWith(".json")).map(async (name) => {
        try {
          const content = await fs.readFile(path.join(branchDir, name), "utf8");
          return content.trim() ? cacheBranchControlState(JSON.parse(content) as BranchControlRecord) : null;
        } catch {
          const branchId = name.replace(/\.json$/, "");
          const fallbackMode = fallbackModeByBranchId[branchId] || "normal";
          return cacheBranchControlState(buildRecord(branchId, { branchId, containmentMode: fallbackMode }, nowIso()));
        }
      }),
    );

    return records.filter((entry): entry is BranchControlRecord => Boolean(entry));
  } catch {
    return [];
  }
}

export async function setBranchControlState(update: BranchControlUpdate) {
  const current = await getBranchControlState(update.branchId);
  const next = buildRecord(update.branchId, {
    branchId: update.branchId,
    containmentMode: update.containmentMode || current.containmentMode,
    entryFrozen: update.entryFrozen ?? current.entryFrozen,
    writeFrozen: update.writeFrozen ?? current.writeFrozen,
    redirectFrozen: update.redirectFrozen ?? current.redirectFrozen,
    updatedBy: update.updatedBy ?? current.updatedBy,
    reason: update.reason ?? current.reason,
  });

  if (shouldUseSharedStore) {
    await writeSharedJson(getSharedKey(update.branchId), next);
    return cacheBranchControlState(next);
  }

  await writeLocalJson(getLocalPath(update.branchId), next);
  return cacheBranchControlState(next);
}

export function branchControlAllowsEntry(control: BranchControlRecord) {
  return !control.entryFrozen && control.containmentMode !== "archive";
}

export function branchControlAllowsWrite(control: BranchControlRecord) {
  return !control.writeFrozen && control.containmentMode !== "archive";
}

export function branchControlAllowsRedirect(control: BranchControlRecord) {
  return !control.redirectFrozen && control.containmentMode !== "archive";
}

export function getBranchControlStoreStatus() {
  return {
    localDataDir: path.join(getEventDataDir(), "branch-control"),
    sharedStoreEnabled: shouldUseSharedStore,
    sharedStoreBucketConfigured: shouldUseSharedStore,
    sharedStoreRegion,
    controlPrefix: CONTROL_PREFIX,
  } as const;
}
