import { promises as fs } from "fs";
import path from "path";

import type { SupportRecommendedAction } from "@/lib/ai/support/action-router";
import type { SupportGatewayUsage } from "@/lib/ai/support/model-gateway";
import type { SupportConversationMessage, SupportScenarioResult } from "@/lib/ai/support/scenario-engine";
import {
  ensureLocalArtifactDir,
  getOpenClawArtifactDataDir,
  getOpenClawArtifactLocalFiles,
  listMirroredOpenClawArtifacts,
  mirrorOpenClawArtifact,
} from "@/lib/server/openclawArtifactStore";
import type { HinataMemorySnapshot } from "@/lib/server/hinataMemory";
import { recordNeedsSignalArtifact } from "@/lib/server/openclawNeedsInsight";
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

export type OpenClawReflectionIssueTag =
  | "templated_opening"
  | "language_follow_failure"
  | "premature_action_suggestion"
  | "over_structured_early_turn"
  | "repeated_questioning"
  | "weak_continuity"
  | "weak_emotional_attunement"
  | "unnatural_memory_use";

export type OpenClawReflectionDiagnosis = {
  issueTags: OpenClawReflectionIssueTag[];
  diagnosis: string;
  recommendedImprovement: string[];
  memoryWriteRecommendation: "keep_light" | "write_summary_only" | "write_open_question" | "avoid_memory_write";
};

const dataDir = getOpenClawArtifactDataDir();
const reflectionFile = path.join(dataDir, "phase1-openclaw-reflections.json");

function nowIso() {
  return new Date().toISOString();
}

