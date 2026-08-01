// POR-1 M1-C — compile the Preview→Production delta into static, reviewable migrations.
//
// WHAT THIS IS FOR.
//
// The promotion set must be SQL a human can read before it is allowed near Production, and SQL that
// CI can check on a machine with no database. So this is a generator, not a runtime differ: it reads
// two sanitized catalogue contracts and writes .sql files that are then checked in, reviewed, and
// applied by the ordinary migration path. After this runs, nothing about the release depends on it.
//
// WHY GENERATE RATHER THAN HAND-WRITE.
//
// The Preview lineage is 24 migrations of `create or replace`. Only the LAST definition of each
// function is live, so hand-copying from the migration history would promote bodies that were
// already replaced — including the ones replaced BECAUSE they were wrong. Deriving from the final
// catalogue makes that class of mistake impossible.
//
// WHAT IT REFUSES TO DO.
//
//   - copy grants verbatim (the Preview grants had a real hole; see 202608010001)
//   - emit an object it cannot place in a reviewed group
//   - emit a migration that references something a later migration creates
//   - emit anything for an object that already exists in Production
//
// Usage:
//   node scripts/por1/compile-promotion.mjs --preview <a.json> --production <b.json> --out-dir supabase/migrations
//   node scripts/por1/compile-promotion.mjs ... --check    (emit to memory; fail on any drift)

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, isAbsolute } from "node:path";
import { createHash } from "node:crypto";

import {
  GROUPS,
  SEQUENCE_GROUP,
  NO_SERVICE_ROLE_EXECUTE,
  PRODUCTION_ONLY_DELETION_FAMILIES,
  groupForTable,
  groupForFunction,
} from "./promotion-plan.mjs";

const args = process.argv.slice(2);
const arg = (n) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : undefined;
};
const CHECK = args.includes("--check");

const PREVIEW = arg("--preview");
const PRODUCTION = arg("--production");
const OUT_DIR = arg("--out-dir") ?? "supabase/migrations";
// Version prefixes are fixed, not clock-derived: a generator that stamps `now()` produces a
// different filename on every run, which would make the reproducibility gate unfalsifiable.
const VERSION_BASE = arg("--version-base") ?? "2026080101";

if (!PREVIEW || !PRODUCTION) {
  console.error("usage: compile-promotion.mjs --preview <a.json> --production <b.json> [--out-dir d] [--check]");
  process.exit(2);
}

const preview = JSON.parse(readFileSync(PREVIEW, "utf8"));
const production = JSON.parse(readFileSync(PRODUCTION, "utf8"));
const sha = (t) => createHash("sha256").update(t).digest("hex");

const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
};

// ── THE DELTA ───────────────────────────────────────────────────────────────

const prodTables = new Set(production.tables.map((t) => t.name));
const prodFunctions = new Set(production.functions.map((f) => f.signature));
const prodSequences = new Set(production.sequences.map((s) => s.name));
const prodTriggers = new Set(production.triggers.map((t) => `${t.table}.${t.name}`));

const newTables = preview.tables.filter((t) => !prodTables.has(t.name));
const newFunctions = preview.functions.filter((f) => !prodFunctions.has(f.signature));
const newSequences = preview.sequences.filter((s) => !prodSequences.has(s.name));
const newTriggers = preview.triggers.filter((t) => !prodTriggers.has(`${t.table}.${t.name}`));

// A function that exists in BOTH with a different body is not a promotion — it is a change to
// something Production already runs, and it must be decided deliberately rather than swept along.
const drifted = preview.functions.filter((f) => {
  const match = production.functions.find((p) => p.signature === f.signature);
  return match && match.hash !== f.hash;
});
if (drifted.length > 0) {
  fail(`function(s) exist in Production with a DIFFERENT body — not promotable as new: ${drifted.map((d) => d.signature).join(", ")}`);
}

// Extensions the promotion needs but Production lacks.
const missingExtensions = preview.extensions.filter((e) => !production.extensions.includes(e));
if (missingExtensions.length > 0) {
  fail(`Preview uses extension(s) absent from Production: ${missingExtensions.join(", ")}`);
}

// ── PLACEMENT ───────────────────────────────────────────────────────────────

