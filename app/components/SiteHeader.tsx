"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const pathname = usePathname() || "/";
  const isCheckIn = pathname === "/check-in";
  const isFunnelStep =
    pathname === "/check-in" ||
    pathname === "/report-loading" ||
    pathname === "/result" ||
    pathname === "/report-preview" ||
    pathname === "/recommendations";

  if (isFunnelStep) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(23,59,53,0.1)] bg-[rgba(255,247,241,0.94)] backdrop-blur-xl">
      <div className="container py-2.5 md:py-4">
        <div className="flex items-center justify-between gap-2.5 md:gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-2 no-underline md:gap-4">
            <div className="relative h-[58px] w-[112px] overflow-hidden md:h-[70px] md:w-[142px]">
              <Image
                src="/images/brand/yorisou-logo-primary-v01.png"
                alt="Yorisou"
                fill
                sizes="(min-width: 768px) 142px, 112px"
                priority
                className="object-cover drop-shadow-[0_7px_14px_rgba(63,45,39,0.08)]"
              />
            </div>
            <div className="min-w-0">
              <div className="mt-0.5 hidden text-[0.82rem] leading-7 text-[var(--muted)] md:block">今の状態を、やさしく見てみる。</div>
            </div>
          </Link>

          <nav className="flex shrink-0 items-center gap-1.5 md:gap-2">
            <Link
              href="/"
              className={`inline-flex min-h-[36px] items-center justify-center rounded-full px-3 text-[12px] font-medium no-underline transition md:min-h-[42px] md:px-4 md:text-[13px] ${
                pathname === "/" ? "bg-[#EAF7F1] text-[#173B35]" : "text-[#2F2A28] hover:bg-[#EAF7F1]"
              }`}
            >
              ホーム
            </Link>
            <Link
              href="/check-in"
              className={`inline-flex min-h-[36px] items-center justify-center rounded-full px-3 text-[12px] font-semibold no-underline transition md:min-h-[42px] md:px-4 md:text-[13px] ${
                isCheckIn
                  ? "bg-[#173B35] !text-white shadow-[0_10px_18px_rgba(23,59,53,0.18)]"
                  : "bg-[#173B35] !text-white shadow-[0_10px_18px_rgba(23,59,53,0.16)] hover:bg-[#0F2F2B]"
              }`}
            >
              テストをはじめる
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
