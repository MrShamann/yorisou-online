import Link from "next/link";

import InsightsPreview from "./components/InsightsPreview";
import LineBrandIcon from "./components/LineBrandIcon";

const trustPoints = [
  "ご本人・ご家族・施設担当者、それぞれの不安を整理できます。",
  "比較だけでなく、導入後の続けやすさまで一緒に考えます。",
  "福岡での検証知見をもとに、落ち着いた相談導線を整えています。",
];

const serviceCards = [
  {
    title: "まず状況をゆっくり確認",
    body: "歩ける距離、外出先、ご家族の負担感、いま困っている場面を落ち着いて伺います。",
  },
  {
    title: "選択肢を比べて整理",
    body: "電動カート、移動手段、導入の相談先まで、暮らしに合う順番で見比べられます。",
  },
  {
    title: "導入後の不安も伴走",
    body: "ご家族への共有やフォローアップを通じて、導入後の不安も一つずつ減らしていきます。",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F0E5] text-[#312321]">
      <section className="relative overflow-hidden border-b border-[#D8C6B4]/30 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.96),_rgba(247,240,229,0.98)_58%)]">
        <div className="absolute inset-y-0 right-0 hidden w-[34%] rounded-l-[7rem] bg-[#EFE4D6] lg:block" />
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative z-10">
            <div className="service-kicker">Mobility consultation for senior care</div>
            <h1 className="display-serif mt-5 text-5xl leading-[1.14] md:text-7xl">
              まずは、
              <span className="block text-[#7A6150]">移動のことを静かに整えるところから。</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-[#665651]">
              Yorisouは、高齢者とご家族のための移動相談サービスです。いきなり決めるのではなく、外出の不安や暮らしの変化を丁寧に聞きながら、無理のない選択肢を一緒に整えていきます。
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link href="/login" className="btn btn-primary bg-[#06C755] shadow-[0_18px_34px_rgba(6,199,85,0.22)]">
                <LineBrandIcon className="h-5 w-5" />
                LINEで相談を続ける
              </Link>
              <Link href="/ai-advisor" className="btn btn-primary">
                相談をはじめる
              </Link>
              <Link href="/products" className="btn btn-secondary">
                製品を見る
              </Link>
            </div>
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
                <div className="service-kicker text-white/70">Yorisou support flow</div>
                <h2 className="display-serif mt-4 text-3xl leading-tight md:text-4xl">
                  ご本人にも、ご家族にも、
                  <span className="block">今の暮らしに合う移動を。</span>
                </h2>
                <p className="mt-5 max-w-md text-sm leading-8 text-white/82 md:text-base">
                  見積もりの前に状況を整理し、必要に応じてご家族とも共有しながら、導入や比較の負担を軽くする相談導線を整えています。
                </p>
                <div className="mt-8 rounded-[1.8rem] bg-white/12 px-5 py-5 backdrop-blur">
                  <div className="text-sm text-white/70">相談の進み方</div>
                  <div className="mt-3 grid gap-3 text-sm leading-7 text-white/90">
                    <div>1. いま困っている外出や移動を確認</div>
                    <div>2. 合いそうな選択肢を整理して比較</div>
                    <div>3. ご家族共有・導入後の不安まで支援</div>
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
            <div className="service-kicker">How Yorisou helps</div>
            <h2 className="display-serif mt-4 text-4xl leading-tight md:text-5xl">こんなふうにお手伝いします</h2>
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
              <div className="service-kicker text-[#55705C]">Field learning in Fukuoka</div>
              <h2 className="display-serif mt-4 text-4xl leading-tight md:text-5xl">
                福岡で確かめながら、
                <span className="block">支え方を育てています。</span>
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#51614E]">
                Yorisouは福岡で、利用者の受け止め方、ご家族の納得感、現場で続く運用の成立性を確かめています。ここでの学びを、これからの支え方へ静かに返していきます。
              </p>
              <div className="mt-7 flex flex-col gap-4 sm:flex-row">
                <Link href="/pilot" className="btn btn-primary">
                  導入・実証の考え方を見る
                </Link>
                <Link href="/services" className="btn btn-secondary">
                  支援内容を見る
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/60 bg-white/68 p-6 shadow-[0_16px_30px_rgba(47,35,33,0.06)]">
              <div className="service-kicker">Trust signals</div>
              <div className="mt-4 grid gap-4 text-sm leading-7 text-[#5B514A]">
                <div className="rounded-[1.4rem] bg-[#FFF9F2] px-5 py-4">家族共有メモやフォローアップを一つの画面で確認できます。</div>
                <div className="rounded-[1.4rem] bg-[#FFF9F2] px-5 py-4">LINEから続ける導線と、メールでの継続導線を両方用意しています。</div>
                <div className="rounded-[1.4rem] bg-[#FFF9F2] px-5 py-4">比較・導入・導入後の見直しまで、単発で終わらない相談体験を目指しています。</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
