import "server-only";

// UX-2R / CPC-1 Wave A — PersistedResultMode is split from LegacyCompatibilityResultMode.
//
// Before this split, /result held one bag of nullable variables and every downstream decision was
// a fresh `persisted ? … : …` ternary. Two consequences followed:
//   • a legacy value could fill a persisted null anywhere someone forgot the ternary;
//   • nothing in the type system said which fields exist in which mode, so the compiler could not
//     catch it.
//
// The two modes are now distinct types produced by one resolver. Persisted mode carries a stable
// row id and record-derived content and nothing else; legacy mode carries URL-derived content and
// has no row id to give. A field that does not exist in a mode is absent, not null.

import { loadPersistedAssessmentResult } from "@/lib/server/persistedResultView";
import type { PublicResultConfidenceBand } from "../check-in/resultCompatibility";

export type ResultRouteParams = Record<string, string | string[] | undefined>;

export type PersistedResultMode = {
  kind: "persisted";
  /** Private, owner-scoped identity of the canonical record. */
  resultRowId: string;
  resultId: string | null;
  overlayId: string | null;
  /** Persisted results have no URL-encoded payload and no caller-supplied confidence band. */
  confidenceBand: "low";
  payloadKey: null;
};

export type LegacyCompatibilityResultMode = {
  kind: "legacy";
  resultId: string | null;
  overlayId: string | null;
  confidenceBand: PublicResultConfidenceBand;
  payloadKey: string | null;
};

/** The persisted record was requested but cannot be shown. Callers MUST conceal the reason. */
export type UnavailableResultMode = { kind: "unavailable" };

export type ResultMode =
  | PersistedResultMode
  | LegacyCompatibilityResultMode
  | UnavailableResultMode;

function readParam(params: ResultRouteParams, key: string) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

/**
 * Resolve which mode this request is in.
 *
 * The mere PRESENCE of `?result` selects persisted mode. A failed load returns `unavailable` and
 * NEVER falls back to legacy parameters: falling back would let an inaccessible row id be paired
 * with a public result code and still render a result, and it would leak whether that row exists.
 */
export async function resolveResultMode(params: ResultRouteParams): Promise<ResultMode> {
  const requestedRowId = readParam(params, "result");

  if (requestedRowId) {
    const persisted = await loadPersistedAssessmentResult(requestedRowId);
    if (!persisted) return { kind: "unavailable" };

    const suppliedResultId = readParam(params, "resultId");
    if (suppliedResultId && suppliedResultId !== persisted.resultId) {
      // Bounded mismatch fact only — no answers, no account identifier, no result content.
      console.warn("result identity mismatch: persisted record wins", { persistedRowId: requestedRowId });
    }

    return {
      kind: "persisted",
      resultRowId: requestedRowId,
      resultId: persisted.resultId,
      overlayId: persisted.overlayId,
      confidenceBand: "low",
      payloadKey: null,
    };
  }

  return {
    kind: "legacy",
    resultId: readParam(params, "resultId"),
    overlayId: readParam(params, "overlayId"),
    confidenceBand: readParam(params, "confidence") === "medium" ? "medium" : "low",
    payloadKey: readParam(params, "payloadKey"),
  };
}
