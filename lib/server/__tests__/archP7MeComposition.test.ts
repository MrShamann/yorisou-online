import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

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

// ═══════════════════════════════════════════════════════════════════════════
// THE FIVE-PART COMPOSITION — screen 17
// ═══════════════════════════════════════════════════════════════════════════
//
// The reference architecture §4 states what Me is: "a composition surface, never a second profile
// database. It shows, separately: current state · Imairo · user-confirmed durable context ·
// Yorisou observations/patterns · user-confirmed values." Screen 17 lists its writes as "—".
// These tests hold the implementation to that sentence rather than to a nicer paraphrase of it.

test("D. the five parts are exactly what the reference architecture names, in its order", async () => {
  const { ME_COMPOSITION_PARTS, ME_DEFERRED_PARTS } = await import("@/lib/platform/meComposition");
  assert.deepEqual([...ME_COMPOSITION_PARTS], [
    "current_state",
    "assessment_recognition",
    "confirmed_durable_context",
    "observations",
    "confirmed_values",
  ]);
  // Observations/patterns is a V1.5 capability (Pattern Detail, screen 13). It is declared
  // deferred rather than implemented, and rather than reported as "you have none".
  assert.deepEqual([...ME_DEFERRED_PARTS], ["observations"]);
});

test("D. a malformed composition is refused before it can reach a surface", async () => {
  const { assertCompositionShape } = await import("@/lib/platform/meComposition");
  const ok = {
    owner_ref: "acct",
    parts: [
      { part: "current_state" as const, state: "present" as const, reference: { ref: "r", at: "2026-08-20T00:00:00Z" } },
      { part: "assessment_recognition" as const, state: "absent" as const, reference: null },
      { part: "confirmed_durable_context" as const, state: "not_ready" as const, reference: null },
      { part: "observations" as const, state: "deferred" as const, reference: null },
      { part: "confirmed_values" as const, state: "absent" as const, reference: null },
    ],
  };
  assert.doesNotThrow(() => assertCompositionShape(ok));
  assert.throws(() => assertCompositionShape({ ...ok, owner_ref: "" }), /me_owner_required/);
  // A dropped part silently removes a piece of someone's picture; a doubled one shows it twice.
  assert.throws(() => assertCompositionShape({ ...ok, parts: ok.parts.slice(0, 4) }), /me_incomplete_composition/);
  assert.throws(
    () => assertCompositionShape({ ...ok, parts: [...ok.parts, ok.parts[0]] }),
    /me_duplicate_part/,
  );
  // "Present" without a reference is a claim with nothing behind it.
  assert.throws(
    () => assertCompositionShape({ ...ok, parts: [{ ...ok.parts[0], reference: null }, ...ok.parts.slice(1)] }),
    /me_present_without_reference/,
  );
  // And a deferred capability must never be reported as anything else.
  assert.throws(
    () => assertCompositionShape({
      ...ok,
      parts: ok.parts.map((p) => (p.part === "observations" ? { ...p, state: "absent" as const } : p)),
    }),
    /me_deferred_part_claimed/,
  );
});

test("D. one unreadable module yields not_ready for ITS part and blanks nothing else", async () => {
  const { composeMe } = await import("@/lib/server/platform/meComposition/service");
  const composition = await composeMe("acct-a", {
    current_state: async () => ({ ref: "s1", at: "2026-08-20T00:00:00Z" }),
    assessment_recognition: async () => { throw new Error("transport exploded"); },
    confirmed_durable_context: async () => null,
    confirmed_values: async () => ({ ref: "v1", at: "2026-08-19T00:00:00Z" }),
  });
  const state = (id: string) => composition.parts.find((p) => p.part === id)?.state;
  assert.equal(state("current_state"), "present", "a healthy part was lost to another part's failure");
  assert.equal(state("assessment_recognition"), "not_ready");
  // "You have none" and "we could not read it" are different sentences to a person.
  assert.equal(state("confirmed_durable_context"), "absent");
  assert.equal(state("confirmed_values"), "present");
  assert.equal(state("observations"), "deferred");
});

