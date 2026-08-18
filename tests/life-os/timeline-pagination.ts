// OSF-1 §4/§5 — walk the merged timeline against a real PostgREST.
//
// The timeline cursor is harder than the memory one and fails differently. It merges FOUR sources,
// each asked for limit+1 rows after the same (created_at, id) position, and then cuts the merge. A
// mistake here does not error — it silently drops whichever kind happened to fall on the boundary,
// which is invisible in any unit test and invisible to a person who never knew the row existed.
//
// Run by tests/life-os/timeline-pagination.sh, which supplies the stack.

import { lifeTimelinePage, TIMELINE_FILTERS, type TimelineFilter } from "@/lib/server/lifeOs/timeline";

const OWNER = process.env.OSF1_TL_OWNER ?? "acct_tl";
const OTHER = process.env.OSF1_TL_OTHER ?? "acct_tl_other";
const EXPECTED = Number.parseInt(process.env.OSF1_TL_EXPECTED ?? "0", 10);

function fail(message: string): never {
  console.log(`FAIL: ${message}`);
  process.exit(1);
}

async function walk(filter: TimelineFilter, limit: number) {
  const ids: string[] = [];
  const unique = new Set<string>();
  let cursor: string | null = null;
  let pages = 0;
  while (true) {
    const page = await lifeTimelinePage(OWNER, { cursor, limit, filter });
    pages += 1;
    if (page.filter !== filter) fail(`page reported filter ${page.filter}, asked for ${filter}`);
    if (page.entries.length > limit) fail(`page returned ${page.entries.length} for limit ${limit}`);
    for (const entry of page.entries) {
      ids.push(entry.id);
      unique.add(entry.id);
    }
    // Ordering must hold ACROSS pages, not merely inside one.
    for (let i = 1; i < page.entries.length; i += 1) {
      const prev = page.entries[i - 1];
      const cur = page.entries[i];
      if (prev.at < cur.at) fail(`out of order within a page: ${prev.at} before ${cur.at}`);
      if (prev.at === cur.at && prev.id < cur.id) fail("tie broken in the wrong direction");
    }
    if (!page.nextCursor) break;
    cursor = page.nextCursor;
    if (pages > 30) fail("the walk did not terminate — the cursor is not advancing");
  }
  if (ids.length !== unique.size) fail(`a row appeared on more than one page (filter ${filter})`);
  return { ids, pages };
}

async function main() {
  // 1-2. One page and multiple pages, 3-4. ties and mixed kinds are in the seed.
  const all = await walk("ALL", 7);
  console.log(`ALL: ${all.pages} pages, ${all.ids.length} distinct entries (expected ${EXPECTED})`);
  if (all.ids.length !== EXPECTED) fail(`${EXPECTED - all.ids.length} entry(ies) unreachable`);

  const single = await lifeTimelinePage(OWNER, { limit: 100, filter: "ALL" });
  if (single.entries.length !== EXPECTED) fail("a single large page did not return everything");
  if (single.nextCursor !== null) fail("a page holding everything still offered a next cursor");
  // The paged walk and the single page must agree, in order — this is what proves the merge is not
  // dropping a boundary row.
  const oneShot = single.entries.map((e) => e.id).join(",");
  if (oneShot !== all.ids.join(",")) fail("paged traversal disagrees with a single full page");

  // 5. Every filter is internally consistent and sums to the whole.
  let filteredTotal = 0;
  for (const filter of TIMELINE_FILTERS) {
    if (filter === "ALL") continue;
    const page = await walk(filter, 3);
    filteredTotal += page.ids.length;
    console.log(`${filter}: ${page.ids.length}`);
  }
  if (filteredTotal !== EXPECTED) fail(`filters sum to ${filteredTotal}, whole is ${EXPECTED}`);

  // 6. A cursor minted under one filter must not be replayed under another.
  const stateFirst = await lifeTimelinePage(OWNER, { limit: 1, filter: "STATE" });
  if (!stateFirst.nextCursor) fail("expected more than one state for the cross-filter test");
  try {
    await lifeTimelinePage(OWNER, { cursor: stateFirst.nextCursor, filter: "EXPERIENCE" });
    fail("a cursor minted under STATE was accepted under EXPERIENCE");
  } catch (error) {
    if (!String(error instanceof Error ? error.message : error).includes("osf1_timeline_cursor_invalid")) {
      fail("cross-filter cursor raised the wrong error");
    }
  }

  // 7. Malformed cursor refused rather than restarting silently.
  try {
    await lifeTimelinePage(OWNER, { cursor: "garbage", filter: "ALL" });
    fail("a malformed cursor was accepted");
  } catch (error) {
    if (!String(error instanceof Error ? error.message : error).includes("osf1_timeline_cursor_invalid")) {
      fail("malformed cursor raised the wrong error");
    }
  }

  // 8. Cross-user: nothing of the other person's ever appears, under any filter.
  const otherPage = await lifeTimelinePage(OTHER, { limit: 100, filter: "ALL" });
  const mine = new Set(single.entries.map((e) => e.id));
  for (const entry of otherPage.entries) {
    if (mine.has(entry.id)) fail("an entry appears in two different people's timelines");
  }
  if (otherPage.entries.length === 0) fail("the other account has no rows — the isolation check is vacuous");
  console.log(`cross-user: ${otherPage.entries.length} entries for the other account, none shared`);

  console.log("TIMELINE PAGINATION OK — every entry reachable exactly once, filters consistent, cursors bound to their filter");
}

main();
