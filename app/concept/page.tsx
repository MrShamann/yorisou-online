export default function ConceptPage() {
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
          <h1 style={{ fontSize: 36, marginBottom: 30 }}>
            事業構想
          </h1>
  
          <p style={{ fontSize: 18, lineHeight: 1.9 }}>
            寄り添うは、高齢者向けモビリティ実証を起点とし、
            将来的には地域特性や世代別ニーズに応じた
            複数のモビリティモデルを展開していく構想です。
          </p>
  
          <h2 style={h2}>第一段階（現在）</h2>
          <p style={p}>
            高齢社会における小規模実証モデルの確立。
            安全・運用・地域受容性を検証し、
            再現可能な地域モビリティ設計を構築します。
          </p>
  
          <h2 style={h2}>第二段階（将来）</h2>
          <p style={p}>
            地域巡回型モビリティ、若年層向けマイクロモビリティなど、
            世代や用途別のモデルを段階的に展開します。
          </p>
  
          <h2 style={h2}>長期ビジョン</h2>
          <p style={p}>
            地域単位で持続可能なモビリティネットワークを形成し、
            日本各地へ展開可能な設計基盤を構築します。
          </p>
        </div>
      </main>
    );
  }
  
  const h2: React.CSSProperties = {
    fontSize: 22,
    marginTop: 40,
    marginBottom: 10,
  };
  
  const p: React.CSSProperties = {
    lineHeight: 1.8,
  };