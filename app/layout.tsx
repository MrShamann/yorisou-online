import type { Metadata } from "next";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import "./globals.css";
import AppShell from "./components/AppShell";
import { getReleaseMarker } from "@/lib/releaseMarker";

export const metadata: Metadata = {
  title: "Yorisou | 今の自分を知る24問チェック",
  description:
    "Yorisouは、今の気持ちや生活リズムを24問でふり返り、自分の状態と次の一歩を見つけるためのLINE/Web-firstセルフリフレクションサービスです。診断や占いではありません。",
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
