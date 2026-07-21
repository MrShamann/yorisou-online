// MPV-1C — shared object-store provider resolution tests (node:assert under tsx).
// Verifies the durable-store mode selection + fail-closed credential validation
// WITHOUT changing the default AWS behavior, and that no secret ever appears in a
// thrown error. Run: node --import tsx lib/server/__tests__/sharedObjectStore.test.ts

import assert from "node:assert/strict";
import { resolveSharedStoreMode } from "../yorisouData";

let passed = 0;
function check(label: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`  ✓ ${label}`);
}

const SECRET = "super-secret-service-role-key-value-eyJ";
const KEYID = "AKIA_EXAMPLE_KEY_ID";

console.log("MPV-1C — shared object-store provider resolution");

check("local-file mode: no bucket → 'disabled' (file store, unchanged default)", () => {
  assert.equal(resolveSharedStoreMode({ bucket: "" }), "disabled");
  assert.equal(resolveSharedStoreMode({}), "disabled");
});

check("existing AWS-default mode: bucket + no endpoint → 'aws' (unchanged behavior)", () => {
  assert.equal(resolveSharedStoreMode({ bucket: "prod-bucket" }), "aws");
  // Stray access keys without an endpoint do not change AWS-default selection.
  assert.equal(resolveSharedStoreMode({ bucket: "prod-bucket", accessKeyId: KEYID, secretAccessKey: SECRET }), "aws");
});

check("custom S3-compatible endpoint + BOTH credentials → 's3-compatible'", () => {
  assert.equal(
    resolveSharedStoreMode({ bucket: "b", endpoint: "https://example.s3.internal", accessKeyId: KEYID, secretAccessKey: SECRET }),
    "s3-compatible",
  );
});

check("Supabase Storage REST endpoint (.../storage/v1) + token → 'supabase-rest'", () => {
  assert.equal(
    resolveSharedStoreMode({ bucket: "b", endpoint: "https://ref.supabase.co/storage/v1", secretAccessKey: SECRET }),
    "supabase-rest",
  );
  assert.equal(
    resolveSharedStoreMode({ bucket: "b", endpoint: "https://ref.supabase.co/storage/v1/", secretAccessKey: SECRET }),
    "supabase-rest",
  );
});

function expectThrowsNoSecret(fn: () => void, expectedCode: string) {
  let threw: Error | null = null;
  try {
    fn();
  } catch (e) {
    threw = e as Error;
  }
  assert.ok(threw, "expected a throw");
  assert.equal(threw!.message, expectedCode);
  // No secret material may appear in the thrown message.
  assert.ok(!threw!.message.includes(SECRET), "error must not contain the secret");
  assert.ok(!threw!.message.includes(KEYID), "error must not contain the access-key id");
}

check("fail closed: s3-compatible endpoint with only ONE credential → throws, no secret", () => {
  expectThrowsNoSecret(() => resolveSharedStoreMode({ bucket: "b", endpoint: "https://x.s3", accessKeyId: KEYID }), "shared_store_partial_credentials");
  expectThrowsNoSecret(() => resolveSharedStoreMode({ bucket: "b", endpoint: "https://x.s3", secretAccessKey: SECRET }), "shared_store_partial_credentials");
});

check("fail closed: s3-compatible endpoint with NO credentials → throws, no secret", () => {
  expectThrowsNoSecret(() => resolveSharedStoreMode({ bucket: "b", endpoint: "https://x.s3" }), "shared_store_endpoint_missing_credentials");
});

check("fail closed: Supabase REST endpoint without a token → throws, no secret", () => {
  expectThrowsNoSecret(() => resolveSharedStoreMode({ bucket: "b", endpoint: "https://ref.supabase.co/storage/v1" }), "shared_store_supabase_rest_missing_token");
});

console.log(`\nMPV-1C shared object-store: ${passed} checks passed.`);
