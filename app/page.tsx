import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import MotionReveal from "./components/MotionReveal";
import InsightsPreview from "./components/InsightsPreview";

const concerns = [
  "5問・1〜2分で終わる",
  "小さな結果が返る",
  "低圧で、そのまま始められる",
];

export const metadata: Metadata = {
  title: "今日の寄り添い方チェック | Yorisou",
  description:
    "5問・1〜2分で、いまの寄り添い方を軽く確かめる入口です。小さな結果を受け取って、必要なときは従来の相談にも進めます。",
};

const journeySteps = [
  {
    label: "1. 相談の入口",
    title: "予約前の不安を、家族の状況として受け取ります。",
    problem: "外出や送迎の困りごとを、そのまま話せます。",
    action: "ひなたが整理すること",
    detail: "本人、家族、移動条件を短く整理します。",
    outcome: "次に進む先が見えます。",
  },
  {
    label: "2. 家族で共有",
    title: "確認したいことを、あとで見直しやすくまとめます。",
    problem: "予約の前に、家族でそろえておきたい確認が残りやすい領域です。",
    action: "ひなたが返すこと",
    detail: "電話、LINE、アプリのどこから入っても、家族の確認に戻せます。",
    outcome: "説明のやり直しが減ります。",
  },
  {
    label: "3. 必要な先へ",
    title: "必要な入口へ静かにつなぎます。",
    problem: "家庭向けの相談と、導入・実証の相談は、最初に分けるほうが落ち着きます。",
    action: "ひなたが案内すること",
    detail: "家族向け相談と、運営側の小さな導入相談を分けて案内します。",
    outcome: "今の段階に合う次の一歩だけが残ります。",
  },
];

const entryLanes = [
  {
    title: "家族・利用者の相談",
    text: "予約前の不安や確認事項を、家族目線で整理できます。",
    href: "/reservation-mobility-support",
    cta: "相談ページへ",
  },
  {
    title: "導入・実証の相談",
    text: "自治体、施設、事業者の小さなパイロット相談につながります。",
    href: "/reservation-mobility-support#pilot-inquiry",
    cta: "導入相談へ",
  },
];

