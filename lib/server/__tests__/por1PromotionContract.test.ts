// POR-1 M1-H — the promotion set is checked against its contract, on a machine with no database.
//
// WHAT THIS GUARDS.
//
// The promotion migrations are GENERATED. That removes one class of mistake (promoting a superseded
// function body) and introduces another: a generator can be changed, or its output hand-edited,
// without anyone noticing until the migration is applied to Production. So the checked-in SQL is
// asserted against the checked-in contract here, statically, and the compiler's own `--check` mode
// asserts the contract against the live Preview catalogue when a database is available.
//
// THE SPECIFIC DEFECT THAT MOTIVATES THE PRIVILEGE TESTS.
//
// Seven SECURITY DEFINER functions were executable by `anon` in Preview — including one that erases
// canonical identity links for any account id it is given. Two independent causes:
//
//   1. `202607310004` never wrote a function grant statement at all, so PostgreSQL's default
//      `EXECUTE TO PUBLIC` stood.
//   2. `202607310008` revoked from `anon` and `authenticated` — but NOT from PUBLIC. A revoke
//      against a role that holds the privilege only through PUBLIC succeeds and changes nothing.
//
// Both read like correct code. Neither is caught by "did the migration run". The `revoke ... from
// public` ORDERING test below is the one that would have caught the second.

import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = process.cwd();
const CONTRACT_PATH = "supabase/contracts/por1-promotion-contract.json";

type PromotedFunction = {
  name: string;
  signature: string;
  identity_args: string;
  result: string;
  language: string;
  security_definer: boolean;
  volatility: string;
  config: string;
  grants: string[];
  definition: string;
  hash: string;
};

type PromotedTable = {
  name: string;
  rls_enabled: boolean;
  rls_forced: boolean;
  columns: Array<{ name: string; type: string; not_null: boolean }>;
  constraints: Array<{ name: string; type: string; definition: string; validated: boolean }>;
  indexes: Array<{ name: string; definition: string }>;
  grants: string[];
};

type Contract = {
  tables: PromotedTable[];
  functions: PromotedFunction[];
  sequences: Array<{ name: string; type: string }>;
  triggers: Array<{ table: string; name: string; definition: string }>;
  counts: { tables: number; functions: number; sequences: number; triggers: number };
  migrations: Array<{ id: string; version: string; path: string }>;
  deferred_to_cross_domain: string[];
  production_only_deletion_families: string[];
};

const contract: Contract = JSON.parse(readFileSync(join(ROOT, CONTRACT_PATH), "utf8"));
const migrationSql = new Map<string, string>(
  contract.migrations.map((m) => [m.id, readFileSync(join(ROOT, m.path), "utf8")]),
);
const allSql = [...migrationSql.values()].join("\n");

// ── THE SHAPE OF THE PROMOTION ───────────────────────────────────────────────

test("the promotion is 15 tables, 75 functions, 2 sequences and 2 triggers", () => {
  // 75, not the 74 recorded earlier in this package: `yorisou_account_deletion_terminal_deidentify`
  // was added by 202607310008 after that count was taken.
  assert.equal(contract.counts.tables, 15);
  assert.equal(contract.counts.functions, 75);
  assert.equal(contract.counts.sequences, 2);
  assert.equal(contract.counts.triggers, 2);
  assert.equal(contract.tables.length, contract.counts.tables);
  assert.equal(contract.functions.length, contract.counts.functions);
});

test("every promotion migration file exists and is registered PRODUCTION_LINEAGE", () => {
  const manifest = readFileSync(join(ROOT, "supabase/MIGRATION_SCOPE_MANIFEST.md"), "utf8");
  const block = /```json\s*\n([\s\S]*?)\n```/.exec(manifest);
  assert.ok(block, "the scope manifest has a machine-readable json block");
  const entries: Array<{ path: string; scope: string }> = JSON.parse(block[1]);

  for (const migration of contract.migrations) {
    assert.ok(existsSync(join(ROOT, migration.path)), `${migration.path} exists`);
    const entry = entries.find((e) => e.path === migration.path);
    assert.ok(entry, `${migration.path} is classified in the scope manifest`);
    assert.equal(entry.scope, "PRODUCTION_LINEAGE", `${migration.path} is PRODUCTION_LINEAGE`);
    assert.ok(
      migration.path.startsWith("supabase/migrations/"),
      `${migration.path} lives in the Production migration directory`,
    );
  }
});

