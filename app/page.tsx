import Link from "next/link";

import InsightsPreview from "./components/InsightsPreview";

const trustPoints = [
  "ご本人にも、ご家族にも相談しやすい入口です。",
  "比較だけでなく、導入後の不安まで見据えて支えます。",
  "福岡での検証知見を、全国に向けた設計へ返しています。",
];

const supportFlow = [
  {
    title: "困りごとを落ち着いてうかがいます",
    text: "歩く距離や外出先、ご家族の心配ごとまで確認し、いま何から考えるべきかを見える形にします。",
  },
  {
    title: "合う移動を一緒に比べます",
    text: "急いで決めるのではなく、生活導線、使いやすさ、ご家族の納得感まで含めて候補を整えます。",
  },
  {
    title: "その後も相談しやすく整えます",
    text: "試乗や個別相談、導入後の見直しまでつながる前提で、無理のない支え方を考えています。",
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
              移動のこと、
              <span className="block text-[#6B5A4A]">まずはゆっくりお聞かせください。</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisouは、高齢者とご家族のための移動相談サービスです。急いで決めるのではなく、
              暮らしに合う移動を一緒に整え、その先の見直しまで静かにつないでいきます。
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
        <div className="mx-auto max-w-6xl rounded-[2.25rem] border border-[#D6C3A3]/28 bg-white/78 p-7 shadow-[0_24px_60px_rgba(59,47,47,0.05)] md:p-10">
          <h2 className="text-3xl font-light leading-tight">こんなふうにお手伝いします</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5A4B3E] md:text-base">
            まず困りごとをうかがい、合う移動を一緒に比べ、必要に応じてご家族とも共有しながら、その後の見直しまで相談しやすい流れを整えます。
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {supportFlow.map((item) => (
              <div key={item.title} className="rounded-[1.8rem] bg-[#FCFAF6] px-5 py-6">
                <h3 className="text-2xl font-light">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-[#6B5A4A]">
            いまはAI相談と個別フォローが中心ですが、相談内容の見返しやご家族との共有にもつながる支援体験を目指しています。
          </p>
        </div>
      </section>

      <InsightsPreview locale="ja" />

      <section className="border-t border-[#D6C3A3]/22 bg-white/46 px-6 py-16 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.96fr]">
          <div>
            <h2 className="text-3xl font-light leading-tight">福岡で確かめたことを、これからの支え方へ返しています。</h2>
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
