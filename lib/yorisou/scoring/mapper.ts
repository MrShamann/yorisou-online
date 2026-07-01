import type {
  OptionScore,
  Question,
  ScoringInput,
  UserAnswer,
} from "./types";

function buildKey(questionId: string, optionId: string) {
  return `${questionId}:${optionId}`;
}

export function mapUserAnswersToOptionScores(
  input: ScoringInput,
  questionBank: Question[],
  scoringMaster: OptionScore[],
) {
  const questionLookup = new Map(questionBank.map((question) => [question.questionId, question]));
  const scoringLookup = new Map<string, OptionScore>();

  for (const row of scoringMaster) {
    const key = buildKey(row.questionId, row.optionId);
    if (scoringLookup.has(key)) {
      throw new Error(`Duplicate scoring row detected for ${key}`);
    }
    scoringLookup.set(key, row);
  }

  return input.answers.map((answer: UserAnswer) => {
    const question = questionLookup.get(answer.questionId);
    if (!question) {
      throw new Error(`Unknown questionId "${answer.questionId}"`);
    }

    const option = question.options.find((entry) => entry.id === answer.optionId);
    if (!option) {
      throw new Error(
        `Unknown optionId "${answer.optionId}" for question "${answer.questionId}"`,
      );
    }

    const scoringRow = scoringLookup.get(buildKey(answer.questionId, answer.optionId));
    if (!scoringRow) {
      throw new Error(
        `Missing scoring row for questionId "${answer.questionId}" and optionId "${answer.optionId}"`,
      );
    }

    return scoringRow;
  });
}
