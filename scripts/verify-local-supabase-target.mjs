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

  // 3. URL shape — local only, expected db/user; credentials never printed.
  // The database user must be PRESENT and exactly the expected local user: a
  // missing username is refused (it would silently bind to whatever identity
  // the server default resolves to, which is not proof of the intended target).
  let url;
  try { url = new URL(dbUrl); } catch { refuse("db url is not parseable", {}); }
  if (!LOCAL_HOSTS.has(url.hostname)) refuse("db host is not local", { host: url.hostname });
  const dbName = url.pathname.replace(/^\//, "");
  if (dbName !== EXPECTED_DB) refuse("unexpected database name", { database: dbName });
  if (url.username !== EXPECTED_USER) {
    refuse("database user missing or unexpected", { user: url.username || "(missing)" });
  }

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

// Deterministic marker query: row count + the DISTINCT project values + the
// table shape, in one aggregate. Never an unordered LIMIT 1 (which is
// nondeterministic when more than one row exists and so proves nothing).
export const MARKER_QUERY =
  "select (select count(*) from public.yorisou_local_project_identity)::text" +
  " || '|' || coalesce((select string_agg(distinct project, ',' order by project) from public.yorisou_local_project_identity), '')" +
  " || '|' || (select case when exists (select 1 from information_schema.columns" +
  " where table_schema='public' and table_name='yorisou_local_project_identity' and column_name='singleton')" +
  " then 'singleton' else 'legacy' end)";

/**
 * Pure singleton assessment of the marker query result "<count>|<projects>|<shape>".
 * Requires EXACTLY one row whose project is EXACTLY yorisou-online. A correct
 * row in the legacy (pre-singleton) table shape passes content verification but
 * is flagged as requiring the guarded post-merge conversion.
 */
export function assessMarker(observed) {
  const parts = String(observed ?? "").trim().split("|");
  if (parts.length !== 3) return { ok: false, reason: "marker query returned an unreadable result" };
  const [countStr, projects, shape] = parts;
  const count = Number(countStr);
  if (!Number.isInteger(count) || count < 0) return { ok: false, reason: "marker query returned an unreadable count" };
  if (count === 0) return { ok: false, reason: "no identity marker row exists (run --bootstrap first)" };
  if (count > 1) return { ok: false, reason: `identity marker is not a singleton (${count} rows) — forensic remediation required` };
  if (projects !== EXPECTED_PROJECT) return { ok: false, reason: "identity marker does not identify yorisou-online", observed_project: projects };
  return { ok: true, legacyShapeRequiresConversion: shape === "legacy" };
}

/** Full verification: bootstrap + the singleton local project identity marker. */
export function verify(dbUrl, opts = {}) {
  const base = verifyBootstrap(dbUrl, opts);
  let observed = "";
  try {
    observed = execFileSync("psql", [dbUrl, "-tAc", MARKER_QUERY], { encoding: "utf8" }).trim();
  } catch {
    refuse("db did not respond or has no yorisou_local_project_identity marker (run --bootstrap first)", { container: base.container, port: base.port });
  }
  const marker = assessMarker(observed);
  if (!marker.ok) {
    refuse(marker.reason, { ...(marker.observed_project ? { observed_project: marker.observed_project } : {}), container: base.container, port: base.port });
  }
  if (marker.legacyShapeRequiresConversion) {
    console.error("[yorisou verify-local-supabase-target] WARNING: identity marker uses the legacy table shape — run the guarded singleton conversion (supabase/local-identity-marker-conversion.sql) as a post-merge local maintenance step.");
  }
  return { ...base, stage: "full", markerShape: marker.legacyShapeRequiresConversion ? "legacy-requires-conversion" : "singleton" };
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
