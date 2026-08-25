import type { ReactNode } from "react";

import styles from "../corporate.module.css";
import { productHref, type Product, type RouteSet } from "../_content/site";
import { NetworkSchematic, ProcedureFlow } from "./visuals";

/**
 * CORP-P2 shared pieces. Every one is a server component with no state and no client boundary.
 * These exist so the six routes share one rhythm, one type scale and one stage-label treatment —
 * not so the homepage can be pasted into five files.
 */

export function Section({
  children,
  id,
  first,
  tint,
}: {
  children: ReactNode;
  id?: string;
  first?: boolean;
  tint?: boolean;
}) {
  return (
    <section
      id={id}
      className={[styles.section, first ? styles.sectionFirst : "", tint ? styles.sectionTint : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.shell}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className={styles.eyebrow}>{children}</p>;
}

/** The top of every non-home route: eyebrow, H1, and a single orienting sentence. */
export function PageIntro({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <Section first>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className={styles.pageTitle}>{title}</h1>
      <p className={styles.lead}>{lead}</p>
    </Section>
  );
}

/**
 * Stage label. This is the honesty device of the whole site: neither product may be presented
 * without the exact stage truth its own canonical source proves.
 */
export function StageLabel({ children }: { children: ReactNode }) {
  return (
    <span className={styles.stage}>
      <i className={styles.dot} aria-hidden="true" />
      {children}
    </span>
  );
}

/**
 * The limit of what a product does, rendered as a first-class block. Kakari's professional boundary
 * and Mirai Move's development status are governance requirements, not fine print, so they get the
 * same visual weight as the description above them.
 */
export function Boundary({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.boundary}>
      <p className={styles.boundaryTitle}>{title}</p>
      <p className={styles.boundaryBody}>{children}</p>
    </div>
  );
}

/** Route line + nodes — the "quiet infrastructure" motif. Decorative; the caption carries the text. */
export function RouteDiagram({ nodes, label }: { nodes: readonly string[]; label: string }) {
  const span = 100 / (nodes.length - 1 || 1);
  return (
    <>
      <svg
        className={styles.diagram}
        viewBox="0 0 100 18"
        preserveAspectRatio="none"
        role="img"
        aria-label={label}
      >
        <line
          x1="0"
          y1="9"
          x2="100"
          y2="9"
          stroke="rgba(12,14,13,0.16)"
          strokeWidth="0.25"
          vectorEffect="non-scaling-stroke"
        />
        {nodes.map((_, i) => (
          <circle
            key={i}
            className={i === nodes.length - 1 ? styles.signal : undefined}
            cx={i * span}
            cy="9"
            r="0.9"
            fill={i === nodes.length - 1 ? "#2f6b5e" : "rgba(12,14,13,0.28)"}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <p className={styles.diagramCaption} aria-hidden="true">
        {nodes.join("　→　")}
      </p>
    </>
  );
}

/**
 * A blocked state that is designed rather than apologised for. The identifier is shown on purpose:
 * a reader should be able to see *why* something is absent, and the Founder should be able to see
 * exactly which blocker to clear.
 */
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
      <p className={styles.pendingCode}>
        <i className={styles.pendingMark} aria-hidden="true" />
        {code}
      </p>
      <p className={styles.pendingHeadline}>{headline}</p>
      <p className={styles.pendingNote}>{body}</p>
      {fields && fields.length > 0 && (
        <ul className={styles.pendingList}>
          {fields.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * The product block used on the homepage. Each product gets a full-width composition with its own
 * accent side, never a card in a grid — the two businesses must not read as interchangeable.
 */
export function ProductComposition({
  product,
  index,
  routes,
}: {
  product: Product;
  index: number;
  routes: RouteSet;
}) {
  return (
    <article className={`${styles.product} ${index === 1 ? styles.productAlt : ""}`}>
      <div className={styles.shell}>
        <Eyebrow>{`事業 0${index + 1}`}</Eyebrow>
        {/* CORP-P3 F-03 — two columns from 1024px. Stacking the description above a full-width
            diagram was the single largest contributor to homepage height; side by side, the same
            content reads faster and the section stops reserving a screen of empty ground. */}
        <div className={styles.productGrid}>
          <div className={styles.productMain}>
            <div className={styles.productHead}>
              <div>
                <h2 className={styles.productName}>{product.name}</h2>
                <p className={styles.productDomain}>{product.domain}</p>
              </div>
              <StageLabel>{product.stage}</StageLabel>
            </div>
            <p className={styles.productLine}>{product.line}</p>
            <p className={styles.productBody}>{product.summary}</p>
            {/* CORP-P3R1 R1-3 — Kakari's limit now lives inside its procedure gate, so rendering a
                second Boundary block here would state the same thing twice. Mirai Move keeps its
                block: its limit is a development status, not a step in a flow, so it has nowhere
                else to live. */}
            {product.key === "mirai-move" && (
              <Boundary title={product.boundaryTitle}>{product.boundary}</Boundary>
            )}
            <p className={styles.productMore}>
              <a className={styles.textLink} href={productHref(product, routes)}>
                {product.name} について詳しく
              </a>
            </p>
          </div>
          {/* CORP-P3 F-04 — the two products no longer share one diagram shape. Mirai Move gets a
              radial relationship schematic, Kakari a vertical procedural flow ending at a boundary
              gate. Structurally different, so they cannot read as interchangeable. */}
          <div className={styles.productAside}>
            {product.key === "mirai-move" ? (
              <NetworkSchematic compact />
            ) : (
              <ProcedureFlow compact />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
