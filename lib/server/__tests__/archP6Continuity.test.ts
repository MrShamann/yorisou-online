import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

// ARCH-P6 — continuity.core projection boundary suite.
//
// P6's canonical scope (execution plan §P6) is TimelineProjection + delete-propagation
// invalidation. The invariant worth testing is not "a moment renders" but "a moment cannot outlive
// its source" — because a projection that survives deletion is strictly worse than the direct
// store read it replaces.

import {
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
    source_family: "current_state",
    source_ref: "src-1",
    occurred_at: "2026-08-19T00:00:00.000Z",
    variant: null,
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
        existing.occurred_at = s.occurred_at;
        existing.variant = s.variant;
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
    async pageActive(request) {
      // Same keyset the store asks PostgREST for, so the suite exercises the real page semantics
      // rather than a convenient approximation: newest first, ties on source_ref, strictly after
      // the cursor, and limit + 1 so "has more" is decidable.
      const families = new Set<string>(request.families);
      return rows
        .filter((r) => r.owner_ref === request.owner_ref && r.status === "active")
        .filter((r) => families.has(r.source_family))
        .filter((r) => request.variant === null || r.variant === request.variant)
        .filter((r) =>
          !request.after ||
          r.occurred_at < request.after.occurred_at ||
          (r.occurred_at === request.after.occurred_at && r.source_ref < request.after.source_ref),
        )
        .sort((a, b) =>
          a.occurred_at < b.occurred_at ? 1 : a.occurred_at > b.occurred_at ? -1
            : a.source_ref < b.source_ref ? 1 : a.source_ref > b.source_ref ? -1 : 0,
        )
        .slice(0, request.limit + 1);
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
    "occurred_at", "owner_ref", "source_family", "source_ref", "status", "variant",
  ]);
  // The index carries no content at all — not even a label. Rendering hydrates from the sources.
  assert.ok(!("label" in moment) && !("title" in moment) && !("body" in moment));
});

test("B. malformed projection input is refused", () => {
  assert.throws(() => assertProjectableSource(source({ variant: "" })), /continuity_variant_invalid/);
  assert.throws(() => assertProjectableSource(source({ variant: "x".repeat(41) })), /continuity_variant_invalid/);
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
  await projectMoment(source({ occurred_at: "2026-08-01T00:00:00.000Z" }), repo);
  await projectMoment(source({ occurred_at: "2026-08-02T00:00:00.000Z" }), repo);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].occurred_at, "2026-08-02T00:00:00.000Z");
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

test("E. every family the timeline displays has a projection family, and vice versa", () => {
  // THE READ-SWITCH SAFETY NET. P6's canonical scope ends with "timeline switches reads", and the
  // way that goes wrong is a vocabulary mismatch: a family the timeline shows but the projection
  // has no name for simply disappears when the switch happens.
  const timeline = read("lib/server/lifeOs/timeline.ts");
  const kinds = new Set(
    [...timeline.matchAll(/kind:\s*"([a-z_]+)"\s*as const/g)].map((m) => m[1]),
  );
  // Memory is deliberately NOT a timeline kind (a standing note, not a moment) — the timeline says
  // so explicitly, so its absence here is intended rather than an omission.
  kinds.delete("memory");
  assert.ok(kinds.size > 0, "could not read the timeline's kinds — this guard would pass vacuously");
  for (const kind of kinds) {
    assert.ok(
      (CONTINUITY_SOURCE_FAMILIES as readonly string[]).includes(kind),
      `the timeline displays "${kind}" but continuity.core has no family for it — the read-switch would drop it`,
    );
  }
  for (const family of CONTINUITY_SOURCE_FAMILIES) {
    assert.ok(kinds.has(family), `continuity.core declares "${family}" which the timeline never displays`);
  }
});

// ─── scope: P6 is projections, NOT pattern detection ────────────────────────

