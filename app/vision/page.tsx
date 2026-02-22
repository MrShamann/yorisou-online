export default function VisionPage() {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f6f3ec",
          color: "#2c2c2c",
          fontFamily:
            'Hiragino Kaku Gothic ProN, Yu Gothic, system-ui, -apple-system',
          padding: "80px 40px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1 style={{ fontSize: 36, marginBottom: 40 }}>
            企業理念
          </h1>
  
          <h2 style={{ fontSize: 22, marginTop: 40 }}>ミッション</h2>
          <p style={{ lineHeight: 1.8 }}>
            高齢社会における移動の不安をなくし、
            地域の安心とつながりを支える。
          </p>
  
          <h2 style={{ fontSize: 22, marginTop: 40 }}>ビジョン</h2>
          <p style={{ lineHeight: 1.8 }}>
            地域単位で持続可能なモビリティモデルを構築し、
            日本各地に展開できる設計基盤をつくる。
          </p>
  
          <h2 style={{ fontSize: 22, marginTop: 40 }}>バリュー</h2>
          <ul style={{ lineHeight: 2 }}>
            <li>安全第一</li>
            <li>地域共創</li>
            <li>実証重視</li>
            <li>長期視点</li>
          </ul>
        </div>
      </main>
    );
  }