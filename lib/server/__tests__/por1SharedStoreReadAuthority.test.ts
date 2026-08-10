// §9 — the supabase-rest AUTHORITATIVE read must be fresh, per read, forever.
//
// THE DEFECT THIS LOCKS OUT. Supabase Storage serves object bodies from a CDN keyed by URL.
// `cache: "no-store"` governs the application's own fetch cache and says nothing to that CDN, so a
// fixed object URL could return a body that no longer existed — or an older version of one that did.
// In the POR-1 deletion acceptance that is exactly what happened: an erased account's cookie was
// replayed, `findAccountById` received a CACHED PRE-DELETION body, `resolveAccountForViewer` treated
// the store hit as authoritative, and the durable deletion fallback (which only runs when the object
// is ABSENT) never executed. A stale cache entry became application authority.
//
// These tests are deliberately split. The first group drives the SHIPPED module through a stubbed
// global fetch and asserts what actually goes on the wire. The second is a source guard, because a
// future refactor could drop the nonce without any behavioural test noticing on a cold cache.

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = readFileSync(join(HERE, "..", "yorisouData.ts"), "utf8");
const CODE = SOURCE.replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");

// ── A. URL AND NONCE, ON THE WIRE ───────────────────────────────────────────

type Call = { url: string; init: RequestInit };

/**
 * Load the shared-store module with a supabase-rest configuration and a recording fetch.
 *
 * The module reads its configuration once at import time, so the environment is set before a FRESH
 * import (cache-busted by query string) rather than mutated afterwards.
 */
async function withRestStore<T>(
  responder: (call: Call, objectGetIndex: number) => Response,
  body: (ctx: { calls: Call[]; objectGets: Call[]; mod: typeof import("../yorisouData") }) => Promise<T>,
): Promise<T> {
  const calls: Call[] = [];
  const objectGets: Call[] = [];
  const previous = { ...process.env };
  const realFetch = globalThis.fetch;

  process.env.YORISOU_SHARED_STORE_BUCKET = "yorisou-preview-auth";
  process.env.YORISOU_SHARED_STORE_ENDPOINT = "https://example-project.supabase.co/storage/v1";
  process.env.YORISOU_SHARED_STORE_SECRET_ACCESS_KEY = "test-service-role-key";
  process.env.SUPABASE_URL = "https://example-project.supabase.co";
  process.env.VERCEL_ENV = "preview";

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const call = { url: String(input), init: init ?? {} };
    calls.push(call);
    // Only a GET of a single object is an authoritative read; readiness/list traffic is not, and
    // indexing responses by raw call order would silently shift when that traffic changes.
    const isObjectGet =
      (call.init.method ?? "GET") === "GET" && /\/object\/[^/]+\/phase1\//.test(call.url);
    if (!isObjectGet) return new Response("[]", { status: 200 });
    objectGets.push(call);
    return responder(call, objectGets.length - 1);
  }) as typeof fetch;

  try {
    const mod = (await import(`../yorisouData.ts?rest=${Math.random()}`)) as typeof import("../yorisouData");
    return await body({ calls, objectGets, mod });
  } finally {
    globalThis.fetch = realFetch;
    for (const k of Object.keys(process.env)) if (!(k in previous)) delete process.env[k];
    Object.assign(process.env, previous);
  }
}

const json = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });
const nonceOf = (url: string) => new URL(url).searchParams.get("cacheNonce");

test("two sequential authoritative reads of the SAME key use DIFFERENT nonces", async () => {
  await withRestStore(() => json({ id: "acct-1", deletionLockedAt: null }), async ({ objectGets, mod }) => {
  const key = "phase1/accounts/by-id/acct-1.json";

  await mod.sharedIdentityObjectExists(key);
  await mod.sharedIdentityObjectExists(key);

  assert.equal(objectGets.length, 2, "two logical reads, two requests");
  const n1 = nonceOf(objectGets[0].url);
  const n2 = nonceOf(objectGets[1].url);
  assert.ok(n1, "first read carries a cacheNonce");
  assert.ok(n2, "second read carries a cacheNonce");
  assert.notEqual(n1, n2, "a reused nonce is a reused cache entry");
  });
});

test("the object key path is unchanged by the nonce", async () => {
  await withRestStore(() => json({}), async ({ objectGets, mod }) => {
  const key = "phase1/accounts/by-id/acct-1.json";
  await mod.sharedIdentityObjectExists(key);

  const url = new URL(objectGets[0].url);
  assert.equal(
    url.pathname,
    "/storage/v1/object/yorisou-preview-auth/phase1/accounts/by-id/acct-1.json",
    "the nonce must never land inside the key",
  );
  assert.deepEqual([...url.searchParams.keys()], ["cacheNonce"], "exactly one added parameter");
  });
});

test("credentials stay in HEADERS and never appear in the URL", async () => {
  await withRestStore(() => json({}), async ({ objectGets, mod }) => {
  await mod.sharedIdentityObjectExists("phase1/accounts/by-id/acct-1.json");

  const headers = objectGets[0].init.headers as Record<string, string>;
  assert.ok(headers.apikey, "apikey travels as a header");
  assert.match(String(headers.Authorization), /^Bearer /);
  assert.ok(!objectGets[0].url.includes("test-service-role-key"), "no credential in the URL");
  assert.ok(!objectGets[0].url.includes("apikey="), "no credential as a query parameter");
  });
});

