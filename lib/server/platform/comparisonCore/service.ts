import "server-only";

// ARCH-P5 — the generic comparison.core runtime.
//
// It does exactly one interesting thing: it refuses to build a comparison unless the two sides
// were granted by two different participants for the family the adapter understands, and it
// refuses to return whatever the adapter produced unless that output is structurally the five
// humane families and nothing else.
//
// THERE IS NO GENERATION HERE. No model call, no template engine, no scoring. Meaning comes from
// the Product Pack adapter; this file is the boundary that keeps the adapter honest and keeps the
// capability reusable by a second instrument later.
//
// WHY THE VIEW IS BUILT PER VIEWER RATHER THAN STORED ONCE.
//
// A humane pair comparison addresses the reader directly ("you", "the other person"). A single
// stored view therefore has a reader baked into it, and the SECOND participant would read it
// backwards — every "you" naming the wrong person. So what persists is the stable, public-safe
// INPUT pair (each side's participant and public reference plus the adapter version), and the
// view is rendered for whoever is reading, with their own side first. The stored record stays
// small, contains no private source content, and is trivially cleared when a source is erased.

import {
  assertComparisonViewShape,
  assertDistinctParticipants,
  toAdapterInput,
  type ComparisonAdapter,
  type ComparisonInputReference,
  type ComparisonRequest,
  type ComparisonView,
} from "@/lib/platform/comparisonCore";

/**
 * The persisted comparison for one pair: which two participants, which public-safe reference each
 * contributed, and which adapter version rendered it. No private source content, and no rendered
 * copy — the copy is a function of these inputs.
 */
export interface ComparisonRecord {
  pair_ref: string;
  adapter_ref: string;
  adapter_version: string;
  reference_family: string;
  side_a: ComparisonInputReference;
  side_b: ComparisonInputReference;
  created_at: string;
}

export interface ComparisonRepository {
  /**
   * Read a pair's comparison AS A PARTICIPANT. Returns null for anyone else.
   *
   * The viewer is part of the signature because the first version was not: it took the pair
   * reference alone and relied on the caller having checked participation first. That is
   * call-order authorization, not a boundary — every future caller would have had to remember an
   * unwritten precondition, and the one that forgot would silently read both participants'
   * account ids and private source references. The implementation MUST carry the participant
   * predicate in the query itself, not filter after reading.
   */
  forPair(viewerRef: string, pairRef: string): Promise<ComparisonRecord | null>;
}

/**
 * Validate a comparison request against the adapter that will render it. Called at ACCEPT time so
 * an unrenderable pair is refused while the person is still in the flow, rather than producing a
 * pair whose comparison page is permanently broken.
 *
 * The adapter's `reference_family` is checked against BOTH sides: an adapter that understands one
 * instrument must never be handed a reference from another, because its output would be confident
 * and wrong rather than obviously broken.
 */
export function buildComparison(request: ComparisonRequest, adapter: ComparisonAdapter): ComparisonView {
  assertDistinctParticipants(request);
  if (
    request.side_a.reference_family !== adapter.reference_family ||
    request.side_b.reference_family !== adapter.reference_family
  ) {
    throw new Error("comparison_reference_family_mismatch");
  }
  if (request.adapter_ref !== adapter.adapter_ref) {
    throw new Error("comparison_adapter_mismatch");
  }
  // NARROWED BEFORE IT CROSSES THE TIER. The pack receives public-safe inputs only; the
  // participant and private source references stay inside comparison.core, where authorization
  // and lifecycle need them.
  const view = adapter.build(toAdapterInput(request.side_a), toAdapterInput(request.side_b));
  // The adapter is Product Pack code, so its output is validated rather than trusted — this is
  // the guard that makes "exactly five families, no score" a runtime fact.
  assertComparisonViewShape(view);
  return view;
}

/**
 * Render a stored comparison FOR ONE READER, with that reader's own side first.
 *
 * Throws when the reader is not one of the two recorded participants. A non-participant must never
 * receive a rendered view; callers establish participation first, and this is the second,
 * independent place that fact is required to hold.
 */
export function renderComparisonFor(
  viewerRef: string,
  record: ComparisonRecord,
  adapter: ComparisonAdapter,
): ComparisonView {
  const self = [record.side_a, record.side_b].find((side) => side.participant_ref === viewerRef);
  const other = [record.side_a, record.side_b].find((side) => side.participant_ref !== viewerRef);
  if (!self || !other) throw new Error("comparison_viewer_not_participant");
  return buildComparison(
    {
      pair_ref: record.pair_ref,
      adapter_ref: record.adapter_ref,
      adapter_version: record.adapter_version,
      side_a: self,
      side_b: other,
    },
    adapter,
  );
}

/**
 * Read one pair's stored comparison as a participant.
 *
 * Participation is enforced by the repository query, so this is safe to call without having
 * established it beforehand — a non-participant receives null, which is the same answer as a pair
 * that does not exist.
 */
export function readComparison(
  viewerRef: string,
  pairRef: string,
  repository: ComparisonRepository,
): Promise<ComparisonRecord | null> {
  if (!viewerRef) return Promise.resolve(null);
  return repository.forPair(viewerRef, pairRef);
}
