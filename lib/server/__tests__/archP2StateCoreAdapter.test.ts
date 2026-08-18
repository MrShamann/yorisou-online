// ARCH-P2 — the state.core boundary, proven rather than described.
//
// What must stay true, forever, about this boundary:
//
//   A. one module boundary, TWO adapters with distinct provenance families — never a merged store;
//   B. no dual write: each adapter's import graph can reach exactly one persistence family;
//   C. DCI semantics pass through losslessly (local-date identity, versioned correction, governed
//      erasure — no generic update/delete exists to hide behind);
//   D. current-moment semantics pass through losslessly (create, record-specific annotation,
//      latest, bounded list);
//   E. normalized provenance names the family + record ref + capture time and NEVER the owner;
//   F. Today still resolves the current-moment family — no newly merged DCI+OSF "latest";
//   G. the ARCH-P1 seam is intact: persistence → completion event → single audit, unchanged;
//   H. adopted consumers import state persistence ONLY through the facade, with the timeline as
//      the one named continuity.core/P6 exception;
//   I. the platform contract stays brand-free and table-name-free;
//   J. the adapters contain no SQL and reference no migration — this package moves zero data.
//
// Follows the osf1Boundaries.test.ts tradition: invariants are asserted over data, fakes, and file
// contents, so drift fails a build instead of surviving review.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  bindCurrentMomentState,
  bindVersionedDailyState,
  currentMomentState,
  versionedDailyState,
  currentMomentProvenance,
  versionedDailyProvenance,
} from "@/lib/server/platform/stateCore";

const at = (...parts: string[]) => join(process.cwd(), ...parts);
const read = (...parts: string[]) => readFileSync(at(...parts), "utf8");

const OWNER = "acct_arch_p2_owner";

// ── A. one boundary, two families ───────────────────────────────────────────

test("two adapters, one module boundary, distinct provenance families", () => {
  assert.equal(currentMomentState.family, "current_moment");
  assert.equal(versionedDailyState.family, "versioned_daily");
  assert.notEqual(currentMomentState.family, versionedDailyState.family as string);
});

test("the facade exposes no dishonest generic lifecycle and no merged read", () => {
  const facade = read("lib", "server", "platform", "stateCore", "index.ts");
  for (const forbidden of ["updateState", "deleteState", "latestStateAcrossSources", "mergedState"]) {
    assert.ok(!facade.includes(forbidden), `facade must not export ${forbidden}`);
  }
});

// ── B. no dual write, by import graph ───────────────────────────────────────

test("each adapter can reach exactly one persistence family", () => {
  const daily = read("lib", "server", "platform", "stateCore", "dailyStateAdapter.ts");
  const current = read("lib", "server", "platform", "stateCore", "currentStateAdapter.ts");
  assert.ok(daily.includes('from "@/lib/server/dailyCheckInStore"'), "daily adapter binds the DCI store");
  assert.ok(!daily.includes("lifeOs/store"), "daily adapter must not reach the current-state store");
  assert.ok(current.includes('from "@/lib/server/lifeOs/store"'), "current adapter binds the OSF-1 store");
  assert.ok(!current.includes("dailyCheckInStore"), "current adapter must not reach the DCI store");
});

test("no adapter operation invokes both repositories (behavioral)", async () => {
  const touched: string[] = [];
  const daily = bindVersionedDailyState({
    createDailyRecord: async () => (touched.push("dci"), "id"),
    correctDailyRecord: async () => (touched.push("dci"), 2),
    deleteDailyRecord: async () => (touched.push("dci"), true),
    listDailyRecordsForOwner: async () => (touched.push("dci"), []),
    getDailyRecordForOwner: async () => (touched.push("dci"), null),
    ownerHasAnyDailyRecord: async () => (touched.push("dci"), false),
  });
  const current = bindCurrentMomentState({
    createCurrentStateRecord: async () => (touched.push("osf"), "id"),
    setCurrentStateReflection: async () => (touched.push("osf"), true),
    listCurrentStateRecords: async () => (touched.push("osf"), []),
    latestCurrentStateRecord: async () => (touched.push("osf"), null),
  });
  touched.length = 0;
  await daily.hasAny(OWNER);
  assert.deepEqual(touched, ["dci"], "a daily operation touches only the DCI repository");
  touched.length = 0;
  await current.latest(OWNER);
  assert.deepEqual(touched, ["osf"], "a current-moment operation touches only the OSF repository");
});

// ── C. DCI semantics preserved ──────────────────────────────────────────────

