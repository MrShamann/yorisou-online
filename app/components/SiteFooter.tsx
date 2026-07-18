"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLockup } from "./brand/BrandMark";
import { isImmersive } from "../lib/publicSurface";

export default function SiteFooter() {
  const pathname = usePathname() || "/";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  // AIX-3 — dark immersive tone resolved from the centralized surface config.
  const dark = isImmersive(pathname);

  const legalHref = isEn ? "/en/legal" : "/legal";
  const privacyHref = isEn ? "/en/privacy" : "/privacy";
  const contactHref = isEn ? "/en/contact" : "/contact";
  const aboutHref = isEn ? "/en/about" : "/about";
  const testsHref = "/tests";
  const discoverHref = "/recommendations";
  const partnersHref = isEn ? "/en/partners" : "/partners";

  const muted = dark ? "text-[#aec3b7]" : "text-[var(--muted)]";
  const kicker = dark ? "text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5ce6b4]" : "service-kicker";

  return (
    <footer
      className={
        dark
          ? "border-t border-[rgba(228,240,233,0.12)] bg-[#0a0d0b] text-[#eef4ef]"
          : "mt-[72px] border-t border-[var(--line)] bg-[rgba(255,253,248,0.94)]"
      }
    >
      <div className={`container pb-12 ${dark ? "pt-16" : "py-12"}`}>
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div className="max-w-xl">
            <BrandLockup markSize={30} tone={dark ? "dark" : "light"} />
            <p className={`mt-3 max-w-[28rem] text-sm leading-7 ${muted}`}>
              {isEn
                ? "A quiet way to reflect on your current state and return when you need the next step."
                : "今の自分を静かに見つめ直し、必要なときに次の一歩へ戻れるようにするための入口です。"}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <div className={kicker}>{isEn ? "Product" : "プロダクト"}</div>
              <div className={`mt-4 grid gap-3 text-sm ${muted}`}>
                <Link href={testsHref}>{isEn ? "Understand" : "理解する"}</Link>
                <Link href={discoverHref}>{isEn ? "Discover" : "見つける"}</Link>
                <Link href={partnersHref}>{isEn ? "Partners" : "パートナー"}</Link>
                <Link href={aboutHref}>{isEn ? "About Yorisou" : "Yorisouとは"}</Link>
              </div>
            </div>
            <div>
              <div className={kicker}>{isEn ? "Info" : "情報"}</div>
              <div className={`mt-4 grid gap-3 text-sm ${muted}`}>
                <Link href={contactHref}>{isEn ? "Contact" : "お問い合わせ"}</Link>
                <Link href={legalHref}>{isEn ? "Terms" : "利用規約"}</Link>
                <Link href={privacyHref}>{isEn ? "Privacy" : "プライバシーポリシー"}</Link>
              </div>
            </div>
          </div>
        </div>
        <div className={`mt-10 border-t pt-5 text-xs ${dark ? "border-[rgba(228,240,233,0.10)] text-[#8ba095]" : "border-[var(--line-soft)] text-[var(--muted)]"}`}>
          © {new Date().getFullYear()} YORISOU. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
