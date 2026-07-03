export const SELF_UNDERSTANDING_REPORT_LIBRARY_VERSION = "v0.2.1" as const;

export type SelfUnderstandingReportAccessMode =
  | "open-testing"
  | "preview-only"
  | "paid-gated";

export type SelfUnderstandingReportSurface =
  | "preview"
  | "full-report"
  | "download";

export type SelfUnderstandingReportFrontmatter = {
  reportId: string;
  reportVersion: string;
  sourceContentVersion?: string;
  testName?: string;
  sourceModel?: string;
  currentStateNote?: string;
  personaId?: string;
  archetypeId?: string;
  publicCode: string;
  nicknameJa: string;
  reading?: string;
  clanEnglish?: string;
  clanJapanese?: string;
  language?: string;
};

export type SelfUnderstandingReportSections = {
  freePreview: string;
  paidCore: string;
  advancedExtension: string;
  internalNotes: string;
};

export type ParsedSelfUnderstandingReportDocument = {
  frontmatter: SelfUnderstandingReportFrontmatter;
  sections: SelfUnderstandingReportSections;
  sourcePath: string;
};

export type PublicSelfUnderstandingReportSections = {
  freePreview: string;
  paidCore: string | null;
  advancedExtension: string | null;
};

export type PublicSelfUnderstandingReportDocument = {
  metadata: SelfUnderstandingReportFrontmatter;
  sections: PublicSelfUnderstandingReportSections;
  accessMode: SelfUnderstandingReportAccessMode;
  surface: SelfUnderstandingReportSurface;
};

export type SelfUnderstandingPreviewExcerpt = {
  title: string;
  markdown: string;
  paragraphs: string[];
};
