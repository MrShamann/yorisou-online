import styles from "../corporate.module.css";
import CorporateShell from "../_components/CorporateShell";
import { Eyebrow, ProductComposition, Section } from "../_components/pieces";
import { PhraseHeading, PhraseText, ThesisFigure } from "../_components/visuals";
import {
  HEADING_UNITS,
  HERO_LEAD_UNITS,
  METHODS,
  PRODUCTS,
  PROBLEM_BEATS,
  productHref,
  THESIS_UNITS,
  type RouteSet,
} from "../_content/site";

/**
 * CORP-P4A — the accepted homepage, rendered from one implementation at whichever URL set it is
 * given. `/prototype/corporate` and the final-route candidate `/` both render this view; nothing is
 * duplicated, so the two surfaces cannot drift apart.
 */
export default function HomeView({ routes }: { routes: RouteSet }) {
  return (
    <CorporateShell current={routes.home} routes={routes}>
      <Section first>
        <div className={`${styles.heroGrid} ${styles.reveal}`}>
          <div>
            <PhraseHeading as="h1" units={THESIS_UNITS} className={styles.thesis} />
            <PhraseText lines={HERO_LEAD_UNITS} className={styles.lead} />
            <div className={styles.heroChips}>
              {PRODUCTS.map((p) => (
                <a key={p.key} className={styles.heroChip} href={productHref(p, routes)}>
                  <i className={styles.dot} aria-hidden="true" />
                  <span className={styles.heroChipName}>{p.name}</span>
                  <span className={styles.heroChipField}>
                    {p.key === "mirai-move" ? "モビリティ" : "行政手続き"}
                  </span>
                </a>
              ))}
            </div>
          </div>
          <ThesisFigure />
        </div>
      </Section>

      <Section id="problem" tint>
        <Eyebrow>なぜ</Eyebrow>
        <PhraseHeading units={HEADING_UNITS.problem} className={styles.h2} />
        <p className={styles.body}>
          必要な情報はどこかに公開されている。手続きの方法も、制度上は決まっている。
          それでも、目の前の人が前に進めないことがあります。
        </p>
        <p className={styles.body}>
          言葉が違う。前提知識がない。どこから始めればいいのかが、どこにも書かれていない。
          これは本人の能力の問題ではなく、社会の側の設計の問題だと考えています。
        </p>
        <ul className={styles.beats}>
          {PROBLEM_BEATS.map((b) => (
            <li className={styles.beat} key={b.no}>
              <h3 className={styles.beatTitle}>
                <span className={styles.beatIndex} aria-hidden="true">
                  {b.no}
                </span>
                {b.title}
              </h3>
              <p className={styles.beatBody}>{b.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <Eyebrow>どうつくるか</Eyebrow>
        <PhraseHeading units={HEADING_UNITS.method} className={styles.h2} />
        <ul className={styles.methodList}>
          {METHODS.map((m) => (
            <li className={styles.method} key={m.no}>
              <span className={styles.methodNo} aria-hidden="true">
                {m.no}
              </span>
              <h3 className={styles.methodTitle}>{m.title}</h3>
              <p className={styles.methodBody}>{m.short}</p>
            </li>
          ))}
        </ul>
        <p className={styles.productMore}>
          <a className={styles.textLink} href={routes.about}>
            私たちの進め方について
          </a>
        </p>
      </Section>

      <section id="portfolio">
        {PRODUCTS.map((p, i) => (
          <ProductComposition key={p.key} product={p} index={i} routes={routes} />
        ))}
      </section>

      <Section tint>
        <Eyebrow>これから</Eyebrow>
        <PhraseHeading units={HEADING_UNITS.future} className={styles.h2} />
        <p className={styles.body}>
          領域は違っても、扱っている問題は同じです。制度や仕組みの側が複雑で、人が前に進めない。
          その距離を縮めるプロダクトを、ひとつずつ増やしていきます。
        </p>
        <p className={styles.body}>
          同時に多くを広げることはしません。ひとつの領域で、手順の最後まで責任を持てる状態をつくってから、
          次に進みます。新しい事業は、公開できる段階になってからこのページに掲載します。
        </p>
      </Section>
    </CorporateShell>
  );
}
