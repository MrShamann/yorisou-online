// Migration-scope guard — fails CI when the repository migration lineage is inconsistent.
//
// Root cause it prevents: a migration explicitly marked "LOCAL Supabase verification only — never
// production" living under supabase/migrations/, which makes `supabase migration list` /
// `db push --dry-run` against Production perpetually report it as a pending Production migration.
//
// Source of truth: supabase/MIGRATION_SCOPE_MANIFEST.md (single fenced ```json block).
// Every migration must be classified PRODUCTION_LINEAGE | LOCAL_ONLY | PREVIEW_ONLY.
//
// Enforced invariants:
//   1. Every .sql on disk (in any migration dir) is classified in the manifest (no unclassified file).
//   2. Every manifest entry exists on disk (no missing file).
//   3. Manifest sha256 matches the file bytes (no silent drift of an immutable migration).
//   4. PRODUCTION_LINEAGE files live ONLY under supabase/migrations/.
//   5. LOCAL_ONLY files live under supabase/local-only-migrations/; PREVIEW_ONLY under
//      supabase/preview-only-migrations/. Neither may sit under supabase/migrations/.
//   6. No file under supabase/migrations/ contains a strong local-only marker phrase.
//   7. No duplicate version timestamps across all migration directories.
//   8. Manifest path matches the file's real location; filename version prefix is parseable.
//
// Read-only. No database access. Exit 0 on success, 1 on any violation.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const ROOT = process.cwd();
const PROD_DIR = "supabase/migrations";
const LOCAL_DIR = "supabase/local-only-migrations";
const PREVIEW_DIR = "supabase/preview-only-migrations";
const MANIFEST = "supabase/MIGRATION_SCOPE_MANIFEST.md";

// Strong, unambiguous local-only declarations only. Deliberately precise: phrases like "disposable
// local databases only" appear in the ROLLBACK-CLASSIFICATION note of genuine Production migrations
// (DCI 202607200005 / YV 202607210001) and must NOT trip the guard. The authoritative scope guarantee
// is the manifest scope↔directory check; this content scan is a secondary net for new files.
const LOCAL_ONLY_MARKERS = [
  /never production/i,
  /LOCAL Supabase verification only/i,
  /no production migration is authorized/i,
  /not approved for any persistent environment/i,
];

const DIR_FOR_SCOPE = {
  PRODUCTION_LINEAGE: PROD_DIR,
  LOCAL_ONLY: LOCAL_DIR,
  PREVIEW_ONLY: PREVIEW_DIR,
};

const failures = [];
const fail = (msg) => failures.push(msg);

function sqlFilesUnder(rel) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) return [];
  const out = [];
  for (const entry of readdirSync(abs, { withFileTypes: true })) {
    if (entry.isDirectory()) out.push(...sqlFilesUnder(join(rel, entry.name)));
    else if (entry.name.endsWith(".sql")) out.push(join(rel, entry.name).split("\\").join("/"));
  }
  return out;
}

function sha256(rel) {
  return createHash("sha256").update(readFileSync(join(ROOT, rel))).digest("hex");
}

// 1. Parse the manifest's json block.
const manifestRaw = readFileSync(join(ROOT, MANIFEST), "utf8");
const block = /```json\s*\n([\s\S]*?)\n```/.exec(manifestRaw);
if (!block) { console.error(`FAIL: ${MANIFEST} has no machine-readable \`\`\`json block`); process.exit(1); }
let entries;
try { entries = JSON.parse(block[1]); } catch (e) { console.error(`FAIL: manifest json is invalid: ${e.message}`); process.exit(1); }
if (!Array.isArray(entries) || entries.length === 0) { console.error("FAIL: manifest json must be a non-empty array"); process.exit(1); }

const byPath = new Map();
const seenVersion = new Map();
for (const e of entries) {
  for (const k of ["version", "name", "scope", "path", "sha256"]) {
    if (!e[k]) fail(`manifest entry missing "${k}": ${JSON.stringify(e)}`);
  }
  if (!DIR_FOR_SCOPE[e.scope]) fail(`manifest entry ${e.version}: unknown scope "${e.scope}"`);
  if (byPath.has(e.path)) fail(`manifest lists path twice: ${e.path}`);
  byPath.set(e.path, e);
  if (seenVersion.has(e.version)) fail(`duplicate version timestamp in manifest: ${e.version} (${seenVersion.get(e.version)} + ${e.path})`);
  seenVersion.set(e.version, e.path);
}

// 2. Enumerate every migration .sql on disk across all migration dirs.
const onDisk = [...new Set([...sqlFilesUnder(PROD_DIR), ...sqlFilesUnder(LOCAL_DIR), ...sqlFilesUnder(PREVIEW_DIR)])];

// 3. Every file on disk is classified; sha256 matches; location matches scope.
const diskVersions = new Map();
for (const rel of onDisk) {
  const base = rel.split("/").pop();
  const vmatch = /^(\d{12,14})_/.exec(base);
  if (!vmatch) { fail(`unparseable version prefix: ${rel}`); continue; }
  const version = vmatch[1];
  if (diskVersions.has(version)) fail(`duplicate version timestamp on disk: ${version} (${diskVersions.get(version)} + ${rel})`);
  diskVersions.set(version, rel);

  const entry = byPath.get(rel);
  if (!entry) { fail(`unclassified migration on disk (not in manifest): ${rel}`); continue; }

  const actual = sha256(rel);
  if (actual !== entry.sha256) fail(`sha256 drift for ${rel}: manifest=${entry.sha256.slice(0, 12)}… actual=${actual.slice(0, 12)}…`);

  const expectedDir = DIR_FOR_SCOPE[entry.scope];
  if (!rel.startsWith(`${expectedDir}/`)) fail(`${rel} is scope ${entry.scope} but not under ${expectedDir}/`);

  // 5b. LOCAL_ONLY / PREVIEW_ONLY must never sit under the Production directory.
  if (entry.scope !== "PRODUCTION_LINEAGE" && rel.startsWith(`${PROD_DIR}/`)) {
    fail(`${rel} is ${entry.scope} but lives in the Production migration directory ${PROD_DIR}/`);
  }

  // 6. Content marker check for anything under the Production directory.
  if (rel.startsWith(`${PROD_DIR}/`)) {
    const sql = readFileSync(join(ROOT, rel), "utf8");
    for (const marker of LOCAL_ONLY_MARKERS) {
      if (marker.test(sql)) fail(`${rel} is under ${PROD_DIR}/ but declares a local-only marker (${marker}); reclassify as LOCAL_ONLY and move it out`);
    }
  }
}

// 4/2b. Every manifest entry must exist on disk at its declared path.
for (const e of entries) {
  if (!existsSync(join(ROOT, e.path))) fail(`manifest entry ${e.version} points at a missing file: ${e.path}`);
}

// Report.
if (failures.length) {
  console.error("Migration-scope guard FAILED:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

const counts = entries.reduce((a, e) => ((a[e.scope] = (a[e.scope] || 0) + 1), a), {});
console.log(JSON.stringify({
  status: "ok",
  migrations: entries.length,
  onDisk: onDisk.length,
  byScope: counts,
  productionRepairCohort: entries.filter((e) => e.repair_cohort).map((e) => e.version),
}));
