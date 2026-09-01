import { Fragment } from "react";

import styles from "./p5r1.module.css";
import Reveal from "./Reveal";
import SystemField from "./SystemField";
import { NetworkSystem, ProcedureSystem } from "./ProjectSystems";
import { COPY, SUPPORTED, homeHref, type Locale } from "./locale";
import { ROUTES } from "../nav";
import { THESIS } from "@/app/prototype/corporate/_content/site";

/**
 * CORP-P5R1-AMD — the AI-native corporate homepage, Japanese-default and bilingual.
 *
 * JAPANESE IS DEFAULT AND CANONICAL. Nothing here redirects on browser locale, IP, device language
 * or inferred geography; the visitor changes language only by choosing it. English is an adapted
 * sibling composition, not a fallback: `data-lang` drives a language-aware type scale rather than a
 * global shrink, so the Japanese composition is never compromised to fit English.
 *
 * Locale travels as `?lang=en` on this one URL. The Production doctrine is `/` = ja and `/en` = en,
 * but `/en` is currently the legacy consumer route and locale routing is deferred to the corporate
 * topology package. Nothing here begins that migration.
 */
/** Language selector. Two real links, always visible, 44px targets, never hover-only. */
function LangSelector({ locale }: { locale: Locale }) {
  return (
    <div className={styles.langGroup} role="group" aria-label={COPY[locale].langLabel}>
      {SUPPORTED.map((l) => (
        <a
          key={l}
          className={styles.langOption}
          href={homeHref(l)}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? "true" : undefined}
        >
          {l === "ja" ? "日本語" : "English"}
        </a>
      ))}
    </div>
  );
}

/** Numbered rows. Every grid cell is placed explicitly — auto-placement once pushed body copy into
 *  the index column and rendered Japanese one character per line. */
function Rows({ items }: { items: readonly { no: string; title: string; body: string }[] }) {
  return (
    <ol className={styles.problemGrid}>
      {items.map((b, i) => (
        <li className={styles.problemRow} key={b.no} data-motion="resolve" style={{ ["--i" as string]: i }}>
          <span className={`${styles.mono} ${styles.problemNo}`}>{b.no}</span>
          <p className={styles.problemTitle}>{b.title}</p>
          <p className={styles.problemBody}>{b.body}</p>
        </li>
      ))}
    </ol>
  );
}

/**
 * Phrase units: the browser may only break BETWEEN units, never inside a word.
 *
 * Japanese sets without spaces, so adjacent inline-block units butt together correctly. English
 * does not — without an explicit separator the units rendered as "help peopleunderstand it". The
 * separator is a real space in the text flow, so it also gives the browser a legitimate break
 * opportunity between units rather than relying on the inline-block boundary alone.
 */
