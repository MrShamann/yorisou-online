// MPV-1C/MPV-1D — shared object-store provider resolution tests (node:assert under tsx).
// Verifies the durable-store mode selection + fail-closed credential validation WITHOUT
// changing the default AWS behavior, that orphaned shared-store config (any shared-store
// variable set WITHOUT a bucket) fails closed instead of silently selecting ephemeral
// local storage (MPV-1D), and that no secret ever appears in a thrown error.
// Run: node --import tsx lib/server/__tests__/sharedObjectStore.test.ts

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolveSharedStoreMode } from "../yorisouData";

let passed = 0;
function check(label: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`  ✓ ${label}`);
}

const SECRET = "super-secret-service-role-key-value-eyJ";
const KEYID = "AKIA_EXAMPLE_KEY_ID";

console.log("MPV-1C/1D — shared object-store provider resolution");

// ── Legitimate local-file mode: ONLY when NO shared-store variable is present ──────────
check("local-file mode: no shared-store variables → 'disabled' (unchanged default)", () => {
  assert.equal(resolveSharedStoreMode({ bucket: "" }), "disabled");
  assert.equal(resolveSharedStoreMode({}), "disabled");
  assert.equal(
    resolveSharedStoreMode({ bucket: "", endpoint: "", accessKeyId: "", secretAccessKey: "", forcePathStyle: false }),
    "disabled",
  );
});

// ── Existing valid modes (unchanged) ──────────────────────────────────────────────────
check("existing AWS-default mode: bucket + no endpoint → 'aws' (unchanged behavior)", () => {
  assert.equal(resolveSharedStoreMode({ bucket: "prod-bucket" }), "aws");
  // Stray access keys WITH a bucket but no endpoint do not change AWS-default selection.
  assert.equal(resolveSharedStoreMode({ bucket: "prod-bucket", accessKeyId: KEYID, secretAccessKey: SECRET }), "aws");
});

check("custom S3-compatible endpoint + BOTH credentials → 's3-compatible'", () => {
  assert.equal(
    resolveSharedStoreMode({ bucket: "b", endpoint: "https://example.s3.internal", accessKeyId: KEYID, secretAccessKey: SECRET }),
    "s3-compatible",
  );
});

check("Supabase Storage REST endpoint (.../storage/v1) + token → 'supabase-rest'", () => {
  assert.equal(
    resolveSharedStoreMode({ bucket: "b", endpoint: "https://ref.supabase.co/storage/v1", secretAccessKey: SECRET }),
    "supabase-rest",
  );
  assert.equal(
    resolveSharedStoreMode({ bucket: "b", endpoint: "https://ref.supabase.co/storage/v1/", secretAccessKey: SECRET }),
    "supabase-rest",
  );
});

function expectThrowsNoSecret(fn: () => void, expectedCode: string) {
  let threw: Error | null = null;
  try {
    fn();
  } catch (e) {
    threw = e as Error;
  }
  assert.ok(threw, "expected a throw");
  assert.equal(threw!.message, expectedCode);
  // No secret material may appear in the thrown message.
  assert.ok(!threw!.message.includes(SECRET), "error must not contain the secret");
  assert.ok(!threw!.message.includes(KEYID), "error must not contain the access-key id");
}

// ── MPV-1D — orphaned shared-store config WITHOUT a bucket must fail closed ─────────────
check("fail closed: endpoint without bucket → shared_store_bucket_required", () => {
  expectThrowsNoSecret(() => resolveSharedStoreMode({ endpoint: "https://ref.supabase.co/storage/v1" }), "shared_store_bucket_required");
});

check("fail closed: token (secret) without bucket → shared_store_bucket_required", () => {
  expectThrowsNoSecret(() => resolveSharedStoreMode({ secretAccessKey: SECRET }), "shared_store_bucket_required");
});

check("fail closed: access key without bucket → shared_store_bucket_required", () => {
  expectThrowsNoSecret(() => resolveSharedStoreMode({ accessKeyId: KEYID }), "shared_store_bucket_required");
});

check("fail closed: forcePathStyle=true without bucket → shared_store_bucket_required", () => {
  expectThrowsNoSecret(() => resolveSharedStoreMode({ forcePathStyle: true }), "shared_store_bucket_required");
});

check("fail closed: endpoint + token without bucket → shared_store_bucket_required", () => {
  expectThrowsNoSecret(
    () => resolveSharedStoreMode({ endpoint: "https://ref.supabase.co/storage/v1", secretAccessKey: SECRET }),
    "shared_store_bucket_required",
  );
});

