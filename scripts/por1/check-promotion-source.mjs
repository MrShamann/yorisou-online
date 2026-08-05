// POR-1 — does the FROZEN source still regenerate the promotion set, byte for byte?
//
// WHY THIS EXISTS.
//
// 101…108 were compiled from a LIVE Preview catalogue. That was defensible while Preview was only
// ever the upstream of Production. It stopped being defensible when Preview received 202608050002 —
// a runtime-only overlay giving it the post-P111 erasure authority so the deployed application can
// run there. Live Preview became a RUNTIME TARGET. The compiler worked this out on its own and began
// refusing a live-Preview catalogue, which was the correct behaviour and the wrong thing to relax.
//
// Replay is not the alternative: the checked-in Preview lineage is not linearly replayable
// (202607270002 is a compensating rollback whose tables 202607270003 then alters, and 202607280004
// collides with the baseline recommendation_graph shape). So the source is FROZEN and committed, and
// its authority rests on something stronger than provenance narrative — mechanical regeneration.
//
// This gate needs no network, no database and no secret. That is the point: the question "is the
// promotion set still what its source produces" should be answerable on a laptop with the wifi off.
//
//   node scripts/por1/check-promotion-source.mjs
//
// Read-only. Compiles into a temporary directory and compares; never writes into supabase/.

import { readFileSync, mkdtempSync, mkdirSync, rmSync, existsSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const args = process.argv.slice(2);
const arg = (n) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : undefined;
};
// Explicit overrides stay supported so the negative controls can point the SHIPPED gate at a
// corrupted copy. Nothing is read from the environment: an environment-dependent gate is how a
// "reproducible" check quietly becomes a machine-specific one.
const MANIFEST_PATH =
  arg("--manifest") ?? "supabase/contracts/sources/por1-promotion-source-manifest.json";

const failures = [];
const fail = (m) => failures.push(m);
const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");
const readAbs = (rel) => readFileSync(join(ROOT, rel));

if (!existsSync(join(ROOT, MANIFEST_PATH))) {
  console.error(`FAIL manifest missing: ${MANIFEST_PATH}`);
  process.exit(1);
}
const manifest = JSON.parse(readAbs(MANIFEST_PATH).toString("utf8"));

// ── 1. the committed sources are what the manifest says they are ────────────

for (const side of ["preview", "production"]) {
  const spec = manifest[side];
  if (!spec?.path) { fail(`manifest.${side}.path is missing`); continue; }
  if (!existsSync(join(ROOT, spec.path))) { fail(`${side} source missing: ${spec.path}`); continue; }

  const raw = readAbs(spec.path);
  const actual = sha256(raw);
  if (actual !== spec.sha256) {
    fail(`${spec.path}: sha256 ${actual.slice(0, 12)}… ≠ manifest ${String(spec.sha256).slice(0, 12)}…`);
  }

  const text = raw.toString("utf8");
  // Deterministic form, checked explicitly: a catalogue that re-serialises differently on another
  // machine would make this gate fail for a reason unrelated to the schema.
  //
  // The canonical form is the EXTRACTOR'S OWN — 2-space JSON in the order its explicitly-ordered
  // queries produce. Deliberately not re-sorted: the compiler copies these objects into the promotion
  // contract, so reordering their keys changes the contract's bytes and breaks the very byte-identity
  // this gate exists to prove. (Observed, then corrected.)
  if (!text.endsWith("\n") || text.endsWith("\n\n")) fail(`${spec.path}: must end with exactly one newline`);
  let parsed;
  try { parsed = JSON.parse(text); } catch { fail(`${spec.path}: not valid JSON`); continue; }
  if (JSON.stringify(parsed, null, 2) + "\n" !== text) {
    fail(`${spec.path}: not in the extractor's deterministic 2-space form`);
  }

  for (const [kind, expected] of Object.entries(spec.objectCounts ?? {})) {
    const got = Array.isArray(parsed[kind]) ? parsed[kind].length : -1;
    if (got !== expected) fail(`${spec.path}: ${kind} count ${got} ≠ manifest ${expected}`);
  }
}