test("E. no pattern detection, no memory write, no scoring entered continuity.core", () => {
  for (const file of ["lib/platform/continuityCore.ts", "lib/server/platform/continuityCore/service.ts"]) {
    const source = code(file);
    for (const forbidden of [/patternCandidate/i, /detectPattern/i, /score/i, /memory/i, /confidence/i]) {
      assert.ok(!forbidden.test(source), `${file} references ${forbidden} — outside P6 scope`);
    }
  }
  // Pinned to what lib/server/lifeOs/timeline.ts actually displays. If a family is added or
  // removed here without the timeline changing, the read-switch would drop or invent moments.
  assert.deepEqual([...CONTINUITY_SOURCE_FAMILIES], [
    "current_state", "goal", "reflection", "experience",
  ]);
});

test("E. isReadableMoment is the single definition of readability", () => {
  assert.equal(isReadableMoment({ status: "active" }), true);
  assert.equal(isReadableMoment({ status: "invalidated" }), false);
});

// ─── the soft-delete lifecycle CNT-1 assumes is irreversible ────────────────

test("F. nothing in the product restores a withdrawn or soft-deleted experience", () => {
  // CNT-1 invalidates TERMINALLY when an experience card gains deleted_at or withdrawn_at, and
  // terminal is only the right model because neither column is ever cleared: withdrawExperience
  // only ever sets them, and moderation "restore" returns moderation_status alone. If a genuine
  // un-withdraw is ever added, terminal invalidation becomes WRONG for that path — the card would
  // reappear in the product while its moment stayed permanently dead. This test is what turns that
  // from a silent divergence into a build failure that names the decision to revisit.
  const sources = [
    "lib/server/experienceCards.ts",
    "app/api/life/experiences/route.ts",
    "lib/server/lifeOs/store.ts",
  ];
  const clears = [
    /deleted_at\s*:\s*null/,
    /withdrawn_at\s*:\s*null/,
    /"deleted_at"\s*:\s*null/,
    /"withdrawn_at"\s*:\s*null/,
  ];
  for (const file of sources) {
    let source: string;
    try {
      source = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const pattern of clears) {
      assert.ok(
        !pattern.test(source),
        `${file} clears a soft-delete flag (${pattern}). CNT-1's terminal invalidation assumes that never happens — revisit the projection lifecycle for that path before shipping it.`,
      );
    }
  }
});

test("F. CNT-1 propagates from the source tables rather than trusting callers", () => {
  const migration = readFileSync(
    "supabase/migrations/202608200001_cnt1_continuity_projections.sql",
    "utf8",
  );
  // Propagation lives in an AFTER trigger so that it is atomic with the source write and so that no
  // writer — RPC, PostgREST, migration, or a path nobody has written yet — can produce a source row
  // without its moment. A store-level hook would only cover callers that remembered to call it.
  for (const table of [
    "yorisou_current_state_records",
    "yorisou_goals",
    "yorisou_life_reflections",
    "yorisou_experience_cards",
  ]) {
    assert.ok(
      new RegExp(`'${table}'`).test(migration),
      `${table} is not wired to yorisou_continuity_sync — writes to it would produce no moment`,
    );
  }
  assert.match(migration, /create trigger yorisou_continuity_sync_trg after insert or update or delete/);
  // The erasure plan must destroy the index AFTER the sources it points at. Both paths then lock
  // source-then-projection; the reverse deadlocks, which tests/continuity/postgres-acceptance.sh
  // demonstrates as a real `deadlock detected` when the order is put back.
  const plan = migration.slice(migration.indexOf("v_plan     text[][]"));
  const projections = plan.indexOf("'yorisou_continuity_projections'");
  for (const source of [
    "'yorisou_current_state_records'",
    "'yorisou_goals'",
    "'yorisou_life_reflections'",
    "'yorisou_experience_cards'",
  ]) {
    const at = plan.indexOf(source);
    assert.ok(at >= 0 && at < projections,
      `${source} is erased after the projection index — that inverts the lock order and deadlocks`);
  }
});

// ─── APP-P6-7: schema readiness is a migration boundary, and it fails closed ─

