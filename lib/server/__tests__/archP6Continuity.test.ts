import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// ARCH-P6 — continuity.core projection boundary suite.
//
// P6's canonical scope (execution plan §P6) is TimelineProjection + delete-propagation
// invalidation. The invariant worth testing is not "a moment renders" but "a moment cannot outlive
// its source" — because a projection that survives deletion is strictly worse than the direct
// store read it replaces.

import {
  CONTINUITY_LABEL_MAX,
  CONTINUITY_SOURCE_FAMILIES,
  assertProjectableSource,
  isReadableMoment,
  projectionKeyOf,
  type ProjectionSource,
  type TimelineMoment,
} from "@/lib/platform/continuityCore";
import {
  CONTINUITY_PAGE_LIMIT,
  invalidateProjectionsForSource,
  projectMoment,
  readTimeline,
  type ContinuityRepository,
} from "@/lib/server/platform/continuityCore/service";

const read = (path: string) => readFileSync(path, "utf8");
const code = (path: string) =>
  read(path).replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");

function source(over: Partial<ProjectionSource> = {}): ProjectionSource {
  return {
    owner_ref: "acct-a",
    source_family: "state_snapshot",
    source_ref: "src-1",
    occurred_at: "2026-08-19T00:00:00.000Z",
    label: "checked in",
    ...over,
  };
}

/** A faithful stand-in for the scoped store: owner-keyed, idempotent, terminal invalidation. */
function fakeRepo() {
  const rows: TimelineMoment[] = [];
  const repo: ContinuityRepository = {
    async upsertMoment(s) {
      const existing = rows.find(
        (r) => r.owner_ref === s.owner_ref && r.source_family === s.source_family && r.source_ref === s.source_ref,
      );
      if (existing) {
        existing.label = s.label;
        existing.occurred_at = s.occurred_at;
        return existing;
      }
      const row: TimelineMoment = { ...s, status: "active" };
      rows.push(row);
      return row;
    },
    async invalidateForSource(key) {
      let n = 0;
      for (const r of rows) {
        if (
          r.owner_ref === key.owner_ref &&
          r.source_family === key.source_family &&
          r.source_ref === key.source_ref &&
          r.status === "active"
        ) {
          r.status = "invalidated";
          n += 1;
        }
      }
      return n;
    },
    async listActive(owner, limit) {
      return rows
        .filter((r) => r.owner_ref === owner && r.status === "active")
        .sort((a, b) => b.occurred_at.localeCompare(a.occurred_at))
        .slice(0, limit);
    },
  };
  return { repo, rows };
}

// ─── the platform tier stays brand-free ─────────────────────────────────────

