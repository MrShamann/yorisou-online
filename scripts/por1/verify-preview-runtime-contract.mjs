// POR-1 — does THIS database have what the deployed application actually calls?
//
// WHY THIS EXISTS, SEPARATELY FROM verify-promoted-contract.mjs.
//
// At 108c939 the live Preview passed `por1:promotion-verify` with zero failures, and the hosted
// acceptance then failed a real deletion with a 500. Both were correct. The promotion verifier
// answers "does this database hold the promoted contract" against the COMPILER's contract, which
// describes 101…108 — and the four-argument erasure entry point is created by 110/111. A database
// can satisfy that contract completely and still not have the one RPC the irreversible stage needs.
//
// So this verifier asks the other question: of the objects the RUNNING APPLICATION calls, are they
// present, are they the right definition, and are they reachable by exactly the right roles. It
// checks a SUBSET of the final post-P111 contract — deliberately not the whole thing, because
// Preview legitimately lacks Production-only families and requiring them here would produce a gate
// nobody could keep green.
//
//   node scripts/por1/verify-preview-runtime-contract.mjs --catalogue <extracted.json> [--contract <final.json>]
//
// Read-only. No database access of its own; it compares two files.

import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const arg = (n) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : undefined;
};

const CATALOGUE = arg("--catalogue");
const CONTRACT = arg("--contract") ?? "supabase/contracts/por1-final-promoted-contract.json";
if (!CATALOGUE) {
  console.error("usage: verify-preview-runtime-contract.mjs --catalogue <extracted.json> [--contract <final.json>]");
  process.exit(2);
}

const live = JSON.parse(readFileSync(CATALOGUE, "utf8"));
const contract = JSON.parse(readFileSync(CONTRACT, "utf8"));

const failures = [];
const fail = (m) => failures.push(m);

const bySignature = new Map(live.functions.map((f) => [f.signature, f]));
const contractBySignature = new Map(contract.functions.map((f) => [f.signature, f]));

// ── what the deployed application calls ─────────────────────────────────────
//
// Each entry names a real call site, so a future reader can check the claim rather than trust it.

const STRONG_ERASE =
  "yorisou_account_deletion_erase_database(p_job_id uuid, p_owner_account_id text, p_executor_token_hash text, p_executor_generation integer)";
const EXECUTOR_CLAIM =
  "yorisou_account_deletion_executor_claim(p_owner_account_id text, p_token_hash text, p_ttl_seconds integer)";
const UNCHECKED = "yorisou_account_deletion_erase_database_unchecked(p_owner_account_id text)";
const JOB_VALID =
  "yorisou_account_erasure_job_valid(p_job_id uuid, p_owner_account_id text, p_executor_token_hash text, p_executor_generation integer)";
const CT_EQ = "yorisou_ct_eq(a text, b text)";

/** Signatures that must be ABSENT: each erases without the authority 110/111 require. */
const FORBIDDEN = [
  "yorisou_account_deletion_erase_database(p_owner_account_id text)",
  "yorisou_account_deletion_erase_database(text)",
  "yorisou_account_deletion_erase_database(uuid, text)",
  "yorisou_account_deletion_erase_database(p_job_id uuid, p_owner_account_id text)",
];

/** Must exist. `bodyMustMatchContract` is only meaningful for objects the final contract describes. */
const REQUIRED = [
  { signature: STRONG_ERASE, callSite: "lib/server/accountDeletionOrchestrator.ts", bodyMustMatchContract: true },
  { signature: EXECUTOR_CLAIM, callSite: "lib/server/accountDeletionExecutor.ts", bodyMustMatchContract: true },
  { signature: JOB_VALID, callSite: "called by the erasure entry point", bodyMustMatchContract: false },
  { signature: UNCHECKED, callSite: "called by the erasure entry point", bodyMustMatchContract: false },
  { signature: CT_EQ, callSite: "called by the authority predicate", bodyMustMatchContract: false },
];

for (const required of REQUIRED) {
  const actual = bySignature.get(required.signature);
  if (!actual) {
    fail(`function missing: ${required.signature}  — called from ${required.callSite}`);
    continue;
  }

  // SECURITY DEFINER without a fixed search_path lets the caller choose what unqualified names in
  // the body resolve to. ct_eq is immutable and not security definer, so it is exempt by shape.
  if (actual.security_definer && !/search_path=/.test(actual.config ?? "")) {
    fail(`${required.signature}: SECURITY DEFINER with no fixed search_path`);
  }

  if (required.bodyMustMatchContract) {
    const expected = contractBySignature.get(required.signature);
    if (!expected) {
      fail(`${required.signature}: the final contract does not describe it, so its body cannot be verified`);
    } else if (expected.hash !== actual.hash) {
      // The body hash is the point: it distinguishes the final definition from any superseded one.
      fail(`${required.signature}: BODY DIFFERS from the final promoted contract`);
    }
  }
}

for (const forbidden of FORBIDDEN) {
  if (bySignature.has(forbidden)) {
    fail(
      `weak erasure signature present: ${forbidden} — it erases from an owner id alone, with none of ` +
        `the exact-job, executor-token and generation authority 202608010110/111 require`,
    );
  }
}

// ── reachability ────────────────────────────────────────────────────────────
//
// PostgREST publishes public-schema functions as RPC under the anon key, so an EXECUTE grant here is
// an internet-facing endpoint, not an implementation detail.

const grantsOf = (fn) => (fn?.grants ?? []).map(String);
const hasGrant = (fn, role) => grantsOf(fn).some((g) => g.startsWith(`${role}:`));

const strong = bySignature.get(STRONG_ERASE);
if (strong && !hasGrant(strong, "service_role")) {
  fail(`${STRONG_ERASE}: service_role cannot execute the only authorized erasure entry point`);
}

const unchecked = bySignature.get(UNCHECKED);
if (unchecked && hasGrant(unchecked, "service_role")) {
  fail(
    `${UNCHECKED}: service_role can execute the UNCHECKED implementation — it performs the erasure ` +
      `with no authority check at all; only the wrapper may reach it`,
  );
}

for (const signature of [STRONG_ERASE, EXECUTOR_CLAIM, UNCHECKED, JOB_VALID, CT_EQ]) {
  const fn = bySignature.get(signature);
  if (!fn) continue;
  for (const role of ["anon", "authenticated", "PUBLIC"]) {
    if (hasGrant(fn, role)) fail(`${signature}: executable by ${role}`);
  }
}

const summary = {
  mode: "preview-runtime-contract",
  catalogue: CATALOGUE,
  contract: CONTRACT,
  required: REQUIRED.length,
  forbidden_checked: FORBIDDEN.length,
  failures: failures.length,
};
console.log(JSON.stringify(summary, null, 2));
for (const f of failures) console.error(`  FAIL ${f}`);
if (failures.length > 0) process.exit(1);
console.log("\nthe deployed application's database contract is present and correctly privileged");
