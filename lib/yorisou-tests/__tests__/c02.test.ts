import assert from "node:assert/strict";

import { validateBranchRedirectTarget } from "@/lib/server/branchRegistry";
import { getProductionTestDefinition, listProductionTestDefinitions, resolveProductionTestResult, validateTestAnswers } from "../engine";
import { C02_SCORING_VERSION, C02_TEST_ID, C02_TEST_VERSION, c02Runtime, resolveValidatedC02Result, validateC02Answers } from "../c02";

const completeAnswers = Object.fromEntries(c02Runtime.questions.map((question) => [question.id, question.options[0]?.key]));

assert.equal(C02_TEST_ID, "C02");
assert.equal(C02_TEST_VERSION, "v1.0");
assert.equal(C02_SCORING_VERSION, "c02-rule-based-v1");
assert.equal(c02Runtime.questions.length, 36, "C02 has all source questions");
assert.equal(new Set(c02Runtime.questions.map((question) => question.id)).size, 36, "C02 question IDs are unique");
for (const question of c02Runtime.questions) {
  assert.match(question.id, /^C02_Q\d{2}$/);
  assert.ok(question.options.length >= 2, `${question.id} has answer options`);
  assert.ok(question.options.every((option) => typeof option.key === "string" && option.key.length > 0));
}

const valid = validateC02Answers(completeAnswers);
assert.equal(valid.ok, true, "complete source answer set validates");
if (valid.ok) {
  const first = resolveValidatedC02Result(valid.answers);
  const second = resolveValidatedC02Result(valid.answers);
  assert.deepEqual(first, second, "identical answers always resolve identically");
  assert.ok(first.resultId.length > 0, "result mapping resolves");
}

const missing = { ...completeAnswers };
delete missing.C02_Q36;
assert.equal(validateC02Answers(missing).ok, false, "incomplete answer set is rejected");
assert.equal(validateC02Answers({ ...completeAnswers, C02_Q01: "not-an-option" }).ok, false, "malformed option is rejected");
assert.equal(validateC02Answers({ ...completeAnswers, extra: "A" }).ok, false, "unknown question is rejected");
assert.equal(validateC02Answers(null).ok, false, "non-object input is rejected");

const tieAnswers = Object.fromEntries(c02Runtime.questions.map((question) => [question.id, question.options[2]?.key]));
const tieValidation = validateC02Answers(tieAnswers);
assert.equal(tieValidation.ok, true, "boundary/tie-shaped answers validate");
if (tieValidation.ok) assert.deepEqual(resolveValidatedC02Result(tieValidation.answers), resolveValidatedC02Result(tieValidation.answers));

assert.equal(validateBranchRedirectTarget("yorisou_dte", "/tests/c02/return", "/line/mini-app"), "/tests/c02/return", "C02 LINE return route is allowed");
assert.equal(validateBranchRedirectTarget("yorisou_dte", "/tests/f01/return", "/line/mini-app"), "/tests/f01/return", "F01 LINE return route is allowed");
assert.equal(validateBranchRedirectTarget("yorisou_dte", "https://unsafe.example", "/line/mini-app"), "/line/mini-app", "external LINE return route is rejected");

const definitions = listProductionTestDefinitions();
assert.deepEqual(definitions.map((definition) => definition.testId), ["C02", "F01", "F02"], "production test registry is bounded");
for (const definition of definitions) {
  assert.equal(definition.runtime.questions.length, definition.runtime.questionCount, `${definition.testId} question count matches definition`);
  assert.equal(new Set(definition.runtime.questions.map((question) => question.id)).size, definition.runtime.questionCount, `${definition.testId} IDs are unique`);
  const answers = Object.fromEntries(definition.runtime.questions.map((question) => [question.id, question.options[0]?.key]));
  const checked = validateTestAnswers(definition, answers);
  assert.equal(checked.ok, true, `${definition.testId} complete answers validate`);
  if (checked.ok) assert.deepEqual(resolveProductionTestResult(definition, checked.answers), resolveProductionTestResult(definition, checked.answers), `${definition.testId} scoring is repeatable`);
}
assert.equal(getProductionTestDefinition("unknown"), null, "unknown test is rejected");

console.log("Shared test-engine contract and scoring checks passed: 24 assertions");
