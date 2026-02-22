export default function Home() {
  const FORM_ACTION = "https://formspree.io/f/xlgwpoek";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0c10",
        color: "#e8e8ea",
        padding: "56px 20px",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
      }}
    >
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              aria-hidden
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            />
            <div>
              <div style={{ fontSize: 13, letterSpacing: 0.6, opacity: 0.75 }}>
                Yorisou 寄り添う
              </div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>
                Japan mobility • pilot-first • community-ready
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a
              href="#contact"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                textDecoration: "none",
                fontSize: 13,
              }}
            >
              Contact / お問い合わせ
            </a>
          </div>
        </div>

        {/* Hero */}
        <div
          style={{
            borderRadius: 24,
            padding: "34px 26px",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 20px 80px rgba(0,0,0,0.45)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.35fr 0.65fr", gap: 24 }}>
            <div>
              <h1 style={{ fontSize: 44, margin: 0, lineHeight: 1.12 }}>
                寄り添う移動を、日本のまちへ。
              </h1>
              <p style={{ marginTop: 14, marginBottom: 0, fontSize: 16, opacity: 0.85 }}>
                Yorisou is a Japan-focused, human-centered electric mobility initiative.
                We work with municipalities, community operators, and care-related
                organizations to run <b>pilot programs</b> for safe, low-speed electric mobility.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
                {[
                  "Government & community pilots",
                  "Senior-friendly low-speed EV",
                  "Data-driven safety operations",
                  "Local partner model",
                ].map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 12,
                      padding: "8px 10px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      color: "rgba(255,255,255,0.86)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
                <a
                  href="#pilot"
                  style={{
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: "#ffffff",
                    color: "#0b0c10",
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Pilot Program Overview
                </a>
                <a
                  href="#contact"
                  style={{
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Request a Pilot / 実証相談
                </a>
              </div>
            </div>

            {/* Quick facts */}
            <div
              style={{
                borderRadius: 18,
                padding: 16,
                background: "rgba(0,0,0,0.28)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.75, letterSpacing: 0.5 }}>
                QUICK FACTS
              </div>
              <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                <Fact k="Region" v="Japan (Osaka / Kansai pilot-ready)" />
                <Fact k="Use cases" v="Elderly mobility • community mobility • low-carbon" />
                <Fact k="Approach" v="Pilot → refine → scale with local partners" />
                <Fact k="Status" v="Open for municipality / operator inquiries" />
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div
          style={{
            marginTop: 26,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
          }}
        >
          <Card title="Why Yorisou / なぜ寄り添う？">
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7, opacity: 0.9 }}>
              <li>
                日本の高齢化と地域交通の課題に対して、<b>安全・低速</b>の電動モビリティで支える。
              </li>
              <li>
                行政・地域事業者・ケア領域と連携し、実証を通じて<b>運用モデル</b>を作る。
              </li>
              <li>
                「移動弱者」の自立と尊厳を守り、地域の生活品質（QOL）を上げる。
              </li>
            </ul>
          </Card>

          <Card title="What we pilot / 実証でやること">
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7, opacity: 0.9 }}>
              <li>
                低速4輪EVを用いた、<b>短距離の日常移動</b>（買い物・通院・駅/施設アクセス）。
              </li>
              <li>地域のルール設計（速度、走行エリア、保険、運用SOP）。</li>
              <li>利用者の声・事故ゼロ運用の学習による改善サイクル。</li>
            </ul>
          </Card>
        </div>

        {/* Pilot Program */}
        <section id="pilot" style={{ marginTop: 22 }}>
          <div
            style={{
              borderRadius: 24,
              padding: "22px 22px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 22 }}>Pilot Program (実証) — 30–90 days</h2>
            <p style={{ marginTop: 10, marginBottom: 0, opacity: 0.85, lineHeight: 1.7 }}>
              We start small, prove safety & operations, then scale. A typical pilot includes:
            </p>

            <div
              style={{
                marginTop: 14,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 14,
              }}
            >
              <Mini
                title="1) Scope & Site"
                body="Define pilot area, routes, user group, and local constraints."
              />
              <Mini
                title="2) Operations & Safety"
                body="Training, SOP, parking/charging plan, incident reporting."
              />
              <Mini
                title="3) Review & Scale"
                body="Usage report, lessons learned, and scale-out plan with partners."
              />
            </div>

            <div
              style={{
                marginTop: 16,
                borderTop: "1px solid rgba(255,255,255,0.10)",
                paddingTop: 14,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 18,
              }}
            >
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Ideal partners</div>
                <div style={{ opacity: 0.85, lineHeight: 1.7 }}>
                  Municipalities / wards, community operators, senior housing,
                  care-related organizations, local mobility associations.
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>We provide</div>
                <div style={{ opacity: 0.85, lineHeight: 1.7 }}>
                  Pilot design template, basic ops SOP, data collection framework,
                  and partner coordination. (Vehicle & ops details refined per site.)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
            alignItems: "start",
          }}
        >
          <div
            style={{
              borderRadius: 24,
              padding: 22,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 22 }}>Contact / お問い合わせ</h2>
            <p style={{ marginTop: 10, opacity: 0.85, lineHeight: 1.7 }}>
              If you are a municipality, operator, or organization interested in a pilot,
              send us a message. We respond within 1–2 business days.
            </p>

            <form
              action={FORM_ACTION}
              method="POST"
              style={{ marginTop: 14, display: "grid", gap: 10 }}
            >
              <div style={{ display: "grid", gap: 8 }}>
                <label style={{ fontSize: 12, opacity: 0.8 }}>Name / お名前</label>
                <input
                  name="name"
                  required
                  style={inputStyle}
                  placeholder="Your name"
                />
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <label style={{ fontSize: 12, opacity: 0.8 }}>Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  style={inputStyle}
                  placeholder="name@organization.jp"
                />
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <label style={{ fontSize: 12, opacity: 0.8 }}>
                  Organization / 自治体・団体名
                </label>
                <input
                  name="organization"
                  style={inputStyle}
                  placeholder="Municipality / Operator / Organization"
                />
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <label style={{ fontSize: 12, opacity: 0.8 }}>
                  Inquiry / ご相談内容
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  style={{ ...inputStyle, resize: "vertical", paddingTop: 10 }}
                  placeholder="Tell us your pilot idea, area, and timeline."
                />
              </div>

              {/* Optional: redirect after success (Formspree supports _next) */}
              <input type="hidden" name="_subject" value="Yorisou Pilot Inquiry" />

              <button
                type="submit"
                style={{
                  marginTop: 6,
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "#ffffff",
                  color: "#0b0c10",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Send / 送信
              </button>

              <div style={{ fontSize: 12, opacity: 0.6, lineHeight: 1.6 }}>
                By submitting, you agree to be contacted regarding this inquiry.
              </div>
            </form>
          </div>

          <div
            style={{
              borderRadius: 24,
              padding: 22,
              background: "rgba(0,0,0,0.22)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 10, fontSize: 16 }}>
              What makes this “functional” today
            </h3>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, opacity: 0.88 }}>
              <li>Domain + HTTPS active</li>
              <li>Clear pilot narrative for government/operators</li>
              <li>Working inquiry form (Formspree)</li>
              <li>Ready to add bilingual pages & documents next</li>
            </ul>

            <div
              style={{
                marginTop: 14,
                padding: 14,
                borderRadius: 16,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                opacity: 0.9,
                lineHeight: 1.7,
              }}
            >
              Next step after this page:
              <br />
              <b>/pilot</b> (pilot playbook), <b>/partners</b>, <b>/docs</b> (download),
              and a simple analytics + email routing.
            </div>
          </div>
        </section>

        {/* Footer */}
        <div style={{ marginTop: 26, opacity: 0.6, fontSize: 12 }}>
          © {new Date().getFullYear()} Yorisou 寄り添う • yorisou.online
        </div>
      </div>
    </main>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "92px 1fr",
        gap: 10,
        padding: "10px 10px",
        borderRadius: 14,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.65 }}>{k}</div>
      <div style={{ fontSize: 12, opacity: 0.9, lineHeight: 1.5 }}>{v}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        borderRadius: 24,
        padding: 22,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>
      <div style={{ marginTop: 10 }}>{children}</div>
    </div>
  );
}

function Mini({ title, body }: { title: string; body: string }) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: 14,
        background: "rgba(0,0,0,0.22)",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 6 }}>{title}</div>
      <div style={{ opacity: 0.85, lineHeight: 1.7, fontSize: 13 }}>{body}</div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 14,
  padding: "10px 12px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.14)",
  color: "#fff",
  outline: "none",
};