// POR-1 WS2/WS7 — the identity-deletion adapter is narrow by construction.
//
// The requirement it enforces: no arbitrary path deletion, no generic bucket administration, no
// secret-gated backdoor. The only thing the adapter can remove is an identity object inside one of
// five named families.

import assert from "node:assert/strict";
import test from "node:test";

import {
  assertIdentityKey,
  classifyIdentityKey,
  IDENTITY_KEY_PREFIXES,
  SHARED_STORE_PREFIX,
} from "../identityKeyScope";

test("the five identity families, and only those, are deletable", () => {
  assert.equal(IDENTITY_KEY_PREFIXES.length, 5);
  for (const prefix of IDENTITY_KEY_PREFIXES) {
    assert.equal(classifyIdentityKey(`${prefix}abc.json`), null, prefix);
  }
});

test("a person's CONTENT is out of scope — the adapter deletes identity, not records", () => {
  // Assessment results, answers, reports and recommendations are erased by the database saga under
  // its own transactional guarantees. An object-store primitive that could also reach them would be
  // a second, unguarded erasure path.
  const outOfScope = [
    `${SHARED_STORE_PREFIX}/results/anything.json`,
    `${SHARED_STORE_PREFIX}/attempts/anything.json`,
    `${SHARED_STORE_PREFIX}/reflections/anything.json`,
    `${SHARED_STORE_PREFIX}/`,
    `${SHARED_STORE_PREFIX}`,
    "other-tenant/accounts/by-id/x.json",
    "accounts/by-id/x.json",
  ];
  for (const key of outOfScope) {
    assert.equal(classifyIdentityKey(key), "identity_key_out_of_scope", key);
  }
});

test("traversal cannot climb out of an allowed family", () => {
  const traversals = [
    `${SHARED_STORE_PREFIX}/accounts/by-id/../../results/x.json`,
    `${SHARED_STORE_PREFIX}/accounts/by-id/..`,
    `${SHARED_STORE_PREFIX}/sessions//x.json`,
    `${SHARED_STORE_PREFIX}/accounts/by-id/a/../../../..`,
  ];
  for (const key of traversals) {
    assert.equal(classifyIdentityKey(key), "identity_key_invalid", key);
  }
});

test("an empty or non-string key is refused rather than treated as a prefix match", () => {
  assert.equal(classifyIdentityKey(""), "identity_key_invalid");
  assert.equal(classifyIdentityKey(undefined as unknown as string), "identity_key_invalid");
});

test("assertIdentityKey throws the classification, so callers cannot silently continue", () => {
  assert.throws(() => assertIdentityKey("phase1/results/x.json"), /identity_key_out_of_scope/);
  assert.throws(() => assertIdentityKey("phase1/sessions/../x"), /identity_key_invalid/);
  assert.doesNotThrow(() => assertIdentityKey("phase1/sessions/abc.json"));
});
