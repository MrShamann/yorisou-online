"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { BrandLockup } from "./brand/BrandMark";

// AIX-2 routes render the shared shell in the dark "Living Intelligence" tone.
const AIX2_DARK_ROUTES = new Set(["/", "/tests", "/open-testing"]);

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
  const dark = AIX2_DARK_ROUTES.has(normalizedCurrent);

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
    <header
      className={`sticky top-0 z-40 backdrop-blur-xl ${
        dark
          ? "aix2-shell-header text-[#eef4ef]"
          : "border-b border-[rgba(23,59,53,0.08)] bg-[rgba(255,253,248,0.9)]"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between gap-4 py-4">
          <Link href={homeHref} className="flex min-w-0 items-center gap-3 no-underline" aria-label="YORISOU">
            {dark ? (
              <BrandLockup markSize={30} tone="dark" />
            ) : (
              <>
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
              </>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={isEn ? "Menu" : "メニュー"}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border md:hidden ${
              dark ? "border-[rgba(126,224,182,0.22)] bg-[rgba(126,224,182,0.08)] text-[#eef4ef]" : "border-[rgba(23,59,53,0.1)] bg-white/90 text-[var(--text)]"
            }`}
          >
            <span className="flex flex-col gap-[3px]" aria-hidden="true">
              <span className="h-[1.5px] w-[16px] rounded-full bg-current" />
              <span className="h-[1.5px] w-[16px] rounded-full bg-current" />
              <span className="h-[1.5px] w-[16px] rounded-full bg-current" />
            </span>
          </button>

          <div className="hidden min-w-0 items-center gap-5 md:flex">
            {/* AIX-1 — restrained desktop nav: the four journey destinations.
                The concept-layer anchors (community/design/matching) stay in
                the home narrative and the mobile menu, so the header never
                collides or exposes a catalog. */}
            <nav className="flex min-w-0 items-center gap-4">
              {primaryNav.slice(0, 4).map((item) => {
                const href = localizedHref(item.href);
                const active = isActive(item.href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`whitespace-nowrap text-[12px] font-semibold no-underline transition ${
                      dark
                        ? active
                          ? "text-[#5ce6b4]"
                          : "text-[#c8d8ce] hover:text-[#5ce6b4]"
                        : active
                          ? "text-[#173B35]"
                          : "text-[var(--text)] hover:text-[#173B35]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-3 border-l pl-4 ${dark ? "border-[rgba(126,224,182,0.2)]" : "border-[rgba(23,59,53,0.1)]"}`}>
                {secondaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={localizedHref(item.href)}
                    className={`whitespace-nowrap text-[12px] no-underline transition ${
                      dark ? "text-[#9db3a8] hover:text-[#5ce6b4]" : "text-[var(--muted)] hover:text-[#173B35]"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <Link
                href={languageHref}
                className={`inline-flex min-h-[40px] items-center rounded-full border px-4 text-[12px] font-semibold no-underline ${
                  dark
                    ? "border-[rgba(126,224,182,0.25)] bg-[rgba(126,224,182,0.08)] text-[#5ce6b4]"
                    : "border-[rgba(23,59,53,0.1)] bg-white/92 text-[#315F50]"
                }`}
              >
                {isEn ? "日本語" : "EN"}
              </Link>
            </div>
          </div>
        </div>

        {open ? (
          <div className="md:hidden">
            <div
              className={`mb-4 space-y-4 rounded-[22px] p-4 ${
                dark
                  ? "border border-[rgba(228,240,233,0.14)] bg-[rgba(11,13,12,0.97)]"
                  : "surface-panel"
              }`}
            >
              <div className="grid gap-2">
                {primaryNav.map((item) => {
                  const href = localizedHref(item.href);
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={`rounded-[16px] px-4 py-3 text-[14px] font-semibold no-underline ${
                        dark
                          ? active
                            ? "bg-[rgba(47,197,150,0.14)] text-[#5ce6b4]"
                            : "bg-[rgba(126,224,182,0.05)] text-[#eef4ef]"
                          : active
                            ? "bg-[#F3FAF6] text-[#173B35]"
                            : "bg-white text-[var(--text)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className={dark ? "grid gap-3 border-t border-[rgba(126,224,182,0.14)] pt-4 text-[13px]" : "surface-list text-[13px]"}>
                {secondaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={localizedHref(item.href)}
                    onClick={() => setOpen(false)}
                    className={`no-underline ${dark ? "text-[#9db3a8]" : "text-[var(--muted)]"}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <Link
                href={languageHref}
                onClick={() => setOpen(false)}
                className={`inline-flex min-h-[44px] items-center justify-center rounded-full border px-4 text-[13px] font-semibold no-underline ${
                  dark ? "border-[rgba(126,224,182,0.25)] bg-[rgba(126,224,182,0.08)] text-[#5ce6b4]" : "border-[rgba(23,59,53,0.1)] bg-white text-[#315F50]"
                }`}
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
