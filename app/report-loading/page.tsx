"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { buildPublicResultHref } from "../check-in/resultCompatibility";
import { PUBLIC_RESULT_LOADING_LINE } from "../check-in/resultCompatibility";
import { currentStateCheckV1 } from "../check-in/currentStateCheckV1";
import DepthFieldLazy from "../components/depth-field/DepthFieldLazy";
import DepthFieldStatic from "../components/depth-field/DepthFieldStatic";
import { signatureDepthParams, paletteFor } from "../components/depth-field/seed";

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

  // AIX-2 — the visitor's Depth Signature coalesces while the result is
  // prepared (deterministic from public-safe IDs; decorative only — the
  // steps, progress, and fallback link below carry the actual state).
  const fieldParams = useMemo(
    () => signatureDepthParams({ resultId, overlayId, confidenceBand: confidence }, 200),
    [confidence, overlayId, resultId],
  );
  const fieldPalette = useMemo(
    () => paletteFor({ resultId, overlayId, confidenceBand: confidence }),
    [confidence, overlayId, resultId],
  );
  const fieldFormation = 0.25 + ((activeStep + 1) / LOADING_STEPS.length) * 0.75;

  return (
    <main className="aix2 relative min-h-screen">
      <div className="depth-scene !fixed" aria-hidden="true">
        <DepthFieldStatic params={fieldParams} palette={fieldPalette} formation={0.6} className="depth-layer" />
        <DepthFieldLazy params={fieldParams} palette={fieldPalette} formation={fieldFormation} className="depth-layer" />
        <div className="depth-veil" />
      </div>
      <section className="container relative z-[1] flex min-h-screen items-center py-8 md:py-12">
        <div className="mx-auto w-full max-w-[34rem] space-y-5">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[var(--hair-2)] bg-[rgba(126,224,182,0.08)] px-3 py-1 text-[11px] font-semibold text-[color:var(--jade-bright)]">結果の準備中</span>
            <span className="rounded-full border border-[var(--hair-2)] bg-[rgba(126,224,182,0.08)] px-3 py-1 text-[11px] font-semibold text-[color:var(--jade-bright)]">3〜5秒ほど</span>
          </div>

          <div className="aix2-glass space-y-5 p-5 sm:p-6">
            <div className="space-y-3">
              <p className="aix2-eyebrow">いま色テスト by よりそう</p>
              <h1 className="aix2-serif text-[2.1rem] font-semibold leading-[1.16] text-[color:var(--tx)] md:text-[2.7rem]">結果を整理しています</h1>
              <p className="text-[14px] leading-7 aix2-mut">{PUBLIC_RESULT_LOADING_LINE}</p>
            </div>

            <div className="space-y-3" aria-live="polite">
              {LOADING_STEPS.map((step, index) => {
                const isActive = index === activeStep;
                const isDone = index < activeStep;
                return (
                  <div
                    key={step}
                    className={`flex items-center gap-3 rounded-[12px] border px-4 py-3 transition ${
                      isActive ? "border-[var(--hair-2)] bg-[rgba(47,197,150,0.1)]" : "border-[var(--hair)] bg-[rgba(26,32,29,0.4)]"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[12px] ${
                        isDone
                          ? "border-[color:var(--jade)] bg-[color:var(--jade)] text-[color:var(--jade-ink)]"
                          : isActive
                            ? "border-[color:var(--jade-bright)] text-[color:var(--jade-bright)]"
                            : "border-[var(--hair-2)] aix2-faint"
                      }`}
                    >
                      {isDone ? "✓" : index + 1}
                    </span>
                    <span className={`text-[14px] leading-7 ${isActive || isDone ? "text-[color:var(--tx)]" : "aix2-mut"}`}>{step}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              <div className="aix2-progress-track !h-2">
                <div className="aix2-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[12px] leading-6 aix2-mut">まもなく結果が表示されます。</p>
            </div>

            <div className="rounded-[12px] border border-[var(--hair)] bg-[rgba(26,32,29,0.4)] px-4 py-3">
              <p className="text-[13px] leading-6 aix2-mut">
                結果の表示に少し時間がかかっています。進まない場合は、下のボタンから結果を開いてください。
              </p>
              <a href={resultHref} className="aix2-btn aix2-btn-primary mt-3 w-full">
                結果ページを開く
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
