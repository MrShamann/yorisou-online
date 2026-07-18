import type { Metadata } from "next";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import "./globals.css";
import AppShell from "./components/AppShell";
import { getReleaseMarker } from "@/lib/releaseMarker";

export const metadata: Metadata = {
  metadataBase: new URL("https://yorisou.online"),
  title: "YORISOU｜今のあなたを知り、これからを一緒に選ぶ AI-native伴走プラットフォーム",
  description:
    "YORISOUは、あなたの状態・変化・好みを理解し、必要な情報・体験・サービス・つながりを、必要なときに届けるAI-native伴走プラットフォームです。チェックは、あなたを理解するための最初の入口のひとつ。診断や占いではありません。",
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
      </body>
    </html>
  );
}
