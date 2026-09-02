import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  LOCALES,
  NATIVE_REVIEW_PENDING,
  PUBLIC_LOCALES,
  localeHref,
} from "../../app/_corporate/i18n/locales";

/**
 * CORP-v1.4 — the language selector must offer every locale the site has.
 *
 * WHAT WENT WRONG, AND WHY NOTHING CAUGHT IT.
 *
 * The selector filtered on `status === "published"`. When that field was written in CORP-P5R2 it
 * meant "built", and the filter was correct. CORP-v1.2R1 then reused the same field to mean
 * "cleared for Production publication" and marked nineteen unreviewed locales `preview_only` — a
 * defensible call about publication that, through this one shared field, also removed those
 * nineteen languages from the only control a visitor has for reaching them.
 *
 * The site kept rendering all twenty-one perfectly. `resolveLocale` still accepted every code. The
 * route sweep passed 189/189 because it requests locales by URL, not through the selector. Nothing
 * failed. A reader in Seoul simply had no way to find the Korean site.
 *
 * The selector had no test at all. It does now, and it asserts the property that actually matters:
 * what a visitor can reach, not what a constant is called.
 */

const SELECTOR = join(process.cwd(), "app/_corporate/p5r2/LanguageSelector.tsx");

test("the selector offers every locale the registry says is reachable", () => {
  const src = readFileSync(SELECTOR, "utf8");
  // Strip comments: the rationale above is repeated in the component and names the old filter.
  const code = src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");

  assert.match(
    code,
    /const published = PUBLIC_LOCALES;/,
    "the selector must take its list from the registry's access axis, not from a local filter",
  );
  assert.ok(
    !/LOCALES\.filter\(/.test(code),
    "a local filter is back in the selector — that is how nineteen languages disappeared once",
  );
  assert.ok(
    !/status\s*===\s*"published"/.test(code),
    "the selector must never gate on a review or publication field",
  );
});

test("all twenty-one locales are reachable, including every unreviewed one", () => {
  assert.equal(PUBLIC_LOCALES.length, 21, `only ${PUBLIC_LOCALES.length} locales are reachable`);
  assert.equal(LOCALES.length, 21);
  // The nineteen awaiting review must be reachable — that is the whole correction.
  for (const l of NATIVE_REVIEW_PENDING) {
    assert.ok(
      PUBLIC_LOCALES.some((p) => p.code === l.code),
      `${l.code} awaits native review and has been made unreachable because of it`,
    );
  }
});

test("every locale is offered under its own name, in its own script and direction", () => {
  const seenNative = new Set<string>();
  for (const l of PUBLIC_LOCALES) {
    assert.ok(l.nativeName.trim().length > 0, `${l.code} has no endonym`);
    assert.ok(l.englishName.trim().length > 0, `${l.code} has no English name`);
    assert.ok(!seenNative.has(l.nativeName), `two locales share the endonym ${l.nativeName}`);
    seenNative.add(l.nativeName);
    assert.ok(["ltr", "rtl"].includes(l.direction), `${l.code} has no direction`);
  }
  // A reader who knows no Japanese must still find their language: the endonym is what is shown.
  assert.ok(PUBLIC_LOCALES.some((l) => l.nativeName === "한국어"));
  assert.ok(PUBLIC_LOCALES.some((l) => l.nativeName === "العربية" && l.direction === "rtl"));
});

test("switching language keeps the reader on the page they were reading", () => {
  // The selector builds each option with localeHref(path, code). Switching must never send someone
  // back to the home page — losing your place is how a language switch becomes a dead end.
  const src = readFileSync(SELECTOR, "utf8");
  assert.match(src, /href=\{localeHref\(path, l\.code\)\}/, "options must be built from the current path");
  for (const route of ["/ventures", "/about", "/build-with-us", "/company"]) {
    for (const l of PUBLIC_LOCALES) {
      const href = localeHref(route, l.code);
      assert.ok(href.startsWith(route), `${l.code} on ${route} would navigate to ${href}`);
    }
  }
});

test("the selector never renders an internal review token", () => {
  const src = readFileSync(SELECTOR, "utf8");
  for (const t of ["AI_TRANSLATED", "NATIVE_REVIEW_PENDING", "reviewState"]) {
    assert.ok(!src.includes(t), `the selector exposes the internal token ${t} to visitors`);
  }
});
