import type { Metadata } from "next";

import {
  HERO_LEAD_UNITS,
  KAKARI,
  KAKARI_PROCEDURE,
  MIRAI_MOVE,
  MIRAI_NETWORK,
  THESIS_UNITS,
} from "../_content/site";
import styles from "./aida.module.css";

/**
 * CORP-P4AR2R1-PROTO — Direction B「あいだ」, FIRST SCREEN ONLY. LOCAL PROTOTYPE.
 *
 * WHAT THIS IS. A single-section prototype of one creative direction, at a prototype URL. It does
 * NOT replace the accepted CORP-P3R1 system at /prototype/corporate, and it changes no final route.
 * It exists to answer one question before anything larger is proposed: does the seam concept survive
 * 390px, where it has to collapse from two facing columns into one.
 *
 * WHY THE LAYOUT LOOKS LIKE THIS. The company's thesis is 「人と社会のあいだに、次のよりそいをつくる。」
 * The layout is that sentence: 人 on one side, 仕組み on the other, one jade seam between them, and
 * content crossing the seam only where Yorisou actually bridges — Mirai Move and Kakari. The seam is
 * the only place the accent colour appears anywhere on the page.
 *
 * Typographic discipline is Direction A「規格」: hairlines define regions, no cards, no shadows, no
 * rounded corners, no fills. Inter carries indices and labels with tabular figures; Noto Sans JP
 * carries the Japanese at 1.9 leading.
 *
 * The two products keep DIFFERENT grammars, because that difference is real: Mirai Move is a
 * NETWORK (parties around a shared centre), Kakari is a PROCEDURE (ordered steps ending at a
 * boundary gate). Rendering them as two matching cards would erase the only thing that distinguishes
 * them.
 *
 * CONSTRAINTS HELD: server component, no client boundary, no new dependency, no runtime model call,
 * no AI-purple, no glassmorphism, no floating cards, no stock imagery, no particles, no 3D/WebGL.
 * Motion is one finite 900ms seam draw that expresses a real thing — the seam being established —
 * and is fully drawn under prefers-reduced-motion. Progressive enhancement only: with JavaScript
 * disabled every word and both glyphs still render, and the disclosure is a native <details>.
 *
 * EVERY FACT ON THIS PAGE COMES FROM ../_content/site.ts, which carries a canonical `source` note
 * per claim. No company legal fact, customer, partner, case study, metric or funding claim appears
 * here, and none may be added without an authoritative source.
 */
export const metadata: Metadata = {
  title: "あいだ — Direction B prototype | Yorisou",
  robots: { index: false, follow: false },
};

/** 人 side. Domains of life the thesis names — not personas, not customers. */
const HUMAN_SIDE = [
  { i: "01", label: "暮らし" },
  { i: "02", label: "仕事" },
  { i: "03", label: "地域" },
] as const;

/** 仕組み side. The two institutional domains the products actually address. */
const SYSTEM_SIDE = [
  { i: "01", label: "モビリティ" },
  { i: "02", label: "行政手続き" },
] as const;

/**
 * Mirai Move — NETWORK glyph. Parties around a shared centre, each connected to it. Positions are
 * symbolic: no coordinate implies geography and no edge implies a transaction volume. Decorative;
 * the ordered list beside it is the accessible equivalent.
 */
function NetworkGlyph() {
  const seats = [
    { x: 26, y: 26 },
    { x: 114, y: 26 },
    { x: 26, y: 94 },
    { x: 114, y: 94 },
  ];
  return (
    <svg className={styles.glyph} viewBox="0 0 140 120" role="presentation" aria-hidden="true" focusable="false">
      {seats.map((s, i) => (
        <line key={`e${i}`} x1={s.x} y1={s.y} x2="70" y2="60" stroke="rgba(12,14,13,0.16)" strokeWidth="1" />
      ))}
      {seats.map((s, i) => (
        <circle key={`n${i}`} cx={s.x} cy={s.y} r="5" fill="#fbfaf6" stroke="rgba(12,14,13,0.34)" />
      ))}
      <circle cx="70" cy="60" r="17" fill="#fbfaf6" stroke="#2f6b5e" strokeWidth="1.2" />
      <circle cx="70" cy="60" r="2.6" fill="#2f6b5e" />
    </svg>
  );
}

