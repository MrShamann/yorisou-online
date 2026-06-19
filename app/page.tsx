import type { Metadata } from "next";
import Link from "next/link";

import MotionReveal from "./components/MotionReveal";
import { MvpActionLink, MvpCard, MvpSection } from "./components/MvpSurface";
import { PRODUCT_CARDS, type ProductCard } from "./data/productCards";

export const metadata: Metadata = {
  title: "Yorisou | 24問のクイックチェック",
  description:
    "24問のクイックチェックで今の状態を軽く見て、無料結果と正式版の案内を受け取れる Yorisou のページです。",
};

const aboveFoldPills = ["24問", "3分ほど", "無料結果", "診断ではありません"] as const;

const valuePoints = [
  {
    title: "今の状態に近いタイプ",
    body: "いまの選び方に近い流れを短く受け取れます。",
  },
  {
    title: "整えやすい方向",
    body: "無理なく戻りやすいヒントを確認できます。",
  },
  {
    title: "次に見るとよさそうなもの",
    body: "必要なら、正式版や次のチェックへ進めます。",
  },
] as const;

const steps = [
  {
    step: "1",
    title: "24問に答える",
    body: "今の感覚に近いものを、ひとつずつ選んで進めます。",
  },
  {
    step: "2",
    title: "無料結果を見る",
    body: "今の状態に近いモードと、短い認識の一行を受け取ります。",
  },
  {
    step: "3",
    title: "必要なら先へ進む",
    body: "詳しいレポートや次にほしいヒントは、結果のあとで選べます。",
  },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_42%,_#F3FAF6_100%)] text-[#2F2A28]">
      <section className="border-b border-[rgba(23,59,53,0.1)] bg-[radial-gradient(circle_at_14%_0%,_rgba(217,130,86,0.13),_transparent_31%),radial-gradient(circle_at_88%_7%,_rgba(223,238,235,0.82),_transparent_36%),linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_62%,_#F3FAF6_100%)]">
        <div className="container pb-5 pt-4 md:py-16">
          <MotionReveal
            className="mx-auto max-w-[42rem] space-y-4 rounded-[1.55rem] border border-white/75 bg-white/66 p-4 shadow-[0_22px_48px_rgba(23,59,53,0.08)] backdrop-blur md:bg-transparent md:p-0 md:text-center md:shadow-none"
            delay={20}
            distance={18}
          >
            <div className="flex flex-wrap gap-1.5 md:justify-center md:gap-2">
              {aboveFoldPills.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex rounded-full border border-[rgba(217,130,86,0.18)] bg-white/84 px-3 py-1.5 text-[12px] font-semibold leading-5 text-[#5F5750] shadow-[0_8px_18px_rgba(23,59,53,0.04)]"
                >
                  {pill}
                </span>
              ))}
            </div>
            <div className="space-y-3">
              <p className="service-kicker">今の状態チェック</p>
              <h1 className="display-serif max-w-[11em] text-[2.05rem] leading-[1.14] text-[#2F2A28] md:mx-auto md:text-[3.5rem]">
                今のあなたは、
                <span className="block text-[#173B35]">どんな整え方が合いやすい？</span>
              </h1>
              <p className="max-w-[36rem] text-[15px] font-medium leading-7 text-[#5F5750] md:mx-auto md:text-[17px] md:leading-8">
                いくつかの質問に答えると、今の状態に近いタイプと、次に見るとよさそうなヒントが見えてきます。
              </p>
            </div>
            <div className="rounded-[1.15rem] border border-[rgba(217,130,86,0.18)] bg-[#FFF7EC]/82 px-4 py-3 text-[13px] font-semibold leading-6 text-[#6B4E3F] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] md:mx-auto md:max-w-[28rem]">
              24問だけ。無料結果で、いまの選び方に近い流れを短く確認できます。
            </div>
            <div className="space-y-2.5 pt-1">
              <div className="flex flex-col justify-center gap-2.5 sm:flex-row">
                <MvpActionLink
                  href="/check-in"
                  label="3分でチェックを始める"
                  className="min-h-[60px] rounded-full !border-[#173B35] !bg-[#173B35] px-6 text-[16px] !text-white shadow-[0_18px_34px_rgba(23,59,53,0.26)] hover:!bg-[#0F2F2B]"
                />
                <MvpActionLink
                  href="/formal-check"
                  label="正式版の案内を見る"
                  tone="ghost"
                  className="min-h-[44px] rounded-full !border-transparent bg-transparent px-2 text-[13px] !text-[#49615B] shadow-none hover:bg-transparent"
                />
              </div>
              <p className="text-[12px] leading-6 text-[#6F625C] md:leading-7">
                ログインなしで始められます。最初に見えるのは無料結果です。診断ではありません。
              </p>
            </div>
          </MotionReveal>
        </div>
      </section>

      <MvpSection
        eyebrow="無料結果"
        title="チェック後に見えるもの"
        lead="長い説明ではなく、答えたあとに受け取れることだけを先に見えるようにしています。"
        className="!py-8 md:!py-12"
      >
        <div className="grid gap-2.5 md:grid-cols-3">
          {valuePoints.map((item, index) => (
            <MvpCard
              key={item.title}
              className="flex gap-3 rounded-[1.15rem] border-[rgba(23,59,53,0.1)] bg-white/94 p-4 shadow-[0_14px_32px_rgba(23,59,53,0.07)] md:block md:space-y-2.5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF1E4] text-[13px] font-semibold text-[#B9673F] md:mb-3">
                {index + 1}
              </div>
              <div className="space-y-1">
                <h2 className="text-[15px] font-semibold leading-6 text-[#173B35]">{item.title}</h2>
                <p className="text-[13px] leading-6 text-[#5F5750] md:text-[14px] md:leading-7">{item.body}</p>
              </div>
            </MvpCard>
          ))}
        </div>
      </MvpSection>

      <MvpSection
        eyebrow="流れ"
        title="進み方は、3つだけです。"
        lead="答えて、無料結果を見て、そのあとで必要なら正式版の案内を見られます。"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((item) => (
            <MvpCard key={item.step} className="space-y-3 rounded-[1.25rem] border-[rgba(23,59,53,0.1)] bg-white/92 shadow-[0_18px_40px_rgba(23,59,53,0.07)]">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FDE8DD] text-[14px] font-semibold text-[#D95F4E]">
                {item.step}
              </div>
              <div className="space-y-2">
                <h2 className="display-serif text-[1.35rem] leading-[1.35]">{item.title}</h2>
                <p className="text-[15px] leading-8 text-[var(--muted)]">{item.body}</p>
              </div>
            </MvpCard>
          ))}
        </div>
      </MvpSection>

      <MvpSection
        eyebrow="見返し方"
        title="一度見て終わりではなく、あとで見返したり、またチェックしたりできます。"
        lead="今のリズムの変化に気づきたいときに、また戻ってこられる入口として使えます。正式版の準備も進めています。"
      >
        <MvpCard className="space-y-4">
          <div className="grid gap-2 text-[14px] leading-7 text-[var(--text)] md:grid-cols-3">
            <div className="rounded-[1rem] border border-[color:var(--line-soft)] bg-white/80 px-4 py-3">
              あとで見返す
            </div>
            <div className="rounded-[1rem] border border-[color:var(--line-soft)] bg-white/80 px-4 py-3">
              またチェックインする
            </div>
            <div className="rounded-[1rem] border border-[color:var(--line-soft)] bg-white/80 px-4 py-3">
              必要なときにヒントを受け取る
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <MvpActionLink href="/check-in" label="3分でチェックを始める" className="rounded-full !border-[#173B35] !bg-[#173B35] !text-white shadow-[0_18px_34px_rgba(23,59,53,0.22)]" />
            <MvpActionLink href="/formal-check" label="正式版の案内を見る" tone="ghost" className="rounded-full !border-transparent bg-transparent !text-[#49615B] shadow-none" />
          </div>
        </MvpCard>
      </MvpSection>

      {/* ── Phase 2R: product shell sections ── */}
      <ProductShellSection cards={PRODUCT_CARDS} />
      <LineContinuationSection />
      <ReportPreviewSection />
    </main>
  );
}

