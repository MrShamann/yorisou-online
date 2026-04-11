import Link from "next/link";

import InsightsPreview from "../components/InsightsPreview";
import MotionReveal from "../components/MotionReveal";

const trustPoints = [
  "Reservation-based transport",
  "Family coordination before booking",
  "Pilot intake for operators",
];

const serviceCards = [
  {
    title: "Reservation mobility consultation",
    text: "Start with the mobility concern, family questions, and booking checks before the trip is booked.",
    href: "/en/reservation-mobility-support",
    cta: "Open consultation",
  },
  {
    title: "Services and implementation",
    text: "For families, operators, facilities, and municipalities, Yorisou can support service choice, pilot planning, and operating design.",
    href: "/en/services",
    cta: "View services",
  },
];

const entryLinks = [
  { href: "/en/reservation-mobility-support", label: "Reservation mobility support" },
  { href: "/en/about", label: "About the platform" },
  { href: "/en/services", label: "Services" },
  { href: "/en/pilot", label: "Pilot" },
  { href: "/en/insights", label: "Insights" },
  { href: "/en/register", label: "First time here?" },
];

export default function HomePageEn() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="section-wash relative overflow-hidden border-b border-[#D6C3A3]/30 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.84),_rgba(245,241,232,0.96)_58%)]">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/60 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <MotionReveal className="shell-card p-8 md:p-12" delay={40} distance={26}>
            <div className="eyebrow">Reservation consultation entry</div>
            <h1 className="mt-4 text-4xl font-light leading-tight md:text-6xl">
              Before reservation-based transport starts,
              <span className="block text-[#6B5A4A]">Hinata helps organize family concerns and pilot questions.</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Start with the concern, not the booking system. Yorisou gives families and local operators a calm entry point before phone, LINE, or app booking.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6B5A4A] md:text-base">
              Hinata narrows the practical next step first, then keeps the context so you can continue later if needed.
            </p>
            <div className="mt-6 rounded-[1.5rem] border border-[#D6C3A3]/35 bg-white/82 px-5 py-5 text-sm leading-7 text-[#5A4B3E]">
              <div className="eyebrow">Primary entry</div>
              <p className="mt-2">
                The natural first step is to talk about reservation-based mobility before the booking flow starts. It can continue later without starting over.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/en/reservation-mobility-support" className="btn btn-primary">
                Reservation mobility consultation
              </Link>
              <Link href="/en/reservation-mobility-support#pilot-inquiry" className="btn btn-secondary">
                Discuss pilot use
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {trustPoints.map((item) => (
                <div key={item} className="rounded-full border border-[#D6C3A3]/35 bg-[#FCFAF6] px-4 py-2 text-sm text-[#5A4B3E]">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#6B5A4A]">
              {entryLinks.map((item) => (
                <Link key={item.href} href={item.href} className="soft-link">
                  {item.label}
                </Link>
              ))}
            </div>

          </MotionReveal>

          <div className="grid gap-5">
            <MotionReveal delay={120} distance={18}>
              <div className="motion-card rounded-[2rem] border border-[#D6C3A3]/35 bg-white/85 p-7 shadow-[0_24px_60px_rgba(59,47,47,0.06)]">
              <div className="eyebrow">When Yorisou Helps</div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl bg-[#FCFAF6] px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                  A parent’s clinic visits or shopping trips are becoming harder to manage.
                </div>
                <div className="rounded-2xl bg-[#FCFAF6] px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                  A product comparison alone does not show which mobility option fits real daily routes.
                </div>
                <div className="rounded-2xl bg-[#FCFAF6] px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                  A local pilot is needed, but the rollout and operating model are still unclear.
                </div>
              </div>
              </div>
            </MotionReveal>

            <MotionReveal delay={180} distance={16}>
              <div className="motion-card rounded-[2rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-7 shadow-sm">
              <div className="eyebrow">Continuation</div>
              <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">
                Yorisou is now LINE-first. Start with LINE if this is your first time, and use the account path when you are returning to an existing consultation.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                <Link href="/en/line/next?line_intent=register&returnTo=/en/support" className="soft-link">
                  Start with LINE
                </Link>
                <Link href="/en/login" className="soft-link">
                  Continue with account
                </Link>
              </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      <section className="section-wash border-b border-[#D6C3A3]/30 bg-white/50 px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <MotionReveal className="mb-8 max-w-3xl" delay={30}>
            <div className="eyebrow">What Yorisou Offers</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">The entry point is conversation. From there, support can extend into products or local implementation.</h2>
          </MotionReveal>

          <div className="grid gap-6 md:grid-cols-2">
            {serviceCards.map((item, index) => (
              <MotionReveal key={item.title} delay={90 + index * 70} distance={16}>
                <div key={item.title} className="motion-card rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/80 p-6 shadow-sm">
                <h3 className="text-2xl font-light">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
                <div className="mt-6">
                  <Link href={item.href} className="btn btn-secondary">
                    {item.cta}
                  </Link>
                </div>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <InsightsPreview locale="en" />

      <section className="section-wash border-t border-[#D6C3A3]/30 bg-white/50 px-6 py-16 md:px-10">
        <MotionReveal className="mx-auto max-w-7xl rounded-[2rem] border border-[#D6C3A3]/40 bg-white/75 p-8 shadow-[0_20px_60px_rgba(59,47,47,0.06)] backdrop-blur" delay={40}>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="eyebrow">For Organizations</div>
              <h2 className="mt-3 text-3xl font-light leading-tight">For regional pilots and operator support, contact Yorisou directly.</h2>
              <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
                Municipalities, facilities, and community operators can use the contact route for pilot planning and implementation support.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/en/contact" className="btn btn-primary">
                Contact
              </Link>
              <Link href="/en/pilot" className="btn btn-secondary">
                View pilot program
              </Link>
            </div>
          </div>
        </MotionReveal>
      </section>
    </main>
  );
}
