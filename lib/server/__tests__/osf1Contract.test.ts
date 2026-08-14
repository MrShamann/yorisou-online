import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  GOAL_STATUSES,
  LifeOsInputError,
  MEMORY_TYPES,
  PREFERENCE_KEYS,
  REFLECTION_FIELDS,
  REFLECTION_QUESTIONS,
  STATE_TAG_VOCABULARY,
  currentStateTagsFromCheckIn,
  parseCurrentStateInput,
  parseGoalInput,
  parseReflectionInput,
} from "@/lib/life-os/contract";

// OSF-1 — the Phase 1 domain contract, and its agreement with the database.
//
// The SQL RPCs validate the same things independently, which is deliberate: an application-only
// check is a check the next caller skips. Duplication is only safe while the two copies agree, so
// the drift tests below read the migration file and compare.

const MIGRATION = readFileSync("supabase/migrations/202608140001_osf1_life_os_foundation.sql", "utf8");
// The OSF-1 schema is spread across four migrations now, and a later one can widen what an earlier
// one constrained. Any test asking "what does the schema allow" must read the whole lineage, or it
// asserts against a constraint that no longer exists in the database.
const OSF1_MIGRATIONS = [
  "202608140001_osf1_life_os_foundation",
  "202608140002_osf1_erasure_plan_registration",
  "202608150001_osf1_life_os_audit_events",
  "202608150002_osf1_reflection_five_question_flow",
  "202608160001_osf1_phase1_completion",
].map((name) => readFileSync(`supabase/migrations/${name}.sql`, "utf8")).join("\n");

// ── vocabularies: TypeScript vs SQL ──────────────────────────────────────────

test("the state vocabulary is the Today check-in's own options, and SQL agrees", () => {
  // Not a second list maintained by hand — derived from STATE_OPTIONS/INTENT_OPTIONS.
  assert.deepEqual([...STATE_TAG_VOCABULARY], [
    "unsettled",
    "busy-mind",
    "heavy",
    "steady",
    "unsure",
    "rest",
    "sort-out",
    "shift",
    "understand",
    "undecided",
  ]);

  const body = /function public\.yorisou_osf1_state_vocabulary\(\)[\s\S]*?\$\$;/.exec(MIGRATION);
  assert.ok(body, "yorisou_osf1_state_vocabulary is not defined in the migration");
  const sqlValues = [...body[0].matchAll(/'([a-z-]+)'/g)].map((match) => match[1]);
  assert.deepEqual(
    sqlValues.sort(),
    [...STATE_TAG_VOCABULARY].sort(),
    "the SQL state vocabulary and the TypeScript one have drifted apart",
  );
});

test("the goal statuses in SQL match the ones the UI can send", () => {
  const constraint = /yorisou_goals_status_chk check \(status in \(([^)]*)\)\)/.exec(MIGRATION);
  assert.ok(constraint, "the goal status check constraint is missing");
  const sqlValues = [...constraint[1].matchAll(/'([a-z_]+)'/g)].map((match) => match[1]);
  assert.deepEqual(sqlValues.sort(), [...GOAL_STATUSES].sort());
  // The doctrine constraint, asserted rather than described.
  assert.ok(!GOAL_STATUSES.includes("failed" as never), "a goal must not be able to fail");
  assert.ok(!GOAL_STATUSES.includes("overdue" as never), "a goal must not be able to be overdue");
});

test("the memory types in SQL match the vocabulary Phase 1 allows", () => {
  // The LAST definition wins: 202608160001 drops the original constraint and re-adds it widened with
  // `lesson`. Matching the first occurrence would assert against a constraint the database no longer
  // has — the failure mode this test exists to catch, pointed the wrong way.
  const matches = [...OSF1_MIGRATIONS.matchAll(
    /yorisou_explicit_memories_type_chk[\s\S]{0,160}?check \(memory_type in \(([^)]*)\)\)/g,
  )];
  assert.ok(matches.length > 0, "the memory type check constraint is missing");
  const effective = matches[matches.length - 1];
  const sqlValues = [...effective[1].matchAll(/'([a-z_]+)'/g)].map((match) => match[1]);
  assert.deepEqual(sqlValues.sort(), [...MEMORY_TYPES].sort());
  assert.ok(sqlValues.includes("lesson"), "a lesson is what a reflection most often produces");
});

test("the preference allowlist in SQL matches the one the client offers", () => {
  const rpc = /function public\.yorisou_osf1_user_context_upsert[\s\S]*?\$\$;/.exec(MIGRATION);
  assert.ok(rpc, "the user-context RPC is missing");
  const allowlist = /v_key not in \(([^)]*)\)/.exec(rpc[0]);
  assert.ok(allowlist, "the preference-key allowlist is missing from the RPC");
  const sqlValues = [...allowlist[1].matchAll(/'([a-z_]+)'/g)].map((match) => match[1]);
  assert.deepEqual(sqlValues.sort(), [...PREFERENCE_KEYS].sort());
});

test("an unconfirmed memory row is structurally impossible, not merely discouraged", () => {
  assert.match(
    MIGRATION,
    /yorisou_explicit_memories_confirmed_chk check \(user_confirmed = true\)/,
    "the check constraint that makes confirmation structural is missing",
  );
});

// ── input validation ─────────────────────────────────────────────────────────

