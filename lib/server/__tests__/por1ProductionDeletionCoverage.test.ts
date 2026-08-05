// POR-1 WS-I — every Production account-owner-linked family must be in the deletion plan.
//
// THE RISK THIS CLOSES.
//
// The isolated Preview database is a SUBSET of the Production lineage. `202607300003` was written
// against the full Production family list and guards each table with `to_regclass`, so a table that
// does not exist in Preview is silently skipped. That is correct behaviour — and it means the
// Preview acceptance run can pass while never once exercising the erasure of a family that only
// exists in Production. `yorisou_private_recommendations` is the obvious one; the audit found
// twenty-six such families in total.
//
// Coverage was already complete when this test was written — all 26 present, 0 gaps. So this is not
// a repair; it is the guard that keeps it that way. A new Production owner-linked table added later
// would otherwise be invisible: absent from Preview, skipped by `to_regclass`, and never named by a
// failing test.
//
// The contract file is a checked-in snapshot of the READ-ONLY Production catalogue, so CI needs no
// database connectivity.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const contract = JSON.parse(
  readFileSync(new URL("../../../supabase/contracts/por1-production-owner-linked-families.json", import.meta.url), "utf8"),
) as { families: string[]; classified_not_owner_linked: Record<string, string> };

const deletionPlan = readFileSync(
  new URL("../../../supabase/preview-only-migrations/202607300003_por1_account_deletion_lifecycle.sql", import.meta.url),
  "utf8",
);

test("every Production account-owner-linked family appears in the deletion plan", () => {
  assert.equal(contract.families.length > 0, true, "the contract snapshot must not be empty");

  const missing = contract.families.filter((table) => !deletionPlan.includes(`'${table}'`));
  assert.deepEqual(
    missing,
    [],
    "these Production families carry an account owner and are NOT named by the deletion plan. " +
      "They would be skipped silently in Preview (to_regclass) and erased by nothing in Production.",
  );
});

test("a table excluded from the owner-linked set has a recorded reason", () => {
  // `yorisou_resource_sources.owner_name` is a publisher attribution, not a user link. Excluding it
  // is a judgement, so it carries its justification rather than simply being absent from the list.
  for (const [table, reason] of Object.entries(contract.classified_not_owner_linked)) {
    assert.equal(typeof reason === "string" && reason.length > 20, true, `${table} needs a real reason`);
    assert.equal(contract.families.includes(table), false, `${table} must not be in both sets`);
  }
});

test("the plan's Preview-absent families are the ones the rehearsal must prove", () => {
  // Named explicitly because "the Preview suite passed" says nothing about them: they are absent
  // there, so the erasure never ran. Only the full Production-lineage rehearsal can close this.
  const provenOnlyInRehearsal = [
    "yorisou_private_recommendations",
    "yorisou_private_memory_items",
    "yorisou_private_check_in_plans",
    "yorisou_ai_reflections",
    "yorisou_ai_runs",
    "yorisou_test_results",
  ];
  for (const table of provenOnlyInRehearsal) {
    assert.equal(
      contract.families.includes(table),
      true,
      `${table} must be tracked as a Production owner-linked family`,
    );
    assert.equal(deletionPlan.includes(`'${table}'`), true, `${table} must be named by the deletion plan`);
  }
});
