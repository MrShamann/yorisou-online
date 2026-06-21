import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Yorisou Notes | Life-state reflection and gentle companionship",
  description:
    "Yorisou Notes is a quiet reading space for thinking about your current state, relationships, distance, and recovery. Not a diagnosis. Not a prescription.",
};

const THEMES = [
  {
    label: "Life-state reflection",
    text: "Life-state is a practical way to talk about the current mix of rhythm, preference, friction, recovery, attention, and relationship distance. The goal is not to reduce a person to a type — it is to make the present state easier to notice, name, and revisit.",
  },
  {
    label: "Relationship fatigue",
    text: "Replies, plans, and over-accommodation all take energy. Recognising where the weight is showing up is a small but useful first step — not a diagnosis, and not a reason to cut people off.",
  },
  {
    label: "Romantic distance",
    text: "How close is comfortable? How much space do you need before you feel grounded again? These questions are about your own patterns, not judgements about the other person.",
  },
  {
    label: "Digital reports without pressure",
    text: "Yorisou reports are meant to add structure and depth when a user wants more than a first result. Good report design shows what is added, what is limited, and why the content may be useful — not urgency, fear, or the feeling of being incomplete without buying.",
  },
  {
    label: "Returning later via LINE",
    text: "A single check-in cannot capture everything. Returning to a result after a day, a week, or a month often reveals something that was not visible the first time. LINE is the low-friction path back.",
  },
  {
    label: "What this section is not",
    text: "Yorisou Notes does not provide clinical guidance, psychological diagnosis, legal advice, financial advice, or emergency support. It is a quiet reading space for the ideas behind the Yorisou experience.",
  },
] as const;

export default function InsightsPageEn() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">

      {/* Header */}
      <section className="border-b border-[#D6C3A3]/35">
        <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-18">
          <div className="space-y-4">
            <div className="text-xs tracking-[0.18em] text-[#8A7764]">Yorisou Notes</div>
            <h1 className="text-3xl font-light leading-tight md:text-5xl">
              A quiet space to read about<br className="hidden md:block" />
              <span className="text-[#6B5A4A]"> your current state.</span>
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[#5A4B3E] md:text-base">
              Notes on life-state reflection, relationship distance, recovery, and how Yorisou thinks about check-ins and reports. Not a diagnosis. Not a prescription.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/en/check-in"
                className="inline-flex min-h-[42px] items-center rounded-full bg-[#3B2F2F] px-5 text-[13px] font-semibold text-white transition hover:bg-[#2A2020]"
              >
                Start the check-in
              </Link>
              <Link
                href="/en/line/mini-app"
                className="inline-flex min-h-[42px] items-center rounded-full border border-[#D6C3A3] bg-white/80 px-5 text-[13px] font-semibold text-[#3B2F2F] transition hover:bg-white"
              >
                Open in LINE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial themes */}
      <section className="border-b border-[#D6C3A3]/30 bg-[#FCFAF6]">
        <div className="mx-auto max-w-5xl px-6 py-10 md:px-10">
          <div className="mb-6 text-xs tracking-[0.18em] text-[#8A7764]">Themes</div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {THEMES.map((theme) => (
              <div
                key={theme.label}
                className="rounded-[1.5rem] border border-[#D6C3A3]/35 bg-white/80 p-5 shadow-sm"
              >
                <div className="text-sm tracking-[0.14em] text-[#8A7764]">{theme.label}</div>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{theme.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report link */}
      <section className="mx-auto max-w-3xl px-6 py-12 md:px-10">
        <div className="space-y-4">
          <div className="text-xs tracking-[0.18em] text-[#8A7764]">Report preview</div>
          <Link
            href="/reports/relationship-fatigue"
            className="group flex flex-col gap-2 rounded-[1.5rem] border border-[#D6C3A3]/40 bg-white/80 p-6 shadow-sm transition hover:shadow-md"
          >
            <span className="inline-flex self-start rounded-full bg-[#F7F2E9] px-3 py-1 text-xs text-[#6B5A4A]">
              Relationship fatigue
            </span>
            <p className="text-base font-medium leading-7 text-[#3B2F2F]">
              Reading relationship fatigue a little deeper
            </p>
            <p className="text-sm leading-7 text-[#5A4B3E]">
              A preview of the deeper report — replies, plans, distance, and recovery.
            </p>
            <span className="mt-1 text-xs text-[#8A7764] group-hover:text-[#3B2F2F]">View report →</span>
          </Link>
        </div>
      </section>

    </main>
  );
}
