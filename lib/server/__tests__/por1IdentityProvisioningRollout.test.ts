import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, it } from "node:test";

import {
  decideProvisioningAccess,
  isIdentityProvisioningSchemaReady,
  provisioningHttpStatus,
  resolveProvisioningMode,
  type ProvisioningOutcome,
} from "../identityProvisioningRollout";

const KEY = "YORISOU_POR1_IDENTITY_PROVISIONING_SCHEMA_READY";
const ROOT = process.cwd();
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

afterEach(() => {
  delete process.env[KEY];
});

describe("POR-1 identity provisioning rollout", () => {
  it("falls back to the inline path when the saga schema is not deployed", () => {
    assert.equal(resolveProvisioningMode({ schemaReady: false }), "inline_verified");
  });

  it("uses the durable saga when the schema is deployed", () => {
    assert.equal(resolveProvisioningMode({ schemaReady: true }), "durable_saga");
  });

  it("fails closed to inline when readiness is unset, and requires the exact string \"on\"", () => {
    delete process.env[KEY];
    assert.equal(isIdentityProvisioningSchemaReady(), false);
    for (const value of ["", " ", "1", "true", "yes", "ON!", "off", "enabled"]) {
      process.env[KEY] = value;
      assert.equal(isIdentityProvisioningSchemaReady(), false, `"${value}" must not enable`);
    }
    for (const value of ["on", "ON", " On "]) {
      process.env[KEY] = value;
      assert.equal(isIdentityProvisioningSchemaReady(), true, `"${value}" must enable`);
    }
  });

  it("is readiness, not a fifth capability", () => {
    // The four YORISOU_POR1_* switches are product kill switches an operator flips to stop a
    // misbehaving feature. This is whether a schema exists. Conflating them would mean disabling a
    // product capability also silently disabled the durability of registration.
    const source = read("lib/server/identityProvisioningRollout.ts");
    for (const capability of [
      "CANONICAL_CORE",
      "CANONICAL_RECOMMENDATIONS",
      "LINE_CANONICAL_RETURN",
      "ACCOUNT_DELETION_EXECUTOR",
    ]) {
      assert.ok(!source.includes(capability), `readiness must not reference the ${capability} capability`);
    }
  });
});

describe("POR-1 registration response contract", () => {
  it("maps every bounded outcome, and only `completed` is a 200", () => {
    const outcomes: ProvisioningOutcome[] = ["completed", "email_exists", "in_progress", "retryable", "terminal"];
    const statuses = outcomes.map((outcome) => [outcome, provisioningHttpStatus(outcome)] as const);
    assert.deepEqual(statuses, [
      ["completed", 200],
      ["email_exists", 409],
      ["in_progress", 503],
      ["retryable", 503],
      ["terminal", 500],
    ]);
    assert.equal(statuses.filter(([, status]) => status === 200).length, 1);
  });

  it("classifies a retryable failure as 503, never as an unclassified 500", () => {
    // A retryable failure returned as 500 teaches every caller to ignore 500s, and a 500 is the one
    // code this contract reserves for a failure it genuinely cannot name.
    assert.equal(provisioningHttpStatus("retryable"), 503);
    assert.equal(provisioningHttpStatus("in_progress"), 503);
    assert.notEqual(provisioningHttpStatus("retryable"), provisioningHttpStatus("terminal"));
  });
});

