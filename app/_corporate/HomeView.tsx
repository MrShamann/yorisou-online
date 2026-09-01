import styles from "./corporate.module.css";
import { Boundary, Disclose, Eyebrow, PhraseHeading, PhraseLead, Rows, Section } from "./pieces";
import { NetworkGlyph, ProcedureGlyph } from "./glyphs";
import { ROUTES } from "./nav";
import {
  HEADING_UNITS,
  HERO_LEAD_UNITS,
  KAKARI,
  KAKARI_PROCEDURE,
  METHODS,
  MIRAI_MOVE,
  MIRAI_NETWORK,
  PROBLEM_BEATS,
  THESIS_UNITS,
} from "@/app/prototype/corporate/_content/site";

/**
 * CORP-P5 — the YORISOU LLC corporate homepage. PREVIEW ONLY.
 *
 * This is the company's narrative, not a product page. The order answers, in sequence: who YORISOU
 * is, what it chooses to work on, what it is actually building right now and at what stage, how it
 * works, and where to go next.
 *
 * Every fact comes from app/prototype/corporate/_content/site.ts, which carries a canonical `source`
 * note per claim. No customer, partner, metric, revenue, deployment or company legal fact appears
 * here, and none may be added without an authoritative source.
 */
export default function HomeView() {
  return (
    <>
      {/* 1 — who YORISOU is. The seam runs behind the first screen: 人 on one side, 仕組み on the
              other, and the thesis crossing it. */}
      <Section first seam>
        <Eyebrow>Yorisou — Corporate</Eyebrow>
        <PhraseHeading units={THESIS_UNITS} as="h1" />
        <PhraseLead lines={HERO_LEAD_UNITS} />
      </Section>

      {/* 2 — what the company chooses to work on. */}
      <Section id="problem">
        <Eyebrow>取り組む問題</Eyebrow>
        <PhraseHeading units={HEADING_UNITS.problem} />
        <Rows items={PROBLEM_BEATS.map((b) => ({ no: b.no, title: b.title, body: b.body }))} />
      </Section>

      {/* 3 — what is actually being built. Two projects, two different grammars, real stage truth,
              each linking to its own page. */}
      <Section id="projects" seam>
        <Eyebrow>事業</Eyebrow>
        <PhraseHeading units={HEADING_UNITS.future} />
        <div className={styles.portfolio}>
          <article className={styles.project}>
            <NetworkGlyph />
            <p className={styles.mono}>Network — 中心：{MIRAI_NETWORK.centre}</p>
            <div className={styles.projectHead}>
              <h3 className={styles.projectName}>{MIRAI_MOVE.name}</h3>
              <span className={styles.stage}>{MIRAI_MOVE.stage}</span>
            </div>
            <p className={`${styles.projectLine} ${styles.jp}`}>
              {MIRAI_MOVE.lineUnits.map((u, i) => (
                <span className={styles.unit} key={i}>
                  {u}
                </span>
              ))}
            </p>
            <ol className={styles.rows}>
              {MIRAI_NETWORK.parties.map((p, i) => (
                <li className={styles.row} key={p.id}>
                  <span className={`${styles.mono} ${styles.rowNo}`}>{String(i + 1).padStart(2, "0")}</span>
                  <p className={styles.rowTitle}>{p.label}</p>
                  <p className={`${styles.rowBody} ${styles.jp}`}>{p.note}</p>
                </li>
              ))}
            </ol>
            <Boundary title={MIRAI_MOVE.boundaryTitle}>{MIRAI_MOVE.boundary}</Boundary>
            <a className={styles.projectMore} href={ROUTES.miraiMove}>
              Mirai Move について詳しく →
            </a>
          </article>

          <article className={styles.project}>
            <ProcedureGlyph />
            <p className={styles.mono}>Procedure — 4 steps, one boundary</p>
            <div className={styles.projectHead}>
              <h3 className={styles.projectName}>{KAKARI.name}</h3>
              <span className={styles.stage}>{KAKARI.stage}</span>
            </div>
            <p className={`${styles.projectLine} ${styles.jp}`}>
              {KAKARI.lineUnits.map((u, i) => (
                <span className={styles.unit} key={i}>
                  {u}
                </span>
              ))}
            </p>
            <ol className={styles.rows}>
              {KAKARI_PROCEDURE.steps.map((s) => (
                <li className={styles.row} key={s.no}>
                  <span className={`${styles.mono} ${styles.rowNo}`}>{s.no}</span>
                  <p className={styles.rowTitle}>{s.label}</p>
                  <p className={`${styles.rowBody} ${styles.jp}`}>{s.note}</p>
                </li>
              ))}
            </ol>
            <Boundary title={KAKARI_PROCEDURE.boundary.label}>{KAKARI_PROCEDURE.boundary.note}</Boundary>
            <a className={styles.projectMore} href={ROUTES.kakari}>
              Kakari について詳しく →
            </a>
          </article>
        </div>
      </Section>

      {/* 4 — how the company works. Long form behind progressive disclosure so the section stays
              readable while the full commitment remains available. */}
      <Section id="approach">
        <Eyebrow>つくり方</Eyebrow>
        <PhraseHeading units={HEADING_UNITS.method} />
        <ol className={styles.rows}>
          {METHODS.map((m) => (
            <li className={styles.row} key={m.no}>
              <span className={`${styles.mono} ${styles.rowNo}`}>{m.no}</span>
              <p className={styles.rowTitle}>{m.title}</p>
              <p className={`${styles.rowBody} ${styles.jp}`}>{m.short}</p>
            </li>
          ))}
        </ol>
        <Disclose label="この原則が実際に何を意味するか">
          {METHODS.map((m) => (
            <p className={styles.body} key={m.no}>
              <strong>
                {m.no} {m.title}
              </strong>
              <br />
              {m.long}
            </p>
          ))}
        </Disclose>
      </Section>

      {/* 5 — where to go next. */}
      <Section id="company">
        <Eyebrow>会社</Eyebrow>
        <PhraseHeading units={HEADING_UNITS.aboutTitle} />
        <p className={`${styles.body} ${styles.jp}`}>
          事業の順番、境界の引き方、記載する事実の基準を公開しています。商号・所在地・設立・代表者・法人番号は、
          登録情報の確認後に掲載します。
        </p>
        <p>
          <a className={styles.projectMore} href={ROUTES.about}>
            私たちについて →
          </a>
        </p>
      </Section>
    </>
  );
}
