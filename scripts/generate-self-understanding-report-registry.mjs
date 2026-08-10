#!/usr/bin/env node
// POR-1 R1 — bundle the governed report library into the serverless runtime.
//
// THE DEFECT THIS EXISTS TO CLOSE.
//
// `loader.ts` resolved report markdown with `path.join(process.cwd(), "content/…")` and read it with
// `fs.readFileSync` AT REQUEST TIME. The report PAGE is prerendered, so its files exist while the
// build runs and it works. The DOWNLOAD route is dynamic: in the Hosted serverless runtime the
// content directory is not part of the function, the read throws, and the route's blanket catch
// reported that as "no such report". Proven hosted with a valid code and no `result` parameter, so
// the continuity guard was not even involved: page 200, download 404. Every report, not an edge case.
//
// WHY A GENERATED REGISTRY RATHER THAN FILE TRACING.
//
// `outputFileTracingIncludes` would keep the `fs` read and ask the bundler to carry the files along.
// This project builds with Turbopack, where that mechanism's behaviour is not something to bet a
// deploy cycle on — and a tracing rule that silently stops matching fails the same invisible way the
// original defect did. A static import cannot silently stop being included: if the module is
// missing, the build fails.
//
// THE MARKDOWN REMAINS THE ONE CANONICAL SOURCE. This file is generated from it, never edited by
// hand, and `--check` fails CI if the two drift.

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const LIBRARY_VERSION = readLibraryVersion();
const CONTENT_DIR = path.join(ROOT, "content/yorisou/reports/self-understanding", LIBRARY_VERSION);
const OUT_FILE = path.join(ROOT, "lib/yorisou/reports/generated/reportSources.ts");

function readLibraryVersion() {
  const typesSource = fs.readFileSync(path.join(ROOT, "lib/yorisou/reports/types.ts"), "utf8");
  const match = /SELF_UNDERSTANDING_REPORT_LIBRARY_VERSION\s*=\s*"([^"]+)"/.exec(typesSource);
  if (!match) throw new Error("could not resolve SELF_UNDERSTANDING_REPORT_LIBRARY_VERSION");
  return match[1];
}

/** Every governed public code, from the taxonomy that defines them. */
function readTaxonomyCodes() {
  const source = fs.readFileSync(path.join(ROOT, "lib/yorisou/public-result/taxonomy.ts"), "utf8");
  return [...source.matchAll(/publicCode:\s*"([^"]+)"/g)].map((m) => m[1]);
}

function build() {
  const codes = readTaxonomyCodes();
  if (codes.length === 0) throw new Error("no public codes found in the taxonomy");

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));

  // THE BUILD FAILS WHEN A GOVERNED REPORT IS MISSING. A registry that quietly omits a code would
  // reproduce the defect one report at a time.
  const missing = codes.filter((code) => !files.includes(code));
  if (missing.length) {
    throw new Error(`missing report markdown for governed code(s): ${missing.join(", ")}`);
  }
  const orphaned = files.filter((name) => !codes.includes(name));
  if (orphaned.length) {
    throw new Error(`report markdown with no governed code: ${orphaned.join(", ")}`);
  }

  const entries = codes
    .slice()
    .sort()
    .map((code) => {
      const source = fs.readFileSync(path.join(CONTENT_DIR, `${code}.md`), "utf8");
      // JSON.stringify is always valid TypeScript and cannot be broken by backticks, `${` or any
      // other sequence the report copy might legitimately contain.
      return `  ${JSON.stringify(code)}: ${JSON.stringify(source)},`;
    });

  return `// GENERATED FILE — DO NOT EDIT.
//
// Source of truth: content/yorisou/reports/self-understanding/${LIBRARY_VERSION}/*.md
// Regenerate:     npm run generate:report-registry
// Verified in CI: npm run check:report-registry
//
// The governed report library, embedded so the DYNAMIC download route can serve it from the Hosted
// serverless runtime. It previously read these files with \`fs\` at request time, where they do not
// exist, and the failure was reported to people as "report not found".
//
// Raw markdown only. Parsing, access-mode selection and sanitization are unchanged and still happen
// in the loader, so what a person receives is decided by the same code as before.

export const SELF_UNDERSTANDING_REPORT_LIBRARY_VERSION_AT_GENERATION = ${JSON.stringify(LIBRARY_VERSION)};

export const SELF_UNDERSTANDING_REPORT_SOURCES: Readonly<Record<string, string>> = Object.freeze({
${entries.join("\n")}
});
`;
}

const generated = build();
const check = process.argv.includes("--check");

if (check) {
  const current = fs.existsSync(OUT_FILE) ? fs.readFileSync(OUT_FILE, "utf8") : "";
  if (current !== generated) {
    console.error(
      "Report registry is STALE. The markdown is the canonical source and the registry no longer " +
        "matches it. Run: npm run generate:report-registry",
    );
    process.exit(1);
  }
  const digest = createHash("sha256").update(generated).digest("hex").slice(0, 12);
  console.log(
    JSON.stringify({
      status: "ok",
      libraryVersion: LIBRARY_VERSION,
      reports: (generated.match(/^ {2}"/gm) || []).length,
      digest,
    }),
  );
} else {
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, generated, "utf8");
  console.log(`wrote ${path.relative(ROOT, OUT_FILE)} (${LIBRARY_VERSION})`);
}
