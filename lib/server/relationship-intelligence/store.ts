import { promises as fs } from "fs";
import path from "path";

import { GetObjectCommand, ListObjectsV2Command, NoSuchKey, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import type { RelationshipCollection } from "@/lib/server/relationship-intelligence/types";

const DEFAULT_SHARED_REGION = process.env.YORISOU_SHARED_STORE_REGION || "us-east-2";
const STORE_PREFIX = process.env.YORISOU_RELATIONSHIP_STORE_PREFIX?.trim() || "phase1/relationship-intelligence-v1";
const DATA_DIR =
  process.env.YORISOU_RELATIONSHIP_DATA_DIR ||
  (process.env.NODE_ENV === "production"
    ? path.join("/tmp", "yorisou-relationship-intelligence")
    : path.join(process.cwd(), "data", "relationship-intelligence"));
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

function localCollectionDir(collection: RelationshipCollection) {
  return path.join(DATA_DIR, collection);
}

function localRecordPath(collection: RelationshipCollection, recordId: string) {
  return path.join(localCollectionDir(collection), `${recordId}.json`);
}

async function ensureLocalCollection(collection: RelationshipCollection) {
  await fs.mkdir(localCollectionDir(collection), { recursive: true });
}

function sharedKey(collection: RelationshipCollection, recordId: string) {
  return `${STORE_PREFIX}/${collection}/${recordId}.json`;
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

async function readLocalRecord<T>(collection: RelationshipCollection, recordId: string) {
  await ensureLocalCollection(collection);

  try {
    const content = await fs.readFile(localRecordPath(collection, recordId), "utf8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

async function writeLocalRecord<T>(collection: RelationshipCollection, recordId: string, value: T) {
  await ensureLocalCollection(collection);
  await fs.writeFile(localRecordPath(collection, recordId), JSON.stringify(value, null, 2) + "\n", "utf8");
}

async function listLocalRecords<T>(collection: RelationshipCollection) {
  await ensureLocalCollection(collection);
  const filenames = await fs.readdir(localCollectionDir(collection));
  const records = await Promise.all(
    filenames
      .filter((name) => name.endsWith(".json"))
      .map(async (name) => {
        try {
          const content = await fs.readFile(path.join(localCollectionDir(collection), name), "utf8");
          return JSON.parse(content) as T;
        } catch {
          return null;
        }
      }),
  );

  return records.flatMap((entry) => (entry ? [entry] : []));
}

async function readSharedRecord<T>(collection: RelationshipCollection, recordId: string) {
  const client = getSharedStoreClient();

  if (!client || !sharedStoreBucket) {
    return null;
  }

  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: sharedStoreBucket,
        Key: sharedKey(collection, recordId),
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

async function writeSharedRecord<T>(collection: RelationshipCollection, recordId: string, value: T) {
  const client = getSharedStoreClient();

  if (!client || !sharedStoreBucket) {
    throw new Error("shared_store_not_configured");
  }

  await client.send(
    new PutObjectCommand({
      Bucket: sharedStoreBucket,
      Key: sharedKey(collection, recordId),
      Body: JSON.stringify(value, null, 2) + "\n",
      ContentType: "application/json",
    }),
  );
}

async function listSharedRecords<T>(collection: RelationshipCollection) {
  const client = getSharedStoreClient();

  if (!client || !sharedStoreBucket) {
    return [];
  }

  const prefix = `${STORE_PREFIX}/${collection}/`;
  let continuationToken: string | undefined;
  const keys: string[] = [];

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
      } catch {
        return null;
      }
    }),
  );

  return records.flatMap((entry) => (entry ? [entry] : []));
}

export function getRelationshipStoreStatus() {
  return {
    mode: shouldUseSharedStore ? ("shared_s3" as const) : ("local_file" as const),
    sharedStoreBucketConfigured: shouldUseSharedStore,
    dataDir: DATA_DIR,
    prefix: STORE_PREFIX,
  };
}

export async function getRelationshipRecord<T>(collection: RelationshipCollection, recordId: string) {
  if (shouldUseSharedStore) {
    return readSharedRecord<T>(collection, recordId);
  }

  return readLocalRecord<T>(collection, recordId);
}

export async function putRelationshipRecord<T>(collection: RelationshipCollection, recordId: string, value: T) {
  if (shouldUseSharedStore) {
    await writeSharedRecord(collection, recordId, value);
    return value;
  }

  await writeLocalRecord(collection, recordId, value);
  return value;
}

export async function listRelationshipRecords<T>(collection: RelationshipCollection) {
  if (shouldUseSharedStore) {
    return listSharedRecords<T>(collection);
  }

  return listLocalRecords<T>(collection);
}
