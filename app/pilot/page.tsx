import React from "react";

export default function PilotJP() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f3ec",
        color: "#2c2c2c",
        fontFamily:
          "Hiragino Kaku Gothic ProN, Yu Gothic, system-ui, -apple-system",
      }}
    >
      <div
        style={{
          padding: "24px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img
            src="/images/yorisou-logo.png"
            alt="Yorisou"
            style={{ height: 90, width: "auto" }}
          />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 800, fontSize: 24 }}>寄り添う – Yorisou</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>
              Community Mobility Initiative
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a
            href="/en/pilot"
            style={{
              textDecoration: "none",
              fontSize: 14,
              padding: "8px 14px",
              borderRadius: 20,
              background: "#e3dfd6",
              color: "#333",
            }}
          >
            English
          </a>
          <a
            href="/"
            style={{
              textDecoration: "none",
              fontSize: 14,
              padding: "8px 14px",
              borderRadius: 20,
              background: "#e3dfd6",
              color: "#333",
            }}
          >
            ホーム
          </a>
        </div>
      </div>

      <section style={{ padding: "60px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 40, lineHeight: 1.3, marginBottom: 14 }}>
          福岡市向け 小規模実証（Pilot）提案
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.8, maxWidth: 860 }}>
          高齢者の日常移動を安全に支えるため、低速電動モビリティを用いた
          30〜90日間の小規模実証を提案します。自治体・地域事業者と連携し、
          事故ゼロ・住民満足・運用コスト最適化を同時に検証します。
        </p>

        <div
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {[
            { t: "期間", v: "30–90日" },
            { t: "想定エリア", v: "住宅地 / 商業施設 / 医療・公共施設導線" },
            { t: "対象", v: "高齢者・介護予防・買い物/通院/駅までの移動" },
            { t: "KPI", v: "利用回数 / 満足度 / 事故件数 / 運用コスト" },
          ].map((x) => (
            <div
              key={x.t}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 18,
                boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.7 }}>{x.t}</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6 }}>
                {x.v}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 34 }}>
          <h2 style={{ fontSize: 26, marginBottom: 10 }}>実証の設計</h2>
          <div style={{ display: "grid", gap: 10, lineHeight: 1.8 }}>
            <div>① エリア/利用ルール/速度上限/運用時間帯の確定</div>
            <div>② 運行管理（簡易予約・乗降ポイント・日次点検）</div>
            <div>③ 安全運用（講習、ヘルメット/シートベルト等の運用方針）</div>
            <div>④ データ収集（利用ログ、アンケート、ヒヤリハット）</div>
            <div>⑤ 改善サイクル（週次レポート → ルール/導線を調整）</div>
          </div>
        </div>

        <div style={{ marginTop: 34 }}>
          <h2 style={{ fontSize: 26, marginBottom: 10 }}>役割分担（案）</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 18,
                boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 16 }}>自治体</div>
              <ul style={{ marginTop: 10, lineHeight: 1.8 }}>
                <li>実証エリアの調整・関係者調整</li>
                <li>安全要件/運用要件の合意</li>
                <li>地域広報（参加者募集の協力）</li>
              </ul>
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 18,
                boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 16 }}>Yorisou</div>
              <ul style={{ marginTop: 10, lineHeight: 1.8 }}>
                <li>車両/運行設計/安全講習の提供</li>
                <li>運用SOP・日次点検・簡易ダッシュボード</li>
                <li>週次レポート・改善提案</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 34 }}>
          <h2 style={{ fontSize: 26, marginBottom: 10 }}>次のアクション</h2>
          <div style={{ lineHeight: 1.8 }}>
            ① 実証候補エリア（2–3箇所）を選定 → ② 現地確認（導線/路面/段差） →
            ③ 運用ルール合意 → ④ 参加者募集 → ⑤ 実証開始
          </div>

          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href="/#contact"
              style={{
                textDecoration: "none",
                padding: "12px 16px",
                borderRadius: 10,
                background: "#8ca79c",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              相談する
            </a>
            <a
              href="/en/pilot"
              style={{
                textDecoration: "none",
                padding: "12px 16px",
                borderRadius: 10,
                background: "#e3dfd6",
                color: "#333",
                fontWeight: 700,
              }}
            >
              English version
            </a>
          </div>
        </div>

        <div style={{ marginTop: 50, opacity: 0.65, fontSize: 12 }}>
          ※ 本ページは実証のたたき台です。詳細（車両仕様/保険/合意書式）は協議の上で確定します。
        </div>
      </section>
    </main>
  );
}
