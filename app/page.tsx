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
      <section className="border-b border-[color:var(--line-soft)] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_rgba(247,244,238,0.99)_60%)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:px-10 md:py-16 lg:grid-cols-[1.18fr_0.82fr] lg:items-center lg:gap-12">
          <div className="order-2 lg:order-1">
            <div className="service-kicker">YORISOUとは</div>
            <h1 className="display-serif mt-5 max-w-[9.6em] text-[2.18rem] leading-[1.24] md:text-[3.02rem] lg:text-[3.36rem]">
              <span className="block md:whitespace-nowrap">移動の不安から、</span>
              <span className="block text-[#79685f] md:whitespace-nowrap">暮らしの安心へ。</span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-base leading-9 text-[var(--muted)] md:text-lg">
              高齢者とご家族の移動と暮らしに、やさしく、誠実に寄り添います。
            </p>
            <p className="mt-4 max-w-[33rem] text-sm leading-8 text-[var(--muted)] md:text-base">
              まずは AI相談員 ひなた が、気になっていることを一緒に受け取り、
              必要な整理を静かに進めます。
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
            <div className="mx-auto max-w-[21rem] overflow-hidden rounded-[2rem] border border-[color:var(--line-soft)] bg-[var(--surface)] p-2 shadow-[0_14px_28px_rgba(47,35,33,0.05)] lg:mr-8">
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

      <section className="border-b border-[color:var(--line-soft)] bg-[var(--surface-soft)] px-6 py-12 md:px-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-[40rem]">
            <div className="service-kicker">こんなお悩みはありませんか</div>
            <h2 className="display-serif mt-4 max-w-[13.5em] text-[1.76rem] leading-[1.62] md:text-[2.16rem]">
              <span className="block md:whitespace-nowrap">まずは、いま気になることを</span>
              <span className="block md:whitespace-nowrap">そのまま話せれば十分です。</span>
            </h2>
            <p className="mt-4 page-copy">
              ひなたとのやりとりの中で、移動のことも暮らしのことも、必要な整理を少しずつ受け持っていきます。
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {concerns.map((item) => (
              <article
                key={item}
                className="rounded-[1.6rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.72)] px-6 py-5 text-[15px] leading-8 text-[var(--muted)]"
              >
                <span className="block h-2 w-2 rounded-full bg-[var(--accent-sage-text)]/55" />
                <span className="mt-4 block">{item}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[rgba(255,255,255,0.22)] px-6 py-12 md:px-10 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.06fr_0.94fr]">
          <div className="rounded-[1.8rem] border border-[color:var(--line-soft)] bg-[var(--surface)] px-6 py-6">
            <div className="service-kicker">Yorisouの支え方</div>
            <h2 className="display-serif mt-4 max-w-[14.5em] text-[1.7rem] leading-[1.64] md:text-[2.04rem]">
              ひなたが最初の伴走役となり、必要な支え方を一緒に整えていきます。
            </h2>
            <div className="mt-5 page-copy">
              <p>すぐに何かを決める必要はありません。まず話を聞き、無理のない順番で考えていきます。</p>
              <p className="mt-3">必要に応じて、製品、サービス、導入・実証、その後の継続支援へ落ち着いてつないでいきます。</p>
            </div>
          </div>

          <div className="panel-sage rounded-[1.8rem] px-6 py-6">
            <div className="service-kicker text-[var(--accent-sage-text)]">その先も、無理のない形で</div>
            <p className="mt-4 text-sm leading-8 md:text-base">
              あとから続けたいときには、LINEやアカウントで受け取りやすい形を選べます。
              日々の不安から地域での導入検討まで、読みものや支援内容も静かに確かめられます。
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm">
              <Link href="/services" className="soft-link">
                支援内容を見る
              </Link>
              <Link href="/insights" className="soft-link">
                読みものを見る
              </Link>
              <Link href="/login" className="soft-link">
                あとから続ける
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
