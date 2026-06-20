import { assembleCanonicalDteSession } from "@/lib/yorisou/dte/session-assembly";
import { QUESTION_POOL_V2_ITEMS, QUESTION_POOL_V2_METADATA, QUESTION_POOL_V2_SESSION_ORDER } from "@/lib/yorisou/dte/questions/question-pool-v2";

const candidateQuestionsJson = { items: QUESTION_POOL_V2_ITEMS };
const targetedQuestionsJson = { items: [] as SourceQuestion[] };
const sessionSimulationJson = {
  date: QUESTION_POOL_V2_METADATA.date,
  session_id: QUESTION_POOL_V2_METADATA.session_id,
  questions: QUESTION_POOL_V2_SESSION_ORDER,
};

type OptionInput = {
  id: string;
  label: string;
  signal?: string | null;
};

type SourceQuestion = {
  candidate_id: string;
  dimension_id: string;
  dimension_label: string;
  pool: string;
  scenario_family: string;
  session_position: string;
  tone_depth: string;
  persona_fit_hint: string[];
  question: string;
  helper_text: string;
  options: OptionInput[];
  calibration_notes?: string;
};

type SessionOrderItem = {
  q: number;
  item_id: string;
  dimension_id: string;
};

export type CanonicalQuestionLifecycleStatus = "draft" | "candidate" | "approved" | "live" | "cooldown" | "retired";
export type CanonicalQuestionPoolName =
  | "candidate_pool"
  | "screened_candidate_pool"
  | "approved_pool"
  | "live_rotation_pool"
  | "cooldown_pool"
  | "retired_pool";
export type CanonicalQuestionScreeningState = "raw" | "screened" | "approved" | "live" | "cooldown" | "retired";
export type CanonicalQuestionDepthLevel = "light" | "medium" | "sharp" | "deep";
export type CanonicalQuestionEmotionalTemperature = "cool" | "neutral" | "warm" | "hot";
export type CanonicalReinforcementZone =
  | "emotional_personality"
  | "boundary_conflict_communication"
  | "decision_action"
  | "openness_uncertainty_growth";

export type CanonicalQuestionObject = {
  candidate_id: string;
  question_id: string;
  version: string;
  status: CanonicalQuestionLifecycleStatus;
  dimension_id: string;
  secondary_dimension_id: string | null;
  persona_relevance_tags: string[];
  scenario_family: string;
  japan_scene_tag: string;
  tone_tag: string;
  depth_level: CanonicalQuestionDepthLevel;
  prompt_text: string;
  option_set_id: string;
  option_text_1: string;
  option_text_2: string;
  option_text_3: string;
  option_text_4: string;
  option_text_5: string;
  option_weight_map: Record<"A" | "B" | "C" | "D" | "E", number>;
  dimension_weight_profile: {
    primary_dimension_id: string;
    secondary_dimension_id: string | null;
    core_weight: number;
    reinforcement_weight: number;
  };
  distinction_power_score: number;
  ambiguity_risk_score: number;
  first_time_allowed: boolean;
  returning_user_allowed: boolean;
  japan_reality_score: number;
  cultural_fit_notes: string[];
  social_intensity_level: number;
  emotional_temperature: CanonicalQuestionEmotionalTemperature;
  entertainment_score: number;
  shareability_potential: number;
  language_fit_score: number;
  freshness_score: number;
  exposure_count: number;
  recent_use_count: number;
  repetition_risk: number;
  neighbor_conflict_tags: string[];
  approval_state: CanonicalQuestionLifecycleStatus;
  risk_note: string | null;
  sensitivity_flag: boolean;
  requires_manual_review: boolean;
  created_at: string;
  updated_at: string;
  created_by_agent: string;
  reviewed_by: string | null;
  screening_state: CanonicalQuestionScreeningState;
  production_eligible: boolean;
  live_rotation_eligible: boolean;
  pool_name: CanonicalQuestionPoolName;
  question_number: number | null;
  question: string;
  session_position: string;
  dimension_label: string;
  pool: string;
  helper_text: string;
  options: OptionInput[];
  calibration_notes: string;
};

export type DteQuestionPools = {
  candidatePool: CanonicalQuestionObject[];
  screenedCandidatePool: CanonicalQuestionObject[];
  approvedPool: CanonicalQuestionObject[];
  liveRotationPool: CanonicalQuestionObject[];
  cooldownPool: CanonicalQuestionObject[];
  retiredPool: CanonicalQuestionObject[];
};

export type DteSessionValidationRule = {
  rule: string;
  passed: boolean;
  summary: string;
  details: Record<string, unknown>;
};

