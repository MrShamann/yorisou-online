// POR-1 — the promotion compiler's function-privilege emission.
//
// WHY THIS TEST EXISTS.
//
// The compiler classifies `yorisou_line_subject_lock` under NO_SERVICE_ROLE_EXECUTE and used to
// honour that by simply NOT emitting a grant, with a comment saying so. Not granting is not the
// same as not granted: a Supabase project carries
//
//   alter default privileges ... grant execute on functions to service_role
//
// so `create function` in the public schema hands service_role EXECUTE **directly**. The
// revoke-from-public that precedes it cannot remove a directly-held privilege. The result was a
// promotion set that violated its own 202608010108 assertion on the first real Supabase apply,
// while every bare-PostgreSQL rehearsal passed — because bare PostgreSQL has no such default, so
// service_role only ever held EXECUTE through PUBLIC.
//
// The regression this locks down is therefore precise: a comment claiming the privilege is withheld
// is NOT sufficient; an explicit conditional revoke must be emitted. These tests drive the real
// compiler binary over fixture catalogues, so they check the artifact that actually ships.

import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { NO_SERVICE_ROLE_EXECUTE, PRODUCTION_ONLY_DELETION_FAMILIES } from "../promotion-plan.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");
const COMPILER = join(ROOT, "scripts", "por1", "compile-promotion.mjs");

// The internal-only helper, and an ordinary P4 entry point that must keep its grant. Both are real
// P4 names so the compiler can place them in a reviewed group; nothing else about them matters.
const LOCK_FN = "yorisou_line_subject_lock";
const ENTRY_FN = "yorisou_line_activity_record";

const fn = (name, identityArgs) => ({
  name,
  signature: `${name}(${identityArgs})`,
  identity_args: identityArgs,
  full_args: identityArgs,
  result: "void",
  language: "plpgsql",
  security_definer: true,
  volatility: "v",
  parallel: "u",
  leakproof: false,
  owner: "postgres",
  config: "search_path=public",
  grants: ["postgres:EXECUTE"],
  definition: `CREATE OR REPLACE FUNCTION public.${name}(${identityArgs})\n RETURNS void\n LANGUAGE plpgsql\n SECURITY DEFINER\n SET search_path TO 'public'\nAS $function$ begin return; end $function$`,
  hash: `hash-${name}`,
});

const emptyCatalogue = () => ({
  schema: "public",
  extracted_by: "fixture",
  counts: {},
  extensions: [],
  tables: [],
  functions: [],
  sequences: [],
  triggers: [],
  fk_edges: [],
  catalogue_hash: "fixture",
});

