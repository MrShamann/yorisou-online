import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { getTemporary120QResultCompatibility } from "@/app/check-in/resultCompatibility";
import {
  assignPublicArchetype,
  PUBLIC_ARCHETYPE_RULES,
  PUBLIC_ARCHETYPE_TAXONOMY,
  PUBLIC_RESULT_CURRENT_STATE_NOTE,
  PUBLIC_RESULT_MAPPING_VERSION,
} from "@/lib/yorisou/public-result";
import {
  FORMULA_DRAFT_REQUIRES_EDWARD_APPROVAL,
  REVIEW_ROUTING_VALUES,
  SENSITIVITY_HANDLING_VALUES,
  SUBDIMENSION_CODES,
  type OptionScore,
  type SafetyRoutingSummary,
  type SubdimensionCode,
} from "@/lib/yorisou/scoring/types";

function makeRow(subdimensionCode: SubdimensionCode): OptionScore {
  return {
    questionId: "Q001",
    optionId: "A",
    dimensionCode: subdimensionCode.slice(0, 2) as OptionScore["dimensionCode"],
    subdimensionCode,
    variantType: "core_behavior",
    primarySignal: "TEST_SIGNAL",
    secondarySignals: [],
    primaryAxisContribution: "TEST",
    secondaryAxisModifiers: "TEST",
    signalStrength: 0,
    confidenceBand: "L",
    sensitivityHandling: "public_safe",
    reviewRouting: "none",
    crossFamilyHandling: "native_source_contribution",
    safetyNotes: [],
    correctionNotes: "",
    sourceRow: {
      questionId: "Q001",
      optionId: "A",
      dimensionCode: subdimensionCode.slice(0, 2) as OptionScore["dimensionCode"],
      subdimensionCode,
      variantType: "core_behavior",
      primarySignal: "TEST_SIGNAL",
      secondarySignals: "",
      primaryAxisContribution: "TEST",
      secondaryAxisModifiers: "TEST",
      signalStrength: "0",
      confidenceBand: "L",
      sensitivityHandling: "public_safe",
      reviewRouting: "none",
      crossFamilyHandling: "native_source_contribution",
      safetyNotes: "",
      correctionNotes: "",
    },
  };
}

function makeGroupedBySubdimension(
  counts: Partial<Record<SubdimensionCode, number>>,
): Record<SubdimensionCode, OptionScore[]> {
  return Object.fromEntries(
    SUBDIMENSION_CODES.map((code) => [
      code,
      Array.from({ length: counts[code] ?? 0 }, () => makeRow(code)),
    ]),
  ) as Record<SubdimensionCode, OptionScore[]>;
}

function makeSafetyRoutingSummary(
  overrides?: Partial<SafetyRoutingSummary>,
): SafetyRoutingSummary {
  const sensitivityCounts = Object.fromEntries(
    SENSITIVITY_HANDLING_VALUES.map((value) => [value, 0]),
  ) as SafetyRoutingSummary["sensitivityCounts"];
  const reviewRoutingCounts = Object.fromEntries(
    REVIEW_ROUTING_VALUES.map((value) => [value, 0]),
  ) as SafetyRoutingSummary["reviewRoutingCounts"];

  return {
    sensitivityCounts,
    reviewRoutingCounts,
    highSensitivityRows: [],
    warnings: [],
    ...overrides,
  };
}

