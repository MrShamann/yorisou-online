import Link from "next/link";

import Hero from "../components/Hero";

export default function ServicesPage() {
  return (
    <main className="bg-[#F5F1E8] text-[#3B2F2F]">
      <Hero
        title="サービスについて"
        subtitle="Yorisouは、相談で終わる窓口ではなく、移動手段の整理、ご家族との共有、導入後の見直しまでを見据えた支援サービスです。"
        primaryHref="/ai-advisor"
        primaryLabel="AI相談を始める"
      />

      <section className="section" style={{ paddingTop: 28 }}>
        <div className="container">
          <div
            className="card"
            style={{
              background: "rgba(255,255,255,0.82)",
            }}
          >
            <h2 className="section-title" style={{ marginTop: 0 }}>
              相談から導入後まで、ひと続きで考えます
            </h2>
            <div style={{ marginTop: 28, borderTop: "1px solid rgba(217, 204, 184, 0.35)", paddingTop: 22 }}>
              <p className="muted" style={{ margin: 0, maxWidth: 780 }}>
                まずはご本人やご家族の状況、地域での生活導線、導入後に心配な点を整理します。
              </p>
              <p className="muted" style={{ marginTop: 18, maxWidth: 780 }}>
                そのうえで、無理に一つへ決めるのではなく、使いやすさや安全性、ご家族の納得感も含めて比べやすく整えます。
              </p>
              <p className="muted" style={{ marginTop: 18, maxWidth: 780 }}>
                必要に応じて試乗や個別相談につなぎながら、導入後にも見直しや相談を続けやすい流れを整えていきます。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="card" style={{ background: "rgba(255,255,255,0.78)" }}>
            <h2 className="section-title" style={{ marginTop: 0 }}>
              必要に応じて、地域導入や実証支援にもつなぎます
            </h2>
            <p className="muted" style={{ marginTop: 12, maxWidth: 760 }}>
              自治体、施設、地域事業者向けには、単発イベントではなく、現場で続くかどうかを見極めるための実務支援も行っています。
            </p>
            <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/ai-advisor" className="btn btn-primary">
                AI相談を始める
              </Link>
              <Link href="/pilot" className="btn btn-secondary">
                導入・実証の考え方を見る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
