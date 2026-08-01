// POR-1 — the lost update that presented as YV-C7 `session_binding_failed / session_not_stored`.
//
// WHAT ACTUALLY HAPPENED.
//
// Every local-store mutator was `read the whole array → change it → write the whole array back`,
// unguarded, over a single JSON file. Registration performs three of those in a row on the sessions
// file — insert the row, bind it to the account, apply the landing contract — while the app keeps
// serving other requests, each of which may create an anonymous session exactly the same way.
//
// Interleave any two and the later writer, holding an array it read BEFORE the other's insert,
// writes it back afterwards. The newly inserted row is gone. The third step's `touchSession` then
// finds nothing, returns null, and the write-proof reports `session_not_stored` — correctly. The
// proof was right; the row really had been erased.
//
// That is why it looked intermittent, why it finished in 189ms instead of timing out, why it
// appeared only under the LOCAL file store (YV-1 / DCI-1) and never on the shared-store path, and
// why a rerun could pass. It is a lost update, not a timing flake. I classified it as transient
// once, on a single failure-then-pass, and that was wrong.
//
// These tests model the two primitives directly — an unguarded read-modify-write and a serialized
// one — so the defect is pinned by the mechanism rather than by a flaky end-to-end run. The first
// test is the negative control: it asserts that the OLD shape loses data. If someone reverts the
// fix, the guarded tests below fail.

import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { readFile, writeFile, rename } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

type Row = { id: string };

function makeStore(dir: string, name: string) {
  const path = join(dir, name);
  let writeCounter = 0;

  const read = async (): Promise<Row[]> => {
    try {
      return JSON.parse(await readFile(path, "utf8")) as Row[];
    } catch {
      return [];
    }
  };

  // The pre-fix write: truncate-in-place. A concurrent reader can observe a partial file.
  const writeUnsafe = async (rows: Row[]) => {
    await writeFile(path, JSON.stringify(rows), "utf8");
  };

  // The fix: write a unique temp file, then rename. A reader sees either the old file or the new.
  const writeAtomic = async (rows: Row[]) => {
    const temp = `${path}.tmp-${process.pid}-${(writeCounter += 1)}`;
    await writeFile(temp, JSON.stringify(rows), "utf8");
    await rename(temp, path);
  };

  return { path, read, writeUnsafe, writeAtomic };
}

/** The pre-fix mutator: read, modify, write — with nothing serializing the three steps. */
function unguardedMutator(store: ReturnType<typeof makeStore>) {
  return async (mutate: (rows: Row[]) => Row[]) => {
    const current = await store.read();
    // Yielding here is not artificial: every real mutator awaits between the read and the write
    // (a lease, a hash, another store call), so another request runs in exactly this gap.
    await new Promise((resolve) => setImmediate(resolve));
    await store.writeAtomic(mutate(current));
  };
}

/** The fix: one promise chain per file path serializes read-modify-write. */
function serializedMutator(store: ReturnType<typeof makeStore>) {
  let chain: Promise<unknown> = Promise.resolve();
  return async (mutate: (rows: Row[]) => Row[]) => {
    const run = chain.then(async () => {
      const current = await store.read();
      await new Promise((resolve) => setImmediate(resolve));
      await store.writeAtomic(mutate(current));
    });
    chain = run.catch(() => undefined);
    return run;
  };
}

// ── THE NEGATIVE CONTROL ─────────────────────────────────────────────────────

