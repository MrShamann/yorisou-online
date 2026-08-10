// POR-1 — runtime controls must fail closed and stop independently.

import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";

import {
  isPor1CapabilityEnabled,
  por1CapabilitySnapshot,
  requirePor1Capability,
  type Por1Capability,
} from "../por1RuntimeControls";

const ALL: Por1Capability[] = [
  "CANONICAL_CORE",
  "CANONICAL_RECOMMENDATIONS",
  "LINE_CANONICAL_RETURN",
  "ACCOUNT_DELETION_EXECUTOR",
];

beforeEach(() => {
  for (const c of ALL) delete process.env[`YORISOU_POR1_${c}`];
});

test("UNSET FAILS CLOSED — a forgotten variable must not activate anything", () => {
  for (const c of ALL) assert.equal(isPor1CapabilityEnabled(c), false, c);
});

test("only the exact string 'on' enables; near-misses do not", () => {
  const c: Por1Capability = "CANONICAL_CORE";
  for (const value of ["", "off", "false", "0", "no", "true", "1", "yes", "ON ", "enabled"]) {
    process.env[`YORISOU_POR1_${c}`] = value;
    const expected = value.trim().toLowerCase() === "on";
    assert.equal(isPor1CapabilityEnabled(c), expected, JSON.stringify(value));
  }
});

test("each capability is INDEPENDENTLY stoppable", () => {
  // A single blunt switch would make the safe action cost more than the fault.
  for (const enabled of ALL) {
    for (const c of ALL) delete process.env[`YORISOU_POR1_${c}`];
    process.env[`YORISOU_POR1_${enabled}`] = "on";

    for (const c of ALL) {
      assert.equal(isPor1CapabilityEnabled(c), c === enabled, `${enabled} enabled, checking ${c}`);
    }
  }
});

test("the guard reports a bounded reason rather than throwing", () => {
  assert.deepEqual(requirePor1Capability("CANONICAL_CORE"), {
    allowed: false,
    reason: "capability_disabled",
  });
  process.env.YORISOU_POR1_CANONICAL_CORE = "on";
  assert.deepEqual(requirePor1Capability("CANONICAL_CORE"), { allowed: true });
});

test("the snapshot exposes only the four capabilities, never other environment values", () => {
  const snapshot = por1CapabilitySnapshot();
  assert.deepEqual(Object.keys(snapshot).sort(), [...ALL].sort());
  for (const value of Object.values(snapshot)) assert.equal(typeof value, "boolean");
});
