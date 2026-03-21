import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Yorisou | Support Page",
  description:
    "Yorisou's support page for future continuity, consultation history, recommendation review, family sharing, and follow-up support.",
};

const futureSections = [
  {
    title: "Consultation history",
    body: "We are preparing a place where past advisor sessions and consultation notes can be reviewed calmly later.",
  },
  {
    title: "Recommendation review",
    body: "Compared options and important notes will eventually be organized in one place for the user and family.",
  },
  {
    title: "Family sharing",
    body: "We are preparing a way to make consultation points and next checks easier to share with family members.",
  },
  {
    title: "Follow-up support",
    body: "After introduction, questions and review points should also be easy to continue through the same support flow.",
  },
];

export default function SupportPageEn() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="border-b border-[#D6C3A3]/22 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.94),_rgba(245,241,232,0.98)_60%)] px-6 py-16 md:px-10 md:py-22">
        <div className="mx-auto max-w-6xl">
          <div className="shell-card max-w-4xl p-8 md:p-12">
            <h1 className="text-4xl font-light leading-tight md:text-6xl">Preparing a place for support that continues after the first consultation</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisou is moving beyond a one-time consultation entry toward a calmer support flow where recommendations, family sharing, and follow-up can be reviewed in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/20 bg-white/58 px-6 py-8 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 rounded-[1.75rem] border border-[#D6C3A3]/28 bg-white/78 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <h2 className="text-2xl font-light leading-tight">Login and registration</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5A4B3E] md:text-base">
              Real login and member registration are still in preparation. Once launched, this page is intended to hold consultation history, recommendation review, and family sharing support.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className="rounded-full border border-[#D6C3A3]/60 bg-[#FCFAF6] px-6 py-3 text-sm text-[#8A7764]" disabled aria-disabled="true">
              Login coming soon
            </button>
            <button type="button" className="rounded-full border border-[#D6C3A3]/60 bg-[#FCFAF6] px-6 py-3 text-sm text-[#8A7764]" disabled aria-disabled="true">
              Registration coming soon
            </button>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/22 bg-[#FBF7F0] px-6 py-16 md:px-10 md:py-18">
        <div className="mx-auto max-w-6xl rounded-[2.25rem] border border-[#D6C3A3]/28 bg-white/78 p-7 shadow-[0_24px_60px_rgba(59,47,47,0.05)] md:p-10">
          <h2 className="text-3xl font-light leading-tight">What this page is being prepared for</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {futureSections.map((section) => (
              <div key={section.title} className="rounded-[1.6rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-5 py-5">
                <h3 className="text-xl font-light leading-tight text-[#3B2F2F]">{section.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E] md:text-base">{section.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm leading-7 text-[#6B5A4A] md:text-base">
            There is no real member system yet, but Yorisou is intentionally preparing this as the entry to future continuity support.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/en/ai-advisor" className="btn btn-primary">
              Start advisor
            </Link>
            <Link href="/en/services" className="btn btn-secondary">
              See implementation support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
