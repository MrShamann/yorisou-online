import styles from "../site.module.css";
import { Band, Cards, Disclose, Eyebrow, TextLink } from "../pieces";
import { Phrase, ROUTES } from "../Shell";
import { localeHref } from "../../i18n/locales";
import type { SiteCopy } from "../../i18n/types";

/** CORP-P5R2 — why Yorisou exists, how it thinks, how it builds. Distinct from Company. */
export default function AboutView({ copy, locale }: { copy: SiteCopy; locale: string }) {
  const a = copy.about;
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroField} aria-hidden="true" />
        <div className={styles.shell}>
          <Eyebrow>{a.eyebrow}</Eyebrow>
          <h1 className={styles.h1}><Phrase units={a.heading} locale={locale} /></h1>
          <p className={`${styles.lead} ${styles.jp}`}>{a.lead}</p>
        </div>
      </section>

      <Band line>
        <h2 className={styles.h2}><Phrase units={a.whyHeading} locale={locale} /></h2>
        {a.whyBody.map((t, i) => (<p className={`${styles.body} ${styles.jp}`} key={i}>{t}</p>))}
      </Band>

      <Band tint>
        <h2 className={styles.h2}><Phrase units={a.thinkHeading} locale={locale} /></h2>
        {a.thinkBody.map((t, i) => (<p className={`${styles.body} ${styles.jp}`} key={i}>{t}</p>))}
      </Band>

      <Band dark>
        <h2 className={styles.h2}><Phrase units={a.buildHeading} locale={locale} /></h2>
        <Cards items={a.principles} columns={2} dark />
        <Disclose label={copy.home.howDisclose} dark>
          {a.principlesLong.map((m) => (
            <p key={m.no} style={{ marginBottom: 14 }}>
              <strong>{m.no} {m.title}</strong><br />{m.long}
            </p>
          ))}
        </Disclose>
      </Band>

      <Band line>
        <h2 className={styles.h2}><Phrase units={a.orderHeading} locale={locale} /></h2>
        <p className={`${styles.body} ${styles.jp}`}>{a.orderBody}</p>
        <h2 className={styles.h2} style={{ marginTop: 40 }}><Phrase units={a.claimsHeading} locale={locale} /></h2>
        <p className={`${styles.body} ${styles.jp}`}>{a.claimsBody}</p>
        <TextLink href={localeHref(ROUTES.company, locale)}>{copy.chrome.nav.company}</TextLink>
      </Band>
    </>
  );
}
