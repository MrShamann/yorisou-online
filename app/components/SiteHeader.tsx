"use client";
import React from "react";
import Link from "next/link";

export default function SiteHeader({ lang = "jp" }: { lang?: "jp" | "en" }) {
  const isJP = lang === "jp";

  const links = isJP
    ? [
        { href: "/", label: "Home" },
        { href: "/vision", label: "企業理念" },
        { href: "/business", label: "事業内容" },
        { href: "/pilot", label: "Pilot" },
        { href: "/company", label: "会社概要" },
        { href: "/contact", label: "お問い合わせ" },
      ]
    : [
        { href: "/en", label: "Home" },
        { href: "/en/vision", label: "Vision" },
        { href: "/en/business", label: "Business" },
        { href: "/en/pilot", label: "Pilot" },
        { href: "/en/company", label: "Company" },
        { href: "/en/contact", label: "Contact" },
      ];

  return (
    <header
      style={{
        padding: "18px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        backdropFilter: "blur(10px)",
        background: "rgba(246,243,236,0.92)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        zIndex: 50,
      }}
    >
      <Link
        href={isJP ? "/" : "/en"}
        style={{ textDecoration: "none", color: "#222" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/images/yorisou-logo.png"
            alt="Yorisou"
            style={{
              height: 44,
              width: "auto",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.06)",
              background: "#fff",
            }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.1 }}>
              Yorisou
            </div>
            <div style={{ fontSize: 12, color: "#6b6b6b", marginTop: 3 }}>
              {isJP ? "寄り添うモビリティ" : "Community Mobility Initiative"}
            </div>
          </div>
        </div>
      </Link>

      <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {links.map((x) => (
          <Link
            key={x.href}
            href={x.href}
            style={{
              color: "#2c2c2c",
              textDecoration: "none",
              fontSize: 13,
              padding: "8px 10px",
              borderRadius: 10,
            }}
          >
            {x.label}
          </Link>
        ))}

        <Link
          href={isJP ? "/en" : "/"}
          style={{
            color: "#2c2c2c",
            textDecoration: "none",
            fontSize: 13,
            padding: "8px 12px",
            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.10)",
            background: "#ffffff",
            fontWeight: 700,
          }}
        >
          {isJP ? "EN" : "日本語"}
        </Link>
      </nav>
    </header>
  );
}