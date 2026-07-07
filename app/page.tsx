import type { Metadata } from "next";
import Link from "next/link";

import MotionReveal from "./components/MotionReveal";
import OpenTestingNotice from "./components/OpenTestingNotice";
import { MvpCard, MvpSection } from "./components/MvpSurface";
import {
  COMMUNITY_CARDS,
  DESIGN_CARDS,
  DESIGN_FUTURE_NOTE,
  HOME_ENTRY_GUIDE,
  HOME_PLATFORM_BRANCHES,
  HOME_PRODUCT_LOOP,
  LOCAL_LIFE_THEMES,
  MARKETPLACE_CARDS,
  PLATFORM_ENTRY_LINKS,
  PLATFORM_PILLARS,
  SELECT_CARDS,
} from "./data/platformNarrative";

export const metadata: Metadata = {
  title: "Yorisou | 今の状態を理解し、次の選択肢につなげる",
  description:
    "Yorisouは、今の状態を理解し、チェック、結果、レポート、おすすめ、コミュニティ、Yorisou Design、マーケット、LINE継続へつなげる日本語ファーストのプラットフォームです。",
};

export default function HomePage() {
  return (
    <main className="frontstage-page">
      <section className="frontstage-hero">
        <div className="container">
          <div className="frontstage-hero-inner md:grid-cols-[minmax(0,1fr)_20rem]">
            <MotionReveal className="frontstage-hero-copy" delay={20} distance={18}>
              <p className="service-kicker">今の状態を理解し、次の選択肢へ。</p>
              <h1 className="display-serif frontstage-hero-title max-w-[10.5em]">
                Yorisouは、
                <br className="hidden md:block" />
                今の状態を理解し、
                <br className="hidden md:block" />
                次に合う入口や
                <br className="hidden md:block" />
                レポート、おすすめへつなぐ場所です。
              </h1>
              <p className="frontstage-hero-lead max-w-[37rem]">
                チェック、結果、レポート、おすすめ、コミュニティ、Yorisou Design、マーケット、LINE継続までを、ひとつの流れで見通せるように整えています。
              </p>
              <div className="frontstage-hero-actions">
                <Link href="/open-testing" className="btn btn-primary">
                  はじめる
                </Link>
                <Link href="/tests" className="btn btn-secondary">
                  チェックを選ぶ
                </Link>
              </div>
              <div className="surface-link-row mt-4 text-[13px] font-semibold text-[#315F50]">
                <Link href="/#yorisou-design" className="hover:underline">
                  Yorisou Designを見る
                </Link>
                <Link href="/#yorisou-community" className="hover:underline">
                  コミュニティを見る
                </Link>
                <Link href="/#yorisou-market" className="hover:underline">
                  マーケットを見る
                </Link>
              </div>
              <div className="frontstage-capability-grid mt-5">
                {PLATFORM_PILLARS.map((pillar) => (
                  <div key={pillar.title} className="frontstage-capability-card">
                    <p className="frontstage-capability-title">{pillar.title}</p>
                    <p className="frontstage-capability-body">{pillar.body}</p>
                  </div>
                ))}
              </div>
            </MotionReveal>

            <MotionReveal className="surface-panel-soft self-end space-y-4" delay={110} distance={16}>
              <div>
                <p className="surface-meta">プラットフォームの見取り図</p>
                <p className="mt-2 text-[13px] leading-7 text-[#6F625C]">
                  まずはチェックから始め、結果、レポート、おすすめ、コミュニティ、Design、マーケットへと静かにつながります。
                </p>
              </div>
              <div className="frontstage-mini-stack">
                <div>
                  <p className="frontstage-mini-title">最初にすること</p>
                  <p className="frontstage-mini-body">公開テストから始めるか、チェック一覧から近い入口を選びます。</p>
                </div>
                <div>
                  <p className="frontstage-mini-title">このあと</p>
                  <p className="frontstage-mini-body">結果を読み、レポートやおすすめへ進み、必要なら声や関心を残せます。</p>
                </div>
                <div>
                  <p className="frontstage-mini-title">領域</p>
                  <p className="frontstage-mini-body">LINEは戻り道のひとつであり、Yorisou.online自体が全体の入口と見取り図です。</p>
                </div>
              </div>
            </MotionReveal>
          </div>

          <MotionReveal className="frontstage-loop-panel mt-4" delay={150} distance={16}>
            <div className="frontstage-loop-head">
              <p className="surface-meta">プラットフォームの流れ</p>
              <p className="frontstage-loop-copy">チェックだけで終わらず、結果、レポート、おすすめ、参加、将来の選択肢、LINE継続まで見渡せるようにしています。</p>
            </div>
            <div className="frontstage-loop-grid">
              {HOME_PRODUCT_LOOP.map((step, index) => (
                <div key={step.title} className="frontstage-loop-item">
                  <div className="frontstage-loop-step">{index + 1}</div>
                  <p className="frontstage-loop-title">{step.title}</p>
                  <p className="frontstage-loop-body">{step.body}</p>
                </div>
              ))}
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="container py-6 md:py-8">
        <div className="mx-auto max-w-[52rem]">
          <OpenTestingNotice
            title="いま使える核"
            body="いまは、チェック、結果、詳しいレポート、LINE保存、感想送信、おすすめの入口までを実際に試せます。コミュニティ、Yorisou Design、マーケットはコンセプトや関心の段階として育てています。"
            primaryHref="/contact?topic=open-testing"
            primaryLabel="感想や不具合を送る"
            secondaryHref="/open-testing"
            secondaryLabel="公開中の入口を見る"
          />
        </div>
      </section>

      <MvpSection
        title="この場で見える、Yorisouの入口。"
        lead="Yorisou.onlineは、ひとつの診断ページではなく、今の状態理解から次の選択肢までを並べて見渡せるプラットフォームの入口です。"
        className="!py-7 md:!py-8"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {HOME_PLATFORM_BRANCHES.map((entry) => (
            <Link
              key={entry.title}
              href={entry.href}
              className="surface-panel group space-y-3 no-underline transition hover:-translate-y-0.5"
            >
              <span className="inline-flex rounded-full bg-[#F3FAF6] px-2.5 py-1 text-[11px] font-semibold text-[#49615B]">
                {entry.status}
              </span>
              <p className="text-[15px] font-semibold leading-7 text-[#173B35]">{entry.title}</p>
              <p className="text-[13px] leading-7 text-[#6F625C]">{entry.body}</p>
              <span className="inline-flex min-h-[40px] items-center rounded-full border border-[rgba(23,59,53,0.1)] bg-[#F8F7F4] px-4 text-[12px] font-semibold text-[#315F50]">
                {entry.label}
              </span>
            </Link>
          ))}
        </div>
      </MvpSection>

      <MvpSection
        title="最初の入口をどう選ぶか。"
        lead="まず始める、近いテーマから選ぶ、次のおすすめを見る。初めての人にも選びやすい3つの始め方を先に並べています。"
        className="!py-6 md:!py-7"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[...HOME_ENTRY_GUIDE, ...PLATFORM_ENTRY_LINKS].slice(0, 6).map((entry) => (
            <Link
              key={entry.title}
              href={entry.href}
              className="surface-panel group space-y-3 no-underline transition hover:-translate-y-0.5"
            >
              <p className="text-[15px] font-semibold leading-7 text-[#173B35]">{entry.title}</p>
              <p className="text-[13px] leading-7 text-[#6F625C]">{entry.body}</p>
              <span className="inline-flex min-h-[40px] items-center rounded-full border border-[rgba(23,59,53,0.1)] bg-[#F8F7F4] px-4 text-[12px] font-semibold text-[#315F50]">
                {entry.label}
              </span>
            </Link>
          ))}
        </div>
      </MvpSection>

      <MvpSection
        title="LINEは、戻り道として使える。"
        lead="Yorisouの中心はサイト全体ですが、結果を保存し、あとで見返し、必要なときだけ続きを受け取る戻り道としてLINEも使えます。"
        className="!py-6 md:!py-7"
      >
        <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-panel space-y-4">
            <p className="surface-meta">今つながっていること</p>
            <div className="surface-list">
              <div className="text-[13px] leading-7 text-[#5F5750]">結果をLINEに保存して見返す</div>
              <div className="text-[13px] leading-7 text-[#5F5750]">必要なときだけ次の入口を受け取る</div>
              <div className="text-[13px] leading-7 text-[#5F5750]">深いレポートや関連情報へ戻る</div>
              <div className="text-[13px] leading-7 text-[#5F5750]">不要なときは通知を止める</div>
            </div>
          </div>
          <div className="surface-panel-soft space-y-3">
            <p className="surface-meta">LINEから始める</p>
            <p className="text-[13px] leading-7 text-[#6F625C]">
              LINEは、診断の代わりではなく、結果や振り返りを無理なく続けるための戻り道です。
            </p>
            <Link href="/line/mini-app" className="btn btn-secondary inline-flex">
              LINEでYorisouを開く
            </Link>
          </div>
        </div>
      </MvpSection>

      <MvpSection
        id="yorisou-report"
        title="レポートは、Yorisouの一層です。"
        lead="無料結果だけでは見えにくい傾向や、関係・仕事・選び方のリズムを、もう少し具体的に整理します。レポートは、あなたの状態を決めつけるものではなく、次の選択肢を考えるための読みものです。"
        className="!py-6 md:!py-8"
      >
        <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
          <MvpCard className="space-y-3 bg-white/94">
            <p className="text-[14px] leading-7 text-[#5F5750]">
              今の自分の流れや関係の距離、仕事や生活で整えやすいペースを、無料結果より少し深く読むための入口があります。
            </p>
            <p className="text-[14px] leading-7 text-[#5F5750]">
              いまは公開テスト中のため、全文レポートと保存導線も確認できます。
            </p>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Link href="/contact?topic=open-testing" className="btn btn-primary">
                レポート案内を受け取る
              </Link>
              <Link href="/report-preview?resultId=EM-AK&overlayId=balancing&confidence=low" className="btn btn-secondary">
                レポートの見本を見る
              </Link>
            </div>
          </MvpCard>
          <MvpCard className="space-y-3 bg-white/94">
            <p className="surface-meta">関連する入口</p>
            <div className="surface-link-row flex-col !gap-2.5">
              <Link href="/reports/self-understanding/EM-AK" className="text-[14px] font-semibold text-[#315F50] hover:underline">
                自己理解レポートの見本を見る
              </Link>
              <Link href="/result?resultId=EM-AK&overlayId=balancing&confidence=low" className="text-[14px] font-semibold text-[#315F50] hover:underline">
                結果ページの見本を見る
              </Link>
            </div>
          </MvpCard>
        </div>
      </MvpSection>

      <MvpSection
        id="yorisou-recommendations"
        title="おすすめ・リソースは、次の選択肢の層です。"
        lead="診断結果やフィードバックをもとに、今の状態に合いそうな読みもの、道具、サービス、商品候補を少しずつ提案していきます。"
        className="!py-6 md:!py-7"
      >
        <div className="grid gap-3 md:grid-cols-4">
          {SELECT_CARDS.map((item) => (
            <MvpCard key={item.title} className="space-y-2 bg-white/94">
              <span className="inline-flex rounded-full bg-[#F3FAF6] px-2.5 py-1 text-[11px] font-semibold text-[#49615B]">
                {item.status}
              </span>
              <p className="text-[14px] font-semibold leading-6 text-[#173B35]">{item.title}</p>
              <p className="text-[13px] leading-6 text-[#7A7068]">{item.body}</p>
            </MvpCard>
          ))}
        </div>
        <p className="text-[12px] leading-6 text-[#8A7E78]">
          ここではまだ、購入や申込みは行いません。いまは提案候補や関心の入口として、無理のない形で整えています。
        </p>
      </MvpSection>

      <MvpSection
        id="yorisou-design"
        title="あると助かるものを、声から育てる。"
        lead="診断やフィードバックから見えてきた「あると助かるもの」を、アイデア、試用、共創、商品化へと少しずつ育てていきます。"
        className="!py-6 md:!py-7"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {DESIGN_CARDS.map((item) => (
            <MvpCard key={item.title} className="space-y-3 bg-white/94">
              <p className="text-[14px] font-semibold leading-6 text-[#173B35]">{item.title}</p>
              <p className="text-[13px] leading-7 text-[#6F625C]">{item.body}</p>
            </MvpCard>
          ))}
        </div>
        <p className="text-[12px] leading-6 text-[#8A7E78]">{DESIGN_FUTURE_NOTE}</p>
      </MvpSection>

      <MvpSection
        id="yorisou-community"
        title="参加は任意で、声は次の改善につながる。"
        lead="気になるテーマには、フィードバック、試用、生活の観察、アイデアづくりとして参加できます。参加は任意です。あなたの声は、よりよい診断、レポート、おすすめ、サービスや商品アイデアにつながります。"
        className="!py-6 md:!py-7"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {COMMUNITY_CARDS.map((item) => (
            <MvpCard key={item.title} className="space-y-2 bg-white/94">
              <p className="text-[14px] font-semibold leading-6 text-[#173B35]">{item.title}</p>
              <p className="text-[13px] leading-6 text-[#7A7068]">{item.body}</p>
            </MvpCard>
          ))}
        </div>
      </MvpSection>

      <MvpSection
        id="yorisou-market"
        title="マーケットは、将来の選択肢やマッチングを育てる層です。"
        lead="まだ販売や注文の場所ではなく、どんな提案やつながりが役に立ちそうかを、関心ベースで整理していく準備中の領域です。"
        className="!py-6 md:!py-7"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {MARKETPLACE_CARDS.map((item) => (
            <MvpCard key={item.title} className="space-y-3 bg-white/94">
              <p className="text-[14px] font-semibold leading-6 text-[#173B35]">{item.title}</p>
              <p className="text-[13px] leading-7 text-[#6F625C]">{item.body}</p>
            </MvpCard>
          ))}
        </div>
        <p className="text-[12px] leading-6 text-[#8A7E78]">
          ここではまだ、購入、決済、在庫、配送、申込みは行いません。将来のおすすめやマッチングの可能性を整理する段階です。
        </p>
      </MvpSection>

      <MvpSection
        id="yorisou-local-life"
        title="言葉にしにくい揺れを、次の一歩のヒントに。"
        lead="生活リズム、気持ちの戻り方、人との距離、小さな行動。まだ大きな悩みになる前の揺れも、Yorisouでは今の関心を整理する入口として受け止めます。"
        className="!py-6 md:!pb-14"
      >
        <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
          <MvpCard className="space-y-3 bg-white/94">
            <p className="surface-meta">関心を寄せているテーマ</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {LOCAL_LIFE_THEMES.map((theme) => (
                <div
                  key={theme}
                  className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] px-4 py-3 text-[13px] leading-6 text-[#2F2A28]"
                >
                  {theme}
                </div>
              ))}
            </div>
          </MvpCard>
          <MvpCard className="space-y-3 bg-white/94">
            <p className="text-[14px] leading-7 text-[#5F5750]">
              いまは、暮らしを直接引き受けるサービスではなく、今の関心や戻り方を整理する入口として扱っています。受け取った声は、次の案内や小さな改善につなげる材料として慎重に見ています。
            </p>
            <Link href="/contact?topic=open-testing" className="btn btn-secondary">
              感想や関心を送る
            </Link>
          </MvpCard>
        </div>
      </MvpSection>
    </main>
  );
}
