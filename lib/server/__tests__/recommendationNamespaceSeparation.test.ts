import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

// POR-1 §4/§15 — permanent guards for the Stage 1 blocking finding.
//
// `yorisou_recommendation_{sets,items,actions}` exist in PRODUCTION from legacy migration
// 202607110003 with a completely different shape and real data. The CPC-1 canonical lifecycle
// briefly shared those names, which would have let a Production migration silently no-op against
// the legacy tables — a green migration ledger over a runtime outage.
//
// These tests fail the build if the two families ever converge again. They are deliberately
// source-level: the defect was a NAMING collision, so it is detectable statically and must be
// caught long before a migration reaches a database.

const ROOT = join(__dirname, "..", "..", "..");

const LEGACY_TABLES = [
  "yorisou_recommendation_sets",
  "yorisou_recommendation_items",
  "yorisou_recommendation_actions",
] as const;

const CANONICAL_TABLES = [
  "yorisou_canonical_recommendation_sets",
  "yorisou_canonical_recommendation_items",
  "yorisou_canonical_recommendation_actions",
] as const;

/** Matches a legacy name only when it is NOT the canonical name that contains it as a suffix. */
function referencesLegacy(source: string): string[] {
  return LEGACY_TABLES.filter((table) =>
    new RegExp(`(?<!canonical_)\\b${table}\\b`).test(source),
  );
}

function referencesCanonical(source: string): string[] {
  return CANONICAL_TABLES.filter((table) => new RegExp(`\\b${table}\\b`).test(source));
}

const read = (relative: string) => readFileSync(join(ROOT, relative), "utf8");

test("the canonical adapter never touches the legacy recommendation family", () => {
  const source = read("lib/server/recommendationStore.ts");
  assert.deepEqual(
    referencesLegacy(source),
    [],
    "recommendationStore.ts is the CANONICAL adapter; a legacy raw table here would read Production's " +
      "legacy rows as if they were canonical records",
  );
  assert.ok(
    referencesCanonical(source).length > 0,
    "recommendationStore.ts must address the canonical family explicitly",
  );
});

test("the legacy adapter never touches the canonical recommendation family", () => {
  const source = read("lib/server/recommendationGraph.ts");
  assert.deepEqual(
    referencesCanonical(source),
    [],
    "recommendationGraph.ts serves the legacy graph that is live in Production; it must not reach " +
      "into canonical tables",
  );
});

test("no source file mixes both recommendation families", () => {
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
      const rel = `${dir}/${entry.name}`;
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".next") continue;
        walk(rel);
        continue;
      }
      if (!/\.(ts|tsx)$/.test(entry.name)) continue;
      // This guard file names both families by construction.
      if (rel.endsWith("recommendationNamespaceSeparation.test.ts")) continue;
      const source = readFileSync(join(ROOT, rel), "utf8");
      if (referencesLegacy(source).length > 0 && referencesCanonical(source).length > 0) {
        offenders.push(rel);
      }
    }
  };
  walk("lib");
  walk("app");
  assert.deepEqual(
    offenders,
    [],
    "a file addressing both families is how an implicit fallback between them gets written",
  );
});

test("no migration conceals a collision with a bare create-if-not-exists on a shared name", () => {
  // `create table if not exists` is the exact statement that would have no-opped against
  // Production's legacy tables while reporting success. It is banned for these three names in any
  // migration that could reach Production lineage.
  const offenders: string[] = [];
  for (const dir of ["supabase/migrations", "supabase/preview-only-migrations"]) {
    for (const file of readdirSync(join(ROOT, dir))) {
      if (!file.endsWith(".sql")) continue;
      const source = readFileSync(join(ROOT, dir, file), "utf8");
      for (const table of CANONICAL_TABLES) {
        if (new RegExp(`create\\s+table\\s+if\\s+not\\s+exists\\s+public\\.${table}\\b`, "i").test(source)) {
          offenders.push(`${dir}/${file} → ${table}`);
        }
      }
    }
  }
  assert.deepEqual(
    offenders,
    [],
    "canonical tables must assert absence or an exact compatible shape, never silently accept a " +
      "pre-existing incompatible table",
  );
});

test("the Preview chain ends on the canonical names, with the corrective migration last", () => {
  const dir = "supabase/preview-only-migrations";
  const files = readdirSync(join(ROOT, dir)).filter((f) => f.endsWith(".sql")).sort();
  const corrective = files.find((f) => f.includes("por1_canonical_recommendation_namespace"));
  assert.ok(corrective, "the POR-1 corrective migration must be present in the Preview chain");
  assert.equal(
    files[files.length - 1],
    corrective,
    "the rename must be the LAST Preview migration, otherwise a later migration could recreate the " +
      "pre-rename names and the fresh chain would not converge on the canonical family",
  );

  const source = readFileSync(join(ROOT, dir, corrective!), "utf8");
  for (const table of LEGACY_TABLES) {
    assert.ok(
      source.includes(`rename to yorisou_canonical_${table.replace("yorisou_", "")}`),
      `the corrective migration must rename ${table}`,
    );
  }
  assert.ok(
    /raise exception 'POR-1 post-condition failed/.test(source),
    "the corrective migration must verify its own post-condition rather than assume it",
  );
});

test("applied Preview migrations were not rewritten to perform the rename", () => {
  // POR-1 §3: the rename is forward-only. If an already-applied migration were edited to use the
  // canonical names, its checksum would change and a fresh chain would diverge from the applied one.
  const dir = "supabase/preview-only-migrations";
  for (const file of readdirSync(join(ROOT, dir))) {
    if (!file.endsWith(".sql")) continue;
    if (file.includes("por1_canonical_recommendation_namespace")) continue;
    const source = readFileSync(join(ROOT, dir, file), "utf8");
    assert.deepEqual(
      referencesCanonical(source),
      [],
      `${file} is an already-applied migration and must not be amended to use canonical names; ` +
        "the rename belongs in the forward-only corrective migration",
    );
  }
});
