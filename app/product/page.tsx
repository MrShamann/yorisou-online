import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "使いやすさ",
    text: "初めてでも戸惑いにくい、やさしい体験を大切にした設計です。",
  },
  {
    title: "落ち着いた佇まい",
    text: "暮らしの風景に自然になじむ、やわらかな存在感を目指しています。",
  },
  {
    title: "近距離移動への適性",
    text: "買い物、通院、地域の立ち寄り先など、日常の短い移動を心地よく支えます。",
  },
  {
    title: "寄り添う体験",
    text: "ご本人だけでなく、ご家族や地域の関係者にも安心感が伝わることを重視します。",
  },
];

const scenarios = [
  "近所のスーパーや商店街へのお買い物",
  "診療所や薬局への通院・立ち寄り",
  "公園、交流拠点、地域施設への移動",
  "ご家族が見守りやすい日常のお出かけ",
];

const trustPoints = [
  "日々の暮らしの流れに無理なくなじむことを大切にしています。",
  "見た目の強さより、安心して近づける雰囲気を重視しています。",
  "地域やご家庭の対話の中で、ちょうどよい使い方を見つけていく考え方です。",
];

export default function ProductPage() {
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
                Yorisou · ご案内
            </div>

            <h1 className="text-4xl font-light leading-tight md:text-6xl">
              暮らしの近くで
              <span className="block text-[#6B5A4A]">やさしく寄り添う移動体験</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisouは、日々の移動をもっと穏やかで自然なものにするためのモビリティです。
              大げさな機能訴求ではなく、安心して使えること、周囲と調和すること、
              そして人にやさしいことを大切にしています。
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="rounded-2xl bg-[#3B2F2F] px-6 py-3 text-center text-sm text-white shadow-sm transition hover:opacity-90"
              >
                試乗を相談する
              </Link>
              <Link
                href="/contact"
                className="rounded-2xl border border-[#3B2F2F]/20 bg-white/70 px-6 py-3 text-center text-sm transition hover:bg-white"
              >
                お問い合わせ
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
                      <div className="text-xs tracking-[0.2em] text-[#8A7764]">ご紹介</div>
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
                    移動のためだけの道具ではなく、毎日の行動を少しやわらかくする存在として、
                    Yorisouらしい静かな品のある体験を目指しています。
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
            <h2 className="mt-3 text-3xl font-light leading-tight">Yorisouが大切にしていること</h2>
            <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
              技術の新しさを前面に出すのではなく、毎日の生活に自然に受け入れられることを軸に考えています。
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
            <h2 className="mt-3 text-3xl font-light">日常のこんな場面に</h2>
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
            <h2 className="mt-3 text-3xl font-light">安心感を支える考え方</h2>
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
              <h2 className="mt-3 text-3xl font-light">試乗や導入のご相談はこちらから</h2>
              <p className="mt-4 text-sm leading-7 text-[#5A4B3E] md:text-base">
                ご本人やご家族の試乗相談、地域での活用検討など、目的に応じて丁寧にご案内します。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="rounded-2xl bg-[#3B2F2F] px-6 py-3 text-center text-sm text-white shadow-sm transition hover:opacity-90"
              >
                試乗を相談する
              </Link>
              <Link
                href="/contact"
                className="rounded-2xl border border-[#3B2F2F]/20 bg-white/70 px-6 py-3 text-center text-sm transition hover:bg-white"
              >
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
