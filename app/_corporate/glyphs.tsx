import styles from "./corporate.module.css";

/**
 * CORP-P5 — each project gets its OWN visual grammar, because the difference between them is real.
 * Rendering both as matching cards would erase the only thing that distinguishes them.
 *
 * Both are `aria-hidden`: the adjacent list carries the same information semantically, so a screen
 * reader gets the meaning once rather than twice. Both are inert to pointers.
 */

/**
 * Mirai Move — a NETWORK. Parties around a shared centre, each connected to it. Positions are
 * symbolic: no coordinate implies geography and no edge implies a transaction volume. Deliberately
 * not a map — there is no canonical geographic data, and a map of Japan would imply coverage that
 * cannot be evidenced.
 */
export function NetworkGlyph() {
  const seats = [
    { x: 28, y: 28 },
    { x: 132, y: 28 },
    { x: 28, y: 112 },
    { x: 132, y: 112 },
  ];
  return (
    <svg className={styles.glyph} viewBox="0 0 160 140" role="presentation" aria-hidden="true" focusable="false">
      {seats.map((s, i) => (
        <line key={`e${i}`} x1={s.x} y1={s.y} x2="80" y2="70" stroke="rgba(12,14,13,0.16)" strokeWidth="1" />
      ))}
      {seats.map((s, i) => (
        <circle key={`n${i}`} cx={s.x} cy={s.y} r="5.5" fill="#fbfaf6" stroke="rgba(12,14,13,0.34)" />
      ))}
      <circle cx="80" cy="70" r="19" fill="#fbfaf6" stroke="#2f6b5e" strokeWidth="1.2" />
      <circle cx="80" cy="70" r="2.8" fill="#2f6b5e" />
    </svg>
  );
}

/**
 * Kakari — a PROCEDURE. Ordered steps down one line, ending at a rule the procedure does not cross.
 * The boundary is a step in the flow, not a disclaimer placed after it.
 */
export function ProcedureGlyph() {
  const ys = [18, 44, 70, 96];
  return (
    <svg className={styles.glyph} viewBox="0 0 160 140" role="presentation" aria-hidden="true" focusable="false">
      <line x1="24" y1="18" x2="24" y2="96" stroke="rgba(12,14,13,0.16)" strokeWidth="1" />
      {ys.map((y, i) => (
        <g key={i}>
          <circle cx="24" cy={y} r="4.5" fill="#fbfaf6" stroke="rgba(12,14,13,0.34)" />
          <line x1="31" y1={y} x2="128" y2={y} stroke="rgba(12,14,13,0.11)" strokeWidth="1" />
        </g>
      ))}
      <line x1="10" y1="118" x2="150" y2="118" stroke="#2f6b5e" strokeWidth="1.2" />
      <circle cx="24" cy="118" r="2.8" fill="#2f6b5e" />
    </svg>
  );
}
