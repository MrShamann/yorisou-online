import "server-only";

// ARCH-P4 — the authenticated owner source adapter for the Imairo Result Card family.
//
// This is the ONLY place a private persisted result meets sharing.core, and it enforces the P4
// product decision: formal ShareObject creation applies to an AUTHENTICATED OWNER of a PERSISTED
// Imairo result — nothing else. Legacy/anonymous results never reach this adapter; they keep the
// existing `/result/share` compatibility flow untouched.
//
// The candidate basis is deliberately the persisted row's existing PUBLIC result code
// (`view.resultId`) — the same basis the current persisted share href uses — never
// accepted/corrected understanding, never report content. Changing that basis is a separate
// Founder decision, not an adapter edit.

import { loadPersistedAssessmentResult } from "@/lib/server/persistedResultView";
import { buildImairoShareCandidate } from "@/packs/yorisou/imairo/share";
import type { ImairoSharePayload } from "@/packs/yorisou/imairo/share";
import type { ShareCandidate } from "@/lib/platform/sharingCore";

export type ImairoShareSourceRefusal =
  | "source_not_found" // no such row, not persisted, or envelope-invalid
  | "source_not_owned" // exists but the caller is not its owner
  | "source_not_publishable"; // owned, but resolves to no assigned public archetype

/**
 * Load the caller's persisted result and build the public-safe candidate, or refuse with a bounded
 * reason. OWNERSHIP IS SESSION-DERIVED: `loadPersistedAssessmentResult` resolves the viewer from
 * the validated session internally and computes `isOwner` against it — no caller-asserted identity
 * exists in this path. An anonymous attempt-cookie view (isOwner=false) is refused: the formal
 * flow is for authenticated owners only. Refusals are deliberately coarse; "not found" and "not
 * yours" collapse into concealment at the API layer.
 */
export async function buildOwnedImairoShareCandidate(input: {
  resultRowId: string;
}): Promise<
  | { ok: true; candidate: ShareCandidate<ImairoSharePayload> }
  | { ok: false; refusal: ImairoShareSourceRefusal }
> {
  const view = await loadPersistedAssessmentResult(input.resultRowId);
  if (!view) return { ok: false, refusal: "source_not_found" };
  if (!view.isOwner) return { ok: false, refusal: "source_not_owned" };

  const candidate = buildImairoShareCandidate({
    publicResultCode: view.resultId,
    sourceRef: view.resultRowId,
  });
  if (!candidate) return { ok: false, refusal: "source_not_publishable" };
  return { ok: true, candidate };
}
