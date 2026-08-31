"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./guided-explainer.module.css";

/**
 * CORP-v1.2R2.1 — "Yorisou in 30 seconds", as a guided explainer.
 *
 * R2 pointed the CTA at a section containing the hero field plus eight static stage cards. That was
 * truthful but it was not an introduction: a reader scrolled past cards instead of being walked
 * through an argument. This walks them through it — seven beats, ~4.6s each, ~32s in total.
 *
 * The defining property is that each beat CHANGES THE SAME FIELD rather than replacing it. The
 * nodes, lines and jade state are the vocabulary already established by FoundryField, so the
 * explainer is the same system explaining itself more slowly, not a second visual language.
 *
 * Deliberate limits, all from the brief:
 *
 * - It is never called a video, in code or in copy, because no video asset exists. No MP4, no
 *   Lottie, no WebGL, no dependency — one small client component and CSS.
 * - No narration, no product footage, no invented data. The only text is stage and section names
 *   that already exist in all 21 locales.
 * - Autoplay is silent and restrained, and the sequence is fully usable if autoplay never starts:
 *   the controls are real buttons, and every beat is reachable by hand.
 * - Under prefers-reduced-motion it does not autoplay at all. It becomes a stepper: the reader
 *   moves through the same beats at their own pace, and the field is rendered without transitions.
 *   The argument survives; only the motion stops.
 *
 * Keyboard: the beat buttons are a real tablist-style group — arrow keys move between beats, Home
 * and End jump to the ends, and the transport buttons are ordinary buttons. Nothing is reachable
 * only by pointer.
 */

const BEAT_MS = 4600;

export type Beat = { key: string; label: string; body: string };

export default function GuidedExplainer({
  beats,
  labels,
}: {
  beats: readonly Beat[];
  labels: { play: string; pause: string; restart: string; step: string };
}) {
  const [beat, setBeat] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Respect the reader's motion preference, and keep respecting it if they change it mid-visit.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(mq.matches);
      // Autoplay is never started for a reader who asked for less motion.
      setPlaying(!mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!playing || reduced) return;
    const t = setTimeout(() => setBeat((b) => (b + 1) % beats.length), BEAT_MS);
    return () => clearTimeout(t);
  }, [playing, beat, reduced, beats.length]);

  const go = useCallback(
    (i: number) => {
      const next = (i + beats.length) % beats.length;
      setBeat(next);
      tabsRef.current[next]?.focus();
    },
    [beats.length],
  );

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const map: Record<string, number> = {
      ArrowRight: i + 1,
      ArrowDown: i + 1,
      ArrowLeft: i - 1,
      ArrowUp: i - 1,
      Home: 0,
      End: beats.length - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    go(map[e.key]);
  };

  const current = beats[beat];

  return (
    <div className={styles.explainer} data-beat={beat} data-reduced={reduced ? "true" : "false"}>
      <div className={styles.stage}>
        <ExplainerField beat={beat} />
      </div>

      <div className={styles.readout}>
        <p className={styles.beatIndex}>
          {labels.step} {beat + 1} / {beats.length}
        </p>
        <h3 className={styles.beatLabel}>{current?.label}</h3>
        <p className={`${styles.beatBody} ${styles.jp}`}>{current?.body}</p>
      </div>

      <div className={styles.controls}>
        {!reduced && (
          <button
            type="button"
            className={styles.transport}
            onClick={() => setPlaying((p) => !p)}
            aria-pressed={playing}
          >
            {playing ? labels.pause : labels.play}
          </button>
        )}
        <button
          type="button"
          className={styles.transport}
          onClick={() => {
            setBeat(0);
            tabsRef.current[0]?.focus();
          }}
        >
          {labels.restart}
        </button>

        <ol className={styles.beats} role="tablist" aria-label={labels.step}>
          {beats.map((b, i) => (
            <li key={b.key} role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={i === beat}
                aria-label={`${labels.step} ${i + 1}: ${b.label}`}
                tabIndex={i === beat ? 0 : -1}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                className={`${styles.beatPip} ${i === beat ? styles.beatPipOn : ""}`}
                onClick={() => {
                  setPlaying(false);
                  go(i);
                }}
                onKeyDown={(e) => onKey(e, i)}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/**
 * The field. One SVG whose elements reveal by beat via `data-beat` on the wrapper — the same nodes,
 * lines, boundary and jade signal as the hero, so this reads as the system explaining itself rather
 * than as a second design.
 */
function ExplainerField({ beat }: { beat: number }) {
  return (
    <svg
      viewBox="0 0 440 250"
      preserveAspectRatio="xMidYMid meet"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={styles.field}
    >
      {[54, 110, 166].map((y) => (
        <line key={y} className={styles.grid} x1="16" y1={y} x2="424" y2={y} strokeDasharray="2 8" />
      ))}

      {/* 1 — structural signals */}
      <g className={styles.gSignals} data-on={beat >= 0}>
        {[60, 112, 164].map((y) => (
          <g key={y}>
            <circle cx="34" cy={y} r="3.2" />
            <line x1="41" y1={y} x2="88" y2={y} strokeDasharray="3 5" />
          </g>
        ))}
      </g>

      {/* 2 — evidence connects and verifies */}
      <g className={styles.gEvidence} data-on={beat >= 1}>
        {[60, 112, 164].map((y) => (
          <path key={y} d={`M 88 ${y} C 126 ${y}, 134 112, 164 112`} />
        ))}
        <circle className={styles.node} cx="172" cy="112" r="9" />
        <circle className={styles.core} cx="172" cy="112" r="3" />
      </g>

      {/* 3 — the venture becomes a defined object */}
      <g className={styles.gVenture} data-on={beat >= 2}>
        <path d="M 181 112 L 226 112" />
        <rect x="226" y="92" width="42" height="40" rx="2" />
        <line x1="247" y1="92" x2="247" y2="132" className={styles.spine} />
      </g>

      {/* 4 — a founding team attaches */}
      <g className={styles.gTeam} data-on={beat >= 3}>
        <path d="M 247 180 L 247 136" />
        <circle cx="247" cy="186" r="5.5" />
      </g>

      {/* 5 — the company separates and stands on its own */}
      <g className={styles.gCompany} data-on={beat >= 4}>
        <rect x="324" y="90" width="48" height="44" rx="2" />
        <circle className={styles.core} cx="348" cy="112" r="3" />
      </g>

      {/* 6 — the three current ventures sit inside this shape */}
      <g className={styles.gVentures} data-on={beat >= 5}>
        {[
          ["Mirai Move", 206],
          ["Kakari", 222],
          ["Chigamo", 238],
        ].map(([name, y]) => (
          <g key={String(name)}>
            <rect x="36" y={(y as number) - 6} width="9" height="9" />
            <text x="52" y={(y as number) + 2}>
              {name}
            </text>
          </g>
        ))}
      </g>

      {/* 7 — shared capability returns, and the way in */}
      <g className={styles.gShared} data-on={beat >= 6}>
        <path d="M 348 138 C 348 190, 300 216, 262 216" strokeDasharray="4 6" />
        <line x1="252" y1="228" x2="416" y2="228" />
        {[276, 316, 356, 396].map((x) => (
          <rect key={x} x={x} y="223" width="9" height="9" />
        ))}
      </g>
    </svg>
  );
}
