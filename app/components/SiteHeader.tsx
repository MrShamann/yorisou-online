"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { BrandLockup } from "./brand/BrandMark";
import { isDarkSurface, normalizePath } from "../lib/publicSurface";

// AIX-3 — navigation around the complete product system (six user domains +
// partner), not a list of internal features. The test lives inside 理解する.
const primaryNavJa = [
  { href: "/tests", label: "理解する" },
  { href: "/recommendations", label: "見つける" },
  { href: "/reports", label: "深める" },
  { href: "/experiences", label: "つながる" },
  { href: "/co-design", label: "育てる" },
  { href: "/partners", label: "パートナー" },
];

// AIX-3D-1 (Part D) — English Option B nav points at the supported English
// informational routes (not a parallel English product). The live product is
// reached via the CTA, which continues into the Japanese flow.
const primaryNavEn = [
  { href: "/en/about", label: "About" },
  { href: "/en/partners", label: "Partners" },
  { href: "/en/contact", label: "Contact" },
];

const secondaryNavJa = [
  { href: "/about", label: "Yorisouとは" },
  { href: "/line/mini-app", label: "LINEで続ける" },
  { href: "/contact?topic=open-testing", label: "お問い合わせ" },
];

const secondaryNavEn = [
  { href: "/en/privacy", label: "Privacy" },
  { href: "/en/legal", label: "Legal" },
];

function toJapanesePath(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) {
    const base = pathname.replace("/en", "");
    if (["/", "/about", "/contact", "/legal", "/support", "/products", "/login", "/register", "/partners", "/privacy"].includes(base)) return base;
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

export default function SiteHeader() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const homeHref = isEn ? "/en" : "/";
  // AIX-3D-1 (Part D) — active state + tone are resolved from the *actual* path.
  // normalizePath strips the /en prefix, so English info routes highlight against
  // their own hrefs and resolve to the correct (editorial/light) surface, instead
  // of inheriting the Japanese home's immersive/dark tone.
  const normalizedCurrent = useMemo(() => normalizePath(pathname), [pathname]);
  const primaryNav = isEn ? primaryNavEn : primaryNavJa;
  const secondaryNav = isEn ? secondaryNavEn : secondaryNavJa;
  const dark = isDarkSurface(pathname);
  // Primary CTA — the same across the product.
  const ctaHref = isEn ? "/en/check-in" : "/start";
  const ctaLabel = isEn ? "Start where you are" : "今の自分から始める";

  function isActive(path: string) {
    if (path.includes("#")) return false;
    const { base } = splitDecoratedPath(path);
    const normalizedHref = normalizePath(base);
    return normalizedCurrent === normalizedHref || normalizedCurrent.startsWith(`${normalizedHref}/`);
  }

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-xl ${
        dark
          ? "aix2-shell-header text-[#eef4ef]"
          : "aix3-shell-editorial text-[var(--text)]"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between gap-4 py-4">
          <Link href={homeHref} className="flex min-w-0 items-center gap-3 no-underline" aria-label="YORISOU">
            <BrandLockup markSize={30} tone={dark ? "dark" : "light"} />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={isEn ? "Menu" : "メニュー"}
            aria-expanded={open}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border md:hidden ${
              dark ? "border-[rgba(228,240,233,0.16)] bg-[rgba(228,240,233,0.06)] text-[#eef4ef]" : "border-[rgba(23,59,53,0.12)] bg-white/90 text-[var(--text)]"
            }`}
          >
            <span className="flex flex-col gap-[3px]" aria-hidden="true">
              <span className="h-[1.5px] w-[16px] rounded-full bg-current" />
              <span className="h-[1.5px] w-[16px] rounded-full bg-current" />
              <span className="h-[1.5px] w-[16px] rounded-full bg-current" />
            </span>
          </button>

          <div className="hidden min-w-0 items-center gap-5 md:flex">
            <nav className="flex min-w-0 items-center gap-4" aria-label={isEn ? "Product" : "プロダクト"}>
              {primaryNav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap text-[12.5px] font-semibold no-underline transition ${
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
              <div className={`flex items-center gap-3 border-l pl-4 ${dark ? "border-[rgba(228,240,233,0.16)]" : "border-[rgba(23,59,53,0.1)]"}`}>
                {secondaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap text-[12px] no-underline transition ${
                      dark ? "text-[#9db3a8] hover:text-[#5ce6b4]" : "text-[var(--muted)] hover:text-[#173B35]"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <Link
                href={ctaHref}
                className={dark ? "aix2-btn aix2-btn-primary !min-h-[40px] !px-4 !text-[13px]" : "btn btn-primary !min-h-[40px] !px-4 !text-[13px]"}
              >
                {ctaLabel}
              </Link>

              {isEn ? (
                <Link
                  href={toJapanesePath(pathname)}
                  className="inline-flex min-h-[40px] items-center rounded-full border border-[rgba(23,59,53,0.1)] bg-white/92 px-4 text-[12px] font-semibold text-[#315F50] no-underline"
                >
                  日本語
                </Link>
              ) : null}
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
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`rounded-[16px] px-4 py-3 text-[14px] font-semibold no-underline ${
                        dark
                          ? active
                            ? "bg-[rgba(47,197,150,0.14)] text-[#5ce6b4]"
                            : "bg-[rgba(228,240,233,0.05)] text-[#eef4ef]"
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

              <Link
                href={ctaHref}
                onClick={() => setOpen(false)}
                className={dark ? "aix2-btn aix2-btn-primary w-full" : "btn btn-primary w-full"}
              >
                {ctaLabel}
              </Link>

              <div className={dark ? "grid gap-3 border-t border-[rgba(228,240,233,0.12)] pt-4 text-[13px]" : "surface-list text-[13px]"}>
                {secondaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`no-underline ${dark ? "text-[#9db3a8]" : "text-[var(--muted)]"}`}
                  >
                    {item.label}
                  </Link>
                ))}
                {isEn ? (
                  <Link href={toJapanesePath(pathname)} onClick={() => setOpen(false)} className="no-underline text-[var(--muted)]">
                    日本語
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
