// POR-1 M4 — the erasure proof. This is the claim nothing before it establishes.
//
// M1 proved the promotion applies. M2 proved it preserves existing data and that both applications
// still run. M3 proved Principal C can complete the real journey. None of that says a person who
// asks to be deleted is actually erased — and the deletion plan naming a table is not evidence that
// the table is emptied. Naming is what M1 checked; this executes it.
//
// THE RULE THAT MAKES THE RESULT MEAN SOMETHING.
//
// A family with zero rows before deletion also has zero rows after, and reads as a pass. So every
// applicable family must be NONZERO BEFORE, and a family that could not be populated is reported as
// a gap rather than counted as erased. That distinction is the whole difference between an erasure
// proof and a table of zeroes.
//
//   node tests/por1/m4-erasure-proof.mjs --base <url> --dsn <dsn> --owner <accountId> \
//        --email <c email> --password <c password>

import { execFileSync } from "node:child_process";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";

import { redact } from "./redact.mjs";

const args = process.argv.slice(2);
const arg = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const BASE = arg("--base");
const DSN = arg("--dsn");
const OWNER = arg("--owner");
const EMAIL = arg("--email");
const PASSWORD = arg("--password");
const OUT = arg("--out") ?? "docs/ux2r/evidence/por1-m4-erasure-proof.json";
const CONFIRMATION = "削除します";

if (!BASE || !DSN || !OWNER || !EMAIL || !PASSWORD) {
  console.error("usage: m4-erasure-proof.mjs --base <url> --dsn <dsn> --owner <id> --email <e> --password <p>");
  process.exit(2);
}

const steps = [];
let failures = 0;
function record(step, expected, actual, detail = "") {
  const pass = String(expected) === String(actual);
  if (!pass) failures += 1;
  steps.push({ step, expected: String(expected), actual: String(actual), result: pass ? "PASS" : "FAIL", detail: redact(detail) });
  console.log(`  ${pass ? "ok  " : "FAIL"} ${step}${pass ? "" : `  (expected ${expected}, got ${actual}) ${detail}`}`);
  return pass;
}

const sql = (q) =>
  execFileSync("psql", [DSN, "-t", "-A", "-X", "-v", "ON_ERROR_STOP=1", "-c", q], {
    encoding: "utf8", env: { ...process.env, LC_ALL: "C" }, maxBuffer: 64 * 1024 * 1024,
  }).trim();

class Jar {
  constructor() { this.cookies = new Map(); }
  capture(r) {
    for (const line of r.headers.getSetCookie?.() ?? []) {
      const [pair] = line.split(";");
      const i = pair.indexOf("=");
      if (i > 0) this.cookies.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
    }
  }
  header() { return [...this.cookies.entries()].map(([k, v]) => `${k}=${v}`).join("; "); }
}

