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
import { listRecommendationHistory, type RecommendationHistoryLoad } from "./recommendationStore";
import { findPublicArchetypeByCode } from "@/lib/yorisou/public-result";

/**
 * Governed display name for a result code.
 *
 * Raw codes like `MS-KI` are internal provenance, not something to put in front of a person as
 * their primary self-description. An unrecognised code returns null rather than being echoed — an
 * identity we cannot name is one we should not present as if we understood it.
 */
function governedName(code: string | null): string | null {
  if (!code) return null;
  const a = findPublicArchetypeByCode(code);
  return a ? `${a.nickname}（${a.clanJapanese}のタイプ）` : null;
}

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
  /** Governed Japanese names. Null when the taxonomy does not recognise the code. */
  originalResultName: string | null;
  acceptedResultName: string | null;
  scoringVersion: string | null;
  resultSchemaVersion: string | null;
  /** Append-only, newest first by monotonic sequence. Earlier answers superseded, never destroyed. */
  history: {
    responseId: string;
    responseType: string;
    correctedResultId: string | null;
    correctedResultName: string | null;
    reasonCode: string | null;
    source: string | null;
    supersedesResponseId: string | null;
    recommendationUsePermittedAtResponse: boolean;
    continuityUsePermittedAtResponse: boolean;
    sequenceNo: number | null;
    createdAt: string;
  }[];
  /** Discriminated: a read failure must never render as "no recommendations". */
  recommendations: RecommendationHistoryLoad;
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
        const [responses, recommendations] = await Promise.all([
          listResponsesForResult(result.id, ownerId),
          // Read-only: viewing history must never materialize a recommendation set.
          listRecommendationHistory(result.id, ownerId),
        ]);
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
          originalResultName: governedName(u.originalResultId),
          acceptedResultName: governedName(u.acceptedResultId),
          scoringVersion: (result as { scoring_version?: string | null }).scoring_version ?? null,
          resultSchemaVersion:
            (result as { result_schema_version?: string | null }).result_schema_version ?? null,
          history: responses.map((r) => ({
            responseId: r.id,
            responseType: r.response_type,
            correctedResultId: r.corrected_result_id,
            correctedResultName: governedName(r.corrected_result_id),
            reasonCode: (r as { reason_code?: string | null }).reason_code ?? null,
            source: (r as { source?: string | null }).source ?? null,
            supersedesResponseId:
              (r as { supersedes_response_id?: string | null }).supersedes_response_id ?? null,
            recommendationUsePermittedAtResponse: r.recommendation_use_permitted === true,
            continuityUsePermittedAtResponse: r.continuity_use_permitted === true,
            sequenceNo: (r as { sequence_no?: number | null }).sequence_no ?? null,
            createdAt: r.created_at,
          })),
          recommendations,
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
