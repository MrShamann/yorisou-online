import type { Metadata } from "next";
import Link from "next/link";

import ContactForm from "../components/ContactForm";
import Hero from "../components/Hero";

const inquiryNotes = [
  "ご相談内容がまだ曖昧でも、気になることからお話しいただけます。",
  "Yorisouのチェック体験や使い方についても、こちらからお気軽にどうぞ。",
  "内容に応じて順次ご案内します。返信まで少しお時間をいただく場合があります。",
];

export const metadata: Metadata = {
  title: "お問い合わせ | Yorisou",
  description: "Yorisouのチェック体験、サポート機能、デジタルレポート、推薦・マッチング支援に関するお問い合わせを受け付けています。",
};

function getInitialContactContext(topic: string | null) {
  if (topic === "open-testing") {
    return {
      inquiryType: "公開テストの感想・不具合報告",
      message:
        "公開テストの感想や不具合報告を送ります。\n\n・どのページで気づいたか\n・よかった点 / わかりにくかった点\n・不具合があれば再現手順\n\n",
    };
  }

  return {
    inquiryType: undefined,
    message: undefined,
  };
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const topicValue = typeof params.topic === "string" ? params.topic : null;
  const initialContext = getInitialContactContext(topicValue);

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
        primaryHref="/check-in"
        primaryLabel="クイックチェックを始める"
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
                内容に応じて順次ご連絡します。公開テストの感想、わかりにくかった点、不具合報告もこのままお送りください。
              </p>
              <div style={{ marginTop: 20 }}>
                <ContactForm
                  locale="ja"
                  initialInquiryType={initialContext.inquiryType}
                  initialMessage={initialContext.message}
                />
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
              <div className="mt-5 rounded-[1.2rem] bg-[rgba(252,250,245,0.82)] px-5 py-4 text-sm leading-8 text-[var(--accent-sage-text)]">
                公開テスト中の感想や不具合報告は、組織ではなく個人ユーザーとしてそのまま送っていただけます。
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                <Link href="/check-in" className="soft-link">
                  クイックチェックを始める
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
