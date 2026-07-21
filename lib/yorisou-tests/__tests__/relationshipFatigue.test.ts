import assert from "node:assert/strict";

import { RF_ARCHETYPES, RF_QUESTIONS, computeRFResult } from "@/app/tests/relationship-fatigue/data";
import {
  RF_DIMENSION_LABELS,
  RF_SAVE_FAILURE_COPY,
  RF_SCORING_VERSION,
  RF_STATE_TAGS,
  RF_TEST_ID,
  RF_TEST_VERSION,
  classifySaveFailure,
  relationshipFatigueStateTag,
  resolveRelationshipFatigueSavedResult,
  validateRelationshipFatigueAnswers,
} from "../relationshipFatigue";

assert.equal(RF_TEST_ID, "RELATIONSHIP-FATIGUE");
assert.equal(RF_TEST_VERSION, "v0.1");
assert.equal(RF_SCORING_VERSION, "relationship_fatigue_mvp_v0_1");
assert.equal(RF_QUESTIONS.length, 24, "RF has all 24 source questions");
assert.equal(new Set(RF_QUESTIONS.map((question) => question.id)).size, 24, "RF question IDs are unique");
assert.equal(RF_TEST_ID.toLowerCase(), "relationship-fatigue", "saved-result retake link resolves to the live route");

const completeAnswers = Object.fromEntries(RF_QUESTIONS.map((question) => [question.id, question.options[0].id]));

// Answer validation
const valid = validateRelationshipFatigueAnswers(completeAnswers);
assert.equal(valid.ok, true, "complete answer set validates");

const missing = { ...completeAnswers };
delete missing.RF_Q24;
assert.equal(validateRelationshipFatigueAnswers(missing).ok, false, "incomplete answer set is rejected");
assert.equal(validateRelationshipFatigueAnswers({ ...completeAnswers, RF_Q01: "not-an-option" }).ok, false, "malformed option is rejected");
assert.equal(validateRelationshipFatigueAnswers({ ...completeAnswers, extra: "RF_Q01_A" }).ok, false, "unknown question is rejected");
assert.equal(validateRelationshipFatigueAnswers(null).ok, false, "non-object input is rejected");
assert.equal(validateRelationshipFatigueAnswers([]).ok, false, "array input is rejected");

// Deterministic scoring is unchanged: the saved result must wrap computeRFResult exactly.
if (valid.ok) {
  const direct = computeRFResult(valid.answers);
  const { rf, saved } = resolveRelationshipFatigueSavedResult(valid.answers);
  assert.deepEqual(rf, direct, "saved-result path reuses the original deterministic scoring unchanged");
  assert.equal(saved.resultId, direct.archetypeId, "resultId is the archetype id");
  assert.equal(saved.title, direct.archetype.name, "title is the existing archetype name");
  assert.equal(saved.summary, direct.archetype.body, "summary is the existing archetype body");
  assert.equal(saved.topDimensions.length, 3, "top dimensions are bounded to three");
  for (const dimension of saved.topDimensions) {
    assert.ok(dimension.label.length > 0, "ranked dimensions carry Japanese labels");
  }
  const again = resolveRelationshipFatigueSavedResult(valid.answers);
  assert.deepEqual(again.saved, saved, "identical answers always resolve identically");
}

// Every archetype has a finite, Japanese, non-sensitive state tag.
for (const archetypeId of Object.keys(RF_ARCHETYPES) as (keyof typeof RF_ARCHETYPES)[]) {
  const tag = relationshipFatigueStateTag(archetypeId);
  assert.ok(tag.length > 0 && tag.length <= 80, `${archetypeId} state tag is bounded`);
  assert.equal(tag, RF_STATE_TAGS[archetypeId]);
}
assert.equal(Object.keys(RF_STATE_TAGS).length, Object.keys(RF_ARCHETYPES).length, "state tags cover every archetype exactly");

// Dimension labels cover every dimension used by questions.
const usedDimensions = new Set(RF_QUESTIONS.flatMap((question) => question.options.flatMap((option) => option.tags.map((tag) => tag.dim))));
for (const dimension of usedDimensions) {
  assert.ok(RF_DIMENSION_LABELS[dimension], `dimension ${dimension} has a Japanese label`);
}

// A recovery-leaning answer set stays deterministic across runs.
const recoveryAnswers = Object.fromEntries(
  RF_QUESTIONS.map((question) => {
    const recoveryOption = question.options.find((option) => option.tags.some((tag) => tag.dim === "D5_RECOVERY_STYLE"));
    return [question.id, (recoveryOption || question.options[0]).id];
  }),
);
const recoveryValidation = validateRelationshipFatigueAnswers(recoveryAnswers);
assert.equal(recoveryValidation.ok, true, "recovery-leaning answers validate");
if (recoveryValidation.ok) {
  assert.deepEqual(
    resolveRelationshipFatigueSavedResult(recoveryValidation.answers).saved,
    resolveRelationshipFatigueSavedResult(recoveryValidation.answers).saved,
  );
}

// Save-failure classification: the auth gate is never a generic error.
assert.equal(classifySaveFailure(401), "auth_required", "401 is the expected auth gate, not a failure");
assert.equal(classifySaveFailure(null), "network_retryable", "transport failure is retryable");
assert.equal(classifySaveFailure(500), "service_unavailable", "5xx keeps the result and exits safely");
assert.equal(classifySaveFailure(503), "service_unavailable");
assert.equal(classifySaveFailure(400), "service_unavailable", "unexpected 4xx never claims the result was lost");
for (const kind of ["auth_required", "network_retryable", "service_unavailable"] as const) {
  assert.ok(RF_SAVE_FAILURE_COPY[kind].length > 0, `${kind} has explicit Japanese next-step copy`);
}
assert.ok(RF_SAVE_FAILURE_COPY.auth_required.includes("結果はこの画面に残っています"), "auth gate copy preserves the result");
assert.ok(RF_SAVE_FAILURE_COPY.network_retryable.includes("もう一度"), "network copy offers retry");
assert.ok(RF_SAVE_FAILURE_COPY.service_unavailable.includes("この画面で確認できます"), "service copy keeps a safe exit");

console.log("Relationship-fatigue return-loop checks passed:", {
  questions: RF_QUESTIONS.length,
  archetypes: Object.keys(RF_ARCHETYPES).length,
  stateTags: Object.keys(RF_STATE_TAGS).length,
  saveFailureKinds: 3,
});
