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
/**
 * CORP-P5R1-AMD2 — locale-aware metadata. Static Japanese metadata was previously served even for
 * `?lang=en`, so the English body carried a Japanese title, description and OG locale.
 *
 * `/?lang=en` is NOT presented as a canonical or indexable production English URL: no canonical tag
 * and no hreflang architecture is emitted here, because the production doctrine is `/` = ja and
 * `/en` = en and that routing is deferred. robots.ts and the sitemap are untouched.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const locale = resolveLocale((await searchParams).lang);
  if (locale === "en") {
    const title = "Yorisou — Between people and society, we build the next way to stand alongside.";
    const description =
      "Yorisou looks closely at the complexity in daily life, work and local communities, and builds products that help people understand it, choose, and move forward. We are building Mirai Move and Kakari.";
    return {
      title,
      description,
      openGraph: { title, description, type: "website", locale: "en_US", siteName: "Yorisou" },
    };
  }
  const title = "Yorisou — 人と社会のあいだに、次のよりそいをつくる。";
  const description =
    "Yorisouは、暮らし・仕事・地域にある複雑さを見つめ、人が理解し、選び、前に進めるプロダクトをつくる会社です。Mirai Move と Kakari を開発しています。";
  return {
    title,
    description,
    openGraph: { title, description, type: "website", locale: "ja_JP", siteName: "Yorisou" },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = resolveLocale((await searchParams).lang);
  return <HomeP5R1 locale={locale} />;
}
