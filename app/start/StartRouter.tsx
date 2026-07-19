"use client";

import Link from "next/link";
import { useState } from "react";

import {
  hasGuestJourney,
  recordNeed,
  recordRoute,
  type GuestNeedId,
  type GuestPace,
} from "@/lib/sr1/guestJourney";
import { routeService, SERVICE_NEEDS, type ServiceDestination } from "@/lib/sr1/serviceRouter";
import { useGuestJourney } from "@/lib/sr1/useGuestJourney";

// Small, honest chips — exact tokens from the dark product surface.
const CHIP =
  "rounded-full border border-[var(--hair-2)] bg-[rgba(126,224,182,0.07)] px-3 py-1.5 text-[11px] text-[color:var(--jade-bright)]";
// Guaranteed-visible focus ring for the custom option cards/links (the pill
// buttons carry their own focus style via aix2-btn). Purely a focus affordance —
// no motion is required to operate this surface.
const FOCUS =
  "focus-visible:[outline:2px_solid_var(--jade-bright)] focus-visible:[outline-offset:3px]";

type Step = "need" | "pace" | "result";

export default function StartRouter() {
  const [step, setStep] = useState<Step>("need");
  const [need, setNeed] = useState<GuestNeedId | null>(null);
  const [pace, setPace] = useState<GuestPace | null>(null);
  // Captured once, lazily, on the client's first render — BEFORE we record
  // anything this session — so recording a need does not make a first-time
  // visitor look like a returning one. Server + first paint compute false; the
  // returning-only UI only ever renders after a client interaction, so there is
  // no hydration mismatch.
  const [returning] = useState(() => (typeof window !== "undefined" ? hasGuestJourney() : false));

  const journey = useGuestJourney();

  function chooseNeed(id: GuestNeedId) {
    recordNeed(id);
    setNeed(id);
    setPace(null);
    setStep("pace");
  }

  function choosePace(next: GuestPace) {
    if (!need) return;
    recordNeed(need, next);
    setPace(next);
    setStep("result");
  }

  function continuePrevious() {
    recordNeed("continue-previous");
    setNeed("continue-previous");
    setPace(null);
    setStep("result");
  }

  function restart() {
    setNeed(null);
    setPace(null);
    setStep("need");
  }

  const chosenNeed = SERVICE_NEEDS.find((n) => n.id === need);

  return (
    <main className="aix2">
      <div className="container py-10 md:py-16">
        <div className="mx-auto max-w-[46rem]">
          {step === "need" ? (
            <section aria-labelledby="start-need-heading">
              <p className="aix2-eyebrow">はじめる · YORISOU</p>
              <h1 id="start-need-heading" className="aix2-serif mt-4 text-[1.75rem] font-bold leading-tight text-[color:var(--tx)] md:text-[2rem]">
                今、どうしたいですか？
              </h1>
              <p className="mt-4 text-[14px] leading-8 aix2-mut">
                ふだんの言葉で選んでください。テストの名前ではなく、今の必要から始めます。無料・ログインなしで、この端末だけで進められます。
              </p>

              <ul className="mt-8 grid gap-3">
                {SERVICE_NEEDS.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => chooseNeed(n.id)}
                      className={`aix2-panel ${FOCUS} flex w-full min-h-[64px] flex-col items-start gap-1 p-5 text-left transition-[border-color,transform] duration-200 hover:-translate-y-[1px] hover:border-[var(--hair-2)]`}
                    >
                      <span className="text-[15px] font-bold leading-6 text-[color:var(--tx)]">{n.label}</span>
                      <span className="text-[13px] leading-6 aix2-mut">{n.helper}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {step === "pace" && chosenNeed ? (
            <section aria-labelledby="start-pace-heading">
              <p className="aix2-eyebrow">選んだこと · {chosenNeed.label}</p>
              <h1 id="start-pace-heading" className="aix2-serif mt-4 text-[1.6rem] font-bold leading-tight text-[color:var(--tx)] md:text-[1.85rem]">
                どのくらい、見てみますか？
              </h1>
              <p className="mt-4 text-[14px] leading-8 aix2-mut">あとで変えられます。まずは無理のない進み方で。</p>

              <div className="mt-8 grid gap-3">
                <button
                  type="button"
                  onClick={() => choosePace("quick")}
                  className={`aix2-panel ${FOCUS} flex w-full min-h-[64px] flex-col items-start gap-1 p-5 text-left transition-[border-color,transform] duration-200 hover:-translate-y-[1px] hover:border-[var(--hair-2)]`}
                >
                  <span className="text-[15px] font-bold leading-6 text-[color:var(--tx)]">まず軽く（数分）</span>
                  <span className="text-[13px] leading-6 aix2-mut">短い一歩から始める</span>
                </button>
                <button
                  type="button"
                  onClick={() => choosePace("deep")}
                  className={`aix2-panel ${FOCUS} flex w-full min-h-[64px] flex-col items-start gap-1 p-5 text-left transition-[border-color,transform] duration-200 hover:-translate-y-[1px] hover:border-[var(--hair-2)]`}
                >
                  <span className="text-[15px] font-bold leading-6 text-[color:var(--tx)]">しっかり見たい</span>
                  <span className="text-[13px] leading-6 aix2-mut">腰を据えて、今の状態をひととおり</span>
                </button>
              </div>

              {returning ? (
                <div className="mt-6 border-t border-[var(--hair)] pt-6">
                  <button type="button" onClick={continuePrevious} className="aix2-btn aix2-btn-ghost !min-h-[46px] !text-[14px]">
                    前回の続きから
                  </button>
                  <p className="mt-2 text-[12px] aix2-faint">この端末に保存された範囲から続けます。</p>
                </div>
              ) : null}

              <div className="mt-8">
                <button type="button" onClick={restart} className="aix2-link">
                  ← 選び直す
                </button>
              </div>
            </section>
          ) : null}

          {step === "result" && need ? (
            <ResultView
              need={need}
              pace={pace}
              returning={returning}
              hasResult={Boolean(journey.lastResult)}
              onRestart={restart}
            />
          ) : null}
        </div>
      </div>
    </main>
  );
}

function DestinationBadges({ destination }: { destination: ServiceDestination }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {destination.dataStaysOnDevice ? <span className={CHIP}>この端末だけ</span> : null}
      {destination.loginOptional ? <span className={CHIP}>ログイン不要</span> : null}
      {destination.status === "prototype" ? <span className={CHIP}>プロトタイプ</span> : null}
    </div>
  );
}

function ResultView({
  need,
  pace,
  returning,
  hasResult,
  onRestart,
}: {
  need: GuestNeedId;
  pace: GuestPace | null;
  returning: boolean;
  hasResult: boolean;
  onRestart: () => void;
}) {
  const route = routeService({
    need,
    pace: pace ?? undefined,
    returning,
    hasResult,
  });
  const { primary, alternatives, note } = route;

  return (
    <section aria-labelledby="start-result-heading">
      <p className="aix2-eyebrow">あなたへの入口</p>
      <h1 id="start-result-heading" className="sr-only">
        おすすめの入口
      </h1>

      {/* Primary destination — the prominent card */}
      <div className="aix2-glass mt-4 p-6 md:p-8">
        <DestinationBadges destination={primary} />
        <h2 className="aix2-serif mt-4 text-[1.5rem] font-bold leading-tight text-[color:var(--tx)] md:text-[1.7rem]">
          {primary.title}
        </h2>
        <p className="mt-3 text-[14px] leading-8 aix2-mut">{primary.why}</p>

        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="aix2-eyebrow">所要時間</dt>
            <dd className="mt-1.5 text-[14px] font-semibold text-[color:var(--tx)]">{primary.estimatedTime}</dd>
          </div>
          <div>
            <dt className="aix2-eyebrow">受け取るもの</dt>
            <dd className="mt-1.5 text-[13.5px] leading-7 aix2-mut">{primary.receive}</dd>
          </div>
        </dl>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link href={primary.href} onClick={() => recordRoute(primary.href)} className="aix2-btn aix2-btn-primary">
            この入口へ進む
          </Link>
          <button type="button" onClick={onRestart} className="aix2-link">
            選び直す
          </button>
        </div>
      </div>

      {/* Alternatives — smaller secondary cards */}
      {alternatives.length > 0 ? (
        <div className="mt-8">
          <p className="aix2-eyebrow">ほかの入口</p>
          <ul className="mt-4 grid gap-3">
            {alternatives.map((alt) => (
              <li key={alt.id}>
                <Link
                  href={alt.href}
                  onClick={() => recordRoute(alt.href)}
                  className={`aix2-panel ${FOCUS} block p-5 transition-[border-color,transform] duration-200 hover:-translate-y-[1px] hover:border-[var(--hair-2)]`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="text-[15px] font-bold leading-6 text-[color:var(--tx)]">{alt.title}</span>
                    <span className="text-[12px] aix2-faint">{alt.estimatedTime}</span>
                  </div>
                  <p className="mt-2 text-[13px] leading-7 aix2-mut">{alt.why}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                    <DestinationBadges destination={alt} />
                    <span className="text-[13px] font-semibold text-[color:var(--jade-bright)]">開く →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* One honest line about the route */}
      <p className="mt-6 text-[12.5px] leading-7 aix2-faint">{note}</p>
    </section>
  );
}
