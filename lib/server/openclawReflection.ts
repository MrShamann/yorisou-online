import { promises as fs } from "fs";
import path from "path";

import type { SupportRecommendedAction } from "@/lib/ai/support/action-router";
import type { SupportGatewayUsage } from "@/lib/ai/support/model-gateway";
import type { SupportScenarioResult } from "@/lib/ai/support/scenario-engine";
import type { HinataMemorySnapshot } from "@/lib/server/hinataMemory";
import type { OpenClawCapabilityPlan } from "@/lib/server/openclawCapabilities";

export type OpenClawReflectionArtifact = {
  id: string;
  createdAt: string;
  threadId: string | null;
  ownerKey: string | null;
  scenario: string;
  userMessage: string;
  assistantMessage: string;
  provider: string;
  model: string;
  fallbackUsed: boolean;
  repetitionRisk: boolean;
  concernTag: string;
  suggestedImprovements: string[];
  candidateSkills: string[];
  actions: string[];
  capabilityPrimary: string;
};

const dataDir =
  process.env.YORISOU_DATA_DIR ||
  (process.env.NODE_ENV === "production" ? path.join("/tmp", "yorisou-phase1") : path.join(process.cwd(), "data"));
const reflectionFile = path.join(dataDir, "phase1-openclaw-reflections.json");

function nowIso() {
  return new Date().toISOString();
}

function createId() {
  return `openclaw_reflection_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

async function readArtifacts() {
  try {
    return JSON.parse(await fs.readFile(reflectionFile, "utf8")) as OpenClawReflectionArtifact[];
  } catch {
    return [];
  }
}

async function writeArtifacts(artifacts: OpenClawReflectionArtifact[]) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(reflectionFile, JSON.stringify(artifacts.slice(0, 300), null, 2) + "\n", "utf8");
}

function compact(text: string, limit = 140) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > limit ? `${normalized.slice(0, limit - 3)}...` : normalized;
}

export async function recordOpenClawReflection(input: {
  scenario: SupportScenarioResult;
  userMessage: string;
  assistantMessage: string;
  usage: SupportGatewayUsage;
  memory?: HinataMemorySnapshot | null;
  capabilityPlan: OpenClawCapabilityPlan;
  actions: SupportRecommendedAction[];
}) {
  const previousAssistant = input.memory?.thread?.latestAssistantMessage?.toLowerCase().trim() || "";
  const nextAssistant = input.assistantMessage.toLowerCase().trim();
  const repetitionRisk = previousAssistant.length > 0 && previousAssistant === nextAssistant;

  const suggestedImprovements: string[] = [];
  const candidateSkills: string[] = [];

  if (input.usage.fallbackUsed) suggestedImprovements.push("provider_path_recovery");
  if (repetitionRisk) {
    suggestedImprovements.push("multi_turn_repetition_guard");
    candidateSkills.push("continuity_reasoning");
  }
  if (input.scenario.scenario === "product_guidance") candidateSkills.push("product_matching");
  if (input.scenario.scenario === "family_mobility_support") candidateSkills.push("family_support_explainer");

  const artifact: OpenClawReflectionArtifact = {
    id: createId(),
    createdAt: nowIso(),
    threadId: input.memory?.thread?.id || null,
    ownerKey: input.memory?.resolvedOwnerKey || null,
    scenario: input.scenario.scenario,
    userMessage: compact(input.userMessage),
    assistantMessage: compact(input.assistantMessage, 180),
    provider: input.usage.provider,
    model: input.usage.model,
    fallbackUsed: input.usage.fallbackUsed,
    repetitionRisk,
    concernTag: input.scenario.labels.scenario,
    suggestedImprovements,
    candidateSkills,
    actions: input.actions.map((action) => action.id),
    capabilityPrimary: input.capabilityPlan.primary,
  };

  const artifacts = await readArtifacts();
  artifacts.unshift(artifact);
  await writeArtifacts(artifacts);
  return artifact;
}
