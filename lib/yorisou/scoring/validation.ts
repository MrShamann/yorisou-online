import {
  CONFIDENCE_BANDS,
  CROSS_FAMILY_HANDLING_VALUES,
  REVIEW_ROUTING_VALUES,
  SENSITIVITY_HANDLING_VALUES,
  SIGNAL_STRENGTH_VALUES,
  type OptionScore,
  type Question,
  type QuestionBankValidationReport,
  type QuestionId,
  type ScoringMasterValidationReport,
} from "./types";

const EXPECTED_QUESTION_IDS = Array.from({ length: 120 }, (_, index) =>
  `Q${String(index + 1).padStart(3, "0")}` as QuestionId,
);

const EXPECTED_OPTION_IDS = ["A", "B", "C", "D", "E"] as const;

const FORBIDDEN_SCORING_HEADERS = [
  "formula",
  "resultTaxonomy",
  "resultName",
  "publicCopy",
  "paid_report_copy",
  "payment",
  "database",
  "line",
  "db",
];

export function assertQuestionBankIntegrity(questions: Question[]): QuestionBankValidationReport {
  if (questions.length !== 120) {
    throw new Error(`Expected 120 questions, found ${questions.length}`);
  }

  const questionIds = questions.map((question) => question.questionId);
  const uniqueQuestionIds = new Set(questionIds);
  if (uniqueQuestionIds.size !== 120) {
    throw new Error(`Expected 120 unique question IDs, found ${uniqueQuestionIds.size}`);
  }

  for (const expectedId of EXPECTED_QUESTION_IDS) {
    if (!uniqueQuestionIds.has(expectedId)) {
      throw new Error(`Missing question ${expectedId} in canonical 120Q question bank`);
    }
  }

  for (const question of questions) {
    if (question.options.length !== 5) {
      throw new Error(
        `Expected exactly 5 options for ${question.questionId}, found ${question.options.length}`,
      );
    }

    const optionIds = question.options.map((option) => option.id);
    if (optionIds.join(",") !== EXPECTED_OPTION_IDS.join(",")) {
      throw new Error(
        `Expected A-E options for ${question.questionId}, found ${optionIds.join(",")}`,
      );
    }
  }

  const q060 = questions.find((question) => question.questionId === "Q060");
  const q060OptionD = q060?.options.find((option) => option.id === "D");
  if (q060OptionD?.text !== "自分の範囲を少し越えていた") {
    throw new Error("Q060 option D does not match canonical source text");
  }

  return {
    questionCount: questions.length,
    uniqueQuestionCount: uniqueQuestionIds.size,
    questionIds,
  };
}

export function assertScoringMasterIntegrity(
  scoringRows: OptionScore[],
): ScoringMasterValidationReport {
  if (scoringRows.length !== 600) {
    throw new Error(`Expected 600 scoring rows, found ${scoringRows.length}`);
  }

  const duplicateKeys = new Set<string>();
  const seenKeys = new Set<string>();
  const perQuestionOptions = new Map<QuestionId, Set<string>>();
  const questionIds = new Set<QuestionId>();

  for (const row of scoringRows) {
    const key = `${row.questionId}:${row.optionId}`;
    questionIds.add(row.questionId);

    if (seenKeys.has(key)) {
      duplicateKeys.add(key);
    }
    seenKeys.add(key);

    const optionSet = perQuestionOptions.get(row.questionId) || new Set<string>();
    optionSet.add(row.optionId);
    perQuestionOptions.set(row.questionId, optionSet);

    if (!(SIGNAL_STRENGTH_VALUES as readonly number[]).includes(row.signalStrength)) {
      throw new Error(`Invalid signalStrength on ${key}`);
    }
    if (!(CONFIDENCE_BANDS as readonly string[]).includes(row.confidenceBand)) {
      throw new Error(`Invalid confidenceBand on ${key}`);
    }
    if (
      !(SENSITIVITY_HANDLING_VALUES as readonly string[]).includes(
        row.sensitivityHandling,
      )
    ) {
      throw new Error(`Invalid sensitivityHandling on ${key}`);
    }
    if (!(REVIEW_ROUTING_VALUES as readonly string[]).includes(row.reviewRouting)) {
      throw new Error(`Invalid reviewRouting on ${key}`);
    }
    if (
      !(CROSS_FAMILY_HANDLING_VALUES as readonly string[]).includes(
        row.crossFamilyHandling,
      )
    ) {
      throw new Error(`Invalid crossFamilyHandling on ${key}`);
    }
  }

  if (duplicateKeys.size > 0) {
    throw new Error(
      `Duplicate questionId + optionId pairs found: ${[...duplicateKeys].join(", ")}`,
    );
  }

  for (const expectedId of EXPECTED_QUESTION_IDS) {
    const optionSet = perQuestionOptions.get(expectedId);
    if (!optionSet) {
      throw new Error(`Missing scoring rows for ${expectedId}`);
    }

    const actualOptionIds = [...optionSet].sort();
    if (actualOptionIds.join(",") !== EXPECTED_OPTION_IDS.join(",")) {
      throw new Error(
        `Expected A-E scoring rows for ${expectedId}, found ${actualOptionIds.join(",")}`,
      );
    }
  }

  return {
    rowCount: scoringRows.length,
    questionCount: questionIds.size,
    duplicateKeys: [],
  };
}

export function assertQuestionBankMatchesScoringMaster(
  questions: Question[],
  scoringRows: OptionScore[],
) {
  const questionOptionKeys = new Set(
    questions.flatMap((question) =>
      question.options.map((option) => `${question.questionId}:${option.id}`),
    ),
  );
  const scoringKeys = new Set(
    scoringRows.map((row) => `${row.questionId}:${row.optionId}`),
  );

  for (const key of questionOptionKeys) {
    if (!scoringKeys.has(key)) {
      throw new Error(`Missing scoring row for question/option pair ${key}`);
    }
  }

  for (const key of scoringKeys) {
    if (!questionOptionKeys.has(key)) {
      throw new Error(`Scoring row ${key} does not match canonical question bank`);
    }
  }
}

export function assertNoForbiddenScoringColumns(headers: string[]) {
  const collisions = headers.filter((header) =>
    FORBIDDEN_SCORING_HEADERS.some((forbidden) =>
      header.toLowerCase().includes(forbidden.toLowerCase()),
    ),
  );

  if (collisions.length > 0) {
    throw new Error(`Forbidden scoring columns detected: ${collisions.join(", ")}`);
  }
}
