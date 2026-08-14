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
  // Not a Yorisou naming convention, but the POR-1 provisioning saga uses it and the annex's own
  // common-column convention is `user_id` — a future table following the governance document rather
  // than the code would be invisible to a list that only knows the *_account_id shapes.
  "account_id",
  "user_id",
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
  // Identity linkage is erased by the identity stage of the deletion lifecycle, not the
  // database-content stage.
  yorisou_canonical_identity_links: "identity_erasure stage, not database_erasure",
  // LINE activity is NOT the identity stage — that description was wrong. It is cleaned up by the
  // LINE-activity path in 202608010104, and that cleanup is capability-flag conditional, so "it is
  // handled elsewhere" is a weaker statement here than for the rows above. Recorded accurately
  // rather than tidily: whether a flag-off account leaves LINE rows behind is a POR-1 question this
  // exemption does not answer.
  yorisou_canonical_line_events:
    "LINE-activity cleanup in 202608010104, capability-flag conditional — POR-1 owns the flag-off case",
  // PRE-EXISTING AND UNRESOLVED, surfaced rather than hidden.
  //
  // A provisioning saga is transient identity-provisioning state, not user content, and it is in
  // neither the plan nor any erasure path this test could find. It is a POR-1 table, untouched by
  // PR #132, so resolving it is out of that package's scope — but the previous OWNER_COLUMNS list
  // omitted `account_id`, which meant this guard could not even ask the question. It can now, and
  // this entry is the honest answer: nobody has decided yet.
  yorisou_identity_provisioning_sagas:
    "UNRESOLVED — pre-existing POR-1 provisioning state, in no erasure path; referred to POR-1, not PR #132",
};

/**
 * Find every CREATE TABLE that declares an owner column.
 *
 * THIS SCANNER WAS WRONG ONCE, AND THE WAY IT WAS WRONG IS THE WHOLE LESSON.
 *
 * The first version anchored the column match to a line start — `(^|\n)\s*<column>\s+` — and required
 * the table name to be `public.`-qualified. Both assumptions hold for the migrations someone happens
 * to be looking at while writing the guard, and neither holds for the repository:
 * 202607110002_experience_cards.sql and 202607110003_recommendation_graph.sql are written in a dense
 * style with several columns per line, so their owner columns are mid-line. The guard saw 28 of the
 * repository's 42 owner-linked tables and reported "ok". The fourteen it could not see were all in
 * the erasure plan already, so no data was ever at risk — but the guard's own header claimed a
 * property it did not have for a third of the schema, and the next table added to either of those
 * two files would have been invisible.
 *
 * A guard with a blind spot is worse than no guard: it licenses the belief that the class is covered.
 * So the matcher below is deliberately permissive about formatting and strict only about meaning, and
 * `every owner-linked table is visible to the scanner` is itself asserted as a test below.
 */
function createdTablesWithOwnerColumn(sql: string): Map<string, string[]> {
  const found = new Map<string, string[]>();
  // Schema qualification optional, quoting optional: `create table public.x (`, `create table x (`
  // and `create table if not exists public."x" (` are the same declaration. The name is lowercased
  // because Postgres folds unquoted identifiers, so `CREATE TABLE T` creates `t` — and the plan
  // entries this is compared against are lowercase.
  const opener = /create table (?:if not exists )?(?:public\.)?"?([a-zA-Z0-9_]+)"?\s*\(/gi;
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
    // A column DECLARATION: the name preceded by a line start, a comma or the opening paren, and
    // followed by a type. Requiring the type is what keeps a reference inside a check constraint or a
    // foreign key from being mistaken for a declaration.
    const columns = OWNER_COLUMNS.filter((column) =>
      new RegExp(`(^|\\n|,|\\()\\s*${column}\\s+(text|uuid|varchar|citext)`, "i").test(body),
    );
    if (columns.length > 0) found.set(match[1].toLowerCase(), columns);
  }
  return found;
}

