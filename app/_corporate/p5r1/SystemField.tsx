import styles from "./p5r1.module.css";

/**
 * CORP-P5R1 — the hero system field. Layer 1 of the depth system.
 *
 * WHAT IT IS. Human signals enter on the left, become legible as context in the middle, and are
 * routed to the two institutional domains this company actually works in. That is the thesis
 * 「人と社会のあいだに」 drawn as a topology rather than asserted as a slogan.
 *
 * WHAT IT IS NOT. There is no data here. Every entity is one of the already-approved labels —
 * 暮らし / 仕事 / 地域 on the human side, モビリティ / 行政手続き on the system side. Nothing is a
 * metric, a count, a user, a live reading or a capability claim. Nothing animates forever.
 *
 * It is `aria-hidden` and `pointer-events: none`: the same relationship is stated in the adjacent
 * semantic list, so a screen reader receives it once, and no decorative layer can ever intercept a
 * control — which is exactly the defect that made the previous prototype's only button unclickable.
 */
const HUMAN = [
  { y: 62, label: "暮らし" },
  { y: 140, label: "仕事" },
  { y: 218, label: "地域" },
] as const;

const SYSTEM = [
  { y: 104, label: "モビリティ" },
  { y: 186, label: "行政手続き" },
] as const;

export default function SystemField() {
  return (
    <svg
      className={styles.sysField}
      viewBox="0 0 420 280"
      preserveAspectRatio="xMidYMid meet"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {/* latent lattice — structure that exists before anything is active */}
      <g opacity="0.5">
        {[70, 140, 210].map((y) => (
          <line key={`h${y}`} x1="18" y1={y} x2="402" y2={y} className={styles.rel} strokeDasharray="2 6" />
        ))}
      </g>

      {/* CONNECT — human signal to context */}
      <g>
        {HUMAN.map((h, i) => (
          <path
            key={`hc${i}`}
            d={`M 44 ${h.y} C 110 ${h.y}, 150 140, 196 140`}
            className={`${styles.rel} ${styles.relLive}`}
            pathLength={1}
            data-motion="connect"
            style={{ ["--i" as string]: i }}
          />
        ))}
      </g>

      {/* CONNECT — context routed to the institutional domains */}
      <g>
        {SYSTEM.map((s, i) => (
          <path
            key={`sc${i}`}
            d={`M 244 140 C 292 140, 312 ${s.y}, 356 ${s.y}`}
            className={`${styles.rel} ${styles.relLive}`}
            pathLength={1}
            data-motion="connect"
            style={{ ["--i" as string]: 3 + i }}
          />
        ))}
      </g>

      {/* human signals */}
      {HUMAN.map((h, i) => (
        <g key={`h${i}`} data-motion="resolve" style={{ ["--i" as string]: i, ["--fx" as string]: "-10px" }}>
          <circle cx="38" cy={h.y} r="4.5" className={styles.node} />
          <text x="52" y={h.y + 4} className={styles.sysLabelJp}>
            {h.label}
          </text>
        </g>
      ))}

      {/* the context band — where relationships become legible. This is Yorisou's position. */}
      <g data-motion="resolve" style={{ ["--i" as string]: 3 }}>
        <rect x="196" y="98" width="48" height="84" rx="1" fill="none" className={styles.rel} />
        <line x1="220" y1="98" x2="220" y2="182" className={`${styles.rel} ${styles.relLive}`} strokeOpacity="0.45" />
        <circle cx="220" cy="140" r="5.2" fill="none" className={`${styles.node} ${styles.nodeLive}`} />
        <circle cx="220" cy="140" r="1.9" fill="var(--c-accent-on-dark)" />
        <text x="220" y="90" textAnchor="middle" className={styles.sysLabel}>
          context
        </text>
      </g>

      {/* institutional domains */}
      {SYSTEM.map((s, i) => (
        <g key={`s${i}`} data-motion="resolve" style={{ ["--i" as string]: 4 + i, ["--fx" as string]: "10px" }}>
          <rect x="356" y={s.y - 4.5} width="9" height="9" className={styles.node} />
          <text x="348" y={s.y + 4} textAnchor="end" className={styles.sysLabelJp}>
            {s.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
