import { promises as fs } from "fs";
import path from "path";

import { routeSupportActions } from "@/lib/ai/support/action-router";
import { getConversationPolicy } from "@/lib/ai/support/conversation-policy";
import { buildDeterministicSupportReply, buildSupportAssistantPrompt } from "@/lib/ai/support/prompt-builder";
import { detectConversationLocale, shouldOfferActions } from "@/lib/ai/support/runtime-helpers";
import {
  classifySupportScenario,
  type SupportAssistantLocale,
  type SupportConversationMessage,
  type SupportIdentity,
  type SupportIssueType,
} from "@/lib/ai/support/scenario-engine";
import { generateSupportAssistantText, type SupportGatewayUsage } from "@/lib/ai/support/model-gateway";
import { buildOpenClawCapabilityPlan } from "@/lib/server/openclawCapabilities";
import { diagnoseOpenClawConversationSample, type OpenClawReflectionIssueTag } from "@/lib/server/openclawReflection";
import { getHinataKnowledgePacket } from "@/lib/server/hinataKnowledge";
import type {
  HinataMemorySnapshot,
  HinataRelationshipStage,
  HinataThreadState,
  HinataUserState,
} from "@/lib/server/hinataMemory";

export type HinataEvalCase = {
  id: string;
  language: "ja" | "en" | "mixed";
  scenario: string;
  turn_context: string[];
  expected_good_behavior: string;
  expected_bad_behavior: string;
  scoring_dimensions: {
    naturalness: string;
    warmth: string;
    language_follow: string;
    non_template_feel: string;
    continuity: string;
    emotional_attunement: string;
    over_structuring_risk: string;
    premature_action_risk: string;
    memory_use_quality: string;
  };
};

export type HinataEvalCaseResult = {
  id: string;
  language: string;
  scenario: string;
  status: "pass" | "warn" | "fail";
  assistantOutput: string;
  provider: string;
  model: string;
  fallbackUsed: boolean;
  issueTags: OpenClawReflectionIssueTag[];
  notes: string[];
};

export type HinataEvalReport = {
  generatedAt: string;
  suitePath: string;
  totals: {
    cases: number;
    pass: number;
    warn: number;
    fail: number;
  };
  runtime: {
    providersUsed: string[];
    modelsUsed: string[];
    fallbackCases: number;
    providerBackedCases: number;
  };
  issueSummary: Record<string, number>;
  thresholds: {
    config: Partial<Record<OpenClawReflectionIssueTag, number>>;
    checks: Array<{
      tag: OpenClawReflectionIssueTag;
      actual: number;
      threshold: number;
      passed: boolean;
    }>;
    passed: boolean;
  };
  providerCoverage: {
    config: {
      requireProvider: boolean;
      maxFallbackCases: number | null;
      minProviderCases: number | null;
    };
    actual: {
      totalCases: number;
      fallbackCases: number;
      providerBackedCases: number;
    };
    checks: Array<{
      kind: "max_fallback_cases" | "min_provider_cases";
      actual: number;
      threshold: number;
      passed: boolean;
    }>;
    passed: boolean;
  };
  results: HinataEvalCaseResult[];
};

export type HinataEvalThresholdConfig = Partial<Record<OpenClawReflectionIssueTag, number>>;
export type HinataEvalProviderCoverageConfig = {
  requireProvider: boolean;
  maxFallbackCases: number | null;
  minProviderCases: number | null;
};

function nowIso() {
  return new Date().toISOString();
}

function inferIdentityAndIssueType(scenario: string): {
  identity: SupportIdentity;
  issueType: SupportIssueType;
} {
  if (/(family|share)/i.test(scenario)) {
    return { identity: "family", issueType: "family_mobility_support" };
  }
  if (/(product)/i.test(scenario)) {
    return { identity: "self", issueType: "product_guidance" };
  }
  if (/(institution)/i.test(scenario)) {
    return { identity: "institution", issueType: "institutional_inquiry" };
  }
  if (/(booking)/i.test(scenario)) {
    return { identity: "self", issueType: "consultation_booking" };
  }
  return { identity: "self", issueType: "mobility_anxiety" };
}

function detectCaseFallbackLocale(input: HinataEvalCase): SupportAssistantLocale {
  if (input.language === "en") return "en";
  return "ja";
}

