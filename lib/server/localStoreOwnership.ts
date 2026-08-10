// POR-1 — the local JSON store is single-process, and this makes that ENFORCEABLE.
//
// WHY IT NEEDS ENFORCING RATHER THAN DOCUMENTING.
//
// The lost-update repair serializes read-modify-write through one in-process promise chain per file
// path. That is correct for the adapter's real support boundary — a single local or test application
// process — and worth nothing across two. Two servers pointed at one store root would each serialize
// perfectly against themselves and lose each other's writes exactly as before the repair, while
// every test still passed.
//
// WHY THE FIRST VERSION OF THIS FILE DID NOT ENFORCE ANYTHING.
//
// It acquired by: read the marker → classify → write a temp file → rename it over the marker. That
// is check-then-act. Two processes both reading "no marker" both write, both rename, and BOTH
// return success — the canonical file names one of them, and the other proceeds believing it owns
// the root. It is precisely the unsupported state the file exists to prevent, and its tests could
// not catch it because they exercised the pure classifier rather than two real contenders.
//
// The decision is now `mkdir`, which the filesystem guarantees only one caller can win. Everything
// else — stale reclaim, release — is expressed as a `rename` of the whole lock directory, which is
// likewise atomic and single-winner.
//
// WHAT THIS IS NOT: a distributed lock. It catches accidental concurrent use on one machine — a
// forgotten dev server, a harness that did not tear down, two suites sharing a root.

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile, rename, rm } from "node:fs/promises";
import { join } from "node:path";

const LOCK_DIR = ".local-store-owner.lock";
const OWNER_FILE = "owner.json";
const SCHEMA = 1;

export type OwnerMarker = {
  schema: number;
  pid: number;
  /**
   * A per-start nonce.
   *
   * PIDs are reused. A lock naming a live PID that happens to be a different program is
   * indistinguishable from a live owner by PID alone.
   */
  nonce: string;
  startedAt: string;
  /** For a human reading the file. Never a secret, never user data. */
  label: string;
};

export type OwnershipResult =
  | { ok: true; marker: OwnerMarker; reclaimedStale: boolean }
  | { ok: false; reason: "held_by_live_process"; holder: { pid: number; startedAt: string } }
  | { ok: false; reason: "ownership_state_corrupt" };

/** The identity of THIS process instance. Stable for the module's lifetime. */
const selfNonce = randomUUID();

const lockDir = (root: string) => join(root, LOCK_DIR);
const ownerFile = (root: string) => join(lockDir(root), OWNER_FILE);

export function processIsAlive(pid: number): boolean {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    // EPERM means it exists but belongs to another user — still alive.
    return (error as NodeJS.ErrnoException).code === "EPERM";
  }
}

export function isSelf(marker: OwnerMarker): boolean {
  return marker.pid === process.pid && marker.nonce === selfNonce;
}

export function selfMarker(label = "yorisou-local-store"): OwnerMarker {
  return { schema: SCHEMA, pid: process.pid, nonce: selfNonce, startedAt: new Date().toISOString(), label };
}

/**
 * Read the owner metadata inside an existing lock directory.
 *
 * `undefined` means the lock directory is absent — the root is free. `null` means the lock exists
 * but its metadata is unreadable or malformed, which is NOT free: an authoritative store file that
 * will not parse fails closed, and ownership state has no business being weaker than the data it
 * protects. Automatically stealing a root whose live ownership cannot be determined is how two
 * processes end up writing at once.
 */
export async function readOwnerMarker(root: string): Promise<OwnerMarker | null | undefined> {
  let raw: string;
  try {
    raw = await readFile(ownerFile(root), "utf8");
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === "ENOENT" ? undefined : null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<OwnerMarker>;
    if (typeof parsed.pid !== "number" || typeof parsed.nonce !== "string") return null;
    return {
      schema: typeof parsed.schema === "number" ? parsed.schema : 0,
      pid: parsed.pid,
      nonce: parsed.nonce,
      startedAt: typeof parsed.startedAt === "string" ? parsed.startedAt : "",
      label: typeof parsed.label === "string" ? parsed.label : "",
    };
  } catch {
    return null;
  }
}

