import styles from "../site.module.css";
import { Band, Eyebrow, TextLink } from "../pieces";
import { Phrase, ROUTES } from "../Shell";
import { localeHref } from "../../i18n/locales";
import type { SiteCopy } from "../../i18n/types";

/**
 * CORP-v1.2 — the Ventures index.
 *
 * This is meant to survive being read by someone doing diligence, which means it must NOT look like
 * a portfolio grid. There are no metrics, no logos and no traction numbers, because none exist. Each
 * card carries the thesis, the problem, what is being built, and a plain-language stage — and the
 * closing note states outright that inclusion here is not incorporation, investment or a client
 * relationship. A venture at concept stage says so on its own card.
 */
export default function VenturesView({ copy, locale }: { copy: SiteCopy; locale: string }) {
  const v = copy.ventures;
  const L = (p: string) => localeHref(p, locale);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroField} aria-hidden="true" />
        <div className={styles.shell}>
          <Eyebrow>{v.eyebrow}</Eyebrow>
          <h1 className={styles.h1}>
            <Phrase units={v.heading} locale={locale} />
          </h1>
          <p className={`${styles.lead} ${styles.jp}`}>{v.lead}</p>
        </div>
      </section>

      <Band line>
        <div className={styles.projects}>
          {v.cards.map((c) => (
            <article className={styles.project} key={c.href}>
              <div className={styles.projectHead}>
                <h2 className={styles.projectName}>{c.name}</h2>
                <span className={styles.stage}>{c.status}</span>
              </div>
              <p className={`${styles.projectLead} ${styles.jp}`}>{c.thesis}</p>
              <p className={`${styles.bodyMuted} ${styles.jp}`}>{c.problem}</p>
              <p className={`${styles.bodyMuted} ${styles.jp}`}>{c.building}</p>
              <TextLink href={L(c.href)}>{copy.common.readMore(c.name)}</TextLink>
            </article>
          ))}
        </div>
      </Band>

      <Band tint>
        <h2 className={styles.h2}>
          <Phrase units={v.noteHeading} locale={locale} />
        </h2>
        {v.noteBody.map((t, i) => (
          <p className={`${styles.body} ${styles.jp}`} key={i}>
            {t}
          </p>
        ))}
        <TextLink href={L(ROUTES.about)}>{copy.foundry.eyebrow}</TextLink>
      </Band>
    </>
  );
}
