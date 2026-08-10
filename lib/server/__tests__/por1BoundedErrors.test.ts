// §14 A — the error classifier. These are the regressions for the defect that hid a Production
// incident: `\bdeletion_[a-z_]+` could never match inside `account_deletion_...`, so the real reason
// was replaced by a code naming a subsystem that was not involved.
import assert from "node:assert/strict";
import test from "node:test";

import {
  boundedRpcErrorCode,
  classifyProviderFailure,
  extractBoundedErrorToken,
  isInfrastructureCode,
} from "../por1BoundedErrors";

const pgrst = (message: string, code = "P0001") => JSON.stringify({ code, message, details: null, hint: null });

// ── THE INCIDENT REGRESSION ─────────────────────────────────────────────────

test("account_deletion_erase_not_authorized survives exactly — the bug that hid the incident", () => {
  assert.equal(
    extractBoundedErrorToken("account_deletion_erase_not_authorized"),
    "account_deletion_erase_not_authorized",
  );
  assert.equal(
    boundedRpcErrorCode({ status: 400, bodyText: pgrst("account_deletion_erase_not_authorized") }),
    "account_deletion_erase_not_authorized",
  );
});

test("the old \\b-anchored expression could not have matched it, which is why this module exists", () => {
  // Demonstrates the defect rather than describing it: `_` is a word character, so there is no word
  // boundary before `deletion_` inside `account_deletion_...`.
  assert.equal(/\bdeletion_[a-z_]+/.exec("account_deletion_erase_not_authorized"), null);
  // And the replacement does match.
  assert.equal(
    extractBoundedErrorToken("account_deletion_erase_not_authorized"),
    "account_deletion_erase_not_authorized",
  );
});

test("account_deletion_job_not_found is preserved", () => {
  assert.equal(
    boundedRpcErrorCode({ status: 400, bodyText: pgrst("account_deletion_job_not_found") }),
    "account_deletion_job_not_found",
  );
});

test("account_erasure_* bounded tokens are preserved", () => {
  for (const token of ["account_erasure_authority_schema_unready", "account_erasure_not_authorized"]) {
    assert.equal(boundedRpcErrorCode({ status: 400, bodyText: pgrst(token) }), token);
  }
});

test("every governed namespace round-trips", () => {
  const samples = [
    "attempt_expired",
    "claim_already_used",
    "result_not_found",
    "assessment_attempt_invalid",
    "recommendation_action_conflict",
    "interpretation_nonce_conflict",
    "account_mutation_denied_erasing",
    "account_deletion_not_verifying",
    "account_erasure_authority_schema_unready",
    "line_event_duplicate",
    "line_subject_erased",
    "line_activity_absent",
    "identity_link_conflict",
  ];
  for (const token of samples) {
    assert.equal(extractBoundedErrorToken(`ERROR:  ${token}`), token, token);
  }
});

// ── NOTHING ELSE MAY ESCAPE ─────────────────────────────────────────────────

test("arbitrary database text is hidden", () => {
  const raw =
    'duplicate key value violates unique constraint "yorisou_accounts_pkey" DETAIL: Key (id)=(acct_123) already exists.';
  assert.equal(extractBoundedErrorToken(raw), null);
  const code = boundedRpcErrorCode({ status: 400, bodyText: JSON.stringify({ code: "23505", message: raw }) });
  assert.equal(code, "postgrest_unexpected:400");
  assert.ok(!code.includes("acct_123"));
  assert.ok(!code.includes("yorisou_accounts_pkey"));
});

test("secret-looking text is never returned", () => {
  // Assembled at runtime, never written as literals: a JWT-shaped or `sbp_`-shaped string checked
  // into source would itself trip the repository's secret-pattern hard gate. The point is to prove
  // the extractor rejects these SHAPES, and the shape survives concatenation.
  const jwtish = ["ey", "JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"].join("") + ".payload.signature";
  const providerish = ["sbp", "_"].join("") + "0123456789abcdef0123456789abcdef01234567";
  const secrets = [
    jwtish,
    providerish,
    "postgresql://postgres:hunter2@db.example.supabase.co:5432/postgres",
    "password=hunter2 token=abcdef",
  ];
  for (const secret of secrets) {
    assert.equal(extractBoundedErrorToken(secret), null, secret.slice(0, 20));
    const code = boundedRpcErrorCode({ status: 400, bodyText: JSON.stringify({ message: secret }) });
    assert.equal(code, "postgrest_unexpected:400");
  }
});

test("detail and hint are never consulted, so they cannot leak", () => {
  const body = JSON.stringify({
    code: "P0001",
    message: "account_deletion_erase_not_authorized",
    details: "owner acct_secret_id token abcdef",
    hint: "SELECT * FROM yorisou_account_deletion_jobs",
  });
  const code = boundedRpcErrorCode({ status: 400, bodyText: body });
  assert.equal(code, "account_deletion_erase_not_authorized");
  assert.ok(!code.includes("acct_secret_id"));
  assert.ok(!code.includes("SELECT"));
});

test("a bare namespace is not a code", () => {
  assert.equal(extractBoundedErrorToken("account_deletion_"), null);
  assert.equal(extractBoundedErrorToken("attempt_"), null);
});

test("a token embedded inside a longer identifier is not matched at the wrong boundary", () => {
  // `my_result_thing` must not yield `result_thing`: there is no token start before `result_`.
  assert.equal(extractBoundedErrorToken("my_result_thing"), null);
});

test("the longest governed prefix wins, so a family is never truncated", () => {
  assert.equal(
    extractBoundedErrorToken("account_deletion_executor_token_required"),
    "account_deletion_executor_token_required",
  );
});

// ── PROVIDER / INFRASTRUCTURE MAPPING ───────────────────────────────────────

test("structural provider failures map to bounded infrastructure codes", () => {
  assert.equal(classifyProviderFailure(404, "PGRST202"), "postgrest_rpc_unavailable");
  assert.equal(classifyProviderFailure(404, null), "postgrest_rpc_unavailable");
  assert.equal(classifyProviderFailure(401, null), "postgrest_unauthorized");
  assert.equal(classifyProviderFailure(403, null), "postgrest_forbidden");
  assert.equal(classifyProviderFailure(400, "P0001"), null, "a raised exception is not an infra failure");
});

test("a missing function is reported as unavailable, never as an assessment failure", () => {
  const code = boundedRpcErrorCode({
    status: 404,
    bodyText: JSON.stringify({
      code: "PGRST202",
      message: "Could not find the function public.yorisou_account_deletion_erase_database",
    }),
  });
  assert.equal(code, "postgrest_rpc_unavailable");
  assert.ok(isInfrastructureCode(code));
  assert.ok(!code.startsWith("assessment_"), "blaming assessment persistence is the defect being fixed");
});

test("a governed token outranks an infrastructure guess", () => {
  // Even on a 404, a database that named a reason has told us more than the transport can.
  assert.equal(
    boundedRpcErrorCode({ status: 404, bodyText: pgrst("account_deletion_job_not_found") }),
    "account_deletion_job_not_found",
  );
});

test("a non-JSON body is still scanned but never echoed", () => {
  assert.equal(
    boundedRpcErrorCode({ status: 400, bodyText: "ERROR: account_deletion_erase_not_authorized" }),
    "account_deletion_erase_not_authorized",
  );
  assert.equal(boundedRpcErrorCode({ status: 500, bodyText: "<html>gateway exploded</html>" }), "postgrest_unexpected:500");
});
