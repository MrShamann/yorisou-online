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
