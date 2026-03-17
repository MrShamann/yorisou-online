import Image from "next/image";
import ContactForm from "../../components/ContactForm";

const inquiryCards = [
  {
    title: "Experience Inquiry",
    text: "We welcome calm first conversations for personal review, family consultation, and introductory experience requests.",
  },
  {
    title: "Partnership / Pilot Inquiry",
    text: "Municipalities, local groups, care facilities, and partners can contact us about pilot collaboration.",
  },
  {
    title: "General Contact",
    text: "You are welcome to reach out with broader questions about Yorisou and our future direction.",
  },
];

const trustPoints = [
  "We aim to be easy to talk to, even for a first conversation.",
  "Our approach stays grounded in local community life and practical use.",
  "We value clear, respectful communication for older adults and family members.",
];

export default function ContactPageEn() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="relative overflow-hidden border-b border-[#D6C3A3]/35">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:px-10 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#D6C3A3]/60 bg-white/60 px-4 py-2 text-sm tracking-wide text-[#6B5A4A] backdrop-blur">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D6C3A3]/40 bg-white/80 shadow-sm">
                <Image
                  src="/images/brand/tsuru-logo.png"
                  alt="Yorisou logo"
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
              </span>
              Yorisou · Contact
            </div>

            <h1 className="text-4xl font-light leading-tight md:text-6xl">
              A calm place to
              <span className="block text-[#6B5A4A]">ask, try, and connect</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisou aims to be approachable for individuals, families, and local partners alike.
              From introductory experience requests to community discussions, we value a calm and thoughtful conversation.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 h-40 w-40 rounded-full bg-[#D6C3A3]/25 blur-3xl" />
            <div className="absolute -bottom-8 right-0 h-52 w-52 rounded-full bg-white/55 blur-3xl" />

            <div className="relative rounded-[2rem] border border-[#D6C3A3]/40 bg-white/70 p-5 shadow-[0_20px_60px_rgba(59,47,47,0.08)] backdrop-blur">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-[#F7F4EE] to-[#ECE5D8] p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[#8A7764]">Contact</div>
                    <div className="mt-2 text-2xl font-light">Yorisou</div>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D6C3A3]/50 bg-white shadow-sm">
                    <Image
                      src="/images/brand/tsuru-logo.png"
                      alt="Yorisou brand mark"
                      width={40}
                      height={40}
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[#D6C3A3]/40 bg-[#FCFAF6] p-5">
                  <p className="text-sm leading-7 text-[#5A4B3E]">
                    Your inquiry does not need to be fully defined. You can start by sharing what
                    you would like to try, what you are considering, or what you are observing in your community.
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
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">How We Can Help</div>
            <h2 className="mt-3 text-3xl font-light leading-tight">Ways to contact Yorisou</h2>
            <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
              We welcome everything from personal ride interest to local pilot and partnership discussions.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {inquiryCards.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-6 shadow-sm">
                <h3 className="text-xl font-light">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-[#D6C3A3]/40 bg-white/70 p-6 shadow-[0_20px_60px_rgba(59,47,47,0.06)] backdrop-blur md:p-8">
            <div className="mb-6">
              <div className="text-sm tracking-[0.18em] text-[#8A7764]">Form</div>
              <h2 className="mt-3 text-3xl font-light">Contact Form</h2>
              <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
                Please choose the closest inquiry type and share a few details. We will respond in due course.
              </p>
            </div>
            <ContactForm locale="en" />
          </div>

          <div className="rounded-[2rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-6 shadow-sm md:p-8">
            <div className="text-sm tracking-[0.18em] text-[#8A7764]">Trust</div>
            <h2 className="mt-3 text-3xl font-light">A welcoming point of contact</h2>
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
    </main>
  );
}
