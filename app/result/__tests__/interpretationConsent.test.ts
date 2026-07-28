// UX-2R / CPC-1 Wave B — the consent gate, tested against the REAL derivation.
//
// `deriveCurrentUnderstanding` is the single source of truth for whether an interpretation may be
// used downstream. These tests import it directly rather than restating its rules, so a change in
// the runtime that softened "deferred is not consent" would fail here instead of passing quietly.

import assert from "node:assert/strict";
import test from "node:test";

import { deriveCurrentUnderstanding } from "@/lib/server/currentUnderstanding";

const RESULT = {
  result_id: "IMA-07",
  original_result_id: "IMA-07",
} as Parameters<typeof deriveCurrentUnderstanding>[0];

function response(overrides: Record<string, unknown>) {
  return {
    response_type: "confirmed",
    corrected_result_id: null,
    recommendation_use_permitted: true,
    continuity_use_permitted: true,
    created_at: "2026-07-28T00:00:00Z",
    ...overrides,
  } as Parameters<typeof deriveCurrentUnderstanding>[1][number];
}

test("silence never permits downstream use", () => {
  const u = deriveCurrentUnderstanding(RESULT, []);
  assert.equal(u.status, "unanswered");
  assert.equal(u.resolved, false);
  assert.equal(u.recommendationUsePermitted, false);
  assert.equal(u.continuityUsePermitted, false);
  assert.equal(u.acceptedResultId, null);
});

test("DEFERRED IS NOT CONSENT — 'later' withholds exactly as a rejection does", () => {
  const deferred = deriveCurrentUnderstanding(RESULT, [
    response({ response_type: "deferred", recommendation_use_permitted: false, continuity_use_permitted: false }),
  ]);
  const rejected = deriveCurrentUnderstanding(RESULT, [
    response({ response_type: "rejected", recommendation_use_permitted: false, continuity_use_permitted: false }),
  ]);

  for (const u of [deferred, rejected]) {
    assert.equal(u.resolved, false);
    assert.equal(u.recommendationUsePermitted, false);
    assert.equal(u.continuityUsePermitted, false);
    assert.equal(u.acceptedResultId, null, "nothing is accepted");
  }
});

test("a stored permission flag cannot override a non-accepting response type", () => {
  // Defence in depth: even if a row somehow carried permitted=true with a rejecting type, the
  // derivation must not resolve it.
  const u = deriveCurrentUnderstanding(RESULT, [
    response({ response_type: "rejected", recommendation_use_permitted: true }),
  ]);
  assert.equal(u.resolved, false);
  assert.equal(u.acceptedResultId, null);
});

test("confirmation accepts the method's own result", () => {
  const u = deriveCurrentUnderstanding(RESULT, [response({ response_type: "confirmed" })]);
  assert.equal(u.resolved, true);
  assert.equal(u.acceptedResultId, "IMA-07");
  assert.equal(u.recommendationUsePermitted, true);
});

test("A CORRECTION PRESERVES THE ORIGINAL — the past is not rewritten", () => {
  const u = deriveCurrentUnderstanding(RESULT, [
    response({ response_type: "corrected", corrected_result_id: "IMA-12" }),
  ]);
  assert.equal(u.acceptedResultId, "IMA-12", "the person's answer is what is accepted");
  assert.equal(u.originalResultId, "IMA-07", "what the method said is still recorded");
  assert.equal(u.resolved, true);
});

test("the newest answer wins and earlier ones survive as history", () => {
  // Responses arrive newest-first.
  const u = deriveCurrentUnderstanding(RESULT, [
    response({ response_type: "rejected", recommendation_use_permitted: false, continuity_use_permitted: false }),
    response({ response_type: "confirmed" }),
  ]);
  assert.equal(u.status, "rejected", "an earlier confirmation does not survive a later rejection");
  assert.equal(u.resolved, false);
  assert.equal(u.responseCount, 2, "both answers remain recorded");
});