test("every promoted object is created by exactly one migration", () => {
  for (const table of contract.tables) {
    const creators = contract.migrations.filter((m) =>
      new RegExp(`create table if not exists public\\.${table.name}\\b`).test(migrationSql.get(m.id)!),
    );
    assert.equal(creators.length, 1, `${table.name} is created once (found ${creators.length})`);
  }
  for (const fn of contract.functions) {
    const creators = contract.migrations.filter((m) =>
      new RegExp(`CREATE OR REPLACE FUNCTION public\\.${fn.name}\\(`).test(migrationSql.get(m.id)!),
    );
    // Overloads share a name, so a name may legitimately be created by one migration twice.
    assert.equal(creators.length, 1, `${fn.signature} is created by one migration (found ${creators.length})`);
  }
});

// ── PRIVILEGE: THE PART THAT WAS ACTUALLY WRONG ──────────────────────────────

test("no promoted function is granted EXECUTE to anon, authenticated or PUBLIC", () => {
  for (const fn of contract.functions) {
    const roles = new Set(fn.grants.map((g) => g.split(":")[0]));
    for (const forbidden of ["anon", "authenticated", "PUBLIC"]) {
      assert.ok(!roles.has(forbidden), `${fn.signature} must not grant EXECUTE to ${forbidden}`);
    }
  }
});

test("every function's revoke block revokes from PUBLIC before anon — the ordering that makes it work", () => {
  // This is the defect, expressed as a test. `revoke ... from anon` when `anon` holds the privilege
  // only through PUBLIC succeeds, reports success, and leaves the function callable.
  for (const [id, sql] of migrationSql) {
    if (id === "P8") continue;
    const blocks = sql.split("do $$ begin").slice(1);
    for (const block of blocks) {
      const body = block.split("end $$;")[0];
      if (!/revoke all on function/.test(body)) continue;
      const publicAt = body.indexOf("from public");
      const anonAt = body.indexOf("from anon");
      assert.ok(publicAt >= 0, `${id}: a function revoke block that never revokes from public`);
      if (anonAt >= 0) {
        assert.ok(publicAt < anonAt, `${id}: revoke from public must precede revoke from anon`);
      }
    }
  }
});

test("every SECURITY DEFINER function fixes its search_path", () => {
  // Without it the caller chooses which schema the body's unqualified names resolve to, which is a
  // privilege-escalation shape rather than a style preference.
  for (const fn of contract.functions) {
    if (!fn.security_definer) continue;
    assert.match(fn.config, /search_path=/, `${fn.signature} must fix search_path`);
    assert.match(fn.definition, /SET search_path/i, `${fn.signature}'s body carries the setting`);
  }
});

test("yorisou_line_subject_lock stays an internal building block", () => {
  // 202607310002 states the reason: it takes a row lock and hands back a locked row. Granting it to
  // service_role would publish a lock primitive as an entry point.
  const lock = contract.functions.find((f) => f.name === "yorisou_line_subject_lock");
  assert.ok(lock, "the lock helper is part of the promotion");
  assert.ok(
    !lock.grants.some((g) => g.startsWith("service_role:")),
    "yorisou_line_subject_lock must not be granted to service_role",
  );

  const others = contract.functions.filter((f) => f.name !== "yorisou_line_subject_lock");
  for (const fn of others) {
    assert.ok(
      fn.grants.some((g) => g.startsWith("service_role:")),
      `${fn.signature} must be callable by the role the application connects as`,
    );
  }
});

