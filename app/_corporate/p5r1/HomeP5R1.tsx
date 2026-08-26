import styles from "./p5r1.module.css";
import Reveal from "./Reveal";
import SystemField from "./SystemField";
import { NetworkSystem, ProcedureSystem } from "./ProjectSystems";
import { CORPORATE_NAV, ROUTES } from "../nav";
import {
  HEADING_UNITS,
  HERO_LEAD_UNITS,
  KAKARI,
  KAKARI_PROCEDURE,
  METHODS,
  MIRAI_MOVE,
  MIRAI_NETWORK,
  PROBLEM_BEATS,
  THESIS,
  THESIS_UNITS,
} from "@/app/prototype/corporate/_content/site";

/**
 * CORP-P5R1 — the AI-native homepage. HOMEPAGE ONLY. PREVIEW ONLY.
 *
 * COPY IS LOCKED. Every word here comes from the approved CORP-P5 content source. What changed is
 * composition, hierarchy, depth and motion — not strategy. If the design only worked by rewriting
 * the copy, the design would have failed.
 *
 * The page is one evolving system rather than five stacked sections:
 *   THESIS     signals emerge, relations form          SIGNAL / CONNECT
 *   PROBLEM    complexity becomes visible              CONNECT
 *   PORTFOLIO  two grammars organise two problems      RESOLVE / HAND-OFF
 *   APPROACH   constraints bound the system            RESOLVE
 *   COMPANY    the system settles and is accountable   RESOLVE (terminal)
 *
 * The human material lives on light paper; the system material lives on a dark inset surface. That
 * split is the company thesis 人 / 仕組み, and it is also the pattern five of the six benchmarked
 * companies independently arrived at.
 */

/** 人 side. Domains of life the thesis names — not personas, not users, not customers. */
const HUMAN_SIGNALS = ["暮らし", "仕事", "地域"] as const;
/** 仕組み side. The two institutional domains the products actually address. */
const SYSTEM_DOMAINS = ["モビリティ", "行政手続き"] as const;