const placement = new Map(GROUPS.map((g) => [g.id, { group: g, tables: [], functions: [], sequences: [], triggers: [] }]));

for (const table of newTables) {
  const group = groupForTable(table.name);
  if (!group) { fail(`table ${table.name} is not placed in any promotion group`); continue; }
  placement.get(group.id).tables.push(table);
}
for (const fn of newFunctions) {
  const group = groupForFunction(fn.name);
  if (!group) { fail(`function ${fn.signature} is not placed in any promotion group`); continue; }
  placement.get(group.id).functions.push(fn);
}
for (const seq of newSequences) {
  const target = SEQUENCE_GROUP[seq.name];
  if (!target || !placement.has(target)) {
    fail(`sequence ${seq.name} has no reviewed group in SEQUENCE_GROUP — add it to scripts/por1/promotion-plan.mjs`);
    continue;
  }
  placement.get(target).sequences.push(seq);
}
for (const trigger of newTriggers) {
  const group = groupForTable(trigger.table);
  if (!group) { fail(`trigger ${trigger.table}.${trigger.name} is on an unplaced table`); continue; }
  placement.get(group.id).triggers.push(trigger);
}

// ── THE REFERENCE GRAPH, AND THE ORDERING CLAIM IT HAS TO SUPPORT ───────────
//
// pg_depend does not record what a plpgsql body calls. So the graph is built by scanning
// definitions for promoted object names. A textual scan can only ever OVER-report (a name inside a
// comment or an error string counts), and over-reporting is the safe direction: it can force an
// unnecessary ordering constraint, never permit a missing one.

const promotedNames = [
  ...newTables.map((t) => t.name),
  ...newFunctions.map((f) => f.name),
  ...newSequences.map((s) => s.name),
];
const groupIndex = new Map(GROUPS.map((g, i) => [g.id, i]));

function referencedPromotedNames(text) {
  const found = new Set();
  for (const name of promotedNames) {
    // Word-boundary match so `yorisou_identity_link_owner` does not count as a reference to
    // `yorisou_identity_links_*`.
    if (new RegExp(`\\b${name}\\b`).test(text)) found.add(name);
  }
  return found;
}

const ownerGroupOf = new Map();
for (const [id, bucket] of placement) {
  for (const t of bucket.tables) ownerGroupOf.set(t.name, id);
  for (const f of bucket.functions) ownerGroupOf.set(f.name, id);
  for (const s of bucket.sequences) ownerGroupOf.set(s.name, id);
}

// A plpgsql body is NOT a free pass. PostgreSQL compiles it at CREATE time (check_function_bodies
// defaults to on) and resolves every relation it names, so a function cannot be created before the
// tables it reads — regardless of language. That is a genuine constraint and it produces genuine
// cycles: the mutation fence consults deletion jobs, and deletion consults the mutation gates.
//
// Rather than flatten the domain grouping to work around it, functions that reach FORWARD are
// deferred to the cross-domain migration that runs after every table exists. The deferral is a
// fixpoint — deferring one function can push another forward — and it is computed here rather than
// hand-maintained, so the grouping stays honest as the contract changes.

const CROSS_DOMAIN = "P7";
const deferred = new Set();

function computeForwardEdges() {
  const edges = [];
  const groupOf = (name) => (deferred.has(name) ? CROSS_DOMAIN : ownerGroupOf.get(name));
  for (const [id, bucket] of placement) {
    for (const f of bucket.functions) {
      const here = groupIndex.get(deferred.has(f.name) ? CROSS_DOMAIN : id);
      for (const ref of referencedPromotedNames(f.definition)) {
        if (ref === f.name) continue;
        const target = groupOf(ref);
        if (target === undefined) continue;
        if (groupIndex.get(target) > here) edges.push({ fn: f, from: id, ref, to: target });
      }
    }
  }
  return edges;
}

for (let pass = 0; pass < 12; pass += 1) {
  const edges = computeForwardEdges().filter((e) => !deferred.has(e.fn.name));
  if (edges.length === 0) break;
  for (const edge of edges) deferred.add(edge.fn.name);
}

