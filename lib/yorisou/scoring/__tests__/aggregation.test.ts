import assert from "node:assert/strict";

import {
  FORMULA_DRAFT_REQUIRES_EDWARD_APPROVAL,
  aggregateInternal120QSelections,
  loadCanonical120QQuestionBank,
  loadCanonical120QScoringMaster,
  mapUserAnswersToOptionScores,
} from "../index";

export function runAggregationValidationTest() {
  const questionBank = loadCanonical120QQuestionBank();
  const scoringMaster = loadCanonical120QScoringMaster();
  const rows = mapUserAnswersToOptionScores(
    {
      answers: [
        { questionId: "Q001", optionId: "C" },
        { questionId: "Q060", optionId: "D" },
        { questionId: "Q120", optionId: "B" },
      ],
    },
    questionBank,
    scoringMaster,
  );

  const output = aggregateInternal120QSelections(rows);
  assert.equal(output.selectedRows.length, 3);
  assert.equal(
    output.formulaStatus,
    FORMULA_DRAFT_REQUIRES_EDWARD_APPROVAL,
  );
  assert.equal(output.groupedByDimension.DR.length, 1);
  assert.ok(output.groupedByPrimarySignal.contextual_entry.length >= 1);
  assert.ok(output.internalWarnings.length >= 1);

  return {
    warningCount: output.internalWarnings.length,
  };
}
