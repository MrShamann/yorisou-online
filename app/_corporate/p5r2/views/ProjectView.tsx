import styles from "../site.module.css";
import { Band, Boundary, Cards, Eyebrow, TextLink } from "../pieces";
import { NetworkSystem, ProcedureSystem } from "../systems";
import { Phrase, ROUTES } from "../Shell";
import { localeHref } from "../../i18n/locales";
import type { SiteCopy } from "../../i18n/types";

/** CORP-P5R2 — one project page, parameterised. Both keep their own system grammar. */
export default function ProjectView({
  copy, locale, which,
}: { copy: SiteCopy; locale: string; which: "mirai" | "kakari" }) {
  const isNet = which === "mirai";
  const p = isNet ? copy.mirai : copy.kakari;
  const L = (x: string) => localeHref(x, locale);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroField} aria-hidden="true" />
        <div className={styles.shell}>
          <div className={styles.heroGrid}>
            <div>
              <Eyebrow>{p.eyebrow} — {p.domain}</Eyebrow>
              <h1 className={styles.h1}><Phrase units={p.heading} locale={locale} /></h1>
              <p className={styles.projectHead} style={{ marginTop: 0 }}>
                <span className={styles.stage}>{p.stage}</span>
              </p>
              <p className={`${styles.lead} ${styles.jp}`}>{p.lead}</p>
              {isNet && (
                <p style={{ marginTop: 22 }}>
                  <a className={styles.textLink} href={copy.mirai.siteUrl} target="_blank" rel="noopener noreferrer">
                    {copy.mirai.siteLabel}
                    <span className={styles.arrow} aria-hidden="true">↗</span>
                  </a>
                </p>
              )}
            </div>
            <div className={styles.surface}>
              {isNet ? (
                <NetworkSystem labels={copy.mirai.parties.map((x) => x.title)} centre={copy.mirai.centre} />
              ) : (
                <ProcedureSystem steps={copy.kakari.steps.map((s) => s.title)} boundary={copy.kakari.boundaryTitle} />
              )}
            </div>
          </div>
        </div>
      </section>

      <Band line>
        <Eyebrow>{isNet ? copy.mirai.networkEyebrow : copy.kakari.procedureEyebrow}</Eyebrow>
        <h2 className={styles.h2}>
          <Phrase units={isNet ? copy.mirai.networkHeading : copy.kakari.procedureHeading} locale={locale} />
        </h2>
        <Cards items={isNet ? copy.mirai.parties : copy.kakari.steps} columns={2} />
        <Boundary title={p.boundaryTitle}>{p.boundaryBody}</Boundary>
      </Band>

      <Band tint>
        <div className={styles.cards} style={{ gridTemplateColumns: "1fr" }}>
          {p.detail.map((d) => (
            <div key={d.heading}>
              <h3 className={styles.h3}>{d.heading}</h3>
              <p className={`${styles.body} ${styles.jp}`}>{d.body}</p>
            </div>
          ))}
        </div>
        <TextLink href={L(ROUTES.home)}>{copy.common.backHome}</TextLink>
      </Band>
    </>
  );
}