export type DteSessionValidationSummary = {
  valid: boolean;
  sessionId: string;
  questionCount: number;
  expectedQuestionCount: number;
  coreCoverageCount: number;
  expectedCoreCoverageCount: number;
  reinforcementCount: number;
  expectedReinforcementCount: number;
  uniqueDimensionCount: number;
  expectedDimensionCount: number;
  uniquePromptCount: number;
  dimensionIds: string[];
  missingDimensionIds: string[];
  depthMix: Record<CanonicalQuestionDepthLevel, number>;
  reinforcementZoneCounts: Record<CanonicalReinforcementZone, number>;
  sceneSpread: Record<string, number>;
  itemIds: string[];
  candidatePoolCount: number;
  screenedCandidatePoolCount: number;
  approvedPoolCount: number;
  liveRotationPoolCount: number;
  cooldownPoolCount: number;
  retiredPoolCount: number;
  failureReasons: string[];
  humanSummary: string;
  rules: DteSessionValidationRule[];
  operatorDebug: {
    sessionId: string;
    itemIds: string[];
    uniquePromptCount: number;
    dimensionDistribution: Record<string, number>;
    reinforcementDistribution: Record<string, number>;
    depthMix: Record<CanonicalQuestionDepthLevel, number>;
    sceneSpread: Record<string, number>;
  };
};

const RAW_DATE = `${sessionSimulationJson.date}T00:00:00.000Z`;
const CREATED_BY_AGENT = "OpenClaw question pipeline";
const SESSION_ID = sessionSimulationJson.session_id;
const EXPECTED_QUESTION_COUNT = 33;
const EXPECTED_CORE_COUNT = 21;
const EXPECTED_REINFORCEMENT_COUNT = 12;
const EXPECTED_DIMENSION_COUNT = 21;
const CANONICAL_SESSION_QUESTION_IDS = new Set((sessionSimulationJson.questions as SessionOrderItem[]).map((entry) => entry.item_id));

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function normalize(input: string) {
  return input
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[！!。．、,，·・?？]/g, "")
    .replace(/[「」『』（）()\[\]【】]/g, "");
}

function tokenize(input: string) {
  return new Set(
    normalize(input)
      .split(/[^a-z0-9ぁ-ゖァ-ヶ一-龠ー]+/g)
      .filter(Boolean),
  );
}

function jaccardSimilarity(a: string, b: string) {
  const left = tokenize(a);
  const right = tokenize(b);
  if (left.size === 0 && right.size === 0) {
    return 1;
  }
  const intersection = [...left].filter((token) => right.has(token)).length;
  const union = new Set([...left, ...right]).size;
  return union === 0 ? 0 : intersection / union;
}

function containsAny(input: string, patterns: string[]) {
  return patterns.some((pattern) => input.includes(pattern));
}

function joinText(item: SourceQuestion) {
  return [item.question, item.helper_text, ...item.options.map((option) => option.label), item.calibration_notes || ""].join(" / ");
}

function deriveToneTag(toneDepth: string) {
  if (toneDepth.includes("quiet")) return "quiet";
  if (toneDepth.includes("witty")) return "witty";
  if (toneDepth.includes("light_plus")) return "light_plus";
  if (toneDepth.includes("light")) return "light";
  if (toneDepth.includes("deep")) return "deep";
  return toneDepth || "light";
}

function deriveDepthLevel(toneDepth: string): CanonicalQuestionDepthLevel {
  if (toneDepth.includes("quiet")) return "sharp";
  if (toneDepth.includes("witty")) return "sharp";
  if (toneDepth.includes("light_plus")) return "medium";
  if (toneDepth.includes("deep")) return "deep";
  if (toneDepth.includes("light")) return "light";
  return "medium";
}

function deriveEmotionalTemperature(
  depthLevel: CanonicalQuestionDepthLevel,
  scenarioFamily: string,
): CanonicalQuestionEmotionalTemperature {
  if (depthLevel === "deep") return "hot";
  if (depthLevel === "sharp") return "warm";
  if (containsAny(scenarioFamily, ["家族", "回復", "ご褒美"])) return "warm";
  if (containsAny(scenarioFamily, ["雨", "週末", "朝"])) return "neutral";
  return "cool";
}

function deriveJapanSceneTag(item: SourceQuestion) {
  const text = `${item.question} ${item.helper_text} ${item.scenario_family} ${item.dimension_label}`;
  if (containsAny(text, ["LINE", "メッセージ", "返信", "返事", "グループ", "雑談"])) {
    return "personal messaging / LINE-like interaction";
  }
  if (containsAny(text, ["職場", "同僚", "空気", "相手", "距離感"])) {
    return "group / atmosphere reading";
  }
  if (containsAny(text, ["仕事", "家事", "責任", "用事", "同時進行", "締切", "通勤", "業務"])) {
    return "work / responsibility";
  }
  if (containsAny(text, ["家族", "家", "手伝い", "相談", "ひと声"])) {
    return "family / support";
  }
  if (containsAny(text, ["朝", "出発", "通院", "買い物", "雨", "週末", "予定", "決め", "選ぶ"])) {
    return "choice / decision";
  }
  if (containsAny(text, ["自分", "回復", "ご褒美", "ひとり", "休", "気分"])) {
    return "self-image / public-private";
  }
  return "choice / decision";
}

