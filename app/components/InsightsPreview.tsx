import Link from "next/link";

import InsightCard from "@/app/components/InsightCard";
import { fetchLatestInsights } from "@/lib/insights/service";
import type { Locale } from "@/lib/insights/types";

export default async function InsightsPreview({ locale }: { locale: Locale }) {
  const items = await fetchLatestInsights(locale, 3);
  const href = locale === "ja" ? "/insights" : "/en/insights";

  return (
    <section className="border-t border-[#D6C3A3]/30 bg-[#F8F4EC]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">
              {locale === "ja" ? "News + Analysis" : "News + Analysis"}
            </div>
            <h2 className="mt-3 text-3xl font-light leading-tight text-[#3B2F2F]">
              {locale === "ja"
                ? "Yorisouが読み解く、地域モビリティの論点"
                : "Yorisou’s reading of senior and community mobility trends"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
              {locale === "ja"
                ? "高齢社会、地域交通、福祉移動に関する話題を、Yorisouの視点で落ち着いて整理したインサイトです。"
                : "A calm editorial briefing on aging-society mobility, community transport, and practical service design through the Yorisou lens."}
            </p>
          </div>
          <Link
            href={href}
            className="rounded-2xl border border-[#3B2F2F]/20 bg-white/70 px-6 py-3 text-sm transition hover:bg-white"
          >
            {locale === "ja" ? "インサイト一覧へ" : "View all insights"}
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {items.map((item) => (
            <InsightCard key={item.slug} insight={item} locale={locale} detailBasePath={href} />
          ))}
        </div>
      </div>
    </section>
  );
}
