import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import "./globals.css";
import AppShell from "./components/AppShell";
import PwaController from "./components/pwa/PwaController";
import { getReleaseMarker } from "@/lib/releaseMarker";

export const metadata: Metadata = {
  metadataBase: new URL("https://yorisou.online"),
  title: "YORISOU｜今のあなたを知り、これからを一緒に選ぶ AI-native伴走プラットフォーム",
  description:
    "YORISOUは、あなたの状態・変化・好みを理解し、必要な情報・体験・サービス・つながりを、必要なときに届けるAI-native伴走プラットフォームです。チェックは、あなたを理解するための最初の入口のひとつ。診断や占いではありません。",
  // APP-1 — installable PWA
  applicationName: "YORISOU",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "YORISOU", statusBarStyle: "black-translucent" },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0e0d",
  colorScheme: "dark light",
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
    <html lang={locale}>
      <body>
        <div id="yorisou-release" hidden data-release={releaseMarker} />
        <AppShell>{children}</AppShell>
        <PwaController />
      </body>
    </html>
  );
}