const stillForward = computeForwardEdges();
if (stillForward.length > 0) {
  const unique = [...new Set(stillForward.map((r) => `${r.fn.signature} -> ${r.ref}`))];
  fail(`unresolvable forward reference(s) after deferral:\n    ${unique.join("\n    ")}`);
}

// Move the deferred functions, and any trigger whose function moved with them.
for (const [id, bucket] of placement) {
  if (id === CROSS_DOMAIN) continue;
  const moving = bucket.functions.filter((f) => deferred.has(f.name));
  bucket.functions = bucket.functions.filter((f) => !deferred.has(f.name));
  placement.get(CROSS_DOMAIN).functions.push(...moving);

  const movingTriggers = bucket.triggers.filter((t) =>
    [...deferred].some((name) => new RegExp(`\\b${name}\\b`).test(t.definition)),
  );
  bucket.triggers = bucket.triggers.filter((t) => !movingTriggers.includes(t));
  placement.get(CROSS_DOMAIN).triggers.push(...movingTriggers);
}

// Table DDL still has HARD requirements that no deferral can fix: a foreign key, a default or an
// index expression is resolved when its statement runs, and it cannot wait.
const hardForward = [];
for (const [id, bucket] of placement) {
  const here = groupIndex.get(id);
  const check = (bin, label, text, self) => {
    for (const ref of referencedPromotedNames(text)) {
      if (ref === self) continue;
      const refGroup = deferred.has(ref) ? CROSS_DOMAIN : ownerGroupOf.get(ref);
      if (refGroup === undefined) continue;
      if (groupIndex.get(refGroup) > here) bin.push({ from: `${id}:${label}`, to: `${refGroup}:${ref}` });
    }
  };
  for (const t of bucket.tables) {
    for (const c of t.constraints) check(hardForward, `${t.name}.${c.name}`, c.definition, t.name);
    for (const cx of t.columns) if (cx.default) check(hardForward, `${t.name}.${cx.name}`, cx.default, t.name);
    for (const ix of t.indexes) check(hardForward, `${t.name}.${ix.name}`, ix.definition, t.name);
  }
  for (const tr of bucket.triggers) check(hardForward, `${tr.table}.${tr.name}`, tr.definition, tr.table);
}

if (hardForward.length > 0) {
  const unique = [...new Set(hardForward.map((r) => `${r.from} -> ${r.to}`))];
  fail(`${unique.length} HARD forward reference(s) — this migration would not apply:\n    ${unique.join("\n    ")}`);
}

// ── THE OVERLAY THAT PREVIEW CANNOT PROVE ───────────────────────────────────
//
// The deletion bodies name Production tables that do not exist in Preview and guard each with
// `to_regclass`. Preview therefore skips them and no green Preview run has ever exercised them. The
// least this compiler can do is refuse to emit a deletion body that has stopped naming one.

const deletionBodies = newFunctions
  .filter((f) => f.name.startsWith("yorisou_account_deletion_"))
  .map((f) => f.definition)
  .join("\n");
const missingOverlay = PRODUCTION_ONLY_DELETION_FAMILIES.filter((t) => !deletionBodies.includes(t));
if (missingOverlay.length > 0) {
  fail(`Production-only deletion families no longer named by any promoted deletion function: ${missingOverlay.join(", ")}`);
}

// ── EMISSION ────────────────────────────────────────────────────────────────

const q = (name) => `public.${name}`;

/** Table grants, DERIVED from Preview but re-expressed in the locked-down pattern. */
function tableGrantSql(table) {
  const servicePrivs = table.grants
    .filter((g) => g.startsWith("service_role:"))
    .map((g) => g.split(":")[1])
    .sort();
  const lines = [
    `revoke all on table ${q(table.name)} from public;`,
    `do $$ begin`,
    `  if exists (select 1 from pg_roles where rolname = 'anon') then`,
    `    execute 'revoke all on table ${q(table.name)} from anon';`,
    `  end if;`,
    `  if exists (select 1 from pg_roles where rolname = 'authenticated') then`,
    `    execute 'revoke all on table ${q(table.name)} from authenticated';`,
    `  end if;`,
  ];
  if (servicePrivs.length > 0) {
    lines.push(
      `  if exists (select 1 from pg_roles where rolname = 'service_role') then`,
      `    execute 'grant ${servicePrivs.join(", ").toLowerCase()} on table ${q(table.name)} to service_role';`,
      `  end if;`,
    );
  }
  lines.push(`end $$;`);
  return lines.join("\n");
}

