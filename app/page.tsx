import React from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgwpoek";

// Update these when you want
const COMPANY = {
  nameJP: "寄り添う",
  nameEN: "Yorisou",
  taglineJP: "福岡発。高齢社会に、やさしい移動のしくみを。",
  taglineEN: "Fukuoka-born, human-centered mobility for Japan.",
  representative: "Jin Yang（ジン ヤン）",
  emailHint: "（※送信後、通常24時間以内に返信します）",
};

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
      <Header />

      {/* HERO */}
      <section
        style={{
          padding: "36px 24px 28px",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 22,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: "26px 26px 22px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: "#8ca79c",
                }}
              />
              <div style={{ fontSize: 12, opacity: 0.75 }}>
                Fukuoka / Japan • Community Mobility Initiative
              </div>
            </div>

            <h1
              style={{
                fontSize: 38,
                lineHeight: 1.2,
                margin: "14px 0 10px",
                letterSpacing: "-0.02em",
                fontWeight: 900,
              }}
            >
              {COMPANY.nameJP} – {COMPANY.nameEN}
            </h1>

            <p
              style={{
                fontSize: 18,
                lineHeight: 1.8,
                margin: "0 0 14px",
                maxWidth: 680,
              }}
            >
              {COMPANY.taglineJP}
              <br />
              <span style={{ opacity: 0.75 }}>{COMPANY.taglineEN}</span>
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 14,
              }}
            >
              <a href="#pilot" style={primaryBtn}>
                福岡 Pilot 提案を見る
              </a>
              <a href="#contact" style={secondaryBtn}>
                相談・問い合わせ
              </a>
              <a href="/en" style={chipBtn}>
                English
              </a>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
                marginTop: 18,
              }}
            >
              {[
                { t: "目的", v: "高齢者の日常移動を安全・低負担で支援" },
                { t: "対象", v: "自治体 / 福祉施設 / 地域事業者" },
                { t: "導入", v: "30〜90日Pilot → 改善 → 本格展開" },
                { t: "重視", v: "事故ゼロ / 満足度 / 運用の再現性" },
              ].map((x) => (
                <div
                  key={x.t}
                  style={{
                    background: "#f6f3ec",
                    borderRadius: 14,
                    padding: "14px 14px",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ fontSize: 12, opacity: 0.75 }}>{x.t}</div>
                  <div style={{ marginTop: 6, fontWeight: 900 }}>{x.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "#0e0f10",
              borderRadius: 18,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
              border: "1px solid rgba(0,0,0,0.12)",
              minHeight: 320,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(/images/hero-fukuoka-mobility.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "contrast(1.02) saturate(1.02)",
                opacity: 0.88,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.70) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 18,
                right: 18,
                bottom: 16,
                color: "#fff",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.85 }}>
                イメージ（コミュニティ移動の風景）
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, marginTop: 6 }}>
                福岡の街で、小さく始めて、確実に検証する。
              </div>
              <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>
                Pilotで「安全」「運用」「合意形成」を揃え、拡大可能なモデルへ。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NAV STRIP */}
      <section style={{ padding: "0 24px 22px" }}>
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <a href="#about" style={miniLink}>
            会社概要
          </a>
          <a href="#vision" style={miniLink}>
            Vision / Mission
          </a>
          <a href="#products" style={miniLink}>
            事業・プロダクト
          </a>
          <a href="#pilot" style={miniLink}>
            福岡 Pilot
          </a>
          <a href="#contact" style={miniLink}>
            お問い合わせ
          </a>
        </div>
      </section>

      {/* CONTENT */}
      <section style={{ padding: "0 24px 70px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Grid>
            <Card id="about" title="会社概要（概要版）" subtitle="日本法人として、地域の合意形成と安全運用を最優先に設計します。">
              <SpecRow k="法人" v="日本（福岡を起点に展開）" />
              <SpecRow k="領域" v="高齢福祉 × 地域移動（Community Mobility）" />
              <SpecRow k="代表" v={COMPANY.representative} />
              <SpecRow k="方針" v="最小Pilot → 実装・改善 → 拡大（再現性重視）" />
              <div style={{ marginTop: 10, fontSize: 13, opacity: 0.8, lineHeight: 1.8 }}>
                ※現段階は「実証・合意形成のための企業ページ」です。行政・施設・地域事業者との共同設計を前提にしています。
              </div>
            </Card>

            <Card id="vision" title="Vision / Mission" subtitle="日本人の生活リズム・地域文化に合う、静かで確かな移動のインフラへ。">
              <h3 style={h3}>Vision</h3>
              <p style={p}>
                誰もが年齢に関係なく、安心して“行きたい場所へ行ける”社会をつくる。
              </p>
              <h3 style={h3}>Mission</h3>
              <ul style={ul}>
                <li>地域の現実（道路、段差、導線、住民合意）に合わせて設計する</li>
                <li>安全と運用の再現性を最優先し、事故ゼロの仕組みをつくる</li>
                <li>Pilotで得たデータをもとに改善を回し、持続可能なモデルへ</li>
              </ul>
              <h3 style={h3}>Values（価値観）</h3>
              <ul style={ul}>
                <li>慎重さ：拡大より先に安全と合意を固める</li>
                <li>実装力：紙ではなく現場で動く仕組みに落とす</li>
                <li>敬意：利用者・介助者・地域の声を設計の中心に置く</li>
              </ul>
            </Card>
          </Grid>

          <Grid>
            <Card
              id="products"
              title="事業・プロダクト（ロードマップ）"
              subtitle="高齢福祉を入口に、将来的には年齢や用途別のモビリティを整備します。"
            >
              <div style={{ display: "grid", gap: 12 }}>
                <RoadmapItem
                  phase="Phase 1（今）"
                  title="高齢者向け 低速4輪モビリティ"
                  desc="安全運用・導線設計・地域連携を含めた“運用パッケージ”として提供。"
                />
                <RoadmapItem
                  phase="Phase 2（次）"
                  title="施設/自治体向け 管理・予約・点検の簡易システム"
                  desc="運行ルール、点検、日次レポート、アンケートを標準化し、現場負担を軽減。"
                />
                <RoadmapItem
                  phase="Phase 3（将来）"
                  title="ライフステージ別の子ブランド展開"
                  desc="高齢者・子育て・観光・地域交通など、用途ごとの子ブランド/車種を検討。"
                />
              </div>
              <div style={{ marginTop: 14, fontSize: 13, opacity: 0.8, lineHeight: 1.8 }}>
                ※車両の最終仕様・保険・運用スキームは、Pilotでの協議内容を踏まえて確定します。
              </div>
            </Card>

            <Card
              id="pilot"
              title="福岡 Pilot（30〜90日）提案"
              subtitle="小規模で始めて、安全・運用・住民満足の3点を同時に検証します。"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 12,
                }}
              >
                <MiniCard t="期間" v="30–90日" />
                <MiniCard t="想定エリア" v="住宅地 / 商業施設 / 医療・公共施設導線" />
                <MiniCard t="対象" v="高齢者（買い物・通院・駅・公共施設）" />
                <MiniCard t="KPI" v="利用回数 / 満足度 / 事故件数 / 運用コスト" />
              </div>

              <h3 style={{ ...h3, marginTop: 16 }}>実証の設計（例）</h3>
              <ol style={ol}>
                <li>エリア/ルール/速度上限/運用時間帯の確定</li>
                <li>運行管理（簡易予約・乗降ポイント・日次点検）</li>
                <li>安全運用（講習、ヘルメット/シートベルト等の運用方針）</li>
                <li>データ収集（利用ログ、アンケート、ヒヤリハット）</li>
                <li>改善サイクル（週次レポート → ルール/導線を調整）</li>
              </ol>

              <h3 style={{ ...h3, marginTop: 16 }}>役割分担（案）</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: 12,
                }}
              >
                <RoleCard
                  title="自治体 / 関係機関"
                  items={[
                    "実証エリアの調整・関係者調整",
                    "安全要件/運用要件の合意",
                    "地域広報（参加者募集の協力）",
                  ]}
                />
                <RoleCard
                  title="Yorisou"
                  items={[
                    "車両/運行設計/安全講習の提供",
                    "運用SOP・日次点検・簡易ダッシュボード",
                    "週次レポート・改善提案",
                  ]}
                />
              </div>

              <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href="/business" style={secondaryBtn}>
                  企業向けページを見る
                </a>
                <a href="/pilot" style={primaryBtn}>
                  Pilotページを見る
                </a>
              </div>

              <div style={{ marginTop: 14, fontSize: 12, opacity: 0.7, lineHeight: 1.8 }}>
                ※本ページは実証のたたき台です。詳細（車両仕様/保険/合意書式）は協議の上で確定します。
              </div>
            </Card>
          </Grid>

          {/* CONTACT */}
          <div id="contact" style={{ marginTop: 18 }}>
            <Card
              title="お問い合わせ / Pilot相談"
              subtitle="自治体・福祉施設・地域事業者の皆さま：Pilot相談、導線設計、運用スキームの共同設計をご一緒します。"
            >
              <form
                action={FORMSPREE_ENDPOINT}
                method="POST"
                style={{ display: "grid", gap: 12, maxWidth: 720 }}
              >
                <input type="hidden" name="_subject" value="Yorisou contact request" />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="お名前" name="name" placeholder="例：山田 太郎" required />
                  <Field label="メール" name="email" placeholder="例：taro@example.com" type="email" required />
                </div>

                <Field
                  label="所属 / 団体名（任意）"
                  name="organization"
                  placeholder="例：福岡市 / ○○介護施設 / ○○商店街"
                />

                <Field
                  label="ご相談内容"
                  name="message"
                  placeholder="例：Pilotの候補エリア、期間、参加者、想定課題など"
                  textarea
                  required
                />

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <button type="submit" style={primaryBtn as any}>
                    送信する
                  </button>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>{COMPANY.emailHint}</div>
                </div>
              </form>

              <div style={{ marginTop: 14, fontSize: 12, opacity: 0.75 }}>
                送信がうまくいかない場合：ブラウザを更新して再送、または別のメールアドレスでお試しください。
              </div>
            </Card>
          </div>

          <Footer />
        </div>
      </section>
    </main>
  );
}

