// Platform tier — the continuity.core capability contract and its pure helpers.
//
// THE ONE CONTINUITY RULE:
//
//   A PROJECTION IS A REFERENCE PLUS DISPLAY-SAFE METADATA — NEVER A COPY OF THE SOURCE.
//
// Today the timeline merges its sources by reading their stores directly. That is documented and
// deliberate, and it works — but it makes deletion correctness a READ-TIME concern: every read path
// must remember to filter out sources that have gone. A projection table changes the shape of that
// problem, and it can only be an improvement if the projection cannot outlive its source. So the
// contract below is written around invalidation rather than around rendering:
//
//   * A `TimelineMoment` carries a source FAMILY and an opaque source REFERENCE, plus the minimum
//     display metadata. It has no field for source content, so a projection cannot silently become
//     a second copy of a private record.
//   * Every projection is addressable by (owner, family, reference) — which is exactly the key a
//     delete-propagation must use to invalidate it.
//   * Invalidation is a lifecycle state, not a delete-and-hope: an invalidated moment renders
//     nothing and can never be revived, mirroring the ShareObject and pair-comparison lifecycles
//     ARCH-P4 and ARCH-P5 established.
//
// This module knows no product, no language, no storage and no route.

/**
 * The source families a moment may project from. Adding one is a contract change.
 *
 * THESE ARE DERIVED FROM WHAT THE TIMELINE ACTUALLY DISPLAYS, not from the module contract's
 * `events_consumed` list — and the difference is not cosmetic. An earlier revision of this file
 * took the event list (state_snapshot / assessment_result / discovery_session / experience_card /
 * life_reflection) and would have shipped a projection that both OMITS what the timeline shows
 * (Direction/goal, and the light-vs-deep reflection split) and INCLUDES two families it does not
 * show at all. Switching the read onto that vocabulary would have silently emptied part of a
 * person's timeline, which is precisely the regression P6 exists to avoid.
 *
 * The families below mirror the kinds the product's timeline reader actually emits — four
 * owner-scoped sources behind five consumer filters, one of which splits a single source by mode.
 * Durable memory is deliberately NOT a family: a memory is a standing note, not something that
 * happened at a moment, and the timeline says so explicitly.
 *
 * The concrete table names deliberately do not appear here — the platform tier is brand-free, and
 * a structural guard enforces that. The family-to-source mapping lives in the product tier, and a
 * P6 guard pins these names against the timeline reader so the two cannot drift apart.
 */
export const CONTINUITY_SOURCE_FAMILIES = [
  "current_state",
  "goal",
  "reflection",
  "experience",
] as const;

export type ContinuitySourceFamily = (typeof CONTINUITY_SOURCE_FAMILIES)[number];

/**
 * What a module hands continuity.core when something worth remembering happened.
 *
 * `source_ref` is opaque. `occurred_at` orders the timeline. `label` is the ONLY free text, and it
 * is display-safe by the producing module's contract — never a private body, never raw answers.
 */
export interface ProjectionSource {
  owner_ref: string;
  source_family: ContinuitySourceFamily;
  source_ref: string;
  occurred_at: string;
  /** Short display-safe label. Bounded, because a projection is a pointer, not a record. */
  label: string;
}

/** Upper bound on projected label length — a projection is a pointer, not a copy. */
export const CONTINUITY_LABEL_MAX = 120;

/** Lifecycle of one projected moment. `invalidated` is terminal and irreversible. */
export type TimelineMomentStatus = "active" | "invalidated";

/**
 * One projected moment. NOTE WHAT IS ABSENT: there is no body, no payload, no answers, no score
 * and no second copy of anything. A reader that needs the source must go to the source, which is
 * what keeps deletion honest.
 */
export interface TimelineMoment {
  owner_ref: string;
  source_family: ContinuitySourceFamily;
  source_ref: string;
  occurred_at: string;
  label: string;
  status: TimelineMomentStatus;
}

/** The addressing key a delete-propagation invalidates by. */
export interface ProjectionKey {
  owner_ref: string;
  source_family: ContinuitySourceFamily;
  source_ref: string;
}

export function projectionKeyOf(source: ProjectionSource | TimelineMoment): ProjectionKey {
  return {
    owner_ref: source.owner_ref,
    source_family: source.source_family,
    source_ref: source.source_ref,
  };
}

/**
 * Validate a projection candidate. Refuses anything that would make the projection a copy: an
 * over-long label, a missing reference, or an unknown family.
 */
export function assertProjectableSource(source: ProjectionSource): void {
  if (!source.owner_ref) throw new Error("continuity_owner_required");
  if (!source.source_ref) throw new Error("continuity_source_ref_required");
  if (!(CONTINUITY_SOURCE_FAMILIES as readonly string[]).includes(source.source_family)) {
    throw new Error("continuity_unknown_source_family");
  }
  if (!source.label || source.label.trim().length === 0) throw new Error("continuity_label_required");
  if (source.label.length > CONTINUITY_LABEL_MAX) throw new Error("continuity_label_too_long");
  if (Number.isNaN(Date.parse(source.occurred_at))) throw new Error("continuity_occurred_at_invalid");
}

/** Only an ACTIVE moment is readable. Invalidated moments render nothing, ever. */
export function isReadableMoment(moment: Pick<TimelineMoment, "status">): boolean {
  return moment.status === "active";
}
