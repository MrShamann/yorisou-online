// Platform tier — the comparison.core capability contract and its pure helpers.
//
// THE ONE COMPARISON SHAPE, as mechanics:
//
//   TWO EXPLICITLY GRANTED REFERENCES → PACK ADAPTER → FIVE HUMANE OUTPUT FAMILIES
//
// The capability owns the shape of a comparison and nothing about its meaning. It never learns
// what an instrument is, what a result code means, or what language the reader speaks; a Product
// Pack adapter supplies every word. That split is what lets a second instrument — or a
// self-to-past-self comparison — reuse this file unchanged.
//
// WHY THERE IS NO SCORE FIELD, ANYWHERE.
//
// The product decision is that a pair comparison must never rank two people or reduce them to a
// compatibility number. A rule written only in review guidance gets violated eventually, so the
// constraint is structural here: `ComparisonView` has no numeric field to put a score in, and
// `assertComparisonViewShape` refuses any view that has grown extra keys. A future "just add a
// small percentage" change cannot be a quiet one-line edit — it has to change this contract and
// the guard suite that pins it.
//
// INPUTS ARE REFERENCES, NEVER CONTENT. A comparison side is an opaque reference the participant
// explicitly granted, plus the family it belongs to. This module never sees raw answers, private
// text, scores, or anything belonging to a person who is not one of the two participants.

/** The exact output families a comparison may produce. Adding a sixth is a contract change. */
export const COMPARISON_OUTPUT_FAMILIES = [
  "similarities",
  "differences",
  "possible_complementarity",
  "possible_friction",
  "shared_question",
] as const;

export type ComparisonOutputFamily = (typeof COMPARISON_OUTPUT_FAMILIES)[number];

/**
 * One side of a comparison: an opaque reference a participant EXPLICITLY granted for this
 * comparison and nothing wider.
 *
 * `participant_ref` and `reference_ref` are opaque — never an email, a display name, raw answers,
 * private text, or a durable-memory payload. Holding this object grants the right to compare the
 * reference, not to read the record behind it.
 */
export interface ComparisonInputReference {
  /** Opaque reference to the participant who granted this side. */
  participant_ref: string;
  /** Which family of reference this is (e.g. one assessment family). Never a product name here. */
  reference_family: string;
  /**
   * Opaque reference to the granted record. Present so the runtime can tie a side to its source
   * for lifecycle purposes (erasure, revalidation) — adapters must NOT read it, and nothing
   * derived from it may reach a rendered line.
   */
  reference_ref: string;
  /**
   * The PUBLIC-SAFE identifier of the referenced material — the only part of the source an adapter
   * is permitted to read, and the only part that may influence a rendered line. For an assessment
   * side this is the already-public result code, never the private row id.
   */
  public_reference: string;
}

/** A request to compare exactly two granted references under one named adapter. */
export interface ComparisonRequest {
  /** Opaque reference to the consent context (the pair) that authorizes this comparison. */
  pair_ref: string;
  adapter_ref: string;
  adapter_version: string;
  side_a: ComparisonInputReference;
  side_b: ComparisonInputReference;
}

/**
 * The humane comparison output. EXACTLY five families, all of them plain text lines.
 *
 * There is deliberately no score, no percentage, no rank, no verdict and no "type" assignment.
 * `shared_question` is a single line because the product promise is one question two people can
 * actually talk about, not a questionnaire.
 */
export interface ComparisonView {
  similarities: readonly string[];
  differences: readonly string[];
  possible_complementarity: readonly string[];
  possible_friction: readonly string[];
  shared_question: string;
}

/**
 * EXACTLY what a Product Pack adapter is allowed to see.
 *
 * `ComparisonInputReference` also carries `participant_ref` and `reference_ref`, which the runtime
 * needs for authorization and lifecycle. Passing that whole object to pack code made "the adapter
 * may only read public-safe material" a convention enforced by a comment — the private fields were
 * right there, and the first adapter obeyed the rule only because it chose to.
 *
 * This type is the rule made structural. `toAdapterInput` is the only way to produce one, and it
 * copies exactly one field, so no account id or private row reference can reach a Product Pack
 * even by mistake. A future adapter that genuinely needs more must widen THIS type — a reviewable
 * change to the capability contract, not a quiet read inside a pack.
 */
export interface ComparisonAdapterInput {
  /** The already-public identifier of the referenced material. Nothing else is public-safe. */
  public_reference: string;
}

/** Narrow a runtime reference to the public-safe subset a Product Pack may read. */
export function toAdapterInput(reference: ComparisonInputReference): ComparisonAdapterInput {
  return { public_reference: reference.public_reference };
}

/**
 * What a Product Pack supplies. The adapter is the ONLY place meaning enters a comparison: it
 * receives two PUBLIC-SAFE inputs and returns the five families, in the reader's language.
 */
export interface ComparisonAdapter {
  adapter_ref: string;
  adapter_version: string;
  /** The reference family this adapter understands; a request for any other family is refused. */
  reference_family: string;
  build(sideA: ComparisonAdapterInput, sideB: ComparisonAdapterInput): ComparisonView;
}

/** Upper bound per family — a comparison is a short humane read, not an analysis report. */
export const COMPARISON_MAX_LINES_PER_FAMILY = 5;

/**
 * Structural validation of an adapter's output. This is the guard that keeps "exactly five
 * families" true at runtime rather than only in the type system, which a `JSON.parse` result or a
 * future adapter written in looser code would otherwise slip past.
 */
export function assertComparisonViewShape(view: unknown): asserts view is ComparisonView {
  if (!view || typeof view !== "object" || Array.isArray(view)) {
    throw new Error("comparison_view_invalid");
  }
  const keys = Object.keys(view as Record<string, unknown>).sort();
  const expected = [...COMPARISON_OUTPUT_FAMILIES].sort();
  if (keys.length !== expected.length || keys.some((key, index) => key !== expected[index])) {
    // Extra keys are refused as hard as missing ones: a stray `compatibility_score` must not
    // survive because the five required families happened to be present too.
    throw new Error("comparison_view_unexpected_families");
  }
  const record = view as Record<string, unknown>;
  for (const family of COMPARISON_OUTPUT_FAMILIES) {
    if (family === "shared_question") continue;
    const lines = record[family];
    if (!Array.isArray(lines) || lines.some((line) => typeof line !== "string" || line.trim().length === 0)) {
      throw new Error(`comparison_view_invalid_family:${family}`);
    }
    if (lines.length > COMPARISON_MAX_LINES_PER_FAMILY) {
      throw new Error(`comparison_view_family_too_long:${family}`);
    }
  }
  if (typeof record.shared_question !== "string" || record.shared_question.trim().length === 0) {
    throw new Error("comparison_view_invalid_family:shared_question");
  }
}

/**
 * Both sides must be distinct participants. A comparison of one person against themselves through
 * a pair context would mean the consent model was bypassed somewhere upstream, so it is refused
 * here as well as at the database boundary — the same fact checked twice, deliberately.
 */
export function assertDistinctParticipants(request: ComparisonRequest): void {
  if (!request.side_a.participant_ref || !request.side_b.participant_ref) {
    throw new Error("comparison_participant_missing");
  }
  if (request.side_a.participant_ref === request.side_b.participant_ref) {
    throw new Error("comparison_participants_identical");
  }
}
