import Image from "next/image";

import styles from "../site.module.css";
import { Band, Boundary, Eyebrow, Facts, TextLink, VentureComposition } from "../pieces";
import field from "../operating-field.module.css";
import { ParticipationEntry, PublicVentureSurface, ValueContinuityField } from "../OperatingField";
import FoundryField from "../FoundryField";
import { VentureMark } from "../VentureMark";
import { Phrase, ROUTES } from "../Shell";
import { localeHref } from "../../i18n/locales";
import type { SiteCopy } from "../../i18n/types";

/**
 * CORP-P5R2 — the corporate homepage. It represents YORISOU LLC, not a product.
 *
 * Narrative order is fixed by the Founder brief: company hero, why, what we build, how we build,
 * representative, message, origin, company proof, contact. Every string comes from the active
 * locale, so the whole page changes language together — headings, diagram labels and all.
 */
export default function HomeView({ copy, locale }: { copy: SiteCopy; locale: string }) {
  const h = copy.home;
  const L = (p: string) => localeHref(p, locale);

  return (
    <>
      {/*
        CORP-v1.2R3 — the signature.

        Benchmarking found that every site which lands its hook gives ONE object most of the
        viewport, full-bleed or cropped by the edge, and is completely legible in a still frame.
        The previous hero did the opposite: a 50/50 split with the system figure sitting inside a
        card, inside the same container width as every other section, delivering its meaning over
        eleven seconds.

        So this section deliberately breaks the container. The brand and hook hold a narrow left
        column; the Foundry object runs to the right viewport edge at full height; and the three
        ventures sit on an edge-anchored rail immediately beneath, so what is being formed is
        visible without scrolling. Yorisou has no product screenshot it can honestly show and no
        photography it should use — the formation system IS the proof surface, so it is given the
        weight Linear gives its product UI.
      */}
      <section className={styles.signature}>
        <div className={styles.signatureInner}>
          <div className={styles.signatureBrand}>
            <Image
              src="/brand/yorisou-logo.png"
              alt="Yorisou"
              width={1254}
              height={1254}
              priority
              sizes="(max-width: 900px) 200px, 260px"
              className={styles.heroLogo}
            />
            <h1 className={styles.hook}>
              <Phrase units={h.hook} locale={locale} />
            </h1>
            <p className={`${styles.signatureLead} ${styles.jp}`}>
              <Phrase units={h.thesis} locale={locale} />
            </p>
            <div className={styles.signatureActions}>
              <a className={styles.btn} href={L(ROUTES.buildWithUs)}>
                {copy.buildWithUs.eyebrow}
              </a>
              <TextLink href={L(ROUTES.about)}>{copy.foundry.eyebrow}</TextLink>
            </div>
          </div>

          <div className={styles.signatureField}>
            <FoundryField
              evidence={copy.foundry.stages[1]?.name ?? ""}
              venture={copy.foundry.stages[2]?.name ?? ""}
              team={copy.foundry.stages[5]?.name ?? ""}
              independent={copy.foundry.stages[6]?.name ?? ""}
              infrastructure={copy.foundry.asterionEyebrow}
            />
          </div>
        </div>

        {/*
          The NOW-FORMING rail. Not a dashboard and never labelled live: each venture shows its own
          Japanese line and its own stage text, which is the same evidence the detail pages carry.
        */}
        <div className={styles.ventureRail}>
          <div className={styles.railHead}>
            {/*
              CORP-v1.3.1 — the rail names the set it is showing.

              v1.3 labelled it "the ventures", which read as the company's whole activity. YORISOU
              builds more than it publishes; this rail is the published ones, and the composition
              beside it counts THAT set, not the company.
            */}
            <p className={`${styles.mono} ${styles.railLabel}`}>{copy.ventures.publicLabel}</p>
            {/*
              CORP-v1.3 — the composition, in the first viewport. A visitor who reads only the
              signature now learns that two of the three are being built and one is still an idea,
              rather than inferring three equal ventures from three equal-looking rail items.
            */}
            <VentureComposition
              building={copy.common.buildingLabel}
              concept={copy.common.conceptLabel}
              className={styles.railComposition}
            />
          </div>
          <ul className={styles.railList}>
            {copy.ventures.cards.map((c) => {
              const d = c.href === "/mirai-move" ? copy.mirai : c.href === "/kakari" ? copy.kakari : copy.chigamo;
              return (
                <li className={styles.railItem} key={c.href}>
                  <a className={styles.railLink} href={L(c.href)}>
                    <span className={styles.railNameRow}>
                      {/* each venture's own mark, in the same slot on every surface */}
                      <VentureMark href={c.href} size="card" />
                      <span className={styles.railName}>{c.name}</span>
                    </span>
                    <span className={`${styles.railReading} ${styles.jp}`}>{d.reading}</span>
                    <span className={styles.railStage}>{d.stage}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/*
        CORP-v1.4R1 — SCENE boundary: editorial quiet.

        This was three cards. Three bordered rectangles is the wrong instrument for three symptoms
        of one problem: it gives them equal, separate weight and asks the reader to compare them,
        when what they should do is accumulate. The heading carries the statement; the three sit
        under it as a spare numbered list. Same words, no rectangles, and the section can breathe —
        which is what makes the dense surface after it land.
      */}
      <Band id="why" quiet>
        <Eyebrow>{h.whyEyebrow}</Eyebrow>
        <h2 className={field.quietStatement}><Phrase units={h.whyHeading} locale={locale} /></h2>
        <ol className={styles.beatList}>
          {h.whyBeats.map((b) => (
            <li className={styles.beatItem} key={b.no}>
              <span className={styles.beatNo}>{b.no}</span>
              <span className={styles.beatText}>
                <span className={`${styles.beatTitle} ${styles.jp}`}>{b.title}</span>
                <span className={`${styles.beatBody} ${styles.jp}`}>{b.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </Band>

      {/*
        CORP-v1.4R1 — SCENE 2: what is forming.

        This was an eyebrow, a heading, two paragraphs and three project cards inside the standard
        container — the same shape as every other section on the page, for the single most important
        thing YORISOU has to show. Benchmarking made the cost plain: the sites that read as large
        companies give ONE object most of a viewport, and let it break its own frame.

        So the ventures now occupy a full-bleed dark surface carrying real state: each venture's own
        mark, its own Japanese line, its domain, its stage on the eight-stage Foundry taken from its
        own repository evidence, and its own system grammar — a network, a procedure, a context
        field — so the three read as different KINDS of system before a word is read.

        It is not a dashboard. Nothing is live, nothing is a percentage, and the only state shown is
        a named stage the evidence supports.
      */}
      <PublicVentureSurface copy={copy} locale={locale} />

      {/*
        CORP-v1.4R1 — quiet again, and shorter.

        This carried two cards plus a disclosure holding the full principles text, which is the same
        material /about presents at length. Three representations of one method across two pages is
        how a site starts explaining itself instead of showing itself. The homepage now states the
        method and hands off; the Foundry spine on /about is where it is actually shown.
      */}
      <Band id="how" quiet>
        <Eyebrow>{h.howEyebrow}</Eyebrow>
        <h2 className={field.quietStatement}><Phrase units={h.howHeading} locale={locale} /></h2>
        <ol className={styles.beatList}>
          {h.howBeats.map((b) => (
            <li className={styles.beatItem} key={b.no}>
              <span className={styles.beatNo}>{b.no}</span>
              <span className={styles.beatText}>
                <span className={`${styles.beatTitle} ${styles.jp}`}>{b.title}</span>
                <span className={`${styles.beatBody} ${styles.jp}`}>{b.body}</span>
              </span>
            </li>
          ))}
        </ol>
        <TextLink href={L(ROUTES.about)}>{copy.foundry.eyebrow}</TextLink>
      </Band>

      {/*
        CORP-v1.4R1 — SCENE 3: how value continues. The second system object on the page.

        v1.4 added this idea as a heading and two paragraphs, which is the wrong instrument for a
        set of alternatives — a reader has to hold six options in their head before they can see
        that they ARE options. It is also the single most important commercial statement the site
        makes, and it was the least visual thing on the page.

        One venture, six branches, every connector dashed: none of these has happened. No equity is
        held, no licence is executed, nothing has been spun out. The figure states possibility and
        the line beneath states that nothing is decided in advance — in the same frame, so the
        second cannot be scrolled past.
      */}
      <Band id="portfolio" line>
        <Eyebrow>{h.portfolioEyebrow}</Eyebrow>
        <h2 className={styles.h2}><Phrase units={h.portfolioHeading} locale={locale} /></h2>
        <p className={`${styles.body} ${styles.jp}`}>{h.portfolioBody}</p>
        <ValueContinuityField copy={copy} />
        <p className={`${styles.bodyMuted} ${styles.jp}`}>{h.portfolioNote}</p>
      </Band>

      {/*
        CORP-v1.2 §7.4 — the Asterion layer.

        It sits AFTER "how we build" and before the engagement layer, as a shared floor underneath
        the ventures rather than as a fourth venture. Asterion is independent and is not owned by
        Yorisou, so the boundary note is rendered immediately with the capability claim — never
        several screens away — and there is no "powered by" badge anywhere on this page.
      */}
      {/*
        CORP-v1.4R1 — Asterion sits UNDER the architecture, and is sized accordingly.

        It kept a full section with its own h2, which gave a shared technology layer the same weight
        as the ventures themselves. It is not a venture and must not read as the dominant product.
        The boundary note stays adjacent to the capability sentence — that pairing is load-bearing
        and does not move.
      */}
      <Band tint>
        <Eyebrow>{h.asterionEyebrow}</Eyebrow>
        <p className={`${styles.body} ${styles.jp}`}>{h.asterionBody}</p>
        <Boundary title={copy.foundry.asterionBoundaryTitle}>{h.asterionNote}</Boundary>
        <TextLink href={L(ROUTES.about)}>{copy.foundry.eyebrow}</TextLink>
      </Band>

      {/*
        CORP-v1.4R1 — SCENE 4: entering the system. A decision, not six cards.

        The six lanes were six linked cells in a grid, which is a navigation menu wearing the
        clothes of an answer: a reader had to pick a card, leave the page, and read a second page to
        find out whether there was a place for them. Now they pick a role and the answer arrives in
        place — what the role contributes, which ventures it touches, what YORISOU can offer, and
        what it cannot promise, the last of those never behind a disclosure.

        Native radio group: no JavaScript, arrow keys from the browser, real tab semantics for
        assistive technology, and nothing for reduced motion to switch off. No matching, no
        recommendation, no "AI suggests a venture for you".
      */}
      <Band id="engage" line>
        <Eyebrow>{h.engageEyebrow}</Eyebrow>
        <h2 className={styles.h2}><Phrase units={h.engageHeading} locale={locale} /></h2>
        <p className={`${styles.body} ${styles.jp}`}>{h.engageBody}</p>
        <ParticipationEntry copy={copy} idPrefix="home-entry" />
        <p className={`${styles.bodyMuted} ${styles.jp}`}>{h.engageNote}</p>
        <TextLink href={L(ROUTES.buildWithUs)}>{h.engageCta}</TextLink>
      </Band>

      {/* 05 + 06 — representative and message */}
      <Band id="founder" line>
        <div className={styles.founder}>
          <div className={styles.founderMark}>
            <span className={styles.founderInitials} aria-hidden="true">JY</span>
            <div className={styles.founderMarkInner}>
              <p className={styles.founderName}>{copy.company.profileName}</p>
              <p className={styles.founderRole}>{h.founderRole}</p>
            </div>
          </div>
          <div>
            <Eyebrow>{h.founderEyebrow}</Eyebrow>
            <h2 className={styles.h2}><Phrase units={h.founderHeading} locale={locale} /></h2>
            <p className={`${styles.body} ${styles.jp}`}>{h.founderTeaser}</p>
            <TextLink href={L(ROUTES.company)}>{h.founderCta}</TextLink>
            <p className={styles.subLabel}>{h.messageEyebrow}</p>
            <p className={`${styles.body} ${styles.jp}`}>{h.messageTeaser}</p>
            <TextLink href={L(ROUTES.company)}>{h.messageCta}</TextLink>
          </div>
        </div>
      </Band>

      {/* 07 — origin */}
      <Band id="origin" tint>
        <Eyebrow>{h.originEyebrow}</Eyebrow>
        <h2 className={styles.h2}><Phrase units={h.originHeading} locale={locale} /></h2>
        <p className={`${styles.body} ${styles.jp}`}>{h.originBody}</p>
      </Band>

      {/* 08 — company proof */}
      <Band id="company" line>
        <Eyebrow>{h.proofEyebrow}</Eyebrow>
        <h2 className={styles.h2}><Phrase units={h.proofHeading} locale={locale} /></h2>
        <Facts facts={copy.company.facts} />
        <div style={{ marginTop: 22 }}>
          <TextLink href={L(ROUTES.company)}>{copy.chrome.nav.company}</TextLink>
        </div>
      </Band>

      {/* 09 — contact */}
      <Band id="contact" dark>
        <Eyebrow dark>{h.ctaEyebrow}</Eyebrow>
        <h2 className={styles.h2}><Phrase units={h.ctaHeading} locale={locale} /></h2>
        <p className={`${styles.lead} ${styles.jp}`} style={{ color: "var(--sys-ink-2)" }}>{h.ctaBody}</p>
        <div style={{ marginTop: 26 }}>
          <a
            className={styles.btn}
            href={L(ROUTES.contact)}
            style={{ background: "var(--sys-ink)", color: "var(--sys)", borderColor: "var(--sys-ink)" }}
          >
            {h.ctaButton}
          </a>
        </div>
      </Band>
    </>
  );
}
