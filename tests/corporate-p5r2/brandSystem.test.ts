import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { inflateSync } from "node:zlib";

import {
  VENTURE_BRAND,
  VENTURE_CLASS,
  YORISOU_ARTWORK,
  YORISOU_PALETTE,
  YORISOU_STRAPLINE_JA,
  ventureCounts,
} from "../../app/_corporate/brand";
import { getCopy } from "../../app/_corporate/i18n";
import { PUBLISHED } from "../../app/_corporate/i18n/locales";
import { VENTURE_FORMATION } from "../../app/_corporate/p5r2/ventureState";

/**
 * CORP-v1.3 — the brand system guard.
 *
 * A brand system that lives only in a document drifts the first time someone picks a colour that
 * looks right. Everything asserted here is checkable: the artwork is pinned by hash, the palette is
 * decoded OUT OF that artwork rather than trusted, the contrast floors are computed, and the venture
 * count is derived from the same evidence the formation stages come from.
 *
 * The point of the palette test in particular: the accent used to be a jade green chosen before any
 * logo existed. Once the Founder's artwork arrived, "the site's accent" had a right answer, and this
 * test is what stops it drifting back to a pleasant guess.
 */

const ROOT = process.cwd();
const ARTWORK = join(ROOT, "public/brand/yorisou-logo.png");

/* ── a minimal PNG reader, so the palette claim is verified rather than asserted ─────────── */

type Decoded = { width: number; height: number; rgba: Buffer };

function decodePng(file: string): Decoded {
  const buf = readFileSync(file);
  assert.equal(buf.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", "not a PNG");
  let off = 8;
  let width = 0;
  let height = 0;
  let colourType = -1;
  let bitDepth = 0;
  const idat: Buffer[] = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.subarray(off + 4, off + 8).toString("ascii");
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data.readUInt8(8);
      colourType = data.readUInt8(9);
      assert.equal(data.readUInt8(12), 0, "interlaced PNG is not supported by this reader");
    } else if (type === "IDAT") idat.push(Buffer.from(data));
    else if (type === "IEND") break;
    off += 12 + len;
  }
  assert.equal(bitDepth, 8, "expected 8-bit channels");
  assert.equal(colourType, 6, "expected truecolour WITH alpha — the artwork must stay transparent");

  const raw = inflateSync(Buffer.concat(idat));
  const bpp = 4;
  const stride = width * bpp;
  const out = Buffer.alloc(height * stride);
  let p = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = raw[p];
    p += 1;
    const row = y * stride;
    const prev = row - stride;
    for (let x = 0; x < stride; x += 1) {
      const cur = raw[p + x];
      const a = x >= bpp ? out[row + x - bpp] : 0;
      const b = y > 0 ? out[prev + x] : 0;
      const c = x >= bpp && y > 0 ? out[prev + x - bpp] : 0;
      let v: number;
      if (filter === 0) v = cur;
      else if (filter === 1) v = cur + a;
      else if (filter === 2) v = cur + b;
      else if (filter === 3) v = cur + ((a + b) >> 1);
      else if (filter === 4) {
        const pa = Math.abs(b - c);
        const pb = Math.abs(a - c);
        const pc = Math.abs(a + b - 2 * c);
        v = cur + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
      } else throw new Error(`unknown PNG filter ${filter}`);
      out[row + x] = v & 0xff;
    }
    p += stride;
  }
  return { width, height, rgba: out };
}

