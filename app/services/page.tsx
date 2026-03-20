import Image from "next/image";
import Link from "next/link";

import Hero from "../components/Hero";

const journeyCards = [
  {
    title: "相談受付",
    text: "ご本人・ご家族の状況、地域の生活導線、導入後に心配な点を整理し、どこから支援を始めるべきかを見極めます。",
  },
  {
    title: "候補の整理と比較",
    text: "移動手段を無理に一つへ決めるのではなく、使いやすさ、安全性、ご家族の納得感まで含めて比較しやすく整えます。",
  },
  {
    title: "試乗・個別相談",
    text: "必要に応じて試乗や個別相談につなぎ、導入前に確認すべき点を明確にします。",
  },
  {
    title: "ご家族との共有",
    text: "ご本人だけで判断しにくい場合も、相談内容や確認事項を家族で共有しやすい流れをつくります。",
  },
  {
    title: "導入後フォロー",
    text: "使い始めてからの不安や運用上の課題も見据え、継続支援へつながる相談設計を進めます。",
  },
  {
    title: "フィードバック反映",
    text: "福岡での実証や実際の相談から得た学びを、サービス改善と将来のYorisou標準に返します。",
  },
];

const partnerFlow = [
  {
    title: "導入前設計",
    text: "自治体、施設、地域事業者とともに、対象者像、導線、運用条件、説明方法を整理します。",
  },
  {
    title: "小規模実証",
    text: "福岡での検証知見を踏まえながら、現実的な規模で実証を行い、受容性と運用負荷を確認します。",
  },
  {
    title: "継続判断",
    text: "実績だけでなく、家族受容、安全性、運用継続性を見ながら次段階を判断します。",
  },
];

const supportShellItems = [
  "相談履歴の確認",
  "おすすめ内容の見返し",
  "ご家族との共有メモ",
  "試乗・相談後のフォロー",
];

export default function ServicesPage() {
  return (
    <main className="bg-[#F5F1E8] text-[#3B2F2F]">
      <Hero
        title="サービスの流れ"
        subtitle="Yorisouは、相談で終わる窓口ではなく、移動手段の整理、家族との共有、導入後フォローまでを見据えた高齢者モビリティ支援サービスです。福岡での検証知見も活かしながら、使い続けやすい支援の流れを整えています。"
        primaryHref="/ai-advisor"
        primaryLabel="AI相談を始める"
        secondaryHref="/pilot"
        secondaryLabel="導入・実証の考え方を見る"
      />

      <section className="section" style={{ paddingTop: 22 }}>
        <div className="container">
          <div className="card" style={{ padding: 10 }}>
            <Image
              src="/images/illustrations/services-scene.svg"
              alt="Yorisouのサービスの流れ"
              width={1000}
              height={620}
              style={{ width: "100%", height: "auto", borderRadius: 10 }}
            />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="section-header">
            <p className="section-label">Service Journey</p>
            <h2 className="section-title">ご相談から継続支援まで、ひと続きの流れとして整えています。</h2>
            <p className="muted" style={{ marginTop: 10, maxWidth: 760 }}>
              Yorisouの役割は、候補を紹介して終わることではありません。高齢者とご家族が納得しやすい移動支援の流れを、相談から導入後までつないでいきます。
            </p>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {journeyCards.map((item) => (
              <article key={item.title} className="card">
                <h3 style={{ marginTop: 0, fontSize: 26, fontWeight: 300 }}>{item.title}</h3>
                <p className="muted" style={{ marginBottom: 0 }}>
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 8 }}>
        <div className="container">
          <div
            className="card"
            style={{
              display: "grid",
              gap: 24,
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              background: "rgba(255,255,255,0.82)",
            }}
          >
            <div>
              <p className="section-label" style={{ margin: 0 }}>
                Service Promise
              </p>
              <h2 className="section-title" style={{ marginTop: 8 }}>
                相談する、比べる、共有する、その後も支える。
              </h2>
              <p className="muted" style={{ marginTop: 12 }}>
                いまは相談と個別フォローが中心ですが、Yorisouは将来的に相談履歴やご家族共有も含めた継続支援サービスへ広げていく前提で設計しています。
              </p>
              <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href="/ai-advisor" className="btn btn-primary">
                  相談を始める
                </Link>
                <Link href="/about" className="btn btn-secondary">
                  Yorisouについて
                </Link>
              </div>
            </div>

            <div className="card" style={{ background: "var(--surface-soft)", boxShadow: "none", padding: 20 }}>
              <div className="section-label" style={{ margin: 0 }}>
                Future Support Area
              </div>
              <div className="grid" style={{ marginTop: 16, gap: 12 }}>
                {supportShellItems.map((item) => (
                  <div
                    key={item}
                    style={{
                      border: "1px solid rgba(217, 204, 184, 0.55)",
                      borderRadius: 16,
                      padding: "14px 16px",
                      background: "rgba(255,255,255,0.85)",
                      color: "var(--muted)",
                      fontSize: 14,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <p className="muted" style={{ marginTop: 14, marginBottom: 0, fontSize: 13 }}>
                現在は準備中の構想です。実際のログイン機能や家族連携機能は今後の実装対象です。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 8 }}>
        <div className="container">
          <div className="section-header">
            <p className="section-label">For Organizations</p>
            <h2 className="section-title">地域導入や実証支援も、継続可能なサービス判断につなげます。</h2>
            <p className="muted" style={{ marginTop: 10, maxWidth: 760 }}>
              自治体、施設、地域事業者向けの支援も、単発イベントではなく、現場で続くかどうかを見極めるための実務支援として行っています。
            </p>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {partnerFlow.map((item) => (
              <article key={item.title} className="card">
                <h3 style={{ marginTop: 0, fontSize: 24, fontWeight: 300 }}>{item.title}</h3>
                <p className="muted" style={{ marginBottom: 0 }}>
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