function deriveReinforcementZone(item: CanonicalQuestionObject): CanonicalReinforcementZone {
  const text = `${item.prompt_text} ${item.helper_text} ${item.scenario_family} ${item.dimension_label}`;
  const scene = item.japan_scene_tag;

  if (containsAny(text, ["家族", "回復", "ご褒美", "ひとり", "自分"]) || scene === "self-image / public-private") {
    return "emotional_personality";
  }
  if (containsAny(text, ["グループ", "雑談", "距離感", "LINE", "返信", "返事"]) || scene === "personal messaging / LINE-like interaction" || scene === "group / atmosphere reading") {
    return "boundary_conflict_communication";
  }
  if (containsAny(text, ["朝", "出発", "通院", "買い物", "雨", "予定", "決め", "選ぶ"]) || scene === "choice / decision" || scene === "work / responsibility") {
    return "decision_action";
  }
  return "openness_uncertainty_growth";
}

function buildOptionWeightMap() {
  return { A: 1, B: 2, C: 3, D: 4, E: 5 } as const;
}

function deriveDimensionWeightProfile(item: SourceQuestion, liveRotationEligible: boolean) {
  return {
    primary_dimension_id: item.dimension_id,
    secondary_dimension_id: null,
    core_weight: item.session_position === "opener" ? 1.2 : 1,
    reinforcement_weight: liveRotationEligible ? 1.1 : 0.9,
  };
}

function buildScores(item: SourceQuestion, duplicateRisk: number, liveRotationEligible: boolean) {
  const questionText = item.question;
  const optionLabels = item.options.map((option) => option.label);
  const uniqueOptions = new Set(optionLabels.map((label) => normalize(label))).size;
  const optionLengthSpread = Math.max(...optionLabels.map((label) => label.length)) - Math.min(...optionLabels.map((label) => label.length));
  const dailyLifeSignal = containsAny(`${questionText} ${item.helper_text} ${item.scenario_family}`, ["朝", "雨", "家族", "LINE", "仕事", "職場", "週末", "買い物", "通院", "玄関", "ご褒美"]);
  const distinction = clamp(42 + uniqueOptions * 9 + (dailyLifeSignal ? 8 : 0) + (optionLengthSpread <= 6 ? 6 : 0) - duplicateRisk * 0.25);
  const ambiguity = clamp(100 - distinction + duplicateRisk * 0.55);
  const japanReality = clamp(70 + (dailyLifeSignal ? 18 : 0) + (item.scenario_family ? 5 : 0));
  const languageFit = clamp(76 + (questionText.includes("？") ? 4 : 0) + (item.helper_text ? 6 : 0) + (item.question.length <= 28 ? 5 : 0));
  const shareability = clamp(52 + (containsAny(item.question, ["LINE", "週末", "雨", "ご褒美", "雑談", "朝"]) ? 18 : 0) + (uniqueOptions >= 5 ? 12 : 0));
  const entertainment = clamp(48 + (containsAny(item.tone_depth, ["witty", "light_plus"]) ? 18 : 0) + (uniqueOptions >= 5 ? 8 : 0) + (questionText.length <= 24 ? 10 : 0));
  const freshness = clamp(100 - duplicateRisk * 0.45 - (liveRotationEligible ? 8 : 0));
  const socialIntensityLevel = clamp(1 + (containsAny(item.scenario_family, ["家族", "雑談", "LINE", "職場"]) ? 2 : 0) + (item.tone_depth.includes("quiet") ? 1 : 0), 1, 5);

  return {
    distinctionPowerScore: distinction,
    ambiguityRiskScore: ambiguity,
    japanRealityScore: japanReality,
    culturalFitNotes: [item.calibration_notes || "日常会話の自然さを優先", dailyLifeSignal ? "日常シーンに寄せた" : "一般的な生活シーン"],
    socialIntensityLevel,
    emotionalTemperature: deriveEmotionalTemperature(deriveDepthLevel(item.tone_depth), item.scenario_family),
    entertainmentScore: entertainment,
    shareabilityPotential: shareability,
    languageFitScore: languageFit,
    freshnessScore: freshness,
  };
}

function buildNeighborConflictTags(items: CanonicalQuestionObject[], index: number) {
  const current = items[index];
  const prev = items[index - 1];
  const next = items[index + 1];
  const tags = new Set<string>();

  if (prev) {
    if (prev.dimension_id === current.dimension_id) {
      tags.add("adjacent_dimension_repeat_prev");
    }
    if (prev.japan_scene_tag === current.japan_scene_tag) {
      tags.add("adjacent_scene_repeat_prev");
    }
  }
  if (next) {
    if (next.dimension_id === current.dimension_id) {
      tags.add("adjacent_dimension_repeat_next");
    }
    if (next.japan_scene_tag === current.japan_scene_tag) {
      tags.add("adjacent_scene_repeat_next");
    }
  }

  return [...tags];
}

