import Link from "next/link";

import InsightsPreview from "./components/InsightsPreview";

const trustPoints = [
  "ご本人・ご家族向けの相談起点",
  "福岡での実証と運用検証",
  "インサイトを活かした継続改善",
];

const entryCards = [
  {
    eyebrow: "Service Entry",
    title: "モビリティ相談",
    text: "シニアの方、ご家族、支援者向けの入口です。歩行状況、外出目的、家族の不安、導入後の使い続けやすさまで整理しながら、合う選択肢を一緒に見ていきます。",
    href: "/ai-advisor",
    cta: "相談を始める",
  },
  {
    eyebrow: "Solution / Pilot",
    title: "導入・実証",
    text: "自治体、施設、地域事業者向けの入口です。福岡での検証知見をもとに、導入前設計、小規模実証、運用評価、次段階判断までを支援します。",
    href: "/services",
    cta: "導入・実証を見る",
  },
  {
    eyebrow: "Insights",
    title: "インサイト",
    text: "高齢社会、地域交通、介護・福祉周辺の動きを、Yorisouの視点で読み解く編集レイヤーです。単なるニュース一覧ではなく、事業とサービスの判断材料として位置づけています。",
    href: "/insights",
    cta: "インサイトを見る",
  },
];

const serviceFlow = [
  {
    title: "相談から始める",
    text: "いきなり売り込むのではなく、日常の移動場面とご本人・ご家族の優先条件を整理します。",
  },
  {
    title: "合う手段を見極める",
    text: "外部製品や地域の運用条件も含め、今の暮らしに合う選択肢を比較しやすい形にします。",
  },
  {
    title: "使い続ける支援へつなぐ",
    text: "導入後の使い方、ご家族との共有、継続サポートの考え方まで整え、将来の会員向け支援基盤にもつなげていきます。",
  },
];

const pilotPoints = [
  "利用者像と家族受容の確認",
  "現場オペレーションの成立性検証",
  "継続利用の障壁と改善ポイントの抽出",
  "将来のYorisou標準設計への反映",
];

