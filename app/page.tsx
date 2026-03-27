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
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:px-10 md:py-18 lg:grid-cols-[1.14fr_0.86fr] lg:items-center lg:gap-10">
          <div className="order-2 lg:order-1">
            <div className="service-kicker">YORISOUとは</div>
            <h1 className="display-serif mt-5 max-w-[11.8em] text-[2.45rem] leading-[1.28] md:text-[3.4rem] lg:text-[3.86rem]">
              <span className="block md:whitespace-nowrap">移動の不安から、</span>
              <span className="block text-[#79685f] md:whitespace-nowrap">暮らしの安心へ。</span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-base leading-9 text-[var(--muted)] md:text-lg">
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
            <div className="mx-auto max-w-[24rem] overflow-hidden rounded-[2rem] border border-[color:var(--line-soft)] bg-[var(--surface)] p-2 shadow-[0_18px_36px_rgba(47,35,33,0.06)] lg:mr-4">
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

      <section className="border-b border-[color:var(--line-soft)] bg-[var(--surface-soft)] px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="service-kicker">こんなお悩みはありませんか</div>
            <h2 className="display-serif mt-4 max-w-[14em] text-[1.9rem] leading-[1.58] md:text-[2.42rem]">
              <span className="block md:whitespace-nowrap">まずは、</span>
              <span className="block md:whitespace-nowrap">不安を言葉にするところから。</span>
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {concerns.map((item) => (
              <article
                key={item}
                className="rounded-[1.6rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.72)] px-6 py-6 text-[15px] leading-8 text-[var(--muted)]"
              >
                <span className="block h-2 w-2 rounded-full bg-[var(--accent-sage-text)]/55" />
                <span className="mt-4 block">{item}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[rgba(255,255,255,0.28)] px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[1.9rem] border border-[color:var(--line-soft)] bg-[var(--surface)] px-7 py-8 shadow-[0_12px_24px_rgba(47,35,33,0.04)] md:px-9 md:py-9">
            <div className="service-kicker">Yorisouの進め方</div>
            <h2 className="display-serif mt-4 max-w-[16em] text-[1.88rem] leading-[1.58] md:text-[2.26rem]">
              <span className="block md:whitespace-nowrap">Yorisouは、</span>
              <span className="block md:whitespace-nowrap">まず話を聞くところから始めます。</span>
            </h2>
            <div className="mt-5 max-w-3xl text-sm leading-8 text-[var(--muted)] md:text-base">
              <p>移動や暮らしのお悩みをお聞きしながら、状況に合う支え方を一緒に整理します。</p>
              <p className="mt-3">すぐに何かを決める必要はありません。必要になったときだけ、製品やサービス、その後の支え方へ丁寧につないでいきます。</p>
              <p className="mt-4 text-[var(--accent-sage-text)]">あとから続けたい方には、LINEやアカウントで静かに受け取れる形も整えています。</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
