import { promises as fs } from "fs";
import path from "path";

import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, NoSuchKey, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import type { AuditLog, AuthIdentity, ConsentLog, Conversation, MessageEvent, SupportCase, UserProfile } from "@/lib/server/foundation/schema";

export type FoundationCollection =
  | "user-profiles"
  | "auth-identities"
  | "conversations"
  | "message-events"
  | "support-cases"
  | "consent-logs"
  | "audit-logs";

const DEFAULT_SHARED_REGION = process.env.YORISOU_SHARED_STORE_REGION || "us-east-2";
const FOUNDATION_PREFIX = process.env.YORISOU_FOUNDATION_STORE_PREFIX?.trim() || "foundation-v1";
const foundationDataDir =
  process.env.YORISOU_FOUNDATION_DATA_DIR ||
  (process.env.NODE_ENV === "production" ? path.join("/tmp", "yorisou-foundation") : path.join(process.cwd(), "data", "foundation"));
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

function foundationKey(collection: FoundationCollection, recordId: string) {
  return `${FOUNDATION_PREFIX}/${collection}/${recordId}.json`;
}

function localCollectionDir(collection: FoundationCollection) {
  return path.join(foundationDataDir, collection);
}

function localRecordPath(collection: FoundationCollection, recordId: string) {
  return path.join(localCollectionDir(collection), `${recordId}.json`);
}

async function ensureLocalCollection(collection: FoundationCollection) {
  await fs.mkdir(localCollectionDir(collection), { recursive: true });
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

async function readLocalRecord<T>(collection: FoundationCollection, recordId: string) {
  await ensureLocalCollection(collection);

  try {
    const content = await fs.readFile(localRecordPath(collection, recordId), "utf8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

async function listLocalRecords<T>(collection: FoundationCollection) {
  await ensureLocalCollection(collection);
  const filenames = await fs.readdir(localCollectionDir(collection));
  const records = await Promise.all(
    filenames.filter((name) => name.endsWith(".json")).map(async (name) => {
      try {
        const content = await fs.readFile(path.join(localCollectionDir(collection), name), "utf8");
        return JSON.parse(content) as T;
      } catch (error) {
        console.error(`foundation local record parse error: ${collection}/${name}`, error);
        return null;
      }
    }),
  );

  return records.flatMap((record) => (record ? [record as T] : []));
}

async function writeLocalRecord<T>(collection: FoundationCollection, recordId: string, value: T) {
  await ensureLocalCollection(collection);
  await fs.writeFile(localRecordPath(collection, recordId), JSON.stringify(value, null, 2) + "\n", "utf8");
}

async function readSharedRecord<T>(collection: FoundationCollection, recordId: string) {
  const client = getSharedStoreClient();

  if (!client || !sharedStoreBucket) {
    return null;
  }

  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: sharedStoreBucket,
        Key: foundationKey(collection, recordId),
      }),
    );
    const content = await response.Body?.transformToString();
    return content ? (JSON.parse(content) as T) : null;
  } catch (error) {
    if (isMissingObjectError(error)) {
      return null;
    }
    throw error;
  }
}

async function listSharedRecords<T>(collection: FoundationCollection) {
  const client = getSharedStoreClient();

  if (!client || !sharedStoreBucket) {
    return [];
  }

  const prefix = `${FOUNDATION_PREFIX}/${collection}/`;
  const keys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: sharedStoreBucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    );

    for (const entry of response.Contents || []) {
      if (entry.Key) {
        keys.push(entry.Key);
      }
    }

    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  const records = await Promise.all(
    keys.map(async (key) => {
      try {
        const response = await client.send(new GetObjectCommand({ Bucket: sharedStoreBucket, Key: key }));
        const content = await response.Body?.transformToString();
        return content ? (JSON.parse(content) as T) : null;
      } catch (error) {
        console.error(`foundation shared record parse error: ${key}`, error);
        return null;
      }
    }),
  );

  const resolved: T[] = [];

  for (const record of records) {
    if (record) {
      resolved.push(record);
    }
  }

  return resolved;
}

