"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const primaryNavJa = [
  { href: "/check-in", label: "クイックチェック" },
  { href: "/tests", label: "テスト一覧" },
];

const primaryNavEn = [
  { href: "/en/check-in", label: "Quick Check" },
  { href: "/tests", label: "Tests" },
];

const secondaryNavJa = [
  { href: "/about", label: "Yorisouとは" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/legal", label: "利用規約" },
  { href: "/privacy", label: "プライバシーポリシー" },
];

const secondaryNavEn = [
  { href: "/en/about", label: "About Yorisou" },
  { href: "/en/contact", label: "Contact" },
  { href: "/en/legal", label: "Terms" },
];

function toJapanesePath(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) {
    const base = pathname.replace("/en", "");
    if (["/", "/reservation-mobility-support", "/about", "/services", "/tests", "/contact", "/legal", "/support", "/products", "/login", "/register"].includes(base)) return base;
    return "/";
  }
  return pathname;
}

function toEnglishPath(pathname: string): string {
  if (pathname === "/") return "/en";
  if (pathname.startsWith("/en")) return pathname;
  if (["/reservation-mobility-support", "/about", "/services", "/tests", "/contact", "/legal", "/support", "/products", "/login", "/register"].includes(pathname)) return `/en${pathname}`;
  return "/en";
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const homeHref = isEn ? "/en" : "/";
  const currentPath = isEn ? toJapanesePath(pathname) : pathname;
  const normalizedCurrent = useMemo(() => currentPath.replace(/\/$/, "") || "/", [currentPath]);
  const primaryNav = isEn ? primaryNavEn : primaryNavJa;
  const secondaryNav = isEn ? secondaryNavEn : secondaryNavJa;
  const languageHref = isEn ? toJapanesePath(pathname) : toEnglishPath(pathname);

  function localizedHref(path: string) {
    return isEn ? toEnglishPath(path) : path;
  }

  function isActive(path: string) {
    const normalizedHref = path.replace(/\/$/, "") || "/";
    return normalizedCurrent === normalizedHref || normalizedCurrent.startsWith(`${normalizedHref}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(216,207,195,0.56)] bg-[rgba(252,250,245,0.92)] backdrop-blur-xl">
      <div className="container py-4">
        <div className="flex items-center justify-between gap-5">
          <Link href={homeHref} className="flex min-w-0 items-center gap-3 no-underline md:gap-4">
            <div className="flex items-center justify-center">
              <Image
                src="/images/brand/tsuru-logo.png"
                alt="YORISOU"
                width={132}
                height={132}
                priority
                className="h-auto w-[108px] object-contain drop-shadow-[0_7px_14px_rgba(63,45,39,0.08)] md:w-[138px]"
              />
            </div>
            <div className="min-w-0">
              <div className="display-serif text-[1.78rem] font-semibold tracking-[0.09em] text-[var(--text)] md:text-[2.12rem]">YORISOU</div>
              <div className="mt-0.5 hidden text-[0.82rem] leading-7 text-[var(--muted)] md:block">
                {isEn ? "Understand your current state and find useful next steps." : "いまの自分を理解し、次の一歩を見つける。"}
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

              <div className="secondary-nav-wrap">
                {secondaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={localizedHref(item.href)}
                    className={`nav-link secondary-nav-link ${isActive(item.href) ? "active" : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="header-actions">
              <Link href={languageHref} className="locale-switch" onClick={() => setOpen(false)}>
                <span className="locale-current">{isEn ? "EN" : "JP"}</span>
                <span className="locale-target">{isEn ? "日本語" : "EN"}</span>
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
          gap: 1px;
          padding: 4px 6px;
          border-radius: 20px;
          background: rgba(252, 250, 245, 0.74);
          border: 1px solid rgba(201, 211, 195, 0.54);
          box-shadow: 0 8px 14px rgba(47, 35, 33, 0.028);
        }
        .nav-link,
        .more-button {
          border: none;
          background: transparent;
          text-decoration: none;
          color: var(--text);
          padding: 10px 12px;
          border-radius: 14px;
          font-size: 12px;
          white-space: nowrap;
          cursor: pointer;
        }
        .nav-link:hover,
        .nav-link.active {
          background: rgba(225, 232, 219, 0.82);
          color: var(--accent-sage-text);
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
        .secondary-nav-wrap {
          display: none;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .login-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          padding: 0 14px;
          border-radius: 15px;
          border: 1px solid rgba(201, 211, 195, 0.56);
          background: rgba(252, 250, 245, 0.88);
          box-shadow: 0 6px 14px rgba(59, 47, 47, 0.028);
          color: var(--text);
          font-size: 12px;
          text-decoration: none;
        }
        .login-link:hover,
        .login-link.active {
          background: rgba(225, 232, 219, 0.8);
        }
        .locale-switch {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(201, 211, 195, 0.58);
          border-radius: 16px;
          padding: 9px 11px;
          text-decoration: none;
          background: rgba(252, 250, 245, 0.92);
          box-shadow: 0 8px 16px rgba(59, 47, 47, 0.03);
          color: var(--text);
        }
        .locale-current {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 34px;
          height: 28px;
          border-radius: 12px;
          background: rgba(225, 232, 219, 0.86);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
        }
        .locale-target {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding-right: 4px;
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
            background: rgba(252, 250, 245, 0.98);
            border: 1px solid rgba(201, 211, 195, 0.75);
            box-shadow: 0 20px 40px rgba(47, 35, 33, 0.12);
          }
          .site-nav.open {
            display: flex;
          }
          .primary-nav {
            flex-direction: column;
            align-items: stretch;
            border-radius: 18px;
            padding: 8px;
            box-shadow: none;
          }
          .nav-link {
            border-radius: 12px;
            padding: 14px 16px;
            font-size: 13px;
          }
          .secondary-nav-wrap {
            display: contents;
          }
          .secondary-nav-link {
            opacity: 0.72;
          }
          .header-actions {
            justify-content: stretch;
            flex-direction: column;
            gap: 8px;
          }
          .login-link {
            width: 100%;
          }
          .locale-switch {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </header>
  );
}
