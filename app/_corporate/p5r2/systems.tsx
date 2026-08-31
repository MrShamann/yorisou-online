import styles from "./site.module.css";

/**
 * CORP-P5R2 — the two project system grammars.
 *
 * Mirai Move is a NETWORK: parties converging on a shared opportunity. Kakari is a bounded
 * PROCEDURE: ordered states resolving in one direction and stopping at a professional boundary.
 * They must read as different kinds of system before any heading is read.
 *
 * Both are aria-hidden with the same information available in the adjacent list, and both are inert
 * to pointers. Every label comes from the locale copy, so the drawings translate with the site.
 */

export function NetworkSystem({ labels, centre }: { labels: readonly string[]; centre: string }) {
  const seats = [
    { x: 56, y: 52 }, { x: 244, y: 52 },
    { x: 56, y: 188 }, { x: 244, y: 188 },
  ];
  return (
    <svg viewBox="0 0 300 250" role="presentation" aria-hidden="true" focusable="false" className={styles.svgBlock}>
      <defs>
        <radialGradient id="p5r2net" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#74baa6" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#74baa6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="150" cy="120" r="72" fill="url(#p5r2net)" />
      {seats.map((s, i) => (
        <line key={`e${i}`} x1={s.x} y1={s.y} x2="150" y2="120"
          stroke="rgba(233,231,224,0.22)" strokeWidth="1" />
      ))}
      {seats.map((s, i) => (
        <g key={`n${i}`}>
          <circle cx={s.x} cy={s.y} r="7" fill="#0e1211" stroke="rgba(233,231,224,0.42)" />
          <text x={s.x} y={s.y + 3} textAnchor="middle" fontSize="8" fill="#b3b8b3">{i + 1}</text>
        </g>
      ))}
      <circle cx="150" cy="120" r="26" fill="#0e1211" stroke="#74baa6" strokeWidth="1.3" />
      <circle cx="150" cy="120" r="3" fill="#74baa6" />
      <text x="150" y="168" textAnchor="middle" fontSize="9.5" fill="#8d938e" letterSpacing="0.06em">{centre}</text>
      {labels.slice(0, 4).map((l, i) => (
        <text key={`l${i}`} x={seats[i].x} y={seats[i].y + (i < 2 ? -16 : 24)} textAnchor="middle"
          fontSize="9" fill="#8d938e">{l.length > 18 ? l.slice(0, 17) + "…" : l}</text>
      ))}
    </svg>
  );
}

export function ProcedureSystem({ steps, boundary }: { steps: readonly string[]; boundary: string }) {
  const ys = [38, 78, 118, 158];
  return (
    <svg viewBox="0 0 300 250" role="presentation" aria-hidden="true" focusable="false" className={styles.svgBlock}>
      <line x1="34" y1="38" x2="34" y2="158" stroke="rgba(233,231,224,0.22)" strokeWidth="1" />
      {ys.map((y, i) => (
        <g key={i}>
          <circle cx="34" cy={y} r="6" fill="#0e1211" stroke={i === 3 ? "#74baa6" : "rgba(233,231,224,0.42)"} />
          <line x1="44" y1={y} x2="268" y2={y} stroke="rgba(233,231,224,0.13)" strokeWidth="1" />
          <text x="50" y={y - 8} fontSize="9.5" fill="#b3b8b3">
            {(steps[i] ?? "").length > 26 ? (steps[i] ?? "").slice(0, 25) + "…" : steps[i] ?? ""}
          </text>
          <text x="20" y={y + 3} textAnchor="end" fontSize="8.5" fill="#8d938e">{String(i + 1).padStart(2, "0")}</text>
        </g>
      ))}
      <line x1="14" y1="198" x2="286" y2="198" stroke="#d3ab6b" strokeWidth="1.5" />
      <circle cx="34" cy="198" r="3" fill="#d3ab6b" />
      <text x="14" y="216" fontSize="9" fill="#d3ab6b" letterSpacing="0.05em">
        {boundary.length > 34 ? boundary.slice(0, 33) + "…" : boundary}
      </text>
    </svg>
  );
}

