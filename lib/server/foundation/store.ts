import { promises as fs } from "fs";
import path from "path";

// POR-1 — the transport is SHARED with the identity store rather than re-implemented here.
//
// This module used to build its own `new S3Client({ region })`: no endpoint, no Supabase-REST mode.
// In the isolated Preview that pointed at AWS S3 with the Preview bucket's name and no credentials,
// so every foundation write threw — and the auth routes log and swallow those, so Preview looked
// healthy while the canonical identity mirror silently did not exist. A deletion cannot be proven
// against records that were never written.
import {
  deleteSharedObject,
  getSharedObject,
  listSharedObjectKeys,
  putSharedObject,
  sharedObjectTransportMode,
} from "@/lib/server/sharedObjectTransport";

import type { AuditLog, AuthIdentity, ConsentLog, Conversation, MessageEvent, SupportCase, UserProfile } from "@/lib/server/foundation/schema";

export type FoundationCollection =
  | "user-profiles"
  | "auth-identities"
  | "conversations"
  | "message-events"
  | "support-cases"
  | "consent-logs"
  | "audit-logs";

export type FoundationIndexNamespace =
  | "conversation-by-external-identity"
  | "support-case-by-conversation"
  | "message-events-by-conversation";

const DEFAULT_SHARED_REGION = process.env.YORISOU_SHARED_STORE_REGION || "us-east-2";
const PRIMARY_FOUNDATION_PREFIX = process.env.YORISOU_FOUNDATION_STORE_PREFIX?.trim() || "phase1/foundation-v1";
const LEGACY_FOUNDATION_PREFIX = "foundation-v1";
const foundationDataDir =
  process.env.YORISOU_FOUNDATION_DATA_DIR ||
  (process.env.NODE_ENV === "production" ? path.join("/tmp", "yorisou-foundation") : path.join(process.cwd(), "data", "foundation"));
const sharedStoreBucket = process.env.YORISOU_SHARED_STORE_BUCKET?.trim() || "";
const sharedStoreRegion = process.env.YORISOU_SHARED_STORE_REGION || DEFAULT_SHARED_REGION;
const shouldUseSharedStore = Boolean(sharedStoreBucket);

function hasStringField(value: unknown, key: string) {
  return typeof value === "object" && value !== null && typeof (value as Record<string, unknown>)[key] === "string";
}

function getFoundationReadPrefixes() {
  const prefixes = [PRIMARY_FOUNDATION_PREFIX];

  if (PRIMARY_FOUNDATION_PREFIX !== LEGACY_FOUNDATION_PREFIX) {
    prefixes.push(LEGACY_FOUNDATION_PREFIX);
  }

  return prefixes;
}

function foundationKey(prefix: string, collection: FoundationCollection, recordId: string) {
  return `${prefix}/${collection}/${recordId}.json`;
}

function foundationIndexKey(prefix: string, namespace: FoundationIndexNamespace, recordId: string) {
  return `${prefix}/indexes/${namespace}/${recordId}.json`;
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
  const message =
    typeof error === "object" && error !== null && "message" in error && typeof error.message === "string"
      ? error.message
      : "";

  return (
    (typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error.name === "NoSuchKey" ||
        error.name === "NotFound" ||
        error.name === "NoSuchBucket" ||
        (error.name === "AccessDenied" && message.includes("s3:ListBucket"))))
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
  if (!sharedStoreBucket) {
    return null;
  }

  // Both prefixes are tried: the primary one and the legacy root that predates it. A record found
  // under only the legacy prefix is still the person's record.
  for (const prefix of getFoundationReadPrefixes()) {
    try {
      const record = await getSharedObject<T>(foundationKey(prefix, collection, recordId));
      if (record) return record;
    } catch (error) {
      if (isMissingObjectError(error)) {
        continue;
      }
      throw error;
    }
  }

  return null;
}

async function readSharedIndexRecord<T>(namespace: FoundationIndexNamespace, recordId: string) {
  if (!sharedStoreBucket) {
    return null;
  }

  for (const prefix of getFoundationReadPrefixes()) {
    try {
      const record = await getSharedObject<T>(foundationIndexKey(prefix, namespace, recordId));
      if (record) return record;
    } catch (error) {
      if (isMissingObjectError(error)) {
        continue;
      }
      throw error;
    }
  }

  return null;
}

