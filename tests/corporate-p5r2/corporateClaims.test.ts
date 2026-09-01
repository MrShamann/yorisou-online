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
    why: "the site draws no ownership conclusion about Asterion in either direction; rights depend on the applicable agreements",
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
    re: /portfolio\s+(compan|firm)|ポートフォリオ企業|傘下企業|子会社|子公司|자회사/i,
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
  /**
   * CORP-v1.4 — the claim class the business-model narrative introduces.
   *
   * The site now says YORISOU MAY hold equity, MAY hold a licence, MAY operate a venture jointly.
   * Every one of those is conditional and none of it is executed. Nothing in the guard covered
   * ownership, shareholding or licence-holding at all — rule `powered-by-asterion` even asserts in
   * its own reason that no licence has been executed, while no rule checked for the claim.
   *
   * This fires on the ASSERTED form. The conditional forms the site actually uses — "may hold",
   * 「持ち続けることもあります」 — do not match, which is the distinction the whole section rests on.
   */
  {
    id: "executed-economic-right",
    re: /(we|yorisou)\s+(currently\s+)?(holds?|owns?|retains?)\s+(equity|shares?|a\s+stake|a\s+licen[cs]e)|(株式|持ち分|ライセンス)を(保有しています|取得しました|保有している)|(equity|licen[cs]e)\s+(is|has\s+been)\s+(granted|executed|secured)/i,
    why: "no equity, shareholding or licence is evidenced as held or executed; the site may only say a structure is possible",
  },
];

/**
 * CORP-v1.4 — EVERY match, not just the first.
 *
 * Both scans used `r.re.exec(copy)` on a non-global regex, which returns only the FIRST match in
 * the file. If that first occurrence sat inside a denial — and this site denies its forbidden
 * claims constantly, on purpose — `isNegated` suppressed it and the loop moved on, so a genuine
 * violation later in the same file was never looked at. A guard that stops at the first honest
 * sentence is a guard that gets quieter the more honest the copy becomes.
 *
 * The rule regexes are shared module state, so a fresh global copy is made per scan rather than
 * mutating `lastIndex` on the original.
 */
