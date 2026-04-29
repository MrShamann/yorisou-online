import { promises as fs } from "node:fs";
import path from "node:path";

import {
  GetObjectCommand,
  ListObjectsV2Command,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const DEFAULT_SHARED_REGION = process.env.YORISOU_SHARED_STORE_REGION || "us-east-2";
const SHARED_PREFIX = process.env.YORISOU_OPENCLAW_STORE_PREFIX?.trim() || "phase1/openclaw";
const SHARED_BUCKET = process.env.YORISOU_SHARED_STORE_BUCKET?.trim() || "";
const SHOULD_USE_SHARED_STORE = Boolean(SHARED_BUCKET);

const LOCAL_BASE_DIR =
  process.env.YORISOU_OPENCLAW_DATA_DIR?.trim() ||
  (process.env.NODE_ENV === "production"
    ? path.join("/tmp", "yorisou-openclaw")
    : path.join(process.cwd(), "automation", "yorisou"));

const LOCAL_PATHS = {
  runsDir: path.join(LOCAL_BASE_DIR, "runs"),
  reviewStateFile: path.join(LOCAL_BASE_DIR, "review_state", "openclaw-review-state.json"),
  approvedStagingFile: path.join(LOCAL_BASE_DIR, "review_state", "openclaw-approved-staging.json"),
  stagingHistoryFile: path.join(LOCAL_BASE_DIR, "review_state", "openclaw-staging-history.json"),
  approvedPoolFile: path.join(LOCAL_BASE_DIR, "review_state", "openclaw-approved-pool.json"),
  approvedPoolHistoryFile: path.join(LOCAL_BASE_DIR, "review_state", "openclaw-approved-pool-history.json"),
  candidatePoolFile: path.join(LOCAL_BASE_DIR, "review_state", "openclaw-candidate-pool.json"),
  candidatePoolHistoryFile: path.join(LOCAL_BASE_DIR, "review_state", "openclaw-candidate-pool-history.json"),
  screenedCandidatePoolFile: path.join(LOCAL_BASE_DIR, "review_state", "openclaw-screened-candidate-pool.json"),
  screenedCandidatePoolHistoryFile: path.join(LOCAL_BASE_DIR, "review_state", "openclaw-screened-candidate-pool-history.json"),
  queueIndexFile: path.join(LOCAL_BASE_DIR, "queue_index", "openclaw-queue-index.json"),
  runHistoryFile: path.join(LOCAL_BASE_DIR, "run_history", "openclaw-run-history.json"),
};

let sharedStoreClient = null;

function getSharedStoreClient() {
  if (!SHOULD_USE_SHARED_STORE) {
    return null;
  }

  if (!sharedStoreClient) {
    sharedStoreClient = new S3Client({ region: DEFAULT_SHARED_REGION });
  }

  return sharedStoreClient;
}

function isMissingObjectError(error) {
  return (
    error instanceof NoSuchKey ||
    (typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error.name === "NoSuchKey" || error.name === "NotFound" || error.name === "NoSuchBucket"))
  );
}

function artifactFamilyFromPath(filePath) {
  if (filePath.includes(`${path.sep}question-pipeline${path.sep}`)) return "question-candidates";
  if (filePath.includes(`${path.sep}result_surface${path.sep}`) || filePath.includes(`${path.sep}result-surface${path.sep}`)) return "result-surface-candidates";
  if (filePath.includes(`${path.sep}ui-experiments${path.sep}`)) return "ui-experiments";
  if (filePath.includes(`${path.sep}feedback-learning${path.sep}`)) return "feedback-learning";
  if (filePath.includes(`${path.sep}operating-loop${path.sep}`)) return "operating-loop";
  return "post-deploy-audit";
}

function artifactPipelineFromFamily(family) {
  if (family === "question-candidates") return "question-pipeline";
  if (family === "result-surface-candidates") return "result_surface";
  if (family === "ui-experiments") return "ui-experiments";
  if (family === "feedback-learning") return "feedback-learning";
  if (family === "operating-loop") return "operating-loop";
  return "post-deploy-audit";
}

function inferTimestampFromFilename(fileName) {
  const match = fileName.match(/(\d{4}-\d{2}-\d{2}T[^.]+)\.json$/);
  return match ? match[1] : new Date(0).toISOString();
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readJsonFile(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filePath, data) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function artifactLocalPath(fileName, family) {
  const pipeline = artifactPipelineFromFamily(family);
  return path.join(LOCAL_PATHS.runsDir, pipeline, fileName);
}

function artifactSharedKey(fileName, family) {
  const pipeline = artifactPipelineFromFamily(family);
  return `${SHARED_PREFIX}/runs/${pipeline}/${fileName}`;
}

function stateSharedKey(name) {
  return `${SHARED_PREFIX}/state/${name}.json`;
}

function defaultApprovedStagingState() {
  return { records: {} };
}

function defaultStagingHistoryState() {
  return { events: [] };
}

function defaultApprovedPoolState() {
  return { records: {} };
}

function defaultApprovedPoolHistoryState() {
  return { events: [] };
}

function defaultCandidatePoolState() {
  return { records: {} };
}

function defaultCandidatePoolHistoryState() {
  return { events: [] };
}

function defaultScreenedCandidatePoolState() {
  return { records: {} };
}

function defaultScreenedCandidatePoolHistoryState() {
  return { events: [] };
}

async function writeSharedJson(key, data) {
  const client = getSharedStoreClient();
  if (!client || !SHARED_BUCKET) {
    return false;
  }

  await client.send(
    new PutObjectCommand({
      Bucket: SHARED_BUCKET,
      Key: key,
      Body: `${JSON.stringify(data, null, 2)}\n`,
      ContentType: "application/json",
    }),
  );

  return true;
}

async function readSharedJson(key, fallback) {
  const client = getSharedStoreClient();
  if (!client || !SHARED_BUCKET) {
    return fallback;
  }

  try {
    const response = await client.send(new GetObjectCommand({ Bucket: SHARED_BUCKET, Key: key }));
    const content = await response.Body?.transformToString();
    return content ? JSON.parse(content) : fallback;
  } catch (error) {
    if (isMissingObjectError(error)) {
      return fallback;
    }
    throw error;
  }
}

async function listSharedArtifactBatches() {
  const client = getSharedStoreClient();
  if (!client || !SHARED_BUCKET) {
    return [];
  }

  const prefix = `${SHARED_PREFIX}/runs/`;
  const keys = [];
  let continuationToken;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: SHARED_BUCKET,
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
        const response = await client.send(new GetObjectCommand({ Bucket: SHARED_BUCKET, Key: key }));
        const content = await response.Body?.transformToString();
        if (!content) {
          return null;
        }
        const data = JSON.parse(content);
        const relativeKey = key.slice(prefix.length);
        const [pipeline, ...rest] = relativeKey.split("/");
        const fileName = rest.join("/");
        const createdAt = data?.runAt || data?.summary?.runAt || inferTimestampFromFilename(fileName);
        const family = artifactFamilyFromPath(path.join(pipeline, fileName));
        return {
          artifactKey: path.join(pipeline, fileName),
          artifactFamily: family,
          createdAt,
          filePath: artifactLocalPath(fileName, family),
          data,
          source: "shared",
        };
      } catch (error) {
        if (isMissingObjectError(error)) {
          return null;
        }
        throw error;
      }
    }),
  );

  return records.filter(Boolean);
}

async function listLocalArtifactBatches() {
  const entries = await fs.readdir(LOCAL_PATHS.runsDir, { withFileTypes: true }).catch(() => []);
  const batches = [];

  for (const familyDir of entries) {
    if (!familyDir.isDirectory()) continue;
    const familyPath = path.join(LOCAL_PATHS.runsDir, familyDir.name);
    const files = await fs.readdir(familyPath, { withFileTypes: true }).catch(() => []);
    for (const entry of files) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
      const filePath = path.join(familyPath, entry.name);
      const data = await readJsonFile(filePath, null);
      batches.push({
        artifactKey: path.join(familyDir.name, entry.name),
        artifactFamily: artifactFamilyFromPath(filePath),
        createdAt: data?.runAt || data?.summary?.runAt || inferTimestampFromFilename(entry.name),
        filePath,
        data,
        source: "local",
      });
    }
  }

  return batches;
}

