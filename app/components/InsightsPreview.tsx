import Link from "next/link";

import { fetchHomepageInsights } from "@/lib/insights/service";
import type { Locale } from "@/lib/insights/types";

export default async function InsightsPreview({ locale }: { locale: Locale }) {
  const { hero, secondary } = await fetchHomepageInsights(locale, 1, 2);
  const heroItem = hero[0] || secondary[0];
  const secondaryItems = hero[0] ? secondary : secondary.slice(1);
  const href = locale === "ja" ? "/insights" : "/en/insights";

  return (
    <section className="border-t border-[#D6C3A3]/30 bg-[#F8F4EC]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-light leading-tight text-[#3B2F2F]">
              {locale === "ja" ? "Yorisouの読みもの" : "Selected thinking from Yorisou"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
              {locale === "ja"
                ? "高齢社会、地域交通、家族の不安、導入後の支え方。Yorisouが日々向き合っていることを、静かに整理してお届けします。"
                : "A calm editorial selection around aging, mobility, and care, shaped by the questions Yorisou sees on the ground."}
            </p>
          </div>
          <Link href={href} className="rounded-full border border-[#3B2F2F]/16 bg-white/72 px-6 py-3 text-sm transition hover:bg-white">
            {locale === "ja" ? "インサイト一覧へ" : "View all insights"}
          </Link>
        </div>

        {heroItem && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-[2rem] border border-[#D6C3A3]/35 bg-white/85 p-7 shadow-sm md:p-8">
              <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.12em] text-[#8A7764]">
                <span>{formatDate(heroItem.publishedAt, locale)}</span>
                <span>{heroItem.categoryLabel}</span>
              </div>
              <h3 className="mt-4 text-3xl font-light leading-tight text-[#3B2F2F]">
                <Link href={`${href}/${heroItem.slug}`} className="transition hover:text-[#6B5A4A]">
                  {heroItem.title}
                </Link>
              </h3>
              <p className="mt-4 text-sm leading-8 text-[#5A4B3E] md:text-base">{heroItem.summary}</p>
              <p className="mt-5 text-sm leading-7 text-[#6B5A4A]">{heroItem.yorisouView[0]}</p>
            </article>

            <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/78 p-6 shadow-sm">
              {secondaryItems.map((item) => (
                <article key={item.slug} className="border-t border-[#D6C3A3]/28 py-5 first:border-t-0 first:pt-0 last:pb-0">
                  <div className="text-xs tracking-[0.12em] text-[#8A7764]">
                    {formatDate(item.publishedAt, locale)} ・ {item.categoryLabel}
                  </div>
                  <h3 className="mt-3 text-2xl font-light leading-tight text-[#3B2F2F]">
                    <Link href={`${href}/${item.slug}`} className="transition hover:text-[#6B5A4A]">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.summary}</p>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function formatDate(value: string, locale: Locale) {
  const formatter = new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return formatter.format(new Date(value));
}
