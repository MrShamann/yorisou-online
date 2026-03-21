import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import { getReleaseMarker } from "@/lib/releaseMarker";

export const metadata: Metadata = {
  title: "YORISOU | 高齢者とご家族の移動相談サービス",
  description:
    "YORISOUは、日本の高齢者とご家族に向けた移動相談サービスです。相談、製品比較、導入検討までを落ち着いてつなぎ、福岡での検証知見も支援に活かしています。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const releaseMarker = getReleaseMarker();
  return (
    <html lang="ja">
      <body>
        <div id="yorisou-release" hidden data-release={releaseMarker} />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
