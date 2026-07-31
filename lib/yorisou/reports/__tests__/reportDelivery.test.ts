// POR-1 R1 — the governed report library must be deliverable from the serverless runtime.
//
// THE DEFECT THIS EXISTS TO PREVENT RETURNING.
//
// `loader.ts` resolved report markdown with `path.join(process.cwd(), "content/…")` and read it via
// `fs.readFileSync` AT REQUEST TIME. The report PAGE is prerendered, so its files exist while the
// build runs. The DOWNLOAD route is dynamic: in the Hosted serverless runtime the content directory
// is not part of the function, the read threw, and the route's blanket catch reported that as
// "no such report".
//
// Proven hosted with a valid code and NO `result` parameter, so the continuity guard was not even
// involved:
//
//     code MS-KI     page 200     download 404
//
// Every report, not an edge case — and invisible precisely because 404 is also the correct answer
// for a report that legitimately does not exist.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { PUBLIC_ARCHETYPE_TAXONOMY } from "@/lib/yorisou/public-result";
import {
  assertValidSelfUnderstandingReportCode,
  buildSanitizedSelfUnderstandingReportMarkdown,
  loadParsedSelfUnderstandingReportByCode,
} from "../loader";
import { SELF_UNDERSTANDING_REPORT_SOURCES } from "../generated/reportSources";
import { SELF_UNDERSTANDING_REPORT_LIBRARY_VERSION } from "../types";

const CODES = PUBLIC_ARCHETYPE_TAXONOMY.map((entry) => entry.publicCode);

test("the registry covers every governed code, and nothing else", () => {
  // The registry IS the delivery mechanism now. A code missing from it is a report that 404s in
  // production, which is exactly the defect — so the set is asserted rather than assumed.
  assert.equal(CODES.length > 0, true, "the taxonomy must define codes");
  assert.deepEqual(
    Object.keys(SELF_UNDERSTANDING_REPORT_SOURCES).sort(),
    [...CODES].sort(),
    "registry codes must match the governed taxonomy exactly",
  );
});

test("EVERY governed report builds a non-empty download without touching the filesystem", () => {
  // The hosted failure was global. So this asserts every code, not a sample: a per-report regression
  // would otherwise reappear one report at a time.
  for (const code of CODES) {
    const markdown = buildSanitizedSelfUnderstandingReportMarkdown(code);
    assert.equal(typeof markdown, "string", code);
    assert.equal(markdown.length > 200, true, `${code}: report content must not be empty`);
    assert.match(markdown, new RegExp(`publicCode: "${code}"`), `${code}: frontmatter carries its code`);
    assert.match(
      markdown,
      new RegExp(`libraryVersion: "${SELF_UNDERSTANDING_REPORT_LIBRARY_VERSION}"`),
      `${code}: library version is preserved`,
    );
  }
});

test("no internal authoring metadata reaches the downloaded document", () => {
  // The registry embeds the RAW markdown, so anything the parser and sanitizer used to strip must
  // still be stripped. Bundling the source must not become a way to ship editorial internals.
  const forbidden = [
    "purchaseStatus",
    "contentStatus",
    "codexExecutableNow",
    "createdFor",
    "visibility",
    "implementation memo",
    "review note",
  ];
  for (const code of CODES) {
    const markdown = buildSanitizedSelfUnderstandingReportMarkdown(code);
    for (const field of forbidden) {
      assert.equal(
        markdown.toLowerCase().includes(field.toLowerCase()),
        false,
        `${code}: downloaded content must not carry internal field "${field}"`,
      );
    }
  }
});

test("an unknown code is still refused, and refused the same way as before", () => {
  // Concealment is unchanged. The route maps this to the indistinguishable 404; what changed is that
  // a report which EXISTS and fails to build no longer shares that answer.
  for (const bogus of ["P05", "ZZ-ZZ", "", "../secrets", "MS-KI "]) {
    assert.throws(
      () => assertValidSelfUnderstandingReportCode(bogus),
      /Invalid publicCode/,
      `"${bogus}" must be rejected`,
    );
  }
});

test("a code missing from the registry throws, rather than yielding an empty report", () => {
  // The generator refuses to emit a registry that omits a governed code and CI refuses a stale one,
  // so this is defence in depth — but silently serving an empty document would be far worse than
  // failing, and that is what this pins.
  const parsed = loadParsedSelfUnderstandingReportByCode(CODES[0]);
  assert.equal(typeof parsed.frontmatter.publicCode, "string");
  assert.equal(parsed.frontmatter.publicCode, CODES[0]);
});

test("the loader no longer reads the filesystem, asserted against its source", () => {
  // THE SPECIFIC MECHANISM THAT BROKE, guarded structurally.
  //
  // A runtime `fs` read in this module works locally, works in `next build`, and fails only once
  // deployed — the worst possible failure shape, and the reason this went unnoticed for an entire
  // package. A behavioural test cannot catch its return, because the file IS present everywhere the
  // test suite runs. Only the source can.
  const loaderSource = readFileSync(
    new URL("../loader.ts", import.meta.url),
    "utf8",
  )
    // Comments explain the defect by name; they are documentation, not behaviour.
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

  for (const forbidden of ["fs.readFileSync", "fs.existsSync", "process.cwd()", 'from "node:fs"']) {
    assert.equal(
      loaderSource.includes(forbidden),
      false,
      `loader.ts must not use ${forbidden} — report content is embedded at build time`,
    );
  }
});