/** The decision rule, pure so it is testable without spawning. */
export function classifyExistingOwner(
  marker: OwnerMarker | null | undefined,
  alive: (pid: number) => boolean,
): "free" | "self" | "stale" | "held" | "corrupt" {
  if (marker === undefined) return "free";
  if (marker === null) return "corrupt";
  if (isSelf(marker)) return "self";
  return alive(marker.pid) ? "held" : "stale";
}

async function tryCreateLock(root: string): Promise<boolean> {
  try {
    // THE DECISION. `mkdir` without `recursive` fails with EEXIST if the directory is already
    // there, and the filesystem guarantees exactly one concurrent caller succeeds. This is the
    // single line that makes acquisition exclusive rather than advisory.
    await mkdir(lockDir(root), { recursive: false });
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") return false;
    throw error;
  }
}

async function writeOwnerFile(root: string, marker: OwnerMarker): Promise<void> {
  const temp = join(lockDir(root), `${OWNER_FILE}.tmp-${process.pid}-${randomUUID()}`);
  await writeFile(temp, `${JSON.stringify(marker, null, 2)}\n`, "utf8");
  await rename(temp, ownerFile(root));
}

/**
 * Claim the store root for this process instance.
 *
 * Bounded attempts, because a contender that loses a stale-reclaim race must restart from the top
 * rather than assume anything about what it observed a moment ago.
 */
export async function acquireLocalStoreRoot(
  root: string,
  options: { label?: string; alive?: (pid: number) => boolean } = {},
): Promise<OwnershipResult> {
  const alive = options.alive ?? processIsAlive;
  await mkdir(root, { recursive: true });

  let reclaimedStale = false;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    if (await tryCreateLock(root)) {
      const marker = selfMarker(options.label);
      await writeOwnerFile(root, marker);
      return { ok: true, marker, reclaimedStale };
    }

    // The lock exists. Who holds it?
    const existing = await readOwnerMarker(root);
    const state = classifyExistingOwner(existing, alive);

    if (state === "self") {
      return { ok: true, marker: existing as OwnerMarker, reclaimedStale };
    }
    if (state === "held") {
      const holder = existing as OwnerMarker;
      return { ok: false, reason: "held_by_live_process", holder: { pid: holder.pid, startedAt: holder.startedAt } };
    }
    if (state === "corrupt") {
      return { ok: false, reason: "ownership_state_corrupt" };
    }
    if (state === "free") {
      // The lock directory exists but has no owner file yet — another contender is between `mkdir`
      // and its metadata write. Yield and re-read rather than treating a half-built lock as free.
      await new Promise((resolve) => setTimeout(resolve, 5));
      continue;
    }

    // STALE. Quarantine by RENAMING the whole lock directory: only one contender can rename that
    // exact path, so only one may proceed to re-acquire. Unlinking the marker and then claiming
    // would let two reclaimers both "win".
    const quarantine = join(root, `.local-store-owner.stale-${randomUUID()}`);
    try {
      await rename(lockDir(root), quarantine);
    } catch {
      // Lost the quarantine race. Start over; the winner now holds it.
      continue;
    }
    await rm(quarantine, { recursive: true, force: true });
    reclaimedStale = true;
  }

  // Contention did not settle. Refusing is the safe answer — the alternative is proceeding without
  // knowing who owns the root.
  return { ok: false, reason: "ownership_state_corrupt" };
}

/**
 * Release, only if this process instance still holds it.
 *
 * Rename first, then remove the renamed copy. Removing the canonical path directly leaves a window
 * in which a new owner has already created it and this call deletes THEIR lock.
 */
export async function releaseLocalStoreRoot(root: string): Promise<boolean> {
  const existing = await readOwnerMarker(root);
  if (!existing || !isSelf(existing)) return false;

  const released = join(root, `.local-store-owner.release-${randomUUID()}`);
  try {
    await rename(lockDir(root), released);
  } catch {
    return false;
  }
  await rm(released, { recursive: true, force: true });
  return true;
}
