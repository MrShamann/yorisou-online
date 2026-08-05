// POR-1 — the Preview runtime compatibility verifier must fail closed.
//
// WHY THIS EXISTS.
//
// At 108c939 the live Preview passed `por1:promotion-verify` with zero failures and the hosted
// acceptance then failed a real deletion with a 500. Both were correct: the promotion verifier
// checks the compiler's contract, which describes 101…108, and the four-argument erasure entry
// point is created by 110/111. A gate that cannot see that gap is worse than no gate, because it
// reads as reassurance.
//
// So these tests drive the SHIPPED verifier as a subprocess over synthetic catalogues and assert
// both directions. The verifier's logic is never mocked or reimplemented here — if it stops failing
// closed, so does this file.

import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const VERIFIER = join(ROOT, "scripts", "por1", "verify-preview-runtime-contract.mjs");
const FINAL_CONTRACT = join(ROOT, "supabase", "contracts", "por1-final-promoted-contract.json");

const STRONG =
  "yorisou_account_deletion_erase_database(p_job_id uuid, p_owner_account_id text, p_executor_token_hash text, p_executor_generation integer)";
const CLAIM =
  "yorisou_account_deletion_executor_claim(p_owner_account_id text, p_token_hash text, p_ttl_seconds integer)";
const UNCHECKED = "yorisou_account_deletion_erase_database_unchecked(p_owner_account_id text)";
const JOB_VALID =
  "yorisou_account_erasure_job_valid(p_job_id uuid, p_owner_account_id text, p_executor_token_hash text, p_executor_generation integer)";
const CT_EQ = "yorisou_ct_eq(a text, b text)";
const WEAK = "yorisou_account_deletion_erase_database(p_owner_account_id text)";

const contract = JSON.parse(readFileSync(FINAL_CONTRACT, "utf8"));
const fromContract = (signature) => contract.functions.find((f) => f.signature === signature);

/**
 * A catalogue in the extractor's shape describing a Preview that is CORRECT. Bodies are taken from
 * the final contract so the hash checks pass by construction, leaving each test free to break
 * exactly one thing.
 */
function healthyCatalogue() {
  const fn = (signature, extra = {}) => {
    const contracted = fromContract(signature);
    return {
      name: signature.slice(0, signature.indexOf("(")),
      signature,
      hash: contracted?.hash ?? `hash-${signature}`,
      result: contracted?.result ?? "jsonb",
      language: "plpgsql",
      security_definer: true,
      volatility: "v",
      config: "search_path=public",
      grants: ["postgres:EXECUTE"],
      ...extra,
    };
  };
  return {
    schema: "public",
    extracted_by: "preview-runtime-contract.test.mjs fixture",
    counts: {},
    extensions: [],
    tables: [],
    functions: [
      fn(STRONG, { grants: ["postgres:EXECUTE", "service_role:EXECUTE"] }),
      fn(CLAIM, { grants: ["postgres:EXECUTE", "service_role:EXECUTE"] }),
      fn(UNCHECKED),
      fn(JOB_VALID),
      fn(CT_EQ, { security_definer: false, config: "" }),
    ],
    sequences: [],
    triggers: [],
    fk_edges: [],
    catalogue_hash: "fixture",
  };
}

function runVerifier(catalogue) {
  const dir = mkdtempSync(join(tmpdir(), "por1-preview-runtime-"));
  try {
    const path = join(dir, "catalogue.json");
    writeFileSync(path, JSON.stringify(catalogue));
    const r = spawnSync(process.execPath, [VERIFIER, "--catalogue", path, "--contract", FINAL_CONTRACT], {
      cwd: ROOT,
      encoding: "utf8",
    });
    return { status: r.status, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const without = (catalogue, signature) => ({
  ...catalogue,
  functions: catalogue.functions.filter((f) => f.signature !== signature),
});
const mutate = (catalogue, signature, patch) => ({
  ...catalogue,
  functions: catalogue.functions.map((f) => (f.signature === signature ? { ...f, ...patch } : f)),
});

// ── the positive control ────────────────────────────────────────────────────

test("clean control: a correct Preview passes the real verifier", () => {
  const { status, stderr } = runVerifier(healthyCatalogue());
  assert.equal(status, 0, `a correct catalogue must pass; stderr:\n${stderr}`);
});

// ── the negative controls: each is a state that shipped or could ship ───────

test("the weak owner-only signature restored → verifier fails", () => {
  const dirty = healthyCatalogue();
  dirty.functions.push({
    name: "yorisou_account_deletion_erase_database",
    signature: WEAK,
    hash: "whatever",
    result: "jsonb",
    language: "plpgsql",
    security_definer: true,
    volatility: "v",
    config: "search_path=public",
    grants: ["postgres:EXECUTE", "service_role:EXECUTE"],
  });
  const { status, stderr } = runVerifier(dirty);
  assert.notEqual(status, 0, "a restored weak signature must fail the gate");
  assert.match(stderr, /weak erasure signature present/);
});

test("the strong signature missing → verifier fails (this is the 108c939 state)", () => {
  const { status, stderr } = runVerifier(without(healthyCatalogue(), STRONG));
  assert.notEqual(status, 0);
  assert.match(stderr, /function missing/);
  assert.match(stderr, /accountDeletionOrchestrator\.ts/, "and it must name the call site");
});

test("a wrong strong body → verifier fails", () => {
  const { status, stderr } = runVerifier(mutate(healthyCatalogue(), STRONG, { hash: "0000deadbeef" }));
  assert.notEqual(status, 0);
  assert.match(stderr, /BODY DIFFERS from the final promoted contract/);
});

test("service_role granted the unchecked helper → verifier fails", () => {
  const dirty = mutate(healthyCatalogue(), UNCHECKED, {
    grants: ["postgres:EXECUTE", "service_role:EXECUTE"],
  });
  const { status, stderr } = runVerifier(dirty);
  assert.notEqual(status, 0, "the unchecked implementation erases with no authority check at all");
  assert.match(stderr, /UNCHECKED implementation/);
});

test("a stale executor_claim body → verifier fails", () => {
  const { status, stderr } = runVerifier(mutate(healthyCatalogue(), CLAIM, { hash: "staleclaimbody" }));
  assert.notEqual(status, 0);
  assert.match(stderr, /executor_claim[\s\S]*BODY DIFFERS|BODY DIFFERS[\s\S]*executor_claim/);
});

test("any erasure function reachable by anon or authenticated → verifier fails", () => {
  for (const role of ["anon", "authenticated"]) {
    const dirty = mutate(healthyCatalogue(), STRONG, {
      grants: ["postgres:EXECUTE", "service_role:EXECUTE", `${role}:EXECUTE`],
    });
    const { status, stderr } = runVerifier(dirty);
    assert.notEqual(status, 0, `${role} must not reach an erasure function`);
    assert.match(stderr, new RegExp(`executable by ${role}`));
  }
});

test("service_role unable to execute the only authorized entry point → verifier fails", () => {
  const dirty = mutate(healthyCatalogue(), STRONG, { grants: ["postgres:EXECUTE"] });
  const { status, stderr } = runVerifier(dirty);
  assert.notEqual(status, 0);
  assert.match(stderr, /cannot execute the only authorized erasure entry point/);
});

test("SECURITY DEFINER without a fixed search_path → verifier fails", () => {
  const { status, stderr } = runVerifier(mutate(healthyCatalogue(), STRONG, { config: "" }));
  assert.notEqual(status, 0, "the caller would choose what unqualified names resolve to");
  assert.match(stderr, /no fixed search_path/);
});
