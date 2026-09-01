import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

/**
 * CORP-P5R2 §28 — internal tokens must never reach a public visitor.
 *
 * Translation review state is real and is tracked, but it is engineering metadata. A visitor reading
 * the Arabic Company page must not see "AI_TRANSLATED", "SOURCE_REQUIRED" or a "TODO". This test
 * reads the shipped copy files and the rendering layer and fails the build on any leak.
 */
// tsx may transpile this file to CJS, where import.meta.dirname is undefined. Resolve from the
// process working directory instead and prove it is the repository root before reading anything.
const ROOT = process.cwd();
if (!readFileSync(path.join(ROOT, "package.json"), "utf8").includes("\"next\"")) {
  throw new Error(`tests must run from the repository root; got ${ROOT}`);
}
const CONTENT_DIR = path.join(ROOT, "app/_corporate/i18n/content");
const VIEW_DIR = path.join(ROOT, "app/_corporate/p5r2");

const FORBIDDEN = [
  "SOURCE_REQUIRED",
  "VERIFY_",
  "BLOCKER",
  "TODO",
  "INTERNAL_ONLY",
  "COMPANY_REGISTRATION_",
  "VERIFIED_CORPORATE_",
  "NOT_CONFIRMED",
  "UNRESOLVED",
  "PENDING_SOURCE",
  "AI_TRANSLATED",
  "HUMAN_REVIEWED",
  "FOUNDER_APPROVED",
  "SOURCE_CANONICAL",
  "FIXME",
  "XXX",
  "PLACEHOLDER",
  "Lorem ipsum",
];

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith(".ts") || p.endsWith(".tsx") ? [p] : [];
  });
}

test("no internal token appears in any locale's public copy", () => {
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".ts"));
  assert.ok(files.length > 0, "expected locale content files to exist");
  const leaks: string[] = [];
  for (const f of files) {
    const text = readFileSync(path.join(CONTENT_DIR, f), "utf8");
    for (const token of FORBIDDEN) {
      if (text.includes(token)) leaks.push(`${f}: ${token}`);
    }
  }
  assert.deepEqual(leaks, [], `internal tokens found in public copy:\n${leaks.join("\n")}`);
});

test("no internal token is rendered by the P5R2 view layer", () => {
  const leaks: string[] = [];
  for (const p of walk(VIEW_DIR)) {
    const text = readFileSync(p, "utf8");
    for (const token of FORBIDDEN) {
      if (text.includes(token)) leaks.push(`${path.relative(ROOT, p)}: ${token}`);
    }
  }
  assert.deepEqual(leaks, [], `internal tokens found in the view layer:\n${leaks.join("\n")}`);
});

test("the private Founder mailbox never appears in shipped corporate source", () => {
  // The private address is reconstructed here so this file itself does not contain it verbatim.
  const priv = ["jy", ".", "edward", "@", "gmail", ".com"].join("");
  const dirs = [CONTENT_DIR, VIEW_DIR, path.join(ROOT, "app/_corporate/i18n")];
  const leaks: string[] = [];
  for (const dir of dirs) {
    for (const p of walk(dir)) {
      if (readFileSync(p, "utf8").includes(priv)) leaks.push(path.relative(ROOT, p));
    }
  }
  assert.deepEqual(leaks, [], `private address present in public source:\n${leaks.join("\n")}`);
});
