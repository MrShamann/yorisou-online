import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";

import {
  buildCurrentStateResultPayload,
  currentStateCheckV1,
  currentStateQuestions,
  readCurrentStateResult,
  scoreCurrentStateCheck,
  type CurrentStateAnswerMap,
} from "@/app/tests/ima-iro/currentStateCheckV1";
import { buildAbsolutePublicResultUrl } from "@/app/tests/ima-iro/resultCompatibility";
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
  assert.equal(absoluteResultUrl.includes(`resultId=${scoring.resultId}`), true);
  assert.equal(absoluteResultUrl.includes("overlayId=balancing"), true);
  assert.equal(absoluteResultUrl.includes("confidence=low"), true);
  assert.equal(absoluteResultUrl.includes("payloadKey="), false);

  const checkInSource = fs.readFileSync(
    path.join(process.cwd(), "app/tests/ima-iro/currentStateCheckV1.ts"),
    "utf8",
  );
  const miniFlowSource = fs.readFileSync(
    path.join(process.cwd(), "app/tests/ima-iro/MiniTestFlow.tsx"),
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
  // NAVIGATION CONTRACT — updated to what the code actually does.
  //
  // These four assertions used to require `target.absoluteHref` and `lineMiniAppFinalResultHref`:
  // a client-built ABSOLUTE result URL. UX-2 deliberately removed that — MiniTestFlow's own comment
  // records why, and the reason matters: an absolute production-origin URL sent someone who
  // completed on a Preview deployment to yorisou.online, a different environment, carrying their
  // canonical private row id in the query string. Completion now navigates RELATIVELY, by persisted
  // identity, so the strings this file demanded had not existed for some time.
  //
  // The assertions were never noticed because nothing ran them: the file exports a function that
  // no npm script and no workflow invoked. Restored to the current contract rather than deleted,
  // because the contract itself is worth pinning.
  assert.equal(miniFlowSource.includes("absoluteHref"), false, "no client-built absolute result URL");
  assert.equal(miniFlowSource.includes('canonical("/result")'), true, "relative, same-origin navigation");
  assert.equal(miniFlowSource.includes("navigationFallbackHref"), true, "a visible fallback link exists");
  assert.equal(miniFlowSource.includes("結果を見る"), false);
  assert.equal(miniFlowSource.includes("結果へ進む"), true);
  assert.equal(miniFlowSource.includes("結果ページを開く"), true);
  assert.equal(miniFlowSource.includes("lineMiniAppReleaseMarker"), true);
  assert.equal(miniFlowSource.includes("LINE_MINI_APP_NAV_VERSION"), true);
  assert.equal(loadingSource.includes("router.replace(resultHref)"), true);
  assert.equal(loadingSource.includes("結果ページを開く"), true);

  return {
    totalQuestions: currentStateQuestions.length,
    payloadAnswerCount: payload.answerCount,
    sampleResultId: scoring.resultId,
  };
}

// The assertions above are reachable from `node --test`, not only from the aggregate runner.
//
// This file exported `runCheckInRuntimeValidationTest` and nothing invoked it. Its only caller,
// `./run.ts`, is itself wired to no npm script and no workflow, so the whole contract — including
// the LINE mini-app handoff parameters — had been dark long enough for four of its assertions to
// rot against a deliberate UX-2 change without anyone noticing. Registering it as a real test is
// what makes the npm script and the CI step mean something; the export stays for `run.ts`.
test("check-in runtime contract (120Q scoring, payload, LINE handoff, navigation)", () => {
  const summary = runCheckInRuntimeValidationTest();
  assert.equal(summary.totalQuestions, 120);
  assert.equal(summary.payloadAnswerCount, 120);
});
