import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Easy to Use",
    text: "Designed to feel approachable and gentle, even for a first experience.",
  },
  {
    title: "Calm Presence",
    text: "Its visual character is intended to sit naturally within everyday streets and neighborhoods.",
  },
  {
    title: "Neighborhood Mobility",
    text: "Well suited to short local trips such as errands, clinic visits, and nearby destinations.",
  },
  {
    title: "Supportive Experience",
    text: "Built to give confidence not only to users, but also to families and local supporters.",
  },
];

const scenarios = [
  "Shopping trips to local stores and neighborhood streets",
  "Clinic and pharmacy visits within daily living distance",
  "Short outings to parks, meeting places, and community facilities",
  "Family-supported local movement with greater peace of mind",
];

const trustPoints = [
  "We value how naturally the experience fits into daily routines.",
  "The focus is not on visual intensity, but on a sense of calm reassurance.",
  "Yorisou is meant to be discussed and adopted through conversation with families and communities.",
];

export default function ProductPageEn() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="relative overflow-hidden border-b border-[#D6C3A3]/35">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:px-10 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#D6C3A3]/60 bg-white/60 px-4 py-2 text-sm tracking-wide text-[#6B5A4A] backdrop-blur">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D6C3A3]/40 bg-white/80 shadow-sm">
                <Image
                  src="/images/brand/yorisou-logo-primary-v01.png"
                  alt="Yorisou logo"
                  width={1254}
                  height={1254}
                  className="h-6 w-8 object-cover"
                />
              </span>
                Yorisou · Overview
            </div>

            <h1 className="text-4xl font-light leading-tight md:text-6xl">
              A gentle mobility experience
              <span className="block text-[#6B5A4A]">for everyday life nearby</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisou is a mobility offering designed to make daily movement feel calmer and more natural.
              Rather than speaking in technical terms, it is centered on comfort, trust, and a quiet sense of care.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/en/contact"
                className="rounded-2xl bg-[#3B2F2F] px-6 py-3 text-center text-sm text-white shadow-sm transition hover:opacity-90"
              >
                Request a Test Ride
              </Link>
              <Link
                href="/en/contact"
                className="rounded-2xl border border-[#3B2F2F]/20 bg-white/70 px-6 py-3 text-center text-sm transition hover:bg-white"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 h-40 w-40 rounded-full bg-[#D6C3A3]/25 blur-3xl" />
            <div className="absolute -bottom-8 right-0 h-52 w-52 rounded-full bg-white/55 blur-3xl" />

            <div className="relative rounded-[2rem] border border-[#D6C3A3]/40 bg-white/70 p-5 shadow-[0_20px_60px_rgba(59,47,47,0.08)] backdrop-blur">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-[#F7F4EE] to-[#ECE5D8] p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-[#8A7764]">Overview</div>
                    <div className="mt-2 text-2xl font-light">Yorisou</div>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D6C3A3]/50 bg-white shadow-sm">
                    <Image
                      src="/images/brand/yorisou-logo-primary-v01.png"
                      alt="Yorisou brand mark"
                      width={1254}
                      height={1254}
                      className="h-10 w-12 object-cover"
                    />
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[#D6C3A3]/40 bg-[#FCFAF6] p-5">
                  <p className="text-sm leading-7 text-[#5A4B3E]">
                    Yorisou is intended not simply as a device for movement, but as a quiet presence
                    that softens the rhythm of everyday outings with calm dignity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/30 bg-white/45">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="mb-8 max-w-3xl">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">Why Yorisou</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">What Yorisou values most</h2>
            <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
              The focus is not on novelty for its own sake, but on being naturally accepted within the flow of daily life.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-6 shadow-sm">
                <h3 className="text-xl font-light">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/30 bg-[#F8F4EC]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:px-10 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] border border-[#D6C3A3]/35 bg-white/70 p-6 shadow-sm md:p-8">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">Usage Scenarios</div>
            <h2 className="mt-3 text-3xl font-light">Where it fits into daily life</h2>
            <div className="mt-6 grid gap-4">
              {scenarios.map((item) => (
                <div key={item} className="rounded-2xl border border-[#D6C3A3]/30 bg-[#FCFAF6] p-5">
                  <p className="text-sm leading-7 text-[#5A4B3E]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-6 shadow-sm md:p-8">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">Trust & Safety</div>
            <h2 className="mt-3 text-3xl font-light">The thinking behind reassurance</h2>
            <div className="mt-6 grid gap-4">
              {trustPoints.map((item) => (
                <div key={item} className="rounded-2xl border border-[#D6C3A3]/30 bg-white/80 p-5">
                  <p className="text-sm leading-7 text-[#5A4B3E]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#D6C3A3]/40 bg-white/70 p-8 shadow-[0_20px_60px_rgba(59,47,47,0.06)] backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="text-sm tracking-[0.18em] text-[#8A7764]">Next Step</div>
              <h2 className="mt-3 text-3xl font-light">Talk with us about a ride or local use</h2>
              <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
                We welcome both personal test ride inquiries and broader conversations about community use.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/en/contact"
                className="rounded-2xl bg-[#3B2F2F] px-6 py-3 text-center text-sm text-white shadow-sm transition hover:opacity-90"
              >
                Request a Test Ride
              </Link>
              <Link
                href="/en/contact"
                className="rounded-2xl border border-[#3B2F2F]/20 bg-white/70 px-6 py-3 text-center text-sm transition hover:bg-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
