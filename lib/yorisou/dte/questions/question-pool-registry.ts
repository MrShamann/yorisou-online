import type { CanonicalQuestionObject } from "@/lib/dteQuestionRuntime";
import { normalizeCanonicalAnswerOptionId } from "@/lib/yorisou/dte/answer-options";
import {
  QUESTION_POOL_V2_ITEMS,
  QUESTION_POOL_V2_METADATA,
  QUESTION_POOL_V2_SESSION_ORDER,
  QUESTION_POOL_V2_DIMENSIONS,
  QUESTION_POOL_V2_PACKS,
  QUESTION_POOL_V2_CORE_DIMENSION_ORDER,
} from "./question-pool-v2";
import type { QuestionPoolSessionOrderItem } from "./question-pool-types";

export type QuestionPoolRegistry = {
  metadata: typeof QUESTION_POOL_V2_METADATA;
  candidatePool: CanonicalQuestionObject[];
  screenedCandidatePool: CanonicalQuestionObject[];
  approvedPool: CanonicalQuestionObject[];
  liveRotationPool: CanonicalQuestionObject[];
  cooldownPool: CanonicalQuestionObject[];
  retiredPool: CanonicalQuestionObject[];
  sessionOrder: QuestionPoolSessionOrderItem[];
  dimensionBlueprints: typeof QUESTION_POOL_V2_DIMENSIONS;
  packs: typeof QUESTION_POOL_V2_PACKS;
};

export function getQuestionPoolRegistry(): QuestionPoolRegistry {
  return {
    metadata: QUESTION_POOL_V2_METADATA,
    candidatePool: QUESTION_POOL_V2_ITEMS.map((item) => ({ ...item, options: item.options.map((option) => ({ ...option })) })) as unknown as CanonicalQuestionObject[],
    screenedCandidatePool: QUESTION_POOL_V2_ITEMS.map((item) => ({ ...item, options: item.options.map((option) => ({ ...option })) })) as unknown as CanonicalQuestionObject[],
    approvedPool: QUESTION_POOL_V2_ITEMS.map((item) => ({ ...item, options: item.options.map((option) => ({ ...option })) })) as unknown as CanonicalQuestionObject[],
    liveRotationPool: QUESTION_POOL_V2_ITEMS.map((item) => ({ ...item, options: item.options.map((option) => ({ ...option })) })) as unknown as CanonicalQuestionObject[],
    cooldownPool: [],
    retiredPool: [],
    sessionOrder: QUESTION_POOL_V2_SESSION_ORDER,
    dimensionBlueprints: QUESTION_POOL_V2_DIMENSIONS,
    packs: QUESTION_POOL_V2_PACKS,
  };
}

function createSeededRandom(seed: string) {
  let state = 0;
  for (let index = 0; index < seed.length; index += 1) {
    state = (state * 31 + seed.charCodeAt(index)) | 0;
  }
  state ||= 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0xffffffff;
  };
}

