// AIX-5 — value-proposition + whole-app experience reset contracts (source + runtime).
// Encodes the Founder-frozen proposition, the understanding→support architecture,
// CTA hierarchy, whole-app coherence, and the share-content / placeholder rules.
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { resolveShareCard } from "@/app/lib/share/shareCard";

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");
const has = (p: string) => existsSync(join(root, p));

// ── Frozen value proposition (BINDING) ──────────────────────────────────────
const home = read("app/page.tsx");
assert.ok(home.includes("今のあなたを知り") && home.includes("一緒に選ぶ"), "homepage carries the frozen main proposition");
assert.ok(/AI-native\s*伴走プラットフォーム/.test(home), "homepage names the platform (AI-native accompaniment), not a test");

// The platform promise must lead; the check must not carry hero weight.
const idxPromise = home.indexOf("一緒に選ぶ");
const idxMechanic = Math.min(
  ...["120問", "24問", "チェックを始める"].map((s) => { const i = home.indexOf(s); return i < 0 ? Number.MAX_SAFE_INTEGER : i; }),
);
assert.ok(idxPromise < idxMechanic, "value proposition appears before any test mechanic");
assert.ok(!/120問|24問/.test(home.slice(home.indexOf("<h1"), home.indexOf("</h1>") + 5)), "no question count at hero-headline level");

// The check is framed as one entry into understanding, not the product.
assert.ok(home.includes("最初の入口"), "check framed as one first entry into understanding");

// Wider, continuing support beyond the check is explicit on the homepage.
for (const w of ["情報", "体験", "サービス", "つながり"]) {
  assert.ok(home.includes(w), `homepage names the support surface: ${w}`);
}

// ── Understanding → support model + learning loop (the personalization engine) ─
assert.ok(home.includes("yr-flow"), "homepage shows the understanding→support model");
assert.ok(home.includes("学びのループ"), "homepage shows the learning loop (adapt over time)");
const cssFlow = read("app/globals.css");
assert.ok(cssFlow.includes(".yr-flow"), ".yr-flow model styles exist");

// ── Six domains are ONE connected system, not six categories ─────────────────
assert.ok(home.includes("yr-systemmap"), "six-domain system map present");
assert.ok(home.includes("ひとつの流れ"), "six domains framed as one continuous flow");
for (const id of ["understand", "keep", "discover", "deepen", "connect", "improve"]) {
  assert.ok(home.includes(`id: "${id}"`), `homepage has domain ${id}`);
}

// ── CTA hierarchy (frozen) ──────────────────────────────────────────────────
assert.ok(home.includes("今の自分から始める"), "homepage primary CTA is the frozen begin label");
assert.ok(home.includes("YORISOUでできることを見る"), "homepage secondary CTA is the frozen explore label");
assert.ok(home.includes('href="/check-in"'), "primary CTA points at /check-in");
assert.ok(home.includes('href="/#system"'), "secondary CTA points at the system map");
// The global header shares the same primary begin-CTA across the product.
const header = read("app/components/SiteHeader.tsx");
assert.ok(header.includes("今の自分から始める"), "global header uses the frozen primary CTA");

// ── SEO / OG carry the proposition, not the test mechanic ───────────────────
const layout = read("app/layout.tsx");
assert.ok(layout.includes("AI-native伴走プラットフォーム") || layout.includes("AI-native 伴走プラットフォーム"), "root metadata leads with the platform");
assert.ok(!/24問チェック|セルフリフレクションサービス/.test(layout), "root metadata no longer leads with the test mechanic");
assert.ok(home.includes("openGraph"), "homepage has OG metadata");

// ── /about is reset to the accompaniment proposition (not defensive / test-first) ─
const about = read("app/about/page.tsx");
assert.ok(about.includes("今のあなたを知り、これからを一緒に選ぶ"), "/about carries the frozen proposition");
assert.ok(about.includes("伴走"), "/about frames YORISOU as accompaniment");
assert.ok(!about.includes("状態理解プラットフォーム"), "/about drops the old state-understanding-platform label");
assert.ok(!about.includes("テストで終わるサービスではありません"), "/about drops the defensive test-first framing");

