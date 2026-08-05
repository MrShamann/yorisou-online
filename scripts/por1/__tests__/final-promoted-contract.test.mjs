// POR-1 — the FINAL promoted contract describes the state after 111, not after 108.
//
// WHY THIS EXISTS.
//
// The promotion set is generated (101…108) and then overlaid by three hand-written migrations
// (109, 110, 111) that deliberately change the end state:
//
//   111  drops   yorisou_account_deletion_erase_database(text)       — owner-only, no job, no claim
//   111  drops   yorisou_account_deletion_erase_database(uuid, text)
//   110  replaces the body of yorisou_account_deletion_executor_claim(...)
//
// Verifying a database that has had all eleven applied against the compiler's contract — which
// stops at eight — reported `function missing` and `BODY DIFFERS`. Both statements were true about
// the comparison and false about reality. The fix was structural: a second, derived contract for the
// final state. These tests keep the two artifacts from drifting back into one, and keep the weak
// erasure interface from quietly coming back.
//
// The dangerous regression is not a red test. It is a GREEN one: `erase_database(text)` reappearing
// as a convenience overload would take an owner id and erase, with none of the job/claim authority
// 110 and 111 exist to enforce — and every caller of the strong signature would keep passing.

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const read = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));

const FINAL = "supabase/contracts/por1-final-promoted-contract.json";
const GENERATED = "supabase/contracts/por1-promotion-contract.json";

const WEAK = "yorisou_account_deletion_erase_database(p_owner_account_id text)";
const STRONG =
  "yorisou_account_deletion_erase_database(p_job_id uuid, p_owner_account_id text, p_executor_token_hash text, p_executor_generation integer)";
const CLAIM =
  "yorisou_account_deletion_executor_claim(p_owner_account_id text, p_token_hash text, p_ttl_seconds integer)";

const signatures = (contract) => new Set(contract.functions.map((f) => f.signature));

// ── the final contract is the post-111 state ────────────────────────────────

test("the final contract carries the job- and claim-bound erasure signature", () => {
  const final = read(FINAL);
  assert.ok(signatures(final).has(STRONG), "the strong 4-argument erase_database must be the promoted interface");
});

test("the weak owner-only erasure signature is absent from the final contract", () => {
  const final = read(FINAL);
  const weak = [...signatures(final)].filter(
    (s) => s.startsWith("yorisou_account_deletion_erase_database(") && !s.includes("p_job_id"),
  );
  assert.deepEqual(
    weak,
    [],
    "111 drops the owner-only and (uuid,text) erase signatures on purpose. If one is back, an " +
      "erasure can be requested without the exact job, the executor token or the generation that " +
      "110 and 111 exist to require — reintroducing the authority bypass, not a convenience.",
  );
});

test("executor_claim is present in the final contract at its real signature", () => {
  const final = read(FINAL);
  assert.ok(signatures(final).has(CLAIM), "the runtime calls exactly this signature");
  const entry = final.functions.find((f) => f.signature === CLAIM);
  assert.ok(entry.hash, "its body hash is the thing 110 changed and the pre-109 contract disputed");
  assert.equal(entry.security_definer, true);
  assert.match(entry.config, /search_path=/, "SECURITY DEFINER without a fixed search_path is an escalation shape");
});

// ── and it is genuinely a DIFFERENT artifact from the generator's ───────────

test("the two contracts disagree exactly where the overlays changed things", () => {
  const final = signatures(read(FINAL));
  const generated = signatures(read(GENERATED));

  assert.ok(generated.has(WEAK), "the generated contract legitimately still describes the pre-overlay state");
  assert.ok(!final.has(WEAK), "the final contract must not");
  assert.ok(final.has(STRONG), "and must carry the replacement");

  // The overlays only add and replace; nothing the generator promised may vanish except the
  // signatures 111 explicitly drops.
  const dropped = [...generated].filter((s) => !final.has(s));
  for (const s of dropped) {
    assert.match(
      s,
      /^yorisou_account_deletion_erase_database\((p_owner_account_id text|p_job_id uuid, p_owner_account_id text)\)$/,
      `${s} disappeared between the generated and final contracts and is not one of the signatures 111 drops`,
    );
  }
});

test("the final contract is derived, and says so", () => {
  const final = read(FINAL);
  assert.match(final.note, /build-final-contract\.sh/, "it must point at the script that regenerates it");
  assert.match(final.note, /202608010111/, "and name the state it represents");
  assert.deepEqual(final.counts, {
    tables: final.tables.length,
    functions: final.functions.length,
    sequences: final.sequences.length,
    triggers: final.triggers.length,
  });
});

// ── the rehearsal must verify against the final contract, not the generated one ──

test("the populated-lineage rehearsal verifies against the final contract", () => {
  const sh = readFileSync(join(ROOT, "tests/por1/populated-lineage-rehearsal.sh"), "utf8");
  assert.match(
    sh,
    /verify-promoted-contract\.mjs[\s\S]{0,200}por1-final-promoted-contract\.json/,
    "that rehearsal applies all eleven migrations, so it must check the post-111 contract",
  );
});
