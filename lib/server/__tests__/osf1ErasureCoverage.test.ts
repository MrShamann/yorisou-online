import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// OSF-1 — the permanent guard against a user-owned table that account deletion does not know about.
//
// THE DEFECT CLASS.
//
// POR-1 erasure does not discover tables. `yorisou_account_deletion_erase_database_unchecked`
// carries a literal `v_plan text[][]` and deletes exactly what it names. A table absent from that
// array is skipped in silence — `to_regclass` returns non-null, the loop never reaches it, and the
// job still records `outcome = ok`. So the failure looks like success: a person deletes their
// account, is told it worked, and their rows are still there.
//
// The existing coverage test (por1ProductionDeletionCoverage.test.ts) cannot catch this. It compares
// the plan against `supabase/contracts/por1-production-owner-linked-families.json`, a checked-in
// snapshot of the Production catalogue taken on 2026-08-01 — so a table added afterwards is in
// neither side of that comparison and the test stays green. That test answers "does the plan cover
// what Production had in August"; this one answers "does the plan cover what the repository defines
// now", which is the question a new migration makes urgent.
//
// It reads the SHIPPED production plan under supabase/migrations/, not the preview-only file.

const MIGRATIONS_DIR = "supabase/migrations";

/** Every column name in this repository that means "the person this row belongs to". */
const OWNER_COLUMNS = [
  "owner_account_id",
  "actor_account_id",
  "reporter_account_id",
  "blocker_account_id",
  "blocked_owner_account_id",
];

/**
 * Tables that carry an owner column and are deliberately NOT in the declarative plan, each with the
 * reason. This list is the point of the test: adding to it is a decision someone has to write down,
 * which is exactly the step that was missing when the plan was a bare array.
 */
const JUSTIFIED_EXEMPTIONS: Record<string, string> = {
  // Erased ahead of the plan by a governed row-by-row call that leaves the contractual content-free
  // tombstone (202608010110 §5.1). A plain delete here would weaken the published erasure contract.
  yorisou_assessment_results: "governed per-row erase at 202608010110 §5.1",
  // Removed explicitly at §5.2 because the rows hold raw answers and are deleted, not tombstoned.
  yorisou_assessment_attempts: "explicit delete at 202608010110 §5.2",
  // Deleted by the parent result's governed erase, which the plan drives at §5.1:
  // 202608010107:52 `delete from public.yorisou_interpretation_responses where result_row_id = ...`
  // inside yorisou_assessment_result_erase. Adding it to the plan as well would be harmless but
  // would hide that the ordering matters — the responses must go while the owner linkage still
  // authorizes the delete.
  yorisou_interpretation_responses: "deleted by yorisou_assessment_result_erase at 202608010107:52",
  // The erasure machinery itself. Deleting the job mid-erasure would destroy the row the function is
  // holding a lock on and validating against; the fence rows are what stop concurrent writes while
  // it runs. These are cleaned up by the deletion lifecycle, not by the content plan.
  yorisou_account_deletion_jobs: "the executing job row; POR-1 lifecycle owns its disposal",
  yorisou_account_mutation_gates: "erasure fence; must outlive the erasure it is fencing",
  yorisou_account_mutation_leases: "erasure fence; must outlive the erasure it is fencing",
  // Identity linkage and LINE activity are erased by the identity/storage stages of the deletion
  // lifecycle rather than the database-content stage.
  yorisou_canonical_identity_links: "identity_erasure stage, not database_erasure",
  yorisou_canonical_line_events: "identity_erasure stage, not database_erasure",
};

function createdTablesWithOwnerColumn(sql: string): Map<string, string[]> {
  const found = new Map<string, string[]>();
  const opener = /create table (?:if not exists )?public\.([a-z0-9_]+)\s*\(/gi;
  let match: RegExpExecArray | null;
  while ((match = opener.exec(sql))) {
    // Balance parentheses from the opening one so nested type/check parens do not end the body early.
    let depth = 0;
    let end = -1;
    for (let i = opener.lastIndex - 1; i < sql.length; i += 1) {
      if (sql[i] === "(") depth += 1;
      else if (sql[i] === ")") {
        depth -= 1;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    if (end < 0) continue;
    const body = sql.slice(opener.lastIndex, end);
    const columns = OWNER_COLUMNS.filter((column) => new RegExp(`(^|\\n)\\s*${column}\\s+`, "i").test(body));
    if (columns.length > 0) found.set(match[1], columns);
  }
  return found;
}

function productionErasurePlanFile(): { path: string; sql: string } {
  // The newest migration that redefines the erasure body owns the live plan.
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith(".sql"))
    .sort();
  let chosen: string | null = null;
  for (const name of files) {
    const sql = readFileSync(join(MIGRATIONS_DIR, name), "utf8");
    if (sql.includes("function public.yorisou_account_deletion_erase_database_unchecked")) chosen = name;
  }
  assert.ok(chosen, "no migration defines yorisou_account_deletion_erase_database_unchecked");
  return { path: join(MIGRATIONS_DIR, chosen), sql: readFileSync(join(MIGRATIONS_DIR, chosen), "utf8") };
}

function planTables(sql: string): Set<string> {
  const declaration = /v_plan\s+text\[\]\[\]\s*:=\s*array\[([\s\S]*?)\n\s*\];/.exec(sql);
  assert.ok(declaration, "could not find the v_plan array in the erasure function");
  return new Set([...declaration[1].matchAll(/\['([a-z0-9_]+)'\s*,\s*'([a-z0-9_]+)'\]/g)].map((m) => m[1]));
}

test("every owner-linked table defined in supabase/migrations is registered for account erasure", () => {
  const plan = productionErasurePlanFile();
  const registered = planTables(plan.sql);

  const owned = new Map<string, { file: string; columns: string[] }>();
  for (const name of readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort()) {
    const sql = readFileSync(join(MIGRATIONS_DIR, name), "utf8");
    for (const [table, columns] of createdTablesWithOwnerColumn(sql)) owned.set(table, { file: name, columns });
  }

  assert.ok(owned.size > 10, `expected many owner-linked tables, found ${owned.size} — the scan is broken`);

  const unregistered = [...owned.entries()]
    .filter(([table]) => !registered.has(table) && !(table in JUSTIFIED_EXEMPTIONS))
    .map(([table, info]) => `${table} (${info.file})`);

  assert.deepEqual(
    unregistered,
    [],
    `these tables carry an owner column but account deletion would leave them behind. Add them to ` +
      `v_plan in ${plan.path}, or add a written justification to JUSTIFIED_EXEMPTIONS here:\n  ` +
      unregistered.join("\n  "),
  );
});

test("the five OSF-1 tables are named in the shipped production erasure plan", () => {
  const registered = planTables(productionErasurePlanFile().sql);
  for (const table of [
    "yorisou_user_contexts",
    "yorisou_current_state_records",
    "yorisou_goals",
    "yorisou_life_reflections",
    "yorisou_explicit_memories",
  ]) {
    assert.ok(registered.has(table), `${table} is not in the erasure plan`);
  }
});

test("every exemption names a table that actually exists", () => {
  // An exemption for a table nobody defines is a stale note that makes the list less trustworthy.
  const defined = new Set<string>();
  for (const name of readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql"))) {
    for (const table of createdTablesWithOwnerColumn(readFileSync(join(MIGRATIONS_DIR, name), "utf8")).keys()) {
      defined.add(table);
    }
  }
  for (const table of Object.keys(JUSTIFIED_EXEMPTIONS)) {
    assert.ok(defined.has(table), `exemption for ${table}, which no migration defines with an owner column`);
  }
});
