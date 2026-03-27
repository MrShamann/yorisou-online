import Link from "next/link";

import InsightsPreview from "./components/InsightsPreview";
import LineBrandIcon from "./components/LineBrandIcon";

const trustPoints = [
  "外出したいが、移動手段に不安がある",
  "親の移動をどう支えればいいかわからない",
  "どの製品やサービスが合っているかわからない",
  "導入後のサポートが心配",
];

const serviceCards = [
  {
    title: "相談サポート",
    body: "一人ひとりの状況に合わせて、最適な移動方法をご提案",
  },
  {
    title: "導入サポート",
    body: "試乗・選定・導入まで丁寧にサポート",
  },
  {
    title: "利用後サポート",
    body: "導入後も継続的にフォローし、安心を支えます",
  },
  {
    title: "家族との共有",
    body: "ご家族とも情報を共有し、見守りと安心を実現",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F0E5] text-[#312321]">
      <section className="relative overflow-hidden border-b border-[#D8C6B4]/30 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.96),_rgba(247,240,229,0.98)_58%)]">
        <div className="absolute inset-y-0 right-0 hidden w-[34%] rounded-l-[7rem] bg-[#EFE4D6] lg:block" />
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative z-10">
            <div className="service-kicker">AI相談員 ひなた</div>
            <h1 className="display-serif mt-5 text-5xl leading-[1.14] md:text-7xl">
              移動の不安から、
              <span className="block text-[#7A6150]">暮らしの安心へ。</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-[#665651]">
              高齢者とご家族の移動と暮らしに、やさしく、誠実に寄り添う。
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6B5A4A]">
              ひなたは、移動や暮らしの不安を一緒に整理し、その方に合う支え方を丁寧に考えていきます。
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <div className="flex flex-col gap-2">
                <span className="text-sm leading-6 text-[#6B5A4A]">AI相談員 ひなた</span>
                <Link href="/support#scenario-assistant" className="btn btn-primary">
                  ひなたに相談する
                </Link>
                <span className="text-xs leading-6 text-[#8A7764]">
                  はじめてでも大丈夫です。気になることから、ゆっくりお話しいただけます。
                </span>
              </div>
              <Link href="/login" className="btn btn-secondary border-[#9AD8AA] bg-[#F4FBF5] text-[#245B33]">
                <LineBrandIcon className="h-5 w-5" />
                LINEであとから続ける
              </Link>
              <Link href="/products" className="text-sm leading-7 text-[#6B5A4A] underline-offset-4 transition hover:text-[#312321] hover:underline">
                製品を見る
              </Link>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6B5A4A]">
              Yorisou は、移動に不安を抱える高齢者とそのご家族に寄り添い、相談からその後の見守りまでをつないでいきます。必要に応じて、LINE やアカウントで無理なく続けられます。
            </p>
            <div className="mt-8 grid gap-3 md:max-w-2xl">
              {trustPoints.map((item) => (
                <div key={item} className="rounded-[1.4rem] border border-[#E0D2C4] bg-[#FFF9F2]/95 px-5 py-4 text-sm leading-7 text-[#665651] shadow-[0_10px_24px_rgba(47,35,33,0.04)]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="rounded-[2.6rem] border border-[#E0D2C4]/65 bg-[#FFF9F2] p-6 shadow-[0_28px_60px_rgba(47,35,33,0.1)] md:p-7">
              <div className="overflow-hidden rounded-[2.2rem] bg-[linear-gradient(135deg,#3B302D_0%,#5D4A42_38%,#D8C9B5_100%)] p-8 text-white md:p-10">
                <div className="service-kicker text-white/70">Yorisou のサポート</div>
                <h2 className="display-serif mt-4 text-3xl leading-tight md:text-4xl">
                  一人ひとりに合った、
                  <span className="block">やさしい支え方を。</span>
                </h2>
                <p className="mt-5 max-w-md text-sm leading-8 text-white/82 md:text-base">
                  ご相談内容をお聞かせいただきながら、内容を確認しつつ一緒に整理します。わからないことも含めて、安心して進められるよう丁寧にご案内します。
                </p>
                <div className="mt-8 rounded-[1.8rem] bg-white/12 px-5 py-5 backdrop-blur">
                  <div className="text-sm text-white/70">ご案内の流れ</div>
                  <div className="mt-3 grid gap-3 text-sm leading-7 text-white/90">
                    <div>1. ご相談内容をお聞かせください</div>
                    <div>2. 内容を確認しながらご案内します</div>
                    <div>3. わからないことも一緒に整理します</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D8C6B4]/24 bg-[#FBF6EE] px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="service-kicker">Concerns</div>
            <h2 className="display-serif mt-4 text-4xl leading-tight md:text-5xl">こんなお悩みはありませんか？</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {serviceCards.map((item, index) => (
              <article key={item.title} className="card bg-[#FFFDF9]">
                <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[#F1E5D6] text-sm font-semibold text-[#7A6150]">
                  0{index + 1}
                </div>
                <h3 className="display-serif mt-6 text-2xl leading-tight">{item.title}</h3>
                <p className="mt-4 text-sm leading-8 text-[#665651] md:text-base">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <InsightsPreview locale="ja" />

      <section className="border-t border-[#D8C6B4]/24 bg-white/50 px-6 py-16 md:px-10">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-[#D8C6B4]/34 bg-[linear-gradient(135deg,#DCE8D8_0%,#EEF4EB_40%,#FFF9F2_100%)] p-8 shadow-[0_24px_60px_rgba(47,35,33,0.06)] md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="service-kicker text-[#55705C]">Yorisou とは</div>
              <h2 className="display-serif mt-4 text-4xl leading-tight md:text-5xl">
                移動の不安を減らし、
                <span className="block">自分らしい暮らしへ。</span>
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#51614E]">
                年齢を重ねても自分らしく外出し、暮らせる社会をつくることを目指して、Yorisou は移動の不安から暮らしの安心へとつながる支え方を整えていきます。
              </p>
              <div className="mt-7 flex flex-col gap-4 sm:flex-row">
                <Link href="/support" className="btn btn-primary">
                  ひなたと相談を始める
                </Link>
                <Link href="/login" className="btn btn-secondary border-[#9AD8AA] bg-[#F4FBF5] text-[#245B33]">
                  LINEであとから続ける
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/60 bg-white/68 p-6 shadow-[0_16px_30px_rgba(47,35,33,0.06)]">
              <div className="service-kicker">テクノロジーで、やさしく支える</div>
              <div className="mt-4 grid gap-4 text-sm leading-7 text-[#5B514A]">
                <div className="rounded-[1.4rem] bg-[#FFF9F2] px-5 py-4">LINE や AI を活用し、相談やその後のやり取りをなめらかに。</div>
                <div className="rounded-[1.4rem] bg-[#FFF9F2] px-5 py-4">人のやさしさとテクノロジーを組み合わせながら、</div>
                <div className="rounded-[1.4rem] bg-[#FFF9F2] px-5 py-4">継続して安心を支えます。</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
