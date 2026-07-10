import { c02Runtime, C02_SCORING_VERSION, C02_TEST_VERSION } from "./c02";
import { f01Runtime } from "./f01";
import { f02Runtime } from "./f02";
import { getOptionId, resolveRuleBasedResult } from "./scoring";
import type { RuleBasedResolvedResult, RuleBasedRuntime } from "./types";

export type ProductionTestDefinition = {
  slug: "c02" | "f01" | "f02";
  testId: "C02" | "F01" | "F02";
  version: "v1.0";
  scoringVersion: string;
  locale: "ja";
  status: "production";
  runtime: RuleBasedRuntime;
  methodologyDisclosure: string;
  provenance: string;
  analyticsNamespace: string;
  lineReturnTarget: string;
};

const definitions: ProductionTestDefinition[] = [
  { slug: "c02", testId: "C02", version: C02_TEST_VERSION, scoringVersion: C02_SCORING_VERSION, locale: "ja", status: "production", runtime: c02Runtime, methodologyDisclosure: c02Runtime.boundaryNote, provenance: "UESoul C02 v1.0", analyticsNamespace: "c02", lineReturnTarget: "/tests/c02/return" },
  { slug: "f01", testId: "F01", version: "v1.0", scoringVersion: "yorisou-rule-based-v1", locale: "ja", status: "production", runtime: f01Runtime, methodologyDisclosure: f01Runtime.boundaryNote, provenance: "UESoul F01 v1.0", analyticsNamespace: "f01", lineReturnTarget: "/tests/f01/return" },
  { slug: "f02", testId: "F02", version: "v1.0", scoringVersion: "yorisou-rule-based-v1", locale: "ja", status: "production", runtime: f02Runtime, methodologyDisclosure: f02Runtime.boundaryNote, provenance: "UESoul F02 v1.0", analyticsNamespace: "f02", lineReturnTarget: "/tests/f02/return" },
];

export function listProductionTestDefinitions() { return [...definitions]; }
export function getProductionTestDefinition(slug: string) { return definitions.find((definition) => definition.slug === slug.toLowerCase()) || null; }

export type TestAnswerMap = Record<string, string>;
export type TestAnswerValidation = { ok: true; answers: TestAnswerMap } | { ok: false; code: "invalid_answers" | "incomplete_answers"; message: string };

export function validateTestAnswers(definition: ProductionTestDefinition, input: unknown): TestAnswerValidation {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, code: "invalid_answers", message: "回答形式を確認できませんでした。" };
  const answers = input as Record<string, unknown>;
  const ids = new Set(definition.runtime.questions.map((question) => question.id));
  if (Object.keys(answers).length !== ids.size) return { ok: false, code: "incomplete_answers", message: "すべての質問への回答が必要です。" };
  const normalized: TestAnswerMap = {};
  for (const question of definition.runtime.questions) {
    const answer = answers[question.id];
    if (typeof answer !== "string" || !question.options.some((option) => getOptionId(option) === answer)) return { ok: false, code: "invalid_answers", message: "回答内容を確認できませんでした。" };
    normalized[question.id] = answer;
  }
  if (Object.keys(answers).some((id) => !ids.has(id))) return { ok: false, code: "invalid_answers", message: "回答内容を確認できませんでした。" };
  return { ok: true, answers: normalized };
}

export function resolveProductionTestResult(definition: ProductionTestDefinition, answers: TestAnswerMap): RuleBasedResolvedResult {
  return resolveRuleBasedResult(definition.runtime, answers);
}
