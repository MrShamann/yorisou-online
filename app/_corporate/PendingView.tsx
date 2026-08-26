import styles from "./corporate.module.css";
import { Eyebrow, PendingState, Section } from "./pieces";
import { ROUTES } from "./nav";
import { BLOCKERS, PENDING_COMPANY_FIELDS } from "@/app/prototype/corporate/_content/site";

/**
 * CORP-P5 — `/company` and `/contact`. PREVIEW ONLY.
 *
 * These routes exist, are navigable and are crawl-blocked. The pending state is designed rather than
 * apologised for: the field names are shown in full and the blocker identifier is visible, so a
 * reader can see exactly what is missing and why, and the Founder can see which blocker to clear.
 * No legal or contact fact is invented.
 */
export default function PendingView({ which }: { which: "company" | "contact" }) {
  const isCompany = which === "company";
  return (
    <Section first seam>
      <Eyebrow>{isCompany ? "会社情報" : "お問い合わせ"}</Eyebrow>
      <h1 className={styles.h1}>
        <span className={styles.unit}>{isCompany ? "登録情報の確認後に、" : "正式な連絡先の確認後に、"}</span>
        <span className={styles.unit}>掲載します。</span>
      </h1>
      <PendingState
        code={isCompany ? BLOCKERS.companyRegistration : BLOCKERS.corporateContact}
        headline={isCompany ? "掲載予定の項目" : "連絡先は準備中です"}
        body={
          isCompany
            ? "商業登記に基づく情報が確認できるまで、会社情報は掲載しません。確認できない事実を先に書かないことは、このサイト全体の基準です。"
            : "検証済みの法人連絡先が確立するまで、問い合わせ窓口は公開しません。到達しない連絡先を掲載することは、掲載しないことより不誠実だと考えています。"
        }
        fields={isCompany ? PENDING_COMPANY_FIELDS : undefined}
      />
      <p>
        <a className={styles.projectMore} href={ROUTES.about}>
          ← 私たちについて
        </a>
      </p>
    </Section>
  );
}