/* ---------------- Components ---------------- */

function Header() {
  return (
    <header style={{ padding: "18px 24px 0" }}>
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img
            src="/images/yorisou-logo.png"
            alt="Yorisou"
            style={{ height: 64, width: "auto" }}
          />
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>
              {COMPANY.nameJP} – {COMPANY.nameEN}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Community Mobility Initiative</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <a href="/" style={chipBtn}>
            日本語
          </a>
          <a href="/en" style={chipBtn}>
            English
          </a>
          <a href="/pilot" style={chipBtn}>
            Pilot
          </a>
          <a href="/business" style={chipBtn}>
            Business
          </a>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <div style={{ marginTop: 18, padding: "18px 6px 0", opacity: 0.75, fontSize: 12 }}>
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 14 }}>
        <div>© {new Date().getFullYear()} Yorisou（寄り添う）</div>
        <div style={{ marginTop: 6 }}>
          Representative: {COMPANY.representative} • Fukuoka, Japan
        </div>
      </div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
        gap: 16,
        marginTop: 16,
      }}
    >
      {children}
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
  id,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: 20,
        boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 900 }}>{title}</div>
        {subtitle ? (
          <div style={{ fontSize: 13, opacity: 0.75, marginTop: 6, lineHeight: 1.7 }}>
            {subtitle}
          </div>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        gap: 10,
        padding: "8px 0",
        borderBottom: "1px dashed rgba(0,0,0,0.10)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.7 }}>{k}</div>
      <div style={{ fontWeight: 800 }}>{v}</div>
    </div>
  );
}

