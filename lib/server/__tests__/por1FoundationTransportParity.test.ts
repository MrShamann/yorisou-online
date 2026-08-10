import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

import { resolveSharedStoreMode } from "../yorisouData";

// POR-1 — THE FOUNDATION STORE AND THE IDENTITY STORE MUST SPEAK THE SAME TRANSPORT.
//
// THE DEFECT THIS EXISTS TO PREVENT, WHICH HAD ALREADY HAPPENED.
//
// MPV-1C taught `yorisouData` to speak Supabase Storage's REST API. That is what makes an ISOLATED
// Preview identity store possible: a Preview deployment writes accounts, sessions and lookups into a
// Supabase bucket instead of the AWS bucket Production uses.
//
// `foundation/store.ts` never learned. It built a plain `new S3Client({ region })` — no endpoint, no
// REST mode — and pointed it at whatever `YORISOU_SHARED_STORE_BUCKET` named. In the isolated Preview
// that resolved to AWS S3 with a bucket called `yorisou-preview-auth`, and because the Preview
// environment carries no AWS credentials, every foundation write threw. The auth routes log and
// swallow those errors, so Preview looked completely healthy while the canonical identity mirror —
// the UserProfile and the AuthIdentities that ARE the email and LINE login routes — never existed
// there at all.
//
// The consequence for this package was precise and severe: the foundation half of an account
// deletion could not be PROVEN in Preview, because there was nothing in Preview to erase. A hosted
// acceptance would have passed while testing nothing.
//
// These are SOURCE-LEVEL assertions on purpose. The failure mode is a module quietly constructing its
// own transport, and no runtime test of the fixed code can see that happening in a future edit.

const FOUNDATION_STORE = "lib/server/foundation/store.ts";
const TRANSPORT = "lib/server/sharedObjectTransport.ts";

/**
 * Read a source file with its COMMENTS STRIPPED.
 *
 * The comment explaining why `new S3Client(...)` was removed contains the string `new S3Client(`, so
 * a naive scan reports the very prose that documents the fix as the defect. A guard that trips on
 * its own explanation gets loosened until it means nothing.
 */
function read(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

test("the foundation store constructs NO object-store client of its own", () => {
  const source = read(FOUNDATION_STORE);

  // `new S3Client(...)` is the exact shape of the defect: it silently ignores every endpoint and
  // credential the isolated Preview supplies.
  assert.equal(
    /new\s+S3Client\s*\(/.test(source),
    false,
    "foundation/store.ts must not build its own S3 client — it goes through sharedObjectTransport, " +
      "which resolves the SAME mode the identity store resolves",
  );

  for (const command of ["PutObjectCommand", "GetObjectCommand", "DeleteObjectCommand", "ListObjectsV2Command"]) {
    assert.equal(
      new RegExp(`new\\s+${command}\\s*\\(`).test(source),
      false,
      `foundation/store.ts must not issue ${command} directly; that bypasses the REST transport`,
    );
  }
});

test("the foundation store imports the shared transport", () => {
  const source = read(FOUNDATION_STORE);
  assert.match(
    source,
    /from "@\/lib\/server\/sharedObjectTransport"/,
    "foundation/store.ts must import the shared transport",
  );
  for (const symbol of ["getSharedObject", "putSharedObject", "deleteSharedObject", "listSharedObjectKeys"]) {
    assert.ok(source.includes(symbol), `foundation/store.ts must use ${symbol}`);
  }
});

test("the transport resolves its mode with the identity store's OWN resolver, not a copy", () => {
  const source = read(TRANSPORT);
  assert.match(
    source,
    /import\s*\{[^}]*resolveSharedStoreMode[^}]*\}\s*from\s*"\.\/yorisouData"/,
    "the transport must call resolveSharedStoreMode from yorisouData. A second copy of the mode " +
      "decision is how the two stores disagreed about which bucket they were talking to — and the " +
      "disagreement was invisible, because it only showed up as records that were never written.",
  );
  assert.match(
    source,
    /supabase-rest/,
    "the transport must implement the Supabase REST mode — the one the foundation store lacked",
  );
});

test("foundation deletion removes the record under EVERY read prefix", () => {
  const source = read(FOUNDATION_STORE);
  const deleteBlock = /export async function deleteFoundationRecord[\s\S]*?\n}/.exec(source);
  assert.ok(deleteBlock, "deleteFoundationRecord must exist");
  assert.match(
    deleteBlock[0],
    /getFoundationReadPrefixes\(\)/,
    "a record written under the legacy prefix and deleted only under the primary one still resolves " +
      "on read — which is an erasure that leaves the login route intact",
  );
});

test("the PRODUCTION configuration still resolves to plain AWS — this change is a no-op there", () => {
  // Production sets a bucket and a region and NOTHING else: no store endpoint, no store-specific
  // access keys. It authenticates with the ambient AWS credentials, exactly as the old foundation
  // client did.
  //
  // Asserted because the fix has to be provably inert where it is not needed. A transport change
  // that quietly re-pointed Production's identity mirror would be far worse than the Preview gap it
  // was written to close.
  assert.equal(
    resolveSharedStoreMode({
      bucket: "yorisou-phase1-shared-prod-20260321",
      endpoint: "",
      accessKeyId: "",
      secretAccessKey: "",
      forcePathStyle: false,
    }),
    "aws",
  );

  // And the isolated Preview shape — bucket + Supabase storage endpoint + a service token — resolves
  // to the REST mode the foundation store previously could not speak.
  assert.equal(
    resolveSharedStoreMode({
      bucket: "yorisou-preview-auth",
      endpoint: "https://nbltsbonsnbpfptihomc.supabase.co/storage/v1",
      accessKeyId: "",
      secretAccessKey: "service-token",
      forcePathStyle: false,
    }),
    "supabase-rest",
  );
});