function* matchesOf(re: RegExp, text: string): Generator<RegExpExecArray> {
  const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`);
  let m: RegExpExecArray | null;
  while ((m = g.exec(text)) !== null) {
    yield m;
    if (m[0].length === 0) g.lastIndex += 1;
  }
}

test("public corporate copy makes no unsupported claim", () => {
  const hits: string[] = [];
  for (const { name, text } of contentFiles()) {
    const copy = copyOnly(text);
    for (const r of RULES) {
      for (const m of matchesOf(r.re, copy)) {
        if (!isNegated(copy, m.index)) {
          hits.push(`${name}: [${r.id}] matched "${m[0].slice(0, 48)}" — ${r.why}`);
        }
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
      for (const m of matchesOf(r.re, copy)) {
        if (!isNegated(copy, m.index)) {
          hits.push(`${path.relative(ROOT, p)}: [${r.id}] matched "${m[0].slice(0, 48)}"`);
        }
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

test("every locale keeps the Asterion boundary, and none concludes who owns Asterion", () => {
  const missing: string[] = [];
  for (const { name, text } of contentFiles()) {
    if (!/asterionBoundaryTitle/.test(text) || !/asterionBoundaryBody/.test(text)) missing.push(name);
  }
  assert.deepEqual(missing, [], `locales missing the Asterion boundary statement: ${missing.join(", ")}`);
});

/**
 * CORP-v1.4 — the withdrawn conclusion, in both directions.
 *
 * The site used to state as an absolute legal fact that Asterion "is not owned by Yorisou". No
 * executed rights record supports that sentence, so the Founder withdrew it. The opposite claim was
 * already forbidden. What is permitted is the honest position: rights depend on the agreements that
 * apply.
 *
 * The existing boundary test only checked that the two KEY NAMES were present — a locale could have
 * set the body to anything at all and passed. This checks the values, and it checks the denial as
 * well as the assertion, because an unsupported denial is an unsupported claim.
 */
/**
 * The denial phrases themselves. These are matched at FILE scope, not by proximity to the word
 * "Asterion", because the withdrawn Japanese wording put the denial in its own sentence —
 * 「Asterion OS は…独立した共通技術・実行基盤です。YORISOU が所有しているものではありません。」 — and a
 * proximity window stops at the 。 and misses it. Verified: a proximity-anchored version of this
 * check passed that exact string.
 */
const OWNERSHIP_DENIALS = [
  /所有物ではありません/,
  /所有しているものではありません/,
  /(は|が)?所有していません/,
  /is\s+not\s+owned/i,
  /(do(es)?\s+not|don['’]t)\s+own/i,
  /n[’']?(est|appartient)\s+pas\s+(la\s+propriété|à)/i,
  /no\s+es\s+(de\s+)?propiedad/i,
  /nicht\s+im\s+Besitz/i,
  /não\s+é\s+(de\s+)?propriedade/i,
  /не\s+принадлежит/i,
  /소유하고\s*있지\s*않습니다|소유가\s*아닙니다/,
  /不属于|不屬於|并非.{0,6}所有|並非.{0,6}所有/,
];

test("no locale concludes who owns Asterion — in either direction", () => {
  const hits: string[] = [];
  for (const { name, text } of contentFiles()) {
    const copy = copyOnly(text);
    if (!/asterion/i.test(copy)) continue;
    for (const re of OWNERSHIP_DENIALS) {
      // Deliberately NOT negation-aware: these patterns ARE the denial. A denial of something
      // nobody can evidence is itself an unsupported claim, which is what was withdrawn.
      for (const m of matchesOf(re, copy)) {
        hits.push(`${name}: "${copy.slice(Math.max(0, m.index - 44), m.index + m[0].length + 8).replace(/\s+/g, " ")}"`);
      }
    }
  }
  assert.deepEqual(
    hits,
    [],
    `a locale still concludes who owns Asterion. The supported position is that rights depend on ` +
      `the agreements that apply:\n${hits.join("\n")}`,
  );
});

/**
 * CORP-v1.4R1.1 — the SOURCE layer of the same rule.
 *
 * The test above protects the rendered copy. It does not protect the code, and that is the gap this
 * package closed: v1.4 removed the absolute "Asterion is not owned by Yorisou" from all twenty-one
 * locales, but implementation comments in `HomeView.tsx`, `FoundryView.tsx` and this very file went
 * on stating it as the canonical current intent for another two releases. A future agent reads a
 * comment like that as the design it is meant to preserve, and writes the withdrawn conclusion back
 * onto the page. Public copy was fixed; source intent had drifted.
 *
 * NEGATION-AWARE BY DESIGN, unlike its locale counterpart. Source legitimately DISCUSSES the
 * withdrawn phrase — this file quotes it in three test names and a rationale, and both views explain
 * why it was withdrawn. So a hit is only a violation when it is NOT accompanied by a withdrawal
 * marker. Without that exemption the guard would fire on its own explanation, which is the failure
 * mode `tests/corporate-qa/README.md` records: a guard that cannot tell a prohibition from a
 * violation gets disabled.
 */
const SOURCE_OWNERSHIP_CONCLUSIONS = [
  /\b(?:yorisou|we)\s+(?:do(?:es)?\s+not|don[’'`]?t)\s+own\b/i,
  /\bis\s+not\s+owned\s+by\s+yorisou\b/i,
  /\bnot\s+owned\s+by\s+(?:us|yorisou)\b/i,
  /\byorisou\s+owns\s+asterion\b/i,
];

/**
 * Text that marks a mention as narrating a WITHDRAWN position rather than asserting a current one.
 *
 * The list grew by one entry on its first run: the guard fired on the very paragraph above, which
 * says v1.4 "removed the absolute ...". That is the failure this exemption exists for, and it is
 * worth recording that it happened rather than quietly widening the pattern.
 */
const WITHDRAWAL_MARKERS =
  /withdrew|withdrawn|used to|no longer|until CORP|earlier absolute|(was |v1\.4 )?removed|kept asserting|prior state|historical|reintroduc|must not|forbidden/i;