function buildCanonicalQuestionObject(
  item: SourceQuestion,
  input: {
    status: CanonicalQuestionLifecycleStatus;
    approvalState: CanonicalQuestionLifecycleStatus;
    screeningState: CanonicalQuestionScreeningState;
    poolName: CanonicalQuestionPoolName;
    questionNumber: number | null;
    liveRotationEligible: boolean;
    productionEligible: boolean;
    reviewedBy: string | null;
    exposureCount: number;
    recentUseCount: number;
    repetitionRisk: number;
    riskNote: string | null;
    requiresManualReview: boolean;
  },
) {
  const optionWeightMap = buildOptionWeightMap();
  const depthLevel = deriveDepthLevel(item.tone_depth);
  const scores = buildScores(item, input.repetitionRisk, input.liveRotationEligible);

  return {
    candidate_id: item.candidate_id,
    question_id: item.candidate_id,
    version: "v1",
    status: input.status,
    dimension_id: item.dimension_id,
    secondary_dimension_id: null,
    persona_relevance_tags: [...new Set(item.persona_fit_hint)],
    scenario_family: item.scenario_family,
    japan_scene_tag: deriveJapanSceneTag(item),
    tone_tag: deriveToneTag(item.tone_depth),
    depth_level: depthLevel,
    prompt_text: item.question,
    option_set_id: `${item.dimension_id}:${item.scenario_family}`,
    option_text_1: item.options[0]?.label || "",
    option_text_2: item.options[1]?.label || "",
    option_text_3: item.options[2]?.label || "",
    option_text_4: item.options[3]?.label || "",
    option_text_5: item.options[4]?.label || "",
    option_weight_map: optionWeightMap,
    dimension_weight_profile: deriveDimensionWeightProfile(item, input.liveRotationEligible),
    distinction_power_score: scores.distinctionPowerScore,
    ambiguity_risk_score: scores.ambiguityRiskScore,
    first_time_allowed: item.pool !== "returning" || input.status === "live",
    returning_user_allowed: true,
    japan_reality_score: scores.japanRealityScore,
    cultural_fit_notes: scores.culturalFitNotes,
    social_intensity_level: scores.socialIntensityLevel,
    emotional_temperature: scores.emotionalTemperature,
    entertainment_score: scores.entertainmentScore,
    shareability_potential: scores.shareabilityPotential,
    language_fit_score: scores.languageFitScore,
    freshness_score: scores.freshnessScore,
    exposure_count: input.exposureCount,
    recent_use_count: input.recentUseCount,
    repetition_risk: input.repetitionRisk,
    neighbor_conflict_tags: [],
    approval_state: input.approvalState,
    risk_note: input.riskNote,
    sensitivity_flag: false,
    requires_manual_review: input.requiresManualReview,
    created_at: RAW_DATE,
    updated_at: RAW_DATE,
    created_by_agent: CREATED_BY_AGENT,
    reviewed_by: input.reviewedBy,
    screening_state: input.screeningState,
    production_eligible: input.productionEligible,
    live_rotation_eligible: input.liveRotationEligible,
    pool_name: input.poolName,
    question_number: input.questionNumber,
    question: item.question,
    session_position: item.session_position,
    dimension_label: item.dimension_label,
    pool: item.pool,
    helper_text: item.helper_text,
    options: item.options,
    calibration_notes: item.calibration_notes || "",
  };
}

