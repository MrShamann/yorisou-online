import "server-only";

// UX-2R / CPC-1 §3/§7 — the canonical assessment truth behind わたしの今.
//
// `/private-state` still reads the legacy private-AI model: reflections, `saved_result_id`,
// `/saved/tests/<id>` and old recommendation rows. None of that knows about the canonical
// assessment record, so after Wave A a person could own a canonical result and still not see it
// where the product promises to show them their current state.
//
// This module provides the canonical view: owned results, what the method said, what the person
// accepted, whether they have answered at all, and the append-only history of their answers.
// Multiple attempts stay SEPARATE entries — collapsing them into one rewritten "current record"
// would erase the very change the product exists to notice.

import {
  listResultsForOwner,
  listResponsesForResult,
  type AssessmentResult,
} from "./assessmentAttemptStore";
import { deriveCurrentUnderstanding } from "./currentUnderstanding";
import { getViewerContext } from "./yorisouAuth";

export type CanonicalAssessmentEntry = {
  resultRowId: string;
  originalResultId: string | null;
  acceptedResultId: string | null;
  status: "confirmed" | "corrected" | "rejected" | "deferred" | "unanswered";
  resolved: boolean;
  recommendationUsePermitted: boolean;
  continuityUsePermitted: boolean;
  producedAt: string;
  methodId: string;
  methodVersion: string;
  /** Append-only, newest first. Earlier answers are superseded, never destroyed. */
  history: { responseType: string; correctedResultId: string | null; createdAt: string }[];
};

/**
 * A DISCRIMINATED load result.
 *
 * The first version returned `[]` on failure, so a database outage rendered as "まだ保存された結果は
 * ありません" — telling someone their records do not exist when in fact we could not read them. That
 * is the worst possible lie for this particular surface, and it is not recoverable by the user
 * because nothing suggests retrying.
 */
export type CanonicalPrivateStateLoad =
  | { outcome: "unauthenticated" }
  | { outcome: "empty" }
  | { outcome: "ok"; entries: CanonicalAssessmentEntry[] }
  | { outcome: "temporarily_unavailable" };

export async function loadCanonicalPrivateState(): Promise<CanonicalPrivateStateLoad> {
  const viewer = await getViewerContext();
  const ownerId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerId) return { outcome: "unauthenticated" };

  try {
    // Erased rows are already excluded by the store's owner-scoped listing.
    const results: AssessmentResult[] = await listResultsForOwner(ownerId);

    const entries = await Promise.all(
      results.map(async (result) => {
        const responses = await listResponsesForResult(result.id, ownerId);
        const u = deriveCurrentUnderstanding(result, responses);
        return {
          resultRowId: result.id,
          originalResultId: u.originalResultId,
          acceptedResultId: u.acceptedResultId,
          status: u.status,
          resolved: u.resolved,
          recommendationUsePermitted: u.recommendationUsePermitted,
          continuityUsePermitted: u.continuityUsePermitted,
          producedAt: result.produced_at,
          methodId: result.method_id,
          methodVersion: result.method_version,
          history: responses.map((r) => ({
            responseType: r.response_type,
            correctedResultId: r.corrected_result_id,
            createdAt: r.created_at,
          })),
        };
      }),
    );

    return entries.length === 0 ? { outcome: "empty" } : { outcome: "ok", entries };
  } catch (error) {
    console.error("canonical private state load failed", {
      code: error instanceof Error ? error.message : "unknown",
    });
    // Never convert a read failure into an empty-history message.
    return { outcome: "temporarily_unavailable" };
  }
}
