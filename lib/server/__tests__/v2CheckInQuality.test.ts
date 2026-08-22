import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// YORISOU V2 — the quality contract for what the product says back.
//
// These are not style checks. Each one encodes a rule the previous version broke, and the previous
// version shipped because nothing here existed to stop it: the check-in returned the two labels the
// person had just tapped, and no test could tell that apart from an answer.
//
// The rules are the mandate's: Grounding, Value Delta, Humility, Agency, Actionability, Safety.

import {
  CHECK_IN_FEEDBACK,
  acknowledgeFeedback,
  checkInResponseFor,
} from "@/lib/yorisou/today/checkInResponse";
import {
  INTENT_OPTIONS,
  STATE_OPTIONS,
  type IntentOptionId,
  type StateOptionId,
} from "@/lib/yorisou/today/currentStateCheckIn";

const STATES = STATE_OPTIONS.map((o) => o.id);
const INTENTS = INTENT_OPTIONS.map((o) => o.id);
const ALL = STATES.flatMap((s) => INTENTS.map((i) => [s, i] as [StateOptionId, IntentOptionId]));
const LABELS = [...STATE_OPTIONS, ...INTENT_OPTIONS].map((o) => o.label);

test("every combination has an answer, and they are all different", () => {
  assert.equal(ALL.length, 25);
  const readings = ALL.map(([s, i]) => checkInResponseFor(s, i).reading);
  assert.equal(new Set(readings).size, 25, "two combinations share a reading — the state is being ignored again");
});

// ─── VALUE DELTA — the rule the old screen failed ───────────────────────────

test("VALUE DELTA: no answer is a paraphrase of what the person just chose", () => {
  for (const [state, intent] of ALL) {
    const { reading } = checkInResponseFor(state, intent);
    // The exact old failure: "落ち着かない。気分を変えたいようです。"
    for (const label of LABELS) {
      assert.ok(
        !reading.startsWith(`${label}。`),
        `${state}/${intent} opens by repeating "${label}" — that is the paraphrase this replaced`,
      );
    }
    // Echoing both chosen labels and adding almost nothing is the same failure, spelled differently.
    const stateLabel = STATE_OPTIONS.find((o) => o.id === state)!.label;
    const intentLabel = INTENT_OPTIONS.find((o) => o.id === intent)!.label;
    if (reading.includes(stateLabel) && reading.includes(intentLabel)) {
      const remainder = reading.replace(stateLabel, "").replace(intentLabel, "");
      assert.ok(
        remainder.length >= 30,
        `${state}/${intent} is mostly the two labels with connective tissue around them`,
      );
    }
  }
});

test("VALUE DELTA: the state actually changes the answer", () => {
  // Keyed on intent alone is exactly what the old version did. For every intent, the five states
  // must produce five different readings.
  for (const intent of INTENTS) {
    const readings = STATES.map((s) => checkInResponseFor(s, intent).reading);
    assert.equal(
      new Set(readings).size, 5,
      `intent "${intent}" gives the same answer regardless of how the person is — the state is decoration`,
    );
  }
});

test("VALUE DELTA: the answer says enough to be worth reading", () => {
  for (const [state, intent] of ALL) {
    const { reading } = checkInResponseFor(state, intent);
    assert.ok(reading.length >= 40, `${state}/${intent} is too short to contain an observation`);
    assert.ok(reading.length <= 140, `${state}/${intent} is long enough to be a lecture`);
  }
});

// ─── HUMILITY — a reading is a hypothesis, never a verdict ──────────────────

test("HUMILITY: every reading is hedged, and none asserts a fact about the person", () => {
  const HEDGES = ["かもしれ", "ようです", "ようにも", "ことがあり", "ことも", "そうです", "があります"];
  for (const [state, intent] of ALL) {
    const { reading } = checkInResponseFor(state, intent);
    assert.ok(
      HEDGES.some((h) => reading.includes(h)),
      `${state}/${intent} states an interpretation as fact — it must be offered, not declared`,
    );
    // Overclaiming vocabulary: telling someone what they are, or what they must do.
    for (const forbidden of ["あなたは必ず", "間違いなく", "確実に", "должны", "すべきです", "してください。必ず"]) {
      assert.ok(!reading.includes(forbidden), `${state}/${intent} overclaims ("${forbidden}")`);
    }
  }
});

// ─── SAFETY — descriptions of a day, never of a condition ───────────────────

