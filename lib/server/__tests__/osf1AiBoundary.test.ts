import { test } from "node:test";
import assert from "node:assert/strict";

import {
  AI_BOUNDARY,
  assertAiOutputWithinBoundary,
  buildMemoryCandidates,
  inspectAiOutput,
  memoryDigest,
} from "../lifeOs/aiBoundary";

// OSF-1 — the AI boundary, tested as a boundary rather than as a list of words.
//
// Two failure modes matter and they pull in opposite directions. A scanner that misses a diagnosis
// lets the product tell someone what is wrong with them. A scanner that fires on ordinary feeling
// words makes the whole calm register unusable and gets switched off within a week. So the cases
// below are paired: the prohibited claim AND the innocent sentence that must survive.

test("the declared boundary has not been quietly widened", () => {
  // If someone adds a permission here, this test is where they have to notice they did.
  assert.deepEqual([...AI_BOUNDARY.permitted], [
    "summarise_user_input",
    "organise_reflection",
    "suggest_memory_candidates",
    "ask_reflection_questions",
  ]);
  assert.deepEqual([...AI_BOUNDARY.prohibited], [
    "diagnose",
    "define_personality",
    "create_permanent_identity",
    "infer_sensitive_traits",
    "create_memory_without_confirmation",
  ]);
});

test("clinical claims are refused", () => {
  for (const text of [
    "これは適応障害の可能性があります。",
    "あなたの症状から、うつ病と診断できます。",
    "治療が必要な状態です。",
    "This looks like you have an anxiety disorder.",
  ]) {
    const violations = inspectAiOutput(text);
    assert.ok(violations.length > 0, `not caught: ${text}`);
    assert.ok(
      violations.some((violation) => violation.category === "diagnosis"),
      `caught but miscategorised: ${text} -> ${violations.map((v) => v.category).join(",")}`,
    );
  }
});

test("personality and permanent-identity claims are refused", () => {
  assert.ok(inspectAiOutput("あなたは内向的な人です。").some((v) => v.category === "personality_definition"));
  assert.ok(inspectAiOutput("あなたの性格から見ると、").some((v) => v.category === "personality_definition"));
  assert.ok(inspectAiOutput("Your personality is best described as guarded.").some((v) => v.category === "personality_definition"));
  assert.ok(inspectAiOutput("あなたはいつも人を優先します。").some((v) => v.category === "permanent_identity"));
  assert.ok(inspectAiOutput("この傾向が変わることはありません。").some((v) => v.category === "permanent_identity"));
  assert.ok(inspectAiOutput("You always avoid conflict.").some((v) => v.category === "permanent_identity"));
});

test("sensitive-trait inference and absolute certainty are refused", () => {
  assert.ok(inspectAiOutput("宗教的な背景が影響しているようです。").some((v) => v.category === "sensitive_trait_inference"));
  assert.ok(inspectAiOutput("必ず良くなります。").some((v) => v.category === "absolute_certainty"));
  assert.ok(inspectAiOutput("This will definitely help.").some((v) => v.category === "absolute_certainty"));
});

test("the product's own calm register is NOT flagged", () => {
  // Every one of these is real Yorisou copy or the shape of it. A scanner that rejects them is
  // unusable, and an unusable scanner gets disabled — which is the same as having none.
  for (const text of [
    "少し休みたい、という気持ちがあるようです。",
    "なんとなく重い、と選ばれています。",
    "頭が休まらない状態が続いているのかもしれません。",
    "すべてを当てはめる必要はありません。参考として扱ってください。",
    "不安に感じることがあるかもしれません。",
    "今日は落ち着かない一日だった、と書かれています。",
    "次に同じことがあったら、先に書き出してみたい。",
  ]) {
    assert.deepEqual(inspectAiOutput(text), [], `false positive on calm copy: ${text}`);
  }
});

test("assertAiOutputWithinBoundary throws with the categories named", () => {
  assert.doesNotThrow(() => assertAiOutputWithinBoundary("整理すると、三つのことが書かれています。"));
  assert.throws(
    () => assertAiOutputWithinBoundary("あなたは内向的な人です。必ず良くなります。"),
    /ai_boundary_violation:.*personality_definition.*absolute_certainty|ai_boundary_violation:.*absolute_certainty.*personality_definition/,
  );
});

test("memory candidates quote the person, and never invent", () => {
  const candidates = buildMemoryCandidates({
    reflection: {
      id: "r1",
      what_learned: "先に書き出すと落ち着く",
      next_time: "まず紙に書く",
    },
    goal: { id: "g1", title: "ひとりの時間をつくる" },
  });
  assert.equal(candidates.length, 3);
  // Every candidate's content is a verbatim answer, not a summary of one.
  assert.deepEqual(
    candidates.map((candidate) => candidate.content),
    ["先に書き出すと落ち着く", "まず紙に書く", "ひとりの時間をつくる"],
  );
  for (const candidate of candidates) {
    assert.equal(candidate.digest, memoryDigest(candidate.content));
    assert.equal(candidate.source, "user_confirmed_ai_suggestion");
    // A candidate is not a record: it has no id and no confirmed flag.
    assert.ok(!("id" in candidate));
    assert.ok(!("user_confirmed" in candidate));
  }
});

test("empty and absent answers produce no candidate", () => {
  assert.deepEqual(buildMemoryCandidates({}), []);
  assert.deepEqual(buildMemoryCandidates({ reflection: { id: "r", what_learned: "   ", next_time: null } }), []);
  assert.deepEqual(buildMemoryCandidates({ goal: null, reflection: null }), []);
});

test("the digest is stable and trims exactly as the database does", () => {
  // SQL btrim strips ASCII spaces; JS trim strips those AND tabs, newlines, U+3000. Digesting the
  // trimmed string on both sides is what makes btrim(jsTrimmed) === jsTrimmed hold.
  const expected = memoryDigest("先に書き出すと落ち着く");
  for (const raw of ["先に書き出すと落ち着く", "  先に書き出すと落ち着く  ", "先に書き出すと落ち着く\n", "\t先に書き出すと落ち着く"]) {
    assert.equal(memoryDigest(raw), expected, `digest differed for ${JSON.stringify(raw)}`);
  }
  assert.match(expected, /^[0-9a-f]{64}$/);
});
