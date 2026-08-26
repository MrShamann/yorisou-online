import styles from "./p5r1.module.css";
import { KAKARI_PROCEDURE, MIRAI_NETWORK } from "@/app/prototype/corporate/_content/site";

/**
 * CORP-P5R1 — the two project system grammars.
 *
 * These must be legible as DIFFERENT KINDS OF SYSTEM before any heading is read. Mirai Move is a
 * network: many parties, one shared centre, relations converging. Kakari is a bounded procedure:
 * ordered states resolving in one direction and stopping at a professional boundary.
 *
 * Both are drawn from already-approved content — the four Mirai Move parties and the four Kakari
 * steps plus its boundary. Neither shows data, throughput, volume or live state. Both are
 * `aria-hidden` with the same information available in the adjacent semantic list, and both are
 * inert to pointers.
 */

/** MIRAI MOVE — NETWORK. Parties converge on a shared opportunity. Motion: CONNECT. */
export function NetworkSystem() {
  const seats = [
    { x: 54, y: 58 },
    { x: 226, y: 58 },
    { x: 54, y: 182 },
    { x: 226, y: 182 },
  ];
  return (
    <svg viewBox="0 0 280 240" role="presentation" aria-hidden="true" focusable="false"
         className={styles.sysDrawing}>
      {seats.map((s, i) => (
        <line key={`e${i}`} x1={s.x} y1={s.y} x2="140" y2="120"
          className={`${styles.rel} ${styles.relLive}`} pathLength={1}
          data-motion="connect" style={{ ["--i" as string]: i }} />
      ))}
      {seats.map((s, i) => (
        <g key={`n${i}`} data-motion="resolve" style={{ ["--i" as string]: i }}>
          <circle cx={s.x} cy={s.y} r="6" className={styles.node} />
          <text x={s.x} y={s.y - 12} textAnchor="middle" className={styles.sysLabel}>
            {String(i + 1).padStart(2, "0")}
          </text>
        </g>
      ))}
      <g data-motion="resolve" style={{ ["--i" as string]: 4 }}>
        <circle cx="140" cy="120" r="24" fill="none" className={`${styles.node} ${styles.nodeLive}`} />
        <circle cx="140" cy="120" r="2.6" fill="var(--c-accent-on-dark)" />
        <text x="140" y="164" textAnchor="middle" className={styles.sysLabel}>
          shared opportunity
        </text>
      </g>
      <text x="140" y="228" textAnchor="middle" className={styles.sysLabel}>
        network — {MIRAI_NETWORK.parties.length} parties
      </text>
    </svg>
  );
}

/**
 * KAKARI — PROCEDURE. Four states resolve downward; a hand-off dot travels to the boundary rule and
 * STOPS there. The boundary is the terminal object of the drawing, not an annotation beside it.
 */
export function ProcedureSystem() {
  const ys = [40, 82, 124, 166];
  return (
    <svg viewBox="0 0 280 240" role="presentation" aria-hidden="true" focusable="false"
         className={styles.sysDrawing}>
      <line x1="46" y1="40" x2="46" y2="166" className={styles.rel} />
      {ys.map((y, i) => (
        <g key={i} data-motion="resolve" style={{ ["--i" as string]: i, ["--fy" as string]: "8px" }}>
          <circle cx="46" cy={y} r="5.5" className={`${styles.node} ${i < 3 ? "" : styles.nodeLive}`} />
          <text x="30" y={y + 4} textAnchor="end" className={styles.sysLabel}>
            {KAKARI_PROCEDURE.steps[i].no}
          </text>
          <line x1="58" y1={y} x2="248" y2={y} className={styles.rel} pathLength={1}
            data-motion="connect" style={{ ["--i" as string]: i }} />
          <text x="66" y={y - 7} className={styles.sysLabelJp}>
            {KAKARI_PROCEDURE.steps[i].label}
          </text>
        </g>
      ))}

      {/* the boundary: where the procedure stops and a licensed professional takes over */}
      <g data-motion="resolve" style={{ ["--i" as string]: 4 }}>
        <line x1="18" y1="204" x2="262" y2="204" className={styles.handoffRule} />
        <text x="18" y="222" className={styles.sysLabel}>
          professional boundary — procedure stops
        </text>
      </g>

      {/* HAND-OFF: one dot travels from the last step to the boundary and parks there. */}
      <circle r="3.1" fill="var(--c-handoff)" data-motion="handoff"
        style={{ offsetPath: "path('M 46 166 L 46 204')", offsetRotate: "0deg" } as never} />
    </svg>
  );
}
