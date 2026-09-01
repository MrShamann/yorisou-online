import Image from "next/image";

import styles from "../site.module.css";
import { Band, Boundary, Cards, Disclose, Eyebrow, Facts, TextLink, VentureComposition, VentureName } from "../pieces";
import { NetworkSystem, ProcedureSystem } from "../systems";
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

      {/* 02 — why */}
      <Band id="why" line>
        <Eyebrow>{h.whyEyebrow}</Eyebrow>
        <h2 className={styles.h2}><Phrase units={h.whyHeading} locale={locale} /></h2>
        <Cards items={h.whyBeats} columns={3} />
      </Band>

      {/* 03 — what we build */}
      <Band id="projects" tint>
        <Eyebrow>{h.buildEyebrow}</Eyebrow>
        <h2 className={styles.h2}><Phrase units={h.buildHeading} locale={locale} /></h2>
        {/* The company-level statement, before any count: YORISOU builds several; these are public. */}
        <p className={`${styles.body} ${styles.jp}`}>{copy.ventures.publicNote}</p>
        <p className={styles.subLabel}>{copy.ventures.publicLabel}</p>
        <VentureComposition building={copy.common.buildingLabel} concept={copy.common.conceptLabel} />
        <div className={styles.projects}>
          <article className={styles.project}>
            <div className={styles.surface}>
              <NetworkSystem labels={copy.mirai.parties.map((p) => p.title)} centre={copy.mirai.centre} />
            </div>
            <div className={styles.projectHead}>
              <VentureName name="Mirai Move" reading={copy.mirai.reading} />
              <span className={styles.stage}>{copy.mirai.stage}</span>
            </div>
            <p className={`${styles.projectLead} ${styles.jp}`}>{copy.mirai.lead}</p>
            <TextLink href={L(ROUTES.miraiMove)}>{copy.common.readMore("Mirai Move")}</TextLink>
          </article>

          <article className={styles.project}>
            <div className={styles.surface}>
              <ProcedureSystem steps={copy.kakari.steps.map((s) => s.title)} boundary={copy.kakari.boundaryTitle} />
            </div>
            <div className={styles.projectHead}>
              <VentureName name="Kakari" reading={copy.kakari.reading} />
              <span className={styles.stage}>{copy.kakari.stage}</span>
            </div>
            <p className={`${styles.projectLead} ${styles.jp}`}>{copy.kakari.lead}</p>
            <TextLink href={L(ROUTES.kakari)}>{copy.common.readMore("Kakari")}</TextLink>
          </article>

          {/*
            CORP-v1.2 — Chigamo is at concept stage, so it carries no system diagram. The other two
            have a network and a procedure because those exist; drawing one here would make an
            untested idea look further along than it is. The stage chip says so outright.
          */}
          <article className={styles.project}>
            <div className={styles.projectHead}>
              <VentureName name="Chigamo" reading={copy.chigamo.reading} />
              <span className={styles.stage}>{copy.chigamo.stage}</span>
            </div>
            <p className={`${styles.projectLead} ${styles.jp}`}>{copy.chigamo.lead}</p>
            <TextLink href={L(ROUTES.chigamo)}>{copy.common.readMore("Chigamo")}</TextLink>
          </article>
        </div>
        <TextLink href={L(ROUTES.ventures)}>{copy.ventures.eyebrow}</TextLink>
      </Band>

      {/* 04 — how we build */}
      <Band id="how" dark>
        <Eyebrow dark>{h.howEyebrow}</Eyebrow>
        <h2 className={styles.h2}><Phrase units={h.howHeading} locale={locale} /></h2>
        <Cards items={h.howBeats} columns={2} dark />
        <Disclose label={h.howDisclose} dark>
          {copy.about.principlesLong.map((m) => (
            <p key={m.no} style={{ marginBottom: 14 }}>
              <strong>{m.no} {m.title}</strong>
              <br />
              {m.long}
            </p>
          ))}
        </Disclose>
      </Band>

      {/*
        CORP-v1.4 — how YORISOU stays involved in what it builds.

        This section did not exist, and its absence was the site's biggest commercial defect. The
        page walked a reader through a foundry that carries a venture to independence and then said
        nothing more, which reads as: YORISOU builds companies and hands them away. That is not the
        model. It may keep equity, hold a licence, operate jointly, or agree something else.

        It sits AFTER "how we build" on purpose. The first viewport stays the hook, the thesis and
        the ventures — a reader deciding in three seconds should not meet an economic structure. By
        the time they reach here they have seen what YORISOU builds, so the question this answers is
        the one they are actually holding.

        Every sentence is conditional, and the note underneath says outright that nothing is fixed
        in advance, because nothing is.
      */}
      <Band id="portfolio" line>
        <Eyebrow>{h.portfolioEyebrow}</Eyebrow>
        <h2 className={styles.h2}><Phrase units={h.portfolioHeading} locale={locale} /></h2>
        <p className={`${styles.body} ${styles.jp}`}>{h.portfolioBody}</p>
        {/*
          A qualifier on the paragraph above, not a boundary box. The first version wrapped this in
          <Boundary title={copy.ventures.publicLabel}>, which put the heading "Ventures currently
          public" over a sentence about what shape a venture may take — the right visual weight
          attached to the wrong label. `bodyMuted` is what the site already uses for a qualifier,
          and it needs no new string in twenty-one languages to say what it is.
        */}
        <p className={`${styles.bodyMuted} ${styles.jp}`}>{h.portfolioNote}</p>
      </Band>

      {/*
        CORP-v1.2 §7.4 — the Asterion layer.

        It sits AFTER "how we build" and before the engagement layer, as a shared floor underneath
        the ventures rather than as a fourth venture. Asterion is independent and is not owned by
        Yorisou, so the boundary note is rendered immediately with the capability claim — never
        several screens away — and there is no "powered by" badge anywhere on this page.
      */}
      <Band tint>
        <Eyebrow>{h.asterionEyebrow}</Eyebrow>
        <h2 className={styles.h2}><Phrase units={h.asterionHeading} locale={locale} /></h2>
        <p className={`${styles.body} ${styles.jp}`}>{h.asterionBody}</p>
        <Boundary title={copy.foundry.asterionBoundaryTitle}>{h.asterionNote}</Boundary>
        <TextLink href={L(ROUTES.about)}>{copy.foundry.eyebrow}</TextLink>
      </Band>

      {/* CORP-v1.2 §7.5 — how to engage. Invitations, not partnerships. */}
      <Band line>
        <Eyebrow>{h.engageEyebrow}</Eyebrow>
        <h2 className={styles.h2}><Phrase units={h.engageHeading} locale={locale} /></h2>
        <p className={`${styles.body} ${styles.jp}`}>{h.engageBody}</p>
        {/*
          CORP-v1.2R2 — the participation layer, exposed rather than hidden behind one link.
          A visitor should be able to see in seconds that there is a place for someone like them.
          Labels and states come from buildWithUs.lanes, so this grid and that page cannot drift.
        */}
        <div className={styles.engageGrid}>
          {copy.buildWithUs.lanes.map((lane) => (
            <a
              className={styles.engageCell}
              key={lane.key}
              href={`${L(ROUTES.buildWithUs)}#lane-${lane.key}`}
            >
              <p className={styles.engageLabel}>{lane.label}</p>
              {/*
                CORP-v1.2R2.1 — each role shows the ventures it connects to. This is information
                architecture, not personalisation: the list comes from that lane's own `ventures`
                field. Nothing is matched, recommended, or claimed to be chosen for the reader.
              */}
              {lane.ventures.length > 0 && (
                <ul className={styles.engageMarks}>
                  {lane.ventures.map((n) => (
                    <li className={styles.engageMark} key={n}>
                      {n}
                    </li>
                  ))}
                </ul>
              )}
              <p className={`${styles.engageState} ${styles.jp}`}>{lane.state}</p>
            </a>
          ))}
        </div>
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
