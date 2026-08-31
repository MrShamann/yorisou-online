import styles from "../site.module.css";
import { Band, Boundary, Cards, Eyebrow, FormationState, TextLink, VentureName } from "../pieces";
import GuidedExplainer from "../GuidedExplainer";
import { VENTURE_FORMATION } from "../ventureState";
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
      <Band id="explainer" dark>
        <Eyebrow dark>{copy.home.explainerLabel}</Eyebrow>
        <h2 className={styles.h2}>
          <Phrase units={copy.home.explainerHeading} locale={locale} />
        </h2>
        {/*
          CORP-v1.2R2.1 — seven beats, each CHANGING the same system field rather than scrolling
          past cards. Beat text is drawn from stages and section names that already exist in all 21
          locales, so the walkthrough is localised without a single new sentence to translate.
          It is never called a video: no video asset exists.
        */}
        <GuidedExplainer
          labels={{
            play: copy.home.explainerPlay,
            pause: copy.home.explainerPause,
            restart: copy.home.explainerRestart,
            step: copy.home.explainerStepLabel,
          }}
          beats={[
            { key: "signal", label: f.stages[0]?.name ?? "", body: f.stages[0]?.body ?? "" },
            { key: "evidence", label: f.stages[1]?.name ?? "", body: f.stages[1]?.body ?? "" },
            { key: "venture", label: f.stages[2]?.name ?? "", body: f.stages[2]?.body ?? "" },
            { key: "team", label: f.stages[5]?.name ?? "", body: f.stages[5]?.body ?? "" },
            { key: "independent", label: f.stages[6]?.name ?? "", body: f.stages[6]?.body ?? "" },
            { key: "ventures", label: copy.ventures.eyebrow, body: copy.ventures.lead },
            { key: "shared", label: f.asterionEyebrow, body: copy.buildWithUs.lead },
          ]}
        />
      </Band>

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

      {/*
        CORP-v1.2R2 — the ventures inside the method.

        The brief is explicit that the three ventures must not appear once on Home and then vanish
        from the Foundry narrative. This is NOT a live dashboard and is not labelled as one: it is
        each venture's own stage and next step, shown where the method is explained, so a reader
        sees that the Foundry is not an abstraction.
      */}
      <Band line>
        <Eyebrow>{copy.ventures.eyebrow}</Eyebrow>
        <h2 className={styles.h2}>
          <Phrase units={copy.ventures.heading} locale={locale} />
        </h2>
        <div className={styles.projects}>
          {copy.ventures.cards.map((c) => {
            const d = c.href === "/mirai-move" ? copy.mirai : c.href === "/kakari" ? copy.kakari : copy.chigamo;
            return (
              <article className={styles.project} key={c.href}>
                <div className={styles.projectHead}>
                  <VentureName name={c.name} reading={d.reading} />
                  <span className={styles.stage}>{d.stage}</span>
                </div>
                <p className={`${styles.bodyMuted} ${styles.jp}`}>{d.next}</p>
                {/* the same node/line/state vocabulary as the hero, at this venture's real stage */}
                <FormationState
                  stages={f.stages}
                  reached={VENTURE_FORMATION[c.href] ?? 0}
                  label={f.stagesEyebrow}
                />
                <TextLink href={L(c.href)}>{copy.common.readMore(c.name)}</TextLink>
              </article>
            );
          })}
        </div>
      </Band>

      <Band tint>
        <Boundary title={f.maturityTitle}>{f.maturityBody}</Boundary>
        <TextLink href={L(ROUTES.buildWithUs)}>{copy.buildWithUs.eyebrow}</TextLink>
      </Band>
    </>
  );
}
