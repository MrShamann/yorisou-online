import styles from "../site.module.css";
import { Band, Cards, Eyebrow } from "../pieces";
import { Phrase } from "../Shell";
import ContactForm from "../ContactForm";
import type { SiteCopy } from "../../i18n/types";
import { contactDeliveryConfigured } from "@/lib/corporate/contactDelivery";

/**
 * CORP-P5R2 — the corporate contact surface. Replaces the CORP-P5 placeholder entirely.
 *
 * No internal blocker token appears. The three enquiry categories are real form routes, not
 * decorative headings.
 */
export default function ContactView({ copy, locale }: { copy: SiteCopy; locale: string }) {
  const c = copy.contact;
  /** Server-only: whether the transport can actually deliver. Never reaches the client as a value. */
  const open = contactDeliveryConfigured();
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroField} aria-hidden="true" />
        <div className={styles.shell}>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h1 className={styles.h1}><Phrase units={c.heading} locale={locale} /></h1>
          {/*
            CORP-v1.3 — the lead states the page's real state.

            `c.lead` ends "we reply in turn", which is a promise about a channel. With no transport
            there is no channel, so in that state the lead IS the notice: one statement of what is
            true, rather than an invitation followed three sections later by a contradiction.
          */}
          <p className={`${styles.lead} ${styles.jp}`}>{open ? c.lead : c.unavailableBody}</p>
        </div>
      </section>

      <Band line>
        <h2 className={styles.h2}><Phrase units={c.channelsHeading} locale={locale} /></h2>
        <Cards items={c.channels.map((x, i) => ({ no: String(i + 1).padStart(2, "0"), ...x }))} columns={3} />
      </Band>

      {/*
        CORP-v1.3 — the form is only shown when it can actually deliver.

        The page previously said "we read every enquiry and reply in turn" and, on submit, "we have
        received your enquiry" — while the transport had no credential and the endpoint returned 503
        to every message. That is a promise the site could not keep, and the release blockers have
        required this since v1.2. The predicate is server-only and shared with the API route, so the
        page cannot advertise a delivery the endpoint would refuse.

        When the credential and the two addresses exist, the form and the promise return by
        themselves. Being configured is still not the same as being verified end to end, which is a
        separate gate before /contact becomes crawlable.
      */}
      {!open ? null : (
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
      )}
    </>
  );
}
