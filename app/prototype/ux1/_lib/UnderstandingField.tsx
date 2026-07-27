"use client";

// UX-1 — the "Living Understanding Field".
//
// This is the one semantic visual of the direction. It is NOT decoration:
//   • the centre is the person, not a "type";
//   • each arc is a distinct METHOD LENS, sized by how much it currently informs
//     the field, and dimmed when that lens is not available;
//   • the bright mark is the CURRENT reading's position — it MOVES when the
//     person corrects it (that movement is the whole argument of the direction);
//   • the faint line is history: where the reading has been.
//
// Motion is meaning-bearing and reduced-motion-safe: with `prefers-reduced-motion`
// the mark jumps to its new position with no transition, and nothing loops.

import { useEffect, useState } from "react";

import type { FieldPoint, Lens } from "./ux1";

type Props = {
  lenses: Lens[];
  position: FieldPoint;
  /** past positions, oldest → newest (optional) */
  trail?: FieldPoint[];
  /** short label rendered next to the current mark */
  markLabel?: string;
  /** true while the field is re-settling after a correction */
  reorganizing?: boolean;
  /** accessible description of what the field currently shows */
  description: string;
  className?: string;
};

const W = 720;
const H = 520;
const CX = W / 2;
const CY = H / 2;
const R = 196;

/** field-space (0..1) → svg coords, kept inside the ring */
function toSvg(p: FieldPoint) {
  return { x: 90 + p.x * (W - 180), y: 70 + p.y * (H - 150) };
}

export default function UnderstandingField({
  lenses,
  position,
  trail = [],
  markLabel,
  reorganizing = false,
  description,
  className,
}: Props) {
  // Subscribe to the reduced-motion preference (an external system). The mark's
  // movement itself needs no state: the transform below is derived from `position`,
  // and the CSS transition animates it whenever that value changes — so a correction
  // visibly re-settles the field, while reduced motion simply drops the transition.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const mark = toSvg(position);
  const trailPts = trail.map(toSvg);
  const trailPath = trailPts.length
    ? trailPts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")
    : "";

  return (
    <figure className={className} role="img" aria-label={description}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ux1-field" cx="50%" cy="50%" r="62%">
            <stop offset="0%" stopColor="var(--yorisou-color-primary-500)" stopOpacity="0.16" />
            <stop offset="58%" stopColor="var(--yorisou-color-primary-500)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="var(--yorisou-color-primary-500)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ux1-mark" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--yorisou-color-accent-500)" stopOpacity="0.95" />
            <stop offset="70%" stopColor="var(--yorisou-color-accent-500)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--yorisou-color-accent-500)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* the field itself */}
        <ellipse cx={CX} cy={CY} rx={R + 118} ry={R + 34} fill="url(#ux1-field)" />

        {/* two quiet reference rings — depth, not decoration */}
        <ellipse cx={CX} cy={CY} rx={R} ry={R * 0.62} fill="none" stroke="var(--yorisou-color-neutral-200)" strokeWidth="1" />
        <ellipse cx={CX} cy={CY} rx={R * 0.6} ry={R * 0.37} fill="none" stroke="var(--yorisou-color-neutral-200)" strokeWidth="1" strokeDasharray="3 6" />

        {/* method lenses — distinct arcs, dimmed when not available */}
        {lenses.map((lens) => {
          const rad = (lens.angle * Math.PI) / 180;
          const rx = R + 16;
          const ry = R * 0.62 + 16;
          const x = CX + Math.cos(rad) * rx;
          const y = CY + Math.sin(rad) * ry;
          const available = lens.status !== "not_available";
          const len = 12 + lens.weight * 26;
          const x2 = CX + Math.cos(rad) * (rx - len);
          const y2 = CY + Math.sin(rad) * (ry - len);
          return (
            <g key={lens.id} opacity={available ? 1 : 0.32}>
              <line
                x1={x}
                y1={y}
                x2={x2}
                y2={y2}
                stroke={
                  lens.status === "active_private_pilot"
                    ? "var(--yorisou-color-primary-600)"
                    : "var(--yorisou-color-primary-500)"
                }
                strokeOpacity={0.25 + lens.weight * 0.5}
                strokeWidth={2 + lens.weight * 2.4}
                strokeLinecap="round"
              />
              <circle
                cx={x}
                cy={y}
                r={3 + lens.weight * 2.4}
                fill={available ? "var(--yorisou-color-primary-500)" : "var(--yorisou-color-neutral-200)"}
                fillOpacity={available ? 0.55 + lens.weight * 0.35 : 1}
              />
            </g>
          );
        })}

        {/* history: where the reading has been */}
        {trailPath ? (
          <g>
            <path d={trailPath} fill="none" stroke="var(--yorisou-color-primary-500)" strokeOpacity="0.3" strokeWidth="1.6" strokeDasharray="2 7" strokeLinecap="round" />
            {trailPts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={3.2} fill="var(--yorisou-color-primary-500)" fillOpacity={0.16 + i * 0.1} />
            ))}
          </g>
        ) : null}

        {/* the person, at the centre of their own field */}
        <circle cx={CX} cy={CY} r="7.5" fill="none" stroke="var(--yorisou-color-neutral-500)" strokeWidth="1.2" />
        <circle cx={CX} cy={CY} r="2.6" fill="var(--yorisou-color-neutral-500)" />

        {/* the current reading */}
        <g
          style={
            reduced
              ? undefined
              : {
                  transition: `transform var(--yorisou-motion-result, 600ms) var(--yorisou-motion-ease, ease)`,
                }
          }
          transform={`translate(${mark.x - CX} ${mark.y - CY})`}
        >
          <circle cx={CX} cy={CY} r="46" fill="url(#ux1-mark)" opacity={reorganizing ? 0.5 : 1} />
          <circle cx={CX} cy={CY} r="8.5" fill="var(--yorisou-color-accent-600)" />
          <circle cx={CX} cy={CY} r="14" fill="none" stroke="var(--yorisou-color-accent-600)" strokeOpacity="0.45" strokeWidth="1.4" />
        </g>
      </svg>
      {/* Register-agnostic: inherit the surrounding text colour rather than assume a
          light surface, so the caption stays legible in both the open and private
          registers (a hardcoded light-surface muted token failed AA on Ink Plum). */}
      {markLabel ? (
        <figcaption className="mt-2 text-center text-[12.5px] text-current opacity-70">{markLabel}</figcaption>
      ) : null}
    </figure>
  );
}