test("no promoted table is granted to anon or authenticated", () => {
  for (const table of contract.tables) {
    const exposed = table.grants.filter((g) => /^(anon|authenticated|PUBLIC):/.test(g));
    assert.deepEqual(exposed, [], `${table.name} must not be granted to ${exposed.join(", ")}`);
  }
});

test("every promoted table enables and FORCES row-level security", () => {
  // With no policies defined, this is a deny-all for every role that does not bypass RLS; FORCE
  // extends it to the table owner, so a migration running as `postgres` cannot read around it.
  for (const table of contract.tables) {
    assert.equal(table.rls_enabled, true, `${table.name}: RLS enabled`);
    assert.equal(table.rls_forced, true, `${table.name}: FORCE RLS`);
    assert.match(
      allSql,
      new RegExp(`alter table public\\.${table.name} force row level security`),
      `${table.name}: the migration forces RLS`,
    );
  }
});

// ── THE PART PREVIEW COULD NEVER PROVE ───────────────────────────────────────

test("the deletion plan still names every Production-only family", () => {
  // These exist in Production and NOT in Preview. Every green Preview deletion run skipped them via
  // `to_regclass` without touching them, so the promoted bodies naming them is the only static
  // evidence there is. It is NOT evidence that they are erased — that needs the full-lineage
  // rehearsal, and nothing here substitutes for it.
  const deletionBodies = contract.functions
    .filter((f) => f.name.startsWith("yorisou_account_deletion_"))
    .map((f) => f.definition)
    .join("\n");

  assert.ok(contract.production_only_deletion_families.length >= 6);
  for (const family of contract.production_only_deletion_families) {
    assert.ok(deletionBodies.includes(family), `${family} is named by a promoted deletion function`);
    assert.ok(allSql.includes(family), `${family} survives into the emitted migration SQL`);
  }
});

test("the promoted deletion plan covers every Production account-owner-linked family", () => {
  // Cross-checked against the read-only Production catalogue snapshot, so a family that exists in
  // Production but is named by nothing cannot pass unnoticed.
  const families: { families: string[] } = JSON.parse(
    readFileSync(join(ROOT, "supabase/contracts/por1-production-owner-linked-families.json"), "utf8"),
  );
  assert.equal(families.families.length, 26, "the Production snapshot still lists 26 owner-linked families");
  const deletionBodies = contract.functions
    .filter((f) => f.name.startsWith("yorisou_account_deletion_"))
    .map((f) => f.definition)
    .join("\n");

  const uncovered = families.families.filter((t) => !deletionBodies.includes(t));
  assert.deepEqual(uncovered, [], `Production owner-linked families named by no deletion function: ${uncovered.join(", ")}`);
});

// ── NOTHING SUPERSEDED SNEAKS BACK IN ────────────────────────────────────────

test("the promoted bodies retain the corrections their superseded versions were replaced for", () => {
  // Each of these is a defect this package found and fixed in Preview. A promotion built from the
  // migration HISTORY rather than the final catalogue would reintroduce them, and the failure would
  // only show up as a race in Production.
  const body = (name: string) => {
    const fn = contract.functions.find((f) => f.name === name);
    assert.ok(fn, `${name} is part of the promotion`);
    return fn.definition;
  };

  // The deletion-open race: a second executor for the same owner must not be answered 500.
  assert.match(body("yorisou_account_deletion_open"), /unique_violation/, "deletion open handles the 23505 race");
  assert.match(body("yorisou_account_deletion_open"), /for update/i, "deletion open decides under a row lock");

  // Terminal de-identification refuses anything that already destroyed something.
  const deid = body("yorisou_account_deletion_terminal_deidentify");
  assert.match(deid, /irreversible_started_at is not null/, "refuses a post-crossing job");
  assert.match(deid, /for update/i, "re-evaluates eligibility under a row lock");

  // Identity-link synchronisation is additive; it must never retire a link it was not told about.
  assert.match(body("yorisou_identity_links_sync"), /link_state/, "sync reasons about link state");
});

