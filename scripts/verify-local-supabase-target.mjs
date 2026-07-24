#!/usr/bin/env node
// YORISOU local Supabase target-verification guard (cross-project isolation).
//
// WHY: on 2026-07-24 another project's migrations were applied to THIS project's
// local database, because both projects defaulted to the shared Supabase ports
// (54321/54322) and tooling connected to whatever process owned the port.
// Every local migration / reset / restore / seed / DB-E2E command MUST call this
// guard before its first SQL write.
//
// TWO-STAGE MODEL
//   --bootstrap : every identity check EXCEPT the DB marker. This is the ONLY
//                 mode permitted to create the marker (closes the
//                 connect-then-verify window).
//   (default)   : bootstrap checks PLUS yorisou_local_project_identity.
//
// Usage:
//   node scripts/verify-local-supabase-target.mjs "<db-url>" [--bootstrap]
// exit 0 = verified YORISOU target; non-zero = refuse. Credentials never printed.

import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
export const EXPECTED_PROJECT = "yorisou-online";
// Other local projects whose databases must never be targeted from this repo.
const FORBIDDEN = ["mirai", "kakari"];
// YORISOU's dedicated range (mirai-move owns 5532x/5533x; 5432x defaults unused).
const PORT_MIN = 55340;
const PORT_MAX = 55359;
const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);
const EXPECTED_DB = "postgres";
const EXPECTED_USER = "postgres";

class Refusal extends Error {
  constructor(msg, observed) { super(msg); this.observed = observed ?? {}; }
}
function refuse(msg, observed) { throw new Refusal(msg, observed); }

/** Parse `port` from a specific [section] — never accepts an unrelated section's port. */
export function sectionPort(tomlText, section) {
  let inSection = false;
  for (const line of tomlText.split("\n")) {
    const t = line.trim();
    if (/^\[[^\]]+\]/.test(t)) { inSection = t === `[${section}]`; continue; }
    if (!inSection) continue;
    const m = t.match(/^port\s*=\s*(\d+)/);
    if (m) return Number(m[1]);
  }
  return null;
}

/** All identity checks that do NOT require the DB marker. */
export function verifyBootstrap(dbUrl, opts = {}) {
  const repo = opts.repo ?? REPO;

  // 1. repository identity
  const manifest = join(repo, "PROJECT_MANIFEST.yaml");
  const manifestId = existsSync(manifest)
    ? (readFileSync(manifest, "utf8").match(/^\s*project_id:\s*([a-z0-9-]+)/m) || [])[1]
    : null;
  if (manifestId !== EXPECTED_PROJECT) refuse("repository is not yorisou-online", { PROJECT_MANIFEST_project_id: manifestId });

  // 2. supabase config identity
  const cfgPath = join(repo, "supabase/config.toml");
  if (!existsSync(cfgPath)) refuse("supabase/config.toml missing — local identity is not pinned", { cfgPath });
  const toml = readFileSync(cfgPath, "utf8");
  const cfgId = (toml.match(/^\s*project_id\s*=\s*"([^"]+)"/m) || [])[1] ?? null;
  if (cfgId !== EXPECTED_PROJECT) refuse("supabase config project_id is not yorisou-online", { config_project_id: cfgId });

  // 3. URL shape — local only, expected db/user; credentials never printed
  let url;
  try { url = new URL(dbUrl); } catch { refuse("db url is not parseable", {}); }
  if (!LOCAL_HOSTS.has(url.hostname)) refuse("db host is not local", { host: url.hostname });
  const dbName = url.pathname.replace(/^\//, "");
  if (dbName !== EXPECTED_DB) refuse("unexpected database name", { database: dbName });
  if (url.username && url.username !== EXPECTED_USER) refuse("unexpected database user", { user: url.username });

  // 4. port must equal the EXACT [db].port and sit in YORISOU's dedicated range
  const port = Number(url.port);
  const dbPort = sectionPort(toml, "db");
  if (dbPort === null) refuse("config.toml has no [db].port", {});
  if (port !== dbPort) refuse("db port does not equal the exact [db].port in config", { url_port: port, config_db_port: dbPort });
  if (!(port >= PORT_MIN && port <= PORT_MAX)) refuse(`db port ${port} is outside YORISOU's dedicated range ${PORT_MIN}-${PORT_MAX}`, { port });

  // 5. exactly ONE container may publish the port (fail closed on ambiguity)
  let names = [];
  try {
    names = execFileSync("docker", ["ps", "--filter", `publish=${port}`, "--format", "{{.Names}}"], { encoding: "utf8" })
      .split("\n").map((s) => s.trim()).filter(Boolean);
  } catch { refuse("could not query docker", { port }); }
  if (names.length === 0) refuse(`no running container publishes port ${port}`, { port });
  if (names.length > 1) refuse("more than one container publishes the target port — ambiguous", { port, containers: names.join(",") });
  const container = names[0];

  // 6. other projects denied outright
  for (const bad of FORBIDDEN) {
    if (container.toLowerCase().includes(bad)) refuse(`target container belongs to a FORBIDDEN project (${bad})`, { container, port });
  }

  // 7. container identity via Supabase CLI label where available, else name
  let label = "";
  try {
    label = execFileSync("docker", ["inspect", container, "--format", "{{ index .Config.Labels \"com.supabase.cli.project\" }}"], { encoding: "utf8" }).trim();
  } catch { label = ""; }
  if (label && label !== "<no value>") {
    if (label !== EXPECTED_PROJECT) refuse("container label identifies a different project", { container, label });
  } else if (!container.toLowerCase().includes("yorisou")) {
    refuse("container is not identifiably YORISOU's", { container, port });
  }

  return { ok: true, stage: "bootstrap", project: EXPECTED_PROJECT, container, port };
}

/** Full verification: bootstrap + the local project identity marker. */
export function verify(dbUrl, opts = {}) {
  const base = verifyBootstrap(dbUrl, opts);
  let marker = "";
  try {
    marker = execFileSync("psql", [dbUrl, "-tAc", "select project from public.yorisou_local_project_identity limit 1"], { encoding: "utf8" }).trim();
  } catch {
    refuse("db did not respond or has no yorisou_local_project_identity marker (run --bootstrap first)", { container: base.container, port: base.port });
  }
  if (marker !== EXPECTED_PROJECT) refuse("db identity marker is not yorisou-online", { observed_project: marker, container: base.container, port: base.port });
  return { ...base, stage: "full" };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dbUrl = process.argv[2];
  const bootstrapOnly = process.argv.includes("--bootstrap");
  try {
    if (!dbUrl) refuse("no db url provided", {});
    const r = bootstrapOnly ? verifyBootstrap(dbUrl) : verify(dbUrl);
    console.log(`[yorisou verify-local-supabase-target] OK (${r.stage}): ${r.project} @ ${r.container} (port ${r.port})`);
  } catch (e) {
    console.error(`[yorisou verify-local-supabase-target] REFUSED: ${e.message}`);
    for (const [k, v] of Object.entries(e.observed ?? {})) console.error(`  ${k}: ${v}`);
    process.exit(1);
  }
}
