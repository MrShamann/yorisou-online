import type { ReactNode } from "react";

import styles from "./site.module.css";
import LanguageSelector from "./LanguageSelector";
import { localeEntry, localeHref } from "../i18n/locales";
import type { SiteCopy } from "../i18n/types";

export const ROUTES = {
  home: "/",
  miraiMove: "/mirai-move",
  kakari: "/kakari",
  about: "/about",
  company: "/company",
  contact: "/contact",
} as const;

/**
 * CORP-P5R2 — the shell shared by all six corporate routes in every locale.
 *
 * `lang` and `dir` are set from the locale registry, so Arabic renders right-to-left as a property
 * of the document rather than as translated text inside a left-to-right frame. `data-script` lets
 * the stylesheet tune leading, tracking and word-breaking per writing system without shipping a
 * separate stylesheet per locale.
 *
 * Every navigation link is passed through `localeHref`, so the selected language survives navigation
 * across the whole corporate surface — the failure mode the acceptance gate calls out explicitly.
 */
export default function Shell({
  copy,
  locale,
  path,
  children,
}: {
  copy: SiteCopy;
  locale: string;
  path: string;
  children: ReactNode;
}) {
  const entry = localeEntry(locale);
  const c = copy.chrome;
  const nav = [
    { href: ROUTES.miraiMove, label: c.nav.miraiMove },
    { href: ROUTES.kakari, label: c.nav.kakari },
    { href: ROUTES.about, label: c.nav.about },
    { href: ROUTES.company, label: c.nav.company },
    { href: ROUTES.contact, label: c.nav.contact },
  ];

  return (
    <div className={styles.root} lang={entry.code} dir={entry.direction} data-script={entry.script}>
      <a className={styles.skipLink} href="#main">
        {c.skip}
      </a>

      <header className={styles.header}>
        <div className={`${styles.shell} ${styles.headerInner}`}>
          <a className={styles.wordmark} href={localeHref(ROUTES.home, locale)}>
            Yorisou
          </a>

          <div className={styles.headerRight}>
            <nav className={styles.navDesktop} aria-label={c.navLabel}>
              {nav.map((i) => (
                <a
                  key={i.href}
                  className={styles.navLink}
                  href={localeHref(i.href, locale)}
                  aria-current={path === i.href ? "page" : undefined}
                >
                  {i.label}
                </a>
              ))}
            </nav>

            <LanguageSelector
              locale={locale}
              path={path}
              labels={{
                langLabel: c.langLabel,
                langHeading: c.langHeading,
                langSearch: c.langSearch,
                langCurrent: c.langCurrent,
                close: c.close,
              }}
            />

            <details className={styles.disclosure}>
              <summary className={`${styles.iconBtn} ${styles.menuBtn}`} aria-label={c.menuToggle}>
                {c.menu}
                <span className={styles.bars} aria-hidden="true">
                  <span />
                  <span />
                </span>
              </summary>
              <nav className={styles.panel} aria-label={c.navLabelMobile}>
                {nav.map((i) => (
                  <a
                    key={i.href}
                    className={styles.panelLink}
                    href={localeHref(i.href, locale)}
                    aria-current={path === i.href ? "page" : undefined}
                  >
                    {i.label}
                  </a>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main id="main" className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <div className={styles.footerGrid}>
            <div>
              <p className={`${styles.mono}`} style={{ marginBottom: 12 }}>
                Yorisou
              </p>
              <p className={styles.footerTagline}>{c.footerTagline}</p>
            </div>
            <div>
              <p className={styles.mono} style={{ marginBottom: 8 }}>
                {c.footerProjects}
              </p>
              <ul className={styles.footerList}>
                <li>
                  <a className={styles.footerLink} href={localeHref(ROUTES.miraiMove, locale)}>
                    Mirai Move
                  </a>
                </li>
                <li>
                  <a className={styles.footerLink} href={localeHref(ROUTES.kakari, locale)}>
                    Kakari
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className={styles.mono} style={{ marginBottom: 8 }}>
                {c.footerCompany}
              </p>
              <ul className={styles.footerList}>
                <li>
                  <a className={styles.footerLink} href={localeHref(ROUTES.about, locale)}>
                    {c.nav.about}
                  </a>
                </li>
                <li>
                  <a className={styles.footerLink} href={localeHref(ROUTES.company, locale)}>
                    {c.nav.company}
                  </a>
                </li>
                <li>
                  <a className={styles.footerLink} href={localeHref(ROUTES.contact, locale)}>
                    {c.nav.contact}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBase}>
            <span className={styles.badge}>{c.previewBadge}</span>
            <span>{c.footerLegalNote}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Phrase units: a break may only fall BETWEEN units, never inside a word.
 *
 * Japanese and Chinese are written without spaces between words, so their units must butt directly
 * against one another. Korean is NOT: it is written with spaces between words, and joining its units
 * without one produced run-together text such as "\uacbf\uc744\ub9cc\ub4ed\ub2c8\ub2e4" for
 * "\uacbf\uc744 \ub9cc\ub4ed\ub2c8\ub2e4". Only the three genuinely space-free scripts are
 * listed here; every other writing system, Korean included, gets the separating space.
 */
const SPACE_FREE_SCRIPTS = new Set(["Jpan", "Hans", "Hant"]);

export function Phrase({ units, locale }: { units: readonly string[]; locale: string }) {
  const spaced = !SPACE_FREE_SCRIPTS.has(localeEntry(locale).script);
  return (
    <>
      {units.map((u, i) => (
        <span key={i}>
          <span className={styles.unit}>{u}</span>
          {spaced && i < units.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}
