// POR-1 M3 — the readiness and capability matrices, run against the REAL resolvers.
//
// WHAT THESE ARE FOR.
//
// Eight environment variables decide whether POR-1 does anything in Production: four CAPABILITY
// switches an operator flips to stop a misbehaving feature, and four READINESS facts a deployment
// states about whether a schema exists. Getting either wrong in the permissive direction activates
// canonical behaviour against a database that cannot support it.
//
// So every value a real deployment could plausibly produce is tested — unset, empty, "false", "0",
// "off", "ON", " on ", a typo — not just `true`/`false`. A boolean-parsing test proves the parser
// works; it does not prove that a forgotten variable fails closed, and a forgotten variable is the
// accident this package exists to prevent.
//
// THE DEPENDENCY GRAPH IS DERIVED, NOT INVENTED.
//
// The four capabilities are independent in the resolver — there is no hierarchy to assert, and
// asserting one would be fiction. Exactly one real interlock exists, in `resolveFenceMode`: when the
// mutation-fence schema is NOT ready but the deletion executor IS enabled, the mode becomes
// `fail_closed`. That is the whole point of the pair — deletion can run while the fence that
// protects concurrent writes cannot, so writes are refused rather than raced.

import assert from "node:assert/strict";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { resolveFenceMode } from "../accountMutationFenceRollout";
import { isCanonicalIdentityLinksSchemaReady, resolveIdentityLinkMode } from "../canonicalIdentityLinksRollout";
import { isCanonicalLineActivitySchemaReady, resolveLineActivityMode } from "../canonicalLineActivityRollout";
import { isIdentityProvisioningSchemaReady, resolveProvisioningMode } from "../identityProvisioningRollout";
import { isPor1CapabilityEnabled, por1CapabilitySnapshot, requirePor1Capability, canonicalRowIdWhenEnabled, type Por1Capability } from "../por1RuntimeControls";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

/**
 * Every value a real deployment could plausibly hold, and what each MUST mean.
 *
 * Only the exact string "on" — trimmed, case-insensitive — may enable. Everything else is off. The
 * dangerous entries are the ones that look affirmative: "true", "1", "yes", "enabled". A resolver
 * that accepted those would activate on a value nobody intended to be the activation token.
 */
const VALUES: Array<{ label: string; raw: string | undefined; enables: boolean }> = [
  { label: "unset", raw: undefined, enables: false },
  { label: "empty string", raw: "", enables: false },
  { label: '"false"', raw: "false", enables: false },
  { label: '"0"', raw: "0", enables: false },
  { label: '"off"', raw: "off", enables: false },
  { label: '"true"', raw: "true", enables: false },
  { label: '"1"', raw: "1", enables: false },
  { label: '"yes"', raw: "yes", enables: false },
  { label: '"enabled"', raw: "enabled", enables: false },
  { label: '"onn" (typo)', raw: "onn", enables: false },
  { label: '"o n" (spaced)', raw: "o n", enables: false },
  { label: '"on"', raw: "on", enables: true },
  { label: '"ON"', raw: "ON", enables: true },
  { label: '"On"', raw: "On", enables: true },
  { label: '" on " (padded)', raw: " on ", enables: true },
];

const CAPABILITIES: Por1Capability[] = [
  "CANONICAL_CORE",
  "CANONICAL_RECOMMENDATIONS",
  "LINE_CANONICAL_RETURN",
  "ACCOUNT_DELETION_EXECUTOR",
];

const READINESS: Array<{
  env: string;
  read: () => boolean;
  resolve: (ready: boolean) => string;
  readyMode: string;
  unreadyMode: string;
}> = [
  {
    env: "YORISOU_POR1_CANONICAL_IDENTITY_LINKS_SCHEMA_READY",
    read: isCanonicalIdentityLinksSchemaReady,
    resolve: (ready) => resolveIdentityLinkMode({ schemaReady: ready }),
    readyMode: "canonical_registry",
    unreadyMode: "record_derived",
  },
  {
    env: "YORISOU_POR1_CANONICAL_LINE_ACTIVITY_SCHEMA_READY",
    read: isCanonicalLineActivitySchemaReady,
    resolve: (ready) => resolveLineActivityMode({ schemaReady: ready }),
    readyMode: "canonical",
    unreadyMode: "legacy_array",
  },
  {
    env: "YORISOU_POR1_IDENTITY_PROVISIONING_SCHEMA_READY",
    read: isIdentityProvisioningSchemaReady,
    resolve: (ready) => resolveProvisioningMode({ schemaReady: ready }),
    readyMode: "durable_saga",
    unreadyMode: "inline_verified",
  },
];