export default function HomeP5R1() {
  return (
    <div className={styles.root}>
      <a className={styles.skipLink} href="#main">
        本文へスキップ
      </a>

      <header className={styles.header}>
        <div className={`${styles.shell} ${styles.headerInner}`}>
          <a className={styles.wordmark} href={ROUTES.home}>
            Yorisou
          </a>
          <nav className={styles.navDesktop} aria-label="サイト内ナビゲーション">
            {CORPORATE_NAV.map((i) => (
              <a key={i.href} className={styles.navLink} href={i.href}>
                {i.label}
              </a>
            ))}
          </nav>
          <details className={styles.disclosure}>
            <summary className={styles.toggle} aria-label="メニューを開閉する">
              メニュー
              <span className={styles.bars} aria-hidden="true">
                <span />
                <span />
              </span>
            </summary>
            <nav className={styles.panel} aria-label="サイト内ナビゲーション（モバイル）">
              {CORPORATE_NAV.map((i) => (
                <a key={i.href} className={styles.panelLink} href={i.href}>
                  {i.label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </header>

      <main id="main" className={styles.main}>
        {/* ── THESIS — human field | system surface ─────────────────────────── */}
        <section className={`${styles.band} ${styles.hero}`}>
          <div className={styles.env} aria-hidden="true" />
          <div className={styles.shell}>
            <div className={styles.heroGrid}>
              <Reveal className={styles.heroHuman}>
                <p className={`${styles.mono} ${styles.eyebrow}`} data-motion="signal">
                  Yorisou — Corporate
                </p>
                <h1 className={styles.h1} data-motion="signal" style={{ animationDelay: "60ms" }}>
                  {THESIS_UNITS.map((u, i) => (
                    <span className={styles.unit} key={i}>
                      {u}
                    </span>
                  ))}
                </h1>
                <p className={styles.lead} data-motion="signal" style={{ animationDelay: "140ms" }}>
                  {HERO_LEAD_UNITS.map((line, li) => (
                    <span className={styles.leadLine} key={li}>
                      {line.map((u, i) => (
                        <span className={styles.unit} key={i}>
                          {u}
                        </span>
                      ))}
                    </span>
                  ))}
                </p>
                <ul className={styles.signals} aria-label="人 — 暮らし・仕事・地域">
                  {HUMAN_SIGNALS.map((s, i) => (
                    <li
                      className={styles.signal}
                      key={s}
                      data-motion="signal"
                      style={{ animationDelay: `${220 + i * 70}ms` }}
                    >
                      <i className={styles.signalDot} aria-hidden="true" />
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className={styles.heroSystem}>
                <div className={styles.heroSystemHead}>
                  <p className={`${styles.mono} ${styles.monoDark}`}>仕組み — Systems</p>
                  <p className={`${styles.mono} ${styles.monoDark}`}>
                    {SYSTEM_DOMAINS.join(" / ")}
                  </p>
                </div>
                <div className={styles.sysFieldWrap}>
                  <SystemField />
                </div>
                {/* The accessible equivalent of the field above, stated once. */}
                <p className={`${styles.mono} ${styles.monoDark}`}>
                  人の状況を読み取り、関係として整理し、制度側へつなぐ。
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── PROBLEM — complexity becomes visible ──────────────────────────── */}
        <section className={`${styles.band} ${styles.bandRule}`} id="problem">
          <div className={styles.shell}>
            <Reveal>
              <p className={`${styles.mono} ${styles.eyebrow}`} data-motion="signal">
                取り組む問題
              </p>
              <h2 className={styles.h2} data-motion="signal" style={{ animationDelay: "60ms" }}>
                {HEADING_UNITS.problem.map((u, i) => (
                  <span className={styles.unit} key={i}>
                    {u}
                  </span>
                ))}
              </h2>
              <div className={styles.problemGrid}>
                {PROBLEM_BEATS.map((b, i) => (
                  <div
                    className={styles.problemRow}
                    key={b.no}
                    data-motion="resolve"
                    style={{ ["--i" as string]: i }}
                  >
                    <span className={`${styles.mono} ${styles.problemNo}`}>{b.no}</span>
                    <p className={styles.problemTitle}>{b.title}</p>
                    <p className={styles.problemBody}>{b.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── PORTFOLIO — two system grammars ───────────────────────────────── */}
        <section className={`${styles.band} ${styles.bandRule}`} id="projects">
          <div className={styles.shell}>
            <Reveal>
              <p className={`${styles.mono} ${styles.eyebrow}`} data-motion="signal">
                事業
              </p>
              <h2 className={styles.h2} data-motion="signal" style={{ animationDelay: "60ms" }}>
                {HEADING_UNITS.future.map((u, i) => (
                  <span className={styles.unit} key={i}>
                    {u}
                  </span>
                ))}
              </h2>
            </Reveal>

            <div className={styles.portfolio}>
              <Reveal className={styles.project} as="figure">
                <div className={`${styles.projectSystem} ${styles.projectSystemNet}`}>
                  <NetworkSystem />
                </div>
                <div className={styles.projectMeta}>
                  <div className={styles.projectHead}>
                    <h3 className={styles.projectName}>{MIRAI_MOVE.name}</h3>
                    <span className={styles.stage}>{MIRAI_MOVE.stage}</span>
                  </div>
                  <p className={styles.projectLine}>
                    {MIRAI_MOVE.lineUnits.map((u, i) => (
                      <span className={styles.unit} key={i}>
                        {u}
                      </span>
                    ))}
                  </p>
                  <ul className={styles.problemGrid} style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {MIRAI_NETWORK.parties.map((p, i) => (
                      <li className={styles.problemRow} key={p.id}>
                        <span className={`${styles.mono} ${styles.problemNo}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className={styles.problemTitle}>{p.label}</p>
                        <p className={styles.problemBody}>{p.note}</p>
                      </li>
                    ))}
                  </ul>
                  <div className={styles.boundary}>
                    <p className={styles.boundaryTitle}>{MIRAI_MOVE.boundaryTitle}</p>
                    <p className={styles.boundaryBody}>{MIRAI_MOVE.boundary}</p>
                  </div>
                  <a className={styles.more} href={ROUTES.miraiMove}>
                    Mirai Move について詳しく →
                  </a>
                </div>
              </Reveal>

              <Reveal className={styles.project} as="figure">
                <div className={`${styles.projectSystem} ${styles.projectSystemProc}`}>
                  <ProcedureSystem />
                </div>
                <div className={styles.projectMeta}>
                  <div className={styles.projectHead}>
                    <h3 className={styles.projectName}>{KAKARI.name}</h3>
                    <span className={styles.stage}>{KAKARI.stage}</span>
                  </div>
                  <p className={styles.projectLine}>
                    {KAKARI.lineUnits.map((u, i) => (
                      <span className={styles.unit} key={i}>
                        {u}
                      </span>
                    ))}
                  </p>
                  <ul className={styles.problemGrid} style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {KAKARI_PROCEDURE.steps.map((s) => (
                      <li className={styles.problemRow} key={s.no}>
                        <span className={`${styles.mono} ${styles.problemNo}`}>{s.no}</span>
                        <p className={styles.problemTitle}>{s.label}</p>
                        <p className={styles.problemBody}>{s.note}</p>
                      </li>
                    ))}
                  </ul>
                  <div className={styles.boundary}>
                    <p className={styles.boundaryTitle}>{KAKARI_PROCEDURE.boundary.label}</p>
                    <p className={styles.boundaryBody}>{KAKARI_PROCEDURE.boundary.note}</p>
                  </div>
                  <a className={styles.more} href={ROUTES.kakari}>
                    Kakari について詳しく →
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── APPROACH — constraints, rendered ON the system surface ────────── */}
        <section className={styles.constraints} id="approach">
          <div className={styles.shell}>
            <Reveal>
              <div className={styles.constraintsHead}>
                <p className={`${styles.mono} ${styles.monoDark}`} data-motion="signal">
                  つくり方 — operating constraints
                </p>
                <h2 className={`${styles.h2} ${styles.h2OnDark}`} data-motion="signal" style={{ animationDelay: "60ms" }}>
                  {HEADING_UNITS.method.map((u, i) => (
                    <span className={styles.unit} key={i}>
                      {u}
                    </span>
                  ))}
                </h2>
              </div>
              <div className={styles.constraintGrid}>
                {METHODS.map((m, i) => (
                  <div
                    className={styles.constraint}
                    key={m.no}
                    data-motion="resolve"
                    style={{ ["--i" as string]: i }}
                  >
                    <span className={styles.constraintNo}>{m.no}</span>
                    <p className={styles.constraintTitle}>{m.title}</p>
                    <p className={styles.constraintBody}>{m.short}</p>
                  </div>
                ))}
              </div>
              <details className={styles.disclose}>
                <summary className={styles.discloseSummary}>この原則が実際に何を意味するか</summary>
                <div className={styles.discloseBody}>
                  {METHODS.map((m) => (
                    <p key={m.no} style={{ marginBottom: 14 }}>
                      <strong>
                        {m.no} {m.title}
                      </strong>
                      <br />
                      {m.long}
                    </p>
                  ))}
                </div>
              </details>
            </Reveal>
          </div>
        </section>

        {/* ── COMPANY — the resolve. Calmest band on the page. ──────────────── */}
        <section className={styles.resolveBand} id="company">
          <div className={styles.shell}>
            <Reveal>
              <p className={`${styles.mono} ${styles.eyebrow}`} data-motion="signal">
                会社
              </p>
              <h2 className={styles.h2} data-motion="signal" style={{ animationDelay: "60ms" }}>
                {HEADING_UNITS.aboutTitle.map((u, i) => (
                  <span className={styles.unit} key={i}>
                    {u}
                  </span>
                ))}
              </h2>
              <p className={styles.body} data-motion="signal" style={{ animationDelay: "120ms" }}>
                事業の順番、境界の引き方、記載する事実の基準を公開しています。商号・所在地・設立・代表者・法人番号は、
                登録情報の確認後に掲載します。
              </p>
              <a className={styles.more} href={ROUTES.about}>
                私たちについて →
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <div className={styles.footerGrid}>
            <div>
              <p className={`${styles.mono} ${styles.footerTitle}`}>Yorisou</p>
              <p className={styles.footerThesis}>{THESIS}</p>
            </div>
            <div>
              <p className={`${styles.mono} ${styles.footerTitle}`}>事業</p>
              <ul className={styles.footerList}>
                <li><a className={styles.footerLink} href={ROUTES.miraiMove}>Mirai Move</a></li>
                <li><a className={styles.footerLink} href={ROUTES.kakari}>Kakari</a></li>
              </ul>
            </div>
            <div>
              <p className={`${styles.mono} ${styles.footerTitle}`}>会社</p>
              <ul className={styles.footerList}>
                <li><a className={styles.footerLink} href={ROUTES.about}>私たちについて</a></li>
                <li><a className={styles.footerLink} href={ROUTES.company}>会社情報</a></li>
                <li><a className={styles.footerLink} href={ROUTES.contact}>お問い合わせ</a></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBase}>
            <span className={styles.badge}>Preview — not published</span>
            <span>商号・所在地・設立・代表者・法人番号は、登録情報の確認後に掲載します。</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
