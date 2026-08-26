import type { ReactNode } from "react";

import styles from "./corporate.module.css";

/** A section band. `first` removes the top rule so the page does not open with a line. */
export function Section({
  children,
  id,
  first,
  seam,
}: {
  children: ReactNode;
  id?: string;
  first?: boolean;
  /** Render the seam behind this section. Decorative and inert — never intercepts pointers. */
  seam?: boolean;
}) {
  return (
    <section
      id={id}
      className={`${styles.section} ${first ? styles.sectionFirst : ""} ${seam ? styles.seamHost : ""}`}
    >
      {seam && (
        <div className={styles.seam} aria-hidden="true">
          <span className={styles.seamDot} style={{ top: "28%" }} />
          <span className={styles.seamDot} style={{ top: "72%" }} />
        </div>
      )}
      <div className={styles.shell}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className={`${styles.mono} ${styles.eyebrow}`}>{children}</p>;
}

/** A heading composed of phrase units, so a Japanese word can never break mid-morpheme. */
export function PhraseHeading({
  units,
  as = "h2",
}: {
  units: readonly string[];
  as?: "h1" | "h2";
}) {
  const Tag = as;
  return (
    <Tag className={as === "h1" ? styles.h1 : styles.h2}>
      {units.map((u, i) => (
        <span className={styles.unit} key={i}>
          {u}
        </span>
      ))}
    </Tag>
  );
}

export function PhraseLead({ lines }: { lines: readonly (readonly string[])[] }) {
  return (
    <p className={styles.lead}>
      {lines.map((line, li) => (
        <span className={styles.leadLine} key={li}>
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

export function Rows({ items }: { items: readonly { no: string; title: string; body: string }[] }) {
  return (
    <ol className={styles.rows}>
      {items.map((it) => (
        <li className={styles.row} key={it.no}>
          <span className={`${styles.mono} ${styles.rowNo}`}>{it.no}</span>
          <p className={styles.rowTitle}>{it.title}</p>
          <p className={`${styles.rowBody} ${styles.jp}`}>{it.body}</p>
        </li>
      ))}
    </ol>
  );
}

/** The limit of what a product does — a first-class block, never fine print. */
export function Boundary({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.boundary}>
      <p className={styles.boundaryTitle}>{title}</p>
      <p className={`${styles.boundaryBody} ${styles.jp}`}>{children}</p>
    </div>
  );
}

/** A blocked state that is designed rather than apologised for. The blocker id is shown on purpose. */
export function PendingState({
  code,
  headline,
  body,
  fields,
}: {
  code: string;
  headline: string;
  body: string;
  fields?: readonly string[];
}) {
  return (
    <div className={styles.pending}>
      <p className={`${styles.mono} ${styles.pendingCode}`}>{code}</p>
      <p className={styles.h3}>{headline}</p>
      <p className={`${styles.boundaryBody} ${styles.jp}`}>{body}</p>
      {fields && fields.length > 0 && (
        <ul className={styles.pendingList}>
          {fields.map((f) => (
            <li key={f}>
              {f}
              <span>未掲載</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Disclose({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className={styles.disclose}>
      <summary className={styles.discloseSummary}>{label}</summary>
      <div className={`${styles.discloseBody} ${styles.jp}`}>{children}</div>
    </details>
  );
}
