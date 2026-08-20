// Platform tier — the Me composition contract and its pure helpers.
//
// THE ONE ME RULE:
//
//   ME IS A COMPOSITION SURFACE, NEVER A SECOND PROFILE DATABASE.
//
// The reference architecture states it directly: Me "shows, separately" a person's current state,
// their recognition result, their user-confirmed durable context, the product's own observations,
// and their user-confirmed values — and it lists the surface's writes as "—". So this module
// describes a READ, and there is nowhere in it to put a stored fact about a person:
//
//   * A part carries its STATE and, when present, an opaque REFERENCE to the record that already
//     exists in the module that owns it. There is no field for a name, a summary, a score, a
//     sentence someone wrote, or anything derived from those.
//   * Nothing is merged. The parts are declared separately and stay separate, because "shows,
//     separately" is a product promise: a single blended portrait is exactly the identity claim
//     this product does not get to make about someone.
//   * Nothing is inferred. A part is present because its owning module has a record, or it is not.
//
// WHY A PART CAN BE "DEFERRED" RATHER THAN SIMPLY MISSING. One of the five — observations and
// patterns — belongs to a capability that is a later release stage in the reference architecture
// and explicitly out of scope for the phases shipped so far. Modelling it as `absent` would be a lie in the other
// direction: it would tell a person there is nothing to see, when the truth is that this product
// does not yet look. `deferred` records that distinction so the surface can stay silent honestly
// instead of inventing a pattern to fill the space.
//
// This module knows no product, no language, no storage and no route.

/**
 * The five parts, in the order the reference architecture lists them.
 *
 * Adding a sixth is a contract change and a product decision, not an implementation detail — the
 * composition is what a person is shown about themselves.
 */
export const ME_COMPOSITION_PARTS = [
  "current_state",
  "assessment_recognition",
  "confirmed_durable_context",
  "observations",
  "confirmed_values",
] as const;

export type MeCompositionPart = (typeof ME_COMPOSITION_PARTS)[number];

/**
 * What the surface may say about one part.
 *
 *   present    the owning module has a record for this person
 *   absent     the owning module has none — say so plainly, offer the way in
 *   deferred   this product does not produce this part yet (a V1.5 capability)
 *   not_ready  the module could not be read here (schema not declared, transport failed)
 *
 * `absent` and `not_ready` are deliberately different. "You have not written one yet" and "we
 * could not read it just now" are different sentences to a person, and collapsing them is how a
 * surface tells someone their record is empty during an outage.
 */
export type MePartState = "present" | "absent" | "deferred" | "not_ready";

/** A pointer into the module that owns the record. Never the record. */
export interface MePartReference {
  ref: string;
  at: string;
}

export interface MePart {
  part: MeCompositionPart;
  state: MePartState;
  /** Set only when `state` is "present". A reference, never content. */
  reference: MePartReference | null;
}

export interface MeComposition {
  owner_ref: string;
  parts: readonly MePart[];
}

/** Parts this product does not produce yet. Declared once, here, so no reader has to guess. */
export const ME_DEFERRED_PARTS: readonly MeCompositionPart[] = ["observations"];

export function isDeferredPart(part: MeCompositionPart): boolean {
  return ME_DEFERRED_PARTS.includes(part);
}

/** Only a present part points at anything a surface can open. */
export function isOpenablePart(part: Pick<MePart, "state" | "reference">): boolean {
  return part.state === "present" && part.reference !== null;
}

/**
 * Validate a composition before anything renders it.
 *
 * Every part appears EXACTLY ONCE. A missing part would let a surface quietly drop a piece of
 * someone's picture; a duplicated one would show it twice, which reads as two separate facts.
 * Neither fails loudly on its own, so both are refused here.
 */
export function assertCompositionShape(composition: MeComposition): void {
  if (!composition.owner_ref) throw new Error("me_owner_required");
  const seen = new Set<string>();
  for (const part of composition.parts) {
    if (!(ME_COMPOSITION_PARTS as readonly string[]).includes(part.part)) {
      throw new Error("me_unknown_part");
    }
    if (seen.has(part.part)) throw new Error("me_duplicate_part");
    seen.add(part.part);
    if (part.state === "present" && part.reference === null) throw new Error("me_present_without_reference");
    if (part.state !== "present" && part.reference !== null) throw new Error("me_reference_without_presence");
    if (isDeferredPart(part.part) && part.state !== "deferred") throw new Error("me_deferred_part_claimed");
  }
  if (seen.size !== ME_COMPOSITION_PARTS.length) throw new Error("me_incomplete_composition");
}
