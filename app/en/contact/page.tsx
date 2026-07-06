import Image from "next/image";
import ContactForm from "../../components/ContactForm";

const inquiryCards = [
  {
    title: "Check Experience",
    text: "Questions about the quick check, your results, or how to use Yorisou are always welcome.",
  },
  {
    title: "About Yorisou",
    text: "Reach out with broader questions about Yorisou, how the service works, or what might suit your situation.",
  },
  {
    title: "General Contact",
    text: "Not sure which category fits? That's fine — just send us a message and we'll respond in kind.",
  },
];

const trustPoints = [
  "We aim to be easy to talk to, even for a first conversation.",
  "Our approach stays grounded in local community life and practical use.",
  "We value clear, respectful communication across different roles and contexts.",
];

export default function ContactPageEn() {
  return (
    <main className="frontstage-page">
      <section className="relative overflow-hidden border-b border-[#D6C3A3]/35">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#D6C3A3]/60 bg-white/60 px-4 py-2 text-sm text-[#6B5A4A] backdrop-blur">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D6C3A3]/40 bg-white/80 shadow-sm">
                <Image
                  src="/images/brand/yorisou-logo-primary-v01.png"
                  alt="Yorisou logo"
                  width={1254}
                  height={1254}
                  className="h-6 w-8 object-cover"
                />
              </span>
              Yorisou · Contact
            </div>

            <h1 className="display-serif text-4xl leading-tight md:text-6xl">
              A calm place to
              <span className="block text-[#6B5A4A]">ask, try, and connect</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisou aims to be approachable for individuals, teams, and local partners alike.
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
            <div className="text-sm text-[#8A7764]">How We Can Help</div>
            <h2 className="mt-3 display-serif text-3xl leading-tight">Ways to contact Yorisou</h2>
            <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
              Whether it is about the check experience or Yorisou in general, we are here.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {inquiryCards.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-6 shadow-sm">
                <h3 className="text-xl font-semibold">{item.title}</h3>
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
              <div className="text-sm text-[#8A7764]">Form</div>
              <h2 className="mt-3 display-serif text-3xl">Contact Form</h2>
              <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
                Please choose the closest inquiry type and share a few details. We will respond in due course.
              </p>
              <p className="mt-3 text-sm leading-7 text-[#6B5A4A]">
                Please use the contact form and we will get back to you as soon as possible.
              </p>
            </div>
            <ContactForm locale="en" />
          </div>

          <div className="rounded-[2rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-6 shadow-sm md:p-8">
            <div className="text-sm text-[#8A7764]">Trust</div>
            <h2 className="mt-3 display-serif text-3xl">A welcoming point of contact</h2>
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