function tableSql(table) {
  const out = [];
  out.push(`-- ${table.name}`);
  const cols = table.columns.map((c) => {
    let line = `  ${c.name} ${c.type}`;
    if (c.identity) line += c.identity === "a" ? " generated always as identity" : " generated by default as identity";
    if (c.default && !c.identity) line += ` default ${c.default}`;
    if (c.not_null) line += " not null";
    return line;
  });
  out.push(`create table if not exists ${q(table.name)} (\n${cols.join(",\n")}\n);`);

  // Constraints are added separately and idempotently: an inline definition cannot be re-run, and a
  // migration that cannot be re-run after a partial failure is a migration that needs a human at
  // 3am.
  for (const c of table.constraints) {
    out.push(
      [
        `do $$ begin`,
        `  if not exists (select 1 from pg_constraint where conname = '${c.name}' and conrelid = '${q(table.name)}'::regclass) then`,
        `    alter table ${q(table.name)} add constraint ${c.name} ${c.definition};`,
        `  end if;`,
        `end $$;`,
      ].join("\n"),
    );
  }

  // Indexes that back a primary key or unique constraint are created by the constraint itself.
  const constraintBacked = new Set(table.constraints.filter((c) => c.type === "p" || c.type === "u").map((c) => c.name));
  for (const index of table.indexes) {
    if (constraintBacked.has(index.name)) continue;
    const def = index.definition
      .replace(/^CREATE INDEX /, "create index if not exists ")
      .replace(/^CREATE UNIQUE INDEX /, "create unique index if not exists ");
    out.push(`${def};`);
  }

  // RLS is not decoration here: with no policies defined, enabling it is a deny-all for every role
  // that does not bypass it, and FORCE extends that to the table owner.
  out.push(`alter table ${q(table.name)} enable row level security;`);
  if (table.rls_forced) out.push(`alter table ${q(table.name)} force row level security;`);
  out.push(tableGrantSql(table));
  return out.join("\n\n");
}

function sequenceSql(seq) {
  return [
    `create sequence if not exists ${q(seq.name)} as ${seq.type} increment by ${seq.increment} start with ${seq.start}${seq.cycle ? " cycle" : " no cycle"};`,
    // Supabase's ALTER DEFAULT PRIVILEGES grants USAGE on new sequences to anon and authenticated.
    // The tables are locked down, so leaving the counter open would be an odd inconsistency rather
    // than a hole — but a promotion set whose posture depends on platform defaults is not a
    // contract.
    `do $$ begin`,
    `  execute 'revoke all on sequence ${q(seq.name)} from public';`,
    `  if exists (select 1 from pg_roles where rolname = 'anon') then`,
    `    execute 'revoke all on sequence ${q(seq.name)} from anon';`,
    `  end if;`,
    `  if exists (select 1 from pg_roles where rolname = 'authenticated') then`,
    `    execute 'revoke all on sequence ${q(seq.name)} from authenticated';`,
    `  end if;`,
    `  if exists (select 1 from pg_roles where rolname = 'service_role') then`,
    `    execute 'grant usage, select on sequence ${q(seq.name)} to service_role';`,
    `  end if;`,
    `end $$;`,
  ].join("\n");
}

function functionSql(fn) {
  const body = fn.definition.endsWith(";") ? fn.definition : `${fn.definition};`;
  const sig = `${q(fn.name)}(${fn.identity_args})`;
  const grants = [
    `do $$ begin`,
    // PUBLIC FIRST — this is the ordering whose absence produced the anon-executable
    // SECURITY DEFINER functions repaired by 202608010001. A revoke from `anon` does nothing while
    // PUBLIC still holds the privilege.
    `  execute 'revoke all on function ${sig} from public';`,
    `  if exists (select 1 from pg_roles where rolname = 'anon') then`,
    `    execute 'revoke all on function ${sig} from anon';`,
    `  end if;`,
    `  if exists (select 1 from pg_roles where rolname = 'authenticated') then`,
    `    execute 'revoke all on function ${sig} from authenticated';`,
    `  end if;`,
  ];
  if (!NO_SERVICE_ROLE_EXECUTE.has(fn.name)) {
    grants.push(
      `  if exists (select 1 from pg_roles where rolname = 'service_role') then`,
      `    execute 'grant execute on function ${sig} to service_role';`,
      `  end if;`,
    );
  } else {
    grants.push(
      `  -- deliberately NOT granted to service_role: an internal lock helper, not an entry point.`,
    );
  }
  grants.push(`end $$;`);
  return `${body}\n\n${grants.join("\n")}`;
}

