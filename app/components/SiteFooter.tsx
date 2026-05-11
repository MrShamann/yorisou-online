"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname() || "/";

  if (
    pathname === "/check-in" ||
    pathname === "/report-loading" ||
    pathname === "/result" ||
    pathname === "/report-preview" ||
    pathname === "/recommendations"
  ) {
    return null;
  }

  return (
    <footer className="mt-[64px] border-t border-[var(--line)] bg-[rgba(252,250,245,0.92)]">
      <div className="container py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex gap-4">
            <div className="relative h-[68px] w-[140px] shrink-0 overflow-hidden">
              <Image
                src="/images/brand/yorisou-logo-primary-v01.png"
                alt="Yorisou"
                fill
                sizes="140px"
                className="object-cover"
              />
            </div>
            <div className="max-w-xl">
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                小さなチェックインから始めて、今の状態をやさしく受け取るための入口です。
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
            <Link href="/methodology">方法</Link>
            <Link href="/privacy">プライバシー</Link>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--line-soft)] pt-5 text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} YORISOU. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
