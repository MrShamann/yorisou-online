import type { Metadata } from "next";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import AppShell from "./components/AppShell";
import { connectionOperational } from "@/lib/yorisou/connection/access";
import { getReleaseMarker } from "@/lib/releaseMarker";

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
  // The count lived here, in the fallback title and description every page without its own
  // metadata inherits — so the single most-rendered claim in the product was that the test is 24
  // questions. It is 120. The replacement is the approved copy already used on 今日 rather than a
  // corrected number, because the site-level title should name the product, not one assessment.
  title: "YORISOU | AIと整える、わたしの毎日。",
  description:
    "Yorisouは、今の状態を短い言葉にして、次の小さな一歩を見つけるためのLINE/Web-firstセルフリフレクションサービスです。診断や占いではありません。",
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
  const locale = localeHeader === "en" || localeCookie === "en" ? "en" : "ja";
  return (
    <html lang={locale} className={`${notoSansJp.variable} ${inter.variable}`}>
      <body>
        <div id="yorisou-release" hidden data-release={releaseMarker} />
        <AppShell connectEnabled={connectionOperational()}>{children}</AppShell>
      </body>
    </html>
  );
}