function seededShuffle<T>(items: T[], seed: string) {
  const random = createSeededRandom(seed);
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function groupByDimension(items: CanonicalQuestionObject[]) {
  const groups = new Map<string, CanonicalQuestionObject[]>();
  for (const item of items) {
    const bucket = groups.get(item.dimension_id) || [];
    bucket.push(item);
    groups.set(item.dimension_id, bucket);
  }
  return groups;
}

function classifySessionMotif(question: Pick<CanonicalQuestionObject, "scenario_family" | "prompt_text" | "helper_text">) {
  const text = `${question.prompt_text} ${question.helper_text} ${question.scenario_family}`;
  const rules: Array<[string, RegExp[]]> = [
    ["line_reply", [/LINE/i, /既読/, /返信/, /返事/, /会話/]],
    ["reassurance", [/安心/, /大丈夫/, /ねぎら/, /気にかけ/, /支え/]],
    ["plan_change", [/予定/, /ずれ/, /変更/, /巻き直/, /保留/]],
    ["movement", [/移動/, /玄関/, /電車/, /階段/, /雨/, /通院/]],
    ["choice", [/候補/, /選ぶ/, /外す/, /比べ/, /迷い/, /決め/]],
    ["solitude", [/ひとり/, /静か/, /回復/, /余白/, /休む/]],
    ["support", [/家族/, /友だち/, /助け/, /気づか/, /一声/]],
    ["work", [/仕事/, /家事/, /締切/, /段取り/, /並走/]],
    ["reward", [/ご褒美/, /週末/, /夜/, /朝/]],
    ["presentation", [/見せ方/, /投稿/, /写真/, /表情/]],
  ];

  for (const [key, patterns] of rules) {
    if (patterns.some((pattern) => pattern.test(text))) {
      return key;
    }
  }

  return "other";
}

function selectVariantForDimension(
  dimensionId: string,
  questions: CanonicalQuestionObject[],
  seed: string,
  usedFamilies: Set<string>,
  usedMotifCounts: Map<string, number>,
  familyQuota: number,
) {
  const ordered = seededShuffle(questions, `${seed}:${dimensionId}`);
  const preferred = ordered.find((question) => {
    const motif = classifySessionMotif(question);
    return !usedFamilies.has(question.scenario_family) && (usedMotifCounts.get(motif) || 0) < 2;
  });
  if (preferred) {
    usedFamilies.add(preferred.scenario_family);
    const motif = classifySessionMotif(preferred);
    usedMotifCounts.set(motif, (usedMotifCounts.get(motif) || 0) + 1);
    return preferred;
  }
  const familyFallback = ordered.find((question) => !usedFamilies.has(question.scenario_family)) || null;
  const motifFallback = ordered.find((question) => {
    const motif = classifySessionMotif(question);
    return (usedMotifCounts.get(motif) || 0) < 2;
  }) || null;
  const fallback = familyFallback || motifFallback || ordered[0] || null;
  if (fallback) {
    if (usedFamilies.size < familyQuota) {
      usedFamilies.add(fallback.scenario_family);
    }
    const motif = classifySessionMotif(fallback);
    usedMotifCounts.set(motif, (usedMotifCounts.get(motif) || 0) + 1);
    return fallback;
  }
  return null;
}

export function assembleV2SessionQuestions(
  audience: "first_time" | "returning",
  sessionSeed: string,
  catalog: { liveRotationPool: CanonicalQuestionObject[] } & Partial<QuestionPoolRegistry> = getQuestionPoolRegistry(),
) {
  const liveQuestions = (catalog.liveRotationPool as CanonicalQuestionObject[]).map((item) => ({
    ...item,
    options: item.options.map((option) => ({ ...option })),
  }));
  const dimensionOrder = [...QUESTION_POOL_V2_CORE_DIMENSION_ORDER];
  const dimensionGroups = groupByDimension(liveQuestions);
  const usedIds = new Set<string>();
  const usedFamilies = new Set<string>();
  const usedMotifCounts = new Map<string, number>();
  const coreQuestions: CanonicalQuestionObject[] = [];

  for (const dimensionId of dimensionOrder) {
    const group = dimensionGroups.get(dimensionId) || [];
    const selected = selectVariantForDimension(dimensionId, group, `${sessionSeed}:core`, usedFamilies, usedMotifCounts, 8);
    if (selected) {
      coreQuestions.push(selected);
      usedIds.add(selected.question_id);
    }
  }

  const remaining = seededShuffle(
    liveQuestions.filter((question) => !usedIds.has(question.question_id)),
    `${sessionSeed}:${audience}:reinforcement`,
  );
  const reinforcementQuestions: CanonicalQuestionObject[] = [];

  for (const question of remaining) {
    if (reinforcementQuestions.length >= 12) {
      break;
    }
    const familyCount = reinforcementQuestions.filter((item) => item.scenario_family === question.scenario_family).length;
    const dimensionCount = reinforcementQuestions.filter((item) => item.dimension_id === question.dimension_id).length;
    if (familyCount >= 3 || dimensionCount >= 2) {
      continue;
    }
    reinforcementQuestions.push(question);
    usedIds.add(question.question_id);
  }

  if (reinforcementQuestions.length < 12) {
    for (const question of remaining) {
      if (reinforcementQuestions.length >= 12) {
        break;
      }
      if (usedIds.has(question.question_id)) {
        continue;
      }
      reinforcementQuestions.push(question);
      usedIds.add(question.question_id);
    }
  }

  const assembled = [...coreQuestions, ...reinforcementQuestions].slice(0, 33).map((question, index) => ({
    ...question,
    question_number: index + 1,
  }));

  return {
    sessionSeed,
    audience,
    questions: assembled,
    coreCoverageCount: coreQuestions.length,
    reinforcementCount: Math.max(0, assembled.length - coreQuestions.length),
    sourcePool: "live_rotation_pool" as const,
  };
}

export function scoreQuestionPoolDraftQuality(question: Pick<CanonicalQuestionObject, "question" | "helper_text" | "scenario_family" | "tone_tag" | "japan_scene_tag" | "dimension_label" | "options">) {
  const text = `${question.question} ${question.helper_text} ${question.scenario_family} ${question.tone_tag} ${question.japan_scene_tag} ${question.dimension_label}`;
  const optionLabels = question.options.map((option) => option.label).join(" ");
  const length = question.question.length + question.helper_text.length;
  const optionDistinctness = new Set(question.options.map((option) => normalizeCanonicalAnswerOptionId(option.id))).size;
  const entertainmentScore = Math.max(1, Math.min(5, Math.round((text.length > 28 ? 4 : 3) + (optionDistinctness >= 5 ? 1 : 0))));
  const boredomRisk = Math.max(1, Math.min(5, Math.round((question.question.includes("どれ") ? 2 : 1) + (question.helper_text.includes("選んで") ? 1 : 0))));
  const genericSurveyRisk = Number(/\b(選んでください|どれ|いちばん近い)\b/.test(text)) ? 2 : 1;

  return {
    entertainmentScore,
    boredomRisk,
    genericSurveyRisk,
    questionLength: length,
    optionDistinctness,
    optionLabels,
    previewText: text,
  };
}