// ── Prohibited platform self-interpretations are absent from platform surfaces ─
// (individual tests may use 診断 as a genre; the PLATFORM must never brand itself
//  as a personality test / type result / LINE bot / community site / marketplace.)
for (const [label, src] of [["home", home], ["about", about], ["layout", layout]] as const) {
  for (const bad of ["性格診断", "パーソナリティテスト", "性格タイプ", "LINEボット", "コミュニティサイト", "マーケットプレイス"]) {
    assert.ok(!src.includes(bad), `${label}: does not self-describe as ${bad}`);
  }
}

// ── No residual legacy positioning on launch product/editorial routes ────────
const LAUNCH_ROUTES = [
  "app/page.tsx", "app/about/page.tsx", "app/methodology/page.tsx",
  "app/privacy/page.tsx", "app/reports/page.tsx", "app/co-design/page.tsx",
  "app/partners/page.tsx", "app/components/SiteHeader.tsx",
];
for (const f of LAUNCH_ROUTES) {
  const src = read(f);
  assert.ok(!src.includes("次の選択まで"), `${f}: no old '次の選択まで' hero copy`);
  assert.ok(!src.includes("プロダクト全体を見る"), `${f}: uses the frozen explore label, not the old one`);
}

// ── Share content aligned to the final proposition + placeholder prohibition ─
assert.ok(has("app/lib/share/shareCard.ts"), "share model exists");
const cardRoute = read("app/api/share/card/route.tsx");
assert.ok(cardRoute.includes("今のあなたを知り、これからを一緒に選ぶ。"), "share-card tagline is the frozen proposition");
assert.ok(cardRoute.includes("今の状態"), "share-card marks current-state, not a fixed identity");

// Placeholder / dev tokens must never render — they resolve to a polished generic card.
const genericTitle = "今のあなたから、次の一歩へ。";
for (const ph of ["test", "demo", "placeholder", "Sample", "TODO", "undefined", "null", ""]) {
  const m = resolveShareCard({ testLabel: "YORISOU", title: ph, traits: ["a", "b"] });
  assert.equal(m.title, genericTitle, `placeholder title "${ph}" resolves to the generic card`);
  assert.ok(!/^(test|demo|placeholder|sample|todo|undefined|null)$/i.test(m.title), `no dev token leaks for "${ph}"`);
  assert.equal(m.traits.length, 0, `placeholder card carries no traits ("${ph}")`);
}
// A genuine result still renders as itself, and placeholder traits are filtered out.
const real = resolveShareCard({ testLabel: "人間関係の疲れチェック", title: "やさしい境界", line: "今の距離感から", traits: ["丁寧", "test", "休息"] });
assert.equal(real.title, "やさしい境界", "real result title preserved");
assert.ok(!real.traits.includes("test"), "placeholder trait filtered from a real card");
assert.ok(real.traits.includes("丁寧") && real.traits.includes("休息"), "real traits preserved");

// ── Journey continuity: key surfaces hand off onward (no dead-ends) ──────────
for (const d of ["understand", "keep", "discover", "deepen", "connect", "improve"]) {
  // each domain node carries a cueHref → the domain surface (continuity, not a leaf)
  const block = home.slice(home.indexOf(`id: "${d}"`), home.indexOf(`id: "${d}"`) + 400);
  assert.ok(/cueHref:\s*"\//.test(block), `domain ${d} links onward (cueHref)`);
}

// ── Strategy artifacts exist (the reset is documented, not inferred) ─────────
for (const doc of [
  "docs/aix5/VALUE_PROPOSITION_FREEZE.md",
  "docs/aix5/EXPERIENCE_ARCHITECTURE.md",
  "docs/aix5/WHOLE_APP_COHERENCE_AUDIT.md",
  "docs/aix5/DESIGN_SYSTEM_FREEZE.md",
]) {
  assert.ok(has(doc), `strategy artifact present: ${doc}`);
}

console.log("AIX-5 completion contract checks passed");
