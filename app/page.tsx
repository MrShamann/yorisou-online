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
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:px-10 md:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-12">
          <div className="order-2 lg:order-1">
            <div className="service-kicker">YORISOUとは</div>
            <h1 className="display-serif mt-5 max-w-[8.4em] text-[2.9rem] leading-[1.18] md:text-[4.6rem] lg:text-[5.2rem]">
              移動の不安から、
              <span className="text-[#7A6150] md:inline">暮らしの安心へ。</span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-9 text-[#665651]">
              高齢者とご家族の移動と暮らしに、やさしく、誠実に寄り添います。
            </p>
            <p className="mt-4 max-w-[32rem] text-sm leading-8 text-[#6B5A4A] md:text-base">
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
            <div className="mx-auto max-w-[28rem] overflow-hidden rounded-[2.2rem] border border-[#E0D2C4]/60 bg-[#FBF6EE] p-2.5 shadow-[0_22px_48px_rgba(47,35,33,0.07)] lg:mr-4">
              <div className="overflow-hidden rounded-[1.7rem] bg-[#EFE4D6]">
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

      <section className="border-b border-[#D8C6B4]/18 bg-[#FBF7F1] px-6 py-14 md:px-10 md:py-18">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="service-kicker">こんなお悩みはありませんか</div>
            <h2 className="display-serif mt-4 text-4xl leading-tight md:text-5xl">まずは、不安を言葉にするところから。</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {concerns.map((item) => (
              <article
                key={item}
                className="rounded-[1.8rem] border border-[#E7D9CC]/78 bg-white/78 px-6 py-6 text-[15px] leading-8 text-[#5D4F44] shadow-[0_10px_24px_rgba(47,35,33,0.03)]"
              >
                <span className="block h-2 w-2 rounded-full bg-[#D4B89E]" />
                <span className="mt-4 block">{item}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#D8C6B4]/18 bg-white/45 px-6 py-14 md:px-10 md:py-18">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[2.2rem] border border-[#D8C6B4]/32 bg-[#FFFBF6] px-7 py-8 shadow-[0_18px_40px_rgba(47,35,33,0.05)] md:px-10 md:py-9">
            <div className="service-kicker">How Yorisou helps</div>
            <h2 className="display-serif mt-4 text-4xl leading-tight md:text-5xl">Yorisouは、まず話を聞くところから始めます。</h2>
            <div className="mt-5 max-w-3xl text-sm leading-8 text-[#5A4B3E] md:text-base">
              <p>移動や暮らしのお悩みをお聞きしながら、状況に合う支え方を一緒に整理します。</p>
              <p className="mt-3">すぐに何かを決める必要はありません。必要に応じて、製品やサービス、その後のサポートまで丁寧につないでいきます。</p>
              <p className="mt-4 text-[#6B5A4A]">あとから続けたい方には、LINEでのやり取りにも静かに対応しています。</p>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/support#scenario-assistant" className="btn btn-primary">
                ひなたに相談する
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center rounded-[18px] border border-[#DCD1C5] bg-white/72 px-5 py-3 text-sm font-medium text-[#6B5A4A] transition hover:bg-white/90">
                LINEで続きを受け取る
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F0E5] px-6 py-14 md:px-10 md:py-18">
        <div className="mx-auto max-w-4xl text-center">
          <div className="service-kicker">AI相談員 ひなた</div>
          <h2 className="display-serif mt-4 text-4xl leading-tight md:text-5xl">まずは、ひなたに相談してみませんか。</h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-[#5A4B3E] md:text-base">
            はじめてでも大丈夫です。気になることから、ゆっくりお話しいただけます。
          </p>
          <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row">
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
