import type { CanonicalQuestionObject } from "@/lib/dteQuestionRuntime";
import { CANONICAL_ANSWER_ARCHITECTURE, normalizeCanonicalAnswerOptionId } from "@/lib/yorisou/dte/answer-options";

export type PreparedDteQuestion = CanonicalQuestionObject & {
  mobilePromptText: string;
  mobileHelperText: string;
};

function trimSentence(input: string, fallback: string) {
  const text = (input || "").replace(/\s+/g, " ").trim();
  return text || fallback;
}

export function prepareDteQuestion(question: CanonicalQuestionObject): PreparedDteQuestion {
  const options = question.options.slice(0, CANONICAL_ANSWER_ARCHITECTURE.optionCount).map((option, index) => ({
    ...option,
    id: normalizeCanonicalAnswerOptionId(option.id || CANONICAL_ANSWER_ARCHITECTURE.optionIds[index]).toString(),
    label: trimSentence(option.label, `Option ${index + 1}`),
  }));

  return {
    ...question,
    options,
    mobilePromptText: trimSentence(question.question, question.prompt_text),
    mobileHelperText: trimSentence(question.helper_text, ""),
  };
}

export function assertPreparedQuestionShape(question: CanonicalQuestionObject) {
  return question.options.length === CANONICAL_ANSWER_ARCHITECTURE.optionCount;
}

