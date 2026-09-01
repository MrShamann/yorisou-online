import Link from "next/link";
import styles from "./site.module.css";
import field from "./operating-field.module.css";
import { localeHref } from "../i18n/locales";
import { VentureName } from "./pieces";
import { NetworkSystem, ProcedureSystem, ContextField } from "./systems";
import { VENTURE_CLASS } from "../brand";
import { VENTURE_FORMATION } from "./ventureState";
import type { SiteCopy } from "../i18n/types";

/**
 * CORP-v1.4R1 — the YORISOU Operating Field.
 *
 * v1.4 got the words right and left the experience alone. Everything after the hero was
 * Band → eyebrow → h2 → paragraph → cards, ten times, so the page read as a well-made corporate
 * explanation rather than as a company with a system. The hero was AI-native and nothing after it
 * inherited its grammar.
 *
 * These four objects carry that grammar through the rest of the site. They share one vocabulary —
 * node, line, state, boundary — and they all state something the site can actually evidence:
 *
 *   PublicVentureSurface   what is forming, at each venture's real Foundry stage
 *   ValueContinuityField   the shapes a venture may take, and that none is decided in advance
 *   ParticipationEntry     the ways in, and what each one cannot promise
 *   FoundrySpine           the eight stages as one system instead of eight cards
 *
 * WHAT THEY ARE NOT. No dashboard. No fake telemetry. No percentage of completion. No "live". No
 * matching or recommendation. Every number and state comes from `ventureState.ts`, which is set
 * from each venture's own repository evidence.
 *
 * INTERACTION IS A NATIVE RADIO GROUP — not an ARIA tabs implementation.
 *
 * The inputs are visually hidden but FOCUSABLE (`position:absolute; opacity:0; 1x1`, never
 * `display:none`), each paired with a real `<label for>`; the unselected panels are the things that
 * carry `display:none`, so exactly one panel is in the accessibility tree at a time. Arrow keys work
 * because a radio group gives them for free, and reduced motion has nothing to switch off.
 *
 * The accurate name for this is a native radio-group controlling conditional content. There are no
 * `role="tab"`, `role="tabpanel"` or `aria-selected` attributes anywhere in this file, and calling
 * it "tab semantics" — as an earlier version of this comment did — would tell the next reader to
 * expect an ARIA widget contract that is deliberately not implemented here.
 */

const STAGE_COUNT = 8;

/* ── SCENE 2 — what is forming ─────────────────────────────────────────────────────────────── */

function StageRail({ reached, concept, caption }: { reached: number; concept: boolean; caption: string }) {
  // Eight stops. Reached ones carry the signal; the marker sits on the venture's real stage. There
  // is no bar and no percentage: a venture is at a named stage or it is not.
  //
  // `aria-hidden` belongs on the DOTS, not on the rail. It was on the wrapper, which also hid the
  // caption — the venture's actual Foundry stage name, and the only place that name appears in this
  // row. That made the stage a sighted-only fact on the surface whose whole purpose is to state it.
  return (
    <div className={field.stageRail}>
      <span className={field.stageStops} aria-hidden="true">
        {Array.from({ length: STAGE_COUNT }, (_, i) => {
          const isMarker = i === reached - 1;
          return isMarker ? (
            <span key={i} className={field.stageMarker} data-state={concept ? "concept" : "building"} />
          ) : (
            <span key={i} className={field.stageStop} data-reached={i < reached ? "yes" : "no"} />
          );
        })}
      </span>
      <span className={field.stageCaption}>{caption}</span>
    </div>
  );
}

