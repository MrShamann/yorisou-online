// UX-2R / CPC-1 Wave A — route-continuity and share-safety contract.
//
// These assert the two properties Wave A exists to guarantee:
//   1. every PRIVATE continuity route keeps the stable identity, so the destination reads the
//      persisted record instead of recomputing a result from URL parameters;
//   2. every PUBLIC share route is structurally incapable of carrying the private row id.

import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPrivateContinuityHref,
  buildPublicShareHref,
  legacyIdentity,
  persistedIdentity,
  shareHrefExposesPrivateIdentity,
  PERSISTED_RESULT_QUERY_KEY,
} from "../resultIdentityRoutes";

const ROW_ID = "11111111-2222-4333-8444-555555555555";
const LEGACY = {
  resultId: "IMA-07",
  overlayId: "balancing",
  confidenceBand: "low" as const,
  payloadKey: "pk-abc",
};

const PRIVATE_CONTINUITY_ROUTES = [
  "/report-loading",
  "/result",
  "/recommendations",
  "/result/return",
  "/reports/self-understanding/IMA-07",
];

test("every private continuity route carries the stable identity", () => {
  const identity = persistedIdentity(ROW_ID, LEGACY);
  for (const route of PRIVATE_CONTINUITY_ROUTES) {
    const href = buildPrivateContinuityHref(route, identity);
    const params = new URLSearchParams(href.split("?")[1]);
    assert.equal(params.get(PERSISTED_RESULT_QUERY_KEY), ROW_ID, route);
    assert.ok(href.startsWith(`${route}?`), route);
  }
});

test("persisted continuity links carry the identity ALONE — no legacy parameters ride along", () => {
  const href = buildPrivateContinuityHref("/recommendations", persistedIdentity(ROW_ID, LEGACY));
  const params = new URLSearchParams(href.split("?")[1]);
  assert.deepEqual([...params.keys()], [PERSISTED_RESULT_QUERY_KEY]);
  assert.equal(params.get("resultId"), null);
  assert.equal(params.get("payloadKey"), null);
});

test("a share link never exposes the private row id", () => {
  const href = buildPublicShareHref("/result/share", persistedIdentity(ROW_ID, LEGACY));
  assert.equal(shareHrefExposesPrivateIdentity(href), false);
  assert.ok(!href.includes(ROW_ID));
});

test("a share link carries governed public content only — no payload key, no confidence band", () => {
  const href = buildPublicShareHref("/result/share", persistedIdentity(ROW_ID, LEGACY));
  const params = new URLSearchParams(href.split("?")[1]);
  assert.deepEqual([...params.keys()].sort(), ["overlayId", "resultId"]);
});

test("legacy mode still resolves without a persisted record", () => {
  const href = buildPrivateContinuityHref("/result", legacyIdentity(LEGACY));
  const params = new URLSearchParams(href.split("?")[1]);
  assert.equal(params.get("resultId"), "IMA-07");
  assert.equal(params.get(PERSISTED_RESULT_QUERY_KEY), null);
});

test("legacy mode share is also free of any private identity key", () => {
  const href = buildPublicShareHref("/result/share", legacyIdentity(LEGACY));
  assert.equal(shareHrefExposesPrivateIdentity(href), false);
});

test("a share link built from a persisted identity equals the one built from legacy alone", () => {
  // The share surface must not be able to tell persisted mode from legacy mode: if it could, the
  // difference would eventually become a leak.
  assert.equal(
    buildPublicShareHref("/result/share", persistedIdentity(ROW_ID, LEGACY)),
    buildPublicShareHref("/result/share", legacyIdentity(LEGACY)),
  );
});

test("the guard itself detects a leak when one is present", () => {
  assert.equal(shareHrefExposesPrivateIdentity(`/result/share?result=${ROW_ID}`), true);
});
