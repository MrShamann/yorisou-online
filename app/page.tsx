import type { Metadata } from "next";
import Link from "next/link";

import DepthFieldStatic from "./components/depth-field/DepthFieldStatic";
import DepthFieldLazy from "./components/depth-field/DepthFieldLazy";
import { intentionDepthParams, intentionPalette } from "./components/depth-field/seed";
import AixIn from "./components/aix2/AixIn";

export const metadata: Metadata = {
  title: "YORISOU｜今のあなたを知り、これからを一緒に選ぶ。AI-native伴走プラットフォーム",
  description:
    "YORISOUは、あなたの状態・変化・好みを理解し、必要な情報・体験・サービス・つながりを、必要なときに届けるAI-native伴走プラットフォームです。チェックは、あなたを理解するための最初の入口のひとつ。無料・ログインなしで始められます。",
  openGraph: {
    title: "YORISOU｜今のあなたを知り、これからを一緒に選ぶ。",
    description:
      "あなたの状態・変化・好みを理解し、合う情報・体験・サービス・つながりを、必要なときに届ける伴走プラットフォーム。チェックはその最初の入口のひとつです。",
    url: "https://yorisou.online",
    siteName: "YORISOU",
    locale: "ja_JP",
    type: "website",
  },
};

// AIX-5 — value-proposition reset (Founder rejected AIX-4 for a strategic gap).
// The homepage leads with one product truth: YORISOU understands the person in
// order to provide continuing, personalized support beyond the check. The loop
// (understand → remember → recommend → try → reflect → adapt → return) is the
// product; the check is one entry, shown after the proposition.

type Status = "current" | "testing" | "prototype" | "planned";
const STATUS_LABEL: Record<Status, string> = {
  current: "いま使える",
  testing: "試験中",
  prototype: "プロトタイプ",
  planned: "設計中",
};

const DOMAINS: ReadonlyArray<{
  id: string;
  index: string;
  title: string;
  role: string;
  body: string;
  status: Status;
  cueHref: string;
  cueLabel: string;
}> = [
  { id: "understand", index: "01", title: "理解する", role: "今の状態を見る", body: "チェックを入口に、今の状態を見る。固定タイプではなく、いまの動き方を。", status: "current", cueHref: "/tests", cueLabel: "理解の入口へ" },
  { id: "keep", index: "02", title: "残す・戻る", role: "記録して戻る", body: "結果や気づきを、この端末やLINEに残す。状態が変わったら、また戻れる。", status: "current", cueHref: "/saved", cueLabel: "残したものを見る" },
  { id: "discover", index: "03", title: "見つける", role: "合う一歩を", body: "今の状態に合う一歩・体験・読みもの・道具・場所を、理由つきで。", status: "current", cueHref: "/recommendations", cueLabel: "見つけにいく" },
  { id: "deepen", index: "04", title: "深める", role: "レポートで読む", body: "無料結果の先の、少し深い読みもの。決めつけず、次の一歩の材料に。", status: "current", cueHref: "/reports", cueLabel: "レポートを見る" },
  { id: "connect", index: "05", title: "つながる", role: "体験を試す", body: "体験を試す、役立ったを残す。低圧力のつながりや地域の発見。", status: "prototype", cueHref: "/experiences", cueLabel: "体験の場を見る" },
  { id: "improve", index: "06", title: "育てる", role: "一緒に良くする", body: "感想や共創で、これからの体験・資料・プロダクトを一緒に良くしていく。", status: "prototype", cueHref: "/co-design", cueLabel: "育てる場を見る" },
];

const LOOP = ["理解", "残す", "見つける", "深める", "体験", "戻る", "改善"] as const;

const EXAMPLE = [
  { n: "1", title: "今の状態をみる", body: "無料・ログインなしのチェックで、いまの動き方を言葉にする。" },
  { n: "2", title: "残して、見つける", body: "結果を端末やLINEに残し、今の状態に合う一歩を理由つきで見つける。" },
  { n: "3", title: "深める・つながる", body: "少し深いレポートを読み、合いそうな体験を低圧力で試す。" },
  { n: "4", title: "戻る・育てる", body: "状態が変わればまた戻り、その気づきが次の体験や資料を良くしていく。" },
] as const;

