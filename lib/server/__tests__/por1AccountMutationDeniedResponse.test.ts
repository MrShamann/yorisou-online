import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

import {
  accountMutationDenialStatus,
  type MutationDenialReason,
} from "../accountMutationDenialStatus";

const ROOT = process.cwd();
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

describe("POR-1 mutation-fence refusals are answers, not faults", () => {
  it("maps every denial reason, and none of them to 500", () => {
    const reasons: MutationDenialReason[] = [
      "account_mutation_denied_deleted",
      "account_mutation_denied_erasing",
      "account_mutation_denied_gate",
      "account_mutation_unavailable",
    ];
    for (const reason of reasons) {
      const status = accountMutationDenialStatus(reason);
      assert.ok(status, `${reason} has no status`);
      assert.notEqual(status, 500, `${reason} must not be an unclassified fault`);
    }
  });

  it("separates final from retryable", () => {
    // A deletion cannot be retried into success, and saying "try again" would invite a retry loop
    // against an erasure. A draining gate genuinely may succeed in a moment.
    assert.equal(accountMutationDenialStatus("account_mutation_denied_deleted"), 409);
    assert.equal(accountMutationDenialStatus("account_mutation_denied_erasing"), 409);
    assert.equal(accountMutationDenialStatus("account_mutation_denied_gate"), 503);
    assert.equal(accountMutationDenialStatus("account_mutation_unavailable"), 503);
  });

  it("is wired into every leased-write route that answers with a status", () => {
    // A hosted concurrent-deletion run answered 500 for a correct refusal, so the acceptance could
    // not tell a working fence from a crash. These are the routes whose catch-all would otherwise
    // flatten it again.
    for (const route of [
      "app/api/support/preferences/route.ts",
      "app/api/auth/change-password/route.ts",
      "app/api/auth/reset-password/route.ts",
      "app/api/auth/login/route.ts",
    ]) {
      assert.ok(
        read(route).includes("accountMutationDeniedResponse"),
        `${route} still flattens a fence refusal into its catch-all`,
      );
    }
  });

  it("is deliberately absent from forgot-password, and says so", () => {
    // Mapping it there would create the account-existence oracle the uniform `{ success: true }`
    // exists to deny — about someone who is mid-deletion.
    const route = read("app/api/auth/forgot-password/route.ts");
    assert.ok(!route.includes("accountMutationDeniedResponse"), "forgot-password must stay uniform");
    assert.ok(
      route.includes("DELIBERATELY NOT mapped"),
      "the omission must be documented, or a future reader will 'fix' it into an oracle",
    );
  });
});
