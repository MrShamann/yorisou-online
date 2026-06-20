import type { Metadata } from "next";
import Link from "next/link";

import Hero from "../../components/Hero";
import MotionReveal from "../../components/MotionReveal";

export const metadata: Metadata = {
  title: "About Yorisou | Life-State Understanding and Gentle Recommendations",
  description:
    "Learn how Yorisou helps people reflect on their current life state, receive a public-safe result, continue privately, and find gentle next-step recommendations.",
};

export default function AboutPageEn() {
  return (
    <main className="bg-[#F5F1E8] text-[#3B2F2F]">
      <Hero
        eyebrow="About Yorisou"
        title={
          <>
            <span className="block md:whitespace-nowrap">Yorisou helps people notice their current state</span>
            <span className="block md:whitespace-nowrap">before choosing their next step.</span>
          </>
        }
        subtitle="It is a LINE/Web-first reflection product that turns a short check-in into a public-safe result, private hints, and carefully bounded recommendation paths."
        primaryHref="/en/check-in"
        primaryLabel="Start the check-in"
        secondaryHref="/en/insights"
        secondaryLabel="Read insights"
      />

      <section className="section section-wash">
        <div className="container">
          <MotionReveal className="section-header" delay={30}>
            <p className="section-label">What Yorisou is</p>
            <h2 className="section-title">A life-state understanding product</h2>
            <p className="page-copy" style={{ marginTop: 10 }}>
              Yorisou helps people look at the patterns that are easy to miss in daily life: how they make decisions, recover energy, relate to others, and respond to small pressures.
            </p>
            <p className="page-copy" style={{ marginTop: 8 }}>
              The product starts with a check-in and uses structured interpretation to turn those answers into a current-state result.
            </p>
          </MotionReveal>
        </div>
      </section>

      <section className="section section-wash" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
            <MotionReveal delay={40}>
              <div className="motion-card rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-6 py-6">
                <div className="service-kicker">Why it exists</div>
                <h2 className="section-title" style={{ marginTop: 12 }}>
                  Not to define you. To make reflection easier.
                </h2>
                <p className="page-copy" style={{ marginTop: 12 }}>
                  People often do not need a louder answer. They need a clearer way to look at what is already happening.
                </p>
                <p className="page-copy" style={{ marginTop: 8 }}>
                  Yorisou exists to make that reflection easier. It gives language to your current state, keeps public and private content separate, and helps you consider a next step without pressure.
                </p>
              </div>
            </MotionReveal>

            <MotionReveal delay={120} distance={18}>
              <div className="motion-card panel-sage rounded-[1.7rem] px-6 py-6">
                <div className="service-kicker text-[var(--accent-sage-text)]">The first step</div>
                <h2 className="section-title" style={{ marginTop: 12 }}>
                  The first step is a check-in
                </h2>
                <p className="page-copy" style={{ marginTop: 12, color: "var(--accent-sage-text)" }}>
                  You answer a short set of questions about your current rhythm, preferences, and state. The check-in is not designed to diagnose you or predict your future. It is a structured way to notice what may be true right now.
                </p>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      <section className="section section-wash" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <MotionReveal delay={40}>
              <div className="motion-card rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-6 py-6">
                <div className="service-kicker">After the check-in</div>
                <h2 className="section-title" style={{ marginTop: 12 }}>
                  Public result, private depth
                </h2>
                <p className="page-copy" style={{ marginTop: 12 }}>
                  After the check-in, Yorisou first shows a public-safe result: a type-style summary, a recognition line, and a few safe traits.
                </p>
                <p className="page-copy" style={{ marginTop: 8 }}>
                  From there, the experience can continue into private hints, report previews, return paths as they are developed, and limited recommendations. The deeper parts are meant for you, not for public sharing.
                </p>
              </div>
            </MotionReveal>

            <MotionReveal delay={130} distance={18}>
              <div className="motion-card rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-6 py-6">
                <div className="service-kicker">Clear boundaries matter</div>
                <p className="page-copy" style={{ marginTop: 12 }}>
                  Yorisou is not a medical or psychological diagnosis, therapy, fortune-telling, professional advice, a chatbot replacement for human care, or a public service provider.
                </p>
                <p className="page-copy" style={{ marginTop: 8 }}>
                  It does not provide mobility reservations, elderly-care services, care-facility coordination, vehicle products, or pilot programs.
                </p>
                <p className="page-copy" style={{ marginTop: 8 }}>
                  When a situation requires professional support, Yorisou should not be treated as a substitute.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/en/check-in" className="btn btn-primary">
                    Start the check-in
                  </Link>
                  <Link href="/en/insights" className="soft-link">
                    Go to insights
                  </Link>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