test("no corporate source comment asserts an Asterion ownership conclusion as current intent", () => {
  const roots = ["app/_corporate", "tests/corporate-p5r2"];
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = `${dir}/${e.name}`;
      if (e.isDirectory()) walk(rel);
      // The locale content files are covered by the rendered-copy test above, which is stricter.
      else if (/\.(ts|tsx|css)$/.test(e.name) && !rel.includes("i18n/content")) files.push(rel);
    }
  };
  roots.forEach(walk);

  /*
   * PROJECT_START_HERE.md is in this list because leaving it out is what let the drift survive.
   *
   * The first version of this guard walked source directories only. It passed — while the repository's
   * MANDATORY context entrypoint still said, flatly and in the present tense, "It is NOT owned by
   * Yorisou and is NOT a Yorisou venture." CLAUDE.md requires every agent to read that file before
   * planning or editing, so it is the single highest-leverage place the withdrawn conclusion could
   * sit, and it was the only place no guard was looking. A guard scoped to code cannot protect a
   * doctrine that lives in a document.
   */
  files.push("PROJECT_START_HERE.md");

  const hits: string[] = [];
  for (const rel of files) {
    const src = readFileSync(path.join(ROOT, rel), "utf8");
    const lines = src.split("\n");
    for (const re of SOURCE_OWNERSHIP_CONCLUSIONS) {
      lines.forEach((line, i) => {
        /*
         * MATCH ACROSS THE LINE BREAK, not within one line.
         *
         * The per-line version passed while PROJECT_START_HERE.md said "It is NOT owned by\nYorisou
         * and is NOT a Yorisou venture." — the assertion was simply wrapped, and prose files wrap at
         * about a hundred characters, so a wrapped assertion is the normal case rather than a clever
         * evasion. Testing each line joined to the next catches it; the exemption is evaluated on the
         * same joined text, so a narration whose framing sits on either line still passes.
         */
        const joined = line + " " + (lines[i + 1] ?? "");
        const m = re.exec(joined);
        re.lastIndex = 0;
        if (!m) return;
        /*
         * THE EXEMPTION IS PER-LINE, deliberately.
         *
         * The first version looked at a +/-3 line window, and an injected violation proved it
         * useless: any file that legitimately explains the withdrawal earns a seven-line blanket
         * exemption, and both views and this file do exactly that. A new assertion dropped anywhere
         * near the explanation would have passed silently.
         *
         * Every legitimate mention in this repository carries its framing on its OWN line — either
         * the withdrawn wording is in quotation marks, or the same line says it was withdrawn. So
         * the narrower rule keeps all of them and catches a bare new assertion.
         */
        const before = joined.slice(0, m.index);
        const after = joined.slice(m.index + m[0].length);
        const quoted = /["“”]/.test(before) && /["“”]/.test(after);
        if (quoted || WITHDRAWAL_MARKERS.test(joined)) return;
        const hit = `${rel}:${i + 1}: ${line.trim().slice(0, 120)}`;
        // One line can match several patterns; report it once.
        if (!hits.includes(hit)) hits.push(hit);
      });
    }
  }

  assert.deepEqual(
    hits,
    [],
    `corporate source states an Asterion ownership conclusion as current intent. The supported ` +
      `position is that Asterion is an independent technology-platform project, is not a public ` +
      `Yorisou venture, and that rights depend on the applicable agreements — no conclusion in ` +
      `EITHER direction. If you are narrating the withdrawn claim, say so on the same line:\n${hits.join("\n")}`,
  );
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

/**
 * CORP-v1.2R2.1 — the venture identity treatment is applied everywhere, not just on one surface.
 *
 * R2 established that the wordmark stays Latin and the Japanese-ness comes from each venture's own
 * line beneath it. R2.1's defect was that the treatment was applied inconsistently — Home and the
 * footer showed the bare English mark. One component now renders it, so this asserts every surface
 * uses that component rather than hand-rolling a heading.
 */
