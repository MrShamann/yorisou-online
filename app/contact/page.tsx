import type { Metadata } from "next";
import Link from "next/link";

import ContactForm from "../components/ContactForm";
import Hero from "../components/Hero";

const inquiryNotes = [
  "ご相談内容がまだ曖昧でも、気になることからお話しいただけます。",
  "Yorisouのチェック体験や、ひなたの使い方についてもこちらからお気軽にどうぞ。",
  "内容に応じて順次ご案内します。返信まで少しお時間をいただく場合があります。",
];

export const metadata: Metadata = {
  title: "お問い合わせ | Yorisou",
  description: "Yorisouのチェック体験、サポート機能、デジタルレポート、推薦・マッチング支援に関するお問い合わせを受け付けています。",
};

export default function ContactPage() {
  return (
    <main className="bg-[var(--bg)] text-[var(--text)]">
      <Hero
        eyebrow="お問い合わせ"
        title={
          <>
            <span className="block md:whitespace-nowrap">お問い合わせも、</span>
            <span className="block md:whitespace-nowrap">やさしく話せる入口でありたいと考えています。</span>
          </>
        }
        subtitle="ご相談内容がまだまとまっていなくても大丈夫です。ご本人、ご家族、地域の関係者、それぞれの立場に合わせて、落ち着いてお話をうかがいます。"
        primaryHref="/support#scenario-assistant"
        primaryLabel="ひなたに相談する"
        secondaryHref="/tests"
        secondaryLabel="テスト一覧を見る"
      />

      <section className="section">
        <div className="container">
          <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-6 py-6">
              <div className="service-kicker">お問い合わせフォーム</div>
              <h2 className="section-title" style={{ marginTop: 12 }}>
                チェック結果の使い方からYorisouについての質問まで、このままお送りいただけます。
              </h2>
              <p className="page-copy" style={{ marginTop: 12 }}>
                内容に応じて順次ご連絡します。チェック結果や今後の使い方について共有したい場合も、そのままお送りください。
              </p>
              <div style={{ marginTop: 20 }}>
                <ContactForm locale="ja" />
              </div>
            </div>

            <div className="panel-sage rounded-[1.7rem] px-6 py-6">
              <div className="service-kicker text-[var(--accent-sage-text)]">はじめての方へ</div>
              <h2 className="section-title" style={{ marginTop: 12 }}>
                急がずに、必要なことから話せれば大丈夫です。
              </h2>
              <div className="mt-5 grid gap-3">
                {inquiryNotes.map((item) => (
                  <div key={item} className="rounded-[1.2rem] bg-[rgba(252,250,245,0.82)] px-5 py-4 text-sm leading-8 text-[var(--accent-sage-text)]">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                <Link href="/support#scenario-assistant" className="soft-link">
                  ひなたと話し始める
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
