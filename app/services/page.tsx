import Image from "next/image";
import Link from "next/link";

import Hero from "../components/Hero";

const pathItems = [
  {
    title: "相談する",
    text: "ご本人・ご家族の状況、地域での生活導線、導入後に心配な点を整理し、どこから支援を始めるべきかを見極めます。",
  },
  {
    title: "比べる",
    text: "移動手段を無理に一つへ決めるのではなく、使いやすさ、安全性、ご家族の納得感まで含めて比較しやすく整えます。",
  },
  {
    title: "ご家族と共有する",
    text: "必要に応じて試乗や個別相談につなぎながら、確認事項をご家族にも共有しやすい形にまとめます。",
  },
  {
    title: "その後も見直せるようにする",
    text: "使い始めてからの不安や運用上の課題も見据え、継続支援へつながる相談設計を進めます。",
  },
];

const partnerFlow = [
  "自治体、施設、地域事業者とともに、対象者像や導線、運用条件を整理します。",
  "福岡での検証知見を踏まえながら、現実的な規模で実証を行い、受容性と運用負荷を確認します。",
  "実績だけでなく、家族受容、安全性、運用継続性を見ながら次段階を判断します。",
];

export default function ServicesPage() {
  return (
    <main className="bg-[#F5F1E8] text-[#3B2F2F]">
      <Hero
        title="サービスの流れ"
        subtitle="Yorisouは、相談で終わる窓口ではなく、移動手段の整理からご家族との共有、導入後の見直しまでを静かにつなぐ高齢者モビリティ支援サービスです。"
        primaryHref="/ai-advisor"
        primaryLabel="AI相談を始める"
      />

      <section className="section" style={{ paddingTop: 28 }}>
        <div className="container">
          <div
            className="card"
            style={{
              display: "grid",
              gap: 28,
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              background: "rgba(255,255,255,0.82)",
            }}
          >
            <div>
              <h2 className="section-title" style={{ marginTop: 0 }}>
                相談から導入後まで、ひと続きで考えます。
              </h2>
              <p className="muted" style={{ marginTop: 12, maxWidth: 700 }}>
                候補を紹介して終わるのではなく、何に困っているのかを整え、比べ、ご家族とも共有し、その後も見直しやすい流れをつくります。
              </p>
              <div className="grid" style={{ marginTop: 22, gap: 18 }}>
                {pathItems.map((item, index) => (
                  <article key={item.title} style={{ borderTop: "1px solid rgba(217, 204, 184, 0.35)", paddingTop: index === 0 ? 0 : 18 }}>
                    <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--muted)" }}>0{index + 1}</div>
                    <h3 style={{ margin: "8px 0 0", fontSize: 28, fontWeight: 300 }}>{item.title}</h3>
                    <p className="muted" style={{ marginBottom: 0, marginTop: 10 }}>
                      {item.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <div className="card" style={{ padding: 10, boxShadow: "none", background: "rgba(252,250,246,0.84)" }}>
                <Image
                  src="/images/illustrations/services-scene.svg"
                  alt="Yorisouのサービスの流れ"
                  width={1000}
                  height={620}
                  style={{ width: "100%", height: "auto", borderRadius: 14 }}
                />
              </div>
              <div className="card" style={{ marginTop: 18, background: "var(--surface-soft)", boxShadow: "none" }}>
                <h3 style={{ margin: 0, fontSize: 26, fontWeight: 300 }}>相談のあとに続く支え方</h3>
                <p className="muted" style={{ marginTop: 12, marginBottom: 0 }}>
                  いまは個別フォローが中心ですが、相談履歴やご家族共有も含めた継続支援サービスへ広げていく前提で設計しています。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="card" style={{ background: "rgba(255,255,255,0.78)" }}>
            <h2 className="section-title" style={{ marginTop: 0 }}>
              地域導入や実証支援について
            </h2>
            <p className="muted" style={{ marginTop: 12, maxWidth: 760 }}>
              自治体、施設、地域事業者向けの支援も、単発イベントではなく、現場で続くかどうかを見極めるための実務支援として行っています。
            </p>
            <div className="grid" style={{ marginTop: 20, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
              {partnerFlow.map((item) => (
                <div key={item} style={{ border: "1px solid rgba(217, 204, 184, 0.42)", borderRadius: 18, padding: 18, background: "rgba(252,250,246,0.8)" }}>
                  <p className="muted" style={{ margin: 0 }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/pilot" className="btn btn-secondary">
                導入・実証の考え方を見る
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                相談する
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
