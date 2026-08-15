import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";

import { lifeOsAccess, lifeOsMutationAccess, LIFE_OS_PREVIEW_FLAG, LIFE_OS_SCHEMA_READY_ENV } from "@/lib/life-os/access";
import { isVisibilityExpansion } from "@/lib/server/experienceCards";

// OSF-1 REGRESSION REPAIR — the six defects the activation audit confirmed, each pinned so it
// cannot come back.
//
// Every one of these was introduced by a previous pass on this branch and passed review. Four were
// introduced by the hardening pass that was supposed to be making the code safer. That is the reason
// they are tests and not comments: each was, at the time, something someone had just convinced
// themselves was fine.

const CARDS = readFileSync("lib/server/experienceCards.ts", "utf8");
// The single action-switch route was replaced by the /api/life/* domain routes and the shared
// guard; the gate properties this file pins now live in the guard, which every route uses.
const GUARD = readFileSync("lib/server/lifeOs/guard.ts", "utf8");

// ── 1. Migration-ordering safety ─────────────────────────────────────────────

test("payload() names title/lesson only when the caller supplied one", () => {
  // The regression: both keys were emitted unconditionally, so every insert referenced columns that
  // exist only after 202608140001. Against an un-migrated database PostgREST rejects the whole
  // statement — which broke the pre-existing /experiences surface, not merely the new one. Proven
  // against a real schema: with the keys the insert errors, without them it succeeds.
  assert.match(CARDS, /const optional:Record<string,string>=\{\};/);
  assert.match(CARDS, /const titleValue=clean\(input\.title,120\); if\(titleValue\)optional\.title=titleValue;/);
  assert.match(CARDS, /const lessonValue=clean\(input\.lesson,1000\); if\(lessonValue\)optional\.lesson=lessonValue;/);
  // The `values` object — always spread — must no longer contain them.
  const values = /const values=\{([^}]*)\}/.exec(CARDS);
  assert.ok(values, "payload()'s values object is not where expected");
  assert.ok(!/\btitle:/.test(values[1]), "title is back in the unconditional insert body");
  assert.ok(!/\blesson:/.test(values[1]), "lesson is back in the unconditional insert body");
});

// ── 2. updateExperience metadata ─────────────────────────────────────────────

test("updateExperience writes moderation_status, provenance and ai_assistance_status", () => {
  const fn = /export async function updateExperience[\s\S]*?\n  return row; \}/.exec(CARDS);
  assert.ok(fn, "updateExperience is not where expected");
  // The silent one: without moderation_status a promoted card keeps 'draft', and
  // discoverExperiences requires 'published' — the person shares it and nobody ever sees it.
  assert.match(fn[0], /body\.moderation_status=shared\?"published":"draft";/);
  assert.match(fn[0], /body\.provenance=/);
  assert.match(fn[0], /body\.ai_assistance_status=input\.aiAssistanceStatus;/);
});

test("a moderator's limited/removed decision still outranks the restored metadata write", () => {
  const fn = /export async function updateExperience[\s\S]*?\n  return row; \}/.exec(CARDS)![0];
  const restored = fn.indexOf('body.moderation_status=shared?"published":"draft";');
  const moderator = fn.indexOf('if(["limited","removed"].includes(String(current.moderation_status)))');
  assert.ok(restored >= 0 && moderator >= 0);
  assert.ok(
    moderator > restored,
    "the moderator override must come AFTER the restored write, or restoring metadata would silently " +
      "republish a card an operator had limited or removed",
  );
});

// ── 3. Preview-confirmation boundary ─────────────────────────────────────────

test("every visibility expansion is an expansion, including the one that lost its gate", () => {
  // The regression narrowed the check to `current.visibility === "PRIVATE"`, so INVITE_ONLY ->
  // ANONYMOUS_SHARED — a link shared with named people becoming visible to everyone — needed no
  // confirmation at all.
  assert.equal(isVisibilityExpansion("PRIVATE", "INVITE_ONLY"), true);
  assert.equal(isVisibilityExpansion("PRIVATE", "ANONYMOUS_SHARED"), true);
  assert.equal(isVisibilityExpansion("INVITE_ONLY", "SIMILAR_STATE_ONLY"), true);
  assert.equal(isVisibilityExpansion("INVITE_ONLY", "ANONYMOUS_SHARED"), true);
  assert.equal(isVisibilityExpansion("SIMILAR_STATE_ONLY", "ANONYMOUS_SHARED"), true);
  assert.equal(isVisibilityExpansion("ANONYMOUS_SHARED", "PUBLIC"), true);
});