test("A. the continuity platform tier carries no product identity", () => {
  for (const file of ["lib/platform/continuityCore.ts", "lib/server/platform/continuityCore/service.ts"]) {
    const source = code(file);
    for (const branded of [/imairo/i, /yorisou/i, /いま色/, /supabase/i, /yorisou_/]) {
      assert.ok(!branded.test(source), `${file} mentions ${branded}`);
    }
    assert.ok(!/from\s+"@\/packs\//.test(read(file)), `${file} imports a Product Pack`);
    assert.ok(!/from\s+"@\/app\//.test(read(file)), `${file} imports an app route`);
  }
});

// ─── the projection rule: a reference, never a copy ─────────────────────────

test("B. a TimelineMoment has no field for source content", () => {
  const moment: TimelineMoment = { ...source(), status: "active" };
  assert.deepEqual(Object.keys(moment).sort(), [
    "label", "occurred_at", "owner_ref", "source_family", "source_ref", "status",
  ]);
});

test("B. an over-long label is refused — a projection is a pointer, not a record", () => {
  assert.throws(() => assertProjectableSource(source({ label: "x".repeat(CONTINUITY_LABEL_MAX + 1) })),
    /continuity_label_too_long/);
  assert.throws(() => assertProjectableSource(source({ label: "" })), /continuity_label_required/);
  assert.throws(() => assertProjectableSource(source({ source_ref: "" })), /continuity_source_ref_required/);
  assert.throws(() => assertProjectableSource(source({ owner_ref: "" })), /continuity_owner_required/);
  assert.throws(
    () => assertProjectableSource(source({ source_family: "not_a_family" as never })),
    /continuity_unknown_source_family/,
  );
  assert.throws(() => assertProjectableSource(source({ occurred_at: "nope" })), /continuity_occurred_at_invalid/);
});

// ─── DELETE PROPAGATION — the point of the package ──────────────────────────

test("C. an invalidated moment can never be read again", async () => {
  const { repo } = fakeRepo();
  await projectMoment(source(), repo);
  assert.equal((await readTimeline("acct-a", repo)).length, 1);

  const n = await invalidateProjectionsForSource(projectionKeyOf(source()), repo);
  assert.equal(n, 1);
  assert.equal((await readTimeline("acct-a", repo)).length, 0, "a projection outlived its source");
});

test("C. invalidation is TERMINAL — re-projecting the same source does not revive it", async () => {
  const { repo, rows } = fakeRepo();
  await projectMoment(source(), repo);
  await invalidateProjectionsForSource(projectionKeyOf(source()), repo);
  await projectMoment(source(), repo);
  assert.equal(rows.length, 1, "re-projection appended a duplicate");
  assert.equal(rows[0].status, "invalidated", "an erased source came back through re-projection");
  assert.equal((await readTimeline("acct-a", repo)).length, 0);
});

test("C. invalidation is OWNER-SCOPED — another person's timeline is untouched", async () => {
  const { repo } = fakeRepo();
  await projectMoment(source({ owner_ref: "acct-a" }), repo);
  await projectMoment(source({ owner_ref: "acct-b" }), repo);

  // Same source_family + source_ref, different owner. Knowing a reference must not be enough.
  const n = await invalidateProjectionsForSource(projectionKeyOf(source({ owner_ref: "acct-a" })), repo);
  assert.equal(n, 1);
  assert.equal((await readTimeline("acct-a", repo)).length, 0);
  assert.equal((await readTimeline("acct-b", repo)).length, 1, "cross-owner invalidation occurred");
});

test("C. invalidation is idempotent and reports honestly", async () => {
  const { repo } = fakeRepo();
  await projectMoment(source(), repo);
  assert.equal(await invalidateProjectionsForSource(projectionKeyOf(source()), repo), 1);
  assert.equal(await invalidateProjectionsForSource(projectionKeyOf(source()), repo), 0);
});

// ─── projection identity + bounded reads ────────────────────────────────────

test("D. projecting the same source twice updates, never duplicates", async () => {
  const { repo, rows } = fakeRepo();
  await projectMoment(source({ label: "first" }), repo);
  await projectMoment(source({ label: "second" }), repo);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].label, "second");
});

test("D. reads are bounded and newest-first", async () => {
  const { repo } = fakeRepo();
  for (let i = 0; i < 60; i += 1) {
    await projectMoment(source({ source_ref: `src-${i}`, occurred_at: `2026-08-${String((i % 28) + 1).padStart(2, "0")}T00:00:00.000Z` }), repo);
  }
  const page = await readTimeline("acct-a", repo, 999);
  assert.ok(page.length <= CONTINUITY_PAGE_LIMIT, "the timeline is not bounded");
  for (let i = 1; i < page.length; i += 1) {
    assert.ok(page[i - 1].occurred_at >= page[i].occurred_at, "the timeline is not newest-first");
  }
});

test("D. an empty owner reads nothing rather than everything", async () => {
  const { repo } = fakeRepo();
  await projectMoment(source(), repo);
  assert.deepEqual(await readTimeline("", repo), []);
});

// ─── scope: P6 is projections, NOT pattern detection ────────────────────────

test("E. no pattern detection, no memory write, no scoring entered continuity.core", () => {
  for (const file of ["lib/platform/continuityCore.ts", "lib/server/platform/continuityCore/service.ts"]) {
    const source = code(file);
    for (const forbidden of [/patternCandidate/i, /detectPattern/i, /score/i, /memory/i, /confidence/i]) {
      assert.ok(!forbidden.test(source), `${file} references ${forbidden} — outside P6 scope`);
    }
  }
  assert.deepEqual([...CONTINUITY_SOURCE_FAMILIES], [
    "state_snapshot", "assessment_result", "discovery_session", "experience_card", "life_reflection",
  ]);
});

test("E. isReadableMoment is the single definition of readability", () => {
  assert.equal(isReadableMoment({ status: "active" }), true);
  assert.equal(isReadableMoment({ status: "invalidated" }), false);
});
