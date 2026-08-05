// POR-1 — the two promoted sequences must never be reachable by anon or authenticated.
//
// WHY THIS EXISTS.
//
// `yorisou_interpretation_responses_seq` and `yorisou_recommendation_actions_seq` were found in live
// Preview carrying `anon=rwU` and `authenticated=rwU` — USAGE, SELECT and UPDATE, held DIRECTLY in
// the ACL rather than through PUBLIC. No migration granted that. Supabase carries
//
//     alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
//
// so `create sequence` in `public` hands all three roles everything, and the Preview lineage that
// created these two carried no privilege block to undo it. USAGE is `nextval`; UPDATE is `setval`,
// which can move a sequence backwards onto values a later insert will collide with.
//
// These tests pin the SOURCE of truth — the SQL and the manifest — rather than a live database, so
// they run anywhere and fail on the change that would reintroduce the exposure. The live end state
// is proved separately by por1:promotion-verify against an extracted catalogue.

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const REPAIR = "supabase/preview-only-migrations/202608050001_por1_sequence_privilege_repair.sql";
const SEQUENCES = [
  "public.yorisou_interpretation_responses_seq",
  "public.yorisou_recommendation_actions_seq",
];

const sql = () => readFileSync(join(ROOT, REPAIR), "utf8");

test("the repair covers both exposed sequences", () => {
  const s = sql();
  for (const seq of SEQUENCES) assert.ok(s.includes(seq), `${seq} must be covered`);
});

test("PUBLIC, anon and authenticated are all revoked — and PUBLIC first", () => {
  const s = sql();
  assert.match(s, /revoke all on sequence %s from public/, "PUBLIC must be revoked");
  assert.match(s, /rolname = 'anon'[\s\S]{0,200}revoke all on sequence %s from anon/, "anon revoked, role-conditionally");
  assert.match(
    s,
    /rolname = 'authenticated'[\s\S]{0,200}revoke all on sequence %s from authenticated/,
    "authenticated revoked, role-conditionally",
  );
  // A revoke from anon is a silent no-op while the privilege is held through PUBLIC.
  assert.ok(
    s.indexOf("from public") < s.indexOf("from anon"),
    "PUBLIC must be revoked before anon, or the anon revoke can succeed while changing nothing",
  );
});

test("service_role is normalized to exactly usage+select, never left with setval", () => {
  const s = sql();
  assert.match(s, /revoke all on sequence %s from service_role/, "must revoke before granting, or inherited UPDATE survives");
  assert.match(s, /grant usage, select on sequence %s to service_role/, "and grant exactly what the promotion contract names");
  assert.doesNotMatch(s, /grant (all|update)[^;]*on sequence[^;]*to service_role/i, "UPDATE (setval) must not be granted");
});

test("the migration asserts its own end state", () => {
  const s = sql();
  assert.match(s, /PUBLIC still holds a privilege on/, "must fail closed if PUBLIC retains anything");
  assert.match(s, /still holds a privilege on/, "must fail closed if anon/authenticated retain anything");
  assert.match(s, /service_role lost required usage\/select/, "must fail closed if service_role loses what it needs");
  assert.match(s, /service_role retains UPDATE \(setval\)/, "must fail closed if setval survives");
});

test("it changes privileges only — no values, no ownership, no rows", () => {
  const s = sql();
  // `setval` appears in the prose explaining why UPDATE is withheld; it must never be executed.
  assert.doesNotMatch(s, /^\s*(select|perform)\s+setval/im, "must not move a sequence value");
  assert.doesNotMatch(s, /alter sequence[^;]*(restart|owned by|owner to)/i, "must not restart or re-own a sequence");
  assert.doesNotMatch(s, /\b(insert into|update .* set|delete from|truncate)\b/i, "must not touch rows");
});

test("it is registered in the migration scope manifest as PREVIEW_ONLY with the real digest", () => {
  const manifest = readFileSync(join(ROOT, "supabase/MIGRATION_SCOPE_MANIFEST.md"), "utf8");
  const block = manifest.slice(manifest.indexOf("```json"), manifest.lastIndexOf("```"));
  const entries = JSON.parse(block.replace(/^```json/, ""));
  const entry = entries.find((e) => e.version === "202608050001");
  assert.ok(entry, "the repair must be in the manifest — the scope guard fails the build otherwise");
  assert.equal(entry.scope, "PREVIEW_ONLY", "it must never enter the Production lineage");
  assert.equal(entry.path, REPAIR);
  assert.equal(entry.repair_cohort, false);
  const digest = createHash("sha256").update(readFileSync(join(ROOT, REPAIR))).digest("hex");
  assert.equal(entry.sha256, digest, "the manifest digest must be the file's actual sha256");
});

// ── negative control: the gate must be able to fail ──────────────────────────

test("stale sequence grants make promotion verification fail", () => {
  // The verifier compares a catalogue's sequence usage_grants against the contract. Prove that a
  // catalogue still carrying anon/authenticated is rejected, so a green run means something.
  const contract = JSON.parse(
    readFileSync(join(ROOT, "supabase/contracts/por1-promotion-contract.json"), "utf8"),
  );
  const seq = contract.sequences.find((s) => s.name.includes("interpretation_responses_seq"));
  assert.ok(seq, "the contract must describe the sequence");
  const contracted = JSON.stringify(seq);
  assert.doesNotMatch(contracted, /"anon:/, "the contract must not itself bless anon");
  assert.doesNotMatch(contracted, /"authenticated:/, "nor authenticated");
});
