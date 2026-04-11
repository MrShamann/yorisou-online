import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import ReservationMobilityInquiryForm from "@/app/components/ReservationMobilityInquiryForm";

const whoItIsFor = [
  {
    title: "ご家族",
    text: "親の移動や予約の不安を、予約前の段階で整理したい方に向いています。",
  },
  {
    title: "地域の運営者",
    text: "自治体、施設、事業者が、予約型移動の相談や小さな導入相談を始める入口として使えます。",
  },
];

const commonProblems = [
  "電話、LINE、アプリのどれで予約すればよいか迷う",
  "乗り降り、付き添い、待ち合わせの確認が足りない",
  "家族の誰が何を確認するか決まっていない",
  "利用前に、料金や運行条件を落ち着いて確認したい",
];

const hinataTasks = [
  "誰が乗るのか、どこまで行くのかをひとつに整理する",
  "予約前に確認したい項目を、家族と共有しやすい形にまとめる",
  "電話、LINE、アプリ、窓口のどこから入るのが自然かを見分ける",
  "相談内容を、必要に応じて既存の相談窓口や導入相談へつなぐ",
];

const familyPoints = [
  "一言の相談から始められます。",
  "予約前に不安な点を先に整理できます。",
  "本人と家族で見ておきたい確認事項をまとめやすくなります。",
];

const operatorPoints = [
  "小さな実証相談の入口として使えます。",
  "利用者像、予約導線、問い合わせの受け方を整理できます。",
  "地域の運営条件に合わせて、現実的な次の一手を考えやすくなります。",
];

export const metadata: Metadata = {
  title: "予約型移動相談 | Yorisou",
  description: "予約型移動の前に、家族の不安と運営側の確認事項を整理するための相談ページです。",
};

export default function ReservationMobilitySupportPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="section-wash border-b border-[color:var(--line-soft)] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_rgba(247,244,238,0.99)_60%)]">
        <div className="container py-12 md:py-14">
          <div className="max-w-[50rem]">
            <div className="service-kicker">予約型移動相談</div>
            <h1 className="display-serif mt-4 max-w-[15em] text-[1.72rem] leading-[1.68] md:text-[2.2rem]">
              <span className="block">予約型の移動を使う前に、</span>
              <span className="block text-[#79685f]">家族の不安と確認事項を整える入口です。</span>
            </h1>
            <p className="mt-4 max-w-[42rem] text-sm leading-8 text-[var(--muted)] md:text-[0.98rem]">
              電話、LINE、アプリ予約の前に、誰が乗るのか、どこまで行くのか、家族が何を確認したいのかを静かに整理します。
              Yorisou / Hinataは、予約前の相談窓口として使えます。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="#family-inquiry" className="btn btn-primary">
                ご家族の相談へ
              </Link>
              <Link href="#pilot-inquiry" className="btn btn-secondary">
                導入・実証の相談へ
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wash border-b border-[color:var(--line-soft)] bg-[rgba(255,255,255,0.52)] px-6 py-12 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <Panel title="誰のためのページか">
            <ul className="grid gap-3 text-sm leading-7 text-[var(--muted)]">
              {whoItIsFor.map((item) => (
                <li key={item.title} className="rounded-[1.15rem] border border-[color:var(--line-soft)] bg-white px-4 py-4">
                  <div className="service-kicker">{item.title}</div>
                  <p className="mt-2">{item.text}</p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="よくある困りごと">
            <ul className="grid gap-3 text-sm leading-7 text-[var(--muted)]">
              {commonProblems.map((item) => (
                <li key={item} className="rounded-[1.15rem] border border-[color:var(--line-soft)] bg-white px-4 py-4">
                  {item}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </section>

      <section className="section-wash px-6 py-12 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <Panel title="Hinataが整理すること">
            <ul className="grid gap-3 text-sm leading-7 text-[var(--muted)]">
              {hinataTasks.map((item) => (
                <li key={item} className="rounded-[1.15rem] bg-[rgba(247,244,238,0.82)] px-4 py-4">
                  {item}
                </li>
              ))}
            </ul>
          </Panel>

          <div className="grid gap-6">
            <Panel id="family-inquiry" title="ご家族の方へ">
              <ul className="grid gap-3 text-sm leading-7 text-[var(--muted)]">
                {familyPoints.map((item) => (
                  <li key={item} className="rounded-[1.15rem] border border-[color:var(--line-soft)] bg-white px-4 py-4">
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel id="pilot-inquiry" title="運営者・自治体・施設の方へ">
              <ul className="grid gap-3 text-sm leading-7 text-[var(--muted)]">
                {operatorPoints.map((item) => (
                  <li key={item} className="rounded-[1.15rem] border border-[color:var(--line-soft)] bg-white px-4 py-4">
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </section>

      <section className="section-wash border-t border-[color:var(--line-soft)] bg-[rgba(255,255,255,0.52)] px-6 py-12 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <ReservationMobilityInquiryForm locale="ja" />

          <Panel title="次にできること">
            <div className="grid gap-3 text-sm leading-7 text-[var(--muted)]">
              <p className="rounded-[1.15rem] bg-[rgba(247,244,238,0.82)] px-4 py-4">
                相談の入口は、ひとことの不安や確認事項から始められます。予約前に整えておきたい点を、そのまま書いてください。
              </p>
              <p className="rounded-[1.15rem] bg-[rgba(247,244,238,0.82)] px-4 py-4">
                ご家族の相談でも、導入や実証の相談でも、落ち着いた一回目の接点として使えます。
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="/contact" className="soft-link">
                  一般のお問い合わせ
                </Link>
                <Link href="/support" className="soft-link">
                  ひなたに相談する
                </Link>
              </div>
            </div>
          </Panel>
        </div>
      </section>
    </main>
  );
}

function Panel({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <article id={id} className="rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.88)] p-6 shadow-[0_12px_28px_rgba(47,35,33,0.04)]">
      <h2 className="display-serif text-[1.35rem] leading-[1.6] text-[var(--text)]">{title}</h2>
      <div className="mt-5">{children}</div>
    </article>
  );
}
