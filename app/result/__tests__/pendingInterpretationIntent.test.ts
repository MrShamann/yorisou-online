// UX-2R / CPC-1 §4 — the pending interpretation intent is bounded and single-use.
//
// This intent crosses the login boundary in sessionStorage, which the user's own browser
// extensions and any XSS can read and write. It is therefore treated as untrusted input on the way
// back IN, not merely on the way out: every field is re-validated on read, and the record is
// consumed before use so it cannot be replayed.

import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";

// `window` is only touched inside the functions, never at module scope, so an ordinary import is
// safe as long as the stub exists before the first call.
import {
  storePendingInterpretationIntent,
  takePendingInterpretationIntent,
} from "../pendingSave";

const store = new Map<string, string>();

// Minimal sessionStorage + crypto.randomUUID, so the real module runs unmodified.
(globalThis as unknown as { window: unknown }).window = {
  sessionStorage: {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  },
};



const ROW = "11111111-2222-4333-8444-555555555555";
const KEY = "yorisou.result.pending-intent.v1";

beforeEach(() => store.clear());

test("a valid intent round-trips", () => {
  storePendingInterpretationIntent({
    resultRowId: ROW,
    responseType: "rejected",
    correctedResultId: null,
    reasonCode: null,
  });
  const taken = takePendingInterpretationIntent();
  assert.equal(taken?.resultRowId, ROW);
  assert.equal(taken?.responseType, "rejected");
});

test("SINGLE USE — the record is consumed on read, so it cannot be replayed", () => {
  storePendingInterpretationIntent({
    resultRowId: ROW,
    responseType: "confirmed",
    correctedResultId: null,
    reasonCode: null,
  });
  assert.ok(takePendingInterpretationIntent());
  assert.equal(takePendingInterpretationIntent(), null, "a second read must yield nothing");
});

test("a correction without a governed target is never stored", () => {
  storePendingInterpretationIntent({
    resultRowId: ROW,
    responseType: "corrected",
    correctedResultId: null,
    reasonCode: null,
  });
  assert.equal(store.size, 0, "an unusable intent must not survive login only to be rejected");
});

test("a tampered stored record is rejected on read", () => {
  const cases: Record<string, unknown>[] = [
    { resultRowId: "not-a-uuid", responseType: "confirmed", nonce: ROW, createdAt: Date.now() },
    { resultRowId: ROW, responseType: "deleted", nonce: ROW, createdAt: Date.now() },
    { resultRowId: ROW, responseType: "confirmed", nonce: "no", createdAt: Date.now() },
    // A correction whose target was stripped after storage.
    { resultRowId: ROW, responseType: "corrected", correctedResultId: null, nonce: ROW, createdAt: Date.now() },
    // Expired.
    { resultRowId: ROW, responseType: "confirmed", nonce: ROW, createdAt: Date.now() - 11 * 60 * 1000 },
  ];
  for (const c of cases) {
    store.set(KEY, JSON.stringify(c));
    assert.equal(takePendingInterpretationIntent(), null, JSON.stringify(c));
    assert.equal(store.size, 0, "a rejected record is still cleared, never left to be retried");
  }
});

test("free text can never reach the corrected identity", () => {
  storePendingInterpretationIntent({
    resultRowId: ROW,
    responseType: "corrected",
    correctedResultId: "私はもっと不安が強いタイプだと思う",
    reasonCode: null,
  });
  assert.equal(store.size, 0, "a self-described diagnosis is not a governed archetype code");
});

test("malformed JSON is rejected rather than thrown", () => {
  store.set(KEY, "{not json");
  assert.equal(takePendingInterpretationIntent(), null);
});
