// POR-1 — ownership enforcement through the REAL ADAPTER, not through the helper.
//
// WHY THIS EXISTS SEPARATELY FROM THE OWNERSHIP UNIT SUITE.
//
// The first version of the ownership work shipped a helper with a passing test suite and no caller.
// A repository search for `acquireLocalStoreRoot` outside its own module and test returned nothing:
// it enforced no boundary at all, because no runtime path invoked it. Unit tests of a helper can
// never catch that — they exercise the helper directly, which is precisely the thing that was not
// happening in production code.
//
// So these tests do not import the ownership module. They call `createSession`, a real adapter
// mutator, in real child processes, and assert on what the filesystem and the second process
// actually observe. If someone removes the `ensureLocalStoreAuthority()` call from
// `mutateLocalJson`, every unit test still passes and THESE fail.

import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const LOCK = ".local-store-owner.lock";

/** A tiny program that performs ONE real adapter mutation and reports what it saw. */
const MUTATOR = `
import { createSession } from "../lib/server/yorisouData";
import { existsSync } from "node:fs";
async function main() {
  const root = process.env.YORISOU_DATA_DIR!;
  try {
    await createSession(null, null);
  } catch (error) {
    console.log("REFUSED:" + (error as Error).message);
    return;
  }
  console.log("MUTATED:" + existsSync(root + "/${LOCK}"));
  if (process.env.HOLD === "1") await new Promise((r) => setTimeout(r, 12_000));
}
main().catch((e) => console.log("ERR:" + e.message));
`;

function scratch(t: { after: (fn: () => void) => void }) {
  const dir = mkdtempSync(join(tmpdir(), "por1-adapter-own-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

/** The mutator has to live inside the repo so its relative import and tsx resolution work. */
function mutatorScript(t: { after: (fn: () => void) => void }) {
  const dir = join(REPO, `.por1-adapter-test-${process.pid}-${Math.random().toString(36).slice(2, 8)}`);
  mkdirSync(dir, { recursive: true });
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const file = join(dir, "mutate.ts");
  writeFileSync(file, MUTATOR, "utf8");
  return file;
}

const runMutator = (script: string, root: string) =>
  execFileSync(process.execPath, ["--conditions=react-server", "--import", "tsx", script], {
    env: { ...process.env, YORISOU_DATA_DIR: root, HOLD: "0" },
    encoding: "utf8",
    cwd: REPO,
  }).trim();

test("a REAL adapter mutation acquires the store root", { timeout: 180_000 }, (t) => {
  const root = join(scratch(t), "store");
  const out = runMutator(mutatorScript(t), root);

  assert.match(out, /^MUTATED:true$/m, `expected the mutation to succeed and create the lock; got: ${out}`);

  const owner = JSON.parse(readFileSync(join(root, LOCK, "owner.json"), "utf8")) as Record<string, unknown>;
  assert.deepEqual(
    Object.keys(owner).sort(),
    ["label", "nonce", "pid", "schema", "startedAt"],
    "the owner file must carry no secret and no user data",
  );
});

test("A SECOND LIVE PROCESS IS REFUSED — the boundary this whole subsystem exists for", { timeout: 300_000 }, async (t) => {
  const root = join(scratch(t), "store");
  const script = mutatorScript(t);

  // Hold the root with a live process performing a real mutation.
  const holder = spawn(process.execPath, ["--conditions=react-server", "--import", "tsx", script], {
    env: { ...process.env, YORISOU_DATA_DIR: root, HOLD: "1" },
    cwd: REPO,
    stdio: ["ignore", "pipe", "ignore"],
  });
  t.after(() => holder.kill());

  const held = await new Promise<boolean>((resolve) => {
    let buf = "";
    const timer = setTimeout(() => resolve(false), 120_000);
    holder.stdout.on("data", (chunk) => {
      buf += String(chunk);
      if (buf.includes("MUTATED:true")) {
        clearTimeout(timer);
        resolve(true);
      }
    });
  });
  assert.equal(held, true, "the holder must own the root before the contender runs");

  const second = runMutator(script, root);
  assert.match(
    second,
    /^REFUSED:local_store_not_owned:held_by_live_process$/m,
    `a second live process must be refused, not allowed to write; got: ${second}`,
  );
});

test("a second process against a DIFFERENT root succeeds", { timeout: 180_000 }, (t) => {
  const script = mutatorScript(t);
  assert.match(runMutator(script, join(scratch(t), "a")), /^MUTATED:true$/m);
  assert.match(runMutator(script, join(scratch(t), "b")), /^MUTATED:true$/m);
});

test("once the owner exits, the root is reclaimable by the next process", { timeout: 180_000 }, (t) => {
  // Sequential ownership is the normal case — a dev server restarting, a harness re-running. It must
  // not require manual cleanup.
  const root = join(scratch(t), "store");
  const script = mutatorScript(t);
  assert.match(runMutator(script, root), /^MUTATED:true$/m);
  assert.match(runMutator(script, root), /^MUTATED:true$/m, "the next process reclaims the stale root");
});

test("the lock can never be committed — data/ is tracked, and this is the store root", () => {
  // `data/` holds ten TRACKED fixture files and is also where dataDir resolves for local runs, so
  // without a gitignore rule the lock lands in version control. A committed lock names a pid and
  // nonce from another machine, and `processIsAlive` would very likely say that pid is alive —
  // classifying the root as held and failing every local mutation closed on every fresh clone.
  const ignored = execFileSync("git", ["check-ignore", "-v", `data/${LOCK}/owner.json`], {
    cwd: REPO,
    encoding: "utf8",
  });
  assert.match(ignored, /\.gitignore/, "the lock path must be matched by a .gitignore rule");
  assert.equal(existsSync(join(REPO, "data", LOCK)), false, "no lock may be left behind in the repo store root");
});
