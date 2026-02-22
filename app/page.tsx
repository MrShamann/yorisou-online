// app/page.tsx
import React from "react";
import Link from "next/link";

function SectionTitle({
  eyebrow,
  title,
  desc,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      {eyebrow ? (
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.12em",
            color: "#6b6b6b",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          {eyebrow}
        </div>
      ) : null}
      <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>
        {title}
      </div>
      {desc ? (
        <div style={{ marginTop: 10, color: "#5b5b5b", lineHeight: 1.7 }}>
          {desc}
        </div>
      ) : null}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.08)",
        fontSize: 12,
        color: "#3a3a3a",
      }}
    >
      {children}
    </span>
  );
}

export default function HomeJP() {
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
      {/* Header */}
      <header
        style={{
          padding: "22px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          backdropFilter: "blur(10px)",
          background: "rgba(246,243,236,0.78)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img
            src="/images/yorisou-logo.png"
            alt="Yorisou"
            style={{ height: 46, width: "auto" }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1 }}>
              Yorisou
            </div>
            <div style={{ fontSize: 12, color: "#6b6b6b", marginTop: 4 }}>
              寄り添うモビリティ
            </div>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <a href="#products" style={{ color: "inherit", textDecoration: "none", fontSize: 13 }}>
            製品
          </a>
          <a href="#pilot" style={{ color: "inherit", textDecoration: "none", fontSize: 13 }}>
            福岡Pilot
          </a>
          <a href="#reserve" style={{ color: "inherit", textDecoration: "none", fontSize: 13 }}>
            予約
          </a>
          <Link
            href="/en"
            style={{
              color: "inherit",
              textDecoration: "none",
              fontSize: 13,
              padding: "8px 10px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.10)",
              background: "#ffffff",
            }}
          >
            EN
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section style={{ padding: "40px 40px 10px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              borderRadius: 24,
              padding: 28,
              background: "rgba(255,255,255,0.70)",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Pill>福岡発</Pill>
              <Pill>高齢者向け</Pill>
              <Pill>超軽量・折りたたみ</Pill>
              <Pill>低速・安全設計</Pill>
            </div>

            <h1
              style={{
                marginTop: 18,
                fontSize: 44,
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
              }}
            >
              寄り添う。
              <br />
              毎日の移動に、安心と自由を。
            </h1>

            <p style={{ marginTop: 14, fontSize: 16, color: "#4f4f4f", lineHeight: 1.8 }}>
              Yorisou は、日本の高齢者の日常にフィットする
              <b>超軽量・折りたたみ型モビリティ</b>を届けます。
              病院、商店街、駅まで。歩くのが少し大変な日でも、外出がもっと気軽に。
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
              <a
                href="#reserve"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 16px",
                  borderRadius: 14,
                  background: "#2c2c2c",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                先行予約 / 体験希望
              </a>
              <a
                href="#pilot"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 16px",
                  borderRadius: 14,
                  background: "#ffffff",
                  color: "#2c2c2c",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  border: "1px solid rgba(0,0,0,0.10)",
                }}
              >
                福岡Pilotを見る
              </a>
            </div>

            <div
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
              }}
            >
              {[
                { k: "重量感", v: "15–18kg級のミニマル設計イメージ" },
                { k: "折りたたみ", v: "スーツケース形状 / 省スペース" },
                { k: "用途", v: "商店街・病院・駅・近距離移動" },
              ].map((x) => (
                <div
                  key={x.k}
                  style={{
                    borderRadius: 16,
                    padding: 12,
                    background: "rgba(255,255,255,0.65)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ fontSize: 12, color: "#6b6b6b" }}>{x.k}</div>
                  <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.5 }}>{x.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              borderRadius: 24,
              padding: 18,
              background: "rgba(255,255,255,0.70)",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.06)",
                background: "#fff",
                flex: 1,
                display: "grid",
                placeItems: "center",
                padding: 10,
              }}
            >
              <img
                src="/images/yorisou-hero.png"
                alt="Yorisou product"
                style={{ width: "100%", height: "auto", objectFit: "contain" }}
              />
            </div>

            <div
              style={{
                borderRadius: 18,
                padding: 14,
                border: "1px solid rgba(0,0,0,0.06)",
                background: "rgba(255,255,255,0.65)",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 14 }}>デモ画像の置き場所</div>
              <div style={{ marginTop: 8, fontSize: 12, color: "#6b6b6b", lineHeight: 1.6 }}>
                1) <code style={{ background: "#fff", padding: "2px 6px", borderRadius: 8 }}>public/images/yorisou-hero.png</code> を配置
                <br />
                2) まだ無ければ、ひとまず空でもOK（後で差し替え）
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" style={{ padding: "34px 40px" }}>
        <SectionTitle
          eyebrow="Products"
          title="高齢者の日常に、自然に溶け込む設計"
          desc="大きすぎず、重すぎず。日本の歩道・駅・病院動線を前提にしたミニマル設計。"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
          }}
        >
          {[
            {
              t: "超軽量・ミニマル",
              d: "見た目も扱いも軽く。持ち運び・保管がラク。",
            },
            {
              t: "折りたたみ収納",
              d: "玄関・車・室内の省スペースに対応。",
            },
            {
              t: "低速・安心設計",
              d: "高齢者の反応速度や街中での安全を重視。",
            },
            {
              t: "日本の生活動線",
              d: "商店街、病院、駅、近距離移動に最適化。",
            },
            {
              t: "やさしいUI",
              d: "難しい操作を減らし、直感的に。",
            },
            {
              t: "福岡Pilot",
              d: "まずは少数導入で価値を検証し、拡大へ。",
            },
          ].map((x) => (
            <div
              key={x.t}
              style={{
                borderRadius: 20,
                padding: 16,
                background: "rgba(255,255,255,0.70)",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 8px 22px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 15 }}>{x.t}</div>
              <div style={{ marginTop: 10, fontSize: 13, color: "#5b5b5b", lineHeight: 1.7 }}>
                {x.d}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pilot */}
      <section id="pilot" style={{ padding: "34px 40px" }}>
        <SectionTitle
          eyebrow="Fukuoka Pilot"
          title="まずは福岡で、2台から"
          desc="大改造はせず、まずは実地で「使われ方」を検証。自治体・施設・病院・商店街との連携を想定。"
        />

        <div
          style={{
            borderRadius: 24,
            padding: 18,
            background: "rgba(255,255,255,0.70)",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 10px 26px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { k: "導入規模", v: "2台（最小で開始）" },
              { k: "目的", v: "高齢者の移動負担軽減 / 外出機会の回復" },
              { k: "想定シーン", v: "病院・駅・商店街・住宅地" },
              { k: "評価", v: "利用頻度 / 安全性 / 使いやすさ / 満足度" },
            ].map((x) => (
              <div
                key={x.k}
                style={{
                  borderRadius: 18,
                  padding: 14,
                  background: "rgba(255,255,255,0.60)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ fontSize: 12, color: "#6b6b6b" }}>{x.k}</div>
                <div style={{ marginTop: 8, fontWeight: 800 }}>{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reserve */}
      <section id="reserve" style={{ padding: "34px 40px 60px" }}>
        <SectionTitle
          eyebrow="Reservation"
          title="先行予約 / 体験希望"
          desc="ご連絡先を残してください。Pilot参加・体験・購入相談など、こちらからご案内します。"
        />

        <div
          style={{
            borderRadius: 24,
            padding: 18,
            background: "rgba(255,255,255,0.70)",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 10px 26px rgba(0,0,0,0.04)",
            maxWidth: 860,
          }}
        >
          <form
            action="/api/reservations"
            method="post"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <input
              name="name"
              placeholder="お名前"
              required
              style={{
                padding: "12px 12px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "#fff",
                gridColumn: "span 1",
              }}
            />
            <input
              name="contact"
              placeholder="連絡先（電話 / メール）"
              required
              style={{
                padding: "12px 12px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "#fff",
                gridColumn: "span 1",
              }}
            />
            <input
              name="city"
              placeholder="お住まい（例：福岡市）"
              style={{
                padding: "12px 12px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "#fff",
                gridColumn: "span 1",
              }}
            />
            <select
              name="interest"
              style={{
                padding: "12px 12px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "#fff",
                gridColumn: "span 1",
              }}
              defaultValue="trial"
            >
              <option value="trial">体験したい</option>
              <option value="pilot">Pilot参加したい</option>
              <option value="buy">購入相談したい</option>
              <option value="partner">協業したい</option>
            </select>

            <textarea
              name="message"
              placeholder="メッセージ（任意）"
              rows={4}
              style={{
                padding: "12px 12px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "#fff",
                gridColumn: "span 2",
                resize: "vertical",
              }}
            />

            <button
              type="submit"
              style={{
                gridColumn: "span 2",
                padding: "12px 14px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "#2c2c2c",
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              送信
            </button>

            <div style={{ gridColumn: "span 2", fontSize: 12, color: "#6b6b6b", lineHeight: 1.6 }}>
              ※ 送信後に画面遷移はしません（API実装は次のステップで仕上げます）。
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "18px 40px 28px",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          color: "#6b6b6b",
          fontSize: 12,
        }}
      >
        <div>© {new Date().getFullYear()} Yorisou 寄り添う</div>
      </footer>
    </main>
  );
}