test("current-state input accepts the Today check-in's two choices", () => {
  const parsed = parseCurrentStateInput({
    stateTags: currentStateTagsFromCheckIn("heavy", "rest"),
    source: "today_check_in",
  });
  assert.deepEqual(parsed.stateTags, ["heavy", "rest"]);
  assert.equal(parsed.source, "today_check_in");
  assert.equal(parsed.mood, null);
  assert.equal(parsed.situation, null);
});

test("current-state input refuses anything outside the bounded vocabulary", () => {
  assert.throws(() => parseCurrentStateInput({ stateTags: ["burnt-out"], source: "manual" }), LifeOsInputError);
  assert.throws(() => parseCurrentStateInput({ stateTags: [], source: "manual" }), LifeOsInputError);
  assert.throws(() => parseCurrentStateInput({ stateTags: ["heavy", "heavy"], source: "manual" }), LifeOsInputError);
  assert.throws(
    () => parseCurrentStateInput({ stateTags: ["heavy"], mood: "diagnosed", source: "manual" }),
    LifeOsInputError,
  );
  assert.throws(() => parseCurrentStateInput({ stateTags: ["heavy"], source: "line_webhook" }), LifeOsInputError);
  // Six tags is over the cap.
  assert.throws(
    () => parseCurrentStateInput({ stateTags: [...STATE_TAG_VOCABULARY].slice(0, 6), source: "manual" }),
    LifeOsInputError,
  );
});

test("current-state free text is trimmed and bounded", () => {
  const parsed = parseCurrentStateInput({ stateTags: ["steady"], situation: "  会議のあと  ", source: "manual" });
  assert.equal(parsed.situation, "会議のあと");
  assert.equal(parsed.reflection, null);
  assert.throws(
    () => parseCurrentStateInput({ stateTags: ["steady"], situation: "あ".repeat(501), source: "manual" }),
    LifeOsInputError,
  );
});

test("a goal needs a title and nothing else", () => {
  assert.deepEqual(parseGoalInput({ title: "  ひとりの時間をつくる  " }), {
    title: "ひとりの時間をつくる",
    description: null,
  });
  assert.throws(() => parseGoalInput({ description: "説明だけ" }), LifeOsInputError);
  assert.throws(() => parseGoalInput({ title: "   " }), LifeOsInputError);
  assert.throws(() => parseGoalInput({ title: "あ".repeat(121) }), LifeOsInputError);
});

test("the light reflection asks five questions, only the first required", () => {
  // The default flow is the light one. The seven-question postmortem still exists as a second mode
  // (see osf1Activation.test.ts) — REFLECTION_QUESTIONS is the light set, not the only set.
  assert.equal(REFLECTION_QUESTIONS.length, 5, "the light reflection is five questions");
  assert.equal(REFLECTION_QUESTIONS.filter((question) => question.required).length, 1);
  assert.equal(REFLECTION_QUESTIONS[0].fields[0].field, "what_happened");
  assert.deepEqual(REFLECTION_QUESTIONS.flatMap((q) => q.fields.map((f) => f.field)), [
    "what_happened", "felt", "tried", "what_followed", "next_time",
  ]);
  // REFLECTION_FIELDS is the storage contract — the union of both modes, deduped, one column each.
  assert.equal(REFLECTION_FIELDS.length, new Set(REFLECTION_FIELDS.map((e) => e.field)).size);
  assert.equal(REFLECTION_FIELDS.filter((entry) => entry.required).length, 1);
  for (const field of ["what_happened", "felt", "tried", "goal_at_the_time", "options_considered"]) {
    assert.ok(REFLECTION_FIELDS.some((e) => e.field === field), `${field} must be storable`);
  }
  // `why` and `what_learned` are RETAINED COLUMNS, not contract fields: no flow asks them any more,
  // but rows written by the earlier flow hold them and nothing may drop them.
  for (const retained of ["why", "what_learned"]) {
    assert.ok(!REFLECTION_FIELDS.some((e) => e.field === retained), `${retained} is no longer asked`);
    assert.match(OSF1_MIGRATIONS, new RegExp(`\\n  ${retained} text`), `${retained} column must survive`);
  }
});

test("a reflection saves with only the first answer", () => {
  const parsed = parseReflectionInput({ what_happened: "  説明がうまくいかなかった  " });
  assert.equal(parsed.what_happened, "説明がうまくいかなかった");
  assert.equal(parsed.felt, null);
  assert.equal(parsed.tried, null);
  assert.equal(parsed.next_time, null);
  assert.equal(parsed.experienceId, null);
});

test("a reflection without the first answer is refused", () => {
  assert.throws(() => parseReflectionInput({ what_learned: "気づいたことだけ" }), LifeOsInputError);
  assert.throws(() => parseReflectionInput({ what_happened: "  " }), LifeOsInputError);
});

test("every reflection column named in the contract exists in the migrations", () => {
  // `felt` and `tried` were added by 202608150002 for the five-question flow, so the columns are
  // spread across two migrations and both must be searched.
  const all = OSF1_MIGRATIONS;
  for (const entry of REFLECTION_FIELDS) {
    assert.ok(
      new RegExp(`\\n  ${entry.field} text`).test(all) ||
        new RegExp(`add column if not exists ${entry.field} text`).test(all),
      `yorisou_life_reflections has no column ${entry.field}`,
    );
  }
});
