import "server-only";

// CPR-1 — the authenticated owner source adapter for the Imairo pair family.
//
// This is the ONLY place a private persisted result meets connection.core, and it mirrors the
// ARCH-P4 share source adapter deliberately: same protected boundary, same basis. The pair uses
// the persisted row's existing PUBLIC result code — never accepted/corrected understanding, never
// report content, never raw answers or dimension output.
//
// It exposes only what a person needs in order to CHOOSE which of their own results to contribute:
// the opaque row id and the already-public archetype nickname. Nothing here is ever shown to the
// other participant.

import { listResultsForOwner } from "@/lib/server/assessmentAttemptStore";
import { findPublicArchetypeByCode } from "@/lib/yorisou/public-result/taxonomy";
import { IMAIRO_PAIR_REFERENCE_FAMILY } from "@/packs/yorisou/imairo/pair";

/** The Imairo method id as the assessment tables record it. */
const IMAIRO_METHOD_ID = "imairo-120q";

export interface OwnedPairSource {
  /** Opaque row reference — the only identifier the client ever sends back. */
  resultRowId: string;
  /** The person's own public archetype nickname, so they can tell their results apart. */
  nickname: string;
  producedAt: string;
}

export { IMAIRO_PAIR_REFERENCE_FAMILY };

/**
 * The caller's own Imairo results that can take part in a pair: live, Imairo, and carrying an
 * assigned public archetype. A result with no assignment is excluded rather than offered and then
 * refused at the mutation boundary — the person should not be able to pick something that cannot
 * work.
 *
 * Ownership here is a CONVENIENCE filter for rendering a chooser. It is not the security boundary:
 * the database re-verifies ownership of whichever row is submitted.
 */
export async function listOwnedPairSources(
  ownerAccountId: string,
  limit = 10,
): Promise<OwnedPairSource[]> {
  const results = await listResultsForOwner(ownerAccountId, Math.max(1, Math.min(limit, 50)));
  const usable: OwnedPairSource[] = [];
  for (const result of results) {
    if (result.method_id !== IMAIRO_METHOD_ID) continue;
    const assignment = findPublicArchetypeByCode(result.result_id);
    if (!assignment) continue;
    usable.push({
      resultRowId: result.id,
      nickname: assignment.nickname,
      producedAt: result.produced_at,
    });
    if (usable.length >= limit) break;
  }
  return usable;
}