function MiniCard({ t, v }: { t: string; v: string }) {
  return (
    <div
      style={{
        background: "#f6f3ec",
        borderRadius: 14,
        padding: 14,
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.75 }}>{t}</div>
      <div style={{ marginTop: 6, fontWeight: 900 }}>{v}</div>
    </div>
  );
}

function RoleCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div
      style={{
        background: "#f6f3ec",
        borderRadius: 14,
        padding: 14,
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontWeight: 900 }}>{title}</div>
      <ul style={{ marginTop: 10, lineHeight: 1.9, paddingLeft: 18 }}>
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

function RoadmapItem({
  phase,
  title,
  desc,
}: {
  phase: string;
  title: string;
  desc: string;
}) {
  return (
    <div
      style={{
        background: "#f6f3ec",
        borderRadius: 14,
        padding: 14,
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.75 }}>{phase}</div>
      <div style={{ fontWeight: 900, marginTop: 6 }}>{title}</div>
      <div style={{ fontSize: 13, opacity: 0.8, marginTop: 6, lineHeight: 1.8 }}>
        {desc}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
  type,
  textarea,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  textarea?: boolean;
}) {
  const baseStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.14)",
    outline: "none",
    fontSize: 14,
    background: "#fff",
  };

  return (
    <label style={{ display: "grid", gap: 6 }}>
      <div style={{ fontSize: 12, opacity: 0.75 }}>
        {label} {required ? <span style={{ color: "#b00020" }}>*</span> : null}
      </div>
      {textarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          required={required}
          rows={6}
          style={{ ...baseStyle, resize: "vertical", lineHeight: 1.7 }}
        />
      ) : (
        <input
          name={name}
          type={type || "text"}
          placeholder={placeholder}
          required={required}
          style={baseStyle}
        />
      )}
    </label>
  );
}

/* ---------------- Styles ---------------- */

const primaryBtn: React.CSSProperties = {
  textDecoration: "none",
  padding: "12px 16px",
  borderRadius: 12,
  background: "#8ca79c",
  color: "#fff",
  fontWeight: 900,
  border: "1px solid rgba(0,0,0,0.08)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const secondaryBtn: React.CSSProperties = {
  textDecoration: "none",
  padding: "12px 16px",
  borderRadius: 12,
  background: "#e3dfd6",
  color: "#333",
  fontWeight: 900,
  border: "1px solid rgba(0,0,0,0.08)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const chipBtn: React.CSSProperties = {
  textDecoration: "none",
  fontSize: 13,
  padding: "8px 12px",
  borderRadius: 999,
  background: "#e3dfd6",
  color: "#333",
  fontWeight: 800,
  border: "1px solid rgba(0,0,0,0.08)",
};

const miniLink: React.CSSProperties = {
  textDecoration: "none",
  fontSize: 13,
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.9)",
  color: "#333",
  fontWeight: 800,
  border: "1px solid rgba(0,0,0,0.08)",
};

const h3: React.CSSProperties = { fontSize: 14, fontWeight: 900, margin: "10px 0 6px" };
const p: React.CSSProperties = { fontSize: 13, opacity: 0.85, lineHeight: 1.9, margin: 0 };
const ul: React.CSSProperties = { marginTop: 8, lineHeight: 1.9, paddingLeft: 18 };
const ol: React.CSSProperties = { marginTop: 8, lineHeight: 1.9, paddingLeft: 18 };