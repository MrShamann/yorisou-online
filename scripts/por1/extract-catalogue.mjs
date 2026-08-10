// POR-1 M1-A — read a live PostgreSQL catalogue into a sanitized, deterministic contract file.
//
// WHY A CONTRACT FILE AND NOT A pg_dump.
//
// The promotion set has to be reviewable by a human before it is allowed anywhere near Production,
// and it has to be checkable by CI on a machine with no database. A dump is neither: it is ordered by
// oid, it carries environment-specific noise, and it cannot be diffed meaningfully between two
// projects. So this reads the catalogue through stable, explicitly-ordered queries and normalizes
// every field that PostgreSQL is free to format differently.
//
// WHAT IT MUST NEVER CAPTURE: rows, credentials, tokens, personal data, environment values. It reads
// pg_catalog and information_schema only.
//
// Usage:
//   node scripts/por1/extract-catalogue.mjs --ref <project-ref> --out <file.json>
// Requires SUPABASE_ACCESS_TOKEN (read-only Management API query endpoint).

import { writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

import { normalizeDefinition } from "./normalize-sql.mjs";

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const REF = arg("--ref");
const DSN = arg("--dsn");
const OUT = arg("--out");
if ((!REF && !DSN) || !OUT) {
  console.error("usage: extract-catalogue.mjs (--ref <project-ref> | --dsn <database>) --out <file.json>");
  process.exit(2);
}

const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
if (REF && !TOKEN) {
  console.error("SUPABASE_ACCESS_TOKEN is required (read-only Management API)");
  process.exit(2);
}

// The Management API sits behind Cloudflare and returns transient 502s. A retry here is not papering
// over a failure — a 502 is not an answer, and treating it as one would silently truncate a contract.
// The local transport, used to read a disposable rehearsal database. Same queries, same
// normalization — a comparison is only meaningful if both sides were read the same way.
function queryLocal(sql) {
  const wrapped = `select coalesce(json_agg(t), '[]'::json) from (${sql.trim().replace(/;\s*$/, "")}) t`;
  const out = execFileSync("psql", ["-d", DSN, "-t", "-A", "-X", "-v", "ON_ERROR_STOP=1", "-c", wrapped], {
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
    env: { ...process.env, LC_ALL: "C" },
  });
  return JSON.parse(out.trim() || "[]");
}

async function query(sql) {
  if (DSN) return queryLocal(sql);
  let lastError = "";
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: sql }),
    });
    if (response.ok) return response.json();
    lastError = `${response.status} ${(await response.text()).slice(0, 200)}`;
    if (response.status >= 500) {
      await new Promise((r) => setTimeout(r, 800 * attempt));
      continue;
    }
    break;
  }
  throw new Error(`catalogue query failed: ${lastError}`);
}

// ── NORMALIZATION ───────────────────────────────────────────────────────────
//
// PostgreSQL is free to render the same definition several ways across versions and sessions. Every
// difference that survives here becomes a false diff between Preview and Production, so each of
// these is a deliberate erasure of formatting freedom, not of meaning.

/** Collapse runs of whitespace; strip trailing semicolons and surrounding blanks. */
const squash = (text) => String(text ?? "").replace(/\s+/g, " ").replace(/\s*;\s*$/, "").trim();

/**
 * Normalize a function definition for comparison.
 *
 * The body is NOT squashed — a `plpgsql` body's line structure is part of what a reviewer reads, and
 * flattening it would make the checked-in contract unreadable. Only the header noise that PostgreSQL
 * varies is normalized.
 */
