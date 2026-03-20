import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export const metadata: Metadata = {
  title: "YORISOU | 日本のシニアモビリティ相談プラットフォーム",
  description:
    "YORISOUは、日本の高齢者とご家族に向けたモビリティ相談プラットフォームです。福岡での実証検証とインサイト分析を通じて、納得しやすく続けやすい移動支援を育てています。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