test("D. a deferred part is never asked, even if a reader is wired to it", async () => {
  const { composeMe } = await import("@/lib/server/platform/meComposition/service");
  let asked = false;
  const composition = await composeMe("acct-a", {
    observations: async () => { asked = true; return { ref: "p1", at: "2026-08-20T00:00:00Z" }; },
  });
  assert.equal(asked, false, "wiring a reader to observations quietly turned on a V1.5 capability");
  assert.equal(composition.parts.find((p) => p.part === "observations")?.state, "deferred");
});

test("D. a part with no reader is not_ready, never silently absent", async () => {
  const { composeMe } = await import("@/lib/server/platform/meComposition/service");
  const composition = await composeMe("acct-a", {});
  for (const part of composition.parts) {
    assert.equal(part.state, part.part === "observations" ? "deferred" : "not_ready");
  }
});

// ─── the composition is a read, and owns nothing ───────────────────────────

test("E. Me stores nothing — there is no second profile database", () => {
  for (const file of [
    "lib/platform/meComposition.ts",
    "lib/server/platform/meComposition/service.ts",
    "lib/server/me/composition.ts",
    "app/me/MeComposition.tsx",
  ]) {
    const source = code(file);
    for (const forbidden of [
      /method:\s*"POST"/, /method:\s*"PATCH"/, /method:\s*"PUT"/, /method:\s*"DELETE"/,
      /insert into/i, /\brpc\(/, /create table/i,
    ]) {
      assert.ok(!forbidden.test(source), `${file} writes something (${forbidden}) — Me is a read`);
    }
  }
  // The execution plan's non-goal for P7 is "no new profile storage", and that is what this
  // asserts — NOT an absolute migration count. Pinning a count breaks on any unrelated migration
  // and says nothing about profiles; the same brittleness pinned CPR-1 as "the newest file" and
  // turned every legitimate successor into a failure.
  const ddl = execSync("cat supabase/migrations/*.sql", { encoding: "utf8" });
  for (const shape of [
    /create table[^;]*yorisou_me_/i,
    /create table[^;]*_profiles?\b/i,
    /create table[^;]*me_composition/i,
  ]) {
    assert.ok(!shape.test(ddl), `a profile-shaped table entered the lineage (${shape}) — Me stores nothing`);
  }
  // And no migration persists a composition: the parts are resolved at read time, every time.
  assert.ok(!/yorisou_me_composition/i.test(ddl), "the composition was given storage");
});

test("E. the platform tier stays brand-free", () => {
  for (const file of ["lib/platform/meComposition.ts", "lib/server/platform/meComposition/service.ts"]) {
    const source = code(file);
    for (const forbidden of [/yorisou_/, /imairo/i, /supabase/i]) {
      assert.ok(!forbidden.test(source), `${file} names a product concern (${forbidden})`);
    }
  }
});

test("E. the composition carries references, never content", () => {
  const contract = code("lib/platform/meComposition.ts");
  // A field for a title, a summary, a sentence or a score is how a composition becomes a copy.
  for (const forbidden of [/\btitle\b/, /\bsummary\b/, /\bcontent\b/, /\bbody\b/, /\bscore\b/, /answers/]) {
    assert.ok(!forbidden.test(contract), `MePart gained a content field (${forbidden})`);
  }
  assert.match(contract, /export interface MePartReference \{\s*ref: string;\s*at: string;\s*\}/);
});

// ─── each part is read through the module that owns it ─────────────────────

test("F. every part delegates to its owning module, not to a table", () => {
  const source = code("lib/server/me/composition.ts");
  // The mapping file may name modules; it may not reach past them into storage.
  for (const forbidden of [/yorisou_[a-z_]+\?/, /rest\/v1/, /URLSearchParams/, /fetch\(/]) {
    assert.ok(!forbidden.test(source), `the composition reaches past a module into storage (${forbidden})`);
  }
  assert.match(source, /latestCurrentStateRecord/, "current state must come from state.core");
  assert.match(source, /listSavedTestResultsForOwner/, "Imairo must come from the assessment read");
  assert.match(source, /listEligibleMemories/, "durable context must come from the Kernel memory read");
  assert.match(source, /listValuesAssessmentsForOwner/, "values must come from the values read");
});

test("F. durable context uses the ELIGIBLE memory read, so a withdrawn memory cannot reappear", () => {
  const source = code("lib/server/me/composition.ts");
  assert.match(source, /listEligibleMemories/);
  // listMemories returns every memory regardless of lifecycle. Using it here would surface a
  // memory someone suppressed or revoked back into the picture they are shown of themselves.
  assert.ok(!/listMemories\(/.test(source), "the composition reads memory without respecting lifecycle");
  assert.ok(!/listMemoryPage\(/.test(source), "the composition uses the management read");
});

test("F. values means user-CONFIRMED values, and Imairo follows the method contract", () => {
  const source = code("lib/server/me/composition.ts");
  assert.match(source, /confirmation === "confirmed"/,
    "an assessment marked not_quite or skipped is not something a person confirmed");
  // The STORED id, from the constant the writer uses — not the method id, and not a literal.
  // These are different identifiers by design and matching the wrong one returns "no Imairo"
  // forever, which is indistinguishable from a person never having taken it.
  assert.match(source, /IMAIRO_SNAPSHOT_TEST_ID/,
    "the Imairo id must come from the snapshot constant the writer uses");
  for (const literal of [/"IMAIRO-120Q"/, /"imairo-120q"/]) {
    assert.ok(!literal.test(source), `the id is hard-coded (${literal}) — it would drift from the writer`);
  }
});

// ─── Data & Memory alignment — screen 18 ───────────────────────────────────

test("G. every memory read and write goes through the Kernel store", () => {
  const hits = execSync(
    "grep -rln 'yorisou_explicit_memories' app lib --include=*.ts --include=*.tsx 2>/dev/null || true",
    { encoding: "utf8" },
  ).split("\n").filter(Boolean).filter((f) => f !== "lib/server/lifeOs/store.ts" && !f.includes("__tests__"));
  // Two files mention the table name only inside prose explaining a database constraint; a real
  // query would also carry a request. That is what this checks for.
  for (const file of hits) {
    const source = code(file);
    assert.ok(
      !/yorisou_explicit_memories\?/.test(source) && !/from\(["']yorisou_explicit_memories/.test(source),
      `${file} queries the memory table directly instead of going through the Kernel store`,
    );
  }
});

test("G. memory receipts and audit are read through their owned function", () => {
  const receipts = code("app/api/life/memories/receipts/route.ts");
  assert.match(receipts, /memoryDeletionReceipts\(/);
  assert.ok(!/yorisou_memory_deletion_receipts\?/.test(receipts));
});

// ─── the surface ───────────────────────────────────────────────────────────

test("H. わたし composes only for a signed-in viewer, from one access resolution", () => {
  const page = code("app/me/page.tsx");
  assert.match(page, /const access = await resolveLifeOsRouteAccess\(\)/,
    "the gate and the viewer must come from ONE authority");
  assert.ok(!/lifeOsVisibleInNavigation/.test(page), "a second, independent gate resolution returned");
  assert.match(page, /lifeOsOpen && accountId \? <MeComposition/,
    "the composition must render only for a signed-in viewer inside the gate");
  // The device-local history a signed-out visitor sees must survive untouched.
  assert.match(page, /<MyContinuity \/>/);
});

test("H. the surface points at the owning module and does not restate its content", () => {
  const surface = code("app/me/MeComposition.tsx");
  // No counts, no completeness meter — a screen that scores how filled-in someone is can make them
  // feel behind on themselves.
  for (const forbidden of [/\.length\}/, /件/, /\d+ *\/ *5/, /percent/i, /progress/i]) {
    assert.ok(!forbidden.test(surface), `わたし grew a metric (${forbidden})`);
  }
  // Every non-deferred part has somewhere to go.
  for (const part of ["current_state", "assessment_recognition", "confirmed_durable_context", "confirmed_values"]) {
    assert.ok(new RegExp(`${part}:\\s*"/`).test(surface), `${part} has no route to its owning surface`);
  }
});
