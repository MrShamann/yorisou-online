// POR-1 — the ACCOUNT_ERASURE_AUTHORITY readiness rule.
//
// This exists because of a specific failure, not a hypothetical one. At 108c939 the hosted
// acceptance ran a real deletion against a Preview database that did not have the four-argument
// erasure entry point, because 202608010110/111 are Production lineage and had never been applied
// there. The application found out by calling it, mid-deletion, and answered a generic 500.
//
// The four existing readiness flags all read `true` throughout — none of them covers the erasure
// family. So the decisive case here is the middle row of the table: executor ON, schema ABSENT must
// REFUSE, and must refuse before a new job is claimed rather than at the erasure call.

import assert from "node:assert/strict";
import test from "node:test";

import {
  accountErasureAuthoritySchemaReady,
  decideErasureAuthority,
} from "../accountErasureAuthorityRollout";

const ENV = "YORISOU_POR1_ACCOUNT_ERASURE_AUTHORITY_SCHEMA_READY";

function withEnv(value: string | undefined, run: () => void) {
  const previous = process.env[ENV];
  if (value === undefined) delete process.env[ENV];
  else process.env[ENV] = value;
  try {
    run();
  } finally {
    if (previous === undefined) delete process.env[ENV];
    else process.env[ENV] = previous;
  }
}

// ── readiness is a stated fact, and absence is never "probably fine" ────────

test("readiness is true only for the exact opt-in value", () => {
  withEnv("on", () => assert.equal(accountErasureAuthoritySchemaReady(), true));
});

test("an absent flag is NOT ready", () => {
  withEnv(undefined, () => assert.equal(accountErasureAuthoritySchemaReady(), false));
});

test("a missing schema cannot be talked into readiness by a truthy-looking value", () => {
  for (const value of ["", "off", "false", "true", "1", "yes", "ON", "on "]) {
    withEnv(value, () => {
      assert.equal(
        accountErasureAuthoritySchemaReady(),
        value === "on",
        `${JSON.stringify(value)} must not be read as ready unless it is exactly "on"`,
      );
    });
  }
});

// ── the decision table ──────────────────────────────────────────────────────

test("executor off + schema absent → dormant legacy behaviour, nothing changes", () => {
  assert.deepEqual(decideErasureAuthority({ executorEnabled: false, schemaReady: false }), {
    mode: "executor_disabled",
  });
});

test("executor off + schema present → still dormant; readiness is not activation", () => {
  assert.deepEqual(decideErasureAuthority({ executorEnabled: false, schemaReady: true }), {
    mode: "executor_disabled",
  });
});

test("executor ON + schema absent → FAIL CLOSED, and no erasure RPC is reachable from here", () => {
  const decision = decideErasureAuthority({ executorEnabled: true, schemaReady: false });
  assert.deepEqual(decision, {
    mode: "refuse_infrastructure_unready",
    reason: "account_erasure_authority_schema_unready",
  });
  // The classification must be bounded and specific — a generic 500 is what shipped and is exactly
  // what this replaces.
  assert.notEqual(decision.mode, "strong_erasure");
});

test("executor ON + schema present → the strong path, and only the strong path", () => {
  assert.deepEqual(decideErasureAuthority({ executorEnabled: true, schemaReady: true }), {
    mode: "strong_erasure",
  });
});

test("a weak owner-only fallback is not expressible", () => {
  // Enumerate the whole decision space; no input may produce anything but these three modes.
  const modes = new Set<string>();
  for (const executorEnabled of [true, false]) {
    for (const schemaReady of [true, false]) {
      for (const alreadyIrreversible of [true, false, undefined]) {
        modes.add(decideErasureAuthority({ executorEnabled, schemaReady, alreadyIrreversible }).mode);
      }
    }
  }
  assert.deepEqual(
    [...modes].sort(),
    ["executor_disabled", "refuse_infrastructure_unready", "strong_erasure"],
    "there must be no fallback mode: the owner-only RPC erases without job, token or generation",
  );
});

// ── the one case that must NOT refuse ───────────────────────────────────────

test("an already-irreversible job keeps its governed resume semantics", () => {
  // Refusing here would abandon a partially executed deletion — worse than the unreadiness it reacts
  // to. The resume still needs the same authority, so an unready database fails that job's step and
  // leaves it resumable, rather than orphaning it.
  assert.deepEqual(
    decideErasureAuthority({ executorEnabled: true, schemaReady: false, alreadyIrreversible: true }),
    { mode: "strong_erasure" },
  );
});