if (failures.length === 0) {
  // ── 2. the SHIPPED compiler, over the frozen inputs, into a throwaway directory ──
  const out = mkdtempSync(join(tmpdir(), "por1-promotion-source-"));
  try {
    // The compiler writes its contract to a path relative to process.cwd(). Running it at the
    // repository root would make this read-only gate overwrite a checked-in file, so it runs in the
    // temp directory — which therefore needs that path to exist.
    // Both the contract AND the emitted migration paths are recorded relative to cwd, so the
    // compiler runs with the DEFAULT --out-dir inside the temp directory. Passing an absolute
    // --out-dir instead writes that absolute path into the contract's `migrations[].path`, which
    // differs from the checked-in contract for a reason that is not drift. (Observed, then corrected.)
    mkdirSync(join(out, dirname(manifest.compiler.expectedContractPath)), { recursive: true });
    mkdirSync(join(out, "supabase", "migrations"), { recursive: true });
    const result = spawnSync(
      process.execPath,
      [
        join(ROOT, manifest.compiler.path),
        "--preview", join(ROOT, manifest.preview.path),
        "--production", join(ROOT, manifest.production.path),
      ],
      // cwd is the temp dir because the compiler writes its contract relative to process.cwd();
      // running it at the repository root would have this read-only gate overwrite a checked-in file.
      { cwd: out, encoding: "utf8" },
    );

    if (result.status !== 0) {
      fail(`compiler refused the frozen source (exit ${result.status})`);
      for (const line of (result.stderr ?? "").split("\n").filter(Boolean).slice(0, 6)) fail(`  compiler: ${line}`);
    } else {
      // ── 3. byte identity, per migration ──
      const emittedDir = join(out, "supabase", "migrations");
      const emitted = new Map(
        readdirSync(emittedDir).filter((f) => f.endsWith(".sql")).map((f) => [f.split("_")[0], f]),
      );
      for (const [version, expectedDigest] of Object.entries(manifest.compiler.expectedMigrationDigests)) {
        const name = emitted.get(version);
        if (!name) { fail(`compiler did not emit ${version}`); continue; }
        const generated = sha256(readFileSync(join(emittedDir, name)));
        const checkedIn = existsSync(join(ROOT, "supabase/migrations", name))
          ? sha256(readAbs(join("supabase/migrations", name)))
          : null;
        if (checkedIn === null) { fail(`${name}: not checked in`); continue; }
        if (checkedIn !== expectedDigest) fail(`${name}: checked-in file ≠ manifest digest`);
        if (generated !== checkedIn) fail(`${name}: REGENERATED BYTES DIFFER from the checked-in migration`);
      }

      // Anything emitted that the manifest does not name would mean the source produces more than
      // the promotion set it is supposed to.
      for (const version of emitted.keys()) {
        if (!(version in manifest.compiler.expectedMigrationDigests)) {
          fail(`compiler emitted ${version}, which is not part of the frozen source's output`);
        }
      }

      // ── 4. and the contract the compiler writes ──
      const contractOut = join(out, manifest.compiler.expectedContractPath);
      if (!existsSync(contractOut)) {
        fail(`compiler did not write ${manifest.compiler.expectedContractPath}`);
      } else {
        const generated = sha256(readFileSync(contractOut));
        const checkedIn = sha256(readAbs(manifest.compiler.expectedContractPath));
        if (checkedIn !== manifest.compiler.expectedContractSha256) {
          fail(`${manifest.compiler.expectedContractPath}: checked-in file ≠ manifest digest`);
        }
        if (generated !== checkedIn) {
          fail(`${manifest.compiler.expectedContractPath}: REGENERATED BYTES DIFFER from the checked-in contract`);
        }
      }
    }
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
}

// ── 5. the overlays stay outside this source ────────────────────────────────

for (const version of manifest.outsideThisSource?.migrations ?? []) {
  if (version in (manifest.compiler.expectedMigrationDigests ?? {})) {
    fail(`${version} is a hand-written overlay and must not be an output of the frozen source`);
  }
}
if (manifest.outsideThisSource?.contract === manifest.compiler?.expectedContractPath) {
  fail("the final promoted contract is not an output of this compiler source");
}

console.log(JSON.stringify({
  mode: "promotion-source-check",
  manifest: MANIFEST_PATH,
  sourceKind: manifest.sourceKind,
  migrations: Object.keys(manifest.compiler?.expectedMigrationDigests ?? {}).length,
  failures: failures.length,
}, null, 2));
for (const f of failures) console.error(`  FAIL ${f}`);
if (failures.length > 0) process.exit(1);
console.log("\nthe frozen source still regenerates the promotion set, byte for byte");
