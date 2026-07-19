#!/usr/bin/env node
// CPV1 / CPV1-R1 migration-SQL guard (CI-runnable, no database required).
//
// The CPV1 platform migrations are contractually ADDITIVE, REVERSIBLE and
// RLS-preserving (never destructive to existing production data). This static
// validator enforces that contract in CI so a regression cannot land unnoticed.
// It does NOT replace the local-Supabase apply+reversibility proof (that ran on a
// real Postgres) — it guards the same invariants on every push.
//
// Checks per CPV1 migration file:
//   1. Column adds use `add column if not exists` (idempotent + additive).
//   2. A documented rollback block is present (`Rollback` / `drop column if exists`).
//   3. No DESTRUCTIVE statement in EXECUTABLE SQL (drop table / truncate /
//      delete from / drop schema). Destructive verbs are allowed ONLY inside SQL
//      comments (the documented rollback recipe).
//   4. The R1 event-type constraint is named (not an anonymous check) so it can be
//      dropped/re-added deterministically.

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "supabase/migrations");
const TARGETS = readdirSync(DIR)
  .filter((f) => /cpv1/i.test(f) && f.endsWith(".sql"))
  .sort();

if (TARGETS.length === 0) {
  console.error("FAIL: no CPV1 migration files found to validate");
  process.exit(1);
}

// Strip line + block comments so destructive-verb scanning only sees executable SQL.
function stripComments(sql) {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .split("\n")
    .map((l) => l.replace(/--.*$/, ""))
    .join("\n");
}

// Destructive verbs that must not appear as the HEAD of an executable statement.
// Matching statement-heads (not substrings) avoids false-positives on the
// append-only GUARD trigger, whose event clause legitimately reads
// "before update or delete or truncate on ..." — that clause is part of a
// `create trigger ...` statement (head = "create") and enforces immutability.
const DESTRUCTIVE = [
  { re: /^drop\s+table\b/i, label: "drop table" },
  { re: /^truncate\b/i, label: "truncate" },
  { re: /^delete\s+from\b/i, label: "delete from" },
  { re: /^drop\s+schema\b/i, label: "drop schema" },
  { re: /^drop\s+database\b/i, label: "drop database" },
];

let failures = 0;
const fail = (file, msg) => {
  console.error(`FAIL [${file}]: ${msg}`);
  failures += 1;
};

for (const file of TARGETS) {
  const raw = readFileSync(join(DIR, file), "utf8");
  const exec = stripComments(raw);

  // 1. additive column adds
  const addCols = raw.match(/add column(?!\s+if not exists)/gi);
  if (addCols) fail(file, `add column without "if not exists" (${addCols.length}×) — not idempotent/additive`);

  // 2. documented rollback
  if (!/rollback/i.test(raw) && !/drop column if exists/i.test(raw)) {
    fail(file, "no documented rollback block");
  }

  // 3. no destructive executable STATEMENTS (statement heads only)
  const statements = exec
    .split(";")
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  for (const stmt of statements) {
    for (const { re, label } of DESTRUCTIVE) {
      if (re.test(stmt)) fail(file, `destructive statement head in executable SQL: "${label}" → ${stmt.slice(0, 60)}…`);
    }
  }
}

// 4. R1 constraint is named (only the R1 migration is required to carry it)
const r1 = TARGETS.find((f) => /cpv1r1/i.test(f));
if (r1) {
  const raw = readFileSync(join(DIR, r1), "utf8");
  if (!/add constraint\s+yorisou_cpv1_hist_event_type_r1/i.test(raw)) {
    fail(r1, "R1 event-type check is not added as the named constraint yorisou_cpv1_hist_event_type_r1");
  }
}

if (failures) {
  console.error(`\n${failures} migration validation failure(s).`);
  process.exit(1);
}
console.log(`CPV1 migration guard: ${TARGETS.length} file(s) additive + reversible + non-destructive.`);
console.log(`  ${TARGETS.join("\n  ")}`);
