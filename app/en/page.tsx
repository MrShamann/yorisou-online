import Link from "next/link";

import InsightsPreview from "../components/InsightsPreview";

const trustPoints = [
  "Mobility consultation for seniors and families",
  "Small local pilot planning",
  "Support that considers real operations",
];

const serviceCards = [
  {
    title: "Talk with Hinata",
    text: "Start with a calm conversation. Hinata helps make sense of the concern first, then helps with the next step only when needed.",
    href: "/en/support#scenario-assistant",
    cta: "Talk with Hinata",
  },
  {
    title: "Pilot and implementation support",
    text: "For municipalities, facilities, and operators, Yorisou can support small local pilots and operating design.",
    href: "/en/services",
    cta: "View services",
  },
];

export default function HomePageEn() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="relative overflow-hidden border-b border-[#D6C3A3]/30 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.84),_rgba(245,241,232,0.96)_58%)]">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/60 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="shell-card p-8 md:p-12">
            <div className="eyebrow">Senior-Friendly Mobility / Japan</div>
            <h1 className="mt-4 text-4xl font-light leading-tight md:text-6xl">
              Practical mobility choices,
              <span className="block text-[#6B5A4A]">organized for seniors, families, and communities.</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisou is a calm support service for mobility and daily life in Japan. The main entry is a conversation with Hinata, and from there support can extend into products, family support, and local implementation when needed.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6B5A4A] md:text-base">
              It is fine to begin before everything is clear. You can simply start talking, and the structure can come later.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/en/support#scenario-assistant" className="btn btn-primary">
                Talk with Hinata
              </Link>
              <Link href="/en/contact" className="btn btn-secondary">
                Contact Yorisou
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {trustPoints.map((item) => (
                <div key={item} className="rounded-full border border-[#D6C3A3]/35 bg-[#FCFAF6] px-4 py-2 text-sm text-[#5A4B3E]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-[#D6C3A3]/35 bg-white/85 p-7 shadow-[0_24px_60px_rgba(59,47,47,0.06)]">
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

            <div className="rounded-[2rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-7 shadow-sm">
              <div className="eyebrow">Yorisou View</div>
              <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">
                The focus is not only on vehicle choice. Yorisou looks at daily routes, family burden, clarity of explanation, and whether the option can remain workable over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/30 bg-white/50 px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <div className="eyebrow">What Yorisou Offers</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">The entry point is conversation. From there, support can extend into products or local implementation.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {serviceCards.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/80 p-6 shadow-sm">
                <h3 className="text-2xl font-light">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
                <div className="mt-6">
                  <Link href={item.href} className="btn btn-secondary">
                    {item.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InsightsPreview locale="en" />

      <section className="border-t border-[#D6C3A3]/30 bg-white/50 px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#D6C3A3]/40 bg-white/75 p-8 shadow-[0_20px_60px_rgba(59,47,47,0.06)] backdrop-blur">
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
        </div>
      </section>
    </main>
  );
}
