import { promises as fs } from "fs";
import path from "path";

import type { AdvisorAnswers, AdvisorRecommendation, Locale } from "@/lib/ai/yorisouAdvisor";

export type AdvisorLead = {
  name: string;
  phone: string;
  email: string;
  city: string;
  preferredContactMethod: "phone" | "email" | "either";
  interestedInTestRide: "yes" | "no";
  additionalNotes: string;
};

export type AdvisorEntry = {
  id: string;
  createdAt: string;
  locale: Locale;
  answers: AdvisorAnswers;
  recommendation: AdvisorRecommendation;
  lead: AdvisorLead;
};

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "ai-advisor-leads.json");

async function ensureStorage() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]\n", "utf8");
  }
}

export async function readAdvisorEntries() {
  await ensureStorage();
  const content = await fs.readFile(filePath, "utf8");

  try {
    const parsed = JSON.parse(content) as AdvisorEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function appendAdvisorEntry(entry: AdvisorEntry) {
  const existing = await readAdvisorEntries();
  existing.unshift(entry);
  await fs.writeFile(filePath, JSON.stringify(existing, null, 2) + "\n", "utf8");
}

export function createAdvisorEntry(input: Omit<AdvisorEntry, "id" | "createdAt">): AdvisorEntry {
  return {
    ...input,
    id: `advisor_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
}

export function getAdvisorStoragePath() {
  return filePath;
}
