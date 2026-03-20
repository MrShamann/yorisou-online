"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const primaryNavJa = [
  { href: "/ai-advisor", label: "モビリティ相談" },
  { href: "/insights", label: "インサイト" },
  { href: "/services", label: "導入・実証" },
];

const primaryNavEn = [
  { href: "/ai-advisor", label: "Advisor" },
  { href: "/insights", label: "Insights" },
  { href: "/services", label: "Solutions" },
];

const secondaryNavJa = [
  { href: "/about", label: "Yorisouについて" },
  { href: "/pilot", label: "実証実験" },
  { href: "/progress", label: "実証進捗" },
  { href: "/partners", label: "連携" },
  { href: "/contact", label: "お問い合わせ" },
];

const secondaryNavEn = [
  { href: "/about", label: "About" },
  { href: "/pilot", label: "Pilot Program" },
  { href: "/progress", label: "Progress" },
  { href: "/partners", label: "Partners" },
  { href: "/contact", label: "Contact" },
];

function toJapanesePath(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) {
    const base = pathname.replace("/en", "");
    if (["/", "/about", "/services", "/pilot", "/progress", "/partners", "/contact", "/legal", "/ai-advisor", "/insights"].includes(base)) return base;
    return "/";
  }
  return pathname;
}

function toEnglishPath(pathname: string): string {
  if (pathname === "/") return "/en";
  if (pathname.startsWith("/en")) return pathname;
  if (["/about", "/services", "/pilot", "/progress", "/partners", "/contact", "/legal", "/ai-advisor", "/insights"].includes(pathname)) return `/en${pathname}`;
  return "/en";
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname() || "/";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const homeHref = isEn ? "/en" : "/";
  const currentPath = isEn ? toJapanesePath(pathname) : pathname;
  const normalizedCurrent = useMemo(() => currentPath.replace(/\/$/, "") || "/", [currentPath]);
  const primaryNav = isEn ? primaryNavEn : primaryNavJa;
  const secondaryNav = isEn ? secondaryNavEn : secondaryNavJa;
  const langSwitchHref = isEn ? toJapanesePath(pathname) : toEnglishPath(pathname);

  function localizedHref(path: string) {
    return isEn ? toEnglishPath(path) : path;
  }

  function isActive(path: string) {
    const normalizedHref = path.replace(/\/$/, "") || "/";
    return normalizedCurrent === normalizedHref || normalizedCurrent.startsWith(`${normalizedHref}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(217,204,184,0.42)] bg-[rgba(245,241,232,0.88)] backdrop-blur-xl">
      <div className="container py-4">
        <div className="flex items-center justify-between gap-6">
          <Link href={homeHref} className="flex min-w-0 items-center gap-4 no-underline">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[1.35rem] border border-[#D9CCB8]/72 bg-white/94 shadow-[0_14px_34px_rgba(59,47,47,0.08)] md:h-[84px] md:w-[84px]">
              <Image src="/images/brand/tsuru-logo.png" alt="YORISOU" width={62} height={62} className="h-auto w-[54px] object-contain md:w-[60px]" />
            </div>
            <div className="min-w-0">
              <div className="text-[1.32rem] font-semibold tracking-[0.2em] text-[var(--text)] md:text-[1.62rem]">YORISOU</div>
              <div className="mt-1 hidden text-sm leading-6 text-[#6E5D4D] md:block">
                {isEn ? "Calm mobility support for seniors and families in Japan" : "高齢者とご家族の移動相談に、静かに寄り添うサービス"}
              </div>
            </div>
          </Link>

          <button
            onClick={() => setOpen((value) => !value)}
            aria-label={isEn ? "Menu" : "メニュー"}
            className="mobile-toggle hidden items-center justify-center rounded-full border border-[rgba(217,204,184,0.6)] bg-white/84 text-[var(--text)]"
          >
            <span className="menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          <div className={`site-nav ${open ? "open" : ""}`}>
            <nav className="primary-nav">
              {primaryNav.map((item) => {
                const href = localizedHref(item.href);
                const active = isActive(item.href);

                return (
                  <Link key={href} href={href} className={`nav-link ${active ? "active" : ""}`} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                );
              })}

              <div className="more-wrap">
                <button
                  type="button"
                  className={`more-button ${secondaryNav.some((item) => isActive(item.href)) ? "active" : ""}`}
                  onClick={() => setMoreOpen((value) => !value)}
                  aria-label={isEn ? "More" : "その他の案内"}
                >
                  <span className="menu-icon" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                </button>
                <div className={`more-menu ${moreOpen ? "open" : ""}`}>
                  {secondaryNav.map((item) => (
                    <Link
                      key={item.href}
                      href={localizedHref(item.href)}
                      className={`more-link ${isActive(item.href) ? "active" : ""}`}
                      onClick={() => {
                        setOpen(false);
                        setMoreOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            <div className="header-actions">
              <Link href={langSwitchHref} className="lang-switch" onClick={() => setOpen(false)}>
                {isEn ? "日本語" : "EN"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .site-nav {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .primary-nav {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 4px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(217, 204, 184, 0.24);
        }
        .nav-link,
        .more-button {
          border: none;
          background: transparent;
          text-decoration: none;
          color: var(--text);
          padding: 10px 13px;
          border-radius: 999px;
          font-size: 12px;
          white-space: nowrap;
          cursor: pointer;
        }
        .more-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 38px;
        }
        .nav-link:hover,
        .nav-link.active,
        .more-button:hover,
        .more-button.active {
          background: rgba(243, 235, 224, 0.8);
        }
        .menu-icon {
          display: inline-flex;
          flex-direction: column;
          gap: 3px;
          justify-content: center;
          align-items: center;
          width: 18px;
          height: 18px;
        }
        .menu-icon span {
          display: block;
          width: 14px;
          height: 1.5px;
          border-radius: 999px;
          background: currentColor;
        }
        .more-wrap {
          position: relative;
        }
        .more-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 10px);
          min-width: 220px;
          display: none;
          flex-direction: column;
          gap: 4px;
          padding: 10px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(217, 204, 184, 0.65);
          box-shadow: 0 18px 36px rgba(59, 47, 47, 0.12);
        }
        .more-menu.open {
          display: flex;
        }
        .more-link {
          text-decoration: none;
          color: var(--text);
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 13px;
        }
        .more-link:hover,
        .more-link.active {
          background: var(--accent-soft);
        }
        .header-actions {
          display: flex;
          align-items: center;
        }
        .lang-switch {
          border: 1px solid rgba(217, 204, 184, 0.55);
          border-radius: 999px;
          padding: 8px 11px;
          font-size: 12px;
          text-decoration: none;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.72);
        }
        @media (max-width: 1024px) {
          .mobile-toggle {
            display: inline-flex !important;
            width: 40px;
            height: 40px;
          }
          .site-nav {
            position: absolute;
            right: 4vw;
            top: 96px;
            width: min(360px, 92vw);
            display: none;
            flex-direction: column;
            align-items: stretch;
            padding: 16px;
            border-radius: 24px;
            background: rgba(255, 255, 255, 0.97);
            border: 1px solid rgba(217, 204, 184, 0.75);
            box-shadow: 0 20px 40px rgba(59, 47, 47, 0.12);
          }
          .site-nav.open {
            display: flex;
          }
          .primary-nav {
            flex-direction: column;
            align-items: stretch;
            border-radius: 18px;
            padding: 8px;
          }
          .nav-link,
          .more-button,
          .more-link {
            border-radius: 12px;
            padding: 11px 12px;
          }
          .more-button {
            justify-content: space-between;
            min-width: 0;
          }
          .more-menu {
            position: static;
            min-width: 0;
            margin-top: 6px;
            box-shadow: none;
            border-radius: 16px;
            background: #fcfaf6;
          }
          .header-actions {
            justify-content: flex-end;
          }
        }
      `}</style>
    </header>
  );
}
