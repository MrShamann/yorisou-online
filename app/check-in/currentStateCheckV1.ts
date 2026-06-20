import { T6_BASE_RESULTS, T6_FALLBACK_RESULT, T6_OVERLAYS, T6_RESULT_BY_ID } from "./t6ResultModel";
import { T6_CURRENT_STATE_QUESTION_BANK } from "./t6QuestionBank";
import {
  buildStoredResultPayload,
  readCurrentStateResultPayload,
  saveCurrentStateResultPayload,
  scoreCurrentStateCheck as scoreT6CurrentStateCheck,
} from "./t6Scoring";
import type { T6AnswerMap, T6Question, T6ResultModel, T6StoredResultPayload } from "./t6Types";

export const currentStateCheckV1 = {
  testId: "current_state_check_v1",
  testName: "今の状態チェック",
  estimatedMinutes: 3,
  dimensions: [
    { id: "pace_orientation", displayName: "進み方のペース" },
    { id: "load_sensitivity", displayName: "負荷の受けやすさ" },
    { id: "clarity_stability", displayName: "頭のまとまり" },
    { id: "direction_grip", displayName: "進む方向の持ちやすさ" },
    { id: "structure_need", displayName: "順番や枠の必要度" },
    { id: "autonomy_preference", displayName: "自分で決める余白" },
    { id: "processing_style", displayName: "内側で整理する傾向" },
    { id: "expression_style", displayName: "外に出す伝え方" },
    { id: "distance_preference", displayName: "距離の取り方" },
    { id: "reassurance_style", displayName: "安心の受け取り方" },
    { id: "reset_mode", displayName: "整え直し方" },
    { id: "support_preference", displayName: "支えの受け取り方" },
  ],
  questions: T6_CURRENT_STATE_QUESTION_BANK,
  results: T6_BASE_RESULTS,
  fallbackResult: T6_FALLBACK_RESULT,
  overlays: T6_OVERLAYS,
  scoring: {
    fallbackResultId: T6_FALLBACK_RESULT.id,
    confidenceCap: "low-medium",
    resultStoragePrefix: "yorisou.t6.result.v1:",
  },
} as const;

type QuizData = typeof currentStateCheckV1;

export type CurrentStateAnswerMap = T6AnswerMap;
export type CurrentStateQuestion = T6Question;
export type CurrentStateResult = T6ResultModel;
export type CurrentStateStoredResultPayload = T6StoredResultPayload;

export const currentStateQuestions = currentStateCheckV1.questions;
export const currentStateResults = currentStateCheckV1.results;
export const currentStateFallbackResult = currentStateCheckV1.fallbackResult;
export const currentStateOverlays = currentStateCheckV1.overlays;

export function getCurrentStateQuestion(questionId: string) {
  return currentStateCheckV1.questions.find((question) => question.id === questionId) ?? null;
}

export function getCurrentStateResult(resultId: string | null | undefined) {
  if (!resultId) {
    return null;
  }

  return T6_RESULT_BY_ID.get(resultId) ?? null;
}

export function getCurrentStateOverlay(overlayId: string | null | undefined) {
  if (!overlayId) {
    return null;
  }

  return currentStateCheckV1.overlays.find((overlay) => overlay.id === overlayId) ?? null;
}

const SEGMENT_LABELS = [
  "状態の負荷",
  "整理と方向",
  "枠と自由",
  "考え方と出し方",
  "距離と安心",
  "整え直しと支え",
] as const;

const MILESTONE_LABELS = [
  "今の流れを見ています",
  "少しずつ輪郭が見えてきます",
  "中盤では、調整しやすさが見えます",
  "後半で、戻り方と支え方が見えてきます",
  "あと少しで全体の傾向が見えます",
  "回答がそろうほど、今の流れが見えやすくなります",
] as const;

export function getCurrentStateSegmentLabel(index: number) {
  const question = currentStateQuestions[index];
  if (!question) {
    return SEGMENT_LABELS[0];
  }

  const segmentIndex = currentStateQuestions.findIndex((item) => item.section === question.section);
  return SEGMENT_LABELS[Math.max(0, Math.min(SEGMENT_LABELS.length - 1, Math.floor(segmentIndex / 4)))] ?? question.section;
}

export function getCurrentStateMilestone(index: number) {
  const blockIndex = Math.max(0, Math.min(MILESTONE_LABELS.length - 1, Math.floor(index / 4)));
  return MILESTONE_LABELS[blockIndex];
}

export function scoreCurrentStateCheck(answers: CurrentStateAnswerMap) {
  return scoreT6CurrentStateCheck(answers);
}

export function buildCurrentStateResultPayload(
  scoredResult: ReturnType<typeof scoreT6CurrentStateCheck>,
  answers: CurrentStateAnswerMap,
) {
  return buildStoredResultPayload(scoredResult, answers);
}

export function saveCurrentStateResult(payload: CurrentStateStoredResultPayload) {
  saveCurrentStateResultPayload(payload);
}

export function readCurrentStateResult(payloadKey?: string | null) {
  return readCurrentStateResultPayload(payloadKey);
}

export type CurrentStateCheckModel = QuizData;

