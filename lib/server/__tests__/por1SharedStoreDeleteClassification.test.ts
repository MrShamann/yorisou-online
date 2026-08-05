import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { classifySharedStoreDelete } from "../sharedStoreDeleteClassification";

// The exact body Supabase Storage returned when asked to delete an object that was already gone,
// captured against the isolated Preview bucket rather than paraphrased.
const REAL_ABSENT_BODY =
  '{"statusCode":"404","error":"not_found","message":"Object not found","code":"NoSuchKey"}';

describe("POR-1 shared-store DELETE classification", () => {
  it("treats a 2xx as deleted", () => {
    for (const status of [200, 204]) {
      assert.equal(classifySharedStoreDelete({ status, body: "" }), "deleted");
    }
  });

  it("reads the REAL 400/not_found body as already absent", () => {
    // THE DEFECT. Supabase answers 400, not 404, for a missing object. Treating that as a failure
    // made deletion permanently retryable: `storage_erasure` removes the account's objects, and the
    // first key a previous attempt had already deleted threw, so the stage never completed. One
    // hosted job reached attempt 41 stuck at exactly this point.
    assert.equal(
      classifySharedStoreDelete({ status: 400, body: REAL_ABSENT_BODY }),
      "already_absent",
    );
  });

  it("treats a genuine 404 as already absent without needing a body", () => {
    assert.equal(classifySharedStoreDelete({ status: 404, body: "" }), "already_absent");
  });

  it("does NOT treat a bare 400 as absence", () => {
    // The fail-open version of the same bug, and the worse one: a malformed or unauthorized request
    // also answers 400, and reading that as absence is how a deletion finalizes over data it never
    // removed. The status is not the evidence — the body is.
    for (const body of [
      "",
      "{}",
      '{"error":"Bad Request"}',
      '{"statusCode":"400","error":"InvalidKey","message":"key is malformed"}',
      '{"error":"invalid_jwt","message":"JWT expired"}',
    ]) {
      assert.equal(
        classifySharedStoreDelete({ status: 400, body }),
        "failed",
        `a 400 with body ${JSON.stringify(body)} must NOT read as absence`,
      );
    }
  });

  it("treats every other failure status as failed, including ones that look benign", () => {
    for (const status of [401, 403, 409, 429, 500, 502, 503, 504]) {
      assert.equal(
        classifySharedStoreDelete({ status, body: REAL_ABSENT_BODY }),
        "failed",
        `${status} must fail even when the body happens to mention not-found`,
      );
    }
  });

  it("is total: every status maps to exactly one of three outcomes", () => {
    const outcomes = new Set<string>();
    for (const status of [200, 201, 204, 299, 300, 400, 401, 404, 410, 500]) {
      outcomes.add(classifySharedStoreDelete({ status, body: REAL_ABSENT_BODY }));
    }
    for (const outcome of outcomes) {
      assert.ok(["deleted", "already_absent", "failed"].includes(outcome), `unexpected ${outcome}`);
    }
  });
});