function validateEvalCase(candidate: unknown, index: number): HinataEvalCase {
  if (!candidate || typeof candidate !== "object") {
    throw new Error(`Invalid eval case at index ${index}: not an object`);
  }
  const record = candidate as Record<string, unknown>;
  const turnContext = Array.isArray(record.turn_context) ? record.turn_context : null;
  if (
    typeof record.id !== "string" ||
    typeof record.language !== "string" ||
    typeof record.scenario !== "string" ||
    !turnContext ||
    !turnContext.every((value) => typeof value === "string")
  ) {
    throw new Error(`Invalid eval case at index ${index}: missing required fields`);
  }
  return record as unknown as HinataEvalCase;
}

export async function loadHinataEvalSuite(filePath: string) {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("Hinata eval suite must be a JSON array");
  }
  return parsed.map(validateEvalCase);
}

function inferRelationshipStage(messageCount: number): HinataRelationshipStage {
  if (messageCount >= 6) return "follow_up_ready";
  if (messageCount >= 3) return "understanding";
  return "new";
}

function summarizeText(text: string, max = 120) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > max ? `${normalized.slice(0, max - 3)}...` : normalized;
}

function extractOpenQuestion(text: string) {
  return (
    text
      .split(/\n+/)
      .map((entry) => entry.trim())
      .find((entry) => entry.endsWith("？") || entry.endsWith("?")) || null
  );
}

function updateOfflineMemory(input: {
  previous: HinataMemorySnapshot | null;
  locale: SupportAssistantLocale;
  identity: SupportIdentity;
  scenarioLabel: string;
  scenarioName: string;
  userMessage: string;
  assistantMessage: string;
  actionTitle: string | null;
  history: SupportConversationMessage[];
}) {
  const previous = input.previous;
  const messageCount = input.history.length + 2;
  const timestamp = nowIso();
  const profile: HinataUserState = {
    id: previous?.profile?.id || "offline_profile_eval",
    ownerKey: previous?.resolvedOwnerKey || "offline:eval-user",
    ownerType: "session",
    principalId: null,
    accountId: null,
    sessionId: "offline-session",
    lineUserId: null,
    channelIdentity: {
      webSessionId: "offline-session",
      accountId: null,
      lineUserId: null,
    },
    role: input.identity,
    concernSummary: summarizeText(input.userMessage),
    preferredTone: "warm",
    preferredVerbosity: "short",
    followUpPreference: "gentle_single_question",
    relationshipStage: inferRelationshipStage(messageCount),
    latestSummary: summarizeText(input.assistantMessage, 160),
    importantTags: [input.identity, input.scenarioName].filter(Boolean),
    reminderPreference: "unset",
    channelContinuationPreference: "web",
    familySharingPreference: input.identity === "family" ? "yes" : "unknown",
    productInterestState: input.scenarioName === "product_guidance" ? "considering" : "unknown",
    createdAt: previous?.profile?.createdAt || timestamp,
    updatedAt: timestamp,
  };
  const thread: HinataThreadState = {
    id: previous?.thread?.id || "offline_thread_eval",
    ownerKey: profile.ownerKey,
    locale: input.locale,
    sessionId: "offline-session",
    accountId: null,
    principalId: null,
    currentTopic: input.scenarioLabel,
    recentMessageSummary: summarizeText(
      [...input.history, { role: "user", content: input.userMessage }, { role: "assistant", content: input.assistantMessage }]
        .map((entry) => `${entry.role}: ${entry.content}`)
        .join(" / "),
      560,
    ),
    openQuestion: extractOpenQuestion(input.assistantMessage),
    latestNextStep: input.actionTitle,
    continuityMarkers: [input.scenarioName, input.identity],
    latestUserMessage: input.userMessage.trim(),
    latestAssistantMessage: input.assistantMessage.trim(),
    messageCount,
    createdAt: previous?.thread?.createdAt || timestamp,
    updatedAt: timestamp,
  };
  return {
    resolvedOwnerKey: profile.ownerKey,
    ownerType: "session" as const,
    profile,
    thread,
  };
}

function scoreCase(input: {
  diagnosisTags: OpenClawReflectionIssueTag[];
  fallbackUsed: boolean;
  expectedLanguage: string;
}) {
  const hardFailures = ["language_follow_failure", "unnatural_memory_use"] as OpenClawReflectionIssueTag[];
  if (input.fallbackUsed && input.expectedLanguage !== "n/a") {
    return "warn" as const;
  }
  if (input.diagnosisTags.some((tag) => hardFailures.includes(tag))) {
    return "fail" as const;
  }
  if (input.diagnosisTags.length > 0) {
    return "warn" as const;
  }
  return "pass" as const;
}

const DEFAULT_THRESHOLDS: HinataEvalThresholdConfig = {
  language_follow_failure: 0,
  premature_action_suggestion: 0,
  templated_opening: 0,
};

