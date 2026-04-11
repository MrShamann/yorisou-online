import type { Metadata } from "next";
import Link from "next/link";

import Hero from "../../components/Hero";
import MotionReveal from "../../components/MotionReveal";

const currentRole = [
  "A consultation entry for families before reservation-based mobility starts.",
  "A way for older users, families, and local supporters to look at the same next step.",
  "A calm bridge to consultation, pilot discussion, or implementation only when needed.",
];

const notRole = [
  "A replacement for existing transport systems.",
  "A broad platform story with too many public wedges.",
  "A page that explains everything at once.",
];

const growthPoints = [
  "Keep the consultation entry clear for the people who need it now.",
  "Accept small pilot and implementation conversations when they become relevant.",
  "Grow carefully with local learning instead of pushing a broad public story.",
];

export const metadata: Metadata = {
  title: "About Yorisou | Reservation consultation entry",
  description: "Yorisou is a consultation entry for reservation-based mobility before booking begins. It helps families and operators organize the next step calmly.",
};

export default function AboutPageEn() {
  return (
    <main className="bg-[#F5F1E8] text-[#3B2F2F]">
      <Hero
        eyebrow="About Yorisou"
        title={
          <>
            <span className="block md:whitespace-nowrap">A calm consultation entry</span>
            <span className="block md:whitespace-nowrap">for reservation-based mobility.</span>
          </>
        }
        subtitle="Yorisou helps families and local operators organize what to confirm before reservation-based transport starts. Hinata keeps the first step clear and only connects to consultation, pilot, or implementation when needed."
        primaryHref="/en/reservation-mobility-support"
        primaryLabel="Reservation mobility consultation"
        secondaryHref="/en/reservation-mobility-support#pilot-inquiry"
        secondaryLabel="Discuss pilot use"
      />

      <section className="section section-wash">
        <div className="container">
          <MotionReveal className="section-header" delay={30}>
            <p className="section-label">Current role</p>
            <h2 className="section-title">Help families and operators organize the next step before booking begins.</h2>
            <p className="page-copy" style={{ marginTop: 10 }}>
              Yorisou does not replace existing transport systems. It reduces pre-booking confusion, repeated explanation, and onboarding friction by keeping the first conversation calm and clear.
            </p>
          </MotionReveal>

          <div className="grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
            <MotionReveal delay={40}>
              <div className="motion-card rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-6 py-6">
                <div className="service-kicker">What it does now</div>
                <ul className="list-clean page-copy" style={{ marginTop: 16, display: "grid", gap: 12 }}>
                  {currentRole.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </MotionReveal>

            <MotionReveal delay={120} distance={18}>
              <div className="motion-card panel-sage rounded-[1.7rem] px-6 py-6">
                <div className="service-kicker text-[var(--accent-sage-text)]">What it does not do</div>
                <ul className="list-clean page-copy" style={{ marginTop: 16, display: "grid", gap: 12, color: "var(--accent-sage-text)" }}>
                  {notRole.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
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
                <div className="service-kicker">How it grows</div>
                <h2 className="section-title" style={{ marginTop: 12 }}>
                  Keep the current wedge clear, then extend carefully when a real need appears.
                </h2>
                <p className="page-copy" style={{ marginTop: 12 }}>
                  Hinata starts as a consultation entry. When a pilot or implementation conversation becomes relevant, it can move forward without forcing the public page to become a broad platform story.
                </p>
                <p className="page-copy" style={{ marginTop: 12 }}>
                  Local learning, family needs, and operational reality stay connected, but the public message stays narrow and practical.
                </p>
              </div>
            </MotionReveal>

            <MotionReveal delay={130} distance={18}>
              <div className="motion-card rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-6 py-6">
                <div className="service-kicker">What we value</div>
                <ul className="list-clean page-copy" style={{ marginTop: 16, display: "grid", gap: 10 }}>
                  {growthPoints.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/en/reservation-mobility-support" className="soft-link">
                    Reservation mobility consultation
                  </Link>
                  <Link href="/en/contact" className="soft-link">
                    Contact
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
