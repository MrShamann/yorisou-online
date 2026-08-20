import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// ARCH-P7 — わたし is composed from module reads.
//
// P7's canonical scope (execution plan §P7) is "Me composition + Data & Memory alignment on module
// reads", depending on P2 and P6. Those dependencies are the whole point: P2 put current state
// behind state.core and P6 put "what happened, in order" behind continuity.core, so the remaining
// gap is that わたし was still answering that second question a second time, on its own.
//
// The invariant these tests protect is not "the composition is tidy" but "わたし and the timeline
// cannot disagree" — because the visible failure is a person being offered something the rest of
// the product has already stopped showing them.

const read = (path: string) => readFileSync(path, "utf8");
const code = (path: string) =>
  read(path).replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");

function bodyOf(source: string, signature: string): string {
  const start = source.indexOf(signature);
  assert.ok(start > 0, `${signature} is missing`);
  return source.slice(start, source.indexOf("\n}", start));
}

// ─── the composition reads the module, not the stores ───────────────────────

test("A. the return view composes from continuity.core, not from the source stores", () => {
  const timeline = code("lib/server/lifeOs/timeline.ts");
  const body = bodyOf(timeline, "export async function lifeReturnView(");

  // Exactly one legacy call, and only as the not-yet-migrated branch — the same rule the paginated
  // reader follows, for the same reason.
  assert.equal((body.match(/legacyAggregatedReturnView\(/g) ?? []).length, 1,
    "the composed return view reaches for the direct read more than once");
  assert.match(body, /if \(!continuitySchemaReady\(\)\) return legacyAggregatedReturnView/,
    "the direct read must be reachable ONLY as the pre-migration branch");

  // And it must not have regrown its own aggregation.
  for (const forbidden of [/listReflections\(/, /listGoals\(/, /ownExperiences\(/]) {
    assert.ok(!forbidden.test(body),
      `lifeReturnView reads a source store directly (${forbidden}) — that is the divergence P7 removes`);
  }
  assert.match(body, /newestOfFamily</, "the composed return view does not read the continuity index");
});

test("A. the return selection asks the index for the most recent state too", () => {
  const timeline = code("lib/server/lifeOs/timeline.ts");
  const body = bodyOf(timeline, "export async function lifeReturnSelection(");
  assert.match(body, /newestOfFamily<CurrentStateRecord>/,
    "the most recent state is still derived outside the module that owns it");
  assert.match(body, /continuitySchemaReady\(\)/,
    "the state read must respect the same migration boundary as everything else");
});

test("A. the index answers WHICH and WHEN; the policy stays in the composition", () => {
  const timeline = code("lib/server/lifeOs/timeline.ts");
  const body = bodyOf(timeline, "export async function lifeReturnView(");
  // `status` is a fact about a goal, not about a moment, and putting it in the index would make the
  // index a copy of the record. Directions are hydrated and then filtered, exactly as before.
  assert.match(body, /goals\.find\(\(goal\) => goal\.status === "active"\)/,
    "the active-direction policy left the composition");
  // The projection has its OWN lifecycle status (active / invalidated) and that is not what this
  // guards against — it guards against the index learning facts that belong to the record.
  const projection = code("lib/platform/continuityCore.ts");
  for (const forbidden of [/goal_status/, /GoalStatus/, /"archived"/, /\btitle\b/, /\bdescription\b/]) {
    assert.ok(!forbidden.test(projection),
      `the projection contract absorbed a fact about the record (${forbidden}) — the index answers WHICH and WHEN only`);
  }
});

// ─── Data & Memory alignment ────────────────────────────────────────────────

test("B. memory is not, and cannot become, part of the Me composition", () => {
  const timeline = code("lib/server/lifeOs/timeline.ts");
  for (const fn of ["export async function lifeReturnView(", "export async function lifeReturnSelection("]) {
    const body = bodyOf(timeline, fn);
    assert.ok(!/listEligibleMemories\(|listMemories\(|listMemoryPage\(/.test(body),
      `${fn} reads memory — a memory is a standing note with its own lifecycle controls, not something that happened at a moment`);
  }
  // The structural reason it cannot leak in: continuity has no memory family, so an index-backed
  // composition has no way to surface one.
  const contract = code("lib/platform/continuityCore.ts");
  const families = /CONTINUITY_SOURCE_FAMILIES = \[([\s\S]*?)\]/.exec(contract)?.[1] ?? "";
  assert.ok(!/memory/i.test(families), "memory became a continuity family — the timeline excludes it deliberately");
});

test("B. the memory surface keeps its own bounded, paged read", () => {
  // Alignment does NOT mean routing memory through continuity. It means memory keeps the one
  // bounded read that owns it, rather than each surface inventing its own — the bulk-read
  // prohibition in Personal_Archive_and_Memory_Governance §4 is why the cap exists at all.
  const store = code("lib/server/lifeOs/store.ts");
  assert.match(store, /export async function listMemoryPage\(/, "the paged memory read is gone");
  for (const surface of ["app/life/memories/page.tsx", "app/api/life/memories/route.ts"]) {
    const source = code(surface);
    assert.match(source, /listMemoryPage\(/, `${surface} no longer reads memory through the paged read`);
    assert.ok(!/yorisou_explicit_memories/.test(source),
      `${surface} reaches past the store into the memory table`);
  }
});

// ─── nothing visible changed ────────────────────────────────────────────────

test("C. the return contract and its cap are unchanged", () => {
  const timeline = read("lib/server/lifeOs/timeline.ts");
  assert.match(timeline, /export const RETURN_MAX_ITEMS = 3;/, "the three-item cap moved");
  for (const kind of [
    "unfinished_reflection", "deep_reflection", "active_direction", "recent_experience", "recent_state",
  ]) {
    assert.ok(timeline.includes(`kind: "${kind}"`), `the ${kind} return item disappeared`);
  }
  // No metric, no streak, no score entered the composition on the way through the module.
  const body = code("lib/server/lifeOs/timeline.ts");
  for (const forbidden of [/streak/i, /\bscore\b/i, /completionRate/i, /daysSince/i]) {
    assert.ok(!forbidden.test(body), `the composition grew a metric (${forbidden}) — the register forbids it`);
  }
});

test("C. P7 added no profile storage", () => {
  // The execution plan's non-goal for P7 is "no new profile storage". わたし is composed at read
  // time from modules that already own the records; nothing about a person is stored to make it.
  const timeline = read("lib/server/lifeOs/timeline.ts");
  for (const forbidden of [/yorisou_profiles/, /yorisou_me_/, /insert into/i]) {
    assert.ok(!forbidden.test(timeline), `the Me composition writes something (${forbidden})`);
  }
});
