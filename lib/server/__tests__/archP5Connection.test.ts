import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// ARCH-P5 — the connection.core + comparison.core boundary suite.
//
// It proves three different KINDS of thing, and the difference matters:
//
//   * BEHAVIOUR of the pure platform tier and the Imairo pair adapter, executed for real.
//   * STRUCTURE that no runtime test can see — that the platform tier does not import a Product
//     Pack, that a URL carries only a public id, that a route uses the derivative erasure seam.
//   * ABSENCE — that P5 did not quietly grow a feed, a DM, matching, or a Memory write.
//
// It deliberately does NOT try to prove concurrency or database authorization. Those are database
// facts and belong to the PostgreSQL acceptance harness; asserting them here against source
// strings is what ARCH-P4 review correctly rejected.

import {
  COMPARISON_OUTPUT_FAMILIES,
  assertComparisonViewShape,
  assertDistinctParticipants,
  toAdapterInput,
  type ComparisonInputReference,
} from "@/lib/platform/comparisonCore";
import {
  connectionViewFor,
  isInvitationOpen,
  isPairParticipant,
  type PairContext,
} from "@/lib/platform/connectionCore";
import { buildComparison, readComparison, renderComparisonFor } from "@/lib/server/platform/comparisonCore/service";
import {
  assertNoForbiddenPairLanguage,
  imairoPairAdapter,
  IMAIRO_PAIR_FAMILY_LABELS,
  IMAIRO_PAIR_REFERENCE_FAMILY,
} from "@/packs/yorisou/imairo/pair";
import {
  connectionCoreAccess,
  connectionOperational,
  connectionDerivativeSchemaReady,
  CONNECTION_PREVIEW_FLAG,
} from "@/lib/yorisou/connection/access";
import { CAPABILITY_MODULES } from "@/lib/platform/registry";
import { CPV1_DEV_FLAGS } from "@/lib/cpv1/deploymentContext";

const read = (path: string) => readFileSync(path, "utf8");

/**
 * Source with comments removed.
 *
 * The forbidden-vocabulary scans below must read CODE, not prose. Several of these files explain
 * at length which fields they are forbidden to touch — naming them in order to rule them out — and
 * a scan over raw text flags exactly the documentation that makes the boundary legible. Stripping
 * comments first is the difference between "this file uses raw answers" and "this file says it
 * does not".
 */
function code(path: string): string {
  return read(path)
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");
}

/** Real approved public archetype codes. MS-KI and MS-SZ share a clan; EM-AK does not. */
const SAME_A = "MS-KI";
const SAME_CLAN = "MS-SZ";
const OTHER_CLAN = "EM-AK";

function side(participant: string, code: string): ComparisonInputReference {
  return {
    participant_ref: participant,
    reference_family: IMAIRO_PAIR_REFERENCE_FAMILY,
    reference_ref: `row-${participant}`,
    public_reference: code,
  };
}

// ─── A/B/C — the platform tier is brand-free ────────────────────────────────

const PLATFORM_FILES = [
  "lib/platform/connectionCore.ts",
  "lib/platform/comparisonCore.ts",
  "lib/server/platform/connectionCore/service.ts",
  "lib/server/platform/comparisonCore/service.ts",
];

test("A/B. the connection and comparison platform tiers carry no product identity", () => {
  // Deliberately includes Japanese: a platform file containing consumer copy has stopped being a
  // capability and become a product.
  const branded = [
    /imairo/i,
    /yorisou/i,
    /ふたり/,
    /いま色/,
    /\bP0[0-9]\b/,
    /120q/i,
    /supabase/i,
    /yorisou_connection/,
    /yorisou_pair/,
  ];
  for (const file of PLATFORM_FILES) {
    const source = code(file);
    for (const pattern of branded) {
      assert.ok(
        !pattern.test(source),
        `${file} mentions ${pattern} — the platform tier must not know the product, its storage or its language`,
      );
    }
  }
});

