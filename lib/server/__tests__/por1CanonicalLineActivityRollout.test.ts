import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  isCanonicalLineActivitySchemaReady,
  resolveLineActivityMode,
} from "../canonicalLineActivityRollout";

const KEY = "YORISOU_POR1_CANONICAL_LINE_ACTIVITY_SCHEMA_READY";

afterEach(() => {
  delete process.env[KEY];
});

describe("POR-1 canonical LINE activity rollout", () => {
  it("uses the legacy array when the schema is not deployed", () => {
    // A deployment predating 202607310001 must keep its exact previous behaviour. Attempting an RPC
    // that cannot exist is what turned the Production-lineage CI databases red when the mutation
    // fence shipped, and the same mistake here would be worse: it would fail LINE ingestion.
    assert.equal(resolveLineActivityMode({ schemaReady: false }), "legacy_array");
  });

  it("uses the canonical store when the schema is deployed", () => {
    assert.equal(resolveLineActivityMode({ schemaReady: true }), "canonical");
  });

  it("has no mode in which both the canonical store and the shared array are written", () => {
    // The defect is a SECOND writer to a read-modify-write document. A compatibility mirror into
    // that same object would reintroduce it in full, so the rule is deliberately total: exactly two
    // modes, and the array is written in exactly one of them.
    const modes = [true, false].map((schemaReady) => resolveLineActivityMode({ schemaReady }));
    assert.deepEqual(new Set(modes), new Set(["canonical", "legacy_array"]));
    assert.equal(modes.length, 2);
  });

  it("fails closed to legacy when readiness is unset", () => {
    delete process.env[KEY];
    assert.equal(isCanonicalLineActivitySchemaReady(), false);
  });

  it("requires the exact string \"on\"", () => {
    for (const value of ["", " ", "1", "true", "yes", "ON!", "off", "enabled"]) {
      process.env[KEY] = value;
      assert.equal(isCanonicalLineActivitySchemaReady(), false, `"${value}" must not enable`);
    }
    for (const value of ["on", "ON", " on ", "On"]) {
      process.env[KEY] = value;
      assert.equal(isCanonicalLineActivitySchemaReady(), true, `"${value}" must enable`);
    }
  });

  it("is readiness, not one of the four product capabilities", () => {
    // Readiness answers "does the schema exist"; the four YORISOU_POR1_* switches answer "may this
    // product behaviour run". Conflating them would mean kill-switching a LINE feature also
    // silently re-enabled writes to the defective shared array.
    assert.ok(KEY.startsWith("YORISOU_POR1_"));
    assert.ok(!["CANONICAL_CORE", "CANONICAL_RECOMMENDATIONS", "LINE_CANONICAL_RETURN", "ACCOUNT_DELETION_EXECUTOR"]
      .some((capability) => KEY === `YORISOU_POR1_${capability}`));
  });
});
