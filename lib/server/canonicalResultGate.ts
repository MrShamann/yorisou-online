// UX-2R / CPC-1 §7 — the destination gate as a PURE function.
//
// Kept separate from `canonicalResultContext` (which does the I/O and carries `server-only`) so the
// authorization rules can be exercised directly by the node test suite. The previous arrangement
// left the gate provable only by reading it.

import type { PersistedResultEnvelopeV1 } from "./persistedDimensionSummary";

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
   * The identifier a downstream surface should RENDER. After a correction this is the person's own
   * answer, not the machine's — the product must not keep quoting something already disowned.
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
  dimensionOutput: PersistedResultEnvelopeV1;
};

export type CanonicalResultLoad =
  | { outcome: "ok"; context: CanonicalResultContext }
  | { outcome: "withheld"; context: CanonicalResultContext }
  | { outcome: "unavailable" };

export const CANONICAL_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Shape this gate needs from the persisted view. */
export type PersistedViewLike = {
  resultRowId: string;
  overlayId: string | null;
  originalResultId: string | null;
  methodId: string;
  methodVersion: string;
  producedAt: string;
  dimensionOutput: PersistedResultEnvelopeV1;
  claimed: boolean;
  isOwner: boolean;
  understanding: {
    acceptedResultId: string | null;
    status: InterpretationStatus;
    resolved: boolean;
    recommendationUsePermitted: boolean;
    continuityUsePermitted: boolean;
  };
};

export function toCanonicalContext(p: PersistedViewLike): CanonicalResultContext {
  const acceptedResultId = p.understanding.acceptedResultId ?? null;
  return {
    resultRowId: p.resultRowId,
    originalResultId: p.originalResultId,
    acceptedResultId,
    effectiveResultId: acceptedResultId,
    overlayId: p.overlayId,
    status: p.understanding.status,
    resolved: p.understanding.resolved,
    recommendationUsePermitted: p.understanding.recommendationUsePermitted,
    continuityUsePermitted: p.understanding.continuityUsePermitted,
    claimed: p.claimed,
    isOwner: p.isOwner,
    methodId: p.methodId,
    methodVersion: p.methodVersion,
    producedAt: p.producedAt,
    dimensionOutput: p.dimensionOutput,
  };
}

/**
 * Apply a destination permission.
 *
 * `permission` names which of the two INDEPENDENT rights is required. They are never collapsed:
 * accepting an interpretation for one's own reading is not the same act as licensing it to drive
 * recommendations, and granting one on the strength of the other would hand over something never
 * agreed to.
 */
export function applyDestinationGate(
  context: CanonicalResultContext,
  permission: "recommendation" | "continuity",
): CanonicalResultLoad {
  const permitted =
    permission === "recommendation"
      ? context.recommendationUsePermitted
      : context.continuityUsePermitted;

  // A permitted flag with nothing accepted would render a destination with no result identity at
  // all, so both conditions must hold.
  if (!permitted || !context.effectiveResultId) return { outcome: "withheld", context };
  return { outcome: "ok", context };
}