/** Hero relationship field: human signals → context → institutional systems. */
export function HeroField({ human, systems, relation }: { human: readonly string[]; systems: readonly string[]; relation: string }) {
  const hy = [64, 140, 216];
  const sy = [104, 178];
  return (
    <svg viewBox="0 0 440 280" preserveAspectRatio="xMidYMid meet" role="presentation" aria-hidden="true" focusable="false" className={styles.svgFill}>
      <defs>
        <linearGradient id="p5r2beam" x1="0" x2="1">
          <stop offset="0%" stopColor="#74baa6" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#74baa6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#74baa6" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {[70, 140, 210].map((y) => (
        <line key={y} x1="20" y1={y} x2="420" y2={y} stroke="rgba(233,231,224,0.08)" strokeDasharray="2 7" />
      ))}
      {hy.map((y, i) => (
        <path key={`h${i}`} d={`M 48 ${y} C 120 ${y}, 160 140, 206 140`} fill="none" stroke="url(#p5r2beam)" strokeWidth="1.1" />
      ))}
      {sy.map((y, i) => (
        <path key={`s${i}`} d={`M 254 140 C 300 140, 322 ${y}, 372 ${y}`} fill="none" stroke="url(#p5r2beam)" strokeWidth="1.1" />
      ))}
      {hy.map((y, i) => (
        <g key={`hn${i}`}>
          <circle cx="42" cy={y} r="5" fill="#0e1211" stroke="rgba(233,231,224,0.45)" />
          <text x="56" y={y + 4} fontSize="10.5" fill="#e9e7e0">{human[i] ?? ""}</text>
        </g>
      ))}
      <g>
        <rect x="206" y="96" width="48" height="88" rx="2" fill="none" stroke="rgba(233,231,224,0.28)" />
        <line x1="230" y1="96" x2="230" y2="184" stroke="#74baa6" strokeOpacity="0.4" />
        <circle cx="230" cy="140" r="6" fill="#0e1211" stroke="#74baa6" strokeWidth="1.3" />
        <circle cx="230" cy="140" r="2" fill="#74baa6" />
        <text x="230" y="86" textAnchor="middle" fontSize="9" fill="#8d938e" letterSpacing="0.08em">{relation}</text>
      </g>
      {sy.map((y, i) => (
        <g key={`sn${i}`}>
          <rect x="372" y={y - 5} width="10" height="10" fill="#0e1211" stroke="rgba(233,231,224,0.45)" />
          <text x="364" y={y + 4} textAnchor="end" fontSize="10.5" fill="#e9e7e0">{systems[i] ?? ""}</text>
        </g>
      ))}
    </svg>
  );
}

/**
 * CORP-v1.2R2 — Chigamo's context field.
 *
 * Deliberately the simplest of the three venture diagrams. Mirai Move gets a network because it has
 * one; Kakari gets an ordered procedure because it has one. Chigamo is at concept stage with no
 * product, no users and no municipality, so drawing it a mature platform topology would make it look
 * further along than it is. Three faint rings converging on one point states the hypothesis —
 * place plus context yields something locally relevant — and stops there.
 *
 * Its visual simplicity is the honest signal of its maturity, not a gap in the design.
 */
export function ContextField({ place, context, result }: { place: string; context: string; result: string }) {
  return (
    <svg viewBox="0 0 300 250" role="presentation" aria-hidden="true" focusable="false" className={styles.svgBlock}>
      {[34, 58, 82].map((r, i) => (
        <circle
          key={r}
          cx="104"
          cy="126"
          r={r}
          fill="none"
          stroke="rgba(233,231,224,0.16)"
          strokeDasharray={i === 0 ? undefined : "2 6"}
        />
      ))}
      <circle cx="104" cy="126" r="4" fill="#74baa6" />
      <text x="104" y="34" textAnchor="middle" fontSize="9" fill="#8d938e" letterSpacing="0.06em">
        {place}
      </text>
      <line x1="104" y1="126" x2="228" y2="126" stroke="rgba(116,186,166,0.34)" strokeDasharray="3 5" />
      <text x="166" y="118" textAnchor="middle" fontSize="8.5" fill="#8d938e" letterSpacing="0.06em">
        {context}
      </text>
      <rect x="228" y="116" width="20" height="20" fill="none" stroke="rgba(233,231,224,0.4)" />
      <text x="238" y="152" textAnchor="middle" fontSize="8.5" fill="#8d938e" letterSpacing="0.06em">
        {result}
      </text>
    </svg>
  );
}