test("DCI create/correct/erase/reads map losslessly and stay local-date/version-specific", async () => {
  const calls: Array<{ fn: string; args: unknown[] }> = [];
  const record = (fn: string) => (...args: unknown[]) => {
    calls.push({ fn, args });
    return undefined as never;
  };
  const adapter = bindVersionedDailyState({
    createDailyRecord: async (input) => (calls.push({ fn: "create", args: [input] }), "rec-1"),
    correctDailyRecord: async (input) => (calls.push({ fn: "correct", args: [input] }), 3),
    deleteDailyRecord: async (owner, date) => (calls.push({ fn: "delete", args: [owner, date] }), true),
    listDailyRecordsForOwner: async (owner, since, limit) =>
      (calls.push({ fn: "list", args: [owner, since, limit] }), []),
    getDailyRecordForOwner: async (owner, date) => (calls.push({ fn: "get", args: [owner, date] }), null),
    ownerHasAnyDailyRecord: async (owner) => (calls.push({ fn: "hasAny", args: [owner] }), true),
  });
  void record;

  const createInput = {
    ownerAccountId: OWNER,
    methodVersion: "v1.2",
    schemaVersion: "s1",
    ackVersion: "a1",
    producedAt: "2026-08-18T01:02:03.000Z",
    entryLocalDate: "2026-08-18",
    timezone: "Asia/Tokyo",
    utcOffsetMinutes: 540,
    state: { q1: "calm", q2: null },
    memo: null,
    ackId: "ack-7",
  };
  assert.equal(await adapter.create(createInput), "rec-1");
  assert.deepEqual(calls[0], { fn: "create", args: [createInput] }, "create passes through unreshaped");

  const correctInput = {
    ownerAccountId: OWNER,
    entryLocalDate: "2026-08-18",
    producedAt: "2026-08-18T02:00:00.000Z",
    state: { q1: "steady", q2: null },
    memo: "corrected",
    ackId: "ack-8",
  };
  assert.equal(await adapter.correct(correctInput), 3, "correction resolves to the NEW VERSION number");
  assert.deepEqual(calls[1], { fn: "correct", args: [correctInput] }, "correction stays local-date-identified");

  assert.equal(await adapter.erase(OWNER, "2026-08-18"), true);
  assert.deepEqual(calls[2], { fn: "delete", args: [OWNER, "2026-08-18"] }, "erase stays governed local-date erasure");

  await adapter.listSince(OWNER, "2026-07-19", 62);
  assert.deepEqual(calls[3], { fn: "list", args: [OWNER, "2026-07-19", 62] }, "history stays owner-scoped and bounded");

  await adapter.getForDate(OWNER, "2026-08-18");
  assert.deepEqual(calls[4], { fn: "get", args: [OWNER, "2026-08-18"] });

  await adapter.hasAny(OWNER);
  assert.deepEqual(calls[5], { fn: "hasAny", args: [OWNER] });
});

// ── D. current-moment semantics preserved ───────────────────────────────────

test("current-moment create/annotate/latest/list map losslessly", async () => {
  const calls: Array<{ fn: string; args: unknown[] }> = [];
  const adapter = bindCurrentMomentState({
    createCurrentStateRecord: async (owner, input) => (calls.push({ fn: "create", args: [owner, input] }), "cs-1"),
    setCurrentStateReflection: async (owner, id, text) =>
      (calls.push({ fn: "annotate", args: [owner, id, text] }), true),
    listCurrentStateRecords: async (owner, limit) => (calls.push({ fn: "list", args: [owner, limit] }), []),
    latestCurrentStateRecord: async (owner) => (calls.push({ fn: "latest", args: [owner] }), null),
  });

  const input = {
    stateTags: ["落ち着かない"],
    mood: "low" as never,
    energy: "mid" as never,
    situation: null,
    reflection: null,
    source: "today_check_in" as const,
  };
  assert.equal(await adapter.create(OWNER, input as never), "cs-1");
  assert.deepEqual(calls[0], { fn: "create", args: [OWNER, input] }, "create passes through unreshaped");

  assert.equal(await adapter.annotate(OWNER, "cs-1", "note"), true);
  assert.deepEqual(calls[1], { fn: "annotate", args: [OWNER, "cs-1", "note"] }, "annotation stays record-id-specific");

  await adapter.latest(OWNER);
  assert.deepEqual(calls[2], { fn: "latest", args: [OWNER] });

  await adapter.list(OWNER, 12);
  assert.deepEqual(calls[3], { fn: "list", args: [OWNER, 12] }, "list stays bounded");
});

// ── E. provenance is normalized and owner-free ──────────────────────────────

test("provenance names family + record ref + capture time, and never the owner", () => {
  const current = currentMomentProvenance({ id: "cs-9", created_at: "2026-08-18T03:00:00Z" });
  assert.deepEqual(current, { family: "current_moment", record_ref: "cs-9", captured_at: "2026-08-18T03:00:00Z" });
  const daily = versionedDailyProvenance({ id: "d-9", produced_at: "2026-08-18T01:00:00Z" });
  assert.deepEqual(daily, { family: "versioned_daily", record_ref: "d-9", captured_at: "2026-08-18T01:00:00Z" });
  for (const p of [current, daily]) {
    assert.ok(!("owner_account_id" in p), "no owner crosses the contract boundary");
    assert.ok(!JSON.stringify(p).includes(OWNER), "no account identity in provenance");
  }
});