check("fail closed: endpoint + BOTH S3 credentials without bucket → shared_store_bucket_required", () => {
  expectThrowsNoSecret(
    () => resolveSharedStoreMode({ endpoint: "https://example.s3.internal", accessKeyId: KEYID, secretAccessKey: SECRET }),
    "shared_store_bucket_required",
  );
});

// ── Partial / malformed credentials WITH a bucket still fail closed (unchanged) ─────────
check("fail closed: s3-compatible endpoint with only ONE credential → throws, no secret", () => {
  expectThrowsNoSecret(() => resolveSharedStoreMode({ bucket: "b", endpoint: "https://x.s3", accessKeyId: KEYID }), "shared_store_partial_credentials");
  expectThrowsNoSecret(() => resolveSharedStoreMode({ bucket: "b", endpoint: "https://x.s3", secretAccessKey: SECRET }), "shared_store_partial_credentials");
});

check("fail closed: s3-compatible endpoint with NO credentials → throws, no secret", () => {
  expectThrowsNoSecret(() => resolveSharedStoreMode({ bucket: "b", endpoint: "https://x.s3" }), "shared_store_endpoint_missing_credentials");
});

check("fail closed: Supabase REST endpoint (with bucket) without a token → throws, no secret", () => {
  expectThrowsNoSecret(() => resolveSharedStoreMode({ bucket: "b", endpoint: "https://ref.supabase.co/storage/v1" }), "shared_store_supabase_rest_missing_token");
});

// ── Initialization-level: a malformed process env cannot silently fall back to local ────
// Loads the REAL module in a child process with a controlled env and asserts that module
// initialization THROWS on orphaned config (never silently selects local-file mode), and
// that valid absent-config still initializes cleanly. Proves the init path is authoritative
// (no `shouldUseSharedStore` bypass) and that no secret leaks into the failure output.
const MODULE_PATH = fileURLToPath(new URL("../yorisouData.ts", import.meta.url));
const INIT_SECRET = "init-child-secret-eyJ-DO-NOT-LEAK";

function initModule(sharedEnv: Record<string, string>): { code: number; output: string } {
  // env -i-style clean base: only PATH/HOME + the shared-store vars under test, so no
  // ambient YORISOU_SHARED_STORE_* configuration leaks into the child.
  const env: NodeJS.ProcessEnv = {
    PATH: process.env.PATH,
    HOME: process.env.HOME,
    NODE_ENV: "test",
    __MODPATH: MODULE_PATH,
    YORISOU_SHARED_STORE_BUCKET: "",
    YORISOU_SHARED_STORE_ENDPOINT: "",
    YORISOU_SHARED_STORE_ACCESS_KEY_ID: "",
    YORISOU_SHARED_STORE_SECRET_ACCESS_KEY: "",
    YORISOU_SHARED_STORE_FORCE_PATH_STYLE: "",
    ...sharedEnv,
  };
  const script =
    "import(process.env.__MODPATH).then(()=>{process.stdout.write('LOADED_OK');process.exit(0)})" +
    ".catch(e=>{process.stderr.write('ERR:'+(e&&e.message?e.message:String(e)));process.exit(3)})";
  try {
    const out = execFileSync(process.execPath, ["--import", "tsx", "-e", script], {
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { code: 0, output: out.toString() };
  } catch (e) {
    const err = e as { status?: number; stdout?: Buffer; stderr?: Buffer };
    return { code: err.status ?? -1, output: `${err.stdout?.toString() ?? ""}${err.stderr?.toString() ?? ""}` };
  }
}

check("init-level: orphaned env (endpoint+token, no bucket) FAILS at module init — no silent local fallback, no secret leak", () => {
  const r = initModule({
    YORISOU_SHARED_STORE_ENDPOINT: "https://example.internal/storage/v1",
    YORISOU_SHARED_STORE_SECRET_ACCESS_KEY: INIT_SECRET,
  });
  assert.equal(r.code, 3, `expected init to throw (exit 3); got ${r.code}: ${r.output}`);
  assert.ok(r.output.includes("shared_store_bucket_required"), `expected shared_store_bucket_required; got: ${r.output}`);
  assert.ok(!r.output.includes("LOADED_OK"), "module must NOT initialize under orphaned config");
  assert.ok(!r.output.includes(INIT_SECRET), "init failure output must not contain the secret");
});

check("init-level: fully-absent shared-store env initializes cleanly (local-file disabled mode)", () => {
  const r = initModule({});
  assert.equal(r.code, 0, `expected clean init (exit 0); got ${r.code}: ${r.output}`);
  assert.ok(r.output.includes("LOADED_OK"), "module must initialize in local-file mode when no shared-store var is set");
});

console.log(`\nMPV-1C/1D shared object-store: ${passed} checks passed.`);
