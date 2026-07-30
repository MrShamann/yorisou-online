#!/usr/bin/env node
// POR-1 — audit the Vercel environment matrix for the identity-store boundary.
//
// The runtime guard stops a bad configuration from writing anything, and the acceptance gate stops
// a bad deployment from being tested. Neither tells an operator that a variable is wrong BEFORE a
// deployment exists. This does.
//
// It refuses the configuration that caused the incident: a Preview-wide (or branch) variable set
// naming the Production bucket, or one that resolves to the AWS default transport because an
// endpoint is missing.
//
// Requires a Vercel API token with project read access:
//   VERCEL_TOKEN=… VERCEL_PROJECT_ID=… VERCEL_TEAM_ID=… node scripts/por1-preview-env-isolation-audit.mjs
//
// It reads variable NAMES, TARGETS and BRANCHES — never decrypts a value. Bucket and endpoint are
// stored unencrypted for the isolated set precisely so this audit needs no secret access; an
// encrypted bucket is reported as unverifiable rather than assumed safe.

const PRODUCTION_BUCKETS = new Set(["yorisou-phase1-shared-prod-20260321"]);
const ISOLATED_PREVIEW_BUCKETS = new Set(["yorisou-preview-auth"]);
const SUPABASE_REST = /\/storage\/v1\/?$/;

const token = process.env.VERCEL_TOKEN;
const projectId = process.env.VERCEL_PROJECT_ID;
const teamId = process.env.VERCEL_TEAM_ID;

if (!token || !projectId) {
  console.error("VERCEL_TOKEN and VERCEL_PROJECT_ID are required; this audit cannot run without them.");
  process.exit(2);
}

const url = `https://api.vercel.com/v10/projects/${projectId}/env?decrypt=true${teamId ? `&teamId=${teamId}` : ""}`;
const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
if (!response.ok) {
  console.error(`Vercel API refused the env listing (${response.status}).`);
  process.exit(2);
}
const { envs = [] } = await response.json();

/** Group the shared-store variables by (target, branch) — the unit a deployment actually resolves. */
const scopes = new Map();
for (const env of envs) {
  if (!env.key.startsWith("YORISOU_SHARED_STORE_")) continue;
  for (const target of env.target ?? []) {
    const key = `${target}::${env.gitBranch ?? "(default)"}`;
    if (!scopes.has(key)) scopes.set(key, {});
    scopes.get(key)[env.key.replace("YORISOU_SHARED_STORE_", "")] = env.value;
  }
}

const failures = [];
const notes = [];

function encrypted(value) {
  return typeof value === "string" && value.startsWith("eyJ2Ijoi");
}

for (const [scope, vars] of scopes) {
  const [target, branch] = scope.split("::");
  const bucket = vars.BUCKET;
  const endpoint = vars.ENDPOINT;

  if (target !== "preview") continue;

  if (encrypted(bucket) || encrypted(endpoint)) {
    // An unreadable bucket is not a safe bucket. Bucket and endpoint are infrastructure
    // identifiers, not secrets, and are stored readable precisely so this audit can check them —
    // so an encrypted one is a FAILURE, not a note. A gate that passes on what it cannot see is
    // the same false comfort that let the original defect through.
    failures.push(`preview/${branch}: bucket/endpoint are encrypted and cannot be verified`);
    continue;
  }
  if (PRODUCTION_BUCKETS.has(bucket)) {
    failures.push(`preview/${branch}: bucket ${bucket} belongs to Production`);
    continue;
  }
  if (bucket && !endpoint) {
    failures.push(`preview/${branch}: bucket without endpoint resolves to the AWS default transport`);
    continue;
  }
  if (bucket && !SUPABASE_REST.test(endpoint)) {
    failures.push(`preview/${branch}: endpoint is not a supported isolated transport`);
    continue;
  }
  if (bucket && !ISOLATED_PREVIEW_BUCKETS.has(bucket)) {
    failures.push(`preview/${branch}: bucket ${bucket} is not an approved isolated Preview bucket`);
    continue;
  }
  if (!bucket) {
    failures.push(`preview/${branch}: no bucket; a hosted Preview must not fall back to local storage`);
    continue;
  }
  console.log(`  ok   preview/${branch} → ${bucket}`);
}

for (const note of notes) console.log(`  note ${note}`);
for (const failure of failures) console.error(`  FAIL ${failure}`);

if (failures.length > 0) {
  console.error(`\nPREVIEW_ENV_ISOLATION: FAILED (${failures.length})`);
  process.exit(1);
}
console.log("\nPREVIEW_ENV_ISOLATION: PASSED");
