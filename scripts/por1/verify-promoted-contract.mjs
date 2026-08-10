// POR-1 M1-H / M2 — does this database actually hold the promoted contract?
//
// The migrations applying without error is a weaker claim than it sounds. `create table if not
// exists` is silent when the table is already there in a different shape; `create or replace
// function` is silent when it replaces a body with a subtly different one; a `revoke` against a
// role that never held the privilege directly succeeds and changes nothing. Every one of those has
// happened in this package. So the release gate is not "did the files run" — it is "is the contract
// present, byte for byte, with the privileges it is supposed to have".
//
//   node scripts/por1/verify-promoted-contract.mjs --catalogue <extracted.json> [--contract <c.json>]
//
// Read-only. No database access of its own; it compares two files.

import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const arg = (n) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : undefined;
};

const CATALOGUE = arg("--catalogue");
const CONTRACT = arg("--contract") ?? "supabase/contracts/por1-promotion-contract.json";
if (!CATALOGUE) {
  console.error("usage: verify-promoted-contract.mjs --catalogue <extracted.json> [--contract <c.json>]");
  process.exit(2);
}

const live = JSON.parse(readFileSync(CATALOGUE, "utf8"));
const contract = JSON.parse(readFileSync(CONTRACT, "utf8"));

const failures = [];
const fail = (m) => failures.push(m);

// Owner is deliberately NOT compared. On Supabase every object is owned by `postgres`; in a
// disposable local rehearsal it is owned by whoever ran the migrations. Pinning it would make the
// rehearsal fail for a reason that has nothing to do with the contract, which is the fastest way to
// teach people to ignore a gate.
const OWNER_INSENSITIVE = true;

// ── tables ──────────────────────────────────────────────────────────────────

const liveTables = new Map(live.tables.map((t) => [t.name, t]));
for (const expected of contract.tables) {
  const actual = liveTables.get(expected.name);
  if (!actual) { fail(`table missing: ${expected.name}`); continue; }

  if (actual.rls_enabled !== expected.rls_enabled) fail(`${expected.name}: RLS enabled ${actual.rls_enabled} ≠ ${expected.rls_enabled}`);
  if (actual.rls_forced !== expected.rls_forced) fail(`${expected.name}: FORCE RLS ${actual.rls_forced} ≠ ${expected.rls_forced}`);

  const byName = (rows) => new Map(rows.map((r) => [r.name, r]));

  const liveCols = byName(actual.columns);
  for (const col of expected.columns) {
    const got = liveCols.get(col.name);
    if (!got) { fail(`${expected.name}.${col.name}: column missing`); continue; }
    if (got.type !== col.type) fail(`${expected.name}.${col.name}: type ${got.type} ≠ ${col.type}`);
    if (got.not_null !== col.not_null) fail(`${expected.name}.${col.name}: not_null ${got.not_null} ≠ ${col.not_null}`);
    if ((got.default ?? null) !== (col.default ?? null)) fail(`${expected.name}.${col.name}: default ${got.default} ≠ ${col.default}`);
    if ((got.identity ?? null) !== (col.identity ?? null)) fail(`${expected.name}.${col.name}: identity differs`);
  }
  const extraCols = actual.columns.filter((c) => !expected.columns.some((e) => e.name === c.name));
  if (extraCols.length) fail(`${expected.name}: unexpected column(s) ${extraCols.map((c) => c.name).join(", ")}`);

  const liveCons = byName(actual.constraints);
  for (const con of expected.constraints) {
    const got = liveCons.get(con.name);
    if (!got) { fail(`${expected.name}: constraint missing: ${con.name}`); continue; }
    if (got.definition !== con.definition) fail(`${expected.name}.${con.name}: definition differs\n      live: ${got.definition}\n      want: ${con.definition}`);
    // A NOT VALID constraint that was never validated enforces nothing for existing rows.
    if (got.validated !== con.validated) fail(`${expected.name}.${con.name}: validated ${got.validated} ≠ ${con.validated}`);
  }

  const liveIdx = byName(actual.indexes);
  for (const idx of expected.indexes) {
    const got = liveIdx.get(idx.name);
    if (!got) { fail(`${expected.name}: index missing: ${idx.name}`); continue; }
    if (got.definition !== idx.definition) fail(`${expected.name}.${idx.name}: definition differs\n      live: ${got.definition}\n      want: ${idx.definition}`);
  }

  // Grants: `service_role` must have exactly what the contract says, and anon/authenticated must
  // have nothing at all.
  const serviceLive = actual.grants.filter((g) => g.startsWith("service_role:")).sort().join(",");
  const serviceWant = expected.grants.filter((g) => g.startsWith("service_role:")).sort().join(",");
  if (serviceLive !== serviceWant) fail(`${expected.name}: service_role grants [${serviceLive}] ≠ [${serviceWant}]`);
  const exposed = actual.grants.filter((g) => /^(anon|authenticated|PUBLIC):/.test(g));
  if (exposed.length) fail(`${expected.name}: table is granted to ${exposed.join(", ")}`);
}

