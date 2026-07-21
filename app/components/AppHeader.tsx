"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import YorisouLogo from "./YorisouLogo";

const PRIMARY_NAV = [
  { href: "/tests", label: "今を知る" },
  { href: "/recommendations/graph", label: "おすすめ" },
  { href: "/experiences", label: "体験を見つける" },
  { href: "/saved", label: "わたしの今" },
] as const;

function isActive(pathname: string, href: string) {
  const normalized = pathname.replace(/\/$/, "") || "/";
  const target = href.replace(/\/$/, "") || "/";
  if (target === "/recommendations/graph") return normalized.startsWith("/recommendations");
  return normalized === target || normalized.startsWith(`${target}/`);
}

export default function AppHeader() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--yorisou-color-neutral-100)] bg-[rgba(250,248,243,0.92)] backdrop-blur-xl">
      <div className="container">
        <div className="flex items-center justify-between gap-4 py-3 md:py-3.5">
          <Link href="/" className="flex min-w-0 items-center no-underline" aria-label="YORISOU ホーム" onClick={() => setOpen(false)}>
            <YorisouLogo variant="primary" size={30} />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="メインナビゲーション">
            {PRIMARY_NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap text-[13.5px] font-semibold no-underline transition-colors duration-[var(--yorisou-motion-tap)] ${
                    active
                      ? "text-[var(--yorisou-color-primary-600)]"
                      : "text-[var(--yorisou-color-neutral-800)] hover:text-[var(--yorisou-color-primary-600)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/line/mini-app"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[var(--yorisou-radius-pill)] bg-[#06C755] px-4 text-[13px] font-bold text-white no-underline shadow-[var(--yorisou-shadow-card)] transition hover:bg-[#05B34C]"
            >
              <span className="inline-flex h-[15px] w-[15px] items-center justify-center rounded-full bg-white text-[9px] font-black text-[#06C755]" aria-hidden="true">L</span>
              LINEで続ける
            </Link>
            <Link
              href="/login"
              className="whitespace-nowrap text-[13px] font-semibold text-[var(--yorisou-color-neutral-500)] no-underline transition hover:text-[var(--yorisou-color-primary-600)]"
            >
              ログイン
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="メニュー"
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--yorisou-color-neutral-100)] bg-white text-[var(--yorisou-color-neutral-800)] md:hidden"
          >
            <span className="flex flex-col gap-[3.5px]" aria-hidden="true">
              <span className="h-[1.6px] w-[16px] rounded-full bg-current" />
              <span className="h-[1.6px] w-[16px] rounded-full bg-current" />
              <span className="h-[1.6px] w-[16px] rounded-full bg-current" />
            </span>
          </button>
        </div>

        {/* Mobile drawer */}
        {open ? (
          <div className="pb-4 md:hidden">
            <div className="rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-neutral-100)] bg-white p-3 shadow-[var(--yorisou-shadow-raised)]">
              <div className="grid gap-1.5">
                {PRIMARY_NAV.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`rounded-[var(--yorisou-radius-button)] px-4 py-3 text-[14.5px] font-semibold no-underline ${
                        active
                          ? "bg-[var(--yorisou-color-primary-50)] text-[var(--yorisou-color-primary-600)]"
                          : "text-[var(--yorisou-color-neutral-800)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-3 grid gap-2 border-t border-[var(--yorisou-color-neutral-100)] pt-3">
                <Link
                  href="/line/mini-app"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-[46px] items-center justify-center gap-1.5 rounded-[var(--yorisou-radius-pill)] bg-[#06C755] px-4 text-[14px] font-bold text-white no-underline"
                >
                  <span className="inline-flex h-[15px] w-[15px] items-center justify-center rounded-full bg-white text-[9px] font-black text-[#06C755]" aria-hidden="true">L</span>
                  LINEで続ける
                </Link>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-4 text-[13.5px] font-semibold text-[var(--yorisou-color-neutral-800)] no-underline"
                >
                  ログイン
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