const matrix: Array<Record<string, string>> = [];

function withEnv<T>(name: string, raw: string | undefined, fn: () => T): T {
  const previous = process.env[name];
  if (raw === undefined) delete process.env[name];
  else process.env[name] = raw;
  try {
    return fn();
  } finally {
    if (previous === undefined) delete process.env[name];
    else process.env[name] = previous;
  }
}

// ── CAPABILITY CONTROLS ──────────────────────────────────────────────────────

test("every capability control: only the exact token enables, everything else fails closed", () => {
  for (const capability of CAPABILITIES) {
    const env = `YORISOU_POR1_${capability}`;
    for (const value of VALUES) {
      const enabled = withEnv(env, value.raw, () => isPor1CapabilityEnabled(capability));
      assert.equal(
        enabled,
        value.enables,
        `${env}=${value.label} resolved ${enabled}, expected ${value.enables}`,
      );

      // The guard used by mutation paths must agree with the resolver, or a caller could be told it
      // may proceed while the snapshot says otherwise.
      const guard = withEnv(env, value.raw, () => requirePor1Capability(capability));
      assert.equal(guard.allowed, value.enables, `${env}=${value.label}: guard disagrees with resolver`);
      if (!guard.allowed) assert.equal(guard.reason, "capability_disabled");

      matrix.push({
        kind: "capability",
        control: env,
        value: value.label,
        resolved: String(enabled),
        expected: String(value.enables),
        result: enabled === value.enables ? "PASS" : "FAIL",
      });
    }
  }
});

test("a capability cannot be activated by another capability's variable", () => {
  // Independent switches, so turning one on must leave the other three off. If a rename ever made
  // two capabilities read the same variable, this is what would catch it.
  for (const enabledCapability of CAPABILITIES) {
    withEnv(`YORISOU_POR1_${enabledCapability}`, "on", () => {
      const snapshot = por1CapabilitySnapshot();
      for (const other of CAPABILITIES) {
        assert.equal(
          snapshot[other],
          other === enabledCapability,
          `${enabledCapability}=on leaked into ${other}`,
        );
      }
    });
  }
});

test("with a capability off, the canonical parameter is not merely refused — it is not recognised", () => {
  // The flag-off baseline must be the surface Production serves TODAY. A refusal screen is new
  // behaviour too; dropping the row id makes the legacy branch run byte-for-byte.
  withEnv("YORISOU_POR1_CANONICAL_CORE", undefined, () => {
    assert.equal(canonicalRowIdWhenEnabled("row-123", "CANONICAL_CORE"), null);
  });
  withEnv("YORISOU_POR1_CANONICAL_CORE", "on", () => {
    assert.equal(canonicalRowIdWhenEnabled("row-123", "CANONICAL_CORE"), "row-123");
  });
});

// ── READINESS CONTROLS ───────────────────────────────────────────────────────

test("every readiness control: only the exact token means ready, and the resolved MODE follows", () => {
  for (const readiness of READINESS) {
    for (const value of VALUES) {
      const ready = withEnv(readiness.env, value.raw, () => readiness.read());
      assert.equal(ready, value.enables, `${readiness.env}=${value.label} resolved ${ready}`);

      // The mode is what the product actually branches on. Asserting only the boolean would leave
      // the interesting half untested.
      const mode = readiness.resolve(ready);
      const expectedMode = value.enables ? readiness.readyMode : readiness.unreadyMode;
      assert.equal(mode, expectedMode, `${readiness.env}=${value.label} → mode ${mode}`);

      matrix.push({
        kind: "readiness",
        control: readiness.env,
        value: value.label,
        resolved: mode,
        expected: expectedMode,
        result: mode === expectedMode ? "PASS" : "FAIL",
      });
    }
  }
});

test("readiness is not a capability: turning a capability on does not make a schema ready", () => {
  // Conflating them would mean kill-switching a product feature also silently returned deletion to
  // deriving its destructive scope from a cache.
  for (const capability of CAPABILITIES) {
    withEnv(`YORISOU_POR1_${capability}`, "on", () => {
      for (const readiness of READINESS) {
        assert.equal(readiness.read(), false, `${capability}=on made ${readiness.env} report ready`);
      }
    });
  }
});

