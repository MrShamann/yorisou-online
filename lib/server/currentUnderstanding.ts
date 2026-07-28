// UX-2R / CPC-1 Wave B — the single rule for whether an interpretation may be used downstream.
//
// Kept in its own module, free of `server-only`, so the node test suite exercises THIS code rather
// than a restatement of it. A test that restates the rule cannot catch the rule being softened.

import type { AssessmentResult, InterpretationResponse } from "./assessmentAttemptStore";

// ── derived truth: the CURRENT accepted understanding for one result ─────────
// A rejection stops the interpretation being presented as accepted current understanding.
// "Later" is not consent, and silence is not consent. ONLY an explicit confirmation or a bounded
// correction produces an accepted understanding or permits downstream use. Rejected, deferred and
// unanswered all leave the interpretation unresolved and withhold recommendation/continuity use.
export function deriveCurrentUnderstanding(result: AssessmentResult, responses: InterpretationResponse[]) {
  const latest = responses[0] ?? null; // responses arrive newest-first
  const type = latest?.response_type ?? null;

  let acceptedResultId: string | null;
  if (type === "confirmed") acceptedResultId = result.result_id;
  else if (type === "corrected") acceptedResultId = latest?.corrected_result_id ?? null;
  else acceptedResultId = null; // rejected | deferred | unanswered -> nothing is accepted

  const permitted = type === "confirmed" || type === "corrected";

  return {
    originalResultId: result.original_result_id,
    acceptedResultId,
    status: type ?? "unanswered",
    resolved: permitted,
    respondedAt: latest?.created_at ?? null,
    // Never default to true: downstream use requires an explicit accepting response.
    recommendationUsePermitted: latest ? latest.recommendation_use_permitted : false,
    continuityUsePermitted: latest ? latest.continuity_use_permitted : false,
    responseCount: responses.length,
  } as const;
}
