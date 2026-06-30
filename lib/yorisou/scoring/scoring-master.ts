import {
  CONFIDENCE_BANDS,
  CROSS_FAMILY_HANDLING_VALUES,
  DIMENSION_CODES,
  REVIEW_ROUTING_VALUES,
  SENSITIVITY_HANDLING_VALUES,
  SIGNAL_STRENGTH_VALUES,
  SUBDIMENSION_CODES,
  VARIANT_TYPES,
  type CanonicalScoringRowRaw,
  type ConfidenceBand,
  type CrossFamilyHandling,
  type DimensionCode,
  type OptionId,
  type OptionScore,
  type QuestionId,
  type ReviewRouting,
  type SensitivityHandling,
  type SignalStrength,
  type SubdimensionCode,
  type VariantType,
} from "./types";
import {
  INTERNAL_120Q_SOURCE_PATHS,
  assertInternal120QSourceFilesExist,
  readInternal120QSourceFile,
} from "./source";

const EXPECTED_HEADERS = [
  "questionId",
  "optionId",
  "dimensionCode",
  "subdimensionCode",
  "variantType",
  "primarySignal",
  "secondarySignals",
  "primaryAxisContribution",
  "secondaryAxisModifiers",
  "signalStrength",
  "confidenceBand",
  "sensitivityHandling",
  "reviewRouting",
  "crossFamilyHandling",
  "safetyNotes",
  "correctionNotes",
] as const;

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let isQuoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === "\"") {
      if (isQuoted && line[index + 1] === "\"") {
        current += "\"";
        index += 1;
      } else {
        isQuoted = !isQuoted;
      }
      continue;
    }

    if (char === "," && !isQuoted) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function splitListField(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0 && entry !== "none");
}

function splitSemicolonField(value: string) {
  return value
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function isQuestionId(value: string): value is QuestionId {
  return /^Q\d{3}$/.test(value);
}

function isOptionId(value: string): value is OptionId {
  return ["A", "B", "C", "D", "E"].includes(value);
}

function isDimensionCode(value: string): value is DimensionCode {
  return (DIMENSION_CODES as readonly string[]).includes(value);
}

function isSubdimensionCode(value: string): value is SubdimensionCode {
  return (SUBDIMENSION_CODES as readonly string[]).includes(value);
}

function isVariantType(value: string): value is VariantType {
  return (VARIANT_TYPES as readonly string[]).includes(value);
}

function isConfidenceBand(value: string): value is ConfidenceBand {
  return (CONFIDENCE_BANDS as readonly string[]).includes(value);
}

function isSensitivityHandling(value: string): value is SensitivityHandling {
  return (SENSITIVITY_HANDLING_VALUES as readonly string[]).includes(value);
}

function isReviewRouting(value: string): value is ReviewRouting {
  return (REVIEW_ROUTING_VALUES as readonly string[]).includes(value);
}

function isCrossFamilyHandling(value: string): value is CrossFamilyHandling {
  return (CROSS_FAMILY_HANDLING_VALUES as readonly string[]).includes(value);
}

function parseSignalStrength(value: string): SignalStrength {
  const parsed = Number(value);
  if (!(SIGNAL_STRENGTH_VALUES as readonly number[]).includes(parsed)) {
    throw new Error(`Invalid signalStrength "${value}"`);
  }
  return parsed as SignalStrength;
}

export function parseCanonical120QScoringMaster(csvText: string): OptionScore[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error("Scoring master CSV is empty");
  }

  const header = parseCsvLine(lines[0]);
  if (header.join(",") !== EXPECTED_HEADERS.join(",")) {
    throw new Error(
      `Unexpected scoring master header. Expected ${EXPECTED_HEADERS.join(",")} but received ${header.join(",")}`,
    );
  }

  return lines.slice(1).map((line, rowIndex) => {
    const values = parseCsvLine(line);
    if (values.length !== EXPECTED_HEADERS.length) {
      throw new Error(
        `Row ${rowIndex + 2} has ${values.length} columns. Expected ${EXPECTED_HEADERS.length}`,
      );
    }

    const raw = Object.fromEntries(
      EXPECTED_HEADERS.map((columnName, columnIndex) => [columnName, values[columnIndex] || ""]),
    ) as unknown as CanonicalScoringRowRaw;

    if (!isQuestionId(raw.questionId)) {
      throw new Error(`Invalid questionId "${raw.questionId}" in row ${rowIndex + 2}`);
    }
    if (!isOptionId(raw.optionId)) {
      throw new Error(`Invalid optionId "${raw.optionId}" in row ${rowIndex + 2}`);
    }
    if (!isDimensionCode(raw.dimensionCode)) {
      throw new Error(
        `Invalid dimensionCode "${raw.dimensionCode}" in row ${rowIndex + 2}`,
      );
    }
    if (!isSubdimensionCode(raw.subdimensionCode)) {
      throw new Error(
        `Invalid subdimensionCode "${raw.subdimensionCode}" in row ${rowIndex + 2}`,
      );
    }
    if (!isVariantType(raw.variantType)) {
      throw new Error(`Invalid variantType "${raw.variantType}" in row ${rowIndex + 2}`);
    }
    if (!isConfidenceBand(raw.confidenceBand)) {
      throw new Error(
        `Invalid confidenceBand "${raw.confidenceBand}" in row ${rowIndex + 2}`,
      );
    }
    if (!isSensitivityHandling(raw.sensitivityHandling)) {
      throw new Error(
        `Invalid sensitivityHandling "${raw.sensitivityHandling}" in row ${rowIndex + 2}`,
      );
    }
    if (!isReviewRouting(raw.reviewRouting)) {
      throw new Error(`Invalid reviewRouting "${raw.reviewRouting}" in row ${rowIndex + 2}`);
    }
    if (!isCrossFamilyHandling(raw.crossFamilyHandling)) {
      throw new Error(
        `Invalid crossFamilyHandling "${raw.crossFamilyHandling}" in row ${rowIndex + 2}`,
      );
    }

    return {
      questionId: raw.questionId,
      optionId: raw.optionId,
      dimensionCode: raw.dimensionCode,
      subdimensionCode: raw.subdimensionCode,
      variantType: raw.variantType,
      primarySignal: raw.primarySignal,
      secondarySignals: splitListField(raw.secondarySignals),
      primaryAxisContribution: raw.primaryAxisContribution,
      secondaryAxisModifiers: raw.secondaryAxisModifiers,
      signalStrength: parseSignalStrength(raw.signalStrength),
      confidenceBand: raw.confidenceBand,
      sensitivityHandling: raw.sensitivityHandling,
      reviewRouting: raw.reviewRouting,
      crossFamilyHandling: raw.crossFamilyHandling,
      safetyNotes: splitSemicolonField(raw.safetyNotes),
      correctionNotes: raw.correctionNotes,
      sourceRow: raw,
    } satisfies OptionScore;
  });
}

export function loadCanonical120QScoringMaster() {
  assertInternal120QSourceFilesExist();
  const csvText = readInternal120QSourceFile(
    INTERNAL_120Q_SOURCE_PATHS.scoringMasterCsv,
  );
  return parseCanonical120QScoringMaster(csvText);
}

export { EXPECTED_HEADERS as CANONICAL_120Q_SCORING_MASTER_HEADERS };
