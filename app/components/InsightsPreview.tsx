import Link from "next/link";

import { fetchHomepageInsights } from "@/lib/insights/service";
import type { Locale } from "@/lib/insights/types";

export default async function InsightsPreview({ locale }: { locale: Locale }) {
  try {
    const { hero, secondary } = await fetchHomepageInsights(locale, 1, 1);
    const heroItem = hero[0] || secondary[0];
    const secondaryItems = hero[0] ? secondary : secondary.slice(1);
    const href = locale === "ja" ? "/insights" : "/en/insights";

    return (
      <section className="border-t border-[#D6C3A3]/30 bg-[#F8F4EC]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-light leading-tight text-[#3B2F2F]">
                {locale === "ja" ? "参考記事" : "Reference notes"}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
                {locale === "ja"
                  ? "予約前の確認に役立つものだけを、必要な分だけ置いています。"
                  : "Only a small set of notes that may help before booking."}
              </p>
            </div>
            <Link href={href} className="rounded-full border border-[#3B2F2F]/16 bg-white/72 px-6 py-3 text-sm transition hover:bg-white">
              {locale === "ja" ? "一覧を見る" : "See notes"}
            </Link>
          </div>

          {heroItem && (
            <div className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
              <article className="rounded-[2rem] border border-[#D6C3A3]/35 bg-white/85 p-7 shadow-sm md:p-8">
                <div className="text-xs tracking-[0.18em] text-[#8A7764]">{locale === "ja" ? "今、まず読んでおきたいこと" : "Read first"}</div>
                <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.12em] text-[#8A7764]">
                  <span className="mt-4">{formatDate(heroItem.publishedAt, locale)}</span>
                  <span className="mt-4">{heroItem.categoryLabel}</span>
                </div>
                <h3 className="mt-4 text-3xl font-light leading-tight text-[#3B2F2F]">
                  <Link href={`${href}/${heroItem.slug}`} className="transition hover:text-[#6B5A4A]">
                    {heroItem.title}
                  </Link>
                </h3>
                <p className="mt-4 text-sm leading-8 text-[#5A4B3E] md:text-base">{heroItem.summary}</p>
                <p className="mt-5 text-sm leading-7 text-[#6B5A4A]">{heroItem.whyItMatters}</p>
                <div className="mt-6">
                  <Link href={`${href}/${heroItem.slug}`} className="btn btn-secondary">
                    {locale === "ja" ? "この記事を読む" : "Read this"}
                  </Link>
                </div>
              </article>

              <div className="grid gap-4">
                {secondaryItems.map((item, index) => (
                  <Link
                    key={item.slug}
                    href={`${href}/${item.slug}`}
                    className="rounded-[1.6rem] border border-[#D6C3A3]/32 bg-white/78 px-5 py-5 shadow-sm transition hover:bg-white"
                  >
                    <div className="text-sm text-[#8A7764]">
                      {locale === "ja"
                        ? index === 0
                          ? "地域導入の考え方"
                          : "ご家族の安心"
                        : "Topic"}
                    </div>
                    <h3 className="mt-2 text-xl font-light leading-tight text-[#3B2F2F]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.whyItMatters}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  } catch (error) {
    console.error("insights preview unavailable:", error);
    return null;
  }
}

function formatDate(value: string, locale: Locale) {
  const formatter = new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return formatter.format(new Date(value));
}
