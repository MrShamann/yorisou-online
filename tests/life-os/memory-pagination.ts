// OSF-1 §9 — walk EVERY page of memories against a real PostgREST.
//
// Run by tests/life-os/memory-pagination.sh, which supplies the stack. It is a separate file rather
// than an inline `node -e` so the @/ path alias resolves and so the walk is reviewable.
//
// WHAT THIS CATCHES THAT A UNIT TEST CANNOT. The cursor is a PostgREST `or=(...)` filter with a
// nested `and(...)`. Whether that string means what it is intended to mean is a fact about PostgREST,
// not about TypeScript — and nothing else in the suite reaches page two, so a broken filter would
// look exactly like a working one until someone confirmed their twenty-sixth memory.

import { listMemoryPage } from "@/lib/server/lifeOs/store";

async function main() {
  const OWNER = process.env.OSF1_PAGE_OWNER ?? "acct_p";
  const EXPECTED = Number.parseInt(process.env.OSF1_PAGE_EXPECTED ?? "30", 10);
  const PAGE = 7;

  const seen: string[] = [];
  const unique = new Set<string>();
  let cursor: string | null = null;
  let pages = 0;

  while (true) {
    const page = await listMemoryPage(OWNER, { cursor, limit: PAGE });
    pages += 1;
    for (const memory of page.memories) {
      seen.push(memory.id);
      unique.add(memory.id);
    }
    if (page.memories.length > PAGE) {
      console.log(`FAIL: a page returned ${page.memories.length} rows for a limit of ${PAGE}`);
      process.exit(1);
    }
    if (!page.nextCursor) break;
    cursor = page.nextCursor;
    if (pages > 20) {
      console.log("FAIL: the walk did not terminate — the cursor is not advancing");
      process.exit(1);
    }
  }

  console.log(`pages walked: ${pages}`);
  console.log(`rows returned: ${seen.length}, distinct: ${unique.size}, expected: ${EXPECTED}`);

  if (seen.length !== unique.size) {
    console.log("FAIL: a row appeared on more than one page — the cursor overlaps");
    process.exit(1);
  }
  if (unique.size !== EXPECTED) {
    console.log(`FAIL: ${EXPECTED - unique.size} row(s) unreachable — the cursor skips`);
    process.exit(1);
  }

  // A malformed cursor must be refused rather than silently restarting the list.
  try {
    await listMemoryPage(OWNER, { cursor: "not-a-cursor" });
    console.log("FAIL: a malformed cursor was accepted");
    process.exit(1);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (!message.includes("osf1_memory_cursor_invalid")) {
      console.log(`FAIL: a malformed cursor raised the wrong error: ${message}`);
      process.exit(1);
    }
  }

  console.log("PAGINATION OK — every row reachable exactly once, malformed cursor refused");
}

main();