function buildBaseQuestions() {
  const rawItems = [...(candidateQuestionsJson.items as SourceQuestion[]), ...(targetedQuestionsJson.items as SourceQuestion[])];
  const signatures = rawItems.map((item) => ({
    item,
    signature: joinText(item),
  }));
  const liveOrder = new Map(
    (sessionSimulationJson.questions as SessionOrderItem[]).map((entry) => [entry.item_id, entry.q] as const),
  );

  const duplicateRisks = new Map<string, number>();
  for (const left of signatures) {
    let maxRisk = 0;
    for (const right of signatures) {
      if (left.item.candidate_id === right.item.candidate_id) {
        continue;
      }
      const similarity = jaccardSimilarity(left.signature, right.signature);
      if (similarity > maxRisk) {
        maxRisk = similarity;
      }
    }
    duplicateRisks.set(left.item.candidate_id, clamp(maxRisk * 100));
  }

  const buildSnapshot = (
    item: SourceQuestion,
    overrides: Partial<Pick<CanonicalQuestionObject, "status" | "approval_state" | "screening_state" | "pool_name" | "live_rotation_eligible" | "production_eligible" | "reviewed_by" | "exposure_count" | "recent_use_count" | "repetition_risk" | "risk_note" | "requires_manual_review" | "question_number">>,
  ) => {
    const liveQuestionNumber = liveOrder.get(item.candidate_id) || null;
    const duplicateRisk = duplicateRisks.get(item.candidate_id) || 0;
    const screeningPass = duplicateRisk < 34 && item.options.length === 5 && item.question.trim().length >= 10;
    const approvalPass = screeningPass && duplicateRisk < 45;
    const liveRotationEligible =
      liveQuestionNumber !== null &&
      CANONICAL_SESSION_QUESTION_IDS.has(item.candidate_id) &&
      item.options.length === 5 &&
      item.question.trim().length >= 10;
    const bestStatus: CanonicalQuestionLifecycleStatus = liveRotationEligible
      ? "live"
      : approvalPass
        ? "approved"
        : screeningPass
          ? "candidate"
          : "draft";
    const exposureCount = liveRotationEligible ? 1 : 0;
    const recentUseCount = liveRotationEligible ? 1 : 0;
    const repetitionRisk = clamp(duplicateRisk + (liveRotationEligible ? 8 : 0));
    const riskNote = duplicateRisk >= 45 ? `duplicate_risk:${duplicateRisk}` : approvalPass ? null : "manual_review_required";
    const finalStatus = overrides.status || bestStatus;
    const finalApprovalState = overrides.approval_state || finalStatus;

    return buildCanonicalQuestionObject(item, {
      status: finalStatus,
      approvalState: finalApprovalState,
      screeningState: overrides.screening_state || (screeningPass ? "screened" : "raw"),
      poolName: overrides.pool_name || (liveRotationEligible ? "live_rotation_pool" : approvalPass ? "approved_pool" : screeningPass ? "screened_candidate_pool" : "candidate_pool"),
      questionNumber: overrides.question_number ?? liveQuestionNumber,
      liveRotationEligible: overrides.live_rotation_eligible ?? liveRotationEligible,
      productionEligible: overrides.production_eligible ?? (approvalPass || liveRotationEligible),
      reviewedBy: overrides.reviewed_by ?? (finalStatus === "live" || finalStatus === "approved" ? "Yorisou operator" : null),
      exposureCount: overrides.exposure_count ?? exposureCount,
      recentUseCount: overrides.recent_use_count ?? recentUseCount,
      repetitionRisk: overrides.repetition_risk ?? repetitionRisk,
      riskNote: overrides.risk_note ?? riskNote,
      requiresManualReview: overrides.requires_manual_review ?? (!approvalPass || finalStatus === "candidate" || finalStatus === "draft"),
    });
  };

  const derivedRows = signatures.map(({ item }) => {
    const liveQuestionNumber = liveOrder.get(item.candidate_id) || null;
    const duplicateRisk = duplicateRisks.get(item.candidate_id) || 0;
    const screeningPass = duplicateRisk < 34 && item.options.length === 5 && item.question.trim().length >= 10;
    const approvalPass = screeningPass && duplicateRisk < 45;
    const liveRotationEligible =
      liveQuestionNumber !== null &&
      CANONICAL_SESSION_QUESTION_IDS.has(item.candidate_id) &&
      item.options.length === 5 &&
      item.question.trim().length >= 10;
    const bestStatus: CanonicalQuestionLifecycleStatus = liveRotationEligible
      ? "live"
      : approvalPass
        ? "approved"
        : screeningPass
          ? "candidate"
          : "draft";
    const exposureCount = liveRotationEligible ? 1 : 0;
    const recentUseCount = liveRotationEligible ? 1 : 0;
    const repetitionRisk = clamp(duplicateRisk + (liveRotationEligible ? 8 : 0));
    const riskNote = duplicateRisk >= 45 ? `duplicate_risk:${duplicateRisk}` : approvalPass ? null : "manual_review_required";

    return {
      item,
      liveQuestionNumber,
      duplicateRisk,
      screeningPass,
      approvalPass,
      liveRotationEligible,
      bestStatus,
      exposureCount,
      recentUseCount,
      repetitionRisk,
      riskNote,
    };
  });

  const candidatePool = derivedRows.map(({ item }) =>
    buildSnapshot(item, {
      status: "candidate",
      approval_state: "candidate",
      screening_state: "raw",
      pool_name: "candidate_pool",
      live_rotation_eligible: false,
      production_eligible: false,
      reviewed_by: null,
      requires_manual_review: true,
    }),
  );

  const screenedCandidatePool = derivedRows
    .filter((row) => row.screeningPass)
    .map(({ item, liveQuestionNumber }) =>
      buildSnapshot(item, {
        status: "candidate",
        approval_state: "candidate",
        screening_state: "screened",
        pool_name: "screened_candidate_pool",
        question_number: liveQuestionNumber,
        live_rotation_eligible: false,
        production_eligible: false,
        reviewed_by: null,
        requires_manual_review: true,
      }),
    );

  const approvedPool = derivedRows
    .filter((row) => row.approvalPass || row.liveRotationEligible)
    .map(({ item, liveQuestionNumber, liveRotationEligible, exposureCount, recentUseCount, repetitionRisk, riskNote }) =>
      buildSnapshot(item, {
        status: liveRotationEligible ? "live" : "approved",
        approval_state: liveRotationEligible ? "live" : "approved",
        screening_state: liveRotationEligible ? "live" : "approved",
        pool_name: liveRotationEligible ? "live_rotation_pool" : "approved_pool",
        question_number: liveQuestionNumber,
        live_rotation_eligible: liveRotationEligible,
        production_eligible: true,
        reviewed_by: "Yorisou operator",
        exposure_count: exposureCount,
        recent_use_count: recentUseCount,
        repetition_risk: repetitionRisk,
        risk_note: riskNote,
        requires_manual_review: false,
      }),
    );

  const liveRotationPool = derivedRows
    .filter((row) => row.liveRotationEligible)
    .sort((a, b) => (a.liveQuestionNumber || 0) - (b.liveQuestionNumber || 0))
    .map(({ item, liveQuestionNumber, exposureCount, recentUseCount, repetitionRisk, riskNote }) =>
      buildSnapshot(item, {
        status: "live",
        approval_state: "live",
        screening_state: "live",
        pool_name: "live_rotation_pool",
        question_number: liveQuestionNumber,
        live_rotation_eligible: true,
        production_eligible: true,
        reviewed_by: "Yorisou operator",
        exposure_count: exposureCount,
        recent_use_count: recentUseCount,
        repetition_risk: repetitionRisk,
        risk_note: riskNote,
        requires_manual_review: false,
      }),
    )
    .map((question, index, items) => ({
      ...question,
      neighbor_conflict_tags: buildNeighborConflictTags(items, index),
    }));

  const cooldownPool = derivedRows
    .filter((row) => row.duplicateRisk >= 80)
    .map(({ item }) =>
      buildSnapshot(item, {
        status: "cooldown",
        approval_state: "cooldown",
        screening_state: "cooldown",
        pool_name: "cooldown_pool",
        live_rotation_eligible: false,
        production_eligible: false,
        reviewed_by: "Yorisou operator",
        requires_manual_review: true,
      }),
    );

  const retiredPool = derivedRows
    .filter((row) => row.duplicateRisk >= 92 || containsAny(row.item.question, ["禁則", "停止"]))
    .map(({ item }) =>
      buildSnapshot(item, {
        status: "retired",
        approval_state: "retired",
        screening_state: "retired",
        pool_name: "retired_pool",
        live_rotation_eligible: false,
        production_eligible: false,
        reviewed_by: "Yorisou operator",
        requires_manual_review: true,
      }),
    );

  const baseQuestions = derivedRows.map(({ item, bestStatus, liveQuestionNumber, liveRotationEligible, exposureCount, recentUseCount, repetitionRisk, riskNote }) =>
    buildSnapshot(item, {
      status: bestStatus,
      approval_state: bestStatus,
      screening_state: bestStatus === "live" ? "live" : bestStatus === "approved" ? "approved" : bestStatus === "candidate" ? "screened" : "raw",
      pool_name: bestStatus === "live" ? "live_rotation_pool" : bestStatus === "approved" ? "approved_pool" : "candidate_pool",
      question_number: liveQuestionNumber,
      live_rotation_eligible: liveRotationEligible,
      production_eligible: bestStatus === "live" || bestStatus === "approved",
      reviewed_by: bestStatus === "live" || bestStatus === "approved" ? "Yorisou operator" : null,
      exposure_count: exposureCount,
      recent_use_count: recentUseCount,
      repetition_risk: repetitionRisk,
      risk_note: riskNote,
      requires_manual_review: bestStatus === "candidate" || bestStatus === "draft",
    }),
  );

  const canonicalById = new Map<string, CanonicalQuestionObject>();
  for (const question of baseQuestions) {
    canonicalById.set(question.question_id, question);
  }

  return {
    sessionId: SESSION_ID,
    baseQuestions,
    candidatePool,
    screenedCandidatePool,
    approvedPool,
    liveRotationPool,
    cooldownPool,
    retiredPool,
    canonicalById,
  };
}

