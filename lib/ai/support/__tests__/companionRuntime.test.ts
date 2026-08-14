import assert from "node:assert/strict";
import test from "node:test";

import { routeSupportActions } from "@/lib/ai/support/action-router";
import { getConversationPolicy } from "@/lib/ai/support/conversation-policy";
import { buildDeterministicSupportReply } from "@/lib/ai/support/prompt-builder";
import { classifySupportScenario } from "@/lib/ai/support/scenario-engine";

function classify(message: string, messages: Array<{ role: "user" | "assistant"; content: string }> = []) {
  return classifySupportScenario({
    locale: "ja",
    identity: "self",
    issueType: "mobility_anxiety",
    message,
    messages,
  });
}

test("relationship fatigue stays in companion ontology", () => {
  const result = classify("最近、友達に返信するのもしんどくて、少し距離を置きたい");
  assert.equal(result.scenario, "reflect_on_relationship");
  assert.equal(result.domainContext, "relationship");
  assert.notEqual(result.scenario, "elder_mobility_anxiety");
  assert.deepEqual(result.nextActions, ["no_action"]);
});

test("work pressure is not converted into product or consultation guidance", () => {
  const result = classify("仕事のことを考えるだけで疲れる。何から整理したらいいかわからない");
  assert.equal(result.scenario, "decide_next_small_step");
  assert.equal(result.domainContext, "work");
  const actions = routeSupportActions(result, "ja");
  assert.equal(actions.some((action) => /製品|導入|予約/.test(`${action.title}${action.description}`)), false);
});

test("listen-only intent permits no action", () => {
  const result = classify("今日はただ話を聞いてほしい");
  assert.equal(result.scenario, "be_heard");
  assert.equal(result.shouldAskClarifyingQuestion, false);
  assert.deepEqual(result.nextActions, ["no_action"]);
});

test("memory intent routes only to explicit-consent memory", () => {
  const result = classify("この話は次に来たときのために覚えておいてほしい");
  assert.equal(result.scenario, "remember_something");
  assert.deepEqual(result.nextActions, ["save_with_consent"]);
});

test("deterministic fallback contains no mobility-product consultation language", () => {
  const scenario = classify("最近、人間関係でちょっと疲れてる");
  const policy = getConversationPolicy(scenario, "ja");
  const actions = routeSupportActions(scenario, "ja");
  const reply = buildDeterministicSupportReply({
    locale: "ja",
    userMessage: "最近、人間関係でちょっと疲れてる",
    history: [],
    scenario,
    policy,
    actions,
  }).message;

  assert.equal(/車いす|移動手段|通院|製品選び|導入相談|予約/.test(reply), false);
  assert.equal(/関係|距離|疲/.test(reply), true);
});
