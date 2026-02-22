export default function NewsPage() {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f6f3ec",
          color: "#2c2c2c",
          fontFamily:
            "Hiragino Kaku Gothic ProN, Yu Gothic, system-ui, -apple-system",
          padding: "80px 40px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1 style={{ fontSize: 36, marginBottom: 40 }}>
            お知らせ
          </h1>
  
          <div style={newsBox}>
            <div style={dateStyle}>2026.02</div>
            <div style={titleStyle}>
              福岡市向け小規模モビリティ実証の準備開始
            </div>
            <div style={contentStyle}>
              地域関係者との協議を開始し、実証エリアの候補選定を進めています。
            </div>
          </div>
  
          <div style={newsBox}>
            <div style={dateStyle}>2026.01</div>
            <div style={titleStyle}>
              寄り添う（Yorisou）設立
            </div>
            <div style={contentStyle}>
              福岡を拠点に、高齢社会に対応する地域モビリティ設計事業を開始しました。
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  const newsBox: React.CSSProperties = {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    boxShadow: "0 6px 24px rgba(0,0,0,0.05)",
  };
  
  const dateStyle: React.CSSProperties = {
    fontSize: 13,
    opacity: 0.6,
  };
  
  const titleStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 800,
    marginTop: 6,
  };
  
  const contentStyle: React.CSSProperties = {
    marginTop: 8,
    lineHeight: 1.8,
  };