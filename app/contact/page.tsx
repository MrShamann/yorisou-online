import type { Metadata } from "next";

import ContactForm from "../components/ContactForm";
import Hero from "../components/Hero";

const inquiryCards = [
  {
    title: "ご本人・ご家族のご相談",
    text: "移動や暮らしの不安について、ひなたとの相談につながる形でご案内します。",
  },
  {
    title: "導入・実証のご相談",
    text: "自治体、施設、地域事業者の方からの導入や小規模実証に関するご相談をお受けします。",
  },
  {
    title: "一般のお問い合わせ",
    text: "Yorisouの考え方や今後の取り組みについて、幅広くお問い合わせいただけます。",
  },
];

export const metadata: Metadata = {
  title: "お問い合わせ | Yorisou",
  description: "ご本人やご家族のご相談から、導入・実証に関するお問い合わせまで、Yorisouの窓口で落ち着いてお受けしています。",
};

export default function ContactPage() {
  return (
    <main className="bg-[var(--bg)] text-[var(--text)]">
      <Hero
        title="お問い合わせも、やさしく話せる窓口でありたいと考えています。"
        subtitle="ご相談内容がまだまとまっていなくても大丈夫です。ご本人、ご家族、地域の関係者、それぞれの立場に合わせて、落ち着いてお話をうかがいます。"
        primaryHref="/support#scenario-assistant"
        primaryLabel="ひなたに相談する"
        secondaryHref="/services"
        secondaryLabel="サービスを見る"
      />

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Inquiry</p>
            <h2 className="section-title">ご相談いただける内容</h2>
            <p className="muted" style={{ marginTop: 10, maxWidth: 760 }}>
              個人のご相談から、地域での導入検討まで、目的に応じた形でご案内します。
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {inquiryCards.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] bg-[rgba(255,253,249,0.72)] px-5 py-5">
                <h3 className="text-lg font-medium leading-8 text-[var(--text)]">{item.title}</h3>
                <p className="muted">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-[1.6rem] bg-[rgba(255,253,249,0.72)] px-6 py-6">
              <div className="service-kicker">Contact form</div>
              <h2 className="section-title" style={{ marginTop: 12 }}>
                お問い合わせフォーム
              </h2>
              <p className="muted" style={{ marginTop: 12 }}>
                内容に応じて、順次ご連絡します。相談の入口として使いたい場合も、そのままお送りいただけます。
              </p>
              <div style={{ marginTop: 24 }}>
                <ContactForm locale="ja" />
              </div>
            </div>

            <div className="rounded-[1.6rem] bg-[rgba(255,253,249,0.72)] px-6 py-6">
              <div className="service-kicker">A calm first step</div>
              <h2 className="section-title" style={{ marginTop: 12 }}>
                はじめてでも大丈夫です
              </h2>
              <div className="grid gap-4" style={{ marginTop: 18 }}>
                {[
                  "ご相談内容が曖昧でも、気になることからお話しいただけます。",
                  "ご高齢の方やご家族にも伝わりやすいご案内を心がけています。",
                  "必要に応じて、ひなたとの相談や導入相談につながる形で整理します。",
                ].map((item) => (
                  <div key={item} className="rounded-[1.3rem] bg-[var(--surface)] px-5 py-4 text-sm leading-8 text-[var(--muted)]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
