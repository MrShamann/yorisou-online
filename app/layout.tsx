import type { Metadata } from "next";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import AppShell from "./components/AppShell";
import { connectionOperational } from "@/lib/yorisou/connection/access";
import { getReleaseMarker } from "@/lib/releaseMarker";
import { localeEntry, resolveLocale } from "@/app/_corporate/i18n/locales";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-jp",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yorisou.online"),
  /**
   * CORP-P5 — PREVIEW-SCOPED CORPORATE IDENTITY. This branch is never merged and never deployed to
   * Production, so this changes nothing that is live.
   *
   * The previous value identified the whole site as the standalone consumer product
   * ("YORISOU" + a LINE/Web-first self-reflection service). That is the historical product, not the
   * identity of YORISOU LLC's corporate site, and it was the fallback inherited by every route
   * without its own metadata — including any corporate route added later.
   *
   * Legacy consumer routes that define their own metadata are UNAFFECTED; only the site-level
   * fallback changes. Production still serves the old value. The cutover is recorded as a migration
   * option in docs/yorisou/corporate/CORP_P5_LEGACY_MIGRATION_OPTIONS.md and is not performed here.
   */
  title: {
    default: "Yorisou — 人と社会のあいだに、次のよりそいをつくる。",
    template: "%s",
  },
  description:
    "Yorisouは、暮らし・仕事・地域にある複雑さを見つめ、人が理解し、選び、前に進めるプロダクトをつくる会社です。",
  openGraph: { siteName: "Yorisou", locale: "ja_JP", type: "website" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const releaseMarker = getReleaseMarker();
  const headerStore = await headers();
  const cookieStore = await cookies();
  const localeHeader = headerStore.get("x-yorisou-locale");
  const localeCookie = cookieStore.get("yorisou_locale")?.value;
  /**
   * The header is written by `proxy` on every matched request and is authoritative for THIS
   * request; the cookie is consulted only when the header is absent. The previous
   * `header === "en" || cookie === "en"` let a stale cookie from an earlier visit override a
   * correctly resolved current locale, and collapsed all twenty-one published locales to two.
   * Direction and script come from the registry, so a new locale needs no change here.
   */
  const entry = localeEntry(resolveLocale(localeHeader ?? localeCookie ?? undefined));
  return (
    <html
      lang={entry.code}
      dir={entry.direction}
      data-script={entry.script}
      className={`${notoSansJp.variable} ${inter.variable}`}
    >
      <body>
        <div id="yorisou-release" hidden data-release={releaseMarker} />
        <AppShell connectEnabled={connectionOperational()}>{children}</AppShell>
      </body>
    </html>
  );
}