// ── functions ───────────────────────────────────────────────────────────────

const liveFunctions = new Map(live.functions.map((f) => [f.signature, f]));
for (const expected of contract.functions) {
  const actual = liveFunctions.get(expected.signature);
  if (!actual) { fail(`function missing: ${expected.signature}`); continue; }

  // The body hash is the point of the whole exercise: it is what distinguishes the final, corrected
  // definition from any of the superseded ones in the Preview history.
  if (actual.hash !== expected.hash) fail(`${expected.signature}: BODY DIFFERS from the promoted contract`);
  if (actual.result !== expected.result) fail(`${expected.signature}: returns ${actual.result} ≠ ${expected.result}`);
  if (actual.language !== expected.language) fail(`${expected.signature}: language ${actual.language} ≠ ${expected.language}`);
  if (actual.security_definer !== expected.security_definer) fail(`${expected.signature}: SECURITY ${actual.security_definer ? "DEFINER" : "INVOKER"} ≠ expected`);
  if (actual.volatility !== expected.volatility) fail(`${expected.signature}: volatility ${actual.volatility} ≠ ${expected.volatility}`);
  if (actual.config !== expected.config) fail(`${expected.signature}: config "${actual.config}" ≠ "${expected.config}"`);

  // SECURITY DEFINER without a fixed search_path is a privilege-escalation shape, not a style
  // preference: the caller chooses which schema the body's unqualified names resolve to.
  if (actual.security_definer && !/search_path=/.test(actual.config)) {
    fail(`${expected.signature}: SECURITY DEFINER with no fixed search_path`);
  }

  const roles = (grants) => new Set(grants.map((g) => g.split(":")[0]));
  const liveRoles = roles(actual.grants);
  for (const forbidden of ["anon", "authenticated", "PUBLIC"]) {
    if (liveRoles.has(forbidden)) fail(`${expected.signature}: EXECUTE granted to ${forbidden}`);
  }
  const wantsService = roles(expected.grants).has("service_role");
  if (wantsService !== liveRoles.has("service_role")) {
    fail(`${expected.signature}: service_role EXECUTE ${liveRoles.has("service_role") ? "present" : "absent"}, expected ${wantsService ? "present" : "absent"}`);
  }
}

// ── sequences and triggers ──────────────────────────────────────────────────

const liveSequences = new Map(live.sequences.map((s) => [s.name, s]));
for (const expected of contract.sequences) {
  const actual = liveSequences.get(expected.name);
  if (!actual) { fail(`sequence missing: ${expected.name}`); continue; }
  if (actual.type !== expected.type) fail(`${expected.name}: type ${actual.type} ≠ ${expected.type}`);
  if (actual.increment !== expected.increment) fail(`${expected.name}: increment differs`);
  if (/(^|,)(anon|authenticated):/.test(actual.usage_grants)) {
    fail(`${expected.name}: sequence usable by ${actual.usage_grants}`);
  }
}

const liveTriggers = new Map(live.triggers.map((t) => [`${t.table}.${t.name}`, t]));
for (const expected of contract.triggers) {
  const key = `${expected.table}.${expected.name}`;
  const actual = liveTriggers.get(key);
  if (!actual) { fail(`trigger missing: ${key}`); continue; }
  if (actual.definition !== expected.definition) fail(`${key}: definition differs`);
}

// ── the whole-contract claim ────────────────────────────────────────────────

const summary = {
  contract: CONTRACT,
  catalogue: CATALOGUE,
  tables: `${contract.tables.length} expected`,
  functions: `${contract.functions.length} expected`,
  sequences: `${contract.sequences.length} expected`,
  triggers: `${contract.triggers.length} expected`,
  failures: failures.length,
};
console.log(JSON.stringify(summary, null, 2));
for (const f of failures) console.error(`  FAIL ${f}`);
if (failures.length > 0) process.exit(1);
console.log("\nthe promoted contract is present and correctly privileged");
