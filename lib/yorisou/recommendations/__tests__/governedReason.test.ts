// UX-2R / CPC-1 — recommendation SEMANTIC truth.
//
// The defect these lock down: the catalogue was deterministic, and that determinism was mistaken
// for justification. A hash chose three entries and each entry then asserted something about the
// reader ("moving too quickly", "high load"). Nothing connected those claims to the person's
// actual result. Reproducible selection is not evidence.

import assert from "node:assert/strict";
import test from "node:test";

import {
  CONSERVATIVE_REASON,
  GOVERNED_RESULT_REASON_MAP,
  buildGovernedRecommendationItems,
  findGovernedRecommendation,
  hasGovernedResultMapping,
  resolveGovernedReason,
} from "../governed";

test("selection is deterministic — the same accepted result always yields the same set", () => {
  const a = buildGovernedRecommendationItems("MS-KI");
  const b = buildGovernedRecommendationItems("MS-KI");
  assert.deepEqual(a, b);
  assert.equal(a.length, 3);
});

test("selection varies across the taxonomy, and collisions are expected rather than a defect", () => {
  // With a five-entry catalogue, two result codes CAN land on the same three entries. That is a
  // property of a deliberately small governed pool, not a bug — and it is another reason the
  // reason copy must not claim the set was tailored to the person.
  const sets = new Set(
    ["MS-KI", "MS-SZ", "IMA-01", "IMA-07", "IMA-12", "IMA-19"].map((code) =>
      buildGovernedRecommendationItems(code)
        .map((i) => i.recommendationKey)
        .join("|"),
    ),
  );
  assert.ok(sets.size > 1, "selection must depend on the accepted result at all");
});

test("every persisted key resolves to governed content — nothing renders blank", () => {
  for (const code of ["MS-KI", "MS-SZ", "IMA-07", "unknown-code"]) {
    for (const item of buildGovernedRecommendationItems(code)) {
      assert.ok(findGovernedRecommendation(item.recommendationKey), item.recommendationKey);
    }
  }
});

test("NO recommendation asserts a trait without an approved result mapping", () => {
  // The map is empty today, so every reason must be the conservative one. If someone adds a
  // result-specific reason later, this test forces the mapping to exist rather than the claim
  // being smuggled into catalogue copy.
  for (const code of ["MS-KI", "MS-SZ", "IMA-07"]) {
    for (const item of buildGovernedRecommendationItems(code)) {
      const reason = resolveGovernedReason(code, item.recommendationKey);
      if (!hasGovernedResultMapping(code, item.recommendationKey)) {
        assert.equal(reason, CONSERVATIVE_REASON, `${code}/${item.recommendationKey}`);
      }
    }
  }
});

test("the conservative reason states no tendency about the person", () => {
  // Guards against the exact phrasings that were removed.
  for (const claim of ["傾向", "早く動き", "考えが重なり", "負荷が高め"]) {
    if (claim === "傾向") {
      // "特定の傾向があると判断したものではありません" is a DENIAL of a tendency, which is fine.
      assert.ok(CONSERVATIVE_REASON.includes("判断したものではありません"));
      continue;
    }
    assert.ok(!CONSERVATIVE_REASON.includes(claim), claim);
  }
});

test("an approved mapping wins over the fallback when one exists", () => {
  const KEY = "pause_small";
  GOVERNED_RESULT_REASON_MAP["TEST-CODE"] = { [KEY]: "承認済みの理由です。" };
  try {
    assert.equal(resolveGovernedReason("TEST-CODE", KEY), "承認済みの理由です。");
    assert.equal(hasGovernedResultMapping("TEST-CODE", KEY), true);
    // A different key under the same result still falls back.
    assert.equal(resolveGovernedReason("TEST-CODE", "rest_first"), CONSERVATIVE_REASON);
  } finally {
    delete GOVERNED_RESULT_REASON_MAP["TEST-CODE"];
  }
});

test("an unknown result produces governed content, never fabricated content", () => {
  const items = buildGovernedRecommendationItems("does-not-exist");
  assert.equal(items.length, 3);
  for (const item of items) {
    assert.ok(findGovernedRecommendation(item.recommendationKey));
    assert.equal(resolveGovernedReason("does-not-exist", item.recommendationKey), CONSERVATIVE_REASON);
  }
});
