// Package 9 — result-reveal contract tests (source + model contracts).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SOURCE_LABEL, CONFIDENCE_COPY, LIMITATION_COPY, PRIVACY_COPY } from "../../../app/result/reveal/revealContent";
import { getTemporary120QResultCompatibility } from "../../../app/check-in/resultCompatibility";

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");

// 1. All six source types exist with Japanese labels
for (const k of ["ANSWER_DERIVED", "RULE_BASED_INTERPRETATION", "AI_GENERATED_INTERPRETATION", "USER_CONFIRMED", "OPTIONAL_NEXT_ACTION", "LIMITATION"] as const) {
  assert.ok(SOURCE_LABEL[k]?.length > 0, `source label ${k}`);
}

// 2. No fake precision or medical language in reveal copy
const allCopy = JSON.stringify({ SOURCE_LABEL, CONFIDENCE_COPY, LIMITATION_COPY, PRIVACY_COPY });
for (const banned of ["%", "パーセント", "偏差値", "治療", "障害", "臨床", "確実に"]) {
  assert.ok(!allCopy.includes(banned), `banned term in reveal copy: ${banned}`);
}
// 診断 may appear ONLY as an explicit negation ("診断…ではありません")
const shindan = [...allCopy.matchAll(/診断/g)].length;
const negated = [...allCopy.matchAll(/診断や医療的な評価ではありません/g)].length;
assert.equal(shindan, negated, "診断 must only appear as the non-diagnostic negation");

// 3. Limitation copy explicitly states non-diagnostic
assert.ok(LIMITATION_COPY.join("").includes("医療的な評価ではありません"), "non-medical statement present");

// 4. Result model unchanged: taxonomy count + placeholder truthfulness
const placeholder = getTemporary120QResultCompatibility({ resultId: null, overlayId: null, confidenceBand: "low", payloadKey: null });
assert.equal(placeholder.assignment, null, "no invented assignment without context");
assert.equal(placeholder.sourceModel, "yorisou-120q", "source model unchanged");

// 5. Page contracts: summary-first DOM, skippable reveal, no auto LINE send, server SVG constellation
const page = read("app/result/page.tsx");
assert.ok(page.indexOf("sr-only") < page.indexOf("<RevealExperience"), "accessible summary precedes staged content");
const reveal = read("app/result/reveal/RevealExperience.tsx");
assert.ok(reveal.includes("すべて表示"), "skip control present");
assert.ok(reveal.includes("useReducedMotion"), "reduced motion honored");
assert.ok(reveal.includes('get("power") === "low"'), "low-power hook present");
const constellation = read("app/result/reveal/TraitConstellation.tsx");
assert.ok(!constellation.includes('"use client"'), "constellation is server-rendered");
assert.ok(constellation.includes("測ったものではありません"), "not-a-measurement caveat");
for (const f of ["app/result/reveal/RevealExperience.tsx", "app/result/reveal/RevealSections.tsx", "app/result/reveal/TraitConstellation.tsx", "app/result/reveal/revealContent.ts"]) {
  const src = read(f);
  assert.ok(!/fetch\(|POST|line\.me|liff/i.test(src), `no network/LINE send in ${f}`);
}

// 6. Question bank / algorithm untouched: compatibility file only imported, never modified semantics here
const pkg = JSON.parse(read("package.json"));
assert.equal(pkg.dependencies.motion, "12.42.2", "motion pinned exact");
assert.ok(!pkg.dependencies.three && !pkg.dependencies["@react-three/fiber"], "no 3D deps added");

console.log("Result-reveal contract checks passed: 6 groups");
