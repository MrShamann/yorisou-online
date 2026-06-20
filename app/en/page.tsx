import type { Metadata } from "next";
import Link from "next/link";

import MotionReveal from "../components/MotionReveal";

export const metadata: Metadata = {
  title: "Yorisou | A Life-State Check for Understanding Where You Are Now",
  description:
    "Yorisou is a LINE/Web-first life-state check that helps people reflect on their current state, receive a public-safe result, and continue toward private hints and gentle recommendations.",
};

export default function HomePageEn() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="section-wash relative overflow-hidden border-b border-[#D6C3A3]/30 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.84),_rgba(245,241,232,0.96)_58%)]">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/60 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <MotionReveal className="shell-card p-8 md:p-12" delay={40} distance={26}>
            <div className="eyebrow">Yorisou</div>
            <h1 className="mt-4 text-4xl font-light leading-tight md:text-6xl">
              A lighter way to understand
              <span className="block text-[#6B5A4A]">where you are now.</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisou helps you reflect on your current life state through a short check, then separates what is safe to share from what is meant only for you.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/check-in" className="btn btn-primary">
                Start the check-in
              </Link>
              <Link href="/en/about" className="btn btn-secondary">
                Learn about Yorisou
              </Link>
            </div>
          </MotionReveal>

          <div className="grid gap-5">
            <MotionReveal delay={120} distance={18}>
              <div className="motion-card rounded-[2rem] border border-[#D6C3A3]/35 bg-white/85 p-7 shadow-[0_24px_60px_rgba(59,47,47,0.06)]">
                <div className="eyebrow">Reflection first, recommendations later</div>
                <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">
                  Yorisou is a mobile-first product for understanding your current state: your rhythm, preferences, friction, and small signals from everyday life.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">
                  It starts with a check-in, gives you a public-safe result, and then guides you toward private hints, report previews, and carefully scoped recommendations.
                </p>
              </div>
            </MotionReveal>

            <MotionReveal delay={180} distance={16}>
              <div className="motion-card rounded-[2rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-7 shadow-sm">
                <div className="eyebrow">Public-safe by design</div>
                <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">
                  Your first result is written to be safe enough to view, save, or share. It does not include private vulnerabilities, personal history, recommendation records, or deeper report content.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">
                  More personal interpretation belongs in private spaces.
                </p>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      <section className="section-wash border-b border-[#D6C3A3]/30 bg-white/50 px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <MotionReveal className="mb-8 max-w-3xl" delay={30}>
            <div className="eyebrow">The basic flow</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">
              Take the check. See your current state. Read what is safe to share. Continue privately if you want more depth.
            </h2>
          </MotionReveal>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                label: "A small next step, not a marketplace",
                text: "Yorisou recommendations are meant to be narrow, explained, and useful. They may include reports, content, resources, or future paths — not a crowded catalog or a hidden sales funnel.",
              },
              {
                label: "What Yorisou is not",
                text: "Yorisou is not a medical, clinical, psychological, legal, financial, mobility, care, or government service. It is not fortune-telling, and it is not an AI that decides your life for you.",
              },
              {
                label: "Save and return",
                text: "Save or return through LINE/Web as the product grows. The experience is designed to continue at your own pace.",
              },
            ].map((item, index) => (
              <MotionReveal key={item.label} delay={90 + index * 70} distance={16}>
                <div className="motion-card rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/80 p-6 shadow-sm">
                  <div className="eyebrow">{item.label}</div>
                  <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wash border-t border-[#D6C3A3]/30 bg-white/50 px-6 py-16 md:px-10">
        <MotionReveal
          className="mx-auto max-w-7xl rounded-[2rem] border border-[#D6C3A3]/40 bg-white/75 p-8 shadow-[0_20px_60px_rgba(59,47,47,0.06)] backdrop-blur"
          delay={40}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="eyebrow">Start with the current check-in</div>
              <h2 className="mt-3 text-3xl font-light leading-tight">
                Begin with the current public check-in, then move at your own pace.
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/check-in" className="btn btn-primary">
                Start the check-in
              </Link>
              <Link href="/en/about" className="btn btn-secondary">
                About Yorisou
              </Link>
            </div>
          </div>
        </MotionReveal>
      </section>
    </main>
  );
}
