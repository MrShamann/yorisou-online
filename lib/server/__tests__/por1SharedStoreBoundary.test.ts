// POR-1 — the Preview/Production identity-store boundary.
//
// The defect these cover was not a bug in any line of code. Every function behaved correctly; the
// configuration simply pointed a Preview deployment at the Production identity bucket, and nothing
// in the system had an opinion about that. These tests are that opinion.
//
// The first case is the exact configuration that shipped.

import assert from "node:assert/strict";
import test from "node:test";

import {
  assertSharedStoreEnvironmentBoundary,
  classifySharedStoreBoundary,
} from "../sharedStoreBoundary";

const PREVIEW_PROJECT = "https://nbltsbonsnbpfptihomc.supabase.co";
const PREVIEW_ENDPOINT = `${PREVIEW_PROJECT}/storage/v1`;
const PRODUCTION_BUCKET = "yorisou-phase1-shared-prod-20260321";
const PREVIEW_BUCKET = "yorisou-preview-auth";

function preview(overrides: Record<string, unknown> = {}) {
  return classifySharedStoreBoundary({
    deploymentEnvironment: "preview",
    sharedStoreMode: "supabase-rest",
    bucket: PREVIEW_BUCKET,
    endpoint: PREVIEW_ENDPOINT,
    supabaseUrl: PREVIEW_PROJECT,
    ...overrides,
  } as Parameters<typeof classifySharedStoreBoundary>[0]);
}

test("THE SHIPPED DEFECT: Preview + Production bucket + no endpoint is refused", () => {
  // Bucket set, endpoint absent → resolveSharedStoreMode returns "aws" → real AWS S3, holding the
  // Production identity bucket. This is what a Preview branch inherited, and it wrote real
  // identities there without a single error.
  const result = preview({ sharedStoreMode: "aws", bucket: PRODUCTION_BUCKET, endpoint: "" });
  assert.equal(result.ok, false);
  assert.equal(result.ok === false && result.error, "preview_shared_store_not_isolated");
});

test("Preview may never resolve to the AWS default transport, whatever the bucket is called", () => {
  const result = preview({ sharedStoreMode: "aws", bucket: "some-other-bucket", endpoint: "" });
  assert.equal(result.ok, false);
  assert.match(String(result.ok === false && result.detail), /AWS default/);
});

test("Preview + Production bucket is refused even over the isolated transport", () => {
  // The right endpoint does not launder the wrong bucket.
  const result = preview({ bucket: PRODUCTION_BUCKET });
  assert.equal(result.ok, false);
  assert.match(String(result.ok === false && result.detail), /Production/);
});

test("Preview with an unclassified transport is refused rather than assumed safe", () => {
  const result = preview({ sharedStoreMode: "s3-compatible", endpoint: "https://minio.example.com" });
  assert.equal(result.ok, false);
  assert.equal(result.ok === false && result.error, "preview_shared_store_not_isolated");
});

test("Preview with the store and the database in DIFFERENT projects is refused", () => {
  // The precise shape of the incident: records in one isolated project, identities in another
  // place entirely. Each half looked correct on its own.
  const result = preview({ supabaseUrl: "https://someotherproject.supabase.co" });
  assert.equal(result.ok, false);
  assert.match(String(result.ok === false && result.detail), /different projects/);
});

test("Preview with no shared store at all is refused — a hosted deployment must not go ephemeral", () => {
  const result = preview({ sharedStoreMode: "disabled", bucket: "", endpoint: "" });
  assert.equal(result.ok, false);
  assert.match(String(result.ok === false && result.detail), /ephemeral/);
});

test("Preview on the isolated Preview store is ACCEPTED, and says so", () => {
  const result = preview();
  assert.equal(result.ok, true);
  assert.equal(result.ok === true && result.boundary, "isolated-preview");
  assert.equal(result.ok === true && result.projectMatch, true);
});

test("Production may not use the Preview bucket", () => {
  const result = classifySharedStoreBoundary({
    deploymentEnvironment: "production",
    sharedStoreMode: "supabase-rest",
    bucket: PREVIEW_BUCKET,
    endpoint: PREVIEW_ENDPOINT,
    supabaseUrl: PREVIEW_PROJECT,
  });
  assert.equal(result.ok, false);
  assert.equal(result.ok === false && result.error, "production_shared_store_not_production");
});

test("Production on the Production store is accepted", () => {
  const result = classifySharedStoreBoundary({
    deploymentEnvironment: "production",
    sharedStoreMode: "aws",
    bucket: PRODUCTION_BUCKET,
    endpoint: "",
    supabaseUrl: "https://krxizslnksorwhepyijs.supabase.co",
  });
  assert.equal(result.ok, true);
  assert.equal(result.ok === true && result.boundary, "production");
});

test("Development with NO configuration is the approved local mode", () => {
  const result = classifySharedStoreBoundary({
    deploymentEnvironment: "development",
    sharedStoreMode: "disabled",
    bucket: "",
    endpoint: "",
    supabaseUrl: undefined,
  });
  assert.equal(result.ok, true);
  assert.equal(result.ok === true && result.boundary, "local-development");
});

test("Development with PARTIAL configuration is refused, never guessed at", () => {
  const result = classifySharedStoreBoundary({
    deploymentEnvironment: "development",
    sharedStoreMode: "disabled",
    bucket: PRODUCTION_BUCKET,
    endpoint: "",
    supabaseUrl: undefined,
  });
  assert.equal(result.ok, false);
  assert.equal(result.ok === false && result.error, "development_shared_store_ambiguous");
});

test("the assertion throws the bounded code, so no caller can continue past a refusal", () => {
  assert.throws(
    () =>
      assertSharedStoreEnvironmentBoundary({
        deploymentEnvironment: "preview",
        sharedStoreMode: "aws",
        bucket: PRODUCTION_BUCKET,
        endpoint: "",
        supabaseUrl: PREVIEW_PROJECT,
      }),
    /preview_shared_store_not_isolated/,
  );
  assert.doesNotThrow(() =>
    assertSharedStoreEnvironmentBoundary({
      deploymentEnvironment: "preview",
      sharedStoreMode: "supabase-rest",
      bucket: PREVIEW_BUCKET,
      endpoint: PREVIEW_ENDPOINT,
      supabaseUrl: PREVIEW_PROJECT,
    }),
  );
});

test("a refusal reason names infrastructure, never a secret", () => {
  // A boundary error is surfaced in logs and to the acceptance gate. It may name a bucket — the
  // operator already knows it — but must never carry a token, a signed URL or an object key.
  const result = preview({ sharedStoreMode: "aws", bucket: PRODUCTION_BUCKET, endpoint: "" });
  const detail = String(result.ok === false && result.detail);
  assert.doesNotMatch(detail, /eyJ|Bearer|apikey|token|phase1\/|@/i);
});
