import type { Metadata } from "next";

import styles from "./corporate.module.css";

/**
 * YORISOU CORPORATE HOMEPAGE — PHASE 1 PREVIEW
 *
 * Preview-only. Lives under /prototype, which AppShell already suppresses, so this surface renders
 * without any consumer chrome (no AppHeader, no SiteFooter, no MobileBottomNav) and required zero
 * changes to existing routes.
 *
 * HARD CONSTRAINTS HELD BY THIS FILE:
 *   - Static. No client component, no state, no effects, no fetch. Zero network requests at runtime.
 *   - No Supabase, no auth, no cookies, no Life OS, no LINE, no consumer product data.
 *   - Every factual claim about Mirai Move and Kakari is sourced from that product's own canonical
 *     PROJECT_START_HERE.md / AGENT_PROJECT_RULES.md and is cited inline below.
 *   - No company registration fact is rendered. The registration source is missing; the company
 *     section renders an honest placeholder and never the guessed values from /company.
 *   - No metrics, customers, partners, testimonials, awards, or press.
 *   - No medical, diagnostic, therapeutic or counselling framing anywhere.
 */

export const metadata: Metadata = {
  title: "Yorisou — 人と社会のあいだに、次のよりそいをつくる。",
  description:
    "Yorisouは、暮らし・仕事・地域にある複雑さを見つめ、人が理解し、選び、前に進めるプロダクトをつくる会社です。",
  robots: { index: false, follow: false },
};