function triggerSql(trigger) {
  const def = trigger.definition.replace(/^CREATE TRIGGER /, "create trigger ");
  return [
    `do $$ begin`,
    `  if not exists (`,
    `    select 1 from pg_trigger t join pg_class c on c.oid = t.tgrelid`,
    `     where c.relname = '${trigger.table}' and t.tgname = '${trigger.name}' and not t.tgisinternal`,
    `  ) then`,
    `    execute ${sqlLiteral(def)};`,
    `  end if;`,
    `end $$;`,
  ].join("\n");
}

const sqlLiteral = (text) => `'${String(text).replace(/'/g, "''")}'`;

// ── FILE ASSEMBLY ───────────────────────────────────────────────────────────

const HEADER = (group, counts) => `-- POR-1 PROMOTION ${group.id} — ${group.title}
--
-- PRODUCTION_LINEAGE. Generated by scripts/por1/compile-promotion.mjs from the FINAL Preview
-- catalogue — not from the 24-migration Preview history. Only the last definition of a
-- \`create or replace\` chain is live, so promoting the history would promote bodies that were
-- already replaced, including the ones replaced because they were wrong.
--
-- Regenerate and verify with:  npm run por1:promotion-check
--
-- CONTENTS
--   tables ${counts.tables} · sequences ${counts.sequences} · functions ${counts.functions} · triggers ${counts.triggers}
--
-- APPLY SEMANTICS
--   Every statement is guarded (\`if not exists\` / catalogue probe), so a partial failure can be
--   retried without a human reconstructing which half applied.
--
-- ROLLBACK CLASS
--   SCHEMA_REVERSIBLE_WHILE_FLAGS_OFF — additive only. Nothing here alters or drops an existing
--   Production object, so with the POR-1 capability controls unset these objects are inert: the
--   old application never names them. The Production incident response is to disable the
--   capability and roll back the application, NOT to drop the schema.
--
-- EXISTING-DATA IMPACT
--   None. No backfill, no column change to a populated table, no data movement.
--
-- LOCK CLASS
--   CREATE TABLE / CREATE INDEX on brand-new empty relations. No lock is taken on any table the
--   running application reads or writes.
`;

const files = [];
for (const group of GROUPS) {
  const bucket = placement.get(group.id);
  const counts = {
    tables: bucket.tables.length,
    functions: bucket.functions.length,
    sequences: bucket.sequences.length,
    triggers: bucket.triggers.length,
  };

  const parts = [HEADER(group, counts)];

  if (group.id === "P8") {
    parts.push(contractAssertionSql());
  } else {
    if (bucket.sequences.length) {
      parts.push(`-- ── sequences ──────────────────────────────────────────────────────────────`);
      for (const s of bucket.sequences.sort((a, b) => a.name.localeCompare(b.name))) parts.push(sequenceSql(s));
    }
    // A CHECK constraint or index expression that calls a promoted function needs that function to
    // already exist — the expression is parsed when the ALTER runs, not when the row is written. So
    // those functions are emitted BEFORE the tables, and the rest after.
    const { beforeTables, afterTables } = splitFunctionsAroundTables(bucket);
    if (beforeTables.length) {
      parts.push(`-- ── functions required by the table definitions below ──────────────────────`);
      for (const f of orderFunctions(beforeTables)) parts.push(functionSql(f));
    }
    if (bucket.tables.length) {
      parts.push(`-- ── tables ─────────────────────────────────────────────────────────────────`);
      for (const t of orderTables(bucket.tables)) parts.push(tableSql(t));
    }
    if (afterTables.length) {
      parts.push(`-- ── functions ──────────────────────────────────────────────────────────────`);
      for (const f of orderFunctions(afterTables)) parts.push(functionSql(f));
    }
    if (bucket.triggers.length) {
      parts.push(`-- ── triggers ───────────────────────────────────────────────────────────────`);
      for (const t of bucket.triggers.sort((a, b) => a.name.localeCompare(b.name))) parts.push(triggerSql(t));
    }
  }

  const version = `${VERSION_BASE}${String(GROUPS.indexOf(group) + 1).padStart(2, "0")}`;
  files.push({ path: join(OUT_DIR, `${version}_${group.slug}.sql`), sql: `${parts.join("\n\n")}\n`, group, counts, version });
}