function hex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
function rgb(h: string): [number, number, number] {
  const s = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)) as [number, number, number];
}
function luminance(h: string): number {
  const [r, g, b] = rgb(h).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/* ── 1. the artwork itself ───────────────────────────────────────────────────────────────── */

test("the Founder's artwork is byte-for-byte the one the brand system was read from", () => {
  assert.ok(existsSync(ARTWORK), "public/brand/yorisou-logo.png is missing");
  const sha = createHash("sha256").update(readFileSync(ARTWORK)).digest("hex");
  assert.equal(
    sha,
    YORISOU_ARTWORK.sha256,
    "the logo file changed. Every colour in YORISOU_PALETTE was sampled from the recorded file, so " +
      "a new file means the palette must be re-sampled — not that this hash should be updated.",
  );
});

test("the artwork is still the full square lockup, still transparent, never cropped", () => {
  const png = decodePng(ARTWORK);
  assert.equal(png.width, YORISOU_ARTWORK.width);
  assert.equal(png.height, YORISOU_ARTWORK.height);
  // Corners transparent: a crop or a flatten onto a background would fill them.
  const at = (x: number, y: number) => png.rgba[(y * png.width + x) * 4 + 3];
  for (const [x, y] of [
    [0, 0],
    [png.width - 1, 0],
    [0, png.height - 1],
    [png.width - 1, png.height - 1],
  ] as const) {
    assert.equal(at(x, y), 0, `corner ${x},${y} is not transparent — the artwork has been altered`);
  }
});

/* ── 2. the palette is IN the artwork ────────────────────────────────────────────────────── */

test("every brand colour actually occurs in the artwork", () => {
  const png = decodePng(ARTWORK);
  const present = new Set<string>();
  for (let y = 0; y < png.height; y += 2) {
    for (let x = 0; x < png.width; x += 2) {
      const i = (y * png.width + x) * 4;
      if (png.rgba[i + 3] < 230) continue;
      present.add(hex(png.rgba[i], png.rgba[i + 1], png.rgba[i + 2]));
    }
  }
  const missing: string[] = [];
  for (const [name, value] of Object.entries(YORISOU_PALETTE)) {
    // Exact match, or a near neighbour: these are cluster centres of a gradient, so ±6 per channel
    // is the honest tolerance. Anything further away was not read out of this file.
    const [r, g, b] = rgb(value);
    let found = false;
    for (const p of present) {
      const [pr, pg, pb] = rgb(p);
      if (Math.abs(pr - r) <= 6 && Math.abs(pg - g) <= 6 && Math.abs(pb - b) <= 6) {
        found = true;
        break;
      }
    }
    if (!found) missing.push(`${name} ${value}`);
  }
  assert.deepEqual(
    missing,
    [],
    `brand colours that are NOT in the logo — a colour the mark does not contain is not this ` +
      `company's colour:\n${missing.join("\n")}`,
  );
});

test("the accent chosen before the logo existed is gone from the live corporate surface", () => {
  const dead = ["74baa6", "2f6b5e", "3f8676", "e4ede9", "116, 186, 166", "--jade"];
  const offences: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir)) {
      const f = join(dir, e);
      if (statSync(f).isDirectory()) walk(f);
      else if (/\.(tsx?|css)$/.test(e)) {
        const s = readFileSync(f, "utf8");
        for (const d of dead) if (s.includes(d)) offences.push(`${f}: ${d}`);
      }
    }
  };
  walk(join(ROOT, "app/_corporate/p5r2"));
  assert.deepEqual(offences, [], `pre-logo accent still present:\n${offences.join("\n")}`);
});

/* ── 3. contrast is computed, not hoped for ──────────────────────────────────────────────── */

test("brand colours meet the contrast floor on the surface each one is used on", () => {
  const PAPER = "#fbfaf6";
  const SYS = "#0e1211";
  const fails: string[] = [];
  const need = (label: string, fg: string, bg: string, floor: number) => {
    const c = contrast(fg, bg);
    if (c < floor) fails.push(`${label}: ${fg} on ${bg} = ${c.toFixed(2)}:1, needs ${floor}:1`);
  };
  // Text and meaningful marks: WCAG AA 4.5:1.
  need("signal on paper", YORISOU_PALETTE.signal, PAPER, 4.5);
  need("signal-on-dark on system", YORISOU_PALETTE.signalOnDark, SYS, 4.5);
  need("wordmark ink on paper", YORISOU_PALETTE.ink, PAPER, 4.5);
  // Venture accents are decorative squares: the name and the stage are always rendered as text
  // beside them, so the applicable bar is the 3:1 non-text floor, on BOTH surfaces they appear on.
  for (const [href, b] of Object.entries(VENTURE_BRAND)) {
    if (!b.accent) continue;
    need(`${href} accent on paper`, b.accent, PAPER, 3);
    need(`${href} accent on system`, b.accent, SYS, 3);
  }
  assert.deepEqual(fails, [], fails.join("\n"));
});

