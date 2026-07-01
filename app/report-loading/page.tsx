"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { MvpCard, MvpPill } from "../components/MvpSurface";
import { currentStateCheckV1 } from "../check-in/currentStateCheckV1";

const LOADING_STEPS = [
  "今の状態を整理中",
  "人との距離感を確認中",
  "仕事・学び方のリズムを整理中",
  "次のヒントを準備中",
] as const;

const STEP_DURATION_MS = 900;
const REDIRECT_DELAY_MS = 3900;

export default function ReportLoadingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultId = searchParams.get("resultId") || currentStateCheckV1.scoring.fallbackResultId;
  const overlayId = searchParams.get("overlayId") || "balancing";
  const confidence = searchParams.get("confidence") === "medium" ? "medium" : "low";
  const payloadKey = searchParams.get("payloadKey") || "";
  const [activeStep, setActiveStep] = useState(0);

  const progress = useMemo(() => ((activeStep + 1) / LOADING_STEPS.length) * 100, [activeStep]);

  useEffect(() => {
    const stepTimer = window.setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, LOADING_STEPS.length - 1));
    }, STEP_DURATION_MS);

    const redirectTimer = window.setTimeout(() => {
      const query = new URLSearchParams({
        resultId,
        overlayId,
        confidence,
      });

      if (payloadKey) {
        query.set("payloadKey", payloadKey);
      }

      router.replace(`/result?${query.toString()}`);
    }, REDIRECT_DELAY_MS);

    return () => {
      window.clearInterval(stepTimer);
      window.clearTimeout(redirectTimer);
    };
  }, [confidence, overlayId, payloadKey, resultId, router]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.99),_rgba(247,244,238,0.98)_42%,_rgba(240,244,236,0.98)_100%)] text-[var(--text)]">
      <section className="container flex min-h-screen items-center py-8 md:py-12">
        <div className="mx-auto w-full max-w-[34rem] space-y-5">
          <div className="flex flex-wrap gap-2">
            <MvpPill>結果の準備中</MvpPill>
            <MvpPill>3〜5秒ほど</MvpPill>
          </div>

          <MvpCard className="space-y-5 p-5 sm:p-6">
            <div className="space-y-3">
              <p className="service-kicker">120問の結果を整理しています</p>
              <h1 className="display-serif text-[2.1rem] leading-[1.16] md:text-[2.8rem]">結果を整理しています</h1>
              <p className="text-[14px] leading-7 text-[var(--muted)]">
                今の回答を静かにまとめています。少し待つと、120問の結果プレースホルダーが表示されます。
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
          </MvpCard>
        </div>
      </section>
    </main>
  );
}
