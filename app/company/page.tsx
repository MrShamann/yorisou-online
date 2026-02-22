export default function CompanyPage() {
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
            会社概要
          </h1>
  
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={tdLeft}>会社名</td>
                <td style={tdRight}>寄り添う（Yorisou）</td>
              </tr>
              <tr>
                <td style={tdLeft}>所在地</td>
                <td style={tdRight}>福岡県福岡市</td>
              </tr>
              <tr>
                <td style={tdLeft}>設立</td>
                <td style={tdRight}>2026年</td>
              </tr>
              <tr>
                <td style={tdLeft}>代表取締役</td>
                <td style={tdRight}>Jin Yang（ジン ヤン）</td>
              </tr>
              <tr>
                <td style={tdLeft}>事業内容</td>
                <td style={tdRight}>
                  地域モビリティ設計・実証プログラム運営
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    );
  }
  
  const tdLeft: React.CSSProperties = {
    padding: "14px 0",
    width: "180px",
    fontWeight: 600,
  };
  
  const tdRight: React.CSSProperties = {
    padding: "14px 0",
  };