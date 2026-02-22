import React from "react";
import SiteHeader from "./components/SiteHeader";

function Card({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: 18,
        background: "rgba(255,255,255,0.78)",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 10px 22px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 15 }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 13, color: "#5b5b5b", lineHeight: 1.8 }}>
        {desc}
      </div>
    </div>
  );
}

export default function HomeJP() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f3ec",
        color: "#222",
        fontFamily: "Hiragino Kaku Gothic ProN, Yu Gothic, system-ui, -apple-system",
      }}
    >
      <SiteHeader lang="jp" />

      {/* HERO */}
      <section style={{ padding: "70px 40px 30px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 34,
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.14em", color: "#7b7b7b" }}>
              FUKUOKA COMMUNITY MOBILITY
            </div>

            <h1
              style={{
                marginTop: 18,
                fontSize: 52,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              寄り添う。
              <br />
              移動の不安をなくす。
            </h1>

            <p style={{ marginTop: 18, fontSize: 16, color: "#4f4f4f", lineHeight: 1.9 }}>
              Yorisou は、日本の高齢社会に向けた
              <b>小規模・地域密着型モビリティ実証</b>を設計・運用します。
              病院、商店街、駅、住宅地など、日常の動線に自然に溶け込む仕組みをつくります。
            </p>

            <div style={{ marginTop: 26, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a
                href="/pilot"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 18px",
                  borderRadius: 10,
                  background: "#222",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                Pilotを見る
              </a>

              <a
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 18px",
                  borderRadius: 10,
                  background: "#fff",
                  color: "#222",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: 14,
                  border: "1px solid rgba(0,0,0,0.12)",
                }}
              >
                お問い合わせ
              </a>
            </div>

            <div
              style={{
                marginTop: 26,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
              }}
            >
              <Card title="目的" desc="高齢者の移動不安を減らし、外出機会を増やす" />
              <Card title="方法" desc="30〜90日規模の小規模実証を設計し、改善ループで最適化" />
              <Card title="場所" desc="福岡を起点に、地域単位で展開可能なモデルを構築" />
            </div>
          </div>

          <div
            style={{
              borderRadius: 18,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.06)",
              background: "rgba(255,255,255,0.78)",
              boxShadow: "0 10px 22px rgba(0,0,0,0.04)",
              padding: 14,
            }}
          >
            <img
              src="/images/yorisou-hero.png"
              alt="Yorisou"
              style={{ width: "100%", height: "auto", borderRadius: 12, display: "block" }}
            />
            <div style={{ marginTop: 10, fontSize: 12, color: "#6b6b6b", lineHeight: 1.6 }}>
              ※ 画像を置く: <code style={{ background: "#fff", padding: "2px 6px", borderRadius: 8 }}>
                public/images/yorisou-hero.png
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* SIMPLE SECTIONS */}
      <section style={{ padding: "30px 40px" }}>
        <div style={{ fontSize: 12, letterSpacing: "0.14em", color: "#7b7b7b" }}>WHY YORISOU</div>
        <h2 style={{ marginTop: 12, fontSize: 30, lineHeight: 1.25 }}>日本の生活動線に合わせた実証設計</h2>

        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
          }}
        >
          <Card title="安全第一" desc="ルール設計・運行チェック・教育を含めた安全運用を標準化" />
          <Card title="地域共創" desc="自治体・施設・地域事業者と一緒に、導入と改善を進める" />
          <Card title="実証重視" desc="データと利用者の声をもとに、改善ループで最適化して拡大" />
        </div>
      </section>

      <footer
        style={{
          padding: "22px 40px 34px",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          color: "#6b6b6b",
          fontSize: 12,
          marginTop: 40,
        }}
      >
        <div>© {new Date().getFullYear()} Yorisou 寄り添う</div>
      </footer>
    </main>
  );
}