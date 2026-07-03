import matter from "gray-matter";

import type {
  ParsedSelfUnderstandingReportDocument,
  SelfUnderstandingReportFrontmatter,
  SelfUnderstandingReportSections,
} from "./types";

const SECTION_MARKERS = {
  freePreview: {
    start: "<!-- FREE_PREVIEW_START -->",
    end: "<!-- FREE_PREVIEW_END -->",
  },
  paidCore: {
    start: "<!-- PAID_CORE_START -->",
    end: "<!-- PAID_CORE_END -->",
  },
  advancedExtension: {
    start: "<!-- ADVANCED_EXTENSION_START -->",
    end: "<!-- ADVANCED_EXTENSION_END -->",
  },
  internalNotes: {
    start: "<!-- INTERNAL_NOTES_START -->",
    end: "<!-- INTERNAL_NOTES_END -->",
  },
} as const;

const ALL_MARKERS = Object.values(SECTION_MARKERS).flatMap(({ start, end }) => [start, end]);

function requireString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid or missing frontmatter field: ${field}`);
  }

  return value.trim();
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function normalizeSection(value: string) {
  return value.trim().replace(/\r\n/g, "\n");
}

function parseFrontmatter(data: Record<string, unknown>): SelfUnderstandingReportFrontmatter {
  return {
    reportId: requireString(data.reportId, "reportId"),
    reportVersion: requireString(data.reportVersion, "reportVersion"),
    sourceContentVersion: optionalString(data.sourceContentVersion),
    testName: optionalString(data.testName),
    sourceModel: optionalString(data.sourceModel),
    currentStateNote: optionalString(data.currentStateNote),
    personaId: optionalString(data.personaId),
    archetypeId: optionalString(data.archetypeId),
    publicCode: requireString(data.publicCode, "publicCode"),
    nicknameJa: requireString(data.nicknameJa, "nicknameJa"),
    reading: optionalString(data.reading),
    clanEnglish: optionalString(data.clanEnglish),
    clanJapanese: optionalString(data.clanJapanese),
    language: optionalString(data.language),
  };
}

function assertNoUnexpectedMarkers(value: string) {
  if (ALL_MARKERS.some((marker) => value.includes(marker))) {
    throw new Error("Malformed report markers: unexpected extra marker content");
  }
}

function extractSection(
  body: string,
  startToken: string,
  endToken: string,
  fromIndex: number,
) {
  const startIndex = body.indexOf(startToken, fromIndex);

  if (startIndex === -1) {
    throw new Error(`Malformed report markers: missing ${startToken}`);
  }

  assertNoUnexpectedMarkers(body.slice(fromIndex, startIndex));

  const contentStart = startIndex + startToken.length;
  const endIndex = body.indexOf(endToken, contentStart);

  if (endIndex === -1) {
    throw new Error(`Malformed report markers: missing ${endToken}`);
  }

  const section = body.slice(contentStart, endIndex);
  assertNoUnexpectedMarkers(section);

  return {
    section: normalizeSection(section),
    nextIndex: endIndex + endToken.length,
  };
}

function parseSections(body: string): SelfUnderstandingReportSections {
  let cursor = 0;

  const freePreview = extractSection(
    body,
    SECTION_MARKERS.freePreview.start,
    SECTION_MARKERS.freePreview.end,
    cursor,
  );
  cursor = freePreview.nextIndex;

  const paidCore = extractSection(
    body,
    SECTION_MARKERS.paidCore.start,
    SECTION_MARKERS.paidCore.end,
    cursor,
  );
  cursor = paidCore.nextIndex;

  const advancedExtension = extractSection(
    body,
    SECTION_MARKERS.advancedExtension.start,
    SECTION_MARKERS.advancedExtension.end,
    cursor,
  );
  cursor = advancedExtension.nextIndex;

  const internalNotes = extractSection(
    body,
    SECTION_MARKERS.internalNotes.start,
    SECTION_MARKERS.internalNotes.end,
    cursor,
  );
  cursor = internalNotes.nextIndex;

  assertNoUnexpectedMarkers(body.slice(cursor));

  return {
    freePreview: freePreview.section,
    paidCore: paidCore.section,
    advancedExtension: advancedExtension.section,
    internalNotes: internalNotes.section,
  };
}

export function parseSelfUnderstandingReportDocument(
  source: string,
  sourcePath: string,
): ParsedSelfUnderstandingReportDocument {
  const parsed = matter(source);
  const frontmatter = parseFrontmatter(parsed.data as Record<string, unknown>);
  const sections = parseSections(parsed.content);

  return {
    frontmatter,
    sections,
    sourcePath,
  };
}