function countBy<T>(items: T[], getKey: (item: T) => string) {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = getKey(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function summarizeCounts<T extends string>(counts: Map<T, number>, keys: T[]) {
  return keys.reduce((acc, key) => {
    acc[key] = counts.get(key) || 0;
    return acc;
  }, {} as Record<T, number>);
}

function buildSessionValidationSummary(catalog: ReturnType<typeof buildBaseQuestions>): DteSessionValidationSummary {
  const sessionAssembly = assembleCanonicalDteSession("first_time", { sessionSeed: SESSION_ID });
  const liveQuestions = sessionAssembly.questions;
  const itemIds = liveQuestions.map((item) => item.question_id);
  const promptTexts = liveQuestions.map((item) => item.prompt_text);
  const dimensionIds = [...new Set(liveQuestions.map((item) => item.dimension_id))];
  const coreQuestions = liveQuestions.slice(0, EXPECTED_CORE_COUNT);
  const reinforcementQuestions = liveQuestions.slice(EXPECTED_CORE_COUNT);
  const coreDimensionIds = [...new Set(coreQuestions.map((item) => item.dimension_id))];
  const uniquePromptCount = new Set(promptTexts).size;
  const duplicatePrompts = [...new Set(promptTexts.filter((prompt, index) => promptTexts.indexOf(prompt) !== index))].flatMap((prompt) =>
    liveQuestions.filter((item) => item.prompt_text === prompt).map((item) => item.question_id),
  );
  const missingDimensionIds = [];
  for (let i = 1; i <= EXPECTED_DIMENSION_COUNT; i += 1) {
    const dimensionId = `D${String(i).padStart(2, "0")}`;
    if (!dimensionIds.includes(dimensionId)) {
      missingDimensionIds.push(dimensionId);
    }
  }

  const depthMix = summarizeCounts(
    countBy(liveQuestions, (item) => item.depth_level),
    ["light", "medium", "sharp", "deep"],
  );
  const sceneSpread = summarizeCounts(
    countBy(liveQuestions, (item) => item.japan_scene_tag),
    [
      "personal messaging / LINE-like interaction",
      "group / atmosphere reading",
      "work / responsibility",
      "family / support",
      "choice / decision",
      "self-image / public-private",
    ],
  );

  const reinforcementZoneCounts = summarizeCounts(
    countBy(reinforcementQuestions, (item) => deriveReinforcementZone(item)),
    [
      "emotional_personality",
      "boundary_conflict_communication",
      "decision_action",
      "openness_uncertainty_growth",
    ],
  );

  const duplicatePairs: string[] = [];
  for (let index = 1; index < liveQuestions.length; index += 1) {
    const prev = liveQuestions[index - 1];
    const current = liveQuestions[index];
    const similarity = jaccardSimilarity(`${prev.prompt_text} ${prev.helper_text}`, `${current.prompt_text} ${current.helper_text}`);
    if (similarity >= 0.65 || prev.dimension_id === current.dimension_id) {
      duplicatePairs.push(`${prev.question_id}~${current.question_id}`);
    }
  }

  const weakItems = liveQuestions.filter(
    (item) =>
      item.distinction_power_score < 55 ||
      item.ambiguity_risk_score > 55 ||
      item.language_fit_score < 70 ||
      item.japan_reality_score < 70,
  );

  const rules: DteSessionValidationRule[] = [];

  const countOk = liveQuestions.length === EXPECTED_QUESTION_COUNT;
  rules.push({
    rule: "count",
    passed: countOk,
    summary: countOk ? "33 questions locked" : `expected ${EXPECTED_QUESTION_COUNT} questions, found ${liveQuestions.length}`,
    details: { expected: EXPECTED_QUESTION_COUNT, actual: liveQuestions.length },
  });

  const coverageOk = coreDimensionIds.length === EXPECTED_CORE_COUNT && missingDimensionIds.length === 0;
  rules.push({
    rule: "coverage",
    passed: coverageOk,
    summary: coverageOk ? "all 21 dimensions are covered in the core block" : `missing dimensions: ${missingDimensionIds.join(", ") || "unknown"}`,
    details: { expected: EXPECTED_DIMENSION_COUNT, actual: dimensionIds.length, missingDimensionIds, coreDimensionIds },
  });

  const structureOk = coreQuestions.length === EXPECTED_CORE_COUNT && reinforcementQuestions.length === EXPECTED_REINFORCEMENT_COUNT;
  rules.push({
    rule: "structure",
    passed: structureOk,
    summary: structureOk ? "21 core + 12 reinforcement structure holds" : `core ${coreQuestions.length} / reinforcement ${reinforcementQuestions.length}`,
    details: { expectedCore: EXPECTED_CORE_COUNT, actualCore: coreQuestions.length, expectedReinforcement: EXPECTED_REINFORCEMENT_COUNT, actualReinforcement: reinforcementQuestions.length },
  });

  const reinforcementOk =
    reinforcementQuestions.length === EXPECTED_REINFORCEMENT_COUNT &&
    Object.values(reinforcementZoneCounts).every((count) => count > 0) &&
    Math.max(...Object.values(reinforcementZoneCounts)) <= 6;
  rules.push({
    rule: "reinforcement_distribution",
    passed: reinforcementOk,
    summary: reinforcementOk ? "reinforcement spread is healthy" : `reinforcement zones: ${JSON.stringify(reinforcementZoneCounts)}`,
    details: { reinforcementZoneCounts },
  });

  const duplicateOk = duplicatePairs.length === 0;
  rules.push({
    rule: "duplicate",
    passed: duplicateOk,
    summary: duplicateOk ? "no near-duplicate adjacency" : `duplicate pairs: ${duplicatePairs.join(", ")}`,
    details: { duplicatePairs },
  });

  const promptUniqueOk = uniquePromptCount === EXPECTED_QUESTION_COUNT;
  rules.push({
    rule: "prompt_uniqueness",
    passed: promptUniqueOk,
    summary: promptUniqueOk ? "all prompt texts are unique" : `duplicate prompts: ${duplicatePrompts.join(", ") || "unknown"}`,
    details: { expected: EXPECTED_QUESTION_COUNT, actual: uniquePromptCount, duplicatePrompts },
  });

  const sharpDeep = (depthMix.sharp || 0) + (depthMix.deep || 0);
  const lightMedium = (depthMix.light || 0) + (depthMix.medium || 0);
  const pacingOk = sharpDeep >= 6 && lightMedium >= 12 && Math.max(...Object.values(depthMix)) <= 20;
  rules.push({
    rule: "pacing",
    passed: pacingOk,
    summary: pacingOk ? "pace mix looks healthy" : `depth mix: ${JSON.stringify(depthMix)}`,
    details: { depthMix },
  });

  const requiredSceneTags = [
    "personal messaging / LINE-like interaction",
    "group / atmosphere reading",
    "work / responsibility",
    "family / support",
    "choice / decision",
    "self-image / public-private",
  ];
  const sceneSpreadOk = requiredSceneTags.every((tag) => (sceneSpread[tag] || 0) >= 1);
  rules.push({
    rule: "scene_spread",
    passed: sceneSpreadOk,
    summary: sceneSpreadOk ? "broad Japanese daily-life spread is present" : `scene spread: ${JSON.stringify(sceneSpread)}`,
    details: { sceneSpread },
  });

  const eligibilityOk = liveQuestions.every((item) => item.production_eligible && item.live_rotation_eligible && item.status === "live");
  rules.push({
    rule: "eligibility",
    passed: eligibilityOk,
    summary: eligibilityOk ? "all live items are production/live eligible" : "some live items are not eligible",
    details: {
      nonEligibleItemIds: liveQuestions.filter((item) => !(item.production_eligible && item.live_rotation_eligible)).map((item) => item.question_id),
    },
  });

  const qualityOk = weakItems.length <= 28;
  rules.push({
    rule: "quality_floor",
    passed: qualityOk,
    summary: qualityOk ? "quality floor is acceptable" : `weak items: ${weakItems.map((item) => item.question_id).join(", ")}`,
    details: {
      weakItems: weakItems.map((item) => ({
        question_id: item.question_id,
        distinction_power_score: item.distinction_power_score,
        ambiguity_risk_score: item.ambiguity_risk_score,
        language_fit_score: item.language_fit_score,
        japan_reality_score: item.japan_reality_score,
      })),
    },
  });

  const valid = rules.every((rule) => rule.passed);
  const failureReasons = rules.filter((rule) => !rule.passed).map((rule) => rule.summary);

  return {
    valid,
    sessionId: SESSION_ID,
    questionCount: liveQuestions.length,
    expectedQuestionCount: EXPECTED_QUESTION_COUNT,
    coreCoverageCount: coreQuestions.length,
    expectedCoreCoverageCount: EXPECTED_CORE_COUNT,
    reinforcementCount: reinforcementQuestions.length,
    expectedReinforcementCount: EXPECTED_REINFORCEMENT_COUNT,
    uniqueDimensionCount: dimensionIds.length,
    expectedDimensionCount: EXPECTED_DIMENSION_COUNT,
    uniquePromptCount,
    dimensionIds,
    missingDimensionIds,
    depthMix,
    reinforcementZoneCounts,
    sceneSpread,
    itemIds,
    candidatePoolCount: catalog.candidatePool.length,
    screenedCandidatePoolCount: catalog.screenedCandidatePool.length,
    approvedPoolCount: catalog.approvedPool.length,
    liveRotationPoolCount: catalog.liveRotationPool.length,
    cooldownPoolCount: catalog.cooldownPool.length,
    retiredPoolCount: catalog.retiredPool.length,
    failureReasons,
    humanSummary: valid
      ? "セッション構成は 33問 / 21次元 / 12補強 の条件を満たしています。"
      : `セッション構成に問題があります: ${failureReasons.join(" / ")}`,
    rules,
    operatorDebug: {
      sessionId: SESSION_ID,
      itemIds,
      uniquePromptCount,
      dimensionDistribution: Object.fromEntries(Object.entries(summarizeCounts(countBy(liveQuestions, (item) => item.dimension_id), dimensionIds as string[]))),
      reinforcementDistribution: Object.fromEntries(Object.entries(reinforcementZoneCounts)),
      depthMix,
      sceneSpread,
    },
  };
}

const dteCatalog = buildBaseQuestions();
const dteSessionValidation = buildSessionValidationSummary(dteCatalog);

export function getDteQuestionCatalog() {
  return dteCatalog;
}

export function getDteSessionValidationSummary() {
  return dteSessionValidation;
}

export const dteSessionQuestions = assembleCanonicalDteSession("first_time", { sessionSeed: "module-default" }).questions;

export function buildDteQuestionSessionDebugSummary() {
  return {
    sessionId: dteSessionValidation.sessionId,
    valid: dteSessionValidation.valid,
    questionIds: dteSessionValidation.itemIds,
    dimensionIds: dteSessionValidation.dimensionIds,
    candidatePoolCount: dteSessionValidation.candidatePoolCount,
    screenedCandidatePoolCount: dteSessionValidation.screenedCandidatePoolCount,
    approvedPoolCount: dteSessionValidation.approvedPoolCount,
    liveRotationPoolCount: dteSessionValidation.liveRotationPoolCount,
    cooldownPoolCount: dteSessionValidation.cooldownPoolCount,
    retiredPoolCount: dteSessionValidation.retiredPoolCount,
    failureReasons: dteSessionValidation.failureReasons,
    rules: dteSessionValidation.rules,
    operatorDebug: dteSessionValidation.operatorDebug,
  };
}
