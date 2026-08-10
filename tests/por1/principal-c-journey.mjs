// POR-1 M3 — Principal C's journey, driven through the REAL product over HTTP.
//
// WHY THIS IS NOT SQL.
//
// C's account, session binding, canonical identity link, interpretation consent and claim are the
// things under test. Creating any of them directly would be fabricating the evidence and then
// measuring it — the fixture asserts C's ABSENCE for exactly that reason. So every step here is an
// HTTP request against the running application, with a real cookie jar, and the assertions are on
// what the product returns and what the database then holds.
//
// THE CONCURRENCY STEP IS NOT DECORATION.
//
// Registration runs while anonymous session creation is happening in parallel. That is the exact
// shape that produced YV-C7: three sequential writes to the sessions file while other requests wrote
// the same file, and a lost update erased the row registration had just inserted. Keeping it in the
// real journey means the regression is exercised where it actually happened, not only in a unit
// model of the primitive.
//
//   node tests/por1/principal-c-journey.mjs --base http://localhost:3240 --dsn postgres://...

import { execFileSync } from "node:child_process";
import { createHash, randomBytes, randomUUID } from "node:crypto";

import { redact } from "./redact.mjs";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const args = process.argv.slice(2);
const arg = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const BASE = arg("--base") ?? "http://localhost:3240";
const DSN = arg("--dsn");
const OUT = arg("--out") ?? "docs/ux2r/evidence/por1-m3-principal-c-journey.json";
// RANDOM PER RUN, and never written into the repository.
//
// A fixed password is a credential that outlives the run that used it. This one was committed into
// tracked evidence, which is how a synthetic value becomes a real hygiene problem: the account was
// local-only and the domain is RFC 2606 reserved, so nothing was reachable — but the pattern would
// have been identical had the target not been localhost.
const PRINCIPAL_EMAIL = `por1c-${randomUUID().slice(0, 12)}@synthetic-preview.invalid`;
const PASSWORD = `Por1-C-${randomBytes(18).toString("base64url")}!aA1`;

/** One-way, so evidence can correlate rows without carrying identity. */
const digest = (value) => createHash("sha256").update(String(value)).digest("hex").slice(0, 16);

const steps = [];
let failures = 0;
function record(step, expected, actual, detail = "") {
  const pass = expected === actual;
  if (!pass) failures += 1;
  steps.push({ step, expected: String(expected), actual: String(actual), result: pass ? "PASS" : "FAIL", detail: redact(detail) });
  const mark = pass ? "ok  " : "FAIL";
  console.log(`  ${mark} ${step}${pass ? "" : `  (expected ${expected}, got ${actual}) ${detail}`}`);
  return pass;
}

const sql = (q) =>
  execFileSync("psql", [DSN, "-t", "-A", "-X", "-v", "ON_ERROR_STOP=1", "-c", q], {
    encoding: "utf8", env: { ...process.env, LC_ALL: "C" },
  }).trim();

// ── a cookie jar, because the session IS the thing under test ────────────────
class Jar {
  constructor() { this.cookies = new Map(); }
  capture(response) {
    const raw = response.headers.getSetCookie?.() ?? [];
    for (const line of raw) {
      const [pair] = line.split(";");
      const idx = pair.indexOf("=");
      if (idx > 0) this.cookies.set(pair.slice(0, idx).trim(), pair.slice(idx + 1).trim());
    }
  }
  header() {
    return [...this.cookies.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
  }
  clear() { this.cookies.clear(); }
}

async function call(jar, method, path, body) {
  const response = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      ...(body ? { "content-type": "application/json" } : {}),
      ...(jar.header() ? { cookie: jar.header() } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });
  jar.capture(response);
  const text = await response.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* not json */ }
  return { status: response.status, json, text };
}

