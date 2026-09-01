import styles from "../site.module.css";
import { Band, Cards, Eyebrow, Facts, TextLink } from "../pieces";
import { Phrase, ROUTES } from "../Shell";
import { localeHref } from "../../i18n/locales";
import type { SiteCopy } from "../../i18n/types";

/**
 * CORP-P5R2 — the full Company page.
 *
 * Replaces the CORP-P5 placeholder entirely. It presents only facts with a source: the company name
 * and form, the corporate number, the managing member, the city, and the business. Fields with no
 * authoritative source (capital, incorporation date) are OMITTED — a visitor never sees an internal
 * blocker token, and nothing is invented to fill a gap.
 *
 * The corporate number moved out of that omitted list on 2026-08-31, verified against the National
 * Tax Agency publication site. The street address did not: it is verified, but publishing it is a
 * Founder decision rather than a fact correction. See the note in i18n/content/ja.ts.
 */
export default function CompanyView({ copy, locale }: { copy: SiteCopy; locale: string }) {
  const c = copy.company;
  const L = (x: string) => localeHref(x, locale);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroField} aria-hidden="true" />
        <div className={styles.shell}>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h1 className={styles.h1}><Phrase units={c.heading} locale={locale} /></h1>
          <p className={`${styles.lead} ${styles.jp}`}>{c.intro}</p>
        </div>
      </section>

      {/* representative message */}
      <Band id="message" line>
        <Eyebrow>{c.messageEyebrow}</Eyebrow>
        <h2 className={styles.h2}><Phrase units={c.messageHeading} locale={locale} /></h2>
        <div className={styles.message}>
          {c.message.map((para, i) => (
            <p className={`${styles.messagePara} ${styles.jp} ${i === 0 ? styles.messageFirst : ""}`} key={i}>
              {para}
            </p>
          ))}
          <div className={styles.signature}>
            <p className={styles.signatureName}>{c.messageSignature}</p>
            <p className={styles.signatureRole}>{c.messageRole}</p>
          </div>
        </div>
      </Band>

      {/* representative profile */}
      <Band id="representative" tint>
        <Eyebrow>{c.profileEyebrow}</Eyebrow>
        <h2 className={styles.h2}><Phrase units={c.profileHeading} locale={locale} /></h2>
        <div className={styles.founder}>
          <div className={styles.founderMark}>
            <span className={styles.founderInitials} aria-hidden="true">JY</span>
            <div className={styles.founderMarkInner}>
              <p className={styles.founderName}>{c.profileName}</p>
              <p className={styles.founderRole}>{c.profileNameLatin}</p>
              <p className={styles.founderRole}>{c.profileRole}</p>
            </div>
          </div>
          <div>
            {c.profileBody.map((t, i) => (<p className={`${styles.body} ${styles.jp}`} key={i}>{t}</p>))}
            <p className={styles.subLabel}>{c.profileBackgroundLabel}</p>
            <ul className={styles.founderFacts}>
              {c.profileBackground.map((t, i) => (<li className={styles.jp} key={i}>{t}</li>))}
            </ul>
            <p className={styles.subLabel}>{c.profileEducationLabel}</p>
            <ul className={styles.founderFacts}>
              {c.profileEducation.map((t, i) => (<li key={i}>{t}</li>))}
            </ul>
            <p className={styles.subLabel}>{c.profileRelevanceLabel}</p>
            <ul className={styles.founderFacts}>
              {c.profileRelevance.map((t, i) => (<li className={styles.jp} key={i}>{t}</li>))}
            </ul>
          </div>
        </div>
      </Band>

      {/* company overview */}
      <Band id="overview" line>
        <Eyebrow>{c.overviewEyebrow}</Eyebrow>
        <h2 className={styles.h2}><Phrase units={c.overviewHeading} locale={locale} /></h2>
        <Facts facts={c.facts} />
      </Band>

      {/* business areas */}
      <Band tint>
        <Eyebrow>{c.businessEyebrow}</Eyebrow>
        <h2 className={styles.h2}><Phrase units={c.businessHeading} locale={locale} /></h2>
        <p className={`${styles.body} ${styles.jp}`}>{c.businessBody}</p>
      </Band>

      {/*
        CORP-v1.4 — driven by the venture list, not by two hardcoded cards.

        This band listed Mirai Move and Kakari and omitted Chigamo, so the Company page said the
        company was two ventures while the Ventures index, `VENTURE_CLASS` and the composition line
        all said three. Two literals in a view are exactly how that drifts. It now reads the same
        `copy.ventures.cards` every other surface reads, and it names the set it is showing rather
        than implying the set is everything YORISOU has.
      */}
      <Band id="projects" dark>
        <Eyebrow dark>{copy.ventures.publicLabel}</Eyebrow>
        <h2 className={styles.h2}><Phrase units={c.projectsHeading} locale={locale} /></h2>
        <p className={`${styles.body} ${styles.jp}`}>{copy.ventures.publicNote}</p>
        <Cards
          items={copy.ventures.cards.map((v, i) => ({
            no: String(i + 1).padStart(2, "0"),
            title: v.name,
            body: (v.href === "/mirai-move" ? copy.mirai : v.href === "/kakari" ? copy.kakari : copy.chigamo).stage,
          }))}
          columns={3}
          dark
        />
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 20 }}>
          {copy.ventures.cards.map((v) => (
            <TextLink key={v.href} href={L(v.href)} dark>
              {copy.common.readMore(v.name)}
            </TextLink>
          ))}
        </div>
      </Band>

      {/* origin */}
      <Band line>
        <Eyebrow>{c.originEyebrow}</Eyebrow>
        <h2 className={styles.h2}><Phrase units={c.originHeading} locale={locale} /></h2>
        {c.originBody.map((t, i) => (<p className={`${styles.body} ${styles.jp}`} key={i}>{t}</p>))}
      </Band>

      {/* contact cta */}
      <Band tint>
        <h2 className={styles.h2}><Phrase units={c.ctaHeading} locale={locale} /></h2>
        <p className={`${styles.body} ${styles.jp}`}>{c.ctaBody}</p>
        <a className={styles.btn} href={L(ROUTES.contact)}>{copy.chrome.nav.contact}</a>
      </Band>
    </>
  );
}
