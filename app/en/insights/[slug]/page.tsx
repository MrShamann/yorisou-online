import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchInsightDetail, fetchNews } from "@/lib/insights/service";

export async function generateStaticParams() {
  return (await fetchNews("en")).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = await fetchInsightDetail(slug, "en");

  if (!insight) {
    return {};
  }

  return {
    title: `${insight.title} | Yorisou Insights`,
    description: insight.summary,
  };
}

export default async function InsightDetailPageEn({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = await fetchInsightDetail(slug, "en");

  if (!insight) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <article className="mx-auto max-w-5xl px-6 py-14 md:px-10 md:py-18">
        <Link href="/en/insights" className="text-sm text-[#6B5A4A] transition hover:text-[#3B2F2F]">
          ← Back to insights
        </Link>

        <header className="mt-6 rounded-[2.5rem] border border-[#D6C3A3]/40 bg-white/75 p-8 shadow-[0_24px_70px_rgba(59,47,47,0.08)] backdrop-blur md:p-10">
          <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.12em] text-[#8A7764]">
            <span className="rounded-full border border-[#D6C3A3]/45 bg-[#FCFAF6] px-3 py-1">{insight.categoryLabel}</span>
            {insight.featured && (
              <span className="rounded-full border border-[#C8D0C1] bg-[#F3F0E7] px-3 py-1 text-[#4D5642]">Featured</span>
            )}
            <span>{insight.regionLabel}</span>
            <span>{insight.publishedAt}</span>
          </div>
          <h1 className="mt-4 text-4xl font-light leading-tight md:text-5xl">{insight.title}</h1>
          <p className="mt-6 text-base leading-8 text-[#5A4B3E] md:text-lg">{insight.summary}</p>
          <div className="mt-5 text-sm text-[#6B5A4A]">
            Source:{" "}
            <a href={insight.sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">
              {insight.sourceName}
            </a>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-6 shadow-sm">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">Why It Matters</div>
            <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">{insight.whyItMatters}</p>
          </div>

          <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/80 p-6 shadow-sm">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">YORISOU VIEW</div>
            <div className="mt-4 grid gap-4">
              {insight.yorisouView.map((item) => (
                <div key={item} className="rounded-2xl bg-[#FCFAF6] p-4 text-sm leading-7 text-[#5A4B3E]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/80 p-6 shadow-sm">
          <div className="text-sm tracking-[0.18em] text-[#8A7764]">Practical Takeaways</div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {insight.practicalTakeaways.map((item) => (
              <div key={item} className="rounded-2xl bg-[#FCFAF6] p-4 text-sm leading-7 text-[#5A4B3E]">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/80 p-6 shadow-sm">
          <div className="text-sm tracking-[0.18em] text-[#8A7764]">What This Means</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <AudienceCard title="For quick self-checks" text={insight.whatThisMeans.seniors} />
            <AudienceCard title="For returning to your result" text={insight.whatThisMeans.families} />
            <AudienceCard title="For open testing" text={insight.whatThisMeans.localCommunities} />
            <AudienceCard title="For recommendation memory" text={insight.whatThisMeans.operators} />
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-2">
          {insight.tags.map((tag) => (
            <Link
              key={tag}
              href={`/en/insights?tag=${encodeURIComponent(tag)}`}
              className="rounded-full bg-[#F7F2E9] px-3 py-1 text-xs text-[#6B5A4A]"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </article>
    </main>
  );
}

function AudienceCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-[#FCFAF6] p-5">
      <div className="text-sm tracking-[0.12em] text-[#8A7764]">{title}</div>
      <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{text}</p>
    </div>
  );
}
