import "server-only";

// UX-2R / CPC-1 — THE canonical result-context loader.
//
// Wave A shipped identity *transport*: /result learned to attach `?result=<row-id>` to every
// private continuity link. It did not ship identity *consumption*: the destinations kept reading
// `resultId` / `overlayId` / `payloadKey` and ignored the row id entirely. A persisted user
// reaching /recommendations therefore arrived with a correct link at a page that did not
// understand it, fell through to generic legacy content, and lost the stable identity again on the
// next hop. Hiding a link on /result was the only thing standing between an unanswered result and
// its recommendations — and hiding a link is not authorization.
//
// This module is the single place that answers "may this viewer see this canonical result, and
// what may they do with it". Every private downstream route calls it. No route re-implements the
// rules, and no route may reconstruct canonical truth from `resultId`, `overlayId`, `payloadKey`,
// localStorage or a public code in the path.

import { loadPersistedAssessmentResult } from "./persistedResultView";
import type { PersistedResultEnvelopeV1 } from "./persistedDimensionSummary";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type InterpretationStatus =
  | "confirmed"
  | "corrected"
  | "rejected"
  | "deferred"
  | "unanswered";

export type CanonicalResultContext = {
  resultRowId: string;
  /** What the method itself produced. Never rewritten by a correction. */
  originalResultId: string | null;
  /** What the person accepted — their correction when they made one. Null until they answer. */
  acceptedResultId: string | null;
  /**
   * The result identifier a downstream surface should RENDER. For a corrected result this is the
   * person's answer, not the method's. Null when nothing has been accepted.
   */
  effectiveResultId: string | null;
  overlayId: string | null;
  status: InterpretationStatus;
  resolved: boolean;
  recommendationUsePermitted: boolean;
  continuityUsePermitted: boolean;
  claimed: boolean;
  isOwner: boolean;
  methodId: string;
  methodVersion: string;
  producedAt: string;
  /** Strict envelope, or null when the stored payload is not the governed shape. */
  dimensionOutput: PersistedResultEnvelopeV1 | null;
};

/**
 * Why a canonical context could not be produced.
 *
 * Callers MUST NOT branch on this in user-facing output. It exists for bounded server logging and
 * for choosing between the concealed-unavailable state and the consent-withheld state, which are
 * different products of different facts:
 *   • `unavailable`  — we will not say whether this result exists. One state for invalid, missing,
 *                      expired, erased, unauthorized and cross-owner access.
 *   • `withheld`     — the viewer demonstrably owns the result; the gate is their own unanswered,
 *                      rejected or deferred interpretation, and saying so is the point.
 */
export type CanonicalResultDenial =
  | { outcome: "unavailable" }
  | { outcome: "withheld"; context: CanonicalResultContext };

export type CanonicalResultLoad =
  | { outcome: "ok"; context: CanonicalResultContext }
  | CanonicalResultDenial;

/** Load the canonical context WITHOUT applying a downstream permission gate. */
export async function loadCanonicalResultContext(
  rawRowId: string | null | undefined,
): Promise<{ outcome: "ok"; context: CanonicalResultContext } | { outcome: "unavailable" }> {
  if (!rawRowId || !UUID_RE.test(rawRowId)) return { outcome: "unavailable" };

  // loadPersistedAssessmentResult already enforces: row exists, not erased, viewer is the owner or
  // holds the valid anonymous attempt credential, and the stored envelope is strictly the governed
  // shape. It returns null — never a partial view — for every failing case.
  const persisted = await loadPersistedAssessmentResult(rawRowId);
  if (!persisted) return { outcome: "unavailable" };

  const u = persisted.understanding;
  const acceptedResultId = u.acceptedResultId ?? null;

  return {
    outcome: "ok",
    context: {
      resultRowId: persisted.resultRowId,
      originalResultId: persisted.originalResultId,
      acceptedResultId,
      // A correction is the person's answer about themselves. Once made, it is what downstream
      // surfaces must use — otherwise the product would keep quoting the machine back at someone
      // who already said it was wrong.
      effectiveResultId: acceptedResultId,
      overlayId: persisted.overlayId,
      status: u.status,
      resolved: u.resolved,
      recommendationUsePermitted: u.recommendationUsePermitted,
      continuityUsePermitted: u.continuityUsePermitted,
      claimed: persisted.claimed,
      isOwner: persisted.isOwner,
      methodId: persisted.methodId,
      methodVersion: persisted.methodVersion,
      producedAt: persisted.producedAt,
      dimensionOutput: persisted.dimensionOutput,
    },
  };
}

/**
 * Load for a RECOMMENDATION destination.
 *
 * Server-enforced, so typing the URL by hand obeys the same rule as clicking the button.
 */
export async function requireRecommendationContext(
  rawRowId: string | null | undefined,
): Promise<CanonicalResultLoad> {
  const loaded = await loadCanonicalResultContext(rawRowId);
  if (loaded.outcome !== "ok") return loaded;
  if (!loaded.context.recommendationUsePermitted || !loaded.context.effectiveResultId) {
    return { outcome: "withheld", context: loaded.context };
  }
  return loaded;
}

/**
 * Load for a PRIVATE CONTINUITY destination (the personal report, private history).
 *
 * `continuityUsePermitted` is a separate permission from the recommendation one, and the frozen
 * contract keeps them separate. A person may accept an interpretation for their own reading
 * without that becoming a licence to carry it forward into recommendations, and the reverse is
 * equally possible; collapsing them into one flag would quietly grant something never agreed to.
 */
export async function requireContinuityContext(
  rawRowId: string | null | undefined,
): Promise<CanonicalResultLoad> {
  const loaded = await loadCanonicalResultContext(rawRowId);
  if (loaded.outcome !== "ok") return loaded;
  if (!loaded.context.continuityUsePermitted || !loaded.context.effectiveResultId) {
    return { outcome: "withheld", context: loaded.context };
  }
  return loaded;
}
