import type { ReactNode } from "react";

import styles from "./site.module.css";
import { ventureCounts } from "../brand";
import { VentureMark } from "./VentureMark";

/**
 * CORP-v1.4R1 — `quiet` is a DENSITY mode, not another colour.
 *
 * Every band had roughly the same vertical padding, so the page scrolled as "here is the next
 * part" nine times over. Density is now deliberate: a quiet band gets far more space and carries
 * one statement, so the dense surfaces on either side of it read as arrivals rather than as the
 * next item in a list.
 */
export function Band({
  children, id, tint, line, dark, quiet,
}: { children: ReactNode; id?: string; tint?: boolean; line?: boolean; dark?: boolean; quiet?: boolean }) {
  return (
    <section
      id={id}
      className={[styles.band, tint ? styles.bandTint : "", line ? styles.bandLine : "", dark ? styles.bandDark : "", quiet ? styles.bandQuiet : ""]
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

/**
 * CORP-v1.2R2 — the venture state triad: what is true NOW, the evidenced NEXT step, and WHO we want
 * to hear from.
 *
 * Rendered as a definition list and always visible. The brief allows hover and touch to reveal it,
 * but essential information must never be hover-only, and a keyboard user must get the same content
 * — so it is simply always there. Nothing is behind an interaction.
 */
export function StateTriad({
  labels,
  now,
  next,
  who,
}: {
  labels: { now: string; next: string; who: string };
  now: string;
  next: string;
  who: string;
}) {
  const rows = [
    { k: labels.now, v: now },
    { k: labels.next, v: next },
    { k: labels.who, v: who },
  ];
  return (
    <dl className={styles.triad}>
      {rows.map((r) => (
        <div className={styles.triadRow} key={r.k}>
          <dt className={styles.triadKey}>{r.k}</dt>
          <dd className={`${styles.triadValue} ${styles.jp}`}>{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * CORP-v1.2R2 — "work on this venture".
 *
 * The `state` line is deliberately rendered last and in the boundary style rather than as a button:
 * there is no application process, so the strongest thing on this block must be the truthful status,
 * not a call to action that would imply one.
 */
export function JoinVenture({
  title,
  body,
  roles,
  state,
  cta,
  href,
}: {
  title: string;
  body: string;
  roles: readonly string[];
  state: string;
  cta: string;
  href: string;
}) {
  return (
    <div className={styles.join}>
      <h2 className={styles.h2}>{title}</h2>
      <p className={`${styles.body} ${styles.jp}`}>{body}</p>
      <ul className={styles.founderFacts}>
        {roles.map((r) => (
          <li className={styles.jp} key={r}>
            {r}
          </li>
        ))}
      </ul>
      <p className={`${styles.joinState} ${styles.jp}`}>{state}</p>
      <a className={styles.btn} href={href}>
        {cta}
      </a>
    </div>
  );
}

/**
 * CORP-v1.2R2.1 — the venture identity unit: Latin wordmark + that venture's own Japanese line.
 *
 * One component so the treatment cannot drift between Home, Ventures, How We Build, the detail hero
 * and the footer. R2 established the wordmark stays Latin — Kakari's own glossary forbids
 * transliteration and enforces it in CI, and Mirai Move's brand source has no reading — so the
 * Japanese-ness of a Japanese page comes from the line beneath the mark, not from inventing katakana.
 *
 * `size` only changes scale, never the structure: a detail-page hero states the venture more loudly
 * than a footer link, but a reader meets the same two-level unit everywhere.
 */
export function VentureName({
  name,
  reading,
  size = "card",
  as: Tag = "h3",
}: {
  name: string;
  reading: string;
  size?: "hero" | "card" | "compact";
  /*
   * `span` exists for the Foundry spine's stage markers, which sit inside a <label>. A <p> there is
   * not phrasing content, so the identity unit could not be used at all and the marker was rendering
   * a mark beside a bare text node — which the brand-paint scan correctly reported as a mark it
   * could not attribute to any venture.
   */
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const markClass =
    size === "hero" ? styles.ventureMarkHero : size === "compact" ? styles.ventureMarkCompact : styles.projectName;
  /*
   * CORP-v1.3.1 — each venture now carries its OWN MARK, not a colour square.
   *
   * v1.3 put a 9px accent square here and drew Chigamo's as an empty outline, because it had no
   * brand source. All three now have a real identity — Mirai Move's official logo, Kakari's
   * Founder-approved 「係 / Kakari」 co-mark, and Chigamo's new Founder-approved mark — so the
   * placeholder is gone. See app/_corporate/p5r2/VentureMark.tsx.
   *
   * The mark stays aria-hidden and decorative: the wordmark and the stage are always rendered as
   * text beside it, so nothing is communicated by the mark alone.
   */
  return (
    <span className={styles.ventureName}>
      <span className={styles.ventureMarkRow}>
        <VentureMark name={name} size={size === "compact" ? "compact" : size === "hero" ? "hero" : "card"} />
        <Tag className={markClass}>{name}</Tag>
      </span>
      {reading ? <span className={`${styles.brandLine} ${styles.jp}`}>{reading}</span> : null}
    </span>
  );
}

/**
 * CORP-v1.3 — the venture COMPOSITION, computed rather than written.
 *
 * The old copy said "three areas, underway now" in twenty-one languages. Two of the three are being
 * built; the third is a hypothesis with no repository, no product and no users. Counting all three
 * as one kind of thing overstated the company by exactly one venture, and no translator could have
 * caught it, because the number was inside a sentence rather than derived from anything.
 *
 * These numbers come from `VENTURE_CLASS`, which is set from the same repository evidence as the
 * formation stages. If a venture's evidence changes, this line changes with it; if someone adds a
 * fourth venture, it counts itself. The only translated part is the two nouns.
 */
export function VentureComposition({
  building,
  concept,
  className,
}: {
  building: string;
  concept: string;
  className?: string;
}) {
  const counts = ventureCounts();
  return (
    <p className={`${styles.composition}${className ? ` ${className}` : ""}`}>
      <span className={styles.compositionPart}>
        <b className={styles.compositionCount}>{counts.building}</b> {building}
      </span>
      <span className={styles.compositionSep} aria-hidden="true" />
      <span className={styles.compositionPart}>
        <b className={styles.compositionCount}>{counts.concept}</b> {concept}
      </span>
    </p>
  );
}

/**
 * CORP-v1.2R2.1 — a venture's position in the Foundry sequence, in the SAME grammar as the hero.
 *
 * Nodes reached are filled and joined by a solid rule; nodes not yet reached are hollow and joined
 * by a dashed one. That is the whole vocabulary — node, line, state — reused from FoundryField so
 * Hero → Ventures → How We Build reads as one system rather than four.
 *
 * There are deliberately NO percentages and NO completion bars. A venture is at a named stage or it
 * is not; a number would imply a precision the evidence does not support. Nothing here is labelled
 * live, and the reached index is set from repository evidence, not from ambition.
 */
export function FormationState({
  stages,
  reached,
  label,
}: {
  stages: readonly { no: string; name: string }[];
  reached: number;
  label: string;
}) {
  return (
    <div className={styles.formation}>
      <p className={styles.formationLabel}>{label}</p>
      <ol className={styles.formationTrack}>
        {stages.map((st, i) => {
          const done = i < reached;
          const current = i === reached - 1;
          return (
            <li
              className={`${styles.formationNode} ${done ? styles.formationDone : ""} ${current ? styles.formationCurrent : ""}`}
              key={st.no}
              aria-current={current ? "step" : undefined}
            >
              <span className={styles.formationDot} aria-hidden="true" />
              <span className={styles.formationName}>{st.name}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/**
 * CORP-v1.4R1 — the quiet venture index.
 *
 * The Company page used to present the ventures as three dark numbered cards, which put a second
 * portfolio pitch on the page whose job is to be the calmest, most editorial surface on the site —
 * and repeated a presentation the Home operating field and the Ventures index both do better.
 *
 * This is the low-energy form: the same shared identity unit, each venture's own stage in its own
 * words, and a route in. No number, no box, no accent.
 */
export function VentureIndex({
  items,
}: {
  items: readonly { href: string; name: string; reading: string; stage: string }[];
}) {
  return (
    <ul className={styles.ventureIndex}>
      {items.map((v) => (
        <li className={styles.ventureIndexItem} key={v.href}>
          {/*
            THE WHOLE ROW IS THE LINK, and the arrow sits in its own column.

            Two earlier versions were worse by looking at them. The first linked the name alone and
            gave no affordance at all — three rows that read as static labels. The second put the
            arrow inside the name link, so it landed after whichever line was widest and the three
            arrows stepped raggedly across the column. A grid pins them, and a row-sized target beats
            a word-sized one.
          */}
          {/*
            NO aria-label. An aria-label REPLACES a link's inner text as its accessible name, so
            labelling this row "read more about Mirai Move" deleted the stage sentence — the one
            piece of information the row exists to carry — for anyone using assistive technology.
            The link's own content already names the venture and its stage, which is both unique and
            more informative than the label was.
          */}
          <a className={styles.ventureIndexLink} href={v.href}>
            <VentureName name={v.name} reading={v.reading} size="compact" as="p" />
            <span className={`${styles.ventureIndexStage} ${styles.jp}`}>{v.stage}</span>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
