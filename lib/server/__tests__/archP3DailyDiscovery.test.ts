// ARCH-P3 — Daily Discovery (discovery.core + yorisou.daily-symbols), proven rather than described.
//
// The invariants, grouped as the package numbers them:
//   A  the platform contract is brand-free and storage-free
//   B  only symbol_draw is implemented; the other five families stay declarative vocabulary
//   C  the Product Pack lives outside the platform tier, and the platform never imports it
//   D  the pack carries exactly the sixteen Founder-locked result ids
//   E  no fate/destiny/prediction/diagnosis claims anywhere in pack content
//   F/G the discovery runtime reads NOTHING personal beyond its own sessions — no state, memory,
//       reflection, or assessment import can exist
//   H/I one canonical result per owner/day/pack; same-day retries return the SAME result
//   J  the previous 7 results are excluded while alternatives exist; full-pool fallback otherwise
//   K  the client selects nothing (API never reads a body; service derives everything)
//   L/M Today: the utility CTA stays primary; the curiosity entry sits after continuity, before
//       the 5-minute actions
//   N  no reroll / feed / streak / score shapes
//   O  sharing-lite is allowlist-built and non-persistent
//   P/Q production defaults closed; the exact private-pilot token + Founder/Admin gate it
//   R  mutation requires the schema-ready declaration
//   S  the new data family is in the account-erasure plan (test:osf1-erasure-coverage proves the
//      scanner side; here the migration itself is asserted)
//   T  discovery.core registry truth stays partial / DEFINED / not_verified
//   U/V no Imairo knowledge; no ARCH-P4 sharing infrastructure

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import {
  DISCOVERY_PATTERN_FAMILIES,
  eligibleCandidates,
  localDateForTimezone,
} from "@/lib/platform/discoveryCore";
import {
  completeTodaysDiscovery,
  readTodaysDiscovery,
  type DiscoveryRepository,
  type DiscoverySessionRow,
} from "@/lib/server/platform/discoveryCore/service";
import {
  DAILY_SYMBOLS,
  DAILY_SYMBOLS_DEFINITION,
  buildShareText,
  dailySymbolById,
} from "@/packs/yorisou/daily-symbols/pack";
import { discoveryAccess, discoverySchemaReady } from "@/lib/yorisou/discovery/access";
import { PRODUCTION_PILOT_FLAGS, cpv1ProductionPilotAccess } from "@/lib/cpv1/productionPilot";
import { getCapabilityModule } from "@/lib/platform/registry";

const at = (...parts: string[]) => join(process.cwd(), ...parts);
const read = (...parts: string[]) => readFileSync(at(...parts), "utf8");

