"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname() || "/";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");

  const legalHref = isEn ? "/en/legal" : "/legal";
  const contactHref = isEn ? "/en/contact" : "/contact";
  const aboutHref = isEn ? "/en/about" : "/about";
  const insightsHref = isEn ? "/en/insights" : "/insights";
  const servicesHref = isEn ? "/en/services" : "/services";
  const supportHref = isEn ? "/en/support" : "/support";
  const loginHref = isEn ? "/en/login" : "/login";
  const pilotHref = isEn ? "/en/pilot" : "/pilot";

  return (
    <footer className="mt-[64px] border-t border-[var(--line)] bg-[rgba(252,250,245,0.92)]">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <div className="flex gap-5">
            <div className="flex items-start justify-center pt-1">
              <Image src="/images/brand/tsuru-logo.png" alt="YORISOU" width={62} height={62} className="h-auto w-[62px] object-contain" />
            </div>
            <div className="max-w-xl">
              <div className="display-serif text-[1.6rem] font-semibold tracking-[0.08em]">YORISOU</div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {isEn
                  ? "A calmer mobility consultation service for seniors, families, and community operators in Japan."
                  : "移動の不安から、暮らしの安心へ。高齢者とご家族の移動と暮らしに、やさしく、誠実に寄り添います。"}
              </p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <div className="service-kicker">{isEn ? "About Yorisou" : "ご案内"}</div>
              <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
                <Link href={aboutHref}> {isEn ? "About" : "Yorisouについて"} </Link>
                <Link href={servicesHref}> {isEn ? "Services" : "サービス"} </Link>
                <Link href={pilotHref}> {isEn ? "Pilot" : "導入・実証"} </Link>
                <Link href={insightsHref}> {isEn ? "Insights" : "読みもの"} </Link>
              </div>
            </div>
            <div>
              <div className="service-kicker">{isEn ? "Continue" : "継続とご案内"}</div>
              <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
                <Link href={supportHref}>{isEn ? "Support page" : "相談ページ"}</Link>
                <Link href={loginHref}>{isEn ? "Login / Register" : "ログイン・継続"}</Link>
                <Link href={contactHref}>{isEn ? "Contact" : "お問い合わせ"}</Link>
                <Link href={legalHref}>{isEn ? "Terms & Privacy" : "利用規約・プライバシーポリシー"}</Link>
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
