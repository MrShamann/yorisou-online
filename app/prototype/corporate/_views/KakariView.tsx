import styles from "../corporate.module.css";
import CorporateShell from "../_components/CorporateShell";
import { Eyebrow, Section, StageLabel } from "../_components/pieces";
import { PhraseHeading, ProcedureFlow } from "../_components/visuals";
import { HEADING_UNITS, KAKARI, MIRAI_MOVE, type RouteSet } from "../_content/site";

/** CORP-P4A — one implementation, rendered at whichever URL set it is given. */
export default function KakariView({ routes }: { routes: RouteSet }) {
  const p = KAKARI;
  return (
    <CorporateShell routes={routes} current={routes.kakari}>
      <Section first>
        <Eyebrow>事業 02</Eyebrow>
        <h1 className={styles.productName}>{p.name}</h1>
        <p className={styles.productDomain}>{p.domain}</p>
        <div className={styles.stageRow}>
          <StageLabel>{p.stage}</StageLabel>
        </div>
        <PhraseHeading as="h2" units={p.lineUnits} className={styles.productLine} />
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
        <Eyebrow>支援する手順</Eyebrow>
        <PhraseHeading units={HEADING_UNITS.kakariFlow} className={styles.h2} />
        {/* R1-3 — the professional boundary is carried by the flow's terminal gate, not repeated as
            a second block beneath it. One complete statement, at the point the procedure stops. */}
        <ProcedureFlow />
      </Section>

      <Section tint>
        <Eyebrow>もうひとつの事業</Eyebrow>
        <h2 className={styles.h2}>{MIRAI_MOVE.name}</h2>
        <p className={styles.body}>{MIRAI_MOVE.line}</p>
        <p className={styles.productMore}>
          <a className={styles.textLink} href={routes.miraiMove}>
            {MIRAI_MOVE.name} について
          </a>
        </p>
      </Section>
    </CorporateShell>
  );
}