describe("POR-1 registration route — the swallows are gone", () => {
  const route = read("app/api/auth/register/route.ts");

  it("no longer logs a failed canonical sync and continues", () => {
    // The exact two shapes that produced a 200 over an unproven canonical identity.
    assert.ok(
      !route.includes("register canonical sync did not reach deterministic principal state"),
      "the `deterministicPrincipal.ok === false` swallow is still present",
    );
    assert.ok(
      !route.includes("register foundation sync error"),
      "the `catch (foundationError)` swallow is still present",
    );
    assert.ok(
      !route.includes("ensureDeterministicEmailPrincipalForAccount"),
      "the route still drives canonical identity itself instead of going through the saga",
    );
  });

  it("no longer fabricates a bound session when the bind did not land", () => {
    // `(await bindSessionToUser(...)) || { ...session, userId: account.id }` produced an in-memory
    // object shaped like a bound session that no store had ever seen — and then set a cookie from it.
    assert.ok(!route.includes("bindSessionToUser"), "the route still binds the session itself");
    assert.ok(!/\|\|\s*\{\s*\.\.\.session/.test(route), "the fabricated-session fallback is still present");
  });

  it("sets an authenticated cookie only after a completed provisioning", () => {
    const cookieAt = route.indexOf("setViewerSessionCookie(response");
    const gateAt = route.indexOf('if (result.outcome !== "completed")');
    assert.ok(gateAt > 0, "the completion gate is missing");
    assert.ok(cookieAt > gateAt, "a cookie is set before the completion gate");
  });

  it("logs bounded, non-PII observability only", () => {
    const logLine = route.slice(route.indexOf('console.info("por1.registration"'), route.indexOf("if (result.outcome"));
    for (const forbidden of ["email", "password", "account.id", "session.id", "payload."]) {
      assert.ok(!logLine.includes(forbidden), `registration observability must not carry \`${forbidden}\``);
    }
    assert.ok(logLine.includes("durationMs"), "duration is required for the performance gate");
    assert.ok(logLine.includes("failureClass"), "the bounded failure class is required for diagnosis");
  });
});

describe("POR-1 provisioning — what it must never persist", () => {
  const migration = read("supabase/preview-only-migrations/202607310003_por1_identity_provisioning_saga.sql");

  it("stores no column that could hold a credential, an address or a body", () => {
    const table = migration.slice(
      migration.indexOf("create table if not exists public.yorisou_identity_provisioning_sagas"),
      migration.indexOf("do $$", migration.indexOf("create table if not exists public.yorisou_identity_provisioning_sagas")),
    );
    for (const forbidden of ["password", "cookie", "email text", "request_body", "secret", "token text"]) {
      assert.ok(!table.includes(forbidden), `the saga table must not declare \`${forbidden}\``);
    }
    // Everything identifying is a digest, and the constraints say so rather than the comments.
    for (const digestCheck of [
      "yorisou_provisioning_key_digest_check",
      "yorisou_provisioning_owner_digest_check",
      "yorisou_provisioning_session_digest_check",
    ]) {
      assert.ok(migration.includes(digestCheck), `missing digest constraint ${digestCheck}`);
    }
  });

  it("keeps the failure vocabulary closed", () => {
    assert.ok(
      migration.includes("yorisou_provisioning_failure_class_check"),
      "the failure class must be a closed enum, or it becomes where an exception message is stored",
    );
  });

  it("enables AND forces row level security", () => {
    assert.ok(migration.includes("enable row level security"));
    assert.ok(migration.includes("force row level security"));
    assert.ok(
      migration.includes("grant select on table public.yorisou_identity_provisioning_sagas to service_role"),
      "service_role must hold SELECT only; every write goes through a governed function",
    );
  });
});

describe("POR-1 incomplete-identity access gate", () => {
  const ACC = "acct-real";

  it("refuses only a saga that names THIS account and is not finished", () => {
    const denied = decideProvisioningAccess(
      { found: true, state: "account_created", accountId: ACC },
      ACC,
    );
    assert.deepEqual(denied, { allowed: false, reason: "identity_provisioning_incomplete" });
  });

  it("allows when there is no saga at all", () => {
    // An account created before this migration, or one whose provisioning row was purged with it.
    assert.deepEqual(decideProvisioningAccess({ found: false, state: null, accountId: null }, ACC), {
      allowed: true,
    });
  });

  it("allows a completed saga", () => {
    assert.deepEqual(
      decideProvisioningAccess({ found: true, state: "completed", accountId: ACC }, ACC),
      { allowed: true },
    );
  });

  it("cannot be used to lock a real account out of login", () => {
    // THE DEFECT THIS RULE EXISTS FOR. Attempting to register someone else's address opens a saga
    // keyed by a digest of that address. It creates nothing, so it has no account bound. If an
    // unbound saga were a reason to refuse, anyone could deny login to any account by submitting its
    // email to the registration form.
    for (const state of ["requested", "failed_retryable", "failed_terminal"]) {
      assert.deepEqual(
        decideProvisioningAccess({ found: true, state, accountId: null }, ACC),
        { allowed: true },
        `an unbound saga in state ${state} must not deny access`,
      );
    }
  });

  it("ignores a saga that names a different account", () => {
    assert.deepEqual(
      decideProvisioningAccess({ found: true, state: "account_created", accountId: "acct-someone-else" }, ACC),
      { allowed: true },
    );
  });
});
