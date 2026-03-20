"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const primaryNavJa = [
  { href: "/ai-advisor", label: "モビリティ相談" },
  { href: "/insights", label: "インサイト" },
  { href: "/services", label: "導入・実証" },
  { href: "/about", label: "Yorisouについて" },
];

const primaryNavEn = [
  { href: "/ai-advisor", label: "Advisor" },
  { href: "/insights", label: "Insights" },
  { href: "/services", label: "Solutions" },
  { href: "/about", label: "About" },
];

const secondaryNavJa = [
  { href: "/pilot", label: "実証実験" },
  { href: "/progress", label: "実証進捗" },
  { href: "/partners", label: "連携" },
];

const secondaryNavEn = [
  { href: "/pilot", label: "Pilot Program" },
  { href: "/progress", label: "Progress" },
  { href: "/partners", label: "Partners" },
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
  const localizedContactHref = isEn ? "/en/contact" : "/contact";

  function localizedHref(path: string) {
    return isEn ? toEnglishPath(path) : path;
  }

  function isActive(path: string) {
    const normalizedHref = path.replace(/\/$/, "") || "/";
    return normalizedCurrent === normalizedHref || normalizedCurrent.startsWith(`${normalizedHref}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(245,241,232,0.96)] backdrop-blur-md">
      <div className="container py-4">
        <div className="flex items-center justify-between gap-6">
          <Link href={homeHref} className="flex min-w-0 items-center gap-4 no-underline">
            <div className="flex h-[66px] w-[66px] items-center justify-center rounded-[1.25rem] border border-[#D9CCB8]/75 bg-white shadow-[0_18px_34px_rgba(59,47,47,0.1)] md:h-[78px] md:w-[78px]">
              <Image
                src="/images/brand/tsuru-logo.png"
                alt="YORISOU"
                width={54}
                height={54}
                className="h-auto w-[48px] object-contain md:w-[56px]"
              />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] tracking-[0.22em] text-[var(--muted)]">
                {isEn ? "JAPAN SENIOR MOBILITY" : "JAPAN SENIOR MOBILITY"}
              </div>
              <div className="mt-1 text-[1.22rem] font-semibold tracking-[0.16em] text-[var(--text)] md:text-[1.42rem]">
                YORISOU
              </div>
              <div className="hidden text-sm leading-6 text-[#6E5D4D] md:block">
                {isEn ? "Senior mobility platform for families, communities, and care networks" : "高齢者とご家族の移動を、相談から支えるモビリティプラットフォーム"}
              </div>
            </div>
          </Link>

          <button
            onClick={() => setOpen((value) => !value)}
            aria-label={isEn ? "Menu" : "メニュー"}
            className="mobile-toggle hidden rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)]"
          >
            MENU
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
                >
                  {isEn ? "More" : "その他"}
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
              <Link href={localizedContactHref} className="contact-link" onClick={() => setOpen(false)}>
                {isEn ? "Contact" : "お問い合わせ"}
              </Link>
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
          gap: 14px;
        }
        .primary-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(217, 204, 184, 0.45);
        }
        .nav-link,
        .more-button {
          border: none;
          background: transparent;
          text-decoration: none;
          color: var(--text);
          padding: 10px 14px;
          border-radius: 999px;
          font-size: 14px;
          white-space: nowrap;
          cursor: pointer;
        }
        .nav-link:hover,
        .nav-link.active,
        .more-button:hover,
        .more-button.active {
          background: var(--accent-soft);
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
          font-size: 14px;
        }
        .more-link:hover,
        .more-link.active {
          background: var(--accent-soft);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .contact-link {
          text-decoration: none;
          color: var(--text);
          font-size: 14px;
          padding: 10px 6px;
        }
        .lang-switch {
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 13px;
          text-decoration: none;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.84);
        }
        @media (max-width: 1024px) {
          .mobile-toggle {
            display: block !important;
          }
          .site-nav {
            position: absolute;
            right: 4vw;
            top: 94px;
            width: min(380px, 92vw);
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
            border-radius: 20px;
            padding: 8px;
          }
          .nav-link,
          .more-button,
          .more-link {
            border-radius: 12px;
            padding: 11px 12px;
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
            justify-content: space-between;
          }
        }
        @media (max-width: 640px) {
          .header-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .contact-link {
            padding: 4px 2px 0;
          }
        }
      `}</style>
    </header>
  );
}