test("the compiler recorded which functions it had to defer, and why that list is small", () => {
  // A function whose domain is created before the domain it reads cannot be created in its own
  // migration — PostgreSQL resolves relation names when a plpgsql body is compiled. Four functions
  // genuinely cross domains; if that number grows, the grouping has stopped matching the code.
  assert.deepEqual(contract.deferred_to_cross_domain, [
    "yorisou_account_deletion_erase_database",
    "yorisou_account_mutation_begin",
    "yorisou_account_mutation_gate_finalize",
    "yorisou_assessment_result_erase",
  ]);
  const crossDomain = contract.migrations.find((m) => m.id === "P7");
  assert.ok(crossDomain, "there is a cross-domain migration");
  for (const name of contract.deferred_to_cross_domain) {
    assert.match(
      migrationSql.get("P7")!,
      new RegExp(`CREATE OR REPLACE FUNCTION public\\.${name}\\(`),
      `${name} is created in the cross-domain migration`,
    );
  }
});

test("the contract assertion migration refuses an incomplete promotion", () => {
  const assertion = migrationSql.get("P8")!;
  assert.match(assertion, /POR-1 promotion incomplete — missing table/, "checks for missing tables");
  assert.match(assertion, /RLS not enabled and forced/, "checks RLS");
  assert.match(assertion, /SECURITY DEFINER without a fixed search_path/, "checks search_path");
  assert.match(assertion, /has_function_privilege\('anon'/, "checks anon reachability against resolved privileges");
  assert.match(assertion, /yorisou_line_subject_lock/, "checks the lock helper stays internal");
});

// ── ADDITIVE ONLY ────────────────────────────────────────────────────────────

test("the promotion never drops, alters or rewrites an existing Production object", () => {
  // The rollback story depends entirely on this: with the capability controls off, additive schema
  // is inert, so the Production incident response is to disable the capability and roll back the
  // application rather than to unwind the schema.
  //
  // FUNCTION BODIES ARE EXCLUDED, and the distinction matters. `insert into
  // public.yorisou_assessment_results` inside a promoted function is what that function does when
  // the application calls it later; the same text at migration top level would be the migration
  // writing rows during the release. Scanning the raw file conflates the two — this test failed on
  // its first run for exactly that reason.
  const executable = (sql: string) => sql.replace(/AS \$function\$[\s\S]*?\$function\$/g, "AS $function$ … $function$");
  const forbidden = [
    /\bdrop\s+table\b/i,
    /\bdrop\s+column\b/i,
    /\bdrop\s+function\b/i,
    // Anchored to a statement, not the bare word: `truncate` also appears as a PRIVILEGE NAME in
    // `grant ... truncate ... to service_role`, and the unanchored form flagged that as data
    // destruction.
    /(^|;|\n)\s*truncate\b/i,
    /\bdelete\s+from\b/i,
    /\bupdate\s+public\./i,
    /\binsert\s+into\s+public\./i,
    /\balter\s+table\s+public\.\w+\s+alter\s+column\b/i,
  ];
  for (const [id, sql] of migrationSql) {
    const top = executable(sql);
    assert.ok(!top.includes("$function$ … $function$") === false || id === "P8", `${id}: bodies were stripped`);
    for (const pattern of forbidden) {
      assert.ok(!pattern.test(top), `${id} contains a non-additive statement matching ${pattern}`);
    }
  }
});

test("every table statement is re-runnable after a partial failure", () => {
  for (const [id, sql] of migrationSql) {
    const creates = sql.match(/^create table [^\n]*/gim) ?? [];
    for (const statement of creates) {
      assert.match(statement, /create table if not exists/i, `${id}: ${statement}`);
    }
    const indexes = sql.match(/^create (unique )?index [^\n]*/gim) ?? [];
    for (const statement of indexes) {
      assert.match(statement, /if not exists/i, `${id}: ${statement}`);
    }
  }
});