test("the nonce carries no account id, key material or personal data", async () => {
  await withRestStore(() => json({}), async ({ objectGets, mod }) => {
  await mod.sharedIdentityObjectExists("phase1/accounts/by-id/acct-secret-owner.json");

  const nonce = nonceOf(objectGets[0].url) ?? "";
  assert.match(nonce, /^[0-9a-f]{32}$/, "opaque random hex, derived from nothing");
  for (const forbidden of ["acct", "secret", "owner", "test-service-role-key", "@", "phase1"]) {
    assert.ok(!nonce.includes(forbidden), `nonce must not contain ${forbidden}`);
  }
  });
});

// ── B. FRESHNESS SEMANTICS ──────────────────────────────────────────────────

test("a changed object is observed on the NEXT read, not the previous body", async () => {
  // Two logical reads; the provider's content changes between them. Because each read is a distinct
  // URL, the second cannot be served from the first's cache entry.
  const bodies = [
    { id: "acct-1", deletionLockedAt: null },
    { id: "acct-1", deletionLockedAt: "2026-08-10T03:49:00.000Z" },
  ];
  await withRestStore((_call, index) => json(bodies[Math.min(index, 1)]), async ({ objectGets, mod }) => {
  const first = await mod.findAccountById("acct-1");
  const second = await mod.findAccountById("acct-1");

  assert.equal(first?.deletionLockedAt ?? null, null, "the pre-lock version");
  assert.equal(second?.deletionLockedAt, "2026-08-10T03:49:00.000Z", "the CURRENT version, not the cached one");
  assert.notEqual(nonceOf(objectGets[0].url), nonceOf(objectGets[1].url));
  });
});

test("a deleted object reads as ABSENT immediately, not as the previous body", async () => {
  await withRestStore((_call, index) =>
    index === 0 ? json({ id: "acct-1" }) : new Response("", { status: 404 }),
  async ({ objectGets, mod }) => {
  const before = await mod.findAccountById("acct-1");
  const after = await mod.findAccountById("acct-1");

  assert.equal(before?.id, "acct-1");
  assert.equal(after, null, "absence must be observable on the very next read");
  assert.notEqual(nonceOf(objectGets[0].url), nonceOf(objectGets[1].url));
  });
});

test("existence-proof reads are nonced too — a cached 404 would finalize a deletion over live data", async () => {
  await withRestStore(() => new Response("", { status: 404 }), async ({ objectGets, mod }) => {
  const key = "phase1/accounts/by-id/acct-1.json";
  assert.equal(await mod.sharedIdentityObjectExists(key), false);
  assert.equal(await mod.sharedIdentityObjectExists(key), false);
  assert.notEqual(nonceOf(objectGets[0].url), nonceOf(objectGets[1].url));
  });
});

// ── C. SOURCE GUARD ─────────────────────────────────────────────────────────

test("SOURCE GUARD: authoritative supabase-rest object GETs must go through the nonced builder", () => {
  assert.match(CODE, /function authoritativeRestObjectUrl\(/, "the builder must exist");
  assert.match(CODE, /searchParams\.set\("cacheNonce"/, "and it must set cacheNonce");

  // Every GET of a single object in the REST path must use the builder. A raw template URL for a
  // fixed object is exactly the regression this guards.
  const rawObjectGet = /fetch\(\s*`\$\{sharedRestBase\}\/object\/\$\{sharedStoreBucket\}\/\$\{key\}`\s*,\s*\{\s*method:\s*"GET"/g;
  assert.equal(
    CODE.match(rawObjectGet),
    null,
    "an authoritative object GET must not use a stable fixed-object URL",
  );
});

test("SOURCE GUARD: no positive freshness/TTL cache may wrap the authoritative read", () => {
  for (const forbidden of ["READ_CACHE_TTL", "readCache", "objectCache", "freshnessCache", "nonceCache"]) {
    assert.ok(!CODE.includes(forbidden), `${forbidden} must not exist`);
  }
  // A nonce kept in module scope would be a cache entry by another name.
  assert.ok(
    !/let\s+\w*[Nn]once\w*\s*(:|=)/.test(CODE),
    "the nonce must be generated per read, never held in module state",
  );
});

test("SOURCE GUARD: the AWS / s3-compatible and local paths are untouched by this behaviour", () => {
  // The nonce is a Supabase Storage REST concept. It must not have leaked into the other transports.
  const restOnly = CODE.indexOf("authoritativeRestObjectUrl");
  assert.ok(restOnly > -1);
  assert.ok(!/GetObjectCommand[\s\S]{0,400}cacheNonce/.test(CODE), "S3 path must not carry a cacheNonce");
  assert.ok(!/fs\.readFile[\s\S]{0,200}cacheNonce/.test(CODE), "local-file path must not carry a cacheNonce");
});
