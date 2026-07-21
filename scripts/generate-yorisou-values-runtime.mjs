#!/usr/bin/env node
// YV-1 — deterministic generation of the yorisou-values runtime artifact from the
// CANONICAL spec docs/yorisou/mtf2a/yorisou-values.v1.json (single source of truth).
//
// Regenerate with:  node scripts/generate-yorisou-values-runtime.mjs
// Drift check:      node scripts/generate-yorisou-values-runtime.mjs --check
//
// The generated file is NEVER edited by hand. The canonical bank content hash is
// re-verified before generation (sha256 over the compact JSON serialization of
// questionBank.items — separators ',' ':', ensure_ascii=False ≡ JSON.stringify
// default, authored key order) and embedded in the artifact; the YV-1 canonical
// contract test re-verifies both the source hash and artifact drift. This does
// NOT mutate the canonical JSON.

import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const CANONICAL_PATH = "docs/yorisou/mtf2a/yorisou-values.v1.json";
const OUT_PATH = "lib/yorisou/methods/yorisou-values/definition.generated.ts";
const EXPECTED_BANK_HASH = "919f17251a280bb34258f6042db46bb9fd543763b33e041de64c36b305eaa9a6";

const canonical = JSON.parse(readFileSync(join(process.cwd(), CANONICAL_PATH), "utf8"));

// Re-verify the pinned bank hash (compact serialization over questionBank.items).
const bankHash = createHash("sha256").update(JSON.stringify(canonical.questionBank.items), "utf8").digest("hex");
if (bankHash !== EXPECTED_BANK_HASH || canonical.definition.contentHash.value !== EXPECTED_BANK_HASH) {
  console.error(`FATAL: canonical bank hash mismatch — expected ${EXPECTED_BANK_HASH}, computed ${bankHash}, pinned ${canonical.definition.contentHash.value}`);
  process.exit(1);
}

// Distill exactly the runtime-needed subset (no Japanese copy rewritten).
const artifact = {
  methodId: canonical.identity.methodId,
  methodVersion: canonical.identity.methodVersion,
  specVersion: canonical.specVersion,
  nameJa: canonical.identity.nameJa,
  subtitleJa: canonical.identity.subtitleJa,
  family: canonical.identity.family,
  executionModel: canonical.identity.executionModel,
  activationState: canonical.identity.activationState,
  bankVersion: canonical.definition.bankVersion,
  scoringVersion: canonical.definition.scoringVersion,
  resultSchemaVersion: canonical.definition.resultSchemaVersion,
  bankContentHash: canonical.definition.contentHash.value,
  dimensionOrder: canonical.dimensions.map((d) => d.dimensionId),
  dimensions: canonical.dimensions.map((d) => ({
    dimensionId: d.dimensionId,
    nameJa: d.nameJa,
    definitionJa: d.definitionJa,
    notMeaningJa: d.notMeaningJa,
  })),
  dimensionAppearances: canonical.questionBank.dimensionAppearances,
  items: canonical.questionBank.items.map((i) => ({
    itemId: i.itemId,
    pair: i.pair,
    promptJa: i.promptJa,
    choiceA: { textJa: i.choiceA.textJa, dimension: i.choiceA.dimension },
    choiceB: { textJa: i.choiceB.textJa, dimension: i.choiceB.dimension },
    sensitivity: i.sensitivity,
  })),
  scoring: {
    model: canonical.scoring.model,
    requiredAnsweredItems: canonical.scoring.minimumCoverage.requiredAnsweredItems,
    insufficientCoverageCopyJa: canonical.scoring.minimumCoverage.insufficientCoverageCopyJa,
    mixedThreshold: 0.05,
    confidenceBoundaryJa: canonical.scoring.confidencePolicy.userFacingBoundaryJa,
  },
  secondarySignal: {
    labelJa: canonical.secondarySignalRendering.labelJa,
    mixedCloseSetLabelJa: "同じくらい近かった軸",
  },
  results: canonical.results.map((r) => ({
    resultId: r.resultId,
    primaryDimension: r.primaryDimension,
    public: r.public,
    private: r.private,
  })),
  recommendationGovernedTags: canonical.recommendationPolicy.governedTags,
  interpretationLimitsJa: canonical.interpretationLimitsJa,
  usageBoundaryJa: canonical.usageBoundaryJa,
  privacyClass: canonical.privacy.privacyClass,
  confirmationRequired: canonical.resultObjectContract.confirmation.required,
  understandingPolicy: canonical.resultObjectContract.understandingPolicy,
};

const body = `// GENERATED FILE — DO NOT EDIT BY HAND.
// Source of truth: ${CANONICAL_PATH}
// Canonical bank content hash (sha256, compact serialization of questionBank.items): ${EXPECTED_BANK_HASH}
// Regenerate: node scripts/generate-yorisou-values-runtime.mjs
// Drift check: node scripts/generate-yorisou-values-runtime.mjs --check
// Validation fails when this artifact drifts from the canonical JSON
// (lib/yorisou/methods/yorisou-values/__tests__/yorisouValues.test.ts).

export const YORISOU_VALUES_BANK_HASH = "${EXPECTED_BANK_HASH}" as const;

export const YORISOU_VALUES_DEFINITION = ${JSON.stringify(artifact, null, 2)} as const;

export type YorisouValuesDefinition = typeof YORISOU_VALUES_DEFINITION;
export type YorisouValuesDimensionId = YorisouValuesDefinition["dimensionOrder"][number];
export type YorisouValuesResultId = YorisouValuesDefinition["results"][number]["resultId"];
`;

if (process.argv.includes("--check")) {
  const existing = readFileSync(join(process.cwd(), OUT_PATH), "utf8");
  if (existing !== body) {
    console.error("FATAL: generated artifact has drifted from the canonical JSON — run: node scripts/generate-yorisou-values-runtime.mjs");
    process.exit(1);
  }
  console.log("yorisou-values runtime artifact: in sync with canonical source (bank hash verified)");
} else {
  writeFileSync(join(process.cwd(), OUT_PATH), body);
  console.log(`generated ${OUT_PATH} from ${CANONICAL_PATH} (bank hash ${EXPECTED_BANK_HASH.slice(0, 12)}…)`);
}