/** Route lines and nodes — the "quiet infrastructure / living signal" motif. Decorative only. */
function RouteDiagram({
  nodes,
  label,
}: {
  nodes: readonly string[];
  label: string;
}) {
  const span = 100 / (nodes.length - 1 || 1);
  return (
    <>
      <svg
        className={styles.diagram}
        viewBox="0 0 100 26"
        preserveAspectRatio="none"
        role="img"
        aria-label={label}
      >
        <line
          x1="0"
          y1="9"
          x2="100"
          y2="9"
          stroke="rgba(12,14,13,0.16)"
          strokeWidth="0.25"
          vectorEffect="non-scaling-stroke"
        />
        {nodes.map((_, i) => (
          <circle
            key={i}
            className={i === nodes.length - 1 ? styles.signal : undefined}
            cx={i * span}
            cy="9"
            r="0.9"
            fill={i === nodes.length - 1 ? "#2f6b5e" : "rgba(12,14,13,0.28)"}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <p className={styles.diagramCaption} aria-hidden="true">
        {nodes.join("　→　")}
      </p>
    </>
  );
}

const METHODS = [
  {
    no: "01",
    title: "現場の言葉から始める",
    body: "技術から発想しません。実際に困っている人の手順から逆算して設計します。",
  },
  {
    no: "02",
    title: "わかるところまでをプロダクトの責任にする",
    body: "情報を出して終わりにしない。次に何をすればよいかが分かる状態までを、設計に含めます。",
  },
  {
    no: "03",
    title: "境界を明示する",
    body: "専門家が担うべき領域には踏み込みません。どこまでを担い、どこから人に渡すかを、製品の中で明示します。",
  },
  {
    no: "04",
    title: "検証できることだけを言う",
    body: "実績・数値・提携は、証拠のあるものだけを記載します。確認できないことは、書きません。",
  },
] as const;

const BEATS = [
  {
    no: "01",
    title: "「わからない」が入口で止める。",
    body: "制度は存在しても、たどり着けなければ無いのと同じです。",
  },
  {
    no: "02",
    title: "専門家に渡すまでが遠い。",
    body: "本当に人の判断が必要な場面の手前に、仕組みが担えるはずの距離があります。",
  },
  {
    no: "03",
    title: "現場と仕組みが噛み合わない。",
    body: "移動・福祉・行政の現場には、まだ届いていない選択肢があります。",
  },
] as const;

export default function CorporateHomepagePreview() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={`${styles.shell} ${styles.headerInner}`}>
          <a className={styles.wordmark} href="#top">
            Yorisou
          </a>
          <nav className={styles.nav} aria-label="サイト内ナビゲーション">
            <a className={styles.navLink} href="#problem">
              私たちについて
            </a>
            <a className={styles.navLink} href="#portfolio">
              事業
            </a>
            <a className={styles.navLink} href="#company">
              会社情報
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* 1 — Hero */}
        <section className={`${styles.section} ${styles.sectionFirst}`}>
          <div className={`${styles.shell} ${styles.reveal}`}>
            <h1 className={styles.thesis}>人と社会のあいだに、次のよりそいをつくる。</h1>
            <p className={styles.lead}>
              Yorisouは、暮らし・仕事・地域にある複雑さを見つめ、
              <br />
              人が理解し、選び、前に進めるプロダクトをつくる会社です。
            </p>
            <div className={styles.heroMeta}>
              <span>
                <i className={styles.dot} aria-hidden="true" />
                モビリティ
              </span>
              <span>
                <i className={styles.dot} aria-hidden="true" />
                行政手続き
              </span>
              <span>
                <i className={styles.dot} aria-hidden="true" />
                日本語・多言語
              </span>
            </div>
          </div>
        </section>

        {/* 2 — The problem */}
        <section className={styles.section} id="problem">
          <div className={styles.shell}>
            <p className={styles.eyebrow}>なぜ</p>
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
              {BEATS.map((b) => (
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
          </div>
        </section>

        {/* 3 — How we build */}
        <section className={styles.section}>
          <div className={styles.shell}>
            <p className={styles.eyebrow}>どうつくるか</p>
            <h2 className={styles.h2}>複雑さを引き受けて、使えるかたちにする。</h2>
            <ul className={styles.methodList}>
              {METHODS.map((m) => (
                <li className={styles.method} key={m.no}>
                  <span className={styles.methodNo} aria-hidden="true">
                    {m.no}
                  </span>
                  <h3 className={styles.methodTitle}>{m.title}</h3>
                  <p className={styles.methodBody}>{m.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4 — Portfolio. Two distinct full-width compositions, deliberately not a card grid. */}
        <section id="portfolio">
          {/* Mirai Move — every claim from mirai-move/PROJECT_START_HERE.md + AGENT_PROJECT_RULES.md §1 */}
          <article className={styles.product}>
            <div className={styles.shell}>
              <p className={styles.eyebrow}>事業 01</p>
              <div className={styles.productHead}>
                <div>
                  <h2 className={styles.productName}>Mirai Move</h2>
                  <p className={styles.productDomain}>日本のモビリティ領域 ／ miraimove.com</p>
                </div>
                <span className={styles.stage}>
                  <i className={styles.dot} aria-hidden="true" />
                  公開サイト稼働中・プラットフォーム開発中
                </span>
              </div>
              <p className={styles.productLine}>
                日本のモビリティ領域における、情報・マッチング・事業開発のためのプラットフォーム。
              </p>
              <p className={styles.productBody}>
                行政・自治体、企業、介護／福祉／地域の現場、海外サプライヤー、国内パートナーをつなぎ、
                移動に関する選択肢と機会を一つの流れとして扱うことを目指したプラットフォームです。
                現在は基盤とアーキテクチャの整備段階にあり、公開サイトのみが稼働しています。
              </p>
              <p className={styles.boundary}>
                開発状況について：プラットフォーム本体は開発中です。自律エージェントによる自動実行は
                有効化していません。外部への働きかけを伴う操作は、人の確認を前提とした設計としています。
              </p>
              <RouteDiagram
                label="Mirai Move の対象領域を示す図"
                nodes={["行政・自治体", "企業", "地域の現場", "パートナー"]}
              />
            </div>
          </article>

          {/* Kakari — every claim from kakari/PROJECT_START_HERE.md + AGENT_PROJECT_RULES.md §1 */}
          <article className={styles.product}>
            <div className={styles.shell}>
              <p className={styles.eyebrow}>事業 02</p>
              <div className={styles.productHead}>
                <div>
                  <h2 className={styles.productName}>Kakari</h2>
                  <p className={styles.productDomain}>行政手続き・書類 ／ 多言語</p>
                </div>
                <span className={styles.stage}>
                  <i className={styles.dot} aria-hidden="true" />
                  開発中・一般公開前
                </span>
              </div>
              <p className={styles.productLine}>
                日本で暮らす人・事業を始める人のための、多言語の行政手続き・書類サポート。
              </p>
              <p className={styles.productBody}>
                日本語や専門知識の壁があると、本来使えるはずの制度にたどり着けません。Kakariは、
                必要な情報の提示、書類の準備、フォームの作成、提出・郵送の手順案内までを多言語で支援します。
                現在は開発段階であり、一般公開はしていません。
              </p>
              <p className={styles.boundary}>
                専門家との境界について：Kakariは、弁護士・税理士・行政書士などの有資格者の代理を行いません。
                法務・税務・公的な判断が必要な領域は、専門家におつなぎします。
              </p>
              <RouteDiagram
                label="Kakari の支援範囲を示す図"
                nodes={["調べる", "書類をそろえる", "作成する", "提出する"]}
              />
            </div>
          </article>
        </section>

        {/* 5 — Future products */}
        <section className={styles.section}>
          <div className={styles.shell}>
            <p className={styles.eyebrow}>これから</p>
            <h2 className={styles.h2}>次のよりそいを、順番につくる。</h2>
            <p className={styles.body}>
              領域は違っても、扱っている問題は同じです。制度や仕組みの側が複雑で、人が前に進めない。
              その距離を縮めるプロダクトを、ひとつずつ増やしていきます。
            </p>
            <p className={styles.body}>
              新しい事業は、公開できる段階になってからこのページに掲載します。
            </p>
          </div>
        </section>

        {/* 6 — Company. Registration source is missing; nothing legal is asserted here. */}
        <section className={styles.section} id="company">
          <div className={styles.shell}>
            <p className={styles.eyebrow}>会社情報</p>
            <h2 className={styles.h2}>会社情報</h2>
            <div className={styles.pending}>
              <p className={styles.pendingNote}>
                正式な会社情報は、確認済みの登録情報に基づき公開します。
              </p>
              <ul className={styles.pendingList}>
                <li>商号</li>
                <li>本店所在地</li>
                <li>設立年月日</li>
                <li>代表者</li>
                <li>法人番号</li>
                <li>事業目的</li>
                <li>お問い合わせ先</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <div className={styles.footerGrid}>
            <div>
              <p className={styles.footerColTitle}>Yorisou</p>
              <p className={styles.beatBody}>人と社会のあいだに、次のよりそいをつくる。</p>
            </div>
            <div>
              <p className={styles.footerColTitle}>事業</p>
              <ul className={styles.footerList}>
                <li>
                  <a className={styles.footerLink} href="#portfolio">
                    Mirai Move
                  </a>
                </li>
                <li>
                  <a className={styles.footerLink} href="#portfolio">
                    Kakari
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className={styles.footerColTitle}>会社</p>
              <ul className={styles.footerList}>
                <li>
                  <a className={styles.footerLink} href="#company">
                    会社情報
                  </a>
                </li>
                <li className={styles.footerItem}>お問い合わせ（準備中）</li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBase}>
            <span className={styles.previewBadge}>Preview — not published</span>
            <span>
              社名・所在地・設立・代表者・法人番号は、登録情報の確認後に掲載します。
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