const STRICT_THRESHOLDS: HinataEvalThresholdConfig = {
  ...DEFAULT_THRESHOLDS,
  over_structured_early_turn: 0,
  repeated_questioning: 0,
};

function readThresholdOverride(tag: OpenClawReflectionIssueTag) {
  const envKey = `HINATA_EVAL_THRESHOLD_${tag.toUpperCase()}`;
  const raw = process.env[envKey];
  if (typeof raw !== "string" || raw.trim() === "") {
    return null;
  }
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export function resolveHinataEvalThresholds(): HinataEvalThresholdConfig {
  const base = process.env.HINATA_EVAL_STRICT === "1" ? STRICT_THRESHOLDS : DEFAULT_THRESHOLDS;
  const resolved: HinataEvalThresholdConfig = { ...base };

  for (const tag of Object.keys(base) as OpenClawReflectionIssueTag[]) {
    const override = readThresholdOverride(tag);
    if (override !== null) {
      resolved[tag] = override;
    }
  }

  return resolved;
}

function readNonNegativeNumberEnv(name: string) {
  const raw = process.env[name];
  if (typeof raw !== "string" || raw.trim() === "") {
    return null;
  }
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export function resolveHinataEvalProviderCoverageConfig(): HinataEvalProviderCoverageConfig {
  const requireProvider = process.env.HINATA_EVAL_REQUIRE_PROVIDER === "1";
  const maxFallbackCases = readNonNegativeNumberEnv("HINATA_EVAL_MAX_FALLBACK_CASES");
  const minProviderCases = readNonNegativeNumberEnv("HINATA_EVAL_MIN_PROVIDER_CASES");

  if (maxFallbackCases !== null || minProviderCases !== null) {
    return {
      requireProvider,
      maxFallbackCases,
      minProviderCases,
    };
  }

  if (requireProvider) {
    return {
      requireProvider: true,
      maxFallbackCases: 0,
      minProviderCases: 1,
    };
  }

  return {
    requireProvider: false,
    maxFallbackCases: null,
    minProviderCases: null,
  };
}

export async function runHinataOfflineEval(options?: {
  suitePath?: string;
  reportPath?: string;
  caseLimit?: number;
  thresholds?: HinataEvalThresholdConfig;
  providerCoverage?: HinataEvalProviderCoverageConfig;
}) {
  const suitePath =
    options?.suitePath || path.join(process.cwd(), "data", "hinata-eval-suite-v1.json");
  const reportPath =
    options?.reportPath || path.join(process.cwd(), "test-results", "hinata-eval-report.json");
  const cases = await loadHinataEvalSuite(suitePath);
  const selectedCases = typeof options?.caseLimit === "number" ? cases.slice(0, options.caseLimit) : cases;
  const results: HinataEvalCaseResult[] = [];

  for (const testCase of selectedCases) {
    const { identity, issueType } = inferIdentityAndIssueType(testCase.scenario);
    let history: SupportConversationMessage[] = [];
    let memory: HinataMemorySnapshot | null = null;
    let lastUsage: SupportGatewayUsage | null = null;
    let lastActions: { id: string; title: string }[] = [];
    let assistantMessage = "";

    for (const userMessage of testCase.turn_context) {
      const fallbackLocale = detectCaseFallbackLocale(testCase);
      const locale = detectConversationLocale(userMessage, history, fallbackLocale);
      const scenarioResult = classifySupportScenario({
        locale,
        identity,
        issueType,
        message: userMessage,
        messages: history,
      });
      const policy = getConversationPolicy(scenarioResult, locale);
      const recommendedActions = shouldOfferActions({
        locale,
        userMessage,
        history,
      })
        ? routeSupportActions(scenarioResult, locale)
        : [];
      const capabilityPlan = buildOpenClawCapabilityPlan({
        scenario: scenarioResult,
        policy,
        memory,
      });
      const knowledge = await getHinataKnowledgePacket({
        locale,
        scenario: scenarioResult,
        userMessage,
      });
      const prompt = buildSupportAssistantPrompt({
        locale,
        userMessage,
        history,
        scenario: scenarioResult,
        policy,
        actions: recommendedActions,
        memory,
        capabilityPlan,
        knowledge,
      });
      const gatewayResult = await generateSupportAssistantText({
        locale,
        userMessage,
        history,
        scenario: scenarioResult,
        policy,
        actions: recommendedActions,
        prompt,
        memory,
        capabilityPlan,
        knowledge,
      });
      const deterministic = buildDeterministicSupportReply({
        locale,
        userMessage,
        history,
        scenario: scenarioResult,
        policy,
        actions: recommendedActions,
        memory,
      });
      assistantMessage = gatewayResult?.text || deterministic.message;
      lastUsage =
        gatewayResult?.usage || {
          provider: "deterministic",
          model: "deterministic",
          promptChars: prompt.length,
          outputChars: assistantMessage.length,
          fallbackUsed: true,
        };
      lastActions = recommendedActions;
      memory = updateOfflineMemory({
        previous: memory,
        locale,
        identity: scenarioResult.persona,
        scenarioLabel: scenarioResult.labels.scenario,
        scenarioName: scenarioResult.scenario,
        userMessage,
        assistantMessage,
        actionTitle: recommendedActions[0]?.title || null,
        history,
      });
      history = [...history, { role: "user", content: userMessage }, { role: "assistant", content: assistantMessage }];
    }

    const latestUserMessage = testCase.turn_context[testCase.turn_context.length - 1] || "";
    const diagnosis = diagnoseOpenClawConversationSample({
      userMessage: latestUserMessage,
      assistantMessage,
      history: history.slice(0, -1),
      actionsShown: lastActions.map((action) => action.id),
      memory,
    });
    const status = scoreCase({
      diagnosisTags: diagnosis.issueTags,
      fallbackUsed: lastUsage?.fallbackUsed ?? true,
      expectedLanguage: testCase.scoring_dimensions.language_follow,
    });

    results.push({
      id: testCase.id,
      language: testCase.language,
      scenario: testCase.scenario,
      status,
      assistantOutput: assistantMessage,
      provider: lastUsage?.provider || "deterministic",
      model: lastUsage?.model || "deterministic",
      fallbackUsed: lastUsage?.fallbackUsed ?? true,
      issueTags: diagnosis.issueTags,
      notes: [
        testCase.expected_good_behavior,
        diagnosis.diagnosis,
        ...diagnosis.recommendedImprovement.slice(0, 2),
      ].filter(Boolean),
    });
  }

  const issueSummary = results.reduce<Record<string, number>>((acc, result) => {
    for (const tag of result.issueTags) {
      acc[tag] = (acc[tag] || 0) + 1;
    }
    return acc;
  }, {});

  const thresholdConfig = options?.thresholds || resolveHinataEvalThresholds();
  const thresholdChecks = (Object.keys(thresholdConfig) as OpenClawReflectionIssueTag[]).map((tag) => {
    const actual = issueSummary[tag] || 0;
    const threshold = thresholdConfig[tag] ?? 0;
    return {
      tag,
      actual,
      threshold,
      passed: actual <= threshold,
    };
  });
  const fallbackCases = results.filter((result) => result.fallbackUsed).length;
  const providerBackedCases = results.length - fallbackCases;
  const providerCoverageConfig = options?.providerCoverage || resolveHinataEvalProviderCoverageConfig();
  const providerCoverageChecks: HinataEvalReport["providerCoverage"]["checks"] = [];

  if (providerCoverageConfig.maxFallbackCases !== null) {
    providerCoverageChecks.push({
      kind: "max_fallback_cases",
      actual: fallbackCases,
      threshold: providerCoverageConfig.maxFallbackCases,
      passed: fallbackCases <= providerCoverageConfig.maxFallbackCases,
    });
  }

  if (providerCoverageConfig.minProviderCases !== null) {
    providerCoverageChecks.push({
      kind: "min_provider_cases",
      actual: providerBackedCases,
      threshold: providerCoverageConfig.minProviderCases,
      passed: providerBackedCases >= providerCoverageConfig.minProviderCases,
    });
  }

  const report: HinataEvalReport = {
    generatedAt: nowIso(),
    suitePath,
    totals: {
      cases: results.length,
      pass: results.filter((result) => result.status === "pass").length,
      warn: results.filter((result) => result.status === "warn").length,
      fail: results.filter((result) => result.status === "fail").length,
    },
    runtime: {
      providersUsed: Array.from(new Set(results.map((result) => result.provider))),
      modelsUsed: Array.from(new Set(results.map((result) => result.model))),
      fallbackCases,
      providerBackedCases,
    },
    issueSummary,
    thresholds: {
      config: thresholdConfig,
      checks: thresholdChecks,
      passed: thresholdChecks.every((check) => check.passed),
    },
    providerCoverage: {
      config: providerCoverageConfig,
      actual: {
        totalCases: results.length,
        fallbackCases,
        providerBackedCases,
      },
      checks: providerCoverageChecks,
      passed: providerCoverageChecks.every((check) => check.passed),
    },
    results,
  };

  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");
  return report;
}
