import styles from "./corporate.module.css";
import { Boundary, Disclose, Eyebrow, PhraseHeading, Rows, Section } from "./pieces";
import { NetworkGlyph, ProcedureGlyph } from "./glyphs";
import { ROUTES } from "./nav";
import {
  HEADING_UNITS,
  KAKARI,
  KAKARI_PROCEDURE,
  MIRAI_MOVE,
  MIRAI_NETWORK,
  type Product,
} from "@/app/prototype/corporate/_content/site";

/**
 * CORP-P5 — one project page, parameterised by which project. PREVIEW ONLY.
 *
 * Both projects share this page structure but keep their own visual grammar and their own
 * relationship model — a network for Mirai Move, a bounded procedure for Kakari. The stage string
 * and the boundary wording are carried verbatim from the canonical content source.
 */
export default function ProjectView({ which }: { which: "mirai-move" | "kakari" }) {
  const p: Product = which === "mirai-move" ? MIRAI_MOVE : KAKARI;
  const isNetwork = which === "mirai-move";

  return (
    <>
      <Section first seam>
        <Eyebrow>事業 — {p.domain}</Eyebrow>
        <PhraseHeading units={p.lineUnits} as="h1" />
        <p className={styles.projectHead}>
          <span className={styles.stage}>{p.stage}</span>
        </p>
        <p className={`${styles.lead} ${styles.jp}`}>{p.summary}</p>
      </Section>

      <Section>
        <Eyebrow>{isNetwork ? "つなぐ相手" : "支援する手順"}</Eyebrow>
        <PhraseHeading units={isNetwork ? HEADING_UNITS.miraiNetwork : HEADING_UNITS.kakariFlow} />
        {isNetwork ? <NetworkGlyph /> : <ProcedureGlyph />}
        <p className={styles.mono}>
          {isNetwork ? `Network — 中心：${MIRAI_NETWORK.centre}` : "Procedure — 4 steps, one boundary"}
        </p>
        {isNetwork ? (
          <Rows
            items={MIRAI_NETWORK.parties.map((x, i) => ({
              no: String(i + 1).padStart(2, "0"),
              title: x.label,
              body: x.note,
            }))}
          />
        ) : (
          <Rows items={KAKARI_PROCEDURE.steps.map((s) => ({ no: s.no, title: s.label, body: s.note }))} />
        )}
        {isNetwork ? (
          <Boundary title={p.boundaryTitle}>{p.boundary}</Boundary>
        ) : (
          <Boundary title={KAKARI_PROCEDURE.boundary.label}>{KAKARI_PROCEDURE.boundary.note}</Boundary>
        )}
      </Section>

      <Section>
        <Eyebrow>詳細</Eyebrow>
        {p.detail.map((d) => (
          <div key={d.heading}>
            <h2 className={styles.h3}>{d.heading}</h2>
            <p className={`${styles.body} ${styles.jp}`}>{d.body}</p>
          </div>
        ))}
        <Disclose label="この記載の根拠">
          <p className={styles.body}>
            このページの事実は、各プロダクトの canonical
            プロジェクト文書に基づいています。確認できない実績・数値・提携は記載しません。
          </p>
        </Disclose>
        <p>
          <a className={styles.projectMore} href={ROUTES.home}>
            ← Yorisou の全体像へ
          </a>
        </p>
      </Section>
    </>
  );
}
