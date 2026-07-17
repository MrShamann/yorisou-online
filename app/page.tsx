import type { Metadata } from "next";
import Link from "next/link";

import OpenTestingNotice from "./components/OpenTestingNotice";
import StateFieldStatic from "./components/state-field/StateFieldStatic";
import ScrollFormationCanvas from "./components/state-field/ScrollFormationCanvas";
import { intentionParams } from "./components/state-field/seed";

export const metadata: Metadata = {
  title: "Yorisou | 今の状態を理解し、次の選択肢につなげる",
  description:
    "Yorisouは、今の状態を理解し、チェック、結果、レポート、おすすめ、コミュニティ、よりそうデザイン、マッチング、LINE継続へつなげる日本語ファーストのプラットフォームです。",
};

// AIX-1 — spatial narrative home. One value line, one primary action, a live
// State Field, and a single continuing journey — instead of a card catalog.

const JOURNEY_FLOW = [
  { title: "はじめる", body: "ログインなしで、120問のいま色テストから始められます。" },
  { title: "今の状態が形になる", body: "答えるほど、今の動き方が24の色と名前のどれかに近づいていきます。" },
  { title: "結果を受け取る", body: "固定タイプではなく、今の動き方としてやわらかく受け取ります。" },
  { title: "保存して、見返す", body: "必要ならLINEやこの端末に残して、あとから自分のペースで見直せます。" },
  { title: "次の一歩へ", body: "詳しいレポートや今のヒントへ、無理のない範囲で進めます。" },
  { title: "状態が変わったら、また", body: "結果は今の見え方です。変わったと感じたら、また試せます。" },
] as const;

const FUTURE_LAYERS = [
  {
    title: "コミュニティ",
    body: "気になるテーマに、フィードバック、試用、生活の観察、アイデアづくりとして任意で参加できます。声は、よりよいチェック、レポート、おすすめにつながります。",
  },
  {
    title: "よりそうデザイン",
    body: "チェックの結果やフィードバックから見えてきた「あると助かるもの」を、アイデア、試用、共創、商品化へと少しずつ育てていきます。",
  },
  {
    title: "マッチング",
    body: "まだ販売や注文の場所ではなく、どんな提案やつながりが役に立ちそうかを、関心ベースで整理していく準備中の領域です。",
  },
] as const;