/* ────────────────────────────────────────────
   Product shell — static, no backend
   ──────────────────────────────────────────── */

function ProductShellSection({ cards }: { cards: readonly ProductCard[] }) {
  return (
    <MvpSection
      eyebrow="整理したいこと"
      title="いま、何を整理したいですか？"
      lead="ひとつだけ選んで大丈夫です。まずは今の自分を広く見ることも、人間関係の疲れから見ることもできます。"
    >
      <p className="-mt-2 text-[13px] leading-6 text-[#7A7068]">
        結果は公開しても安心な内容と、自分だけで読む内容を分けて扱います。
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <ProductCardItem key={card.id} card={card} />
        ))}
      </div>
    </MvpSection>
  );
}

function ProductCardItem({ card }: { card: ProductCard }) {
  const isActive = card.status === "primary";
  const isComingSoon = card.status === "ready_for_review";
  const isHeld = !isActive && !isComingSoon;

  const cardClasses = `flex flex-col gap-3 rounded-[1.45rem] border bg-white/90 p-5 shadow-[0_12px_28px_rgba(23,59,53,0.06)] transition ${
    isActive
      ? "border-[rgba(23,59,53,0.2)] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(23,59,53,0.1)]"
      : isComingSoon
        ? "border-[rgba(23,59,53,0.12)]"
        : "border-[rgba(23,59,53,0.07)] opacity-70"
  }`;

  return (
    <div className={cardClasses}>
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
        <h3 className="display-serif text-[1.2rem] leading-[1.4] text-[#2F2A28]">{card.title_ja}</h3>
        <p className="text-[13px] leading-6 text-[#5F5750]">{card.subtitle_ja}</p>
      </div>

      <p className="text-[11px] leading-5 text-[#8A7E78]">{card.public_boundary_note}</p>

      {isActive && card.route_placeholder ? (
        <Link
          href={card.route_placeholder}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-4 text-[13px] font-semibold text-white shadow-[0_14px_24px_rgba(23,59,53,0.2)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B]"
        >
          {card.primary_cta}
        </Link>
      ) : isComingSoon ? (
        <span className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.18)] bg-[#F3FAF6] px-4 text-[13px] font-semibold text-[#49615B]">
          近日公開
        </span>
      ) : (
        <span className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.1)] bg-[#F8F7F4] px-4 text-[13px] font-semibold text-[#9A918B]">
          準備中
        </span>
      )}
    </div>
  );
}

