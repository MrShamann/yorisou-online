import assert from "node:assert/strict";
import test from "node:test";

import { getCopy } from "../../app/_corporate/i18n";
import {
  DEFAULT_LOCALE,
  LOCALES,
  PRODUCTION_READY,
  PUBLISHED,
} from "../../app/_corporate/i18n/locales";

/**
 * CORP-P5R2 §31 — every published locale is complete.
 *
 * The acceptance gate fails the package if subpages silently fall back to Japanese. A silent
 * fallback is exactly what a partially-filled content object produces, so completeness is asserted
 * structurally: every string reachable in the canonical Japanese object must exist, be a string, and
 * be non-empty in every other published locale.
 */
type Path = string;

/**
 * Collapse a copy object to path -> text.
 *
 * Arrays are joined rather than indexed. Several headings are arrays of PHRASE UNITS used for
 * script-aware line breaking, and the number of units is a property of the language: Japanese breaks
 * a heading into three clause-sized units where German needs two. Comparing them index-by-index
 * would report a correct translation as incomplete. What must hold is that the heading exists and
 * carries text in every locale — which is what joining tests.
 */
function stringPaths(value: unknown, prefix = ""): Map<Path, string> {
  const out = new Map<Path, string>();
  if (typeof value === "string") {
    out.set(prefix, value);
    return out;
  }
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === "string")) {
      out.set(prefix, (value as string[]).join(" "));
      return out;
    }
    value.forEach((v, i) => stringPaths(v, `${prefix}[${i}]`).forEach((s, k) => out.set(k, s)));
    return out;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      stringPaths(v, prefix ? `${prefix}.${k}` : k).forEach((s, key) => out.set(key, s));
    }
  }
  return out;
}

test("every locale in the registry is published and loadable", async () => {
  const codes = PUBLISHED.map((l) => l.code);
  assert.ok(codes.length >= 21, `expected at least 21 published locales, found ${codes.length}`);
  assert.ok(codes.includes(DEFAULT_LOCALE), "the default locale must be published");
  for (const code of codes) {
    const copy = await getCopy(code);
    assert.ok(copy, `locale "${code}" resolved to nothing`);
  }
});

test("no locale is missing any string the canonical Japanese source defines", async () => {
  const source = stringPaths(await getCopy(DEFAULT_LOCALE));
  const failures: string[] = [];
  for (const { code } of PUBLISHED) {
    if (code === DEFAULT_LOCALE) continue;
    const target = stringPaths(await getCopy(code));
    const missing = [...source.keys()].filter((k) => !target.has(k));
    const empty = [...target.entries()].filter(([, v]) => v.trim() === "").map(([k]) => k);
    if (missing.length) failures.push(`${code}: missing ${missing.length} (${missing.slice(0, 4).join(", ")})`);
    if (empty.length) failures.push(`${code}: empty ${empty.length} (${empty.slice(0, 4).join(", ")})`);
  }
  assert.deepEqual(failures, [], `incomplete locales:\n${failures.join("\n")}`);
});

test("no locale silently ships the Japanese source text as its own", async () => {
  // Proper nouns are legitimately identical everywhere; prose is not.
  /*
 * CORP-v1.3.1 — `かかり` removed.
 *
 * This is an ALLOW list of strings a locale may legitimately leave identical to the Japanese. It
 * listed `かかり`, which the claim guard's `brand-transliteration` rule forbids outright — an allow
 * entry directly contradicting a ban. It was unreachable (no locale contains it, and the ban would
 * fail the build first), so removing it changes no outcome; it closes a loophole that would have
 * opened the moment someone added the string this list said was fine.
 */
const ALLOWED_IDENTICAL = /^(Yorisou|YORISOU|MIRAI MOVE|Kakari|よりそう|合同会社YORISOU|YORISOU LLC)$/;

  /**
   * Paths that carry IDENTIFIERS rather than prose, and must be byte-identical in every locale:
   * URLs, route hrefs, venture wordmarks and lane keys. Excluding them BY PATH keeps the echo
   * detector sharp. The alternative — raising the "how many identical strings are tolerable"
   * threshold — would blunt exactly the signal this test exists to catch.
   */
  const IDENTIFIER_PATH =
    /(\.siteUrl$|\.href$|\.key$|^ventures\.cards\[\d+\]\.name$|^buildWithUs\.lanes\[\d+\]\.ventures$)/;
  const source = stringPaths(await getCopy(DEFAULT_LOCALE));
  const failures: string[] = [];
  for (const { code } of PUBLISHED) {
    if (code === DEFAULT_LOCALE) continue;
    const target = stringPaths(await getCopy(code));
    const echoed = [...source.entries()].filter(([k, v]) => {
      const t = target.get(k);
      return (
        t !== undefined &&
        t === v &&
        v.length > 12 &&
        !ALLOWED_IDENTICAL.test(v.trim()) &&
        !IDENTIFIER_PATH.test(k)
      );
    });
    // A handful of shared brand lines is fine; wholesale echo means the locale was never translated.
    if (echoed.length > 3) {
      failures.push(
        `${code}: ${echoed.length} untranslated — ${echoed.slice(0, 6).map(([k]) => k).join(", ")}`,
      );
    }
  }
  assert.deepEqual(failures, [], `locales echoing the Japanese source:\n${failures.join("\n")}`);
});

test("every RTL locale is declared with a direction the shell can act on", () => {
  for (const l of LOCALES) {
    assert.ok(
      l.direction === "ltr" || l.direction === "rtl",
      `locale ${l.code} has no usable direction`,
    );
    assert.ok(l.nativeName.trim().length > 0, `locale ${l.code} has no endonym`);
    assert.ok(l.script.trim().length > 0, `locale ${l.code} has no script tag`);
  }
  assert.ok(LOCALES.some((l) => l.direction === "rtl"), "expected at least one RTL locale");
});

/**
 * CORP-v1.2R1 §7 — Preview availability and Production readiness are separate axes.
 *
 * Nineteen locales are complete, type-checked and render correctly, and have still never been read
 * by a native speaker. Rendering correctly is not the same as being fit to publish, so Production
 * routing must consult PRODUCTION_READY rather than "did it render". This test exists so that a
 * later change cannot quietly promote an unreviewed locale by flipping one word in the registry.
 */
test("only human-reviewed locales are cleared for Production", () => {
  const ready = PRODUCTION_READY.map((l) => l.code).sort();
  assert.deepEqual(ready, ["en", "ja"], `unexpected Production-ready set: ${ready.join(", ")}`);

  for (const l of PRODUCTION_READY) {
    assert.ok(
      l.reviewState === "SOURCE_CANONICAL" || l.reviewState === "HUMAN_REVIEWED",
      `${l.code} is cleared for Production but its review state is ${l.reviewState}`,
    );
  }

  // Everything else must still be available in Preview — this posture must not hide translations.
  const previewCodes = PUBLISHED.map((l) => l.code);
  assert.equal(previewCodes.length, 21, `expected 21 locales available in Preview, got ${previewCodes.length}`);
  for (const l of LOCALES) {
    if (l.reviewState === "AI_TRANSLATED") {
      assert.equal(l.status, "preview_only", `${l.code} is AI-translated but is not marked preview_only`);
    }
  }
});
