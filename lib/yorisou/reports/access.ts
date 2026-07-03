import type {
  ParsedSelfUnderstandingReportDocument,
  PublicSelfUnderstandingReportDocument,
  SelfUnderstandingReportAccessMode,
  SelfUnderstandingReportSurface,
} from "./types";

export const CURRENT_SELF_UNDERSTANDING_REPORT_ACCESS_MODE = "open-testing" as const;

export function buildPublicSelfUnderstandingReportDocument(
  report: ParsedSelfUnderstandingReportDocument,
  surface: SelfUnderstandingReportSurface,
  accessMode: SelfUnderstandingReportAccessMode = CURRENT_SELF_UNDERSTANDING_REPORT_ACCESS_MODE,
): PublicSelfUnderstandingReportDocument {
  if (surface === "preview") {
    return {
      metadata: report.frontmatter,
      surface,
      accessMode,
      sections: {
        freePreview: report.sections.freePreview,
        paidCore: null,
        advancedExtension: null,
      },
    };
  }

  if (accessMode === "open-testing") {
    return {
      metadata: report.frontmatter,
      surface,
      accessMode,
      sections: {
        freePreview: report.sections.freePreview,
        paidCore: report.sections.paidCore,
        advancedExtension: report.sections.advancedExtension,
      },
    };
  }

  return {
    metadata: report.frontmatter,
    surface,
    accessMode,
    sections: {
      freePreview: report.sections.freePreview,
      paidCore: null,
      advancedExtension: null,
    },
  };
}
