import styles from "../site.module.css";
import { Band, Cards, Disclose, Eyebrow, Facts, TextLink } from "../pieces";
import { HeroField, NetworkSystem, ProcedureSystem } from "../systems";
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
            </div>
            <div className={styles.surface}>
              <div className={styles.surfaceHead}>
                <p className={`${styles.mono} ${styles.monoDark}`}>{h.systemSide}</p>
                <p className={`${styles.mono} ${styles.monoDark}`}>{h.systemItems.join(" / ")}</p>
              </div>
              <div className={styles.surfaceFig}>
                <HeroField human={h.humanItems} systems={h.systemItems} relation={h.fieldRelation} />
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
              <h3 className={styles.projectName}>Mirai Move</h3>
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
              <h3 className={styles.projectName}>Kakari</h3>
              <span className={styles.stage}>{copy.kakari.stage}</span>
            </div>
            <p className={`${styles.projectLead} ${styles.jp}`}>{copy.kakari.lead}</p>
            <TextLink href={L(ROUTES.kakari)}>{copy.common.readMore("Kakari")}</TextLink>
          </article>
        </div>
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
