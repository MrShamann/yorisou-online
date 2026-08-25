import CorporateShell from "@/app/prototype/corporate/_components/CorporateShell";
import { Eyebrow, Section } from "@/app/prototype/corporate/_components/pieces";
import styles from "@/app/prototype/corporate/corporate.module.css";
import { FINAL_ROUTES } from "@/app/prototype/corporate/_content/site";

/**
 * CORP-P4AR2 — the ONE 404 body, shared by both 404 entry points.
 *
 * There are two entry points because Next.js uses two, not because we want two:
 *   - `app/global-not-found.tsx` renders the 404 as its own document, outside the root layout. This
 *     is the normal path and the one that structurally prevents consumer chrome on a 404.
 *   - `app/not-found.tsx` is still consulted on the internal-error path taken by dynamically
 *     rendered routes that call `notFound()` (see the measured `NoFallbackError` cases in
 *     docs/yorisou/corporate/CORP_P4AR2_DYNAMIC_404_AND_ROBOTS_REMEDIATION.md). Without it those
 *     responses fall back to the ROOT layout's metadata and advertise the archived consumer
 *     product's title on a 404.
 *
 * Both render this component and nothing else, so the two cannot drift apart in content. What they
 * legitimately differ on is the document wrapper, which is the whole point of the split.
 */
export const NOT_FOUND_TITLE = "ページが見つかりません — Yorisou";

export default function NotFoundBody() {
  return (
    <CorporateShell routes={FINAL_ROUTES}>
      <Section first>
        <Eyebrow>404</Eyebrow>
        <h1 className={styles.pageTitle}>
          <span className={styles.unit}>お探しのページは</span>
          <span className={styles.unit}>見つかりませんでした。</span>
        </h1>
        <p className={styles.lead}>アドレスが変更されたか、削除された可能性があります。</p>
        <ul className={styles.plainList}>
          <li className={styles.plainListItem}>
            <a className={styles.textLink} href={FINAL_ROUTES.home}>
              ホーム
            </a>
          </li>
          <li className={styles.plainListItem}>
            <a className={styles.textLink} href={FINAL_ROUTES.miraiMove}>
              Mirai Move
            </a>
          </li>
          <li className={styles.plainListItem}>
            <a className={styles.textLink} href={FINAL_ROUTES.kakari}>
              Kakari
            </a>
          </li>
          <li className={styles.plainListItem}>
            <a className={styles.textLink} href={FINAL_ROUTES.about}>
              私たちについて
            </a>
          </li>
        </ul>
      </Section>
    </CorporateShell>
  );
}