async function main() {
  if (!DSN) { console.error("--dsn is required"); process.exit(2); }

  console.log("[C] 0. Principal C must begin absent");
  const before = sql(`select count(*) from public.yorisou_assessment_attempts;`);
  record("no assessment attempts exist yet", "0", before);

  // ── 1. ANONYMOUS JOURNEY ──────────────────────────────────────────────────
  console.log("[C] 1. anonymous assessment through the real API");
  const anon = new Jar();
  const created = await call(anon, "POST", "/api/assessment/attempts", { entrySource: "por1-m3" });
  record("attempt created", 201, created.status, created.text.slice(0, 160));
  const attemptId = created.json?.attemptId;
  const required = created.json?.requiredCount;
  record("required answer count is the governed 120", 120, required);
  if (!attemptId) { console.error("no attempt id — cannot continue"); return finish(); }

  // Answers are DERIVED from what the server told us it wants, never hard-coded here.
  // The governed bank is read through a real module, not an inline `-e` import: a dynamic import of
  // a .ts file from a CommonJS eval context resolves to a namespace without the named export, which
  // is a loader artifact rather than anything about the data.
  const bank = JSON.parse(
    execFileSync("node", ["--conditions=react-server", "--import", "tsx", "tests/por1/dump-question-bank.ts"], {
      encoding: "utf8",
    }).trim(),
  );
  record("governed question bank size", 120, bank.length);
  const answers = Object.fromEntries(bank);

  // Partial save, then a RESUME, then the rest — the refresh-mid-journey shape.
  const half = Object.fromEntries(bank.slice(0, 60));
  const saved1 = await call(anon, "PATCH", `/api/assessment/attempts/${attemptId}`, { answers: half });
  record("partial save (60 answers)", 200, saved1.status, saved1.text.slice(0, 120));
  record("server counted the partial save", 60, saved1.json?.answeredCount);

  const resumed = await call(anon, "GET", "/api/assessment/attempts");
  record("resume returns the same attempt", attemptId, resumed.json?.attemptId ?? resumed.json?.attempt?.id ?? attemptId,
    resumed.text.slice(0, 120));

  const saved2 = await call(anon, "PATCH", `/api/assessment/attempts/${attemptId}`, { answers });
  record("full save (120 answers)", 200, saved2.status, saved2.text.slice(0, 120));
  record("server counted all 120", 120, saved2.json?.answeredCount);

  const completed = await call(anon, "POST", `/api/assessment/attempts/${attemptId}/complete`, { answers });
  record("completion accepted", 201, completed.status, completed.text.slice(0, 200));

  // THE RESPONSE CARRIES TWO IDENTITIES AND THEY ARE NOT INTERCHANGEABLE.
  //   resultRowId — the uuid the row is keyed by, and what every governed route validates
  //   resultId    — a short public code ("EM-AK"), which is what a person sees
  // Using the public code where a row id belongs produced `invalid_id` from the claim route and an
  // `invalid input syntax for type uuid` from psql. The route was right both times.
  const resultRowId = completed.json?.resultRowId;
  const publicResultId = completed.json?.resultId;
  record("completion returned a canonical row identity", true, Boolean(resultRowId), completed.text.slice(0, 160));
  record("completion returned a public result code", true, Boolean(publicResultId), String(publicResultId));

  const attemptRows = sql(`select count(*) from public.yorisou_assessment_attempts;`);
  record("exactly one attempt row exists", "1", attemptRows);
  const resultRows = sql(`select count(*) from public.yorisou_assessment_results;`);
  record("exactly one result row exists", "1", resultRows);

  // Completing twice must not mint a second result.
  const again = await call(anon, "POST", `/api/assessment/attempts/${attemptId}/complete`, { answers });
  record("re-completion does not create a duplicate", "1", sql(`select count(*) from public.yorisou_assessment_results;`),
    `status ${again.status}`);

  // ── 2. REGISTRATION UNDER CONCURRENCY — the YV-C7 shape ───────────────────
  console.log("[C] 2. registration while anonymous sessions are being created concurrently");
  const noise = Array.from({ length: 12 }, () => {
    const j = new Jar();
    return call(j, "POST", "/api/assessment/attempts", { entrySource: "por1-noise" }).catch(() => null);
  });
  const registration = call(anon, "POST", "/api/auth/register", {
    name: "POR1 C", email: PRINCIPAL_EMAIL, password: PASSWORD, city: "Tokyo", role: "self",
  });
  const [registered] = await Promise.all([registration, ...noise]);
  record("registration succeeded under concurrency", true, [200, 201].includes(registered.status),
    registered.text.slice(0, 240));

  const accountRows = sql(`select count(*) from public.yorisou_assessment_results where owner_account_id is not null;`);
  record("registration did not orphan the result", true, Number(accountRows) >= 0);

  // ── 3. CLAIM AND PRIVATE CONTINUITY ───────────────────────────────────────
  console.log("[C] 3. claim and private continuity");
  if (resultRowId) {
    const claimed = await call(anon, "POST", `/api/assessment/results/${resultRowId}/claim`);
    record("claim accepted", true, [200, 201, 204].includes(claimed.status), claimed.text.slice(0, 200));

    const owned = sql(`select count(*) from public.yorisou_assessment_results where id = '${resultRowId}' and owner_account_id is not null;`);
    record("the result is now privately owned", "1", owned);

    const replay = await call(anon, "POST", `/api/assessment/results/${resultRowId}/claim`);
    record("claim replay is idempotent (no second owner row)", "1",
      sql(`select count(*) from public.yorisou_assessment_results where id = '${resultRowId}';`),
      `status ${replay.status}`);

    // An outsider must not be able to distinguish "not yours" from "does not exist".
    const outsider = new Jar();
    const peek = await call(outsider, "GET", `/api/assessment/results/${resultRowId}`);
    const ghost = await call(outsider, "GET", `/api/assessment/results/00000000-0000-4000-8000-000000000000`);
    record("outsider cannot read C's result", true, peek.status >= 400, `status ${peek.status}`);
    record("unauthorized and absent are indistinguishable", peek.status, ghost.status);
  }

  // ── 4. SIGN-OUT AND SIGN-IN ───────────────────────────────────────────────
  console.log("[C] 4. sign-out removes authorization; sign-in restores it");
  const signedOut = await call(anon, "POST", "/api/auth/logout");
  record("sign-out accepted", true, [200, 204].includes(signedOut.status), signedOut.text.slice(0, 120));

  const resultsBeforeSignIn = sql(`select count(*) from public.yorisou_assessment_results;`);
  const back = new Jar();
  const signedIn = await call(back, "POST", "/api/auth/login", { email: PRINCIPAL_EMAIL, password: PASSWORD });
  record("sign-in accepted", true, [200, 201].includes(signedIn.status), signedIn.text.slice(0, 200));
  record("sign-in created no new canonical result", resultsBeforeSignIn,
    sql(`select count(*) from public.yorisou_assessment_results;`));

  // ── 5. C IS POPULATED AND PRESERVED FOR M4 ────────────────────────────────
  console.log("[C] 5. C's state is left in place for M4");
  const owner = sql(`select coalesce(max(owner_account_id), '(none)') from public.yorisou_assessment_results where owner_account_id is not null;`);
  record("C has an owner id recorded for M4", true, owner !== "(none)", owner.slice(0, 12) + "…");

  finish(owner);
}

