import { getDteQuestionCatalog, type CanonicalQuestionObject } from "@/lib/dteQuestionRuntime";
import { CANONICAL_ANSWER_ARCHITECTURE } from "@/lib/yorisou/dte/answer-options";
import { prepareDteQuestion, type PreparedDteQuestion } from "@/lib/yorisou/dte/question-schema";
import { assembleV2SessionQuestions } from "@/lib/yorisou/dte/questions/question-pool-registry";

export type DteSessionAudience = "first_time" | "returning";

export type DteSessionAssembly = {
  audience: DteSessionAudience;
  sessionSeed: string;
  questions: PreparedDteQuestion[];
  coreCoverageCount: number;
  reinforcementCount: number;
  sourcePool: "live_rotation_pool" | "approved_pool";
};

export type DteSessionAssemblyInput = {
  sessionSeed?: string | number | null;
  sessionId?: string | null;
  anonymousId?: string | null;
  completedAt?: string | number | null;
};

function uniqueByQuestionId(items: CanonicalQuestionObject[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.question_id)) {
      return false;
    }
    seen.add(item.question_id);
    return true;
  });
}

function normalizeSeedPart(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim();
}

function deriveSessionSeed(audience: DteSessionAudience, input?: DteSessionAssemblyInput) {
  const parts = [
    audience,
    normalizeSeedPart(input?.sessionSeed),
    normalizeSeedPart(input?.sessionId),
    normalizeSeedPart(input?.anonymousId),
    normalizeSeedPart(input?.completedAt),
  ].filter(Boolean);
  return parts.join("|") || `${audience}|default`;
}

export function assembleCanonicalDteSession(
  audience: DteSessionAudience = "first_time",
  input?: DteSessionAssemblyInput,
): DteSessionAssembly {
  const catalog = getDteQuestionCatalog();
  const sessionSeed = deriveSessionSeed(audience, input);
  const assembled = assembleV2SessionQuestions(audience, sessionSeed, catalog);
  const questions = uniqueByQuestionId(assembled.questions).slice(0, 33).map(prepareDteQuestion);
  const coreQuestions = questions.slice(0, 21);

  return {
    audience,
    sessionSeed,
    questions,
    coreCoverageCount: coreQuestions.length,
    reinforcementCount: questions.length - coreQuestions.length,
    sourcePool: audience === "returning" ? "approved_pool" : "live_rotation_pool",
  };
}

export function validateCanonicalSessionAssembly(audience: DteSessionAudience = "first_time", input?: DteSessionAssemblyInput) {
  const assembly = assembleCanonicalDteSession(audience, input);
  return {
    audience,
    sessionSeed: assembly.sessionSeed,
    questionCount: assembly.questions.length,
    coreCoverageCount: assembly.coreCoverageCount,
    reinforcementCount: assembly.reinforcementCount,
    fiveOptionIntegrity: assembly.questions.every((question) => question.options.length === CANONICAL_ANSWER_ARCHITECTURE.optionCount),
    uniqueQuestionCount: new Set(assembly.questions.map((question) => question.question_id)).size,
  };
}