test("SAFETY: no diagnosis, no clinical framing, no medical advice", () => {
  const CLINICAL = [
    "うつ", "不安障害", "障害", "症状", "診断", "疾患", "治療", "медицин",
    "メンタルヘルスの問題", "病", "セラピー", "カウンセリングを受け",
  ];
  for (const [state, intent] of ALL) {
    const r = checkInResponseFor(state, intent);
    const text = `${r.reading}${r.because}${r.step.label}`;
    for (const word of CLINICAL) {
      assert.ok(!text.includes(word), `${state}/${intent} uses clinical language ("${word}")`);
    }
  }
});

// ─── ACTIONABILITY — exactly one step, and it goes somewhere real ───────────

test("ACTIONABILITY: one next step per answer, explainable, and reachable", () => {
  const OPEN_ROUTES = ["/", "/explore", "/tests", "/tests/ima-iro"];
  for (const [state, intent] of ALL) {
    const { step, because } = checkInResponseFor(state, intent);
    assert.ok(step.label.length > 0 && step.href.length > 0, `${state}/${intent} has no next step`);
    // A suggestion leading somewhere a person cannot reach is worse than no suggestion. Every
    // destination is a surface that is open to everyone, signed in or not.
    assert.ok(
      OPEN_ROUTES.includes(step.href),
      `${state}/${intent} points at ${step.href}, which is not open to every visitor`,
    );
    assert.ok(because.length >= 12, `${state}/${intent} cannot explain why it suggested that`);
    assert.ok(because.length <= 60, `${state}/${intent}'s explanation is competing with the answer`);
  }
});

test("ACTIONABILITY: stopping is offered as a real option", () => {
  // Every "undecided" row ends with permission to stop. A product that always has one more thing
  // for you is the engagement pattern this one is explicitly not.
  for (const state of STATES) {
    const { step } = checkInResponseFor(state, "undecided");
    assert.match(step.label, /今日はここまで/, `${state}/undecided pushes onward instead of allowing a stop`);
  }
});

// ─── AGENCY — the person can correct it, and correction means something ─────

test("AGENCY: the reading can be accepted, corrected, or left open", () => {
  assert.deepEqual(CHECK_IN_FEEDBACK.map((f) => f.id), ["close", "off", "unclear"]);
  assert.deepEqual(CHECK_IN_FEEDBACK.map((f) => f.label), ["近い", "少し違う", "まだ分からない"]);
  // "Off" must withdraw the reading, not thank the person for their feedback and keep it.
  assert.match(acknowledgeFeedback("off"), /外しておきます/);
  assert.match(acknowledgeFeedback("unclear"), /そのまま/);
  for (const f of CHECK_IN_FEEDBACK) {
    assert.ok(acknowledgeFeedback(f.id).length > 0);
  }
});

test("AGENCY: a correction is not recorded as a durable claim about the person", () => {
  const surface = readFileSync("app/today/check-in/CurrentStateCheckIn.tsx", "utf8");
  const start = surface.indexOf("const [feedback");
  assert.ok(start > 0, "the feedback control is missing");
  // It is component state. Persisting "this person rejected an inference" would turn a correction
  // into exactly the kind of durable inference P7 forbids.
  assert.match(surface, /const \[feedback, setFeedback\] = useState<CheckInFeedbackId \| null>\(null\)/);
  const wired = surface.slice(surface.indexOf("CHECK_IN_FEEDBACK.map"));
  assert.ok(!/fetch\(/.test(wired.slice(0, 600)), "answering the reading sends something to the server");
});

// ─── COST — the most frequent interaction must not call a model ─────────────

test("COST: the check-in answer is a lookup, not a model call", () => {
  const source = readFileSync("lib/yorisou/today/checkInResponse.ts", "utf8");
  for (const forbidden of [/fetch\(/, /openai/i, /anthropic/i, /completion/i, /\bprompt\b/i, /await /]) {
    assert.ok(!forbidden.test(source), `the check-in response reaches for a model or the network (${forbidden})`);
  }
});

// ─── the old failure can never come back ────────────────────────────────────

test("REGRESSION: the surface no longer renders the chosen labels as the headline", () => {
  const surface = readFileSync("app/today/check-in/CurrentStateCheckIn.tsx", "utf8");
  const start = surface.indexOf('if (step === "done"');
  const done = surface.slice(start, start + 2000);
  assert.ok(
    !/\{labelForState\(state\)\}。/.test(done),
    "the result screen prints the chosen state back as its headline again",
  );
  assert.match(done, /checkInResponseFor\(state, intent\)/);
});
