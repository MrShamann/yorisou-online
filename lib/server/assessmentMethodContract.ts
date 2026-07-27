import "server-only";
// UX-2 / ICP-1 — the server-side contract for the governed public 120Q method.
// Values are READ from the existing governed artifacts; nothing here redefines protected truth.

import { currentStateQuestions } from "@/app/check-in/currentStateCheckV1";

export const CURRENT_STATE_METHOD_ID = "imairo-120q";
export const CURRENT_STATE_METHOD_VERSION = "compat-v0.2";
export const CURRENT_STATE_SCORING_VERSION = "imairo-public-assignment-v0.1";
export const CURRENT_STATE_RESULT_SCHEMA_VERSION = "imairo-public-result-v0.1";

// Required coverage is derived from the governed question bank, never hard-coded independently.
export const CURRENT_STATE_REQUIRED_ANSWERS = currentStateQuestions.length;

// Keyed by plain strings so untrusted input can be looked up without first asserting that it
// already conforms to the governed template-literal id types.
const QUESTION_IDS = new Set<string>(currentStateQuestions.map((q) => q.id));
const OPTION_IDS_BY_QUESTION = new Map<string, Set<string>>(
  currentStateQuestions.map((q) => [q.id as string, new Set<string>(q.options.map((o) => o.id as string))]),
);

// Accepts ONLY {governedQuestionId: governedOptionId}. Anything else is rejected, so the
// persisted answer state can never contain arbitrary caller-supplied content.
export function normalizeAnswerMap(raw: unknown): Record<string, string> | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return null;
  const out: Record<string, string> = {};
  for (const [questionId, optionId] of Object.entries(raw as Record<string, unknown>)) {
    if (!QUESTION_IDS.has(questionId)) return null;
    if (typeof optionId !== "string") return null;
    if (!OPTION_IDS_BY_QUESTION.get(questionId)?.has(optionId)) return null;
    out[questionId] = optionId;
  }
  return out;
}
