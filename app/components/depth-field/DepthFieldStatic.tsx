// AIX-2 — Server-rendered static depth field (SVG). Always present: renders
// before any JS, with JS disabled, under reduced motion, and when WebGL is
// unavailable. Uses the SAME seed as the WebGL renderer via a perspective
// projection, so the fallback shows the same arrangement with real depth cues
// (size + brightness + painter-order by z, atmospheric fade on far points).

import { createDepthPoints, projectForStatic, type DepthParams } from "./engine";
import type { FieldColor } from "./seed";

type Props = {
  params: DepthParams;
  palette: FieldColor[];
  formation?: number;
  className?: string;
};

const VIEW = 1000;

export default function DepthFieldStatic({ params, palette, formation = 1, className }: Props) {
  const points = createDepthPoints(params);
  const projected = projectForStatic(points, VIEW, formation);

  return (
    <svg
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="aix2-node-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {projected.map((p, i) => {
        const color = palette[p.colorIndex % palette.length]?.hex ?? palette[0].hex;
        return (
          <circle
            key={i}
            cx={p.sx.toFixed(1)}
            cy={p.sy.toFixed(1)}
            r={p.r.toFixed(1)}
            fill={color}
            opacity={Math.min(1, p.alpha).toFixed(2)}
          />
        );
      })}
    </svg>
  );
}
