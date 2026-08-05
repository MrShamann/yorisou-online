// POR-1 M3 — the EFFECTIVE privilege matrix.
//
// WHY THIS CANNOT BE READ OFF THE MIGRATIONS.
//
// This package has already been wrong twice about privileges in ways the SQL text did not reveal.
// `revoke ... from anon` reads like a denial and does nothing at all when the privilege is held
// through PUBLIC — seven SECURITY DEFINER functions were anon-callable in Preview while every
// migration looked correct. And `202607110003` grants nothing to service_role because the hosted
// platform already had, which is invisible in the file and fatal in a bare database.
//
// So every row here comes from `has_*_privilege`, which resolves inheritance, defaults and PUBLIC.
// Nothing is inferred from a `grant` statement.
//
//   node scripts/por1/effective-privilege-matrix.mjs --dsn <database> --out <file.json>

import { execFileSync } from "node:child_process";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";

const args = process.argv.slice(2);
const arg = (n) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : undefined;
};
const DSN = arg("--dsn");
const OUT = arg("--out") ?? "docs/ux2r/evidence/por1-m3-effective-privilege-matrix.json";
const CONTRACT = arg("--contract") ?? "supabase/contracts/por1-promotion-contract.json";
if (!DSN) {
  console.error("usage: effective-privilege-matrix.mjs --dsn <database> [--out <file>]");
  process.exit(2);
}

const q = (sql) =>
  JSON.parse(
    execFileSync("psql", [DSN, "-t", "-A", "-X", "-v", "ON_ERROR_STOP=1", "-c",
      `select coalesce(json_agg(t), '[]'::json) from (${sql.trim().replace(/;\s*$/, "")}) t`],
      { encoding: "utf8", maxBuffer: 256 * 1024 * 1024, env: { ...process.env, LC_ALL: "C" } },
    ).trim() || "[]",
  );



// ── TABLES ───────────────────────────────────────────────────────────────────
//
// `has_table_privilege` is asked per privilege because a role may hold SELECT and not INSERT, and a
// single boolean would hide exactly the asymmetry the promoted contract encodes: six tables are
// SELECT-only for service_role on purpose.
const tables = q(`
  select c.relname as table_name,
         c.relrowsecurity as rls_enabled,
         c.relforcerowsecurity as rls_forced,
         r.rolname as role,
         has_table_privilege(r.rolname, c.oid, 'SELECT') as sel,
         has_table_privilege(r.rolname, c.oid, 'INSERT') as ins,
         has_table_privilege(r.rolname, c.oid, 'UPDATE') as upd,
         has_table_privilege(r.rolname, c.oid, 'DELETE') as del,
         r.rolbypassrls as bypassrls
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    cross join (select rolname, rolbypassrls from pg_roles
                 where rolname in ('anon','authenticated','service_role')) r
   where n.nspname = 'public' and c.relkind = 'r' and c.relname like 'yorisou%'
   order by c.relname, r.rolname`);

// ── FUNCTIONS ────────────────────────────────────────────────────────────────
//
// Asked by OID against the real signature, and including PUBLIC — because PUBLIC is how the earlier
// hole was actually held, and a matrix that omits it would have shown all-clear.
const functions = q(`
  select p.proname as function_name,
         p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')' as signature,
         p.prosecdef as security_definer,
         coalesce(array_to_string(p.proconfig, ','), '') as config,
         r.rolname as role,
         has_function_privilege(r.rolname, p.oid, 'EXECUTE') as can_execute
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    cross join (select rolname from pg_roles
                 where rolname in ('anon','authenticated','service_role')
                union all select 'public') r
   where n.nspname = 'public' and p.prokind = 'f' and p.proname like 'yorisou%'
   order by p.proname, r.rolname`);

const sequences = q(`
  select c.relname as sequence_name, r.rolname as role,
         has_sequence_privilege(r.rolname, c.oid, 'USAGE') as usage,
         has_sequence_privilege(r.rolname, c.oid, 'SELECT') as sel
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    cross join (select rolname from pg_roles
                 where rolname in ('anon','authenticated','service_role')) r
   where n.nspname = 'public' and c.relkind = 'S'
   order by c.relname, r.rolname`);

