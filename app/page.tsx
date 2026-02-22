export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f3ec",
        color: "#2c2c2c",
        fontFamily:
          'Hiragino Kaku Gothic ProN, Yu Gothic, system-ui, -apple-system',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "24px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 20 }}>
          寄り添う – Yorisou
        </div>

        <a
          href="/en"
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
      </div>

      {/* Hero Section */}
      <section
        style={{
          padding: "80px 40px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: 44, lineHeight: 1.4, marginBottom: 20 }}>
          福岡から始まる、<br />
          高齢者にやさしい地域モビリティ。
        </h1>

        <p style={{ fontSize: 18, lineHeight: 1.8, maxWidth: 700 }}>
          寄り添うは、日本の高齢化社会に対応するための
          低速電動モビリティ実証プロジェクトです。
          自治体・地域事業者と連携し、
          安全で持続可能な移動モデルを構築します。
        </p>
      </section>

      {/* About Pilot */}
      <section
        style={{
          background: "#ffffff",
          padding: "60px 40px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, marginBottom: 20 }}>
            実証プログラムについて
          </h2>

          <p style={{ lineHeight: 1.8 }}>
            福岡市を起点に、30〜90日間の小規模実証を行います。
            利用エリア、運用ルール、安全基準を設定し、
            実際の利用データと住民の声を基に改善を重ねます。
          </p>
        </div>
      </section>

      {/* Contact */}
      <section
        style={{
          padding: "80px 40px",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <h2 style={{ fontSize: 28, marginBottom: 30 }}>
          お問い合わせ
        </h2>

        <form
          action="https://formspree.io/f/xlgwpoek"
          method="POST"
          style={{ display: "grid", gap: 20 }}
        >
          <input
            name="name"
            placeholder="お名前"
            required
            style={inputStyle}
          />

          <input
            type="email"
            name="email"
            placeholder="メールアドレス"
            required
            style={inputStyle}
          />

          <textarea
            name="message"
            placeholder="ご相談内容"
            rows={5}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              padding: "14px",
              background: "#8ca79c",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            送信する
          </button>
        </form>
      </section>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "14px",
  fontSize: 15,
  borderRadius: 6,
  border: "1px solid #ccc",
};