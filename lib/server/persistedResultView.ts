import "server-only";
// UX-2 / ICP-1 — server-side loader for a PERSISTED assessment result.
//
// Authorization mirrors the API: the owning account, OR the anonymous holder of the attempt's
// still-valid claim credential. Erased and expired records resolve to null, so /result renders a
// safe not-found state rather than leaking existence.

import { getViewerContext } from "@/lib/server/yorisouAuth";
import {
  getResultById,
  getAttemptForToken,
  hashClaimToken,
  listResponsesForResult,
  deriveCurrentUnderstanding,
} from "@/lib/server/assessmentAttemptStore";
import { readAttemptCookie } from "@/lib/server/assessmentAttemptCookie";
import {
  type PersistedResultEnvelopeV1,
  readPersistedResultEnvelope,
} from "@/lib/server/persistedDimensionSummary";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type PersistedResultView = {
  resultRowId: string;
  resultId: string;
  overlayId: string | null;
  originalResultId: string;
  methodId: string;
  methodVersion: string;
  producedAt: string;
  /** Always present: a live row that fails the envelope invariant does not produce a view at all. */
  dimensionOutput: PersistedResultEnvelopeV1;
  claimed: boolean;
  isOwner: boolean;
  understanding: ReturnType<typeof deriveCurrentUnderstanding>;
};

export async function loadPersistedAssessmentResult(resultRowId: string): Promise<PersistedResultView | null> {
  if (!UUID_RE.test(resultRowId)) return null;
  try {
    const result = await getResultById(resultRowId); // excludes erased rows
    if (!result || !result.result_id || !result.original_result_id) return null;

    const viewer = await getViewerContext();
    const ownerId = viewer.account?.id || viewer.legacyAccount?.id || null;
    const isOwner = Boolean(ownerId && result.owner_account_id === ownerId);

    let authorized = isOwner;
    if (!authorized && !result.owner_account_id) {
      // Anonymous access needs the valid, unexpired credential for THIS attempt.
      const cookie = await readAttemptCookie();
      if (cookie && cookie.attemptId === result.attempt_id) {
        authorized = Boolean(await getAttemptForToken(result.attempt_id, hashClaimToken(cookie.token)));
      }
    }
    if (!authorized) return null;

    // §1.1 STRICT LIVE-ENVELOPE ENFORCEMENT.
    //
    // Previously a malformed envelope only produced `dimensionOutput: null` while the rest of the
    // view was returned intact, so a live row whose stored payload violated the invariant still
    // reached /result, the canonical context, /recommendations, the report and /private-state. The
    // module claimed malformed live envelopes were refused; they were merely blanked.
    //
    // `{"v":"pds-v1"}` is a LIVE-ROW INVARIANT. A live row that does not satisfy it is not a result
    // we are willing to render, so the whole load fails closed into the concealed unavailable state.
    // (Erased rows never get here: getResultById already excludes them, so an erased `{}` is
    // handled as erased, not misread as malformed live content.)
    const envelope = readPersistedResultEnvelope(result.dimension_output);
    if (!envelope) {
      console.error("persisted result rejected: live envelope invariant violated", {
        resultRowId: result.id,
      });
      return null;
    }

    const responses = isOwner && ownerId ? await listResponsesForResult(resultRowId, ownerId) : [];
    return {
      resultRowId: result.id,
      resultId: result.result_id,
      overlayId: result.overlay_id,
      originalResultId: result.original_result_id,
      methodId: result.method_id,
      methodVersion: result.method_version,
      producedAt: result.produced_at,
      // STRICT: the canonical reader returns the typed envelope or null. A legacy raw payload or
      // an unknown version can never enter the view model, and is never partially honoured.
      dimensionOutput: envelope,
      claimed: Boolean(result.owner_account_id),
      isOwner,
      understanding: deriveCurrentUnderstanding(result, responses),
    };
  } catch (error) {
    console.error("persisted result load failed", { code: error instanceof Error ? error.message : "unknown" });
    return null;
  }
}
