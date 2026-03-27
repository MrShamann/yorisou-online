import Image from "next/image";
import Link from "next/link";

const concerns = [
  "外出したいが、移動手段に不安がある",
  "親の移動をどう支えればよいかわからない",
  "どの製品やサービスが合うのかわからない",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F0E5] text-[#312321]">
      <section className="border-b border-[#D8C6B4]/24 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.96),_rgba(247,240,229,0.98)_60%)]">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="order-2 lg:order-1">
            <div className="service-kicker">YORISOUとは</div>
            <h1 className="display-serif mt-5 text-5xl leading-[1.12] md:text-7xl">
              移動の不安から、
              <span className="block text-[#7A6150]">暮らしの安心へ。</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-9 text-[#665651]">
              高齢者とご家族の移動と暮らしに、やさしく、誠実に寄り添います。
            </p>
            <p className="mt-4 max-w-xl text-sm leading-8 text-[#6B5A4A] md:text-base">
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
            <div className="mx-auto max-w-[36rem] overflow-hidden rounded-[2.6rem] border border-[#E0D2C4]/70 bg-[#FBF6EE] p-3 shadow-[0_28px_60px_rgba(47,35,33,0.08)]">
              <div className="overflow-hidden rounded-[2rem] bg-[#EFE4D6]">
                <Image
                  src="/images/hinata-portrait.png"
                  alt="AI相談員 ひなた"
                  width={1200}
                  height={1500}
                  priority
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D8C6B4]/20 bg-[#FBF7F1] px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="service-kicker">こんなお悩みはありませんか</div>
            <h2 className="display-serif mt-4 text-4xl leading-tight md:text-5xl">まずは、不安を言葉にするところから。</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {concerns.map((item) => (
              <article
                key={item}
                className="rounded-[1.8rem] border border-[#E0D2C4]/80 bg-white/86 px-6 py-7 text-base leading-8 text-[#5A4B3E] shadow-[0_12px_28px_rgba(47,35,33,0.04)]"
              >
                {item}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#D8C6B4]/20 bg-white/45 px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[2.4rem] border border-[#D8C6B4]/34 bg-[#FFFBF6] px-7 py-8 shadow-[0_22px_48px_rgba(47,35,33,0.05)] md:px-10 md:py-10">
            <div className="service-kicker">How Yorisou helps</div>
            <h2 className="display-serif mt-4 text-4xl leading-tight md:text-5xl">Yorisouは、まず話を聞くところから始めます。</h2>
            <div className="mt-6 max-w-3xl text-sm leading-8 text-[#5A4B3E] md:text-base">
              <p>移動や暮らしのお悩みをお聞きしながら、状況に合う支え方を一緒に整理します。</p>
              <p className="mt-3">すぐに何かを決める必要はありません。</p>
              <p className="mt-3">
                必要に応じて、製品やサービス、その後のサポートまで丁寧につないでいきます。
              </p>
              <p className="mt-5 text-[#6B5A4A]">あとから続けたい方には、LINEでのやり取りにも対応しています。</p>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/support#scenario-assistant" className="btn btn-primary">
                ひなたに相談する
              </Link>
              <Link href="/login" className="btn btn-secondary">
                LINEでつながる
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F0E5] px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="service-kicker">AI相談員 ひなた</div>
          <h2 className="display-serif mt-4 text-4xl leading-tight md:text-5xl">まずは、ひなたに相談してみませんか。</h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-[#5A4B3E] md:text-base">
            はじめてでも大丈夫です。気になることから、ゆっくりお話しいただけます。
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/support#scenario-assistant" className="btn btn-primary">
              相談する
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              お問い合わせ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
