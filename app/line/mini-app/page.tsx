import type { Metadata } from "next";
import Link from "next/link";

import BrandSigil from "@/app/components/BrandSigil";
import { buildMiniAppCheckInHandoffHref } from "@/lib/server/miniAppEntryRouting";

export const metadata: Metadata = {
  title: "今の寄り添い方を見つける | Yorisou",
  description: "YorisouのLINE Mini Appで、今の気分に合う寄り添い方を見つける入口です。",
};

const landingCopy = {
  title: "今の寄り添い方を、LINEで見つける。",
  body: "短い質問にひとつずつ答えるだけ。33問の流れの先で、今の気分に合う寄り添い方と、共有しやすい結果が返ってきます。",
  duration: "約5分",
  benefitOne: "LINE内で完結",
  benefitTwo: "1問ずつ進む",
  benefitThree: "結果は共有しやすい",
  start: "はじめる",
  resultLabel: "結果イメージ",
  resultBody: "最後まで進むと、こんな雰囲気で結果が開きます。",
  resultNote: "共有しやすい",
  startNote: "Q1からそのまま始まります。",
} as const;

function getStartHref(searchParams?: Record<string, string | string[] | undefined>) {
  return buildMiniAppCheckInHandoffHref({ locale: "ja", searchParams: searchParams || {} });
}

export default function MiniAppEntryPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const startHref = getStartHref(searchParams);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(9,14,13,0.98)_0%,rgba(20,32,28,0.97)_34%,rgba(243,246,239,1)_100%)] px-4 py-4 text-[var(--text)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_28%,rgba(223,233,227,0.16)_100%)]" />
      <div className="mx-auto flex min-h-[calc(100svh-2rem)] max-w-md items-center">
        <section className="relative w-full overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,15,0.98)_0%,rgba(21,32,28,0.98)_54%,rgba(241,245,238,0.99)_100%)] shadow-[0_28px_60px_rgba(10,16,14,0.18)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(157,184,170,0.18)_0%,rgba(255,255,255,0.9)_50%,rgba(157,184,170,0.18)_100%)]" />

          <div className="relative px-4 pt-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <BrandSigil label="YORISOU" className="shrink-0" />
              <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[11px] tracking-[0.14em] text-white/84">
                LINE MINI App
              </span>
            </div>

            <div className="mt-4 rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.04)_100%)] px-4 py-4 shadow-[0_16px_30px_rgba(5,10,9,0.12)]">
              <div className="inline-flex rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[10px] tracking-[0.22em] text-white/82">
                YORISOU / LINE
              </div>
              <h1 className="display-serif mt-4 text-[2.45rem] leading-[0.96] tracking-[-0.06em] text-white">
                {landingCopy.title}
              </h1>
              <p className="mt-3 text-[14px] leading-7 text-white/74">
                {landingCopy.body}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  landingCopy.duration,
                  landingCopy.benefitOne,
                  landingCopy.benefitTwo,
                  landingCopy.benefitThree,
                ].map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[11px] leading-5 text-white/88"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <Link
                href={startHref}
                className="mt-5 inline-flex min-h-[54px] w-full items-center justify-center rounded-[1rem] border border-white/12 bg-[linear-gradient(180deg,rgba(26,39,34,1)_0%,rgba(11,16,15,1)_100%)] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_16px_30px_rgba(5,10,9,0.28)] ring-1 ring-[rgba(157,184,170,0.18)]"
              >
                {landingCopy.start}
              </Link>
              <p className="mt-2 text-[11px] leading-5 text-white/68">{landingCopy.startNote}</p>
              <p className="mt-3 text-[11px] leading-5 text-white/56">{landingCopy.duration} / 5択 / 33問</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
