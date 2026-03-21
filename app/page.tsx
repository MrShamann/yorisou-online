import Link from "next/link";

import InsightsPreview from "./components/InsightsPreview";

const trustPoints = [
  "ご本人にも、ご家族にも相談しやすく",
  "比較から導入後の不安まで見据えて",
  "福岡での検証知見も支援設計に活かします",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="relative overflow-hidden border-b border-[#D6C3A3]/22 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.94),_rgba(245,241,232,0.98)_60%)]">
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/70 to-transparent" />
        <div className="mx-auto max-w-6xl px-6 py-18 md:px-10 md:py-26">
          <div className="shell-card max-w-4xl p-8 md:p-12">
            <h1 className="text-4xl font-light leading-tight md:text-6xl">
              まずは、
              <span className="block text-[#6B5A4A]">移動のことをゆっくりお聞かせください。</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisouは、高齢者とご家族のための移動相談サービスです。
              いきなり決めるのではなく、いまの暮らしに合う移動のかたちを、相談から静かに整えていきます。
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link href="/ai-advisor" className="btn btn-primary">
                相談する
              </Link>
              <Link href="/products" className="btn btn-secondary">
                製品を見る
              </Link>
              <Link href="/support" className="btn btn-secondary">
                サポートページへ
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
          <div className="mt-8 space-y-5 border-t border-[#D6C3A3]/26 pt-6">
            <p className="text-base leading-8 text-[#5A4B3E]">
              まずは、歩く距離や外出先、ご家族の心配ごとまで落ち着いてうかがいます。
            </p>
            <p className="text-base leading-8 text-[#5A4B3E]">
              そのうえで、急いで決めるのではなく、暮らしに合う移動を一緒に比べていきます。
            </p>
            <p className="text-base leading-8 text-[#5A4B3E]">
              必要に応じてご家族にも共有しながら、試乗や個別相談、導入後の見直しへつながる支え方を整えます。
            </p>
          </div>
          <div className="mt-8 rounded-[1.5rem] border border-[#D6C3A3]/28 bg-[#FCFAF6] px-5 py-5">
            <div className="text-sm leading-7 text-[#6B5A4A]">
              まず相談し、合う製品を見比べながら、その後はサポートページで振り返れる形を準備しています。
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link href="/ai-advisor" className="btn btn-secondary">
                まず相談する
              </Link>
              <Link href="/products" className="btn btn-secondary">
                製品を見る
              </Link>
              <Link href="/support" className="btn btn-secondary">
                サポートページへ
              </Link>
            </div>
          </div>
        </div>
      </section>

      <InsightsPreview locale="ja" />

      <section className="border-t border-[#D6C3A3]/22 bg-white/46 px-6 py-16 md:px-10">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-[#D6C3A3]/28 bg-[#FCFAF6]/82 p-7 shadow-[0_18px_46px_rgba(59,47,47,0.04)] md:p-10">
          <h2 className="text-3xl font-light leading-tight">福岡で確かめながら、支え方を育てています</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#5A4B3E] md:text-base">
            Yorisouは福岡で、利用者の受け止め方、ご家族の納得感、現場で続く運用の成立性を確かめています。
            ここでの学びを、これからの支え方へ静かに返していきます。
          </p>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#6B5A4A] md:text-base">
            自治体、施設、地域事業者向けには、単発の実証ではなく、継続可能な導入判断につながる支援も行っています。
          </p>
          <div className="mt-6">
            <Link href="/pilot" className="btn btn-secondary">
              導入・実証の考え方を見る
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
