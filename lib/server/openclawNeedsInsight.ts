import { promises as fs } from "fs";
import path from "path";

import elderNeedsTaxonomy from "@/data/hinata-domain-needs-taxonomy-v1.json";
import feedbackMapping from "@/data/hinata-feedback-mapping-v1.json";
import matchingPlaybook from "@/data/hinata-matching-playbook-v1.json";

export type HinataNeedsSignal = {
  speakerType: "older_adult" | "family_member" | "institutional_contact" | "unclear";
  needCategory: string | null;
  secondaryNeedCategories: string[];
  concernIntensity: "low" | "medium" | "high" | "unclear";
  mobilityImpact: "none" | "low" | "medium" | "high" | "unclear";
  emotionalConcern: "none" | "low" | "medium" | "high" | "unclear";
  dignityIndependenceConcern: "none" | "low" | "medium" | "high" | "unclear";
  familyBurdenConcern: "none" | "low" | "medium" | "high" | "unclear";
  confidenceLevel: "low" | "medium" | "high" | "unclear";
  readinessForSolutionDiscussion: "not_ready" | "lightly_open" | "ready" | "explicitly_requesting" | "unclear";
  opennessToProductServiceDiscussion: "closed" | "cautious" | "open" | "explicit" | "unclear";
  trialExplanationNeeded: "yes" | "maybe" | "no" | "unclear";
  practicalConstraints: string[];
  userGoal: Array<
    "conversation_only" | "clarification" | "concrete_next_step" | "product_guidance" | "family_explanation" | "process_subsidy_guidance"
  >;
  conversationStage: "opening" | "clarifying" | "understanding" | "solution_consideration" | "follow_up";
  extractionConfidence: "low" | "medium" | "high";
  evidenceExcerptPolicy: "none" | "short_quote" | "summary_only";
  evidenceExcerpt: string | null;
  interpretationNote: string;
};

export type NeedsSignalExtractionInput = {
  latestUserMessage: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
};

export type NeedsInsightAggregate = {
  timeWindow: {
    startAt: string;
    endAt: string;
    label: string;
  };
  volume: {
    conversationCount: number;
    signalCount: number;
    uniqueOwnerCountEstimate: number | null;
  };
  speakerTypeDistribution: Record<string, number>;
  needCategoryCounts: Record<string, number>;
  hesitationBarrierCounts: Record<string, number>;
  readinessToSolutionDistribution: Record<string, number>;
  topPracticalConstraints: Array<{ constraint: string; count: number }>;
  topFamilyConcerns: Array<{ concern: string; count: number }>;
  topDignityAutonomyConcerns: Array<{ concern: string; count: number }>;
  topTrialExplanationRequests: Array<{ label: string; count: number }>;
  topProcessSubsidyRequests: Array<{ label: string; count: number }>;
  interpretationNotes: string[];
};

export type NeedsInsightFeedbackCandidate = {
  patternId: string;
  matchedBecause: string[];
  productSelectionImplications: string[];
  serviceDesignImplications: string[];
  productDesignImplications: string[];
  contentExplanationImplications: string[];
};

export type OpenClawNeedsSignalArtifact = {
  id: string;
  createdAt: string;
  threadId: string | null;
  ownerKey: string | null;
  scenario: string | null;
  locale: string | null;
  signal: HinataNeedsSignal;
};

const productionDataDir = path.join("/tmp", "yorisou-phase1");
const localDataDir = path.join(process.cwd(), "data");
const dataDir = process.env.YORISOU_DATA_DIR || (process.env.NODE_ENV === "production" ? productionDataDir : localDataDir);
const needsSignalsFile = path.join(dataDir, "phase1-openclaw-needs-signals.json");

function artifactReadFiles() {
  const candidates = [
    needsSignalsFile,
    path.join(productionDataDir, "phase1-openclaw-needs-signals.json"),
    path.join(localDataDir, "phase1-openclaw-needs-signals.json"),
  ];
  return [...new Set(candidates)];
}

