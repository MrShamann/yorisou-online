"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname() || "/";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");

  const legalHref = isEn ? "/en/legal" : "/legal";
  const contactHref = isEn ? "/en/contact" : "/contact";
  const aboutHref = isEn ? "/en/about" : "/about";
  const insightsHref = isEn ? "/en/insights" : "/insights";
  const servicesHref = isEn ? "/en/services" : "/services";

  return (
    <footer style={{ marginTop: 72, borderTop: "1px solid var(--line)", background: "rgba(255,255,255,0.7)" }}>
      <div className="container" style={{ padding: "36px 0" }}>
        <div
          style={{
            display: "flex",
            gap: 18,
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div
              style={{
                height: 52,
                width: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 16,
                border: "1px solid rgba(217,204,184,0.7)",
                background: "#fff",
                boxShadow: "0 12px 28px rgba(59,47,47,0.06)",
              }}
            >
              <Image src="/images/brand/tsuru-logo.png" alt="YORISOU" width={34} height={34} />
            </div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--muted)" }}>
                {isEn ? "SENIOR MOBILITY PLATFORM" : "シニアモビリティプラットフォーム"}
              </div>
              <div style={{ marginTop: 4, fontWeight: 800, letterSpacing: "0.12em" }}>YORISOU</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
              {isEn
                ? "Built from Fukuoka validation with mobility support and insights"
                : "福岡での検証とインサイトを起点に育てる高齢者移動支援"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 13, paddingTop: 8 }}>
            <Link href={aboutHref}>{isEn ? "About" : "Yorisouについて"}</Link>
            <Link href={servicesHref}>{isEn ? "Solutions" : "導入・実証"}</Link>
            <Link href={insightsHref}>{isEn ? "Insights" : "インサイト"}</Link>
            <Link href={legalHref}>{isEn ? "Terms & Privacy" : "利用規約・プライバシーポリシー"}</Link>
            <Link href={contactHref}>{isEn ? "Contact" : "お問い合わせ"}</Link>
          </div>
        </div>
        <div className="muted" style={{ marginTop: 18, fontSize: 12 }}>
          © {new Date().getFullYear()} YORISOU. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
