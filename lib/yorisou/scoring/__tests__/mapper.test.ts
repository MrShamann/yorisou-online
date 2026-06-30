import assert from "node:assert/strict";

import {
  loadCanonical120QQuestionBank,
  loadCanonical120QScoringMaster,
  mapUserAnswersToOptionScores,
  type ScoringInput,
} from "../index";

export function runMapperValidationTest() {
  const questionBank = loadCanonical120QQuestionBank();
  const scoringMaster = loadCanonical120QScoringMaster();

  const input: ScoringInput = {
    answers: [
      { questionId: "Q001", optionId: "A" },
      { questionId: "Q060", optionId: "D" },
      { questionId: "Q120", optionId: "E" },
    ],
  };

  const mapped = mapUserAnswersToOptionScores(input, questionBank, scoringMaster);
  assert.equal(mapped.length, 3);
  assert.equal(mapped[0]?.primarySignal, "small_start");
  assert.equal(mapped[1]?.questionId, "Q060");
  assert.equal(mapped[2]?.optionId, "E");

  assert.throws(() => {
    mapUserAnswersToOptionScores(
      {
        answers: [{ questionId: "Q001", optionId: "Z" as "A" }],
      },
      questionBank,
      scoringMaster,
    );
  });

  assert.throws(() => {
    mapUserAnswersToOptionScores(
      {
        answers: [{ questionId: "Q999" as "Q001", optionId: "A" }],
      },
      questionBank,
      scoringMaster,
    );
  });

  return {
    mappedCount: mapped.length,
  };
}