test("narrowing and no-change are not expansions", () => {
  assert.equal(isVisibilityExpansion("ANONYMOUS_SHARED", "PRIVATE"), false);
  assert.equal(isVisibilityExpansion("ANONYMOUS_SHARED", "INVITE_ONLY"), false);
  assert.equal(isVisibilityExpansion("PRIVATE", "PRIVATE"), false);
  assert.equal(isVisibilityExpansion("ANONYMOUS_SHARED", "ANONYMOUS_SHARED"), false);
});

test("an unknown visibility ranks highest, so a new value fails closed", () => {
  // A visibility nobody has ranked must be treated as the widest thing there is, not the narrowest.
  assert.equal(isVisibilityExpansion("PRIVATE", "SOMETHING_NEW"), true);
  assert.equal(isVisibilityExpansion("SOMETHING_NEW", "PRIVATE"), false);
});

test("updateExperience gates on expansion, and scans the merged row rather than the patch", () => {
  const fn = /export async function updateExperience[\s\S]*?\n  return row; \}/.exec(CARDS)![0];
  assert.match(fn, /isVisibilityExpansion\(String\(current\.visibility\),visibility\)&&!input\.previewConfirmed/);
  assert.ok(
    !/const flags=trustFlags\(input as ExperienceInput\)/.test(fn),
    "the de-identification scan is reading the patch again — a request that widens visibility while " +
      "naming no content fields would be scanned against nothing",
  );
  assert.match(fn, /const flags=trustFlags\(scanned\);/);
});

// ── 4. PATCH semantics ───────────────────────────────────────────────────────

test("an empty string means unchanged — not an error, and not a clear", () => {
  // The regression threw `experience_field_empty`, which made every card created on
  // /life/experience permanently uneditable through /experiences: that editor renders each column
  // into a textarea and posts all of them back, and OSF-1 made four of those columns nullable.
  assert.ok(
    !/experience_field_empty/.test(CARDS),
    "the empty-string throw is back; existing cards become uneditable",
  );
  assert.match(CARDS, /if\(typeof value==="string"&&value\.trim\(\)\.length===0\)continue;/);
  // Over-length is still an error — "unchanged" must not swallow a genuinely bad value.
  assert.match(CARDS, /throw new Error\(`experience_field_too_long:\$\{column\}`\)/);
});

test("omitted and null fields are untouched, and clearing stays explicit", () => {
  assert.match(CARDS, /if\(value===undefined\|\|value===null\)continue;\s+\/\/ absent = untouched/);
  assert.match(CARDS, /for\(const field of input\.clearFields\?\?\[\]\)/);
  assert.match(CARDS, /experience_field_not_clearable/);
  assert.match(CARDS, /experience_field_set_and_cleared/);
  assert.match(CARDS, /experience_field_required_when_shared/);
  // The three NOT NULL columns must never be clearable.
  const clearable = /const CLEARABLE_FIELDS = \[([^\]]*)\]/.exec(CARDS);
  assert.ok(clearable);
  for (const forbidden of ["situation", "action_tried", "perceived_outcome"]) {
    assert.ok(!clearable[1].includes(`"${forbidden}"`), `${forbidden} is NOT NULL and must not be clearable`);
  }
});

// ── 5. The feature gate ──────────────────────────────────────────────────────

test("the Life OS is closed in production and in an unknown context", () => {
  assert.deepEqual(lifeOsAccess({ VERCEL_ENV: "production" }), { allowed: false, reason: "denied_production" });
  assert.deepEqual(lifeOsAccess({}), { allowed: false, reason: "denied_unknown_context" });
});

test("Vercel Preview is closed unless the exact dev flag is present", () => {
  assert.deepEqual(lifeOsAccess({ VERCEL_ENV: "preview" }), { allowed: false, reason: "denied_flag_off" });
  assert.deepEqual(
    lifeOsAccess({ VERCEL_ENV: "preview", YORISOU_CPV1_DEV_FLAGS: "some_other_flag" }),
    { allowed: false, reason: "denied_flag_off" },
  );
  assert.deepEqual(
    lifeOsAccess({ VERCEL_ENV: "preview", YORISOU_CPV1_DEV_FLAGS: LIFE_OS_PREVIEW_FLAG }),
    { allowed: true, reason: "preview_flag_on" },
  );
});