/** Owner columns added to an existing table by ALTER TABLE rather than in the CREATE. */
function alteredInOwnerColumn(sql: string): Map<string, string[]> {
  const found = new Map<string, string[]>();
  const re = /alter table (?:if exists )?(?:only )?(?:public\.)?"?([a-zA-Z0-9_]+)"?\s+add column (?:if not exists )?"?([a-zA-Z0-9_]+)"?/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(sql))) {
    const column = match[2].toLowerCase();
    if (!OWNER_COLUMNS.includes(column)) continue;
    const table = match[1].toLowerCase();
    const existing = found.get(table) ?? [];
    found.set(table, [...existing, column]);
  }
  return found;
}

function everyOwnerLinkedTable(): Map<string, { file: string; columns: string[] }> {
  const owned = new Map<string, { file: string; columns: string[] }>();
  for (const name of readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort()) {
    const sql = readFileSync(join(MIGRATIONS_DIR, name), "utf8");
    for (const [table, columns] of createdTablesWithOwnerColumn(sql)) owned.set(table, { file: name, columns });
    for (const [table, columns] of alteredInOwnerColumn(sql)) {
      const existing = owned.get(table);
      owned.set(table, {
        file: existing?.file ?? name,
        columns: [...new Set([...(existing?.columns ?? []), ...columns])],
      });
    }
  }
  return owned;
}

function productionErasurePlanFile(): { path: string; sql: string } {
  // The newest migration that DEFINES the erasure body owns the live plan.
  //
  // Selecting on `create or replace function` rather than on a bare mention: this test's own
  // rationale comment names the function, and so does the OSF-1 registration migration's header. A
  // mention-based match would eventually pick a migration that only talks about the function and then
  // fail to find a v_plan in it — a confusing failure that reads like the plan disappeared.
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith(".sql"))
    .sort();
  let chosen: string | null = null;
  for (const name of files) {
    const sql = readFileSync(join(MIGRATIONS_DIR, name), "utf8");
    if (/create or replace function public\.yorisou_account_deletion_erase_database_unchecked/i.test(sql)) chosen = name;
  }
  assert.ok(chosen, "no migration defines yorisou_account_deletion_erase_database_unchecked");
  return { path: join(MIGRATIONS_DIR, chosen), sql: readFileSync(join(MIGRATIONS_DIR, chosen), "utf8") };
}

/** The plan as [table, column] pairs — the column matters, see the column-agreement test. */
function planEntries(sql: string): Array<{ table: string; column: string }> {
  const declaration = /v_plan\s+text\[\]\[\]\s*:=\s*array\[([\s\S]*?)\n\s*\];/.exec(sql);
  assert.ok(declaration, "could not find the v_plan array in the erasure function");
  return [...declaration[1].matchAll(/\['([a-z0-9_]+)'\s*,\s*'([a-z0-9_]+)'\]/g)].map((m) => ({
    table: m[1],
    column: m[2],
  }));
}

function planTables(sql: string): Set<string> {
  return new Set(planEntries(sql).map((entry) => entry.table));
}

test("the scanner sees every owner-linked table, regardless of how the SQL is formatted", () => {
  // The meta-test. The guard's coverage claim is only as good as its ability to SEE a table, and the
  // first version of this scanner silently missed every table written with several columns per line.
  // These shapes are the ones that actually occur in supabase/migrations plus the ones a reasonable
  // person would write next; if any becomes invisible the coverage test above turns into decoration.
  const SHAPES: Array<[string, string]> = [
    ["public-qualified, one column per line", `create table if not exists public.t (\n  id uuid,\n  owner_account_id text not null\n);`],
    ["no schema qualification", `create table if not exists t (\n  id uuid,\n  owner_account_id text not null\n);`],
    ["inside a do $$ block", `do $$ begin\n  create table public.t (\n    id uuid,\n    owner_account_id text not null\n  );\nend $$;`],
    ["several columns on one line", `create table public.t (id uuid primary key, owner_account_id text not null, created_at timestamptz);`],
    ["owner column immediately after the paren", `create table public.t (owner_account_id text not null, id uuid);`],
    ["quoted identifier", `create table if not exists public."t" (\n  id uuid,\n  owner_account_id text not null\n);`],
    ["uppercase SQL", `CREATE TABLE IF NOT EXISTS PUBLIC.T (\n  ID UUID,\n  OWNER_ACCOUNT_ID TEXT NOT NULL\n);`],
    ["newline before the paren", `create table if not exists public.t\n(\n  id uuid,\n  owner_account_id text not null\n);`],
    ["nested parens in a check constraint before the owner column",
      `create table public.t (\n  n integer check (n between 1 and 5),\n  owner_account_id text not null\n);`],
  ];
  for (const [name, sql] of SHAPES) {
    assert.ok(createdTablesWithOwnerColumn(sql).has("t"), `the scanner cannot see an owner column in: ${name}`);
  }
  // And it must NOT mistake a reference for a declaration.
  assert.equal(
    createdTablesWithOwnerColumn(`create table public.t (\n  id uuid references public.other (owner_account_id)\n);`).size,
    0,
    "a foreign-key reference to an owner column is not an owner column",
  );
});

