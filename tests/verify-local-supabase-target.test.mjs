import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const guardPath = join(REPO, "scripts/verify-local-supabase-target.mjs");
const { sectionPort, assessMarker } = await import(guardPath);

function fakeRepo({ project = "yorisou-online", cfgProject = "yorisou-online", apiPort = 55341, dbPort = 55342, withConfig = true } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "yor-guard-"));
  writeFileSync(join(dir, "PROJECT_MANIFEST.yaml"), `project_id: ${project}\n`);
  mkdirSync(join(dir, "supabase"), { recursive: true });
  if (withConfig) {
    writeFileSync(join(dir, "supabase/config.toml"),
      `project_id = "${cfgProject}"\n\n[api]\nport = ${apiPort}\n\n[db]\nport = ${dbPort}\nshadow_port = 55340\n`);
  }
  return dir;
}
function run(dbUrl, repo, stage = "bootstrap") {
  const code = `import(${JSON.stringify(guardPath)}).then(m=>{const f=${stage === "bootstrap" ? "m.verifyBootstrap" : "m.verify"};const r=f(${JSON.stringify(dbUrl)},{repo:${JSON.stringify(repo)}});console.log("OK",r.stage)}).catch(e=>{console.error("REFUSED:",e.message);for(const[k,v]of Object.entries(e.observed??{}))console.error(k+":",v);process.exit(1)})`;
  try { return { code: 0, out: execFileSync("node", ["-e", code], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }) }; }
  catch (e) { return { code: e.status ?? 1, out: (e.stdout || "") + (e.stderr || "") }; }
}
const OK = "postgresql://postgres@127.0.0.1:55342/postgres";

test("exact [db].port parsing — an [api] port is never accepted as the DB port", () => {
  const toml = `project_id = "yorisou-online"\n\n[api]\nport = 55341\n\n[db]\nport = 55342\n`;
  assert.equal(sectionPort(toml, "db"), 55342);
  assert.equal(sectionPort(toml, "api"), 55341);
  const repo = fakeRepo();
  const r = run("postgresql://postgres@127.0.0.1:55341/postgres", repo);
  assert.match(r.out, /does not equal the exact \[db\]\.port/);
  rmSync(repo, { recursive: true, force: true });
});

test("wrong repository / missing config / wrong project id are refused", () => {
  let repo = fakeRepo({ project: "mirai-move" });
  assert.match(run(OK, repo).out, /not yorisou-online/); rmSync(repo, { recursive: true, force: true });
  repo = fakeRepo({ withConfig: false });
  assert.match(run(OK, repo).out, /config\.toml missing/); rmSync(repo, { recursive: true, force: true });
  repo = fakeRepo({ cfgProject: "mirai-move" });
  assert.match(run(OK, repo).out, /project_id is not yorisou-online/); rmSync(repo, { recursive: true, force: true });
});

