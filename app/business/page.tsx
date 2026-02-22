export default function BusinessPage() {
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
            事業内容
          </h1>
  
          <h2 style={{ fontSize: 22, marginTop: 40 }}>
            1. 実証プログラム設計
          </h2>
          <p style={{ lineHeight: 1.8 }}>
            地域単位で30〜90日間の小規模モビリティ実証を設計。
            運用ルール・安全基準・利用データの取得体制を整備します。
          </p>
  
          <h2 style={{ fontSize: 22, marginTop: 40 }}>
            2. モビリティ提供
          </h2>
          <p style={{ lineHeight: 1.8 }}>
            高齢者に配慮した低速電動四輪車両を提供。
            小回り性能・安全設計・地域環境適合性を重視します。
          </p>
  
          <h2 style={{ fontSize: 22, marginTop: 40 }}>
            3. 運用サポート
          </h2>
          <p style={{ lineHeight: 1.8 }}>
            保守管理・利用状況分析・レポート作成を通じ、
            自治体や地域事業者との継続的な改善を行います。
          </p>
        </div>
      </main>
    );
  }