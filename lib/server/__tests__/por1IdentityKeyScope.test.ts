// POR-1 WS2/WS7 — the identity-deletion adapter is narrow by construction.
//
// The requirement it enforces: no arbitrary path deletion, no generic bucket administration, no
// secret-gated backdoor. The only thing the adapter can remove is an account-linked object inside one
// of seven named families — and, within those, never the one shared index that belongs to everybody.

import assert from "node:assert/strict";
import test from "node:test";

import {
  assertIdentityKey,
  classifyIdentityKey,
  IDENTITY_KEY_PREFIXES,
  SHARED_LINE_SUBJECT_INDEX_KEY,
  SHARED_STORE_PREFIX,
} from "../identityKeyScope";

test("the seven account-linked families, and only those, are deletable", () => {
  // Five identity families, plus the two POR-1 added deliberately: `consultations/` and
  // `line-events/`. Those two cannot be logged into, which is why they were originally out of scope —
  // but a completed deletion that left them behind has not deleted the person, it has only made them
  // unable to log in and look. The count is asserted so that widening the scope stays a decision
  // somebody makes rather than a line somebody adds.
  assert.equal(IDENTITY_KEY_PREFIXES.length, 7);
  for (const prefix of IDENTITY_KEY_PREFIXES) {
    assert.equal(classifyIdentityKey(`${prefix}abc.json`), null, prefix);
  }
});

test("the SHARED line-subject index is inside an allowed family and still not deletable", () => {
  // `admin-recent-subjects.json` is one array holding entries for every LINE subject. Deleting it to
  // erase one person would erase everyone's, so it is pruned in place instead — and the scope rule
  // refuses it by name rather than trusting a caller to remember.
  assert.equal(classifyIdentityKey(SHARED_LINE_SUBJECT_INDEX_KEY), "identity_key_out_of_scope");
  // A per-event object in the SAME family is still deletable, so the exclusion is exact and not a
  // retreat from the family.
  assert.equal(classifyIdentityKey(`${SHARED_STORE_PREFIX}/line-events/evt_123.json`), null);
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

// ─────────────────────────────────────────────────────────────────────────────
// The allowlist must name the key families that actually exist.
//
// It named `accounts/by-line/`, which no writer has ever used, while the real family —
// `accounts/by-line-user/<sha256(lineUserId)>` — sat outside it. So the guard authorised a
// fiction and refused the truth, and deleting a LINE-bound account left the live index behind.
// ─────────────────────────────────────────────────────────────────────────────

test("the LINE family in the allowlist is the hashed one the store actually writes", () => {
  assert.equal(classifyIdentityKey(`${SHARED_STORE_PREFIX}/accounts/by-line-user/abc123.json`), null);
  assert.equal(
    classifyIdentityKey(`${SHARED_STORE_PREFIX}/accounts/by-line/U1234567890.json`),
    "identity_key_out_of_scope",
    "the unhashed family is not a real key family and must not be authorised",
  );
});

test("a raw LINE user id can never be a valid lookup key", () => {
  // LINE ids start with `U`. The hashed family is 64 hex chars; a raw id is not, and the point of
  // hashing is that the id never appears in a key at all.
  assert.equal(
    classifyIdentityKey(`${SHARED_STORE_PREFIX}/accounts/by-line/Udeadbeefdeadbeefdeadbeef.json`),
    "identity_key_out_of_scope",
  );
});
