import type { Metadata } from "next";
import Link from "next/link";

import { YorisouSymbol } from "./components/YorisouLogo";

export const metadata: Metadata = {
  title: "YORISOU | AIと整える、わたしの毎日。",
  description:
    "YORISOUは、今の状態をやさしく理解し、小さな一歩とおすすめ、保存とふり返り、LINEでの継続につなぐ日本語ファーストのセルフリフレクションサービスです。診断や占いではありません。",
};

const HERO_CHIPS = ["やさしく理解する", "小さく始める", "続けて、整えていく"] as const;

const JOURNEY_STEPS = [
  { step: "1", title: "今を知る", body: "かんたんセルフチェックで、今のわたしを可視化。", href: "/tests" },
  { step: "2", title: "整える", body: "結果とやさしい気づきで、今の状態を整理。", href: "/tests/relationship-fatigue" },
  { step: "3", title: "役立てる", body: "非公開で保存し、有限のおすすめから小さく試す。", href: "/recommendations/graph" },
  { step: "4", title: "振り返る", body: "保存した結果から、変化をゆっくり確かめる。", href: "/saved" },
  { step: "5", title: "続ける", body: "LINEで、やさしく習慣化をサポート。", href: "/line/mini-app" },
] as const;

const ARCHITECTURE_CARDS = [
  {
    title: "セルフチェック",
    body: "1〜6分の公開チェックで、今の状態を言葉にします。",
    href: "/tests",
    label: "チェックを見る",
  },
  {
    title: "結果とレポート",
    body: "決めつけない結果と、必要なときに深く読めるレポート。",
    href: "/report-preview?resultId=EM-AK&overlayId=balancing&confidence=low",
    label: "レポートの見本",
  },
  {
    title: "おすすめ・次の一歩",
    body: "理由が見える有限のおすすめ。合わないときは選ばなくて大丈夫。",
    href: "/recommendations/graph",
    label: "おすすめを開く",
  },
  {
    title: "わたしの今",
    body: "保存した結果はあなたにだけ。あとから変化を見返せます。",
    href: "/saved",
    label: "保存を見る",
  },
  {
    title: "体験を見つける",
    body: "同じような状態の人の体験から、合いそうな方法を探す。",
    href: "/experiences",
    label: "体験を見る",
  },
  {
    title: "LINEで続ける",
    body: "結果の保存と見返し、やさしい再開。通知は選べます。",
    href: "/line/mini-app",
    label: "LINEで開く",
  },
] as const;