export default function HomePage() {
  const fieldParams = intentionParams(null, 84);

  return (
    <main className="frontstage-page">
      {/* ===== Scene 1: value + primary action + live field ===== */}
      <section className="aix-scene aix-hero">
        <div className="state-field-scene" aria-hidden="true">
          <StateFieldStatic params={fieldParams} formation={0.62} className="state-field-layer" />
          <ScrollFormationCanvas params={fieldParams} className="state-field-layer" />
          <div className="state-field-veil" />
        </div>
        <div className="container">
          <div className="max-w-[44rem] py-10">
            <p className="aix-kicker">YORISOU — 静かな知性</p>
            <h1 className="display-serif frontstage-hero-title mt-4 max-w-[11em]">
              今の状態を、
              <br className="hidden md:block" />
              静かに見てみる。
            </h1>
            <p className="frontstage-hero-lead">
              Yorisouは、固定タイプを当てはめる場所ではなく、いまのあなたの動き方を理解して、次の選択肢へつなげる場所です。
            </p>
            <div className="frontstage-hero-actions">
              <Link href="/check-in" className="btn btn-primary">
                いま色テストをはじめる
              </Link>
              <Link href="/tests" className="btn btn-secondary">
                入口をえらぶ
              </Link>
            </div>
            <p className="mt-4 text-[12px] leading-6 text-[#8A8078]">
              診断や占いではありません · 120問 · 無料 · ログインなし
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              <span className="aix-whisper">受け取れるもの:</span>
              <span className="aix-whisper">24の色と名前で見る今の動き方</span>
              <span className="aix-whisper">詳しいレポート</span>
              <span className="aix-whisper">保存と戻り道</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Scene 2: the continuing journey (system, not one test) ===== */}
      <section className="aix-scene aix-band">
        <div className="container">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <div>
              <p className="aix-kicker">ひとつのテストで終わらない</p>
              <h2 className="aix-band-title mt-3">
                状態は変わる。
                <br />
                だから、続きがあります。
              </h2>
              <p className="aix-band-lead">
                チェック、結果、レポート、おすすめ、保存、そして戻り道。Yorisouはその全体をひとつの流れとして整えています。
              </p>
            </div>
            <div className="aix-flow">
              {JOURNEY_FLOW.map((step) => (
                <div key={step.title} className="aix-flow-step">
                  <p className="aix-flow-title">{step.title}</p>
                  <p className="aix-flow-body">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Scene 3: current open-testing truth ===== */}
      <section className="container pb-2">
        <div className="mx-auto max-w-[52rem]">
          <OpenTestingNotice
            title="いま使える核"
            body="いまは、チェック、結果、詳しいレポート、LINE保存、感想送信、おすすめの入口までを実際に試せます。コミュニティ、よりそうデザイン、マッチングはコンセプトや関心の段階として育てています。"
            primaryHref="/contact?topic=open-testing"
            primaryLabel="感想や不具合を送る"
            secondaryHref="/open-testing"
            secondaryLabel="公開中の入口を見る"
          />
        </div>
      </section>

      {/* ===== Scene 4: report layer ===== */}
      <section className="aix-band" id="yorisou-report">
        <div className="container">
          <div className="max-w-[44rem]">
            <p className="aix-kicker">レポート</p>
            <h2 className="aix-band-title mt-3">無料結果の先に、もう少し深い読みものがあります。</h2>
            <p className="aix-band-lead">
              関係の距離、仕事や生活で整えやすいペースを、無料結果より少し具体的に整理します。あなたの状態を決めつけるものではなく、次の選択肢を考えるための読みものです。いまは公開テスト中のため、全文レポートと保存導線も確認できます。
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <Link href="/report-preview?resultId=EM-AK&overlayId=balancing&confidence=low" className="text-[14px] font-semibold text-[#315F50] underline-offset-4 hover:underline">
                レポートの見本を見る →
              </Link>
              <Link href="/result?resultId=EM-AK&overlayId=balancing&confidence=low" className="text-[14px] font-semibold text-[#315F50] underline-offset-4 hover:underline">
                結果ページの見本を見る →
              </Link>
              <Link href="/contact?topic=open-testing" className="text-[14px] font-semibold text-[#315F50] underline-offset-4 hover:underline">
                レポート案内を受け取る →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Scene 5: LINE return path ===== */}
      <section className="aix-band" id="yorisou-line">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-start">
            <div>
              <p className="aix-kicker">戻り道</p>
              <h2 className="aix-band-title mt-3">LINEは、戻り道として使える。</h2>
              <p className="aix-band-lead">
                LINEは、チェックの代わりではなく、結果や振り返りを無理なく続けるための戻り道です。結果を保存して見返し、必要なときだけ次の入口を受け取り、不要なときは通知を止められます。
              </p>
              <div className="mt-6">
                <Link href="/line/mini-app" className="btn btn-secondary inline-flex">
                  LINEでYorisouを開く
                </Link>
              </div>
            </div>
            <div className="aix-flow self-center">
              {[
                "結果をLINEに保存して見返す",
                "必要なときだけ次の入口を受け取る",
                "深いレポートや関連情報へ戻る",
                "不要なときは通知を止める",
              ].map((line) => (
                <div key={line} className="aix-flow-step">
                  <p className="aix-flow-body !text-[14px]">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Scene 6: growing layers (honest stage labels, no catalog) ===== */}
      <section className="aix-band" id="yorisou-community">
        <div className="container">
          <div className="max-w-[44rem]">
            <p className="aix-kicker">育てている層</p>
            <h2 className="aix-band-title mt-3">この先に、少しずつ育てている領域があります。</h2>
            <p className="aix-band-lead">
              どれもまだコンセプトや関心の段階です。購入、決済、在庫、配送、申込みは行いません。参加は任意で、あなたの声は次の改善につながります。
            </p>
          </div>
          <div className="mt-8 grid gap-0 md:grid-cols-3 md:gap-10">
            {FUTURE_LAYERS.map((layer, i) => (
              <div
                key={layer.title}
                id={i === 1 ? "yorisou-design" : i === 2 ? "yorisou-market" : undefined}
                className="border-t border-[rgba(23,59,53,0.1)] py-5 md:border-t-2"
              >
                <p className="text-[15px] font-bold leading-7 text-[#173B35]">{layer.title}</p>
                <p className="mt-2 text-[13px] leading-7 text-[#6F625C]">{layer.body}</p>
                <p className="mt-2 text-[11px] font-semibold tracking-[0.08em] text-[#8A8078]">準備中 · 関心の段階</p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-[44rem] text-[12px] leading-6 text-[#8A7E78]">
            言葉にしにくい揺れも、大きな悩みになる前の関心も、Yorisouでは今を整理する入口として受け止めます。
            <Link href="/contact?topic=open-testing" className="ml-2 font-semibold text-[#315F50] hover:underline">
              感想や関心を送る →
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
