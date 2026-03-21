import type { AdvisorAnswers, AdvisorRecommendation, Locale } from "@/lib/ai/yorisouAdvisor";

export type AccountProfile = {
  name: string;
  email: string;
  password: string;
  city: string;
  role: "self" | "family" | "facility";
};

export type ConsultationSnapshot = {
  id: string;
  createdAt: string;
  locale: Locale;
  recommendedCategory: string;
  secondaryRecommendation: string;
  summary: string;
  suggestedNextAction: string;
  answerLabels: Record<string, string>;
  leadSubmitted: boolean;
};

const ACCOUNT_KEY = "yorisou.m1.account";
const SESSION_KEY = "yorisou.m1.session";
const CONSULTATIONS_KEY = "yorisou.m1.consultations";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredAccount() {
  return readJson<AccountProfile | null>(ACCOUNT_KEY, null);
}

export function getSessionEmail() {
  return readJson<string | null>(SESSION_KEY, null);
}

export function getSignedInAccount() {
  const account = getStoredAccount();
  const sessionEmail = getSessionEmail();

  if (!account || !sessionEmail || account.email !== sessionEmail) {
    return null;
  }

  return account;
}

export function registerLocalAccount(profile: AccountProfile) {
  writeJson(ACCOUNT_KEY, profile);
  writeJson(SESSION_KEY, profile.email);
  return profile;
}

export function loginLocalAccount(email: string, password: string) {
  const account = getStoredAccount();

  if (!account) {
    return { ok: false as const, reason: "not_found" as const };
  }

  if (account.email !== email || account.password !== password) {
    return { ok: false as const, reason: "invalid_credentials" as const };
  }

  writeJson(SESSION_KEY, account.email);
  return { ok: true as const, account };
}

export function logoutLocalAccount() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}

export function listConsultationSnapshots() {
  return readJson<ConsultationSnapshot[]>(CONSULTATIONS_KEY, []);
}

export function saveConsultationSnapshot(input: {
  locale: Locale;
  recommendation: AdvisorRecommendation;
  answerLabels: Record<string, string>;
}) {
  const nextEntry: ConsultationSnapshot = {
    id: `consult_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    locale: input.locale,
    recommendedCategory: input.recommendation.recommendedCategory,
    secondaryRecommendation: input.recommendation.secondaryRecommendation,
    summary: input.recommendation.summary,
    suggestedNextAction: input.recommendation.suggestedNextAction,
    answerLabels: input.answerLabels,
    leadSubmitted: false,
  };

  const existing = listConsultationSnapshots();
  existing.unshift(nextEntry);
  writeJson(CONSULTATIONS_KEY, existing);

  return nextEntry.id;
}

export function markConsultationLeadSubmitted(entryId: string) {
  const existing = listConsultationSnapshots();
  const updated = existing.map((entry) => (entry.id === entryId ? { ...entry, leadSubmitted: true } : entry));
  writeJson(CONSULTATIONS_KEY, updated);
}

export function getConsultationShareText(entry: ConsultationSnapshot) {
  const answerSummary = Object.entries(entry.answerLabels)
    .slice(0, 4)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  return [
    "Yorisou 相談内容メモ",
    `おすすめ: ${entry.recommendedCategory}`,
    `次点候補: ${entry.secondaryRecommendation}`,
    `要点: ${entry.summary}`,
    answerSummary,
    `次の動き: ${entry.suggestedNextAction}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function clearConsultationSnapshots() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(CONSULTATIONS_KEY);
}

export function summarizeAnswers(answers: AdvisorAnswers, locale: Locale) {
  const labels = locale === "ja"
    ? {
        userType: "利用者",
        ageRange: "年齢帯",
        walkingAbility: "歩行のご様子",
        primaryScenario: "主な用途",
        usageEnvironment: "利用環境",
        needFoldable: "折りたたみ・収納性",
        carTrunkFit: "車載",
        useFrequency: "利用頻度",
        budgetRange: "予算帯",
        safetyNote: "特記事項",
      }
    : {
        userType: "User",
        ageRange: "Age range",
        walkingAbility: "Walking ability",
        primaryScenario: "Primary scenario",
        usageEnvironment: "Environment",
        needFoldable: "Foldable / compact need",
        carTrunkFit: "Car trunk fit",
        useFrequency: "Frequency",
        budgetRange: "Budget",
        safetyNote: "Special note",
      };

  return Object.entries(answers).reduce<Record<string, string>>((acc, [key, value]) => {
    acc[labels[key as keyof typeof labels]] = String(value || "");
    return acc;
  }, {});
}
