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
  supportProfile: SupportProfile;
};

export type SessionRecord = {
  id: string;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
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

type DataFile<T> = {
  path: string;
  fallback: T;
};

type AccountEmailLookup = {
  accountId: string;
  email: string;
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

let sharedStoreClient: S3Client | null = null;
let sharedStoreReadyPromise: Promise<void> | null = null;

function getSharedStoreClient() {
  if (!shouldUseSharedStore) {
    return null;
  }

  if (!sharedStoreClient) {
    sharedStoreClient = new S3Client({
      region: sharedStoreRegion,
    });
  }

  return sharedStoreClient;
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

function defaultSupportProfile(): SupportProfile {
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

async function sharedDeleteJson(key: string) {
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

async function putSharedAccountRecord(account: AccountRecord) {
  const normalizedEmail = normalizeEmail(account.email);
  const normalizedAccount = {
    ...account,
    email: normalizedEmail,
  };

  await sharedWriteJson(accountRecordKey(normalizedAccount.id), normalizedAccount);
  await sharedWriteJson(accountEmailLookupKey(normalizedEmail), {
    accountId: normalizedAccount.id,
    email: normalizedEmail,
    updatedAt: nowIso(),
  } satisfies AccountEmailLookup);
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

async function listSharedAccounts() {
  return sortByCreatedAtDesc(await sharedListJsonObjects<AccountRecord>(`${SHARED_PREFIX}/accounts/by-id/`));
}

async function listSharedSessions() {
  return sortByCreatedAtDesc(await sharedListJsonObjects<SessionRecord>(`${SHARED_PREFIX}/sessions/`));
}

async function listSharedConsultations() {
  return sortByCreatedAtDesc(await sharedListJsonObjects<ConsultationRecord>(`${SHARED_PREFIX}/consultations/`));
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

export async function touchSession(id: string, userId?: string | null): Promise<SessionRecord | null> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    const session = await getSharedSessionById(id);

    if (!session) {
      return null;
    }

    const updatedSession: SessionRecord = {
      ...session,
      userId: userId === undefined ? session.userId : userId,
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

export async function createConsultation(input: {
  sessionId: string;
  userId: string | null;
  locale: Locale;
  recommendation: AdvisorRecommendation;
  answerLabels: Record<string, string>;
}): Promise<ConsultationRecord> {
  const consultation: ConsultationRecord = {
    id: createId("consult"),
    sessionId: input.sessionId,
    userId: input.userId,
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
  sessionId: string | null;
  locale?: Locale;
}): Promise<ConsultationRecord[]> {
  const consultations = await listConsultations();

  return consultations.filter((entry) => {
    if (input.locale && entry.locale !== input.locale) {
      return false;
    }
    if (input.userId) {
      return entry.userId === input.userId;
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
}): Promise<ConsultationRecord | null> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    const entry = await getSharedConsultationById(input.consultationId);

    if (!entry) {
      return null;
    }

    const updatedEntry: ConsultationRecord = {
      ...entry,
      userId: input.userId ?? entry.userId,
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

    updatedEntry = {
      ...entry,
      userId: input.userId ?? entry.userId,
      leadSubmitted: true,
      lead: input.lead,
    };
    return updatedEntry;
  });
  await writeLocalJson(consultationsFile, updated);
  return updatedEntry;
}

export async function assignSessionConsultationsToUser(sessionId: string, userId: string) {
  const consultations = await listConsultations();
  const matching = consultations.filter((entry) => entry.sessionId === sessionId);

  if (shouldUseSharedStore) {
    await Promise.all(
      matching.map((entry) =>
        putSharedConsultationRecord({
          ...entry,
          userId,
        }),
      ),
    );
    return;
  }

  const updated = consultations.map((entry) => (entry.sessionId === sessionId ? { ...entry, userId } : entry));
  await writeLocalJson(consultationsFile, updated);
}

export async function findConsultationForViewer(input: {
  consultationId: string;
  userId: string | null;
  sessionId: string | null;
}): Promise<ConsultationRecord | null> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    const entry = await getSharedConsultationById(input.consultationId);

    if (!entry) {
      return null;
    }
    if (input.userId) {
      return entry.userId === input.userId || entry.sessionId === input.sessionId ? entry : null;
    }
    return input.sessionId && entry.sessionId === input.sessionId ? entry : null;
  }

  const consultations = await listConsultations();
  return (
    consultations.find((entry) => {
      if (entry.id !== input.consultationId) {
        return false;
      }
      if (input.userId) {
        return entry.userId === input.userId || entry.sessionId === input.sessionId;
      }
      return input.sessionId ? entry.sessionId === input.sessionId : false;
    }) || null
  );
}
