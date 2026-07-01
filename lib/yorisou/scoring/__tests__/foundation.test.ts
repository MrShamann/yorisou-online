import assert from "node:assert/strict";

import {
  CANONICAL_120Q_SCORING_MASTER_HEADERS,
  loadCanonical120QQuestionBank,
  loadCanonical120QScoringMaster,
  assertNoForbiddenScoringColumns,
  assertQuestionBankIntegrity,
  assertQuestionBankMatchesScoringMaster,
  assertScoringMasterIntegrity,
} from "../index";

export function runFoundationValidationTest() {
  const questionBank = loadCanonical120QQuestionBank();
  const scoringMaster = loadCanonical120QScoringMaster();

  const questionReport = assertQuestionBankIntegrity(questionBank);
  const scoringReport = assertScoringMasterIntegrity(scoringMaster);
  assertQuestionBankMatchesScoringMaster(questionBank, scoringMaster);
  assertNoForbiddenScoringColumns([...CANONICAL_120Q_SCORING_MASTER_HEADERS]);

  assert.equal(questionReport.questionCount, 120);
  assert.equal(scoringReport.rowCount, 600);
  assert.equal(scoringReport.questionCount, 120);

  return {
    questionReport,
    scoringReport,
  };
}
