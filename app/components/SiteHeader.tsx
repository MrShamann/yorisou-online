"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "トップ" },
  { href: "/services", label: "事業内容" },
  { href: "/pilot", label: "実証実験" },
  { href: "/partners", label: "連携" },
  { href: "/about", label: "私たちについて" },
  { href: "/news", label: "お知らせ" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(245,246,248,0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 74,
          gap: 12,
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontWeight: 800,
            letterSpacing: "0.03em",
          }}
        >
          {!logoError && (
            <img
              src="/images/yorisou-logo.png"
              alt="YORISOU"
              style={{ width: 40, height: 40, borderRadius: 8, objectFit: "contain", background: "#fff" }}
              onError={() => setLogoError(true)}
            />
          )}
          <span>YORISOU</span>
        </Link>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="メニュー"
          style={{
            display: "none",
            border: "1px solid var(--line)",
            background: "var(--surface)",
            borderRadius: 8,
            padding: "8px 10px",
            fontSize: 12,
            fontWeight: 700,
          }}
          className="mobile-toggle"
        >
          MENU
        </button>

        <nav className={`site-nav ${open ? "open" : ""}`}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-primary" onClick={() => setOpen(false)}>
            お問い合わせ
          </Link>
        </nav>
      </div>
      <style jsx>{`
        .site-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-link {
          text-decoration: none;
          color: var(--text);
          padding: 8px 10px;
          border-radius: 999px;
          font-size: 14px;
          white-space: nowrap;
        }
        .nav-link:hover {
          background: var(--surface-soft);
        }
        @media (max-width: 900px) {
          .mobile-toggle {
            display: block !important;
          }
          .site-nav {
            position: absolute;
            right: 4vw;
            top: 64px;
            width: min(320px, 92vw);
            background: var(--surface);
            border: 1px solid var(--line);
            border-radius: 12px;
            padding: 12px;
            display: none;
            flex-direction: column;
            align-items: stretch;
            box-shadow: 0 16px 30px rgba(20, 29, 41, 0.08);
          }
          .site-nav.open {
            display: flex;
          }
          .nav-link {
            border-radius: 8px;
            padding: 10px;
          }
        }
      `}</style>
    </header>
  );
}
