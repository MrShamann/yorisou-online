import { promises as fs } from "fs";
import path from "path";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

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

const dataDir =
  process.env.YORISOU_DATA_DIR ||
  (process.env.NODE_ENV === "production" ? path.join("/tmp", "yorisou-phase1") : path.join(process.cwd(), "data"));
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

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${randomBytes(6).toString("hex")}`;
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

async function ensureFile<T>(file: DataFile<T>) {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(file.path);
  } catch {
    await fs.writeFile(file.path, JSON.stringify(file.fallback, null, 2) + "\n", "utf8");
  }
}

async function readJson<T>(file: DataFile<T>) {
  await ensureFile(file);
  const content = await fs.readFile(file.path, "utf8");

  try {
    return JSON.parse(content) as T;
  } catch {
    return file.fallback;
  }
}

async function writeJson<T>(file: DataFile<T>, value: T) {
  await ensureFile(file);
  await fs.writeFile(file.path, JSON.stringify(value, null, 2) + "\n", "utf8");
}

export async function listAccounts() {
  return readJson(accountsFile);
}

export async function findAccountByEmail(email: string) {
  const accounts = await listAccounts();
  return accounts.find((account) => account.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findAccountById(id: string) {
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
  const accounts = await listAccounts();
  const existing = accounts.find((account) => account.email.toLowerCase() === input.email.toLowerCase());

  if (existing) {
    return { ok: false as const, reason: "email_exists" as const };
  }

  const account: AccountRecord = {
    id: createId("acct"),
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: hashPassword(input.password),
    city: input.city,
    role: input.role,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    supportProfile: defaultSupportProfile(),
  };

  accounts.unshift(account);
  await writeJson(accountsFile, accounts);

  return { ok: true as const, account };
}

export async function upsertAccountRecord(account: AccountRecord) {
  const accounts = await listAccounts();
  const nextAccounts = [...accounts];
  const existingIndex = nextAccounts.findIndex(
    (entry) => entry.id === account.id || entry.email.toLowerCase() === account.email.toLowerCase(),
  );

  if (existingIndex >= 0) {
    nextAccounts[existingIndex] = account;
  } else {
    nextAccounts.unshift(account);
  }

  await writeJson(accountsFile, nextAccounts);
  return account;
}

export async function updateSupportProfile(userId: string, patch: Partial<SupportProfile>) {
  const accounts = await listAccounts();
  const updated = accounts.map((account) =>
    account.id === userId
      ? {
          ...account,
          updatedAt: nowIso(),
          supportProfile: {
            ...account.supportProfile,
            ...patch,
          },
        }
      : account
  );
  await writeJson(accountsFile, updated);
  return updated.find((account) => account.id === userId) || null;
}

export async function listSessions() {
  return readJson(sessionsFile);
}

export async function findSessionById(id: string) {
  const sessions = await listSessions();
  return sessions.find((session) => session.id === id) || null;
}

export async function createSession(userId: string | null) {
  const sessions = await listSessions();
  const session: SessionRecord = {
    id: createId("sess"),
    userId,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  sessions.unshift(session);
  await writeJson(sessionsFile, sessions);
  return session;
}

export async function touchSession(id: string, userId?: string | null) {
  const sessions = await listSessions();
  const updated = sessions.map((session) =>
    session.id === id
      ? {
          ...session,
          userId: userId === undefined ? session.userId : userId,
          updatedAt: nowIso(),
        }
      : session
  );
  await writeJson(sessionsFile, updated);
  return updated.find((session) => session.id === id) || null;
}

export async function deleteSession(id: string) {
  const sessions = await listSessions();
  await writeJson(
    sessionsFile,
    sessions.filter((session) => session.id !== id)
  );
}

export async function listConsultations() {
  return readJson(consultationsFile);
}

export async function createConsultation(input: {
  sessionId: string;
  userId: string | null;
  locale: Locale;
  recommendation: AdvisorRecommendation;
  answerLabels: Record<string, string>;
}) {
  const consultations = await listConsultations();
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
  consultations.unshift(consultation);
  await writeJson(consultationsFile, consultations);
  return consultation;
}

export async function listConsultationsForViewer(input: { userId: string | null; sessionId: string | null; locale?: Locale }) {
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
}) {
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
  await writeJson(consultationsFile, updated);
  return updatedEntry;
}

export async function assignSessionConsultationsToUser(sessionId: string, userId: string) {
  const consultations = await listConsultations();
  const updated = consultations.map((entry) => (entry.sessionId === sessionId ? { ...entry, userId } : entry));
  await writeJson(consultationsFile, updated);
}

export async function findConsultationForViewer(input: {
  consultationId: string;
  userId: string | null;
  sessionId: string | null;
}) {
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
