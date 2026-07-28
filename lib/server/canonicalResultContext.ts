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
import {
  applyDestinationGate,
  toCanonicalContext,
  CANONICAL_UUID_RE,
  type CanonicalResultContext,
  type CanonicalResultLoad,
} from "./canonicalResultGate";

// The RULES live in ./canonicalResultGate as pure functions so the test suite exercises them
// directly. This module is the I/O boundary: it loads, then delegates the decision.
export type { CanonicalResultContext, CanonicalResultLoad, InterpretationStatus } from "./canonicalResultGate";

/** Load the canonical context WITHOUT applying a downstream permission gate. */
export async function loadCanonicalResultContext(
  rawRowId: string | null | undefined,
): Promise<{ outcome: "ok"; context: CanonicalResultContext } | { outcome: "unavailable" }> {
  if (!rawRowId || !CANONICAL_UUID_RE.test(rawRowId)) return { outcome: "unavailable" };

  // loadPersistedAssessmentResult enforces: row exists, not erased, viewer is the owner or holds
  // the valid anonymous attempt credential, and the stored envelope satisfies the live invariant.
  // It returns null — never a partial view — for every failing case, so all of those conceal
  // identically here.
  const persisted = await loadPersistedAssessmentResult(rawRowId);
  if (!persisted) return { outcome: "unavailable" };
  return { outcome: "ok", context: toCanonicalContext(persisted) };
}

/** Load for a RECOMMENDATION destination. Server-enforced: typing the URL obeys the same rule. */
export async function requireRecommendationContext(
  rawRowId: string | null | undefined,
): Promise<CanonicalResultLoad> {
  const loaded = await loadCanonicalResultContext(rawRowId);
  if (loaded.outcome !== "ok") return loaded;
  return applyDestinationGate(loaded.context, "recommendation");
}

/** Load for a PRIVATE CONTINUITY destination (the personal report, private history). */
export async function requireContinuityContext(
  rawRowId: string | null | undefined,
): Promise<CanonicalResultLoad> {
  const loaded = await loadCanonicalResultContext(rawRowId);
  if (loaded.outcome !== "ok") return loaded;
  return applyDestinationGate(loaded.context, "continuity");
}
