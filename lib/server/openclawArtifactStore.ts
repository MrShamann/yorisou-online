import { promises as fs } from "fs";
import path from "path";

import { GetObjectCommand, ListObjectsV2Command, NoSuchKey, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const DEFAULT_SHARED_REGION = "us-east-2";
const ARTIFACT_PREFIX = "phase1/openclaw-artifacts";
const productionDataDir = path.join("/tmp", "yorisou-phase1");
const localDataDir = path.join(process.cwd(), "data");

const sharedStoreBucket = process.env.YORISOU_SHARED_STORE_BUCKET?.trim() || "";
const sharedStoreRegion = process.env.YORISOU_SHARED_STORE_REGION || DEFAULT_SHARED_REGION;
const shouldUseSharedStore = Boolean(sharedStoreBucket);

let sharedStoreClient: S3Client | null = null;

export function getOpenClawArtifactDataDir() {
  return process.env.YORISOU_DATA_DIR || (process.env.NODE_ENV === "production" ? productionDataDir : localDataDir);
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

function artifactKey(kind: "reflections" | "needs-signals", artifactId: string) {
  return `${ARTIFACT_PREFIX}/${kind}/${artifactId}.json`;
}

export function getOpenClawArtifactLocalFiles(kind: "reflections" | "needs-signals") {
  const filename = kind === "reflections" ? "phase1-openclaw-reflections.json" : "phase1-openclaw-needs-signals.json";
  return [...new Set([path.join(getOpenClawArtifactDataDir(), filename), path.join(productionDataDir, filename), path.join(localDataDir, filename)])];
}

export async function mirrorOpenClawArtifact<T extends { id: string }>(
  kind: "reflections" | "needs-signals",
  artifact: T,
) {
  const client = getSharedStoreClient();
  if (!client || !sharedStoreBucket) {
    return false;
  }

  await client.send(
    new PutObjectCommand({
      Bucket: sharedStoreBucket,
      Key: artifactKey(kind, artifact.id),
      Body: JSON.stringify(artifact, null, 2) + "\n",
      ContentType: "application/json",
    }),
  );

  return true;
}

export async function listMirroredOpenClawArtifacts<T>(kind: "reflections" | "needs-signals") {
  const client = getSharedStoreClient();
  if (!client || !sharedStoreBucket) {
    return [];
  }

  const prefix = `${ARTIFACT_PREFIX}/${kind}/`;
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
        if (isMissingObjectError(error)) {
          return null;
        }
        throw error;
      }
    }),
  );

  return records.filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)) as T[];
}

export async function ensureLocalArtifactDir() {
  await fs.mkdir(getOpenClawArtifactDataDir(), { recursive: true });
}

export function getOpenClawArtifactStoreStatus() {
  return {
    localDataDir: getOpenClawArtifactDataDir(),
    localRuntimeFiles: {
      reflections: getOpenClawArtifactLocalFiles("reflections"),
      needsSignals: getOpenClawArtifactLocalFiles("needs-signals"),
    },
    sharedStoreEnabled: shouldUseSharedStore,
    sharedStoreBucketConfigured: shouldUseSharedStore,
    sharedStoreRegion,
    artifactPrefix: ARTIFACT_PREFIX,
  } as const;
}