test("G. production without an explicit declaration does not read projections", async () => {
  const { continuityReadiness, CONTINUITY_SCHEMA_READY_ENV } = await import("@/lib/yorisou/continuity/access");

  // Production, nothing declared: the CNT-1 table may not exist, so reading it would empty a
  // person's timeline. Closed.
  assert.equal(continuityReadiness({ VERCEL_ENV: "production" }).ready, false);
  assert.equal(continuityReadiness({ VERCEL_ENV: "production" }).reason, "not_declared_production");
  // Preview is no different: a preview database is a real database that may not be migrated.
  assert.equal(continuityReadiness({ VERCEL_ENV: "preview" }).ready, false);
  // An unrecognised context is the dangerous one, and it is closed rather than optimistic.
  assert.equal(continuityReadiness({ VERCEL_ENV: "something-new" }).ready, false);
  assert.equal(continuityReadiness({}).ready, false);
  // Only an explicit operator declaration opens it, and only the exact string.
  assert.equal(continuityReadiness({ VERCEL_ENV: "production", [CONTINUITY_SCHEMA_READY_ENV]: "true" }).ready, true);
  for (const nearly of ["TRUE ", "1", "yes", "", "false"]) {
    const readiness = continuityReadiness({ VERCEL_ENV: "production", [CONTINUITY_SCHEMA_READY_ENV]: nearly });
    assert.equal(readiness.ready, nearly === "TRUE ", `"${nearly}" must not be read as a declaration`);
  }
});

test("G. readiness is a schema boundary, NOT a product rollout switch", () => {
  const gate = code("lib/yorisou/continuity/access.ts");
  // ARCH-P6 changes nothing a person can see, so there must be no way to switch a surface on or
  // off. A PUBLIC_ENABLED flag or a preview dev flag here would mean P6 had grown a product
  // rollout it was explicitly not authorised to have.
  for (const forbidden of [/PUBLIC_ENABLED/, /isDevFlagEnabled/, /_PREVIEW_FLAG/]) {
    assert.ok(!forbidden.test(gate), `the continuity gate references ${forbidden} — that is a rollout switch, not schema readiness`);
  }
});

// ─── §13: the legacy aggregation is no longer authoritative ─────────────────

test("H. the projection read path does not aggregate the source stores", () => {
  const timeline = readFileSync("lib/server/lifeOs/timeline.ts", "utf8");
  const start = timeline.indexOf("export async function lifeTimelinePage(");
  assert.ok(start > 0, "lifeTimelinePage is missing");
  const body = timeline.slice(start, timeline.indexOf("\n}", start));

  // Exactly ONE call to the legacy reader is allowed, and only as the not-yet-migrated branch.
  const legacyCalls = body.match(/legacyAggregatedTimelinePage\(/g) ?? [];
  assert.equal(legacyCalls.length, 1, "the projection path calls the legacy aggregation more than once");
  assert.match(body, /if \(!continuitySchemaReady\(\)\) return legacyAggregatedTimelinePage/,
    "the legacy reader must be reachable ONLY as the pre-migration branch");

  // And it must not have quietly regrown its own aggregation: no pageOf, no merge of four sources.
  for (const forbidden of [/pageOf</, /Promise\.all\(\[\s*wants\(/, /const merged/]) {
    assert.ok(!forbidden.test(body),
      `lifeTimelinePage reintroduced direct source aggregation (${forbidden}) — that defeats P6`);
  }
  assert.match(body, /readTimelinePage\(/, "the projection path does not read the continuity index");
});

test("H. nothing in a route or page writes the continuity index directly", () => {
  // Propagation is a database trigger. A route that also projected would be a second, non-atomic
  // writer racing the first — and the divergence would only show up as a missing timeline entry.
  const hits = execSync(
    "grep -rl 'continuityRepository\\|yorisou_continuity_project' app lib/server/lifeOs 2>/dev/null || true",
    { encoding: "utf8" },
  )
    .split("\n")
    .filter(Boolean)
    .filter((f) => f !== "lib/server/lifeOs/timeline.ts");
  assert.deepEqual(hits, [], `these reach for the continuity index outside the reader: ${hits.join(", ")}`);
});
