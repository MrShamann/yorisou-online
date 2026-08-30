import type { ReactNode } from "react";

import styles from "./site.module.css";

export function Band({
  children, id, tint, line, dark,
}: { children: ReactNode; id?: string; tint?: boolean; line?: boolean; dark?: boolean }) {
  return (
    <section
      id={id}
      className={[styles.band, tint ? styles.bandTint : "", line ? styles.bandLine : "", dark ? styles.bandDark : ""]
        .filter(Boolean).join(" ")}
    >
      <div className={styles.shell}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return <p className={`${styles.mono} ${styles.eyebrow} ${dark ? styles.monoDark : ""}`}>{children}</p>;
}

export function Cards({
  items, columns = 3, dark,
}: {
  items: readonly { no?: string; title: string; body: string }[];
  columns?: 2 | 3;
  dark?: boolean;
}) {
  return (
    <div className={`${styles.cards} ${columns === 3 ? styles.cards3 : styles.cards2}`}>
      {items.map((it, i) => (
        <article className={`${styles.card} ${dark ? styles.cardDark : ""}`} key={it.no ?? i}>
          {it.no && <span className={styles.cardNo}>{it.no}</span>}
          <h3 className={styles.cardTitle}>{it.title}</h3>
          <p className={`${styles.cardBody} ${styles.jp}`}>{it.body}</p>
        </article>
      ))}
    </div>
  );
}

/** The limit of what a product does. A jade rule, never fine print. */
export function Boundary({
  title, children, dark,
}: { title: string; children: ReactNode; dark?: boolean }) {
  return (
    <div className={`${styles.boundary} ${dark ? styles.boundaryDark : ""}`}>
      <p className={styles.boundaryTitle}>{title}</p>
      <p className={`${styles.boundaryBody} ${styles.jp}`}>{children}</p>
    </div>
  );
}

export function Disclose({
  label, children, dark,
}: { label: string; children: ReactNode; dark?: boolean }) {
  return (
    <details className={`${styles.disclose} ${dark ? styles.discloseDark : ""}`}>
      <summary className={styles.discloseSummary}>{label}</summary>
      <div className={`${styles.discloseBody} ${styles.jp}`}>{children}</div>
    </details>
  );
}

export function Facts({ facts }: { facts: readonly { label: string; value: string }[] }) {
  return (
    <dl className={styles.facts}>
      {facts.map((f) => (
        <div className={styles.factRow} key={f.label}>
          <dt className={styles.factLabel}>{f.label}</dt>
          <dd className={styles.factValue}>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function TextLink({ href, children, dark }: { href: string; children: ReactNode; dark?: boolean }) {
  return (
    <a className={`${styles.textLink} ${dark ? styles.textLinkDark : ""}`} href={href}>
      {children}
      <span className={styles.arrow} aria-hidden="true">→</span>
    </a>
  );
}
