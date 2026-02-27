"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const navJa = [
  { href: "/", label: "トップ" },
  { href: "/services", label: "事業内容" },
  { href: "/pilot", label: "実証実験" },
  { href: "/partners", label: "連携" },
  { href: "/about", label: "私たちについて" },
  { href: "/news", label: "お知らせ" },
];

const navEn = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pilot", label: "Pilot Program" },
  { href: "/partners", label: "Partnerships" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
];

function toJapanesePath(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) {
    const base = pathname.replace("/en", "");
    if (base === "/news" || base.startsWith("/news/")) return base;
    if (["/", "/about", "/services", "/pilot", "/partners", "/contact", "/legal"].includes(base)) return base;
    return "/";
  }
  return pathname;
}

function toEnglishPath(pathname: string): string {
  if (pathname === "/") return "/en";
  if (pathname.startsWith("/en")) return pathname;
  if (pathname === "/news" || pathname.startsWith("/news/")) return `/en${pathname}`;
  if (["/about", "/services", "/pilot", "/partners", "/contact", "/legal"].includes(pathname)) return `/en${pathname}`;
  return "/en";
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");

  const currentPath = isEn ? toJapanesePath(pathname) : pathname;
  const navItems = isEn ? navEn : navJa;

  const langSwitchHref = isEn ? toJapanesePath(pathname) : toEnglishPath(pathname);
  const langSwitchLabel = isEn ? "日本語" : "EN";
  const homeHref = isEn ? "/en" : "/";

  const localizedContactHref = isEn ? "/en/contact" : "/contact";
  const localizedContactLabel = isEn ? "Contact" : "お問い合わせ";

  const normalizedCurrent = useMemo(() => currentPath.replace(/\/$/, "") || "/", [currentPath]);

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
          href={homeHref}
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontWeight: 800,
            letterSpacing: "0.03em",
          }}
        >
          <Image
            src="/images/yorisou-logo.png"
            alt="YORISOU"
            width={40}
            height={40}
            style={{ borderRadius: 8, objectFit: "contain", background: "#fff" }}
          />
          <span>YORISOU</span>
        </Link>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={isEn ? "Menu" : "メニュー"}
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
          {navItems.map((item) => {
            const href = isEn ? toEnglishPath(item.href) : item.href;
            const normalizedHref = item.href.replace(/\/$/, "") || "/";
            const active = normalizedCurrent === normalizedHref || normalizedCurrent.startsWith(`${normalizedHref}/`);

            return (
              <Link key={href} href={href} className={`nav-link ${active ? "active" : ""}`} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            );
          })}
          <Link href={localizedContactHref} className="btn btn-primary" onClick={() => setOpen(false)}>
            {localizedContactLabel}
          </Link>
          <Link href={langSwitchHref} className="lang-switch" onClick={() => setOpen(false)}>
            {langSwitchLabel}
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
        .nav-link:hover,
        .nav-link.active {
          background: var(--surface-soft);
        }
        .lang-switch {
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 13px;
          text-decoration: none;
          font-weight: 700;
          background: var(--surface);
        }
        @media (max-width: 1024px) {
          .mobile-toggle {
            display: block !important;
          }
          .site-nav {
            position: absolute;
            right: 4vw;
            top: 64px;
            width: min(340px, 92vw);
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
