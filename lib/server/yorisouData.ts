import { promises as fs } from "fs";
import path from "path";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import type { AdvisorLead } from "@/lib/yorisouAdvisorStorage";
import type { AdvisorRecommendation, Locale } from "@/lib/ai/yorisouAdvisor";
import { isPlaceholderEmail } from "@/lib/server/foundation/ids";

export type AccountRole = "self" | "family" | "facility";
export type LineBindingStatus = "not_connected" | "registered" | "connected";

export type SupportProfile = {
  lineBindingStatus: LineBindingStatus;
  lineDisplayName: string;
  lineNotificationsEnabled: boolean;
  familyContactName: string;
  familyContactRelation: string;
  familyContactMethod: string;
  familyContactValue: string;
  familyShareNote: string;
};

export type AccountRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  city: string;
  role: AccountRole;
  createdAt: string;
  updatedAt: string;
  lineUserId?: string;
  lineConnectedAt?: string;
  linePictureUrl?: string;
  lineIdTokenSubject?: string;
  supportProfile: SupportProfile;
};

export type SessionRecord = {
  id: string;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  principalLanding?: SessionPrincipalLanding | null;
};

export type SessionPrincipalLanding = {
  version: 1;
  kind: "canonical_principal";
  principalId: string;
  userProfileId: string;
  legacyAccountId: string | null;
  source: "email_login" | "register" | "line_login" | "line_bind" | "session_upgrade";
  issuedAt: string;
};

export type ConsultationRecord = {
  id: string;
  sessionId: string;
  userId: string | null;
  createdAt: string;
  locale: Locale;
  recommendedCategory: string;
  secondaryRecommendation: string;
  summary: string;
  suggestedNextAction: string;
  answerLabels: Record<string, string>;
  leadSubmitted: boolean;
  lead: AdvisorLead | null;
};

export type PasswordResetTokenRecord = {
  tokenHash: string;
  accountId: string;
  email: string;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
};

export type LineWebhookEventRecord = {
  id: string;
  accountId: string | null;
  lineUserId: string | null;
  sourceType: string | null;
  eventType: string;
  messageType: string | null;
  messageText: string | null;
  postbackData: string | null;
  replyTokenPresent: boolean;
  replyStatus: "not_attempted" | "sent" | "failed";
  replyError: string | null;
  webhookEventId: string | null;
  deliveryMode: string | null;
  isRedelivery: boolean;
  eventTimestamp: string | null;
  receivedAt: string;
};

export type RecentLineWebhookSubjectRecord = {
  eventId: string;
  webhookEventId: string | null;
  lineUserId: string;
  accountId: string | null;
  sourceType: string | null;
  eventType: string;
  messageType: string | null;
  messageText: string | null;
  postbackData: string | null;
  eventTimestamp: string | null;
  receivedAt: string;
};

type DataFile<T> = {
  path: string;
  fallback: T;
};

type AccountEmailLookup = {
  accountId: string;
  email: string;
  updatedAt: string;
};

type AccountLineLookup = {
  accountId: string;
  lineUserId: string;
  updatedAt: string;
};

type MigrationState = {
  version: number;
  migratedAt: string;
  source: "legacy_file" | "shared_store_bootstrap";
  accountCount: number;
  sessionCount: number;
  consultationCount: number;
};

const DEFAULT_SHARED_REGION = "us-east-2";
const SHARED_PREFIX = "phase1";
const MIGRATION_VERSION = 2;

const dataDir =
  process.env.YORISOU_DATA_DIR ||
  (process.env.NODE_ENV === "production" ? path.join("/tmp", "yorisou-phase1") : path.join(process.cwd(), "data"));
const sharedStoreBucket = process.env.YORISOU_SHARED_STORE_BUCKET?.trim() || "";
const sharedStoreRegion = process.env.YORISOU_SHARED_STORE_REGION || DEFAULT_SHARED_REGION;
const shouldUseSharedStore = Boolean(sharedStoreBucket);

// MPV-1C — optional S3-COMPATIBLE endpoint support (e.g. Supabase Storage), WITHOUT
// changing the default AWS behavior. When no endpoint is configured the store behaves
// exactly as before (AWS default credential provider). Two non-default modes:
//   • "s3-compatible": a custom S3 endpoint + explicit access-key credentials (the
//     existing @aws-sdk/client-s3 path with { endpoint, forcePathStyle, credentials }).
//   • "supabase-rest": Supabase Storage's REST object API, authenticated by a
//     server-only bearer token (the isolated Preview service-role key). Used when the
//     endpoint is the Supabase Storage REST base (".../storage/v1"); needs no S3 keys.
// Fail closed on partial/malformed configuration. Never log secret values.
const sharedStoreEndpoint = process.env.YORISOU_SHARED_STORE_ENDPOINT?.trim() || "";
const sharedStoreForcePathStyle = (process.env.YORISOU_SHARED_STORE_FORCE_PATH_STYLE || "").trim() === "true";
const sharedStoreAccessKeyId = process.env.YORISOU_SHARED_STORE_ACCESS_KEY_ID?.trim() || "";
const sharedStoreSecretAccessKey = process.env.YORISOU_SHARED_STORE_SECRET_ACCESS_KEY?.trim() || "";

export type SharedStoreMode = "disabled" | "aws" | "s3-compatible" | "supabase-rest";

