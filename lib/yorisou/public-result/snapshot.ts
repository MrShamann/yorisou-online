// RTR-1 — private current-state snapshot of the public IMAIRO-120Q result.
//
// Pure and deterministic: every stored string comes verbatim from the
// approved public-result taxonomy/content or from copy already merged on
// /result (Package 9). No answers exist at this layer and none are stored;
// no AI inference is generated or stored. Provenance uses the Package 9
// source-type grammar keys (revealContent.SOURCE_LABEL).

import { PUBLIC_RESULT_MAPPING_VERSION } from "./types";
import { findPublicArchetypeByCode } from "./taxonomy";
import { findPublicArchetypeContentByCode } from "./content";

export const IMAIRO_SNAPSHOT_TEST_ID = "IMAIRO-120Q" as const;
export const IMAIRO_SNAPSHOT_TEST_VERSION = "compat-v0.2" as const;
export const IMAIRO_SNAPSHOT_SCORING_VERSION = PUBLIC_RESULT_MAPPING_VERSION;

// Verbatim from app/result/page.tsx (merged Package 9) — not new copy.
const NON_DIAGNOSTIC_NOTE = "この結果は診断ではなく、いまの傾向のやわらかい整理です。";

export type ImairoSnapshotRouteContext = {
  resultId: string | null;
  overlayId: string | null;
  confidenceBand: "low" | "medium";
  payloadKey: string | null;
};

export type ImairoResultSnapshot = {
  definition: {
    testId: typeof IMAIRO_SNAPSHOT_TEST_ID;
    version: typeof IMAIRO_SNAPSHOT_TEST_VERSION;
    scoringVersion: typeof IMAIRO_SNAPSHOT_SCORING_VERSION;
  };
  resultId: string;
  resultTitle: string;
  publicSummary: string;
  topDimensions: { id: string; label: string }[];
  stateTag: string;
  snapshotContext: {
    kind: "imairo-public-result-snapshot";
    capturedAs: "current_state";
    route: ImairoSnapshotRouteContext;
    mappingVersion: typeof PUBLIC_RESULT_MAPPING_VERSION;
    sourceTypes: {
      assignment: "ANSWER_DERIVED";
      recognitionLine: "RULE_BASED_INTERPRETATION";
      highlights: "RULE_BASED_INTERPRETATION";
      nonDiagnosticNote: "LIMITATION";
    };
  };
};

export function buildImairoResultSnapshot(
  route: ImairoSnapshotRouteContext,
): ImairoResultSnapshot | null {
  const assignment = findPublicArchetypeByCode(route.resultId);
  if (!assignment) return null;
  const content = findPublicArchetypeContentByCode(assignment.publicCode);
  const recognitionLine = content?.recognitionLine ?? "";
  const highlights = content?.highlights ?? [];

  return {
    definition: {
      testId: IMAIRO_SNAPSHOT_TEST_ID,
      version: IMAIRO_SNAPSHOT_TEST_VERSION,
      scoringVersion: IMAIRO_SNAPSHOT_SCORING_VERSION,
    },
    resultId: assignment.publicCode,
    resultTitle: `${assignment.nickname}（${assignment.clanJapanese}のタイプ）`,
    publicSummary: [recognitionLine, NON_DIAGNOSTIC_NOTE].filter(Boolean).join(" "),
    topDimensions: highlights.map((highlight) => ({
      id: highlight.label,
      label: highlight.label,
    })),
    stateTag: `${assignment.clanJapanese}のタイプ`,
    snapshotContext: {
      kind: "imairo-public-result-snapshot",
      capturedAs: "current_state",
      route: {
        resultId: assignment.publicCode,
        overlayId: route.overlayId,
        confidenceBand: route.confidenceBand,
        payloadKey: route.payloadKey,
      },
      mappingVersion: PUBLIC_RESULT_MAPPING_VERSION,
      sourceTypes: {
        assignment: "ANSWER_DERIVED",
        recognitionLine: "RULE_BASED_INTERPRETATION",
        highlights: "RULE_BASED_INTERPRETATION",
        nonDiagnosticNote: "LIMITATION",
      },
    },
  };
}
