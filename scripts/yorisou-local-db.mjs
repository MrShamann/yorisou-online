#!/usr/bin/env node
// Guarded wrapper for every mutating YORISOU local-database operation.
//
// RAW `supabase db reset`, `psql -f`, `pg_restore` etc. MUST NOT be used against
// the local database: they connect to whatever owns the port. Use this wrapper —
// it runs scripts/verify-local-supabase-target.mjs before the first SQL write.
//
//   node scripts/yorisou-local-db.mjs bootstrap   # verify + install identity marker
//   node scripts/yorisou-local-db.mjs verify      # full verification
//   node scripts/yorisou-local-db.mjs migrate     # BLOCKED: refuses with
//                                                 # YORISOU_LOCAL_MIGRATION_STATE_RECONCILIATION_REQUIRED
//                                                 # until a governed reconciliation package lands
//   node scripts/yorisou-local-db.mjs reset       # DESTRUCTIVE — verify(full) + confirm
//   node scripts/yorisou-local-db.mjs e2e -- <cmd> # verify(full) then run <cmd>
//
// DB url: --url <url> or YORISOU_LOCAL_DB_URL. It must match the exact [db].port
// in supabase/config.toml; no fallback target is ever attempted.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { verify, verifyBootstrap, sectionPort } from "./verify-local-supabase-target.mjs";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const cmd = argv[0];

function dbUrl() {
  const i = argv.indexOf("--url");
  const fromArg = i >= 0 ? argv[i + 1] : null;
  const url = fromArg || process.env.YORISOU_LOCAL_DB_URL;
  if (url) return url;
  // Derive from the repo's own config — never a hardcoded shared default.
  const port = sectionPort(readFileSync(join(REPO, "supabase/config.toml"), "utf8"), "db");
  if (!port) die("cannot resolve [db].port from supabase/config.toml");
  return `postgresql://postgres:postgres@127.0.0.1:${port}/postgres`;
}
function die(m) { console.error(`[yorisou-local-db] ${m}`); process.exit(1); }
function psql(url, args) { return execFileSync("psql", [url, "-v", "ON_ERROR_STOP=1", ...args], { encoding: "utf8" }); }

const url = dbUrl();
try {
  if (cmd === "bootstrap") {
    const r = verifyBootstrap(url);
    console.log(`[yorisou-local-db] verified (bootstrap): ${r.project} @ ${r.container}`);
    psql(url, ["-q", "-f", join(REPO, "supabase/local-identity-bootstrap.sql")]);
    console.log("[yorisou-local-db] identity marker installed");
  } else if (cmd === "verify") {
    const r = verify(url);
    console.log(`[yorisou-local-db] verified (full): ${r.project} @ ${r.container} (port ${r.port})`);
  } else if (cmd === "migrate") {
    // Intentionally BLOCKED. The local database is preserved at its actual
    // historical state and was never fully migrated; supabase_migrations
    // history has not been reconciled. Replaying supabase/migrations with raw
    // psql would bypass migration history, re-run non-idempotent DDL, and could
    // silently upgrade the schema. The guard still verifies the target
    // (read-only) so a wrong-project invocation is reported as such, then the
    // command refuses without attempting any SQL write.
    const r = verify(url);
    console.log(`[yorisou-local-db] verified: ${r.project} @ ${r.container}`);
    die(
      "REFUSED: YORISOU_LOCAL_MIGRATION_STATE_RECONCILIATION_REQUIRED — local " +
      "migrations may not run until a separate governed package reconciles " +
      "supabase_migrations.schema_migrations with the actual applied state and " +
      "re-enables a migration-aware runner. Raw psql replay of " +
      "supabase/migrations is prohibited.",
    );
  } else if (cmd === "reset") {
    const r = verify(url);
    if (!argv.includes("--yes-destroy-local-data")) {
      die(`REFUSED: reset is DESTRUCTIVE and would drop local ${r.project} data. Re-run with --yes-destroy-local-data if that is intended.`);
    }
    console.log(`[yorisou-local-db] verified: ${r.project} @ ${r.container} — destructive reset acknowledged`);
    execFileSync("supabase", ["db", "reset"], { cwd: REPO, stdio: "inherit" });
  } else if (cmd === "e2e") {
    const r = verify(url);
    console.log(`[yorisou-local-db] verified: ${r.project} @ ${r.container}`);
    const sep = argv.indexOf("--");
    if (sep === -1) die("usage: e2e -- <command> [args...]");
    const [bin, ...rest] = argv.slice(sep + 1);
    execFileSync(bin, rest, { cwd: REPO, stdio: "inherit", env: { ...process.env, YORISOU_LOCAL_DB_URL: url } });
  } else {
    die(`unknown command "${cmd ?? ""}". Use: bootstrap | verify | migrate | reset | e2e`);
  }
} catch (e) {
  console.error(`[yorisou-local-db] REFUSED/FAILED: ${e.message}`);
  for (const [k, v] of Object.entries(e.observed ?? {})) console.error(`  ${k}: ${v}`);
  process.exit(1);
}
