"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import YorisouLogo from "./YorisouLogo";

export default function SiteFooter() {
  const pathname = usePathname() || "/";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");

  const legalHref = isEn ? "/en/legal" : "/legal";
  const privacyHref = "/privacy";
  const contactHref = isEn ? "/en/contact" : "/contact";
  const aboutHref = isEn ? "/en/about" : "/about";
  const checkInHref = isEn ? "/en/check-in" : "/check-in";
  const testsHref = "/tests";

  return (
    <footer className="mt-[72px] border-t border-[var(--line)] bg-[rgba(255,253,248,0.94)]">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div className="flex gap-4">
            <div className="max-w-xl">
              <YorisouLogo variant="primary" size={30} />
              <p className="mt-3 max-w-[28rem] text-sm leading-7 text-[var(--muted)]">
                {isEn
                  ? "A quiet way to reflect on your current state and return when you need the next step."
                  : "今の自分を静かに見つめ直し、必要なときに次の一歩へ戻れるようにするための入口です。"}
              </p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <div className="service-kicker">Yorisou</div>
              <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
                <Link href={aboutHref}>{isEn ? "About Yorisou" : "Yorisouとは"}</Link>
                <Link href={checkInHref}>{isEn ? "Quick Check" : "クイックチェック"}</Link>
                <Link href={testsHref}>{isEn ? "Choose a Test" : "入口を選ぶ"}</Link>
              </div>
            </div>
            <div>
              <div className="service-kicker">{isEn ? "Info" : "情報"}</div>
              <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
                <Link href={contactHref}>{isEn ? "Contact" : "お問い合わせ"}</Link>
                <Link href={legalHref}>{isEn ? "Terms" : "利用規約"}</Link>
                {isEn ? null : <Link href={privacyHref}>プライバシーポリシー</Link>}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-[var(--line-soft)] pt-5 text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} YORISOU. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
