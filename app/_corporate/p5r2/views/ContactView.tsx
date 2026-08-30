import styles from "../site.module.css";
import { Band, Cards, Eyebrow } from "../pieces";
import { Phrase } from "../Shell";
import ContactForm from "../ContactForm";
import type { SiteCopy } from "../../i18n/types";

/**
 * CORP-P5R2 — the corporate contact surface. Replaces the CORP-P5 placeholder entirely.
 *
 * No internal blocker token appears. The three enquiry categories are real form routes, not
 * decorative headings.
 */
export default function ContactView({ copy, locale }: { copy: SiteCopy; locale: string }) {
  const c = copy.contact;
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroField} aria-hidden="true" />
        <div className={styles.shell}>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h1 className={styles.h1}><Phrase units={c.heading} locale={locale} /></h1>
          <p className={`${styles.lead} ${styles.jp}`}>{c.lead}</p>
        </div>
      </section>

      <Band line>
        <h2 className={styles.h2}><Phrase units={c.channelsHeading} locale={locale} /></h2>
        <Cards items={c.channels.map((x, i) => ({ no: String(i + 1).padStart(2, "0"), ...x }))} columns={3} />
      </Band>

      <Band tint>
        <h2 className={styles.h2}><Phrase units={c.formHeading} locale={locale} /></h2>
        <p className={`${styles.body} ${styles.jp}`}>{c.formIntro}</p>
        <ContactForm
          copy={{
            fields: c.fields,
            types: c.types,
            required: c.required,
            submit: c.submit,
            sending: c.sending,
            successTitle: c.successTitle,
            successBody: c.successBody,
            errorTitle: c.errorTitle,
            errorBody: c.errorBody,
            privacyNote: c.privacyNote,
          }}
          locale={locale}
        />
      </Band>
    </>
  );
}
