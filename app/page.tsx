import type { Metadata } from "next";
import Link from "next/link";

import DepthFieldStatic from "./components/depth-field/DepthFieldStatic";
import DepthFieldLazy from "./components/depth-field/DepthFieldLazy";
import { intentionDepthParams, intentionPalette } from "./components/depth-field/seed";
import AixIn from "./components/aix2/AixIn";

export const metadata: Metadata = {
  title: "YORISOU | テストで終わらない、状態理解プラットフォーム",
  description:
    "YORISOUは、チェックを入口に、理解・記録・発見・レポート・体験・つながり・共創をつなぐAI-nativeプラットフォーム。今の自分を理解し、残し、深め、次の選択につなぎます。",
};

// AIX-3 — Product architecture reframe. The homepage communicates the whole
// platform: the test is the first understanding step, not the product.

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
  body: string;
  status: Status;
  cueHref: string;
  cueLabel: string;
}> = [
  { id: "understand", index: "01", title: "理解する", body: "チェックを入口に、今の状態を見る。固定タイプではなく、いまの動き方を。", status: "current", cueHref: "/tests", cueLabel: "理解の入口へ" },
  { id: "keep", index: "02", title: "残す・戻る", body: "結果や気づきを、この端末やLINEに残す。状態が変わったら、また戻れる。", status: "current", cueHref: "/check-in", cueLabel: "チェックから始める" },
  { id: "discover", index: "03", title: "見つける", body: "今の状態に合う一歩・体験・読みもの・道具・場所を、理由つきで。", status: "current", cueHref: "/recommendations", cueLabel: "見つけにいく" },
  { id: "deepen", index: "04", title: "深める", body: "無料結果の先の、少し深い読みもの。決めつけず、次の一歩の材料に。", status: "current", cueHref: "/report-preview?resultId=EM-AK&overlayId=balancing&confidence=low", cueLabel: "レポートの見本を見る" },
  { id: "connect", index: "05", title: "つながる", body: "体験を試す、役立ったを残す。低圧力のつながりや地域の発見は、プロトタイプ段階。", status: "prototype", cueHref: "/contact?topic=open-testing", cueLabel: "体験の感想を送る" },
  { id: "improve", index: "06", title: "育てる", body: "感想や共創で、これからの体験・資料・プロダクトを一緒に良くしていく。", status: "prototype", cueHref: "/contact?topic=open-testing", cueLabel: "フィードバックを送る" },
];

const LOOP = ["理解", "残す", "見つける", "深める", "体験", "戻る", "改善"] as const;

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
      {/* ===== Hero: platform positioning (test = entry, not product) ===== */}
      <section className="aix2-hero">
        <div className="depth-scene" aria-hidden="true">
          <DepthFieldStatic params={params} palette={palette} formation={0.72} className="depth-layer" />
          <DepthFieldLazy params={params} palette={palette} formation={1} className="depth-layer" scrollParallax />
          <div className="depth-veil" />
        </div>
        <div className="container relative z-[1]">
          <div className="aix2-in max-w-[54rem] py-24">
            <p className="aix2-eyebrow aix2-rise" style={{ ["--d" as string]: "40ms" }}>
              YORISOU · 状態理解プラットフォーム
            </p>
            <h1 className="aix2-hero-title mt-5 aix2-rise" style={{ ["--d" as string]: "120ms" }}>
              テストで、<span className="em">終わらない</span>。
            </h1>
            <p className="aix2-lead mt-6 aix2-rise" style={{ ["--d" as string]: "240ms" }}>
              今の自分を理解し、残し、深め、次の選択につなぐ。チェックは、その入口です。
            </p>
            <div className="mt-9 flex flex-wrap gap-3 aix2-rise" style={{ ["--d" as string]: "340ms" }}>
              <Link href="/check-in" className="aix2-btn aix2-btn-primary">
                いまの状態をみる
              </Link>
              <Link href="/#system" className="aix2-btn aix2-btn-ghost">
                プロダクトを見る
              </Link>
            </div>
            <p className="mt-4 text-[12.5px] aix2-mut aix2-rise" style={{ ["--d" as string]: "440ms" }}>
              チェックは入口 · 120問 · 無料 · ログインなし
            </p>
          </div>
        </div>
      </section>

      {/* ===== Service-system map: the six user domains ===== */}
      <AixIn as="section" id="system" className="aix2-band">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div className="max-w-[40rem]">
              <p className="aix2-eyebrow aix2-rise">ひとつのプラットフォーム</p>
              <h2 className="aix2-band-title mt-3 aix2-rise" style={{ ["--d" as string]: "90ms" }}>
                テストは、6つの入口のひとつ。
              </h2>
            </div>
            <p className="aix2-eyebrow aix2-rise" style={{ ["--d" as string]: "120ms" }}>理解 → 育てる</p>
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
      <AixIn as="section" id="loop" className="aix2-band aix2-band--tight aix2-band--tint">
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
                <Link href="/check-in" className="aix2-btn aix2-btn-primary !min-h-[46px] !text-[14px]">いまの状態をみる</Link>
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
          <p className="mt-6 max-w-[44rem] text-[13px] leading-7 aix2-faint aix2-rise" style={{ ["--d" as string]: "220ms" }}>
            言葉にしにくい揺れも、悩みになる前の関心も、いまを整理する入口として。
            <Link href="/contact?topic=open-testing" className="ml-2 aix2-link">感想や関心を送る →</Link>
          </p>
        </div>
      </AixIn>
    </main>
  );
}
