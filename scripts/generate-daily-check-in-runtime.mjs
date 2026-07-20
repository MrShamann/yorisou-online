#!/usr/bin/env node
// DCI-1 — deterministic generation of the daily-check-in runtime artifact from the
// CANONICAL spec docs/yorisou/mtf2a/daily-check-in.v1.json (single source of truth).
//
// Regenerate with:  node scripts/generate-daily-check-in-runtime.mjs
// Drift check:      node scripts/generate-daily-check-in-runtime.mjs --check
//
// The generated file is NEVER edited by hand. The canonical content hash is
// verified before generation and embedded in the artifact; the DCI canonical
// contract test re-verifies both the source hash and artifact drift.

import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const CANONICAL_PATH = "docs/yorisou/mtf2a/daily-check-in.v1.json";
const OUT_PATH = "lib/yorisou/methods/daily-check-in/definition.generated.ts";
const EXPECTED_HASH = "4107f004e0099bfd4ef82936f9801c421d256eb6d7ccacda8e762a7a132a8bd3";

const canonical = JSON.parse(readFileSync(join(process.cwd(), CANONICAL_PATH), "utf8"));

// Reproduce the canonical serialization (compact separators, key order as authored,
// ensure_ascii=False ≡ JSON.stringify default) and verify the pinned hash.
const hashInput = JSON.stringify([canonical.stateSchema.fields, canonical.stateSchema.privateReflection, canonical.acknowledgementRules]);
const actualHash = createHash("sha256").update(hashInput, "utf8").digest("hex");
if (actualHash !== EXPECTED_HASH || canonical.definition.contentHash.value !== EXPECTED_HASH) {
  console.error(`FATAL: canonical content hash mismatch — expected ${EXPECTED_HASH}, computed ${actualHash}, pinned ${canonical.definition.contentHash.value}`);
  process.exit(1);
}

// Distill exactly the runtime-needed subset (no rewriting of any Japanese copy).
const artifact = {
  methodId: canonical.identity.methodId,
  methodVersion: canonical.identity.methodVersion,
  nameJa: canonical.identity.nameJa,
  subtitleJa: canonical.identity.subtitleJa,
  family: canonical.identity.family,
  executionModel: canonical.identity.executionModel,
  activationState: canonical.identity.activationState,
  schemaVersion: canonical.definition.inputSchemaVersion,
  acknowledgementVersion: canonical.definition.acknowledgementCopyVersion,
  longitudinalVersion: canonical.longitudinal.version,
  recordContractVersion: canonical.recordContract.version,
  contentHash: canonical.definition.contentHash.value,
  yorisouScoring: null,
  fields: canonical.stateSchema.fields.map((f) => ({
    fieldId: f.fieldId,
    labelJa: f.labelJa,
    helperJa: f.helperJa,
    options: f.options.map((o) => ({ optionId: o.optionId, labelJa: o.labelJa })),
  })),
  privateReflection: {
    fieldId: canonical.stateSchema.privateReflection.fieldId,
    labelJa: canonical.stateSchema.privateReflection.labelJa,
    defaultOff: canonical.stateSchema.privateReflection.defaultOff,
    maxLength: canonical.stateSchema.privateReflection.maxLength,
  },
  acknowledgementCascade: canonical.acknowledgementRules.priorityCascade.map((r) => ({ rule: r.rule, ackId: r.ackId })),
  acknowledgements: canonical.acknowledgementRules.acknowledgements.map((a) => ({ ackId: a.ackId, copyJa: a.copyJa })),
  sevenDaySummary: {
    minimumRecordedDays: canonical.longitudinal.sevenDaySummary.minimumRecordedDays,
    maxSimultaneousSummaries: canonical.longitudinal.sevenDaySummary.maxSimultaneousSummaries,
    priorityOrder: canonical.longitudinal.sevenDaySummary.priorityOrder,
    insufficientHistoryCopyJa: canonical.longitudinal.sevenDaySummary.insufficientHistoryCopyJa,
    rules: canonical.longitudinal.sevenDaySummary.rules.map((r) => ({ summaryId: r.summaryId, minFieldValid: r.minFieldValid, copyJa: r.copyJa })),
  },
  thirtyDaySummary: {
    minimumRecordedDays: canonical.longitudinal.thirtyDaySummary.minimumRecordedDays,
    insufficientDataCopyJa: canonical.longitudinal.thirtyDaySummary.insufficientDataCopyJa,
  },
  reflectionPrompts: canonical.longitudinal.reflectionPrompts.prompts.map((p) => ({ promptId: p.promptId, copyJa: p.copyJa })),
  copy: canonical.copyBundles,
  needMapping: canonical.recommendationPolicy.needMapping.map((m) => ({ optionId: m.optionId, tag: m.tag, fitReasonJa: m.fitReasonJa })),
  unansweredNeedBehavior: "no_recommendation",
  comparisonPolicy: canonical.resultSchema.comparisonPolicy,
  understandingPolicy: canonical.resultSchema.understandingPolicy,
  understandingNoteJa: canonical.resultSchema.understandingNoteJa,
  confirmationRequired: canonical.resultSchema.confirmation.required,
  cadence: canonical.cadence,
  privacy: canonical.privacy,
  prohibitions: canonical.prohibitions,
};

const body = `// GENERATED FILE — DO NOT EDIT BY HAND.
// Source of truth: ${CANONICAL_PATH}
// Source content hash (sha256, canonical serialization): ${EXPECTED_HASH}
// Regenerate: node scripts/generate-daily-check-in-runtime.mjs
// Drift check: node scripts/generate-daily-check-in-runtime.mjs --check
// Validation fails when this artifact drifts from the canonical JSON
// (lib/yorisou/methods/daily-check-in/__tests__/canonical.test.ts).

export const DAILY_CHECK_IN_SOURCE_HASH = "${EXPECTED_HASH}" as const;

export const DAILY_CHECK_IN_DEFINITION = ${JSON.stringify(artifact, null, 2)} as const;

export type DailyCheckInDefinition = typeof DAILY_CHECK_IN_DEFINITION;
export type DailyFieldId = DailyCheckInDefinition["fields"][number]["fieldId"];
export type DailyAckId = DailyCheckInDefinition["acknowledgements"][number]["ackId"];
`;

if (process.argv.includes("--check")) {
  const existing = readFileSync(join(process.cwd(), OUT_PATH), "utf8");
  if (existing !== body) {
    console.error("FATAL: generated artifact has drifted from the canonical JSON — run: node scripts/generate-daily-check-in-runtime.mjs");
    process.exit(1);
  }
  console.log("daily-check-in runtime artifact: in sync with canonical source (hash verified)");
} else {
  writeFileSync(join(process.cwd(), OUT_PATH), body);
  console.log(`generated ${OUT_PATH} from ${CANONICAL_PATH} (hash ${EXPECTED_HASH.slice(0, 12)}…)`);
}