const platformPillars = [
  {
    title: "5問だけ",
    text: "短い選択肢に答えるだけで進めます。",
  },
  {
    title: "小さな結果",
    text: "今の寄り添い方に合う一言結果が返ります。",
  },
  {
    title: "必要なときは相談",
    text: "従来の相談入口も、必要な人だけに残します。",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="section-wash border-b border-[color:var(--line-soft)] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_rgba(247,244,238,0.99)_60%)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:px-10 md:py-16 lg:grid-cols-[1.18fr_0.82fr] lg:items-center lg:gap-12">
          <MotionReveal className="order-2 lg:order-1" delay={40} distance={28}>
            <div className="service-kicker">今日の軽い入口</div>
            <h1 className="display-serif mt-5 max-w-[9.6em] text-[2.18rem] leading-[1.24] md:text-[3.02rem] lg:text-[3.36rem]">
              <span className="block md:whitespace-nowrap">5問・1〜2分で、</span>
              <span className="block text-[#79685f] md:whitespace-nowrap">いまの寄り添い方を軽く整える。</span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-base leading-9 text-[var(--muted)] md:text-lg">
              Yorisouは、短いチェックから始める寄り添いの入口です。5問だけ答えると、小さな結果と次の一歩が返ります。
            </p>
            <p className="mt-4 max-w-[33rem] text-sm leading-8 text-[var(--muted)] md:text-base">
              長い説明はいりません。低圧で始められて、必要な人だけが次へ進めます。
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/check-in" className="btn btn-primary">
                今日の寄り添い方チェックへ
              </Link>
              <Link href="/reservation-mobility-support" className="btn btn-secondary">
                従来の相談を見る
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-sm text-[var(--muted)]">
              {concerns.map((item) => (
                <span key={item} className="rounded-full border border-[color:var(--line-soft)] bg-[rgba(255,255,255,0.72)] px-3 py-1.5">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm">
              <Link href="/reservation-mobility-support" className="soft-link">
                予約型移動相談
              </Link>
              <Link href="/pilot" className="soft-link">
                導入・実証
              </Link>
            </div>
          </MotionReveal>

          <MotionReveal className="order-1 lg:order-2" delay={160} distance={22} scale={0.99}>
            <div className="hero-portrait-frame mx-auto max-w-[21rem] overflow-hidden rounded-[2rem] border border-[color:var(--line-soft)] bg-[var(--surface)] p-2 shadow-[0_14px_28px_rgba(47,35,33,0.05)] lg:mr-8">
              <div className="overflow-hidden rounded-[1.7rem] bg-[var(--surface-soft-strong)]">
                <Image
                  src="/images/hinata-portrait.png"
                  alt="AI相談員 ひなた"
                  width={1200}
                  height={1500}
                  priority
                  className="h-auto w-full object-cover object-top"
                />
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="section-wash border-b border-[color:var(--line-soft)] bg-[rgba(255,255,255,0.52)] px-6 py-10 md:px-10 md:py-12">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.94fr_1.06fr] lg:items-stretch">
          <MotionReveal delay={40} distance={18}>
            <article className="motion-card rounded-[1.8rem] border border-[color:var(--line-soft)] bg-[var(--surface)] px-6 py-6 shadow-[0_10px_24px_rgba(47,35,33,0.04)]">
              <div className="service-kicker">今日のチェックについて</div>
              <h2 className="display-serif mt-4 max-w-[14em] text-[1.66rem] leading-[1.62] md:text-[2rem]">
                5問・1〜2分で、軽く確かめる入口です。
              </h2>
              <p className="mt-4 page-copy">小さな結果と次の一歩だけを返すので、重い相談に入る前の入口として使えます。</p>
              <div className="mt-6 grid gap-3">
                {platformPillars.map((pillar, index) => (
                  <MotionReveal key={pillar.title} delay={100 + index * 60} distance={16}>
                    <div className="platform-pill rounded-[1.2rem] border border-[color:var(--line-soft)] bg-[rgba(247,244,238,0.88)] px-4 py-4">
                      <div className="platform-pill-title">{pillar.title}</div>
                      <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{pillar.text}</p>
                    </div>
                  </MotionReveal>
                ))}
              </div>
            </article>
          </MotionReveal>

          <MotionReveal delay={120} distance={20} scale={0.99}>
            <article className="motion-card rounded-[1.8rem] border border-[color:var(--line-sage)] px-6 py-6">
              <div className="service-kicker text-[var(--accent-sage-text)]">チェックで返るもの</div>
              <h2 className="display-serif mt-4 max-w-[13em] text-[1.58rem] leading-[1.62] md:text-[1.92rem]">
                ご本人もご家族も、今の状態に合う小さな一歩を見つけやすくなります。
              </h2>
              <p className="mt-4 page-copy text-[var(--accent-sage-text)]">5問で返るのは、長い解説ではなく、気持ちを軽くする短い結果です。</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.25rem] bg-[rgba(255,255,255,0.6)] px-4 py-4">
                  <div className="text-xs tracking-[0.18em] text-[var(--accent-sage-text)]">5問だけ</div>
                  <p className="mt-2 text-sm leading-7 text-[var(--accent-sage-text)]">短い選択肢で、気負わずに進めます。</p>
                </div>
                <div className="rounded-[1.25rem] bg-[rgba(255,255,255,0.6)] px-4 py-4">
                  <div className="text-xs tracking-[0.18em] text-[var(--accent-sage-text)]">小さな結果</div>
                  <p className="mt-2 text-sm leading-7 text-[var(--accent-sage-text)]">今の寄り添い方に合う一言結果が返ります。</p>
                </div>
                <div className="rounded-[1.25rem] bg-[rgba(255,255,255,0.6)] px-4 py-4">
                  <div className="text-xs tracking-[0.18em] text-[var(--accent-sage-text)]">次の一歩</div>
                  <p className="mt-2 text-sm leading-7 text-[var(--accent-sage-text)]">必要な人だけが、次の相談に進めます。</p>
                </div>
              </div>
            </article>
          </MotionReveal>
        </div>
      </section>

      <InsightsPreview locale="ja" />

      <section className="section-wash border-b border-[color:var(--line-soft)] bg-[var(--surface-soft)] px-6 py-12 md:px-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <MotionReveal className="max-w-[40rem]" delay={30}>
            <div className="service-kicker">従来の相談の流れ</div>
            <h2 className="display-serif mt-4 max-w-[13.5em] text-[1.76rem] leading-[1.62] md:text-[2.16rem]">
              <span className="block md:whitespace-nowrap">必要なときだけ、</span>
              <span className="block md:whitespace-nowrap">従来の相談入口も使えます。</span>
            </h2>
            <p className="mt-4 page-copy">ここは残しつつ、主役ではなく従来の入口として見せます。</p>
          </MotionReveal>
          <div className="mt-8 space-y-4">
            {journeySteps.map((step, index) => (
              <MotionReveal key={step.label} delay={80 + index * 65} distance={20}>
                <article className="journey-step motion-card rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.82)] px-6 py-6">
                  <div className="journey-grid">
                    <div>
                      <div className="service-kicker text-[var(--accent-sage-text)]">{step.label}</div>
                      <h3 className="display-serif mt-3 text-[1.34rem] leading-[1.62] text-[var(--text)] md:text-[1.56rem]">
                        {step.title}
                      </h3>
                    </div>
                    <div className="journey-copy">
                      <div className="journey-block">
                        <div className="journey-block-label">いま起きがちなこと</div>
                        <p>{step.problem}</p>
                      </div>
                      <div className="journey-block">
                        <div className="journey-block-label">{step.action}</div>
                        <p>{step.detail}</p>
                      </div>
                      <div className="journey-block journey-outcome">
                        <div className="journey-block-label">つぎに見えること</div>
                        <p>{step.outcome}</p>
                      </div>
                    </div>
                  </div>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wash border-b border-[color:var(--line-soft)] bg-[rgba(255,255,255,0.46)] px-6 py-12 md:px-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <MotionReveal className="max-w-[42rem]" delay={30}>
              <div className="service-kicker">必要なときの従来の入口</div>
              <h2 className="display-serif mt-4 max-w-[15em] text-[1.72rem] leading-[1.6] md:text-[2.08rem]">
                従来の相談や導入相談は、下の入口にまとめています。
              </h2>
              <p className="mt-4 page-copy">新しい入口を主役にしつつ、必要な人には従来の相談先も残します。</p>
          </MotionReveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {entryLanes.map((item, index) => (
              <MotionReveal key={item.title} delay={90 + index * 75} distance={18}>
                <article
                key={item.title}
                className="motion-card lane-card rounded-[1.6rem] border border-[color:var(--line-soft)] bg-[var(--surface)] px-5 py-5 shadow-[0_10px_24px_rgba(47,35,33,0.04)]"
              >
                <h3 className="text-base font-medium text-[var(--text)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.text}</p>
                <div className="mt-4">
                  <Link href={item.href} className="soft-link">
                    {item.cta}
                  </Link>
                </div>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wash bg-[rgba(255,255,255,0.22)] px-6 py-10 md:px-10 md:py-12">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.06fr_0.94fr]">
          <MotionReveal delay={30}>
            <div className="motion-card rounded-[1.8rem] border border-[color:var(--line-soft)] bg-[var(--surface)] px-6 py-6">
            <div className="service-kicker">必要な人だけが続きへ</div>
            <h2 className="display-serif mt-4 max-w-[14.5em] text-[1.7rem] leading-[1.64] md:text-[2.04rem]">
              まずは軽いチェックから始めて、必要な人だけが次の入口へ進めます。
            </h2>
            <div className="mt-5 page-copy">
              <p>すぐに重い相談へ進む必要はありません。短いチェックのあとに、必要な人だけが従来の相談や導入相談を選べます。</p>
              <p className="mt-3">自治体や施設、地域事業者の方も、必要な場合だけ下の入口を使えます。</p>
            </div>
          </div>
          </MotionReveal>

          <MotionReveal delay={120} distance={18}>
            <div className="motion-card panel-sage rounded-[1.8rem] px-6 py-5">
            <div className="service-kicker text-[var(--accent-sage-text)]">そのあとで使える入口</div>
            <p className="mt-3 text-sm leading-8 md:text-base">
              LINE、アカウント、Web は、必要な人だけが続きとして使えます。
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
              <Link href="/line/next?locale=ja&line_intent=register&returnTo=/support" className="soft-link">
                LINE
              </Link>
              <Link href="/login" className="soft-link">
                アカウント
              </Link>
              <Link href="/support" className="soft-link">
                Web
              </Link>
            </div>
          </div>
          </MotionReveal>
        </div>
      </section>
    </main>
  );
}
