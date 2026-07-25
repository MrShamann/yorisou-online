"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { YorisouSymbol } from "@/app/components/YorisouLogo";

const TABS = [
  {
    href: "/prototype/home",
    label: "ホーム",
    icon: <path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1v-7.5Z" />,
  },
  {
    href: "/prototype/discover",
    label: "見つける",
    icon: <path d="M12 4.5 13.8 9.7 19 11.5 13.8 13.3 12 18.5 10.2 13.3 5 11.5 10.2 9.7 12 4.5Z" />,
  },
  {
    href: "/prototype/capture",
    label: "記録する",
    icon: (
      <>
        <path d="M5 19.5V6a1.5 1.5 0 0 1 1.5-1.5H17A1.5 1.5 0 0 1 18.5 6v9.5L15 19H6.5A1.5 1.5 0 0 1 5 19.5Z" />
        <path d="M9 9.5h6M9 13h4" />
      </>
    ),
  },
  {
    href: "/prototype/login",
    label: "わたし",
    icon: (
      <>
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M5.5 19.5c1.1-3 3.6-4.5 6.5-4.5s5.4 1.5 6.5 4.5" />
      </>
    ),
  },
] as const;

export default function ProtoShell({ title, children }: { title: string; children: ReactNode }) {
  const pathname = usePathname() || "";

  return (
    <div className="min-h-[100dvh] bg-[var(--yorisou-color-surface-bg)] text-[var(--yorisou-color-neutral-800)]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-[var(--yorisou-color-neutral-100)] bg-[rgba(250,248,243,0.94)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-3 px-4 py-3">
          <Link href="/prototype/home" className="inline-flex items-center gap-2 no-underline" aria-label="YORISOU プロトタイプホーム">
            <YorisouSymbol variant="primary" size={26} />
            <span className="text-[14px] font-bold tracking-[0.01em] text-[var(--yorisou-color-neutral-800)]">{title}</span>
          </Link>
          <div className="flex items-center gap-3">
            {/* Desktop tabs */}
            <nav className="hidden items-center gap-5 md:flex" aria-label="プロトタイプナビゲーション">
              {TABS.map((tab) => {
                const active = pathname.startsWith(tab.href);
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    aria-current={active ? "page" : undefined}
                    className={`text-[13px] font-semibold no-underline transition-colors duration-[var(--yorisou-motion-tap)] ${
                      active
                        ? "text-[var(--yorisou-color-primary-600)]"
                        : "text-[var(--yorisou-color-neutral-500)] hover:text-[var(--yorisou-color-primary-600)]"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
            <span className="rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-[var(--yorisou-color-neutral-500)]">
              PROTOTYPE
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1080px] px-4 pb-[92px] pt-5 md:pb-14">{children}</div>

      {/* Mobile bottom nav */}
      <nav
        aria-label="モバイルナビゲーション"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--yorisou-color-neutral-100)] bg-[rgba(255,255,255,0.97)] backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto grid max-w-[520px] grid-cols-4">
          {TABS.map((tab) => {
            const active = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[58px] flex-col items-center justify-center gap-0.5 no-underline transition-colors duration-[var(--yorisou-motion-tap)] ${
                  active ? "text-[var(--yorisou-color-primary-600)]" : "text-[var(--yorisou-color-neutral-500)]"
                }`}
              >
                <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {tab.icon}
                </svg>
                <span className="text-[10.5px] font-semibold leading-4">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
