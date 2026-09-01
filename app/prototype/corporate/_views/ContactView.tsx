import styles from "../corporate.module.css";
import CorporateShell from "../_components/CorporateShell";
import { Eyebrow, PageIntro, PendingState, Section } from "../_components/pieces";
import { BLOCKERS, type RouteSet } from "../_content/site";

/** CORP-P4A — one implementation, rendered at whichever URL set it is given. */
export default function ContactView({ routes }: { routes: RouteSet }) {
  return (
    <CorporateShell routes={routes} current={routes.contact}>
      <PageIntro
        eyebrow="お問い合わせ"
        title="お問い合わせ"
        lead="確認済みの連絡先を用意でき次第、この場所に掲載します。"
      />

      <Section tint>
        <PendingState
          code={BLOCKERS.corporateContact}
          headline="まだ受け付けを開始していません。"
          body="このページには問い合わせフォームを置いていません。送信先が確定していない状態で入力欄だけを用意すると、送ったつもりの連絡が届かないままになるためです。正式な連絡手段が決まった時点で、この場所に掲載します。"
        />
      </Section>

      <Section>
        <Eyebrow>それまでのあいだ</Eyebrow>
        <h2 className={styles.h2}>事業の内容は、各ページで確認できます。</h2>
        <p className={styles.body}>
          お問い合わせの前に事業内容をご覧になりたい場合は、それぞれのページに現在の状態を記載しています。
        </p>
        <ul className={styles.plainList}>
          <li className={styles.plainListItem}>
            <a className={styles.textLink} href={routes.miraiMove}>
              Mirai Move
            </a>
          </li>
          <li className={styles.plainListItem}>
            <a className={styles.textLink} href={routes.kakari}>
              Kakari
            </a>
          </li>
        </ul>
      </Section>
    </CorporateShell>
  );
}
