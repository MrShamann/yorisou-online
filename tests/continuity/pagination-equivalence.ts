// ARCH-P6 §12 — the projection reader must page IDENTICALLY to the reader it replaces.
//
// This is the load-bearing acceptance for the read switch. Everything else about P6 can be right
// and the change is still unshippable if pagination differs by one row: a person scrolling their
// own timeline would silently lose an entry on a page boundary, and neither they nor any unit test
// would ever see it.
//
// Both readers run over ONE fixture, in the same process, against the same real PostgREST, and
// their output is compared as an exact normalized sequence rather than a count.
//
// ORDER MATTERS IN THIS FILE. Invalidation is terminal in SQL — that is the point of CNT-1 — so
// every destructive check is at the end, after everything that needs an intact index.
//
// Run by tests/continuity/pagination-equivalence.sh, which supplies the stack.

import {
  legacyAggregatedTimelinePage,
  lifeTimelinePage,
  TIMELINE_FILTERS,
  type TimelineEntry,
  type TimelineFilter,
  type TimelinePage,
} from "@/lib/server/lifeOs/timeline";
import { continuityReadiness } from "@/lib/yorisou/continuity/access";

const OWNER = process.env.OSF1_TL_OWNER ?? "acct_tl";
const OTHER = process.env.OSF1_TL_OTHER ?? "acct_tl_other";
const EXPECTED = Number.parseInt(process.env.OSF1_TL_EXPECTED ?? "0", 10);
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
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
}

type Reader = (
  owner: string,
  options: { cursor?: string | null; limit?: number; filter?: TimelineFilter },
) => Promise<TimelinePage>;

/**
 * (kind, id, at) — identity and order.
 *
 * Deliberately NOT the record. Equivalence here is about which moments appear where; comparing
 * bodies would let an ordering bug hide behind a payload diff, and the records come from the very
 * same rows in both readers anyway.
 */
const shape = (entry: TimelineEntry) => `${entry.kind}:${entry.id}@${entry.at}`;
const idOf = (s: string) => s.slice(s.indexOf(":") + 1, s.lastIndexOf("@"));
const kindOf = (s: string) => s.slice(0, s.indexOf(":"));

async function walk(reader: Reader, filter: TimelineFilter, limit: number) {
  const seq: string[] = [];
  const cursors: string[] = [];
  const pageSizes: number[] = [];
  let cursor: string | null = null;
  let pages = 0;
  for (;;) {
    const page = await reader(OWNER, { cursor, limit, filter });
    pages += 1;
    if (page.filter !== filter) fail(`${filter}: page reported filter ${page.filter}`);
    if (page.entries.length > limit) fail(`${filter}: page of ${page.entries.length} exceeds limit ${limit}`);
    pageSizes.push(page.entries.length);
    for (const entry of page.entries) seq.push(shape(entry));
    for (let i = 1; i < page.entries.length; i += 1) {
      const prev = page.entries[i - 1];
      const cur = page.entries[i];
      if (prev.at < cur.at) fail(`${filter}: out of order, ${prev.at} before ${cur.at}`);
      if (prev.at === cur.at && prev.id < cur.id) fail(`${filter}: tie broken in the wrong direction`);
    }
    if (!page.nextCursor) break;
    cursors.push(page.nextCursor);
    cursor = page.nextCursor;
    if (pages > 60) fail(`${filter}: the walk did not terminate`);
  }
  if (new Set(seq).size !== seq.length) fail(`${filter}: a moment appeared on more than one page`);
  return { seq, cursors, pages, pageSizes };
}

