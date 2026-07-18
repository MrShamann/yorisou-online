"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLockup } from "./brand/BrandMark";

// AIX-2 routes render the shared footer in the dark "Living Intelligence" tone.
const AIX2_DARK_ROUTES = new Set(["/", "/tests", "/open-testing"]);

export default function SiteFooter() {
  const pathname = usePathname() || "/";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const dark = AIX2_DARK_ROUTES.has(pathname.replace(/\/$/, "") || "/");

  const legalHref = isEn ? "/en/legal" : "/legal";
  const privacyHref = "/privacy";
  const contactHref = isEn ? "/en/contact" : "/contact";
  const aboutHref = isEn ? "/en/about" : "/about";
  const checkInHref = isEn ? "/en/check-in" : "/check-in";
  const testsHref = "/tests";

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
            {dark ? (
              <BrandLockup markSize={30} tone="dark" />
            ) : (
              <div className="flex gap-4">
                <Image src="/images/brand/tsuru-logo.png" alt="YORISOU" width={70} height={70} className="h-auto w-[64px] object-contain" />
                <div className="display-serif text-[1.45rem] font-semibold tracking-[0.08em]">YORISOU</div>
              </div>
            )}
            <p className={`mt-3 max-w-[28rem] text-sm leading-7 ${muted}`}>
              {isEn
                ? "A quiet way to reflect on your current state and return when you need the next step."
                : "今の自分を静かに見つめ直し、必要なときに次の一歩へ戻れるようにするための入口です。"}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <div className={kicker}>Yorisou</div>
              <div className={`mt-4 grid gap-3 text-sm ${muted}`}>
                <Link href={aboutHref}>{isEn ? "About Yorisou" : "Yorisouとは"}</Link>
                <Link href={checkInHref}>{isEn ? "Quick Check" : "クイックチェック"}</Link>
                <Link href={testsHref}>{isEn ? "Choose a Test" : "入口を選ぶ"}</Link>
              </div>
            </div>
            <div>
              <div className={kicker}>{isEn ? "Info" : "情報"}</div>
              <div className={`mt-4 grid gap-3 text-sm ${muted}`}>
                <Link href={contactHref}>{isEn ? "Contact" : "お問い合わせ"}</Link>
                <Link href={legalHref}>{isEn ? "Terms" : "利用規約"}</Link>
                {isEn ? null : <Link href={privacyHref}>プライバシーポリシー</Link>}
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