test("every venture surface renders the shared identity unit", () => {
  /*
   * CORP-v1.4R1 — the list follows the SURFACE, not the file.
   *
   * The homepage's venture block moved into `PublicVentureSurface`, so HomeView.tsx stopped
   * containing the literal string while still being the surface that shows the ventures. Dropping
   * HomeView from the list would have deleted the protection; adding the component it delegates to
   * keeps it, and the delegation itself is pinned below so the indirection cannot become an escape
   * hatch. A first version of that surface HAD rebuilt the mark/wordmark/reading pairing by hand,
   * and this test is what caught it.
   */
  const surfaces = [
    "app/_corporate/p5r2/OperatingField.tsx",
    "app/_corporate/p5r2/views/VenturesView.tsx",
    "app/_corporate/p5r2/views/ProjectView.tsx",
    "app/_corporate/p5r2/Shell.tsx",
  ];
  const missing: string[] = [];
  for (const rel of surfaces) {
    const src = readFileSync(path.join(ROOT, rel), "utf8");
    if (!src.includes("VentureName")) missing.push(rel);
  }
  assert.deepEqual(missing, [], `surfaces not using the venture identity unit:\n${missing.join("\n")}`);

  // The homepage must still reach the unit — through the surface component, and provably so.
  const home = readFileSync(path.join(ROOT, "app/_corporate/p5r2/views/HomeView.tsx"), "utf8");
  assert.ok(
    /<PublicVentureSurface\b/.test(home),
    "the homepage no longer renders the public venture surface, so it shows no venture identity at all",
  );

  /*
   * CORP-v1.4R1 — How We Build delegates the same way, and the delegation is pinned the same way.
   *
   * FoundryView used to render venture names itself. Its eleven stage/venture rectangles are now one
   * `FoundrySpine`, so the file no longer contains the string this test looks for. Dropping it from
   * the list without pinning the delegation would have deleted the protection, so the pin is here.
   */
  const foundry = readFileSync(path.join(ROOT, "app/_corporate/p5r2/views/FoundryView.tsx"), "utf8");
  assert.ok(
    /<FoundrySpine\b/.test(foundry),
    "How We Build no longer renders the foundry spine, so it shows no venture identity at all",
  );

  /*
   * And the spine's own markers must not be bare Latin names.
   *
   * A rail marker cannot carry the full unit — mark, wordmark and the venture's Japanese line is
   * three lines of type — but a name beside a generic coloured dot is exactly the defect
   * CORP-v1.2R2.1 was written to remove. This asserts the marker takes its mark from the shared
   * registry component, keyed by href, so a hand-rolled dot cannot come back. The check is stricter
   * than the one it replaces: the previous version was satisfied by ANY use of `VentureName`
   * anywhere in the file, which the spine's markers never had.
   */
  const opfield = readFileSync(path.join(ROOT, "app/_corporate/p5r2/OperatingField.tsx"), "utf8");
  const spine = opfield.slice(opfield.indexOf("export function FoundrySpine"));
  assert.ok(
    /<VentureName\s+name=\{c\.name\}/.test(spine),
    "the foundry spine's venture markers do not render the shared venture identity unit",
  );
  assert.ok(
    !/spineVentureDot/.test(opfield),
    "the foundry spine still renders a generic dot in place of the venture's own mark",
  );

  // The detail hero must carry the wordmark AND the venture's own line, at hero scale.
  const detail = readFileSync(path.join(ROOT, "app/_corporate/p5r2/views/ProjectView.tsx"), "utf8");
  assert.ok(/size="hero"/.test(detail), "the venture detail hero does not render the wordmark at hero scale");
  assert.ok(/reading=\{p\.reading\}/.test(detail), "the venture detail hero does not render the venture's own line");
});

/**
 * The guided explainer must carry every required story beat, and must remain understandable without
 * motion. A walkthrough that autoplays for some readers and simply stops for others would leave the
 * operating model unexplained for exactly the people who asked for less motion.
 */
/**
 * CORP-v1.4R1 — the explainer is retired, so its beat assertion has no subject.
 *
 * The first half of this test required FoundryView to instantiate seven walkthrough beats. That
 * walkthrough was the THIRD representation of the same eight stages on one page — stage cards, a
 * venture-stage grid, and a seven-beat replay of five of the same stage bodies. The Foundry spine
 * replaces all three with one object that also carries each venture's real stage marker, so the
 * explainer is redundant rather than merely secondary and is no longer rendered.
 *
 * What that assertion actually protected was COMPREHENSION — that the method is presented whole,
 * not in fragments. That protection is not deleted; it moves to the object that now carries it,
 * and it is stricter, because the spine must show all EIGHT stages rather than a seven-beat
 * selection from them.
 *
 * CORP-v1.4R1.1 removed the component itself. What its assertions protected is now protected on the
 * surface that replaced it — see the note inside the test.
 */
test("the method is presented whole, by one system object with no client runtime", () => {
  const view = readFileSync(path.join(ROOT, "app/_corporate/p5r2/views/FoundryView.tsx"), "utf8");
  assert.ok(/<FoundrySpine\b/.test(view), "the Foundry page no longer presents the method as one system");

  const spine = readFileSync(path.join(ROOT, "app/_corporate/p5r2/OperatingField.tsx"), "utf8");
  assert.ok(
    /copy\.foundry\.stages/.test(spine),
    "the spine does not read the canonical stages, so it could show a selection of them",
  );
  assert.ok(
    /VENTURE_FORMATION/.test(spine),
    "the spine does not place ventures at their recorded stage — the markers would be decorative",
  );
  assert.ok(
    !/(percent|%\s*complete|progress\s*bar|LIVE|live-)/i.test(copyOnly(spine)),
    "the spine implies measurable progress; a venture is at a named stage or it is not",
  );

  /*
   * CORP-v1.4R1.1 — the explainer half of this test is gone because its subject is gone.
   *
   * It asserted that GuidedExplainer respected `prefers-reduced-motion`, exposed play/pause/restart
   * /step controls, kept its beats keyboard-operable, and never referenced video or a heavy runtime.
   * Those assertions had no subject once the Founder authorized deleting the component, and a test
   * that reads a deleted file does not fail politely — it throws ENOENT.
   *
   * The property they protected is NOT dropped. The surface that replaced the explainer is asserted
   * above (the spine reads canonical stages, places ventures at recorded stages, and implies no
   * measurable progress), and it carries the protection for free: the spine is a server component
   * with no JavaScript, so there is no autoplay to gate on a motion preference and no transport to
   * make keyboard-operable. The no-heavy-runtime check moves to the whole operating field, where a
   * regression could actually occur now.
   */
  assert.ok(
    !/<video|\.mp4|from ["']lottie|require\(["']lottie|WebGLRenderer|getContext\(["']webgl/i.test(copyOnly(spine)),
    "the operating field references video or a heavy runtime",
  );
  assert.ok(
    !/"use client"|useState|useEffect|onClick=/.test(spine),
    "the operating field is no longer a pure server component; the explainer was retired precisely to stop shipping interaction JavaScript",
  );
});

