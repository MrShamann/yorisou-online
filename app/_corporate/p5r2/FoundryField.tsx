import styles from "./foundry-field.module.css";

/**
 * CORP-v1.2R2 — the Foundry Motion Field.
 *
 * The hero previously carried a static diagram. It was competent, and it behaved as an
 * illustration: nothing about it said that Yorisou continuously converts real-world signals into
 * evidence, ventures, founding teams and independent companies. This replaces it with a silent
 * ~11-second loop that states the operating model as behaviour rather than as a picture:
 *
 *   signals arrive → evidence connects and verifies → a venture becomes defined →
 *   a founding team attaches → the company separates and stands on its own →
 *   the generalised capability returns to the shared infrastructure layer
 *
 * Deliberate constraints, all of them from the brief:
 *
 * - No fake data. Nothing here is labelled live, real-time, or an activity count, because none of
 *   it is. The only text is stage names, which are real vocabulary from the Foundry process.
 * - Asterion is drawn as the floor UNDER the flow, never as its origin or owner, and is never the
 *   thing the signals come from. It receives capability back; it does not drive the ventures.
 * - Pure SVG + CSS keyframes. No animation library, no Lottie, no WebGL, no video, no JS. The cost
 *   of this component is the markup itself, which is what keeps the R1 performance gain intact.
 * - Labels come from `foundry.stages`, which already exists in all 21 locales, so the field is
 *   fully localised without adding a single new string to translate.
 * - Under prefers-reduced-motion every element resolves to its FINAL composed state — the whole
 *   diagram, fully formed, no looping. The meaning survives; only the motion stops.
 *
 * The narrative works with no interaction at all. Pointer and focus only slow the loop slightly so
 * a reader can dwell, which is why there is no interactive control to miss.
 */
export default function FoundryField({
  evidence,
  venture,
  team,
  independent,
  infrastructure,
}: {
  evidence: string;
  venture: string;
  team: string;
  independent: string;
  infrastructure: string;
}) {
  return (
    <svg
      viewBox="0 0 440 280"
      preserveAspectRatio="xMidYMid meet"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={styles.field}
    >
      {/* the quiet measuring grid the whole system sits on */}
      <g className={styles.grid}>
        {[56, 112, 168, 224].map((y) => (
          <line key={y} x1="16" y1={y} x2="424" y2={y} strokeDasharray="2 8" />
        ))}
      </g>

      {/* ── the shared capability layer. Under everything; owns nothing. ─────────────── */}
      <g className={styles.base}>
        <line x1="24" y1="250" x2="416" y2="250" className={styles.baseRule} />
        <text x="24" y="266" className={styles.baseLabel}>
          {infrastructure}
        </text>
        {[110, 190, 270, 350].map((x, i) => (
          <rect key={x} x={x} y="245" width="10" height="10" className={styles.baseCell} style={{ animationDelay: `${8.6 + i * 0.16}s` }} />
        ))}
      </g>

      {/* ── 1. signals arrive: weak, unequal, real-world ─────────────────────────────── */}
      <g className={styles.signals}>
        {[62, 118, 174].map((y, i) => (
          <g key={y} style={{ animationDelay: `${i * 0.34}s` }} className={styles.signal}>
            <circle cx="34" cy={y} r="3.2" />
            <line x1="41" y1={y} x2="92" y2={y} className={styles.signalTail} />
          </g>
        ))}
      </g>

      {/* ── 2. evidence: the connections form, then the node verifies ────────────────── */}
      <g className={styles.evidence}>
        {[62, 118, 174].map((y, i) => (
          <path
            key={y}
            d={`M 92 ${y} C 130 ${y}, 138 118, 168 118`}
            className={styles.edge}
            style={{ animationDelay: `${1.5 + i * 0.22}s` }}
          />
        ))}
        <g className={styles.evidenceNode}>
          <circle cx="176" cy="118" r="9" className={styles.nodeRing} />
          <circle cx="176" cy="118" r="3" className={styles.nodeCore} />
        </g>
        <text x="176" y="96" className={styles.label}>
          {evidence}
        </text>
      </g>

      {/* ── 3. venture: an outline becomes a defined object ──────────────────────────── */}
      <g className={styles.venture}>
        <path d="M 185 118 L 232 118" className={styles.edge} style={{ animationDelay: "4.1s" }} />
        <rect x="232" y="98" width="42" height="40" rx="2" className={styles.ventureBox} />
        <line x1="253" y1="98" x2="253" y2="138" className={styles.ventureSpine} />
        <text x="253" y="90" className={styles.label}>
          {venture}
        </text>
      </g>

      {/* ── 4. a founding team attaches from below — people, not machinery ───────────── */}
      <g className={styles.team}>
        <path d="M 253 186 L 253 142" className={styles.edge} style={{ animationDelay: "6.0s" }} />
        <circle cx="253" cy="192" r="5.5" className={styles.teamNode} />
        <text x="253" y="212" className={styles.label}>
          {team}
        </text>
      </g>

      {/* ── 5. the company separates and stands on its own ───────────────────────────── */}
      <g className={styles.company}>
        <rect x="330" y="96" width="48" height="44" rx="2" className={styles.companyBox} />
        <circle cx="354" cy="118" r="3" className={styles.companyCore} />
        <text x="354" y="88" className={styles.label}>
          {independent}
        </text>
      </g>

      {/* ── 6. generalised capability returns to the shared layer ────────────────────── */}
      <path d="M 354 144 C 354 200, 300 250, 262 250" className={styles.returnPath} />
    </svg>
  );
}
