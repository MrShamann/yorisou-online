import styles from "../site.module.css";
import { Band, Eyebrow, StateTriad, TextLink } from "../pieces";
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
  /** Each card's state triad comes from that venture's own block, so the two can never drift. */
  const detail = (href: string) =>
    href === "/mirai-move" ? copy.mirai : href === "/kakari" ? copy.kakari : copy.chigamo;

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
              <p className={`${styles.brandLine} ${styles.jp}`}>{detail(c.href).reading}</p>
              <p className={`${styles.projectLead} ${styles.jp}`}>{c.thesis}</p>
              <p className={`${styles.bodyMuted} ${styles.jp}`}>{c.problem}</p>
              <p className={`${styles.bodyMuted} ${styles.jp}`}>{c.building}</p>
              {/*
                CORP-v1.2R2 — NOW / NEXT / WHO, always visible. The brief permits revealing these on
                hover, but essential information must never be hover-only and a keyboard user must
                get the same content, so they are simply always rendered.
              */}
              <StateTriad
                labels={{ now: copy.common.nowLabel, next: copy.common.nextLabel, who: copy.common.whoLabel }}
                now={detail(c.href).now}
                next={detail(c.href).next}
                who={detail(c.href).who}
              />
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