/**
 * Participation content must never be hover-only. The lanes use native <details>, which is
 * keyboard-operable and keeps every lane's content in the DOM whether open or closed.
 */
/**
 * CORP-v1.4R1 — the mechanism changed; the property being protected did not.
 *
 * This required `<details>`/`<summary>` in BuildWithUsView. The six lanes are now a native RADIO
 * GROUP shared with the homepage: a reader picks a role once and the answer arrives in place,
 * instead of opening six disclosures to find out which one is theirs. That is at least as
 * accessible — a radio group gives arrow-key navigation the browser provides for free, the inputs
 * stay focusable (visually hidden, never `display:none`), and `display:none` on the unselected
 * PANELS means assistive technology is offered exactly one panel at a time. It is a native
 * radio-group controlling conditional content, not an ARIA tabs widget.
 *
 * So the assertion follows the property rather than the element: essential content must be revealed
 * by a native form control or a disclosure element, NEVER by hover, and every lane field must
 * survive. The anti-hover CSS check now covers the new stylesheet too — the mechanism moved, and an
 * un-extended check would have stopped looking at the place the content actually lives.
 */
test("participation lane content is disclosed semantically, never by hover", () => {
  const entry = readFileSync(path.join(ROOT, "app/_corporate/p5r2/OperatingField.tsx"), "utf8");

  // A native control, not a div listening for pointer events.
  assert.ok(
    /<input[^>]*type="radio"/.test(entry) || /<details/.test(entry),
    "lane content is not disclosed by a native control",
  );
  assert.ok(/<label[^>]*htmlFor=/.test(entry), "the role selectors are not real labels for their inputs");
  assert.ok(/<legend/.test(entry), "the role group has no accessible name");
  assert.ok(!/onMouseOver|onMouseEnter/.test(entry), "lane content responds to pointer hover");

  for (const field of ["lane.offers", "lane.cannot", "lane.state", "lane.ventures", "lane.invites"]) {
    assert.ok(entry.includes(field), `the lane interface dropped ${field}`);
  }

  // Both surfaces must reach the same interface, so neither can drift into a weaker one.
  for (const rel of [
    "app/_corporate/p5r2/views/BuildWithUsView.tsx",
    "app/_corporate/p5r2/views/HomeView.tsx",
  ]) {
    const src = readFileSync(path.join(ROOT, rel), "utf8");
    assert.ok(/<ParticipationEntry\b/.test(src), `${rel} no longer renders the participation interface`);
  }

  for (const sheet of ["app/_corporate/p5r2/site.module.css", "app/_corporate/p5r2/operating-field.module.css"]) {
    const css = readFileSync(path.join(ROOT, sheet), "utf8");
    assert.ok(
      !/:hover[^{]*\{[^}]*(display:\s*block|visibility:\s*visible|opacity:\s*1)/.test(css),
      `${sheet} reveals content on :hover`,
    );
  }
});

/**
 * Formation state shows a named stage or nothing. A percentage or a completion bar would imply a
 * precision the repository evidence cannot support.
 */
test("formation state publishes no percentage or completion bar", () => {
  const pieces = readFileSync(path.join(ROOT, "app/_corporate/p5r2/pieces.tsx"), "utf8");
  const block = pieces.slice(pieces.indexOf("export function FormationState"));
  assert.ok(!/%|progress|<meter|aria-valuenow/i.test(block), "formation state renders a numeric progress value");

  const state = readFileSync(path.join(ROOT, "app/_corporate/p5r2/ventureState.ts"), "utf8");
  for (const href of ["/mirai-move", "/kakari", "/chigamo"]) {
    assert.ok(state.includes(`"${href}"`), `no formation evidence recorded for ${href}`);
  }
});