async function main() {
  // ── non-vacuity ───────────────────────────────────────────────────────────
  const readiness = continuityReadiness();
  if (!readiness.ready) fail(`the projection path is not active (${readiness.reason}) — this would prove nothing`);
  ok(`the projection path is active (${readiness.reason})`);

  const live = (await (await rest(
    `yorisou_continuity_projections?select=source_ref&owner_account_id=eq.${OWNER}&invalidated_at=is.null`,
  )).json()) as unknown[];
  if (live.length !== EXPECTED) {
    fail(`the index holds ${live.length} live moments but the fixture seeded ${EXPECTED} visible rows — propagation is wrong`);
  }
  ok(`propagation produced all ${EXPECTED} moments from ordinary inserts, and nothing extra`);

  // ── 1-6, 9, 10: identical pages under every filter and page size ──────────
  for (const filter of TIMELINE_FILTERS) {
    for (const limit of [1, 3, 7, 100]) {
      const before = await walk(legacyAggregatedTimelinePage, filter, limit);
      const after = await walk(lifeTimelinePage, filter, limit);
      if (before.seq.join("|") !== after.seq.join("|")) {
        fail(`${filter} @${limit}: sequences differ\n  legacy: ${before.seq.join(", ")}\n  index:  ${after.seq.join(", ")}`);
      }
      if (before.pageSizes.join(",") !== after.pageSizes.join(",")) {
        fail(`${filter} @${limit}: page sizes differ (${before.pageSizes} vs ${after.pageSizes})`);
      }
      // CURSOR STABILITY, in the strong form: the cursors are byte-identical, so one minted before
      // the switch still addresses the same position after it. Someone mid-scroll during a deploy
      // does not jump, repeat, or skip.
      if (before.cursors.join("|") !== after.cursors.join("|")) {
        fail(`${filter} @${limit}: cursors differ — a cursor minted before the switch would move`);
      }
    }
  }
  ok("every filter at limits 1/3/7/100: identical order, identical page sizes, byte-identical cursors");

  const all = await walk(lifeTimelinePage, "ALL", 7);
  if (all.seq.length !== EXPECTED) fail(`${EXPECTED - all.seq.length} moment(s) unreachable by paging`);
  ok(`ALL reaches every one of ${EXPECTED} moments across ${all.pages} pages, none twice`);

  let filteredTotal = 0;
  for (const filter of TIMELINE_FILTERS) {
    if (filter === "ALL") continue;
    filteredTotal += (await walk(lifeTimelinePage, filter, 3)).seq.length;
  }
  if (filteredTotal !== EXPECTED) fail(`the filters sum to ${filteredTotal}, the whole is ${EXPECTED}`);
  ok("the five filters partition the timeline exactly — no moment lost, none double-counted");

  const light = await walk(lifeTimelinePage, "REFLECTION", 100);
  const deep = await walk(lifeTimelinePage, "POSTMORTEM", 100);
  if (light.seq.length === 0 || deep.seq.length === 0) fail("a reflection mode is empty — the split check is vacuous");
  if (light.seq.some((s) => deep.seq.includes(s))) fail("a reflection appears under both modes");
  ok(`reflection modes stay distinct (${light.seq.length} light, ${deep.seq.length} deep)`);

  const direction = await walk(lifeTimelinePage, "DIRECTION", 100);
  if (direction.seq.length === 0) fail("DIRECTION is empty — goals vanished from the index");
  ok(`Direction survives the switch (${direction.seq.length} entries)`);

  // ── 11: experience soft-delete stays equivalent ───────────────────────────
  const excluded = (await (await rest(
    `yorisou_experience_cards?select=id&owner_account_id=eq.${OWNER}&or=(deleted_at.not.is.null,withdrawn_at.not.is.null)`,
  )).json()) as Array<{ id: string }>;
  if (excluded.length === 0) fail("no withdrawn or soft-deleted card in the fixture — this check is vacuous");
  const seenNew = new Set((await walk(lifeTimelinePage, "EXPERIENCE", 100)).seq.map(idOf));
  const seenOld = new Set((await walk(legacyAggregatedTimelinePage, "EXPERIENCE", 100)).seq.map(idOf));
  for (const row of excluded) {
    if (seenNew.has(row.id)) fail("a withdrawn or soft-deleted experience appears in the index read");
    if (seenOld.has(row.id)) fail("a withdrawn or soft-deleted experience appears in the legacy read");
  }
  ok(`${excluded.length} withdrawn/soft-deleted card(s) excluded by BOTH readers, identically`);

  // ── 12: an empty timeline ─────────────────────────────────────────────────
  const emptyNew = await lifeTimelinePage("acct_tl_nobody", { limit: 10, filter: "ALL" });
  const emptyOld = await legacyAggregatedTimelinePage("acct_tl_nobody", { limit: 10, filter: "ALL" });
  if (emptyNew.entries.length !== 0 || emptyNew.nextCursor !== null) fail("an unknown account got a non-empty page");
  if (emptyOld.entries.length !== emptyNew.entries.length) fail("empty timelines differ between the readers");
  ok("an account with nothing gets the same empty page from both readers");

  // ── 13: owner isolation ───────────────────────────────────────────────────
  const otherPage = await lifeTimelinePage(OTHER, { limit: 100, filter: "ALL" });
  if (otherPage.entries.length === 0) fail("the other account has nothing — the isolation check is vacuous");
  const mine = new Set(all.seq.map(idOf));
  for (const entry of otherPage.entries) {
    if (mine.has(entry.id)) fail("an entry appears in two people's timelines");
  }
  ok(`owner isolation holds (${otherPage.entries.length} entries for the other account, none shared)`);

  // ── 14: the cursor carries no payload ─────────────────────────────────────
  const first = await lifeTimelinePage(OWNER, { limit: 1, filter: "ALL" });
  if (!first.nextCursor) fail("expected a cursor for the payload check");
  const decoded = Buffer.from(first.nextCursor, "base64url").toString("utf8");
  const parts = decoded.split("|");
  if (parts.length !== 3 || parts[0] !== "ALL" || !parts[1] || !parts[2]) {
    fail(`the cursor is not exactly (filter|at|id): ${decoded}`);
  }
  const bodies = (await (await rest(
    `yorisou_life_reflections?select=what_happened&owner_account_id=eq.${OWNER}&limit=100`,
  )).json()) as Array<{ what_happened: string | null }>;
  if (bodies.length === 0) fail("no reflection bodies to compare against — the payload check is vacuous");
  for (const row of bodies) {
    if (row.what_happened && decoded.includes(row.what_happened)) fail("the cursor contains reflection text");
  }
  ok("the cursor is exactly (filter|timestamp|id) and carries no source payload");

  const stateFirst = await lifeTimelinePage(OWNER, { limit: 1, filter: "STATE" });
  if (!stateFirst.nextCursor) fail("expected more than one state");
  try {
    await lifeTimelinePage(OWNER, { cursor: stateFirst.nextCursor, filter: "EXPERIENCE" });
    fail("a cursor minted under STATE was accepted under EXPERIENCE");
  } catch (error) {
    if (!String(error instanceof Error ? error.message : error).includes("osf1_timeline_cursor_invalid")) {
      fail("the cross-filter cursor raised the wrong error");
    }
  }
  try {
    await lifeTimelinePage(OWNER, { cursor: "garbage", filter: "ALL" });
    fail("a malformed cursor was accepted");
  } catch (error) {
    if (!String(error instanceof Error ? error.message : error).includes("osf1_timeline_cursor_invalid")) {
      fail("the malformed cursor raised the wrong error");
    }
  }
  ok("cursors stay bound to their filter, and a malformed one is still refused");

  // ── APP-P6-5 / §14: the app's own delete seam, and an unhydratable moment ─
  //
  // withdrawExperience issues exactly this PATCH. Going through the same transport the product uses
  // is the difference between "the trigger works" and "the product's delete works".
  const target = idOf((await walk(lifeTimelinePage, "EXPERIENCE", 100)).seq[0]);
  const withdraw = await rest(`yorisou_experience_cards?id=eq.${target}`, {
    method: "PATCH",
    body: JSON.stringify({ withdrawn_at: new Date().toISOString(), searchable: false }),
  });
  if (!withdraw.ok) fail(`the app's withdraw transport failed (HTTP ${withdraw.status})`);
  const afterWithdraw = await walk(lifeTimelinePage, "EXPERIENCE", 100);
  const legacyWithdraw = await walk(legacyAggregatedTimelinePage, "EXPERIENCE", 100);
  if (afterWithdraw.seq.map(idOf).includes(target)) fail("a card withdrawn through the app seam still appears");
  if (afterWithdraw.seq.join("|") !== legacyWithdraw.seq.join("|")) fail("withdraw diverged between the readers");
  ok("withdrawing through the product's own transport removes the moment from both readers");

  const goalTarget = idOf((await walk(lifeTimelinePage, "DIRECTION", 100)).seq[0]);
  const removed = await rest(`yorisou_goals?id=eq.${goalTarget}`, { method: "DELETE" });
  if (!removed.ok) fail(`deleting a goal failed (HTTP ${removed.status})`);
  if ((await walk(lifeTimelinePage, "DIRECTION", 100)).seq.map(idOf).includes(goalTarget)) {
    fail("a hard-deleted goal still appears in the timeline");
  }
  ok("a hard-deleted source disappears from the timeline without any read-time existence check");

  // A LIVE MOMENT POINTING AT NOTHING. The trigger makes this impossible in normal operation, so it
  // is induced deliberately: the RPC will happily index a reference nobody ever created. The reader
  // must drop it, keep serving the rest, and not repair anything on a read path.
  const ghost = "00000000-0000-4000-8000-00000000dead";
  await rest("rpc/yorisou_continuity_project", {
    method: "POST",
    body: JSON.stringify({
      p_owner_account_id: OWNER, p_source_family: "goal", p_source_ref: ghost,
      p_occurred_at: new Date().toISOString(), p_variant: null,
    }),
  });
  const ghostLive = (await (await rest(
    `yorisou_continuity_projections?select=source_ref&owner_account_id=eq.${OWNER}&source_ref=eq.${ghost}&invalidated_at=is.null`,
  )).json()) as unknown[];
  if (ghostLive.length !== 1) fail("the orphan fixture was not created — the hydration check would be vacuous");
  const withGhost = await walk(lifeTimelinePage, "ALL", 5);
  if (withGhost.seq.map(idOf).includes(ghost)) fail("an unhydratable moment was rendered");
  const stillLive = (await (await rest(
    `yorisou_continuity_projections?select=source_ref&owner_account_id=eq.${OWNER}&source_ref=eq.${ghost}&invalidated_at=is.null`,
  )).json()) as unknown[];
  if (stillLive.length !== 1) fail("the read repaired the index — a read path must not mutate canonical state");
  ok("a live moment whose source will not hydrate is dropped, the page still serves, and the read repairs nothing");
  await rest("rpc/yorisou_continuity_invalidate_source", {
    method: "POST",
    body: JSON.stringify({ p_owner_account_id: OWNER, p_source_family: "goal", p_source_ref: ghost }),
  });

  // ── DESTRUCTIVE, AND THEREFORE LAST ───────────────────────────────────────
  //
  // Invalidation is terminal in SQL, so nothing below can be undone and nothing may depend on the
  // index afterwards. These also go through the RPCs rather than a PATCH, because the index grants
  // service_role SELECT only — which is itself worth proving rather than assuming.
  const current = await walk(lifeTimelinePage, "ALL", 100);
  const victim = current.seq[Math.floor(current.seq.length / 2)];
  const victimId = idOf(victim);

  const patched = await rest(`yorisou_continuity_projections?source_ref=eq.${victimId}`, {
    method: "PATCH",
    body: JSON.stringify({ invalidated_at: new Date().toISOString() }),
  });
  const unchanged = await walk(lifeTimelinePage, "ALL", 100);
  if (unchanged.seq.join("|") !== current.seq.join("|")) {
    fail(`a direct PATCH to the index changed the timeline (HTTP ${patched.status}) — the index is writable`);
  }
  ok(`a direct write to the index changes nothing (HTTP ${patched.status}); only the RPCs may mutate it`);

  const transitioned = await (await rest("rpc/yorisou_continuity_invalidate_source", {
    method: "POST",
    body: JSON.stringify({
      p_owner_account_id: OWNER,
      p_source_family: kindOf(victim),
      p_source_ref: victimId,
    }),
  })).json();
  if (transitioned !== 1) fail(`invalidating one moment reported ${transitioned} transitions`);

  const afterInvalidation = await walk(lifeTimelinePage, "ALL", 3);
  if (afterInvalidation.seq.includes(victim)) fail("an invalidated moment still appears");
  ok("an invalidated moment disappears from the paged read");
  // The LEGACY reader still shows it, because the source row was never touched. That is precisely
  // what makes the index authoritative rather than a cache of the old behaviour.
  const legacyAfter = await walk(legacyAggregatedTimelinePage, "ALL", 3);
  if (!legacyAfter.seq.includes(victim)) fail("the legacy reader lost it too — the source was mutated, which must not happen");
  ok("the legacy reader still shows it — the index, not a source scan, is now authoritative");
  if (afterInvalidation.seq.join("|") !== current.seq.filter((x) => x !== victim).join("|")) {
    fail("paging across the invalidation skipped or duplicated a neighbour");
  }
  ok("its neighbours are neither skipped nor duplicated when paging across the gap at limit 3");

  await rest("rpc/yorisou_continuity_invalidate_owner", {
    method: "POST",
    body: JSON.stringify({ p_owner_account_id: OWNER }),
  });
  const blinded = await lifeTimelinePage(OWNER, { limit: 100, filter: "ALL" });
  const legacyWhole = await legacyAggregatedTimelinePage(OWNER, { limit: 100, filter: "ALL" });
  if (blinded.entries.length !== 0) fail("emptying the index did not empty the timeline — the read switch is not live");
  // Minus what the app's own delete seam removed above: withdrawn card, deleted goal.
  if (legacyWhole.entries.length !== EXPECTED - 2) {
    fail(`the legacy reader holds ${legacyWhole.entries.length}, expected ${EXPECTED - 2} — it is not independent of the index`);
  }
  ok("emptying the index empties the new reader and leaves the old one whole — the switch is genuinely live");

  console.log(`\nPAGINATION EQUIVALENCE OK — ${checks} checks, both readers agree exactly`);
}

main();
