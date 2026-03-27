import type { Metadata } from "next";
import Link from "next/link";

import Hero from "../components/Hero";

const supportSteps = [
  {
    title: "ひなたが、まず話をうかがいます",
    text: "ご本人でも、ご家族でも大丈夫です。移動や暮らしのお悩みを、無理のない順番で受け取ります。",
  },
  {
    title: "その方に合う支え方を一緒に考えます",
    text: "使い方、安全性、ご家族との共有、続けやすさまで見ながら、選びやすい形へ整えます。",
  },
  {
    title: "必要に応じて次の支援へつなぎます",
    text: "製品、サービス、導入相談、その後の継続支援まで、落ち着いてご案内します。",
  },
];

export const metadata: Metadata = {
  title: "支援内容 | Yorisou",
  description: "Yorisouは、移動や暮らしの不安をやさしく整理し、必要に応じて製品、導入、継続支援へつなぐ伴走サービスです。",
};

export default function ServicesPage() {
  return (
    <main className="bg-[var(--bg)] text-[var(--text)]">
      <Hero
        eyebrow="支援内容"
        title={
          <>
            <span className="block md:whitespace-nowrap">Yorisouは、</span>
            <span className="block md:whitespace-nowrap">移動と暮らしに寄り添うところから始まります。</span>
          </>
        }
        subtitle="ひなたとの対話から不安を受け取り、その方に合う支え方を一緒に整えていきます。すぐに何かを決める必要はありません。必要になったときだけ、その先の導入や継続支援へ丁寧につないでいきます。"
        primaryHref="/support#scenario-assistant"
        primaryLabel="ひなたに相談する"
        secondaryHref="/pilot"
        secondaryLabel="導入・実証について"
      />

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">支え方の流れ</p>
            <h2 className="section-title">話を聞くことから、その先の支え方まで。</h2>
            <p className="page-copy" style={{ marginTop: 10 }}>
              一度の案内で終わらせず、ご本人、ご家族、地域の状況に応じて、続けやすい形を少しずつ整えていきます。
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {supportSteps.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-5 py-5">
                <h3 className="text-[1.08rem] font-medium leading-8 text-[var(--text)]">{item.title}</h3>
                <p className="page-copy" style={{ marginTop: 8, fontSize: 14 }}>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-6 py-6">
              <div className="service-kicker">ご本人とご家族へ</div>
              <h2 className="section-title" style={{ marginTop: 12 }}>
                まずは、不安を落ち着いて整理したい方へ。
              </h2>
              <p className="page-copy" style={{ marginTop: 12 }}>
                外出が不安、親の移動をどう支えればよいかわからない、何を選べばよいか迷っている。そうした状態から、ひなたが一緒に整理していきます。
              </p>
              <div className="mt-5">
                <Link href="/support#scenario-assistant" className="soft-link">
                  ひなたと話し始める
                </Link>
              </div>
            </div>

            <div className="panel-sage rounded-[1.7rem] px-6 py-6">
              <div className="service-kicker text-[var(--accent-sage-text)]">地域・事業者の方へ</div>
              <h2 className="section-title" style={{ marginTop: 12 }}>
                導入や実証を、暮らしに合う形で考えたい方へ。
              </h2>
              <p className="page-copy" style={{ marginTop: 12, color: "var(--accent-sage-text)" }}>
                自治体、施設、地域事業者向けには、現場で続くかどうかを見ながら、導入や小規模実証の進め方を一緒に整理します。
              </p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                <Link href="/pilot" className="soft-link">
                  導入・実証について
                </Link>
                <Link href="/contact" className="soft-link">
                  お問い合わせ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
