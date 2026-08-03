// POR-1 — the single-process boundary, made enforceable.
//
// The lost-update repair serializes read-modify-write through one in-process promise chain per file.
// Two application processes against one store root would each serialize perfectly against themselves
// and lose each other's writes exactly as before the repair — while every existing test still
// passed. That is the specific reason this boundary cannot be left as documentation: the unsupported
// configuration is indistinguishable from the supported one until data disappears.

import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  acquireLocalStoreRoot,
  classifyExistingOwner,
  isSelf,
  processIsAlive,
  readOwnerMarker,
  releaseLocalStoreRoot,
  type OwnerMarker,
} from "../localStoreOwnership";

const MARKER = ".local-store-owner.json";
const freshRoot = (t: { after: (fn: () => void) => void }) => {
  const dir = mkdtempSync(join(tmpdir(), "por1-owner-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
};

const foreign = (over: Partial<OwnerMarker> = {}): OwnerMarker => ({
  pid: 999_999,
  nonce: "some-other-process-nonce",
  startedAt: "2026-01-01T00:00:00.000Z",
  label: "other",
  ...over,
});

// ── THE DECISION RULE, tested without spawning anything ──────────────────────

test("classification covers free, self, stale and held", () => {
  const alwaysAlive = () => true;
  const neverAlive = () => false;

  assert.equal(classifyExistingOwner(null, alwaysAlive), "free");
  assert.equal(classifyExistingOwner(foreign(), alwaysAlive), "held");
  assert.equal(classifyExistingOwner(foreign(), neverAlive), "stale");
});

test("a marker with THIS pid but a different nonce is not self", () => {
  // PIDs are reused. Treating a same-pid marker as our own would let a store be silently adopted by
  // an unrelated program that happened to land on the number.
  const samePidDifferentProcess = foreign({ pid: process.pid });
  assert.equal(isSelf(samePidDifferentProcess), false);
  assert.equal(classifyExistingOwner(samePidDifferentProcess, () => true), "held");
});

test("processIsAlive answers for this process and rejects nonsense", () => {
  assert.equal(processIsAlive(process.pid), true);
  assert.equal(processIsAlive(0), false);
  assert.equal(processIsAlive(-1), false);
  assert.equal(processIsAlive(Number.NaN), false);
});

// ── ACQUISITION ──────────────────────────────────────────────────────────────

test("a free root is acquired, and re-acquiring from the same process is not a conflict", async (t) => {
  const root = freshRoot(t);
  const first = await acquireLocalStoreRoot(root, { label: "test" });
  assert.equal(first.ok, true);
  assert.equal(first.ok && first.reclaimedStale, false);

  const again = await acquireLocalStoreRoot(root);
  assert.equal(again.ok, true, "the owner may re-assert its own claim");
});

test("A SECOND LIVE PROCESS IS REJECTED — the case this exists for", async (t) => {
  const root = freshRoot(t);
  // A live foreign owner: a real pid that is not us.
  writeFileSync(
    join(root, MARKER),
    JSON.stringify(foreign({ pid: process.ppid || process.pid })),
    "utf8",
  );

  const result = await acquireLocalStoreRoot(root, { alive: () => true });
  assert.equal(result.ok, false);
  assert.equal(result.ok === false && result.reason, "held_by_live_process");
  assert.ok(result.ok === false && typeof result.holder.pid === "number");
});

test("a stale marker is reclaimed and reported as such", async (t) => {
  const root = freshRoot(t);
  writeFileSync(join(root, MARKER), JSON.stringify(foreign()), "utf8");

  const result = await acquireLocalStoreRoot(root, { alive: () => false });
  assert.equal(result.ok, true);
  assert.equal(result.ok && result.reclaimedStale, true, "recovery must be visible, not silent");
});

test("a malformed marker does not wedge the store forever", async (t) => {
  // A safety net that can permanently lock a developer out of their own store is a worse problem
  // than the one it prevents.
  const root = freshRoot(t);
  writeFileSync(join(root, MARKER), "{ not json", "utf8");
  assert.equal(await readOwnerMarker(root), null);
  assert.equal((await acquireLocalStoreRoot(root)).ok, true);
});

test("the marker is written atomically and leaves no temp file behind", async (t) => {
  const root = freshRoot(t);
  await acquireLocalStoreRoot(root);
  const parsed = JSON.parse(readFileSync(join(root, MARKER), "utf8")) as OwnerMarker;
  assert.equal(parsed.pid, process.pid);
  assert.equal(typeof parsed.nonce, "string");
  const { readdirSync } = await import("node:fs");
  assert.deepEqual(
    readdirSync(root).filter((f) => f.includes(".tmp-")),
    [],
    "no temp marker survived the rename",
  );
});

test("the marker carries no secret and no user data", async (t) => {
  const root = freshRoot(t);
  await acquireLocalStoreRoot(root, { label: "yorisou-local-store" });
  const raw = readFileSync(join(root, MARKER), "utf8");
  assert.deepEqual(Object.keys(JSON.parse(raw) as object).sort(), ["label", "nonce", "pid", "startedAt"]);
});

// ── RELEASE ──────────────────────────────────────────────────────────────────

test("release frees the root for the next process", async (t) => {
  const root = freshRoot(t);
  await acquireLocalStoreRoot(root);
  assert.equal(await releaseLocalStoreRoot(root), true);
  assert.equal(await readOwnerMarker(root), null);
  assert.equal((await acquireLocalStoreRoot(root, { alive: () => true })).ok, true);
});

test("release NEVER steals a marker written by another process", async (t) => {
  const root = freshRoot(t);
  writeFileSync(join(root, MARKER), JSON.stringify(foreign()), "utf8");
  assert.equal(await releaseLocalStoreRoot(root), false, "a non-owner must not be able to release");
  assert.ok(await readOwnerMarker(root), "the foreign marker survives");
});

// ── ISOLATION ────────────────────────────────────────────────────────────────

test("two different roots are independent", async (t) => {
  const a = freshRoot(t);
  const b = freshRoot(t);
  assert.equal((await acquireLocalStoreRoot(a)).ok, true);
  assert.equal((await acquireLocalStoreRoot(b)).ok, true);
  // Isolated roots are the supported way to run two harnesses at once.
  assert.notEqual((await readOwnerMarker(a))?.startedAt === undefined, true);
});
