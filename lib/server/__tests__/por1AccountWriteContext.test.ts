import assert from "node:assert/strict";
import test from "node:test";

// POR-1 — the write context is the mechanism that makes the fence unavoidable, so these tests are
// about FORGERY and EXPIRY rather than about happy paths. The interesting question is never "does a
// real context work" — it is "does anything else work", and the answer has to be no.

import {
  ACCOUNT_MUTATION_OPERATIONS,
  AccountWriteContextViolation,
  assertAccountWriteContext,
  isLiveAccountWriteContext,
  mintAccountWriteContext,
  revokeAccountWriteContext,
  type AccountWriteContext,
} from "../accountWriteContext";

function violation(fn: () => void): AccountWriteContextViolation {
  try {
    fn();
  } catch (error) {
    assert.ok(error instanceof AccountWriteContextViolation, `expected a context violation, got ${error}`);
    return error;
  }
  throw new Error("expected a context violation, but the call succeeded");
}

test("a minted context authorises exactly the account it names", () => {
  const context = mintAccountWriteContext({
    kind: "mutation",
    accountId: "acct_a",
    operation: "password_update",
    leaseId: "lease-1",
    generation: 3,
  });

  assertAccountWriteContext(context, "acct_a");
  assert.equal(isLiveAccountWriteContext(context), true);

  // A live window for A is not a licence over B. Without this, one legitimate write would be a
  // general-purpose permit for the rest of the request.
  assert.equal(violation(() => assertAccountWriteContext(context, "acct_b")).reason, "context_account_mismatch");
});

test("a structurally identical object is NOT a context", () => {
  // This is the whole reason the guarantee is a WeakSet and not a TypeScript brand. Every one of
  // these satisfies the type; none of them passed through `mint`.
  const shapes: unknown[] = [
    { kind: "mutation", accountId: "acct_a", operation: "password_update", leaseId: "l", generation: 1 },
    JSON.parse('{"kind":"mutation","accountId":"acct_a","operation":"password_update","leaseId":"l","generation":1}'),
    Object.freeze({ kind: "deletion", accountId: "acct_a", operation: "account_recovery", leaseId: null, generation: 0 }),
    Object.create({ kind: "mutation", accountId: "acct_a" }),
  ];

  for (const shape of shapes) {
    assert.equal(isLiveAccountWriteContext(shape), false);
    assert.equal(
      violation(() => assertAccountWriteContext(shape as AccountWriteContext, "acct_a")).reason,
      "context_revoked",
    );
  }
});

test("a CLONE of a real context is not a context", () => {
  const real = mintAccountWriteContext({
    kind: "mutation",
    accountId: "acct_a",
    operation: "line_binding",
    leaseId: "lease-2",
    generation: 1,
  });

  // Spreading a valid context produces something that passes every structural check and holds none
  // of the authority — identity, not shape, is what is recorded.
  const clone = { ...real };
  assert.equal(isLiveAccountWriteContext(clone), false);
  assert.equal(violation(() => assertAccountWriteContext(clone as AccountWriteContext, "acct_a")).reason, "context_revoked");
});

test("a revoked context fails exactly like a forged one", () => {
  const context = mintAccountWriteContext({
    kind: "mutation",
    accountId: "acct_a",
    operation: "support_profile_update",
    leaseId: "lease-3",
    generation: 1,
  });
  assertAccountWriteContext(context, "acct_a");

  revokeAccountWriteContext(context);

  // The stale-write bug wearing the fence's own badge: a context captured in a closure and reused
  // after its lease was released. It must be as dead as a fabricated one.
  assert.equal(violation(() => assertAccountWriteContext(context, "acct_a")).reason, "context_revoked");
  assert.equal(isLiveAccountWriteContext(context), false);
});

test("null and undefined are refused, and refused distinguishably", () => {
  assert.equal(violation(() => assertAccountWriteContext(null)).reason, "context_required");
  assert.equal(violation(() => assertAccountWriteContext(undefined)).reason, "context_required");
});

test("the runtime operation set matches the migration's closed set exactly", async () => {
  // The SQL constraint and the TypeScript union are two statements of one rule. If they drift, a
  // write takes a lease the database rejects — at runtime, on the deletion path, in production.
  //
  // THIS TEST USED TO PIN ONE FILE, AND THAT WAS THE SAME BLIND SPOT the erasure-coverage guard
  // had: it read a single preview-only migration, so a later migration that legitimately widened
  // the closed set failed here even though the database it produces is correct. The authoritative
  // set is whichever migration declares it LAST across both trees — the same rule the erasure plan
  // follows. It is still a closed set and still exact parity; only the resolution changed.
  const { readFileSync, readdirSync, existsSync } = await import("node:fs");
  const { join } = await import("node:path");

  const trees = ["supabase/preview-only-migrations", "supabase/migrations"].filter((dir) =>
    existsSync(dir),
  );
  const candidates: Array<{ name: string; sql: string }> = [];
  for (const dir of trees) {
    for (const name of readdirSync(dir).filter((file) => file.endsWith(".sql")).sort()) {
      const sql = readFileSync(join(dir, name), "utf8");
      if (/operation_code\s*(in|=\s*any)\s*\(/i.test(sql)) candidates.push({ name, sql });
    }
  }
  assert.ok(candidates.length > 0, "no migration declares a closed operation_code set");
  // Newest declaration wins, by version-sorted filename across the trees.
  candidates.sort((a, b) => a.name.localeCompare(b.name));
  const authoritative = candidates[candidates.length - 1];

  const constraint =
    /operation_code\s*in\s*\(([\s\S]*?)\)\)/.exec(authoritative.sql) ??
    /operation_code\s*=\s*any\s*\(array\[([\s\S]*?)\]\)/i.exec(authoritative.sql);
  assert.ok(constraint, `${authoritative.name} must declare a closed operation_code set`);
  const inSql = [...new Set([...constraint[1].matchAll(/'([a-z_]+)'/g)].map((match) => match[1]))].sort();
  const inRuntime = [...ACCOUNT_MUTATION_OPERATIONS].sort();

  assert.deepEqual(inRuntime, inSql, `runtime vocabulary drifted from ${authoritative.name}`);
  // Thirteen POR-1 account/identity operations, plus the two CPR-1 assessment mutations that can
  // create or reassign an owned assessment source. Fewer would mean a write path with no code,
  // which cannot be leased; more would mean an unreviewed operation entered the closed set.
  assert.equal(inRuntime.length, 15);
});

test("every required operation code is present", () => {
  for (const required of [
    "support_profile_update",
    "password_update",
    "line_binding",
    "account_profile_update",
    "identity_mirror_sync",
    "session_identity_upgrade",
    "account_recovery",
    "account_registration",
    "line_primary_provisioning",
    "password_reset_issue",
    "session_account_binding",
    "foundation_profile_update",
    "foundation_identity_binding",
    "assessment_attempt_claim",
    "assessment_attempt_complete",
  ]) {
    assert.ok(
      (ACCOUNT_MUTATION_OPERATIONS as readonly string[]).includes(required),
      `missing operation code: ${required}`,
    );
  }
});
