import styles from "../site.module.css";
import { Band, Boundary, Eyebrow } from "../pieces";
import { ParticipationEntry } from "../OperatingField";
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

      {/*
        CORP-v1.4 — what an arrangement can be, next to what cannot be promised.

        The lanes below already say what YORISOU cannot offer: no salary, no funding, no equity, no
        role. That is the honest floor and none of it moves. What was missing was the other half —
        what an arrangement CAN be. Someone weighing whether to take a venture on needs to know that
        co-founder, founding team, a stake, a licence and joint operation are all real shapes, and
        needs to know in the same breath that naming them is not an offer. Both sentences are here,
        adjacent, because separating them is how an invitation turns into a promise.
      */}
      <Band line>
        <h2 className={styles.h2}>
          <Phrase units={b.structureHeading} locale={locale} />
        </h2>
        {b.structureBody.map((t, i) => (
          <p className={`${styles.body} ${styles.jp}`} key={i}>
            {t}
          </p>
        ))}
      </Band>

      <Band line>
        <Boundary title={b.intakeTitle}>{b.intakeBody}</Boundary>
      </Band>

      {/*
        CORP-v1.4R1 — one entry interface, shared with the homepage.

        v1.2R2.1 turned six lanes into six <details> disclosures, which was a real improvement over
        a wall of text and still asked a reader to open six things to find out which one is theirs.
        The same selector the homepage uses now serves this page: pick a role, the answer arrives in
        place, and what cannot be promised sits beside what can — never behind a disclosure, because
        an invitation that hides its limits is a pitch.

        Every lane field is preserved: title, body, invites, offers, cannot, ventures and state.
      */}
      <Band tint>
        <ParticipationEntry copy={copy} idPrefix="bwu-entry" />
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