// Pure resolver (exported for tests). Never returns a mode whose required inputs are
// absent — it throws a bounded, secret-free error instead (fail closed).
export function resolveSharedStoreMode(env: {
  bucket?: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
} = {
  bucket: sharedStoreBucket,
  endpoint: sharedStoreEndpoint,
  accessKeyId: sharedStoreAccessKeyId,
  secretAccessKey: sharedStoreSecretAccessKey,
}): SharedStoreMode {
  const bucket = (env.bucket || "").trim();
  const endpoint = (env.endpoint || "").trim();
  const accessKeyId = (env.accessKeyId || "").trim();
  const secretAccessKey = (env.secretAccessKey || "").trim();
  if (!bucket) return "disabled";
  if (!endpoint) return "aws";
  // Supabase Storage REST base: ".../storage/v1" (optionally trailing slash).
  if (/\/storage\/v1\/?$/.test(endpoint)) {
    if (!secretAccessKey) throw new Error("shared_store_supabase_rest_missing_token");
    return "supabase-rest";
  }
  // Custom S3-compatible endpoint: BOTH credentials required (reject partial creds).
  if (Boolean(accessKeyId) !== Boolean(secretAccessKey)) throw new Error("shared_store_partial_credentials");
  if (!accessKeyId || !secretAccessKey) throw new Error("shared_store_endpoint_missing_credentials");
  return "s3-compatible";
}

const sharedStoreMode: SharedStoreMode = shouldUseSharedStore ? resolveSharedStoreMode() : "disabled";
const sharedRestBase = sharedStoreEndpoint.replace(/\/$/, ""); // ".../storage/v1"

const accountsFile: DataFile<AccountRecord[]> = {
  path: path.join(dataDir, "phase1-accounts.json"),
  fallback: [],
};
const sessionsFile: DataFile<SessionRecord[]> = {
  path: path.join(dataDir, "phase1-sessions.json"),
  fallback: [],
};
const consultationsFile: DataFile<ConsultationRecord[]> = {
  path: path.join(dataDir, "phase1-consultations.json"),
  fallback: [],
};
const passwordResetTokensFile: DataFile<PasswordResetTokenRecord[]> = {
  path: path.join(dataDir, "phase1-password-reset-tokens.json"),
  fallback: [],
};
const lineWebhookEventsFile: DataFile<LineWebhookEventRecord[]> = {
  path: path.join(dataDir, "phase1-line-webhook-events.json"),
  fallback: [],
};
const recentLineWebhookSubjectsFile: DataFile<RecentLineWebhookSubjectRecord[]> = {
  path: path.join(dataDir, "phase1-line-webhook-recent-subjects.json"),
  fallback: [],
};

let sharedStoreClient: S3Client | null = null;
let sharedStoreReadyPromise: Promise<void> | null = null;

function getSharedStoreClient() {
  if (!shouldUseSharedStore || sharedStoreMode === "supabase-rest") {
    return null;
  }

  if (!sharedStoreClient) {
    if (sharedStoreMode === "s3-compatible") {
      // Custom S3-compatible endpoint (e.g. Supabase Storage S3): explicit endpoint +
      // credentials. Never logged.
      sharedStoreClient = new S3Client({
        region: sharedStoreRegion,
        endpoint: sharedStoreEndpoint,
        forcePathStyle: sharedStoreForcePathStyle,
        credentials: {
          accessKeyId: sharedStoreAccessKeyId,
          secretAccessKey: sharedStoreSecretAccessKey,
        },
      });
    } else {
      // AWS default — unchanged behavior (default credential provider chain).
      sharedStoreClient = new S3Client({
        region: sharedStoreRegion,
      });
    }
  }

  return sharedStoreClient;
}

// ── Supabase Storage REST transport (MPV-1C fallback) ────────────────────────
// A minimal server-only adapter over Supabase Storage's REST object API, used when
// no S3 access keys are available. Auth is a server-only bearer (the isolated Preview
// service-role key) — it never reaches the browser. Preserves the existing object-key
// layout (phase1/**). Same four operations as the S3 path.
function sharedRestHeaders(extra: Record<string, string> = {}) {
  return {
    apikey: sharedStoreSecretAccessKey,
    Authorization: `Bearer ${sharedStoreSecretAccessKey}`,
    ...extra,
  };
}

async function sharedRestReadJson<T>(key: string): Promise<T | null> {
  const res = await fetch(`${sharedRestBase}/object/${sharedStoreBucket}/${key}`, {
    method: "GET",
    headers: sharedRestHeaders(),
    cache: "no-store",
  });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`shared_store_rest_read_failed:${res.status}`);
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text) as T;
}

async function sharedRestWriteJson<T>(key: string, value: T): Promise<void> {
  const res = await fetch(`${sharedRestBase}/object/${sharedStoreBucket}/${key}`, {
    method: "POST",
    headers: sharedRestHeaders({ "Content-Type": "application/json", "x-upsert": "true" }),
    body: JSON.stringify(value, null, 2) + "\n",
  });
  if (!res.ok) throw new Error(`shared_store_rest_write_failed:${res.status}`);
}

async function sharedRestDeleteJson(key: string): Promise<void> {
  const res = await fetch(`${sharedRestBase}/object/${sharedStoreBucket}/${key}`, {
    method: "DELETE",
    headers: sharedRestHeaders(),
  });
  if (!res.ok && res.status !== 404) throw new Error(`shared_store_rest_delete_failed:${res.status}`);
}

