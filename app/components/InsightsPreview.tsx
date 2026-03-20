import Link from "next/link";

import InsightCard from "@/app/components/InsightCard";
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
              {locale === "ja" ? "Yorisouが日々考えていること" : "Selected thinking from Yorisou"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
              {locale === "ja"
                ? "高齢社会、地域交通、福祉移動の話題を、現場の支援設計にもつながる視点として静かに整理しています。"
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
                <span className="rounded-full border border-[#D6C3A3]/45 bg-[#FCFAF6] px-3 py-1 text-[#6B5A4A]">
                  {locale === "ja" ? "注目の記事" : "Featured"}
                </span>
                <span>{heroItem.categoryLabel}</span>
                <span>{formatDate(heroItem.publishedAt, locale)}</span>
              </div>
              <h3 className="mt-4 text-3xl font-light leading-tight text-[#3B2F2F]">
                <Link href={`${href}/${heroItem.slug}`} className="transition hover:text-[#6B5A4A]">
                  {heroItem.title}
                </Link>
              </h3>
              <p className="mt-4 text-sm leading-8 text-[#5A4B3E] md:text-base">{heroItem.summary}</p>
              <div className="mt-5 rounded-[1.5rem] border border-[#D6C3A3]/30 bg-[#FCFAF6] p-5">
                <div className="text-xs tracking-[0.18em] text-[#8A7764]">{locale === "ja" ? "Yorisouの視点" : "Yorisou view"}</div>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{heroItem.yorisouView[0]}</p>
              </div>
            </article>

            <div className="grid gap-6">
              {secondaryItems.map((item) => (
                <InsightCard key={item.slug} insight={item} locale={locale} detailBasePath={href} />
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