/** Run the real compiler over fixtures and return the generated P4 SQL. */
function compileFixture() {
  const dir = mkdtempSync(join(tmpdir(), "por1-privilege-test-"));
  try {
    const preview = emptyCatalogue();
    // A deletion body naming every Production-only family: the compiler refuses to emit unless the
    // promoted deletion functions still name them, and that invariant is not what this test is
    // about. Satisfying it honestly keeps the fixture minimal without disabling a real guard.
    const deletionStub = fn("yorisou_account_deletion_erase_database", "p_owner_account_id text");
    deletionStub.definition = deletionStub.definition.replace(
      "begin return; end",
      `begin ${PRODUCTION_ONLY_DELETION_FAMILIES.map((t) => `-- ${t}`).join(" ")} return; end`,
    );
    preview.functions = [
      fn(LOCK_FN, "p_line_subject_hash text"),
      fn(ENTRY_FN, "p_line_subject_hash text"),
      deletionStub,
    ];
    const production = emptyCatalogue();

    const previewPath = join(dir, "preview.json");
    const productionPath = join(dir, "production.json");
    writeFileSync(previewPath, JSON.stringify(preview));
    writeFileSync(productionPath, JSON.stringify(production));

    // The compiler writes its contract to a path relative to process.cwd(), so it MUST run with the
    // temp directory as cwd — running it in the repository root makes this test overwrite the real
    // supabase/contracts/por1-promotion-contract.json with fixture output. (Observed, not theorised.)
    mkdirSync(join(dir, "supabase", "contracts"), { recursive: true });
    execFileSync(
      process.execPath,
      [COMPILER, "--preview", previewPath, "--production", productionPath, "--out-dir", dir],
      { cwd: dir, stdio: ["ignore", "pipe", "pipe"] },
    );

    const p4 = readFileSync(join(dir, "202608010104_por1_canonical_line_activity.sql"), "utf8");
    return p4;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * The `do $$ begin ... end $$;` privilege block for one function.
 *
 * Located by the revoke-from-public statement naming that exact function, NOT by the last mention
 * of the name: other functions CALL yorisou_line_subject_lock, so a naive lastIndexOf lands inside
 * a caller's body and silently tests the wrong text.
 */
function privilegeBlockFor(sql, name) {
  const blocks = sql.split("do $$ begin").slice(1);
  const wanted = `revoke all on function public.${name}(`;
  const hit = blocks.find((b) => {
    const end = b.indexOf("end $$;");
    return end !== -1 && b.slice(0, end).includes(wanted);
  });
  assert.ok(hit, `no privilege block found for ${name}`);
  return hit.slice(0, hit.indexOf("end $$;"));
}

// ── THE EXCEPTION MUST BE ASSERTED, NOT MERELY SKIPPED ───────────────────────

test("an internal-only helper is revoked from service_role, not just left ungranted", () => {
  const sql = compileFixture();
  const block = privilegeBlockFor(sql, LOCK_FN);

  assert.match(block, /revoke all on function [^']*from public/, "must revoke PUBLIC first");
  assert.match(block, /rolname = 'anon'[\s\S]*revoke all on function [^']*from anon/, "must revoke anon when present");
  assert.match(
    block,
    /rolname = 'authenticated'[\s\S]*revoke all on function [^']*from authenticated/,
    "must revoke authenticated when present",
  );

  // The defect: the comment existed, the revoke did not.
  assert.match(
    block,
    /rolname = 'service_role'[\s\S]*revoke all on function [^']*from service_role/,
    "an internal-only helper MUST be explicitly revoked from service_role — Supabase default " +
      "privileges may have granted EXECUTE directly, and a comment does not remove a privilege",
  );
  assert.doesNotMatch(block, /grant execute on function [^']*to service_role/, "must not be granted");
});

test("the service_role revoke is role-conditional, so a bare PostgreSQL apply does not error", () => {
  const sql = compileFixture();
  const block = privilegeBlockFor(sql, LOCK_FN);
  const revokeIdx = block.indexOf("from service_role");
  const guardIdx = block.lastIndexOf("rolname = 'service_role'", revokeIdx);
  assert.notEqual(guardIdx, -1, "the revoke must sit inside an `if exists (... rolname = 'service_role')` guard");
});

// ── AND ORDINARY ENTRY POINTS MUST KEEP THEIR GRANT ─────────────────────────

test("an ordinary promoted function still grants execute to service_role", () => {
  const sql = compileFixture();
  const block = privilegeBlockFor(sql, ENTRY_FN);
  assert.match(block, /grant execute on function [^']*to service_role/, "entry points keep their grant");
  assert.doesNotMatch(block, /revoke all on function [^']*from service_role/, "no blanket service_role revoke");
});

test("the exception set is the only thing that decides this", () => {
  assert.ok(NO_SERVICE_ROLE_EXECUTE.has(LOCK_FN), "fixture assumes the lock helper is the exception");
  assert.ok(!NO_SERVICE_ROLE_EXECUTE.has(ENTRY_FN), "fixture assumes the entry point is not");
});

// ── THE SHIPPED MIGRATION, NOT ONLY THE GENERATOR ───────────────────────────

test("the checked-in 202608010104 carries the explicit service_role revoke", () => {
  const p4 = readFileSync(
    join(ROOT, "supabase", "migrations", "202608010104_por1_canonical_line_activity.sql"),
    "utf8",
  );
  const block = privilegeBlockFor(p4, LOCK_FN);
  assert.match(
    block,
    /rolname = 'service_role'[\s\S]*revoke all on function [^']*from service_role/,
    "the promotion migration that ships must contain the revoke",
  );
  assert.doesNotMatch(block, /grant execute on function [^']*to service_role/);
});

test("202608010108 still asserts the property — the fix is upstream, not a weakened assertion", () => {
  const p8 = readFileSync(
    join(ROOT, "supabase", "migrations", "202608010108_por1_promotion_contract_assertion.sql"),
    "utf8",
  );
  assert.match(p8, /yorisou_line_subject_lock/, "the assertion must still name the helper");
  assert.match(
    p8,
    /has_function_privilege\('service_role'[\s\S]*yorisou_line_subject_lock|yorisou_line_subject_lock[\s\S]*has_function_privilege\('service_role'/,
    "the assertion must still test service_role EXECUTE on the helper",
  );
  assert.match(p8, /is a lock building block, not an entry point/, "and still raise on violation");
});
