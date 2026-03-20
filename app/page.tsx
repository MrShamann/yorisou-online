import Link from "next/link";

import InsightsPreview from "./components/InsightsPreview";

const trustPoints = [
  "ご本人にも、ご家族にも相談しやすい入口",
  "比較から導入後の不安まで見据えた支援",
  "福岡での検証知見を全国向けの設計に反映",
];

const journeySteps = [
  {
    title: "まずは状況を整理する",
    text: "歩く距離や外出先、ご家族の心配ごとまで落ち着いて確認し、いま何を優先すべきかを見える形にします。",
  },
  {
    title: "合う移動手段を比べる",
    text: "急いで決めるのではなく、生活導線、使いやすさ、ご家族の納得感まで含めて候補を整えます。",
  },
  {
    title: "その後の支え方につなげる",
    text: "試乗や個別相談、導入後の確認までをひと続きで考え、継続支援の土台につなげていきます。",
  },
];

const entryCards = [
  {
    title: "ご本人・ご家族の相談",
    text: "AI相談を入口に、暮らしに合う移動を静かに整理します。最初の比較から個別相談まで、無理なく進められる導線です。",
    href: "/ai-advisor",
    cta: "相談を始める",
  },
  {
    title: "導入後も見据えた支援",
    text: "相談履歴やご家族共有、導入後の確認までつながる支援基盤を、今のサービス導線の中で少しずつ整えています。",
    href: "/services",
    cta: "サービスを見る",
  },
];

const lowerCards = [
  {
    title: "福岡で確かめていること",
    text: "福岡は紹介用の地域ではなく、利用者の受け止め方、ご家族の納得感、現場で続く運用の成立性を確かめる検証拠点です。",
    href: "/pilot",
    cta: "導入・実証の考え方へ",
  },
  {
    title: "地域導入の相談",
    text: "自治体、施設、地域事業者向けには、単発イベントではなく、継続可能な導入判断につながる実務支援を行っています。",
    href: "/services",
    cta: "支援の流れを見る",
  },
];

const supportShellItems = ["相談内容の見返し", "ご家族への共有メモ", "試乗・個別相談のフォロー", "継続支援エリア（準備中）"];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="relative overflow-hidden border-b border-[#D6C3A3]/25 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.92),_rgba(245,241,232,0.98)_58%)]">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/70 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[1.14fr_0.86fr] lg:items-center">
          <div className="shell-card p-8 md:p-12">
            <div className="text-[11px] tracking-[0.22em] text-[#8A7764]">Senior Mobility Support / Japan</div>
            <h1 className="mt-4 text-4xl font-light leading-tight md:text-6xl">
              まずは安心して相談できる、
              <span className="block text-[#6B5A4A]">移動のための入口を整えました。</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisouは、高齢者とご家族のためのモビリティサービスです。相談から始まり、比較、試乗や個別相談、
              そして導入後の支え方までを静かにつないでいきます。
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/ai-advisor" className="btn btn-primary">
                AI相談を始める
              </Link>
              <Link href="/services" className="btn btn-secondary">
                サービスの流れを見る
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {trustPoints.map((item) => (
                <div key={item} className="rounded-[1.25rem] border border-[#D6C3A3]/30 bg-[#FCFAF6] px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-[#D6C3A3]/32 bg-white/82 p-7 shadow-[0_24px_60px_rgba(59,47,47,0.06)]">
              <h2 className="text-2xl font-light leading-tight">相談は、最初の一回で終わる前提ではありません。</h2>
              <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">
                いまはAI相談と個別フォローが中心ですが、Yorisouはご家族との共有や導入後の見直しにもつながる支援体験を目指しています。
              </p>
              <div className="mt-5 grid gap-3">
                {supportShellItems.map((item) => (
                  <div key={item} className="rounded-2xl bg-[#FCFAF6] px-4 py-3 text-sm text-[#5A4B3E]">
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-6 text-[#8A7764]">継続支援エリアは準備中です。実際のログイン機能や家族連携機能は今後の実装対象です。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/25 bg-white/50 px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-light leading-tight">相談から導入後まで、移動支援をひと続きで考えます。</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5A4B3E] md:text-base">
              製品を急いで選ぶのではなく、生活の中で困る場面を整理し、その後も使い続けやすいかまで含めて支援します。
            </p>

            <div className="mt-8 grid gap-4">
              {journeySteps.map((item, index) => (
                <div key={item.title} className="rounded-[1.75rem] border border-[#D6C3A3]/30 bg-white/86 p-6 shadow-sm">
                  <div className="text-xs tracking-[0.2em] text-[#8A7764]">0{index + 1}</div>
                  <h3 className="mt-3 text-2xl font-light">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            {entryCards.map((item) => (
              <div key={item.title} className="rounded-[1.9rem] border border-[#D6C3A3]/30 bg-[#FCFAF6] p-6 shadow-sm">
                <h3 className="text-2xl font-light leading-tight">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
                <div className="mt-5">
                  <Link href={item.href} className="btn btn-secondary">
                    {item.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InsightsPreview locale="ja" />

      <section className="border-t border-[#D6C3A3]/25 bg-white/45 px-6 py-16 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="rounded-[2rem] border border-[#D6C3A3]/35 bg-white/78 p-8 shadow-[0_20px_60px_rgba(59,47,47,0.06)] backdrop-blur">
            <h2 className="text-3xl font-light leading-tight">福岡での検証を、これからの標準設計に返しています。</h2>
            <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
              Yorisouは福岡で、利用者の反応、ご家族の受容、現場運用、地域連携の成立条件を確かめています。
              その学びを、全国に向けたサービス設計と将来のYorisou標準に反映していきます。
            </p>
            <div className="mt-6">
              <Link href="/pilot" className="btn btn-secondary">
                導入・実証の考え方を見る
              </Link>
            </div>
          </div>

          <div className="grid gap-5">
            {lowerCards.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-[#D6C3A3]/32 bg-[#FCFAF6] p-6">
                <h3 className="text-2xl font-light leading-tight">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
                <div className="mt-5">
                  <Link href={item.href} className="btn btn-secondary">
                    {item.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
