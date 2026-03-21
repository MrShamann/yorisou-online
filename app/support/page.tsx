import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Yorisou | サポートページ",
  description:
    "Yorisouの継続支援ページです。相談履歴、ご提案内容の確認、ご家族との共有、継続相談の流れを今後まとめて見返せるよう準備しています。",
};

const futureSections = [
  {
    title: "相談履歴",
    body: "AI相談や個別相談で整理した内容を、あとから落ち着いて見返せるようにする予定です。",
  },
  {
    title: "ご提案内容の確認",
    body: "比較した候補や確認事項を一か所にまとめ、ご本人にもご家族にも分かりやすく整えていきます。",
  },
  {
    title: "ご家族との共有",
    body: "離れて暮らすご家族とも、相談内容や次の確認事項を共有しやすい形を準備しています。",
  },
  {
    title: "継続相談・見直し",
    body: "導入後に気になったことや見直したい点も、継続して相談しやすい流れへつなげていく予定です。",
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="border-b border-[#D6C3A3]/22 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.94),_rgba(245,241,232,0.98)_60%)] px-6 py-16 md:px-10 md:py-22">
        <div className="mx-auto max-w-6xl">
          <div className="shell-card max-w-4xl p-8 md:p-12">
            <h1 className="text-4xl font-light leading-tight md:text-6xl">相談のあとも、ひと続きで支えられるよう準備しています</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisouは、一度きりの相談窓口ではなく、あとから振り返り、ご家族とも共有しながら、導入後の見直しまで続けて相談しやすい形を目指しています。
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/20 bg-white/58 px-6 py-8 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 rounded-[1.75rem] border border-[#D6C3A3]/28 bg-white/78 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <h2 className="text-2xl font-light leading-tight">ログイン・登録</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5A4B3E] md:text-base">
              現在、ログインや会員登録の機能は準備中です。公開後は、相談履歴やご提案内容、ご家族との共有をこのページから確認できるようにしていきます。
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="rounded-full border border-[#D6C3A3]/60 bg-[#FCFAF6] px-6 py-3 text-sm text-[#8A7764]"
              disabled
              aria-disabled="true"
            >
              ログイン準備中
            </button>
            <button
              type="button"
              className="rounded-full border border-[#D6C3A3]/60 bg-[#FCFAF6] px-6 py-3 text-sm text-[#8A7764]"
              disabled
              aria-disabled="true"
            >
              新規登録準備中
            </button>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/22 bg-[#FBF7F0] px-6 py-16 md:px-10 md:py-18">
        <div className="mx-auto max-w-6xl rounded-[2.25rem] border border-[#D6C3A3]/28 bg-white/78 p-7 shadow-[0_24px_60px_rgba(59,47,47,0.05)] md:p-10">
          <h2 className="text-3xl font-light leading-tight">これから、このページでできるようにしていくこと</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {futureSections.map((section) => (
              <div key={section.title} className="rounded-[1.6rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-5 py-5">
                <h3 className="text-xl font-light leading-tight text-[#3B2F2F]">{section.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E] md:text-base">{section.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm leading-7 text-[#6B5A4A] md:text-base">
            まだ実際の会員機能はありませんが、今後の継続支援はこのページを入口にまとめていく予定です。
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/ai-advisor" className="btn btn-primary">
              AI相談を始める
            </Link>
            <Link href="/services" className="btn btn-secondary">
              導入・実証の考え方を見る
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