test("C. the platform tier imports no Product Pack and no app route", () => {
  for (const file of PLATFORM_FILES) {
    const source = read(file);
    assert.ok(!/from\s+"@\/packs\//.test(source), `${file} imports a Product Pack — the dependency is inverted`);
    assert.ok(!/from\s+"@\/app\//.test(source), `${file} imports an app route`);
    assert.ok(!/from\s+"@\/lib\/yorisou\//.test(source), `${file} imports product code`);
  }
});

// ─── D — connection consent is not data access ──────────────────────────────

test("D. a pair view gives a participant NOTHING about the other person's identity or source", () => {
  const pair: PairContext = {
    pair_public_id: "pair-1",
    status: "active",
    grants: [
      { participant_ref: "acct-a", reference_family: "assessment_result", reference_ref: "row-a" },
      { participant_ref: "acct-b", reference_family: "assessment_result", reference_ref: "row-b" },
    ],
    created_at: "2026-08-19T00:00:00.000Z",
  };
  const view = connectionViewFor(pair, "acct-a");
  const serialized = JSON.stringify(view);
  assert.ok(!serialized.includes("acct-b"), "the other participant's account reference leaked into the view");
  assert.ok(!serialized.includes("row-b"), "the other participant's source reference leaked into the view");
  assert.ok(!serialized.includes("row-a"), "even the viewer's own source reference does not belong in the view");
  assert.equal(Object.keys(view).sort().join(","),
    "created_at,other_reference_family,pair_public_id,self_reference_family,status");
});

test("D. a non-participant cannot obtain a view at all", () => {
  const pair: PairContext = {
    pair_public_id: "pair-1",
    status: "active",
    grants: [
      { participant_ref: "acct-a", reference_family: "assessment_result", reference_ref: "row-a" },
      { participant_ref: "acct-b", reference_family: "assessment_result", reference_ref: "row-b" },
    ],
    created_at: "2026-08-19T00:00:00.000Z",
  };
  assert.equal(isPairParticipant(pair, "acct-c"), false);
  assert.throws(() => connectionViewFor(pair, "acct-c"), /connection_viewer_not_participant/);
});

// ─── E/F — comparison accepts only granted references ───────────────────────

test("E. comparison refuses two sides from the same participant", () => {
  assert.throws(
    () =>
      assertDistinctParticipants({
        pair_ref: "p",
        adapter_ref: "a",
        adapter_version: "1",
        side_a: side("acct-a", SAME_A),
        side_b: side("acct-a", SAME_CLAN),
      }),
    /comparison_participants_identical/,
  );
});

test("E. comparison refuses a reference family the adapter does not understand", () => {
  assert.throws(
    () =>
      buildComparison(
        {
          pair_ref: "p",
          adapter_ref: imairoPairAdapter.adapter_ref,
          adapter_version: "1.0.0",
          side_a: { ...side("acct-a", SAME_A), reference_family: "some_other_family" },
          side_b: side("acct-b", OTHER_CLAN),
        },
        imairoPairAdapter,
      ),
    /comparison_reference_family_mismatch/,
  );
});

test("F. the pair adapter reads the PUBLIC code only, never the private row reference", () => {
  const a = { ...side("acct-a", SAME_A), reference_ref: "SECRET-ROW-A" };
  const b = { ...side("acct-b", OTHER_CLAN), reference_ref: "SECRET-ROW-B" };
  const view = imairoPairAdapter.build(a, b);
  const serialized = JSON.stringify(view);
  assert.ok(!serialized.includes("SECRET-ROW-A"), "a private row reference reached rendered copy");
  assert.ok(!serialized.includes("SECRET-ROW-B"), "a private row reference reached rendered copy");
  assert.ok(!serialized.includes("acct-a") && !serialized.includes("acct-b"), "an account reference reached copy");
});

test("F. no raw-answer, score or private-text vocabulary exists in the pair pack", () => {
  const source = code("packs/yorisou/imairo/pair.ts");
  for (const forbidden of [
    "dimension_output",
    "dimensionOutput",
    "raw_answers",
    "answers",
    "confidence",
    "payloadKey",
    "acceptedResultId",
    "correctedResultId",
    "reflection",
    "memory",
  ]) {
    assert.ok(
      !new RegExp(`\\b${forbidden}\\b`).test(source),
      `the pair pack references ${forbidden} — it may read only the approved public assignment`,
    );
  }
});

// ─── G — exactly five output families ───────────────────────────────────────

test("G. a comparison has exactly the five semantic families", () => {
  assert.deepEqual([...COMPARISON_OUTPUT_FAMILIES], [
    "similarities",
    "differences",
    "possible_complementarity",
    "possible_friction",
    "shared_question",
  ]);
  const view = imairoPairAdapter.build(side("acct-a", SAME_A), side("acct-b", OTHER_CLAN));
  assert.deepEqual(Object.keys(view).sort(), [...COMPARISON_OUTPUT_FAMILIES].sort());
  assert.deepEqual(Object.keys(IMAIRO_PAIR_FAMILY_LABELS).sort(), [...COMPARISON_OUTPUT_FAMILIES].sort());
});

test("G. a sixth family — including a smuggled score — is refused", () => {
  const base = imairoPairAdapter.build(side("acct-a", SAME_A), side("acct-b", OTHER_CLAN));
  assert.throws(
    () => assertComparisonViewShape({ ...base, compatibility_score: 92 }),
    /comparison_view_unexpected_families/,
  );
  assert.throws(() => assertComparisonViewShape({ ...base, similarities: undefined }), /comparison_view/);
});

// ─── H — forbidden vocabulary ───────────────────────────────────────────────

test("H. compatibility, soulmate and deterministic vocabulary is refused by the guard", () => {
  for (const line of [
    "相性は92%です",
    "ふたりは相性がいい",
    "あなたたちはソウルメイトです",
    "This is a perfect match",
    "運命の相手です",
    "必ずうまくいきます",
    "９０％の一致",
  ]) {
    assert.throws(() => assertNoForbiddenPairLanguage(line), /imairo_pair_forbidden/, `not refused: ${line}`);
  }
});

test("H. every line the adapter can produce passes its own language guard", () => {
  // Exercise all three branches the adapter distinguishes: same code, same clan, different clans.
  for (const [a, b] of [[SAME_A, SAME_A], [SAME_A, SAME_CLAN], [SAME_A, OTHER_CLAN]]) {
    const view = imairoPairAdapter.build(side("acct-a", a), side("acct-b", b));
    assertComparisonViewShape(view);
    for (const family of COMPARISON_OUTPUT_FAMILIES) {
      const value = view[family];
      const lines = typeof value === "string" ? [value] : value;
      assert.ok(lines.length > 0, `${family} is empty for ${a}/${b}`);
      for (const line of lines) assertNoForbiddenPairLanguage(line);
    }
  }
});

test("H. the pair view is rendered for the READER, not once for both", () => {
  // The bug this pins: one stored view addresses whoever it was built for, so the second
  // participant would read every "you" as the other person.
  const record = {
    pair_ref: "pair-1",
    adapter_ref: imairoPairAdapter.adapter_ref,
    adapter_version: "1.0.0",
    reference_family: IMAIRO_PAIR_REFERENCE_FAMILY,
    side_a: side("acct-a", SAME_A),
    side_b: side("acct-b", OTHER_CLAN),
    created_at: "2026-08-19T00:00:00.000Z",
  };
  const forA = renderComparisonFor("acct-a", record, imairoPairAdapter);
  const forB = renderComparisonFor("acct-b", record, imairoPairAdapter);
  assert.notDeepEqual(forA.differences, forB.differences, "both readers received the same 'you' — one is wrong");
  assert.throws(() => renderComparisonFor("acct-c", record, imairoPairAdapter), /not_participant/);
});

// ─── I/J/K — the adapter is a pack, and Imairo is untouched ─────────────────

test("I. the Imairo pair adapter lives in the Product Pack tier", () => {
  assert.ok(readdirSync("packs/yorisou/imairo").includes("pair.ts"));
  assert.ok(!readdirSync("lib/platform").includes("imairoPair.ts"));
});

test("J/K. the pair pack reads approved public taxonomy and changes no methodology", () => {
  const source = code("packs/yorisou/imairo/pair.ts");
  assert.ok(/findPublicArchetypeByCode/.test(source), "the pack must read the approved public assignment");
  for (const forbidden of [/scoring/i, /subdimension/i, /questionOrder/i, /answerScale/i]) {
    assert.ok(!forbidden.test(source), `the pair pack references ${forbidden} — methodology is protected`);
  }
});

// ─── L/M — URLs carry only public ids ───────────────────────────────────────

test("L/M. invite and pair URLs are built from public ids alone", () => {
  const inviteRoute = read("app/api/connect/invite/route.ts");
  assert.ok(/invite_path:\s*`\/connect\/invite\/\$\{invitation\.public_invite_id\}`/.test(inviteRoute));
  const acceptRoute = read("app/api/connect/invite/[publicId]/accept/route.ts");
  assert.ok(/pair_path:\s*`\/connect\/pair\/\$\{outcome\.pair\.pair_public_id\}`/.test(acceptRoute));

  // No private identifier may appear in a constructed path anywhere in the connect surface.
  for (const file of [
    "app/api/connect/invite/route.ts",
    "app/api/connect/invite/[publicId]/accept/route.ts",
    "app/connect/page.tsx",
    "app/connect/invite/[publicId]/page.tsx",
    "app/connect/pair/[pairId]/page.tsx",
  ]) {
    const source = read(file);
    for (const leak of [/\/connect\/[^`"']*\$\{[^}]*resultRowId/, /\/connect\/[^`"']*\$\{[^}]*account/i,
                        /\/connect\/[^`"']*\$\{[^}]*reference_ref/]) {
      assert.ok(!leak.test(source), `${file} builds a connect URL from a private identifier`);
    }
  }
});

// ─── N — the result-page entry is owner + persisted + gated ─────────────────

test("N. the Result pair action requires owner, persisted result AND the connection gate", () => {
  const source = read("app/result/page.tsx");
  assert.ok(
    /mode\.kind === "persisted" && mode\.isOwner && connectionOperational\(\)/.test(source),
    "the pair entry must be scoped to a persisted result the viewer owns, behind its own gate",
  );
  assert.ok(/pairInviteResultRowId \? \(/.test(source), "the pair block must render only when that resolves");
});

// ─── O/P — ARCH-P4 and legacy sharing are untouched ─────────────────────────

test("O. the ShareObject flow is unchanged by P5", () => {
  const source = read("app/result/page.tsx");
  assert.ok(/sharingOperational\(\)/.test(source), "the sharing gate is still what decides the ShareObject entry");
  assert.ok(/<ShareObjectActions/.test(source));
  // The two entries must not share a gate — a deployment may run one without the other.
  assert.ok(
    !/connectionOperational\(\)[^\n]*shareObjectState/.test(source),
    "the pair gate must not decide whether the ShareObject entry renders",
  );
});

test("P. the legacy /result/share fallback still exists and is still reachable", () => {
  assert.ok(readdirSync("app/result").includes("share"), "the legacy share route was removed");
  assert.ok(/<ResultShareActions/.test(read("app/result/page.tsx")), "the legacy fallback stopped rendering");
  assert.ok(/buildPublicShareHref/.test(read("app/result/resultIdentityRoutes.ts")));
});

// ─── Q — Connect is finite: no feed, DM, matching or community ──────────────

test("Q. the Connect surface implements no feed, search, DM, matching or community", () => {
  const files = [
    "app/connect/page.tsx",
    "app/connect/invite/[publicId]/page.tsx",
    "app/connect/pair/[pairId]/page.tsx",
    "lib/server/connection/store.ts",
  ];
  const forbidden = [
    /\bdirect_message\b/i, /\bsendMessage\b/, /\bfollowers?\b/i, /\blikes?Count\b/i,
    /\bmatching\b/i, /\bdiscoverPeople\b/i, /\bsuggestedUsers\b/i, /\binfiniteScroll\b/i,
    /\bloadMore\b/i, /\brecommendedPeople\b/i, /\bsearchUsers\b/i,
  ];
  for (const file of files) {
    const source = code(file);
    for (const pattern of forbidden) {
      assert.ok(!pattern.test(source), `${file} implements ${pattern} — out of P5 scope`);
    }
  }
  // And the list is bounded by the capability rather than by a scroll.
  assert.ok(/CONNECTION_LIST_LIMIT/.test(read("lib/server/platform/connectionCore/service.ts")));
  assert.ok(/limit:\s*String\(limit\)/.test(read("lib/server/connection/store.ts")));
});

// ─── R/S — navigation ───────────────────────────────────────────────────────

test("R/S. the bottom nav is five tabs when enabled and the original four when gated off", () => {
  const source = read("app/components/MobileBottomNav.tsx");
  const order = [...source.matchAll(/label:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(order, ["今日", "気づく", "探す", "つながる", "わたし"]);
  // Gating removes the tab from the rendered set — it is not hidden with CSS.
  assert.ok(/TABS\.filter\(\(tab\) => tab\.href !== "\/connect"\)/.test(source));
  // `md:hidden` on the bar itself is the responsive rule, not the gate. What must not exist is a
  // per-tab visual hide: a gated-off tab is absent from the DOM, not merely invisible.
  assert.ok(
    !/tab\.href === "\/connect"[^\n]*(hidden|opacity-0|display)/.test(source),
    "the つながる gate must remove the tab, not hide it visually",
  );
  // The column count follows the tab count, so four tabs still fill the bar.
  assert.ok(/repeat\(\$\{tabs\.length\}/.test(source));
  // The gate value is resolved on the SERVER and passed in.
  assert.ok(/<MobileBottomNav connectEnabled=\{connectEnabled\} \/>/.test(read("app/components/AppShell.tsx")));
  assert.ok(/connectEnabled=\{connectionOperational\(\)\}/.test(read("app/layout.tsx")));
});

// ─── T/U — gates default closed, near-miss denied ───────────────────────────

test("T. Production is CLOSED by default and unknown context is CLOSED", () => {
  assert.equal(connectionCoreAccess({ VERCEL_ENV: "production" }).allowed, false);
  assert.equal(connectionCoreAccess({}).allowed, false);
  assert.equal(connectionOperational({ VERCEL_ENV: "production" }), false);
  // Even with both schema declarations, production without the switch stays closed.
  assert.equal(
    connectionOperational({
      VERCEL_ENV: "production",
      YORISOU_CONNECTION_SCHEMA_READY: "true",
      YORISOU_COMPARISON_SCHEMA_READY: "true",
    }),
    false,
  );
  assert.equal(
    connectionCoreAccess({ VERCEL_ENV: "production", YORISOU_CONNECTION_PUBLIC_ENABLED: "true" }).allowed,
    true,
  );
});

test("T. both schema declarations are required, and the derivative check is gate-independent", () => {
  const base = { NODE_ENV: "test", YORISOU_CONNECTION_PUBLIC_ENABLED: "true", VERCEL_ENV: "production" };
  assert.equal(connectionOperational({ ...base, YORISOU_CONNECTION_SCHEMA_READY: "true" }), false);
  assert.equal(connectionOperational({ ...base, YORISOU_COMPARISON_SCHEMA_READY: "true" }), false);
  assert.equal(
    connectionOperational({
      ...base,
      YORISOU_CONNECTION_SCHEMA_READY: "true",
      YORISOU_COMPARISON_SCHEMA_READY: "true",
    }),
    true,
  );
  // Feature OFF but tables present: erasure must still clear pairs.
  assert.equal(
    connectionDerivativeSchemaReady({
      VERCEL_ENV: "production",
      YORISOU_CONNECTION_SCHEMA_READY: "true",
      YORISOU_COMPARISON_SCHEMA_READY: "true",
    }),
    true,
  );
});

test("U. a near-miss preview flag is denied, and the exact token is registered", () => {
  const preview = (flags: string) => ({ VERCEL_ENV: "preview", YORISOU_CPV1_DEV_FLAGS: flags });
  assert.equal(connectionCoreAccess(preview(CONNECTION_PREVIEW_FLAG)).allowed, true);
  for (const near of [
    "connection_pair_previews",
    "connection-pair-preview",
    "connection_pair",
    "pair_preview",
    "Connection_Pair_Preview ",
  ]) {
    assert.equal(connectionCoreAccess(preview(near)).allowed, false, `near miss accepted: ${near}`);
  }
  assert.ok((CPV1_DEV_FLAGS as readonly string[]).includes(CONNECTION_PREVIEW_FLAG));
});

// ─── V — module registry truth ──────────────────────────────────────────────

test("V. connection.core and comparison.core are partial / DEFINED / not_verified", () => {
  for (const id of ["connection.core", "comparison.core"]) {
    const entry = CAPABILITY_MODULES.find((module) => module.module_id === id);
    assert.ok(entry, `${id} is missing from the registry`);
    assert.equal(entry.adoption_status, "partial", `${id} must be partial — implementation is not validation`);
    assert.equal(entry.lifecycle_state, "DEFINED");
    assert.equal(entry.verification_state, "not_verified");
  }
});

// ─── W/X — the two privacy surfaces ─────────────────────────────────────────

test("W. the public invitation projection carries no inviter, source or result identity", () => {
  const contract = read("lib/platform/connectionCore.ts");
  const publicType = /export interface PublicInvitationView \{([\s\S]*?)\}/.exec(contract);
  assert.ok(publicType, "PublicInvitationView is missing");
  const fields = [...publicType[1].matchAll(/^\s{2}([a-z_]+):/gm)].map((m) => m[1]);
  assert.deepEqual(fields.sort(), ["expires_at", "public_invite_id", "reference_family"]);

  // And the repository selects exactly those columns — the type cannot protect a raw query.
  const store = read("lib/server/connection/store.ts");
  const columns = /const PUBLIC_INVITE_COLUMNS = "([^"]+)"/.exec(store);
  assert.ok(columns, "PUBLIC_INVITE_COLUMNS is missing");
  assert.deepEqual(columns[1].split(",").sort(), ["expires_at", "public_invite_id", "reference_family"]);
});

test("X. the pair page renders no raw account or source identifier", () => {
  const page = read("app/connect/pair/[pairId]/page.tsx");
  for (const leak of [/participant_a_account_id/, /participant_b_account_id/, /reference_ref/,
                      /accountId\}/, /\{record\.side_[ab]\.reference_ref/]) {
    assert.ok(!leak.test(page), `the pair page renders ${leak}`);
  }
  // Viewer-relative labels, not names or ids.
  assert.ok(/あなた|相手/.test(read("packs/yorisou/imairo/pair.ts")));
});

// ─── Y — the erasure seam ───────────────────────────────────────────────────

test("Y. the assessment DELETE route uses the derivative seam when the P5 schema is ready", () => {
  const route = read("app/api/assessment/results/[id]/route.ts");
  assert.ok(
    /connectionDerivativeSchemaReady\(\)\s*\?\s*await eraseAssessmentResultWithDerivatives\(id, ownerId\)/.test(route),
    "the P5 seam must be the first branch when the derivative schema exists",
  );
  // The older layers remain as fallbacks, in order.
  assert.ok(/sharingSchemaReady\(\)\s*\?\s*await eraseAssessmentResultWithShares\(id, ownerId\)/.test(route));
  assert.ok(/:\s*await eraseAssessmentResult\(id, ownerId\)/.test(route));
});

test("Y. the P5 erasure seam delegates to ARCH-P4 rather than reimplementing it", () => {
  const migration = read("supabase/migrations/202608190001_cpr1_connection_pair.sql");
  assert.ok(/yorisou_assessment_result_erase_with_shares\(p_result_row_id, p_owner_account_id\)/.test(migration));
  assert.ok(
    !/delete from public\.yorisou_assessment_results/.test(migration),
    "P5 must not reimplement the canonical assessment erasure",
  );
  // It reuses the merged P4 lock primitive rather than renaming or generalizing it.
  assert.ok(/yorisou_share_source_lock/.test(migration));
});

test("Y. the merged ARCH-P4 migration is untouched by this package", () => {
  const p4 = read("supabase/migrations/202608180002_shr1_share_objects.sql");
  assert.ok(!/connection|pair_comparison/i.test(p4), "ARCH-P4's migration was edited — it is merged and frozen");
});

// ─── Z — no Memory / state / reflection / Life Graph write ──────────────────

test("Z. P5 writes no Memory, state, reflection or Life Graph record", () => {
  const files = [
    ...PLATFORM_FILES,
    "packs/yorisou/imairo/pair.ts",
    "lib/server/connection/store.ts",
    "lib/server/connection/imairoPairSource.ts",
    "app/api/connect/invite/route.ts",
    "app/api/connect/invite/[publicId]/accept/route.ts",
    "app/api/connect/invite/[publicId]/cancel/route.ts",
    "app/api/connect/pair/[pairId]/dissolve/route.ts",
  ];
  for (const file of files) {
    const source = code(file);
    for (const forbidden of [
      /yorisou_explicit_memories/, /yorisou_life_reflections/, /yorisou_current_state_records/,
      /yorisou_daily_state_records/, /yorisou_goals/, /recordMemory/, /writeMemory/, /lifeGraph/i,
    ]) {
      assert.ok(!forbidden.test(source), `${file} touches ${forbidden} — P5 writes no life record`);
    }
  }
  // The migration creates no memory/state family either.
  const migration = read("supabase/migrations/202608190001_cpr1_connection_pair.sql");
  const created = [...migration.matchAll(/create table if not exists public\.([a-z0-9_]+)/g)].map((m) => m[1]);
  assert.deepEqual(created.sort(), [
    "yorisou_connection_audit_events",
    "yorisou_connection_invitations",
    "yorisou_connection_pairs",
    "yorisou_pair_comparisons",
  ]);
});

// ─── audit content-freedom (contract §19) ───────────────────────────────────

test("the connection audit table can hold no account id, source ref or payload", () => {
  const migration = read("supabase/migrations/202608190001_cpr1_connection_pair.sql");
  const table = /create table if not exists public\.yorisou_connection_audit_events \(([\s\S]*?)\n\);/.exec(migration);
  assert.ok(table, "the audit table is missing");
  const body = table[1];
  for (const forbidden of ["owner_account_id", "account_id text", "source_ref", "reference_ref", "payload", "email"]) {
    assert.ok(!body.includes(forbidden), `the audit table declares ${forbidden}`);
  }
  assert.ok(/actor_fingerprint text not null check \(actor_fingerprint ~ '\^\[a-f0-9\]\{64\}\$'\)/.test(body),
    "the actor must be a sha256 fingerprint, never a raw account id");
});

// ─── invitation lifetime follows the repository's existing policy ───────────

test("the invitation expiry reuses the repository's existing 7-day invite policy", () => {
  const migration = read("supabase/migrations/202608190001_cpr1_connection_pair.sql");
  assert.ok(/v_ttl constant interval := interval '7 days'/.test(migration));
  // The legacy experience invite is the precedent this matches.
  assert.ok(/7\*86400000|7 \* 86400000/.test(read("lib/server/experienceCards.ts")));
});

test("isInvitationOpen refuses expired and non-pending invitations", () => {
  const now = new Date("2026-08-19T00:00:00.000Z");
  assert.equal(isInvitationOpen({ status: "pending", expires_at: "2026-08-26T00:00:00.000Z" }, now), true);
  assert.equal(isInvitationOpen({ status: "pending", expires_at: "2026-08-18T00:00:00.000Z" }, now), false);
  assert.equal(isInvitationOpen({ status: "accepted", expires_at: "2026-08-26T00:00:00.000Z" }, now), false);
  assert.equal(isInvitationOpen({ status: "cancelled", expires_at: "2026-08-26T00:00:00.000Z" }, now), false);
});

// ─── REMEDIATION GUARDS (Controller review of 6ddcb9f) ──────────────────────

test("R1. the global lock order is source locks BEFORE the invitation row", () => {
  // The reviewed head locked the invitation row first and then the source locks, while source
  // erasure locks the source and then updates the invitation — a cycle that deadlocks on a real
  // cluster. The ordering is asserted here as a structural fact because a future edit that moves
  // the FOR UPDATE back above the locks would reintroduce it silently.
  const migration = read("supabase/migrations/202608190001_cpr1_connection_pair.sql");
  const accept = /create or replace function public\.yorisou_connection_invite_accept\(([\s\S]*?)\n\$\$;/
    .exec(migration);
  assert.ok(accept, "the accept function is missing");
  const body = accept[1];
  const firstLock = body.indexOf("yorisou_share_source_lock");
  const forUpdate = body.indexOf("for update");
  assert.ok(firstLock > 0, "accept takes no source lock");
  assert.ok(forUpdate > 0, "accept never locks the invitation row");
  assert.ok(
    firstLock < forUpdate,
    "accept locks the invitation row BEFORE the source locks — that is the deadlock ordering",
  );
  // And the peek that chooses the lock keys must not itself lock.
  const peek = body.indexOf("select * into v_peek");
  assert.ok(peek > 0 && peek < firstLock, "the non-locking peek must come first and stay non-locking");
  assert.ok(!/into v_peek[\s\S]{0,200}?for update/.test(body), "the peek must not take a row lock");
});

test("R5. every pair-lifecycle mutation touches PAIR rows before COMPARISON rows", () => {
  // The second lock-order defect, and the reason it needed its own guard.
  //
  // `pair_dissolve` takes no source advisory lock — a participant ending their own pair has
  // nothing to do with either assessment source — so the source-lock ordering that protects the
  // accept path cannot protect this one. The ONLY thing preventing a cycle is that dissolve and
  // source erasure touch these two tables in the SAME direction. The reviewed head had them
  // opposed and deadlocked; this asserts the direction in both functions so a future edit cannot
  // silently flip one of them.
  const migration = read("supabase/migrations/202608190001_cpr1_connection_pair.sql");
  const functions = [
    "yorisou_connection_pair_dissolve",
    "yorisou_assessment_result_erase_with_derivatives",
  ];
  for (const name of functions) {
    const fn = new RegExp(`create or replace function public\\.${name}\\(([\\s\\S]*?)\\n\\$\\$;`).exec(migration);
    assert.ok(fn, `${name} is missing`);
    const body = fn[1];
    const pairAt = body.search(/update public\.yorisou_connection_pairs/);
    const comparisonAt = body.search(/update public\.yorisou_pair_comparisons/);
    assert.ok(pairAt > 0, `${name} never updates pair rows`);
    assert.ok(comparisonAt > 0, `${name} never updates comparison rows`);
    assert.ok(
      pairAt < comparisonAt,
      `${name} updates COMPARISON before PAIR — that is the dissolve/erase deadlock ordering`,
    );
  }
  // The erasure locks its affected pairs explicitly, in id order, before mutating either table.
  const erase = /create or replace function public\.yorisou_assessment_result_erase_with_derivatives\(([\s\S]*?)\n\$\$;/
    .exec(migration);
  assert.ok(erase);
  assert.ok(
    /order by id\s+for update/.test(erase[1]),
    "the erasure must lock affected pair rows in deterministic id order",
  );
});

test("R2. an EXPIRED pending invitation is retired and replaced, never handed back", () => {
  const migration = read("supabase/migrations/202608190001_cpr1_connection_pair.sql");
  const create = /create or replace function public\.yorisou_connection_invite_create\(([\s\S]*?)\n\$\$;/
    .exec(migration);
  assert.ok(create, "the create function is missing");
  const body = create[1];
  assert.ok(/if v_row\.expires_at > now\(\) then/.test(body), "create does not check expiry before reuse");
  assert.ok(
    /set status = 'cancelled', cancelled_at = now\(\)/.test(body),
    "create does not retire the expired invitation",
  );
});

test("R3. the private comparison read REQUIRES a viewer and scopes the query", () => {
  const service = read("lib/server/platform/comparisonCore/service.ts");
  assert.ok(
    /forPair\(viewerRef: string, pairRef: string\)/.test(service),
    "the comparison repository contract must require viewer identity",
  );
  assert.ok(/readComparison\(\s*viewerRef: string,\s*pairRef: string,/.test(service));

  const store = read("lib/server/connection/store.ts");
  const fn = /export async function comparisonForPair\(([\s\S]*?)\n\}/.exec(store);
  assert.ok(fn, "comparisonForPair is missing");
  assert.ok(
    /participant_a_account_id\.eq\.\$\{viewerRef\}/.test(fn[1]) &&
      /participant_b_account_id\.eq\.\$\{viewerRef\}/.test(fn[1]),
    "the comparison query carries no participant predicate — this is call-order authorization",
  );
  // The page must not be the thing that makes it safe.
  const page = read("app/connect/pair/[pairId]/page.tsx");
  assert.ok(/readComparison\(accountId, pairId, comparisonRepository\)/.test(page));
});

test("R3. a non-participant calling the comparison repository directly receives nothing", async () => {
  // Exercised against the abstraction rather than the page, which is the whole point of the fix.
  const record = {
    pair_ref: "pair-1",
    adapter_ref: imairoPairAdapter.adapter_ref,
    adapter_version: "1.0.0",
    reference_family: IMAIRO_PAIR_REFERENCE_FAMILY,
    side_a: side("acct-a", SAME_A),
    side_b: side("acct-b", OTHER_CLAN),
    created_at: "2026-08-19T00:00:00.000Z",
  };
  const repository = {
    // A faithful stand-in for the scoped query: no row unless the viewer is a participant.
    forPair: async (viewerRef: string, pairRef: string) =>
      pairRef === record.pair_ref &&
      [record.side_a.participant_ref, record.side_b.participant_ref].includes(viewerRef)
        ? record
        : null,
  };
  assert.equal(await readComparison("acct-c", "pair-1", repository), null);
  assert.equal(await readComparison("", "pair-1", repository), null);
  assert.notEqual(await readComparison("acct-b", "pair-1", repository), null);
});

test("R4. a Product Pack adapter can see ONLY public-safe input", () => {
  const contract = read("lib/platform/comparisonCore.ts");
  const input = /export interface ComparisonAdapterInput \{([\s\S]*?)\n\}/.exec(contract);
  assert.ok(input, "ComparisonAdapterInput is missing");
  const fields = [...input[1].matchAll(/^\s{2}([a-z_]+):/gm)].map((m) => m[1]);
  assert.deepEqual(fields, ["public_reference"], "the adapter-facing type carries more than the public code");

  // The runtime narrows before crossing the tier.
  const service = read("lib/server/platform/comparisonCore/service.ts");
  assert.ok(
    /adapter\.build\(toAdapterInput\(request\.side_a\), toAdapterInput\(request\.side_b\)\)/.test(service),
    "the runtime hands the pack a full reference instead of narrowing it",
  );

  // And what actually reaches the pack at runtime has one key.
  const narrowed = toAdapterInput(side("acct-a", SAME_A));
  assert.deepEqual(Object.keys(narrowed), ["public_reference"]);
  const serialized = JSON.stringify(narrowed);
  assert.ok(!serialized.includes("acct-a") && !serialized.includes("row-acct-a"));
});

test("R4. the inviter can actually revoke the invitation from the product", () => {
  const actions = read("app/components/PairInviteActions.tsx");
  assert.ok(
    /fetch\(`\/api\/connect\/invite\/\$\{inviteId\}\/cancel`, \{ method: "POST" \}\)/.test(actions),
    "the invite UI never calls the cancel endpoint — the invitation is not revocable in product",
  );
  assert.ok(/招待を取り消す/.test(actions), "there is no cancel affordance");
  // After cancelling, the link stops being actionable and a fresh one can be created.
  assert.ok(/setInviteUrl\(null\)/.test(actions) && /stage === "cancelled"/.test(actions));
  assert.ok(/新しい招待リンクを作る/.test(actions));
});

// ─── the migration is registered ────────────────────────────────────────────

test("the CPR-1 migration is registered in the scope manifest", () => {
  const manifest = read("supabase/MIGRATION_SCOPE_MANIFEST.md");
  assert.ok(manifest.includes("202608190001_cpr1_connection_pair.sql"), "the new migration is unregistered");
});

test("migration lineage: CPR-1 is the newest and does not renumber anything", () => {
  const names = readdirSync(join("supabase", "migrations")).filter((n) => n.endsWith(".sql")).sort();
  assert.equal(names[names.length - 1], "202608190001_cpr1_connection_pair.sql");
});
