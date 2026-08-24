import type { Metadata } from "next";

import styles from "../corporate.module.css";
import CorporateShell from "../_components/CorporateShell";
import { Eyebrow, PageIntro, PendingState, Section } from "../_components/pieces";
import { BLOCKERS, PENDING_COMPANY_FIELDS, ROUTES } from "../_content/site";

export const metadata: Metadata = {
  title: "会社情報 — Yorisou",
  description: "正式な会社情報は、確認済みの登録情報に基づき公開します。",
  robots: { index: false, follow: false },
};

/**
 * Deliberately a designed pending state, not an apology or an empty page.
 *
 * No registered name, address, postcode, representative, establishment date, corporate number,
 * capital, or registered business purpose appears here, and the live /company page was NOT used as
 * a source — its values are internally inconsistent and unverified.
 */
export default function CompanyPage() {
  return (
    <CorporateShell current={ROUTES.company}>
      <PageIntro
        eyebrow="会社情報"
        title="会社情報"
        lead="正式な会社情報は、確認済みの登録情報に基づき公開します。"
      />

      <Section tint>
        <PendingState
          code={BLOCKERS.companyRegistration}
          headline="登記に基づく確認が済むまで、会社情報は掲載しません。"
          body="商号や所在地を推測で書くことはできます。しかし、確認できない事実を載せることは、このサイトの前提と矛盾します。登記事項証明書または定款による確認を経てから、以下の項目を掲載します。"
          fields={PENDING_COMPANY_FIELDS}
        />
      </Section>

      <Section>
        <Eyebrow>いま言えること</Eyebrow>
        <h2 className={styles.h2}>事業として動いているものは、そのまま書いています。</h2>
        <p className={styles.body}>
          会社としての登録情報は未掲載ですが、取り組んでいる事業とその現在の状態は、
          それぞれのページに事実のまま記載しています。開発中のものは開発中と書いています。
        </p>
        <p className={styles.body}>
          <a className={styles.textLink} href={ROUTES.about}>
            進め方について
          </a>
        </p>
      </Section>
    </CorporateShell>
  );
}
