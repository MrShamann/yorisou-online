import styles from "../site.module.css";
import { Band, Boundary, Cards, Disclose, Eyebrow, Facts, TextLink, VentureName } from "../pieces";
import { NetworkSystem, ProcedureSystem } from "../systems";
import FoundryField from "../FoundryField";
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
      {/* 01 — company hero */}
      <section className={styles.hero}>
        <div className={styles.heroField} aria-hidden="true" />
        <div className={styles.shell}>
          <div className={styles.heroGrid}>
            <div>
              <Eyebrow>{h.eyebrow}</Eyebrow>
              <h1 className={styles.h1}>
                <Phrase units={h.thesis} locale={locale} />
              </h1>
              <p className={`${styles.lead} ${styles.jp}`}>
                {h.lead.map((line, i) => (
                  <span className={styles.leadLine} key={i}>{line}</span>
                ))}
              </p>
              <ul className={styles.chips} aria-label={`${h.humanSide} — ${h.humanItems.join(" / ")}`}>
                {h.humanItems.map((s) => (
                  <li className={styles.chip} key={s}>
                    <i className={styles.chipDot} aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>
              {/*
                CORP-v1.2R2 — the "30 seconds" affordance. It opens the extended web-native
                explainer built from the same system grammar; no recorded film is claimed to exist,
                and no placeholder media file is shipped in its place.
              */}
              <p className={styles.explainer}>
                <a className={styles.explainerBtn} href={L(ROUTES.about) + "#explainer"}>
                  <span className={styles.explainerDot} aria-hidden="true" />
                  {h.explainerLabel}
                </a>
              </p>
            </div>
            <div className={styles.surface}>
              <div className={styles.surfaceHead}>
                <p className={`${styles.mono} ${styles.monoDark}`}>{h.systemSide}</p>
                <p className={`${styles.mono} ${styles.monoDark}`}>{h.systemItems.join(" / ")}</p>
              </div>
              <div className={styles.surfaceFig}>
                {/*
                  CORP-v1.2R2 — the hero now states the operating model as behaviour rather than as
                  a picture. Labels are drawn from foundry.stages, which already exists in all 21
                  locales, so the field is fully localised without adding a translatable string.
                */}
                <FoundryField
                  evidence={copy.foundry.stages[1]?.name ?? ""}
                  venture={copy.foundry.stages[2]?.name ?? ""}
                  team={copy.foundry.stages[5]?.name ?? ""}
                  independent={copy.foundry.stages[6]?.name ?? ""}
                  infrastructure={copy.foundry.asterionEyebrow}
                />
              </div>
              <p className={`${styles.mono} ${styles.monoDark}`}>{h.fieldCaption}</p>
            </div>
          </div>
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
