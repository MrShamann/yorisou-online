"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const primaryNavJa = [
  { href: "/open-testing", label: "はじめる" },
  { href: "/tests", label: "チェック" },
  { href: "/report-preview?resultId=EM-AK&overlayId=balancing&confidence=low", label: "レポート" },
  { href: "/recommendations?resultId=EM-AK&overlayId=balancing&confidence=low", label: "おすすめ" },
  { href: "/#yorisou-community", label: "コミュニティ" },
  { href: "/#yorisou-design", label: "よりそうデザイン" },
  { href: "/#yorisou-market", label: "マッチング" },
];

const primaryNavEn = [
  { href: "/en/check-in", label: "Start" },
  { href: "/tests", label: "Checks" },
  { href: "/open-testing", label: "Open Testing" },
  { href: "/recommendations?resultId=EM-AK&overlayId=balancing&confidence=low", label: "Recommendations" },
];

const secondaryNavJa = [
  { href: "/about", label: "Yorisouとは" },
  { href: "/line/mini-app", label: "LINEで続ける" },
  { href: "/contact?topic=open-testing", label: "お問い合わせ" },
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

function splitDecoratedPath(path: string) {
  const hashIndex = path.indexOf("#");
  const queryIndex = path.indexOf("?");
  const cutIndex =
    hashIndex === -1 ? queryIndex : queryIndex === -1 ? hashIndex : Math.min(hashIndex, queryIndex);

  if (cutIndex === -1) return { base: path, suffix: "" };
  return { base: path.slice(0, cutIndex), suffix: path.slice(cutIndex) };
}

function toEnglishPath(pathname: string): string {
  if (pathname === "/") return "/en";
  if (pathname.startsWith("/en")) return pathname;
  if (["/about", "/contact", "/legal", "/support", "/products", "/login", "/register"].includes(pathname)) return `/en${pathname}`;
  return pathname;
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
    if (!isEn || path.startsWith("/en")) return path;
    const { base, suffix } = splitDecoratedPath(path);
    return `${toEnglishPath(base)}${suffix}`;
  }

  function isActive(path: string) {
    if (path.includes("#")) return false;
    const { base } = splitDecoratedPath(path);
    const normalizedHref = base.replace(/\/$/, "") || "/";
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
              <div className="mt-0.5 hidden text-[12px] leading-5 text-[var(--muted)] xl:block">
                {isEn ? "Understand your current state and find a fitting next step." : "今の状態を理解し、次の選択肢につなげるプラットフォーム。"}
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

          <div className="hidden min-w-0 items-center gap-5 md:flex">
            <nav className="flex min-w-0 items-center gap-4">
              {primaryNav.map((item) => {
                const href = localizedHref(item.href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`whitespace-nowrap text-[12px] font-semibold no-underline transition ${
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
                    className="whitespace-nowrap text-[12px] text-[var(--muted)] no-underline transition hover:text-[#173B35]"
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
