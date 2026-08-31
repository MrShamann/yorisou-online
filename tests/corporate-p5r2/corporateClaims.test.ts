import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

/**
 * CORP-v1.2 §17 — corporate claim guard.
 *
 * A polished site does not upgrade evidence. This fails the build when public corporate copy makes
 * a claim the company cannot currently support.
 *
 * Scope is deliberately narrow: the shipped locale copy and the corporate view layer only. It does
 * NOT scan documentation, ADRs, tests or historical records, because those legitimately discuss the
 * very phrases being banned — a guard that cannot tell a prohibition from a violation is a guard
 * that gets disabled. For the same reason the patterns target dangerous CONSTRUCTIONS ("our
 * partners", "powered by Asterion") rather than ordinary words like "partner" on their own.
 */
const ROOT = process.cwd();
if (!readFileSync(path.join(ROOT, "package.json"), "utf8").includes('"next"')) {
  throw new Error(`tests must run from the repository root; got ${ROOT}`);
}
const CONTENT_DIR = path.join(ROOT, "app/_corporate/i18n/content");
const VIEW_DIR = path.join(ROOT, "app/_corporate/p5r2");

function contentFiles(): { name: string; text: string }[] {
  return readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => ({ name: f, text: readFileSync(path.join(CONTENT_DIR, f), "utf8") }));
}

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith(".ts") || p.endsWith(".tsx") ? [p] : [];
  });
}

/** Strip the source comments, so engineering prose explaining a rule is never read as a claim. */
function copyOnly(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");
}

/**
 * Negation markers, per language family.
 *
 * The honest copy on this site frequently NAMES a forbidden claim in order to deny it — "not a
 * proven, repeatable method", "法人化された子会社…ではありません". A guard that cannot tell an
 * assertion from a denial would force the copy to stop making those denials, which is the opposite
 * of what it exists for. So a match is ignored when its own sentence carries a negation.
 */
const NEGATIONS = [
  "not ", "never", "no longer", "nor ", "without",
  "ではありません", "ではない", "ありません", "いません", "ではなく", "せん。", "ない。",
  "不是", "并非", "並非", "没有", "沒有",
  "아닙니다", "아니라", "않습니다", "없습니다",
  " no ", "não", " non ", " ne ", " pas ", "nicht", "kein", "geen",
  " не ", " ні ", "nie ", "değil", "bukan", "tidak", "không", "ไม่", "नहीं", "ليس", "لا ",
];

/** The sentence containing an offset — the unit a human reads to judge assertion vs denial. */
function sentenceAt(text: string, index: number): string {
  const seps = /[.。!?！？\n]/;
  let start = index;
  while (start > 0 && !seps.test(text[start - 1])) start--;
  let end = index;
  while (end < text.length && !seps.test(text[end])) end++;
  return text.slice(start, end + 1);
}

function isNegated(text: string, index: number): boolean {
  const sentence = sentenceAt(text, index).toLowerCase();
  return NEGATIONS.some((n) => sentence.includes(n));
}

type Rule = { id: string; re: RegExp; why: string };

