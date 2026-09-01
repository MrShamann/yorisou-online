import styles from "../site.module.css";
import { Band, Boundary, Eyebrow, TextLink } from "../pieces";
import { FoundrySpine } from "../OperatingField";
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

      {/*
        CORP-v1.2R2 — the "Yorisou in 30 seconds" target.

        This is option A from the brief: an extended web-native motion explainer built from the same
        system grammar as the hero, not a recorded film. No placeholder media file is shipped, and
        nothing here claims a video exists. The motion field states the arc; the stage names beneath
        it name each beat, so the story reads with motion disabled too.
      */}


      {/*
        CORP-v1.4R1 — the eight stages are one system, not eight cards.

        `Cards columns={2}` was semantically correct and visually generic: a reader had to assemble
        a sequence out of a two-column grid, and eight bordered rectangles is what a SaaS template
        looks like. A spine states the sequence, and it carries something the grid could not —
        Mirai Move, Kakari and Chigamo pinned at the stage their OWN repository evidence puts them
        at. The method stops being a description of how we would work and becomes the thing three
        real ventures are currently on.

        No percentage, no "live", no autoplay. Selecting a stage is a native radio: no JavaScript,
        arrow keys from the browser, and nothing for reduced motion to disable.
      */}
      <Band line>
        <Eyebrow>{f.stagesEyebrow}</Eyebrow>
        <h2 className={styles.h2}>
          <Phrase units={f.stagesHeading} locale={locale} />
        </h2>
        <FoundrySpine copy={copy} />
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

      {/*
        CORP-v1.4R1 — the venture-stage band is gone, and deliberately so.

        It restated each venture's stage in a three-card grid directly under a page that had just
        listed the stages as eight cards. That was the same fact drawn twice, in two grids, on one
        page. The spine above now carries each venture's marker at its real stage, which is the same
        information in one object instead of eleven rectangles. The detail links live on /ventures,
        where the ventures are the subject.
      */}
      {/*
        CORP-v1.4R1 — the guided explainer is retired.

        With the spine in place this page carried THREE representations of the same eight stages:
        the cards, the venture-stage grid, and a seven-beat walkthrough that re-read five of the
        same stage bodies. v1.2R3 had already demoted the explainer to sixth of seven for exactly
        this reason; the spine makes it redundant rather than merely secondary, and keeping it would
        preserve work rather than serve a reader.

        Nothing it said is lost: every beat drew its text from `foundry.stages` and the section
        eyebrows, all of which the spine and the surrounding sections still render. The component
        and its stylesheet remain in the tree, unreferenced, so restoring it is a one-line change if
        the Founder disagrees.
      */}
      <Band tint>
        <Boundary title={f.maturityTitle}>{f.maturityBody}</Boundary>
        <TextLink href={L(ROUTES.buildWithUs)}>{copy.buildWithUs.eyebrow}</TextLink>
      </Band>
    </>
  );
}