export function PublicVentureSurface({ copy, locale }: { copy: SiteCopy; locale: string }) {
  const detail = (href: string) =>
    href === "/mirai-move" ? copy.mirai : href === "/kakari" ? copy.kakari : copy.chigamo;

  return (
    <section className={field.surface} id="forming">
      <div className={styles.shell}>
        <div className={field.surfaceHeadRow}>
          <h2 className={field.surfaceTitle}>{copy.ventures.publicLabel}</h2>
          <p className={field.surfaceNote}>{copy.ventures.publicNote}</p>
        </div>

        <div className={field.ventureRows}>
          {copy.ventures.cards.map((c) => {
            const d = detail(c.href);
            const concept = VENTURE_CLASS[c.href] === "concept";
            const reached = VENTURE_FORMATION[c.href] ?? 1;
            return (
              <article className={`${field.ventureRow} ${styles.onDark}`} key={c.href}>
                <div className={field.ventureIdent}>
                  {/*
                    The SHARED identity unit, not a local re-implementation. Mark, wordmark and the
                    venture's own Japanese line are one component on every surface precisely so the
                    treatment cannot drift — which is what the claim guard checks, and it caught a
                    first version of this surface that had rebuilt the pairing by hand.

                    The link wraps the identity rather than sitting under the row as a separate
                    "read more": the first version of this surface showed three ventures with no way
                    into any of them, which is exactly the dead end the hero rail avoids.
                  */}
                  <Link href={localeHref(c.href, locale)} className={field.ventureLink}>
                    <VentureName name={c.name} reading={d.reading} as="h3" />
                  </Link>
                  <span className={field.ventureDomain}>{d.domain}</span>
                </div>

                <div className={field.ventureState}>
                  <span className={field.stateChip} data-state={concept ? "concept" : "building"}>
                    {concept ? copy.common.conceptLabel : copy.common.buildingLabel}
                  </span>
                  {/* The venture's own next step, in its own words. Never a status we invented. */}
                  <p className={`${field.ventureStateLine} ${styles.jp}`}>{d.next}</p>
                  <StageRail reached={reached} concept={concept} caption={copy.foundry.stages[reached - 1]?.name ?? ""} />
                </div>

                {/*
                  Each venture keeps its own system grammar, so the three read as different KINDS of
                  system before a word is read: a network converging, an ordered procedure stopping
                  at a boundary, and a context field that is deliberately the simplest of the three
                  because Chigamo is the least established.
                */}
                <div className={field.ventureGlyph}>
                  {c.href === "/mirai-move" ? (
                    <NetworkSystem labels={copy.mirai.parties.map((p) => p.title)} centre={copy.mirai.centre} compact />
                  ) : c.href === "/kakari" ? (
                    <ProcedureSystem steps={copy.kakari.steps.map((s) => s.title)} boundary={copy.kakari.boundaryTitle} compact />
                  ) : (
                    <ContextField place={copy.chigamo.conceptEyebrow} context={copy.chigamo.domain} result={copy.chigamo.stage} compact />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── SCENE 3 — how value continues ─────────────────────────────────────────────────────────── */

/**
 * The single most important commercial idea on the site, and until now the only one presented as a
 * paragraph. It is the second system object: one venture, and the shapes it may take.
 *
 * It is NOT a transaction chart. Nothing here has happened — no equity is held, no licence is
 * executed, nothing has been spun out — and the caption says so in the same frame as the branches.
 */
export function ValueContinuityField({ copy }: { copy: SiteCopy }) {
  const branches: readonly string[] = copy.home.portfolioBranches;
  return (
    <div className={field.continuity}>
      <svg viewBox="0 0 320 260" className={field.continuityFigure} role="presentation" aria-hidden="true" focusable="false">
        {/* the venture, defined */}
        <rect x="18" y="112" width="54" height="36" rx="2" fill="none" stroke="var(--line-3)" />
        <circle cx="45" cy="130" r="3.5" fill="var(--signal)" />
        {/* one line out, then the fan of possible shapes — dashed, because none is established */}
        <path d="M 72 130 H 108" stroke="var(--signal)" strokeWidth="1.1" fill="none" />
        {branches.map((_b: string, i: number) => {
          const y = 34 + i * 37;
          return (
            <g key={i}>
              <path
                d={`M 108 130 C 132 130, 138 ${y}, 162 ${y}`}
                fill="none"
                stroke="var(--line-3)"
                strokeWidth="1"
                strokeDasharray="3 5"
              />
              <circle cx="164" cy={y} r="3" fill="none" stroke="var(--line-3)" />
            </g>
          );
        })}
      </svg>

      <ol className={field.continuityList}>
        {branches.map((b: string, i: number) => (
          <li className={field.continuityItem} key={i}>
            <span className={field.continuityTerm}>{b}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── SCENE 4 — entering the system ─────────────────────────────────────────────────────────── */

/**
 * Six ways in, as one choice rather than six cards.
 *
 * Everything shown comes from that lane's own copy, including — always, never behind a hover —
 * what it CANNOT promise. An invitation that lists only upside is a recruitment pitch. There is no
 * matching and no recommendation here: the reader picks, the site answers.
 */
export function ParticipationEntry({ copy, idPrefix = "entry" }: { copy: SiteCopy; idPrefix?: string }) {
  const lanes = copy.buildWithUs.lanes;
  return (
    <fieldset className={field.entry}>
      <legend className={field.hiddenLegend}>{copy.buildWithUs.eyebrow}</legend>
      {lanes.map((lane, i) => (
        <input
          key={lane.key}
          className={field.radio}
          type="radio"
          name={`${idPrefix}-lane`}
          id={`${idPrefix}-${lane.key}`}
          defaultChecked={i === 0}
        />
      ))}
      <div className={field.entryBody}>
        <div className={field.entryRoles}>
          {lanes.map((lane) => (
            <label className={field.entryRole} htmlFor={`${idPrefix}-${lane.key}`} key={lane.key}>
              {lane.label}
            </label>
          ))}
        </div>
        <div className={field.entryPanels}>
          {lanes.map((lane) => (
            <div className={field.entryPanel} key={lane.key}>
              <div className={field.entryPanelGrid}>
                <div>
                  <div className={field.entryField}>
                    <span className={field.entryFieldLabel}>{lane.title}</span>
                    <span className={`${field.entryFieldValue} ${styles.jp}`}>{lane.body}</span>
                  </div>
                  {/* what this person brings — the lane's own words, never a generated match */}
                  <div className={field.entryField}>
                    <span className={field.entryFieldLabel}>{copy.common.whoLabel}</span>
                    <ul className={field.entryInvites}>
                      {lane.invites.map((t) => (
                        <li className={styles.jp} key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  {/*
                    What YORISOU can offer and what it cannot, adjacent and always visible. Putting
                    the second behind a disclosure would turn an invitation into a pitch.
                  */}
                  <div className={field.entryField}>
                    <span className={`${field.entryFieldValue} ${field.entryOffer} ${styles.jp}`}>{lane.offers}</span>
                  </div>
                  <div className={field.entryField}>
                    <span className={`${field.entryFieldValue} ${field.entryCannot} ${styles.jp}`}>{lane.cannot}</span>
                  </div>
                  {lane.ventures.length > 0 && (
                    <div className={field.entryField}>
                      {/*
                        `ventures.eyebrow` ("Ventures" / 「事業」), NOT `ventures.publicLabel`.

                        This field first shipped labelled "Ventures currently public" — and
                        `lane.ventures` is not that set. types.ts documents it as "ventures this lane
                        may be relevant to", and four of the six lanes list two of the three. So
                        selecting the team, users, research or public lane made the page state that
                        only two ventures are currently public, in every one of the twenty-one
                        locales — and on the homepage it contradicted the section directly above it,
                        which carries the identical label over all three. A neutral, already
                        translated noun states what the list is without asserting completeness.
                      */}
                      <span className={field.entryFieldLabel}>{copy.ventures.eyebrow}</span>
                      <ul className={field.entryVentures}>
                        {lane.ventures.map((v) => (
                          <li className={field.entryVenture} key={v}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className={field.entryField}>
                    <span className={`${field.entryFieldValue} ${styles.jp}`}>{lane.state}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </fieldset>
  );
}

/* ── the Foundry spine ─────────────────────────────────────────────────────────────────────── */

/**
 * Eight stages as one continuous system rather than eight cards in a grid.
 *
 * The cards were semantically correct and visually generic — the reader had to assemble a sequence
 * out of a two-column grid. A spine states the sequence, and it can carry something a card grid
 * cannot: each venture's marker, pinned at the stage its own evidence puts it at. The method stops
 * being a description and becomes the thing the three ventures are actually on.
 */
export function FoundrySpine({ copy }: { copy: SiteCopy }) {
  const stages = copy.foundry.stages;
  const atStage = (i: number) =>
    copy.ventures.cards.filter((c) => (VENTURE_FORMATION[c.href] ?? 1) === i + 1);

  return (
    <fieldset className={field.spine}>
      <legend className={field.hiddenLegend}>{copy.foundry.stagesEyebrow}</legend>
      {stages.map((s, i) => (
        <input
          key={s.no}
          className={field.radio}
          type="radio"
          name="foundry-stage"
          id={`stage-${s.no}`}
          defaultChecked={i === 0}
        />
      ))}
      <div className={field.spineBody}>
        <ol className={field.spineRail}>
          {stages.map((s, i) => (
            <li className={field.spineStopWrap} key={s.no}>
              {/*
                The venture markers sit ON the stop's own row, not under it.

                They were a block beneath the label, which pushed the stops apart wherever a venture
                sat and made the rail's connector look like it had been cut. A stage a venture has
                reached should read as one line — the stage, and who is at it.
              */}
              <label className={field.spineStop} htmlFor={`stage-${s.no}`}>
                <span className={field.spineDot} aria-hidden="true" />
                <span>
                  <span className={field.spineNo}>{s.no}</span> <span className={field.spineName}>{s.name}</span>
                </span>
                <span className={field.spineVentures}>
                  {atStage(i).map((c) => (
                    <span
                      className={field.spineVenture}
                      data-state={VENTURE_CLASS[c.href] === "concept" ? "concept" : "building"}
                      key={c.href}
                    >
                      {/*
                        The SHARED identity unit, at marker scale — not a mark beside a bare name.

                        A rail marker has no room for the venture's Japanese line, so `reading` is
                        empty and the unit renders mark + wordmark only. It must still be the unit:
                        a first version rendered `<VentureMark>` next to a raw `{c.name}` text node,
                        and the brand-paint scan caught it immediately, because a mark with no
                        wordmark element beside it cannot be attributed to any venture — which is
                        precisely the "bare English mark" CORP-v1.2R2.1 exists to prevent.
                      */}
                      <VentureName name={c.name} reading="" size="compact" as="span" />
                    </span>
                  ))}
                </span>
              </label>
            </li>
          ))}
        </ol>
        <div className={field.spinePanels}>
          {stages.map((s) => (
            <div className={field.spinePanel} key={s.no}>
              <div className={field.spinePanelInner}>
                <span className={field.spinePanelNo}>{s.no}</span>
                <h3 className={field.spinePanelName}>{s.name}</h3>
                <p className={`${field.spinePanelBody} ${styles.jp}`}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </fieldset>
  );
}
