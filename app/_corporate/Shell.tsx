import type { ReactNode } from "react";

import styles from "./corporate.module.css";
import { CORPORATE_NAV, ROUTES } from "./nav";
import { THESIS } from "@/app/prototype/corporate/_content/site";

/**
 * CORP-P5 — the corporate shell for YORISOU LLC. PREVIEW ONLY.
 *
 * Server component. The mobile menu is a native `<details>` disclosure: keyboard operation,
 * `aria-expanded` handling and an accessible name come from the platform, with no client boundary,
 * no focus trap to maintain and no dependency. `.header` is `position: relative` because a static
 * header creates no stacking context, and that is exactly how the mobile menu became unclickable
 * once before.
 *
 * `current` marks the active item with `aria-current="page"` on both the desktop and mobile lists.
 */
export default function Shell({ children, current }: { children: ReactNode; current?: string }) {
  return (
    <div className={styles.root}>
      <a className={styles.skipLink} href="#main">
        本文へスキップ
      </a>

      <header className={styles.header}>
        <div className={`${styles.shell} ${styles.headerInner}`}>
          <a className={styles.wordmark} href={ROUTES.home}>
            Yorisou
          </a>

          <nav className={styles.navDesktop} aria-label="サイト内ナビゲーション">
            {CORPORATE_NAV.map((item) => (
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

          <details className={styles.disclosure}>
            <summary className={styles.toggle} aria-label="メニューを開閉する">
              メニュー
              <span className={styles.toggleBars} aria-hidden="true">
                <span />
                <span />
              </span>
            </summary>
            <nav className={styles.panel} aria-label="サイト内ナビゲーション（モバイル）">
              {CORPORATE_NAV.map((item) => (
                <a
                  key={item.href}
                  className={styles.panelLink}
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

      <main id="main" className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <div className={styles.footerGrid}>
            <div>
              <p className={`${styles.mono} ${styles.footerTitle}`}>Yorisou</p>
              <p className={styles.footerThesis}>{THESIS}</p>
            </div>
            <div>
              <p className={`${styles.mono} ${styles.footerTitle}`}>事業</p>
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
              <p className={`${styles.mono} ${styles.footerTitle}`}>会社</p>
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
            <span className={styles.badge}>Preview — not published</span>
            <span>商号・所在地・設立・代表者・法人番号は、登録情報の確認後に掲載します。</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
