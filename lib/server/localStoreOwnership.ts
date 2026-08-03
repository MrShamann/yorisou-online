// POR-1 — the local JSON store is single-process, and this makes that enforceable.
//
// WHY IT NEEDS ENFORCING RATHER THAN DOCUMENTING.
//
// The lost-update repair serializes read-modify-write through one in-process promise chain per file
// path. That is correct and sufficient for the adapter's actual support boundary — a single local or
// test application process — and it is worth nothing across two processes. Two servers pointed at
// one store root would each serialize perfectly against themselves and lose each other's writes
// exactly as before the repair, while every test still passed.
//
// So the unsupported configuration must not merely be undocumented-and-discouraged. It must be
// detected, because it looks identical to the supported one right up until data disappears.
//
// WHAT THIS IS NOT: a distributed lock. It is a single marker file naming the owning process, with
// stale-owner recovery. It protects against accidental concurrent use on one machine, which is the
// failure that actually happens — a forgotten dev server, a harness that did not tear down, two
// suites sharing a root.

import { randomUUID } from "node:crypto";
import { readFile, writeFile, rename, unlink, mkdir } from "node:fs/promises";
import { join } from "node:path";

const MARKER = ".local-store-owner.json";

export type OwnerMarker = {
  pid: number;
  /**
   * A per-start nonce.
   *
   * PIDs are reused. A marker naming a live PID that happens to be a different program is
   * indistinguishable from a live owner by PID alone, and treating it as live would wedge the store
   * until someone deleted the file by hand.
   */
  nonce: string;
  startedAt: string;
  /** For a human reading the file. Never a secret, never user data. */
  label: string;
};

export type OwnershipResult =
  | { ok: true; marker: OwnerMarker; reclaimedStale: boolean }
  | { ok: false; reason: "held_by_live_process"; holder: { pid: number; startedAt: string } };

/** The identity of THIS process. Stable for the lifetime of the module. */
const selfNonce = randomUUID();

function markerPath(root: string) {
  return join(root, MARKER);
}

/**
 * Is the process named by this marker still alive?
 *
 * `kill(pid, 0)` answers "does a process with this id exist and may I signal it", which is the best
 * a single machine offers without a supervisor. It cannot distinguish a reused PID — that is what
 * the nonce is for on the owning side, and why a caller may pass `assumeStale` after its own
 * out-of-band check.
 */
export function processIsAlive(pid: number): boolean {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    // EPERM means it exists but belongs to someone else — still alive.
    return (error as NodeJS.ErrnoException).code === "EPERM";
  }
}

export function isSelf(marker: OwnerMarker): boolean {
  return marker.pid === process.pid && marker.nonce === selfNonce;
}

/**
 * Decide what to do about an existing marker. Pure, so the rule is testable without spawning.
 */
export function classifyExistingOwner(
  marker: OwnerMarker | null,
  alive: (pid: number) => boolean,
): "free" | "self" | "stale" | "held" {
  if (!marker) return "free";
  if (isSelf(marker)) return "self";
  return alive(marker.pid) ? "held" : "stale";
}

/**
 * Claim the store root for this process.
 *
 * Written to a unique temp file and renamed, for the same reason every other store write is: a
 * reader must never see half a marker and conclude the store is free.
 */
export async function acquireLocalStoreRoot(
  root: string,
  options: { label?: string; alive?: (pid: number) => boolean } = {},
): Promise<OwnershipResult> {
  const alive = options.alive ?? processIsAlive;
  await mkdir(root, { recursive: true });

  const existing = await readOwnerMarker(root);
  const state = classifyExistingOwner(existing, alive);

  if (state === "held") {
    return {
      ok: false,
      reason: "held_by_live_process",
      holder: { pid: existing!.pid, startedAt: existing!.startedAt },
    };
  }

  const marker: OwnerMarker = {
    pid: process.pid,
    nonce: selfNonce,
    startedAt: new Date().toISOString(),
    label: options.label ?? "yorisou-local-store",
  };
  const temp = `${markerPath(root)}.tmp-${process.pid}-${randomUUID()}`;
  await writeFile(temp, `${JSON.stringify(marker, null, 2)}\n`, "utf8");
  await rename(temp, markerPath(root));

  return { ok: true, marker, reclaimedStale: state === "stale" };
}

export async function readOwnerMarker(root: string): Promise<OwnerMarker | null> {
  try {
    const parsed = JSON.parse(await readFile(markerPath(root), "utf8")) as Partial<OwnerMarker>;
    if (typeof parsed.pid !== "number" || typeof parsed.nonce !== "string") return null;
    return {
      pid: parsed.pid,
      nonce: parsed.nonce,
      startedAt: typeof parsed.startedAt === "string" ? parsed.startedAt : "",
      label: typeof parsed.label === "string" ? parsed.label : "",
    };
  } catch {
    // Absent or unreadable. A malformed marker is treated as free rather than as a permanent lock:
    // the marker is a safety net, and one that can wedge a developer's store forever is a worse
    // problem than the one it prevents.
    return null;
  }
}

/** Release only if this process still holds it — never steal a marker written by someone else. */
export async function releaseLocalStoreRoot(root: string): Promise<boolean> {
  const existing = await readOwnerMarker(root);
  if (!existing || !isSelf(existing)) return false;
  try {
    await unlink(markerPath(root));
    return true;
  } catch {
    return false;
  }
}
