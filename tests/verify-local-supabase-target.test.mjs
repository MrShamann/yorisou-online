import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const guardPath = join(REPO, "scripts/verify-local-supabase-target.mjs");
const { sectionPort } = await import(guardPath);

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
  const code = `import(${JSON.stringify(guardPath)}).then(m=>{const f=${stage === "bootstrap" ? "m.verifyBootstrap" : "m.verify"};const r=f(${JSON.stringify(dbUrl)},{repo:${JSON.stringify(repo)}});console.log("OK",r.stage)}).catch(e=>{console.error("REFUSED:",e.message);process.exit(1)})`;
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
  assert.match(run("postgresql://intruder@127.0.0.1:55342/postgres", repo).out, /unexpected database user/);
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
