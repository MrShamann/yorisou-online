// Package 9 — trait constellation (SERVER-RENDERED SVG; zero client JS).
// Center = the user's いま色 type; orbiting stars = answer-derived tendencies
// (the existing highlights). Distance/size are editorial impressions of the
// same content shown in the list below — explicitly NOT measurements.
import type { ReactElement } from "react";

export interface ConstellationTrait { label: string; text: string }

export function TraitConstellation({
  centerLabel,
  traits,
}: {
  centerLabel: string;
  traits: ConstellationTrait[];
}): ReactElement | null {
  if (traits.length === 0) return null;
  const W = 340, H = 260, cx = W / 2, cy = H / 2;
  const nodes = traits.slice(0, 5).map((t, i, arr) => {
    const angle = (i / arr.length) * Math.PI * 2 - Math.PI / 2;
    const r = 78 + (i % 2) * 22; // editorial rhythm, not data
    return { t, x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });
  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`いま色の星座。中心は「${centerLabel}」、まわりの星は回答から見えた傾向: ${nodes.map(n => n.t.label).join("、")}。同じ内容は下のリストでも読めます。`}
        style={{ width: "100%", height: "auto", maxHeight: 300 }}
      >
        {nodes.map((n, i) => (
          <line key={`l-${i}`} x1={cx} y1={cy} x2={n.x} y2={n.y} stroke="rgba(105,151,130,0.35)" strokeDasharray="2 4" />
        ))}
        <circle cx={cx} cy={cy} r={30} fill="#F4FAF7" stroke="rgba(23,59,53,0.25)" />
        <circle cx={cx} cy={cy} r={5} fill="#4D7A69" />
        <text x={cx} y={cy + 46} textAnchor="middle" fontSize="12" fontWeight="600" fill="#315F50">{centerLabel}</text>
        {nodes.map((n, i) => (
          <g key={`n-${i}`}>
            <circle cx={n.x} cy={n.y} r={6 + (i % 2) * 2} fill="#E9B7C9" fillOpacity="0.9" stroke="rgba(23,59,53,0.15)" />
            <text
              x={n.x}
              y={n.y + (n.y > cy ? 20 : -12)}
              textAnchor="middle"
              fontSize="10.5"
              fill="#49615B"
            >
              {n.t.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-1 text-[11px] leading-5 text-[#8A7F78]">
        星の位置や近さは、読みやすさのための表現です。距離やスコアを測ったものではありません。
      </figcaption>
    </figure>
  );
}
