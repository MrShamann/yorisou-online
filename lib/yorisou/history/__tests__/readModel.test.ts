// PXR-1 — history is presented, never narrated.
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildHistoryEntries, relativeDayLabel } from "../readModel";
import {
  CURRENT_STATE_CHECK_IN_VERSION,
  labelForIntent,
  labelForState,
} from "../../today/currentStateCheckIn";

const HERE = dirname(fileURLToPath(import.meta.url));
const code = readFileSync(join(HERE, "..", "readModel.ts"), "utf8")
  .replace(/\/\/[^\n]*/g, " ")
  .replace(/\/\*[\s\S]*?\*\//g, " ");

const checkIn = {
  version: CURRENT_STATE_CHECK_IN_VERSION,
  state: "heavy",
  intent: "rest",
  completedAt: "2026-08-12T09:00:00.000Z",
  source: "local-browser",
} as const;

const saved = {
  savedAt: "2026-08-10T09:00:00.000Z",
  resultLabel: "気配読み",
  recognitionLine: "小さな変化に気づきやすい。",
  resultPath: "/result?resultId=MS-KI",
};

test("entries are ordered by what actually happened, not by read order", () => {
  const newerCheckIn = buildHistoryEntries({ checkIn, saved });
  assert.deepEqual(
    newerCheckIn.map((e) => e.kind),
    ["current_state_check_in", "saved_result"],
  );

  const newerSaved = buildHistoryEntries({
    checkIn,
    saved: { ...saved, savedAt: "2026-08-13T09:00:00.000Z" },
  });
  assert.deepEqual(
    newerSaved.map((e) => e.kind),
    ["saved_result", "current_state_check_in"],
  );
});

test("headlines are the person's own words, not generated prose", () => {
  const [entry] = buildHistoryEntries({ checkIn, saved: null });
  assert.equal(entry.headline, `${labelForState("heavy")}。${labelForIntent("rest")}。`);
  assert.equal(entry.detail, null, "no interpretation is attached to a check-in");

  const [result] = buildHistoryEntries({ checkIn: null, saved });
  assert.equal(result.headline, saved.resultLabel, "the approved label, verbatim");
  assert.equal(result.detail, saved.recognitionLine);
});

test("nothing is summarised ACROSS entries", () => {
  // "最近すこし重い日が続いています" is a claim about a sequence. The model has no vocabulary for
  // one, and must not grow one here.
  for (const forbidden of ["最近", "続いて", "傾向", "trend", "summar", "average", "streak"]) {
    assert.ok(!code.includes(forbidden), `history must not interpret a sequence: ${forbidden}`);
  }
});

test("no history is an empty list, never a placeholder entry", () => {
  assert.deepEqual(buildHistoryEntries({ checkIn: null, saved: null }), []);
});

test("day labels are calendar days, not elapsed milliseconds", () => {
  // Something recorded at 23:50 is 昨日 by breakfast. Dividing elapsed time would still call it 今日.
  const lateLastNight = new Date(2026, 7, 11, 23, 50).toISOString();
  const thisMorning = new Date(2026, 7, 12, 8, 0);
  assert.equal(relativeDayLabel(lateLastNight, thisMorning), "昨日");

  assert.equal(relativeDayLabel(new Date(2026, 7, 12, 1, 0).toISOString(), thisMorning), "今日");
  assert.equal(relativeDayLabel(new Date(2026, 7, 9, 12, 0).toISOString(), thisMorning), "3日前");
  assert.equal(relativeDayLabel(new Date(2026, 7, 1, 12, 0).toISOString(), thisMorning), "1週間前");
  assert.equal(relativeDayLabel(new Date(2026, 4, 1, 12, 0).toISOString(), thisMorning), "しばらく前");

  // A future timestamp (clock skew, edited record) must not produce "-1日前".
  assert.equal(relativeDayLabel(new Date(2026, 7, 20, 12, 0).toISOString(), thisMorning), "今日");
});

test("an unreadable timestamp yields no label and does not break the order", () => {
  assert.equal(relativeDayLabel("not-a-date", new Date()), null);
  const entries = buildHistoryEntries({
    checkIn: { ...checkIn, completedAt: "not-a-date" },
    saved,
  });
  assert.equal(entries.length, 2);
  assert.equal(entries[0].kind, "saved_result", "a readable timestamp sorts ahead of a broken one");
});

test("the read model only reads — it never writes storage", () => {
  for (const forbidden of ["localStorage", "setItem", "dispatchEvent", "fetch(", "/api/"]) {
    assert.ok(!code.includes(forbidden), `presentation must not touch storage: ${forbidden}`);
  }
});
