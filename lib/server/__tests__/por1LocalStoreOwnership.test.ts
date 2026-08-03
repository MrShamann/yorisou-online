// POR-1 — the single-process boundary, enforced and PROVEN WITH REAL PROCESSES.
//
// The first version of this suite tested the pure classifier and concluded the boundary was closed.
// It was not. Acquisition was read → classify → write temp → rename, which is check-then-act: two
// processes both reading "no lock" both rename, and BOTH return success. A classifier test cannot
// see that, because the race is between two processes, not inside one decision.
//
// So the decisive tests here spawn real children behind a barrier and count winners. The rule is
// simple and unforgiving: exactly one ACQUIRED, never two, never zero.

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  acquireLocalStoreRoot,
  classifyExistingOwner,
  isSelf,
  processIsAlive,
  readOwnerMarker,
  releaseLocalStoreRoot,
  selfMarker,
  type OwnerMarker,
} from "../localStoreOwnership";

const LOCK = ".local-store-owner.lock";
const MODULE = fileURLToPath(new URL("../localStoreOwnership.ts", import.meta.url));

const freshRoot = (t: { after: (fn: () => void) => void }) => {
  const dir = mkdtempSync(join(tmpdir(), "por1-owner-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
};

const foreign = (over: Partial<OwnerMarker> = {}): OwnerMarker => ({
  schema: 1,
  pid: 999_999,
  nonce: "some-other-process-nonce",
  startedAt: "2026-01-01T00:00:00.000Z",
  label: "other",
  ...over,
});

function writeLock(root: string, marker: OwnerMarker | string) {
  mkdirSync(join(root, LOCK), { recursive: true });
  writeFileSync(
    join(root, LOCK, "owner.json"),
    typeof marker === "string" ? marker : JSON.stringify(marker),
    "utf8",
  );
}

/**
 * Spawn N children that all try the same root at once.
 *
 * The barrier is a shared start deadline rather than a handshake: every child sleeps until the same
 * wall-clock instant, so they hit `mkdir` inside the same millisecond. A staggered launch would
 * pass against the broken implementation too, which is the whole reason the earlier suite missed it.
 */
function raceForRoot(root: string, contenders: number, holdMs = 40): string[] {
  // THE WINNER HOLDS UNTIL A SHARED DEADLINE, not for a fixed duration.
  //
  // A fixed hold is a hidden assumption that every contender starts within it. On a slow CI runner
  // it does not hold: an early winner EXITS before a late contender even begins, the late one then
  // correctly reclaims a genuinely stale lock, and the campaign records two owners. That is
  // sequential ownership working exactly as designed — but scored as a race failure, which is a test
  // defect masquerading as an implementation one. It failed this way in CI and passed locally.
  const script = `
    const url = ${JSON.stringify(MODULE)};
    const start = Number(process.env.START_AT);
    const holdUntil = Number(process.env.HOLD_UNTIL);
    import(url).then(async (m) => {
      while (Date.now() < start) {}
      const r = await m.acquireLocalStoreRoot(process.env.ROOT, { label: "race" });
      process.stdout.write(r.ok ? "ACQUIRED" : r.reason.toUpperCase());
      if (r.ok) await new Promise((res) => setTimeout(res, Math.max(0, holdUntil - Date.now())));
    }).catch((e) => { process.stdout.write("ERROR:" + e.message); });
  `;
  const startAt = Date.now() + 250;
  const holdUntil = startAt + holdMs;
  const outDir = mkdtempSync(join(tmpdir(), "por1-race-out-"));
  const scriptPath = join(outDir, "child.mjs");
  writeFileSync(scriptPath, script, "utf8");
  const cmd = Array.from({ length: contenders }, (_, i) =>
    `ROOT="${root}" START_AT=${startAt} HOLD_UNTIL=${holdUntil} "${process.execPath}" --import tsx "${scriptPath}" > "${outDir}/out-${i}" 2>/dev/null &`,
  ).join(" ");
  execFileSync("/bin/bash", ["-c", `${cmd} wait`], { encoding: "utf8" });
  const results = readdirSync(outDir)
    .filter((f) => f.startsWith("out-"))
    .map((f) => readFileSync(join(outDir, f), "utf8").trim());
  rmSync(outDir, { recursive: true, force: true });
  return results;
}

// ── THE DECISIVE TESTS — REAL SIMULTANEOUS PROCESSES ─────────────────────────

test("TWO PROCESSES, ONE EMPTY ROOT — exactly one acquires, over many campaigns", { timeout: 600_000 }, (t) => {
  // This is the test the previous suite did not have, and the reason it wrongly reported the
  // boundary closed. Against check-then-rename acquisition it produces two ACQUIRED.
  let bothWon = 0;
  let noneWon = 0;
  const campaigns = 12;
  for (let i = 0; i < campaigns; i += 1) {
    const root = freshRoot(t);
    const results = raceForRoot(root, 2, 3_000);
    const won = results.filter((r) => r === "ACQUIRED").length;
    if (won > 1) bothWon += 1;
    if (won === 0) noneWon += 1;
  }
  assert.equal(bothWon, 0, `two processes acquired the same root in ${bothWon}/${campaigns} campaigns`);
  assert.equal(noneWon, 0, `no process acquired the root in ${noneWon}/${campaigns} campaigns`);
});

test("EIGHT CONTENDERS, ONE ROOT — one owner, seven rejected", { timeout: 600_000 }, (t) => {
  for (let i = 0; i < 3; i += 1) {
    const root = freshRoot(t);
    const results = raceForRoot(root, 8, 6_000);
    const won = results.filter((r) => r === "ACQUIRED").length;
    assert.equal(won, 1, `expected exactly one owner, got ${won}: ${results.join(",")}`);
    assert.equal(
      results.filter((r) => r === "HELD_BY_LIVE_PROCESS").length,
      results.length - 1,
      `the losers must be told the root is held: ${results.join(",")}`,
    );
  }
});

test("two DIFFERENT roots are independent", (t) => {
  const a = freshRoot(t);
  const b = freshRoot(t);
  assert.deepEqual(raceForRoot(a, 1, 100), ["ACQUIRED"]);
  assert.deepEqual(raceForRoot(b, 1, 100), ["ACQUIRED"]);
});

// ── THE DECISION RULE ────────────────────────────────────────────────────────

test("classification covers free, self, stale, held and corrupt", () => {
  assert.equal(classifyExistingOwner(undefined, () => true), "free");
  assert.equal(classifyExistingOwner(null, () => true), "corrupt");
  assert.equal(classifyExistingOwner(foreign(), () => true), "held");
  assert.equal(classifyExistingOwner(foreign(), () => false), "stale");
  assert.equal(classifyExistingOwner(selfMarker(), () => true), "self");
});

test("a lock with THIS pid but a different nonce is NOT self", () => {
  // PIDs are reused. Adopting a same-pid lock would let an unrelated program's leftover become our
  // own claim.
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

// ── STALE, CORRUPT, RELEASE ──────────────────────────────────────────────────

test("a stale lock is reclaimed, and the reclaim is reported not silent", async (t) => {
  const root = freshRoot(t);
  writeLock(root, foreign());
  const result = await acquireLocalStoreRoot(root, { alive: () => false });
  assert.equal(result.ok, true);
  assert.equal(result.ok && result.reclaimedStale, true);
  assert.deepEqual(
    readdirSync(root).filter((f) => f.includes("stale-")),
    [],
    "the quarantined directory is removed after reclaim",
  );
});

test("MALFORMED ownership state FAILS CLOSED — it is never treated as free", async (t) => {
  // An authoritative data file that will not parse fails closed. Ownership state has no business
  // being weaker than the data it protects: silently stealing a root whose owner cannot be
  // determined is exactly how two writers end up live at once.
  const root = freshRoot(t);
  writeLock(root, "{ not json");
  const result = await acquireLocalStoreRoot(root);
  assert.equal(result.ok, false);
  assert.equal(result.ok === false && result.reason, "ownership_state_corrupt");
});

test("a live foreign owner is refused", async (t) => {
  const root = freshRoot(t);
  writeLock(root, foreign({ pid: process.pid, nonce: "not-ours" }));
  const result = await acquireLocalStoreRoot(root, { alive: () => true });
  assert.equal(result.ok, false);
  assert.equal(result.ok === false && result.reason, "held_by_live_process");
});

test("the owner file carries no secret and no user data", async (t) => {
  const root = freshRoot(t);
  await acquireLocalStoreRoot(root);
  const marker = await readOwnerMarker(root);
  assert.deepEqual(Object.keys(marker as object).sort(), ["label", "nonce", "pid", "schema", "startedAt"]);
});

test("release frees the root, and NEVER steals a foreign lock", async (t) => {
  const root = freshRoot(t);
  await acquireLocalStoreRoot(root);
  assert.equal(await releaseLocalStoreRoot(root), true);
  assert.equal(await readOwnerMarker(root), undefined);
  assert.deepEqual(readdirSync(root).filter((f) => f.includes("release-")), []);

  writeLock(root, foreign());
  assert.equal(await releaseLocalStoreRoot(root), false, "a non-owner must not release");
  assert.ok(await readOwnerMarker(root), "the foreign lock survives");
});

test("re-asserting ownership from the same process is idempotent", async (t) => {
  const root = freshRoot(t);
  const first = await acquireLocalStoreRoot(root);
  const again = await acquireLocalStoreRoot(root);
  assert.equal(first.ok && again.ok, true);
  assert.equal(again.ok && again.marker.nonce, first.ok && first.marker.nonce);
});