/** Source with comments stripped — structural scans must judge CODE, not the prose about it. */
const readCode = (...parts: string[]) =>
  read(...parts)
    .split("\n")
    .filter((line) => !/^\s*(\/\/|\*|\/\*|\{\/\*)/.test(line))
    .join("\n");

const OWNER = "acct_arch_p3_owner";
const MIGRATION = "202608180001_dd1_daily_discovery_sessions.sql";

// ── A. platform contract is brand-free and storage-free ─────────────────────

test("A: the platform discovery contract names no product, pack, table, or storage", () => {
  const contract = read("lib", "platform", "discoveryCore.ts").toLowerCase();
  for (const forbidden of ["yorisou", "imairo", "daily-symbols", "discovery_sessions", "supabase", "postgrest", "しるし"]) {
    assert.ok(!contract.includes(forbidden.toLowerCase()), `platform contract mentions "${forbidden}"`);
  }
  assert.ok(!/[぀-ヿ一-鿿]/.test(read("lib", "platform", "discoveryCore.ts")), "no Japanese copy in the platform tier");
});

// ── B. one implemented family, six declared ─────────────────────────────────

test("B: the canonical family vocabulary is complete but only symbol_draw is implemented", () => {
  assert.deepEqual(
    [...DISCOVERY_PATTERN_FAMILIES].sort(),
    ["binary_choice", "mini_story", "seasonal", "symbol_draw", "three_question", "visual_choice"].sort(),
  );
  assert.equal(DAILY_SYMBOLS_DEFINITION.pattern_family, "symbol_draw");
  // No second pack and no second runtime: packs/yorisou contains exactly daily-symbols.
  const packs = readdirSync(at("packs", "yorisou"));
  assert.deepEqual(packs, ["daily-symbols"], "exactly one Product Pack exists in P3");
});

// ── C. pack outside platform; platform never imports it ─────────────────────

test("C: the four-tier separation holds in the import graph", () => {
  assert.ok(existsSync(at("packs", "yorisou", "daily-symbols", "pack.ts")), "pack lives in packs/, not lib/platform");
  for (const file of readdirSync(at("lib", "platform")).filter((f) => f.endsWith(".ts"))) {
    const source = read("lib", "platform", file);
    assert.ok(!source.includes("packs/"), `${file} imports a Product Pack — platform must not know packs`);
  }
});

// ── D. exactly the sixteen Founder-locked results ───────────────────────────

test("D: the pack carries exactly the sixteen approved result ids", () => {
  const approved = [
    "space", "light", "window", "stone", "wave", "thread", "wind", "sprout",
    "bridge", "surface", "key", "guide", "raindrop", "mirror", "door", "footprint",
  ];
  assert.deepEqual(DAILY_SYMBOLS.map((s) => s.id), approved, "result ids or their order drifted from the locked set");
  assert.equal(new Set(DAILY_SYMBOLS.map((s) => s.id)).size, 16);
  for (const symbol of DAILY_SYMBOLS) {
    assert.ok(symbol.mark.length >= 1 && symbol.name.length >= 1, `${symbol.id}: display identity present`);
    assert.ok(symbol.recognition.length > 0 && symbol.prompt.length > 0, `${symbol.id}: content present`);
  }
});

// ── E. content safety register ──────────────────────────────────────────────

test("E: no fate/destiny/prediction/diagnosis claims exist in pack content", () => {
  const packSource = read("packs", "yorisou", "daily-symbols", "pack.ts");
  const forbidden = [
    "運命", "宿命", "未来がわかる", "必ず", "本当の性格", "診断結果", "心理学的", "科学的に証明",
    "当たる", "占い", "タロット", "おみくじ", "易経", "ルーン", "星座", "MBTI",
  ];
  for (const term of forbidden) {
    assert.ok(!packSource.includes(term), `pack content contains forbidden claim vocabulary: "${term}"`);
  }
  assert.ok(packSource.includes("正解や予言ではありません"), "the safety note lost its disclaimer register");
});

// ── F/G. no personal-store imports in the discovery runtime ─────────────────

test("F/G: discovery reads nothing personal beyond its own sessions", () => {
  const files = [
    ["lib", "server", "platform", "discoveryCore", "service.ts"],
    ["lib", "server", "discovery", "store.ts"],
    ["packs", "yorisou", "daily-symbols", "pack.ts"],
    ["app", "api", "discovery", "today", "route.ts"],
  ];
  const forbiddenImports = [
    "lifeOs/store", "dailyCheckInStore", "platform/stateCore", "testResults", "assessmentAttemptStore",
    "hinataMemory", "reflectionAssistant", "method-runtime", "dte", "120q",
  ];
  for (const parts of files) {
    const source = readCode(...parts);
    for (const forbidden of forbiddenImports) {
      assert.ok(!source.includes(forbidden), `${parts.join("/")} reaches into "${forbidden}"`);
    }
  }
});

// ── H/I/J/K. runtime semantics with an injected fake repository ─────────────

function fakeRepository(seedRows: DiscoverySessionRow[] = []) {
  const rows = [...seedRows];
  const completions: Array<Record<string, unknown>> = [];
  const repository: DiscoveryRepository = {
    async getSessionForDate(_owner, localDate, packId) {
      return rows.find((r) => r.local_date === localDate && r.pack_id === packId) ?? null;
    },
    async listRecentResultIds(_owner, packId, limit) {
      return rows
        .filter((r) => r.pack_id === packId)
        .sort((a, b) => (a.local_date < b.local_date ? 1 : -1))
        .slice(0, limit)
        .map((r) => r.result_id);
    },
    async completeSession(input) {
      completions.push({ ...input });
      const existing = rows.find((r) => r.local_date === input.localDate && r.pack_id === input.packId);
      if (existing) return existing; // first writer stays canonical
      const row: DiscoverySessionRow = {
        id: `sess-${rows.length + 1}`,
        local_date: input.localDate,
        pack_id: input.packId,
        pack_version: input.packVersion,
        pattern_family: input.patternFamily,
        result_id: input.resultId,
        completed_at: input.completedAt,
      };
      rows.push(row);
      return row;
    },
  };
  return { repository, rows, completions };
}

const NOW = new Date("2026-08-18T03:00:00.000Z"); // 12:00 JST

test("H/I: one canonical result per owner/day/pack — retries return the same result", async () => {
  const { repository, completions } = fakeRepository();
  const first = await completeTodaysDiscovery({ ownerAccountId: OWNER, definition: DAILY_SYMBOLS_DEFINITION, repository, now: NOW });
  const second = await completeTodaysDiscovery({ ownerAccountId: OWNER, definition: DAILY_SYMBOLS_DEFINITION, repository, now: NOW });
  assert.equal(first.id, second.id, "the second call returned a different session");
  assert.equal(first.result_id, second.result_id, "the second call re-drew");
  assert.equal(completions.length, 1, "the retry short-circuits on the existing canonical row");
  const view = await readTodaysDiscovery({ ownerAccountId: OWNER, definition: DAILY_SYMBOLS_DEFINITION, repository, now: NOW });
  assert.equal(view.session?.result_id, first.result_id);
});

test("H: the pack calendar day is Asia/Tokyo, derived on the server", () => {
  // 2026-08-18T20:00Z is already the 19th in Tokyo — the pack timezone decides, nothing else.
  assert.equal(localDateForTimezone(new Date("2026-08-18T03:00:00Z"), "Asia/Tokyo"), "2026-08-18");
  assert.equal(localDateForTimezone(new Date("2026-08-18T20:00:00Z"), "Asia/Tokyo"), "2026-08-19");
});

test("I: selection is deterministic for the same owner + day + version + eligible set", async () => {
  const a = await completeTodaysDiscovery({ ownerAccountId: OWNER, definition: DAILY_SYMBOLS_DEFINITION, repository: fakeRepository().repository, now: NOW });
  const b = await completeTodaysDiscovery({ ownerAccountId: OWNER, definition: DAILY_SYMBOLS_DEFINITION, repository: fakeRepository().repository, now: NOW });
  assert.equal(a.result_id, b.result_id, "same inputs must select the same symbol on independent runs");
  assert.ok(dailySymbolById(a.result_id), "the selected id resolves to a pack symbol");
});

test("J: the previous 7 results are excluded while alternatives exist, with full-pool fallback", async () => {
  const all = DAILY_SYMBOLS_DEFINITION.result_ids;
  const recent = all.slice(0, 7);
  const eligible = eligibleCandidates(all, recent, 7);
  assert.equal(eligible.length, all.length - 7);
  for (const id of recent) assert.ok(!eligible.includes(id), `recent "${id}" not excluded`);
  // Fallback: exclude everything → the FULL pool returns, never an empty day.
  assert.deepEqual(eligibleCandidates(all.slice(0, 3), all.slice(0, 3), 7), all.slice(0, 3));
  // And the runtime honors the exclusion end-to-end.
  const seeded: DiscoverySessionRow[] = recent.map((id, i) => ({
    id: `old-${i}`, local_date: `2026-08-${10 + i}`, pack_id: DAILY_SYMBOLS_DEFINITION.pack_ref,
    pack_version: "0.1.0", pattern_family: "symbol_draw", result_id: id, completed_at: `2026-08-${10 + i}T03:00:00Z`,
  }));
  const { repository } = fakeRepository(seeded);
  const drawn = await completeTodaysDiscovery({ ownerAccountId: OWNER, definition: DAILY_SYMBOLS_DEFINITION, repository, now: NOW });
  assert.ok(!recent.includes(drawn.result_id), "a recent symbol was re-drawn despite alternatives");
});

test("K: the client selects nothing — the API never reads a body, the service derives everything", () => {
  const route = readCode("app", "api", "discovery", "today", "route.ts");
  assert.ok(!route.includes("request.json"), "the discovery API must not parse a request body");
  assert.ok(!/POST\(request/.test(route), "the POST handler takes no request at all");
  for (const forbidden of ["body.", "searchParams", "formData"]) {
    assert.ok(!route.includes(forbidden), `route lets the client influence selection via ${forbidden}`);
  }
  // result_id appears only as OUTPUT (the response), never as input the handler could read.
  assert.ok(route.includes("result_id: session.result_id"), "the response carries the server-selected result");
  const service = readCode("lib", "server", "platform", "discoveryCore", "service.ts");
  assert.ok(!service.includes("clientResultId"), "service accepts no client-chosen result");
});

// ── L/M. Today placement and primacy ────────────────────────────────────────

test("L/M: Today keeps the utility hero primary; curiosity sits after continuity, before 5-minute actions", () => {
  const page = read("app", "page.tsx");
  const hero = page.indexOf("今の気配を見る");
  const continuity = page.indexOf("<TodaySavedState />");
  const discovery = page.indexOf("<TodayDiscoveryEntry />");
  const shortActions = page.indexOf("5分でできること");
  assert.ok(hero >= 0 && continuity >= 0 && discovery >= 0 && shortActions >= 0, "expected Today sections exist");
  assert.ok(hero < continuity && continuity < discovery && discovery < shortActions,
    "order must be: utility hero → continuity → 今日のひとつ → 5-minute actions");
});

// ── N. refused shapes ───────────────────────────────────────────────────────

test("N: no reroll, feed, streak, score, or countdown shapes exist", () => {
  const surfaces = [
    ["app", "today", "discovery", "page.tsx"],
    ["app", "today", "discovery", "RevealButton.tsx"],
    ["app", "today", "discovery", "ShareButton.tsx"],
    ["app", "TodayDiscoveryEntry.tsx"],
    ["lib", "server", "platform", "discoveryCore", "service.ts"],
  ];
  for (const parts of surfaces) {
    const source = readCode(...parts);
    for (const forbidden of ["reroll", "もう一度引く", "引き直", "streak", "連続", "スコア", "ランキング", "countdown"]) {
      assert.ok(!source.toLowerCase().includes(forbidden.toLowerCase()), `${parts.join("/")} contains "${forbidden}"`);
    }
  }
});

// ── O. sharing-lite: allowlist-built, non-persistent ────────────────────────

test("O: the share derivative carries name + recognition + attribution and nothing else", () => {
  const text = buildShareText({ name: "余白", recognition: DAILY_SYMBOLS[0].recognition });
  assert.ok(text.includes("『余白』") && text.includes(DAILY_SYMBOLS[0].recognition) && text.includes("Yorisou"));
  for (const forbidden of [OWNER, "sess-", "20:", "http"]) {
    assert.ok(!text.includes(forbidden), `share text leaks "${forbidden}"`);
  }
  // Non-persistent: no share table in the migration, no share API, no share deep-link route.
  const migration = read("supabase", "migrations", MIGRATION);
  assert.ok(!migration.includes("share"), "no share persistence exists in P3");
  assert.ok(!existsSync(at("app", "api", "discovery", "share")), "no share API route exists");
});

// ── P/Q/R. gates ────────────────────────────────────────────────────────────

test("P: production and unknown contexts default CLOSED; local/test open; preview needs the exact flag", () => {
  assert.equal(discoveryAccess({ NODE_ENV: "development" }).allowed, true);
  assert.equal(discoveryAccess({ NODE_ENV: "test" }).allowed, true);
  assert.equal(discoveryAccess({ VERCEL_ENV: "production" }).allowed, false);
  assert.equal(discoveryAccess({ VERCEL_ENV: "production" }).reason, "denied_production");
  assert.equal(discoveryAccess({ VERCEL_ENV: "preview" }).allowed, false);
  assert.equal(
    discoveryAccess({ VERCEL_ENV: "preview", YORISOU_CPV1_DEV_FLAGS: "discovery_daily_symbols_preview" }).allowed,
    true,
  );
  assert.equal(
    discoveryAccess({ VERCEL_ENV: "preview", YORISOU_CPV1_DEV_FLAGS: "discovery_daily_symbols_previewX" }).allowed,
    false,
    "near-miss tokens must not authorize",
  );
});

test("Q: production access requires the exact pilot token AND Founder/Admin", () => {
  assert.ok((PRODUCTION_PILOT_FLAGS as readonly string[]).includes("discovery_daily_symbols_private_pilot"));
  const env = { VERCEL_ENV: "production", YORISOU_PRIVATE_PILOT_FLAGS: "discovery_daily_symbols_private_pilot" };
  const grant = (authenticated: boolean, isFounderAdmin: boolean) =>
    cpv1ProductionPilotAccess({
      authenticated, isFounderAdmin, routeAuthorized: true,
      requiredFlag: "discovery_daily_symbols_private_pilot", env,
    });
  assert.equal(grant(true, true).allowed, true);
  assert.equal(grant(true, false).allowed, false);
  assert.equal(grant(false, false).allowed, false);
  assert.equal(
    cpv1ProductionPilotAccess({
      authenticated: true, isFounderAdmin: true, routeAuthorized: true,
      requiredFlag: "discovery_daily_symbols_private_pilot", env: { VERCEL_ENV: "production" },
    }).allowed,
    false,
    "flag absent → denied even for the Founder",
  );
});

test("R: mutation requires the schema-ready declaration", () => {
  assert.equal(discoverySchemaReady({}), false);
  assert.equal(discoverySchemaReady({ YORISOU_DISCOVERY_SCHEMA_READY: "true" }), true);
  assert.equal(discoverySchemaReady({ YORISOU_DISCOVERY_SCHEMA_READY: "TRUE " }), true);
  assert.equal(discoverySchemaReady({ YORISOU_DISCOVERY_SCHEMA_READY: "1" }), false, "only the exact word");
  const route = read("app", "api", "discovery", "today", "route.ts");
  assert.ok(route.includes("discoverySchemaReady()"), "the mutation route checks schema readiness");
  assert.ok(route.includes("discovery_not_accepting_entries"), "refusal is named, before persistence");
});

// ── S. data lifecycle ───────────────────────────────────────────────────────

test("S: the new family joins the erasure plan in the same migration that creates it", () => {
  const migration = read("supabase", "migrations", MIGRATION);
  assert.ok(migration.includes("create table if not exists public.yorisou_discovery_sessions"));
  assert.ok(migration.includes("['yorisou_discovery_sessions', 'owner_account_id']"), "family missing from v_plan");
  assert.ok(migration.includes("yorisou_account_deletion_erase_database_unchecked"), "erasure plan re-emitted");
  assert.ok(migration.includes("constraint yorisou_discovery_sessions_owner_day_pack unique"), "one-per-day truth");
  assert.ok(migration.includes("enable row level security"));
  assert.ok(!/update\s+public\.yorisou_discovery_sessions/i.test(migration), "no update path exists");
});

// ── T. module truth ─────────────────────────────────────────────────────────

test("T: discovery.core stays partial / DEFINED / not_verified", () => {
  const entry = getCapabilityModule("discovery.core");
  assert.ok(entry);
  assert.equal(entry.adoption_status, "partial");
  assert.equal(entry.lifecycle_state, "DEFINED");
  assert.equal(entry.verification_state, "not_verified");
});

// ── U/V. protected boundaries ───────────────────────────────────────────────

test("U/V: no Imairo knowledge and no ARCH-P4 sharing infrastructure anywhere in DD-1", () => {
  const files = [
    ["lib", "platform", "discoveryCore.ts"],
    ["lib", "server", "platform", "discoveryCore", "service.ts"],
    ["lib", "server", "discovery", "store.ts"],
    ["packs", "yorisou", "daily-symbols", "pack.ts"],
    ["app", "today", "discovery", "page.tsx"],
    ["app", "TodayDiscoveryEntry.tsx"],
  ];
  for (const parts of files) {
    const source = read(...parts).toLowerCase();
    for (const forbidden of ["imairo", "ima-iro", "120q", "shareobject", "share_object", "deep_link", "deeplink"]) {
      assert.ok(!source.includes(forbidden), `${parts.join("/")} contains "${forbidden}"`);
    }
  }
});
