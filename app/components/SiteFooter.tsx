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
  const loginHref = isEn ? "/en/login" : "/login";

  return (
    <footer className="mt-[72px] border-t border-[var(--line)] bg-[rgba(255,251,246,0.88)]">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <div className="flex gap-5">
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-[1.4rem] border border-[#D8C6B4]/75 bg-white shadow-[0_14px_30px_rgba(47,35,33,0.06)]">
              <Image src="/images/brand/tsuru-logo.png" alt="YORISOU" width={42} height={42} />
            </div>
            <div className="max-w-xl">
              <div className="display-serif text-[1.6rem] font-semibold tracking-[0.08em]">YORISOU</div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {isEn
                  ? "A calmer mobility consultation service for seniors, families, and community operators in Japan."
                  : "高齢者とご家族の移動相談を、比較・導入・共有まで静かに支えるサービスです。"}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={loginHref} className="btn btn-primary">
                  {isEn ? "Open support access" : "サポート入口を見る"}
                </Link>
                <Link href={contactHref} className="btn btn-secondary">
                  {isEn ? "Contact" : "お問い合わせ"}
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <div className="service-kicker">{isEn ? "Navigation" : "Navigation"}</div>
              <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
                <Link href={aboutHref}> {isEn ? "About" : "Yorisouについて"} </Link>
                <Link href={servicesHref}> {isEn ? "Services" : "サービス"} </Link>
                <Link href={insightsHref}> {isEn ? "Insights" : "インサイト"} </Link>
                <Link href={contactHref}> {isEn ? "Contact" : "お問い合わせ"} </Link>
              </div>
            </div>
            <div>
              <div className="service-kicker">{isEn ? "Policy" : "Policy"}</div>
              <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
                <Link href={legalHref}>{isEn ? "Terms & Privacy" : "利用規約・プライバシーポリシー"}</Link>
                <Link href={loginHref}>{isEn ? "Login / Register" : "ログイン・新規登録"}</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-[#E1D4C6] pt-5 text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} YORISOU. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
