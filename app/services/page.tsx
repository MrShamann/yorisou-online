import type { Metadata } from "next";
import Link from "next/link";

import Hero from "../components/Hero";

const supportSteps = [
  {
    title: "1. まず、ひなたが話をうかがいます",
    text: "ご本人でも、ご家族でも大丈夫です。移動や暮らしのお悩みを、無理のない順番で整理します。",
  },
  {
    title: "2. 状況に合う支え方を一緒に考えます",
    text: "使い方、安全性、ご家族との共有、続けやすさまで見ながら、選びやすい形に整えます。",
  },
  {
    title: "3. 必要に応じて次の支援へつなぎます",
    text: "製品やサービスの案内、導入相談、その後の継続支援まで、落ち着いてご案内します。",
  },
];

export const metadata: Metadata = {
  title: "サービス | Yorisou",
  description: "Yorisouは、移動や暮らしの不安を整理し、必要に応じて製品、サービス、導入相談、継続支援へつなぐ相談サービスです。",
};

export default function ServicesPage() {
  return (
    <main className="bg-[var(--bg)] text-[var(--text)]">
      <Hero
        eyebrow="サービス"
        title={
          <>
            <span className="block md:whitespace-nowrap">Yorisouのサービスは、</span>
            <span className="block md:whitespace-nowrap">まず話を聞くところから始まります。</span>
          </>
        }
        subtitle="移動や暮らしの不安をうかがいながら、ご本人とご家族に合う支え方を一緒に整理します。すぐに何かを決める必要はありません。必要に応じて、その先の導入や継続支援まで丁寧につないでいきます。"
        primaryHref="/support#scenario-assistant"
        primaryLabel="ひなたに相談する"
        secondaryHref="/pilot"
        secondaryLabel="導入・実証について"
      />

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">ご相談の流れ</p>
            <h2 className="section-title">相談から、その先の支え方まで。</h2>
            <p className="muted" style={{ marginTop: 10, maxWidth: 760 }}>
              相談だけで終わらせず、ご本人、ご家族、地域の状況に応じて続けやすい流れを整えていきます。
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {supportSteps.map((item) => (
              <article key={item.title} className="rounded-[1.4rem] bg-[rgba(255,253,249,0.7)] px-5 py-5">
                <h3 className="text-lg font-medium leading-8 text-[var(--text)]">{item.title}</h3>
                <p className="muted">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.5rem] bg-[rgba(255,253,249,0.72)] px-6 py-6">
              <div className="service-kicker">ご本人とご家族へ</div>
              <h2 className="section-title" style={{ marginTop: 12 }}>
                ご本人とご家族のための相談支援
              </h2>
              <p className="muted" style={{ marginTop: 12 }}>
                外出が不安、親の移動をどう支えればよいかわからない、何を選べばよいか迷っている。
                そうした状態から、ひなたが一緒に整理していきます。
              </p>
              <div style={{ marginTop: 18 }}>
                <Link href="/support#scenario-assistant" className="btn btn-primary">
                  ひなたに相談する
                </Link>
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-[rgba(225,232,219,0.48)] px-6 py-6">
              <div className="service-kicker">自治体・施設・地域事業者の方へ</div>
              <h2 className="section-title" style={{ marginTop: 12 }}>
                導入や実証を考えている方へ
              </h2>
              <p className="muted" style={{ marginTop: 12 }}>
                自治体、施設、地域事業者向けには、現場で続くかどうかを見ながら、導入や小規模実証の考え方を整理します。
              </p>
              <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 10 }}>
                <Link href="/pilot" className="btn btn-secondary">
                  導入・実証について
                </Link>
                <Link href="/contact" className="btn btn-secondary">
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