function createId() {
  return `openclaw_reflection_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

async function readArtifacts() {
  const merged = new Map<string, OpenClawReflectionArtifact>();
  const candidates = getOpenClawArtifactLocalFiles("reflections");

  for (const file of candidates) {
    try {
      const artifacts = JSON.parse(await fs.readFile(file, "utf8")) as OpenClawReflectionArtifact[];
      for (const artifact of artifacts) {
        merged.set(artifact.id, artifact);
      }
    } catch {
      continue;
    }
  }

  const mirroredArtifacts = await listMirroredOpenClawArtifacts<OpenClawReflectionArtifact>("reflections");
  for (const artifact of mirroredArtifacts) {
    merged.set(artifact.id, artifact);
  }

  return [...merged.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function writeArtifacts(artifacts: OpenClawReflectionArtifact[]) {
  await ensureLocalArtifactDir();
  await fs.writeFile(reflectionFile, JSON.stringify(artifacts.slice(0, 300), null, 2) + "\n", "utf8");
}

function compact(text: string, limit = 140) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > limit ? `${normalized.slice(0, limit - 3)}...` : normalized;
}

function detectMessageLanguage(text: string) {
  const hasJa = /[\u3040-\u30ff\u3400-\u9fff]/.test(text);
  const hasLatin = /[A-Za-z]/.test(text);
  if (hasJa && hasLatin) return "mixed";
  if (hasJa) return "ja";
  if (hasLatin) return "en";
  return "unknown";
}

function extractQuestionCore(text: string) {
  const questions = text
    .split(/[\n。?!？]/)
    .map((line) => line.trim())
    .filter((line) => line.includes("?") || line.includes("？") || /(でしょうか|ますか|ですか)$/.test(line));
  return questions.join(" ").toLowerCase();
}

export function diagnoseOpenClawConversationSample(input: {
  userMessage: string;
  assistantMessage: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  actionsShown?: string[];
  memory?: HinataMemorySnapshot | null;
}) : OpenClawReflectionDiagnosis {
  const issueTags: OpenClawReflectionIssueTag[] = [];
  const recommendedImprovement: string[] = [];
  const history = input.history || [];
  const userTurnCount = history.filter((entry) => entry.role === "user").length + 1;
  const latestUser = input.userMessage.trim();
  const latestAssistant = input.assistantMessage.trim();
  const userLanguage = detectMessageLanguage(latestUser);
  const assistantLanguage = detectMessageLanguage(latestAssistant);
  const lastAssistant = [...history].reverse().find((entry) => entry.role === "assistant")?.content || "";
  const lastQuestion = extractQuestionCore(lastAssistant);
  const nextQuestion = extractQuestionCore(latestAssistant);

  if (
    userTurnCount <= 2 &&
    /ご相談ありがとうございます|Yorisou can help organize|相談窓口|consultation guide/i.test(latestAssistant)
  ) {
    issueTags.push("templated_opening");
    recommendedImprovement.push("first_turn_should_start_with_natural_acknowledgement");
  }

  if (
    (userLanguage === "en" && assistantLanguage === "ja") ||
    (userLanguage === "ja" && assistantLanguage === "en")
  ) {
    issueTags.push("language_follow_failure");
    recommendedImprovement.push("follow_latest_user_language_over_page_locale");
  }

  if (userTurnCount <= 1 && (input.actionsShown?.length || 0) > 0) {
    issueTags.push("premature_action_suggestion");
    recommendedImprovement.push("delay_actions_until_conversation_has_substance");
  }

  if (
    userTurnCount <= 2 &&
    /(カテゴリ|選択|予約|導入|相談予約|support module|workflow|step 1|step 2)/i.test(latestAssistant)
  ) {
    issueTags.push("over_structured_early_turn");
    recommendedImprovement.push("keep_early_turns_conversational");
  }

  if (lastQuestion && nextQuestion && lastQuestion === nextQuestion) {
    issueTags.push("repeated_questioning");
    recommendedImprovement.push("update_follow_up_question_from_latest_user_message");
  }

  if (
    history.length > 0 &&
    latestUser.length > 0 &&
    !latestAssistant.includes(latestUser.slice(0, Math.min(6, latestUser.length))) &&
    /(続き|さっき|earlier|following up|about what I said)/i.test(latestUser)
  ) {
    issueTags.push("weak_continuity");
    recommendedImprovement.push("anchor_reply_to_thread_state_and_latest_user_message");
  }

  if (
    /(不安|心配|怖い|重い|worried|afraid|uneasy|hard)/i.test(latestUser) &&
    !/(ですね|よね|I understand|That sounds|お気持ち|気になって)/i.test(latestAssistant)
  ) {
    issueTags.push("weak_emotional_attunement");
    recommendedImprovement.push("acknowledge_emotion_before_structuring");
  }

  if (/(関係段階|プロフィール|タグ|relationship stage|profile says|memory)/i.test(latestAssistant)) {
    issueTags.push("unnatural_memory_use");
    recommendedImprovement.push("use_memory_quietly_without_exposing_it");
  }

  const diagnosis =
    issueTags.length > 0
      ? `Detected ${issueTags.length} conversation quality issue(s): ${issueTags.join(", ")}`
      : "No obvious first-pass conversation issues detected.";

  const memoryWriteRecommendation =
    issueTags.includes("unnatural_memory_use")
      ? "avoid_memory_write"
      : issueTags.includes("repeated_questioning") || issueTags.includes("weak_continuity")
        ? "write_open_question"
        : issueTags.includes("templated_opening") || issueTags.includes("premature_action_suggestion")
          ? "keep_light"
          : "write_summary_only";

  return {
    issueTags,
    diagnosis,
    recommendedImprovement,
    memoryWriteRecommendation,
  };
}

export async function recordOpenClawReflection(input: {
  scenario: SupportScenarioResult;
  userMessage: string;
  assistantMessage: string;
  usage: SupportGatewayUsage;
  history?: SupportConversationMessage[];
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
  await mirrorOpenClawArtifact("reflections", artifact).catch(() => false);
  await recordNeedsSignalArtifact({
    latestUserMessage: input.userMessage,
    history: input.history,
    threadId: input.memory?.thread?.id || null,
    ownerKey: input.memory?.resolvedOwnerKey || null,
    scenario: input.scenario.scenario,
    locale: input.memory?.thread?.locale || null,
  });
  return artifact;
}

export async function readOpenClawReflectionArtifacts() {
  return readArtifacts();
}
