import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import {
  GetObjectCommand,
  ListObjectsV2Command,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import type { SupportRecommendedAction } from "@/lib/ai/support/action-router";
import type { SupportConversationPolicy } from "@/lib/ai/support/conversation-policy";
import type {
  SupportAssistantLocale,
  SupportConversationMessage,
  SupportIdentity,
  SupportScenarioResult,
} from "@/lib/ai/support/scenario-engine";
import type { ViewerContext } from "@/lib/server/yorisouAuth";
import type { SessionRecord } from "@/lib/server/yorisouData";

export type HinataRelationshipStage = "new" | "understanding" | "continuing" | "follow_up_ready";

export type HinataUserState = {
  id: string;
  ownerKey: string;
  ownerType: "principal" | "account" | "session";
  principalId: string | null;
  accountId: string | null;
  sessionId: string | null;
  lineUserId: string | null;
  channelIdentity: {
    webSessionId: string | null;
    accountId: string | null;
    lineUserId: string | null;
  };
  role: "self" | "family" | "institution" | "unknown";
  concernSummary: string;
  preferredTone: "warm" | "neutral" | null;
  preferredVerbosity: "short" | "normal" | null;
  followUpPreference: "gentle_single_question" | null;
  relationshipStage: HinataRelationshipStage;
  latestSummary: string;
  importantTags: string[];
  reminderPreference: "unset" | "gentle" | "none";
  channelContinuationPreference: "unset" | "web" | "line" | "account";
  familySharingPreference: "unknown" | "yes" | "no";
  productInterestState: "unknown" | "browsing" | "considering";
  createdAt: string;
  updatedAt: string;
};

export type HinataThreadState = {
  id: string;
  ownerKey: string;
  locale: SupportAssistantLocale;
  sessionId: string | null;
  accountId: string | null;
  principalId: string | null;
  currentTopic: string;
  recentMessageSummary: string;
  openQuestion: string | null;
  latestNextStep: string | null;
  continuityMarkers: string[];
  latestUserMessage: string;
  latestAssistantMessage: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
};

export type HinataMemorySnapshot = {
  resolvedOwnerKey: string;
  ownerType: "principal" | "account" | "session";
  profile: HinataUserState | null;
  thread: HinataThreadState | null;
};

const DEFAULT_SHARED_REGION = "us-east-2";
const SHARED_PREFIX = "phase1/hinata";
const dataDir =
  process.env.YORISOU_DATA_DIR ||
  (process.env.NODE_ENV === "production" ? path.join("/tmp", "yorisou-phase1") : path.join(process.cwd(), "data"));
const sharedStoreBucket = process.env.YORISOU_SHARED_STORE_BUCKET?.trim() || "";
const sharedStoreRegion = process.env.YORISOU_SHARED_STORE_REGION || DEFAULT_SHARED_REGION;
const shouldUseSharedStore = Boolean(sharedStoreBucket);

const userStatesFile = path.join(dataDir, "phase1-hinata-user-states.json");
const threadStatesFile = path.join(dataDir, "phase1-hinata-thread-states.json");

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

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${randomBytes(6).toString("hex")}`;
}

async function ensureLocalFile(filePath: string) {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]\n", "utf8");
  }
}

async function readLocalArray<T>(filePath: string): Promise<T[]> {
  await ensureLocalFile(filePath);
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as T[];
  } catch {
    return [];
  }
}

async function writeLocalArray<T>(filePath: string, value: T[]) {
  await ensureLocalFile(filePath);
  await fs.writeFile(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
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

async function sharedReadJson<T>(key: string) {
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

async function sharedListJsonObjects<T>(prefix: string) {
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

  const records = await Promise.all(keys.map((key) => sharedReadJson<T>(key)));
  return records.filter((entry) => entry !== null) as T[];
}

function userStateKey(ownerKey: string) {
  return `${SHARED_PREFIX}/user-states/${encodeURIComponent(ownerKey)}.json`;
}

function threadStateKey(id: string) {
  return `${SHARED_PREFIX}/thread-states/${id}.json`;
}

async function listUserStates() {
  if (shouldUseSharedStore) {
    return sharedListJsonObjects<HinataUserState>(`${SHARED_PREFIX}/user-states/`);
  }
  return readLocalArray<HinataUserState>(userStatesFile);
}

async function listThreadStates() {
  if (shouldUseSharedStore) {
    return sharedListJsonObjects<HinataThreadState>(`${SHARED_PREFIX}/thread-states/`);
  }
  return readLocalArray<HinataThreadState>(threadStatesFile);
}

async function upsertUserState(record: HinataUserState) {
  if (shouldUseSharedStore) {
    await sharedWriteJson(userStateKey(record.ownerKey), record);
    return record;
  }

  const existing = await listUserStates();
  const updated = existing.filter((entry) => entry.ownerKey !== record.ownerKey);
  updated.unshift(record);
  await writeLocalArray(userStatesFile, updated);
  return record;
}

async function upsertThreadState(record: HinataThreadState) {
  if (shouldUseSharedStore) {
    await sharedWriteJson(threadStateKey(record.id), record);
    return record;
  }

  const existing = await listThreadStates();
  const updated = existing.filter((entry) => entry.id !== record.id);
  updated.unshift(record);
  await writeLocalArray(threadStatesFile, updated);
  return record;
}

function resolveOwner(viewer: ViewerContext, session: SessionRecord) {
  if (viewer.principal?.userProfileId) {
    return {
      ownerKey: `principal:${viewer.principal.userProfileId}`,
      ownerType: "principal" as const,
      principalId: viewer.principal.userProfileId,
      accountId: viewer.account?.id || viewer.legacyAccount?.id || null,
      lineUserId: viewer.account?.lineUserId || viewer.legacyAccount?.lineUserId || null,
    };
  }

  if (viewer.account?.id || viewer.legacyAccount?.id) {
    const accountId = viewer.account?.id || viewer.legacyAccount?.id || null;
    return {
      ownerKey: `account:${accountId}`,
      ownerType: "account" as const,
      principalId: null,
      accountId,
      lineUserId: viewer.account?.lineUserId || viewer.legacyAccount?.lineUserId || null,
    };
  }

  return {
    ownerKey: `session:${session.id}`,
    ownerType: "session" as const,
    principalId: null,
    accountId: null,
    lineUserId: null,
  };
}

function summarizeConcern(userMessage: string, scenario: SupportScenarioResult) {
  const normalized = userMessage.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return scenario.labels.scenario;
  }
  return normalized.length > 120 ? `${normalized.slice(0, 117)}...` : normalized;
}

function inferRelationshipStage(messageCount: number, actions: SupportRecommendedAction[]): HinataRelationshipStage {
  if (messageCount >= 6) {
    return actions.length > 0 ? "follow_up_ready" : "continuing";
  }
  if (messageCount >= 3) {
    return "understanding";
  }
  return "new";
}

function extractOpenQuestion(assistantMessage: string) {
  const match = assistantMessage
    .split(/\n+/)
    .map((entry) => entry.trim())
    .find((entry) => entry.endsWith("？") || entry.endsWith("?"));
  return match || null;
}

function buildRecentMessageSummary(history: SupportConversationMessage[], userMessage: string, assistantMessage: string) {
  const recent = [
    ...history.slice(-4).map((entry) => `${entry.role === "assistant" ? "ひなた" : "利用者"}: ${entry.content.trim()}`),
    `利用者: ${userMessage.trim()}`,
    `ひなた: ${assistantMessage.trim()}`,
  ]
    .filter(Boolean)
    .join(" / ");

  return recent.length > 560 ? `${recent.slice(0, 557)}...` : recent;
}

function buildImportantTags(input: {
  existing: string[];
  identity: SupportIdentity;
  scenario: SupportScenarioResult;
  actions: SupportRecommendedAction[];
  viewer: ViewerContext;
}) {
  const tags = new Set(input.existing);
  tags.add(input.identity);
  tags.add(input.scenario.scenario);
  tags.add(input.scenario.riskLevel);
  if (input.viewer.account?.lineUserId || input.viewer.legacyAccount?.lineUserId) {
    tags.add("line_connected");
  }
  for (const action of input.actions.slice(0, 2)) {
    tags.add(action.id);
  }
  return Array.from(tags).slice(0, 12);
}

export async function getHinataMemorySnapshot(input: {
  viewer: ViewerContext;
  session: SessionRecord;
}): Promise<HinataMemorySnapshot> {
  const resolved = resolveOwner(input.viewer, input.session);
  const [profiles, threads] = await Promise.all([listUserStates(), listThreadStates()]);
  const profile = profiles.find((entry) => entry.ownerKey === resolved.ownerKey) || null;
  const thread =
    threads
      .filter((entry) => entry.sessionId === input.session.id || entry.ownerKey === resolved.ownerKey)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] || null;

  return {
    resolvedOwnerKey: resolved.ownerKey,
    ownerType: resolved.ownerType,
    profile,
    thread,
  };
}

export async function upsertHinataMemory(input: {
  viewer: ViewerContext;
  session: SessionRecord;
  locale: SupportAssistantLocale;
  identity: SupportIdentity;
  scenario: SupportScenarioResult;
  policy: SupportConversationPolicy;
  history: SupportConversationMessage[];
  userMessage: string;
  assistantMessage: string;
  actions: SupportRecommendedAction[];
}) {
  const snapshot = await getHinataMemorySnapshot({ viewer: input.viewer, session: input.session });
  const resolved = resolveOwner(input.viewer, input.session);
  const timestamp = nowIso();
  const messageCount = input.history.length + 2;

  const profile: HinataUserState = {
    id: snapshot.profile?.id || createId("hinata_profile"),
    ownerKey: resolved.ownerKey,
    ownerType: resolved.ownerType,
    principalId: resolved.principalId,
    accountId: resolved.accountId,
    sessionId: input.session.id,
    lineUserId: resolved.lineUserId,
    channelIdentity: {
      webSessionId: input.session.id,
      accountId: resolved.accountId,
      lineUserId: resolved.lineUserId,
    },
    role: input.identity,
    concernSummary: summarizeConcern(input.userMessage, input.scenario),
    preferredTone: snapshot.profile?.preferredTone || "warm",
    preferredVerbosity: snapshot.profile?.preferredVerbosity || "short",
    followUpPreference: snapshot.profile?.followUpPreference || "gentle_single_question",
    relationshipStage: inferRelationshipStage(messageCount, input.actions),
    latestSummary: input.assistantMessage,
    importantTags: buildImportantTags({
      existing: snapshot.profile?.importantTags || [],
      identity: input.identity,
      scenario: input.scenario,
      actions: input.actions,
      viewer: input.viewer,
    }),
    reminderPreference: snapshot.profile?.reminderPreference || "unset",
    channelContinuationPreference:
      snapshot.profile?.channelContinuationPreference ||
      (resolved.lineUserId ? "line" : resolved.accountId ? "account" : "web"),
    familySharingPreference:
      snapshot.profile?.familySharingPreference || (input.identity === "family" ? "yes" : "unknown"),
    productInterestState:
      snapshot.profile?.productInterestState ||
      (input.scenario.scenario === "product_guidance" ? "considering" : "unknown"),
    createdAt: snapshot.profile?.createdAt || timestamp,
    updatedAt: timestamp,
  };

  const thread: HinataThreadState = {
    id: snapshot.thread?.id || createId("hinata_thread"),
    ownerKey: resolved.ownerKey,
    locale: input.locale,
    sessionId: input.session.id,
    accountId: resolved.accountId,
    principalId: resolved.principalId,
    currentTopic: input.scenario.labels.scenario,
    recentMessageSummary: buildRecentMessageSummary(input.history, input.userMessage, input.assistantMessage),
    openQuestion: extractOpenQuestion(input.assistantMessage) || input.policy.followUpQuestion || null,
    latestNextStep: input.actions[0]?.title || null,
    continuityMarkers: [
      input.scenario.scenario,
      input.scenario.labels.persona,
      input.policy.followUpStyle,
      input.actions[0]?.id || "no_action",
    ],
    latestUserMessage: input.userMessage.trim(),
    latestAssistantMessage: input.assistantMessage.trim(),
    messageCount,
    createdAt: snapshot.thread?.createdAt || timestamp,
    updatedAt: timestamp,
  };

  await Promise.all([upsertUserState(profile), upsertThreadState(thread)]);

  return {
    snapshot: {
      resolvedOwnerKey: resolved.ownerKey,
      ownerType: resolved.ownerType,
      profile,
      thread,
    },
    profile,
    thread,
  };
}
