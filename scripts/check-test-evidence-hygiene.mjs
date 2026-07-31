#!/usr/bin/env node
// POR-1 R3 — no authentication credential may survive in test evidence.
//
// THE DEFECT THIS EXISTS TO CLOSE.
//
// When a `page.request.*` call THROWS, Playwright attaches its call log to the error — and that log
// contains the request headers verbatim, including `cookie: yorisou_session=…; yorisou_account=…`.
// A full session credential and a full encrypted account record therefore appeared in run output and
// in the retained trace. Nothing reached the repository (`test-results/` is gitignored) and the
// traces were deleted, but evidence handling is not something to leave to whoever remembers.
//
// R2 removes the dominant source: thrown requests on the deletion path are now caught and reconciled
// rather than allowed to escape with their call log. This is the backstop for everything else.
//
// Usage:
//   node scripts/check-test-evidence-hygiene.mjs            scan test-results/ and fail on a hit
//   node scripts/check-test-evidence-hygiene.mjs --selftest  prove the scanner actually catches one
//
// Cookie NAMES may appear — they are not secret and are useful in diagnostics. Cookie VALUES may not.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const EVIDENCE_DIRS = ["test-results", "playwright-report", "blob-report"];

/**
 * A credential is a cookie NAME followed by an assignment and a long opaque value.
 *
 * Matching on the name alone would flag every honest diagnostic that mentions `yorisou_session`,
 * which is exactly the sort of false positive that gets a check disabled. The value is what matters.
 */
const CREDENTIAL_PATTERNS = [
  { label: "yorisou_session value", re: /yorisou_session=[A-Za-z0-9_\-]{24,}/ },
  { label: "yorisou_account value", re: /yorisou_account=[A-Za-z0-9_\-]{24,}/ },
  { label: "bearer token", re: /[Bb]earer\s+[A-Za-z0-9_\-.]{40,}/ },
  { label: "supabase service key", re: /eyJ[A-Za-z0-9_\-]{30,}\.[A-Za-z0-9_\-]{30,}/ },
  { label: "supabase access token", re: /sbp_[A-Za-z0-9]{20,}/ },
  { label: "synthetic password", re: /Cpc1![A-Za-z0-9\-]{8,}/ },
];

const TEXTUAL = /\.(txt|md|json|log|html|xml|yaml|yml)$/i;

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function scan(dirs) {
  const findings = [];
  for (const dir of dirs) {
    for (const file of walk(path.isAbsolute(dir) ? dir : path.join(ROOT, dir))) {
      // Traces are zipped binaries. They are not scanned here — they are REFUSED outright below,
      // because a trace of a credential-bearing request contains the credential by construction and
      // no amount of scanning makes it safe to keep or upload.
      if (file.endsWith(".zip")) {
        findings.push({ file: path.relative(ROOT, file), label: "retained trace archive" });
        continue;
      }
      if (!TEXTUAL.test(file)) continue;
      let content;
      try {
        content = fs.readFileSync(file, "utf8");
      } catch {
        continue;
      }
      for (const { label, re } of CREDENTIAL_PATTERNS) {
        if (re.test(content)) findings.push({ file: path.relative(ROOT, file), label });
      }
    }
  }
  return findings;
}

if (process.argv.includes("--selftest")) {
  // THE CANARY. A checker that has never caught anything is indistinguishable from one that cannot.
  const tmp = fs.mkdtempSync(path.join(ROOT, ".evidence-hygiene-selftest-"));
  try {
    // A synthetic value shaped like the real thing. Not a credential — nothing issued it and nothing
    // will accept it — but it exercises the exact pattern the real leak had.
    fs.writeFileSync(
      path.join(tmp, "error-context.md"),
      "cookie: yorisou_locale=ja; yorisou_session=CANARYvalue0000000000000000000000; other\n",
      "utf8",
    );
    const caught = scan([tmp]);
    if (!caught.some((f) => f.label === "yorisou_session value")) {
      console.error("SELFTEST FAILED: the scanner did not catch a planted session credential");
      process.exit(1);
    }

    // ...and it must NOT fire on a cookie NAME used in an honest diagnostic.
    fs.writeFileSync(
      path.join(tmp, "error-context.md"),
      "the yorisou_session cookie was replayed and correctly refused with 401\n",
      "utf8",
    );
    if (scan([tmp]).length > 0) {
      console.error("SELFTEST FAILED: the scanner fired on a cookie NAME with no value");
      process.exit(1);
    }
    console.log(JSON.stringify({ status: "ok", selftest: "passed", patterns: CREDENTIAL_PATTERNS.length }));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  process.exit(0);
}

const findings = scan(EVIDENCE_DIRS);
if (findings.length > 0) {
  console.error("TEST EVIDENCE HYGIENE FAILED — credential-bearing artifacts are present:");
  // The FINDING is reported, never the matched text. Printing the hit would be the same leak.
  for (const f of findings.slice(0, 25)) console.error(`  ${f.label}  ${f.file}`);
  if (findings.length > 25) console.error(`  …and ${findings.length - 25} more`);
  console.error("\nDelete these artifacts. Do not upload or attach them.");
  process.exit(1);
}
console.log(JSON.stringify({ status: "ok", scanned: EVIDENCE_DIRS, findings: 0 }));