/* ── 4. no venture gets an identity it has no source for ─────────────────────────────────── */

test("every venture brand value names where it came from, and the one with no source has no colour", () => {
  for (const [href, b] of Object.entries(VENTURE_BRAND)) {
    assert.ok(b.name.length > 0, `${href} has no wordmark`);
    assert.ok(b.source.trim().length > 20, `${href} does not say where its brand values came from`);
    if (b.accent) assert.match(b.accent, /^#[0-9a-f]{6}$/, `${href} accent is not a plain hex`);
  }
  const uncoloured = Object.entries(VENTURE_BRAND)
    .filter(([, b]) => b.accent === null)
    .map(([href]) => href);
  assert.deepEqual(
    uncoloured,
    ["/chigamo"],
    "exactly one venture has no canonical brand source, and it is Chigamo. If that changed, the " +
      "claim ledger row C-12 changed with it — update both or neither.",
  );
});

/* ── 5. the public venture count ─────────────────────────────────────────────────────────── */

test("the venture composition is derived from the same evidence as the formation stages", () => {
  const counts = ventureCounts();
  assert.equal(counts.building + counts.concept, counts.total);
  assert.equal(counts.total, Object.keys(VENTURE_FORMATION).length);
  for (const [href, cls] of Object.entries(VENTURE_CLASS)) {
    const reached = VENTURE_FORMATION[href];
    assert.ok(reached !== undefined, `${href} has a class but no recorded formation stage`);
    // A venture is only "building" if its own evidence puts it at or past 事業設計 / 構築.
    assert.equal(
      cls === "building",
      reached >= 3,
      `${href} is classed "${cls}" but its recorded formation stage is ${reached}`,
    );
  }
});

/**
 * The count used to live inside a sentence, twenty-one times over, and it said three things were
 * underway when one of them was a hypothesis. This asserts the number is not back in the prose.
 */
const THREE: Record<string, string[]> = {
  ja: ["三", "３", "3"], "zh-CN": ["三", "３", "3"], "zh-TW": ["三", "３", "3"],
  ko: ["세 ", "셋", "삼 ", "３", "3"],
  en: ["three"], de: ["drei"], nl: ["drie"], es: ["tres"], pt: ["três", "tres"],
  fr: ["trois"], it: ["tre"], pl: ["trzy"], ru: ["три"], uk: ["три"], tr: ["üç"],
  id: ["tiga"], ms: ["tiga"], vi: ["ba"], th: ["สาม"], hi: ["तीन"], ar: ["ثلاث"],
};

test("no locale states a venture count in the headline any more", async () => {
  const offences: string[] = [];
  for (const locale of PUBLISHED) {
    const copy = await getCopy(locale.code);
    const tokens = THREE[locale.code] ?? [];
    assert.ok(tokens.length > 0, `no count vocabulary listed for ${locale.code}`);
    const fields: [string, readonly string[]][] = [
      ["home.buildHeading", copy.home.buildHeading],
      ["ventures.heading", copy.ventures.heading],
    ];
    for (const [name, units] of fields) {
      const text = units.join(" ");
      for (const t of tokens) {
        // Latin and Cyrillic words need a boundary; CJK, Thai, Arabic and Devanagari do not.
        const hit = /^[\p{Script=Latin}\p{Script=Cyrillic} ]+$/u.test(t)
          ? new RegExp(`(^|[^\\p{L}])${t}([^\\p{L}]|$)`, "iu").test(text)
          : text.includes(t);
        if (hit) offences.push(`${locale.code} ${name}: "${t}" in "${text}"`);
      }
    }
  }
  assert.deepEqual(
    offences,
    [],
    `the venture count is back in translated prose. It belongs in brand.ts, where evidence can ` +
      `correct it:\n${offences.join("\n")}`,
  );
});

/**
 * The most-copied sentence on the site is its share card, and it said all three ventures were
 * underway. Chigamo has no repository, no product and no users, so that description overstated the
 * company by one venture everywhere the page was pasted. This asserts the correction did not get
 * translated back out: wherever the description names Chigamo it must also say it is a concept.
 */
const CONCEPT_VOCAB: Record<string, string[]> = {
  ja: ["構想"], "zh-CN": ["构想"], "zh-TW": ["構想"], ko: ["구상"],
  en: ["concept"], de: ["Konzept"], nl: ["concept"], fr: ["concept"],
  es: ["concepto"], pt: ["conceito"], it: ["concetto"], pl: ["koncepcj"],
  ru: ["идеи"], uk: ["ідеї"], tr: ["fikir"], id: ["konsep"], ms: ["konsep"],
  vi: ["ý tưởng"], th: ["แนวคิด"], hi: ["संकल्पना"], ar: ["التصور"],
};

test("the share card never presents the concept-stage venture as one that is underway", async () => {
  const offences: string[] = [];
  for (const locale of PUBLISHED) {
    const copy = await getCopy(locale.code);
    const d = copy.meta.home.description;
    const vocab = CONCEPT_VOCAB[locale.code];
    assert.ok(vocab, `no concept vocabulary listed for ${locale.code}`);
    if (!d.includes("Chigamo")) continue;
    if (!vocab.some((v) => d.includes(v))) offences.push(`${locale.code}: ${d}`);
  }
  assert.deepEqual(
    offences,
    [],
    `these descriptions name Chigamo without saying it is a concept:\n${offences.join("\n")}`,
  );
});

/* ── 6. the strapline is the Founder's, and is not the hook said twice ───────────────────── */

test("the footer carries the strapline set inside the artwork, not a second copy of the hook", async () => {
  const ja = await getCopy("ja");
  assert.equal(
    ja.chrome.footerTagline,
    YORISOU_STRAPLINE_JA,
    "the Japanese footer line must be the strapline the Founder set inside the logo itself",
  );
  const duplicates: string[] = [];
  for (const locale of PUBLISHED) {
    const copy = await getCopy(locale.code);
    const hook = copy.home.hook.join("").replace(/\s+/g, "");
    const tagline = copy.chrome.footerTagline.replace(/\s+/g, "");
    if (hook === tagline) duplicates.push(locale.code);
    assert.ok(copy.chrome.footerTagline.trim().length > 0, `${locale.code} has no footer tagline`);
  }
  assert.deepEqual(duplicates, [], `these locales say the hook twice on one page: ${duplicates}`);
});

/* ── 7. browser-level identity ───────────────────────────────────────────────────────────── */

test("the browser identity is the company, not the consumer product", () => {
  for (const f of ["app/icon.png", "app/apple-icon.png", "app/opengraph-image.png"]) {
    const p = join(ROOT, f);
    assert.ok(existsSync(p), `${f} is missing — the tab, the home screen or the share card is unbranded`);
    assert.ok(statSync(p).size > 2000, `${f} is suspiciously small`);
  }
  // The consumer product's purple mark must not be what identifies the company anywhere in app/.
  const offences: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir)) {
      if (e === "node_modules" || e === ".next") continue;
      const f = join(dir, e);
      if (statSync(f).isDirectory()) walk(f);
      else if (/^icon|^apple-icon|^opengraph-image/.test(e) && /\.svg$/.test(e)) offences.push(f);
    }
  };
  walk(join(ROOT, "app"));
  assert.deepEqual(offences, [], `a stale icon convention file still ships: ${offences.join(", ")}`);
});
