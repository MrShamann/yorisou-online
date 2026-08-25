import type { Metadata } from "next";

import CorporateShell from "@/app/prototype/corporate/_components/CorporateShell";
import { Eyebrow, Section } from "@/app/prototype/corporate/_components/pieces";
import styles from "@/app/prototype/corporate/corporate.module.css";
import { FINAL_ROUTES } from "@/app/prototype/corporate/_content/site";

/**
 * CORP-P4A — corporate 404 candidate. LOCAL ONLY.
 *
 * Behaviour change recorded honestly: before this package the 404 rendered the full consumer chrome
 * — YORISOU logo, 気づく/探す/わたし nav, a LINE call to action, the mobile tab bar — so every dead
 * link advertised the archived consumer product. With `/` becoming the corporate front door, that is
 * incoherent, so the 404 joins the corporate system.
 *
 * It links only to corporate routes. No consumer route is promoted, and no legacy route changes
 * behaviour — a 404 is still a 404.
 */
export const metadata: Metadata = {
  title: "ページが見つかりません — Yorisou",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <CorporateShell routes={FINAL_ROUTES}>
      <Section first>
        <Eyebrow>404</Eyebrow>
        <h1 className={styles.pageTitle}>
          <span className={styles.unit}>お探しのページは</span>
          <span className={styles.unit}>見つかりませんでした。</span>
        </h1>
        <p className={styles.lead}>
          アドレスが変更されたか、削除された可能性があります。
        </p>
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
