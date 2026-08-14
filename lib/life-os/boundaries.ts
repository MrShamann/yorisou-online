// OSF-1 — the two record kinds this product must never confuse, stated once.
//
// This module holds no logic and is imported for its constants and its documentation. It exists
// because the boundary it describes is the kind that survives only while someone remembers it: both
// records answer a question that sounds like "how are you", both are private, both are shown on
// surfaces a person visits daily, and the code that keeps them apart is spread over a migration, a
// store, two API routes and four pages.
//
// ─────────────────────────────────────────────────────────────────────────────
// IMAIRO RESULT = ASSESSMENT METHODOLOGY OUTPUT
// ─────────────────────────────────────────────────────────────────────────────
//
//   Produced by:   the 120-question いま色 pipeline (app/tests/ima-iro/currentStateCheckV1.ts)
//   Stored in:     public.yorisou_assessment_results, public.yorisou_test_results
//   Read through:  lib/server/canonicalPrivateState.ts, lib/server/assessmentAttemptStore.ts
//   Carries:       method id, method version, scoring version, a named result / archetype
//   Governed by:   its own acceptance, correction and tombstoned-erasure contract; the result
//                  assets and the taxonomy are PROTECTED METHODOLOGY ASSETS and are not modifiable
//                  without explicit Founder authorization
//   Means:         "this is what the method produced from what you answered, on this date"
//
// ─────────────────────────────────────────────────────────────────────────────
// CURRENT STATE RECORD = TEMPORAL DAILY LIFE STATE
// ─────────────────────────────────────────────────────────────────────────────
//
//   Produced by:   a person tapping two bounded choices (app/today/check-in), or writing one note
//   Stored in:     public.yorisou_current_state_records
//   Read through:  lib/server/lifeOs/store.ts
//   Carries:       state tags from a bounded vocabulary, optional mood/energy/situation/note
//   Computes:      nothing — no score, no dimension, no archetype, no persona, no method identity
//   Means:         "this is what I said about right now"
//
// ─────────────────────────────────────────────────────────────────────────────
// THE RULE
// ─────────────────────────────────────────────────────────────────────────────
//
// They must NEVER auto-convert, overwrite, or replace each other.
//
//   NO AUTO-CONVERT   A check-in must never be turned into, scored as, or presented as a result;
//                     a result must never be turned into a check-in. Neither may seed the other.
//   NO OVERWRITE      Writing one must never modify, correct, supersede or invalidate the other.
//                     A person's Tuesday mood does not amend their assessment; their assessment
//                     does not rewrite what they said on Tuesday.
//   NO REPLACE        Neither may stand in for the other in a surface, a summary, or an export. A
//                     screen showing "your current state" must not silently fall back to a result
//                     when there is no check-in, and vice versa.
//
// WHY IT MATTERS, CONCRETELY. Two taps and 120 answered questions are not the same evidence. If a
// check-in can appear where a result belongs, the product tells someone a methodology found
// something about them when nothing was measured. If a result can appear where a check-in belongs,
// it tells them today looks like a conclusion drawn weeks ago. The first is a false claim about the
// method; the second is a false claim about the person.
//
// A future change that crosses this boundary is a methodology change and needs its own Founder
// authorization. It is not a refactor and must not arrive as one.
//
// ENFORCEMENT. Structural, not aspirational: yorisou_current_state_records holds no result id and
// no method column; no OSF-1 module imports an assessment module; no assessment module reads an
// OSF-1 table. lib/server/__tests__/osf1Boundaries.test.ts fails if either import direction appears.

/** The two record kinds, as data, so the guard test cannot drift from the prose above. */
export const RECORD_KINDS = {
  imairoResult: {
    label: "Imairo Result",
    definition: "assessment methodology output",
    tables: ["yorisou_assessment_results", "yorisou_test_results"],
  },
  currentStateRecord: {
    label: "CurrentStateRecord",
    definition: "temporal daily life state",
    tables: ["yorisou_current_state_records"],
  },
} as const;

/** The three things that must never happen between them. */
export const BOUNDARY_RULES = ["no_auto_convert", "no_overwrite", "no_replace"] as const;
