import type { Metadata } from "next";
import Link from "next/link";

import MotionReveal from "./components/MotionReveal";
import { MvpCard, MvpSection } from "./components/MvpSurface";
import { PRODUCT_CARDS, type ProductCard } from "./data/productCards";

export const metadata: Metadata = {
  title: "Yorisou | 今の状態チェック",
  description:
    "今の自分、人間関係の疲れ、恋愛の距離感。気になるテーマをひとつ選んで、無料結果だけ確認できます。ログインなし。",
};

const RESULT_PREVIEWS = [
  { label: "今の状態に近いタイプ", note: "公開しても安心な言葉で表示" },
  { label: "整えやすい方向のヒント", note: "小さな次の一歩を提案" },
  { label: "必要なら深く読むレポート", note: "無料結果のあとに選べます" },
] as const;

export default function HomePage() {
  const activeCards = PRODUCT_CARDS.filter((c) => c.status === "primary");
  const futureCards = PRODUCT_CARDS.filter((c) => c.status !== "primary");

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_42%,_#F3FAF6_100%)] text-[#2F2A28]">

      {/* ── Hero ── */}
      <section className="border-b border-[rgba(23,59,53,0.08)] bg-[radial-gradient(circle_at_14%_0%,_rgba(217,130,86,0.11),_transparent_30%),radial-gradient(circle_at_88%_7%,_rgba(223,238,235,0.75),_transparent_34%),linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_60%,_#F3FAF6_100%)]">
        <div className="container pb-6 pt-5 md:pb-10 md:pt-12">
          <MotionReveal
            className="mx-auto max-w-[42rem] space-y-3 md:text-center"
            delay={20}
            distance={18}
          >
            <p className="service-kicker">Yorisou</p>
            <h1 className="display-serif text-[1.9rem] leading-[1.18] text-[#2F2A28] md:text-[3.1rem]">
              今、気になっていることを<br className="hidden md:block" />
              <span className="text-[#173B35]">ひとつだけ選んで整理する。</span>
            </h1>
            <p className="max-w-[34rem] text-[15px] leading-7 text-[#5F5750] md:mx-auto">
              ログインなし。答えたあとに無料結果だけ確認できます。医療・心理的な判定ではありません。
            </p>
          </MotionReveal>
        </div>
      </section>

      {/* ── 3-choice entry selector ── */}
      <section className="container py-8 md:py-12">
        <div className="mx-auto max-w-[52rem] space-y-5">
          <div className="space-y-1 md:text-center">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#49615B]">今日、整理したいことを選んでください</p>
            <p className="text-[13px] leading-6 text-[#7A7068]">
              ひとつだけで大丈夫です。すべて答える必要はありません。
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {activeCards.map((card) => (
              <ActiveChoiceCard key={card.id} card={card} />
            ))}
          </div>

          <p className="text-[12px] leading-6 text-[#8A7E78] md:text-center">
            結果は無料で表示されます。回答は送信されません。
          </p>
        </div>
      </section>

      {/* ── What you get ── */}
      <MvpSection
        eyebrow="無料結果で見えること"
        title="チェックを終えると見えるもの。"
        lead="長い説明より、答えたあとに受け取れることを先にお伝えします。"
        className="!py-8 md:!py-10"
      >
        <div className="grid gap-2.5 md:grid-cols-3">
          {RESULT_PREVIEWS.map((item, i) => (
            <MvpCard
              key={item.label}
              className="flex gap-3 rounded-[1.15rem] border-[rgba(23,59,53,0.1)] bg-white/94 p-4 shadow-[0_12px_26px_rgba(23,59,53,0.06)] md:block md:space-y-2"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3FAF6] text-[13px] font-semibold text-[#49615B] md:mb-2.5">
                {i + 1}
              </div>
              <div className="space-y-0.5">
                <p className="text-[14px] font-semibold leading-6 text-[#173B35]">{item.label}</p>
                <p className="text-[12px] leading-5 text-[#7A7068]">{item.note}</p>
              </div>
            </MvpCard>
          ))}
        </div>
      </MvpSection>

      {/* ── Future / coming soon ── */}
      {futureCards.length > 0 && (
        <MvpSection
          eyebrow="今後のチェック"
          title="準備中のテーマ。"
          lead="今後追加していく予定のチェックです。今は上の3つをご利用ください。"
          className="!py-6 md:!py-8"
        >
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {futureCards.map((card) => (
              <FutureCard key={card.id} card={card} />
            ))}
          </div>
        </MvpSection>
      )}

      {/* ── Continuation ── */}
      <MvpSection
        eyebrow="あとで見返す"
        title="一度で終わりにしなくていい。"
        lead="チェックの結果は、時間を置いてもう一度見直すと、少し違って見えることがあります。LINEで保存して続きやすくする導線を整えています。"
        className="!py-8"
      >
        <MvpCard className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-3 text-[13px] text-[#5F5750]">
            {(["今日の結果を保存する", "あとで見返す", "また気になったときに戻る"] as const).map((t) => (
              <div key={t} className="rounded-[1rem] border border-[rgba(23,59,53,0.1)] bg-white/80 px-4 py-3">
                {t}
              </div>
            ))}
          </div>
          <p className="text-[12px] leading-6 text-[#7A7068]">
            LINEでの保存・通知・見返しには、それぞれ確認と同意が必要です。現在準備中です。
          </p>
          <Link
            href="/line/mini-app"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.22)] bg-white px-5 text-[14px] font-semibold text-[#173B35] transition hover:-translate-y-0.5 hover:bg-[#F3FAF6]"
          >
            LINEで続きやすくする
          </Link>
        </MvpCard>
      </MvpSection>

      {/* ── Report preview ── */}
      <MvpSection
        eyebrow="必要なら、もう少し深く"
        title="無料結果だけで終えても大丈夫です。"
        lead="もっと整理したいときに自分だけで読めるレポートを準備しています。急いで読む必要はありません。"
        className="!py-8"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {REPORT_CARDS.map((card) => (
            <MvpCard key={card.title} className="flex flex-col gap-3 rounded-[1.35rem] border-[rgba(23,59,53,0.1)] bg-white/90 shadow-[0_10px_24px_rgba(23,59,53,0.06)]">
              <span className="inline-flex self-start rounded-full bg-[#F3FAF6] px-2.5 py-1 text-[11px] font-semibold text-[#3D6058]">
                {card.badge}
              </span>
              <div className="flex-1 space-y-1">
                <p className="text-[13px] font-semibold leading-6 text-[#2F2A28]">{card.title}</p>
                <p className="text-[12px] leading-5 text-[#7A7068]">{card.body}</p>
              </div>
              <span className="inline-flex items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-[#F8F7F4] px-4 py-2 text-[12px] font-semibold text-[#8A8078]">
                準備中
              </span>
            </MvpCard>
          ))}
        </div>
        <p className="text-[12px] leading-5 text-[#9A918B]">
          レポートは医療的・専門的判断ではありません。購入や申込みではありません。
        </p>
      </MvpSection>

      {/* ── Community preview ── */}
      <MvpSection
        eyebrow="同じような人の声"
        title="見るだけでも大丈夫です。"
        lead="ここは投稿や相談の場所ではありません。近い状態のサンプルを見ることができます。"
        className="!py-8 md:!pb-14"
      >
        <MvpCard className="space-y-4">
          <div className="space-y-2">
            {COMMUNITY_SAMPLES.map((v, i) => (
              <div key={i} className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] px-4 py-3">
                <p className="text-[13px] leading-7 text-[#2F2A28]">「{v}」</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] leading-5 text-[#9A918B]">
            表示される声は編集されたサンプルです。個人の投稿ではありません。
          </p>
        </MvpCard>
      </MvpSection>

    </main>
  );
}

/* ─── Active choice card ─── */

function ActiveChoiceCard({ card }: { card: ProductCard }) {
  return (
    <Link
      href={card.route_placeholder!}
      className="group flex flex-col gap-3 rounded-[1.55rem] border border-[rgba(23,59,53,0.18)] bg-white/96 p-5 shadow-[0_14px_32px_rgba(23,59,53,0.08)] transition hover:-translate-y-0.5 hover:border-[#173B35] hover:shadow-[0_20px_40px_rgba(23,59,53,0.12)]"
    >
      <div className="flex flex-wrap gap-1.5">
        {card.badges.map((badge) => (
          <span
            key={badge}
            className="inline-flex rounded-full bg-[#F3FAF6] px-2.5 py-1 text-[11px] font-semibold leading-4 text-[#3D6058]"
          >
            {badge}
          </span>
        ))}
      </div>

      <div className="flex-1 space-y-1.5">
        <h2 className="display-serif text-[1.25rem] leading-[1.38] text-[#2F2A28]">{card.title_ja}</h2>
        <p className="text-[13px] leading-6 text-[#5F5750]">{card.subtitle_ja}</p>
      </div>

      <p className="text-[11px] leading-5 text-[#9A918B]">{card.public_boundary_note}</p>

      <div className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#173B35] px-4 text-[13px] font-bold text-white shadow-[0_12px_24px_rgba(23,59,53,0.18)] transition group-hover:bg-[#0F2F2B]">
        {card.primary_cta}
      </div>
    </Link>
  );
}

/* ─── Future / coming-soon card ─── */

function FutureCard({ card }: { card: ProductCard }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-[1.35rem] border border-[rgba(23,59,53,0.07)] bg-white/70 p-4 opacity-65">
      <div className="flex-1 space-y-1">
        <h3 className="text-[14px] font-semibold leading-6 text-[#5F5750]">{card.title_ja}</h3>
        <p className="text-[12px] leading-5 text-[#8A7E78]">{card.subtitle_ja}</p>
      </div>
      <span className="inline-flex self-start rounded-full border border-[rgba(23,59,53,0.1)] bg-[#F8F7F4] px-3 py-1 text-[11px] font-semibold text-[#9A918B]">
        準備中
      </span>
    </div>
  );
}

/* ─── Static data ─── */

const REPORT_CARDS = [
  {
    badge: "自分理解",
    title: "今の自分を深く読む",
    body: "今の状態の流れ、回復のリズム、人との距離感を整理します。",
  },
  {
    badge: "関係の疲れ",
    title: "人間関係の疲れを深く読む",
    body: "返信・予定・気づかいの負担を分けて回復しやすい距離を見つけます。",
  },
  {
    badge: "距離感",
    title: "恋愛の距離感を深く読む",
    body: "待ち方・近づき方・伝える前に整えたいことを自分側から整理します。",
  },
] as const;

const COMMUNITY_SAMPLES = [
  "返すことや合わせることが重い日がある。そう気づくだけで、少し楽になることがある。",
  "待つ時間に気持ちが揺れる。それは自分が弱いのではなく、今の状態が出ているだけかもしれない。",
  "今月の小さな問い: 少し軽くしたいものは何ですか？返信、予定、距離、休む時間。ひとつだけで大丈夫です。",
] as const;