async function writeSharedRecord<T>(collection: FoundationCollection, recordId: string, value: T) {
  const client = getSharedStoreClient();

  if (!client || !sharedStoreBucket) {
    throw new Error("shared_store_not_configured");
  }

  await client.send(
    new PutObjectCommand({
      Bucket: sharedStoreBucket,
      Key: foundationKey(collection, recordId),
      Body: JSON.stringify(value, null, 2) + "\n",
      ContentType: "application/json",
    }),
  );
}

export async function getFoundationRecord<T>(collection: FoundationCollection, recordId: string) {
  if (shouldUseSharedStore) {
    return readSharedRecord<T>(collection, recordId);
  }

  return readLocalRecord<T>(collection, recordId);
}

export async function listFoundationRecords<T>(collection: FoundationCollection) {
  if (shouldUseSharedStore) {
    return listSharedRecords<T>(collection);
  }

  return listLocalRecords<T>(collection);
}

export async function putFoundationRecord<T>(collection: FoundationCollection, recordId: string, value: T) {
  if (shouldUseSharedStore) {
    await writeSharedRecord(collection, recordId, value);
    return value;
  }

  await writeLocalRecord(collection, recordId, value);
  return value;
}

export async function deleteFoundationRecord(collection: FoundationCollection, recordId: string) {
  if (shouldUseSharedStore) {
    const client = getSharedStoreClient();

    if (!client || !sharedStoreBucket) {
      throw new Error("shared_store_not_configured");
    }

    await client.send(
      new DeleteObjectCommand({
        Bucket: sharedStoreBucket,
        Key: foundationKey(collection, recordId),
      }),
    );
    return;
  }

  try {
    await fs.unlink(localRecordPath(collection, recordId));
  } catch {
    return;
  }
}

export function getFoundationStoreStatus() {
  return {
    mode: shouldUseSharedStore ? "shared_s3" : "local_file",
    sharedStoreBucketConfigured: shouldUseSharedStore,
    sharedStoreRegion,
    foundationPrefix: FOUNDATION_PREFIX,
    localDataDir: foundationDataDir,
  } as const;
}

export async function listUserProfiles(): Promise<UserProfile[]> {
  const entries = (await listFoundationRecords<UserProfile>("user-profiles")).filter((entry): entry is UserProfile => Boolean(entry));
  return entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listAuthIdentities(): Promise<AuthIdentity[]> {
  const entries = (await listFoundationRecords<AuthIdentity>("auth-identities")).filter((entry): entry is AuthIdentity => Boolean(entry));
  return entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listConversations(): Promise<Conversation[]> {
  const entries = (await listFoundationRecords<Conversation>("conversations")).filter((entry): entry is Conversation => Boolean(entry));
  return entries.sort((a, b) => b.latestActivityAt.localeCompare(a.latestActivityAt));
}

export async function listMessageEvents(): Promise<MessageEvent[]> {
  const entries = (await listFoundationRecords<MessageEvent>("message-events")).filter((entry): entry is MessageEvent => Boolean(entry));
  return entries.sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
}

export async function listSupportCases(): Promise<SupportCase[]> {
  const entries = (await listFoundationRecords<SupportCase>("support-cases")).filter((entry): entry is SupportCase => Boolean(entry));
  return entries.sort((a, b) => b.latestActivityAt.localeCompare(a.latestActivityAt));
}

export async function listConsentLogs(): Promise<ConsentLog[]> {
  const entries = (await listFoundationRecords<ConsentLog>("consent-logs")).filter((entry): entry is ConsentLog => Boolean(entry));
  return entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export async function listAuditLogs(): Promise<AuditLog[]> {
  const entries = (await listFoundationRecords<AuditLog>("audit-logs")).filter((entry): entry is AuditLog => Boolean(entry));
  return entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
