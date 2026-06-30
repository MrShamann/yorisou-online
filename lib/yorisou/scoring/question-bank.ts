import {
  DIMENSION_CODES,
  SUBDIMENSION_CODES,
  VARIANT_TYPES,
  type BoundaryMetadata,
  type DimensionCode,
  type Option,
  type Question,
  type QuestionId,
  type SubdimensionCode,
  type VariantType,
} from "./types";
import {
  INTERNAL_120Q_SOURCE_PATHS,
  assertInternal120QSourceFilesExist,
  readInternal120QSourceFile,
} from "./source";

const QUESTION_BLOCK_PATTERN = /(^|\n)(Q\d{3}:\n[\s\S]*?)(?=\nQ\d{3}:\n|$)/g;

function normalizeLine(input: string) {
  return input.trim().replace(/^\*\s*/, "");
}

function isQuestionId(value: string): value is QuestionId {
  return /^Q\d{3}$/.test(value);
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

function parseTagList(rawValue: string) {
  return rawValue
    .split(/[;,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function requireString(value: string | undefined, field: string, questionId: string) {
  if (!value) {
    throw new Error(`Missing ${field} for ${questionId}`);
  }

  return value;
}

export function parseCanonical120QQuestionBank(markdown: string): Question[] {
  const matches = [...markdown.matchAll(QUESTION_BLOCK_PATTERN)];
  const questionMap = new Map<QuestionId, Question>();

  for (const match of matches) {
    const block = match[2];
    const lines = block.split(/\r?\n/);
    const header = normalizeLine(lines[0] || "");
    const questionId = header.replace(/:$/, "");

    if (!isQuestionId(questionId)) {
      continue;
    }

    const record: Record<string, string> = {};
    const options: Option[] = [];
    const boundaryMetadata: BoundaryMetadata = {};

    for (let index = 1; index < lines.length; index += 1) {
      const rawLine = lines[index];
      const line = normalizeLine(rawLine);

      if (!line) {
        continue;
      }

      if (line === "options:") {
        index += 1;
        while (index < lines.length) {
          const optionLine = normalizeLine(lines[index] || "");
          const optionMatch = optionLine.match(/^([A-E]):\s*(.+)$/);
          if (!optionMatch) {
            index -= 1;
            break;
          }

          options.push({
            id: optionMatch[1] as Option["id"],
            text: optionMatch[2],
          });
          index += 1;
        }
        continue;
      }

      if (line === "boundaryMetadata:") {
        index += 1;
        while (index < lines.length) {
          const boundaryLine = normalizeLine(lines[index] || "");
          const boundaryMatch = boundaryLine.match(
            /^(answerData|resultUse|shareUse|questionSurface):\s*(.+)$/,
          );
          if (!boundaryMatch) {
            index -= 1;
            break;
          }

          boundaryMetadata[boundaryMatch[1] as keyof BoundaryMetadata] = boundaryMatch[2];
          index += 1;
        }
        continue;
      }

      const fieldMatch = line.match(/^([A-Za-z][A-Za-z0-9]+):\s*(.+)$/);
      if (fieldMatch) {
        record[fieldMatch[1]] = fieldMatch[2];
      }
    }

    if (!record.dimensionCode || !record.prompt) {
      continue;
    }

    const dimensionCode = requireString(record.dimensionCode, "dimensionCode", questionId);
    const subdimensionCode = requireString(
      record.subdimensionCode,
      "subdimensionCode",
      questionId,
    );
    const variantType = requireString(record.variantType, "variantType", questionId);

    if (!isDimensionCode(dimensionCode)) {
      throw new Error(`Invalid dimensionCode "${dimensionCode}" for ${questionId}`);
    }
    if (!isSubdimensionCode(subdimensionCode)) {
      throw new Error(`Invalid subdimensionCode "${subdimensionCode}" for ${questionId}`);
    }
    if (!isVariantType(variantType)) {
      throw new Error(`Invalid variantType "${variantType}" for ${questionId}`);
    }

    const parsedQuestion = {
      questionId,
      dimensionCode,
      subdimensionCode,
      variantType,
      eligibilityFor24Q: requireString(
        record.eligibilityFor24Q,
        "eligibilityFor24Q",
        questionId,
      ),
      eligibilityFor72Q: requireString(
        record.eligibilityFor72Q,
        "eligibilityFor72Q",
        questionId,
      ),
      eligibilityFor120Q:
        requireString(record.eligibilityFor120Q, "eligibilityFor120Q", questionId) === "true",
      rotationGroup: requireString(record.rotationGroup, "rotationGroup", questionId),
      prompt: requireString(record.prompt, "prompt", questionId),
      options,
      scoringIntent: requireString(record.scoringIntent, "scoringIntent", questionId),
      riskFlags: parseTagList(record.riskFlags || ""),
      reportTags: parseTagList(record.reportTags || ""),
      recommendationTags: parseTagList(record.recommendationTags || ""),
      publicPrivateBoundary: record.publicPrivateBoundary,
      boundaryMetadata:
        Object.keys(boundaryMetadata).length > 0 ? boundaryMetadata : undefined,
      whyThisQuestionWorks: requireString(
        record.whyThisQuestionWorks,
        "whyThisQuestionWorks",
        questionId,
      ),
    } satisfies Question;

    if (questionMap.has(questionId)) {
      throw new Error(`Duplicate canonical question block detected for ${questionId}`);
    }

    questionMap.set(questionId, parsedQuestion);
  }

  return [...questionMap.values()].sort((left, right) =>
    left.questionId.localeCompare(right.questionId),
  );
}

export function loadCanonical120QQuestionBank() {
  assertInternal120QSourceFilesExist();
  const markdown = readInternal120QSourceFile(
    INTERNAL_120Q_SOURCE_PATHS.questionBankMarkdown,
  );
  return parseCanonical120QQuestionBank(markdown);
}