function normalizeFunctionDef(def) {
  return String(def ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const sha = (text) => createHash("sha256").update(text).digest("hex");

// ── QUERIES ─────────────────────────────────────────────────────────────────
//
// Every query carries an explicit ORDER BY. Catalogue scans have no defined order, and an
// oid-ordered contract would change the moment an object is recreated — producing a spurious
// "contract drift" failure that trains people to ignore the guard.

const Q_TABLES = `
select c.relname as table_name,
       c.relrowsecurity as rls_enabled,
       c.relforcerowsecurity as rls_forced,
       pg_get_userbyid(c.relowner) as owner
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = 'public' and c.relkind = 'r'
 order by c.relname`;

const Q_COLUMNS = `
select c.relname as table_name,
       a.attname as column_name,
       a.attnum as ordinal,
       format_type(a.atttypid, a.atttypmod) as data_type,
       a.attnotnull as not_null,
       pg_get_expr(d.adbin, d.adrelid) as default_expr,
       a.attidentity as identity,
       a.attgenerated as generated
  from pg_attribute a
  join pg_class c on c.oid = a.attrelid
  join pg_namespace n on n.oid = c.relnamespace
  left join pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
 where n.nspname = 'public' and c.relkind = 'r' and a.attnum > 0 and not a.attisdropped
 order by c.relname, a.attnum`;

const Q_CONSTRAINTS = `
select c.relname as table_name,
       con.conname as constraint_name,
       con.contype as constraint_type,
       con.convalidated as validated,
       pg_get_constraintdef(con.oid) as definition
  from pg_constraint con
  join pg_class c on c.oid = con.conrelid
  join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = 'public' and c.relkind = 'r'
 order by c.relname, con.conname`;

const Q_INDEXES = `
select c.relname as table_name,
       i.relname as index_name,
       pg_get_indexdef(x.indexrelid) as definition,
       x.indisunique as is_unique,
       x.indisprimary as is_primary
  from pg_index x
  join pg_class c on c.oid = x.indrelid
  join pg_class i on i.oid = x.indexrelid
  join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = 'public' and c.relkind = 'r'
 order by c.relname, i.relname`;

const Q_POLICIES = `
select c.relname as table_name,
       p.polname as policy_name,
       p.polcmd as command,
       p.polpermissive as permissive,
       coalesce((select string_agg(pg_get_userbyid(r), ',' order by pg_get_userbyid(r))
                   from unnest(p.polroles) r), 'PUBLIC') as roles,
       pg_get_expr(p.polqual, p.polrelid) as using_expr,
       pg_get_expr(p.polwithcheck, p.polrelid) as check_expr
  from pg_policy p
  join pg_class c on c.oid = p.polrelid
  join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = 'public'
 order by c.relname, p.polname`;

const Q_TABLE_GRANTS = `
select table_name, grantee, privilege_type
  from information_schema.role_table_grants
 where table_schema = 'public'
 order by table_name, grantee, privilege_type`;

const Q_FUNCTIONS = `
select p.proname as function_name,
       pg_get_function_identity_arguments(p.oid) as identity_args,
       pg_get_function_arguments(p.oid) as full_args,
       pg_get_function_result(p.oid) as result_type,
       l.lanname as language,
       p.prosecdef as security_definer,
       p.provolatile as volatility,
       p.proparallel as parallel,
       p.proleakproof as leakproof,
       pg_get_userbyid(p.proowner) as owner,
       coalesce(array_to_string(p.proconfig, '|'), '') as config,
       pg_get_functiondef(p.oid) as definition
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  join pg_language l on l.oid = p.prolang
 where n.nspname = 'public' and p.prokind = 'f'
 order by p.proname, pg_get_function_identity_arguments(p.oid)`;

const Q_FUNCTION_GRANTS = `
select p.proname as function_name,
       pg_get_function_identity_arguments(p.oid) as identity_args,
       a.grantee, a.privilege_type
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  cross join lateral aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) ax
  join lateral (select pg_get_userbyid(ax.grantee) as grantee,
                       ax.privilege_type as privilege_type) a on true
 where n.nspname = 'public' and p.prokind = 'f'
 order by p.proname, pg_get_function_identity_arguments(p.oid), a.grantee, a.privilege_type`;

// Sequences that are NOT owned by an identity/serial column — i.e. free-standing counters the
// application advances itself. These are easy to miss in a promotion: nothing references them in
// pg_depend from the table side, so a table-and-function diff reports a complete contract while
// every `nextval` call fails at runtime.
const Q_SEQUENCES = `
select c.relname as sequence_name,
       s.seqtypid::regtype::text as data_type,
       s.seqstart as start_value,
       s.seqincrement as increment,
       s.seqmin as min_value,
       s.seqmax as max_value,
       s.seqcache as cache,
       s.seqcycle as cycle,
       pg_get_userbyid(c.relowner) as owner,
       coalesce((select string_agg(a.grantee || ':' || a.privilege_type, ',' order by a.grantee, a.privilege_type)
                   from information_schema.role_usage_grants a
                  where a.object_schema = 'public' and a.object_name = c.relname), '') as usage_grants
  from pg_sequence s
  join pg_class c on c.oid = s.seqrelid
  join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = 'public'
 order by c.relname`;

const Q_TRIGGERS = `
select c.relname as table_name,
       t.tgname as trigger_name,
       pg_get_triggerdef(t.oid) as definition
  from pg_trigger t
  join pg_class c on c.oid = t.tgrelid
  join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = 'public' and not t.tgisinternal
 order by c.relname, t.tgname`;

const Q_EXTENSIONS = `select extname from pg_extension order by extname`;

// Table -> table foreign-key edges, for the dependency graph.
const Q_FK_EDGES = `
select c.relname as child, rc.relname as parent, con.conname as constraint_name
  from pg_constraint con
  join pg_class c on c.oid = con.conrelid
  join pg_class rc on rc.oid = con.confrelid
  join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = 'public' and con.contype = 'f'
 order by c.relname, rc.relname, con.conname`;

async function main() {
  const [
    tables, columns, constraints, indexes, policies, tableGrants,
    functions, functionGrants, fkEdges, sequences, triggers, extensions,
  ] = await Promise.all([
    query(Q_TABLES),
    query(Q_COLUMNS),
    query(Q_CONSTRAINTS),
    query(Q_INDEXES),
    query(Q_POLICIES),
    query(Q_TABLE_GRANTS),
    query(Q_FUNCTIONS),
    query(Q_FUNCTION_GRANTS),
    query(Q_FK_EDGES),
    query(Q_SEQUENCES),
    query(Q_TRIGGERS),
    query(Q_EXTENSIONS),
  ]);

  const group = (rows, key) => {
    const out = new Map();
    for (const row of rows) {
      const k = row[key];
      if (!out.has(k)) out.set(k, []);
      out.get(k).push(row);
    }
    return out;
  };

  const colsBy = group(columns, "table_name");
  const consBy = group(constraints, "table_name");
  const idxBy = group(indexes, "table_name");
  const polBy = group(policies, "table_name");
  const grantBy = group(tableGrants, "table_name");

  const tableContracts = tables.map((t) => {
    const contract = {
      name: t.table_name,
      owner: t.owner,
      rls_enabled: t.rls_enabled,
      rls_forced: t.rls_forced,
      columns: (colsBy.get(t.table_name) ?? []).map((c) => ({
        name: c.column_name,
        ordinal: c.ordinal,
        type: squash(c.data_type),
        not_null: c.not_null,
        default: c.default_expr ? squash(c.default_expr) : null,
        identity: c.identity || null,
        generated: c.generated || null,
      })),
      constraints: (consBy.get(t.table_name) ?? []).map((c) => ({
        name: c.constraint_name,
        type: c.constraint_type,
        validated: c.validated,
        definition: normalizeDefinition(c.definition),
      })),
      indexes: (idxBy.get(t.table_name) ?? []).map((i) => ({
        name: i.index_name,
        unique: i.is_unique,
        primary: i.is_primary,
        definition: normalizeDefinition(i.definition),
      })),
      policies: (polBy.get(t.table_name) ?? []).map((p) => ({
        name: p.policy_name,
        command: p.command,
        permissive: p.permissive,
        roles: p.roles,
        using: p.using_expr ? squash(p.using_expr) : null,
        with_check: p.check_expr ? squash(p.check_expr) : null,
      })),
      grants: [
        ...new Set((grantBy.get(t.table_name) ?? []).map((g) => `${g.grantee}:${g.privilege_type}`)),
      ].sort(),
    };
    contract.hash = sha(JSON.stringify(contract));
    return contract;
  });

  const fnGrantBy = new Map();
  for (const g of functionGrants) {
    const k = `${g.function_name}(${g.identity_args})`;
    if (!fnGrantBy.has(k)) fnGrantBy.set(k, new Set());
    fnGrantBy.get(k).add(`${g.grantee}:${g.privilege_type}`);
  }

  const functionContracts = functions.map((f) => {
    const signature = `${f.function_name}(${f.identity_args})`;
    const definition = normalizeFunctionDef(f.definition);
    const contract = {
      name: f.function_name,
      signature,
      identity_args: f.identity_args,
      full_args: f.full_args,
      result: squash(f.result_type),
      language: f.language,
      security_definer: f.security_definer,
      // 'i' immutable · 's' stable · 'v' volatile
      volatility: f.volatility,
      parallel: f.parallel,
      leakproof: f.leakproof,
      owner: f.owner,
      config: f.config,
      grants: [...(fnGrantBy.get(signature) ?? [])].sort(),
      definition,
    };
    contract.hash = sha(definition);
    return contract;
  });

  const catalogue = {
    // No project ref, no host, no credential — the contract must be safe to check in and safe to
    // compare across environments.
    schema: "public",
    extracted_by: "scripts/por1/extract-catalogue.mjs",
    counts: {
      tables: tableContracts.length,
      functions: functionContracts.length,
      sequences: sequences.length,
      triggers: triggers.length,
      policies: policies.length,
      indexes: indexes.length,
    },
    extensions: extensions.map((e) => e.extname),
    tables: tableContracts,
    functions: functionContracts,
    sequences: sequences.map((s) => ({
      name: s.sequence_name,
      type: s.data_type,
      start: String(s.start_value),
      increment: String(s.increment),
      min: String(s.min_value),
      max: String(s.max_value),
      cache: String(s.cache),
      cycle: s.cycle,
      owner: s.owner,
      usage_grants: s.usage_grants,
    })),
    triggers: triggers.map((t) => ({
      table: t.table_name,
      name: t.trigger_name,
      definition: squash(t.definition),
    })),
    fk_edges: fkEdges.map((e) => ({ child: e.child, parent: e.parent, constraint: e.constraint_name })),
  };

  // The whole-catalogue hash covers structure only — never the extraction environment.
  catalogue.catalogue_hash = sha(
    JSON.stringify({
      tables: tableContracts.map((t) => [t.name, t.hash]),
      functions: functionContracts.map((f) => [f.signature, f.hash]),
      sequences: catalogue.sequences.map((s) => [s.name, s.type, s.start, s.increment]),
      triggers: catalogue.triggers.map((t) => [t.table, t.name, t.definition]),
    }),
  );

  writeFileSync(OUT, `${JSON.stringify(catalogue, null, 2)}\n`);
  console.log(
    JSON.stringify({
      out: OUT,
      tables: catalogue.counts.tables,
      functions: catalogue.counts.functions,
      policies: catalogue.counts.policies,
      indexes: catalogue.counts.indexes,
      sequences: catalogue.counts.sequences,
      triggers: catalogue.counts.triggers,
      catalogue_hash: catalogue.catalogue_hash.slice(0, 16),
    }),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
