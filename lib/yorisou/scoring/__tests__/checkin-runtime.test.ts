import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  buildCurrentStateResultPayload,
  currentStateCheckV1,
  currentStateQuestions,
  readCurrentStateResult,
  scoreCurrentStateCheck,
  type CurrentStateAnswerMap,
} from "@/app/check-in/currentStateCheckV1";
import { buildAbsolutePublicResultUrl } from "@/app/check-in/resultCompatibility";
import { buildMiniAppCheckInHandoffHref, LINE_MINI_APP_NAV_VERSION } from "@/lib/server/miniAppEntryRouting";
import { PUBLIC_RESULT_MAPPING_VERSION, PUBLIC_RESULT_PLACEHOLDER_CODE } from "@/lib/yorisou/public-result";

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
  const miniAppHandoffHref = buildMiniAppCheckInHandoffHref({ locale: "ja", searchParams: {} });
  const absoluteResultUrl = buildAbsolutePublicResultUrl("/result", {
    resultId: scoring.resultId,
    overlayId: scoring.overlayId,
    confidenceBand: scoring.confidenceBand,
  });

  assert.equal(scoring.answerCount, 120);
  assert.equal(payload.answerCount, 120);
  assert.equal(payload.resultId, scoring.resultId);
  assert.notEqual(scoring.resultId, PUBLIC_RESULT_PLACEHOLDER_CODE);
  assert.equal(payload.resultTaxonomyStatus, PUBLIC_RESULT_MAPPING_VERSION);
  assert.equal(payload.rawScoringDataStored, false);
  assert.equal(currentStateCheckV1.testName, "いま色テスト by よりそう");
  assert.equal(readCurrentStateResult(null), null);
  assert.equal(miniAppHandoffHref.includes("entry_source=line-mini-app"), true);
  assert.equal(miniAppHandoffHref.includes("source=line"), true);
  assert.equal(miniAppHandoffHref.includes("nav=hard"), true);
  assert.equal(miniAppHandoffHref.includes(`v=${LINE_MINI_APP_NAV_VERSION}`), true);
  assert.equal(absoluteResultUrl.startsWith("https://yorisou.online/result?"), true);

  const checkInSource = fs.readFileSync(
    path.join(process.cwd(), "app/check-in/currentStateCheckV1.ts"),
    "utf8",
  );
  const miniFlowSource = fs.readFileSync(
    path.join(process.cwd(), "app/check-in/MiniTestFlow.tsx"),
    "utf8",
  );
  const loadingSource = fs.readFileSync(
    path.join(process.cwd(), "app/report-loading/page.tsx"),
    "utf8",
  );

  assert.equal(checkInSource.includes("t6QuestionBank"), false);
  assert.equal(checkInSource.includes("t6Scoring"), false);
  assert.equal(miniFlowSource.includes("24問で、今の流れを少しずつ見ていきます。"), false);
  assert.equal(miniFlowSource.includes("いま色テストをはじめる"), true);
  assert.equal(miniFlowSource.includes('searchParams.get("entry_source") === "line-mini-app"'), true);
  assert.equal(miniFlowSource.includes("window.location.assign(target.absoluteHref)"), true);
  assert.equal(miniFlowSource.includes("absoluteHref"), true);
  assert.equal(miniFlowSource.includes("結果を見る"), true);
  assert.equal(miniFlowSource.includes("結果ページを開く"), true);
  assert.equal(loadingSource.includes("window.location.replace(resultHref)"), true);
  assert.equal(loadingSource.includes("結果ページを開く"), true);

  return {
    totalQuestions: currentStateQuestions.length,
    payloadAnswerCount: payload.answerCount,
    sampleResultId: scoring.resultId,
  };
}
