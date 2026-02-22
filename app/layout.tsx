export const metadata = {
  title: "Yorisou",
  description: "地域モビリティ設計会社",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          fontFamily:
            'Hiragino Kaku Gothic ProN, Yu Gothic, system-ui, -apple-system',
          background: "#f6f3ec",
          color: "#2c2c2c",
        }}
      >
        <header
          style={{
            padding: "20px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#ffffff",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <div style={{ fontWeight: 700 }}>
            <a href="/" style={{ textDecoration: "none", color: "#2c2c2c" }}>
              寄り添う – Yorisou
            </a>
          </div>

          <nav style={{ display: "flex", gap: 24, fontSize: 14 }}>
            <a href="/vision" style={{ textDecoration: "none", color: "#333" }}>
              企業理念
            </a>
            <a href="/business" style={{ textDecoration: "none", color: "#333" }}>
              事業内容
            </a>
            <a href="/company" style={{ textDecoration: "none", color: "#333" }}>
              会社概要
            </a>
            <a href="/" style={{ textDecoration: "none", color: "#333" }}>
              お問い合わせ
            </a>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}