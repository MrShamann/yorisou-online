// ARCH-P4 — sharing.core (Imairo Result Card), proven rather than described.
//
// The three boundaries this package exists to make structural:
//   1. a public link carries a high-entropy public_id and NOTHING semantic;
//   2. the public route reads ONLY the stored safe derivative — never back to the private source;
//   3. preview and publish are the SAME payload, locked by a digest the client cannot forge.
//
// Invariants A–Y as numbered by the package.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import { canonicalJson, computeShareDigest, type ShareCandidate } from "@/lib/platform/sharingCore";
import {
  buildSharePreview,
  publishShare,
  readPublicShare,
  revokeShare,
  revokeSharesBySource,
  type SharingRepository,
} from "@/lib/server/platform/sharingCore/service";
import {
  IMAIRO_SHARE_CARD_FAMILY,
  IMAIRO_SHARE_PAYLOAD_VERSION,
  IMAIRO_SHARE_SOURCE_FAMILY,
  IMAIRO_SHARE_TEMPLATE_VERSION,
  buildImairoShareCandidate,
  validateImairoSharePayload,
  type ImairoSharePayload,
} from "@/packs/yorisou/imairo/share";
import { sharingCoreAccess, sharingOperational, sharingSchemaReady } from "@/lib/yorisou/sharing/access";
import { getCapabilityModule } from "@/lib/platform/registry";
import { PUBLIC_ARCHETYPE_TAXONOMY } from "@/lib/yorisou/public-result";

