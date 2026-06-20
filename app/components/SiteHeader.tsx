"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const primaryNavJa = [
  { href: "/reservation-mobility-support", label: "予約型移動相談" },
  { href: "/pilot", label: "導入・実証" },
];

const primaryNavEn = [
  { href: "/reservation-mobility-support", label: "Reservation mobility consultation" },
  { href: "/pilot", label: "Pilot" },
];

const secondaryNavJa = [
  { href: "/about", label: "Yorisouとは" },
  { href: "/insights", label: "読みもの" },
  { href: "/contact", label: "お問い合わせ" },
];

const secondaryNavEn = [
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

function toJapanesePath(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) {
    const base = pathname.replace("/en", "");
    if (["/", "/reservation-mobility-support", "/about", "/services", "/pilot", "/progress", "/partners", "/contact", "/legal", "/ai-advisor", "/insights", "/support", "/products", "/login", "/register"].includes(base)) return base;
    return "/";
  }
  return pathname;
}

function toEnglishPath(pathname: string): string {
  if (pathname === "/") return "/en";
  if (pathname.startsWith("/en")) return pathname;
  if (["/reservation-mobility-support", "/about", "/services", "/pilot", "/progress", "/partners", "/contact", "/legal", "/ai-advisor", "/insights", "/support", "/products", "/login", "/register"].includes(pathname)) return `/en${pathname}`;
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
  const languageHref = isEn ? toJapanesePath(pathname) : toEnglishPath(pathname);
  const loginHref = localizedHref("/login");

  function localizedHref(path: string) {
    return isEn ? toEnglishPath(path) : path;
  }

  function isActive(path: string) {
    if (path === "/login") {
      return ["/login", "/register", "/support"].includes(normalizedCurrent);
    }
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

              <div className="more-wrap">
                <button
                  type="button"
                  className={`more-button ${secondaryNav.some((item) => isActive(item.href)) ? "active" : ""}`}
                  onClick={() => setMoreOpen((value) => !value)}
                  aria-label={isEn ? "More" : "補助メニュー"}
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
              <Link href={loginHref} className={`login-link ${isActive("/login") ? "active" : ""}`} onClick={() => setOpen(false)}>
                {isEn ? "Login" : "ログイン"}
              </Link>
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
        .more-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 42px;
        }
        .nav-link:hover,
        .nav-link.active,
        .more-button:hover,
        .more-button.active {
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
          background: rgba(252, 250, 245, 0.97);
          border: 1px solid rgba(201, 211, 195, 0.65);
          box-shadow: 0 16px 28px rgba(59, 47, 47, 0.1);
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
          background: rgba(225, 232, 219, 0.82);
          color: var(--accent-sage-text);
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
          .nav-link,
          .more-button,
          .more-link {
            border-radius: 12px;
            padding: 14px 16px;
            font-size: 13px;
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
