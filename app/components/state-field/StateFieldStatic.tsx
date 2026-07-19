// Server-renderable static State Field frame (AIX-1).
//
// This is the always-present base layer: it renders deterministic SVG on the
// server so the field is visible before any JavaScript loads, with JS
// disabled, with reduced motion, or on devices where canvas is unavailable.
// The animated canvas (StateField.tsx) fades in above it when safe.

import {
  createFieldNodes,
  fieldLinks,
  fieldPointsAt,
  type FieldParams,
} from "./engine";

type Props = {
  params: FieldParams;
  /** formation level of the still frame, 0..1 (default: formed) */
  formation?: number;
  className?: string;
};

const VIEW = 1000;

export default function StateFieldStatic({ params, formation = 1, className }: Props) {
  const nodes = createFieldNodes(params);
  // t=0 still frame; deterministic for the seed.
  const points = fieldPointsAt(nodes, params.seed, 0, formation);
  const links = fieldLinks(points);

  return (
    <svg
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      {links.map((link, i) => {
        const a = points[link.a];
        const b = points[link.b];
        return (
          <line
            key={`l${i}`}
            x1={(a.x * VIEW).toFixed(1)}
            y1={(a.y * VIEW).toFixed(1)}
            x2={(b.x * VIEW).toFixed(1)}
            y2={(b.y * VIEW).toFixed(1)}
            stroke={params.lineColor}
            strokeWidth={(link.strength * 1.4 + 0.3).toFixed(2)}
          />
        );
      })}
      {points.map((p, i) => (
        <circle
          key={`n${i}`}
          cx={(p.x * VIEW).toFixed(1)}
          cy={(p.y * VIEW).toFixed(1)}
          r={Math.max(1.6, p.r * VIEW).toFixed(1)}
          fill={params.palette[p.colorIndex]?.color ?? params.palette[0].color}
          opacity={Math.min(1, p.alpha + 0.12).toFixed(2)}
        />
      ))}
    </svg>
  );
}
