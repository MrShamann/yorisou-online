"use client";

// UX-1 shell. Two deliberate visual registers, used consistently:
//   • "open"    — warm ivory: what a person can see before anything is theirs.
//   • "private" — deep ink: what belongs to the person alone. The register change
//                 IS the privacy signal; it is never decorative.

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { YorisouSymbol } from "@/app/components/YorisouLogo";
import { PROTOTYPE_BANNER_JA } from "./ux1";

const TABS = [
  { href: "/prototype/ux1/home", label: "はじめに" },
  { href: "/prototype/ux1/understand", label: "知りたいこと" },
  { href: "/prototype/ux1/result", label: "いまの読み" },
  { href: "/prototype/ux1/continuity", label: "わたしの今" },
] as const;

export default function Ux1Shell({
  register = "open",
  children,
}: {
  register?: "open" | "private";
  children: ReactNode;
}) {
  const pathname = usePathname() || "";
  const isPrivate = register === "private";

  return (
    <div
      className={`min-h-[100dvh] ${
        isPrivate
          ? "bg-[var(--yorisou-color-deep-950)] text-[rgba(255,255,255,0.92)]"
          : "bg-[var(--yorisou-color-surface-bg)] text-[var(--yorisou-color-neutral-800)]"
      }`}
    >
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
          isPrivate
            ? "border-[rgba(255,255,255,0.10)] bg-[rgba(15,11,26,0.86)]"
            : "border-[var(--yorisou-color-neutral-100)] bg-[rgba(250,248,243,0.92)]"
        }`}
      >
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5 md:px-8">
          <Link href="/prototype/ux1/home" className="inline-flex items-center gap-2 no-underline" aria-label="YORISOU UX-1 プロトタイプ">
            <YorisouSymbol variant={isPrivate ? "white" : "primary"} size={24} />
            <span className={`text-[13.5px] font-bold tracking-[0.02em] ${isPrivate ? "text-white" : "text-[var(--yorisou-color-neutral-800)]"}`}>
              YORISOU
            </span>
          </Link>

          <nav className="order-3 -mx-1 w-full overflow-x-auto md:order-none md:mx-0 md:w-auto" aria-label="UX-1 プロトタイプ">
            <ul className="flex list-none items-center gap-1 px-1 md:gap-2">
              {TABS.map((tab) => {
                const active = pathname.startsWith(tab.href);
                return (
                  <li key={tab.href}>
                    <Link
                      href={tab.href}
                      aria-current={active ? "page" : undefined}
                      className={`inline-flex min-h-[38px] items-center whitespace-nowrap rounded-[var(--yorisou-radius-pill)] px-3 text-[12.5px] font-semibold no-underline transition-colors duration-[var(--yorisou-motion-tap)] ${
                        active
                          ? isPrivate
                            ? "bg-[rgba(255,255,255,0.14)] text-white"
                            : "bg-[var(--yorisou-color-primary-100)] text-[var(--yorisou-color-primary-700)]"
                          : isPrivate
                            ? "text-[rgba(255,255,255,0.66)] hover:text-white"
                            : "text-[var(--yorisou-color-neutral-500)] hover:text-[var(--yorisou-color-primary-600)]"
                      }`}
                    >
                      {tab.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <span
            className={`rounded-[var(--yorisou-radius-pill)] border px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] ${
              isPrivate
                ? "border-[rgba(255,255,255,0.24)] text-[rgba(255,255,255,0.72)]"
                : "border-[var(--yorisou-color-neutral-200)] bg-white text-[var(--yorisou-color-neutral-500)]"
            }`}
          >
            PROTOTYPE
          </span>
        </div>
      </header>

      {/* Mandatory prototype disclosure — never hidden, on every surface. */}
      <p
        className={`m-0 px-4 py-2 text-center text-[11.5px] leading-5 md:px-8 ${
          isPrivate ? "bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.72)]" : "bg-[var(--yorisou-color-primary-50)] text-[var(--yorisou-color-primary-700)]"
        }`}
      >
        {PROTOTYPE_BANNER_JA}
      </p>

      <main className="mx-auto max-w-[1240px] px-4 pb-20 pt-6 md:px-8 md:pb-24 md:pt-10">{children}</main>
    </div>
  );
}
