import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  aggregateInternal120QSelections,
  loadCanonical120QQuestionBank,
  loadCanonical120QScoringMaster,
  mapUserAnswersToOptionScores,
} from "../index";

function collectInternalFiles(rootDir: string): string[] {
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const resolved = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectInternalFiles(resolved));
      continue;
    }
    if (/\.(ts|md|csv)$/.test(entry.name)) {
      files.push(resolved);
    }
  }

  return files;
}

export function runSafetyAndIsolationValidationTest() {
  const questionBank = loadCanonical120QQuestionBank();
  const scoringMaster = loadCanonical120QScoringMaster();
  const rows = mapUserAnswersToOptionScores(
    {
      answers: [
        { questionId: "Q001", optionId: "D" },
        { questionId: "Q060", optionId: "D" },
        { questionId: "Q120", optionId: "B" },
      ],
    },
    questionBank,
    scoringMaster,
  );

  const output = aggregateInternal120QSelections(rows);
  assert.ok(output.safetyRoutingSummary.reviewRoutingCounts.needs_review >= 1);
  assert.ok(
    output.safetyRoutingSummary.reviewRoutingCounts.needs_human_review_sensitive >= 1,
  );
  assert.ok(output.safetyRoutingSummary.warnings.length >= 1);

  const internalFiles = collectInternalFiles(
    path.join(process.cwd(), "lib/yorisou/scoring"),
  );
  const sourceFiles = internalFiles.filter((filePath) => !filePath.includes("/__tests__/"));
  const fileContents = sourceFiles.map((filePath) => ({
    filePath,
    content: fs.readFileSync(filePath, "utf8"),
  }));

  const forbiddenImports = fileContents.filter(
    ({ content }) =>
      content.includes("app/check-in") ||
      content.includes("app/result") ||
      content.includes("app/report-preview") ||
      content.includes("app/line") ||
      content.includes("t6Scoring") ||
      content.includes("publicResultLabel") ||
      content.includes("paidReport"),
  );

  assert.equal(forbiddenImports.length, 0);

  return {
    safetyWarnings: output.safetyRoutingSummary.warnings.length,
    scannedFiles: sourceFiles.length,
  };
}
