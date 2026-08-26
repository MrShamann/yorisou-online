import type { Metadata } from "next";

import HomeP5R1 from "@/app/_corporate/p5r1/HomeP5R1";
import { resolveLocale } from "@/app/_corporate/p5r1/locale";

/**
 * CORP-P5R1-AMD — YORISOU LLC corporate homepage. PREVIEW ONLY.
 *
 * Japanese is the default and is never overridden by browser locale, IP, device language or inferred
 * geography — the visitor changes language only by choosing it. Locale travels as `?lang=en` on this
 * single URL; the Production doctrine `/` = ja and `/en` = en is recorded but deferred, because
 * `/en` is currently the legacy consumer route and locale routing belongs to the topology package.
 */
export const metadata: Metadata = {
  title: "Yorisou — 人と社会のあいだに、次のよりそいをつくる。",
  description:
    "Yorisouは、暮らし・仕事・地域にある複雑さを見つめ、人が理解し、選び、前に進めるプロダクトをつくる会社です。Mirai Move と Kakari を開発しています。",
  openGraph: {
    title: "Yorisou — 人と社会のあいだに、次のよりそいをつくる。",
    description:
      "Yorisouは、暮らし・仕事・地域にある複雑さを見つめ、人が理解し、選び、前に進めるプロダクトをつくる会社です。",
    type: "website",
    locale: "ja_JP",
    alternateLocale: ["en_US"],
    siteName: "Yorisou",
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = resolveLocale((await searchParams).lang);
  return <HomeP5R1 locale={locale} />;
}
