import finalNamingLockJson from "@/docs/yorisou_canonical_final_naming_lock_2026-04-13/yorisou_canonical_final_naming_lock_v1.json";
import candidateQuestionsJson from "@/docs/dynamic_test_engine_batch_2026-04-12/candidate_batch_01_questions.json";
import targetedQuestionsJson from "@/docs/dynamic_test_engine_targeted_batch_2026-04-12/targeted_batch_01_2_questions.json";
import sessionSimulationJson from "@/docs/dynamic_test_engine_session_simulation_2026-04-12/controlled_session_simulation_v1.json";

type QuestionBankItem = {
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
  options: Array<{ id: string; label: string; signal: string }>;
  calibration_notes: string;
};

type SessionOrderItem = {
  q: number;
  item_id: string;
  dimension_id: string;
};

const questionBank = new Map<string, QuestionBankItem>();

for (const item of [...(candidateQuestionsJson.items as QuestionBankItem[]), ...(targetedQuestionsJson.items as QuestionBankItem[])]) {
  questionBank.set(item.candidate_id, item);
}

export type DynamicTestQuestion = QuestionBankItem & {
  question_number: number;
};

export const dynamicTestSessionQuestions: DynamicTestQuestion[] = (
  sessionSimulationJson.questions as SessionOrderItem[]
)
  .map((entry) => {
    const item = questionBank.get(entry.item_id);
    if (!item) {
      throw new Error(`Missing dynamic test question item: ${entry.item_id}`);
    }
    return {
      ...item,
      question_number: entry.q,
    };
  })
  .sort((a, b) => a.question_number - b.question_number);

const lockedPersonaIds = (finalNamingLockJson.entries as Array<{ persona_id: string; lock_status: string }>)
  .filter((entry) => entry.lock_status === "LOCKED")
  .map((entry) => entry.persona_id);

const choiceWeights: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
};

function dimensionScoreWeight(dimensionId: string, questionNumber: number) {
  const parsed = Number(dimensionId.replace(/^D/, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed + questionNumber : questionNumber;
}

export function deriveDynamicTestPersonaId(answers: Record<string, string | undefined>) {
  if (lockedPersonaIds.length === 0) {
    return "P01";
  }

  const score = dynamicTestSessionQuestions.reduce((sum, question) => {
    const choice = choiceWeights[answers[question.candidate_id] || "A"] || 1;
    return sum + choice * dimensionScoreWeight(question.dimension_id, question.question_number);
  }, 0);

  return lockedPersonaIds[score % lockedPersonaIds.length] || lockedPersonaIds[0] || "P01";
}

export function buildDynamicTestResultHref(input: {
  locale: "ja" | "en";
  personaId: string;
  source?: string;
  completionId?: string | null;
}) {
  const params = new URLSearchParams();
  params.set("persona", input.personaId);
  params.set("scenario", "result_ready");
  params.set("surface", "primary");
  params.set("sessionMode", "anonymous");
  params.set("versionMode", "valid");
  params.set("entry_source", input.source || "mini_app");
  if (input.completionId) {
    params.set("completionId", input.completionId);
  }

  const path = input.locale === "en" ? "/en/result" : "/result";
  return `${path}?${params.toString()}`;
}

export function buildDynamicTestContinuationHref(input: {
  locale: "ja" | "en";
  completionId: string;
  openedAt?: number | string | null;
}) {
  const params = new URLSearchParams();
  params.set("completionId", input.completionId);
  if (typeof input.openedAt === "number" || typeof input.openedAt === "string") {
    params.set("openedAt", String(input.openedAt));
  }

  const path = input.locale === "en" ? "/en/result/continue" : "/result/continue";
  return `${path}?${params.toString()}`;
}
