// PXR-1 — the current-state capture must stay NON-DIAGNOSTIC.
//
// The whole justification for this interaction existing outside the canonical assessment system is
// that it computes nothing about the person. These tests exist so that boundary cannot erode later
// into "just a small score" — which is how a reflection surface quietly becomes an unreviewed
// diagnostic.
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  CURRENT_STATE_CHECK_IN_VERSION,
  INTENT_OPTIONS,
  STATE_OPTIONS,
  labelForIntent,
  labelForState,
  nextStepFor,
  reflectionFor,
} from "../currentStateCheckIn";

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, "..", "currentStateCheckIn.ts"), "utf8");
const code = source.replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");

test("choices are bounded — no free text anywhere in the contract", () => {
  assert.ok(STATE_OPTIONS.length >= 3 && INTENT_OPTIONS.length >= 3);
  for (const option of [...STATE_OPTIONS, ...INTENT_OPTIONS]) {
    assert.match(option.id, /^[a-z-]+$/);
    assert.ok(option.label.length > 0);
  }
  assert.ok(!/textarea|input type="text"/i.test(code));
});

test("it computes nothing about the person", () => {
  for (const forbidden of [
    "score", "dimension", "persona", "archetype", "assignPublicArchetype",
    "questionBank", "scoringMaster", "confidence", "diagnos",
  ]) {
    assert.ok(!code.includes(forbidden), `non-diagnostic contract must not reference ${forbidden}`);
  }
});

test("reflection is a lookup, never generated prose", () => {
  for (const option of INTENT_OPTIONS) {
    const line = reflectionFor(option.id);
    assert.ok(line.length > 0, option.id);
    assert.ok(!line.includes("undefined"));
  }
});

test("every intent has exactly one bounded next step, and it is a real route", () => {
  const allowed = ["/explore", "/tests", "/tests/ima-iro"];
  for (const option of INTENT_OPTIONS) {
    const next = nextStepFor(option.id);
    assert.ok(allowed.includes(next.href), `${option.id} -> ${next.href}`);
    assert.ok(next.label.length > 0);
  }
});

test("completion never routes into the 120Q by default", () => {
  const defaults = INTENT_OPTIONS.filter((o) => o.id !== "understand").map((o) => nextStepFor(o.id).href);
  for (const href of defaults) {
    assert.notEqual(href, "/tests/ima-iro", "the Deep Dive must not be the default completion action");
  }
});

test("labels round-trip, so the reflection can quote the person verbatim", () => {
  for (const option of STATE_OPTIONS) assert.equal(labelForState(option.id), option.label);
  for (const option of INTENT_OPTIONS) assert.equal(labelForIntent(option.id), option.label);
});

test("persistence is device-local, versioned, and free of identity", () => {
  assert.match(CURRENT_STATE_CHECK_IN_VERSION, /^pxr1-current-state-v\d+$/);
  assert.ok(code.includes("localStorage"), "device-local only");
  for (const forbidden of ["fetch(", "accountId", "email", "supabase", "/api/"]) {
    assert.ok(!code.includes(forbidden), `no server sync or identity: ${forbidden}`);
  }
});

test("it does not import the gated DCI-1 pilot", () => {
  // DCI-1 is default CLOSED in Production; wiring Today's primary action to it would dead-end for
  // every real visitor and override another package's deliberate decision.
  assert.ok(!code.includes("methods/daily-check-in"));
});
