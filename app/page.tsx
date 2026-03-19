import Link from "next/link";

import InsightsPreview from "./components/InsightsPreview";

const trustPoints = [
  "ご本人・ご家族向けの移動相談",
  "地域・施設単位での小規模実証設計",
  "導入後まで見据えた運用整理",
];

const serviceCards = [
  {
    title: "モビリティ相談",
    text: "どの手段が日常導線に合うかを、歩行状況、利用環境、ご家族の安心まで含めて整理します。",
    href: "/ai-advisor",
    cta: "相談を始める",
  },
  {
    title: "地域導入・実証支援",
    text: "自治体、施設、地域事業者と連携し、小規模な実証から現実的な運用モデルを設計します。",
    href: "/services",
    cta: "支援内容を見る",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="relative overflow-hidden border-b border-[#D6C3A3]/30 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.84),_rgba(245,241,232,0.96)_58%)]">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/60 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="shell-card p-8 md:p-12">
            <div className="eyebrow">Senior-Friendly Mobility / Japan</div>
            <h1 className="mt-4 text-4xl font-light leading-tight md:text-6xl">
              ご本人にも、ご家族にも、
              <span className="block text-[#6B5A4A]">納得しやすい移動の選び方を。</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisouは、高齢社会の移動に向き合う地域モビリティブランドです。
              まずは個別のモビリティ相談から始め、必要に応じて試乗、地域実証、運用整理までつなげます。
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6B5A4A] md:text-base">
              迷った段階でも大丈夫です。最初の相談では、利用者像と日常の移動場面をやさしく整理します。
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/ai-advisor" className="btn btn-primary">
                AI相談を始める
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                個別相談・お問い合わせ
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {trustPoints.map((item) => (
                <div key={item} className="rounded-full border border-[#D6C3A3]/35 bg-[#FCFAF6] px-4 py-2 text-sm text-[#5A4B3E]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-[#D6C3A3]/35 bg-white/85 p-7 shadow-[0_24px_60px_rgba(59,47,47,0.06)]">
              <div className="eyebrow">こんなときに</div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl bg-[#FCFAF6] px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                  親の通院や買い物の移動が負担になってきた。
                </div>
                <div className="rounded-2xl bg-[#FCFAF6] px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                  どのモビリティが合うのか、価格だけでは判断しづらい。
                </div>
                <div className="rounded-2xl bg-[#FCFAF6] px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                  地域や施設で小規模に導入検証したいが、進め方が見えにくい。
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-7 shadow-sm">
              <div className="eyebrow">Yorisouの考え方</div>
              <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">
                乗り物の比較だけではなく、生活導線、家族負担、説明のしやすさ、導入後の運用まで含めて移動を整えることを重視しています。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/30 bg-white/50 px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <div className="eyebrow">What Yorisou Offers</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">入口は相談から。必要に応じて、地域実装まで支援します。</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {serviceCards.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/80 p-6 shadow-sm">
                <h3 className="text-2xl font-light">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
                <div className="mt-6">
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

      <section className="border-t border-[#D6C3A3]/30 bg-white/50 px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#D6C3A3]/40 bg-white/75 p-8 shadow-[0_20px_60px_rgba(59,47,47,0.06)] backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="eyebrow">For Organizations</div>
              <h2 className="mt-3 text-3xl font-light leading-tight">地域導入や実証設計については、別途ご相談ください。</h2>
              <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
                自治体、施設、医療・福祉関係者向けの実証支援や運用設計は、お問い合わせベースでご案内しています。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn btn-primary">
                お問い合わせ
              </Link>
              <Link href="/pilot" className="btn btn-secondary">
                実証実験を見る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
