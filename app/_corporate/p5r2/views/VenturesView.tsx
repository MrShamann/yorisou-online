import styles from "../site.module.css";
import { Band, Disclose, Eyebrow, FormationState, StateTriad, TextLink, VentureComposition, VentureName } from "../pieces";
import { ContextField, NetworkSystem, ProcedureSystem } from "../systems";
import { Phrase, ROUTES } from "../Shell";
import { localeHref } from "../../i18n/locales";
import type { SiteCopy } from "../../i18n/types";
import { VENTURE_FORMATION } from "../ventureState";

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
          {/*
            CORP-v1.3.1 — the count is scoped to the set it describes.

            v1.3 removed "three areas, underway now" and replaced it with a computed composition,
            which is right about the three shown and still read as the whole company. The note states
            the relationship first — YORISOU builds several ventures, these are the public ones — and
            only then does the composition count that set.
          */}
          <p className={`${styles.body} ${styles.jp}`}>{v.publicNote}</p>
          <p className={styles.subLabel}>{v.publicLabel}</p>
          <VentureComposition building={copy.common.buildingLabel} concept={copy.common.conceptLabel} />
        </div>
      </section>

      {/*
        CORP-v1.4R1 — three venture chapters, not three memo cards.

        The page rendered three equal cards, each holding a thesis, a problem, what is being built,
        a NOW/NEXT/WHO triad, a formation strip and a link. Everything true, and it read as three
        small project memos: a reader had to work through a wall of copy before the ventures became
        distinguishable from one another.

        Each venture now takes a chapter with its own system drawing — a network converging, an
        ordered procedure stopping at a boundary, a context field — so the three are visibly
        different KINDS of system before a word is read. The first layer is what it is, its state,
        and its next step. The diligence layer — the problem, what is being built, who it needs — is
        a disclosure directly beneath, so nothing true became unreachable; it stopped being the
        first thing.
      */}
      {v.cards.map((c, i) => {
        const d = detail(c.href);
        return (
          <Band key={c.href} tint={i % 2 === 1}>
            <div className={styles.chapter}>
              <div className={styles.chapterIdent}>
                <VentureName name={c.name} reading={d.reading} as="h2" size="hero" />
                <span className={styles.chapterDomain}>{d.domain}</span>
                <p className={`${styles.chapterThesis} ${styles.jp}`}>{c.thesis}</p>
                <FormationState
                  stages={copy.foundry.stages}
                  reached={VENTURE_FORMATION[c.href] ?? 0}
                  label={copy.foundry.stagesEyebrow}
                />
              </div>
              <div className={styles.chapterFigure}>
                {c.href === "/mirai-move" ? (
                  <NetworkSystem labels={copy.mirai.parties.map((x) => x.title)} centre={copy.mirai.centre} />
                ) : c.href === "/kakari" ? (
                  <ProcedureSystem steps={copy.kakari.steps.map((x) => x.title)} boundary={copy.kakari.boundaryTitle} />
                ) : (
                  <ContextField place={copy.chigamo.conceptEyebrow} context={copy.chigamo.domain} result={copy.chigamo.stage} />
                )}
              </div>
              <div className={styles.chapterState}>
                <StateTriad
                  labels={{ now: copy.common.nowLabel, next: copy.common.nextLabel, who: copy.common.whoLabel }}
                  now={d.now}
                  next={d.next}
                  who={d.who}
                />
                <Disclose label={copy.common.readMore(c.name)}>
                  <p className={`${styles.bodyMuted} ${styles.jp}`}>{c.problem}</p>
                  <p className={`${styles.bodyMuted} ${styles.jp}`}>{c.building}</p>
                </Disclose>
                <TextLink href={L(c.href)}>{copy.common.readMore(c.name)}</TextLink>
              </div>
            </div>
          </Band>
        );
      })}

      {/*
        CORP-v1.4 — what is true today, kept apart from what may follow.

        Every stage above is a current fact. What a venture becomes next — staying inside YORISOU,
        joint operation, a separate company, a licence, a transfer, a sale — is a possibility, and
        a page that lists possibilities without marking them as such is how a plan gets read as an
        announcement. So the two are separated by a section break, and the last line says plainly
        that what precedes it is neither a plan nor a promise.
      */}
      <Band line>
        <h2 className={styles.h2}>
          <Phrase units={v.structureHeading} locale={locale} />
        </h2>
        {v.structureBody.map((t, i) => (
          <p className={`${styles.body} ${styles.jp}`} key={i}>
            {t}
          </p>
        ))}
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
