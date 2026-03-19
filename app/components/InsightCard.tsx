import Link from "next/link";

import type { InsightEntry, Locale } from "@/lib/insights/types";

export default function InsightCard({
  insight,
  locale,
  detailBasePath,
}: {
  insight: InsightEntry;
  locale: Locale;
  detailBasePath: string;
}) {
  return (
    <article className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/80 p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.12em] text-[#8A7764]">
        <span className="rounded-full border border-[#D6C3A3]/45 bg-[#FCFAF6] px-3 py-1">{insight.categoryLabel}</span>
        <span>{formatDate(insight.publishedAt, locale)}</span>
        <span>{insight.regionLabel}</span>
      </div>
      <h2 className="mt-4 text-2xl font-light leading-tight text-[#3B2F2F]">
        <Link href={`${detailBasePath}/${insight.slug}`} className="transition hover:text-[#6B5A4A]">
          {insight.title}
        </Link>
      </h2>
      <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">{insight.summary}</p>

      <div className="mt-5 rounded-[1.25rem] border border-[#D6C3A3]/30 bg-[#FCFAF6] p-4">
        <div className="text-xs tracking-[0.18em] text-[#8A7764]">YORISOU VIEW</div>
        <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{insight.yorisouView[0]}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {insight.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-[#F7F2E9] px-3 py-1 text-xs text-[#6B5A4A]">
            #{tag}
          </span>
        ))}
      </div>
    </article>
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
