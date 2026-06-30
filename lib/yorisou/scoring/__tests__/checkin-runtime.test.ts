import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  buildCurrentStateResultPayload,
  currentStateCheckV1,
  currentStateQuestions,
  scoreCurrentStateCheck,
  type CurrentStateAnswerMap,
} from "@/app/check-in/currentStateCheckV1";

export function runCheckInRuntimeValidationTest() {
  assert.equal(currentStateQuestions.length, 120);
  assert.equal(currentStateCheckV1.requiredAnswerCount, 120);
  assert.equal(currentStateQuestions[0]?.id, "Q001");
  assert.equal(currentStateQuestions[119]?.id, "Q120");

  for (const question of currentStateQuestions) {
    assert.equal(question.options.length, 5);
    assert.deepEqual(
      question.options.map((option) => option.id),
      ["A", "B", "C", "D", "E"],
    );
  }

  const answers = currentStateQuestions.reduce<CurrentStateAnswerMap>(
    (accumulator, question) => {
      accumulator[question.id] = "A";
      return accumulator;
    },
    {} as CurrentStateAnswerMap,
  );

  const scoring = scoreCurrentStateCheck(answers);
  const payload = buildCurrentStateResultPayload(scoring, answers);

  assert.equal(scoring.answerCount, 120);
  assert.equal(payload.answerCount, 120);
  assert.equal(payload.resultTaxonomyStatus, "RESULT_TAXONOMY_NOT_APPROVED");
  assert.equal(payload.rawScoringDataStored, false);

  const checkInSource = fs.readFileSync(
    path.join(process.cwd(), "app/check-in/currentStateCheckV1.ts"),
    "utf8",
  );
  const miniFlowSource = fs.readFileSync(
    path.join(process.cwd(), "app/check-in/MiniTestFlow.tsx"),
    "utf8",
  );

  assert.equal(checkInSource.includes("t6QuestionBank"), false);
  assert.equal(checkInSource.includes("t6Scoring"), false);
  assert.equal(miniFlowSource.includes("24問で、今の流れを少しずつ見ていきます。"), false);

  return {
    totalQuestions: currentStateQuestions.length,
    payloadAnswerCount: payload.answerCount,
  };
}