// ── THE PROMOTED SET, so findings can be scoped to what this release adds ────
const contract = JSON.parse(readFileSync(CONTRACT, "utf8"));
const promotedTables = new Set(contract.tables.map((t) => t.name));
const promotedFunctions = new Set(contract.functions.map((f) => f.signature));
const noServiceRoleExecute = new Set(["yorisou_line_subject_lock"]);

const findings = [];
const add = (severity, subject, detail) => findings.push({ severity, subject, detail });

// ── THE NEGATIVE PROOFS ──────────────────────────────────────────────────────

for (const row of functions) {
  const promoted = promotedFunctions.has(row.signature);
  if (!promoted) continue;

  if (row.security_definer && row.role !== "service_role" && row.can_execute) {
    add("CRITICAL", row.signature, `${row.role} can EXECUTE a SECURITY DEFINER function`);
  }
  if (row.security_definer && !/search_path=/.test(row.config)) {
    add("CRITICAL", row.signature, "SECURITY DEFINER without a fixed search_path");
  }
  if (row.role === "service_role") {
    const shouldExecute = !noServiceRoleExecute.has(row.function_name);
    if (row.can_execute !== shouldExecute) {
      add(
        shouldExecute ? "HIGH" : "HIGH",
        row.signature,
        shouldExecute
          ? "service_role cannot EXECUTE a function the application needs"
          : "service_role can EXECUTE an internal building block that must not be an entry point",
      );
    }
  }
}

// RLS is a property of the TABLE, but the query returns one row per role, so it would otherwise be
// reported three times and inflate the finding count.
const rlsReported = new Set();
for (const row of tables) {
  if (!promotedTables.has(row.table_name)) continue;
  if ((!row.rls_enabled || !row.rls_forced) && !rlsReported.has(row.table_name)) {
    rlsReported.add(row.table_name);
    add("CRITICAL", row.table_name, `RLS enabled=${row.rls_enabled} forced=${row.rls_forced}`);
  }
  if (row.role !== "service_role" && (row.sel || row.ins || row.upd || row.del)) {
    add("CRITICAL", row.table_name, `${row.role} holds a table privilege on a promoted table`);
  }
}

for (const row of sequences) {
  if (row.role === "service_role") continue;
  if (row.usage || row.sel) {
    add("HIGH", row.sequence_name, `${row.role} holds a sequence privilege`);
  }
}

// BYPASSRLS is real and worth stating plainly: it does not grant table privileges, so write denial
// for service_role rests on GRANTS. A matrix that implied RLS was the protection would be wrong.
const serviceRole = tables.find((t) => t.role === "service_role");
const bypassNote = serviceRole?.bypassrls
  ? "service_role carries BYPASSRLS (Supabase parity). RLS is therefore NOT what denies it — GRANTS are, and the privilege check runs before RLS."
  : "service_role does not carry BYPASSRLS in this database, which differs from hosted Supabase.";

const summary = {
  contract: "por1-m3-effective-privilege-matrix",
  note: "Every row from has_table_privilege / has_function_privilege / has_sequence_privilege, which resolve inheritance, defaults and PUBLIC. No row is inferred from a grant statement.",
  bypassrls: bypassNote,
  counts: {
    promotedTables: promotedTables.size,
    promotedFunctions: promotedFunctions.size,
    tableRows: tables.length,
    functionRows: functions.length,
    sequenceRows: sequences.length,
  },
  anonExecutableDefiner: functions.filter((f) => f.role === "anon" && f.security_definer && f.can_execute).length,
  authenticatedExecutableDefiner: functions.filter((f) => f.role === "authenticated" && f.security_definer && f.can_execute).length,
  publicExecutableDefiner: functions.filter((f) => f.role === "public" && f.security_definer && f.can_execute).length,
  findings,
  tables,
  functions,
  sequences,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(summary, null, 2)}\n`);

console.log(JSON.stringify({
  out: OUT,
  ...summary.counts,
  anonExecutableDefiner: summary.anonExecutableDefiner,
  authenticatedExecutableDefiner: summary.authenticatedExecutableDefiner,
  publicExecutableDefiner: summary.publicExecutableDefiner,
  findings: findings.length,
}, null, 2));
for (const f of findings) console.error(`  ${f.severity} ${f.subject}: ${f.detail}`);
if (findings.length > 0) process.exit(1);
console.log("\nno effective-privilege finding");
