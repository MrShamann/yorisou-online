import type { Metadata } from "next";

import styles from "../corporate.module.css";
import CorporateShell from "../_components/CorporateShell";
import { Eyebrow, PageIntro, Section } from "../_components/pieces";
import { METHODS, PRODUCTS, ROUTES } from "../_content/site";

export const metadata: Metadata = {
  title: "私たちについて — Yorisou",
  description:
    "現場の手順から始め、次の一手が分かるところまでを設計し、境界を明示し、検証できることだけを書く。Yorisouの進め方。",
  robots: { index: false, follow: false },
};

/**
 * Method only. No company history, team size, funding, partners, customers, or founder biography —
 * none of that has a verifiable source, so none of it appears. What we can prove is how we work.
 */
export default function AboutPage() {
  return (
    <CorporateShell current={ROUTES.about}>
      <PageIntro
        eyebrow="私たちについて"
        title="つくり方が、そのまま約束になる。"
        lead="Yorisouがどんな順番で考え、どこで線を引いているか。掲げている価値ではなく、実際の進め方を書いています。"
      />

      <Section tint>
        <Eyebrow>進め方</Eyebrow>
        <ol className={styles.methodLong}>
          {METHODS.map((m) => (
            <li className={styles.methodLongItem} key={m.no}>
              <span className={styles.methodNo} aria-hidden="true">
                {m.no}
              </span>
              <h2 className={styles.methodLongTitle}>{m.title}</h2>
              <p className={styles.methodLongBody}>{m.long}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <Eyebrow>順番について</Eyebrow>
        <h2 className={styles.h2}>ひとつずつ、最後まで。</h2>
        <p className={styles.body}>
          領域を広げることよりも、ひとつの手順を最後まで引き受けられる状態を先につくります。
          途中まで支援して残りを利用者に返してしまう製品は、結局その人の負担を減らしません。
        </p>
        <p className={styles.body}>
          いま取り組んでいるのは、次の二つの領域です。どちらもまだ開発段階にあり、
          それぞれのページに現在の状態をそのまま記載しています。
        </p>
        <ul className={styles.plainList}>
          {PRODUCTS.map((p) => (
            <li key={p.key} className={styles.plainListItem}>
              <a className={styles.textLink} href={p.href}>
                {p.name}
              </a>
              <span className={styles.plainListNote}>{p.stage}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section tint>
        <Eyebrow>書かないこと</Eyebrow>
        <h2 className={styles.h2}>確認できないことは、書きません。</h2>
        <p className={styles.body}>
          このサイトには、数値や企業名を用いた実績の紹介を掲載していません。
          掲載できる根拠がまだないためです。根拠ができた時点で、根拠とともに掲載します。
        </p>
        <p className={styles.body}>
          会社情報についても同じ扱いです。登記に基づく確認ができるまで、商号・所在地・代表者・設立日を掲載しません。
        </p>
      </Section>
    </CorporateShell>
  );
}
