import Link from "next/link";

import InsightsPreview from "./components/InsightsPreview";

const trustPoints = [
  "ご本人・ご家族向けの相談入口",
  "導入後の使い方まで見据えた支援設計",
  "福岡での検証知見をサービス改善に反映",
];

const journeySteps = [
  {
    step: "01",
    title: "まず相談する",
    text: "歩く距離、外出先、ご家族の心配ごとなどを落ち着いて整理し、いま何が必要かを見える形にします。",
  },
  {
    step: "02",
    title: "合う移動手段を比べる",
    text: "候補を急いで決めるのではなく、生活導線、使いやすさ、ご家族の納得感まで含めて比較しやすく整えます。",
  },
  {
    step: "03",
    title: "導入後の支え方を準備する",
    text: "使い始めたあとに困りやすい点や共有したい情報を見据え、継続支援につながる準備を進めます。",
  },
];

const entryCards = [
  {
    eyebrow: "For Seniors & Families",
    title: "モビリティ相談",
    text: "AI相談を入口に、ご本人・ご家族それぞれの状況を整理します。はじめの相談から、その後の比較や試乗相談までつながるサービス入口です。",
    href: "/ai-advisor",
    cta: "相談を始める",
  },
  {
    eyebrow: "For Ongoing Support",
    title: "継続支援の考え方",
    text: "相談履歴、ご家族との共有、導入後の確認などを将来の支援エリアにまとめていく前提で、今のサービス導線を設計しています。",
    href: "/services",
    cta: "支援の流れを見る",
  },
  {
    eyebrow: "For Organizations",
    title: "導入・実証",
    text: "自治体、施設、地域事業者向けに、福岡での検証知見をもとにした導入設計、小規模実証、運用判断を支援します。",
    href: "/pilot",
    cta: "導入・実証を見る",
  },
];

const continuityCards = [
  {
    title: "相談内容を蓄積していく",
    text: "いまは個別相談が中心ですが、今後はおすすめ内容や確認事項を継続的に見返せる形へ広げていく予定です。",
  },
  {
    title: "ご家族と共有しやすくする",
    text: "ご本人だけで決めきれない場面でも、相談の要点や次の確認事項を家族で共有しやすい支援体験を目指しています。",
  },
  {
    title: "導入後のフォローへつなぐ",
    text: "使い始めてから見えてくる不安や調整ポイントにも向き合えるよう、継続支援の土台を先に整えています。",
  },
];

const supportShellItems = [
  "相談履歴・提案内容の確認",
  "ご家族との共有メモ",
  "試乗・個別相談のフォロー",
  "継続支援エリア（準備中）",
];