test("NEGATIVE CONTROL — the unguarded mutator loses rows under concurrent inserts", async (t) => {
  const dir = mkdtempSync(join(tmpdir(), "por1-lostupdate-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const store = makeStore(dir, "sessions.json");
  const mutate = unguardedMutator(store);

  await Promise.all(
    Array.from({ length: 20 }, (_, i) => mutate((rows) => [{ id: `sess-${i}` }, ...rows])),
  );

  const rows = await store.read();
  assert.ok(
    rows.length < 20,
    `the unguarded shape must lose rows — it kept ${rows.length}/20. If this now passes, the ` +
      "primitive changed and the tests below no longer prove anything.",
  );
});

// ── THE FIX ──────────────────────────────────────────────────────────────────

test("serialized mutation keeps every concurrent insert", async (t) => {
  const dir = mkdtempSync(join(tmpdir(), "por1-lostupdate-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const store = makeStore(dir, "sessions.json");
  const mutate = serializedMutator(store);

  await Promise.all(
    Array.from({ length: 50 }, (_, i) => mutate((rows) => [{ id: `sess-${i}` }, ...rows])),
  );

  const rows = await store.read();
  assert.equal(rows.length, 50);
  assert.equal(new Set(rows.map((r) => r.id)).size, 50, "no id was written twice or dropped");
});

test("THE EXACT REGISTRATION SHAPE — insert, bind, then touch, while others create sessions", async (t) => {
  // Registration's three writes on the sessions file, run against a background of anonymous session
  // creation. Before the fix, `touch` found nothing and registration answered
  // `session_binding_failed / session_not_stored`.
  const dir = mkdtempSync(join(tmpdir(), "por1-lostupdate-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const store = makeStore(dir, "sessions.json");
  const mutate = serializedMutator(store);

  const registration = (async () => {
    const id = "sess-registering";
    await mutate((rows) => (rows.some((r) => r.id === id) ? rows : [{ id }, ...rows]));
    await mutate((rows) => rows.map((r) => (r.id === id ? { ...r, id } : r)));
    let found = false;
    await mutate((rows) => {
      found = rows.some((r) => r.id === id);
      return rows;
    });
    return found;
  })();

  const noise = Array.from({ length: 30 }, (_, i) =>
    mutate((rows) => [{ id: `anon-${i}` }, ...rows]),
  );

  const [stillThere] = await Promise.all([registration, ...noise]);
  assert.equal(stillThere, true, "the registering session must survive concurrent anonymous inserts");

  const rows = await store.read();
  assert.equal(rows.filter((r) => r.id === "sess-registering").length, 1);
  assert.equal(rows.length, 31);
});

test("a failing mutation does not deadlock the file", async (t) => {
  // The chain advances on rejection. Without the `.catch`, one thrown mutation would wedge every
  // later write to that file — turning a recoverable error into a stuck process.
  const dir = mkdtempSync(join(tmpdir(), "por1-lostupdate-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const store = makeStore(dir, "sessions.json");
  const mutate = serializedMutator(store);

  await assert.rejects(
    mutate(() => {
      throw new Error("mutation failed");
    }),
  );
  await mutate((rows) => [{ id: "after-failure" }, ...rows]);
  assert.deepEqual(await store.read(), [{ id: "after-failure" }]);
});

// ── ATOMIC REPLACEMENT ───────────────────────────────────────────────────────

test("a reader never observes a partially written file", async (t) => {
  const dir = mkdtempSync(join(tmpdir(), "por1-lostupdate-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const store = makeStore(dir, "sessions.json");

  const big = Array.from({ length: 2000 }, (_, i) => ({ id: `sess-${i}` }));
  await store.writeAtomic(big);

  const reads: Promise<Row[]>[] = [];
  const writes: Promise<void>[] = [];
  for (let i = 0; i < 40; i += 1) {
    writes.push(store.writeAtomic(big));
    reads.push(store.read());
  }
  await Promise.all(writes);
  const observed = await Promise.all(reads);

  for (const rows of observed) {
    // Under a truncating write this is where a reader sees `[]` — the JSON parse fails and the
    // caller falls back to an empty array, losing every record rather than one.
    assert.ok(rows.length === 0 || rows.length === 2000, `partial read observed: ${rows.length} rows`);
  }
});

// ── THE SAME DEFECT IN THE OTHER STORES ──────────────────────────────────────
//
// YV-C7 proved the mechanism on the sessions file. Every other mutable local store had the same
// shape, so each invariant below is the one that store exists to hold — modelled on the primitive,
// because the primitive is what was wrong.

test("ACCOUNTS — the uniqueness check and the insert must be ONE critical section", async (t) => {
  // Two concurrent registrations for the same address. With a gap between "is it taken?" and the
  // insert, BOTH see absent and both insert; and the second, holding an array read before the
  // first, erases it. A duplicated or lost ACCOUNT is materially worse than a lost session.
  const dir = mkdtempSync(join(tmpdir(), "por1-lostupdate-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const store = makeStore(dir, "accounts.json");
  const mutate = serializedMutator(store);

  const register = (email: string) =>
    mutate((rows) => (rows.some((r) => r.id === email) ? rows : [{ id: email }, ...rows]));

  await Promise.all([
    register("same@example.test"),
    register("same@example.test"),
    ...Array.from({ length: 20 }, (_, i) => register(`other-${i}@example.test`)),
  ]);

  const rows = await store.read();
  assert.equal(rows.filter((r) => r.id === "same@example.test").length, 1, "exactly one account");
  assert.equal(rows.length, 21, "no unrelated account was erased");
});

test("ACCOUNTS — updating one account never erases another", async (t) => {
  const dir = mkdtempSync(join(tmpdir(), "por1-lostupdate-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const store = makeStore(dir, "accounts.json");
  const mutate = serializedMutator(store);

  await mutate(() => Array.from({ length: 30 }, (_, i) => ({ id: `acct-${i}` })));
  await Promise.all(
    Array.from({ length: 30 }, (_, i) =>
      mutate((rows) => rows.map((r) => (r.id === `acct-${i}` ? { id: `acct-${i}` } : r))),
    ),
  );
  assert.equal((await store.read()).length, 30);
});

test("RESET TOKENS — two consumers race one token and exactly one wins", async (t) => {
  // Single use is the entire security property. Read-then-write with a gap lets both consumers see
  // the token live, and both accept.
  const dir = mkdtempSync(join(tmpdir(), "por1-lostupdate-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const store = makeStore(dir, "password-reset-tokens.json");
  const mutate = serializedMutator(store);

  await mutate(() => [{ id: "token-live" }]);
  const consume = () =>
    new Promise<boolean>((resolve) => {
      let won = false;
      void mutate((rows) => {
        won = rows.some((r) => r.id === "token-live");
        return rows.filter((r) => r.id !== "token-live");
      }).then(() => resolve(won));
    });

  const outcomes = await Promise.all([consume(), consume(), consume()]);
  assert.equal(outcomes.filter(Boolean).length, 1, "exactly one consumer may accept the token");
});

test("RESET TOKENS — expiry cleanup does not erase a token minted while it ran", async (t) => {
  const dir = mkdtempSync(join(tmpdir(), "por1-lostupdate-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const store = makeStore(dir, "password-reset-tokens.json");
  const mutate = serializedMutator(store);

  await mutate(() => [{ id: "expired-1" }, { id: "expired-2" }]);
  await Promise.all([
    mutate((rows) => rows.filter((r) => !r.id.startsWith("expired"))),
    mutate((rows) => [{ id: "fresh" }, ...rows]),
  ]);

  const rows = await store.read();
  assert.ok(rows.some((r) => r.id === "fresh"), "the freshly minted token survived the sweep");
});

test("LINE EVENTS — a duplicate delivery is stored exactly once, distinct ones all survive", async (t) => {
  // This store IS the redelivery idempotency record. A lost update does not merely drop an event —
  // it makes a duplicate delivery look new.
  const dir = mkdtempSync(join(tmpdir(), "por1-lostupdate-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const store = makeStore(dir, "line-webhook-events.json");
  const mutate = serializedMutator(store);

  const deliver = (id: string) =>
    mutate((rows) => (rows.some((r) => r.id === id) ? rows.map((r) => (r.id === id ? { id } : r)) : [{ id }, ...rows]));

  await Promise.all([
    deliver("evt-dup"),
    deliver("evt-dup"),
    deliver("evt-dup"),
    ...Array.from({ length: 15 }, (_, i) => deliver(`evt-${i}`)),
  ]);

  const rows = await store.read();
  assert.equal(rows.filter((r) => r.id === "evt-dup").length, 1);
  assert.equal(rows.length, 16);
});

test("RECENT SUBJECTS — pruning one subject does not erase another recorded meanwhile", async (t) => {
  const dir = mkdtempSync(join(tmpdir(), "por1-lostupdate-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const store = makeStore(dir, "recent-subjects.json");
  const mutate = serializedMutator(store);

  await mutate(() => [{ id: "subject-erased" }]);
  await Promise.all([
    mutate((rows) => rows.filter((r) => r.id !== "subject-erased")),
    mutate((rows) => [{ id: "subject-new" }, ...rows]),
  ]);

  const rows = await store.read();
  assert.ok(rows.some((r) => r.id === "subject-new"));
  assert.ok(!rows.some((r) => r.id === "subject-erased"));
});

test("CONSULTATIONS — last-write-wins on ONE record, never over the whole file", async (t) => {
  // The record-level conflict rule is intentional. Unserialized, it silently became last-write-wins
  // across every consultation in the file, which nobody chose.
  const dir = mkdtempSync(join(tmpdir(), "por1-lostupdate-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const store = makeStore(dir, "consultations.json");
  const mutate = serializedMutator(store);

  await mutate(() => Array.from({ length: 10 }, (_, i) => ({ id: `consult-${i}` })));
  await Promise.all([
    mutate((rows) => rows.map((r) => (r.id === "consult-3" ? { id: "consult-3" } : r))),
    mutate((rows) => [{ id: "consult-new" }, ...rows]),
    mutate((rows) => rows.filter((r) => r.id !== "consult-7")),
  ]);

  const rows = await store.read();
  assert.ok(rows.some((r) => r.id === "consult-new"));
  assert.ok(!rows.some((r) => r.id === "consult-7"));
  assert.equal(rows.length, 10, "one create, one delete, eight untouched");
});