const taxonomyIds = new Set((elderNeedsTaxonomy as Array<{ id: string }>).map((entry) => entry.id));
const familyHints = ["母", "父", "祖母", "祖父", "親", "家族", "mother", "father", "mom", "dad", "grandmother", "grandfather", "family"];
const institutionHints = ["自治体", "施設", "事業者", "地域", "organization", "facility", "local government"];
const highConcernHints = ["怖い", "とても不安", "強く心配", "afraid", "very worried", "scared"];
const mediumConcernHints = ["不安", "心配", "重い", "worried", "uneasy", "hard"];
const mobilityHighHints = ["通院", "買い物", "外に出", "clinic", "shopping", "going out"];
const dignityHints = ["世話されたくない", "大げさなのは嫌", "迷惑をかけたくない", "taken care of", "burden my family", "too obvious"];
const familyBurdenHints = ["家族", "付き添い", "負担", "family", "accompany", "burden"];
const productOpenHints = ["製品", "どれが合う", "試したい", "compare", "product", "trial", "fit"];
const processHints = ["補助", "手順", "次に何", "予約", "subsidy", "process", "next step", "booking"];
const familyExplainHints = ["家族に説明", "共有", "explain to my family", "share with family"];
const constraintMap: Array<{ id: string; hints: string[] }> = [
  { id: "stairs", hints: ["階段", "段差", "stairs", "steps"] },
  { id: "slope", hints: ["坂", "slope", "hill"] },
  { id: "distance", hints: ["距離", "長く歩", "far", "distance", "walking"] },
  { id: "storage", hints: ["保管", "置き場所", "storage"] },
  { id: "clinic_route", hints: ["通院", "病院", "clinic", "hospital"] },
  { id: "shopping_route", hints: ["買い物", "スーパー", "shopping", "store"] },
  { id: "taxi_reluctance", hints: ["タクシー", "taxi"] },
  { id: "schedule_coordination", hints: ["予定", "付き添い", "schedule", "arranging"] },
];

function includesAny(text: string, hints: string[]) {
  return hints.some((hint) => text.includes(hint));
}

function compact(text: string, limit = 120) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > limit ? `${normalized.slice(0, limit - 3)}...` : normalized;
}

function nowIso() {
  return new Date().toISOString();
}

