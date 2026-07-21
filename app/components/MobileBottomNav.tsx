"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/",
    label: "ホーム",
    icon: (
      <path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1v-7.5Z" />
    ),
  },
  {
    href: "/tests",
    label: "今を知る",
    icon: (
      <path d="M5 13.5 9 9l3.5 3.5L19 6M15.5 6H19v3.5" />
    ),
  },
  {
    href: "/recommendations/graph",
    label: "おすすめ",
    icon: (
      <path d="M12 4.5 13.8 9.7 19 11.5 13.8 13.3 12 18.5 10.2 13.3 5 11.5 10.2 9.7 12 4.5Z" />
    ),
  },
  {
    href: "/saved",
    label: "わたしの今",
    icon: (
      <>
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M5.5 19.5c1.1-3 3.6-4.5 6.5-4.5s5.4 1.5 6.5 4.5" />
      </>
    ),
  },
] as const;

function isActive(pathname: string, href: string) {
  const normalized = pathname.replace(/\/$/, "") || "/";
  if (href === "/") return normalized === "/";
  if (href === "/recommendations/graph") return normalized.startsWith("/recommendations");
  return normalized === href || normalized.startsWith(`${href}/`);
}

export default function MobileBottomNav() {
  const pathname = usePathname() || "/";

  return (
    <nav
      aria-label="モバイルナビゲーション"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--yorisou-color-neutral-100)] bg-[rgba(255,255,255,0.96)] backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto grid max-w-[520px] grid-cols-4">
        {TABS.map((tab) => {
          const active = isActive(pathname, tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[58px] flex-col items-center justify-center gap-0.5 no-underline transition-colors duration-[var(--yorisou-motion-tap)] ${
                active ? "text-[var(--yorisou-color-primary-600)]" : "text-[var(--yorisou-color-neutral-500)]"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                width={22}
                height={22}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {tab.icon}
              </svg>
              <span className="text-[10.5px] font-semibold leading-4">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