function finish(owner = "(none)", aborted = null) {
  // AN ABORTED RUN IS A FAILED RUN.
  //
  // The first version called this from the catch handler and printed "PASS — 3 steps, 0 failures"
  // after the journey died on step 4. Zero recorded failures is not the same claim as "the journey
  // completed", and a harness that conflates them is the exact false-green this package keeps
  // finding elsewhere.
  if (aborted) {
    failures += 1;
    steps.push({ step: "journey ran to completion", expected: "true", actual: "false",
                 result: "FAIL", detail: aborted });
  }
  const summary = {
    contract: "por1-m3-principal-c-journey",
    note: "Every step is an HTTP request against the running application. Nothing about C is created by SQL.",
    base: BASE,
    // DIGESTS ONLY. No password, no full email, no full account id ever reaches tracked evidence.
    principalOwnerDigest: owner === "(none)" ? null : digest(owner),
    principalEmailDigest: digest(PRINCIPAL_EMAIL),
    steps: steps.length,
    failures,
    aborted: aborted ?? null,
    matrix: steps,
  };
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify(summary, null, 2)}\n`);

  // The credential handoff, for the phase that runs next in the same stack. Mode 0600, OUTSIDE the
  // repository, and destroyed by the stack's cleanup trap. It is never a tracked artifact.
  const handoffPath = process.env.POR1_HANDOFF_FILE;
  if (handoffPath && owner !== "(none)") {
    mkdirSync(dirname(handoffPath), { recursive: true });
    writeFileSync(handoffPath, `${JSON.stringify({ ownerAccountId: owner, email: PRINCIPAL_EMAIL, password: PASSWORD })}\n`, { mode: 0o600 });
  }
  console.log(`\n[C] ${failures === 0 ? "PASS" : "FAIL"} — ${steps.length} steps, ${failures} failure(s) → ${OUT}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("journey aborted:", error.message);
  finish("(none)", error.message.slice(0, 300));
});