function createId() {
  return `needs_signal_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

async function readArtifacts() {
  const merged = new Map<string, OpenClawNeedsSignalArtifact>();

  for (const file of artifactReadFiles()) {
    try {
      const artifacts = JSON.parse(await fs.readFile(file, "utf8")) as OpenClawNeedsSignalArtifact[];
      for (const artifact of artifacts) {
        merged.set(artifact.id, artifact);
      }
    } catch {
      continue;
    }
  }

  return [...merged.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function writeArtifacts(artifacts: OpenClawNeedsSignalArtifact[]) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(needsSignalsFile, JSON.stringify(artifacts.slice(0, 500), null, 2) + "\n", "utf8");
}

function inferSpeakerType(text: string): HinataNeedsSignal["speakerType"] {
  if (includesAny(text, institutionHints)) return "institutional_contact";
  if (includesAny(text, familyHints)) return "family_member";
  if (/(私|自分|I |my |me )/i.test(text)) return "older_adult";
  return "unclear";
}

function inferNeedCategory(text: string): string | null {
  if (/(転|足元|fall|stairs)/i.test(text)) return "fear_of_falling";
  if (/(一人で|alone|出たがら|go out alone)/i.test(text)) return "reluctance_to_go_out_alone";
  if (/(自信|confidence)/i.test(text)) return "reduced_confidence";
  if (/(こもり|出かけなく|hardly goes out|isolation)/i.test(text)) return "isolation_reduced_outings";
  if (/(迷惑|burden my family|負担)/i.test(text)) return "fear_of_burdening_family";
  if (/(世話されたく|大げさなのは嫌|taken care of|too obvious)/i.test(text)) return "dignity_and_independence";
  if (/(距離|買い物|通院|short trips|clinic|shopping)/i.test(text)) return "low_distance_mobility_difficulty";
  if (/(何が合う|what would help|どこから考|not sure what kind of help)/i.test(text)) return "unclear_needed_help";
  if (/(試して|trial|説明|explain)/i.test(text)) return "need_for_trial_and_explanation";
  if (/(補助|手順|次に何|subsidy|process|next step)/i.test(text)) return "subsidy_process_next_steps_uncertainty";
  if (includesAny(text, familyHints)) return "family_worry_about_parent";
  if (/(不安|心配|worried|uneasy|harder lately)/i.test(text)) return "mobility_anxiety_general";
  return null;
}

function inferConcernIntensity(text: string): HinataNeedsSignal["concernIntensity"] {
  if (includesAny(text, highConcernHints)) return "high";
  if (includesAny(text, mediumConcernHints)) return "medium";
  return "unclear";
}

function inferMobilityImpact(text: string): HinataNeedsSignal["mobilityImpact"] {
  if (/(通院できない|買い物に行けない|cannot go out|hardly goes out)/i.test(text)) return "high";
  if (includesAny(text, mobilityHighHints)) return "medium";
  return "unclear";
}

function inferStage(history: NeedsSignalExtractionInput["history"]): HinataNeedsSignal["conversationStage"] {
  const userTurns = (history || []).filter((entry) => entry.role === "user").length + 1;
  if (userTurns <= 1) return "opening";
  if (userTurns === 2) return "clarifying";
  if (userTurns <= 4) return "understanding";
  return "follow_up";
}

export function extractNeedsSignalFromConversation(input: NeedsSignalExtractionInput): HinataNeedsSignal {
  const text = input.latestUserMessage.trim();
  const lower = text.toLowerCase();
  const needCategory = inferNeedCategory(text);
  const practicalConstraints = constraintMap
    .filter((entry) => includesAny(lower, entry.hints.map((hint) => hint.toLowerCase())))
    .map((entry) => entry.id);
  const userGoal: HinataNeedsSignal["userGoal"] = [];

  if (/(聞いてほしい|話を聞|just listen|talk)/i.test(text)) userGoal.push("conversation_only");
  if (/(整理|わからない|clarify|sort this out)/i.test(text)) userGoal.push("clarification");
  if (/(次に何|what should I do|next step|予約)/i.test(text)) userGoal.push("concrete_next_step");
  if (includesAny(lower, productOpenHints.map((hint) => hint.toLowerCase()))) userGoal.push("product_guidance");
  if (includesAny(lower, familyExplainHints.map((hint) => hint.toLowerCase()))) userGoal.push("family_explanation");
  if (includesAny(lower, processHints.map((hint) => hint.toLowerCase()))) userGoal.push("process_subsidy_guidance");
  if (userGoal.length === 0) userGoal.push("clarification");

  const readinessForSolutionDiscussion: HinataNeedsSignal["readinessForSolutionDiscussion"] =
    userGoal.includes("product_guidance") || userGoal.includes("concrete_next_step")
      ? includesAny(lower, ["trial", "試", "compare", "比較", "予約", "booking"])
        ? "explicitly_requesting"
        : "ready"
      : userGoal.includes("clarification") || userGoal.includes("conversation_only")
        ? "not_ready"
        : "lightly_open";

  const opennessToProductServiceDiscussion: HinataNeedsSignal["opennessToProductServiceDiscussion"] =
    includesAny(lower, productOpenHints.map((hint) => hint.toLowerCase()))
      ? /(trial|試|compare|比較|どれが合う|fit)/i.test(text)
        ? "explicit"
        : "open"
      : /嫌|not want|don't want/i.test(text)
        ? "closed"
        : "cautious";

  const extractionConfidence: HinataNeedsSignal["extractionConfidence"] =
    needCategory && practicalConstraints.length > 0 ? "high" : needCategory ? "medium" : "low";

  return {
    speakerType: inferSpeakerType(text),
    needCategory: needCategory && taxonomyIds.has(needCategory) ? needCategory : null,
    secondaryNeedCategories: [],
    concernIntensity: inferConcernIntensity(text),
    mobilityImpact: inferMobilityImpact(text),
    emotionalConcern: /(不安|心配|怖い|重い|worried|afraid|uneasy)/i.test(text) ? "medium" : "unclear",
    dignityIndependenceConcern: includesAny(lower, dignityHints.map((hint) => hint.toLowerCase())) ? "medium" : "none",
    familyBurdenConcern: includesAny(lower, familyBurdenHints.map((hint) => hint.toLowerCase())) ? "medium" : "none",
    confidenceLevel: /(自信がない|confidence|harder lately|不安)/i.test(text) ? "low" : "unclear",
    readinessForSolutionDiscussion,
    opennessToProductServiceDiscussion,
    trialExplanationNeeded: /(trial|試|説明|explain)/i.test(text) ? "yes" : /家族|family/i.test(text) ? "maybe" : "unclear",
    practicalConstraints,
    userGoal,
    conversationStage: inferStage(input.history),
    extractionConfidence,
    evidenceExcerptPolicy: "short_quote",
    evidenceExcerpt: compact(text, 90),
    interpretationNote:
      extractionConfidence === "low"
        ? "Keep ambiguity. Treat this as a lightweight signal, not a strong classification."
        : "Use as a cautious user-needs signal. Do not treat it as medical or purchase intent certainty.",
  };
}

export async function recordNeedsSignalArtifact(input: {
  latestUserMessage: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  threadId?: string | null;
  ownerKey?: string | null;
  scenario?: string | null;
  locale?: string | null;
}) {
  if (!input.latestUserMessage.trim()) {
    return null;
  }

  const signal = extractNeedsSignalFromConversation({
    latestUserMessage: input.latestUserMessage,
    history: input.history,
  });

  const artifact: OpenClawNeedsSignalArtifact = {
    id: createId(),
    createdAt: nowIso(),
    threadId: input.threadId || null,
    ownerKey: input.ownerKey || null,
    scenario: input.scenario || null,
    locale: input.locale || null,
    signal,
  };

  const artifacts = await readArtifacts();
  artifacts.unshift(artifact);
  await writeArtifacts(artifacts);
  return artifact;
}

export async function readNeedsSignalArtifacts() {
  return readArtifacts();
}

export function buildNeedsInsightAggregate(input: {
  signals: HinataNeedsSignal[];
  startAt: string;
  endAt: string;
  label: string;
}): NeedsInsightAggregate {
  const countMap = (values: string[]) =>
    values.reduce<Record<string, number>>((acc, value) => {
      if (!value) return acc;
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});

  const topList = (map: Record<string, number>) =>
    Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([constraint, count]) => ({ constraint, count }));

  const speakerTypeDistribution = countMap(input.signals.map((signal) => signal.speakerType));
  const needCategoryCounts = countMap(input.signals.map((signal) => signal.needCategory || "unclear"));
  const readinessToSolutionDistribution = countMap(input.signals.map((signal) => signal.readinessForSolutionDiscussion));
  const hesitationBarrierCounts = countMap(
    input.signals.flatMap((signal) => [
      ...(signal.practicalConstraints || []),
      ...(signal.dignityIndependenceConcern !== "none" ? ["dignity_autonomy"] : []),
      ...(signal.familyBurdenConcern !== "none" ? ["family_burden"] : []),
      ...(signal.trialExplanationNeeded === "yes" ? ["trial_explanation_needed"] : []),
    ]),
  );

  return {
    timeWindow: {
      startAt: input.startAt,
      endAt: input.endAt,
      label: input.label,
    },
    volume: {
      conversationCount: input.signals.length,
      signalCount: input.signals.length,
      uniqueOwnerCountEstimate: null,
    },
    speakerTypeDistribution,
    needCategoryCounts,
    hesitationBarrierCounts,
    readinessToSolutionDistribution,
    topPracticalConstraints: topList(countMap(input.signals.flatMap((signal) => signal.practicalConstraints))),
    topFamilyConcerns: topList(
      countMap(
        input.signals
          .filter((signal) => signal.familyBurdenConcern !== "none" || signal.speakerType === "family_member")
          .map((signal) => signal.needCategory || "family_related_unclear"),
      ),
    ).map(({ constraint, count }) => ({ concern: constraint, count })),
    topDignityAutonomyConcerns: topList(
      countMap(
        input.signals
          .filter((signal) => signal.dignityIndependenceConcern !== "none")
          .map((signal) => signal.needCategory || "dignity_related_unclear"),
      ),
    ).map(({ constraint, count }) => ({ concern: constraint, count })),
    topTrialExplanationRequests: topList(
      countMap(
        input.signals
          .filter((signal) => signal.trialExplanationNeeded === "yes" || signal.trialExplanationNeeded === "maybe")
          .map((signal) => signal.needCategory || "trial_explanation_unclear"),
      ),
    ).map(({ constraint, count }) => ({ label: constraint, count })),
    topProcessSubsidyRequests: topList(
      countMap(
        input.signals
          .filter((signal) => signal.userGoal.includes("process_subsidy_guidance"))
          .map((signal) => signal.needCategory || "process_unclear"),
      ),
    ).map(({ constraint, count }) => ({ label: constraint, count })),
    interpretationNotes: [
      "Use this aggregate as a cautious design-review aid, not as a final product strategy conclusion.",
      `This schema is aligned to ${taxonomyIds.size} elder-needs taxonomy categories and ${(
        matchingPlaybook as Array<{ id: string }>
      ).length} matching playbook patterns.`,
    ],
  };
}

export function deriveNeedsFeedbackCandidates(input: { aggregate: NeedsInsightAggregate }) {
  const aggregate = input.aggregate;
  const categorySet = new Set(
    aggregate.topFamilyConcerns
      .map((entry) => entry.concern)
      .concat(aggregate.topDignityAutonomyConcerns.map((entry) => entry.concern))
      .concat(Object.keys(aggregate.needCategoryCounts)),
  );

  const readiness = aggregate.readinessToSolutionDistribution;
  const candidates: NeedsInsightFeedbackCandidate[] = [];

  for (const mapping of feedbackMapping as Array<{
    pattern_id: string;
    signal_conditions?: {
      need_categories?: string[];
      concern_intensity?: string[];
      readiness_for_solution_discussion?: string[];
      user_goal?: string[];
      practical_constraints?: string[];
    };
    product_selection_implications: string[];
    service_design_implications: string[];
    product_design_implications: string[];
    content_explanation_implications: string[];
  }>) {
    const matchedBecause: string[] = [];
    const conditions = mapping.signal_conditions || {};

    if (conditions.need_categories?.some((category) => categorySet.has(category))) {
      matchedBecause.push("need_category");
    }
    if (
      conditions.readiness_for_solution_discussion?.some(
        (value) => (readiness[value] || 0) > 0,
      )
    ) {
      matchedBecause.push("readiness_distribution");
    }
    if (
      conditions.practical_constraints?.some((constraint) =>
        aggregate.topPracticalConstraints.some((entry) => entry.constraint === constraint),
      )
    ) {
      matchedBecause.push("practical_constraint");
    }

    if (matchedBecause.length === 0) {
      continue;
    }

    candidates.push({
      patternId: mapping.pattern_id,
      matchedBecause,
      productSelectionImplications: mapping.product_selection_implications,
      serviceDesignImplications: mapping.service_design_implications,
      productDesignImplications: mapping.product_design_implications,
      contentExplanationImplications: mapping.content_explanation_implications,
    });
  }

  return candidates.slice(0, 6);
}
