import Image from "next/image";
import Link from "next/link";

const concerns = [
  "外出したいが、移動手段に不安がある",
  "親の移動をどう支えればよいかわからない",
  "どの製品やサービスが合うのかわからない",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="border-b border-[color:var(--line-soft)] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.97),_rgba(250,245,238,0.99)_58%)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:px-10 md:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-12">
          <div className="order-2 lg:order-1">
            <div className="service-kicker">YORISOUとは</div>
            <h1 className="display-serif mt-5 max-w-[8.8em] text-[2.9rem] leading-[1.18] md:text-[4.4rem] lg:text-[5rem]">
              移動の不安から、
              <span className="text-[#79685f] md:inline">暮らしの安心へ。</span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-9 text-[var(--muted)]">
              高齢者とご家族の移動と暮らしに、やさしく、誠実に寄り添います。
            </p>
            <p className="mt-4 max-w-[32rem] text-sm leading-8 text-[var(--muted)] md:text-base">
              まずは AI相談員 ひなた が、気になっていることや不安を一緒に整理します。
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/support#scenario-assistant" className="btn btn-primary">
                ひなたに相談する
              </Link>
              <Link href="/about" className="btn btn-secondary">
                Yorisouについて
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="mx-auto max-w-[28rem] overflow-hidden rounded-[2.2rem] border border-[color:var(--line-soft)] bg-[var(--surface)] p-2.5 shadow-[0_22px_48px_rgba(47,35,33,0.07)] lg:mr-4">
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
          </div>
        </div>
      </section>

      <section className="border-b border-[color:var(--line-soft)] bg-[var(--surface-soft)] px-6 py-14 md:px-10 md:py-18">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="service-kicker">こんなお悩みはありませんか</div>
            <h2 className="display-serif mt-4 text-4xl leading-tight md:text-5xl">まずは、不安を言葉にするところから。</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {concerns.map((item) => (
              <article
                key={item}
                className="rounded-[1.8rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.78)] px-6 py-6 text-[15px] leading-8 text-[var(--muted)] shadow-[0_10px_24px_rgba(47,35,33,0.03)]"
              >
                <span className="block h-2 w-2 rounded-full bg-[#ccb29a]" />
                <span className="mt-4 block">{item}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[rgba(255,255,255,0.36)] px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[var(--surface)] px-7 py-8 shadow-[0_14px_28px_rgba(47,35,33,0.045)] md:px-10 md:py-9">
            <div className="service-kicker">How Yorisou helps</div>
            <h2 className="display-serif mt-4 max-w-[14em] text-[2.1rem] leading-[1.45] md:text-[2.8rem]">
              Yorisouは、まず話を聞くところから始めます。
            </h2>
            <div className="mt-5 max-w-3xl text-sm leading-8 text-[var(--muted)] md:text-base">
              <p>移動や暮らしのお悩みをお聞きしながら、状況に合う支え方を一緒に整理します。</p>
              <p className="mt-3">必要なときだけ、製品やサービス、その先のサポートへ丁寧につないでいきます。</p>
              <p className="mt-4 text-[var(--accent-sage-text)]">あとから続けたい方には、LINEでのやり取りにも静かに対応しています。</p>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-4 text-sm">
              <Link href="/support#scenario-assistant" className="text-[var(--text)] underline underline-offset-4">
                ひなたに相談する
              </Link>
              <Link href="/login" className="text-[var(--accent-sage-text)]">
                LINEで静かに続ける
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
