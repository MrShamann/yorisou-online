#!/usr/bin/env node
// POR-1 — extract every (table, column) the operator recovery tool's READ PATH names.
//
// WHY THIS EXISTS. The recovery tool selected `link_subject` from
// `yorisou_canonical_identity_links`. That column has never existed — the registry stores a sha256
// in `link_digest` and no plaintext subject at all — so the read returned nothing, every candidate
// was classified unproven, and the tool was inert in exactly the situation it was written for.
// Nothing caught it: unit tests fed the classifier hand-built rows, so the query string itself was
// never confronted with a schema.
//
// This turns the tool's query strings back into (table, column) pairs so a real database can be
// asked whether they exist. It is deliberately syntactic and deliberately strict: an unrecognised
// query shape is an ERROR, not an empty result, because "found nothing to check" is precisely the
// failure this is meant to make impossible.
//
//   node scripts/por1/extract-recovery-query-columns.mjs [path]  ->  JSON to stdout

import { readFileSync } from "node:fs";

const source = readFileSync(
  process.argv[2] ?? "scripts/por1-production-deletion-recovery.ts",
  "utf8",
);

/**
 * Resolve `const <name> = "<literal>";` and `const <name> = \`…\`;` so a `${name}` interpolation
 * inside a query can be inlined.
 *
 * Template constants matter because the read path builds a path once and then reuses it for both the
 * row read and its exact-count companion. A resolver that only understood double quotes would leave
 * that interpolation unresolved — and the parser below refuses to guess, so the whole extraction
 * would fail closed rather than silently check fewer columns.
 */
function stringConstants(text) {
  const constants = new Map();
  // One literal, or several concatenated across lines for readability. Both forms appear in the read
  // path, and a resolver that only understood the first would leave the second interpolated — which
  // the parser below then refuses, failing the whole extraction closed rather than checking less.
  for (const match of text.matchAll(
    /(?:const|let)\s+([A-Za-z_$][\w$]*)\s*(?::\s*[^=]+)?=\s*((?:"[^"\n]*"\s*\+\s*)*"[^"\n]*")\s*;/g,
  )) {
    const joined = [...match[2].matchAll(/"([^"\n]*)"/g)].map((piece) => piece[1]).join("");
    constants.set(match[1], joined);
  }
  for (const match of text.matchAll(
    /(?:const|let)\s+([A-Za-z_$][\w$]*)\s*(?::\s*[^=]+)?=\s*((?:`[^`]*`\s*\+\s*)*`[^`]*`)\s*;/g,
  )) {
    // Flatten the concatenated backtick fragments the source splits across lines for readability.
    constants.set(match[1], match[2].replace(/`\s*\+\s*`/g, "").replace(/\n\s*/g, "").replace(/`/g, ""));
  }
  return constants;
}

/**
 * Flatten a concatenated template expression into one string.
 *
 * The read path builds paths as `` `a` + `b` + `c` `` across several lines for readability, so the
 * backticks, the `+` joins and the whitespace between them are removed before the query is matched.
 */
function flatten(text, constants) {
  let flat = text;
  // Repeat to a fixpoint: a resolved constant can itself contain a reference to another one.
  for (let pass = 0; pass < 5; pass += 1) {
    const before = flat;
    for (const [name, value] of constants) {
      flat = flat.split("${" + name + "}").join(value);
    }
    if (flat === before) break;
  }
  flat = flat.replace(/`\s*\+\s*`/g, "").replace(/\n\s*/g, "");
  // Whatever interpolation is left is a bound VALUE — a job id, an owner id. Values are irrelevant
  // to a schema check, but they must not be mistaken for resolved text, so each becomes a sentinel
  // that the parser below refuses to accept anywhere a column name is expected.
  return flat.replace(/\$\{[^}]*\}/g, VALUE_SENTINEL);
}

/** Stands in for an interpolated value. Never legal where a table or column name belongs. */
const VALUE_SENTINEL = "\u0000";

const constants = stringConstants(source);
const flat = flatten(source, constants);

const found = new Map();
let unresolved = 0;
const unresolvedDetail = [];

// A PostgREST path: a table, then a query string of `column=operator.value` filters and `select=`.
for (const match of flat.matchAll(/(yorisou_[a-z_]+)\?([^`"'\s]*)/g)) {
  const [, table, query] = match;
  const columns = found.get(table) ?? new Set();

  for (const part of query.split("&")) {
    if (part === "") continue;
    const eq = part.indexOf("=");
    if (eq <= 0) continue;
    const key = part.slice(0, eq);
    const value = part.slice(eq + 1);

    // A filter VALUE may be interpolated; a column name may not. Anything else would let an
    // unresolvable name slip through as "nothing to check".
    if (key.includes(VALUE_SENTINEL)) {
      unresolved += 1;
      unresolvedDetail.push(`${table}: key ${JSON.stringify(part.slice(0, 60))}`);
      continue;
    }

    if (key === "select") {
      if (value.includes(VALUE_SENTINEL)) {
        unresolved += 1;
        unresolvedDetail.push(`${table}: select ${JSON.stringify(value.slice(0, 60))}`);
        continue;
      }
      for (const column of value.split(",")) {
        const name = column.split(":").pop().trim();
        if (/^[a-z_][a-z0-9_]*$/.test(name)) columns.add(name);
      }
      continue;
    }
    if (key === "order") {
      if (value.includes(VALUE_SENTINEL)) {
        unresolved += 1;
        unresolvedDetail.push(`${table}: select ${JSON.stringify(value.slice(0, 60))}`);
        continue;
      }
      const name = value.split(".")[0];
      if (/^[a-z_][a-z0-9_]*$/.test(name)) columns.add(name);
      continue;
    }
    // Reserved PostgREST parameters are not columns.
    if (["limit", "offset", "on_conflict", "columns"].includes(key)) continue;
    if (/^[a-z_][a-z0-9_]*$/.test(key)) columns.add(key);
  }
  found.set(table, columns);
}

if (found.size === 0) {
  console.error("extract: no PostgREST reads found — the query shape changed, refusing to pass vacuously");
  process.exit(1);
}
if (unresolved > 0) {
  console.error(
    `extract: ${unresolved} column name(s) are interpolated and cannot be checked against a schema`,
  );
  for (const detail of unresolvedDetail) console.error(`  ${detail}`);
  process.exit(1);
}

const result = [...found.entries()]
  .map(([table, columns]) => ({ table, columns: [...columns].sort() }))
  .sort((a, b) => a.table.localeCompare(b.table));

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
