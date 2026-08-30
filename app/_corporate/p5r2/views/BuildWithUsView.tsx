import styles from "../site.module.css";
import { Band, Boundary, Eyebrow, TextLink } from "../pieces";
import { Phrase, ROUTES } from "../Shell";
import { localeHref } from "../../i18n/locales";
import type { SiteCopy } from "../../i18n/types";

/**
 * CORP-v1.2 — Build with us. Four engagement lanes.
 *
 * These are INVITATIONS, not partnerships. Nothing on this page may read as an existing relationship
 * with a university, a government body or a company, because none is evidenced.
 *
 * The intake callout is placed BEFORE the lanes' calls to action rather than in a footnote, because
 * there is currently no application process and no selection programme, and a visitor should learn
 * that before they act rather than after. For the same reason every lane CTA is an interest or
 * conversation link — never "Apply now" — and all four land on the same contact route.
 */
export default function BuildWithUsView({ copy, locale }: { copy: SiteCopy; locale: string }) {
  const b = copy.buildWithUs;
  const L = (p: string) => localeHref(p, locale);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroField} aria-hidden="true" />
        <div className={styles.shell}>
          <Eyebrow>{b.eyebrow}</Eyebrow>
          <h1 className={styles.h1}>
            <Phrase units={b.heading} locale={locale} />
          </h1>
          <p className={`${styles.lead} ${styles.jp}`}>{b.lead}</p>
        </div>
      </section>

      <Band line>
        <Boundary title={b.intakeTitle}>{b.intakeBody}</Boundary>
      </Band>

      <Band tint>
        <div className={styles.projects}>
          {b.lanes.map((lane) => (
            <article className={styles.project} key={lane.key}>
              <div className={styles.projectHead}>
                <h2 className={styles.projectName}>{lane.title}</h2>
              </div>
              <p className={`${styles.projectLead} ${styles.jp}`}>{lane.body}</p>
              <ul className={styles.founderFacts}>
                {lane.invites.map((t, i) => (
                  <li className={styles.jp} key={i}>
                    {t}
                  </li>
                ))}
              </ul>
              <TextLink href={L(ROUTES.contact)}>{lane.cta}</TextLink>
            </article>
          ))}
        </div>
      </Band>

      <Band line>
        <h2 className={styles.h2}>
          <Phrase units={b.ctaHeading} locale={locale} />
        </h2>
        <p className={`${styles.body} ${styles.jp}`}>{b.ctaBody}</p>
        <a className={styles.btn} href={L(ROUTES.contact)}>
          {copy.chrome.nav.contact}
        </a>
      </Band>
    </>
  );
}