const pilotPoints = [
  "利用者像と家族受容の確認",
  "現場オペレーションの成立性検証",
  "継続利用の障壁と改善ポイントの抽出",
  "将来のYorisou標準設計への反映",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="relative overflow-hidden border-b border-[#D6C3A3]/30 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.88),_rgba(245,241,232,0.98)_58%)]">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/60 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="shell-card p-8 md:p-12">
            <div className="eyebrow">Senior Mobility Support / Japan</div>
            <h1 className="mt-4 text-4xl font-light leading-tight md:text-6xl">
              移動の相談を、
              <span className="block text-[#6B5A4A]">その後の支え方までつながる入口に。</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisouは、高齢者とご家族のためのモビリティサービスです。まずは相談から始め、
              合う移動手段の整理、試乗や個別相談、導入後の支援までを一つの流れとして育てています。
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6B5A4A] md:text-base">
              今後は、ご家族との共有や継続サポートにもつながる支援基盤へ広げていく前提で、
              いまの相談体験そのものを整えています。
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/ai-advisor" className="btn btn-primary">
                AI相談を始める
              </Link>
              <Link href="/services" className="btn btn-secondary">
                サービスの流れを見る
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
              <div className="eyebrow">Start Here</div>
              <h2 className="mt-4 text-2xl font-light leading-tight">はじめての方でも、まず一歩目がわかる構成です。</h2>
              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl bg-[#FCFAF6] px-5 py-4 text-sm leading-7 text-[#5A4B3E]">
                  相談で状況を整理し、必要なら試乗や個別相談へ。
                </div>
                <div className="rounded-2xl bg-[#FCFAF6] px-5 py-4 text-sm leading-7 text-[#5A4B3E]">
                  ご家族の不安や確認したい点も一緒に扱います。
                </div>
                <div className="rounded-2xl bg-[#FCFAF6] px-5 py-4 text-sm leading-7 text-[#5A4B3E]">
                  導入後の使い方や継続支援へつながる前提で提案します。
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-7 shadow-sm">
              <div className="eyebrow">Fukuoka Pilot Base</div>
              <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">
                福岡は紹介用の地域ではなく、相談体験、受容性、継続支援、地域導入の成立性を確かめる検証拠点です。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/30 bg-white/55 px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <div className="eyebrow">Service Journey</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">相談から導入後まで、移動支援をつなげて考えます。</h2>
            <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
              いきなり製品の話から始めるのではなく、暮らしの中で困る場面を整理し、その後の使い続けやすさまで見据えて支援します。
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {journeySteps.map((item) => (
              <div key={item.step} className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/85 p-6 shadow-sm">
                <div className="text-sm tracking-[0.18em] text-[#8A7764]">STEP {item.step}</div>
                <h3 className="mt-3 text-2xl font-light">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/30 bg-[#FCFAF6] px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <div className="eyebrow">Choose Your Entry</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">いま必要な入口から、Yorisouを使い始められます。</h2>
            <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
              ご本人・ご家族の相談、これからの継続支援の考え方、地域導入や実証。目的に応じて無理なく入り口を選べます。
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

      <section className="border-b border-[#D6C3A3]/30 bg-white/60 px-6 py-16 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <div className="eyebrow">Service Continuity</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">相談した内容が、その後の支援につながる設計へ。</h2>
            <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
              Yorisouは、単発の相談受付ではなく、相談内容を起点にした継続支援サービスを目指しています。
              いまは相談と個別フォローが中心ですが、その先に家族共有や履歴確認もつながる形を準備しています。
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {continuityCards.map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-5">
                <h3 className="text-xl font-light">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/30 bg-[#F7F2E9] px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#D6C3A3]/40 bg-white/80 p-8 shadow-[0_20px_60px_rgba(59,47,47,0.06)] backdrop-blur md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
            <div>
              <div className="eyebrow">Future Support Area</div>
              <h2 className="mt-3 text-3xl font-light leading-tight">継続支援エリアを、今後のサービス基盤として準備しています。</h2>
              <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
                まだ会員機能やLINE連携は実装していませんが、Yorisouは相談後も支援が続く前提で設計を進めています。
                将来的には、相談内容の見返し、ご家族との共有、提案の蓄積、フォローアップを一つの支援エリアにまとめていく予定です。
              </p>
              <div className="mt-6">
                <Link href="/ai-advisor" className="btn btn-secondary">
                  まずは相談から始める
                </Link>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-6">
              <div className="text-sm tracking-[0.18em] text-[#8A7764]">準備中の機能イメージ</div>
              <div className="mt-5 grid gap-3">
                {supportShellItems.map((item) => (
                  <div key={item} className="rounded-2xl border border-[#D6C3A3]/30 bg-white/85 px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-[#8A7764]">
                現在は構想段階です。実際のログイン機能や家族連携機能は今後の実装対象です。
              </p>
            </div>
          </div>
        </div>
      </section>

      <InsightsPreview locale="ja" />

      <section className="border-t border-[#D6C3A3]/30 bg-white/50 px-6 py-16 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.98fr_1.02fr]">
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
    </main>
  );
}
