// UX-2R / CPC-1 §7 — destination authorization contract.
//
// The gate was previously covered only by static reading: nothing exercised
// requireRecommendationContext / requireContinuityContext, so "server-enforced" rested on review
// rather than proof. The decision logic now lives in `canonicalResultGate` as pure functions and
// these tests drive it directly, so widening the gate fails here.
//
// The surrounding I/O guarantees (row exists, not erased, owner or valid anonymous credential,
// strict live envelope) are proven separately against the real Preview database.

import assert from "node:assert/strict";
import test from "node:test";

import {
  applyDestinationGate,
  toCanonicalContext,
  CANONICAL_UUID_RE,
  type PersistedViewLike,
} from "../canonicalResultGate";

const ROW = "11111111-2222-4333-8444-555555555555";

function view(understanding: Partial<PersistedViewLike["understanding"]>): PersistedViewLike {
  return {
    resultRowId: ROW,
    overlayId: "balancing",
    originalResultId: "MS-KI",
    methodId: "imairo-120q",
    methodVersion: "v1",
    producedAt: "2026-07-28T00:00:00Z",
    dimensionOutput: { v: "pds-v1" },
    claimed: true,
    isOwner: true,
    understanding: {
      acceptedResultId: null,
      status: "unanswered",
      resolved: false,
      recommendationUsePermitted: false,
      continuityUsePermitted: false,
      ...understanding,
    },
  };
}

const BOTH = ["recommendation", "continuity"] as const;

test("only a well-formed uuid can ever be looked up", () => {
  for (const bad of ["", "not-a-uuid", "../../etc/passwd", "1111-2222", `${ROW} `]) {
    assert.equal(CANONICAL_UUID_RE.test(bad), false, JSON.stringify(bad));
  }
  assert.equal(CANONICAL_UUID_RE.test(ROW), true);
});

test("UNANSWERED is withheld from both destinations", () => {
  const ctx = toCanonicalContext(view({ status: "unanswered" }));
  for (const p of BOTH) assert.equal(applyDestinationGate(ctx, p).outcome, "withheld", p);
});

test("REJECTED and DEFERRED are withheld from both destinations", () => {
  for (const status of ["rejected", "deferred"] as const) {
    const ctx = toCanonicalContext(view({ status }));
    for (const p of BOTH) assert.equal(applyDestinationGate(ctx, p).outcome, "withheld", `${status}/${p}`);
  }
});

test("CONFIRMED permits both; the effective result is the method's own", () => {
  const ctx = toCanonicalContext(
    view({
      status: "confirmed",
      resolved: true,
      acceptedResultId: "MS-KI",
      recommendationUsePermitted: true,
      continuityUsePermitted: true,
    }),
  );
  for (const p of BOTH) assert.equal(applyDestinationGate(ctx, p).outcome, "ok", p);
  assert.equal(ctx.effectiveResultId, "MS-KI");
});

test("CORRECTED uses the PERSON'S answer downstream, and preserves the original", () => {
  const ctx = toCanonicalContext(
    view({
      status: "corrected",
      resolved: true,
      acceptedResultId: "MS-SZ",
      recommendationUsePermitted: true,
      continuityUsePermitted: true,
    }),
  );
  assert.equal(applyDestinationGate(ctx, "recommendation").outcome, "ok");
  assert.equal(ctx.effectiveResultId, "MS-SZ", "downstream must follow the correction");
  assert.equal(ctx.originalResultId, "MS-KI", "the method's original is still recorded");
});

test("the two permissions are INDEPENDENT — neither is granted on the strength of the other", () => {
  const recOnly = toCanonicalContext(
    view({
      status: "confirmed",
      resolved: true,
      acceptedResultId: "MS-KI",
      recommendationUsePermitted: true,
      continuityUsePermitted: false,
    }),
  );
  assert.equal(applyDestinationGate(recOnly, "recommendation").outcome, "ok");
  assert.equal(applyDestinationGate(recOnly, "continuity").outcome, "withheld");

  const contOnly = toCanonicalContext(
    view({
      status: "confirmed",
      resolved: true,
      acceptedResultId: "MS-KI",
      recommendationUsePermitted: false,
      continuityUsePermitted: true,
    }),
  );
  assert.equal(applyDestinationGate(contOnly, "continuity").outcome, "ok");
  assert.equal(applyDestinationGate(contOnly, "recommendation").outcome, "withheld");
});

test("a permitted flag with nothing accepted is still withheld", () => {
  const ctx = toCanonicalContext(
    view({
      status: "confirmed",
      resolved: true,
      acceptedResultId: null,
      recommendationUsePermitted: true,
      continuityUsePermitted: true,
    }),
  );
  for (const p of BOTH) assert.equal(applyDestinationGate(ctx, p).outcome, "withheld", p);
});

test("a withheld denial carries context so the owner is told why, not stonewalled", () => {
  const ctx = toCanonicalContext(view({ status: "deferred" }));
  const r = applyDestinationGate(ctx, "recommendation");
  assert.equal(r.outcome, "withheld");
  if (r.outcome === "withheld") {
    assert.equal(r.context.status, "deferred");
    assert.equal(r.context.resultRowId, ROW, "so the surface can link back to the result");
  }
});