export function runPublicAssignmentValidationTest() {
  assert.equal(PUBLIC_ARCHETYPE_TAXONOMY.length, 24);
  assert.equal(new Set(PUBLIC_ARCHETYPE_TAXONOMY.map((item) => item.publicCode)).size, 24);

  const mappedCodes = new Set(PUBLIC_ARCHETYPE_RULES.map((rule) => rule.publicCode));
  for (const archetype of PUBLIC_ARCHETYPE_TAXONOMY) {
    assert.equal(mappedCodes.has(archetype.publicCode), true);
  }

  const missingResolution = assignPublicArchetype({} as never);
  assert.equal(missingResolution.status, "placeholder");

  const incompleteResolution = assignPublicArchetype({
    answerCount: 119,
    groupedBySubdimension: makeGroupedBySubdimension({
      SD_ATMOSPHERE_READING: 2,
      SO_NOTICING_STATE: 2,
    }),
    formulaStatus: FORMULA_DRAFT_REQUIRES_EDWARD_APPROVAL,
  });
  assert.equal(incompleteResolution.status, "placeholder");

  const clanTieResolution = assignPublicArchetype({
    answerCount: 120,
    groupedBySubdimension: makeGroupedBySubdimension({
      SD_ATMOSPHERE_READING: 1,
      SO_NOTICING_STATE: 1,
      AR_STARTABILITY: 1,
      DR_STARTING_POINT: 1,
    }),
    formulaStatus: FORMULA_DRAFT_REQUIRES_EDWARD_APPROVAL,
  });
  assert.equal(clanTieResolution.status, "placeholder");

  const archetypeTieResolution = assignPublicArchetype({
    answerCount: 120,
    groupedBySubdimension: makeGroupedBySubdimension({
      SD_ATMOSPHERE_READING: 1,
      SO_NOTICING_STATE: 1,
      SD_RETURNABLE_DISTANCE: 1,
    }),
    formulaStatus: FORMULA_DRAFT_REQUIRES_EDWARD_APPROVAL,
  });
  assert.equal(archetypeTieResolution.status, "placeholder");

  const blockedResolution = assignPublicArchetype({
    answerCount: 120,
    groupedBySubdimension: makeGroupedBySubdimension({
      SD_ATMOSPHERE_READING: 2,
      SO_NOTICING_STATE: 2,
    }),
    safetyRoutingSummary: makeSafetyRoutingSummary({
      sensitivityCounts: {
        public_safe: 0,
        private_low: 0,
        private_medium: 0,
        private_high: 1,
      },
    }),
    formulaStatus: FORMULA_DRAFT_REQUIRES_EDWARD_APPROVAL,
  });
  assert.equal(blockedResolution.status, "placeholder");

  const assignedResolution = assignPublicArchetype({
    answerCount: 120,
    groupedBySubdimension: makeGroupedBySubdimension({
      SD_ATMOSPHERE_READING: 2,
      SO_NOTICING_STATE: 2,
      EL_TENSION: 1,
    }),
    safetyRoutingSummary: makeSafetyRoutingSummary(),
    formulaStatus: FORMULA_DRAFT_REQUIRES_EDWARD_APPROVAL,
  });

  assert.equal(assignedResolution.status, "assigned");
  assert.equal(assignedResolution.assignment?.publicCode, "MS-KI");
  assert.equal(assignedResolution.assignment?.nickname, "気配読み");
  assert.equal(assignedResolution.assignment?.mappingVersion, PUBLIC_RESULT_MAPPING_VERSION);
  assert.equal(assignedResolution.assignment?.currentStateNote, PUBLIC_RESULT_CURRENT_STATE_NOTE);
  assert.deepEqual(
    Object.keys(assignedResolution.assignment ?? {}).sort(),
    [
      "clanEnglish",
      "clanJapanese",
      "currentStateNote",
      "mappingVersion",
      "nickname",
      "publicCode",
      "secondaryBadge",
    ],
  );

  const compatibility = getTemporary120QResultCompatibility({
    resultId: assignedResolution.assignment?.publicCode,
    overlayId: "RESULT_TAXONOMY_NOT_APPROVED",
    confidenceBand: "low",
  });
  assert.equal(compatibility.resultStatus, "assigned");
  assert.equal(compatibility.displayLine.includes("気配読み"), true);
  assert.equal(compatibility.displayLine.includes("MS-KI"), false);
  assert.equal(compatibility.codeLine, "Mist / MS-KI");
  assert.equal(compatibility.shareLine, "私は気配読み。あなたは？");
  assert.equal(compatibility.currentStateNote, "120Qから見た、今の動き方");

  const resultPageSource = fs.readFileSync(
    path.join(process.cwd(), "app/result/page.tsx"),
    "utf8",
  );
  const resultShareSource = fs.readFileSync(
    path.join(process.cwd(), "app/result/share/page.tsx"),
    "utf8",
  );
  const reportPreviewSource = fs.readFileSync(
    path.join(process.cwd(), "app/report-preview/page.tsx"),
    "utf8",
  );
  const recommendationsSource = fs.readFileSync(
    path.join(process.cwd(), "app/recommendations/page.tsx"),
    "utf8",
  );
  const assignmentSource = fs.readFileSync(
    path.join(process.cwd(), "lib/yorisou/public-result/assignment.ts"),
    "utf8",
  );

  assert.equal(resultPageSource.includes("あなたはMS-KIです"), false);
  assert.equal(resultShareSource.includes("あなたはMS-KIです"), false);
  assert.equal(resultPageSource.includes('metadataBase: new URL("https://yorisou.online")'), true);
  assert.equal(resultShareSource.includes('metadataBase: new URL("https://yorisou.online")'), true);
  assert.equal(resultPageSource.includes("公開結果プレースホルダー"), false);
  assert.equal(reportPreviewSource.includes("Control Agent"), false);
  assert.equal(reportPreviewSource.includes("承認後"), false);
  assert.equal(recommendationsSource.includes("公開結果プレースホルダー"), false);
  assert.equal(assignmentSource.includes("signalStrengthSummary"), false);
  assert.equal(assignmentSource.includes("signalStrength"), false);

  return {
    taxonomyCount: PUBLIC_ARCHETYPE_TAXONOMY.length,
    mappedRuleCount: PUBLIC_ARCHETYPE_RULES.length,
    sampleAssignedCode: assignedResolution.assignment?.publicCode ?? null,
  };
}
