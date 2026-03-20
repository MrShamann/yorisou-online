import Link from "next/link";

import InsightsPreview from "./components/InsightsPreview";

const trustPoints = [
  "ご本人にも、ご家族にも相談しやすい入口です。",
  "比較だけでなく、導入後の不安まで見据えて支えます。",
  "福岡での検証知見を、全国に向けた設計へ返しています。",
];

const supportFlow = [
  {
    title: "まず困りごとを整える",
    text: "歩く距離や外出先、ご家族の心配ごとまで落ち着いて確認し、いま何から考えるべきかを見える形にします。",
  },
  {
    title: "合う移動を比べる",
    text: "急いで決めるのではなく、生活導線、使いやすさ、ご家族の納得感まで含めて候補を整えます。",
  },
  {
    title: "その後も相談しやすくする",
    text: "試乗や個別相談、導入後の見直しまでつながる前提で、支援の流れを静かに整えています。",
  },
];

const lowerItems = [
  "福岡は、受容性や運用の成立を確かめる検証拠点です。",
  "地域導入の相談も、続くかどうかを見極める実務支援として行っています。",
  "将来はYorisou標準へつながる学びを、ここから積み上げていきます。",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="relative overflow-hidden border-b border-[#D6C3A3]/22 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.94),_rgba(245,241,232,0.98)_60%)]">
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/70 to-transparent" />
        <div className="mx-auto max-w-6xl px-6 py-18 md:px-10 md:py-26">
          <div className="shell-card max-w-4xl p-8 md:p-12">
            <h1 className="text-4xl font-light leading-tight md:text-6xl">
              移動のことを、
              <span className="block text-[#6B5A4A]">安心して話し始められる場所へ。</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisouは、高齢者とご家族のためのモビリティサービスです。まずは相談から始め、
              比較や個別相談、導入後の見直しまで無理なくつながる入口を整えています。
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/ai-advisor" className="btn btn-primary">
                AI相談を始める
              </Link>
              <Link href="/services" className="btn btn-secondary">
                サービスを見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/20 bg-white/58 px-6 py-6 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-3 md:grid-cols-3">
          {trustPoints.map((item) => (
            <div key={item} className="text-sm leading-7 text-[#5A4B3E]">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/22 bg-[#FBF7F0] px-6 py-16 md:px-10 md:py-18">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <h2 className="text-3xl font-light leading-tight">Yorisouがしていること</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5A4B3E] md:text-base">
              製品の話から急いで始めるのではなく、暮らしの中で困る場面を整理し、その先も相談しやすい流れへつないでいきます。
            </p>
            <div className="mt-8 space-y-5">
              {supportFlow.map((item, index) => (
                <div key={item.title} className="border-t border-[#D6C3A3]/28 pt-5 first:border-t-0 first:pt-0">
                  <div className="text-xs tracking-[0.18em] text-[#8A7764]">0{index + 1}</div>
                  <h3 className="mt-2 text-2xl font-light">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#D6C3A3]/30 bg-white/82 p-7 shadow-[0_24px_60px_rgba(59,47,47,0.06)]">
            <h3 className="text-2xl font-light leading-tight">相談は、一度きりで終わる前提ではありません。</h3>
            <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">
              いまはAI相談と個別フォローが中心ですが、ご家族との共有や導入後の見直しにもつながる支援体験を目指しています。
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <div className="rounded-2xl bg-[#FCFAF6] px-4 py-3 text-sm text-[#5A4B3E]">相談内容の見返し</div>
              <div className="rounded-2xl bg-[#FCFAF6] px-4 py-3 text-sm text-[#5A4B3E]">ご家族との共有メモ</div>
              <div className="rounded-2xl bg-[#FCFAF6] px-4 py-3 text-sm text-[#5A4B3E]">導入後のフォロー</div>
            </div>
            <p className="mt-4 text-xs leading-6 text-[#8A7764]">継続支援エリアや家族連携機能は、今後の実装対象です。</p>
          </div>
        </div>
      </section>

      <InsightsPreview locale="ja" />

      <section className="border-t border-[#D6C3A3]/22 bg-white/46 px-6 py-16 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.96fr]">
          <div>
            <h2 className="text-3xl font-light leading-tight">福岡で確かめていることを、これからの標準設計へ返しています。</h2>
            <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
              Yorisouは福岡で、利用者の反応、ご家族の受容、現場運用、地域連携の成立条件を確かめています。
              その学びを、全国に向けたサービス設計と将来のYorisou標準へ反映していきます。
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/pilot" className="btn btn-secondary">
                導入・実証の考え方を見る
              </Link>
              <Link href="/about" className="btn btn-secondary">
                Yorisouについて
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {lowerItems.map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-[#D6C3A3]/28 bg-[#FCFAF6] px-5 py-4 text-sm leading-7 text-[#5A4B3E]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