export default function HomePage() {
  return (
    <main className="yorisou-glow-field min-h-screen bg-[var(--yorisou-color-surface-bg)] text-[var(--yorisou-color-neutral-800)]">
      {/* ── Hero: value prop + visual core ── */}
      <section className="border-b border-[var(--yorisou-color-neutral-100)]">
        <div className="container grid items-center gap-10 py-12 md:grid-cols-[1.05fr_0.95fr] md:py-16">
          <div className="space-y-5">
            <p className="text-[12px] font-bold tracking-[0.14em] text-[var(--yorisou-color-primary-600)]">
              AIと整える、わたしの毎日。
            </p>
            <h1 className="text-[1.9rem] font-bold leading-[1.32] text-[var(--yorisou-color-neutral-800)] md:text-[2.6rem]">
              今の状態を理解し、
              <br />
              次の一歩へ、やさしくつなぐ。
            </h1>
            <p className="max-w-[30rem] text-[15px] leading-8 text-[var(--yorisou-color-neutral-500)]">
              AIと一緒に、あなたの今をやさしく理解。小さな一歩を、続けていくためのパーソナルサポートです。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/tests/relationship-fatigue"
                className="inline-flex min-h-[52px] items-center justify-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-6 text-[15px] font-bold text-white no-underline shadow-[0_14px_30px_rgba(108,76,255,0.28)] transition hover:bg-[var(--yorisou-color-primary-600)]"
              >
                無料でセルフチェックを始める
              </Link>
              <Link
                href="/tests"
                className="inline-flex min-h-[52px] items-center justify-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-6 text-[14px] font-semibold text-[var(--yorisou-color-neutral-800)] no-underline"
              >
                チェックを選ぶ
              </Link>
            </div>
            <p className="text-[12px] leading-6 text-[var(--yorisou-color-neutral-500)]">
              ログインなしで始められます。診断や占いではありません。
            </p>
          </div>

          {/* Visual core: glow orb + orbit + floating chips */}
          <div className="relative mx-auto flex h-[280px] w-[280px] items-center justify-center md:h-[340px] md:w-[340px]" aria-hidden="true">
            <div className="yorisou-orb yorisou-orb-float flex h-[190px] w-[190px] items-center justify-center md:h-[230px] md:w-[230px]">
              <YorisouSymbol variant="white" size={92} breathing />
            </div>
            {HERO_CHIPS.map((chip, index) => (
              <span
                key={chip}
                className={`absolute rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-100)] bg-white/92 px-3.5 py-1.5 text-[12px] font-semibold text-[var(--yorisou-color-primary-700)] shadow-[var(--yorisou-shadow-card)] ${
                  index === 0 ? "right-0 top-6" : index === 1 ? "left-0 top-1/2" : "bottom-6 right-4"
                }`}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core journey ── */}
      <section className="container py-10 md:py-12">
        <p className="text-[12px] font-bold tracking-[0.12em] text-[var(--yorisou-color-neutral-500)]">体験の流れ</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {JOURNEY_STEPS.map((step) => (
            <Link
              key={step.step}
              href={step.href}
              className="group rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-neutral-100)] bg-white p-4 no-underline shadow-[var(--yorisou-shadow-card)] transition duration-[var(--yorisou-motion-card)] hover:-translate-y-0.5"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--yorisou-color-primary-100)] text-[13px] font-bold text-[var(--yorisou-color-primary-700)]">
                {step.step}
              </span>
              <p className="mt-2.5 text-[15px] font-bold text-[var(--yorisou-color-neutral-800)] group-hover:text-[var(--yorisou-color-primary-600)]">
                {step.title}
              </p>
              <p className="mt-1 text-[12.5px] leading-6 text-[var(--yorisou-color-neutral-500)]">{step.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Product architecture ── */}
      <section className="container pb-10 md:pb-12">
        <p className="text-[12px] font-bold tracking-[0.12em] text-[var(--yorisou-color-neutral-500)]">YORISOUでできること</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ARCHITECTURE_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group flex flex-col rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-neutral-100)] bg-[var(--yorisou-color-surface-raised)] p-5 no-underline shadow-[var(--yorisou-shadow-card)] transition duration-[var(--yorisou-motion-card)] hover:-translate-y-0.5"
            >
              <p className="text-[15px] font-bold text-[var(--yorisou-color-neutral-800)]">{card.title}</p>
              <p className="mt-1.5 flex-1 text-[13px] leading-7 text-[var(--yorisou-color-neutral-500)]">{card.body}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--yorisou-color-primary-600)]">
                {card.label}
                <span aria-hidden="true" className="transition group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── AI understanding (deep surface) ── */}
      <section className="container pb-10 md:pb-12">
        <div className="grid gap-4 rounded-[var(--yorisou-radius-hero)] bg-[var(--yorisou-color-deep-900)] p-6 text-white md:grid-cols-[1fr_0.9fr] md:items-center md:p-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <YorisouSymbol variant="white" size={22} breathing />
              <span className="text-[11px] font-bold tracking-[0.12em] text-white/70">YORISOU AI</span>
            </div>
            <h2 className="text-[1.4rem] font-bold leading-[1.4] md:text-[1.7rem]">
              AIは、あなたを決めつけない。
              <br />
              今の状態を、一緒に整理する。
            </h2>
            <p className="max-w-[26rem] text-[13.5px] leading-7 text-white/75">
              チェックの結果から、疲れが出やすい場面と戻りやすい形をやさしく言葉に。おすすめには理由が添えられ、合わないときは「今は合わない」を選べます。
            </p>
          </div>
          <div className="space-y-2.5">
            {["整理しています", "見つかったこと", "次に試せること"].map((state, index) => (
              <div
                key={state}
                className="flex items-center gap-3 rounded-[var(--yorisou-radius-button)] border border-white/10 bg-white/[0.06] px-4 py-3"
              >
                <span
                  className={`inline-flex h-2 w-2 rounded-full ${index === 2 ? "bg-[var(--yorisou-color-accent-500)]" : "bg-[var(--yorisou-color-primary-500)]"}`}
                  aria-hidden="true"
                />
                <span className="text-[13px] font-semibold text-white/85">{state}</span>
              </div>
            ))}
            <p className="pt-1 text-[11.5px] leading-5 text-white/55">
              保存はすべて非公開。内容はあなたにだけ表示され、いつでも削除できます。
            </p>
          </div>
        </div>
      </section>

      {/* ── LINE continuation ── */}
      <section className="container pb-14 md:pb-16">
        <div className="grid gap-4 rounded-[var(--yorisou-radius-hero)] border border-[var(--yorisou-color-neutral-100)] bg-white p-6 shadow-[var(--yorisou-shadow-card)] md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div className="space-y-2">
            <p className="text-[12px] font-bold tracking-[0.12em] text-[#06C755]">LINEで続ける</p>
            <h2 className="text-[1.3rem] font-bold leading-[1.4] text-[var(--yorisou-color-neutral-800)] md:text-[1.5rem]">
              いつものLINEから、そっと自分を整える。
            </h2>
            <p className="max-w-[32rem] text-[13.5px] leading-7 text-[var(--yorisou-color-neutral-500)]">
              LINEは別の製品ではなく、続きです。結果の保存と見返し、やさしい再開までを、あなたのペースで。通知はいつでも止められます。
            </p>
          </div>
          <Link
            href="/line/mini-app"
            className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[var(--yorisou-radius-pill)] bg-[#06C755] px-6 text-[14px] font-bold text-white no-underline transition hover:bg-[#05B34C]"
          >
            <span className="inline-flex h-[16px] w-[16px] items-center justify-center rounded-full bg-white text-[9.5px] font-black text-[#06C755]" aria-hidden="true">L</span>
            LINEでYORISOUを開く
          </Link>
        </div>
      </section>
    </main>
  );
}
