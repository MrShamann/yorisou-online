import styles from "../corporate.module.css";
import { KAKARI_PROCEDURE, MIRAI_NETWORK } from "../_content/site";

/**
 * CORP-P3 F-01 — a heading composed of phrase units.
 *
 * Each unit is an inline-block, so the browser may only break BETWEEN units. That removes the two
 * observed defects at a stroke: no single-character orphan line (「る。」), and no break inside a
 * word (「よりそ」/「い」). Wording is never altered — only where a break is permitted.
 */
export function PhraseHeading({
  units,
  as = "h2",
  className,
}: {
  units: readonly string[];
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const Tag = as;
  return (
    <Tag className={className}>
      {units.map((u, i) => (
        <span className={styles.unit} key={i}>
          {u}
        </span>
      ))}
    </Tag>
  );
}

export function PhraseText({
  lines,
  className,
}: {
  lines: readonly (readonly string[])[];
  className?: string;
}) {
  return (
    <p className={className}>
      {lines.map((line, li) => (
        <span className={styles.phraseLine} key={li}>
          {line.map((u, i) => (
            <span className={styles.unit} key={i}>
              {u}
            </span>
          ))}
        </span>
      ))}
    </p>
  );
}

/**
 * CORP-P3 F-05 — the first-screen company diagram.
 *
 * A conceptual relationship figure, NOT a claim of operating infrastructure: two columns of人 and
 * 仕組み with Yorisou as the bridge between them, and the two fields named on the bridge. It is
 * `aria-hidden` because the same relationship is stated in the adjacent semantic list, so screen
 * readers get the meaning once, not twice.
 */
export function ThesisFigure() {
  return (
    <div className={styles.figure}>
      <svg
        className={styles.figureSvg}
        viewBox="0 0 320 240"
        role="presentation"
        aria-hidden="true"
        focusable="false"
      >
        {/* people side */}
        {[0, 1, 2].map((i) => (
          <circle key={`p${i}`} cx="34" cy={70 + i * 50} r="5" fill="rgba(12,14,13,0.34)" />
        ))}
        {/* systems side — squares, because institutions are not people */}
        {[0, 1, 2].map((i) => (
          <rect
            key={`s${i}`}
            x="280"
            y={65 + i * 50}
            width="10"
            height="10"
            fill="rgba(12,14,13,0.24)"
          />
        ))}
        {/* the gap that the company exists to close */}
        {[0, 1, 2].map((i) => (
          <line
            key={`l${i}`}
            x1="39"
            y1={70 + i * 50}
            x2="140"
            y2={70 + i * 50}
            stroke="rgba(12,14,13,0.14)"
            strokeWidth="1"
          />
        ))}
        {[0, 1, 2].map((i) => (
          <line
            key={`r${i}`}
            x1="180"
            y1={70 + i * 50}
            x2="280"
            y2={70 + i * 50}
            stroke="rgba(12,14,13,0.14)"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        ))}
        {/* the bridge */}
        <rect
          x="140"
          y="52"
          width="40"
          height="136"
          rx="3"
          fill="none"
          stroke="#2f6b5e"
          strokeWidth="1.2"
        />
        <line x1="160" y1="52" x2="160" y2="188" stroke="#2f6b5e" strokeWidth="0.6" opacity="0.5" />
        <circle className={styles.signal} cx="160" cy="120" r="3.4" fill="#2f6b5e" />
      </svg>
      <ul className={styles.figureKey}>
        <li>
          <span className={styles.figureKeyMark} data-kind="people" aria-hidden="true" />
          人 — 暮らし・仕事・地域
        </li>
        <li>
          <span className={styles.figureKeyMark} data-kind="bridge" aria-hidden="true" />
          Yorisou — 理解し、選び、前に進めるためのプロダクトをつくる
        </li>
        <li>
          <span className={styles.figureKeyMark} data-kind="systems" aria-hidden="true" />
          仕組み — モビリティ／行政手続き
        </li>
      </ul>
    </div>
  );
}

/**
 * CORP-P3 F-04 — Mirai Move: a RELATIONSHIP SCHEMATIC.
 *
 * Parties sit around a shared centre and each connects to it, so the eye reads "many parties, one
 * shared opportunity" — a network, not a sequence. Deliberately NOT a map: there is no canonical
 * geographic data, and placing parties on a map of Japan would imply coverage we cannot evidence.
 * Positions are symbolic and carry no magnitude. The `<ol>` below is the accessible equivalent.
 */
export function NetworkSchematic() {
  const seats = [
    { x: 60, y: 46 },
    { x: 260, y: 46 },
    { x: 60, y: 174 },
    { x: 260, y: 174 },
  ];
  return (
    <figure className={styles.schematic}>
      <svg
        className={styles.schematicSvg}
        viewBox="0 0 320 220"
        role="presentation"
        aria-hidden="true"
        focusable="false"
      >
        {seats.map((s, i) => (
          <line
            key={`e${i}`}
            x1={s.x}
            y1={s.y}
            x2="160"
            y2="110"
            stroke="rgba(12,14,13,0.16)"
            strokeWidth="1"
          />
        ))}
        {seats.map((s, i) => (
          <g key={`n${i}`}>
            <circle cx={s.x} cy={s.y} r="7" fill="var(--c-ground)" stroke="rgba(12,14,13,0.34)" />
            <text
              x={s.x}
              y={s.y + 3.4}
              textAnchor="middle"
              fontSize="8"
              fill="rgba(12,14,13,0.55)"
            >
              {i + 1}
            </text>
          </g>
        ))}
        <circle cx="160" cy="110" r="26" fill="var(--c-ground)" stroke="#2f6b5e" strokeWidth="1.2" />
        <circle className={styles.signal} cx="160" cy="110" r="3.2" fill="#2f6b5e" />
      </svg>
      <figcaption className={styles.schematicCaption}>
        <span className={styles.schematicCentre}>中心：{MIRAI_NETWORK.centre}</span>
        <ol className={styles.schematicList}>
          {MIRAI_NETWORK.parties.map((p, i) => (
            <li key={p.id}>
              <span className={styles.schematicIndex} aria-hidden="true">
                {i + 1}
              </span>
              <span className={styles.schematicLabel}>{p.label}</span>
              <span className={styles.schematicNote}>{p.note}</span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}

/**
 * CORP-P3 F-04 — Kakari: a PROCEDURAL FLOW WITH A GATE.
 *
 * Four numbered steps in a column, then a visually distinct terminal band where the procedure leaves
 * Kakari. The boundary is a step in the flow rather than a disclaimer placed after a generic
 * diagram — it is where the line stops, and it looks like it. This is a governed procedure, not a
 * legal decision tree: no branching, no conditions, no advice.
 */
export function ProcedureFlow() {
  return (
    <figure className={styles.procedure}>
      <ol className={styles.procedureList}>
        {KAKARI_PROCEDURE.steps.map((s) => (
          <li className={styles.procedureStep} key={s.no}>
            <span className={styles.procedureNo} aria-hidden="true">
              {s.no}
            </span>
            <span className={styles.procedureLabel}>{s.label}</span>
            <span className={styles.procedureNote}>{s.note}</span>
          </li>
        ))}
      </ol>
      <div className={styles.procedureGate}>
        <span className={styles.procedureGateRule} aria-hidden="true" />
        <p className={styles.procedureGateLabel}>{KAKARI_PROCEDURE.boundary.label}</p>
        <p className={styles.procedureGateNote}>{KAKARI_PROCEDURE.boundary.note}</p>
      </div>
    </figure>
  );
}