export function getOpenClawStoreStatus() {
  return {
    sharedStoreEnabled: SHOULD_USE_SHARED_STORE,
    sharedStoreBucketConfigured: SHOULD_USE_SHARED_STORE,
    sharedStoreBucket: SHARED_BUCKET || null,
    sharedStoreRegion: DEFAULT_SHARED_REGION,
    sharedPrefix: SHARED_PREFIX,
    localBaseDir: LOCAL_BASE_DIR,
    localPaths: LOCAL_PATHS,
  };
}

export async function writeOpenClawArtifactRecord(options, payload) {
  const fileName = `${options.prefix}-${options.timestampSlug || new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  const localPath = artifactLocalPath(fileName, options.family);
  await writeJsonFile(localPath, payload);
  await writeSharedJson(artifactSharedKey(fileName, options.family), payload);
  return localPath;
}

export async function listOpenClawArtifacts() {
  const merged = new Map();
  for (const item of await listLocalArtifactBatches()) {
    merged.set(item.artifactKey, item);
  }
  for (const item of await listSharedArtifactBatches()) {
    merged.set(item.artifactKey, item);
  }
  return [...merged.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function readOpenClawReviewState() {
  const fallback = { batches: {} };
  const shared = await readSharedJson(stateSharedKey("review-state"), null);
  if (shared) {
    return shared;
  }
  return readJsonFile(LOCAL_PATHS.reviewStateFile, fallback);
}

export async function writeOpenClawReviewState(nextState) {
  await writeJsonFile(LOCAL_PATHS.reviewStateFile, nextState);
  await writeSharedJson(stateSharedKey("review-state"), nextState);
  return LOCAL_PATHS.reviewStateFile;
}

export async function readOpenClawApprovedStagingState() {
  const shared = await readSharedJson(stateSharedKey("approved-staging"), null);
  if (shared) {
    return shared;
  }
  return readJsonFile(LOCAL_PATHS.approvedStagingFile, defaultApprovedStagingState());
}

export async function writeOpenClawApprovedStagingState(nextState) {
  await writeJsonFile(LOCAL_PATHS.approvedStagingFile, nextState);
  await writeSharedJson(stateSharedKey("approved-staging"), nextState);
  return LOCAL_PATHS.approvedStagingFile;
}

export async function readOpenClawStagingHistory() {
  const shared = await readSharedJson(stateSharedKey("staging-history"), null);
  if (shared) {
    return shared;
  }
  return readJsonFile(LOCAL_PATHS.stagingHistoryFile, defaultStagingHistoryState());
}

export async function writeOpenClawStagingHistory(nextState) {
  await writeJsonFile(LOCAL_PATHS.stagingHistoryFile, nextState);
  await writeSharedJson(stateSharedKey("staging-history"), nextState);
  return LOCAL_PATHS.stagingHistoryFile;
}

export async function readOpenClawApprovedPoolState() {
  const shared = await readSharedJson(stateSharedKey("approved-pool"), null);
  if (shared) {
    return shared;
  }
  return readJsonFile(LOCAL_PATHS.approvedPoolFile, defaultApprovedPoolState());
}

export async function writeOpenClawApprovedPoolState(nextState) {
  await writeJsonFile(LOCAL_PATHS.approvedPoolFile, nextState);
  await writeSharedJson(stateSharedKey("approved-pool"), nextState);
  return LOCAL_PATHS.approvedPoolFile;
}

export async function readOpenClawApprovedPoolHistory() {
  const shared = await readSharedJson(stateSharedKey("approved-pool-history"), null);
  if (shared) {
    return shared;
  }
  return readJsonFile(LOCAL_PATHS.approvedPoolHistoryFile, defaultApprovedPoolHistoryState());
}

export async function writeOpenClawApprovedPoolHistory(nextState) {
  await writeJsonFile(LOCAL_PATHS.approvedPoolHistoryFile, nextState);
  await writeSharedJson(stateSharedKey("approved-pool-history"), nextState);
  return LOCAL_PATHS.approvedPoolHistoryFile;
}

export async function readOpenClawCandidatePoolState() {
  const shared = await readSharedJson(stateSharedKey("candidate-pool"), null);
  if (shared) {
    return shared;
  }
  return readJsonFile(LOCAL_PATHS.candidatePoolFile, defaultCandidatePoolState());
}

export async function writeOpenClawCandidatePoolState(nextState) {
  await writeJsonFile(LOCAL_PATHS.candidatePoolFile, nextState);
  await writeSharedJson(stateSharedKey("candidate-pool"), nextState);
  return LOCAL_PATHS.candidatePoolFile;
}

export async function readOpenClawCandidatePoolHistory() {
  const shared = await readSharedJson(stateSharedKey("candidate-pool-history"), null);
  if (shared) {
    return shared;
  }
  return readJsonFile(LOCAL_PATHS.candidatePoolHistoryFile, defaultCandidatePoolHistoryState());
}

export async function writeOpenClawCandidatePoolHistory(nextState) {
  await writeJsonFile(LOCAL_PATHS.candidatePoolHistoryFile, nextState);
  await writeSharedJson(stateSharedKey("candidate-pool-history"), nextState);
  return LOCAL_PATHS.candidatePoolHistoryFile;
}

export async function appendOpenClawCandidatePoolHistoryEvent(event) {
  const history = await readOpenClawCandidatePoolHistory();
  const next = {
    events: [event, ...(Array.isArray(history?.events) ? history.events : [])].slice(0, 400),
  };
  await writeOpenClawCandidatePoolHistory(next);
  return event;
}

export async function readOpenClawScreenedCandidatePoolState() {
  const shared = await readSharedJson(stateSharedKey("screened-candidate-pool"), null);
  if (shared) {
    return shared;
  }
  return readJsonFile(LOCAL_PATHS.screenedCandidatePoolFile, defaultScreenedCandidatePoolState());
}

export async function writeOpenClawScreenedCandidatePoolState(nextState) {
  await writeJsonFile(LOCAL_PATHS.screenedCandidatePoolFile, nextState);
  await writeSharedJson(stateSharedKey("screened-candidate-pool"), nextState);
  return LOCAL_PATHS.screenedCandidatePoolFile;
}

export async function readOpenClawScreenedCandidatePoolHistory() {
  const shared = await readSharedJson(stateSharedKey("screened-candidate-pool-history"), null);
  if (shared) {
    return shared;
  }
  return readJsonFile(LOCAL_PATHS.screenedCandidatePoolHistoryFile, defaultScreenedCandidatePoolHistoryState());
}

export async function writeOpenClawScreenedCandidatePoolHistory(nextState) {
  await writeJsonFile(LOCAL_PATHS.screenedCandidatePoolHistoryFile, nextState);
  await writeSharedJson(stateSharedKey("screened-candidate-pool-history"), nextState);
  return LOCAL_PATHS.screenedCandidatePoolHistoryFile;
}

export async function appendOpenClawScreenedCandidatePoolHistoryEvent(event) {
  const history = await readOpenClawScreenedCandidatePoolHistory();
  const next = {
    events: [event, ...(Array.isArray(history?.events) ? history.events : [])].slice(0, 400),
  };
  await writeOpenClawScreenedCandidatePoolHistory(next);
  return event;
}

export async function appendOpenClawApprovedPoolHistoryEvent(event) {
  const history = await readOpenClawApprovedPoolHistory();
  const next = {
    events: [event, ...(Array.isArray(history?.events) ? history.events : [])].slice(0, 400),
  };
  await writeOpenClawApprovedPoolHistory(next);
  return event;
}

export async function appendOpenClawStagingHistoryEvent(event) {
  const history = await readOpenClawStagingHistory();
  const next = {
    events: [event, ...(Array.isArray(history?.events) ? history.events : [])].slice(0, 400),
  };
  await writeOpenClawStagingHistory(next);
  return event;
}

function approvedStagingKeyFromInput(input) {
  return `${input.artifactKey}:${input.scope === "item" ? input.itemId : "batch"}`;
}

function stagingScopeFromInput(input) {
  return input.itemId ? "item" : "batch";
}

function poolScopeFromInput(input) {
  return input.itemId ? "item" : "batch";
}

function buildStagingRecord(input, sourceMeta = {}, currentStatus = "staged") {
  const now = new Date().toISOString();
  const scope = stagingScopeFromInput(input);
  const stagingKey = approvedStagingKeyFromInput({ ...input, scope });
  const reviewStatus = input.itemId ? (input.itemStatus || input.status || "pending") : (input.status || "pending");
  const reviewNote = input.itemId ? (input.itemNote || "") : (input.notes || "");
  return {
    stagingKey,
    artifactKey: input.artifactKey,
    artifactFamily: input.artifactFamily,
    scope,
    itemId: input.itemId || null,
    status: "staged",
    sourceReviewStatus: reviewStatus,
    reviewNote,
    itemNote: input.itemNote || "",
    preferredItemId: input.preferredItemId ?? null,
    sourceArtifactCreatedAt: sourceMeta.sourceArtifactCreatedAt || null,
    sourceArtifactFilePath: sourceMeta.sourceArtifactFilePath || null,
    stagedAt: sourceMeta.stagedAt || now,
    updatedAt: now,
    removedAt: currentStatus === "removed" ? now : null,
    lastAction: sourceMeta.action || sourceMeta.operatorAction || "stage",
    operatorAction: sourceMeta.operatorAction || "approve",
    operatorTag: sourceMeta.operatorTag || null,
  };
}

function buildStagingHistoryEvent(input, previousRecord, nextRecord, action, sourceMeta = {}) {
  const now = new Date().toISOString();
  return {
    eventId: `${approvedStagingKeyFromInput({ ...input, scope: stagingScopeFromInput(input) })}:${now}:${action}`,
    artifactKey: input.artifactKey,
    artifactFamily: input.artifactFamily,
    scope: stagingScopeFromInput(input),
    itemId: input.itemId || null,
    action,
    previousState: previousRecord?.status || null,
    nextState: nextRecord?.status || null,
    reviewStatus: input.itemId ? (input.itemStatus || input.status || "pending") : (input.status || "pending"),
    reviewNote: input.itemId ? (input.itemNote || "") : (input.notes || ""),
    preferredItemId: input.preferredItemId ?? null,
    sourceArtifactCreatedAt: sourceMeta.sourceArtifactCreatedAt || previousRecord?.sourceArtifactCreatedAt || null,
    sourceArtifactFilePath: sourceMeta.sourceArtifactFilePath || previousRecord?.sourceArtifactFilePath || null,
    timestamp: now,
    operatorAction: sourceMeta.operatorAction || null,
    operatorTag: sourceMeta.operatorTag || null,
  };
}

async function writeStagingTransition(input, nextStatus, action, sourceMeta = {}) {
  const state = await readOpenClawApprovedStagingState();
  const recordKey = approvedStagingKeyFromInput({ ...input, scope: stagingScopeFromInput(input) });
  const previousRecord = state.records[recordKey] || null;
  const record = buildStagingRecord(input, sourceMeta, nextStatus);
  state.records[record.stagingKey] = {
    ...(previousRecord || {}),
    ...record,
    status: nextStatus,
    removedAt: nextStatus === "removed" ? new Date().toISOString() : null,
    restoredAt: action === "restored" ? new Date().toISOString() : previousRecord?.restoredAt || null,
    restagedAt: action === "re_staged" ? new Date().toISOString() : previousRecord?.restagedAt || null,
    updatedAt: new Date().toISOString(),
    lastAction: action,
  };
  await writeOpenClawApprovedStagingState(state);
  await appendOpenClawStagingHistoryEvent(buildStagingHistoryEvent(input, previousRecord, state.records[record.stagingKey], action, sourceMeta));
  return state.records[record.stagingKey];
}

export async function upsertOpenClawApprovedStagingRecord(input, sourceMeta = {}) {
  const state = await readOpenClawApprovedStagingState();
  const recordKey = approvedStagingKeyFromInput({ ...input, scope: stagingScopeFromInput(input) });
  const previousRecord = state.records[recordKey] || null;
  const action = previousRecord?.status === "removed" ? "re_staged" : "staged";
  return writeStagingTransition(input, "staged", action, sourceMeta);
}

export async function removeOpenClawApprovedStagingRecord(input) {
  return writeStagingTransition(input, "removed", "removed", { operatorAction: "remove" });
}

export async function restoreOpenClawApprovedStagingRecord(input) {
  return writeStagingTransition(input, "staged", "restored", { operatorAction: "restore" });
}

export async function restageOpenClawApprovedStagingRecord(input) {
  return writeStagingTransition(input, "staged", "re_staged", { operatorAction: "re-stage" });
}

export async function listOpenClawApprovedStagingRecords() {
  const state = await readOpenClawApprovedStagingState();
  return Object.values(state.records || {}).sort((a, b) => (b.updatedAt || b.stagedAt || "").localeCompare(a.updatedAt || a.stagedAt || ""));
}

export async function listOpenClawStagingHistoryRecords() {
  const state = await readOpenClawStagingHistory();
  return [...(state.events || [])].sort((a, b) => String(b.timestamp || "").localeCompare(String(a.timestamp || "")));
}

function approvedPoolKeyFromInput(input) {
  return `${input.artifactKey}:${input.scope === "item" ? input.itemId : "batch"}`;
}

function normalizePoolMemberships(inputPools) {
  const pools = Array.isArray(inputPools) ? inputPools : String(inputPools || "").split(",");
  return [...new Set(pools.map((pool) => String(pool).trim()).filter(Boolean))];
}

function buildApprovedPoolRecord(input, sourceMeta = {}, currentStatus = "active") {
  const now = new Date().toISOString();
  const scope = poolScopeFromInput(input);
  const poolKey = approvedPoolKeyFromInput({ ...input, scope });
  const reviewStatus = input.itemId ? (input.itemStatus || input.status || "pending") : (input.status || "pending");
  const reviewNote = input.itemId ? (input.itemNote || "") : (input.notes || "");
  const nextPools = normalizePoolMemberships(input.pools || input.poolNames || []);
  return {
    poolKey,
    artifactKey: input.artifactKey,
    artifactFamily: input.artifactFamily,
    scope,
    itemId: input.itemId || null,
    status: currentStatus,
    pools: nextPools,
    sourceStagingKey: sourceMeta.sourceStagingKey || null,
    sourceStagingStatus: sourceMeta.sourceStagingStatus || null,
    sourceReviewStatus: sourceMeta.sourceReviewStatus || reviewStatus,
    sourceReviewNote: sourceMeta.sourceReviewNote || reviewNote,
    sourceArtifactCreatedAt: sourceMeta.sourceArtifactCreatedAt || null,
    sourceArtifactFilePath: sourceMeta.sourceArtifactFilePath || null,
    poolAddedAt: sourceMeta.poolAddedAt || now,
    poolUpdatedAt: now,
    updatedAt: now,
    createdAt: sourceMeta.createdAt || now,
    cooldownUntil: sourceMeta.cooldownUntil || null,
    retirementReason: sourceMeta.retirementReason || null,
    notes: sourceMeta.notes || "",
    operatorNote: sourceMeta.operatorNote || "",
    operatorAction: sourceMeta.operatorAction || "assign",
    operatorTag: sourceMeta.operatorTag || null,
    exposureHistory: sourceMeta.exposureHistory || {
      firstTimeCount: 0,
      returningCount: 0,
      lastShadowReportAt: null,
      lastShadowSegment: null,
    },
    shadowFlags: sourceMeta.shadowFlags || {
      firstTimeEligible: nextPools.includes("approved_first_time_pool") || nextPools.includes("general_pool") || nextPools.includes("high_distinction_pool") || nextPools.includes("light_engagement_pool"),
      returningEligible: nextPools.includes("approved_returning_pool") || nextPools.includes("general_pool") || nextPools.includes("high_distinction_pool") || nextPools.includes("deep_cut_pool"),
    },
    lastAction: sourceMeta.action || sourceMeta.operatorAction || "assign",
  };
}

function buildApprovedPoolHistoryEvent(input, previousRecord, nextRecord, action, sourceMeta = {}) {
  const now = new Date().toISOString();
  return {
    eventId: `${approvedPoolKeyFromInput({ ...input, scope: poolScopeFromInput(input) })}:${now}:${action}`,
    poolKey: approvedPoolKeyFromInput({ ...input, scope: poolScopeFromInput(input) }),
    artifactKey: input.artifactKey,
    artifactFamily: input.artifactFamily,
    scope: poolScopeFromInput(input),
    itemId: input.itemId || null,
    action,
    previousState: previousRecord?.status || null,
    nextState: nextRecord?.status || null,
    pools: nextRecord?.pools || normalizePoolMemberships(input.pools || input.poolNames || []),
    reviewStatus: input.itemId ? (input.itemStatus || input.status || "pending") : (input.status || "pending"),
    reviewNote: input.itemId ? (input.itemNote || "") : (input.notes || ""),
    sourceArtifactCreatedAt: sourceMeta.sourceArtifactCreatedAt || previousRecord?.sourceArtifactCreatedAt || null,
    sourceArtifactFilePath: sourceMeta.sourceArtifactFilePath || previousRecord?.sourceArtifactFilePath || null,
    sourceStagingKey: sourceMeta.sourceStagingKey || previousRecord?.sourceStagingKey || null,
    sourceStagingStatus: sourceMeta.sourceStagingStatus || previousRecord?.sourceStagingStatus || null,
    timestamp: now,
    operatorAction: sourceMeta.operatorAction || null,
    operatorTag: sourceMeta.operatorTag || null,
    operatorNote: sourceMeta.operatorNote || sourceMeta.notes || null,
    retirementReason: sourceMeta.retirementReason || previousRecord?.retirementReason || null,
    cooldownUntil: sourceMeta.cooldownUntil || previousRecord?.cooldownUntil || null,
  };
}

async function writeApprovedPoolTransition(input, nextStatus, action, sourceMeta = {}, patch = {}) {
  const state = await readOpenClawApprovedPoolState();
  const recordKey = approvedPoolKeyFromInput({ ...input, scope: poolScopeFromInput(input) });
  const previousRecord = state.records[recordKey] || null;
  const mergedSourceMeta = {
    ...sourceMeta,
    sourceReviewStatus:
      sourceMeta.sourceReviewStatus ||
      previousRecord?.sourceReviewStatus ||
      (input.itemId ? input.itemStatus || input.status || "pending" : input.status || "pending"),
    sourceReviewNote: sourceMeta.sourceReviewNote || previousRecord?.sourceReviewNote || (input.itemId ? input.itemNote || "" : input.notes || ""),
    sourceStagingKey: sourceMeta.sourceStagingKey || previousRecord?.sourceStagingKey || null,
    sourceStagingStatus: sourceMeta.sourceStagingStatus || previousRecord?.sourceStagingStatus || null,
    sourceArtifactCreatedAt: sourceMeta.sourceArtifactCreatedAt || previousRecord?.sourceArtifactCreatedAt || null,
    sourceArtifactFilePath: sourceMeta.sourceArtifactFilePath || previousRecord?.sourceArtifactFilePath || null,
  };
  const record = buildApprovedPoolRecord(
    {
      ...input,
      pools: patch.pools || input.pools || previousRecord?.pools || [],
      notes: patch.notes ?? input.notes ?? previousRecord?.notes ?? "",
      status: nextStatus,
      itemStatus: input.itemStatus || previousRecord?.sourceReviewStatus || "pending",
      itemNote: input.itemNote || previousRecord?.sourceReviewNote || "",
      operatorNote: patch.operatorNote || input.operatorNote || "",
    },
    { ...mergedSourceMeta, ...patch, operatorAction: patch.operatorAction || sourceMeta.operatorAction || action },
    nextStatus,
  );

  state.records[record.poolKey] = {
    ...(previousRecord || {}),
    ...record,
    status: nextStatus,
    pools: record.pools,
    updatedAt: new Date().toISOString(),
    poolUpdatedAt: new Date().toISOString(),
    lastAction: action,
    cooldownUntil: nextStatus === "cooling_down" ? (patch.cooldownUntil || sourceMeta.cooldownUntil || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()) : null,
    retirementReason: nextStatus === "retired" ? (patch.retirementReason || sourceMeta.retirementReason || "") : previousRecord?.retirementReason || null,
    operatorNote: patch.operatorNote || sourceMeta.operatorNote || previousRecord?.operatorNote || "",
    exposureHistory: previousRecord?.exposureHistory || record.exposureHistory,
  };
  await writeOpenClawApprovedPoolState(state);
  await appendOpenClawApprovedPoolHistoryEvent(buildApprovedPoolHistoryEvent(input, previousRecord, state.records[record.poolKey], action, sourceMeta));
  return state.records[record.poolKey];
}

export async function listOpenClawApprovedPoolRecords() {
  const state = await readOpenClawApprovedPoolState();
  return Object.values(state.records || {}).sort((a, b) => (b.updatedAt || b.poolUpdatedAt || "").localeCompare(a.updatedAt || a.poolUpdatedAt || ""));
}

export async function listOpenClawApprovedPoolHistoryRecords() {
  const state = await readOpenClawApprovedPoolHistory();
  return [...(state.events || [])].sort((a, b) => String(b.timestamp || "").localeCompare(String(a.timestamp || "")));
}

function candidatePoolKeyFromInput(input) {
  return input.candidateKey || input.candidateId || `${input.dimensionFamily || "unknown"}:${input.scenarioFamily || "unknown"}:${input.toneTarget || "unknown"}`;
}

function buildCandidatePoolRecord(input, sourceMeta = {}, currentStatus = "generated") {
  const now = new Date().toISOString();
  return {
    candidateKey: candidatePoolKeyFromInput(input),
    candidateId: input.candidateId || candidatePoolKeyFromInput(input),
    dimensionFamily: input.dimensionFamily || null,
    scenarioFamily: input.scenarioFamily || null,
    optionFamily: input.optionFamily || null,
    toneTarget: input.toneTarget || null,
    question: input.question || null,
    options: Array.isArray(input.options) ? input.options : [],
    metadata: input.metadata || {},
    firstPassScores: input.firstPassScores || {},
    duplicateRisks: input.duplicateRisks || [],
    status: currentStatus,
    screeningStatus: sourceMeta.screeningStatus || input.screeningStatus || null,
    screeningReason: sourceMeta.screeningReason || input.screeningReason || null,
    calibrationQueueRecommendation: sourceMeta.calibrationQueueRecommendation ?? input.calibrationQueueRecommendation ?? null,
    sourceArtifactKey: sourceMeta.sourceArtifactKey || null,
    sourceArtifactPath: sourceMeta.sourceArtifactPath || null,
    generatedAt: sourceMeta.generatedAt || now,
    updatedAt: now,
    operatorAction: sourceMeta.operatorAction || "generate",
    operatorTag: sourceMeta.operatorTag || null,
  };
}

function buildCandidatePoolHistoryEvent(input, previousRecord, nextRecord, action, sourceMeta = {}) {
  const now = new Date().toISOString();
  return {
    eventId: `${candidatePoolKeyFromInput(input)}:${now}:${action}`,
    candidateKey: candidatePoolKeyFromInput(input),
    candidateId: input.candidateId || candidatePoolKeyFromInput(input),
    action,
    previousState: previousRecord?.status || null,
    nextState: nextRecord?.status || null,
    screeningStatus: sourceMeta.screeningStatus || input.screeningStatus || null,
    screeningReason: sourceMeta.screeningReason || input.screeningReason || null,
    calibrationQueueRecommendation: sourceMeta.calibrationQueueRecommendation ?? input.calibrationQueueRecommendation ?? null,
    sourceArtifactKey: sourceMeta.sourceArtifactKey || null,
    sourceArtifactPath: sourceMeta.sourceArtifactPath || null,
    timestamp: now,
    operatorAction: sourceMeta.operatorAction || null,
    operatorTag: sourceMeta.operatorTag || null,
  };
}

async function writeCandidatePoolTransition(input, nextStatus, action, sourceMeta = {}, patch = {}) {
  const state = await readOpenClawCandidatePoolState();
  const recordKey = candidatePoolKeyFromInput(input);
  const previousRecord = state.records[recordKey] || null;
  const record = buildCandidatePoolRecord(
    {
      ...input,
      ...patch,
      status: nextStatus,
    },
    { ...sourceMeta, operatorAction: patch.operatorAction || sourceMeta.operatorAction || action },
    nextStatus,
  );
  state.records[record.candidateKey] = {
    ...(previousRecord || {}),
    ...record,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
    lastAction: action,
  };
  await writeOpenClawCandidatePoolState(state);
  await appendOpenClawCandidatePoolHistoryEvent(buildCandidatePoolHistoryEvent(input, previousRecord, state.records[record.candidateKey], action, sourceMeta));
  return state.records[record.candidateKey];
}

export async function upsertOpenClawCandidatePoolRecord(input, sourceMeta = {}) {
  const state = await readOpenClawCandidatePoolState();
  const recordKey = candidatePoolKeyFromInput(input);
  const previousRecord = state.records[recordKey] || null;
  const nextStatus = input.status || previousRecord?.status || "generated";
  return writeCandidatePoolTransition(input, nextStatus, previousRecord ? "update" : "generate", sourceMeta);
}

export async function listOpenClawCandidatePoolRecords() {
  const state = await readOpenClawCandidatePoolState();
  return Object.values(state.records || {}).sort((a, b) => (b.updatedAt || b.generatedAt || "").localeCompare(a.updatedAt || a.generatedAt || ""));
}

export async function listOpenClawCandidatePoolHistoryRecords() {
  const state = await readOpenClawCandidatePoolHistory();
  return [...(state.events || [])].sort((a, b) => String(b.timestamp || "").localeCompare(String(a.timestamp || "")));
}

function screenedCandidatePoolKeyFromInput(input) {
  return input.screenedCandidateKey || input.candidateKey || input.candidateId || `${input.dimensionFamily || "unknown"}:${input.scenarioFamily || "unknown"}:${input.toneTarget || "unknown"}`;
}

function buildScreenedCandidatePoolRecord(input, sourceMeta = {}, currentStatus = "screened") {
  const now = new Date().toISOString();
  return {
    screenedCandidateKey: screenedCandidatePoolKeyFromInput(input),
    candidateKey: input.candidateKey || candidatePoolKeyFromInput(input),
    candidateId: input.candidateId || candidatePoolKeyFromInput(input),
    dimensionFamily: input.dimensionFamily || null,
    scenarioFamily: input.scenarioFamily || null,
    optionFamily: input.optionFamily || null,
    toneTarget: input.toneTarget || null,
    question: input.question || null,
    options: Array.isArray(input.options) ? input.options : [],
    metadata: input.metadata || {},
    firstPassScores: input.firstPassScores || {},
    duplicateRisks: input.duplicateRisks || [],
    status: currentStatus,
    screeningDecision: sourceMeta.screeningDecision || input.screeningDecision || null,
    screeningReason: sourceMeta.screeningReason || input.screeningReason || null,
    calibrationQueueRecommendation: sourceMeta.calibrationQueueRecommendation ?? input.calibrationQueueRecommendation ?? null,
    calibrationQueueTarget: sourceMeta.calibrationQueueTarget || input.calibrationQueueTarget || null,
    sourceArtifactKey: sourceMeta.sourceArtifactKey || null,
    sourceArtifactPath: sourceMeta.sourceArtifactPath || null,
    generatedAt: sourceMeta.generatedAt || now,
    updatedAt: now,
    operatorAction: sourceMeta.operatorAction || "screen",
    operatorTag: sourceMeta.operatorTag || null,
  };
}

function buildScreenedCandidatePoolHistoryEvent(input, previousRecord, nextRecord, action, sourceMeta = {}) {
  const now = new Date().toISOString();
  return {
    eventId: `${screenedCandidatePoolKeyFromInput(input)}:${now}:${action}`,
    screenedCandidateKey: screenedCandidatePoolKeyFromInput(input),
    candidateKey: input.candidateKey || candidatePoolKeyFromInput(input),
    candidateId: input.candidateId || candidatePoolKeyFromInput(input),
    action,
    previousState: previousRecord?.status || null,
    nextState: nextRecord?.status || null,
    screeningDecision: sourceMeta.screeningDecision || input.screeningDecision || null,
    screeningReason: sourceMeta.screeningReason || input.screeningReason || null,
    calibrationQueueRecommendation: sourceMeta.calibrationQueueRecommendation ?? input.calibrationQueueRecommendation ?? null,
    calibrationQueueTarget: sourceMeta.calibrationQueueTarget || input.calibrationQueueTarget || null,
    sourceArtifactKey: sourceMeta.sourceArtifactKey || null,
    sourceArtifactPath: sourceMeta.sourceArtifactPath || null,
    timestamp: now,
    operatorAction: sourceMeta.operatorAction || null,
    operatorTag: sourceMeta.operatorTag || null,
  };
}

async function writeScreenedCandidatePoolTransition(input, nextStatus, action, sourceMeta = {}, patch = {}) {
  const state = await readOpenClawScreenedCandidatePoolState();
  const recordKey = screenedCandidatePoolKeyFromInput(input);
  const previousRecord = state.records[recordKey] || null;
  const record = buildScreenedCandidatePoolRecord(
    {
      ...input,
      ...patch,
      status: nextStatus,
    },
    { ...sourceMeta, operatorAction: patch.operatorAction || sourceMeta.operatorAction || action },
    nextStatus,
  );
  state.records[record.screenedCandidateKey] = {
    ...(previousRecord || {}),
    ...record,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
    lastAction: action,
  };
  await writeOpenClawScreenedCandidatePoolState(state);
  await appendOpenClawScreenedCandidatePoolHistoryEvent(
    buildScreenedCandidatePoolHistoryEvent(input, previousRecord, state.records[record.screenedCandidateKey], action, sourceMeta),
  );
  return state.records[record.screenedCandidateKey];
}

export async function upsertOpenClawScreenedCandidatePoolRecord(input, sourceMeta = {}) {
  const state = await readOpenClawScreenedCandidatePoolState();
  const recordKey = screenedCandidatePoolKeyFromInput(input);
  const previousRecord = state.records[recordKey] || null;
  const nextStatus = input.status || previousRecord?.status || "screened";
  return writeScreenedCandidatePoolTransition(input, nextStatus, previousRecord ? "update" : "screen", sourceMeta);
}

export async function listOpenClawScreenedCandidatePoolRecords() {
  const state = await readOpenClawScreenedCandidatePoolState();
  return Object.values(state.records || {}).sort((a, b) => (b.updatedAt || b.generatedAt || "").localeCompare(a.updatedAt || a.generatedAt || ""));
}

export async function listOpenClawScreenedCandidatePoolHistoryRecords() {
  const state = await readOpenClawScreenedCandidatePoolHistory();
  return [...(state.events || [])].sort((a, b) => String(b.timestamp || "").localeCompare(String(a.timestamp || "")));
}

export async function upsertOpenClawApprovedPoolRecord(input, sourceMeta = {}) {
  const state = await readOpenClawApprovedPoolState();
  const recordKey = approvedPoolKeyFromInput({ ...input, scope: poolScopeFromInput(input) });
  const previousRecord = state.records[recordKey] || null;
  const nextStatus = input.status || previousRecord?.status || "active";
  return writeApprovedPoolTransition(input, nextStatus, previousRecord ? "update" : "assign", sourceMeta);
}

export async function setOpenClawApprovedPoolCooldown(input, sourceMeta = {}) {
  return writeApprovedPoolTransition(input, "cooling_down", "cooldown", sourceMeta);
}

export async function setOpenClawApprovedPoolRetired(input, sourceMeta = {}) {
  return writeApprovedPoolTransition(input, "retired", "retire", sourceMeta);
}

export async function restoreOpenClawApprovedPoolRecord(input, sourceMeta = {}) {
  return writeApprovedPoolTransition(input, "active", "restore", sourceMeta);
}

function getPoolWeight(poolName, segment) {
  if (segment === "first-time") {
    if (poolName === "approved_first_time_pool") return 40;
    if (poolName === "general_pool") return 28;
    if (poolName === "high_distinction_pool") return 24;
    if (poolName === "light_engagement_pool") return 20;
    if (poolName === "deep_cut_pool") return 6;
  }
  if (segment === "returning") {
    if (poolName === "approved_returning_pool") return 40;
    if (poolName === "general_pool") return 26;
    if (poolName === "high_distinction_pool") return 24;
    if (poolName === "deep_cut_pool") return 22;
    if (poolName === "light_engagement_pool") return 10;
  }
  return 0;
}

function scoreApprovedPoolRecord(record, segment) {
  const poolScore = (record.pools || []).reduce((sum, poolName) => sum + getPoolWeight(poolName, segment), 0);
  const exposureCount = (record.exposureHistory?.firstTimeCount || 0) + (record.exposureHistory?.returningCount || 0);
  const freshnessScore = record.poolUpdatedAt ? Math.max(0, 30 - Math.floor((Date.now() - new Date(record.poolUpdatedAt).getTime()) / (1000 * 60 * 60 * 24))) : 10;
  const statusPenalty = record.status === "cooling_down" ? 40 : record.status === "retired" ? 100 : 0;
  return poolScore + freshnessScore - exposureCount * 3 - statusPenalty;
}

function explainPoolEligibility(record, segment) {
  const pools = record.pools || [];
  const allowedPools =
    segment === "first-time"
      ? ["approved_first_time_pool", "general_pool", "high_distinction_pool", "light_engagement_pool"]
      : ["approved_returning_pool", "general_pool", "high_distinction_pool", "deep_cut_pool"];
  const matched = pools.filter((pool) => allowedPools.includes(pool));
  if (!matched.length) {
    return `Not in ${segment} pools`;
  }
  return matched.join(", ");
}

function buildShadowRotation(records) {
  const activeRecords = records.filter((record) => record.status === "active");
  const coolingRecords = records.filter((record) => record.status === "cooling_down");
  const retiredRecords = records.filter((record) => record.status === "retired");
  const firstTimeCandidates = activeRecords
    .filter((record) => (record.pools || []).some((pool) => ["approved_first_time_pool", "general_pool", "high_distinction_pool", "light_engagement_pool"].includes(pool)))
    .sort((a, b) => scoreApprovedPoolRecord(b, "first-time") - scoreApprovedPoolRecord(a, "first-time"));
  const returningCandidates = activeRecords
    .filter((record) => (record.pools || []).some((pool) => ["approved_returning_pool", "general_pool", "high_distinction_pool", "deep_cut_pool"].includes(pool)))
    .sort((a, b) => scoreApprovedPoolRecord(b, "returning") - scoreApprovedPoolRecord(a, "returning"));
  const sharedPoolRecords = activeRecords.filter((record) => (record.pools || []).length > 1);
  const overused = sharedPoolRecords.slice(0, 8).map((record) => ({
    poolKey: record.poolKey,
    artifactKey: record.artifactKey,
    artifactFamily: record.artifactFamily,
    reason: "shared across multiple pools",
    pools: record.pools,
  }));
  const underused = activeRecords
    .filter((record) => !record.pools || record.pools.length === 0 || (record.pools || []).every((pool) => pool === "general_pool"))
    .slice(0, 8)
    .map((record) => ({
      poolKey: record.poolKey,
      artifactKey: record.artifactKey,
      artifactFamily: record.artifactFamily,
      reason: explainPoolEligibility(record, "first-time"),
      pools: record.pools,
    }));

  return {
    firstTime: {
      recommendationCount: Math.min(6, firstTimeCandidates.length),
      recommended: firstTimeCandidates.slice(0, 6),
      excludedCount: activeRecords.length - firstTimeCandidates.length,
    },
    returning: {
      recommendationCount: Math.min(6, returningCandidates.length),
      recommended: returningCandidates.slice(0, 6),
      excludedCount: activeRecords.length - returningCandidates.length,
    },
    excluded: {
      coolingCount: coolingRecords.length,
      retiredCount: retiredRecords.length,
      coolingRecords: coolingRecords.slice(0, 8),
      retiredRecords: retiredRecords.slice(0, 8),
    },
    balance: {
      overused,
      underused,
    },
  };
}

function computeApprovedPoolSummary(poolState, poolHistory) {
  const records = Object.values(poolState?.records || {});
  const activeRecords = records.filter((record) => record.status === "active");
  const coolingRecords = records.filter((record) => record.status === "cooling_down");
  const retiredRecords = records.filter((record) => record.status === "retired");
  const poolCounts = records.reduce((acc, record) => {
    for (const poolName of record.pools || []) {
      acc[poolName] = (acc[poolName] || 0) + 1;
    }
    return acc;
  }, {});
  const familyCounts = records.reduce((acc, record) => {
    acc[record.artifactFamily] = (acc[record.artifactFamily] || 0) + 1;
    return acc;
  }, {});
  const latestAdded = latestByPredicate(poolHistory?.events || [], (event) => event.action === "assign" || event.action === "update");
  const latestCooldown = latestByPredicate(poolHistory?.events || [], (event) => event.action === "cooldown");
  const latestRetired = latestByPredicate(poolHistory?.events || [], (event) => event.action === "retire");
  const latestRestored = latestByPredicate(poolHistory?.events || [], (event) => event.action === "restore");
  const shadowRotation = buildShadowRotation(records);

  return {
    batchCount: activeRecords.length,
    recordCount: records.length,
    activeCount: activeRecords.length,
    coolingCount: coolingRecords.length,
    retiredCount: retiredRecords.length,
    poolCounts,
    familyCounts,
    latestAdded,
    latestCooldown,
    latestRetired,
    latestRestored,
    shadowRotation,
    latestEvents: (poolHistory?.events || []).slice(0, 16),
  };
}

function computeCandidatePoolSummary(candidateState, candidateHistory) {
  const records = Object.values(candidateState?.records || {});
  const screenedRecords = records.filter((record) => record.status === "screened" || record.status === "queued_for_calibration" || record.status === "calibration_recommended" || record.status === "screened_out");
  const duplicateRecords = records.filter((record) => Number(record.firstPassScores?.duplicateRisk || 0) >= 3);
  const queuedRecords = screenedRecords.filter((record) => record.calibrationQueueRecommendation !== false);
  const familyCounts = records.reduce((acc, record) => {
    acc[record.dimensionFamily || "unknown"] = (acc[record.dimensionFamily || "unknown"] || 0) + 1;
    return acc;
  }, {});
  const latestGenerated = latestByPredicate(candidateHistory?.events || [], (event) => event.action === "generate" || event.action === "update");
  const latestScreened = latestByPredicate(candidateHistory?.events || [], (event) => event.action === "screen" || event.action === "queue" || event.action === "update");
  const latestDuplicate = latestByPredicate(candidateHistory?.events || [], (event) => Number(event?.screeningDecision?.duplicateRisk || 0) >= 3 || event.screeningReason === "duplicate_or_near_duplicate");

  return {
    batchCount: records.length,
    recordCount: records.length,
    generatedCount: records.length,
    screenedCount: screenedRecords.length,
    queuedForCalibrationCount: queuedRecords.length,
    duplicateCount: duplicateRecords.length,
    familyCounts,
    latestGenerated,
    latestScreened,
    latestDuplicate,
    latestEvents: (candidateHistory?.events || []).slice(0, 16),
  };
}

function computeScreenedCandidatePoolSummary(screenedState, screenedHistory) {
  const records = Object.values(screenedState?.records || {});
  const activeRecords = records.filter((record) => record.status === "screened" || record.status === "queued_for_calibration" || record.status === "calibration_recommended");
  const queuedForCalibration = activeRecords.filter((record) => record.status === "queued_for_calibration" || record.status === "calibration_recommended");
  const familyCounts = records.reduce((acc, record) => {
    acc[record.dimensionFamily || "unknown"] = (acc[record.dimensionFamily || "unknown"] || 0) + 1;
    return acc;
  }, {});
  const latestScreened = latestByPredicate(screenedHistory?.events || [], (event) => event.action === "screen" || event.action === "queue" || event.action === "update");
  const latestQueued = latestByPredicate(
    screenedHistory?.events || [],
    (event) => event.action === "screen" || event.action === "queue" || event.action === "calibration_queue",
  );
  const latestCooldown = latestByPredicate(screenedHistory?.events || [], (event) => event.action === "cooldown_recommendation");
  const latestRetired = latestByPredicate(screenedHistory?.events || [], (event) => event.action === "retire_recommendation");

  return {
    batchCount: activeRecords.length,
    recordCount: records.length,
    queuedForCalibrationCount: queuedForCalibration.length,
    familyCounts,
    latestScreened,
    latestQueued,
    latestCooldown,
    latestRetired,
    latestEvents: (screenedHistory?.events || []).slice(0, 16),
  };
}

function computeOperatingLoopSummary(artifacts) {
  const loopArtifacts = artifacts.filter((artifact) => artifact.artifactFamily === "operating-loop");
  const latestArtifact = [...loopArtifacts].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))[0] || null;
  const latestData = latestArtifact?.data || null;
  const gates = Array.isArray(latestData?.gateVerdicts) ? latestData.gateVerdicts : [];
  const publishDecisions = Array.isArray(latestData?.publishDecisions) ? latestData.publishDecisions : [];
  const liveSafeOutputs = Array.isArray(latestData?.liveSafeRegistry?.outputs) ? latestData.liveSafeRegistry.outputs : [];
  const frontSafeOutputs = Array.isArray(latestData?.frontSafeRegistry?.outputs) ? latestData.frontSafeRegistry.outputs : [];
  const queueItems = Array.isArray(latestData?.reviewQueue) ? latestData.reviewQueue : [];
  const exceptionQueue = Array.isArray(latestData?.exceptionQueue) ? latestData.exceptionQueue : [];
  const learningRecommendations = Array.isArray(latestData?.learningLoop?.recommendations) ? latestData.learningLoop.recommendations : [];
  const learningSummary = latestData?.learningLoop?.summary || null;
  const allowlistedApprovedFamilyRegistry = Array.isArray(latestData?.allowlistedApprovedFamilyRegistry)
    ? latestData.allowlistedApprovedFamilyRegistry
    : [];

  const gateCounts = gates.reduce(
    (acc, gate) => {
      const verdict = gate?.verdict || "unknown";
      acc[verdict] = (acc[verdict] || 0) + 1;
      return acc;
    },
    { pass: 0, revise: 0, reject: 0, escalate: 0, unknown: 0 },
  );

  const publishCounts = publishDecisions.reduce(
    (acc, decision) => {
      const verdict = decision?.decision || "unknown";
      acc[verdict] = (acc[verdict] || 0) + 1;
      return acc;
    },
    { published: 0, queued: 0, blocked: 0, unknown: 0 },
  );

  return {
    batchCount: loopArtifacts.length,
    recordCount: loopArtifacts.length,
    latestRun: latestArtifact,
    latestLoop: latestData,
    gateCounts,
    publishCounts,
    liveSafeCount: liveSafeOutputs.length,
    frontSafeCount: frontSafeOutputs.length,
    reviewQueueCount: queueItems.length,
    exceptionQueueCount: exceptionQueue.length,
    learningRecommendationCount: learningRecommendations.length,
    learningSummary,
    latestLiveSafe: liveSafeOutputs[0] || null,
    latestFrontSafe: frontSafeOutputs[0] || null,
    latestQueued: queueItems[0] || null,
    latestException: exceptionQueue[0] || null,
    latestRecommendation: learningRecommendations[0] || null,
    allowlistedApprovedFamilyRegistry,
  };
}

function latestByPredicate(entries, predicate) {
  return [...entries]
    .filter(predicate)
    .sort((a, b) =>
      String(b.timestamp || b.updatedAt || b.stagedAt || "").localeCompare(String(a.timestamp || a.updatedAt || a.stagedAt || "")),
    )[0] || null;
}

function computeReviewEventSummary(reviewState) {
  const batches = reviewState?.batches || {};
  const batchEntries = Object.values(batches).map((entry) => ({
    ...entry,
    artifactKey: entry.artifactKey,
    updatedAt: entry.updatedAt,
    artifactFamily: entry.artifactFamily,
  }));

  const itemEntries = Object.values(batches).flatMap((entry) =>
    Object.entries(entry.itemNotes || {}).map(([itemId, item]) => ({
      artifactKey: entry.artifactKey,
      artifactFamily: entry.artifactFamily,
      itemId,
      status: item.status,
      note: item.note,
      updatedAt: item.updatedAt,
      scope: "item",
    })),
  );

  const allEntries = [
    ...batchEntries.map((entry) => ({ ...entry, scope: "batch" })),
    ...itemEntries,
  ];

  const latestRejected = latestByPredicate(allEntries, (entry) => entry.status === "reject" || entry.status === "reject_recommendation");
  const latestNeedsRevision = latestByPredicate(
    allEntries,
    (entry) => entry.status === "needs_revision" || entry.status === "needs_follow_up",
  );
  const latestWarnings = latestByPredicate(
    allEntries,
    (entry) => entry.status === "hold" || entry.status === "review_later" || entry.status === "warning_acknowledged",
  );

  return {
    latestRejected,
    latestNeedsRevision,
    latestWarnings,
  };
}

function computeStagingSummary(stagingState) {
  const records = Object.values(stagingState?.records || {});
  const activeRecords = records.filter((record) => record.status === "staged");
  const familyCounts = activeRecords.reduce((acc, record) => {
    acc[record.artifactFamily] = (acc[record.artifactFamily] || 0) + 1;
    return acc;
  }, {});
  const latestStaged = latestByPredicate(activeRecords, () => true);
  const latestRemoved = latestByPredicate(records, (record) => record.status === "removed");
  return {
    batchCount: activeRecords.length,
    familyCounts,
    latestStaged,
    latestRemoved,
  };
}

function computeStagingHistorySummary(history) {
  const events = Array.isArray(history?.events) ? history.events : [];
  const latestByAction = (action) => latestByPredicate(events, (event) => event.action === action);
  const latestRejected = latestByPredicate(events, (event) => event.reviewStatus === "reject" || event.reviewStatus === "reject_recommendation");
  const latestNeedsRevision = latestByPredicate(events, (event) => event.reviewStatus === "needs_revision" || event.reviewStatus === "needs_follow_up");
  const latestWarnings = latestByPredicate(events, (event) => event.reviewStatus === "hold" || event.reviewStatus === "review_later" || event.reviewStatus === "warning_acknowledged");
  return {
    eventCount: events.length,
    latestStaged: latestByAction("staged"),
    latestRemoved: latestByAction("removed"),
    latestRestored: latestByAction("restored"),
    latestRestaged: latestByAction("re_staged"),
    latestRejected,
    latestNeedsRevision,
    latestWarnings,
  };
}

export async function updateOpenClawReviewRecord(input) {
  const state = await readOpenClawReviewState();
  const existing = state.batches[input.artifactKey] || {
    artifactKey: input.artifactKey,
    artifactFamily: input.artifactFamily,
    status: "pending",
    notes: "",
    updatedAt: new Date().toISOString(),
    itemNotes: {},
    preferredItemId: null,
  };

  const next = {
    ...existing,
    artifactFamily: input.artifactFamily,
    status: input.status,
    notes: input.notes,
    updatedAt: new Date().toISOString(),
    itemNotes: existing.itemNotes || {},
    preferredItemId: input.preferredItemId ?? existing.preferredItemId ?? null,
  };

  if (input.itemId && input.itemStatus) {
    next.itemNotes = {
      ...(next.itemNotes || {}),
      [input.itemId]: {
        status: input.itemStatus,
        note: input.itemNote || "",
        updatedAt: new Date().toISOString(),
      },
    };
  }

  state.batches[input.artifactKey] = next;
  await writeOpenClawReviewState(state);
  return next;
}

export async function readOpenClawQueueIndex() {
  const shared = await readSharedJson(stateSharedKey("queue-index"), null);
  if (shared) {
    return shared;
  }
  return readJsonFile(LOCAL_PATHS.queueIndexFile, { generatedAt: null, batchCount: 0, batches: [] });
}

export async function writeOpenClawQueueIndex(index) {
  await writeJsonFile(LOCAL_PATHS.queueIndexFile, index);
  await writeSharedJson(stateSharedKey("queue-index"), index);
  return LOCAL_PATHS.queueIndexFile;
}

export async function rebuildOpenClawQueueIndex() {
  const batches = await listOpenClawArtifacts();
  const reviewState = await readOpenClawReviewState();
  const index = {
    generatedAt: new Date().toISOString(),
    batchCount: batches.length,
    batches: batches.map((batch) => ({
      artifactKey: batch.artifactKey,
      artifactFamily: batch.artifactFamily,
      createdAt: batch.createdAt,
      filePath: batch.filePath,
      reviewStatus: reviewState.batches[batch.artifactKey]?.status || "pending",
      preferredItemId: reviewState.batches[batch.artifactKey]?.preferredItemId || null,
      itemCount: getItemCount(batch.data),
    })),
  };
  await writeOpenClawQueueIndex(index);
  return index;
}

function getItemCount(data) {
  if (!data || typeof data !== "object") return 0;
  return data.candidates?.length || data.variants?.length || data.recommendations?.length || data.routes?.length || data.summary?.routeCount || 0;
}

export async function readOpenClawRunHistory() {
  const shared = await readSharedJson(stateSharedKey("run-history"), null);
  if (shared) {
    return shared;
  }
  return readJsonFile(LOCAL_PATHS.runHistoryFile, []);
}

export async function appendOpenClawRunHistory(entry) {
  const history = await readOpenClawRunHistory();
  const next = [entry, ...(Array.isArray(history) ? history : [])].slice(0, 200);
  await writeJsonFile(LOCAL_PATHS.runHistoryFile, next);
  await writeSharedJson(stateSharedKey("run-history"), next);
  return LOCAL_PATHS.runHistoryFile;
}

export async function readOpenClawOperatorSummary() {
  const queueIndex = await readOpenClawQueueIndex();
  const reviewState = await readOpenClawReviewState();
  const stagingState = await readOpenClawApprovedStagingState();
  const stagingHistory = await readOpenClawStagingHistory();
  const poolState = await readOpenClawApprovedPoolState();
  const poolHistory = await readOpenClawApprovedPoolHistory();
  const candidateState = await readOpenClawCandidatePoolState();
  const candidateHistory = await readOpenClawCandidatePoolHistory();
  const screenedCandidateState = await readOpenClawScreenedCandidatePoolState();
  const screenedCandidateHistory = await readOpenClawScreenedCandidatePoolHistory();
  const runHistory = await readOpenClawRunHistory();
  const batches = queueIndex.batches || [];
  const reviewedCount = batches.filter((batch) => (reviewState.batches[batch.artifactKey]?.status || "pending") !== "pending").length;
  const pendingCount = batches.length - reviewedCount;
  const lastRun = Array.isArray(runHistory) && runHistory.length > 0 ? runHistory[0] : null;
  const lastSuccessfulRun = Array.isArray(runHistory)
    ? runHistory.find((record) => record?.ok === true || record?.status === "success")
    : null;
  const lastFailedRun = Array.isArray(runHistory)
    ? runHistory.find((record) => record?.ok === false || record?.status === "failed")
    : null;
  const failedRunCount = Array.isArray(runHistory)
    ? runHistory.filter((record) => record?.ok === false || record?.status === "failed").length
    : 0;
  const warningRunCount = Array.isArray(runHistory)
    ? runHistory.filter((record) => record?.status === "warning").length
    : 0;
  const reviewEventSummary = computeReviewEventSummary(reviewState);
  const stagingSummary = computeStagingSummary(stagingState);
  const stagingHistorySummary = computeStagingHistorySummary(stagingHistory);
  const approvedPoolSummary = computeApprovedPoolSummary(poolState, poolHistory);
  const candidatePoolSummary = computeCandidatePoolSummary(candidateState, candidateHistory);
  const screenedCandidatePoolSummary = computeScreenedCandidatePoolSummary(screenedCandidateState, screenedCandidateHistory);
  const allArtifacts = await listOpenClawArtifacts();
  const operatingLoopSummary = computeOperatingLoopSummary(allArtifacts);

  return {
    queue: {
      batchCount: queueIndex.batchCount || batches.length,
      pendingCount,
      reviewedCount,
      pendingArtifactCount: batches.filter((batch) => (reviewState.batches[batch.artifactKey]?.status || "pending") === "pending").length,
      generatedAt: queueIndex.generatedAt || null,
    },
    runs: {
      lastRunAt: lastRun?.runAt || lastRun?.startedAt || null,
      lastRunStatus: lastRun?.status || (lastRun?.ok === false ? "failed" : lastRun ? "success" : "unknown"),
      lastSuccessfulRunAt: lastSuccessfulRun?.runAt || lastSuccessfulRun?.startedAt || null,
      lastFailedRunAt: lastFailedRun?.runAt || lastFailedRun?.startedAt || null,
      lastFailedRunStatus: lastFailedRun?.status || (lastFailedRun?.ok === false ? "failed" : null),
      failedRunCount,
      warningRunCount,
      latestRun: lastRun || null,
      latestFailedRun: lastFailedRun || null,
    },
    staging: {
      batchCount: stagingSummary.batchCount,
      familyCounts: stagingSummary.familyCounts,
      latestStaged: stagingSummary.latestStaged,
      latestRemoved: stagingSummary.latestRemoved,
      latestRejected: stagingHistorySummary.latestRejected || reviewEventSummary.latestRejected,
      latestNeedsRevision: stagingHistorySummary.latestNeedsRevision || reviewEventSummary.latestNeedsRevision,
      latestWarnings: stagingHistorySummary.latestWarnings || reviewEventSummary.latestWarnings,
      latestRestored: stagingHistorySummary.latestRestored,
      latestRestaged: stagingHistorySummary.latestRestaged,
      historyCount: stagingHistorySummary.eventCount,
    },
    approvedPools: approvedPoolSummary,
    candidatePools: candidatePoolSummary,
    screenedCandidatePools: screenedCandidatePoolSummary,
    operatingLoop: operatingLoopSummary,
    reviewState,
  };
}

export function getOpenClawQueuePaths() {
  return {
    ...LOCAL_PATHS,
    sharedStoreEnabled: SHOULD_USE_SHARED_STORE,
    sharedStoreBucket: SHARED_BUCKET || null,
    sharedStoreRegion: DEFAULT_SHARED_REGION,
    sharedPrefix: SHARED_PREFIX,
  };
}
