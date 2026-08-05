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
  peekPendingInterpretationIntent,
  clearPendingInterpretationIntent,
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
  const taken = peekPendingInterpretationIntent();
  assert.equal(taken?.resultRowId, ROW);
  assert.equal(taken?.responseType, "rejected");
});

test("PEEK does NOT consume — the answer survives a crash or a failed claim", () => {
  // The earlier destructive read made a browser replay impossible but lost the person's answer the
  // moment the page loaded. Duplicate prevention now lives in the database, so holding the intent
  // until acknowledgement is both safe and necessary for recovery.
  storePendingInterpretationIntent({
    resultRowId: ROW,
    responseType: "confirmed",
    correctedResultId: null,
    reasonCode: null,
  });
  const first = peekPendingInterpretationIntent();
  const second = peekPendingInterpretationIntent();
  assert.ok(first);
  assert.deepEqual(second, first, "a reload must find the same intent, with the same nonce");
});

test("the nonce is stable across reads, so a retry is a REPLAY rather than a new write", () => {
  storePendingInterpretationIntent({
    resultRowId: ROW,
    responseType: "rejected",
    correctedResultId: null,
    reasonCode: null,
  });
  assert.equal(peekPendingInterpretationIntent()?.nonce, peekPendingInterpretationIntent()?.nonce);
});

test("clearing is explicit, and only then is the intent gone", () => {
  storePendingInterpretationIntent({
    resultRowId: ROW,
    responseType: "deferred",
    correctedResultId: null,
    reasonCode: null,
  });
  assert.ok(peekPendingInterpretationIntent());
  clearPendingInterpretationIntent();
  assert.equal(peekPendingInterpretationIntent(), null);
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
    assert.equal(peekPendingInterpretationIntent(), null, JSON.stringify(c));
    assert.equal(store.size, 0, "an unusable record is dropped, not re-read forever");
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
  assert.equal(peekPendingInterpretationIntent(), null);
});