const RULES: Rule[] = [
  {
    id: "powered-by-asterion",
    re: /powered\s+by\s+asterion|asterion\s*(で|により)?\s*(駆動|提供)/i,
    why: "no venture is presented as running on Asterion; there is no executed licence to support it",
  },
  {
    id: "yorisou-owns-asterion",
    re: /(our|yorisou[’'`s]{0,2}|私たちの|当社の|弊社の)\s*asterion|asterion[^.。\n]{0,24}(を所有|の所有者)|owns?\s+asterion/i,
    why: "Asterion is independent and is not owned by Yorisou",
  },
  {
    id: "our-customers",
    re: /our\s+(customers|clients)\b|(私たちの|当社の|弊社の)\s*(顧客|お客様|クライアント)/i,
    why: "Yorisou has no evidenced customers",
  },
  {
    id: "our-partners",
    re: /our\s+partners\b|(私たちの|当社の|弊社の)\s*(パートナー|提携先)/i,
    why: "no partnership is evidenced; collaboration copy must stay an invitation",
  },
  {
    id: "portfolio-companies",
    re: /portfolio\s+(compan|firm)|ポートフォリオ企業|傘下企業|子会社/i,
    why: "the ventures are not incorporated subsidiaries or portfolio companies",
  },
  {
    id: "fund-or-accelerator",
    re: /\b(venture\s+fund|we\s+invest\b|our\s+fund\b|accelerator\s+program)|(ベンチャーファンド|アクセラレータープログラム|投資先)/i,
    why: "Yorisou is not a fund, an accelerator or an investment firm",
  },
  {
    id: "funded-claim",
    re: /\b(backed\s+by|funded\s+by|raised\s+(a\s+)?\$?[\d])|(出資を受け|資金調達を実施)/i,
    why: "no financing is evidenced",
  },
  {
    id: "traction-metrics",
    re: /\b\d[\d,.]*\s*(k|m|million|億|万)?\s*(users|customers|downloads|MRR|ARR|ユーザー|利用者|導入企業)\b/i,
    why: "no traction metric is evidenced",
  },
  {
    id: "non-japan-entities",
    re: /(hong\s*kong|香港|barcelona|バルセロナ)[^.。\n]{0,30}(office|entity|subsidiary|拠点|支社|法人)|(office|拠点|支社)[^.。\n]{0,20}(hong\s*kong|香港)/i,
    why: "Hong Kong / Spain / US entities are PLANNED ONLY and must not read as existing offices",
  },
  {
    id: "proven-repeatable",
    re: /(proven|repeatable)\s+(venture\s+studio|foundry|method|engine)|(実証済みの|確立された)\s*(手法|方式|エンジン)/i,
    why: "the foundry method is not yet proven; nothing has been spun out",
  },
  {
    id: "apply-now",
    re: /\bapply\s+now\b|今すぐ応募|応募する/i,
    why: "there is no application process or selection programme; CTAs must be interest/contact",
  },
  {
    id: "fake-recruitment",
    re: /\b(now hiring|we are hiring|applications? (are )?open|join our team)\b|(募集中|応募受付|採用中|選考中)/i,
    why: "there is no application process, no selection programme and no open role",
  },
  {
    id: "fake-live-state",
    re: /\b(real[- ]?time|live (data|activity|feed)|active users now|currently running agents)\b|(リアルタイム(で)?(表示|更新)|稼働中のエージェント|現在の利用者数)/i,
    why: "no diagram or surface may be labelled live or real-time, because none of them is",
  },
  {
    id: "brand-transliteration",
    re: /(カカリ|かかり(?!ます)|卡卡里|ミライムーブ|ミライ・ムーブ|チガモ|Какари|كاكاري)/,
    why: "venture wordmarks stay Latin — Kakari's own glossary forbids transliteration and enforces it in CI",
  },
  {
    id: "preview-as-production",
    re: /(now\s+live\s+in\s+production|本番稼働中|正式リリース済み)/i,
    why: "this is a Preview; it must never describe itself as Production",
  },
];

test("public corporate copy makes no unsupported claim", () => {
  const hits: string[] = [];
  for (const { name, text } of contentFiles()) {
    const copy = copyOnly(text);
    for (const r of RULES) {
      const m = r.re.exec(copy);
      if (m && !isNegated(copy, m.index)) {
        hits.push(`${name}: [${r.id}] matched "${m[0].slice(0, 48)}" — ${r.why}`);
      }
    }
  }
  assert.deepEqual(hits, [], `unsupported public claims:\n${hits.join("\n")}`);
});

test("the corporate view layer makes no unsupported claim", () => {
  const hits: string[] = [];
  for (const p of walk(VIEW_DIR)) {
    const copy = copyOnly(readFileSync(p, "utf8"));
    for (const r of RULES) {
      const m = r.re.exec(copy);
      if (m && !isNegated(copy, m.index)) {
        hits.push(`${path.relative(ROOT, p)}: [${r.id}] matched "${m[0].slice(0, 48)}"`);
      }
    }
  }
  assert.deepEqual(hits, [], `unsupported claims in the view layer:\n${hits.join("\n")}`);
});

test("Asterion is never listed as a Yorisou venture", () => {
  // The ventures list is the one place a reader infers ownership from position alone.
  const bad: string[] = [];
  for (const { name, text } of contentFiles()) {
    const block = /ventures:\s*\{[\s\S]*?\n  \},/.exec(text)?.[0] ?? "";
    if (/asterion/i.test(block)) bad.push(name);
  }
  assert.deepEqual(bad, [], `Asterion appears inside the ventures list in: ${bad.join(", ")}`);
});

test("every locale keeps the Asterion independence boundary", () => {
  const missing: string[] = [];
  for (const { name, text } of contentFiles()) {
    if (!/asterionBoundaryTitle/.test(text) || !/asterionBoundaryBody/.test(text)) missing.push(name);
  }
  assert.deepEqual(missing, [], `locales missing the Asterion boundary statement: ${missing.join(", ")}`);
});

/**
 * CORP-v1.2R2 — every venture carries its own Japanese line and a participation path.
 *
 * `reading` is the venture's own one-line positioning, NOT a transliteration of its wordmark. The
 * brand-transliteration rule above enforces the other half of that: Kakari's localisation glossary
 * says "ASCII wordmark only. Never transliterated", and Mirai Move's brand source carries a Latin
 * wordmark with no reading, so inventing katakana would be creating names against two projects'
 * governance rather than documenting them.
 */
test("every venture states its own Japanese line, its state triad and a way in", () => {
  const missing: string[] = [];
  for (const { name, text } of contentFiles()) {
    for (const venture of ["mirai", "kakari", "chigamo"]) {
      const block = new RegExp(`^  ${venture}: \\{[\\s\\S]*?^  \\},`, "m").exec(text)?.[0] ?? "";
      if (!block) {
        missing.push(`${name}: ${venture} block not found`);
        continue;
      }
      for (const field of ["reading:", "now:", "next:", "who:", "join:"]) {
        if (!block.includes(field)) missing.push(`${name}: ${venture} missing ${field}`);
      }
      if (!/roles:\s*\[/.test(block)) missing.push(`${name}: ${venture}.join missing roles`);
      if (!/state:\s*"/.test(block)) missing.push(`${name}: ${venture}.join missing state`);
    }
  }
  assert.deepEqual(missing, [], `venture participation gaps:\n${missing.join("\n")}`);
});

/**
 * The participation matrix must keep BOTH halves. A lane that lists only what Yorisou offers is a
 * recruitment pitch; the `cannot` field is what makes it an honest invitation, so its presence is
 * enforced rather than trusted.
 */
test("every participation lane states what Yorisou cannot promise", () => {
  const bad: string[] = [];
  for (const { name, text } of contentFiles()) {
    const block = /^  buildWithUs: \{[\s\S]*?^  \},/m.exec(text)?.[0] ?? "";
    if (!block) {
      bad.push(`${name}: buildWithUs block not found`);
      continue;
    }
    const lanes = block.match(/key:\s*"[a-z]+"/g) ?? [];
    if (lanes.length !== 6) bad.push(`${name}: expected 6 participation lanes, found ${lanes.length}`);
    const offers = (block.match(/offers:\s*"/g) ?? []).length;
    const cannot = (block.match(/cannot:\s*"/g) ?? []).length;
    if (offers !== 6 || cannot !== 6) {
      bad.push(`${name}: offers=${offers} cannot=${cannot} (both must be 6)`);
    }
    if (!block.includes("foundingTeamBody")) bad.push(`${name}: missing the founding-team section`);
  }
  assert.deepEqual(bad, [], `participation matrix gaps:\n${bad.join("\n")}`);
});

/**
 * The hero motion field must resolve to a complete, static diagram under prefers-reduced-motion.
 * A motion narrative that simply stops would leave the operating model unexplained for anyone who
 * cannot tolerate animation, so the reduced-motion branch is a correctness requirement, not a nicety.
 */
test("the Foundry motion field has a reduced-motion resolution", () => {
  const css = readFileSync(path.join(ROOT, "app/_corporate/p5r2/foundry-field.module.css"), "utf8");
  assert.ok(
    /@media \(prefers-reduced-motion: reduce\)/.test(css),
    "foundry-field.module.css has no prefers-reduced-motion block",
  );
  const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
  assert.ok(/animation:\s*none/.test(reduced), "reduced-motion block does not stop the animations");
  for (const cls of ["signal", "edge", "company", "returnPath"]) {
    assert.ok(reduced.includes(cls), `reduced-motion block does not resolve .${cls} to its final state`);
  }
});
