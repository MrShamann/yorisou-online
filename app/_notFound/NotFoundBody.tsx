import Shell, { ROUTES } from "@/app/_corporate/p5r2/Shell";
import { Eyebrow, TextLink } from "@/app/_corporate/p5r2/pieces";
import styles from "@/app/_corporate/p5r2/site.module.css";
import { getCopy } from "@/app/_corporate/i18n";
import { DEFAULT_LOCALE } from "@/app/_corporate/i18n/locales";

/**
 * CORP-P4AR2 — the ONE 404 body, shared by both 404 entry points.
 *
 * There are two entry points because Next.js uses two, not because we want two:
 *   - `app/global-not-found.tsx` renders the 404 as its own document, outside the root layout. This
 *     is the normal path and the one that structurally prevents consumer chrome on a 404.
 *   - `app/not-found.tsx` is still consulted on the internal-error path taken by dynamically
 *     rendered routes that call `notFound()` (see the measured `NoFallbackError` cases in
 *     docs/yorisou/corporate/CORP_P4AR2_DYNAMIC_404_AND_ROBOTS_REMEDIATION.md). Without it those
 *     responses fall back to the ROOT layout's metadata and advertise the archived consumer
 *     product's title on a 404.
 *
 * Both render this component and nothing else, so the two cannot drift apart in content. What they
 * legitimately differ on is the document wrapper, which is the whole point of the split.
 */
export const NOT_FOUND_TITLE = "ページが見つかりません — Yorisou 合同会社";

/**
 * CORP-v1.3 — the 404 now renders the CURRENT company, not the one from two refoundations ago.
 *
 * It was still built from the `prototype/corporate` shell, which is frozen evidence of the pre-v1.2
 * site. A visitor who mistyped a URL therefore met a different company from the one on every other
 * page: the old text wordmark instead of the logo, a five-item nav with no Ventures, no How we
 * build and no Build with us, the retired consumer tagline 「人と社会のあいだに、次のよりそいをつくる。」,
 * and a footer note promising that the trade name, address, representative and corporate number
 * "will be published once the registration is confirmed" — which had stopped being true, because
 * all of them are published, the corporate number included.
 *
 * It now uses the same Shell, copy and brand system as every other corporate page, so it cannot
 * drift again. Japanese only, deliberately: a 404 has no request context to resolve a locale from
 * — `global-not-found` renders outside the root layout, so there is no locale header to read — and
 * guessing one would be worse than the site's own default.
 */
export default async function NotFoundBody() {
  const copy = await getCopy(DEFAULT_LOCALE);
  const links = [
    { href: ROUTES.home, label: copy.chrome.nav.home },
    { href: ROUTES.ventures, label: copy.ventures.eyebrow },
    { href: ROUTES.about, label: copy.foundry.eyebrow },
    { href: ROUTES.buildWithUs, label: copy.buildWithUs.eyebrow },
    { href: ROUTES.company, label: copy.chrome.nav.company },
  ];
  return (
    <Shell copy={copy} locale={DEFAULT_LOCALE} path="/">
      <section className={styles.hero}>
        <div className={styles.heroField} aria-hidden="true" />
        <div className={styles.shell}>
          <Eyebrow>404</Eyebrow>
          <h1 className={styles.h1}>
            <span className={styles.unit}>お探しのページは</span>
            <span className={styles.unit}>見つかりませんでした。</span>
          </h1>
          <p className={`${styles.lead} ${styles.jp}`}>
            アドレスが変更されたか、削除された可能性があります。
          </p>
          <ul className={styles.footerList} style={{ marginTop: 26 }}>
            {links.map((l) => (
              <li key={l.href}>
                <TextLink href={l.href}>{l.label}</TextLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Shell>
  );
}
