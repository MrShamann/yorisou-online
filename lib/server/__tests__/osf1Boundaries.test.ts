import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { BOUNDARY_RULES, RECORD_KINDS } from "@/lib/life-os/boundaries";
import { PROHIBITED_ABSOLUTE_VISIBILITY_CLAIMS } from "@/lib/life-os/privacyCopy";

// OSF-1 final hardening — the two invariants that are promises rather than mechanisms.
//
// Both of these were true when written and neither is enforced by a type or a constraint. That is
// exactly the kind of property that decays: the next person to touch these files has no way to know
// the sentence they are about to write was ruled out on purpose. So the ruling out is a test.

const LIFE_OS_SOURCES = ["lib/life-os", "lib/server/lifeOs", "app/life", "app/api/life-os"];
const ASSESSMENT_MODULES = [
  "canonicalPrivateState",
  "assessmentAttemptStore",
  "currentStateCheckV1",
  "yorisou_assessment_results",
  "yorisou_test_results",
];

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...sourceFiles(full));
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

/** Code with comments stripped — the boundary is documented by naming the things it forbids. */
function codeOnly(source: string): string {
  return source
    .split("\n")
    .filter((line) => !/^\s*(\/\/|\*|\/\*)/.test(line))
    .join("\n");
}

test("the boundary is stated as data, and the three rules are all present", () => {
  assert.equal(RECORD_KINDS.imairoResult.definition, "assessment methodology output");
  assert.equal(RECORD_KINDS.currentStateRecord.definition, "temporal daily life state");
  assert.deepEqual([...BOUNDARY_RULES], ["no_auto_convert", "no_overwrite", "no_replace"]);
});

test("no Life OS module reads the assessment methodology stores", () => {
  // The no-auto-convert rule, enforced in the direction that would actually be written: someone
  // "enriching" the Life OS surfaces with the person's last result.
  const offenders: string[] = [];
  for (const dir of LIFE_OS_SOURCES) {
    for (const file of sourceFiles(dir)) {
      // boundaries.ts NAMES both sides as data — it is the declaration of the boundary, not a
      // consumer of either side. Everything else in these trees must stay on its own side.
      if (file.endsWith("boundaries.ts")) continue;
      const code = codeOnly(readFileSync(file, "utf8"));
      for (const name of ASSESSMENT_MODULES) {
        if (code.includes(name)) offenders.push(`${file} references ${name}`);
      }
    }
  }
  assert.deepEqual(
    offenders,
    [],
    "a Life OS module reached into the assessment methodology stores. A CurrentStateRecord and an " +
      "Imairo Result must never auto-convert, overwrite or replace each other — see " +
      `lib/life-os/boundaries.ts.\n  ${offenders.join("\n  ")}`,
  );
});

test("the current-state table holds no methodology identity", () => {
  // The other direction, at the schema: a result id or a method column on this table would make the
  // conversion possible before anyone wrote the code to do it.
  const migration = readFileSync("supabase/migrations/202608140001_osf1_life_os_foundation.sql", "utf8");
  const table = /create table if not exists public\.yorisou_current_state_records \(([\s\S]*?)\n\);/.exec(migration);
  assert.ok(table, "yorisou_current_state_records is not defined where expected");
  for (const forbidden of ["result_id", "method_id", "method_version", "scoring_version", "archetype", "persona", "score"]) {
    assert.ok(
      !new RegExp(`\\b${forbidden}\\b`).test(table[1]),
      `yorisou_current_state_records declares '${forbidden}' — that is methodology identity, and it ` +
        "does not belong on a temporal daily state record",
    );
  }
});

test("the boundary is documented where a maintainer will actually be standing", () => {
  // Not "documented somewhere" — documented in the files someone edits when they are about to break
  // it. Each must name the Imairo/assessment side explicitly, not only DCI-1.
  const required: Array<[string, RegExp]> = [
    ["supabase/migrations/202608140001_osf1_life_os_foundation.sql", /NOT AN IMAIRO RESULT/],
    ["lib/life-os/contract.ts", /NOT an Imairo Result/],
    ["lib/server/lifeOs/store.ts", /not a methodology result/],
    ["lib/life-os/boundaries.ts", /never auto-convert, overwrite, or replace each other/i],
  ];
  for (const [file, pattern] of required) {
    assert.match(readFileSync(file, "utf8"), pattern, `${file} no longer states the boundary`);
  }
});

test("no surface claims absolute user-only visibility", () => {
  // 「あなただけが見られます」 was shipped on five surfaces and is not true: trustFlags() routes a
  // PRIVATE card containing 診断/治療 to moderation_status 'limited', and moderationQueue() serves
  // limited cards to operators with select=*. The honest claim is about other USERS.
  const offenders: string[] = [];
  for (const dir of [...LIFE_OS_SOURCES, "app/experiences", "app/today"]) {
    for (const file of sourceFiles(dir)) {
      if (file.endsWith("privacyCopy.ts")) continue; // the list itself lives there
      const source = readFileSync(file, "utf8");
      for (const claim of PROHIBITED_ABSOLUTE_VISIBILITY_CLAIMS) {
        if (source.includes(claim)) offenders.push(`${file}: ${claim}`);
      }
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `these surfaces promise absolute user-only visibility, which the product does not provide. Use ` +
      `the constants in lib/life-os/privacyCopy.ts.\n  ${offenders.join("\n  ")}`,
  );
});

test("the private-visibility copy says what is true and explains internal access separately", () => {
  const copy = readFileSync("lib/life-os/privacyCopy.ts", "utf8");
  // The claim that IS true must be about other users specifically.
  assert.match(copy, /ほかの利用者に表示されることはありません/);
  // And internal handling must be its own sentence, not a parenthetical inside the reassurance.
  assert.match(copy, /export const INTERNAL_HANDLING/);
  assert.match(copy, /export const SAFETY_REVIEW_TRIGGER/);
  // The experience wording must carry the trigger; the Life OS wording must not claim more than it can.
  const experienceForm = readFileSync("app/life/experience/ExperienceForm.tsx", "utf8");
  assert.match(experienceForm, /EXPERIENCE_PRIVACY/, "the experience form must use the wording that names the safety-review trigger");
});