const evolutionSteps = [
  {
    title: "現時点",
    text: "日本のシニア移動に合う外部ソリューションを見極め、相談と実証を通じて適合性を確認しています。",
  },
  {
    title: "検証の蓄積",
    text: "福岡での利用実態、家族の受け止め方、地域運用の難所、継続支援の要件を継続的に学習します。",
  },
  {
    title: "長期の方向性",
    text: "蓄積した知見をもとに、Yorisouとして一貫した選定基準、支援体験、将来的なブランド標準へとまとめていきます。",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="relative overflow-hidden border-b border-[#D6C3A3]/30 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.84),_rgba(245,241,232,0.96)_58%)]">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/60 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="shell-card p-8 md:p-12">
            <div className="eyebrow">Senior Mobility Platform / Japan</div>
            <h1 className="mt-4 text-4xl font-light leading-tight md:text-6xl">
              高齢者とご家族のための移動を、
              <span className="block text-[#6B5A4A]">相談から整える。</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisouは、日本の高齢社会に向けたモビリティサービスプラットフォームです。
              ご本人・ご家族向けの相談支援を中心に、福岡での実証検証とインサイト分析を重ねながら、
              納得しやすく、続けやすい移動のかたちを育てています。
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6B5A4A] md:text-base">
              入口は相談です。選定、試用、地域導入、継続支援までを一つの流れとして設計し、
              将来的なYorisou標準の土台をつくっていきます。
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/ai-advisor" className="btn btn-primary">
                AI相談を始める
              </Link>
              <Link href="/about" className="btn btn-secondary">
                Yorisouについて
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
              <div className="eyebrow">Platform Structure</div>
              <div className="mt-4 grid gap-4">
                <div className="rounded-2xl bg-[#FCFAF6] px-5 py-5">
                  <h2 className="text-lg font-medium">Core 1 | モビリティサービス</h2>
                  <p className="mt-2 text-sm leading-7 text-[#5A4B3E]">
                    相談、比較整理、家族との意思決定支援、導入後支援までを一つの流れで整えます。
                  </p>
                </div>
                <div className="rounded-2xl bg-[#FCFAF6] px-5 py-5">
                  <h2 className="text-lg font-medium">Core 2 | Aging &amp; Mobility Intelligence</h2>
                  <p className="mt-2 text-sm leading-7 text-[#5A4B3E]">
                    インサイト、ニュース分析、地域運用知見を蓄積し、サービス設計と将来の商品標準に返す知的基盤。
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-7 shadow-sm">
              <div className="eyebrow">Fukuoka Pilot Base</div>
              <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">
                福岡は単なる紹介事例ではなく、相談体験、受容性、運用フロー、継続支援の成立性を確かめる戦略的な検証拠点です。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/30 bg-white/50 px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <div className="eyebrow">Start Here</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">3つの入口から、Yorisouの全体像をわかりやすく。</h2>
            <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
              はじめて訪れる方が、相談したいのか、導入や実証を検討しているのか、社会的な論点を知りたいのかで迷わない構成にしています。
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {entryCards.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/80 p-6 shadow-sm">
                <div className="eyebrow">{item.eyebrow}</div>
                <h3 className="mt-3 text-2xl font-light">{item.title}</h3>
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

      <section className="border-b border-[#D6C3A3]/30 bg-[#FCFAF6] px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <div className="eyebrow">Service Continuity</div>
              <h2 className="mt-3 text-3xl font-light leading-tight">相談して終わりではなく、使い続ける支援の土台へ。</h2>
              <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
                今は相談と個別サポートが中心ですが、今後はご家族との情報共有や継続利用の見守りも含めた
                Yorisouの会員向け支援基盤へ発展させる前提で、サービス体験を組み立てています。
              </p>
            </div>
            <div className="grid gap-4">
              {serviceFlow.map((item, index) => (
                <div key={item.title} className="rounded-[1.5rem] border border-[#D6C3A3]/35 bg-white/85 p-5 shadow-sm">
                  <div className="text-sm tracking-[0.18em] text-[#8A7764]">STEP 0{index + 1}</div>
                  <h3 className="mt-2 text-xl font-light">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <InsightsPreview locale="ja" />

      <section className="border-t border-[#D6C3A3]/30 bg-white/50 px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
          <div className="rounded-[2rem] border border-[#D6C3A3]/40 bg-white/75 p-8 shadow-[0_20px_60px_rgba(59,47,47,0.06)] backdrop-blur">
            <div className="eyebrow">Why Fukuoka</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">福岡を、全国展開前の検証基地として位置づけています。</h2>
            <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
              Yorisouは福岡を、地域課題の現実と都市圏の生活導線が交差する場所として捉えています。
              ここで利用者の反応、ご家族の納得感、現場運用、地域連携の成立条件を確認し、
              サービス標準と今後のブランド設計に返しています。
            </p>
            <div className="mt-6">
              <Link href="/pilot" className="btn btn-secondary">
                導入・実証の考え方を見る
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {pilotPoints.map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] px-5 py-4 text-sm leading-7 text-[#5A4B3E]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#D6C3A3]/30 bg-[#F7F2E9] px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#D6C3A3]/40 bg-white/80 p-8 shadow-[0_20px_60px_rgba(59,47,47,0.06)] backdrop-blur md:p-10">
          <div className="max-w-3xl">
            <div className="eyebrow">Brand Evolution</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">検証済みの選定支援から、Yorisouらしい標準へ。</h2>
            <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
              現時点でYorisouは、外部の製品やサービスを含めて最適な選択肢を検討する段階にあります。
              ただし目指しているのは、選定代行のまま留まることではありません。実証と相談で蓄積した知見をもとに、
              日本の高齢者移動に必要な要件をYorisouとして統合し、将来的なブランド標準へつなげていきます。
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {evolutionSteps.map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-5">
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
