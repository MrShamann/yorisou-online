#!/usr/bin/env node
// OSF-1 — the governance-truth guard.
//
// WHAT THIS EXISTS TO PREVENT, AND WHY A TEST RATHER THAN A NOTE.
//
// Six OSF-1 documents once recorded that "Governance Pack v0.4.1 is the effective corpus" and that the
// Founder-installed Project Resources "sit at the task-prompt tier". Both were false, and neither was a
// careless slip: they were the confident output of a thorough repository search, which found no v0.7.0
// file — because the active baseline lives at a layer this repository cannot see. The observation was
// right and the inference was wrong.
//
// A wrong governance claim does not fail a test, it gets CITED. It survived two packages that way. So
// the narrow, checkable half of the rule is enforced here:
//
//   No current OSF-1 truth document may assert that an older pack is the ACTIVE / CURRENT / EFFECTIVE
//   / BINDING governance baseline.
//
// WHAT IT MUST NOT FORBID. Historical references are legitimate and necessary — the correction document
// is full of them, and a guard that banned the string "v0.4.1" would force the next author to delete the
// record of the mistake in order to pass. That would be the same failure wearing the opposite sign. So
// this matches an ASSERTION SHAPE (a version adjacent to an authority word), and any line that carries a
// historical marker is allowed.
//
//   node tests/governance/osf1-governance-truth.mjs

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DOCS = "docs/yorisou/osf1";

/** The one truth every current OSF-1 document must be consistent with. */
const ACTIVE_BASELINE = "v0.7.0";

/** Packs that are historical. Naming them is fine; calling one CURRENT is not. */
const SUPERSEDED = ["v0.4.1", "v0.4.0", "v0.3.3", "v0.3.1"];

/** Words that turn a version mention into a claim of present authority. */
const AUTHORITY_WORDS = [
  "active",
  "current",
  "effective",
  "binding",
  "authoritative",
  "governs",
  "in force",
];

/**
 * Markers that make a line a HISTORICAL statement, which is always allowed.
 *
 * Deliberately generous. A guard that is hard to satisfy honestly gets satisfied dishonestly — by
 * deleting the history instead of labelling it.
 */
const HISTORICAL = [
  "historical",
  "superseded",
  "corrected",
  "was wrong",
  "were wrong",
  "previously",
  "formerly",
  "archived",
  "no longer",
  "used to",
  "written against",
  "self-describes",
  "this line previously read",
  "v1.0 (",
  "version history",
  "~~",
];

/**
 * Strip everything that is NOT an assertion, before looking for one.
 *
 * The first version of this guard reported eleven violations and nine were its own fault: it matched the
 * word "current" inside the PATH `resources/governance/current/`. A file path is not a claim about
 * authority, and a guard that cannot tell them apart trains people to delete accurate sentences.
 *
 * Also dropped: a line that is a QUOTATION rather than a statement. §2 of the precedence document lists
 * the false claims verbatim so the record of the mistake survives — flagging those would make the guard
 * demand the deletion of the very history it exists to protect.
 */
function assertionText(raw) {
  const trimmed = raw.trim();
  // A quoted claim, a blockquote, or struck-through text is being reported, not asserted.
  if (trimmed.startsWith('- "') || trimmed.startsWith("> ") || trimmed.startsWith("~~")) return "";
  return raw
    .replace(/`[^`]*`/g, " ")        // inline code, which is where paths live
    .replace(/\]\([^)]*\)/g, "] ")   // markdown link targets
    .replace(/\/[A-Za-z0-9_./-]+/g, " ") // any remaining bare path segment
    .toLowerCase();
}

const failures = [];
let scanned = 0;
let flaggedLines = 0;

for (const name of readdirSync(DOCS).filter((f) => f.endsWith(".md"))) {
  const path = join(DOCS, name);
  const lines = readFileSync(path, "utf8").split("\n");
  scanned += 1;

  for (const [index, raw] of lines.entries()) {
    const line = assertionText(raw);
    if (line.length === 0) continue;
    const pack = SUPERSEDED.find((v) => line.includes(v));
    if (!pack) continue;
    const authority = AUTHORITY_WORDS.find((w) => line.includes(w));
    if (!authority) continue;
    flaggedLines += 1;
    if (HISTORICAL.some((marker) => line.includes(marker))) continue;
    failures.push(
      `${path}:${index + 1}\n    claims ${pack} is "${authority}" with no historical marker\n    ${raw.trim().slice(0, 150)}`,
    );
  }
}

// A guard that can pass because it found nothing to look at is not a guard. The corpus genuinely
// contains superseded-pack mentions beside authority words — that is what §2 of the precedence document
// is made of — so zero flagged lines means the matcher has stopped working.
if (flaggedLines === 0) {
  console.error(
    "GOVERNANCE GUARD IS VACUOUS: no line in any OSF-1 document mentions a superseded pack near an\n" +
      "authority word. The corrected documents are supposed to contain several. The matcher is broken,\n" +
      "not the corpus.",
  );
  process.exit(1);
}

// And the active baseline has to be named somewhere, or the corpus records no current authority at all.
const precedence = readFileSync(join(DOCS, "OSF1_GOVERNANCE_PRECEDENCE.md"), "utf8");
if (!precedence.includes(ACTIVE_BASELINE)) {
  console.error(`GOVERNANCE GUARD: OSF1_GOVERNANCE_PRECEDENCE.md never names the active baseline ${ACTIVE_BASELINE}.`);
  process.exit(1);
}
if (!/ACTIVE GOVERNANCE/i.test(precedence)) {
  console.error("GOVERNANCE GUARD: OSF1_GOVERNANCE_PRECEDENCE.md does not state an ACTIVE GOVERNANCE section.");
  process.exit(1);
}

if (failures.length > 0) {
  console.error(`GOVERNANCE TRUTH GUARD — ${failures.length} stale claim(s):\n`);
  for (const failure of failures) console.error(`  ${failure}\n`);
  console.error(
    "A superseded pack may be NAMED freely. It may not be called active, current, effective or binding\n" +
      "without a historical marker on the same line. See OSF1_GOVERNANCE_PRECEDENCE.md §2 for why.",
  );
  process.exit(1);
}

console.log(
  `governance truth OK — ${scanned} OSF-1 documents scanned, ${flaggedLines} superseded-pack mentions ` +
    `checked, all historical; active baseline ${ACTIVE_BASELINE} recorded`,
);
