"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const primaryNavJa = [
  { href: "/check-in", label: "クイックチェック" },
  { href: "/tests", label: "入口を選ぶ" },
  { href: "/open-testing", label: "公開テスト" },
];

const primaryNavEn = [
  { href: "/en/check-in", label: "Quick Check" },
  { href: "/tests", label: "Tests" },
  { href: "/open-testing", label: "Open Testing" },
];

const secondaryNavJa = [
  { href: "/about", label: "Yorisouとは" },
  { href: "/contact", label: "お問い合わせ" },
];

const secondaryNavEn = [
  { href: "/en/about", label: "About" },
  { href: "/en/contact", label: "Contact" },
];

function toJapanesePath(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) {
    const base = pathname.replace("/en", "");
    if (["/", "/about", "/contact", "/legal", "/support", "/products", "/login", "/register"].includes(base)) return base;
    return "/";
  }
  return pathname;
}

function toEnglishPath(pathname: string): string {
  if (pathname === "/") return "/en";
  if (pathname.startsWith("/en")) return pathname;
  if (["/about", "/contact", "/legal", "/support", "/products", "/login", "/register"].includes(pathname)) return `/en${pathname}`;
  return "/en";
}

export default function SiteHeader() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const homeHref = isEn ? "/en" : "/";
  const currentPath = isEn ? toJapanesePath(pathname) : pathname;
  const normalizedCurrent = useMemo(() => currentPath.replace(/\/$/, "") || "/", [currentPath]);
  const primaryNav = isEn ? primaryNavEn : primaryNavJa;
  const secondaryNav = isEn ? secondaryNavEn : secondaryNavJa;
  const languageHref = isEn ? toJapanesePath(pathname) : toEnglishPath(pathname);

  function localizedHref(path: string) {
    return isEn && !path.startsWith("/en") ? toEnglishPath(path) : path;
  }

  function isActive(path: string) {
    const normalizedHref = path.replace(/\/$/, "") || "/";
    return normalizedCurrent === normalizedHref || normalizedCurrent.startsWith(`${normalizedHref}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(23,59,53,0.08)] bg-[rgba(255,253,248,0.9)] backdrop-blur-xl">
      <div className="container">
        <div className="flex items-center justify-between gap-4 py-4">
          <Link href={homeHref} className="flex min-w-0 items-center gap-3 no-underline">
            <Image
              src="/images/brand/tsuru-logo.png"
              alt="YORISOU"
              width={132}
              height={132}
              priority
              className="h-auto w-[98px] object-contain md:w-[114px]"
            />
            <div className="min-w-0">
              <div className="display-serif text-[1.32rem] font-semibold tracking-[0.08em] text-[var(--text)] md:text-[1.54rem]">
                YORISOU
              </div>
              <div className="mt-0.5 hidden text-[12px] leading-5 text-[var(--muted)] md:block">
                {isEn ? "A quiet way to reflect on your current state." : "今の自分を静かに見つめ直すための入口。"}
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={isEn ? "Menu" : "メニュー"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(23,59,53,0.1)] bg-white/90 text-[var(--text)] md:hidden"
          >
            <span className="flex flex-col gap-[3px]" aria-hidden="true">
              <span className="h-[1.5px] w-[16px] rounded-full bg-current" />
              <span className="h-[1.5px] w-[16px] rounded-full bg-current" />
              <span className="h-[1.5px] w-[16px] rounded-full bg-current" />
            </span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            <nav className="flex items-center gap-6">
              {primaryNav.map((item) => {
                const href = localizedHref(item.href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`text-[13px] font-semibold no-underline transition ${
                      isActive(item.href) ? "text-[#173B35]" : "text-[var(--text)] hover:text-[#173B35]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 border-l border-[rgba(23,59,53,0.1)] pl-4">
                {secondaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={localizedHref(item.href)}
                    className="text-[12px] text-[var(--muted)] no-underline transition hover:text-[#173B35]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <Link
                href={languageHref}
                className="inline-flex min-h-[40px] items-center rounded-full border border-[rgba(23,59,53,0.1)] bg-white/92 px-4 text-[12px] font-semibold text-[#315F50] no-underline"
              >
                {isEn ? "日本語" : "EN"}
              </Link>
            </div>
          </div>
        </div>

        {open ? (
          <div className="md:hidden">
            <div className="surface-panel mb-4 space-y-4 !rounded-[22px] !p-4">
              <div className="grid gap-2">
                {primaryNav.map((item) => {
                  const href = localizedHref(item.href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={`rounded-[16px] px-4 py-3 text-[14px] font-semibold no-underline ${
                        isActive(item.href)
                          ? "bg-[#F3FAF6] text-[#173B35]"
                          : "bg-white text-[var(--text)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="surface-list text-[13px]">
                {secondaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={localizedHref(item.href)}
                    onClick={() => setOpen(false)}
                    className="text-[var(--muted)] no-underline"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <Link
                href={languageHref}
                onClick={() => setOpen(false)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.1)] bg-white px-4 text-[13px] font-semibold text-[#315F50] no-underline"
              >
                {isEn ? "日本語" : "EN"}
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
