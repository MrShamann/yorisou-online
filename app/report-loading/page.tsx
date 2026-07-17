"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { buildPublicResultHref } from "../check-in/resultCompatibility";
import { PUBLIC_RESULT_LOADING_LINE } from "../check-in/resultCompatibility";
import { MvpCard, MvpPill } from "../components/MvpSurface";
import { currentStateCheckV1 } from "../check-in/currentStateCheckV1";
import StateFieldCanvasLazy from "../components/state-field/StateFieldCanvasLazy";
import StateFieldStatic from "../components/state-field/StateFieldStatic";
import { signatureParams } from "../components/state-field/seed";

const LOADING_STEPS = [
  "今の状態を整理中",
  "人との距離感を確認中",
  "仕事・学び方のリズムを整理中",
  "次のヒントを準備中",
] as const;

const STEP_DURATION_MS = 900;
const REDIRECT_DELAY_MS = 3900;
const HARD_REDIRECT_DELAY_MS = 4400;

export default function ReportLoadingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultId = searchParams.get("resultId") || currentStateCheckV1.scoring.fallbackResultId;
  const overlayId = searchParams.get("overlayId") || "balancing";
  const confidence = searchParams.get("confidence") === "medium" ? "medium" : "low";
  const payloadKey = searchParams.get("payloadKey") || "";
  const [activeStep, setActiveStep] = useState(0);
  const resultHref = useMemo(
    () =>
      buildPublicResultHref("/result", {
        resultId,
        overlayId,
        confidenceBand: confidence,
        payloadKey,
      }),
    [confidence, overlayId, payloadKey, resultId],
  );

  const progress = useMemo(() => ((activeStep + 1) / LOADING_STEPS.length) * 100, [activeStep]);

  useEffect(() => {
    const stepTimer = window.setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, LOADING_STEPS.length - 1));
    }, STEP_DURATION_MS);

    const redirectTimer = window.setTimeout(() => {
      router.replace(resultHref);
    }, REDIRECT_DELAY_MS);

    window.setTimeout(() => {
      if (window.location.pathname !== "/result") {
        window.location.replace(resultHref);
      }
    }, HARD_REDIRECT_DELAY_MS);

    return () => {
      window.clearInterval(stepTimer);
      window.clearTimeout(redirectTimer);
    };
  }, [resultHref, router]);

  // AIX-1 — the visitor's State Signature coalesces while the result is
  // prepared (deterministic from public-safe IDs; decorative only — the
  // steps, progress, and fallback link below carry the actual state).
  const fieldParams = useMemo(
    () => signatureParams({ resultId, overlayId, confidenceBand: confidence }, 48),
    [confidence, overlayId, resultId],
  );
  const fieldFormation = 0.25 + ((activeStep + 1) / LOADING_STEPS.length) * 0.75;

  return (
    <main className="relative min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.99),_rgba(247,244,238,0.98)_42%,_rgba(240,244,236,0.98)_100%)] text-[var(--text)]">
      <div className="state-field-scene !fixed" aria-hidden="true">
        {/* AIX-1A: static frame first (SSR/no-JS/reduced-motion/canvas-
            unavailable); fades out via data-canvas-active once the canvas
            takes over, so density never doubles. */}
        <StateFieldStatic params={fieldParams} formation={0.6} className="state-field-layer" />
        <StateFieldCanvasLazy params={fieldParams} formation={fieldFormation} className="state-field-layer" />
        <div className="state-field-veil" />
      </div>
      <section className="container relative z-[1] flex min-h-screen items-center py-8 md:py-12">
        <div className="mx-auto w-full max-w-[34rem] space-y-5">
          <div className="flex flex-wrap gap-2">
            <MvpPill>結果の準備中</MvpPill>
            <MvpPill>3〜5秒ほど</MvpPill>
          </div>

          <MvpCard className="space-y-5 p-5 sm:p-6">
            <div className="space-y-3">
              <p className="service-kicker">いま色テスト by よりそう</p>
              <h1 className="display-serif text-[2.1rem] leading-[1.16] md:text-[2.8rem]">結果を整理しています</h1>
              <p className="text-[14px] leading-7 text-[var(--muted)]">
                {PUBLIC_RESULT_LOADING_LINE}
              </p>
            </div>

            <div className="space-y-3" aria-live="polite">
              {LOADING_STEPS.map((step, index) => {
                const isActive = index === activeStep;
                const isDone = index < activeStep;

                return (
                  <div
                    key={step}
                    className={`flex items-center gap-3 rounded-[1rem] border px-4 py-3 transition ${
                      isActive
                        ? "border-[rgba(184,198,177,0.96)] bg-[rgba(225,232,219,0.72)]"
                        : "border-[color:var(--line-soft)] bg-white/84"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[12px] ${
                        isDone
                          ? "border-[var(--accent-sage-text)] bg-[var(--accent-sage-text)] text-white"
                          : isActive
                            ? "border-[var(--accent-sage-text)] bg-white text-[var(--accent-sage-text)]"
                            : "border-[rgba(201,211,195,0.78)] bg-white text-[var(--muted)]"
                      }`}
                    >
                      {isDone ? "✓" : index + 1}
                    </span>
                    <span className="text-[14px] leading-7 text-[var(--text)]">{step}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              <div className="h-2 rounded-full bg-[rgba(201,211,195,0.34)]">
                <div
                  className="h-full rounded-full bg-[var(--accent-sage-text)] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[12px] leading-6 text-[var(--muted)]">
                まもなく結果が表示されます。
              </p>
            </div>

            <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-white/84 px-4 py-3">
              <p className="text-[13px] leading-6 text-[var(--muted)]">
                結果の表示に少し時間がかかっています。進まない場合は、下のボタンから結果を開いてください。
              </p>
              <a
                href={resultHref}
                className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#173B35] px-4 py-3 text-[15px] font-extrabold text-white"
              >
                結果ページを開く
              </a>
            </div>
          </MvpCard>
        </div>
      </section>
    </main>
  );
}