/**
 * Which of this group's functions must be created BEFORE its tables.
 *
 * The trigger for this rule was real: `yorisou_assessment_attempts` has a CHECK constraint calling
 * `yorisou_jsonb_object_length(answers)`, and emitting tables first made the very first promotion
 * migration fail to apply. The set is closed transitively, because a function pulled in early may
 * call another one.
 *
 * If a function needed early also reads a promoted table, no ordering can satisfy both and the
 * group needs a stub-then-replace strategy. That is reported rather than silently mis-emitted.
 */
function splitFunctionsAroundTables(bucket) {
  const byName = new Map(bucket.functions.map((f) => [f.name, f]));
  const needed = new Set();

  const pull = (text) => {
    for (const name of referencedPromotedNames(text)) {
      if (byName.has(name) && !needed.has(name)) {
        needed.add(name);
        pull(byName.get(name).definition);
      }
    }
  };
  for (const t of bucket.tables) {
    for (const c of t.constraints) pull(c.definition);
    for (const col of t.columns) if (col.default) pull(col.default);
    for (const ix of t.indexes) pull(ix.definition);
  }

  const groupTables = new Set(bucket.tables.map((t) => t.name));
  for (const name of needed) {
    const fn = byName.get(name);
    // A plpgsql body is a string until it runs, so it may name a table that arrives later. A `sql`
    // body is parsed at CREATE time and may not.
    if (fn.language !== "plpgsql") {
      const reads = [...referencedPromotedNames(fn.definition)].filter((r) => groupTables.has(r));
      if (reads.length > 0) {
        fail(
          `${fn.signature} must exist before this group's tables (a constraint calls it) but its ` +
            `SQL body reads ${reads.join(", ")} — this group needs a stub-then-replace strategy`,
        );
      }
    }
  }

  return {
    beforeTables: bucket.functions.filter((f) => needed.has(f.name)),
    afterTables: bucket.functions.filter((f) => !needed.has(f.name)),
  };
}

/** Tables in FK order within a group, then by name — deterministic and dependency-safe. */
function orderTables(tables) {
  const names = new Set(tables.map((t) => t.name));
  const parents = new Map(tables.map((t) => [t.name, new Set()]));
  for (const edge of preview.fk_edges) {
    if (names.has(edge.child) && names.has(edge.parent) && edge.child !== edge.parent) {
      parents.get(edge.child).add(edge.parent);
    }
  }
  const out = [];
  const placed = new Set();
  const byName = new Map(tables.map((t) => [t.name, t]));
  const sorted = [...names].sort();
  let guard = 0;
  while (placed.size < names.size) {
    if (guard += 1, guard > 100) throw new Error("cyclic foreign keys within a group");
    for (const name of sorted) {
      if (placed.has(name)) continue;
      if ([...parents.get(name)].every((p) => placed.has(p))) {
        out.push(byName.get(name));
        placed.add(name);
      }
    }
  }
  return out;
}