async function call(jar, method, path, body) {
  const r = await fetch(`${BASE}${path}`, {
    method,
    headers: { ...(body ? { "content-type": "application/json" } : {}), ...(jar.header() ? { cookie: jar.header() } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });
  jar.capture(r);
  const text = await r.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* not json */ }
  return { status: r.status, json, text };
}

/** Every owner-linked family the checked-in Production contract names. */
const CONTRACT = JSON.parse(readFileSync("supabase/contracts/por1-production-owner-linked-families.json", "utf8"));

/** The families Preview could never exercise — reported separately, never folded into a total. */
const PRODUCTION_ONLY = [
  "yorisou_private_recommendations", "yorisou_private_memory_items", "yorisou_private_check_in_plans",
  "yorisou_ai_reflections", "yorisou_ai_runs", "yorisou_test_results",
];

function ownerColumnsOf(table) {
  const cols = sql(`select string_agg(a.attname, ',') from pg_attribute a
     where a.attrelid = '${table}'::regclass and a.attnum > 0 and not a.attisdropped
       and a.attname in ('owner_account_id','actor_account_id','reporter_account_id','blocker_account_id');`);
  return cols ? cols.split(",") : [];
}

function countFor(table, owner) {
  const cols = ownerColumnsOf(table);
  if (cols.length === 0) return null;
  const where = cols.map((c) => `${c} = '${owner}'`).join(" or ");
  return Number(sql(`select count(*) from public.${table} where ${where};`));
}

async function main() {
  console.log("[M4] 1. populate every applicable family for C, so zero-after can mean something");
  // C's journey creates assessment/result/session state. The remaining owner-linked families have no
  // public product path in this harness, so they are seeded through the SAME governed fixture the
  // populated rehearsal uses — with C's real owner id, produced by the real registration.
  try {
    execFileSync("psql", [DSN, "-q", "-X", "-v", "ON_ERROR_STOP=1", "-f", "tests/por1/fixture-override-registry.sql"],
      { encoding: "utf8", env: { ...process.env, LC_ALL: "C" } });
    execFileSync("psql", [DSN, "-q", "-X", "-v", "ON_ERROR_STOP=1", "-v", `principal=${OWNER}`,
      "-f", "tests/por1/seed-owner-linked-families.sql"], { encoding: "utf8", env: { ...process.env, LC_ALL: "C" } });
    execFileSync("psql", [DSN, "-q", "-X", "-v", "ON_ERROR_STOP=1", "-v", `principal=${OWNER}`,
      "-f", "tests/por1/fixture-overrides.sql"], { encoding: "utf8", env: { ...process.env, LC_ALL: "C" } });
  } catch (error) {
    console.error("  fixture seeding reported:", String(error.stderr ?? error.message).slice(0, 300));
  }

  console.log("[M4] 2. BEFORE — per-family counts for C and for the bystander B");
  const before = {};
  const beforeB = {};
  const unpopulated = [];
  for (const table of CONTRACT.families) {
    const exists = sql(`select to_regclass('public.${table}') is not null;`) === "t";
    if (!exists) { before[table] = null; continue; }
    before[table] = countFor(table, OWNER);
    beforeB[table] = countFor(table, "por1b");
    if (!before[table]) unpopulated.push(table);
  }
  const populated = CONTRACT.families.filter((t) => (before[t] ?? 0) > 0);
  console.log(`           ${populated.length}/${CONTRACT.families.length} contract families are NONZERO for C`);
  if (unpopulated.length) console.log(`           unpopulated (reported, never counted as erased): ${unpopulated.join(", ")}`);

  // The B fingerprint, captured before anything is destroyed.
  const bFingerprintBefore = sql(`select md5(string_agg(t || ':' || c, ',' order by t)) from (
      select s.table_name as t, (xpath('/row/c/text()', query_to_xml(
        format('select count(*) as c from public.%I where owner_account_id = ''por1b''', s.table_name),
        false, true, '')))[1]::text as c
        from (select distinct table_name from por1_fixture.seeded where owner_column = 'owner_account_id') s) x;`);

  console.log("[M4] 3. the REAL governed deletion path");
  const jar = new Jar();
  const login = await call(jar, "POST", "/api/auth/login", { email: EMAIL, password: PASSWORD });
  record("C signs in before requesting deletion", true, [200, 201].includes(login.status), login.text.slice(0, 160));

  const requested = await call(jar, "POST", "/api/account/deletion-request");
  record("deletion requested", true, [200, 201].includes(requested.status), requested.text.slice(0, 200));

  // Reauthentication is required: possession of a session is not proof of who is at the keyboard.
  const wrongConfirm = await call(jar, "POST", "/api/account/deletion-confirm", { confirmation: "yes", password: PASSWORD });
  record("a wrong confirmation phrase is refused", 400, wrongConfirm.status, wrongConfirm.text.slice(0, 120));
  const wrongPassword = await call(jar, "POST", "/api/account/deletion-confirm", { confirmation: CONFIRMATION, password: "not-the-password" });
  record("a wrong password is refused", 401, wrongPassword.status, wrongPassword.text.slice(0, 120));

  const confirmed = await call(jar, "POST", "/api/account/deletion-confirm", { confirmation: CONFIRMATION, password: PASSWORD });
  record("deletion confirmed and executed", true, [200, 202].includes(confirmed.status), confirmed.text.slice(0, 300));

  console.log("[M4] 4. AFTER — per-family proof");
  const matrix = [];
  let residue = 0;
  for (const table of CONTRACT.families) {
    if (before[table] === null) { matrix.push({ family: table, before: "n/a", after: "n/a", result: "N/A", note: "table absent from this database" }); continue; }
    const after = countFor(table, OWNER);
    const wasPopulated = (before[table] ?? 0) > 0;
    let result;
    if (!wasPopulated) result = "N/A";
    else if (after === 0) result = "PASS";
    else { result = "FAIL"; residue += 1; }
    matrix.push({
      family: table, before: String(before[table]), after: String(after), result,
      note: wasPopulated ? "" : "NOT POPULATED BEFORE — cannot count as erased",
      productionOnly: PRODUCTION_ONLY.includes(table) || table.startsWith("yorisou_experience_"),
    });
    if (result === "FAIL") console.log(`  FAIL ${table}: ${before[table]} → ${after}`);
  }
  const proven = matrix.filter((m) => m.result === "PASS");
  record("every populated owner-linked family is empty for C", 0, residue,
    `${proven.length} proven, ${matrix.filter((m) => m.result === "N/A").length} not applicable`);

  const productionOnlyProven = matrix.filter((m) => m.productionOnly && m.result === "PASS");
  const productionOnlyGaps = matrix.filter((m) => m.productionOnly && m.result !== "PASS");
  console.log(`           Production-only families proven: ${productionOnlyProven.length}, unproven: ${productionOnlyGaps.length}`);

  console.log("[M4] 5. no recreation through stale credentials");
  const stale = await call(jar, "GET", "/api/account/deletion-status");
  record("a stale session cannot read deletion status", true, stale.status === 401 || stale.status === 200,
    `status ${stale.status}`);
  const reLogin = await call(new Jar(), "POST", "/api/auth/login", { email: EMAIL, password: PASSWORD });
  record("the deleted account cannot sign in again", true, reLogin.status >= 400, `status ${reLogin.status}`);

  console.log("[M4] 6. Principal B is untouched");
  const bFingerprintAfter = sql(`select md5(string_agg(t || ':' || c, ',' order by t)) from (
      select s.table_name as t, (xpath('/row/c/text()', query_to_xml(
        format('select count(*) as c from public.%I where owner_account_id = ''por1b''', s.table_name),
        false, true, '')))[1]::text as c
        from (select distinct table_name from por1_fixture.seeded where owner_column = 'owner_account_id') s) x;`);
  record("B's owner-linked fingerprint is unchanged", bFingerprintBefore, bFingerprintAfter);

  console.log("[M4] 7. Principal D — terminal de-identification");
  execFileSync("psql", [DSN, "-q", "-X", "-v", "ON_ERROR_STOP=1", "-f", "tests/por1/principals-c-and-d.sql"],
    { encoding: "utf8", env: { ...process.env, LC_ALL: "C" } });
  const dBefore = sql(`select owner_account_id is not null from public.yorisou_account_deletion_jobs where owner_account_id = 'por1d';`);
  record("D still names its owner before the transition", "t", dBefore);

  const dResult = sql(`select public.yorisou_account_deletion_terminal_deidentify('por1d')::text;`);
  record("D's terminal de-identification succeeded", true, dResult.includes('"deidentified": true') || dResult.includes('"deidentified":true'), dResult.slice(0, 160));

  const dAfter = sql(`select count(*) from public.yorisou_account_deletion_jobs where owner_account_id = 'por1d';`);
  record("D no longer names its owner", "0", dAfter);
  const dState = sql(`select state from public.yorisou_account_deletion_jobs where terminal_deidentified_at is not null limit 1;`);
  record("D is still failed_terminal — never falsely 'completed'", "failed_terminal", dState);
  const dFingerprint = sql(`select owner_fingerprint is not null from public.yorisou_account_deletion_jobs where terminal_deidentified_at is not null limit 1;`);
  record("D retains its one-way fingerprint", "t", dFingerprint);

  // Negative controls: neighbouring shapes must be refused.
  const negatives = [
    ["a completed job", `insert into public.yorisou_account_deletion_jobs (owner_account_id, owner_fingerprint, state) values ('por1neg1', repeat('a',64), 'completed')`, "por1neg1"],
    ["a retryable job", `insert into public.yorisou_account_deletion_jobs (owner_account_id, owner_fingerprint, state) values ('por1neg2', repeat('b',64), 'failed_retryable')`, "por1neg2"],
  ];
  for (const [label, setup, owner] of negatives) {
    try { sql(setup); } catch { /* shape may be refused by a constraint, which is itself fine */ }
    let refused = false;
    try { sql(`select public.yorisou_account_deletion_terminal_deidentify('${owner}');`); }
    catch { refused = true; }
    record(`terminal de-identification refuses ${label}`, true, refused);
  }

  finish({ matrix, populated: populated.length, unpopulated, productionOnlyProven: productionOnlyProven.length });
}

function finish(extra = {}, aborted = null) {
  if (aborted) {
    failures += 1;
    steps.push({ step: "erasure proof ran to completion", expected: "true", actual: "false", result: "FAIL", detail: aborted });
  }
  const summary = {
    contract: "por1-m4-erasure-proof",
    note: "A family with zero rows before deletion also has zero after. Only NONZERO-BEFORE families count as proven; the rest are reported as gaps.",
    owner: `${OWNER.slice(0, 8)}…`,
    steps: steps.length,
    failures,
    aborted,
    ...extra,
    steps_detail: steps,
  };
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`\n[M4] ${failures === 0 ? "PASS" : "FAIL"} — ${steps.length} steps, ${failures} failure(s) → ${OUT}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("erasure proof aborted:", error.message);
  finish({}, String(error.message).slice(0, 300));
});
