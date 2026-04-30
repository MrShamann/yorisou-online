import type { Metadata } from "next";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import { getReleaseMarker } from "@/lib/releaseMarker";

export const metadata: Metadata = {
  title: "YORISOU | 高齢者とご家族の移動と暮らしに寄り添う支援サービス",
  description:
    "YORISOUは、日本の高齢者とご家族の移動と暮らしに寄り添う支援サービスです。AI相談員 ひなたとの対話から不安をやさしく整理し、必要に応じて製品、導入、継続支援へ丁寧につないでいきます。",
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
  const pathname = headerStore.get("x-yorisou-pathname") || "/";
  const localeCookie = cookieStore.get("yorisou_locale")?.value;
  const locale = localeHeader === "en" || localeCookie === "en" ? "en" : "ja";
  const isFlowWorkspaceRoute =
    pathname === "/support" ||
    pathname === "/en/support" ||
    pathname === "/check-in" ||
    pathname === "/en/check-in" ||
    pathname === "/result" ||
    pathname === "/en/result" ||
    pathname === "/result/share" ||
    pathname === "/en/result/share" ||
    pathname === "/line/mini-app" ||
    pathname === "/en/line/mini-app" ||
    pathname === "/line/mini-app/result" ||
    pathname === "/en/line/mini-app/result" ||
    pathname === "/line/next" ||
    pathname === "/en/line/next" ||
    pathname === "/line/open" ||
    pathname === "/en/line/open";
  return (
    <html lang={locale}>
      <body>
        <div id="yorisou-release" hidden data-release={releaseMarker} />
        {!isFlowWorkspaceRoute && <SiteHeader />}
        {children}
        {!isFlowWorkspaceRoute && <SiteFooter />}
      </body>
    </html>
  );
}