function LineContinuationSection() {
  return (
    <MvpSection
      eyebrow="続き方"
      title="あとから、また戻ってこられるように。"
      lead="一度のチェックで、今の状態をすべて決める必要はありません。結果を見返したり、時間を置いてもう一度ふり返ったりしやすい導線を整えていきます。"
    >
      <MvpCard className="space-y-4">
        <div className="grid gap-2 text-[14px] leading-7 text-[#2F2A28] sm:grid-cols-3">
          {(["あとで見返す", "またチェックインする", "今は保存だけする"] as const).map((t) => (
            <div key={t} className="rounded-[1rem] border border-[rgba(23,59,53,0.1)] bg-white/80 px-4 py-3 text-[13px] text-[#5F5750]">
              {t}
            </div>
          ))}
        </div>
        <p className="text-[12px] leading-6 text-[#7A7068]">
          LINEでの保存・通知・見返しには、それぞれ確認と同意が必要です。
        </p>
        <MvpActionLink
          href="/line/mini-app"
          label="LINEで続きやすくする"
          tone="secondary"
          className="rounded-full"
        />
      </MvpCard>
    </MvpSection>
  );
}

function ReportPreviewSection() {
  const reportCards = [
    {
      badge: "自分理解",
      title: "今の自分を深く読む",
      body: "今の状態の流れ、回復のリズム、人との距離をもう少し細かく整理します。",
      cta: "読めることを見る",
    },
    {
      badge: "関係の疲れ",
      title: "人間関係の疲れを深く読む",
      body: "返信・予定・気づかいの負担を分けて、回復しやすい距離を見つけます。",
      cta: "プレビューを見る",
    },
    {
      badge: "距離感",
      title: "恋愛の距離感を深く読む",
      body: "待ち方、近づき方、伝える前に整えたいことを、自分側から整理します。",
      cta: "プレビューを見る",
    },
  ] as const;

  return (
    <>
      <MvpSection
        eyebrow="必要なら、もう少し深く。"
        title="無料結果だけで終えても大丈夫です。"
        lead="もっと整理したいときは、自分だけで読めるレポートや、近い感覚の声を見ることができます。"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {reportCards.map((card) => (
            <MvpCard key={card.title} className="flex flex-col gap-3 rounded-[1.35rem] border-[rgba(23,59,53,0.1)] bg-white/92 shadow-[0_12px_28px_rgba(23,59,53,0.06)]">
              <span className="inline-flex self-start rounded-full bg-[#F3FAF6] px-2.5 py-1 text-[11px] font-semibold text-[#3D6058]">
                {card.badge}
              </span>
              <div className="flex-1 space-y-1.5">
                <h3 className="text-[14px] font-semibold leading-6 text-[#2F2A28]">{card.title}</h3>
                <p className="text-[13px] leading-6 text-[#5F5750]">{card.body}</p>
              </div>
              <span className="inline-flex items-center justify-center rounded-full border border-[rgba(23,59,53,0.16)] bg-[#F8F7F4] px-4 py-2 text-[13px] font-semibold text-[#7A7068]">
                {card.cta}（準備中）
              </span>
            </MvpCard>
          ))}
        </div>
        <p className="text-[12px] leading-6 text-[#7A7068]">
          レポートは医療的・専門的判断ではありません。購入や申込みではありません。興味の確認だけです。
        </p>
      </MvpSection>

      <MvpSection
        eyebrow="同じような人の声"
        title="今の状態に近い声を見るだけでも大丈夫です。"
        lead="ここは公開投稿の場所ではありません。参加したり、何かを書いたりする必要はありません。"
      >
        <MvpCard className="space-y-4">
          <div className="space-y-2.5">
            {([
              "返すことや合わせることが重い日がある。そう気づくだけで、少し楽になることがある。",
              "待つ時間に気持ちが揺れる。それは自分が弱いのではなく、今の状態が正直に出ているだけかもしれない。",
              "今月の小さな問い: 今、少し軽くしたいものは何ですか？返信、予定、距離、休む時間。ひとつだけで大丈夫です。",
            ] as const).map((v, i) => (
              <div key={i} className="rounded-[1rem] border border-[rgba(23,59,53,0.09)] bg-[#F3FAF6] px-4 py-3">
                <p className="text-[14px] leading-7 text-[#2F2A28]">「{v}」</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] leading-5 text-[#9A918B]">
            表示される声は編集されたサンプルです。個人の投稿ではありません。
          </p>
        </MvpCard>
      </MvpSection>
    </>
  );
}
