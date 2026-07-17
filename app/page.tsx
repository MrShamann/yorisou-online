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
  { step: "01", title: "はじめる", body: "ログインなしで、今の動き方をみる120問チェックへ。", accent: true },
  { step: "02", title: "チェック", body: "一問ずつ、静かに。答えるほど状態が形になっていきます。" },
  { step: "03", title: "結果", body: "固定タイプではなく、いまの動き方を24の色と名前で受け取る。" },
  { step: "04", title: "保存・戻る", body: "この端末やLINEに残して、あとから自分のペースで見返せます。" },
  { step: "05", title: "レポート", body: "無料結果の先の、少し深い読みもの。次の選択肢を考える材料に。" },
  { step: "06", title: "次の層", body: "おすすめ、コミュニティ、よりそうデザイン、マッチングへ静かに。" },
];

const LAYERS = [
  { title: "コミュニティ", body: "気になるテーマに、フィードバックや試用として任意で参加できます。声は、よりよいチェックやレポートにつながります。" },
  { title: "よりそうデザイン", body: "チェックの結果から見えてきた「あると助かるもの」を、アイデア、試用、共創へと少しずつ育てていきます。" },
  { title: "マッチング", body: "まだ販売や注文の場所ではなく、どんな提案やつながりが役に立ちそうかを、関心ベースで整理していく準備中の領域です。" },
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

      {/* ===== Scene 2: the journey, shown as a spatial diagram ===== */}
      <AixIn as="section" className="aix2-band">
        <div className="container">
          <div className="max-w-[42rem]">
            <p className="aix2-eyebrow aix2-rise">ひとつのテストで終わらない</p>
            <h2 className="aix2-band-title mt-3 aix2-rise" style={{ ["--d" as string]: "90ms" }}>
              状態は変わる。だから、続く。
            </h2>
            <p className="aix2-lead mt-4 aix2-rise" style={{ ["--d" as string]: "170ms" }}>
              はじめる、チェック、結果、保存と戻り道、レポート、そして次の層。全体をひとつの流れとして見通せます。
            </p>
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

      {/* ===== Scene 3: current open-testing truth ===== */}
      <section className="aix2-band aix2-band--tight">
        <div className="container">
          <div className="mx-auto max-w-[52rem]">
            <div className="aix2-panel p-6 sm:p-8">
              <p className="aix2-eyebrow">いま使える核</p>
              <p className="mt-3 aix2-mut text-[14.5px] leading-8">
                いまは、チェック、結果、詳しいレポート、LINE保存、感想送信、おすすめの入口までを実際に試せます。コミュニティ、よりそうデザイン、マッチングはコンセプトや関心の段階として育てています。
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
                関係の距離、仕事や生活で整えやすいペースを、無料結果より少し具体的に整理します。決めつけではなく、次の選択肢を考えるための読みものです。
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

      {/* ===== Scene 5: LINE return path ===== */}
      <AixIn as="section" className="aix2-band">
        <div className="container" id="yorisou-line">
          <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-start">
            <div>
              <p className="aix2-eyebrow aix2-rise">戻り道</p>
              <h2 className="aix2-band-title mt-3 aix2-rise" style={{ ["--d" as string]: "90ms" }}>
                LINEは、戻り道として使える。
              </h2>
              <p className="aix2-lead mt-4 aix2-rise" style={{ ["--d" as string]: "170ms" }}>
                チェックの代わりではなく、結果や振り返りを無理なく続けるための戻り道です。結果を保存し、必要なときだけ次の入口を受け取り、不要なときは通知を止められます。
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

      {/* ===== Scene 6: growing layers (honest stages) ===== */}
      <AixIn as="section" className="aix2-band">
        <div className="container" id="yorisou-community">
          <div className="max-w-[42rem]">
            <p className="aix2-eyebrow aix2-rise">育てている層</p>
            <h2 className="aix2-band-title mt-3 aix2-rise" style={{ ["--d" as string]: "90ms" }}>
              この先に、少しずつ育てている領域。
            </h2>
            <p className="aix2-lead mt-4 aix2-rise" style={{ ["--d" as string]: "170ms" }}>
              どれもまだコンセプトや関心の段階です。購入、決済、在庫、配送、申込みは行いません。参加は任意で、声は次の改善につながります。
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
            言葉にしにくい揺れも、大きな悩みになる前の関心も、Yorisouでは今を整理する入口として受け止めます。
            <Link href="/contact?topic=open-testing" className="ml-2 aix2-link">感想や関心を送る →</Link>
          </p>
        </div>
      </AixIn>
    </main>
  );
}
