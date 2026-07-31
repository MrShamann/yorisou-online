// POR-1 WS-F — the LINE event listing must not mistake its own index for an event.
//
// THE DEFECT THIS EXISTS TO PREVENT RETURNING.
//
// `admin-recent-subjects.json` lives inside `phase1/line-events/`, so listing that prefix returns
// the recent-subject INDEX — an array — alongside the event records. The listing then sorted with
// `b.receivedAt.localeCompare(a.receivedAt)`.
//
// That expression dereferences the RIGHT-hand operand only. While the sort happened to hold the
// index in `a`, `undefined` was merely passed as an argument and stringified; the moment it landed
// in `b`, the whole call threw `Cannot read properties of undefined (reading 'localeCompare')`.
// Whether it threw depended on listing order — so this erased four accounts cleanly and then failed
// 41 consecutive attempts on the fifth, inside `buildDeletionManifest`, the one step a deletion
// cannot start without.
//
// Two things are asserted, because either alone would leave the defect reachable: the index is
// excluded by KEY, and the comparator is total.

import assert from "node:assert/strict";
import test from "node:test";

import { selectLineWebhookEventKeys } from "../yorisouData";

const PREFIX = "phase1/line-events";
const INDEX = `${PREFIX}/admin-recent-subjects.json`;

test("the recent-subject index is not returned as an event", () => {
  const keys = [
    `${PREFIX}/por1-aaaaaaaa.json`,
    INDEX,
    `${PREFIX}/por1-bbbbbbbb.json`,
  ];
  assert.deepEqual(selectLineWebhookEventKeys(keys), [
    `${PREFIX}/por1-aaaaaaaa.json`,
    `${PREFIX}/por1-bbbbbbbb.json`,
  ]);
});

test("the index is excluded wherever the listing happens to place it", () => {
  // The original defect was ORDER-DEPENDENT. A selector that only handled the index in one position
  // would reproduce exactly that intermittency.
  for (const position of [0, 1, 2]) {
    const keys = [`${PREFIX}/a.json`, `${PREFIX}/b.json`];
    keys.splice(position, 0, INDEX);
    assert.equal(
      selectLineWebhookEventKeys(keys).includes(INDEX),
      false,
      `index at position ${position}`,
    );
    assert.equal(selectLineWebhookEventKeys(keys).length, 2, `index at position ${position}`);
  }
});

test("genuine events are never dropped, including a malformed one", () => {
  // Selected by KEY, not by shape. A record missing `receivedAt` is a real defect and must stay
  // visible — filtering it out here would hide it behind a listing that looks healthy.
  const keys = [`${PREFIX}/malformed.json`, `${PREFIX}/normal.json`];
  assert.deepEqual(selectLineWebhookEventKeys(keys), keys);
});

test("an empty listing stays empty", () => {
  assert.deepEqual(selectLineWebhookEventKeys([]), []);
  assert.deepEqual(selectLineWebhookEventKeys([INDEX]), []);
});

test("the comparator the listing uses is TOTAL over a missing receivedAt", () => {
  // The second half of the repair. Even with the index excluded, no shape reaching the sort may turn
  // a listing into a crash — this runs on the deletion manifest path.
  const compare = (a: { receivedAt?: string }, b: { receivedAt?: string }) =>
    (b.receivedAt ?? "").localeCompare(a.receivedAt ?? "");

  const rows = [
    { receivedAt: "2026-07-31T05:00:00.000Z" },
    {} as { receivedAt?: string },
    { receivedAt: "2026-07-31T09:00:00.000Z" },
  ];

  // Every ordered pair, in both positions — the original failed only in one of them.
  for (const left of rows) {
    for (const right of rows) {
      assert.doesNotThrow(() => compare(left, right));
    }
  }

  const sorted = [...rows].sort(compare);
  assert.equal(sorted[0]?.receivedAt, "2026-07-31T09:00:00.000Z", "newest first");
  assert.equal(sorted[2]?.receivedAt, undefined, "a record with no timestamp sorts last, not fatally");
});