/** Functions in call order within a group, then by signature. */
function orderFunctions(functions) {
  const names = new Set(functions.map((f) => f.name));
  const deps = new Map(functions.map((f) => [f.signature, new Set()]));
  for (const f of functions) {
    for (const other of functions) {
      if (other.name === f.name) continue;
      if (names.has(other.name) && new RegExp(`\\b${other.name}\\b`).test(f.definition)) {
        deps.get(f.signature).add(other.name);
      }
    }
  }
  const sorted = [...functions].sort((a, b) => a.signature.localeCompare(b.signature));
  const out = [];
  const placedNames = new Set();
  const pending = [...sorted];
  // Bounded passes: plpgsql resolves names at execution time, so a genuine cycle is legal and is
  // emitted in name order rather than treated as an error.
  for (let pass = 0; pass < 6 && pending.length > 0; pass += 1) {
    for (let i = pending.length - 1; i >= 0; i -= 1) {
      const fn = pending[i];
      if ([...deps.get(fn.signature)].every((d) => placedNames.has(d))) {
        out.push(fn);
        placedNames.add(fn.name);
        pending.splice(i, 1);
      }
    }
  }
  out.push(...pending);
  return out;
}

/** P7 — the whole-contract assertion. */
function contractAssertionSql() {
  const tableList = newTables.map((t) => `'${t.name}'`).sort().join(", ");
  const forcedRls = newTables.filter((t) => t.rls_forced).map((t) => `'${t.name}'`).sort().join(", ");
  return `-- The promotion is not "applied" because six files ran. It is applied when the contract is
-- present, correctly privileged, and closed to every role that must not reach it. Asserting that
-- here means an incomplete promotion fails at migration time — before any capability control is
-- turned on — instead of surfacing as a 500 during activation.

do $$
declare
  v_missing text;
  v_count int;
begin
  -- ── the ${newTables.length} promoted tables ──
  select string_agg(t, ', ' order by t) into v_missing
    from unnest(array[${tableList}]) t
   where to_regclass('public.' || t) is null;
  if v_missing is not null then
    raise exception 'POR-1 promotion incomplete — missing table(s): %', v_missing;
  end if;

  -- ── row-level security ──
  select string_agg(c.relname, ', ' order by c.relname) into v_missing
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relname = any (array[${tableList}])
     and not (c.relrowsecurity and c.relforcerowsecurity);
  if v_missing is not null then
    raise exception 'POR-1 promotion incomplete — RLS not enabled and forced on: %', v_missing;
  end if;

  -- ── the ${newFunctions.length} promoted functions ──
  select count(*) into v_count
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.prokind = 'f' and p.proname like 'yorisou_%';
  if v_count < ${production.functions.filter((f) => f.name.startsWith("yorisou_")).length + newFunctions.length} then
    raise exception 'POR-1 promotion incomplete — expected at least % yorisou_* functions, found %',
      ${production.functions.filter((f) => f.name.startsWith("yorisou_")).length + newFunctions.length}, v_count;
  end if;

  -- ── every SECURITY DEFINER function has a fixed search_path ──
  select string_agg(p.proname, ', ' order by p.proname) into v_missing
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.proname like 'yorisou_%' and p.prosecdef
     and not coalesce(array_to_string(p.proconfig, ',') like '%search_path=%', false);
  if v_missing is not null then
    raise exception 'POR-1: SECURITY DEFINER without a fixed search_path: %', v_missing;
  end if;

  -- ── NOTHING promoted is reachable by an unauthenticated caller ──
  --
  -- PostgREST publishes public-schema functions as RPC under the anon key, so this is the
  -- difference between an internal routine and an internet-facing endpoint. It is asserted against
  -- has_function_privilege, which resolves PUBLIC inheritance — the exact thing that made two
  -- earlier revokes silently ineffective.
  if exists (select 1 from pg_roles where rolname = 'anon') then
    select string_agg(p.proname, ', ' order by p.proname) into v_missing
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.proname like 'yorisou_%' and p.prosecdef
       and has_function_privilege('anon', p.oid, 'EXECUTE');
    if v_missing is not null then
      raise exception 'POR-1: SECURITY DEFINER function(s) executable by anon: %', v_missing;
    end if;
  end if;

  -- ── and the internal lock helper stays internal ──
  if exists (select 1 from pg_roles where rolname = 'service_role')
     and exists (
       select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public' and p.proname = 'yorisou_line_subject_lock'
          and has_function_privilege('service_role', p.oid, 'EXECUTE')
     ) then
    raise exception 'POR-1: yorisou_line_subject_lock is a lock building block, not an entry point';
  end if;
end $$;

-- ── the Production families Preview could never exercise ─────────────────────
--
-- These exist in Production and NOT in Preview, so every green Preview deletion run skipped them
-- via \`to_regclass\` without ever touching them. In Production they are real, populated, and
-- owner-linked. This asserts the deletion plan still names each one; proving it actually erases
-- them is the job of the full-lineage rehearsal, and no assertion here can substitute for that.
do $$
declare
  v_src text;
  v_family text;
begin
  select string_agg(pg_get_functiondef(p.oid), E'\\n') into v_src
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.proname like 'yorisou_account_deletion_%';

  foreach v_family in array array[${PRODUCTION_ONLY_DELETION_FAMILIES.map((f) => `'${f}'`).join(", ")}] loop
    if to_regclass('public.' || v_family) is not null and position(v_family in v_src) = 0 then
      raise exception 'POR-1: Production family % exists but is named by no deletion function', v_family;
    end if;
  end loop;
end $$;`;
}

