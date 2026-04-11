import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import ReservationMobilityInquiryForm from "@/app/components/ReservationMobilityInquiryForm";

const whoItIsFor = [
  {
    title: "Families",
    text: "For family members who want to organize concerns before booking a reservation-based transport service.",
  },
  {
    title: "Operators and institutions",
    text: "For municipalities, facilities, and local operators exploring a pilot or a small consultation entry point.",
  },
];

const commonProblems = [
  "You are not sure whether phone, LINE, or app booking is the right path.",
  "You want to confirm boarding, transfer, pickup, and family coordination before booking.",
  "You want to check conditions calmly before contacting a provider.",
  "You want a small pilot conversation without starting from a full proposal deck.",
];

const hinataTasks = [
  "Organize the mobility concern, the person using the service, and the family context.",
  "Summarize what should be confirmed before booking or inquiry.",
  "Help decide whether the first step should be phone, LINE, app, or a simple inquiry.",
  "Connect the conversation to existing consultation, pilot, or contact routes when needed.",
];

const familyPoints = [
  "Start from one short note.",
  "Bring the family's questions together before the booking step.",
  "Use Hinata as a calm place to organize what to ask next.",
];

const operatorPoints = [
  "Use it as a small intake point for pilot discussion.",
  "Clarify the target user, reservation flow, and operational questions early.",
  "Make the next step practical before moving into a fuller project conversation.",
];

export const metadata: Metadata = {
  title: "Reservation mobility consultation | Yorisou",
  description: "A calm entry point for families and operators who want to organize reservation-based mobility support before booking starts.",
};

export default function ReservationMobilitySupportPageEn() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="section-wash border-b border-[color:var(--line-soft)] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_rgba(247,244,238,0.99)_60%)]">
        <div className="container py-12 md:py-14">
          <div className="max-w-[50rem]">
            <div className="service-kicker">Reservation mobility consultation</div>
            <h1 className="display-serif mt-4 max-w-[15em] text-[1.72rem] leading-[1.68] md:text-[2.2rem]">
              <span className="block">Before booking starts,</span>
              <span className="block text-[#79685f]">organize the family's concerns and the next check points.</span>
            </h1>
            <p className="mt-4 max-w-[42rem] text-sm leading-8 text-[var(--muted)] md:text-[0.98rem]">
              Before phone, LINE, or app booking, Hinata helps organize who is using the service, where they need to go, and what the family wants to confirm.
              It is a calm consultation entry point, not a heavy application flow.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="#family-inquiry" className="btn btn-primary">
                Family consultation
              </Link>
              <Link href="#pilot-inquiry" className="btn btn-secondary">
                Pilot discussion
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wash border-b border-[color:var(--line-soft)] bg-[rgba(255,255,255,0.52)] px-6 py-12 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <Panel title="Who this is for">
            <ul className="grid gap-3 text-sm leading-7 text-[var(--muted)]">
              {whoItIsFor.map((item) => (
                <li key={item.title} className="rounded-[1.15rem] border border-[color:var(--line-soft)] bg-white px-4 py-4">
                  <div className="service-kicker">{item.title}</div>
                  <p className="mt-2">{item.text}</p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Common problems">
            <ul className="grid gap-3 text-sm leading-7 text-[var(--muted)]">
              {commonProblems.map((item) => (
                <li key={item} className="rounded-[1.15rem] border border-[color:var(--line-soft)] bg-white px-4 py-4">
                  {item}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </section>

      <section className="section-wash px-6 py-12 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <Panel title="What Hinata helps organize">
            <ul className="grid gap-3 text-sm leading-7 text-[var(--muted)]">
              {hinataTasks.map((item) => (
                <li key={item} className="rounded-[1.15rem] bg-[rgba(247,244,238,0.82)] px-4 py-4">
                  {item}
                </li>
              ))}
            </ul>
          </Panel>

          <div className="grid gap-6">
            <Panel id="family-inquiry" title="For families">
              <ul className="grid gap-3 text-sm leading-7 text-[var(--muted)]">
                {familyPoints.map((item) => (
                  <li key={item} className="rounded-[1.15rem] border border-[color:var(--line-soft)] bg-white px-4 py-4">
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel id="pilot-inquiry" title="For operators / municipalities / institutions">
              <ul className="grid gap-3 text-sm leading-7 text-[var(--muted)]">
                {operatorPoints.map((item) => (
                  <li key={item} className="rounded-[1.15rem] border border-[color:var(--line-soft)] bg-white px-4 py-4">
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </section>

      <section className="section-wash border-t border-[color:var(--line-soft)] bg-[rgba(255,255,255,0.52)] px-6 py-12 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <ReservationMobilityInquiryForm locale="en" />

          <Panel title="What happens next">
            <div className="grid gap-3 text-sm leading-7 text-[var(--muted)]">
              <p className="rounded-[1.15rem] bg-[rgba(247,244,238,0.82)] px-4 py-4">
                You can begin with one short concern. Share what should be clarified before the booking step, and Hinata will keep the next step calm and practical.
              </p>
              <p className="rounded-[1.15rem] bg-[rgba(247,244,238,0.82)] px-4 py-4">
                It works as an early family consultation path and also as a pilot intake point for local operators.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="/en/contact" className="soft-link">
                  General contact
                </Link>
                <Link href="/en/support" className="soft-link">
                  Ask Hinata
                </Link>
              </div>
            </div>
          </Panel>
        </div>
      </section>
    </main>
  );
}

function Panel({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <article id={id} className="rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.88)] p-6 shadow-[0_12px_28px_rgba(47,35,33,0.04)]">
      <h2 className="display-serif text-[1.35rem] leading-[1.6] text-[var(--text)]">{title}</h2>
      <div className="mt-5">{children}</div>
    </article>
  );
}
