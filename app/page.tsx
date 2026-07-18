import type { Metadata } from "next";
import Link from "next/link";

import DepthFieldStatic from "./components/depth-field/DepthFieldStatic";
import DepthFieldLazy from "./components/depth-field/DepthFieldLazy";
import { intentionDepthParams, intentionPalette } from "./components/depth-field/seed";
import AixIn from "./components/aix2/AixIn";

export const metadata: Metadata = {
  title: "Yorisou | 今の状態を理解し、次の選択肢につなげる",
  description:
    "Yorisouは、今の状態を理解し、チェック、結果、レポート、おすすめ、コミュニティ、よりそうデザイン、マッチング、LINE継続へつなげる日本語ファーストのプラットフォームです。",
};

// AIX-2 — Living Intelligence. Dark, dimensional, warm. Immersive WebGL depth
// hero flowing into a glanceable product journey and honest growing layers.

const JOURNEY: ReadonlyArray<{ step: string; title: string; body: string; accent?: boolean }> = [
  { step: "01", title: "はじめる", body: "ログインなしで120問へ。", accent: true },
  { step: "02", title: "チェック", body: "一問ずつ、静かに答える。" },
  { step: "03", title: "結果", body: "いまの動き方を、24の色で。" },
  { step: "04", title: "保存・戻る", body: "端末やLINEに残して見返す。" },
  { step: "05", title: "レポート", body: "結果の先の、深い読みもの。" },
  { step: "06", title: "次の層", body: "おすすめや、この先の領域へ。" },
];

const LAYERS = [
  { title: "コミュニティ", body: "気になるテーマに、任意で参加。声は次の改善につながります。" },
  { title: "よりそうデザイン", body: "「あると助かるもの」を、アイデアから試用へ少しずつ。" },
  { title: "マッチング", body: "販売の場ではなく、役立つつながりを関心ベースで整理する準備中の領域。" },
] as const;