async function listSharedRecords<T>(collection: FoundationCollection) {
  if (!sharedStoreBucket) {
    return [];
  }

  const keys = new Set<string>();

  for (const prefixRoot of getFoundationReadPrefixes()) {
    try {
      for (const key of await listSharedObjectKeys(`${prefixRoot}/${collection}/`)) {
        keys.add(key);
      }
    } catch (error) {
      // A prefix that does not exist is not an error — the legacy root is absent in most
      // deployments, and refusing to list the primary one because of it would empty the result.
      if (!isMissingObjectError(error)) throw error;
    }
  }

  const records = await Promise.all(
    [...keys].map(async (key) => {
      try {
        return await getSharedObject<T>(key);
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
  if (!sharedStoreBucket) {
    throw new Error("shared_store_not_configured");
  }
  await putSharedObject(foundationKey(PRIMARY_FOUNDATION_PREFIX, collection, recordId), value);
}

async function writeSharedIndexRecord<T>(namespace: FoundationIndexNamespace, recordId: string, value: T) {
  if (!sharedStoreBucket) {
    throw new Error("shared_store_not_configured");
  }
  await putSharedObject(foundationIndexKey(PRIMARY_FOUNDATION_PREFIX, namespace, recordId), value);
}

export async function getFoundationRecord<T>(collection: FoundationCollection, recordId: string) {
  if (shouldUseSharedStore) {
    return readSharedRecord<T>(collection, recordId);
  }

  return readLocalRecord<T>(collection, recordId);
}

export async function getFoundationIndexRecord<T>(namespace: FoundationIndexNamespace, recordId: string) {
  if (shouldUseSharedStore) {
    return readSharedIndexRecord<T>(namespace, recordId);
  }

  await fs.mkdir(path.join(foundationDataDir, "indexes", namespace), { recursive: true });

  try {
    const content = await fs.readFile(path.join(foundationDataDir, "indexes", namespace, `${recordId}.json`), "utf8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
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

export async function putFoundationIndexRecord<T>(namespace: FoundationIndexNamespace, recordId: string, value: T) {
  if (shouldUseSharedStore) {
    await writeSharedIndexRecord(namespace, recordId, value);
    return value;
  }

  const dir = path.join(foundationDataDir, "indexes", namespace);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${recordId}.json`), JSON.stringify(value, null, 2) + "\n", "utf8");
  return value;
}

export async function deleteFoundationRecord(collection: FoundationCollection, recordId: string) {
  if (shouldUseSharedStore) {
    if (!sharedStoreBucket) {
      throw new Error("shared_store_not_configured");
    }
    // BOTH prefixes. A record written under the legacy root and deleted only under the primary one
    // would still resolve on read — an erasure that leaves the login route intact.
    for (const prefix of getFoundationReadPrefixes()) {
      await deleteSharedObject(foundationKey(prefix, collection, recordId));
    }
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
    mode: shouldUseSharedStore ? sharedObjectTransportMode() : "local_file",
    sharedStoreBucketConfigured: shouldUseSharedStore,
    sharedStoreRegion,
    foundationPrefix: PRIMARY_FOUNDATION_PREFIX,
    foundationReadPrefixes: getFoundationReadPrefixes(),
    localDataDir: foundationDataDir,
  } as const;
}

export async function listUserProfiles(): Promise<UserProfile[]> {
  const entries = (await listFoundationRecords<UserProfile>("user-profiles")).filter(
    (entry): entry is UserProfile => hasStringField(entry, "userProfileId") && hasStringField(entry, "createdAt"),
  );
  return entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listAuthIdentities(): Promise<AuthIdentity[]> {
  const entries = (await listFoundationRecords<AuthIdentity>("auth-identities")).filter(
    (entry): entry is AuthIdentity => hasStringField(entry, "authIdentityId") && hasStringField(entry, "createdAt"),
  );
  return entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listConversations(): Promise<Conversation[]> {
  const entries = (await listFoundationRecords<Conversation>("conversations")).filter(
    (entry): entry is Conversation => hasStringField(entry, "conversationId") && hasStringField(entry, "latestActivityAt"),
  );
  return entries.sort((a, b) => b.latestActivityAt.localeCompare(a.latestActivityAt));
}

export async function listMessageEvents(): Promise<MessageEvent[]> {
  const entries = (await listFoundationRecords<MessageEvent>("message-events")).filter(
    (entry): entry is MessageEvent => hasStringField(entry, "messageEventId") && hasStringField(entry, "recordedAt"),
  );
  return entries.sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
}

export async function listSupportCases(): Promise<SupportCase[]> {
  const entries = (await listFoundationRecords<SupportCase>("support-cases")).filter(
    (entry): entry is SupportCase => hasStringField(entry, "supportCaseId") && hasStringField(entry, "latestActivityAt"),
  );
  return entries.sort((a, b) => b.latestActivityAt.localeCompare(a.latestActivityAt));
}

export async function listConsentLogs(): Promise<ConsentLog[]> {
  const entries = (await listFoundationRecords<ConsentLog>("consent-logs")).filter(
    (entry): entry is ConsentLog => hasStringField(entry, "consentLogId") && hasStringField(entry, "timestamp"),
  );
  return entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export async function listAuditLogs(): Promise<AuditLog[]> {
  const entries = (await listFoundationRecords<AuditLog>("audit-logs")).filter(
    (entry): entry is AuditLog => hasStringField(entry, "auditLogId") && hasStringField(entry, "createdAt"),
  );
  return entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