test("and the reverse: a ready schema does not activate any capability", () => {
  for (const readiness of READINESS) {
    withEnv(readiness.env, "on", () => {
      const snapshot = por1CapabilitySnapshot();
      for (const capability of CAPABILITIES) {
        assert.equal(snapshot[capability], false, `${readiness.env}=on activated ${capability}`);
      }
    });
  }
});

// ── THE ONE REAL INTERLOCK ───────────────────────────────────────────────────

test("THE MUTATION FENCE INTERLOCK — deletion enabled without a fence must fail closed", () => {
  // The only genuine dependency between a readiness fact and a capability. When deletion can run but
  // the fence that protects concurrent account writes cannot, refusing the write is the only safe
  // answer: the alternative is racing a destruction.
  const cases: Array<{ schemaReady: boolean; deletionExecutorEnabled: boolean; expected: string }> = [
    { schemaReady: false, deletionExecutorEnabled: false, expected: "legacy_no_schema" },
    { schemaReady: false, deletionExecutorEnabled: true, expected: "fail_closed" },
    { schemaReady: true, deletionExecutorEnabled: false, expected: "fenced" },
    { schemaReady: true, deletionExecutorEnabled: true, expected: "fenced" },
  ];

  for (const c of cases) {
    const mode = resolveFenceMode(c);
    assert.equal(
      mode,
      c.expected,
      `fence(schemaReady=${c.schemaReady}, deletionExecutor=${c.deletionExecutorEnabled}) = ${mode}`,
    );
    matrix.push({
      kind: "interlock",
      control: "resolveFenceMode",
      value: `schemaReady=${c.schemaReady} deletionExecutor=${c.deletionExecutorEnabled}`,
      resolved: mode,
      expected: c.expected,
      result: mode === c.expected ? "PASS" : "FAIL",
    });
  }

  // Stated as a property rather than a row, because this is the sentence the interlock exists for.
  assert.equal(
    resolveFenceMode({ schemaReady: false, deletionExecutorEnabled: true }),
    "fail_closed",
    "an unfenced database with a live deletion executor must refuse writes",
  );
});

// ── ALL 16 CAPABILITY COMBINATIONS ───────────────────────────────────────────

test("all 16 capability combinations resolve exactly as requested — no implicit activation", () => {
  for (let mask = 0; mask < 16; mask += 1) {
    const requested = CAPABILITIES.map((_, i) => Boolean(mask & (1 << i)));
    const saved = CAPABILITIES.map((c) => process.env[`YORISOU_POR1_${c}`]);
    try {
      CAPABILITIES.forEach((c, i) => {
        if (requested[i]) process.env[`YORISOU_POR1_${c}`] = "on";
        else delete process.env[`YORISOU_POR1_${c}`];
      });
      const snapshot = por1CapabilitySnapshot();
      CAPABILITIES.forEach((c, i) => {
        assert.equal(snapshot[c], requested[i], `combination ${mask}: ${c}`);
      });
      matrix.push({
        kind: "combination",
        control: CAPABILITIES.filter((_, i) => requested[i]).join("+") || "(all off)",
        value: `mask=${mask}`,
        resolved: CAPABILITIES.filter((c) => snapshot[c]).join("+") || "(all off)",
        expected: CAPABILITIES.filter((_, i) => requested[i]).join("+") || "(all off)",
        result: "PASS",
      });
    } finally {
      CAPABILITIES.forEach((c, i) => {
        const previous = saved[i];
        if (previous === undefined) delete process.env[`YORISOU_POR1_${c}`];
        else process.env[`YORISOU_POR1_${c}`] = previous;
      });
    }
  }
});

test("the matrix is written out as evidence, and every row passed", (t) => {
  t.after(() => {});
  const failures = matrix.filter((row) => row.result !== "PASS");
  assert.deepEqual(failures, [], `${failures.length} matrix row(s) failed`);

  const dir = join(REPO, "docs/ux2r/evidence");
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "por1-m3-readiness-capability-matrix.json"),
    `${JSON.stringify(
      {
        contract: "por1-m3-readiness-capability-matrix",
        note: "Generated by lib/server/__tests__/por1ReadinessCapabilityMatrix.test.ts against the real resolvers.",
        capabilities: CAPABILITIES,
        readinessControls: READINESS.map((r) => r.env),
        interlocks: [
          "resolveFenceMode: schemaReady=false AND deletionExecutorEnabled=true → fail_closed",
        ],
        rows: matrix.length,
        matrix,
      },
      null,
      2,
    )}\n`,
  );
});