async function sharedRestListKeys(prefix: string): Promise<string[]> {
  // Supabase Storage list is folder-oriented and returns names relative to the prefix;
  // the store lists single-folder prefixes (phase1/<category>/), so full keys are
  // reconstructed as prefix + child name for file entries (id present).
  const folder = prefix.replace(/\/$/, "");
  const keys: string[] = [];
  const pageSize = 1000;
  let offset = 0;
  for (;;) {
    const res = await fetch(`${sharedRestBase}/object/list/${sharedStoreBucket}`, {
      method: "POST",
      headers: sharedRestHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ prefix: `${folder}/`, limit: pageSize, offset }),
    });
    if (!res.ok) throw new Error(`shared_store_rest_list_failed:${res.status}`);
    const entries = (await res.json()) as { name: string; id: string | null }[];
    for (const entry of entries) {
      if (entry.id) keys.push(`${folder}/${entry.name}`);
    }
    if (entries.length < pageSize) break;
    offset += pageSize;
  }
  return keys;
}

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${randomBytes(6).toString("hex")}`;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function sortByCreatedAtDesc<T extends { createdAt: string }>(entries: T[]) {
  return [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function defaultSupportProfile(): SupportProfile {
  return {
    lineBindingStatus: "not_connected",
    lineDisplayName: "",
    lineNotificationsEnabled: false,
    familyContactName: "",
    familyContactRelation: "",
    familyContactMethod: "",
    familyContactValue: "",
    familyShareNote: "",
  };
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) {
    return false;
  }

  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, 64);

  if (expected.length !== actual.length) {
    return false;
  }

  return timingSafeEqual(expected, actual);
}

function migrationStateKey() {
  return `${SHARED_PREFIX}/migrations/file-store-v${MIGRATION_VERSION}.json`;
}

function accountRecordKey(id: string) {
  return `${SHARED_PREFIX}/accounts/by-id/${id}.json`;
}

function accountEmailLookupKey(email: string) {
  const digest = createHash("sha256").update(normalizeEmail(email)).digest("hex");
  return `${SHARED_PREFIX}/accounts/by-email/${digest}.json`;
}

function sessionRecordKey(id: string) {
  return `${SHARED_PREFIX}/sessions/${id}.json`;
}

function consultationRecordKey(id: string) {
  return `${SHARED_PREFIX}/consultations/${id}.json`;
}

function passwordResetTokenKey(tokenHash: string) {
  return `${SHARED_PREFIX}/password-resets/${tokenHash}.json`;
}

function lineUserLookupKey(lineUserId: string) {
  const digest = createHash("sha256").update(lineUserId).digest("hex");
  return `${SHARED_PREFIX}/accounts/by-line-user/${digest}.json`;
}

function lineWebhookEventKey(id: string) {
  return `${SHARED_PREFIX}/line-events/${id}.json`;
}

function recentLineWebhookSubjectsKey() {
  return `${SHARED_PREFIX}/line-events/admin-recent-subjects.json`;
}

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function ensureFile<T>(file: DataFile<T>) {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(file.path);
  } catch {
    await fs.writeFile(file.path, JSON.stringify(file.fallback, null, 2) + "\n", "utf8");
  }
}

async function readLocalJson<T>(file: DataFile<T>) {
  await ensureFile(file);
  const content = await fs.readFile(file.path, "utf8");

  try {
    return JSON.parse(content) as T;
  } catch {
    return file.fallback;
  }
}

async function writeLocalJson<T>(file: DataFile<T>, value: T) {
  await ensureFile(file);
  await fs.writeFile(file.path, JSON.stringify(value, null, 2) + "\n", "utf8");
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
  if (sharedStoreMode === "supabase-rest") {
    return sharedRestReadJson<T>(key);
  }
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
  if (sharedStoreMode === "supabase-rest") {
    return sharedRestWriteJson<T>(key, value);
  }
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

async function sharedDeleteJson(key: string) {
  if (sharedStoreMode === "supabase-rest") {
    return sharedRestDeleteJson(key);
  }
  const client = getSharedStoreClient();

  if (!client || !sharedStoreBucket) {
    throw new Error("shared_store_not_configured");
  }

  await client.send(
    new DeleteObjectCommand({
      Bucket: sharedStoreBucket,
      Key: key,
    }),
  );
}

async function sharedListKeys(prefix: string) {
  if (sharedStoreMode === "supabase-rest") {
    return sharedRestListKeys(prefix);
  }
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

  return keys;
}

async function sharedListJsonObjects<T>(prefix: string) {
  const keys = await sharedListKeys(prefix);
  const entries = await Promise.all(keys.map((key) => sharedReadJson<T>(key)));
  const resolved: T[] = [];

  for (const entry of entries) {
    if (entry) {
      resolved.push(entry);
    }
  }

  return resolved;
}

async function getSharedAccountById(id: string) {
  return sharedReadJson<AccountRecord>(accountRecordKey(id));
}

async function getSharedAccountByEmail(email: string) {
  const lookup = await sharedReadJson<AccountEmailLookup>(accountEmailLookupKey(email));

  if (!lookup) {
    return null;
  }

  return getSharedAccountById(lookup.accountId);
}

async function getSharedAccountByLineUserId(lineUserId: string) {
  const lookup = await sharedReadJson<AccountLineLookup>(lineUserLookupKey(lineUserId));

  if (lookup) {
    return getSharedAccountById(lookup.accountId);
  }

  const accounts = await listSharedAccounts();
  const account = accounts.find((entry) => entry.lineUserId === lineUserId) || null;

  if (account) {
    await sharedWriteJson(lineUserLookupKey(lineUserId), {
      accountId: account.id,
      lineUserId,
      updatedAt: nowIso(),
    } satisfies AccountLineLookup);
  }

  return account;
}

async function putSharedAccountRecord(account: AccountRecord) {
  const normalizedEmail = normalizeEmail(account.email);
  const normalizedAccount = {
    ...account,
    email: normalizedEmail,
  };
  const existingAccount = await getSharedAccountById(normalizedAccount.id);

  await sharedWriteJson(accountRecordKey(normalizedAccount.id), normalizedAccount);
  await sharedWriteJson(accountEmailLookupKey(normalizedEmail), {
    accountId: normalizedAccount.id,
    email: normalizedEmail,
    updatedAt: nowIso(),
  } satisfies AccountEmailLookup);

  if (existingAccount?.lineUserId && existingAccount.lineUserId !== normalizedAccount.lineUserId) {
    await sharedDeleteJson(lineUserLookupKey(existingAccount.lineUserId));
  }

  if (normalizedAccount.lineUserId) {
    await sharedWriteJson(lineUserLookupKey(normalizedAccount.lineUserId), {
      accountId: normalizedAccount.id,
      lineUserId: normalizedAccount.lineUserId,
      updatedAt: nowIso(),
    } satisfies AccountLineLookup);
  }

  return normalizedAccount;
}

async function putSharedSessionRecord(session: SessionRecord) {
  await sharedWriteJson(sessionRecordKey(session.id), session);
  return session;
}

async function getSharedSessionById(id: string) {
  return sharedReadJson<SessionRecord>(sessionRecordKey(id));
}

async function deleteSharedSession(id: string) {
  await sharedDeleteJson(sessionRecordKey(id));
}

async function putSharedConsultationRecord(consultation: ConsultationRecord) {
  await sharedWriteJson(consultationRecordKey(consultation.id), consultation);
  return consultation;
}

async function getSharedConsultationById(id: string) {
  return sharedReadJson<ConsultationRecord>(consultationRecordKey(id));
}

async function getSharedPasswordResetTokenByHash(tokenHash: string) {
  return sharedReadJson<PasswordResetTokenRecord>(passwordResetTokenKey(tokenHash));
}

async function listSharedAccounts() {
  return sortByCreatedAtDesc(await sharedListJsonObjects<AccountRecord>(`${SHARED_PREFIX}/accounts/by-id/`));
}

async function listSharedSessions() {
  return sortByCreatedAtDesc(await sharedListJsonObjects<SessionRecord>(`${SHARED_PREFIX}/sessions/`));
}

async function listSharedConsultations() {
  return sortByCreatedAtDesc(await sharedListJsonObjects<ConsultationRecord>(`${SHARED_PREFIX}/consultations/`));
}

async function listSharedPasswordResetTokens() {
  return sortByCreatedAtDesc(await sharedListJsonObjects<PasswordResetTokenRecord>(`${SHARED_PREFIX}/password-resets/`));
}

async function putSharedPasswordResetToken(record: PasswordResetTokenRecord) {
  await sharedWriteJson(passwordResetTokenKey(record.tokenHash), record);
  return record;
}

async function listSharedLineWebhookEvents() {
  return (await sharedListJsonObjects<LineWebhookEventRecord>(`${SHARED_PREFIX}/line-events/`)).sort((a, b) =>
    b.receivedAt.localeCompare(a.receivedAt),
  );
}

async function putSharedLineWebhookEvent(record: LineWebhookEventRecord) {
  await sharedWriteJson(lineWebhookEventKey(record.id), record);
  return record;
}

async function getSharedRecentLineWebhookSubjects() {
  return (await sharedReadJson<RecentLineWebhookSubjectRecord[]>(recentLineWebhookSubjectsKey())) || [];
}

async function putSharedRecentLineWebhookSubjects(records: RecentLineWebhookSubjectRecord[]) {
  await sharedWriteJson(recentLineWebhookSubjectsKey(), records);
  return records;
}

async function getSharedLineWebhookEventById(id: string) {
  return sharedReadJson<LineWebhookEventRecord>(lineWebhookEventKey(id));
}

function toRecentLineWebhookSubjectRecord(record: LineWebhookEventRecord): RecentLineWebhookSubjectRecord | null {
  if (!record.lineUserId) {
    return null;
  }

  return {
    eventId: record.id,
    webhookEventId: record.webhookEventId,
    lineUserId: record.lineUserId,
    accountId: record.accountId,
    sourceType: record.sourceType,
    eventType: record.eventType,
    messageType: record.messageType,
    messageText: record.messageText,
    postbackData: record.postbackData,
    eventTimestamp: record.eventTimestamp,
    receivedAt: record.receivedAt,
  };
}

function mergeRecentLineWebhookSubjectRecords(
  records: RecentLineWebhookSubjectRecord[],
  incoming: RecentLineWebhookSubjectRecord,
  limit = 20,
) {
  const next = [incoming, ...records.filter((entry) => entry.eventId !== incoming.eventId)];
  return next
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
    .slice(0, Math.max(1, limit));
}

async function updateRecentLineWebhookSubjectIndex(record: LineWebhookEventRecord) {
  const recentRecord = toRecentLineWebhookSubjectRecord(record);

  if (!recentRecord) {
    return;
  }

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    const existing = await getSharedRecentLineWebhookSubjects();
    await putSharedRecentLineWebhookSubjects(mergeRecentLineWebhookSubjectRecords(existing, recentRecord));
    return;
  }

  const existing = await readLocalJson(recentLineWebhookSubjectsFile);
  await writeLocalJson(recentLineWebhookSubjectsFile, mergeRecentLineWebhookSubjectRecords(existing, recentRecord));
}

async function ensureSharedStoreReady() {
  if (!shouldUseSharedStore) {
    return;
  }

  if (!sharedStoreReadyPromise) {
    sharedStoreReadyPromise = migrateLegacyFilesToSharedStore();
  }

  await sharedStoreReadyPromise;
}

async function migrateLegacyFilesToSharedStore() {
  const client = getSharedStoreClient();

  if (!client || !sharedStoreBucket) {
    return;
  }

  const existingMarker = await sharedReadJson<MigrationState>(migrationStateKey());
  if (existingMarker) {
    return;
  }

  const [existingAccounts, existingSessions, existingConsultations] = await Promise.all([
    sharedListKeys(`${SHARED_PREFIX}/accounts/by-id/`),
    sharedListKeys(`${SHARED_PREFIX}/sessions/`),
    sharedListKeys(`${SHARED_PREFIX}/consultations/`),
  ]);

  if (existingAccounts.length || existingSessions.length || existingConsultations.length) {
    await sharedWriteJson(migrationStateKey(), {
      version: MIGRATION_VERSION,
      migratedAt: nowIso(),
      source: "shared_store_bootstrap",
      accountCount: existingAccounts.length,
      sessionCount: existingSessions.length,
      consultationCount: existingConsultations.length,
    } satisfies MigrationState);
    return;
  }

  const [legacyAccounts, legacySessions, legacyConsultations] = await Promise.all([
    readLocalJson(accountsFile),
    readLocalJson(sessionsFile),
    readLocalJson(consultationsFile),
  ]);

  for (const account of legacyAccounts) {
    await putSharedAccountRecord(account);
  }

  for (const session of legacySessions) {
    await putSharedSessionRecord(session);
  }

  for (const consultation of legacyConsultations) {
    await putSharedConsultationRecord(consultation);
  }

  await sharedWriteJson(migrationStateKey(), {
    version: MIGRATION_VERSION,
    migratedAt: nowIso(),
    source: "legacy_file",
    accountCount: legacyAccounts.length,
    sessionCount: legacySessions.length,
    consultationCount: legacyConsultations.length,
  } satisfies MigrationState);
}

export async function listAccounts(): Promise<AccountRecord[]> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return listSharedAccounts();
  }

  return readLocalJson(accountsFile);
}

export async function findAccountByEmail(email: string): Promise<AccountRecord | null> {
  const normalizedEmail = normalizeEmail(email);

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return getSharedAccountByEmail(normalizedEmail);
  }

  const accounts = await listAccounts();
  return accounts.find((account) => normalizeEmail(account.email) === normalizedEmail) || null;
}

export async function findAccountById(id: string): Promise<AccountRecord | null> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return getSharedAccountById(id);
  }

  const accounts = await listAccounts();
  return accounts.find((account) => account.id === id) || null;
}

export async function findAccountByLineUserId(lineUserId: string): Promise<AccountRecord | null> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return getSharedAccountByLineUserId(lineUserId);
  }

  const accounts = await listAccounts();
  return accounts.find((account) => account.lineUserId === lineUserId) || null;
}

export async function createAccount(input: {
  name: string;
  email: string;
  password: string;
  city: string;
  role: AccountRole;
}) {
  const normalizedEmail = normalizeEmail(input.email);

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    const existing = await getSharedAccountByEmail(normalizedEmail);

    if (existing) {
      return { ok: false as const, reason: "email_exists" as const };
    }

    const account: AccountRecord = {
      id: createId("acct"),
      name: input.name,
      email: normalizedEmail,
      passwordHash: hashPassword(input.password),
      city: input.city,
      role: input.role,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      supportProfile: defaultSupportProfile(),
    };

    await putSharedAccountRecord(account);
    return { ok: true as const, account };
  }

  const accounts = await listAccounts();
  const existing = accounts.find((account) => normalizeEmail(account.email) === normalizedEmail);

  if (existing) {
    return { ok: false as const, reason: "email_exists" as const };
  }

  const account: AccountRecord = {
    id: createId("acct"),
    name: input.name,
    email: normalizedEmail,
    passwordHash: hashPassword(input.password),
    city: input.city,
    role: input.role,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    supportProfile: defaultSupportProfile(),
  };

  accounts.unshift(account);
  await writeLocalJson(accountsFile, accounts);
  return { ok: true as const, account };
}

function hashPasswordForStorage(password: string) {
  return hashPassword(password);
}

export async function upsertAccountRecord(account: AccountRecord): Promise<AccountRecord> {
  const normalizedAccount = {
    ...account,
    email: normalizeEmail(account.email),
  };

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    await putSharedAccountRecord(normalizedAccount);
    return normalizedAccount;
  }

  const accounts = await listAccounts();
  const nextAccounts = [...accounts];
  const existingIndex = nextAccounts.findIndex(
    (entry) => entry.id === normalizedAccount.id || normalizeEmail(entry.email) === normalizedAccount.email,
  );

  if (existingIndex >= 0) {
    nextAccounts[existingIndex] = normalizedAccount;
  } else {
    nextAccounts.unshift(normalizedAccount);
  }

  await writeLocalJson(accountsFile, nextAccounts);
  return normalizedAccount;
}

export async function updateAccountPassword(userId: string, password: string): Promise<AccountRecord | null> {
  const account = await findAccountById(userId);

  if (!account) {
    return null;
  }

  const updatedAccount: AccountRecord = {
    ...account,
    passwordHash: hashPasswordForStorage(password),
    updatedAt: nowIso(),
  };

  await upsertAccountRecord(updatedAccount);
  return updatedAccount;
}

export async function updateSupportProfile(userId: string, patch: Partial<SupportProfile>): Promise<AccountRecord | null> {
  const account = await findAccountById(userId);

  if (!account) {
    return null;
  }

  const updatedAccount: AccountRecord = {
    ...account,
    updatedAt: nowIso(),
    supportProfile: {
      ...account.supportProfile,
      ...patch,
    },
  };

  await upsertAccountRecord(updatedAccount);
  return updatedAccount;
}

export async function bindLineIdentity(input: {
  userId: string;
  lineUserId: string;
  lineDisplayName: string;
  linePictureUrl?: string;
  lineIdTokenSubject?: string;
}): Promise<AccountRecord | null> {
  const account = await findAccountById(input.userId);

  if (!account) {
    return null;
  }

  const existingHolder = await findAccountByLineUserId(input.lineUserId);
  if (existingHolder && existingHolder.id !== input.userId) {
    return null;
  }

  const updatedAccount: AccountRecord = {
    ...account,
    updatedAt: nowIso(),
    lineUserId: input.lineUserId,
    lineConnectedAt: nowIso(),
    linePictureUrl: input.linePictureUrl || account.linePictureUrl || "",
    lineIdTokenSubject: input.lineIdTokenSubject || input.lineUserId,
    supportProfile: {
      ...account.supportProfile,
      lineBindingStatus: "connected",
      lineDisplayName: input.lineDisplayName,
    },
  };

  await upsertAccountRecord(updatedAccount);
  return updatedAccount;
}

export async function listSessions(): Promise<SessionRecord[]> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return listSharedSessions();
  }

  return readLocalJson(sessionsFile);
}

export async function findSessionById(id: string): Promise<SessionRecord | null> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return getSharedSessionById(id);
  }

  const sessions = await listSessions();
  return sessions.find((session) => session.id === id) || null;
}

export async function createSession(userId: string | null): Promise<SessionRecord> {
  const session: SessionRecord = {
    id: createId("sess"),
    userId,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    await putSharedSessionRecord(session);
    return session;
  }

  const sessions = await listSessions();
  sessions.unshift(session);
  await writeLocalJson(sessionsFile, sessions);
  return session;
}

export async function touchSession(
  id: string,
  userId?: string | null,
  principalLanding?: SessionPrincipalLanding | null,
): Promise<SessionRecord | null> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    const session = await getSharedSessionById(id);

    if (!session) {
      return null;
    }

    const updatedSession: SessionRecord = {
      ...session,
      userId: userId === undefined ? session.userId : userId,
      principalLanding: principalLanding === undefined ? session.principalLanding || null : principalLanding,
      updatedAt: nowIso(),
    };
    await putSharedSessionRecord(updatedSession);
    return updatedSession;
  }

  const sessions = await listSessions();
  const updated = sessions.map((session) =>
    session.id === id
      ? {
          ...session,
          userId: userId === undefined ? session.userId : userId,
          principalLanding: principalLanding === undefined ? session.principalLanding || null : principalLanding,
          updatedAt: nowIso(),
        }
      : session,
  );
  await writeLocalJson(sessionsFile, updated);
  return updated.find((session) => session.id === id) || null;
}

export async function deleteSession(id: string) {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    await deleteSharedSession(id);
    return;
  }

  const sessions = await listSessions();
  await writeLocalJson(
    sessionsFile,
    sessions.filter((session) => session.id !== id),
  );
}

export async function listConsultations(): Promise<ConsultationRecord[]> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return listSharedConsultations();
  }

  return readLocalJson(consultationsFile);
}

export async function listPasswordResetTokens(): Promise<PasswordResetTokenRecord[]> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return listSharedPasswordResetTokens();
  }

  return readLocalJson(passwordResetTokensFile);
}

export async function listLineWebhookEvents(): Promise<LineWebhookEventRecord[]> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return listSharedLineWebhookEvents();
  }

  return readLocalJson(lineWebhookEventsFile);
}

export async function findLineWebhookEventById(id: string): Promise<LineWebhookEventRecord | null> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return getSharedLineWebhookEventById(id);
  }

  const records = await listLineWebhookEvents();
  return records.find((record) => record.id === id) || null;
}

async function upsertLineWebhookEvent(record: LineWebhookEventRecord) {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    await putSharedLineWebhookEvent(record);
    await updateRecentLineWebhookSubjectIndex(record);
    return record;
  }

  const records = await listLineWebhookEvents();
  const nextRecords = [...records];
  const existingIndex = nextRecords.findIndex((entry) => entry.id === record.id);

  if (existingIndex >= 0) {
    nextRecords[existingIndex] = record;
  } else {
    nextRecords.unshift(record);
  }

  await writeLocalJson(lineWebhookEventsFile, nextRecords);
  await updateRecentLineWebhookSubjectIndex(record);
  return record;
}

export async function createLineWebhookEvent(
  input: Omit<LineWebhookEventRecord, "id" | "receivedAt"> & { id?: string },
) {
  const record: LineWebhookEventRecord = {
    ...input,
    id: input.id || createId("lineevt"),
    receivedAt: nowIso(),
  };

  await upsertLineWebhookEvent(record);
  return record;
}

export async function updateLineWebhookEventReplyState(input: {
  id: string;
  replyStatus: LineWebhookEventRecord["replyStatus"];
  replyError: string | null;
}) {
  const existing = await findLineWebhookEventById(input.id);
  if (!existing) {
    return null;
  }

  const nextRecord: LineWebhookEventRecord = {
    ...existing,
    replyStatus: input.replyStatus,
    replyError: input.replyError,
  };

  await upsertLineWebhookEvent(nextRecord);
  return nextRecord;
}

export async function updateLineWebhookEventMessageText(input: {
  id: string;
  messageText: string | null;
}) {
  const existing = await findLineWebhookEventById(input.id);
  if (!existing) {
    return null;
  }

  const nextRecord: LineWebhookEventRecord = {
    ...existing,
    messageText: input.messageText,
  };

  await upsertLineWebhookEvent(nextRecord);
  return nextRecord;
}

export async function listLineWebhookEventsForAccount(accountId: string) {
  const records = await listLineWebhookEvents();
  return records.filter((record) => record.accountId === accountId);
}

export async function listRecentLineWebhookSubjects(limit = 10): Promise<RecentLineWebhookSubjectRecord[]> {
  const effectiveLimit = Math.max(1, limit);

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return (await getSharedRecentLineWebhookSubjects()).slice(0, effectiveLimit);
  }

  return (await readLocalJson(recentLineWebhookSubjectsFile)).slice(0, effectiveLimit);
}

export async function getLatestLineWebhookEventForAccount(accountId: string) {
  const records = await listLineWebhookEventsForAccount(accountId);
  return records[0] || null;
}

async function upsertPasswordResetToken(record: PasswordResetTokenRecord) {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    await putSharedPasswordResetToken(record);
    return record;
  }

  const records = await listPasswordResetTokens();
  const nextRecords = [...records];
  const existingIndex = nextRecords.findIndex((entry) => entry.tokenHash === record.tokenHash);

  if (existingIndex >= 0) {
    nextRecords[existingIndex] = record;
  } else {
    nextRecords.unshift(record);
  }

  await writeLocalJson(passwordResetTokensFile, nextRecords);
  return record;
}

export async function createPasswordResetToken(input: {
  accountId: string;
  email: string;
  expiresInMinutes?: number;
}) {
  if (isPlaceholderEmail(input.email)) {
    throw new Error("placeholder_email_not_resettable");
  }

  const token = randomBytes(32).toString("base64url");
  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + (input.expiresInMinutes || 60) * 60 * 1000).toISOString();
  const record: PasswordResetTokenRecord = {
    tokenHash: hashResetToken(token),
    accountId: input.accountId,
    email: normalizeEmail(input.email),
    createdAt,
    expiresAt,
    usedAt: null,
  };

  const existing = await listPasswordResetTokens();
  const activeForAccount = existing.filter((entry) => entry.accountId === input.accountId && entry.usedAt === null);

  for (const entry of activeForAccount) {
    await upsertPasswordResetToken({
      ...entry,
      usedAt: createdAt,
    });
  }

  await upsertPasswordResetToken(record);
  return {
    token,
    record,
  };
}

export async function getPasswordResetTokenRecord(token: string): Promise<PasswordResetTokenRecord | null> {
  const tokenHash = hashResetToken(token);

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return getSharedPasswordResetTokenByHash(tokenHash);
  }

  const records = await listPasswordResetTokens();
  return records.find((entry) => entry.tokenHash === tokenHash) || null;
}

export async function validatePasswordResetToken(token: string) {
  const record = await getPasswordResetTokenRecord(token);

  if (!record) {
    return { ok: false as const, reason: "invalid_token" as const };
  }

  if (record.usedAt) {
    return { ok: false as const, reason: "used_token" as const };
  }

  if (record.expiresAt <= nowIso()) {
    return { ok: false as const, reason: "expired_token" as const };
  }

  const account = await findAccountById(record.accountId);

  if (isPlaceholderEmail(record.email) || (account && isPlaceholderEmail(account.email))) {
    return { ok: false as const, reason: "invalid_token" as const };
  }

  if (!account || normalizeEmail(account.email) !== record.email) {
    return { ok: false as const, reason: "invalid_token" as const };
  }

  return {
    ok: true as const,
    record,
    account,
  };
}

export async function consumePasswordResetToken(token: string, password: string) {
  const validation = await validatePasswordResetToken(token);

  if (!validation.ok) {
    return validation;
  }

  const updatedAccount = await updateAccountPassword(validation.account.id, password);

  if (!updatedAccount) {
    return { ok: false as const, reason: "invalid_token" as const };
  }

  const allTokens = await listPasswordResetTokens();
  const relatedActiveTokens = allTokens.filter(
    (entry) => entry.accountId === validation.account.id && entry.usedAt === null,
  );
  const usedAt = nowIso();

  for (const entry of relatedActiveTokens) {
    await upsertPasswordResetToken({
      ...entry,
      usedAt,
    });
  }

  return {
    ok: true as const,
    account: updatedAccount,
  };
}

export async function createConsultation(input: {
  sessionId: string;
  userId: string | null;
  ownerTargetId?: string | null;
  locale: Locale;
  recommendation: AdvisorRecommendation;
  answerLabels: Record<string, string>;
}): Promise<ConsultationRecord> {
  const consultation: ConsultationRecord = {
    id: createId("consult"),
    sessionId: input.sessionId,
    userId: input.ownerTargetId === undefined ? input.userId : input.ownerTargetId,
    createdAt: nowIso(),
    locale: input.locale,
    recommendedCategory: input.recommendation.recommendedCategory,
    secondaryRecommendation: input.recommendation.secondaryRecommendation,
    summary: input.recommendation.summary,
    suggestedNextAction: input.recommendation.suggestedNextAction,
    answerLabels: input.answerLabels,
    leadSubmitted: false,
    lead: null,
  };

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    await putSharedConsultationRecord(consultation);
    return consultation;
  }

  const consultations = await listConsultations();
  consultations.unshift(consultation);
  await writeLocalJson(consultationsFile, consultations);
  return consultation;
}

export async function listConsultationsForViewer(input: {
  userId: string | null;
  userIds?: string[] | null;
  sessionId: string | null;
  locale?: Locale;
}): Promise<ConsultationRecord[]> {
  const consultations = await listConsultations();
  const ownerIds = new Set((input.userIds || []).filter(Boolean));
  if (input.userId) {
    ownerIds.add(input.userId);
  }

  return consultations.filter((entry) => {
    if (input.locale && entry.locale !== input.locale) {
      return false;
    }
    if (ownerIds.size) {
      return entry.userId ? ownerIds.has(entry.userId) : false;
    }
    if (input.sessionId) {
      return entry.sessionId === input.sessionId;
    }
    return false;
  });
}

export async function attachLeadToConsultation(input: {
  consultationId: string;
  lead: AdvisorLead;
  userId: string | null;
  ownerTargetId?: string | null;
  ownerIds?: string[] | null;
}): Promise<ConsultationRecord | null> {
  const ownerIds = new Set((input.ownerIds || []).filter(Boolean));
  if (input.userId) {
    ownerIds.add(input.userId);
  }
  if (input.ownerTargetId) {
    ownerIds.add(input.ownerTargetId);
  }

  const resolveUpdatedOwnerTarget = (entry: ConsultationRecord) => {
    if (ownerIds.size && entry.userId && !ownerIds.has(entry.userId)) {
      return null;
    }

    return input.ownerTargetId === undefined ? (input.userId ?? entry.userId) : input.ownerTargetId;
  };

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    const entry = await getSharedConsultationById(input.consultationId);

    if (!entry) {
      return null;
    }

    const updatedOwnerTarget = resolveUpdatedOwnerTarget(entry);

    if (updatedOwnerTarget === null) {
      return null;
    }

    const updatedEntry: ConsultationRecord = {
      ...entry,
      userId: updatedOwnerTarget,
      leadSubmitted: true,
      lead: input.lead,
    };
    await putSharedConsultationRecord(updatedEntry);
    return updatedEntry;
  }

  const consultations = await listConsultations();
  let updatedEntry: ConsultationRecord | null = null;
  const updated = consultations.map((entry) => {
    if (entry.id !== input.consultationId) {
      return entry;
    }

    const updatedOwnerTarget = resolveUpdatedOwnerTarget(entry);

    if (updatedOwnerTarget === null) {
      updatedEntry = null;
      return entry;
    }

    updatedEntry = {
      ...entry,
      userId: updatedOwnerTarget,
      leadSubmitted: true,
      lead: input.lead,
    };
    return updatedEntry;
  });
  await writeLocalJson(consultationsFile, updated);
  return updatedEntry;
}

export async function assignSessionConsultationsToUser(
  sessionId: string,
  userId: string,
  options?: {
    ownerTargetId?: string | null;
  },
) {
  const consultations = await listConsultations();
  const matching = consultations.filter((entry) => entry.sessionId === sessionId);
  const ownerTargetId = options?.ownerTargetId || userId;

  if (shouldUseSharedStore) {
    await Promise.all(
      matching.map((entry) =>
        putSharedConsultationRecord({
          ...entry,
          userId: ownerTargetId,
        }),
      ),
    );
    return;
  }

  const updated = consultations.map((entry) => (entry.sessionId === sessionId ? { ...entry, userId: ownerTargetId } : entry));
  await writeLocalJson(consultationsFile, updated);
}

export async function findConsultationForViewer(input: {
  consultationId: string;
  userId: string | null;
  userIds?: string[] | null;
  sessionId: string | null;
}): Promise<ConsultationRecord | null> {
  const ownerIds = new Set((input.userIds || []).filter(Boolean));
  if (input.userId) {
    ownerIds.add(input.userId);
  }

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    const entry = await getSharedConsultationById(input.consultationId);

    if (!entry) {
      return null;
    }
    if (ownerIds.size) {
      return (entry.userId && ownerIds.has(entry.userId)) || entry.sessionId === input.sessionId ? entry : null;
    }
    return input.sessionId && entry.sessionId === input.sessionId ? entry : null;
  }

  const consultations = await listConsultations();
  return (
    consultations.find((entry) => {
      if (entry.id !== input.consultationId) {
        return false;
      }
      if (ownerIds.size) {
        return (entry.userId && ownerIds.has(entry.userId)) || entry.sessionId === input.sessionId;
      }
      return input.sessionId ? entry.sessionId === input.sessionId : false;
    }) || null
  );
}
