import styles from "../site.module.css";
import { Band, Boundary, Cards, Eyebrow, TextLink } from "../pieces";
import { NetworkSystem, ProcedureSystem } from "../systems";
import { Phrase, ROUTES } from "../Shell";
import { localeHref } from "../../i18n/locales";
import type { SiteCopy } from "../../i18n/types";

/** CORP-P5R2 — one project page, parameterised. Both keep their own system grammar. */
export default function ProjectView({
  copy, locale, which,
}: { copy: SiteCopy; locale: string; which: "mirai" | "kakari" | "chigamo" }) {
  const isNet = which === "mirai";
  /**
   * CORP-v1.2 — Chigamo is at concept stage: there is no network of parties and no procedure to
   * draw, because neither has been established. It therefore renders the shared page frame with a
   * prose concept section instead of a system diagram. Inventing a diagram for an untested idea
   * would make it look further along than it is.
   */
  const isConcept = which === "chigamo";
  const p = isNet ? copy.mirai : isConcept ? copy.chigamo : copy.kakari;
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
            {!isConcept && (
              <div className={styles.surface}>
                {isNet ? (
                  <NetworkSystem labels={copy.mirai.parties.map((x) => x.title)} centre={copy.mirai.centre} />
                ) : (
                  <ProcedureSystem steps={copy.kakari.steps.map((s) => s.title)} boundary={copy.kakari.boundaryTitle} />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Band line>
        <Eyebrow>
          {isNet ? copy.mirai.networkEyebrow : isConcept ? copy.chigamo.conceptEyebrow : copy.kakari.procedureEyebrow}
        </Eyebrow>
        <h2 className={styles.h2}>
          <Phrase
            units={
              isNet
                ? copy.mirai.networkHeading
                : isConcept
                  ? copy.chigamo.conceptHeading
                  : copy.kakari.procedureHeading
            }
            locale={locale}
          />
        </h2>
        {isConcept ? (
          copy.chigamo.conceptBody.map((t, i) => (
            <p className={`${styles.body} ${styles.jp}`} key={i}>
              {t}
            </p>
          ))
        ) : (
          <Cards items={isNet ? copy.mirai.parties : copy.kakari.steps} columns={2} />
        )}
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
