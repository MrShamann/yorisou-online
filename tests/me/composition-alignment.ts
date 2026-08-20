// ARCH-P7 — わたし is composed from module reads, or it disagrees with itself.
//
// THE DIVERGENCE THIS EXISTS TO CATCH.
//
// P6 moved the timeline onto the continuity index. The return view — the "what you left" card that
// わたし shows when someone comes back — was NOT moved, and still derives the same fact by reading
// the reflection, goal and experience stores directly. Two independent derivations of one fact stay
// equal only until something changes one of them, and P6 introduced exactly such a something:
// a moment can be invalidated in the index while its source row is untouched.
//
// So the timeline can drop a moment and the return card can go on offering it. That is not an
// abstract layering complaint; it is わたし showing a person something the rest of the product has
// already stopped showing them.
//
// Run by tests/me/composition-alignment.sh, which supplies the stack.

import {
  legacyAggregatedReturnView,
  lifeReturnSelection,
  lifeReturnView,
  lifeTimelinePage,
  RETURN_MAX_ITEMS,
} from "@/lib/server/lifeOs/timeline";
import { continuityReadiness } from "@/lib/yorisou/continuity/access";
import { composeYorisouMe } from "@/lib/server/me/composition";
import { ME_COMPOSITION_PARTS, type MeCompositionPart } from "@/lib/platform/meComposition";

const OWNER = process.env.OSF1_TL_OWNER ?? "acct_tl";
const OTHER = process.env.OSF1_TL_OTHER ?? "acct_tl_other";
const REST = `${(process.env.SUPABASE_URL ?? "").replace(/\/$/, "")}/rest/v1`;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

let checks = 0;
function fail(message: string): never {
  console.log(`FAIL: ${message}`);
  process.exit(1);
}
function ok(message: string) {
  checks += 1;
  console.log(`  ok   ${message}`);
}
async function rest(path: string, init: RequestInit = {}) {
  return fetch(`${REST}/${path}`, {
    ...init,
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
  });
}

