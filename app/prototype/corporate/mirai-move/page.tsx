import type { Metadata } from "next";

import styles from "../corporate.module.css";
import CorporateShell from "../_components/CorporateShell";
import { Boundary, Eyebrow, RouteDiagram, Section, StageLabel } from "../_components/pieces";
import { KAKARI, MIRAI_MOVE, ROUTES } from "../_content/site";

export const metadata: Metadata = {
  title: "Mirai Move — Yorisou",
  description: MIRAI_MOVE.line,
  robots: { index: false, follow: false },
};

/** Every claim here traces to mirai-move/PROJECT_START_HERE.md — see the CORP-P2 claim ledger. */
export default function MiraiMovePage() {
  const p = MIRAI_MOVE;
  return (
    <CorporateShell current={ROUTES.miraiMove}>
      <Section first>
        <Eyebrow>事業 01</Eyebrow>
        <h1 className={styles.productName}>{p.name}</h1>
        <p className={styles.productDomain}>{p.domain}</p>
        <div className={styles.stageRow}>
          <StageLabel>{p.stage}</StageLabel>
        </div>
        <p className={styles.productLine}>{p.line}</p>
        <p className={styles.productBody}>{p.summary}</p>
      </Section>

      <Section tint>
        <Eyebrow>この事業について</Eyebrow>
        <dl className={styles.detailList}>
          {p.detail.map((d) => (
            <div className={styles.detailItem} key={d.heading}>
              <dt className={styles.detailHeading}>{d.heading}</dt>
              <dd className={styles.detailBody}>{d.body}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section>
        <Eyebrow>つなぐ相手</Eyebrow>
        <h2 className={styles.h2}>立場の違う相手が、同じ機会を別の言葉で見ている。</h2>
        <RouteDiagram nodes={p.flow} label={p.flowLabel} />
        <Boundary title={p.boundaryTitle}>{p.boundary}</Boundary>
      </Section>

      <Section tint>
        <Eyebrow>もうひとつの事業</Eyebrow>
        <h2 className={styles.h2}>{KAKARI.name}</h2>
        <p className={styles.body}>{KAKARI.line}</p>
        <p className={styles.productMore}>
          <a className={styles.textLink} href={ROUTES.kakari}>
            {KAKARI.name} について
          </a>
        </p>
      </Section>
    </CorporateShell>
  );
}
