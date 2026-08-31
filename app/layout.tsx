import type { Metadata, Viewport } from "next";
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
    /**
     * CORP-v1.3 — the site-level fallback was still the CONSUMER product's line, so every tab,
     * bookmark and share card that fell back to it introduced the company as a self-reflection
     * service. The descriptor is the one the Founder set inside the logo artwork itself, so it is
     * the company's own words rather than a positioning statement written here.
     */
    default: "Yorisou 合同会社 — AI-Native Venture Foundry",
    template: "%s",
  },
  description:
    "Yorisou 合同会社は、制度や仕組みが必要な人のところで止まっている領域に入り、事業として立つところまでを設計・構築する会社です。",
  /**
   * CORP-v1.3 — browser-level identity.
   *
   * `app/icon.png`, `app/apple-icon.png` and `app/opengraph-image.png` are generated from the
   * Founder's own artwork by proportional scale onto the site's paper ground — no crop, no
   * recolour, no redraw — and Next.js wires them from the filesystem, so they are not repeated here.
   * What IS declared here is the browser chrome colour, which has no file convention.
   *
   * KNOWN LIMIT, recorded rather than papered over: the artwork is a STACKED square lockup, so at
   * 32px the wordmark below the symbol is not legible — only the blue symbol reads. Fixing that
   * properly needs a logomark-only or vector variant, which does not exist. Shipping the real mark
   * illegibly small is still strictly better than shipping the previous icon, which was the purple
   * consumer-product heart and identified the company as something it is not.
   *
   * The browser chrome colour is declared in `viewport` below, which is where Next.js reads it from.
   */
  openGraph: { siteName: "Yorisou", locale: "ja_JP", type: "website" },
};

/**
 * CORP-v1.3 — the browser chrome colour, in both schemes. Both values are brand values: the paper
 * the site is set on, and the navy the wordmark is drawn in. `themeColor` belongs on `viewport`
 * rather than on `metadata`; putting it on `metadata` is accepted at build time but ignored.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf6" },
    { media: "(prefers-color-scheme: dark)", color: "#061133" },
  ],
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
