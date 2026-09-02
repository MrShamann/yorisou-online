import Image from "next/image";
import type { ReactNode } from "react";

import styles from "./site.module.css";
import LanguageSelector from "./LanguageSelector";
import { VentureName } from "./pieces";
import { localeEntry, localeHref } from "../i18n/locales";
import type { SiteCopy } from "../i18n/types";

export const ROUTES = {
  home: "/",
  ventures: "/ventures",
  miraiMove: "/mirai-move",
  kakari: "/kakari",
  chigamo: "/chigamo",
  /**
   * CORP-v1.2 — "How we build" keeps the /about URL on purpose.
   *
   * /about is one of only four paths anchored in robots.ts as crawlable (CORP-P4AR2), and the
   * venture paths are anchored the same way. Renaming them would either break that accepted policy
   * or quietly create new indexable URLs. The nav LABEL changes to "how we build"; the URL does not.
   * The Production rename is recorded as a decision in CORP_V12_ROUTE_AND_SURFACE_MATRIX.md.
   */
  about: "/about",
  buildWithUs: "/build-with-us",
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
  /**
   * CORP-v1.2 navigation: six destinations. Individual ventures live under Ventures rather than at
   * the top level, and Asterion is a section inside "how we build" — never a nav item, because it
   * is not a Yorisou venture.
   *
   * The labels come from the section eyebrows rather than from chrome.nav so that adding the two
   * new destinations needs no new chrome strings in twenty-one locale files.
   */
  const nav = [
    { href: ROUTES.ventures, label: copy.ventures.eyebrow },
    { href: ROUTES.about, label: copy.foundry.eyebrow },
    { href: ROUTES.buildWithUs, label: copy.buildWithUs.eyebrow },
    { href: ROUTES.company, label: c.nav.company },
    { href: ROUTES.contact, label: c.nav.contact },
  ];
  /*
   * CORP-v1.4R1 — the primary action leaves the link run.
   *
   * The bordered "build with us" link sat THIRD OF FIVE inside the nav, so a boxed element
   * interrupted the row of plain links and every header read as five items of competing weight plus
   * a globe. Desktop now renders the four plain destinations as one even run and seats the action at
   * the right, next to the language control, where a reader's eye finishes. Nothing is added or
   * removed — same five destinations, same order on mobile, same bordered (not filled) treatment.
   */
  const navPrimary = nav.filter((i) => i.href !== ROUTES.buildWithUs);
  const navAction = nav.find((i) => i.href === ROUTES.buildWithUs)!;

  return (
    <div className={styles.root} lang={entry.code} dir={entry.direction} data-script={entry.script}>
      <a className={styles.skipLink} href="#main">
        {c.skip}
      </a>

      <header className={styles.header}>
        <div className={`${styles.shell} ${styles.headerInner}`}>
          {/*
            CORP-v1.2R3 — the real lockup replaces the text wordmark.

            The asset is a STACKED square lockup (symbol over wordmark over tagline) with no
            horizontal or vector variant, and §1.3 forbids cropping it. So the header is sized around
            the artwork rather than the artwork being cut to fit a short bar: at 46px the symbol and
            wordmark both read, and the strapline resolves as texture. The alt text carries the name,
            so the wordmark is not duplicated in text beside it.
          */}
          <a className={styles.wordmarkLink} href={localeHref(ROUTES.home, locale)}>
            <Image
              src="/brand/yorisou-logo.png"
              alt="Yorisou"
              width={1254}
              height={1254}
              priority
              sizes="120px"
              className={styles.headerLogo}
            />
          </a>

          <div className={styles.headerRight}>
            <nav className={styles.navDesktop} aria-label={c.navLabel}>
              {navPrimary.map((i) => (
                <a
                  key={i.href}
                  className={styles.navLink}
                  href={localeHref(i.href, locale)}
                  aria-current={path === i.href ? "page" : undefined}
                >
                  {i.label}
                </a>
              ))}
              {/*
                CORP-v1.2R2 — participation is the primary action, so "build with us" is set apart
                from the other links. Deliberately a bordered link, not a filled conversion button:
                there is no application process behind it, and an aggressive CTA would imply one.

                It stays INSIDE the nav landmark: it is a destination, and moving it out would drop
                it from the navigation for a screen-reader user browsing by landmark.
              */}
              <a
                className={styles.navCta}
                href={localeHref(navAction.href, locale)}
                aria-current={path === navAction.href ? "page" : undefined}
              >
                {navAction.label}
              </a>
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
              <Image
                src="/brand/yorisou-logo.png"
                alt="Yorisou"
                width={1254}
                height={1254}
                sizes="160px"
                className={styles.footerLogo}
              />
              <p className={styles.footerTagline}>{c.footerTagline}</p>
            </div>
            <div>
              <p className={styles.mono} style={{ marginBottom: 8 }}>
                {c.footerProjects}
              </p>
              <ul className={styles.footerList}>
                <li>
                  <a className={styles.footerLink} href={localeHref(ROUTES.miraiMove, locale)}>
                    <VentureName name="Mirai Move" reading={copy.mirai.reading} size="compact" as="p" />
                  </a>
                </li>
                <li>
                  <a className={styles.footerLink} href={localeHref(ROUTES.kakari, locale)}>
                    <VentureName name="Kakari" reading={copy.kakari.reading} size="compact" as="p" />
                  </a>
                </li>
                <li>
                  <a className={styles.footerLink} href={localeHref(ROUTES.chigamo, locale)}>
                    <VentureName name="Chigamo" reading={copy.chigamo.reading} size="compact" as="p" />
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
          {/*
            CORP-v1.4.1 — the Preview badge is gated on the deployment environment.

            It rendered unconditionally, so from the moment `yorisou.online` went live every
            corporate page in all twenty-one languages told visitors the site was not published
            ("Preview — not published" / 「Preview — 未公開」). That was true while the site was
            Preview-only, and became a factual misstatement the instant it shipped.

            `VERCEL_ENV` is the signal this project already uses for exactly this question — see
            `app/api/build-identity/route.ts` and `lib/life-os/access.ts`. Shell is a server
            component, so reading it here is safe: the variable is deliberately not `NEXT_PUBLIC_`
            and never reaches a client bundle.

            IT FAILS TOWARD SILENCE. Any value other than "preview" — production, development, or
            the variable being absent altogether — renders no badge. The dangerous direction, a live
            site calling itself unpublished, is therefore unreachable; the worst case is a Preview
            deployment missing a reviewer convenience.

            A "Production" or "Live" badge is deliberately NOT substituted. A corporate site does
            not announce its own deployment state.
          */}
          <div className={styles.footerBase}>
            {process.env.VERCEL_ENV === "preview" && (
              <span className={styles.badge}>{c.previewBadge}</span>
            )}
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
