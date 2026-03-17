import Link from "next/link";

const issues = [
  {
    title: "短距離移動の空白",
    text: "徒歩では負担が大きく、既存交通では過剰となる短距離移動が地域内に数多く存在します。",
  },
  {
    title: "分断された生活導線",
    text: "商店街、公共施設、医院、地域拠点のあいだを無理なく移動できる仕組みが不足しています。",
  },
  {
    title: "通院・ケア移動の負担",
    text: "通院や付き添いに伴う移動負担は、本人・家族・支援者のすべてに影響します。",
  },
];

const approaches = [
  {
    title: "小規模",
    text: "限定された地域単位で始めることで、合意形成と運用管理を丁寧に行います。",
  },
  {
    title: "安全性",
    text: "ルール、点検、記録、研修を標準化し、予防型の安全管理を重視します。",
  },
  {
    title: "検証可能性",
    text: "実証結果を定量・定性の両面から記録し、次段階の判断材料にします。",
  },
];

const serviceLayers = [
  {
    title: "企画設計支援",
    text: "課題整理、導線設計、評価指標の設計",
  },
  {
    title: "実証運用支援",
    text: "運用手順整備、現場調整、関係者連携",
  },
  {
    title: "評価・次段階設計",
    text: "報告、改善提案、次段階計画の整理",
  },
];

const flowSteps = ["相談", "設計", "実行", "評価", "報告"];

const partners = [
  {
    title: "自治体",
    text: "政策整合性と公共性の調整",
  },
  {
    title: "介護・福祉施設",
    text: "利用者の日常動線に沿った移動設計",
  },
  {
    title: "医療機関",
    text: "通院動線と時間調整を踏まえた設計",
  },
  {
    title: "地域企業",
    text: "継続運用に向けた実務支援",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/50 to-transparent" />
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <div className="max-w-4xl rounded-[2.5rem] border border-[#D6C3A3]/40 bg-white/70 p-8 shadow-[0_24px_70px_rgba(59,47,47,0.08)] backdrop-blur md:p-12">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">福岡発・地域モビリティ実証</div>
            <h1 className="mt-4 text-4xl font-light leading-tight md:text-6xl">
              高齢社会の移動を、
              <span className="block text-[#6B5A4A]">福岡から再設計する。</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisouは、福岡を起点に、高齢社会における地域内移動の課題に向き合う実証型プロジェクトです。
              小規模な実証を通じて、安全性・継続性・地域適合性を検証し、自治体・地域機関・民間施設と連携可能な移動モデルの構築を目指します。
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="rounded-2xl bg-[#3B2F2F] px-6 py-3 text-center text-sm text-white shadow-sm transition hover:opacity-90"
              >
                お問い合わせ
              </Link>
              <Link
                href="/pilot"
                className="rounded-2xl border border-[#3B2F2F]/20 bg-white/70 px-6 py-3 text-center text-sm transition hover:bg-white"
              >
                実証実験を見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#D6C3A3]/30 bg-white/50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="mb-8 max-w-3xl">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">課題</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">
              日常の短距離移動には、まだ実務的な空白が残っています
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {issues.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-6 shadow-sm">
                <h3 className="text-xl font-light">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#D6C3A3]/30 bg-[#F8F4EC]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="mb-8 max-w-3xl">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">アプローチ</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">小規模・安全重視・検証可能</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {approaches.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/70 p-6 shadow-sm">
                <h3 className="text-xl font-light">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#D6C3A3]/30 bg-white/50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="mb-8 max-w-3xl">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">事業内容</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">導入段階に応じた3つの支援レイヤー</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {serviceLayers.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-6 shadow-sm">
                <h3 className="text-xl font-light">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/services"
              className="rounded-2xl border border-[#3B2F2F]/20 bg-white/70 px-6 py-3 text-sm transition hover:bg-white"
            >
              事業内容を見る
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[#D6C3A3]/30 bg-[#F8F4EC]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="mb-8 max-w-3xl">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">実証フロー</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">実証プログラムの基本フロー（5段階）</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {flowSteps.map((step, index) => (
              <div key={step} className="rounded-[1.5rem] border border-[#D6C3A3]/35 bg-white/70 p-5 shadow-sm">
                <div className="text-xs tracking-[0.18em] text-[#8A7764]">STEP {index + 1}</div>
                <div className="mt-3 text-xl font-light">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#D6C3A3]/30 bg-white/50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="mb-8 max-w-3xl">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">連携先</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">地域の関係主体との連携</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {partners.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-6 shadow-sm">
                <h3 className="text-xl font-light">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/partners"
              className="rounded-2xl border border-[#3B2F2F]/20 bg-white/70 px-6 py-3 text-sm transition hover:bg-white"
            >
              連携を見る
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#D6C3A3]/40 bg-white/70 p-8 shadow-[0_20px_60px_rgba(59,47,47,0.06)] backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-light leading-tight">
                地域の条件や制約に応じた実証のご相談から対応しています。
              </h2>
            </div>
            <Link
              href="/contact"
              className="rounded-2xl bg-[#3B2F2F] px-6 py-3 text-center text-sm text-white shadow-sm transition hover:opacity-90"
            >
              お問い合わせへ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
