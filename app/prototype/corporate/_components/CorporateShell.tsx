import type { ReactNode } from "react";

import styles from "../corporate.module.css";
import { NAV, ROUTES, THESIS } from "../_content/site";

/**
 * CORP-P3 F-02 — the mobile header is a native `<details>` disclosure.
 *
 * CORP-P2 let five links wrap into two exposed rows, which read as a wrapped desktop nav rather than
 * a designed mobile header. The closed state is now one row: wordmark on the left, one labelled
 * control on the right.
 *
 * `<details>/<summary>` was chosen over a client component deliberately — it is the smallest
 * solution the platform already provides. It gives keyboard operation (Enter/Space), correct
 * `aria-expanded` handling, and an accessible name for free, with no JavaScript, no client boundary,
 * no focus trap to manage, and no dependency. The page stays a fully static server component.
 *
 * At ≥768px the disclosure is hidden and the links render directly, so desktop navigation stays
 * visible and immediate — a disclosure on desktop would be a regression.
 */
export default function CorporateShell({
  children,
  current,
}: {
  children: ReactNode;
  /** Marks the active nav item for `aria-current` on both the desktop and mobile lists. */
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

          {/* Desktop — direct and visible, never behind a control. */}
          <nav className={styles.navDesktop} aria-label="サイト内ナビゲーション">
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

          {/* Mobile — one row closed, disclosure open. */}
          <details className={styles.navDisclosure}>
            <summary className={styles.navToggle} aria-label="メニューを開閉する">
              <span className={styles.navToggleLabel}>メニュー</span>
              <span className={styles.navToggleIcon} aria-hidden="true">
                <span />
                <span />
              </span>
            </summary>
            <nav className={styles.navPanel} aria-label="サイト内ナビゲーション（モバイル）">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  className={styles.navPanelLink}
                  href={item.href}
                  aria-current={current === item.href ? "page" : undefined}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </details>
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
            <span>商号・所在地・設立・代表者・法人番号は、登録情報の確認後に掲載します。</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