// ── OUTPUT ──────────────────────────────────────────────────────────────────

if (process.exitCode === 1) {
  console.error("compilation refused — fix the failures above");
  process.exit(1);
}

let drift = 0;
for (const file of files) {
  const abs = isAbsolute(file.path) ? file.path : join(process.cwd(), file.path);
  const existing = existsSync(abs) ? readFileSync(abs, "utf8") : null;
  if (existing === file.sql) continue;
  drift += 1;
  if (CHECK) {
    console.error(`DRIFT: ${file.path} ${existing === null ? "is missing" : "differs from the compiler output"}`);
  } else {
    writeFileSync(abs, file.sql);
  }
}

// ── THE CHECKED-IN CONTRACT ─────────────────────────────────────────────────
//
// The delta, sanitized, so CI can assert the promoted shape on a machine with no database and so a
// reviewer can diff the contract independently of the SQL that produces it.
const CONTRACT_PATH = "supabase/contracts/por1-promotion-contract.json";
const strip = (o, keys) => {
  const out = {};
  for (const [k, v] of Object.entries(o)) if (!keys.includes(k)) out[k] = v;
  return out;
};
const contract = {
  // Owner is excluded on purpose: Supabase owns everything as `postgres`, a disposable local
  // rehearsal owns it as whoever ran the migrations, and pinning it would fail the rehearsal for a
  // reason unrelated to the contract.
  note: "POR-1 Preview->Production promotion delta. Owner and environment are deliberately excluded.",
  tables: newTables.map((t) => strip(t, ["owner"])),
  functions: newFunctions.map((f) => strip(f, ["owner"])),
  sequences: newSequences.map((s) => strip(s, ["owner", "usage_grants"])),
  triggers: newTriggers,
  counts: {
    tables: newTables.length,
    functions: newFunctions.length,
    sequences: newSequences.length,
    triggers: newTriggers.length,
  },
  migrations: files.map((f) => ({ id: f.group.id, version: f.version, path: f.path, ...f.counts })),
  deferred_to_cross_domain: [...deferred].sort(),
  production_only_deletion_families: PRODUCTION_ONLY_DELETION_FAMILIES,
};
const contractText = `${JSON.stringify(contract, null, 2)}\n`;
const contractAbs = join(process.cwd(), CONTRACT_PATH);
const contractExisting = existsSync(contractAbs) ? readFileSync(contractAbs, "utf8") : null;
if (contractExisting !== contractText) {
  drift += 1;
  if (CHECK) console.error(`DRIFT: ${CONTRACT_PATH} ${contractExisting === null ? "is missing" : "differs from the compiler output"}`);
  else writeFileSync(contractAbs, contractText);
}

const summary = {
  mode: CHECK ? "check" : "emit",
  new_tables: newTables.length,
  new_functions: newFunctions.length,
  new_sequences: newSequences.length,
  new_triggers: newTriggers.length,
  deferred_to_cross_domain: [...deferred].sort(),
  files: files.map((f) => ({
    path: f.path,
    ...f.counts,
    sha256: sha(f.sql).slice(0, 16),
  })),
  contract: CONTRACT_PATH,
  drift,
};
console.log(JSON.stringify(summary, null, 2));

if (CHECK && drift > 0) {
  console.error(`\n${drift} file(s) differ from the compiler output — regenerate with npm run por1:promotion-compile`);
  process.exit(1);
}
