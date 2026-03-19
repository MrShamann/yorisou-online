import Link from "next/link";
import InsightsPreview from "../components/InsightsPreview";

const challenges = [
  {
    title: "Short-distance gaps",
    text: "Many local trips are too difficult on foot, yet too small for conventional transport systems.",
  },
  {
    title: "Fragmented daily routes",
    text: "There is still no smooth mobility layer connecting shopping streets, clinics, public facilities, and community hubs.",
  },
  {
    title: "Care and clinic access burden",
    text: "Mobility burdens around clinic visits and accompaniment affect users, families, and caregivers alike.",
  },
];

const approaches = [
  {
    title: "Small-scale",
    text: "We begin at a limited local scale to allow careful consensus building and manageable operations.",
  },
  {
    title: "Safety",
    text: "Rules, inspection, logging, and training are standardized as a preventive safety framework.",
  },
  {
    title: "Verifiability",
    text: "Pilot outcomes are documented in both quantitative and qualitative terms to support next-step decisions.",
  },
];

const serviceLayers = [
  {
    title: "Planning and design support",
    text: "Issue definition, route design, and evaluation framework design",
  },
  {
    title: "Pilot operation support",
    text: "Operational procedure setup, local coordination, and stakeholder collaboration",
  },
  {
    title: "Evaluation and next-stage planning",
    text: "Reporting, improvement proposals, and next-phase planning",
  },
];

const flowSteps = ["Consultation", "Design", "Execution", "Evaluation", "Reporting"];

const partners = [
  {
    title: "Municipalities",
    text: "Alignment with policy goals and public-value requirements",
  },
  {
    title: "Care and welfare facilities",
    text: "Mobility design based on real daily routes of users",
  },
  {
    title: "Medical institutions",
    text: "Planning based on clinic access and time coordination",
  },
  {
    title: "Regional businesses",
    text: "Practical support for sustainable local operation",
  },
];

export default function HomePageEn() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/50 to-transparent" />
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <div className="max-w-4xl rounded-[2.5rem] border border-[#D6C3A3]/40 bg-white/70 p-8 shadow-[0_24px_70px_rgba(59,47,47,0.08)] backdrop-blur md:p-12">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">Fukuoka-Based Local Mobility Pilot</div>
            <h1 className="mt-4 text-4xl font-light leading-tight md:text-6xl">
              Redesigning mobility for an aging society,
              <span className="block text-[#6B5A4A]">starting from Fukuoka.</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisou is a pilot-based initiative focused on local mobility challenges in an aging society.
              Starting in Fukuoka, we use small-scale pilots to verify safety, continuity, and local fit, and to build mobility models
              that can work with municipalities, local institutions, and community facilities.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/en/contact"
                className="rounded-2xl bg-[#3B2F2F] px-6 py-3 text-center text-sm text-white shadow-sm transition hover:opacity-90"
              >
                Contact
              </Link>
              <Link
                href="/en/pilot"
                className="rounded-2xl border border-[#3B2F2F]/20 bg-white/70 px-6 py-3 text-center text-sm transition hover:bg-white"
              >
                View Pilot Program
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#D6C3A3]/30 bg-white/50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="mb-8 max-w-3xl">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">The Challenge</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">Short-distance daily mobility still has an operational gap.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {challenges.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-6 shadow-sm">
                <h3 className="text-xl font-light">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#D6C3A3]/30 bg-[#F8F4EC]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="mb-8 max-w-3xl">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">Our Approach</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">Small-scale, safety-focused, and verifiable</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {approaches.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/70 p-6 shadow-sm">
                <h3 className="text-xl font-light">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#D6C3A3]/30 bg-white/50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="mb-8 max-w-3xl">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">Services</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">Three support layers for different implementation stages</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {serviceLayers.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-6 shadow-sm">
                <h3 className="text-xl font-light">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/en/services"
              className="rounded-2xl border border-[#3B2F2F]/20 bg-white/70 px-6 py-3 text-sm transition hover:bg-white"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[#D6C3A3]/30 bg-[#F8F4EC]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="mb-8 max-w-3xl">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">Pilot Flow</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">Basic pilot program flow (5 steps)</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {flowSteps.map((step, index) => (
              <div key={step} className="rounded-[1.5rem] border border-[#D6C3A3]/35 bg-white/70 p-5 shadow-sm">
                <div className="text-xs tracking-[0.18em] text-[#8A7764]">STEP {index + 1}</div>
                <div className="mt-3 text-xl font-light">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#D6C3A3]/30 bg-white/50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="mb-8 max-w-3xl">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">Partners</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">Working with local stakeholders</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {partners.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-6 shadow-sm">
                <h3 className="text-xl font-light">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/en/partners"
              className="rounded-2xl border border-[#3B2F2F]/20 bg-white/70 px-6 py-3 text-sm transition hover:bg-white"
            >
              View Partnerships
            </Link>
          </div>
        </div>
      </section>

      <InsightsPreview locale="en" />

      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#D6C3A3]/40 bg-white/70 p-8 shadow-[0_20px_60px_rgba(59,47,47,0.06)] backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-light leading-tight">
                We begin with pilot discussions tailored to the conditions and constraints of each region.
              </h2>
            </div>
            <Link
              href="/en/contact"
              className="rounded-2xl bg-[#3B2F2F] px-6 py-3 text-center text-sm text-white shadow-sm transition hover:opacity-90"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
