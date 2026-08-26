import styles from "./corporate.module.css";
import { Disclose, Eyebrow, PhraseHeading, Rows, Section } from "./pieces";
import { ROUTES } from "./nav";
import { HEADING_UNITS, METHODS, THESIS_UNITS } from "@/app/prototype/corporate/_content/site";

/** CORP-P5 — company identity and operating philosophy. PREVIEW ONLY. */
export default function AboutView() {
  return (
    <>
      <Section first seam>
        <Eyebrow>私たちについて</Eyebrow>
        <PhraseHeading units={THESIS_UNITS} as="h1" />
        <p className={`${styles.lead} ${styles.jp}`}>
          Yorisouは、暮らし・仕事・地域にある複雑さを見つめ、人が理解し、選び、前に進めるプロダクトをつくる会社です。
        </p>
      </Section>

      <Section>
        <Eyebrow>つくり方</Eyebrow>
        <PhraseHeading units={HEADING_UNITS.method} />
        <Rows items={METHODS.map((m) => ({ no: m.no, title: m.title, body: m.short }))} />
        <Disclose label="それぞれの原則の全文">
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

      <Section>
        <Eyebrow>順番</Eyebrow>
        <PhraseHeading units={HEADING_UNITS.aboutOrder} />
        <p className={`${styles.body} ${styles.jp}`}>
          一度に多くを立ち上げることはしません。ひとつの領域で、現場の手順に届くところまでつくり切ることを優先します。
        </p>
        <PhraseHeading units={HEADING_UNITS.aboutClaims} />
        <p className={`${styles.body} ${styles.jp}`}>
          掲載する事実には、必ずそれを裏づける記録があります。書けることが少ない時期は、少ないまま出します。
        </p>
        <p>
          <a className={styles.projectMore} href={ROUTES.company}>
            会社情報 →
          </a>
        </p>
      </Section>
    </>
  );
}
