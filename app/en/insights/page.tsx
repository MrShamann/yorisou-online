import type { Metadata } from "next";
import Link from "next/link";

import InsightCard from "@/app/components/InsightCard";
import { fetchNews } from "@/lib/insights/service";

export const metadata: Metadata = {
  title: "Yorisou Insights | Life-State, Reflection, Reports, and Recommendation Ethics",
  description:
    "Yorisou Insights explores life-state reflection, public-safe results, private reports, recommendation ethics, companionship, and the everyday signals that shape better next steps.",
};

const editorialThemes = [
  {
    label: "Life-state reflection",
    text: "Life-state is a practical way to talk about the current mix of rhythm, preference, friction, recovery, attention, and relationship distance. The goal is not to reduce a person to a type. The goal is to make the present state easier to notice, name, and revisit.",
  },
  {
    label: "Digital reports without pressure",
    text: "Yorisou reports are meant to add structure and depth when a user wants more than a first result. Good report design should show what is added, what is limited, and why the content may be useful — not rely on urgency, fear, or the feeling that a person is incomplete without buying.",
  },
  {
    label: "Recommendation ethics",
    text: "Recommendations should be narrow, explained, and shaped by user fit before commercial value. When Yorisou recommends a report, article, tool, or future partner resource, the reason should be understandable.",
  },
  {
    label: "Companionship, not dependency",
    text: "Yorisou's companionship direction is light but serious. It should help people return to their own state, notice changes, and take small next steps — not pretend to replace friends, professionals, family, or human care.",
  },
  {
    label: "Daily signals, carefully handled",
    text: "Over time, small actions can become useful signals: retaking a check, saving a result, reading a report preview, giving feedback, or responding to a recommendation. Yorisou should use those signals to improve the experience while respecting privacy, consent, and the difference between individual data and aggregate insight.",
  },
  {
    label: "What this section is not",
    text: "Yorisou Insights does not provide clinical guidance, psychological diagnosis, legal advice, financial advice, care coordination, mobility services, or public-service information. It is a product and methodology journal for the Yorisou experience.",
  },
];

export default async function InsightsPageEn() {
  let insights: Awaited<ReturnType<typeof fetchNews>> = [];
  try {
    insights = await fetchNews("en");
  } catch {
    insights = [];
  }
  const featured = insights.filter((item) => item.featured);
  const latest = insights.filter((item) => !item.featured);
  const listItems = featured.length > 0 ? latest : insights;

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="relative overflow-hidden border-b border-[#D6C3A3]/35">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
          <div className="max-w-4xl rounded-[2.5rem] border border-[#D6C3A3]/40 bg-white/70 p-8 shadow-[0_24px_70px_rgba(59,47,47,0.08)] backdrop-blur md:p-12">
            <div className="eyebrow">Yorisou Insights</div>
            <h1 className="mt-4 text-4xl font-light leading-tight md:text-6xl">
              Notes on life-state, reflection,
              <span className="block text-[#6B5A4A]">and gentle recommendation.</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisou Insights is the editorial home for how we think about check-ins, public-safe results, private reports, AI-assisted recommendations, companionship, and daily signals.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6B5A4A] md:text-base">
              Yorisou Insights focuses on the ideas behind the product: how people notice their state, why public and private results should be separated, how reports can add depth without pressure, and how recommendations should stay useful rather than manipulative. This is not an aging or mobility research page.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/en/check-in" className="btn btn-primary">
                Start the check-in
              </Link>
              <Link href="/en/about" className="btn btn-secondary">
                About Yorisou
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/30 bg-[#FCFAF6]">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {editorialThemes.map((theme) => (
              <div key={theme.label} className="rounded-[1.5rem] border border-[#D6C3A3]/35 bg-white/80 p-5 shadow-sm">
                <div className="text-sm tracking-[0.18em] text-[#8A7764]">{theme.label}</div>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{theme.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="px-6 py-16 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <div className="text-sm tracking-[0.18em] text-[#8A7764]">Featured</div>
                <h2 className="mt-3 text-3xl font-light">Editorial priorities worth reading now</h2>
              </div>
              <div className="text-sm text-[#6B5A4A]">{featured.length} items</div>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <InsightCard insight={featured[0]} locale="en" detailBasePath="/en/insights" />
              <div className="grid gap-6">
                {featured.slice(1, 3).map((insight) => (
                  <InsightCard key={insight.slug} insight={insight} locale="en" detailBasePath="/en/insights" />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm tracking-[0.18em] text-[#8A7764]">Articles</div>
              <h2 className="mt-3 text-3xl font-light">
                {featured.length > 0 ? "Latest Insights" : "Yorisou Insights"}
              </h2>
            </div>
            <div className="hidden text-sm text-[#6B5A4A] md:block">{insights.length} items</div>
          </div>

          {insights.length === 0 ? (
            <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/80 p-8 shadow-sm">
              <div className="text-sm tracking-[0.18em] text-[#8A7764]">No public insights yet</div>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5A4B3E]">
                English editorial items are being prepared. Please check back soon or browse the Japanese insights in the meantime.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {listItems.map((insight) => (
                <InsightCard key={insight.slug} insight={insight} locale="en" detailBasePath="/en/insights" />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
