import Image from "next/image";

export default function HomePageEn() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
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
                Yorisou · Companion Mobility
              </div>

              <h1 className="text-4xl font-light leading-tight md:text-6xl">
                Mobility that
                <span className="block text-[#6B5A4A]">stays by your side</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-[#5A4B3E] md:text-lg">
                Yorisou is a warm, trustworthy mobility brand designed for everyday life in Japan.
                Built around companionship, simplicity, and peace of mind, it supports movement
                through neighborhoods, shopping streets, clinics, and community spaces with ease.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="/en/contact"
                  className="rounded-2xl bg-[#3B2F2F] px-6 py-3 text-center text-sm text-white shadow-sm transition hover:opacity-90"
                >
                  Contact Us
                </a>
                <a
                  href="/en/about"
                  className="rounded-2xl border border-[#3B2F2F]/20 bg-white/70 px-6 py-3 text-center text-sm transition hover:bg-white"
                >
                  Learn More
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { title: "Comfort", text: "Gentle mobility for daily errands and short neighborhood trips." },
                  { title: "Companionship", text: "A brand shaped around care, dignity, and human connection." },
                  { title: "Clarity", text: "Easy to understand, easy to use, and easy to trust." },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-[#D6C3A3]/40 bg-white/70 p-4 shadow-sm">
                    <div className="text-sm font-medium tracking-wide text-[#6B5A4A]">{item.title}</div>
                    <p className="mt-2 text-sm leading-6 text-[#5A4B3E]">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 top-10 h-48 w-48 rounded-full bg-[#D6C3A3]/30 blur-3xl" />
              <div className="absolute -bottom-8 right-0 h-56 w-56 rounded-full bg-white/50 blur-3xl" />

              <div className="relative rounded-[2rem] border border-[#D6C3A3]/40 bg-white/70 p-5 shadow-[0_20px_60px_rgba(59,47,47,0.08)] backdrop-blur">
                <div className="rounded-[1.5rem] bg-gradient-to-br from-[#F7F4EE] to-[#ECE5D8] p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-[#8A7764]">Brand Concept</div>
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

                  <div className="rounded-[1.5rem] border border-[#D6C3A3]/40 bg-[#F5F1E8] p-4">
                    <div className="aspect-[4/3] rounded-[1.25rem] border border-dashed border-[#C8B69E] bg-white/80 p-6">
                      <div className="flex h-full flex-col justify-between">
                        <div className="max-w-sm">
                          <div className="text-sm tracking-[0.18em] text-[#8A7764]">Visual Direction</div>
                          <h2 className="mt-3 text-2xl font-light leading-snug">
                            Crane × Ginkgo
                          </h2>
                          <p className="mt-3 text-sm leading-6 text-[#5A4B3E]">
                            A calm identity shaped by Japanese symbolism: the crane for grace and
                            longevity, and the ginkgo for resilience, memory, and civic warmth.
                          </p>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                          {[
                            { label: "Deep Brown", hex: "#3B2F2F" },
                            { label: "Warm Ivory", hex: "#F5F1E8" },
                            { label: "Soft Gold", hex: "#D6C3A3" },
                          ].map((color) => (
                            <div key={color.hex} className="rounded-2xl border border-[#D6C3A3]/30 bg-white p-3">
                              <div className="h-14 rounded-xl border border-black/5" style={{ backgroundColor: color.hex }} />
                              <div className="mt-2 text-xs text-[#6B5A4A]">{color.label}</div>
                              <div className="mt-1 text-[11px] text-[#8A7764]">{color.hex}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#D6C3A3]/30 bg-white/50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "For neighborhoods",
                text: "Designed for short-distance, low-stress daily movement in real community settings.",
              },
              {
                title: "For older adults",
                text: "A calm and respectful service experience that values confidence over complexity.",
              },
              {
                title: "For cities and partners",
                text: "A warm civic-facing identity suited to pilots, public collaboration, and trust-building.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-6 shadow-sm">
                <h3 className="text-xl font-light">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
