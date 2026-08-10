import { findPublicArchetypeByCode } from "@/lib/yorisou/public-result";

import { SELF_UNDERSTANDING_REPORT_SOURCES } from "./generated/reportSources";

import { CURRENT_SELF_UNDERSTANDING_REPORT_ACCESS_MODE, buildPublicSelfUnderstandingReportDocument } from "./access";
import { parseSelfUnderstandingReportDocument } from "./parser";
import {
  SELF_UNDERSTANDING_REPORT_LIBRARY_VERSION,
  type ParsedSelfUnderstandingReportDocument,
  type SelfUnderstandingPreviewExcerpt,
  type SelfUnderstandingReportAccessMode,
  type SelfUnderstandingReportSurface,
} from "./types";

/**
 * Where a report CAME FROM, for diagnostics and parser messages.
 *
 * Deliberately no longer a filesystem path that anything reads. The markdown is embedded at build
 * time (see `generated/reportSources.ts`), because this module used to resolve
 * `process.cwd() + content/…` and `fs.readFileSync` it AT REQUEST TIME. The report page is
 * prerendered so its files existed; the dynamic download route runs in a serverless function where
 * they do not, so every download threw — and the route reported that as "no such report".
 */
function reportSourceLabel(publicCode: string) {
  return `content/yorisou/reports/self-understanding/${SELF_UNDERSTANDING_REPORT_LIBRARY_VERSION}/${publicCode}.md`;
}

function escapeFrontmatterString(value: string) {
  return JSON.stringify(value);
}

export function buildSelfUnderstandingReportHref(publicCode: string) {
  return `/reports/self-understanding/${publicCode}`;
}

export function buildSelfUnderstandingReportDownloadHref(publicCode: string) {
  return `/reports/self-understanding/${publicCode}/download`;
}

export function assertValidSelfUnderstandingReportCode(publicCode: string) {
  if (!findPublicArchetypeByCode(publicCode)) {
    throw new Error(`Invalid publicCode: ${publicCode}`);
  }
}

/** The canonical source location for this report. A LABEL, not something that is opened. */
export function getSelfUnderstandingReportFilePath(publicCode: string) {
  assertValidSelfUnderstandingReportCode(publicCode);
  return reportSourceLabel(publicCode);
}

export function loadParsedSelfUnderstandingReportByCode(
  publicCode: string,
): ParsedSelfUnderstandingReportDocument {
  const filePath = getSelfUnderstandingReportFilePath(publicCode);
  const source = SELF_UNDERSTANDING_REPORT_SOURCES[publicCode];

  // Still an explicit absence check, and it still throws — but it now fails at BUILD time instead,
  // because the generator refuses to emit a registry that omits a governed code. A report that is
  // missing here means the registry is stale, which CI also refuses.
  if (typeof source !== "string" || source.length === 0) {
    throw new Error(`Missing report file for publicCode: ${publicCode}`);
  }

  const parsed = parseSelfUnderstandingReportDocument(source, filePath);

  if (parsed.frontmatter.publicCode !== publicCode) {
    throw new Error(`Report frontmatter publicCode mismatch: expected ${publicCode}`);
  }

  return parsed;
}

const INTERNAL_ONLY_PUBLIC_LINE_PATTERNS = [
  /internal only/i,
  /ユーザー表示しません/,
  /実装連携メモ/,
  /統合メモ/,
  /review note/i,
  /implementation memo/i,
] as const;

function sanitizePublicMarkdown(value: string) {
  return value
    .split(/\n/)
    .filter((line) => !/(purchaseStatus|contentStatus|codexExecutableNow|createdFor|visibility:)/i.test(line))
    .filter((line) => !INTERNAL_ONLY_PUBLIC_LINE_PATTERNS.some((pattern) => pattern.test(line)))
    .join("\n")
    .trim();
}

