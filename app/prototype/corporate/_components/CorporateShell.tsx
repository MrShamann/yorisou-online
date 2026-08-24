import type { ReactNode } from "react";

import styles from "../corporate.module.css";
import { NAV, ROUTES, THESIS } from "../_content/site";

/**
 * CORP-P2 — the one chrome every corporate Preview route renders inside.
 *
 * Header, navigation, footer and the page container live here so the six routes cannot drift into
 * six slightly different designs. Still a server component: no client boundary, no state, no fetch.
 * Navigation is plain anchors, which keeps it keyboard-operable with no JavaScript at all.
 */
export default function CorporateShell({
  children,
  current,
}: {
  children: ReactNode;
  /** Marks the active nav item for `aria-current`. */
  current?: string;
}) {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#main">
        本文へスキップ
      </a>

      <header className={styles.header}>
        <div className={`${styles.shell} ${styles.headerInner}`}>
          <a className={styles.wordmark} href={ROUTES.home}>
            Yorisou
          </a>
          <nav className={styles.nav} aria-label="サイト内ナビゲーション">
            {NAV.map((item) => (
              <a
                key={item.href}
                className={styles.navLink}
                href={item.href}
                aria-current={current === item.href ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="main">{children}</main>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <div className={styles.footerGrid}>
            <div>
              <p className={styles.footerColTitle}>Yorisou</p>
              <p className={styles.footerThesis}>{THESIS}</p>
            </div>
            <div>
              <p className={styles.footerColTitle}>事業</p>
              <ul className={styles.footerList}>
                <li>
                  <a className={styles.footerLink} href={ROUTES.miraiMove}>
                    Mirai Move
                  </a>
                </li>
                <li>
                  <a className={styles.footerLink} href={ROUTES.kakari}>
                    Kakari
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className={styles.footerColTitle}>会社</p>
              <ul className={styles.footerList}>
                <li>
                  <a className={styles.footerLink} href={ROUTES.about}>
                    私たちについて
                  </a>
                </li>
                <li>
                  <a className={styles.footerLink} href={ROUTES.company}>
                    会社情報
                  </a>
                </li>
                <li>
                  <a className={styles.footerLink} href={ROUTES.contact}>
                    お問い合わせ
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBase}>
            <span className={styles.previewBadge}>Preview — not published</span>
            <span>
              商号・所在地・設立・代表者・法人番号は、登録情報の確認後に掲載します。
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
