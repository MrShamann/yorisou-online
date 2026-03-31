import Image from "next/image";
import Link from "next/link";
import MotionReveal from "./components/MotionReveal";

const concerns = [
  "外出したいが、移動手段に不安がある",
  "親の移動をどう支えればよいかわからない",
  "どの製品やサービスが合うのかわからない",
];

const entryLanes = [
  {
    title: "相談から始める",
    text: "まずは、移動や暮らしの不安をひなたにそのまま相談できます。",
    href: "/support#scenario-assistant",
    cta: "相談を始める",
  },
  {
    title: "支援内容を知る",
    text: "高齢者、ご家族、地域の運営側それぞれに向けた支援内容を見られます。",
    href: "/services",
    cta: "支援内容を見る",
  },
  {
    title: "導入・実証を見る",
    text: "地域や事業者向けの小さな導入・実証の進め方を確認できます。",
    href: "/pilot",
    cta: "導入・実証を見る",
  },
  {
    title: "読みものを読む",
    text: "高齢者の移動や地域支援の考え方を、読みものとして確かめられます。",
    href: "/insights",
    cta: "読みものを見る",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="section-wash border-b border-[color:var(--line-soft)] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_rgba(247,244,238,0.99)_60%)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:px-10 md:py-16 lg:grid-cols-[1.18fr_0.82fr] lg:items-center lg:gap-12">
          <MotionReveal className="order-2 lg:order-1" delay={40} distance={28}>
            <div className="service-kicker">高齢者とご家族の移動支援プラットフォーム</div>
            <h1 className="display-serif mt-5 max-w-[9.6em] text-[2.18rem] leading-[1.24] md:text-[3.02rem] lg:text-[3.36rem]">
              <span className="block md:whitespace-nowrap">移動の不安から、</span>
              <span className="block text-[#79685f] md:whitespace-nowrap">暮らしの安心へ。</span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-base leading-9 text-[var(--muted)] md:text-lg">
              Yorisouは、日本の高齢者とご家族の移動・通院・買い物・地域での暮らしを支えるための相談と支援の入口です。
            </p>
            <p className="mt-4 max-w-[33rem] text-sm leading-8 text-[var(--muted)] md:text-base">
              ひなたは最初の相談窓口として状況整理を手伝い、その先を支援内容、導入・実証、読みもの、継続相談へ静かにつなぎます。
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/support#scenario-assistant" className="btn btn-primary">
                相談を始める
              </Link>
              <Link href="/services" className="btn btn-secondary">
                支援内容を見る
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm">
              <Link href="/about" className="soft-link">
                Yorisouについて
              </Link>
              <Link href="/pilot" className="soft-link">
                導入・実証
              </Link>
              <Link href="/insights" className="soft-link">
                読みもの
              </Link>
              <Link href="/login#line-entry" className="soft-link">
                LINE・アカウントで続ける
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

      <section className="section-wash border-b border-[color:var(--line-soft)] bg-[var(--surface-soft)] px-6 py-12 md:px-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <MotionReveal className="max-w-[40rem]" delay={30}>
            <div className="service-kicker">こんなお悩みはありませんか</div>
            <h2 className="display-serif mt-4 max-w-[13.5em] text-[1.76rem] leading-[1.62] md:text-[2.16rem]">
              <span className="block md:whitespace-nowrap">まずは、いま気になることを</span>
              <span className="block md:whitespace-nowrap">そのまま話せれば十分です。</span>
            </h2>
            <p className="mt-4 page-copy">
              ひなたとのやりとりの中で、移動のことも暮らしのことも、必要な整理を少しずつ受け持っていきます。
            </p>
          </MotionReveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {concerns.map((item, index) => (
              <MotionReveal key={item} delay={80 + index * 70} distance={18}>
                <article
                key={item}
                className="motion-card rounded-[1.6rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.72)] px-6 py-5 text-[15px] leading-8 text-[var(--muted)]"
              >
                <span className="block h-2 w-2 rounded-full bg-[var(--accent-sage-text)]/55" />
                <span className="mt-4 block">{item}</span>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wash border-b border-[color:var(--line-soft)] bg-[rgba(255,255,255,0.46)] px-6 py-12 md:px-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <MotionReveal className="max-w-[42rem]" delay={30}>
            <div className="service-kicker">どこから始めるか</div>
            <h2 className="display-serif mt-4 max-w-[15em] text-[1.72rem] leading-[1.6] md:text-[2.08rem]">
              相談、支援内容、導入・実証、読みものの4つの入口を用意しています。
            </h2>
            <p className="mt-4 page-copy">
              先に資料を読みたい方も、すぐ相談したい方も、あとからLINEやアカウントで続けたい方も、同じYorisouの中で落ち着いて進められます。
            </p>
          </MotionReveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

      <section className="section-wash bg-[rgba(255,255,255,0.22)] px-6 py-12 md:px-10 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.06fr_0.94fr]">
          <MotionReveal delay={30}>
            <div className="motion-card rounded-[1.8rem] border border-[color:var(--line-soft)] bg-[var(--surface)] px-6 py-6">
            <div className="service-kicker">相談のあとにできること</div>
            <h2 className="display-serif mt-4 max-w-[14.5em] text-[1.7rem] leading-[1.64] md:text-[2.04rem]">
              相談だけで終わらず、支援内容の確認や地域導入の検討までつなげられます。
            </h2>
            <div className="mt-5 page-copy">
              <p>すぐに何かを決める必要はありません。まず状況を聞き、必要なら家族共有、継続相談、支援内容の比較へ進めます。</p>
              <p className="mt-3">自治体や施設、地域事業者の方には、導入・実証の入口としても使えます。</p>
            </div>
          </div>
          </MotionReveal>

          <MotionReveal delay={120} distance={18}>
            <div className="motion-card panel-sage rounded-[1.8rem] px-6 py-6">
            <div className="service-kicker text-[var(--accent-sage-text)]">その先も、無理のない形で</div>
            <p className="mt-4 text-sm leading-8 md:text-base">
              相談の続きはLINEまたはアカウントで受け取れます。まず相談を始めてから、あとで落ち着いてつなぎ方を選ぶこともできます。
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm">
              <Link href="/login#line-entry" className="soft-link">
                LINEで続ける
              </Link>
              <Link href="/login" className="soft-link">
                アカウントで続ける
              </Link>
              <Link href="/insights" className="soft-link">
                読みものを見る
              </Link>
            </div>
          </div>
          </MotionReveal>
        </div>
      </section>
    </main>
  );
}
