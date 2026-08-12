// PXR-1 — an offer may only claim the evidence it was actually handed.
//
// These tests exist because the failure mode is silent and flattering: a surface reads a local
// record, gets a partial or cleared one, and still renders 「今日えらんだ内容から」. Nothing errors,
// nothing looks broken, and the product has told someone it knows something about them that it
// does not. The degradation rule is the whole contract, so it is pinned here.
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  REASON_DISCLOSURE,
  REASON_SUMMARY,
  RECOMMENDATION_OBJECT_VERSION,
  buildRecommendationObject,
  classifyRecommendationEvidence,
  isPersonalRecommendation,
  type RecommendationReasonClass,
} from "../recommendationObject";
import { DISCOVERY_INVENTORY, discoveryEntryForRoute } from "../discoveryInventory";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..", "..", "..");
const source = readFileSync(join(HERE, "..", "recommendationObject.ts"), "utf8");
const code = source.replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");

const ALL_CLASSES: RecommendationReasonClass[] = [
  "BASED_ON_CURRENT_CHECKIN",
  "BASED_ON_RECENT_RESULT",
  "BASED_ON_EXPLICIT_INTEREST",
  "EDITORIAL_FALLBACK",
  "GENERAL_DISCOVERY",
];

const base = {
  id: "x",
  title: "t",
  body: "b",
  href: "/explore",
  ctaLabel: "c",
  limitations: "l",
};

test("every reason class has both a summary and a full disclosure", () => {
  assert.match(RECOMMENDATION_OBJECT_VERSION, /^pxr1-recommendation-v\d+$/);
  for (const cls of ALL_CLASSES) {
    assert.ok(REASON_SUMMARY[cls]?.length > 0, `summary for ${cls}`);
    assert.ok(REASON_DISCLOSURE[cls]?.length > 0, `disclosure for ${cls}`);
  }
  assert.equal(Object.keys(REASON_DISCLOSURE).length, ALL_CLASSES.length, "no undeclared classes");
});

test("evidence that is not actually there degrades to GENERAL_DISCOVERY", () => {
  // The exact shape a surface produces when it reads a cleared or partial local record.
  const degrading = [
    { kind: "current_checkin", intentLabel: "", capturedAt: "2026-08-12T00:00:00Z" },
    { kind: "current_checkin", intentLabel: "少し休みたい", capturedAt: "  " },
    { kind: "recent_result", resultLabel: "", savedAt: "2026-08-12T00:00:00Z" },
    { kind: "recent_result", resultLabel: "気配読み", savedAt: "" },
    { kind: "explicit_interest", interestLabel: "   " },
    { kind: "none" },
  ] as const;

  for (const evidence of degrading) {
    const object = buildRecommendationObject({ ...base, evidence });
    assert.equal(object.reasonClass, "GENERAL_DISCOVERY", JSON.stringify(evidence));
    assert.equal(object.evidenceDetail, null, "a degraded object names no personal fact");
    assert.equal(object.reasonDisclosure, REASON_DISCLOSURE.GENERAL_DISCOVERY);
    assert.equal(isPersonalRecommendation(object), false);
  }
});

test("real evidence produces the personal class AND names the specific fact", () => {
  const checkIn = buildRecommendationObject({
    ...base,
    evidence: { kind: "current_checkin", intentLabel: "少し休みたい", capturedAt: "2026-08-12T01:00:00Z" },
  });
  assert.equal(checkIn.reasonClass, "BASED_ON_CURRENT_CHECKIN");
  assert.equal(checkIn.evidenceDetail, "少し休みたい");
  assert.ok(isPersonalRecommendation(checkIn));

  const result = buildRecommendationObject({
    ...base,
    evidence: { kind: "recent_result", resultLabel: "気配読み", savedAt: "2026-08-01T01:00:00Z" },
  });
  assert.equal(result.reasonClass, "BASED_ON_RECENT_RESULT");
  assert.equal(result.evidenceDetail, "気配読み");

  const interest = buildRecommendationObject({
    ...base,
    evidence: { kind: "explicit_interest", interestLabel: "人との距離" },
  });
  assert.equal(interest.reasonClass, "BASED_ON_EXPLICIT_INTEREST");
  assert.equal(interest.evidenceDetail, "人との距離");
});

test("editorial content is labelled editorial, and is not personal", () => {
  const object = buildRecommendationObject({ ...base, evidence: { kind: "editorial" } });
  assert.equal(object.reasonClass, "EDITORIAL_FALLBACK");
  assert.equal(object.evidenceDetail, null);
  assert.equal(isPersonalRecommendation(object), false);
});

test("the reason sentence can never be supplied by a caller", () => {
  // If a reason could be passed in, the finite reviewable set of things Yorisou claims about why
  // something is on screen would immediately stop being finite.
  assert.ok(!/reason(Text|Copy|Sentence)|reasonDisclosure\s*:\s*input/.test(code));
  assert.match(code, /reasonDisclosure:\s*REASON_DISCLOSURE\[reasonClass\]/);
  assert.match(code, /reasonSummary:\s*REASON_SUMMARY\[reasonClass\]/);

  // Passing an unexpected extra field must not reach the object.
  const sneaky = buildRecommendationObject({
    ...base,
    evidence: { kind: "editorial" },
    // @ts-expect-error — deliberately not part of the contract
    reasonDisclosure: "あなたは疲れています",
  });
  assert.equal(sneaky.reasonDisclosure, REASON_DISCLOSURE.EDITORIAL_FALLBACK);
});

test("no reason class asserts a trait, a state, or a diagnosis", () => {
  const copy = Object.values(REASON_DISCLOSURE).concat(Object.values(REASON_SUMMARY)).join("");
  for (const banned of ["傾向があります", "タイプです", "あなたは", "診断", "%", "スコア", "点数"]) {
    assert.ok(!copy.includes(banned), `reason copy must not claim: ${banned}`);
  }
});

test("every offer states a limitation", () => {
  for (const entry of DISCOVERY_INVENTORY) {
    assert.ok(entry.limitations.length > 0, `${entry.id} must state what it cannot do`);
  }
});

test("the discovery inventory contains only routes that exist", () => {
  // A discovery surface that pads itself with dead tiles teaches people that most of what it shows
  // is not worth tapping.
  for (const entry of DISCOVERY_INVENTORY) {
    const segments = entry.href.replace(/^\//, "").split("/");
    const page = join(REPO, "app", ...segments, "page.tsx");
    assert.ok(readFileSync(page, "utf8").length > 0, `${entry.href} must be a real route`);
  }
  assert.equal(discoveryEntryForRoute("/nope"), null, "unknown routes resolve to nothing");
  assert.equal(discoveryEntryForRoute("/tests/ima-iro")?.id, "ima-iro-deep");
});
