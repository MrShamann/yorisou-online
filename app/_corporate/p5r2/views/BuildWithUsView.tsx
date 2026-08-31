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
        {/*
          CORP-v1.2R2 — the participation matrix.

          Each lane states what Yorisou can actually offer today AND what it cannot promise. An
          invitation that lists only upside is a recruitment pitch, and the whole point of this page
          is that it must not be one. The `state` line carries the weakest truthful status, so
          nothing reads as an open application while none exists.
        */}
        <div className={styles.lanes}>
          {b.lanes.map((lane) => (
            <article className={styles.lane} key={lane.key} id={`lane-${lane.key}`}>
              <div className={styles.laneHead}>
                <h2 className={styles.laneTitle}>{lane.title}</h2>
              </div>
              <p className={`${styles.body} ${styles.jp}`}>{lane.body}</p>
              <ul className={styles.founderFacts}>
                {lane.invites.map((t) => (
                  <li className={styles.jp} key={t}>
                    {t}
                  </li>
                ))}
              </ul>
              <p className={`${styles.laneOffer} ${styles.jp}`}>{lane.offers}</p>
              <p className={`${styles.laneCannot} ${styles.jp}`}>{lane.cannot}</p>
              {lane.ventures.length > 0 && (
                <ul className={styles.laneVentures}>
                  {lane.ventures.map((n) => (
                    <li className={styles.laneVenture} key={n}>
                      {n}
                    </li>
                  ))}
                </ul>
              )}
              <p className={`${styles.laneState} ${styles.jp}`}>{lane.state}</p>
              <TextLink href={L(ROUTES.contact)}>{lane.cta}</TextLink>
            </article>
          ))}
        </div>
      </Band>

      {/* CORP-v1.2R2 — the founding-team idea, stated without inventing a team. */}
      <Band line>
        <Eyebrow>{b.foundingTeamEyebrow}</Eyebrow>
        <h2 className={styles.h2}>
          <Phrase units={b.foundingTeamHeading} locale={locale} />
        </h2>
        {b.foundingTeamBody.map((t, i) => (
          <p className={`${styles.body} ${styles.jp}`} key={i}>
            {t}
          </p>
        ))}
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