function Phrase({ units, locale }: { units: readonly string[]; locale: Locale }) {
  const sep = locale === "en";
  return (
    <>
      {units.map((u, i) => (
        <Fragment key={i}>
          <span className={styles.unit}>{u}</span>
          {/* The separator must sit BETWEEN the units, not inside one. A trailing space inside an
              inline-block collapses at the box edge, which is why "help people" and "understand it"
              rendered as one word even though the space was present in the DOM. */}
          {sep && i < units.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

export default function HomeP5R1({ locale }: { locale: Locale }) {
  const c = COPY[locale];

  return (
    <div className={styles.root} data-lang={locale} lang={c.htmlLang}>
      <a className={styles.skipLink} href="#main">
        {c.skip}
      </a>

      <header className={styles.header}>
        <div className={`${styles.shell} ${styles.headerInner}`}>
          <a className={styles.wordmark} href={homeHref(locale)}>
            Yorisou
          </a>
          {/* The selector is rendered ONCE and is visible at every width. Rendering it twice —
              one copy per breakpoint — put four language links in the DOM and duplicated
              aria-current, which is a semantic defect even when only one copy is painted. */}
          <div className={styles.headerRight}>
            <nav className={styles.navDesktop} aria-label={c.navLabel}>
              {c.navItems.map((i) => (
                <a key={i.href} className={styles.navLink} href={i.href}>
                  {i.label}
                </a>
              ))}
            </nav>
            <LangSelector locale={locale} />
            <details className={styles.disclosure}>
              <summary className={styles.toggle} aria-label={c.menuToggle}>
                {c.menu}
                <span className={styles.bars} aria-hidden="true">
                  <span />
                  <span />
                </span>
              </summary>
              <nav className={styles.panel} aria-label={c.navLabelMobile}>
                {c.navItems.map((i) => (
                  <a key={i.href} className={styles.panelLink} href={i.href}>
                    {i.label}
                  </a>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main id="main" className={styles.main}>
        {/* THESIS — human field | system surface */}
        <section className={`${styles.band} ${styles.hero}`}>
          <div className={styles.env} aria-hidden="true" />
          <div className={styles.shell}>
            <div className={styles.heroGrid}>
              <Reveal className={styles.heroHuman}>
                <p className={`${styles.mono} ${styles.eyebrow}`} data-motion="signal">
                  {c.eyebrowCorporate}
                </p>
                <h1 className={styles.h1} data-motion="signal" style={{ animationDelay: "60ms" }}>
                  <Phrase units={c.thesisUnits} locale={locale} />
                </h1>
                <p className={styles.lead} data-motion="signal" style={{ animationDelay: "140ms" }}>
                  {c.leadLines.map((line, li) => (
                    <span className={styles.leadLine} key={li}>
                      <Phrase units={line} locale={locale} />
                    </span>
                  ))}
                </p>
                <ul className={styles.signals} aria-label={`${c.humanSide} — ${c.humanItems.join(" / ")}`}>
                  {c.humanItems.map((s, i) => (
                    <li className={styles.signal} key={s} data-motion="signal" style={{ animationDelay: `${220 + i * 70}ms` }}>
                      <i className={styles.signalDot} aria-hidden="true" />
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className={styles.heroSystem}>
                <div className={styles.heroSystemHead}>
                  <p className={`${styles.mono} ${styles.monoDark}`}>{c.systemSide}</p>
                  <p className={`${styles.mono} ${styles.monoDark}`}>{c.systemItems.join(" / ")}</p>
                </div>
                <div className={styles.sysFieldWrap}>
                  <SystemField locale={locale} />
                </div>
                {/* Structural caption. Names the two sides using approved labels; claims nothing. */}
                <p className={`${styles.mono} ${styles.monoDark}`}>{c.fieldCaption}</p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className={`${styles.band} ${styles.bandRule}`} id="problem">
          <div className={styles.shell}>
            <Reveal>
              <p className={`${styles.mono} ${styles.eyebrow}`} data-motion="signal">
                {c.eyebrowProblem}
              </p>
              <h2 className={styles.h2} data-motion="signal" style={{ animationDelay: "60ms" }}>
                <Phrase units={c.headingProblem} locale={locale} />
              </h2>
              <Rows items={c.problems} />
            </Reveal>
          </div>
        </section>

        {/* PORTFOLIO — two system grammars */}
        <section className={`${styles.band} ${styles.bandRule}`} id="projects">
          <div className={styles.shell}>
            <Reveal>
              <p className={`${styles.mono} ${styles.eyebrow}`} data-motion="signal">
                {c.eyebrowProjects}
              </p>
              <h2 className={styles.h2} data-motion="signal" style={{ animationDelay: "60ms" }}>
                <Phrase units={c.headingProjects} locale={locale} />
              </h2>
            </Reveal>

            <div className={styles.portfolio}>
              <Reveal className={styles.project} as="figure">
                <div className={`${styles.projectSystem} ${styles.projectSystemNet}`}>
                  <NetworkSystem locale={locale} />
                </div>
                <div className={styles.projectMeta}>
                  <div className={styles.projectHead}>
                    <h3 className={styles.projectName}>{c.miraiName}</h3>
                    <span className={styles.stage}>{c.miraiStage}</span>
                  </div>
                  <p className={styles.projectLine}>
                    <Phrase units={c.miraiLine} locale={locale} />
                  </p>
                  <Rows items={c.miraiParties} />
                  <div className={styles.boundary}>
                    <p className={styles.boundaryTitle}>{c.miraiBoundaryTitle}</p>
                    <p className={styles.boundaryBody}>{c.miraiBoundary}</p>
                  </div>
                  <a className={styles.more} href={ROUTES.miraiMove}>
                    {c.more(c.miraiName)}
                  </a>
                </div>
              </Reveal>

              <Reveal className={styles.project} as="figure">
                <div className={`${styles.projectSystem} ${styles.projectSystemProc}`}>
                  <ProcedureSystem locale={locale} />
                </div>
                <div className={styles.projectMeta}>
                  <div className={styles.projectHead}>
                    <h3 className={styles.projectName}>{c.kakariName}</h3>
                    <span className={styles.stage}>{c.kakariStage}</span>
                  </div>
                  <p className={styles.projectLine}>
                    <Phrase units={c.kakariLine} locale={locale} />
                  </p>
                  <Rows items={c.kakariSteps} />
                  <div className={styles.boundary}>
                    <p className={styles.boundaryTitle}>{c.kakariBoundaryTitle}</p>
                    <p className={styles.boundaryBody}>{c.kakariBoundary}</p>
                  </div>
                  <a className={styles.more} href={ROUTES.kakari}>
                    {c.more(c.kakariName)}
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* APPROACH — constraints on the system surface */}
        <section className={styles.constraints} id="approach">
          <div className={styles.shell}>
            <Reveal>
              <div className={styles.constraintsHead}>
                <p className={`${styles.mono} ${styles.monoDark}`} data-motion="signal">
                  {c.eyebrowApproach}
                </p>
                <h2 className={`${styles.h2} ${styles.h2OnDark}`} data-motion="signal" style={{ animationDelay: "60ms" }}>
                  <Phrase units={c.headingApproach} locale={locale} />
                </h2>
              </div>
              <div className={styles.constraintGrid}>
                {c.methods.map((m, i) => (
                  <div className={styles.constraint} key={m.no} data-motion="resolve" style={{ ["--i" as string]: i }}>
                    <span className={styles.constraintNo}>{m.no}</span>
                    <p className={styles.constraintTitle}>{m.title}</p>
                    <p className={styles.constraintBody}>{m.body}</p>
                  </div>
                ))}
              </div>
              <details className={styles.disclose}>
                <summary className={styles.discloseSummary}>{c.discloseMethods}</summary>
                <div className={styles.discloseBody}>
                  {c.methodsLong.map((m) => (
                    <p key={m.no} style={{ marginBottom: 14 }}>
                      <strong>
                        {m.no} {m.title}
                      </strong>
                      <br />
                      {m.long}
                    </p>
                  ))}
                </div>
              </details>
            </Reveal>
          </div>
        </section>

        {/* COMPANY — the resolve */}
        <section className={styles.resolveBand} id="company">
          <div className={styles.shell}>
            <Reveal>
              <p className={`${styles.mono} ${styles.eyebrow}`} data-motion="signal">
                {c.eyebrowCompany}
              </p>
              <h2 className={styles.h2} data-motion="signal" style={{ animationDelay: "60ms" }}>
                <Phrase units={c.headingCompany} locale={locale} />
              </h2>
              <p className={styles.body} data-motion="signal" style={{ animationDelay: "120ms" }}>
                {c.companyBody}
              </p>
              <a className={styles.more} href={ROUTES.about}>
                {c.aboutLink}
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <div className={styles.footerGrid}>
            <div>
              <p className={`${styles.mono} ${styles.footerTitle}`}>Yorisou</p>
              <p className={styles.footerThesis}>{locale === "en" ? c.thesisUnits.join(" ") : THESIS}</p>
            </div>
            <div>
              <p className={`${styles.mono} ${styles.footerTitle}`}>{c.footProjects}</p>
              <ul className={styles.footerList}>
                <li><a className={styles.footerLink} href={ROUTES.miraiMove}>Mirai Move</a></li>
                <li><a className={styles.footerLink} href={ROUTES.kakari}>Kakari</a></li>
              </ul>
            </div>
            <div>
              <p className={`${styles.mono} ${styles.footerTitle}`}>{c.footCompany}</p>
              <ul className={styles.footerList}>
                <li><a className={styles.footerLink} href={ROUTES.about}>{c.footAbout}</a></li>
                <li><a className={styles.footerLink} href={ROUTES.company}>{c.footCompanyInfo}</a></li>
                <li><a className={styles.footerLink} href={ROUTES.contact}>{c.footContact}</a></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBase}>
            <span className={styles.badge}>{c.previewBadge}</span>
            <span>{c.pendingNote}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
