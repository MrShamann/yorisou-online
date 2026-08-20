import "server-only";

// ARCH-P7 — the generic Me composition runtime.
//
// The reference architecture gives Me one job: read. It has no writes and emits no events, and this file has no way
// to perform either. What it does is ask each owning module whether it holds a record for this
// person, and assemble the answers WITHOUT merging them.
//
// WHY THE READERS ARE INJECTED. The composition must not know which product it is composing, and
// it must not reach into a store. Each part is resolved by a function the product supplies, so the
// only thing this module contributes is the part vocabulary, the ordering, the isolation rule and
// the failure policy — the four things that would otherwise be re-decided differently on every
// surface that shows a person to themselves.
//
// FAILURE POLICY, STATED ONCE. A reader that throws yields `not_ready` for ITS part and nothing
// else. One unreadable module must never blank the whole picture: someone whose values load but
// whose memory times out should still see their values, and should be told the truth about the
// part that did not load rather than being shown an empty frame that means "you have none".

import {
  assertCompositionShape,
  isDeferredPart,
  ME_COMPOSITION_PARTS,
  type MeComposition,
  type MeCompositionPart,
  type MePart,
  type MePartReference,
} from "@/lib/platform/meComposition";

/**
 * What a module answers when asked for one part.
 *
 * `null` means the module has no record for this person — an ordinary, expected answer, not a
 * failure. Throwing means the module could not be read.
 */
export type MePartReader = (ownerRef: string) => Promise<MePartReference | null>;

export type MePartReaders = Partial<Record<MeCompositionPart, MePartReader>>;

async function resolvePart(part: MeCompositionPart, ownerRef: string, reader?: MePartReader): Promise<MePart> {
  // A deferred part is never asked. Wiring a reader to one would quietly turn a V1.5 capability on.
  if (isDeferredPart(part)) return { part, state: "deferred", reference: null };
  if (!reader) return { part, state: "not_ready", reference: null };
  try {
    const reference = await reader(ownerRef);
    return reference
      ? { part, state: "present", reference }
      : { part, state: "absent", reference: null };
  } catch {
    return { part, state: "not_ready", reference: null };
  }
}

/**
 * Compose one person's picture of themselves.
 *
 * The parts are resolved concurrently and returned in the reference architecture's order, each
 * carrying a reference at most. Nothing here reads content, ranks the parts, scores them, or
 * derives a summary across them.
 */
export async function composeMe(ownerRef: string, readers: MePartReaders): Promise<MeComposition> {
  if (!ownerRef) throw new Error("me_owner_required");
  const parts = await Promise.all(
    ME_COMPOSITION_PARTS.map((part) => resolvePart(part, ownerRef, readers[part])),
  );
  const composition: MeComposition = { owner_ref: ownerRef, parts };
  // Validated before it can reach a surface: a dropped or doubled part is invisible downstream.
  assertCompositionShape(composition);
  return composition;
}