/**
 * Kakari — PROCEDURE glyph. Ordered steps down a single line, ending at a rule the procedure does
 * not cross. Structurally unlike the network on purpose.
 */
function ProcedureGlyph() {
  return (
    <svg className={styles.glyph} viewBox="0 0 140 120" role="presentation" aria-hidden="true" focusable="false">
      <line x1="20" y1="14" x2="20" y2="86" stroke="rgba(12,14,13,0.16)" strokeWidth="1" />
      {[14, 38, 62, 86].map((y, i) => (
        <circle key={i} cx="20" cy={y} r="4" fill="#fbfaf6" stroke="rgba(12,14,13,0.34)" />
      ))}
      {[14, 38, 62, 86].map((y, i) => (
        <line key={`t${i}`} x1="26" y1={y} x2="112" y2={y} stroke="rgba(12,14,13,0.11)" strokeWidth="1" />
      ))}
      {/* the gate — where the procedure stops */}
      <line x1="8" y1="102" x2="132" y2="102" stroke="#2f6b5e" strokeWidth="1.2" />
      <circle cx="20" cy="102" r="2.6" fill="#2f6b5e" />
    </svg>
  );
}

export default function AidaPrototype() {
  return (
    <div className={styles.stage}>
      <a className={styles.skipLink} href="#main">
        本文へスキップ
      </a>

      {/* 規格 header — the page declares what it is, in the register of a specification cover. */}
      <header className={styles.specHead}>
        <div className={`${styles.shell} ${styles.specRow}`}>
          <p className={styles.specId}>Yorisou — Corporate / Direction B「あいだ」</p>
          <ul className={styles.specState}>
            <li>
              事業 <b>2</b>
            </li>
            <li>
              Local prototype <b>first screen</b>
            </li>
            <li>
              Not published <b>noindex</b>
            </li>
          </ul>
        </div>
      </header>

      <main id="main" className={styles.shell}>
        <div className={styles.seamStage}>
          {/* The seam. One line, the only jade on the page. */}
          <div className={styles.seam} aria-hidden="true">
            <span className={styles.seamNode} data-at="bridge" />
            <span className={styles.seamNode} data-at="mirai" />
            <span className={styles.seamNode} data-at="kakari" />
          </div>

          {/* The bridge — the one element allowed to cross the seam. */}
          <div className={styles.bridge}>
            <h1 className={styles.thesis}>
              {THESIS_UNITS.map((u, i) => (
                <span className={styles.unit} key={i}>
                  {u}
                </span>
              ))}
            </h1>
            <p className={styles.lead}>
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
          </div>

          <section className={`${styles.side} ${styles.human}`} aria-labelledby="side-human">
            <p className={styles.sideLabel} id="side-human">
              People <em>人</em>
            </p>
            <ul className={styles.sideList}>
              {HUMAN_SIDE.map((h) => (
                <li key={h.i}>
                  <i>{h.i}</i>
                  {h.label}
                </li>
              ))}
            </ul>
          </section>

          <section className={`${styles.side} ${styles.systems}`} aria-labelledby="side-systems">
            <p className={styles.sideLabel} id="side-systems">
              Systems <em>仕組み</em>
            </p>
            <ul className={styles.sideList}>
              {SYSTEM_SIDE.map((s) => (
                <li key={s.i}>
                  <i>{s.i}</i>
                  {s.label}
                </li>
              ))}
            </ul>
          </section>

          {/* Crossing 01 — Mirai Move. NETWORK. */}
          <section className={`${styles.crossing} ${styles.crossingMirai}`} aria-labelledby="cross-mirai">
            <div className={styles.crossHead}>
              <h2 className={styles.crossName} id="cross-mirai">
                {MIRAI_MOVE.name}
              </h2>
              <span className={styles.crossStage}>{MIRAI_MOVE.stage}</span>
            </div>
            <p className={styles.crossLine}>
              {MIRAI_MOVE.lineUnits.map((u, i) => (
                <span className={styles.unit} key={i}>
                  {u}
                </span>
              ))}
            </p>
            <div className={styles.crossBody}>
              <ol className={styles.miniList}>
                {MIRAI_NETWORK.parties.map((p, i) => (
                  <li key={p.id}>
                    <i>{String(i + 1).padStart(2, "0")}</i>
                    <span>
                      {p.label}
                      <span className={styles.miniNote}>　{p.note}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div className={styles.glyphWrap}>
                <NetworkGlyph />
                <p className={styles.glyphNote}>Network — 中心：{MIRAI_NETWORK.centre}</p>
              </div>
            </div>
          </section>

          {/* Crossing 02 — Kakari. PROCEDURE, ending at a gate. */}
          <section className={`${styles.crossing} ${styles.crossingKakari}`} aria-labelledby="cross-kakari">
            <div className={styles.crossHead}>
              <h2 className={styles.crossName} id="cross-kakari">
                {KAKARI.name}
              </h2>
              <span className={styles.crossStage}>{KAKARI.stage}</span>
            </div>
            <p className={styles.crossLine}>
              {KAKARI.lineUnits.map((u, i) => (
                <span className={styles.unit} key={i}>
                  {u}
                </span>
              ))}
            </p>
            <div className={styles.crossBody}>
              <div className={styles.glyphWrap}>
                <ProcedureGlyph />
                <p className={styles.glyphNote}>Procedure — 4 steps, one boundary</p>
              </div>
              <div>
                <ol className={styles.miniList}>
                  {KAKARI_PROCEDURE.steps.map((s) => (
                    <li key={s.no}>
                      <i>{s.no}</i>
                      <span>
                        {s.label}
                        <span className={styles.miniNote}>　{s.note}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                {/* Required wording, verbatim. The boundary is a step, not a footnote. */}
                <div className={styles.gate}>
                  <p className={styles.gateLabel}>{KAKARI_PROCEDURE.boundary.label}</p>
                  <p className={styles.gateNote}>{KAKARI_PROCEDURE.boundary.note}</p>
                </div>
              </div>
            </div>
          </section>

          {/*
            Verifiable status. Deliberately a closed disclosure rather than a hero statistic: route
            counts are an internal verification boundary, not a value proposition, and a company
            homepage that leads with its own crawl census is talking about itself instead of its
            work. Wording says what it is — state derived at build time from files in this
            repository — and never implies a runtime model.
          */}
          <div className={styles.verify}>
            <details className={styles.verifyBox}>
              <summary className={styles.verifySummary}>検証可能な状態 / Verification boundary</summary>
              <div className={styles.verifyBody}>
                <dl>
                  <dt>Products</dt>
                  <dd>2（Mirai Move / Kakari）</dd>
                  <dt>Stage source</dt>
                  <dd>各プロダクトの canonical プロジェクト文書</dd>
                  <dt>Claims</dt>
                  <dd>出典のある記述のみ掲載（出典のないものは掲載しない）</dd>
                  <dt>Company facts</dt>
                  <dd>登録情報の確認後に掲載（現在は未掲載）</dd>
                </dl>
                <p>
                  このページの事実は、すべてリポジトリ内の単一の内容ソースから生成しています。
                  実行時のモデル呼び出しは行っていません。確認できない実績・数値・提携は記載しません。
                </p>
              </div>
            </details>
          </div>
        </div>
      </main>
    </div>
  );
}
