import styles from "../site.module.css";
import { Band, Boundary, Cards, Eyebrow, TextLink } from "../pieces";
import { Phrase, ROUTES } from "../Shell";
import { localeHref } from "../../i18n/locales";
import type { SiteCopy } from "../../i18n/types";

/**
 * CORP-v1.2 — How we build. The strategic core of the site.
 *
 * Two things are load-bearing here and are deliberately structural rather than decorative.
 *
 * First, the eight stages end in an independent company, not in permanent Foundry dependency, so the
 * independence section follows the stages immediately rather than being buried.
 *
 * Second, Asterion. It is an INDEPENDENT platform that Yorisou does not own, so it appears here as a
 * secondary layer inside "how we build" — never in the venture grid, never in the hero, and never
 * with a "powered by" badge. The boundary callout sits directly under it so the ownership and data
 * separation is read at the same moment as the capability claim, not several screens later.
 *
 * The maturity note is last and is not softened: the method is not yet proven and nothing has been
 * spun out. A polished page does not upgrade evidence.
 */
export default function FoundryView({ copy, locale }: { copy: SiteCopy; locale: string }) {
  const f = copy.foundry;
  const L = (p: string) => localeHref(p, locale);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroField} aria-hidden="true" />
        <div className={styles.shell}>
          <Eyebrow>{f.eyebrow}</Eyebrow>
          <h1 className={styles.h1}>
            <Phrase units={f.heading} locale={locale} />
          </h1>
          <p className={`${styles.lead} ${styles.jp}`}>{f.lead}</p>
        </div>
      </section>

      <Band line>
        <Eyebrow>{f.stagesEyebrow}</Eyebrow>
        <h2 className={styles.h2}>
          <Phrase units={f.stagesHeading} locale={locale} />
        </h2>
        <Cards
          items={f.stages.map((s) => ({ no: s.no, title: s.name, body: s.body }))}
          columns={2}
        />
      </Band>

      <Band tint>
        <h2 className={styles.h2}>
          <Phrase units={f.independenceHeading} locale={locale} />
        </h2>
        {f.independenceBody.map((t, i) => (
          <p className={`${styles.body} ${styles.jp}`} key={i}>
            {t}
          </p>
        ))}
      </Band>

      <Band dark>
        <Eyebrow dark>{f.asterionEyebrow}</Eyebrow>
        <h2 className={styles.h2}>
          <Phrase units={f.asterionHeading} locale={locale} />
        </h2>
        {f.asterionBody.map((t, i) => (
          <p className={`${styles.body} ${styles.jp}`} key={i}>
            {t}
          </p>
        ))}
        <Boundary title={f.asterionBoundaryTitle} dark>
          {f.asterionBoundaryBody}
        </Boundary>
      </Band>

      <Band line>
        <h2 className={styles.h2}>
          <Phrase units={f.economicsHeading} locale={locale} />
        </h2>
        {f.economicsBody.map((t, i) => (
          <p className={`${styles.body} ${styles.jp}`} key={i}>
            {t}
          </p>
        ))}
      </Band>

      <Band tint>
        <Boundary title={f.maturityTitle}>{f.maturityBody}</Boundary>
        <TextLink href={L(ROUTES.buildWithUs)}>{copy.buildWithUs.eyebrow}</TextLink>
      </Band>
    </>
  );
}