// ── F. Today source stability ───────────────────────────────────────────────

test("Today still resolves the current-moment family only", () => {
  const source = read("app", "TodaySavedState.tsx");
  assert.ok(
    source.includes('latestCurrentStateRecord } from "@/lib/server/platform/stateCore"'),
    "Today reads through the state.core boundary",
  );
  for (const forbidden of ["DailyRecord", "dailyCheckInStore", "versionedDailyState"]) {
    assert.ok(!source.includes(forbidden), `Today must not newly consume the daily family (${forbidden})`);
  }
});

// ── G. ARCH-P1 seam continuity ──────────────────────────────────────────────

test("the P1 event seam is untouched: persistence -> event -> single audit, via the facade", () => {
  const route = read("app", "api", "life", "state", "route.ts");
  assert.ok(
    route.includes('from "@/lib/server/platform/stateCore"'),
    "the state route persists through the state.core boundary",
  );
  const createIndex = route.indexOf("await createCurrentStateRecord(");
  const eventIndex = route.indexOf("stateCheckinCompletedEvent({");
  assert.ok(createIndex >= 0 && eventIndex >= 0 && createIndex < eventIndex, "persistence still precedes the event");
  assert.equal(
    (route.match(/yorisou\.life\.state\.created/g) ?? []).length,
    1,
    "exactly one direct audit fallback branch — no duplicate audit",
  );
});

// ── H. import boundary with the one named exception ─────────────────────────

const STATE_FUNCTIONS = [
  "createCurrentStateRecord",
  "setCurrentStateReflection",
  "listCurrentStateRecords",
  "latestCurrentStateRecord",
];

function lifeOsStoreImportClause(source: string): string | null {
  const match = /import\s*\{([^}]*)\}\s*from\s*"@\/lib\/server\/lifeOs\/store"/.exec(source);
  return match ? match[1] : null;
}

test("adopted consumers reach state persistence only through the facade", () => {
  const adopted = [
    ["app", "api", "life", "state", "route.ts"],
    ["app", "TodaySavedState.tsx"],
    ["app", "life", "page.tsx"],
    ["app", "life", "StateHistory.tsx"],
    ["app", "api", "tests", "daily-check-in", "records", "route.ts"],
    ["app", "api", "tests", "daily-check-in", "records", "[date]", "route.ts"],
  ];
  for (const parts of adopted) {
    const source = read(...parts);
    const path = parts.join("/");
    assert.ok(!source.includes('"@/lib/server/dailyCheckInStore"'), `${path} must not import the DCI store directly`);
    const clause = lifeOsStoreImportClause(source);
    if (clause) {
      // app/life/page.tsx legitimately keeps goals/reflections/memories reads there — but the
      // STATE functions must not appear in that import clause.
      for (const fn of STATE_FUNCTIONS) {
        assert.ok(!clause.includes(fn), `${path} imports ${fn} from the legacy store instead of state.core`);
      }
    }
  }
});

test("the timeline is the ONE named direct-read exception, owned by continuity.core P6", () => {
  // Deliberate compatibility debt (gap doc §3.6): timeline merges sources by direct store reads
  // until P6 introduces projections. It must still read the legacy store directly — if this
  // assertion ever fails, either P6 landed (update this test with it) or someone silently widened
  // or narrowed the exception (investigate).
  const timeline = read("lib", "server", "lifeOs", "timeline.ts");
  assert.ok(
    timeline.includes('from "@/lib/server/lifeOs/store"'),
    "timeline still reads its sources directly — the recorded P6 exception",
  );
  assert.ok(!timeline.includes("platform/stateCore"), "timeline is not silently half-adopted");
});

// ── I. platform contract stays brand-free and table-free ────────────────────

test("the platform state.core contract names no product, no store, no table", () => {
  const contract = read("lib", "platform", "stateCore.ts");
  for (const forbidden of [
    "daily_state_records",
    "current_state_records",
    "dailyCheckInStore",
    "lifeOs",
    "supabase",
    "postgrest",
  ]) {
    assert.ok(!contract.toLowerCase().includes(forbidden.toLowerCase()), `platform contract mentions "${forbidden}"`);
  }
  assert.ok(!/[぀-ヿ一-鿿]/.test(contract), "no Japanese product copy in the platform contract");
});

// ── J. zero data movement ───────────────────────────────────────────────────

test("the adapters move no data: no SQL, no migration reference, no sync job", () => {
  for (const file of ["index.ts", "currentStateAdapter.ts", "dailyStateAdapter.ts"]) {
    const source = read("lib", "server", "platform", "stateCore", file).toLowerCase();
    for (const forbidden of ["insert into", "alter table", "create table", "supabase/migrations", "backfill"]) {
      assert.ok(!source.includes(forbidden), `${file} contains "${forbidden}"`);
    }
  }
});