export default function HomePage() {
  const params = intentionDepthParams(null, 320);
  const palette = intentionPalette();
  const reportParams = intentionDepthParams("discover-next", 180);

  return (
    <main className="aix2">
      {/* ===== Scene 1: immersive depth hero ===== */}
      <section className="aix2-hero">
        <div className="depth-scene" aria-hidden="true">
          <DepthFieldStatic params={params} palette={palette} formation={0.72} className="depth-layer" />
          <DepthFieldLazy params={params} palette={palette} formation={1} className="depth-layer" scrollParallax />
          <div className="depth-veil" />
        </div>
        <div className="container relative z-[1]">
          <div className="aix2-in max-w-[52rem] py-24">
            <p className="aix2-eyebrow aix2-rise" style={{ ["--d" as string]: "40ms" }}>
              YORISOU · 生きた知性
            </p>
            <h1 className="aix2-hero-title mt-5 aix2-rise" style={{ ["--d" as string]: "120ms" }}>
              今を、<span className="em">深く</span>。
              <br />
              静かに視る。
            </h1>
            <p className="aix2-lead mt-6 aix2-rise" style={{ ["--d" as string]: "240ms" }}>
              固定タイプの診断ではなく、いまのあなたの動き方を理解して、次の選択肢へつなぐ。
            </p>
            <div className="mt-9 flex flex-wrap gap-3 aix2-rise" style={{ ["--d" as string]: "340ms" }}>
              <Link href="/check-in" className="aix2-btn aix2-btn-primary">
                いま色テストをはじめる
              </Link>
              <Link href="/tests" className="aix2-btn aix2-btn-ghost">
                入口をえらぶ
              </Link>
            </div>
            <p className="mt-4 text-[12.5px] aix2-mut aix2-rise" style={{ ["--d" as string]: "440ms" }}>
              120問 · 無料 · ログインなし
            </p>
          </div>
        </div>
      </section>

      {/* ===== Scene 2: the journey, shown as a connected flow ===== */}
      <AixIn as="section" className="aix2-band">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <h2 className="aix2-band-title aix2-rise">
              状態は変わる。だから、続く。
            </h2>
            <p className="aix2-eyebrow aix2-rise" style={{ ["--d" as string]: "90ms" }}>はじめる → 次の層</p>
          </div>
          <div className="aix2-journey mt-10">
            {JOURNEY.map((n, i) => (
              <div
                key={n.step}
                className="aix2-journey-node aix2-rise"
                data-accent={n.accent ? "jade" : undefined}
                style={{ ["--d" as string]: `${i * 70}ms` }}
              >
                <span className="aix2-journey-step">{n.step}</span>
                <div>
                  <p className="aix2-journey-title">{n.title}</p>
                  <p className="aix2-journey-body">{n.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AixIn>

      {/* ===== Scene 3: what works now (elevated "present" zone) ===== */}
      <section className="aix2-band aix2-band--tight aix2-band--tint">
        <div className="container">
          <div className="mx-auto max-w-[52rem]">
            <div className="aix2-panel aix2-panel--now p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="aix2-eyebrow">いま動いている</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--hair-jade)] px-2.5 py-1 text-[11px] font-semibold text-[var(--jade-bright)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--jade)]" />公開テスト中
                </span>
              </div>
              <p className="mt-3 text-[16px] font-semibold leading-8 text-[color:var(--tx)]">
                チェック・結果・レポート・LINE保存・おすすめまで、実際に試せます。
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                <Link href="/open-testing" className="aix2-link">公開中の入口を見る →</Link>
                <Link href="/contact?topic=open-testing" className="aix2-link">感想や不具合を送る →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Scene 4: report layer ===== */}
      <AixIn as="section" className="aix2-band">
        <div className="container" id="yorisou-report">
          <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-center">
            <div>
              <p className="aix2-eyebrow aix2-rise">レポート</p>
              <h2 className="aix2-band-title mt-3 aix2-rise" style={{ ["--d" as string]: "90ms" }}>
                無料結果の先に、深い読みもの。
              </h2>
              <p className="aix2-lead mt-4 aix2-rise" style={{ ["--d" as string]: "170ms" }}>
                関係の距離や整えやすいペースを、無料結果より少し具体的に。決めつけではなく、次の一歩のための読みものです。
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 aix2-rise" style={{ ["--d" as string]: "250ms" }}>
                <Link href="/report-preview?resultId=EM-AK&overlayId=balancing&confidence=low" className="aix2-link">レポートの見本 →</Link>
                <Link href="/result?resultId=EM-AK&overlayId=balancing&confidence=low" className="aix2-link">結果ページの見本 →</Link>
              </div>
            </div>
            <div className="aix2-rise" style={{ ["--d" as string]: "200ms" }}>
              <div className="aix2-glass relative aspect-[4/3] overflow-hidden">
                <DepthFieldStatic params={reportParams} palette={palette} formation={1} className="absolute inset-0 h-full w-full opacity-80" />
                <DepthFieldLazy params={reportParams} palette={palette} formation={1} className="absolute inset-0 h-full w-full" />
              </div>
            </div>
          </div>
        </div>
      </AixIn>

      {/* ===== Scene 5: LINE return path (elevated "present" zone) ===== */}
      <AixIn as="section" className="aix2-band aix2-band--tint">
        <div className="container" id="yorisou-line">
          <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-start">
            <div>
              <p className="aix2-eyebrow aix2-rise">戻り道</p>
              <h2 className="aix2-band-title mt-3 aix2-rise" style={{ ["--d" as string]: "90ms" }}>
                LINEは、戻り道として使える。
              </h2>
              <p className="aix2-lead mt-4 aix2-rise" style={{ ["--d" as string]: "170ms" }}>
                チェックの代わりではなく、振り返りを続けるための戻り道。保存し、必要なときだけ次の入口を受け取り、不要なら通知を止められます。
              </p>
              <div className="mt-6 aix2-rise" style={{ ["--d" as string]: "250ms" }}>
                <Link href="/line/mini-app" className="aix2-btn aix2-btn-ghost">LINEでYorisouを開く</Link>
              </div>
            </div>
            <div className="aix2-rise self-center" style={{ ["--d" as string]: "150ms" }}>
              <div className="grid gap-0">
                {["結果をLINEに保存して見返す", "必要なときだけ次の入口を受け取る", "深いレポートや関連情報へ戻る", "不要なときは通知を止める"].map((line) => (
                  <div key={line} className="aix2-hair-top py-4 pl-4 text-[14px] aix2-mut" style={{ borderLeft: "2px solid var(--hair-2)" }}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AixIn>

      {/* ===== Scene 6: growing layers (deliberately quiet, subordinate) ===== */}
      <AixIn as="section" className="aix2-band aix2-band--quiet">
        <div className="container" id="yorisou-community">
          <div className="max-w-[42rem]">
            <p className="aix2-eyebrow aix2-rise">この先に育てている層</p>
            <h2 className="aix2-band-title mt-3 aix2-rise" style={{ ["--d" as string]: "90ms" }}>
              まだ準備中の領域。
            </h2>
            <p className="aix2-lead mt-4 aix2-rise" style={{ ["--d" as string]: "170ms" }}>
              どれもコンセプトや関心の段階です。購入・決済・配送・申込みは行いません。参加は任意です。
            </p>
          </div>
          <div className="mt-9 grid gap-0 md:grid-cols-3 md:gap-10">
            {LAYERS.map((layer, i) => (
              <div
                key={layer.title}
                id={i === 1 ? "yorisou-design" : i === 2 ? "yorisou-market" : undefined}
                className="aix2-hair-top py-6 aix2-rise"
                style={{ ["--d" as string]: `${i * 90}ms` }}
              >
                <p className="text-[16px] font-bold text-[color:var(--tx)]">{layer.title}</p>
                <p className="mt-2 text-[13.5px] leading-7 aix2-mut">{layer.body}</p>
                <p className="mt-3 aix2-eyebrow">準備中 · 関心の段階</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-[44rem] text-[13px] leading-7 aix2-faint">
            言葉にしにくい揺れも、悩みになる前の関心も、いまを整理する入口として。
            <Link href="/contact?topic=open-testing" className="ml-2 aix2-link">感想や関心を送る →</Link>
          </p>
        </div>
      </AixIn>
    </main>
  );
}