export function loadSelfUnderstandingPublicReportByCode(
  publicCode: string,
  options?: {
    surface?: SelfUnderstandingReportSurface;
    accessMode?: SelfUnderstandingReportAccessMode;
  },
) {
  const parsed = loadParsedSelfUnderstandingReportByCode(publicCode);
  const publicReport = buildPublicSelfUnderstandingReportDocument(
    parsed,
    options?.surface ?? "full-report",
    options?.accessMode ?? CURRENT_SELF_UNDERSTANDING_REPORT_ACCESS_MODE,
  );

  return {
    ...publicReport,
    sections: {
      freePreview: sanitizePublicMarkdown(publicReport.sections.freePreview),
      paidCore: publicReport.sections.paidCore ? sanitizePublicMarkdown(publicReport.sections.paidCore) : null,
      advancedExtension: publicReport.sections.advancedExtension ? sanitizePublicMarkdown(publicReport.sections.advancedExtension) : null,
    },
  };
}

function stripMarkdown(value: string) {
  return value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\r/g, "")
    .trim();
}

export function extractPreviewParagraphs(markdown: string, maxParagraphs = 2) {
  return markdown
    .split(/\n\s*\n/)
    .map((block) => stripMarkdown(block))
    .filter((block) => block.length > 0)
    .slice(0, maxParagraphs);
}

export function buildSelfUnderstandingPreviewByCode(
  publicCode: string,
): SelfUnderstandingPreviewExcerpt {
  const publicReport = loadSelfUnderstandingPublicReportByCode(publicCode, {
    surface: "preview",
    accessMode: CURRENT_SELF_UNDERSTANDING_REPORT_ACCESS_MODE,
  });

  return {
    title: `${publicReport.metadata.nicknameJa}のプレビュー`,
    markdown: publicReport.sections.freePreview,
    paragraphs: extractPreviewParagraphs(publicReport.sections.freePreview, 3),
  };
}

export function buildSanitizedSelfUnderstandingReportMarkdown(
  publicCode: string,
  accessMode: SelfUnderstandingReportAccessMode = CURRENT_SELF_UNDERSTANDING_REPORT_ACCESS_MODE,
) {
  const publicReport = loadSelfUnderstandingPublicReportByCode(publicCode, {
    surface: "download",
    accessMode,
  });

  const lines = [
    "---",
    `reportId: ${escapeFrontmatterString(publicReport.metadata.reportId)}`,
    `reportVersion: ${escapeFrontmatterString(publicReport.metadata.reportVersion)}`,
    `libraryVersion: ${escapeFrontmatterString(SELF_UNDERSTANDING_REPORT_LIBRARY_VERSION)}`,
    `publicCode: ${escapeFrontmatterString(publicReport.metadata.publicCode)}`,
    `nicknameJa: ${escapeFrontmatterString(publicReport.metadata.nicknameJa)}`,
    ...(publicReport.metadata.reading ? [`reading: ${escapeFrontmatterString(publicReport.metadata.reading)}`] : []),
    ...(publicReport.metadata.clanEnglish ? [`clanEnglish: ${escapeFrontmatterString(publicReport.metadata.clanEnglish)}`] : []),
    ...(publicReport.metadata.clanJapanese ? [`clanJapanese: ${escapeFrontmatterString(publicReport.metadata.clanJapanese)}`] : []),
    ...(publicReport.metadata.currentStateNote
      ? [`currentStateNote: ${escapeFrontmatterString(publicReport.metadata.currentStateNote)}`]
      : []),
    ...(publicReport.metadata.testName ? [`testName: ${escapeFrontmatterString(publicReport.metadata.testName)}`] : []),
    ...(publicReport.metadata.sourceModel
      ? [`sourceModel: ${escapeFrontmatterString(publicReport.metadata.sourceModel)}`]
      : []),
    ...(publicReport.metadata.language ? [`language: ${escapeFrontmatterString(publicReport.metadata.language)}`] : []),
    "---",
    "",
    `# ${publicReport.metadata.nicknameJa} / ${publicReport.metadata.publicCode}`,
    "",
    publicReport.sections.freePreview.trim(),
    ...(publicReport.sections.paidCore ? ["", publicReport.sections.paidCore.trim()] : []),
    ...(publicReport.sections.advancedExtension ? ["", publicReport.sections.advancedExtension.trim()] : []),
    "",
  ];

  return lines.join("\n");
}