async function main() {
  const readiness = continuityReadiness();
  if (!readiness.ready) fail(`the projection path is not active (${readiness.reason}) — this proves nothing`);
  ok(`the projection path is active (${readiness.reason})`);

  const before = await lifeReturnView(OWNER);
  if (!before.lastReflection) fail("the fixture has no reflection — the alignment check is vacuous");
  if (!before.recentExperience) fail("the fixture has no experience — the alignment check is vacuous");
  if (!before.activeDirection) fail("the fixture has no active direction — the alignment check is vacuous");
  ok("the return view offers a reflection, an experience and a direction");

  // NOTHING VISIBLE CHANGES. Before anything is invalidated the composed view and the direct read
  // must agree exactly, or P7 would have altered what わたし shows rather than where it reads from.
  const legacy = await legacyAggregatedReturnView(OWNER);
  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
  if (!same(before.lastReflection, legacy.lastReflection)) fail("the composed reflection differs from the direct read");
  if (!same(before.unfinished, legacy.unfinished)) fail("the composed unfinished answer differs from the direct read");
  if (!same(before.activeDirection, legacy.activeDirection)) fail("the composed direction differs from the direct read");
  if (!same(before.recentExperience, legacy.recentExperience)) fail("the composed experience differs from the direct read");
  ok("composed and direct return views are identical while the index and the stores agree");

  // MEMORY IS NOT PART OF THIS COMPOSITION AND MUST NOT BECOME PART OF IT. A memory is a standing
  // note with its own lifecycle controls, not something that happened at a moment; continuity has
  // no memory family, so routing わたし through the index preserves that boundary by construction.
  const selection = await lifeReturnSelection(OWNER);
  if (selection.length === 0) fail("the return selection is empty — the boundary check is vacuous");
  if (selection.length > RETURN_MAX_ITEMS) fail(`the selection returned ${selection.length}, cap is ${RETURN_MAX_ITEMS}`);
  const memories = (await (await rest(
    `yorisou_explicit_memories?select=id&owner_account_id=eq.${OWNER}&limit=50`,
  )).json()) as Array<{ id: string }>;
  const memoryIds = new Set(memories.map((m) => m.id));
  for (const item of selection) {
    if (memoryIds.has(item.id)) fail("a memory reached the return selection — わたし must not surface one here");
  }
  ok(`the return selection stays within ${RETURN_MAX_ITEMS} items and contains no memory`);

  const timelineIds = new Set(
    (await lifeTimelinePage(OWNER, { limit: 100, filter: "ALL" })).entries.map((e) => e.id),
  );
  for (const [what, id] of [
    ["reflection", before.lastReflection.id],
    ["experience", before.recentExperience.id],
    ["direction", before.activeDirection.id],
  ] as const) {
    if (!timelineIds.has(id)) fail(`the return view's ${what} is not in the timeline even before anything changes`);
  }
  ok("everything the return view offers is also in the timeline");

  // Invalidate the reflection's MOMENT only. The reflection row itself is untouched, which is
  // precisely the state P6 made reachable: the index says gone, the store says here.
  const reflectionId = before.lastReflection.id;
  const transitioned = await (await rest("rpc/yorisou_continuity_invalidate_source", {
    method: "POST",
    body: JSON.stringify({
      p_owner_account_id: OWNER, p_source_family: "reflection", p_source_ref: reflectionId,
    }),
  })).json();
  if (transitioned !== 1) fail(`invalidating the reflection reported ${transitioned} transitions`);

  const stillInStore = (await (await rest(
    `yorisou_life_reflections?select=id&id=eq.${reflectionId}`,
  )).json()) as unknown[];
  if (stillInStore.length !== 1) fail("the source row was removed — this test is about the index, not the store");
  ok("the moment is invalidated while its source row is untouched");

  const afterTimeline = await lifeTimelinePage(OWNER, { limit: 100, filter: "ALL" });
  if (afterTimeline.entries.some((e) => e.id === reflectionId)) fail("the timeline still shows the invalidated moment");
  ok("the timeline no longer shows it");

  const after = await lifeReturnView(OWNER);
  if (after.lastReflection?.id === reflectionId) {
    fail(
      "THE RETURN VIEW STILL OFFERS IT. わたし is composed from a second, independent derivation " +
      "of what the timeline already answers, so the two disagree the moment one of them changes.",
    );
  }
  ok("the return view no longer offers it either — both are composed from the same index");

  // And the legacy derivation still offers it, which is what shows the two really were independent
  // rather than the invalidation having quietly changed the store underneath both of them.
  const legacyAfter = await legacyAggregatedReturnView(OWNER);
  if (legacyAfter.lastReflection?.id !== reflectionId) {
    fail("the direct read also dropped it — the source was mutated, so this proved nothing");
  }
  ok("the direct read still offers it — the index, not a store scan, is now what わたし composes from");

  // ══════════════════════════════════════════════════════════════════════════
  // THE FIVE-PART COMPOSITION — screen 17, against the real stack
  // ══════════════════════════════════════════════════════════════════════════
  const me = await composeYorisouMe(OWNER);
  const stateOf = (p: MeCompositionPart) => me.parts.find((x) => x.part === p)?.state;
  const refOf = (p: MeCompositionPart) => me.parts.find((x) => x.part === p)?.reference?.ref ?? null;

  if (me.parts.map((p) => p.part).join(",") !== ME_COMPOSITION_PARTS.join(",")) {
    fail("the parts came back in the wrong order or count — the surface renders them in this order");
  }
  ok("all five parts return, once each, in the reference architecture's order");

  for (const part of ["current_state", "assessment_recognition", "confirmed_durable_context", "confirmed_values"] as const) {
    if (stateOf(part) !== "present") fail(`${part} is ${stateOf(part)}, expected present — the fixture seeded one`);
  }
  ok("current state, Imairo, durable context and confirmed values each resolve from their own module");
  if (stateOf("observations") !== "deferred") fail(`observations is ${stateOf("observations")}, expected deferred`);
  ok("observations stays deferred — a V1.5 capability is not reported as \"you have none\"");

  const otherMe = await composeYorisouMe(OTHER);
  const mineRefs = new Set(me.parts.map((p) => p.reference?.ref).filter(Boolean));
  for (const part of otherMe.parts) {
    if (part.reference && mineRefs.has(part.reference.ref)) {
      fail(`a reference appears in two people's compositions (${part.part})`);
    }
  }
  if (otherMe.parts.find((p) => p.part === "confirmed_durable_context")?.state !== "present") {
    fail("the other account has no memory — the isolation check would be vacuous");
  }
  if (otherMe.parts.find((p) => p.part === "confirmed_values")?.state !== "absent") {
    fail("the other account unexpectedly has confirmed values — check the fixture");
  }
  ok("owner isolation holds, and the other account's own parts resolve independently");

  const again = await composeYorisouMe(OWNER);
  if (JSON.stringify(again) !== JSON.stringify(me)) fail("two reads of the same unchanged data disagreed");
  ok("the composition is deterministic across repeated reads");

  // A memory a person withdraws must leave the picture they are shown of themselves. This is the
  // whole reason the composition uses the lifecycle-respecting ELIGIBLE read.
  const memRef = refOf("confirmed_durable_context");
  await rest(`yorisou_explicit_memories?id=eq.${memRef}`, {
    method: "PATCH",
    body: JSON.stringify({ lifecycle_state: "revoked", lifecycle_changed_at: new Date().toISOString() }),
  });
  if ((await composeYorisouMe(OWNER)).parts.find((p) => p.part === "confirmed_durable_context")?.state !== "absent") {
    fail("a revoked memory still appears in わたし");
  }
  ok("a revoked memory leaves the composition — lifecycle is respected, not bypassed");

  const valRef = refOf("confirmed_values");
  await rest(`yorisou_values_assessments?id=eq.${valRef}`, {
    method: "PATCH", body: JSON.stringify({ confirmation: "not_quite" }),
  });
  if ((await composeYorisouMe(OWNER)).parts.find((p) => p.part === "confirmed_values")?.state !== "absent") {
    fail("an unconfirmed values assessment is still presented as user-confirmed");
  }
  ok("withdrawing confirmation removes the values part — わたし does not put words in someone's mouth");

  const emptyMe = await composeYorisouMe("acct_tl_nobody");
  for (const part of emptyMe.parts) {
    const expected = part.part === "observations" ? "deferred" : "absent";
    if (part.state !== expected) fail(`an empty account reported ${part.part} as ${part.state}, expected ${expected}`);
  }
  ok("an account with nothing reports absent, never not_ready — emptiness and failure stay distinct");

  console.log(`\nME COMPOSITION ALIGNED — ${checks} checks`);
}

main();
