import styles from "./foundry-field.module.css";

/**
 * CORP-v1.2R3 — the Foundry Motion Field, refounded for frame-zero comprehension.
 *
 * The operating model, stated as a single readable object:
 *
 *   signals arrive → evidence connects and verifies → a venture becomes defined →
 *   a founding team attaches → the company separates and stands on its own →
 *   the generalised capability returns to the shared infrastructure layer
 *
 * R2 revealed this over ~11 seconds. Benchmarking showed why that fails: every site that lands its
 * hook is fully legible in a still frame, and a visitor who looks for three seconds and leaves got
 * nothing from a sequence that delivered its point last. **Every element is now drawn at its final
 * state at frame zero.** The ~3.4s loop only pulses jade along the chain, confirming the reading
 * order rather than withholding it, and reduced motion simply stops with nothing lost.
 *
 * The remaining constraints are unchanged from R2 and still hold:
 *
 * - No fake data. Nothing is labelled live, real-time, or an activity count. The only text is
 *   Foundry stage names, which are real process vocabulary.
 * - Asterion is the floor UNDER the flow — it receives capability back and never drives the
 *   ventures or owns them.
 * - Pure SVG + CSS. No animation library, no Lottie, no WebGL, no video, no JavaScript, which is
 *   why it costs nothing at runtime.
 * - Labels come from `foundry.stages`, already present in all 21 locales, so it is fully localised
 *   without adding a translatable string.
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
        {/*
          Inset further than the rule it labels. The Arabic string is the longest of the 21 and was
          reaching the canvas edge at 375px; starting it further in gives every locale room without
          moving the rule itself.
        */}
        <text x="64" y="266" className={styles.baseLabel}>
          {infrastructure}
        </text>
        {[110, 190, 270, 350].map((x) => (
          <rect key={x} x={x} y="245" width="10" height="10" className={styles.baseCell} />
        ))}
      </g>

      {/* ── 1. signals arrive: weak, unequal, real-world ─────────────────────────────── */}
      <g className={styles.signals}>
        {[62, 118, 174].map((y) => (
          <g key={y} className={styles.signal}>
            <circle cx="34" cy={y} r="3.2" />
            <line x1="41" y1={y} x2="92" y2={y} className={styles.signalTail} />
          </g>
        ))}
      </g>

      {/* ── 2. evidence: the connections form, then the node verifies ────────────────── */}
      <g className={styles.evidence}>
        {[62, 118, 174].map((y) => (
          <path key={y} d={`M 92 ${y} C 130 ${y}, 138 118, 168 118`} className={styles.edge} />
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
        <path d="M 185 118 L 232 118" className={styles.edge} />
        <rect x="232" y="98" width="42" height="40" rx="2" className={styles.ventureBox} />
        <line x1="253" y1="98" x2="253" y2="138" className={styles.ventureSpine} />
        <text x="253" y="90" className={styles.label}>
          {venture}
        </text>
      </g>

      {/* ── 4. a founding team attaches from below — people, not machinery ───────────── */}
      <g className={styles.team}>
        <path d="M 253 186 L 253 142" className={styles.edge} />
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
