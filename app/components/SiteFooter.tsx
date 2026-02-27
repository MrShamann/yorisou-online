import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer style={{ marginTop: 64, borderTop: "1px solid var(--line)", background: "var(--surface)" }}>
      <div className="container" style={{ padding: "28px 0" }}>
        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontWeight: 800 }}>YORISOU</div>
            <div className="muted" style={{ fontSize: 13 }}>
              福岡発・地域モビリティ実証と運用設計
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 13 }}>
            <Link href="/legal">利用規約・プライバシーポリシー</Link>
            <Link href="/contact">お問い合わせ</Link>
          </div>
        </div>
        <div className="muted" style={{ marginTop: 12, fontSize: 12 }}>
          © {new Date().getFullYear()} YORISOU. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
