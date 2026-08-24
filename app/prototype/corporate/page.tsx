import type { Metadata } from "next";

import styles from "./corporate.module.css";
import CorporateShell from "./_components/CorporateShell";
import { Eyebrow, ProductComposition, Section } from "./_components/pieces";
import { HERO_LEAD, METHODS, PRODUCTS, PROBLEM_BEATS, ROUTES, THESIS } from "./_content/site";

export const metadata: Metadata = {
  title: "Yorisou — 人と社会のあいだに、次のよりそいをつくる。",
  description:
    "Yorisouは、暮らし・仕事・地域にある複雑さを見つめ、人が理解し、選び、前に進めるプロダクトをつくる会社です。",
  robots: { index: false, follow: false },
};

/**
 * CORP-P2 homepage. The first viewport must land three things: Yorisou is a product company, it
 * works on the complexity between people and social systems, and Mirai Move and Kakari are two
 * concrete and separate businesses. Hence the domain markers directly under the lead — they name
 * the two fields before a reader scrolls, without claiming anything about either product's stage.
 */
export default function CorporateHome() {
  return (
    <CorporateShell current={ROUTES.home}>
      <Section first>
        <div className={styles.reveal}>
          <h1 className={styles.thesis}>{THESIS}</h1>
          <p className={styles.lead}>
            {HERO_LEAD[0]}
            <br />
            {HERO_LEAD[1]}
          </p>
          <div className={styles.heroMeta}>
            {PRODUCTS.map((p) => (
              <a key={p.key} className={styles.heroChip} href={p.href}>
                <i className={styles.dot} aria-hidden="true" />
                <span className={styles.heroChipName}>{p.name}</span>
                <span className={styles.heroChipField}>
                  {p.key === "mirai-move" ? "モビリティ" : "行政手続き"}
                </span>
              </a>
            ))}
          </div>
        </div>
      </Section>

      <Section id="problem" tint>
        <Eyebrow>なぜ</Eyebrow>
        <h2 className={styles.h2}>複雑さは、個人の努力だけでは解けない。</h2>
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
        <h2 className={styles.h2}>複雑さを引き受けて、使えるかたちにする。</h2>
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
          <a className={styles.textLink} href={ROUTES.about}>
            私たちの進め方について
          </a>
        </p>
      </Section>

      <section id="portfolio">
        {PRODUCTS.map((p, i) => (
          <ProductComposition key={p.key} product={p} index={i} />
        ))}
      </section>

      <Section tint>
        <Eyebrow>これから</Eyebrow>
        <h2 className={styles.h2}>次のよりそいを、順番につくる。</h2>
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