test("Mirai's 5532x range and the old default 5432x are refused", () => {
  let repo = fakeRepo({ dbPort: 55322 });
  assert.match(run("postgresql://postgres@127.0.0.1:55322/postgres", repo).out, /outside YORISOU's dedicated range/);
  rmSync(repo, { recursive: true, force: true });
  repo = fakeRepo({ dbPort: 54322 });
  assert.match(run("postgresql://postgres@127.0.0.1:54322/postgres", repo).out, /outside YORISOU's dedicated range/);
  rmSync(repo, { recursive: true, force: true });
});

test("remote hosts, unexpected database and unexpected user are refused", () => {
  const repo = fakeRepo();
  assert.match(run("postgresql://postgres@db.supabase.co:55342/postgres", repo).out, /host is not local/);
  assert.match(run("postgresql://postgres@127.0.0.1:55342/mirai", repo).out, /unexpected database name/);
  assert.match(run("postgresql://intruder@127.0.0.1:55342/postgres", repo).out, /database user missing or unexpected/);
  rmSync(repo, { recursive: true, force: true });
});

test("guard fails closed on container ambiguity and foreign projects", () => {
  const src = readFileSync(guardPath, "utf8");
  assert.match(src, /FORBIDDEN = \["mirai", "kakari"\]/, "rejects mirai and kakari");
  assert.match(src, /more than one container publishes the target port/, "ambiguous target fails closed");
  assert.match(src, /com\.supabase\.cli\.project/, "uses the Supabase CLI label");
  assert.match(src, /yorisou_local_project_identity/, "full mode requires the marker");
  assert.match(src, /verifyBootstrap/, "two-stage model");
});

test("CROSS-PROJECT: the YORISOU guard rejects a Mirai-identified repo/target", () => {
  const repo = fakeRepo({ project: "mirai-move", cfgProject: "mirai-move", dbPort: 55322 });
  const r = run("postgresql://postgres@127.0.0.1:55322/postgres", repo);
  assert.notEqual(r.code, 0);
  rmSync(repo, { recursive: true, force: true });
});

test("mutating operations are routed through the guarded wrapper", () => {
  const w = readFileSync(join(REPO, "scripts/yorisou-local-db.mjs"), "utf8");
  for (const c of ["bootstrap", "verify", "migrate", "reset", "e2e"]) assert.ok(w.includes(`"${c}"`), `wrapper supports ${c}`);
  assert.match(w, /verifyBootstrap\(url\)/, "bootstrap stage guards the marker write");
  assert.match(w, /--yes-destroy-local-data/, "reset requires explicit destructive acknowledgement");
  assert.ok(existsSync(join(REPO, "supabase/local-identity-bootstrap.sql")), "identity bootstrap SQL exists");
});

test("committed config pins YORISOU identity and its dedicated range", () => {
  const cfg = readFileSync(join(REPO, "supabase/config.toml"), "utf8");
  assert.match(cfg, /project_id = "yorisou-online"/);
  assert.equal(sectionPort(cfg, "db"), 55342);
  assert.ok(!/\bport = 5432[0-9]\b/.test(cfg), "no collision-prone default ports");
  assert.ok(!/\bport = 5532[0-9]\b/.test(cfg), "no overlap with mirai-move's range");
});

// ── PR #122 pre-merge safety corrections ─────────────────────────────────────

test("marker singleton contract: exactly one row with exactly the right value", () => {
  // pure assessment of the "<count>|<projects>|<shape>" marker query result
  assert.deepEqual(assessMarker("1|yorisou-online|singleton"), { ok: true, legacyShapeRequiresConversion: false });
  const legacy = assessMarker("1|yorisou-online|legacy");
  assert.equal(legacy.ok, true);
  assert.equal(legacy.legacyShapeRequiresConversion, true, "legacy correct marker detected as requiring conversion");
  assert.equal(assessMarker("0||singleton").ok, false, "zero rows rejected");
  assert.match(assessMarker("0||singleton").reason, /no identity marker row/);
  assert.equal(assessMarker("2|yorisou-online|legacy").ok, false, "multiple rows rejected even when values agree");
  assert.match(assessMarker("2|yorisou-online|legacy").reason, /not a singleton/);
  assert.equal(assessMarker("1|mirai-move|singleton").ok, false, "wrong project rejected");
  assert.equal(assessMarker("2|mirai-move,yorisou-online|legacy").ok, false, "conflicting marker rejected");
  assert.equal(assessMarker("garbage").ok, false, "unreadable result rejected");
  assert.equal(assessMarker("").ok, false);
});

test("full-mode marker query is deterministic — no unordered LIMIT 1", () => {
  const src = readFileSync(guardPath, "utf8");
  assert.ok(!/limit 1/i.test(src.split("MARKER_QUERY")[1].split(";")[0] ?? ""), "marker query has no LIMIT 1");
  assert.match(src, /count\(\*\)/, "marker query counts rows");
  assert.match(src, /string_agg\(distinct project/, "marker query aggregates DISTINCT project values");
  assert.match(src, /column_name='singleton'/, "marker query detects the legacy shape");
});

test("bootstrap SQL refuses conflicting markers and never silently appends", () => {
  const sql = readFileSync(join(REPO, "supabase/local-identity-bootstrap.sql"), "utf8");
  assert.ok(!/on conflict do nothing/i.test(sql), "no ON CONFLICT DO NOTHING silent insert");
  assert.match(sql, /CONFLICTING_LOCAL_IDENTITY_MARKER/, "conflicting/extra markers raise, not overwrite");
  assert.match(sql, /singleton boolean primary key default true check \(singleton = true\)/, "new tables use the singleton shape");
  assert.match(sql, /check \(project = 'yorisou-online'\)/, "project value is constrained");
  assert.match(sql, /if v_total = 0 then/, "insert happens only into an empty table");
});

test("legacy→singleton conversion exists as a guarded post-merge step and is not run by bootstrap", () => {
  const conv = readFileSync(join(REPO, "supabase/local-identity-marker-conversion.sql"), "utf8");
  assert.match(conv, /POST-MERGE/i, "documented as post-merge maintenance");
  assert.match(conv, /begin;/i);
  assert.match(conv, /commit;/i);
  assert.match(conv, /v_total <> 1 or v_conflicting > 0/, "conversion refuses any conflict");
  const boot = readFileSync(join(REPO, "supabase/local-identity-bootstrap.sql"), "utf8");
  assert.ok(!boot.includes("conversion"), "bootstrap does not invoke the conversion");
  const wrapper = readFileSync(join(REPO, "scripts/yorisou-local-db.mjs"), "utf8");
  assert.ok(!wrapper.includes("local-identity-marker-conversion"), "wrapper does not auto-run the conversion");
});

test("database user must be present and exact — missing user is refused", () => {
  const src = readFileSync(guardPath, "utf8");
  assert.ok(!/url\.username\s*&&\s*url\.username !==/.test(src), "the permissive 'username && username !==' pattern is gone");
  assert.match(src, /url\.username !== EXPECTED_USER/, "username must equal the expected user");
  const repo = fakeRepo();
  const missing = run("postgresql://127.0.0.1:55342/postgres", repo);
  assert.notEqual(missing.code, 0);
  assert.match(missing.out, /database user missing or unexpected/);
  assert.match(missing.out, /\(missing\)/, "missing username reported without inventing one");
  rmSync(repo, { recursive: true, force: true });
});

test("exact postgres user passes the user check (refusal, if any, is later and unrelated)", () => {
  // Use an in-range port with no declared container conflict potential: the
  // flow must get PAST the user check; any refusal must be about the container,
  // never about the user.
  const repo = fakeRepo({ dbPort: 55343 });
  const r = run("postgresql://postgres@127.0.0.1:55343/postgres", repo);
  assert.ok(!/database user missing or unexpected/.test(r.out), "postgres user is not refused");
  rmSync(repo, { recursive: true, force: true });
});

test("migrate is blocked pending migration-state reconciliation — no replay path exists", () => {
  const wrapper = readFileSync(join(REPO, "scripts/yorisou-local-db.mjs"), "utf8");
  assert.match(wrapper, /YORISOU_LOCAL_MIGRATION_STATE_RECONCILIATION_REQUIRED/, "migrate refuses with the stable blocker token");
  assert.ok(!wrapper.includes("readdirSync"), "the manual migration-directory replay path is absent");
  // the migrate branch performs no SQL write: no psql call between verify and die
  const migrateBranch = wrapper.split('cmd === "migrate"')[1].split('} else if')[0];
  assert.ok(!migrateBranch.includes("psql("), "blocked migrate attempts no SQL statement");
  assert.match(migrateBranch, /die\(/, "migrate ends in refusal");
});
