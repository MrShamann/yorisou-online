import type { Metadata } from "next";

/**
 * CORP-v1.4 — the archived English consumer surface is marked noindex.
 *
 * WHAT `/en` IS, AND WHAT IT IS NOT.
 *
 * `/en` and its twenty-three children are the CONSUMER PRODUCT in English — the life-state check,
 * its results, its auth and its support pages, from early 2026. They are not an old corporate site
 * and they are not a locale of the corporate site: the corporate English is `/?lang=en`, served by
 * the same components and the same copy as every other language.
 *
 * They are deliberately NOT redirected. People hold links to these pages, the auth and result
 * routes are load-bearing for the live product, and redirecting them into the corporate site would
 * break the consumer product to tidy up a naming collision.
 *
 * WHAT WAS ACTUALLY WRONG. Every one of these pages was crawl-blocked by robots.txt's blanket
 * `Disallow: /` and NONE of them emitted an index directive. robots.txt controls crawling, not
 * indexing — a blocked URL can still be indexed from an external link, and a crawler forbidden to
 * fetch the page never sees a `noindex` on it either. So an inbound link could put
 * "About Yorisou | Life-State Understanding and Gentle Recommendations" into a search result as the
 * company's English about page, which is a description of a product, from a period before the
 * company was described this way at all.
 *
 * A rendered directive is the only mechanism that answers indexing, and it is what this adds. The
 * pages keep working exactly as they do now for anyone who visits them.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function EnglishConsumerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