test("the mutation gate is strictly narrower than the read gate", () => {
  // Open route, migration not declared: reads allowed, writes refused. This is the state a deploy
  // that lands before the migration is in, and it is why a write cannot reach an absent table.
  const openNoSchema = { VERCEL_ENV: "preview", YORISOU_CPV1_DEV_FLAGS: LIFE_OS_PREVIEW_FLAG };
  assert.equal(lifeOsAccess(openNoSchema).allowed, true);
  assert.deepEqual(lifeOsMutationAccess(openNoSchema), { allowed: false, reason: "denied_schema_not_ready" });

  const openWithSchema = { ...openNoSchema, [LIFE_OS_SCHEMA_READY_ENV]: "true" };
  assert.deepEqual(lifeOsMutationAccess(openWithSchema), { allowed: true, reason: "schema_ready" });

  // A closed route refuses writes for the route reason, never leaking that the schema is ready.
  assert.deepEqual(
    lifeOsMutationAccess({ VERCEL_ENV: "production", [LIFE_OS_SCHEMA_READY_ENV]: "true" }),
    { allowed: false, reason: "denied_route_closed" },
  );
});

test("the schema-ready declaration is exact — no truthy-string accidents", () => {
  const base = { VERCEL_ENV: "preview", YORISOU_CPV1_DEV_FLAGS: LIFE_OS_PREVIEW_FLAG };
  for (const value of ["1", "yes", "TRUE ", "on", "", "false"]) {
    const result = lifeOsMutationAccess({ ...base, [LIFE_OS_SCHEMA_READY_ENV]: value });
    if (value === "TRUE ") {
      assert.equal(result.allowed, true, "trimmed + lowercased 'true' is accepted");
    } else {
      assert.equal(result.allowed, false, `${JSON.stringify(value)} must not open the mutation gate`);
    }
  }
});

test("every Life OS page and the API enforce the gate", () => {
  for (const page of [
    "app/life/page.tsx",
    "app/life/reflect/page.tsx",
    "app/life/goals/page.tsx",
    "app/life/experience/page.tsx",
    "app/life/memories/page.tsx",
  ]) {
    const source = readFileSync(page, "utf8");
    assert.match(source, /if \(!lifeOsAccess\(\)\.allowed\) notFound\(\);/, `${page} does not enforce the gate`);
  }
  // The shared guard enforces reads and writes separately, with the feature gate before the session
  // lookup so a closed route answers identically whoever is asking.
  assert.ok(GUARD.indexOf("lifeOsAccess()") < GUARD.indexOf("getViewerContext()"));
  assert.match(GUARD, /const mutation = lifeOsMutationAccess\(\);/);
  assert.match(GUARD, /life_os_not_accepting_entries/);
  // And every domain route goes through it — AT ANY DEPTH. Listing only the top level exempted the
  // dynamic child routes, which are the ones that take an id from the caller and so are exactly the
  // ones an unguarded path would hurt most.
  const lifeRoutes: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const path = `${dir}/${entry}`;
      if (statSync(path).isDirectory()) walk(path);
      else if (entry === "route.ts") lifeRoutes.push(path);
    }
  };
  walk("app/api/life");
  assert.ok(lifeRoutes.length >= 8, `expected the full route set, found ${lifeRoutes.length}`);
  assert.ok(lifeRoutes.some((r) => r.includes("[id]")), "the dynamic routes must be in scope");
  for (const route of lifeRoutes) {
    assert.match(readFileSync(route, "utf8"), /requireLifeViewer/, `${route} bypasses the guard`);
  }
  // 今日 and わたし must not query or link to a closed Life OS.
  assert.match(readFileSync("app/TodaySavedState.tsx", "utf8"), /if \(!lifeOsAccess\(\)\.allowed\) return null;/);
  assert.match(readFileSync("app/me/page.tsx", "utf8"), /const lifeOsOpen = lifeOsAccess\(\)\.allowed;/);
});