const TRUST = [
  "非公開が既定",
  "医療的な判定ではない",
  "続けかたは自分で選ぶ",
  "おすすめは理由つき",
  "強制的な公開はしない",
  "表示順は買えない",
] as const;

export default function HomePage() {
  const params = intentionDepthParams(null, 320);
  const palette = intentionPalette();

  return (
    <main className="aix2">
      {/* ===== Hero: platform promise + six-domain system map in the first screen ===== */}
      <section className="aix2-hero">
        <div className="depth-scene" aria-hidden="true">
          <DepthFieldStatic params={params} palette={palette} formation={0.72} className="depth-layer" />
          <DepthFieldLazy params={params} palette={palette} formation={1} className="depth-layer" scrollParallax />
          <div className="depth-veil" />
        </div>
        <div className="container relative z-[1]">
          <div className="aix2-in max-w-[56rem] pt-20 pb-8 md:pt-24">
            <p className="aix2-eyebrow aix2-rise" style={{ ["--d" as string]: "40ms" }}>
              YORISOU · AI-native 伴走プラットフォーム
            </p>
            <h1 className="aix2-hero-title mt-5 aix2-rise" style={{ ["--d" as string]: "120ms" }}>
              今のあなたを知り、<span className="em">これからを一緒に選ぶ</span>。
            </h1>
            <p className="aix2-lead mt-6 aix2-rise" style={{ ["--d" as string]: "240ms" }}>
              あなたの状態・変化・好みを理解し、合う情報・体験・サービス・つながりを、
              <br className="hidden sm:block" />
              必要なときに届ける。固定タイプではなく、これからを一緒に選ぶ伴走です。
            </p>
            <div className="mt-9 flex flex-wrap gap-3 aix2-rise" style={{ ["--d" as string]: "340ms" }}>
              <Link href="/start" className="aix2-btn aix2-btn-primary">
                今の自分から始める
              </Link>
              <Link href="/#system" className="aix2-btn aix2-btn-ghost">
                YORISOUでできることを見る
              </Link>
            </div>
            <p className="mt-4 text-[12.5px] aix2-mut aix2-rise" style={{ ["--d" as string]: "440ms" }}>
              チェックは、あなたを理解するための最初の入口のひとつ。無料・ログインなしで始められます。
            </p>
          </div>

          {/* Six-domain connected system map — part of the first-page composition */}
          <AixIn className="relative z-[1] pb-16">
            <nav className="yr-systemmap" aria-label="YORISOUの6つの領域">
              {DOMAINS.map((d) => (
                <Link key={d.id} href={d.cueHref} className="yr-node" data-live={d.status === "current" ? "true" : "false"}>
                  <span className="yr-node-dot" aria-hidden="true" />
                  <span className="yr-node-title">{d.title}</span>
                  <span className="yr-node-role">{d.role}</span>
                  <span className={d.status === "current" ? "yr-node-live" : "yr-node-soon"}>
                    {d.status === "current" ? "いま使える" : "プロトタイプ"}
                  </span>
                </Link>
              ))}
            </nav>
          </AixIn>
        </div>
      </section>

      {/* ===== Understanding → support model: the personalization mechanism ===== */}
      <AixIn as="section" id="how" className="aix2-band aix2-band--tight">
        <div className="container">
          <p className="aix2-eyebrow aix2-rise">仕組み</p>
          <h2 className="aix2-band-title mt-3 aix2-rise" style={{ ["--d" as string]: "90ms" }}>
            理解するから、合うものが届く。
          </h2>
          <p className="mt-4 max-w-[44rem] text-[14px] leading-8 aix2-mut aix2-rise" style={{ ["--d" as string]: "150ms" }}>
            テスト結果で終わりではありません。あなたが選んで教えてくれたことから今の状態を理解し、必要なときに合うものを届け、反応から少しずつ学び直します。
          </p>
          <div className="yr-flow mt-8 aix2-rise" style={{ ["--d" as string]: "200ms" }}>
            <div className="yr-flow-col">
              <p className="yr-flow-label">入力（あなたが選ぶ）</p>
              <p className="yr-flow-title">教えてくれたこと</p>
              <p className="yr-flow-item">チェック・選択</p>
              <p className="yr-flow-item">保存した関心・感想</p>
              <p className="yr-flow-item">今の状態の変化</p>
            </div>
            <div className="yr-flow-arrow" aria-hidden="true">→</div>
            <div className="yr-flow-col" data-accent="jade">
              <p className="yr-flow-label">理解</p>
              <p className="yr-flow-title">今のあなたを読む</p>
              <p className="yr-flow-item">状態・ペース・文脈</p>
              <p className="yr-flow-item">固定タイプにはしない</p>
              <p className="yr-flow-item">残す・戻るはあなたの操作で</p>
            </div>
            <div className="yr-flow-arrow" aria-hidden="true">→</div>
            <div className="yr-flow-col">
              <p className="yr-flow-label">支援（必要なときに）</p>
              <p className="yr-flow-title">合うものを届ける</p>
              <p className="yr-flow-item">情報・レポート・行動</p>
              <p className="yr-flow-item">体験・場所・公的な資源</p>
              <p className="yr-flow-item">サービス・次の一歩</p>
            </div>
          </div>
          <div className="yr-flow-loop mt-6 aix2-rise" style={{ ["--d" as string]: "260ms" }}>
            <span className="text-[11px] font-semibold tracking-[0.12em] text-[color:var(--jade-bright)]">学びのループ</span>
            {["役立った", "試した", "保存", "見返す", "自分に合わない"].map((n, i) => (
              <span key={n} className="contents">
                <span className="node">{n}</span>
                {i < 4 ? <span className="sep">·</span> : null}
              </span>
            ))}
            <span className="text-[12px] aix2-faint">→ 次のおすすめが、少しずつ合っていく。</span>
          </div>
        </div>
      </AixIn>

      {/* ===== Service-system detail: the six user domains ===== */}
      <AixIn as="section" id="system" className="aix2-band aix2-band--tint">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div className="max-w-[42rem]">
              <p className="aix2-eyebrow aix2-rise">ひとつの伴走システム</p>
              <h2 className="aix2-band-title mt-3 aix2-rise" style={{ ["--d" as string]: "90ms" }}>
                6つの領域は、あなたを理解して<br className="hidden sm:block" />つながる、ひとつの流れ。
              </h2>
              <p className="mt-3 max-w-[40rem] text-[13.5px] leading-7 aix2-mut aix2-rise" style={{ ["--d" as string]: "120ms" }}>
                別々の機能ではありません。理解をもとに、残し、合うものを見つけ、深め、試し、その反応が次を良くしていきます。
              </p>
            </div>
            <p className="aix2-eyebrow aix2-rise" style={{ ["--d" as string]: "150ms" }}>理解 → 育てる</p>
          </div>
          <div className="aix3-domains mt-10">
            {DOMAINS.map((d, i) => (
              <Link
                key={d.id}
                id={d.id}
                href={d.cueHref}
                className="aix3-domain aix2-rise"
                style={{ ["--d" as string]: `${i * 60}ms` }}
              >
                <span className={`aix3-status aix3-status--${d.status}`}>{STATUS_LABEL[d.status]}</span>
                <span className="aix3-domain-index">{d.index}</span>
                <span className="aix3-domain-title">{d.title}</span>
                <span className="aix3-domain-body">{d.body}</span>
                <span className="aix3-domain-cue">{d.cueLabel} →</span>
              </Link>
            ))}
          </div>
        </div>
      </AixIn>

      {/* ===== How the system works: the platform loop ===== */}
      <AixIn as="section" id="loop" className="aix2-band aix2-band--tight">
        <div className="container">
          <p className="aix2-eyebrow aix2-rise">つながり方</p>
          <h2 className="aix2-band-title mt-3 aix2-rise" style={{ ["--d" as string]: "90ms" }}>
            理解して終わりではなく、巡っていく。
          </h2>
          <div className="aix3-loop mt-7 aix2-rise" style={{ ["--d" as string]: "160ms" }}>
            {LOOP.map((node, i) => (
              <span key={node} className="contents">
                <span className="aix3-loop-node" data-accent={i === 0 ? "jade" : undefined}>{node}</span>
                {i < LOOP.length - 1 ? <span className="aix3-loop-sep">→</span> : null}
              </span>
            ))}
          </div>
          <p className="mt-5 max-w-[42rem] text-[13.5px] leading-7 aix2-mut aix2-rise" style={{ ["--d" as string]: "220ms" }}>
            チェックは「理解」のひとつ。結果を残し、合うものを見つけ、深め、試し、状態が変われば戻り、その気づきが次の体験や資料を良くしていきます。
          </p>
        </div>
      </AixIn>

      {/* ===== A concrete example journey ===== */}
      <AixIn as="section" className="aix2-band aix2-band--tight aix2-band--tint">
        <div className="container">
          <p className="aix2-eyebrow aix2-rise">たとえば、こんな流れ</p>
          <h2 className="aix2-band-title mt-3 aix2-rise" style={{ ["--d" as string]: "90ms" }}>
            ひとつのチェックから、続いていく。
          </h2>
          <div className="yr-example mt-8 aix2-rise" style={{ ["--d" as string]: "150ms" }}>
            {EXAMPLE.map((step) => (
              <div key={step.n} className="yr-example-step">
                <span className="n">{step.n}</span>
                <p className="mt-3 text-[14px] font-bold leading-6 text-[color:var(--tx)]">{step.title}</p>
                <p className="mt-1.5 text-[12.5px] leading-7 aix2-mut">{step.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[12.5px] aix2-faint aix2-rise" style={{ ["--d" as string]: "260ms" }}>
            いま使えるのは「理解・残す・見つける・深める」。体験・育てるはプロトタイプとして試せます。
          </p>
        </div>
      </AixIn>

      {/* ===== Individual vs partner pathways (no mixed B2C/B2B) ===== */}
      <AixIn as="section" id="partners-intro" className="aix2-band">
        <div className="container">
          <div className="aix3-split">
            <div className="aix2-panel p-6 sm:p-8">
              <p className="aix2-eyebrow">あなたのための YORISOU</p>
              <h3 className="mt-3 text-[1.5rem] font-bold leading-tight text-[color:var(--tx)]">
                今の自分を、静かに理解する。
              </h3>
              <p className="mt-3 text-[14px] leading-8 aix2-mut">
                状態を見て、残し、合うものを見つけ、深め、必要なときだけ戻る。決めつけず、あなたのペースで。
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/check-in" className="aix2-btn aix2-btn-primary !min-h-[46px] !text-[14px]">今の自分から始める</Link>
                <Link href="/tests" className="aix2-link self-center">入口をえらぶ →</Link>
              </div>
            </div>
            <div className="aix2-panel aix2-panel--now p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <p className="aix2-eyebrow">パートナーのための YORISOU</p>
                <span className="aix3-status aix3-status--planned">検証・設計中</span>
              </div>
              <h3 className="mt-3 text-[1.5rem] font-bold leading-tight text-[color:var(--tx)]">
                需要と相性を、検証する。
              </h3>
              <p className="mt-3 text-[14px] leading-8 aix2-mut">
                資料やプロダクトの候補審査、コンセプト・プロトタイプ・市場検証、匿名化された需要の把握。公開の出品・決済・先行販売は行いません。
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/partners" className="aix2-btn aix2-btn-ghost !min-h-[46px] !text-[14px]">パートナー向けを見る</Link>
              </div>
            </div>
          </div>
        </div>
      </AixIn>

      {/* ===== Trust and control ===== */}
      <AixIn as="section" className="aix2-band aix2-band--tight">
        <div className="container">
          <p className="aix2-eyebrow aix2-rise">安心と、コントロール</p>
          <h2 className="aix2-band-title mt-3 aix2-rise" style={{ ["--d" as string]: "90ms" }}>
            主導権は、いつもあなたに。
          </h2>
          <div className="mt-7 flex flex-wrap gap-2.5 aix2-rise" style={{ ["--d" as string]: "150ms" }}>
            {TRUST.map((t) => (
              <span key={t} className="aix3-chip">{t}</span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3 aix2-rise" style={{ ["--d" as string]: "220ms" }}>
            <Link href="/check-in" className="aix2-btn aix2-btn-primary">今の自分から始める</Link>
            <Link href="/contact?topic=open-testing" className="aix2-btn aix2-btn-ghost">感想や関心を送る</Link>
          </div>
        </div>
      </AixIn>
    </main>
  );
}
