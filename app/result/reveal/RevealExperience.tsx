"use client";
// Package 9 — staged reveal orchestrator. PROGRESSIVE ENHANCEMENT ONLY:
// the server renders every section fully; this component stages their
// entrance and provides a skip control. With JS disabled, reduced motion,
// or low power (?power=low) everything is simply visible. No content is
// gated behind animation; no forced pacing; fully interruptible.
import { ReactNode, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

function lowPower(): boolean {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).get("power") === "low") return true;
  const nav = navigator as Navigator & { deviceMemory?: number };
  return nav.deviceMemory !== undefined && nav.deviceMemory <= 4;
}

export default function RevealExperience({ stages }: { stages: ReactNode[] }) {
  const reduced = useReducedMotion();
  const [instant, setInstant] = useState(true); // SSR + first paint: everything visible
  const [skipped, setSkipped] = useState(false);
  const [visibleCount, setVisibleCount] = useState(stages.length);

  useEffect(() => {
    // Enable staging only when it is safe and wanted.
    if (reduced || lowPower()) return;
    setInstant(false);
    setVisibleCount(1);
    let i = 1;
    const timer = setInterval(() => {
      i += 1;
      setVisibleCount(v => Math.min(stages.length, Math.max(v, i)));
      if (i >= stages.length) clearInterval(timer);
    }, 900);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const showAll = instant || skipped;

  return (
    <div>
      {!showAll && visibleCount < stages.length && (
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={() => setSkipped(true)}
            className="min-h-[44px] rounded-full border border-[rgba(23,59,53,0.2)] bg-white/80 px-4 text-[12.5px] font-semibold text-[#49615B]"
          >
            すべて表示
          </button>
        </div>
      )}
      <div className="grid gap-5">
        {stages.map((stage, i) => {
          const visible = showAll || i < visibleCount;
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 10 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={visible ? undefined : { pointerEvents: "none" }}
              aria-hidden={visible ? undefined : true}
              // inert keeps links/buttons in unrevealed stages out of tab
              // order while they are aria-hidden (axe: aria-hidden-focus)
              inert={visible ? undefined : true}
            >
              {stage}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
