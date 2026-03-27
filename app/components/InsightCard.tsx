import Link from "next/link";

import type { InsightEntry, Locale } from "@/lib/insights/types";

export default function InsightCard({
  insight,
  locale,
  detailBasePath,
  variant = "default",
}: {
  insight: InsightEntry;
  locale: Locale;
  detailBasePath: string;
  variant?: "default" | "list";
}) {
  const summary = insight.summary?.trim() || (locale === "ja" ? "詳細を準備中です。" : "Details are being prepared.");
  const yorisouView = insight.yorisouView?.filter(Boolean) || [];
  const primaryView = yorisouView[0] || (locale === "ja" ? "Yorisouの見立てを準備中です。" : "Yorisou's editorial reading is being prepared.");
  const tags = insight.tags?.filter(Boolean) || [];
  const isList = variant === "list";

  return (
    <article className={`rounded-[1.4rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.82)] ${isList ? "p-5" : "p-6"}`}>
      <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.12em] text-[#8A7764]">
        <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1">{insight.categoryLabel}</span>
        {insight.featured && (
          <span className="rounded-full bg-[rgba(237,242,234,0.82)] px-3 py-1 text-[var(--accent-sage-text)]">
            {locale === "ja" ? "注目" : "Featured"}
          </span>
        )}
        <span>{formatDate(insight.publishedAt, locale)}</span>
        <span>{insight.regionLabel}</span>
      </div>
      <h2 className={`mt-4 font-light leading-[1.45] text-[#3B2F2F] ${isList ? "text-[1.35rem]" : "text-[1.55rem]"}`}>
        <Link href={`${detailBasePath}/${insight.slug}`} className="transition hover:text-[#6B5A4A]">
          {insight.title}
        </Link>
      </h2>
      <p className={`mt-3 text-sm text-[#5A4B3E] ${isList ? "line-clamp-3 leading-7" : "leading-7"}`}>{summary}</p>

      {!isList && (
        <div className="mt-4 rounded-[1.2rem] bg-[var(--surface-soft)] p-4">
          <div className="text-xs tracking-[0.18em] text-[#8A7764]">Yorisouの見方</div>
          <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{primaryView}</p>
        </div>
      )}

      {isList ? (
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#6B5A4A]">{insight.whyItMatters || primaryView}</p>
      ) : (
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs text-[#6B5A4A]">
              #{tag}
            </span>
          ))}
        </div>
      )}
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