const at = (...p: string[]) => join(process.cwd(), ...p);
const read = (...p: string[]) => readFileSync(at(...p), "utf8");
const readCode = (...p: string[]) =>
  read(...p)
    .split("\n")
    .filter((line) => !/^\s*(\/\/|\*|\/\*|\{\/\*)/.test(line))
    .join("\n");

const OWNER = "acct_arch_p4_owner";
const SOURCE_REF = "11111111-2222-4333-8444-555555555555";
const PUBLIC_ID = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
const SAMPLE_CODE = PUBLIC_ARCHETYPE_TAXONOMY[0].publicCode;

function candidate(): ShareCandidate<ImairoSharePayload> {
  const built = buildImairoShareCandidate({ publicResultCode: SAMPLE_CODE, sourceRef: SOURCE_REF });
  assert.ok(built, "the sample public code must resolve to an assigned archetype");
  return built;
}

// ── A. platform contract is brand-free ──────────────────────────────────────

test("A: the sharing platform contract names no product, pack, table, or route", () => {
  const source = read("lib", "platform", "sharingCore.ts").toLowerCase();
  for (const forbidden of ["yorisou", "imairo", "share_objects", "supabase", "postgrest", "/share/"]) {
    assert.ok(!source.includes(forbidden), `platform contract mentions "${forbidden}"`);
  }
  assert.ok(!/[぀-ヿ一-鿿]/.test(read("lib", "platform", "sharingCore.ts")), "no Japanese copy in platform tier");
});

// ── B/U. exactly one formal family ──────────────────────────────────────────

test("B/U: exactly one formal share family is implemented (imairo_result_card)", () => {
  assert.equal(IMAIRO_SHARE_CARD_FAMILY, "imairo_result_card");
  for (const forbidden of ["daily_discovery_card", "pair_result_card", "monthly_story_card"]) {
    assert.ok(!read("packs", "yorisou", "imairo", "share.ts").includes(forbidden), `${forbidden} formalized`);
    assert.ok(!read("lib", "server", "sharing", "store.ts").includes(forbidden), `${forbidden} persisted`);
  }
  assert.ok(!existsSync(at("app", "api", "shares", "discovery")), "no discovery share API exists");
});

// ── C. pack owns Imairo; platform knows nothing of it ───────────────────────

test("C: the pack owns the Imairo mapping and the platform tier never imports it", () => {
  assert.ok(existsSync(at("packs", "yorisou", "imairo", "share.ts")));
  for (const file of readdirSync(at("lib", "platform")).filter((f) => f.endsWith(".ts"))) {
    const source = read("lib", "platform", file);
    assert.ok(!source.includes("packs/"), `${file} imports a Product Pack`);
    assert.ok(!/imairo/i.test(source), `${file} mentions the protected assessment`);
  }
});

// ── D. allowlist-built, not redacted ────────────────────────────────────────

test("D: the derivative is allowlist-BUILT from approved public content", () => {
  const payload = candidate().payload;
  assert.deepEqual(
    Object.keys(payload).sort(),
    ["code_line", "display_line", "global_note", "hero_chips", "highlights", "locale", "recognition_line", "result_code", "share_line", "test_name"],
  );
  // The builder constructs field-by-field; it never receives, and so cannot redact, a private view.
  const packSource = readCode("packs", "yorisou", "imairo", "share.ts");
  assert.ok(!packSource.includes("PersistedResultView"), "the pack must not see the private view type");
  assert.ok(!/delete\s+payload/.test(packSource), "fields are never deleted from a private object");
});

// ── E/31. no private identity can reach the payload or the link ─────────────

test("E: private identifiers can never enter a payload — validation refuses each one", () => {
  const base = candidate().payload as unknown as Record<string, unknown>;
  const forbidden = [
    "owner_account_id", "source_ref", "result_row_id", "attempt_id", "completion_id",
    "raw_answers", "answers", "scores", "confidence", "payloadKey", "acceptedResultId",
    "memory", "state", "reflection", "report", "email",
  ];
  for (const key of forbidden) {
    assert.throws(
      () => validateImairoSharePayload({ ...base, [key]: "x" }),
      /share_payload_forbidden_key/,
      `payload accepted forbidden key: ${key}`,
    );
  }
  // Nested too — the scan is depth-first, not top-level.
  assert.throws(
    () => validateImairoSharePayload({ ...base, highlights: [{ label: "a", text: "b", source_ref: SOURCE_REF }] }),
    /share_payload_forbidden_key/,
  );
  // And the built payload never contains the source ref by value.
  assert.ok(!JSON.stringify(candidate().payload).includes(SOURCE_REF));
});

// ── F/H. preview is mandatory; publish rebuilds and verifies ────────────────

function fakeRepo(seed: { publicId?: string } = {}) {
  const rows: Array<{ publicId: string; digest: string; payload: unknown; revoked: boolean; sourceRef: string }> = [];
  const repository: SharingRepository = {
    async publish({ candidate: c, digest }) {
      const active = rows.find((r) => !r.revoked && r.digest === digest && r.sourceRef === c.source_ref);
      if (active) {
        return { reference: { public_id: active.publicId, card_family: c.card_family, template_version: c.template_version, published_at: "t" }, reused: true };
      }
      const publicId = seed.publicId ?? PUBLIC_ID;
      rows.push({ publicId, digest, payload: c.payload, revoked: false, sourceRef: c.source_ref });
      return { reference: { public_id: publicId, card_family: c.card_family, template_version: c.template_version, published_at: "t" }, reused: false };
    },
    async revoke(_owner, publicId) {
      const row = rows.find((r) => r.publicId === publicId && !r.revoked);
      if (!row) return false;
      row.revoked = true;
      return true;
    },
    async revokeBySource(_family, sourceRef) {
      let n = 0;
      for (const row of rows) if (row.sourceRef === sourceRef && !row.revoked) { row.revoked = true; n += 1; }
      return n;
    },
    async activeForSource() { return null; },
    async publicView(publicId) {
      const row = rows.find((r) => r.publicId === publicId && !r.revoked);
      if (!row) return null;
      return {
        public_id: row.publicId, card_family: IMAIRO_SHARE_CARD_FAMILY,
        template_version: IMAIRO_SHARE_TEMPLATE_VERSION, payload_version: IMAIRO_SHARE_PAYLOAD_VERSION,
        payload: row.payload, published_at: "t",
      };
    },
  };
  return { repository, rows };
}

test("F/H: publish requires the preview digest of the SERVER-rebuilt candidate", async () => {
  const { repository } = fakeRepo();
  const preview = buildSharePreview(candidate(), validateImairoSharePayload);
  const published = await publishShare({
    ownerAccountId: OWNER, candidate: candidate(), previewDigest: preview.digest,
    validate: validateImairoSharePayload, repository,
  });
  assert.equal(published.reference.public_id, PUBLIC_ID);
  assert.equal(published.reused, false);

  // A stale/forged digest is refused outright.
  await assert.rejects(
    publishShare({
      ownerAccountId: OWNER, candidate: candidate(), previewDigest: "0".repeat(64),
      validate: validateImairoSharePayload, repository,
    }),
    /share_preview_stale/,
  );
});

test("F: the digest is content-addressed and key-order independent", () => {
  const c = candidate();
  const reordered = { ...c, payload: Object.fromEntries(Object.entries(c.payload).reverse()) } as typeof c;
  assert.equal(computeShareDigest(c), computeShareDigest(reordered), "key order must not change the digest");
  const mutated = { ...c, payload: { ...c.payload, display_line: c.payload.display_line + "!" } };
  assert.notEqual(computeShareDigest(c), computeShareDigest(mutated), "content change must change the digest");
  assert.equal(canonicalJson({ b: 1, a: 2 }), '{"a":2,"b":1}');
});

// ── G. the client cannot choose card content ────────────────────────────────

test("G: the publish/preview APIs accept no card copy from the client", () => {
  for (const route of [
    ["app", "api", "shares", "imairo", "preview", "route.ts"],
    ["app", "api", "shares", "imairo", "publish", "route.ts"],
  ]) {
    const source = readCode(...route);
    for (const forbidden of ["body.payload", "body.display_line", "body.recognition", "body.share_line", "body.card"]) {
      assert.ok(!source.includes(forbidden), `${route.join("/")} reads client card content via ${forbidden}`);
    }
    assert.ok(source.includes("buildOwnedImairoShareCandidate"), "the server rebuilds from the private source");
  }
  const publish = readCode("app", "api", "shares", "imairo", "publish", "route.ts");
  assert.ok(publish.includes("previewDigest"), "publish requires the preview digest");
});

// ── I. published objects are immutable ──────────────────────────────────────

test("I: nothing can update a published payload — no update path exists", () => {
  const store = readCode("lib", "server", "sharing", "store.ts");
  assert.ok(!/update/i.test(store.replace(/updated_at/g, "")), "the store exposes no update path");
  const migration = read("supabase", "migrations", "202608180002_shr1_share_objects.sql");
  // The only UPDATEs in SQL set revoked_at — a lifecycle timestamp, never payload content.
  for (const stmt of migration.match(/update public\.yorisou_share_objects[\s\S]*?;/g) ?? []) {
    assert.match(stmt, /set revoked_at = now\(\)/, `non-revocation UPDATE found: ${stmt.slice(0, 80)}`);
  }
  assert.ok(!/set\s+public_payload/i.test(migration), "payload is never reassigned");
});

// ── J/31. the deep link carries only the public id ──────────────────────────

test("J: the public link contains only public_id (+ presentation-only params)", () => {
  const publish = readCode("app", "api", "shares", "imairo", "publish", "route.ts");
  assert.match(publish, /share_path: `\/share\/\$\{published\.reference\.public_id\}`/);
  // The share path is built from public_id alone — no result semantics can ride along.
  const pathLine = /share_path: `([^`]+)`/.exec(publish)?.[1] ?? "";
  for (const key of ["resultId", "overlayId", "confidence", "payloadKey", "resultRowId", "owner"]) {
    assert.ok(!pathLine.includes(key), `the share path carries ${key}`);
  }
  const page = readCode("app", "share", "[publicId]", "page.tsx");
  assert.ok(!page.includes("searchParams.resultId"), "the public page reads no result parameters");
});

// ── K. public read touches nothing private ──────────────────────────────────

test("K: the public deep-link page reads ONLY the stored share payload", () => {
  const page = readCode("app", "share", "[publicId]", "page.tsx");
  for (const forbidden of [
    "loadPersistedAssessmentResult", "assessmentAttemptStore", "getResultById", "persistedResultView",
    "lifeOs/store", "platform/stateCore", "recommendation", "hinataMemory", "deriveCurrentUnderstanding",
  ]) {
    assert.ok(!page.includes(forbidden), `the public page reaches into "${forbidden}"`);
  }
  assert.ok(page.includes("readPublicShare"), "the page reads through the sharing capability only");
});

// ── L. invalid, unknown and revoked conceal identically ─────────────────────

test("L: unknown, malformed and revoked ids all conceal the same way", async () => {
  const { repository } = fakeRepo();
  const preview = buildSharePreview(candidate(), validateImairoSharePayload);
  await publishShare({ ownerAccountId: OWNER, candidate: candidate(), previewDigest: preview.digest, validate: validateImairoSharePayload, repository });

  const args = { expectedFamily: IMAIRO_SHARE_CARD_FAMILY, expectedPayloadVersion: IMAIRO_SHARE_PAYLOAD_VERSION, validate: validateImairoSharePayload, repository };
  assert.ok(await readPublicShare<ImairoSharePayload>({ publicId: PUBLIC_ID, ...args }), "published is readable");
  assert.equal(await readPublicShare({ publicId: "ffffffff-0000-4000-8000-000000000000", ...args }), null, "unknown → null");
  await revokeShare(OWNER, PUBLIC_ID, repository);
  assert.equal(await readPublicShare({ publicId: PUBLIC_ID, ...args }), null, "revoked → null");

  // A stored payload that no longer validates fails CLOSED rather than rendering partially.
  const broken: SharingRepository = {
    ...repository,
    async publicView() {
      return { public_id: PUBLIC_ID, card_family: IMAIRO_SHARE_CARD_FAMILY, template_version: "1.0.0", payload_version: IMAIRO_SHARE_PAYLOAD_VERSION, payload: { nope: true }, published_at: "t" };
    },
  };
  assert.equal(await readPublicShare({ publicId: PUBLIC_ID, ...args, repository: broken }), null, "malformed → null");
  // Wrong family / wrong payload version are refused too.
  const wrongFamily: SharingRepository = {
    ...repository,
    async publicView() {
      return { public_id: PUBLIC_ID, card_family: "other_card", template_version: "1.0.0", payload_version: IMAIRO_SHARE_PAYLOAD_VERSION, payload: candidate().payload, published_at: "t" };
    },
  };
  assert.equal(await readPublicShare({ publicId: PUBLIC_ID, ...args, repository: wrongFamily }), null, "wrong family → null");
});

// ── M. owner revoke exists in the product ───────────────────────────────────

test("M: the owner can revoke from the product, and revoke is idempotent", async () => {
  const { repository } = fakeRepo();
  const preview = buildSharePreview(candidate(), validateImairoSharePayload);
  await publishShare({ ownerAccountId: OWNER, candidate: candidate(), previewDigest: preview.digest, validate: validateImairoSharePayload, repository });
  assert.equal(await revokeShare(OWNER, PUBLIC_ID, repository), true);
  assert.equal(await revokeShare(OWNER, PUBLIC_ID, repository), false, "second revoke is a safe no-op");
  const ui = read("app", "components", "ShareObjectActions.tsx");
  assert.ok(ui.includes("共有リンクを無効にする"), "the revoke control exists in the UI");
  assert.ok(existsSync(at("app", "api", "shares", "[publicId]", "revoke", "route.ts")), "the revoke API exists");
});

// ── N/O. data lifecycle ─────────────────────────────────────────────────────

test("N: account erasure covers the new share family", () => {
  const migration = read("supabase", "migrations", "202608180002_shr1_share_objects.sql");
  assert.ok(migration.includes("['yorisou_share_objects', 'owner_account_id']"), "family missing from v_plan");
  assert.ok(migration.includes("['yorisou_discovery_sessions', 'owner_account_id']"), "prior family dropped");
});

test("O: source-result erasure revokes active derivatives, and revoke runs BEFORE erase", async () => {
  const { repository, rows } = fakeRepo();
  const preview = buildSharePreview(candidate(), validateImairoSharePayload);
  await publishShare({ ownerAccountId: OWNER, candidate: candidate(), previewDigest: preview.digest, validate: validateImairoSharePayload, repository });
  assert.equal(await revokeSharesBySource(IMAIRO_SHARE_SOURCE_FAMILY, SOURCE_REF, repository), 1);
  assert.equal(rows[0].revoked, true);

  // Ordering is structural in the erasure route: revoke first, so no dangling public card exists.
  const route = readCode("app", "api", "assessment", "results", "[id]", "route.ts");
  const revokeAt = route.indexOf("revokeSharesBySource");
  const eraseAt = route.indexOf("await eraseAssessmentResult");
  assert.ok(revokeAt > 0 && eraseAt > 0, "both calls exist in the erasure route");
  assert.ok(revokeAt < eraseAt, "shares must be revoked BEFORE the source is erased");
});

// ── P/Q/R. legacy compatibility survives ────────────────────────────────────

test("P/Q/R: the legacy share route and its private-identity guard are untouched", () => {
  assert.ok(existsSync(at("app", "result", "share", "page.tsx")), "/result/share still exists");
  const identity = read("app", "result", "resultIdentityRoutes.ts");
  assert.ok(identity.includes("buildPublicShareHref"), "the legacy public-share helper survives");
  // Slice the helper's OWN body (to its closing brace) — a naive slice-to-end would sweep in the
  // rest of the file, where the PRIVATE-continuity builder legitimately uses the row-id key.
  const start = identity.indexOf("export function buildPublicShareHref");
  const helper = identity.slice(start, identity.indexOf("\n}", start));
  assert.ok(!helper.includes("PERSISTED_RESULT_QUERY_KEY"), "the private row id must never enter the public href");
  assert.ok(!helper.includes("resultRowId"), "the public href builder never sees the private row id");
  // Fallback: the result page still renders the legacy actions when the formal flow is unavailable.
  const page = read("app", "result", "page.tsx");
  assert.ok(page.includes("<ResultShareActions"), "legacy share actions remain the fallback");
  assert.ok(page.includes("shareObjectState ?"), "the formal flow is conditional, never the only path");
});

// ── S. P3 sharing-lite untouched ────────────────────────────────────────────

test("S: Daily Discovery sharing-lite is untouched by P4", () => {
  const shareButton = read("app", "today", "discovery", "ShareButton.tsx");
  assert.ok(shareButton.includes("buildShareText"), "discovery still uses its own sharing-lite text");
  for (const forbidden of ["sharingCore", "ShareObject", "/api/shares"]) {
    assert.ok(!shareButton.includes(forbidden), `discovery sharing-lite was pulled into P4 via ${forbidden}`);
  }
});

// ── Gates ───────────────────────────────────────────────────────────────────

test("gates: production is CLOSED without the explicit public switch; preview needs the exact flag", () => {
  assert.equal(sharingCoreAccess({ VERCEL_ENV: "production" }).allowed, false);
  assert.equal(sharingCoreAccess({ VERCEL_ENV: "production" }).reason, "denied_production");
  assert.equal(sharingCoreAccess({ VERCEL_ENV: "production", YORISOU_SHARING_PUBLIC_ENABLED: "true" }).allowed, true);
  assert.equal(sharingCoreAccess({ VERCEL_ENV: "production", YORISOU_SHARING_PUBLIC_ENABLED: "1" }).allowed, false);
  assert.equal(sharingCoreAccess({ VERCEL_ENV: "preview" }).allowed, false);
  assert.equal(sharingCoreAccess({ VERCEL_ENV: "preview", YORISOU_CPV1_DEV_FLAGS: "sharing_core_preview" }).allowed, true);
  assert.equal(sharingCoreAccess({}).allowed, false, "unknown context fails closed");
  // Schema readiness is a separate, exact declaration; operational requires BOTH.
  assert.equal(sharingSchemaReady({}), false);
  assert.equal(sharingSchemaReady({ YORISOU_SHARING_SCHEMA_READY: "true" }), true);
  assert.equal(sharingOperational({ NODE_ENV: "test" }), false, "gate open but schema not ready → not operational");
  assert.equal(sharingOperational({ NODE_ENV: "test", YORISOU_SHARING_SCHEMA_READY: "true" }), true);
});

// ── V/W/X/Y. protected boundaries and module truth ──────────────────────────

test("V: no Imairo methodology change — the pack only reads approved public output", () => {
  // `getTemporary120QResultCompatibility` is the APPROVED PUBLIC content resolver the legacy share
  // card already uses, so its name (which contains "120Q") is expected here. What must be absent is
  // methodology: scoring, dimensions, raw questions, or re-running assignment.
  // Exclude the blocklist itself: IMAIRO_SHARE_FORBIDDEN_KEYS names the very terms it refuses
  // (dimension_output, raw_answers, …), so scanning it would flag the guard for doing its job.
  const raw = readCode("packs", "yorisou", "imairo", "share.ts");
  const blocklistStart = raw.indexOf("export const IMAIRO_SHARE_FORBIDDEN_KEYS");
  const blocklistEnd = raw.indexOf("] as const;", blocklistStart);
  const packSource = (raw.slice(0, blocklistStart) + raw.slice(blocklistEnd)).replace(
    /getTemporary120QResultCompatibility/g,
    "APPROVED_PUBLIC_CONTENT_RESOLVER",
  );
  for (const forbidden of ["120q", "scoring", "dimension", "assignPublicArchetype", "questions", "answers"]) {
    assert.ok(!packSource.toLowerCase().includes(forbidden), `the share pack touches "${forbidden}"`);
  }
  // And the protected runtime itself is untouched by this package.
  assert.ok(!packSource.includes("data/yorisou/120q"), "the pack must not read the protected question bank");
});

test("W: sharing.core registry truth stays partial / DEFINED / not_verified", () => {
  const entry = getCapabilityModule("sharing.core");
  assert.ok(entry);
  assert.equal(entry.adoption_status, "partial");
  assert.equal(entry.lifecycle_state, "DEFINED");
  assert.equal(entry.verification_state, "not_verified");
});

test("X/Y: no ARCH-P5 connection/comparison, community or matching appeared", () => {
  for (const path of [["app", "connect"], ["app", "api", "connections"], ["app", "api", "comparisons"]]) {
    assert.ok(!existsSync(at(...path)), `${path.join("/")} exists — P5 scope leaked`);
  }
  const store = readCode("lib", "server", "sharing", "store.ts");
  for (const forbidden of ["connection", "comparison", "community", "matching", "recipient"]) {
    assert.ok(!store.toLowerCase().includes(forbidden), `sharing store mentions "${forbidden}"`);
  }
});