test("every owner-linked table defined in supabase/migrations is registered for account erasure", () => {
  const plan = productionErasurePlanFile();
  const registered = planTables(plan.sql);
  const owned = everyOwnerLinkedTable();

  // Guards against the scan silently degrading to near-zero and passing vacuously. The repository had
  // 42 owner-linked tables when this bound was set; it is a floor, not an expectation.
  assert.ok(owned.size >= 40, `expected at least 40 owner-linked tables, found ${owned.size} — the scan is broken`);

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

test("every registered plan entry names a column that the table actually has", () => {
  // The plan is [table, column] pairs and the runtime SKIPS AN ENTRY IN SILENCE when the column does
  // not exist: 202608010110 does `if not exists (select 1 from information_schema.columns ...) then
  // v_counts := ... 'column_absent'; continue;`. So a typo in the column name produces a green
  // deletion job that erased nothing from that table. The previous version of this guard captured the
  // column and threw it away, which meant the one failure mode the runtime cannot catch was also the
  // one this test could not catch.
  const plan = productionErasurePlanFile();
  const owned = everyOwnerLinkedTable();
  const wrong: string[] = [];
  for (const { table, column } of planEntries(plan.sql)) {
    // The `*_owner_indirect` sentinels are handled by hand before the loop and name no real column.
    if (column.endsWith("_owner_indirect")) continue;
    const info = owned.get(table);
    if (!info) continue; // tables the migrations do not define here (absent-table skip is intended)
    if (!info.columns.includes(column)) {
      wrong.push(`${table} is registered with '${column}' but declares [${info.columns.join(", ")}] (${info.file})`);
    }
  }
  assert.deepEqual(
    wrong,
    [],
    `these plan entries name a column the table does not have, so erasure silently skips them:\n  ${wrong.join("\n  ")}`,
  );
});

test("every exemption names a table that actually exists, and carries a real justification", () => {
  // An exemption for a table nobody defines is a stale note that makes the list less trustworthy.
  const defined = everyOwnerLinkedTable();
  for (const [table, justification] of Object.entries(JUSTIFIED_EXEMPTIONS)) {
    assert.ok(defined.has(table), `exemption for ${table}, which no migration defines with an owner column`);
    // "written exemption" in the Founder's requirement means a reason someone can act on, not a
    // placeholder. A bare "n/a" or an empty string would satisfy the key check above.
    assert.ok(
      justification.trim().length >= 20,
      `the exemption for ${table} is too short to be a justification: ${JSON.stringify(justification)}`,
    );
  }
  // An exemption for a table that IS in the plan is contradictory — one of the two is wrong, and the
  // reader cannot tell which.
  const registered = planTables(productionErasurePlanFile().sql);
  const contradictory = Object.keys(JUSTIFIED_EXEMPTIONS).filter((table) => registered.has(table));
  assert.deepEqual(
    contradictory,
    [],
    `these tables are BOTH exempted and registered in v_plan; remove one: ${contradictory.join(", ")}`,
  );
});
